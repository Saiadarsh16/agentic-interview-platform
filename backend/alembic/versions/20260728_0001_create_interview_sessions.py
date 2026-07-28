"""Create interview sessions.

Revision ID: 20260728_0001
Revises:
"""

import sqlalchemy as sa

from alembic import op

revision = "20260728_0001"
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    status = sa.Enum("planned", "in_progress", "completed", name="interview_status")
    op.create_table(
        "interview_sessions",
        sa.Column("id", sa.Uuid(), nullable=False),
        sa.Column("job_role", sa.String(length=160), nullable=False),
        sa.Column("company", sa.String(length=160), nullable=True),
        sa.Column("interview_type", sa.String(length=80), nullable=False),
        sa.Column("difficulty", sa.String(length=40), nullable=False),
        sa.Column("duration_minutes", sa.Integer(), nullable=False),
        sa.Column("status", status, nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False),
        sa.PrimaryKeyConstraint("id"),
    )


def downgrade() -> None:
    op.drop_table("interview_sessions")
    sa.Enum(name="interview_status").drop(op.get_bind(), checkfirst=True)
