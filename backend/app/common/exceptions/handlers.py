from fastapi import Request
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse

from app.common.exceptions.app_exceptions import AppException
from app.common.logging.logger import get_logger
from app.common.responses.response import ApiErrorResponse


logger = get_logger(__name__)


async def app_exception_handler(
    request: Request,
    exc: AppException,
) -> JSONResponse:
    logger.warning(
        "Application error | method=%s | path=%s | message=%s",
        request.method,
        request.url.path,
        exc.message,
    )

    return JSONResponse(
        status_code=exc.status_code,
        content=ApiErrorResponse(
            success=False,
            message=exc.message,
            error_code=exc.error_code,
        ).model_dump(),
    )


async def validation_exception_handler(
    request: Request,
    exc: RequestValidationError,
) -> JSONResponse:
    logger.warning(
        "Validation error | method=%s | path=%s",
        request.method,
        request.url.path,
    )

    return JSONResponse(
        status_code=422,
        content=ApiErrorResponse(
            success=False,
            message="Invalid request.",
            error_code="VALIDATION_ERROR",
        ).model_dump(),
    )


async def unexpected_exception_handler(
    request: Request,
    exc: Exception,
) -> JSONResponse:
    logger.exception(
        "Unhandled exception | method=%s | path=%s",
        request.method,
        request.url.path,
    )

    return JSONResponse(
        status_code=500,
        content=ApiErrorResponse(
            success=False,
            message="An unexpected error occurred.",
            error_code="INTERNAL_SERVER_ERROR",
        ).model_dump(),
    )