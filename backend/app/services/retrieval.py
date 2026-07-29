import asyncio
import uuid
from collections.abc import Sequence
from typing import Any

from fastapi import HTTPException, status
from openai import AsyncOpenAI
from pinecone import Pinecone, ServerlessSpec

from app.core.config import Settings, get_settings
from app.db.models.document import Document, DocumentChunk, DocumentType
from app.schemas.retrieval import RetrievalMatch


class RetrievalService:
    def __init__(self, settings: Settings) -> None:
        openai_key = (
            settings.openai_api_key.get_secret_value().strip()
            if settings.openai_api_key is not None
            else ""
        )
        pinecone_key = (
            settings.pinecone_api_key.get_secret_value().strip()
            if settings.pinecone_api_key is not None
            else ""
        )
        if not openai_key or not pinecone_key:
            raise HTTPException(
                status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                detail="OpenAI and Pinecone credentials are required for semantic retrieval.",
            )
        self.settings = settings
        self.openai = AsyncOpenAI(api_key=openai_key)
        self.pinecone = Pinecone(api_key=pinecone_key)

    async def _embed(self, texts: list[str]) -> list[list[float]]:
        vectors = []
        for start in range(0, len(texts), self.settings.embedding_batch_size):
            response = await self.openai.embeddings.create(
                model=self.settings.openai_embedding_model,
                input=texts[start : start + self.settings.embedding_batch_size],
                dimensions=self.settings.embedding_dimension,
            )
            vectors.extend(item.embedding for item in response.data)
        return vectors

    async def _index(self) -> Any:
        names = await asyncio.to_thread(self.pinecone.list_indexes)
        if self.settings.pinecone_index_name in names.names():
            description = await asyncio.to_thread(
                self.pinecone.describe_index,
                name=self.settings.pinecone_index_name,
            )
            if (
                description.dimension != self.settings.embedding_dimension
                or description.metric != "cosine"
            ):
                raise HTTPException(
                    status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                    detail=(
                        "The Pinecone index configuration does not match the "
                        "embedding dimension and cosine metric."
                    ),
                )
        else:
            await asyncio.to_thread(
                self.pinecone.create_index,
                name=self.settings.pinecone_index_name,
                dimension=self.settings.embedding_dimension,
                metric="cosine",
                spec=ServerlessSpec(
                    cloud=self.settings.pinecone_cloud,
                    region=self.settings.pinecone_region,
                ),
            )
        return self.pinecone.Index(self.settings.pinecone_index_name)

    async def index_document(
        self, document: Document, chunks: Sequence[DocumentChunk]
    ) -> int:
        if not chunks:
            return 0
        vectors = await self._embed([chunk.content for chunk in chunks])
        records = [
            {
                "id": str(chunk.id),
                "values": vector,
                "metadata": {
                    "chunk_id": str(chunk.id),
                    "document_id": str(document.id),
                    "interview_session_id": (
                        str(document.interview_session_id)
                        if document.interview_session_id is not None
                        else ""
                    ),
                    "document_type": document.document_type.value,
                    "section": chunk.section or "",
                    "sequence": chunk.sequence,
                    "content": chunk.content,
                },
            }
            for chunk, vector in zip(chunks, vectors, strict=True)
        ]
        index = await self._index()
        batch_size = self.settings.pinecone_upsert_batch_size
        for start in range(0, len(records), batch_size):
            await asyncio.to_thread(
                index.upsert,
                vectors=records[start : start + batch_size],
                namespace=self.settings.pinecone_namespace,
            )
        return len(records)

    async def search(
        self,
        *,
        query: str,
        interview_session_id: uuid.UUID | None,
        document_types: list[DocumentType] | None,
        top_k: int,
    ) -> list[RetrievalMatch]:
        filters: list[dict[str, Any]] = []
        if interview_session_id is not None:
            filters.append({"interview_session_id": {"$eq": str(interview_session_id)}})
        if document_types:
            filters.append({"document_type": {"$in": [item.value for item in document_types]}})
        metadata_filter = (
            {"$and": filters} if len(filters) > 1 else (filters[0] if filters else None)
        )

        query_vector = (await self._embed([query]))[0]
        index = await self._index()
        result = await asyncio.to_thread(
            index.query,
            vector=query_vector,
            top_k=top_k,
            include_metadata=True,
            namespace=self.settings.pinecone_namespace,
            filter=metadata_filter,
        )
        matches = []
        for match in result.matches:
            metadata = match.metadata or {}
            matches.append(
                RetrievalMatch(
                    chunk_id=uuid.UUID(metadata["chunk_id"]),
                    document_id=uuid.UUID(metadata["document_id"]),
                    document_type=DocumentType(metadata["document_type"]),
                    score=float(match.score),
                    content=metadata["content"],
                    section=metadata.get("section") or None,
                    sequence=int(metadata["sequence"]),
                )
            )
        return matches


def get_retrieval_service() -> RetrievalService:
    return RetrievalService(get_settings())
