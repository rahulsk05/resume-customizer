from io import BytesIO

import fitz
from docx import Document

from app.common.exceptions.app_exceptions import BadRequestException


MAX_FILE_SIZE = 2 * 1024 * 1024

PDF_EXTENSION = ".pdf"
DOCX_EXTENSION = ".docx"

SUPPORTED_EXTENSIONS = {
    PDF_EXTENSION,
    DOCX_EXTENSION,
}


def extract_resume_text(
    file_name: str,
    file_content: bytes,
) -> str:
    extension = _get_extension(file_name)

    _validate_file(extension, file_content)

    if extension == PDF_EXTENSION:
        text = _extract_pdf_text(file_content)
    else:
        text = _extract_docx_text(file_content)

    text = text.strip()

    if not text:
        raise BadRequestException(
            message="The uploaded resume does not contain readable text.",
            error_code="EMPTY_RESUME_CONTENT",
        )

    return text


def _get_extension(file_name: str) -> str:
    extension = file_name.lower().rsplit(".", 1)

    if len(extension) != 2:
        raise BadRequestException(
            message="Only PDF and DOCX resumes are supported.",
            error_code="UNSUPPORTED_FILE_TYPE",
        )

    return f".{extension[1]}"


def _validate_file(
    extension: str,
    file_content: bytes,
) -> None:
    if extension not in SUPPORTED_EXTENSIONS:
        raise BadRequestException(
            message="Only PDF and DOCX resumes are supported.",
            error_code="UNSUPPORTED_FILE_TYPE",
        )

    if not file_content:
        raise BadRequestException(
            message="The uploaded resume is empty.",
            error_code="EMPTY_FILE",
        )

    if len(file_content) > MAX_FILE_SIZE:
        raise BadRequestException(
            message="Resume file size must not exceed 2 MB.",
            error_code="FILE_TOO_LARGE",
        )


def _extract_pdf_text(file_content: bytes) -> str:
    try:
        with fitz.open(
            stream=file_content,
            filetype="pdf",
        ) as document:
            return "\n".join(
                page.get_text()
                for page in document
            )
    except Exception as exc:
        raise BadRequestException(
            message="The uploaded PDF could not be read.",
            error_code="INVALID_PDF",
        ) from exc


def _extract_docx_text(file_content: bytes) -> str:
    try:
        document = Document(BytesIO(file_content))

        paragraphs = [
            paragraph.text
            for paragraph in document.paragraphs
            if paragraph.text.strip()
        ]

        return "\n".join(paragraphs)
    except Exception as exc:
        raise BadRequestException(
            message="The uploaded DOCX file could not be read.",
            error_code="INVALID_DOCX",
        ) from exc