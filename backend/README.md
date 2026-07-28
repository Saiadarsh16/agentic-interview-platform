# FastAPI backend

This service is the API foundation for the Agentic Interview Platform. The
current milestone includes local PostgreSQL persistence and Redis connectivity.
It intentionally contains no LLM or vector-database calls yet.

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
