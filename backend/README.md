# FastAPI backend

This service is the API foundation for the Agentic Interview Platform. The
current milestone includes local PostgreSQL persistence, Redis connectivity,
and document ingestion for resumes and job descriptions. It intentionally
contains no LLM, embedding, or vector-database calls yet.

## Requirements

- Python 3.11+
- Docker Desktop

## Run locally

```bash
docker compose up -d
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -e ".[dev]"
cp .env.example .env
alembic upgrade head
uvicorn app.main:app --reload
```

On Windows Git Bash, activate the environment with:

```bash
source .venv/Scripts/activate
```

Open:

- API documentation: <http://localhost:8000/docs>
- Liveness: <http://localhost:8000/api/v1/health/live>
- Readiness: <http://localhost:8000/api/v1/health/ready>
- Interview sessions: <http://localhost:8000/api/v1/interview-sessions>
- Documents: <http://localhost:8000/api/v1/documents>

The document endpoint accepts PDF, DOCX, and UTF-8 TXT files up to 5 MB. It
extracts and normalises text, stores metadata, and creates deterministic,
overlapping chunks for the later embedding pipeline.

## Validate

```bash
pytest
ruff check .
```

## Stop local services

```bash
docker compose down
```

LangGraph, OpenAI, Pinecone, and RAGAS remain later milestones. AWS EKS remains
a deployment-stage milestone.
