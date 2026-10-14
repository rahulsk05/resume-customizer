from fastapi import FastAPI
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware

from app.common.exceptions.app_exceptions import AppException
from app.common.exceptions.handlers import (
    app_exception_handler,
    unexpected_exception_handler,
    validation_exception_handler,
)
from app.common.logging.logger import get_logger
from app.config.settings import get_settings
from app.modules.auth.controllers.auth_controller import router as auth_router
from app.modules.resume_management.controllers.resume_profile_controller import router as resume_profile_router
from app.modules.job_applications.controllers.job_application_controller import router as job_application_router
from app.modules.analysis.controllers.analysis_controller import router as analysis_router


settings = get_settings()

logger = get_logger(__name__)

app = FastAPI(
    title=settings.app_name,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.frontend_url],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.add_exception_handler(
    AppException,
    app_exception_handler,
)

app.add_exception_handler(
    RequestValidationError,
    validation_exception_handler,
)

app.add_exception_handler(
    Exception,
    unexpected_exception_handler,
)


app.include_router(auth_router)

app.include_router(resume_profile_router)

app.include_router(job_application_router)

app.include_router(analysis_router)


@app.get("/health")
async def health_check() -> dict[str, str]:
    logger.info("Health check requested")

    return {
        "status": "ok",
    }