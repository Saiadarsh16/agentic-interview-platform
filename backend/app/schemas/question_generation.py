import uuid
from enum import StrEnum

from pydantic import BaseModel, Field, model_validator

from app.db.models.document import DocumentType


class QuestionType(StrEnum):
    technical = "technical"
    system_design = "system_design"
    behavioural = "behavioural"
    scenario = "scenario"


class QuestionDecision(StrEnum):
    accepted = "accepted"
    rewritten = "rewritten"


class EvidenceReference(BaseModel):
    document_id: uuid.UUID
    chunk_id: uuid.UUID
    document_type: DocumentType
    excerpt: str = Field(min_length=1, max_length=500)
    relevance: str = Field(min_length=1, max_length=300)


class Competency(BaseModel):
    name: str = Field(min_length=2, max_length=120)
    priority: int = Field(ge=1, le=5)
    jd_requirement: str = Field(min_length=1, max_length=500)
    resume_evidence: str | None = Field(default=None, max_length=500)


class AlignmentScore(BaseModel):
    resume_alignment: int = Field(ge=0, le=100)
    jd_alignment: int = Field(ge=0, le=100)
    role_alignment: int = Field(ge=0, le=100)
    specificity: int = Field(ge=0, le=100)
    answerability: int = Field(ge=0, le=100)
    total: int = Field(ge=0, le=100)


class GeneratedQuestion(BaseModel):
    question: str = Field(min_length=10, max_length=1000)
    competency: str = Field(min_length=2, max_length=120)
    question_type: QuestionType
    difficulty: str = Field(min_length=2, max_length=40)
    rationale: str = Field(min_length=1, max_length=800)
    evidence: list[EvidenceReference] = Field(min_length=1)
    score: AlignmentScore
    decision: QuestionDecision


class QuestionGenerationRequest(BaseModel):
    question_count: int = Field(default=10, ge=1, le=20)
    focus_areas: list[str] = Field(default_factory=list, max_length=10)

    @model_validator(mode="after")
    def normalise_focus_areas(self) -> "QuestionGenerationRequest":
        self.focus_areas = list(
            dict.fromkeys(area.strip() for area in self.focus_areas if area.strip())
        )
        return self


class QuestionGenerationResponse(BaseModel):
    interview_session_id: uuid.UUID
    job_role: str
    competencies: list[Competency]
    questions: list[GeneratedQuestion]
    rejected_count: int
    generation_attempts: int
