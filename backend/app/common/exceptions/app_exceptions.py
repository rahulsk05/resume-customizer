class AppException(Exception):
    """Base exception for application-specific errors."""

    def __init__(
        self,
        message: str,
        status_code: int = 400,
        error_code: str = "APP_ERROR",
    ) -> None:
        self.message = message
        self.status_code = status_code
        self.error_code = error_code

        super().__init__(message)


class BadRequestException(AppException):
    """Raised when the request is invalid."""

    def __init__(
        self,
        message: str = "Invalid request.",
        error_code: str = "BAD_REQUEST",
    ) -> None:
        super().__init__(
            message=message,
            status_code=400,
            error_code=error_code,
        )


class UnauthorizedException(AppException):
    """Raised when authentication is required or invalid."""

    def __init__(
        self,
        message: str = "Authentication required.",
        error_code: str = "UNAUTHORIZED",
    ) -> None:
        super().__init__(
            message=message,
            status_code=401,
            error_code=error_code,
        )


class ForbiddenException(AppException):
    """Raised when the user is not allowed to perform an action."""

    def __init__(
        self,
        message: str = "You are not allowed to perform this action.",
        error_code: str = "FORBIDDEN",
    ) -> None:
        super().__init__(
            message=message,
            status_code=403,
            error_code=error_code,
        )


class NotFoundException(AppException):
    """Raised when a requested resource does not exist."""

    def __init__(
        self,
        message: str = "Resource not found.",
        error_code: str = "NOT_FOUND",
    ) -> None:
        super().__init__(
            message=message,
            status_code=404,
            error_code=error_code,
        )


class ConflictException(AppException):
    """Raised when a request conflicts with existing data."""

    def __init__(
        self,
        message: str = "Resource already exists.",
        error_code: str = "CONFLICT",
    ) -> None:
        super().__init__(
            message=message,
            status_code=409,
            error_code=error_code,
        )

class BadGatewayException(AppException):
    def __init__(
        self,
        message: str,
        error_code: str,
    ) -> None:
        super().__init__(
            status_code=502,
            message=message,
            error_code=error_code,
        )