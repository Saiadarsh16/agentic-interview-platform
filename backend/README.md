# FastAPI backend

This service is the API foundation for the Agentic Interview Platform. The
current milestone intentionally contains no LLM, vector database, database, or
Redis calls.

## Requirements

- Python 3.11+

## Run locally

```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -e ".[dev]"
cp .env.example .env
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

## Validate

```bash
pytest
ruff check .
```

## Next integrations

PostgreSQL and Redis will be added with local Docker services before LangGraph,
OpenAI, Pinecone, and RAGAS are connected. AWS EKS remains a deployment-stage
milestone.
