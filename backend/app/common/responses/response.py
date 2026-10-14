from typing import Any, Generic, TypeVar

from pydantic import BaseModel


T = TypeVar("T")


class ApiResponse(BaseModel, Generic[T]):
    success: bool
    message: str
    data: T | None = None


class ApiErrorResponse(BaseModel):
    success: bool
    message: str
    error_code: str
    data: Any | None = None