# Agentic Interview Platform

An agentic AI platform for personalised, adaptive mock interviews using LangGraph, RAG, FastAPI, and React.

## Project status

The project is being built collaboratively, one explicitly approved decision at a time.

Current foundation:

- Public monorepo
- React + TypeScript + Vite frontend
- Warm Editorial Coach visual direction
- FastAPI backend foundation
- Architecture decisions recorded in [`docs/DECISION_LOG.md`](docs/DECISION_LOG.md)

## Repository structure

```text
agentic-interview-platform/
├── frontend/        # React + TypeScript + Vite web application
├── backend/         # FastAPI API; LangGraph integrations follow
├── infrastructure/  # Docker, Terraform, EKS configuration (planned)
├── docs/            # Architecture and decision records
└── tests/           # Cross-service and end-to-end tests (planned)
```

## Frontend

```bash
cd frontend
npm install
npm run dev
```

## Backend

```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -e ".[dev]"
uvicorn app.main:app --reload
```

See [`backend/README.md`](backend/README.md) for Windows activation and validation
instructions.

No API keys or personal resume/JD files should be committed to this repository.
