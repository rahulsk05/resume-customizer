from pydantic import BaseModel, Field


class ResumeEmbeddingEntry(BaseModel):
    section: str = Field(min_length=1, max_length=50)
    source: str = Field(min_length=1, max_length=255)
    content: str = Field(min_length=1)