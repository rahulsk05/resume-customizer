from reportlab.lib.enums import TA_CENTER, TA_JUSTIFY
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.platypus import HRFlowable


class ResumePdfStyles:
    """Defines the visual formatting used by the resume PDF renderer."""

    @staticmethod
    def build() -> dict[str, ParagraphStyle]:
        base_styles = getSampleStyleSheet()

        return {
            "name": ParagraphStyle(
                "ResumeName",
                parent=base_styles["Normal"],
                fontName="Helvetica-Bold",
                fontSize=16,
                leading=19,
                alignment=TA_CENTER,
                spaceAfter=5,
            ),
            "contact": ParagraphStyle(
                "ResumeContact",
                parent=base_styles["Normal"],
                fontName="Helvetica",
                fontSize=9,
                leading=12,
                alignment=TA_CENTER,
                spaceAfter=7,
            ),
            "section": ParagraphStyle(
                "ResumeSection",
                parent=base_styles["Normal"],
                fontName="Helvetica-Bold",
                fontSize=10.5,
                leading=13,
                spaceBefore=7,
                spaceAfter=4,
            ),
            "body": ParagraphStyle(
                "ResumeBody",
                parent=base_styles["Normal"],
                fontName="Helvetica",
                fontSize=9,
                leading=12,
                alignment=TA_JUSTIFY,
                spaceAfter=3,
            ),
            "role": ParagraphStyle(
                "ResumeRole",
                parent=base_styles["Normal"],
                fontName="Helvetica-Bold",
                fontSize=9.5,
                leading=12,
                spaceAfter=1,
            ),
            "metadata": ParagraphStyle(
                "ResumeMetadata",
                parent=base_styles["Normal"],
                fontName="Helvetica",
                fontSize=8.5,
                leading=11,
                spaceAfter=3,
            ),
            "bullet": ParagraphStyle(
                "ResumeBullet",
                parent=base_styles["Normal"],
                fontName="Helvetica",
                fontSize=9,
                leading=12,
                alignment=TA_JUSTIFY,
                leftIndent=14,
                firstLineIndent=-10,
                spaceAfter=2,
            ),
        }

    @staticmethod
    def section_separator() -> HRFlowable:
        return HRFlowable(
            width="100%",
            thickness=1.2,
            spaceBefore=2,
            spaceAfter=5,
        )