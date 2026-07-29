import uuid
from datetime import datetime

from pydantic import BaseModel, ConfigDict

from app.db.models.document import DocumentStatus, DocumentType


class DocumentChunkResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    sequence: int
    section: str | None
    content: str
    start_character: int
    end_character: int
    token_estimate: int


class DocumentResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    interview_session_id: uuid.UUID | None
    document_type: DocumentType
    status: DocumentStatus
    original_filename: str
    content_type: str
    sha256: str
    character_count: int
    document_metadata: dict
    created_at: datetime
    chunk_count: int


class DocumentDetailResponse(DocumentResponse):
    chunks: list[DocumentChunkResponse]
