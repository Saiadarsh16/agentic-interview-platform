"""Create answer evaluations and interview feedback reports.

Revision ID: 20260729_0004
Revises: 20260729_0003
"""

import sqlalchemy as sa
from alembic import op

revision = "20260729_0004"
down_revision = "20260729_0003"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        "answer_evaluations",
        sa.Column("id", sa.Uuid(), nullable=False),
        sa.Column("interview_session_id", sa.Uuid(), nullable=False),
        sa.Column("question_id", sa.Uuid(), nullable=False),
        sa.Column("answer_id", sa.Uuid(), nullable=False),
        sa.Column("rubric_type", sa.String(length=30), nullable=False),
        sa.Column("correctness", sa.Integer(), nullable=False),
        sa.Column("relevance", sa.Integer(), nullable=False),
        sa.Column("depth", sa.Integer(), nullable=False),
        sa.Column("clarity", sa.Integer(), nullable=False),
        sa.Column("grounding", sa.Integer(), nullable=False),
        sa.Column("overall_score", sa.Float(), nullable=False),
        sa.Column("strengths", sa.JSON(), nullable=False),
        sa.Column("gaps", sa.JSON(), nullable=False),
        sa.Column("unsupported_claims", sa.JSON(), nullable=False),
        sa.Column("improved_answer", sa.Text(), nullable=False),
        sa.Column("evidence", sa.JSON(), nullable=False),
        sa.Column("evaluator_model", sa.String(length=120), nullable=False),
        sa.Column("rubric_version", sa.String(length=40), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
        sa.ForeignKeyConstraint(
            ["interview_session_id"], ["interview_sessions.id"], ondelete="CASCADE"
        ),
        sa.ForeignKeyConstraint(["question_id"], ["interview_questions.id"], ondelete="CASCADE"),
        sa.ForeignKeyConstraint(["answer_id"], ["interview_answers.id"], ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("answer_id", name="uq_answer_evaluations_answer_id"),
    )
    op.create_index(
        "ix_answer_evaluations_interview_session_id",
        "answer_evaluations",
        ["interview_session_id"],
    )
    op.create_index("ix_answer_evaluations_question_id", "answer_evaluations", ["question_id"])
    op.create_index("ix_answer_evaluations_answer_id", "answer_evaluations", ["answer_id"])

    op.create_table(
        "interview_feedback_reports",
        sa.Column("id", sa.Uuid(), nullable=False),
        sa.Column("interview_session_id", sa.Uuid(), nullable=False),
        sa.Column("status", sa.String(length=20), nullable=False),
        sa.Column("overall_score", sa.Float(), nullable=False),
        sa.Column("competency_scores", sa.JSON(), nullable=False),
        sa.Column("strengths", sa.JSON(), nullable=False),
        sa.Column("improvement_areas", sa.JSON(), nullable=False),
        sa.Column("summary", sa.Text(), nullable=False),
        sa.Column("next_steps", sa.JSON(), nullable=False),
        sa.Column("answered_questions", sa.Integer(), nullable=False),
        sa.Column("skipped_questions", sa.Integer(), nullable=False),
        sa.Column("evaluator_model", sa.String(length=120), nullable=False),
        sa.Column("rubric_version", sa.String(length=40), nullable=False),
        sa.Column("generated_at", sa.DateTime(timezone=True), nullable=False),
        sa.ForeignKeyConstraint(
            ["interview_session_id"], ["interview_sessions.id"], ondelete="CASCADE"
        ),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("interview_session_id", name="uq_feedback_report_session"),
    )
    op.create_index(
        "ix_interview_feedback_reports_interview_session_id",
        "interview_feedback_reports",
        ["interview_session_id"],
    )


def downgrade() -> None:
    op.drop_table("interview_feedback_reports")
    op.drop_table("answer_evaluations")
