import io
import pytest
from unittest.mock import patch, MagicMock
from analyzer import extract_text_from_pdf, build_prompt, parse_openai_response


def test_extract_text_from_pdf_returns_string():
    mock_page = MagicMock()
    mock_page.extract_text.return_value = "Software Engineer Python Django"
    mock_pdf = MagicMock()
    mock_pdf.pages = [mock_page]
    mock_pdf.__enter__ = lambda s: s
    mock_pdf.__exit__ = MagicMock(return_value=False)

    with patch("analyzer.pdfplumber.open", return_value=mock_pdf):
        result = extract_text_from_pdf(b"fake-pdf-bytes")

    assert result == "Software Engineer Python Django"


def test_build_prompt_contains_resume_and_jd():
    prompt = build_prompt("resume text here", "job description here")
    assert "resume text here" in prompt
    assert "job description here" in prompt
    assert "score" in prompt.lower()


def test_parse_openai_response_valid():
    raw = '{"score": 72, "missing_keywords": ["Docker", "AWS"], "suggestions": ["Add Docker experience"]}'
    result = parse_openai_response(raw)
    assert result.score == 72
    assert "Docker" in result.missing_keywords
    assert len(result.suggestions) == 1


def test_parse_openai_response_extracts_json_from_markdown():
    raw = '```json\n{"score": 60, "missing_keywords": ["Kubernetes"], "suggestions": ["Add K8s"]}\n```'
    result = parse_openai_response(raw)
    assert result.score == 60


def test_parse_openai_response_handles_trailing_text():
    raw = '```json\n{"score": 55, "missing_keywords": ["Go"], "suggestions": ["Learn Go"]}\n```\nHere is my analysis.'
    result = parse_openai_response(raw)
    assert result.score == 55


from fastapi.testclient import TestClient
from main import app


def test_analyze_endpoint_returns_422_without_file():
    client = TestClient(app)
    response = client.post("/analyze", data={"job_description": "Python developer"})
    assert response.status_code == 422  # FastAPI validation error


def test_analyze_endpoint_returns_200_with_mock(tmp_path):
    import io
    from unittest.mock import patch
    from models import AnalyzeResponse

    mock_result = AnalyzeResponse(score=80, missing_keywords=["Docker"], suggestions=["Add Docker"])

    with patch("main.analyze_resume", return_value=mock_result):
        client = TestClient(app)
        fake_pdf = io.BytesIO(b"fake pdf content")
        response = client.post(
            "/analyze",
            files={"resume": ("test.pdf", fake_pdf, "application/pdf")},
            data={"job_description": "Python developer needing Docker"},
        )

    assert response.status_code == 200
    body = response.json()
    assert body["score"] == 80
    assert "Docker" in body["missing_keywords"]
