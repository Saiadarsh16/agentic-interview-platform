import uuid
from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.core.config import get_settings
from app.db.models.document import Document
from app.db.session import get_db
from app.schemas.retrieval import (
    IndexDocumentResponse,
    RetrievalSearchRequest,
    RetrievalSearchResponse,
)
from app.services.retrieval import RetrievalService, get_retrieval_service

router = APIRouter()
DatabaseSession = Annotated[AsyncSession, Depends(get_db)]
SemanticRetrieval = Annotated[RetrievalService, Depends(get_retrieval_service)]


@router.post("/documents/{document_id}/index", response_model=IndexDocumentResponse)
async def index_document(
    document_id: uuid.UUID,
    db: DatabaseSession,
    retrieval: SemanticRetrieval,
) -> IndexDocumentResponse:
    document = await db.scalar(
        select(Document)
        .options(selectinload(Document.chunks))
        .where(Document.id == document_id)
    )
    if document is None:
        raise HTTPException(status_code=404, detail="Document not found.")
    indexed_chunks = await retrieval.index_document(document, document.chunks)
    settings = get_settings()
    return IndexDocumentResponse(
        document_id=document.id,
        indexed_chunks=indexed_chunks,
        index_name=settings.pinecone_index_name,
        namespace=settings.pinecone_namespace,
    )


@router.post("/search", response_model=RetrievalSearchResponse)
async def search_documents(
    request: RetrievalSearchRequest,
    retrieval: SemanticRetrieval,
) -> RetrievalSearchResponse:
    matches = await retrieval.search(
        query=request.query,
        interview_session_id=request.interview_session_id,
        document_types=request.document_types,
        top_k=request.top_k,
    )
    return RetrievalSearchResponse(query=request.query, matches=matches)
