from datetime import datetime
from typing import Literal

from pydantic import BaseModel, ConfigDict, Field

from app.modules.resume_management.schemas.resume_content_schema import ResumeStructuredContent


class AnalysisFeedback(BaseModel):
    model_config = ConfigDict(extra="forbid")

    overall: str = Field(min_length=1)
    strengths: list[str] = Field(default_factory=list)
    gaps: list[str] = Field(default_factory=list)


class AnalysisSuggestion(BaseModel):
    model_config = ConfigDict(extra="forbid")

    type: str = Field(min_length=1)
    priority: str = Field(min_length=1)
    text: str = Field(min_length=1)


class ResumeChange(BaseModel):
    model_config = ConfigDict(extra="forbid")

    section: str = Field(min_length=1)
    source: str = Field(min_length=1)
    change_type: Literal["modified", "removed", "reordered"]
    original: str | None = None
    tailored: str | None = None
    reason: str = Field(min_length=1)


class AnalysisResult(BaseModel):
    model_config = ConfigDict(extra="forbid")

    job_role: str | None = None
    match_score: int = Field(ge=0, le=100)
    feedback: AnalysisFeedback
    suggestions: list[AnalysisSuggestion] = Field(default_factory=list)
    tailored_resume: ResumeStructuredContent
    changes: list[ResumeChange] = Field(default_factory=list)

class AnalysisResultResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    job_application_id: int
    match_score: int = Field(ge=0, le=100)
    feedback: AnalysisFeedback
    suggestions: list[AnalysisSuggestion]
    tailored_resume: ResumeStructuredContent
    changes: list[ResumeChange]
    created_at: datetime
    updated_at: datetime