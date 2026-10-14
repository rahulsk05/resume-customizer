from datetime import datetime
from typing import Any

from sqlalchemy import DateTime, ForeignKey, Text, func
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import Mapped, mapped_column

from app.database.base import Base


class ResumeContent(Base):
    __tablename__ = "resume_contents"

    id: Mapped[int] = mapped_column(
        primary_key=True,
    )

    resume_profile_id: Mapped[int] = mapped_column(
        ForeignKey("resume_profiles.id", ondelete="CASCADE"),
        nullable=False,
        unique=True,
        index=True,
    )

    raw_text: Mapped[str] = mapped_column(
        Text,
        nullable=False,
    )

    structured_content: Mapped[dict[str, Any]] = mapped_column(
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