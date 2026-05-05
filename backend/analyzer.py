import io
import json
import re
import pdfplumber
from openai import OpenAI
from models import AnalyzeResponse


def extract_text_from_pdf(pdf_bytes: bytes) -> str:
    with pdfplumber.open(io.BytesIO(pdf_bytes)) as pdf:
        pages = [page.extract_text() or "" for page in pdf.pages]
    return "\n".join(pages)


def build_prompt(resume_text: str, job_description: str) -> str:
    return f"""You are an expert resume reviewer.

Resume:
{resume_text}

Job Description:
{job_description}

Analyze the resume against the job description and respond with ONLY valid JSON in this exact format:
{{
  "score": <integer 0-100 representing match percentage>,
  "missing_keywords": [<list of important keywords from the JD missing in the resume>],
  "suggestions": [<list of 3-5 specific, actionable improvement suggestions>]
}}"""


def parse_openai_response(raw: str) -> AnalyzeResponse:
    match = re.search(r"\{.*\}", raw, re.DOTALL)
    if not match:
        raise ValueError(f"No JSON object found in response: {raw!r}")
    try:
        data = json.loads(match.group(0))
        return AnalyzeResponse(**data)
    except (json.JSONDecodeError, Exception) as exc:
        raise ValueError(f"Failed to parse OpenAI response: {raw!r}") from exc


def analyze_resume(
    pdf_bytes: bytes,
    job_description: str,
    client=None,
) -> AnalyzeResponse:
    if client is None:
        client = OpenAI()
    resume_text = extract_text_from_pdf(pdf_bytes)
    if not resume_text.strip():
        raise ValueError("No extractable text found in the PDF. It may be image-based or encrypted.")
    prompt = build_prompt(resume_text, job_description)

    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[{"role": "user", "content": prompt}],
        temperature=0.3,
    )

    raw = response.choices[0].message.content
    if raw is None:
        raise ValueError("OpenAI returned an empty response (possible content refusal)")
    return parse_openai_response(raw)
