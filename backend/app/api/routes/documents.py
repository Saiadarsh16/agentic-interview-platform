import uuid
from typing import Annotated

from fastapi import APIRouter, Depends, File, Form, HTTPException, UploadFile, status
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.core.config import get_settings
from app.db.models.document import Document, DocumentChunk, DocumentType
from app.db.models.interview_session import InterviewSession
from app.db.session import get_db
from app.schemas.document import DocumentDetailResponse, DocumentResponse
from app.services.document_ingestion import prepare_document

router = APIRouter()
DatabaseSession = Annotated[AsyncSession, Depends(get_db)]


def _response(document: Document, chunk_count: int) -> DocumentResponse:
    return DocumentResponse.model_validate({**document.__dict__, "chunk_count": chunk_count})


@router.post("", response_model=DocumentResponse, status_code=status.HTTP_201_CREATED)
async def upload_document(
    db: DatabaseSession,
    document_type: Annotated[DocumentType, Form()],
    file: Annotated[UploadFile, File()],
    interview_session_id: Annotated[uuid.UUID | None, Form()] = None,
) -> DocumentResponse:
    if interview_session_id is not None:
        if await db.get(InterviewSession, interview_session_id) is None:
            raise HTTPException(status_code=404, detail="Interview session not found.")
    settings = get_settings()
    prepared = await prepare_document(
        file,
        max_bytes=settings.document_max_bytes,
        chunk_size=settings.document_chunk_size,
        chunk_overlap=settings.document_chunk_overlap,
    )
    document = Document(
        interview_session_id=interview_session_id,
        document_type=document_type,
        original_filename=prepared.filename,
        content_type=prepared.content_type,
        sha256=prepared.sha256,
        extracted_text=prepared.text,
        character_count=len(prepared.text),
        document_metadata=prepared.metadata,
    )
    document.chunks = [
        DocumentChunk(
            sequence=item.sequence,
            section=item.section,
            content=item.content,
            start_character=item.start_character,
            end_character=item.end_character,
            token_estimate=item.token_estimate,
        )
        for item in prepared.chunks
    ]
    db.add(document)
    await db.commit()
    await db.refresh(document)
    return _response(document, len(prepared.chunks))


@router.get("", response_model=list[DocumentResponse])
async def list_documents(
    db: DatabaseSession,
    interview_session_id: uuid.UUID | None = None,
    document_type: DocumentType | None = None,
) -> list[DocumentResponse]:
    statement = (
        select(Document, func.count(DocumentChunk.id))
        .outerjoin(DocumentChunk)
        .group_by(Document.id)
        .order_by(Document.created_at.desc())
    )
    if interview_session_id is not None:
        statement = statement.where(Document.interview_session_id == interview_session_id)
    if document_type is not None:
        statement = statement.where(Document.document_type == document_type)
    rows = (await db.execute(statement)).all()
    return [_response(document, count) for document, count in rows]


@router.get("/{document_id}", response_model=DocumentDetailResponse)
async def get_document(document_id: uuid.UUID, db: DatabaseSession) -> DocumentDetailResponse:
    document = await db.scalar(
        select(Document)
        .options(selectinload(Document.chunks))
        .where(Document.id == document_id)
    )
    if document is None:
        raise HTTPException(status_code=404, detail="Document not found.")
    return DocumentDetailResponse.model_validate(
        {**document.__dict__, "chunk_count": len(document.chunks)}
    )
