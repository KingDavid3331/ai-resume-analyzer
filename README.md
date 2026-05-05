# AI Resume Analyzer

Upload a resume PDF and paste a job description to get an AI-powered match score, missing keywords, and improvement suggestions.

## Features

- PDF resume upload and text extraction
- Match score (0–100) against a job description
- Missing keywords highlighted
- Actionable improvement suggestions powered by GPT-4o-mini

## Tech Stack

- **Frontend:** React 18, Vite, Tailwind CSS
- **Backend:** Python, FastAPI, pdfplumber, OpenAI API

## Getting Started

### Backend

```bash
cd backend
python -m venv venv && source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env  # add your OPENAI_API_KEY
uvicorn main:app --reload
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Open http://localhost:5173

## Running Tests

```bash
cd backend && pytest tests/ -v
```
