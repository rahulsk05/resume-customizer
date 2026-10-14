from docx.shared import Inches, Pt


class ResumeDocxStyles:
    """Defines the visual formatting used by the resume DOCX renderer."""

    FONT_NAME = "Arial"

    NAME_SIZE = 16
    CONTACT_SIZE = 9
    SECTION_SIZE = 10.5
    BODY_SIZE = 9
    ROLE_SIZE = 9.5
    METADATA_SIZE = 8.5
    BULLET_SIZE = 9

    @staticmethod
    def configure_document(document) -> None:
        section = document.sections[0]

        section.top_margin = Inches(0.55)
        section.bottom_margin = Inches(0.55)
        section.left_margin = Inches(0.7)
        section.right_margin = Inches(0.7)

        normal_style = document.styles["Normal"]
        normal_style.font.name = ResumeDocxStyles.FONT_NAME
        normal_style.font.size = Pt(ResumeDocxStyles.BODY_SIZE)