from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field

from app.modules.job_applications.models.job_application_model import (
    JobApplicationStatus,
)


class CreateJobApplicationRequest(BaseModel):
    resume_profile_id: int
    company_name: str = Field(min_length=1, max_length=255)
    job_description: str = Field(min_length=1)


class JobApplicationResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    created_by: int
    resume_profile_id: int
    company_name: str
    job_role: str
    job_description: str
    status: JobApplicationStatus
    error_message: str | None
    match_score: int | None = None
    created_at: datetime
    updated_at: datetime

class PaginatedJobApplicationResponse(BaseModel):
    items: list[JobApplicationResponse]
    page: int
    page_size: int
    total: int
    total_pages: int

class JobApplicationStatusResponse(BaseModel):
    id: int
    status: JobApplicationStatus