import uuid

from pydantic import BaseModel, Field

from app.db.models.document import DocumentType


class IndexDocumentResponse(BaseModel):
    document_id: uuid.UUID
    indexed_chunks: int
    index_name: str
    namespace: str


class RetrievalSearchRequest(BaseModel):
    query: str = Field(min_length=2, max_length=2000)
    interview_session_id: uuid.UUID | None = None
    document_types: list[DocumentType] | None = None
    top_k: int = Field(default=5, ge=1, le=20)


class RetrievalMatch(BaseModel):
    chunk_id: uuid.UUID
    document_id: uuid.UUID
    document_type: DocumentType
    score: float
    content: str
    section: str | None
    sequence: int


class RetrievalSearchResponse(BaseModel):
    query: str
    matches: list[RetrievalMatch]
