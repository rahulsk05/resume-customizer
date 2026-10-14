from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field


class CreateResumeProfileRequest(BaseModel):
    name: str = Field(min_length=1, max_length=150)


class ResumeProfileResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str
    original_file_name: str
    file_size: int
    file_type: str
    created_at: datetime
    updated_at: datetime