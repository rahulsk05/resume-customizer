from datetime import datetime

from sqlalchemy import DateTime, ForeignKey, Integer, func
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import Mapped, mapped_column

from app.database.base import Base


class AnalysisResult(Base):
    __tablename__ = "analysis_results"

    id: Mapped[int] = mapped_column(
        primary_key=True,
    )

    created_by: Mapped[int] = mapped_column(
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    job_application_id: Mapped[int] = mapped_column(
        ForeignKey("job_applications.id", ondelete="CASCADE"),
        nullable=False,
        unique=True,
        index=True,
    )

    match_score: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
    )

    feedback: Mapped[dict] = mapped_column(
        JSONB,
        nullable=False,
    )

    suggestions: Mapped[list] = mapped_column(
        JSONB,
        nullable=False,
    )

    tailored_resume: Mapped[dict] = mapped_column(
        JSONB,
        nullable=False,
    )

    changes: Mapped[dict] = mapped_column(
        JSONB,
        nullable=False,
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False,
    )

    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
        nullable=False,
    )