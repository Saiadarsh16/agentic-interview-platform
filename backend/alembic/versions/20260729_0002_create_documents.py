"""Create documents and document chunks.

Revision ID: 20260729_0002
Revises: 20260728_0001
"""

import sqlalchemy as sa
from alembic import op

revision = "20260729_0002"
down_revision = "20260728_0001"
branch_labels = None
depends_on = None


def upgrade() -> None:
    document_type = sa.Enum("resume", "job_description", name="document_type")
    document_status = sa.Enum("processed", name="document_status")
    op.create_table(
        "documents",
        sa.Column("id", sa.Uuid(), nullable=False),
        sa.Column("interview_session_id", sa.Uuid(), nullable=True),
        sa.Column("document_type", document_type, nullable=False),
        sa.Column("status", document_status, nullable=False),
        sa.Column("original_filename", sa.String(length=255), nullable=False),
        sa.Column("content_type", sa.String(length=120), nullable=False),
        sa.Column("sha256", sa.String(length=64), nullable=False),
        sa.Column("extracted_text", sa.Text(), nullable=False),
        sa.Column("character_count", sa.Integer(), nullable=False),
        sa.Column("document_metadata", sa.JSON(), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
        sa.ForeignKeyConstraint(
            ["interview_session_id"], ["interview_sessions.id"], ondelete="CASCADE"
        ),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index("ix_documents_interview_session_id", "documents", ["interview_session_id"])
    op.create_index("ix_documents_sha256", "documents", ["sha256"])
    op.create_table(
        "document_chunks",
        sa.Column("id", sa.Uuid(), nullable=False),
        sa.Column("document_id", sa.Uuid(), nullable=False),
        sa.Column("sequence", sa.Integer(), nullable=False),
        sa.Column("section", sa.String(length=120), nullable=True),
        sa.Column("content", sa.Text(), nullable=False),
        sa.Column("start_character", sa.Integer(), nullable=False),
        sa.Column("end_character", sa.Integer(), nullable=False),
        sa.Column("token_estimate", sa.Integer(), nullable=False),
        sa.ForeignKeyConstraint(["document_id"], ["documents.id"], ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("document_id", "sequence", name="uq_document_chunk_sequence"),
    )
    op.create_index("ix_document_chunks_document_id", "document_chunks", ["document_id"])


def downgrade() -> None:
    op.drop_table("document_chunks")
    op.drop_table("documents")
    sa.Enum(name="document_status").drop(op.get_bind(), checkfirst=True)
    sa.Enum(name="document_type").drop(op.get_bind(), checkfirst=True)
