# FastAPI backend

This service is the API foundation for the Agentic Interview Platform. The
current milestone includes PostgreSQL persistence, Redis connectivity, document
ingestion, OpenAI embeddings, Pinecone indexing, and semantic retrieval over
resume and job-description chunks.

## Requirements

- Python 3.11+
- Docker Desktop
- OpenAI API key for embeddings
- Pinecone API key

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

Keep actual credentials only in `backend/.env`. The application starts without
them, but retrieval endpoints return `503` until both keys are configured.

Open:

- API documentation: <http://localhost:8000/docs>
- Liveness: <http://localhost:8000/api/v1/health/live>
- Readiness: <http://localhost:8000/api/v1/health/ready>
- Interview sessions: <http://localhost:8000/api/v1/interview-sessions>
- Documents: <http://localhost:8000/api/v1/documents>
- Retrieval: <http://localhost:8000/api/v1/retrieval/search>

Upload a resume or job description first, then index its stored chunks:

```bash
curl -X POST http://localhost:8000/api/v1/retrieval/documents/DOCUMENT_ID/index
```

The first indexing request creates the configured Pinecone serverless index when
it does not already exist. Search can be scoped by interview session and document
type:

```bash
curl -X POST http://localhost:8000/api/v1/retrieval/search \
  -H "Content-Type: application/json" \
  -d '{"query":"LangGraph production experience","document_types":["resume"],"top_k":5}'
```

## Validate

```bash
pytest
ruff check .
```

Tests replace external providers with fakes, so they do not require credentials
or make billable OpenAI or Pinecone calls.

LangGraph question generation and RAGAS evaluation remain later milestones. AWS
EKS remains a deployment-stage milestone.
