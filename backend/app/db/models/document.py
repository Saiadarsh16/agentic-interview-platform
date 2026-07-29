import uuid
from datetime import UTC, datetime
from enum import StrEnum

from sqlalchemy import JSON, DateTime, Enum, ForeignKey, Integer, String, Text, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.session import Base


class DocumentType(StrEnum):
    resume = "resume"
    job_description = "job_description"


class DocumentStatus(StrEnum):
    processed = "processed"


class Document(Base):
    __tablename__ = "documents"

    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    interview_session_id: Mapped[uuid.UUID | None] = mapped_column(
        ForeignKey("interview_sessions.id", ondelete="CASCADE"), nullable=True, index=True
    )
    document_type: Mapped[DocumentType] = mapped_column(Enum(DocumentType, name="document_type"))
    status: Mapped[DocumentStatus] = mapped_column(
        Enum(DocumentStatus, name="document_status"), default=DocumentStatus.processed
    )
    original_filename: Mapped[str] = mapped_column(String(255))
    content_type: Mapped[str] = mapped_column(String(120))
    sha256: Mapped[str] = mapped_column(String(64), index=True)
    extracted_text: Mapped[str] = mapped_column(Text)
    character_count: Mapped[int] = mapped_column(Integer)
    document_metadata: Mapped[dict] = mapped_column(JSON, default=dict)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=lambda: datetime.now(UTC)
    )
    chunks: Mapped[list["DocumentChunk"]] = relationship(
        back_populates="document", cascade="all, delete-orphan", order_by="DocumentChunk.sequence"
    )


class DocumentChunk(Base):
    __tablename__ = "document_chunks"
    __table_args__ = (
        UniqueConstraint("document_id", "sequence", name="uq_document_chunk_sequence"),
    )

    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    document_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("documents.id", ondelete="CASCADE"), index=True
    )
    sequence: Mapped[int] = mapped_column(Integer)
    section: Mapped[str | None] = mapped_column(String(120), nullable=True)
    content: Mapped[str] = mapped_column(Text)
    start_character: Mapped[int] = mapped_column(Integer)
    end_character: Mapped[int] = mapped_column(Integer)
    token_estimate: Mapped[int] = mapped_column(Integer)
    document: Mapped[Document] = relationship(back_populates="chunks")
