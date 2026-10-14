from datetime import datetime, timedelta, timezone

import jwt
from jwt import InvalidTokenError

from app.common.exceptions.app_exceptions import UnauthorizedException
from app.config.settings import get_settings


settings = get_settings()

ALGORITHM = "HS256"


def create_access_token(user_id: int) -> str:
    now = datetime.now(timezone.utc)
    expires_at = now + timedelta(
        minutes=settings.jwt_expires_in_minutes
    )

    payload = {
        "sub": str(user_id),
        "exp": expires_at,
    }

    return jwt.encode(
        payload,
        settings.jwt_secret,
        algorithm=ALGORITHM,
    )


def decode_access_token(token: str) -> int:
    try:
        payload = jwt.decode(
            token,
            settings.jwt_secret,
            algorithms=[ALGORITHM],
        )
    except InvalidTokenError as exc:
        raise UnauthorizedException(
            message="Invalid or expired authentication token.",
            error_code="INVALID_ACCESS_TOKEN",
        ) from exc

    try:
        return int(payload["sub"])
    except (KeyError, TypeError, ValueError) as exc:
        raise UnauthorizedException(
            message="Invalid authentication token.",
            error_code="INVALID_ACCESS_TOKEN",
        ) from exc