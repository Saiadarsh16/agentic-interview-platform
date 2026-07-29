# FastAPI backend

This service is the API foundation for the Agentic Interview Platform. It includes
PostgreSQL persistence, Redis connectivity, document ingestion, OpenAI embeddings,
Pinecone retrieval, grounded LangGraph question generation, a persistent live
interview workflow, and evidence-grounded answer evaluation with coaching reports.

## Requirements

- Python 3.11+
- Docker Desktop
- OpenAI API key
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
them, but provider-backed endpoints return `503` until the keys are configured.

Open:

- API documentation: <http://localhost:8000/docs>
- Liveness: <http://localhost:8000/api/v1/health/live>
- Readiness: <http://localhost:8000/api/v1/health/ready>
- Interview sessions: <http://localhost:8000/api/v1/interview-sessions>
- Documents: <http://localhost:8000/api/v1/documents>
- Retrieval: <http://localhost:8000/api/v1/retrieval/search>
- Question generation:
  `POST /api/v1/interview-sessions/{session_id}/questions/generate`
- Live interview:
  `POST /api/v1/interview-sessions/{session_id}/live/start`
  and `GET /api/v1/interview-sessions/{session_id}/live`
- Feedback:
  `POST /api/v1/interview-sessions/{session_id}/feedback/generate`
  and `GET /api/v1/interview-sessions/{session_id}/feedback`

The live workflow persists the ordered questions, current position, answers,
follow-ups, skips and timestamps. It supports answer, skip, pause, resume and
complete actions. Follow-ups are bounded by `LIVE_INTERVIEW_MAX_FOLLOW_UPS`.

Final feedback uses separate technical and behavioural rubrics and persists
per-answer dimensions, competency scores, strengths, gaps, unsupported claims,
improved answers and next steps. Generating the same report is idempotent unless
explicit regeneration is requested.

## Validate

```bash
pytest
ruff check .
```

Tests replace external providers with fakes, so they do not require credentials
or make billable OpenAI or Pinecone calls. RAGAS evaluation remains a later
milestone. AWS EKS remains a deployment-stage milestone.
