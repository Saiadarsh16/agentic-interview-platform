import uuid

from fastapi.testclient import TestClient

from app.db.models.document import DocumentType
from app.main import app
from app.schemas.retrieval import RetrievalMatch
from app.services.retrieval import get_retrieval_service


class FakeRetrievalService:
    async def index_document(self, document, chunks) -> int:
        return len(chunks)

    async def search(self, **kwargs) -> list[RetrievalMatch]:
        return [
            RetrievalMatch(
                chunk_id=uuid.uuid4(),
                document_id=uuid.uuid4(),
                document_type=DocumentType.resume,
                score=0.92,
                content="Built LangGraph and RAG systems.",
                section="Experience",
                sequence=0,
            )
        ]


def _upload(client: TestClient) -> str:
    response = client.post(
        "/api/v1/documents",
        data={"document_type": "resume"},
        files={"file": ("resume.txt", b"EXPERIENCE\nBuilt RAG systems.", "text/plain")},
    )
    assert response.status_code == 201
    return response.json()["id"]


def test_index_document_with_fake_provider(client: TestClient) -> None:
    app.dependency_overrides[get_retrieval_service] = lambda: FakeRetrievalService()
    try:
        document_id = _upload(client)
        response = client.post(f"/api/v1/retrieval/documents/{document_id}/index")
        assert response.status_code == 200
        assert response.json()["indexed_chunks"] == 1
    finally:
        app.dependency_overrides.pop(get_retrieval_service, None)


def test_semantic_search_with_fake_provider(client: TestClient) -> None:
    app.dependency_overrides[get_retrieval_service] = lambda: FakeRetrievalService()
    try:
        response = client.post(
            "/api/v1/retrieval/search",
            json={"query": "agent orchestration", "document_types": ["resume"], "top_k": 5},
        )
        assert response.status_code == 200
        assert response.json()["matches"][0]["score"] == 0.92
        assert response.json()["matches"][0]["document_type"] == "resume"
    finally:
        app.dependency_overrides.pop(get_retrieval_service, None)


def test_retrieval_requires_credentials(client: TestClient) -> None:
    response = client.post(
        "/api/v1/retrieval/search",
        json={"query": "Python experience"},
    )
    assert response.status_code == 503
