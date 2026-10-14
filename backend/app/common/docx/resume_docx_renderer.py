from io import BytesIO

from docx import Document
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.oxml import OxmlElement
from docx.shared import Pt

from app.common.docx.resume_docx_styles import ResumeDocxStyles
from app.modules.resume_management.schemas.resume_content_schema import (
    ResumeStructuredContent,
)


class ResumeDocxRenderer:
    """Renders a structured resume into an ATS-friendly DOCX document."""

    def render(self, resume: ResumeStructuredContent) -> bytes:
        document = Document()

        ResumeDocxStyles.configure_document(document)

        self._build_document(document, resume)

        output = BytesIO()
        document.save(output)

        return output.getvalue()

    def _build_document(
        self,
        document: Document,
        resume: ResumeStructuredContent,
    ) -> None:
        self._add_personal_information(document, resume)
        self._add_summary(document, resume)
        self._add_skills(document, resume)
        self._add_experience(document, resume)
        self._add_education(document, resume)
        self._add_projects(document, resume)
        self._add_certifications(document, resume)
        self._add_achievements(document, resume)
        self._add_publications(document, resume)
        self._add_other_sections(document, resume)

    def _add_personal_information(
        self,
        document: Document,
        resume: ResumeStructuredContent,
    ) -> None:
        personal = resume.personal_information

        paragraph = document.add_paragraph()
        paragraph.alignment = WD_ALIGN_PARAGRAPH.CENTER
        paragraph.paragraph_format.space_after = Pt(4)

        run = paragraph.add_run(personal.full_name)
        run.bold = True
        run.font.name = ResumeDocxStyles.FONT_NAME
        run.font.size = Pt(ResumeDocxStyles.NAME_SIZE)

        contact_items = [
            personal.email,
            personal.phone,
            personal.location,
            personal.linkedin,
            personal.github,
            personal.portfolio,
            *personal.other_links,
        ]

        contact_items = [item for item in contact_items if item]

        if contact_items:
            paragraph = document.add_paragraph()
            paragraph.alignment = WD_ALIGN_PARAGRAPH.CENTER
            paragraph.paragraph_format.space_after = Pt(5)

            run = paragraph.add_run(" | ".join(contact_items))
            run.font.name = ResumeDocxStyles.FONT_NAME
            run.font.size = Pt(ResumeDocxStyles.CONTACT_SIZE)

    def _add_summary(
        self,
        document: Document,
        resume: ResumeStructuredContent,
    ) -> None:
        if not resume.summary:
            return

        self._add_separator(document)
        self._add_section_title(document, "SUMMARY")

        paragraph = document.add_paragraph()
        paragraph.alignment = WD_ALIGN_PARAGRAPH.JUSTIFY
        paragraph.paragraph_format.space_after = Pt(3)

        run = paragraph.add_run(resume.summary)
        run.font.name = ResumeDocxStyles.FONT_NAME
        run.font.size = Pt(ResumeDocxStyles.BODY_SIZE)

    def _add_skills(
        self,
        document: Document,
        resume: ResumeStructuredContent,
    ) -> None:
        if not resume.skills:
            return

        self._add_separator(document)
        self._add_section_title(document, "SKILLS")

        skills = [
            skill.strip()
            for skill in resume.skills
            if skill and skill.strip()
        ]

        if not skills:
            return

        paragraph = document.add_paragraph()
        paragraph.alignment = WD_ALIGN_PARAGRAPH.JUSTIFY
        paragraph.paragraph_format.space_after = Pt(3)

        run = paragraph.add_run(", ".join(skills))
        run.font.name = ResumeDocxStyles.FONT_NAME
        run.font.size = Pt(ResumeDocxStyles.BODY_SIZE)

    def _add_experience(
        self,
        document: Document,
        resume: ResumeStructuredContent,
    ) -> None:
        if not resume.experience:
            return

        self._add_separator(document)
        self._add_section_title(document, "EXPERIENCE")

        for experience in resume.experience:
            role_company = self._join_non_empty(
                [
                    experience.role,
                    experience.company,
                ],
                separator=" | ",
            )

            if role_company:
                paragraph = document.add_paragraph()
                paragraph.paragraph_format.space_after = Pt(1)

                run = paragraph.add_run(role_company)
                run.bold = True
                run.font.name = ResumeDocxStyles.FONT_NAME
                run.font.size = Pt(ResumeDocxStyles.ROLE_SIZE)

            metadata = self._join_non_empty(
                [
                    experience.location,
                    self._format_date_range(
                        experience.start_date,
                        experience.end_date,
                        experience.is_current,
                    ),
                    experience.employment_type,
                ],
                separator=" | ",
            )

            if metadata:
                paragraph = document.add_paragraph()
                paragraph.paragraph_format.space_after = Pt(3)

                run = paragraph.add_run(metadata)
                run.font.name = ResumeDocxStyles.FONT_NAME
                run.font.size = Pt(ResumeDocxStyles.METADATA_SIZE)

            if experience.description:
                paragraph = document.add_paragraph()
                paragraph.alignment = WD_ALIGN_PARAGRAPH.JUSTIFY
                paragraph.paragraph_format.space_after = Pt(3)

                run = paragraph.add_run(experience.description)
                run.font.name = ResumeDocxStyles.FONT_NAME
                run.font.size = Pt(ResumeDocxStyles.BODY_SIZE)

            self._add_bullets(document, experience.bullets)

    def _add_education(
        self,
        document: Document,
        resume: ResumeStructuredContent,
    ) -> None:
        if not resume.education:
            return

        self._add_separator(document)
        self._add_section_title(document, "EDUCATION")

        for education in resume.education:
            degree_institution = self._join_non_empty(
                [
                    education.degree,
                    education.institution,
                ],
                separator=" | ",
            )

            if degree_institution:
                paragraph = document.add_paragraph()
                paragraph.paragraph_format.space_after = Pt(1)

                run = paragraph.add_run(degree_institution)
                run.bold = True
                run.font.name = ResumeDocxStyles.FONT_NAME
                run.font.size = Pt(ResumeDocxStyles.ROLE_SIZE)

            metadata = self._join_non_empty(
                [
                    education.field_of_study,
                    education.location,
                    self._format_date_range(
                        education.start_date,
                        education.end_date,
                        False,
                    ),
                ],
                separator=" | ",
            )

            if metadata:
                paragraph = document.add_paragraph()
                paragraph.paragraph_format.space_after = Pt(3)

                run = paragraph.add_run(metadata)
                run.font.name = ResumeDocxStyles.FONT_NAME
                run.font.size = Pt(ResumeDocxStyles.METADATA_SIZE)

            self._add_bullets(document, education.details)

    def _add_projects(
        self,
        document: Document,
        resume: ResumeStructuredContent,
    ) -> None:
        if not resume.projects:
            return

        self._add_separator(document)
        self._add_section_title(document, "PROJECTS")

        for project in resume.projects:
            if project.name:
                paragraph = document.add_paragraph()
                paragraph.paragraph_format.space_after = Pt(1)

                run = paragraph.add_run(project.name)
                run.bold = True
                run.font.name = ResumeDocxStyles.FONT_NAME
                run.font.size = Pt(ResumeDocxStyles.ROLE_SIZE)

            if project.description:
                paragraph = document.add_paragraph()
                paragraph.alignment = WD_ALIGN_PARAGRAPH.JUSTIFY
                paragraph.paragraph_format.space_after = Pt(3)

                run = paragraph.add_run(project.description)
                run.font.name = ResumeDocxStyles.FONT_NAME
                run.font.size = Pt(ResumeDocxStyles.BODY_SIZE)

            if project.technologies:
                self._add_bullets(document, project.technologies)

            self._add_bullets(document, project.details)

            if project.url:
                paragraph = document.add_paragraph()
                paragraph.paragraph_format.space_after = Pt(3)

                run = paragraph.add_run(project.url)
                run.font.name = ResumeDocxStyles.FONT_NAME
                run.font.size = Pt(ResumeDocxStyles.METADATA_SIZE)

    def _add_certifications(
        self,
        document: Document,
        resume: ResumeStructuredContent,
    ) -> None:
        if not resume.certifications:
            return

        self._add_separator(document)
        self._add_section_title(document, "CERTIFICATIONS")

        for certification in resume.certifications:
            paragraph = document.add_paragraph()
            paragraph.paragraph_format.space_after = Pt(3)

            run = paragraph.add_run(certification.name)
            run.bold = True
            run.font.name = ResumeDocxStyles.FONT_NAME
            run.font.size = Pt(ResumeDocxStyles.ROLE_SIZE)

            metadata = self._join_non_empty(
                [
                    certification.issuer,
                    certification.issue_date,
                    certification.expiry_date,
                ],
                separator=" | ",
            )

            if metadata:
                run = paragraph.add_run(f" | {metadata}")
                run.font.name = ResumeDocxStyles.FONT_NAME
                run.font.size = Pt(ResumeDocxStyles.METADATA_SIZE)

            if certification.credential_url:
                paragraph = document.add_paragraph()
                paragraph.paragraph_format.space_after = Pt(3)

                run = paragraph.add_run(certification.credential_url)
                run.font.name = ResumeDocxStyles.FONT_NAME
                run.font.size = Pt(ResumeDocxStyles.METADATA_SIZE)

    def _add_achievements(
        self,
        document: Document,
        resume: ResumeStructuredContent,
    ) -> None:
        if not resume.achievements:
            return

        self._add_separator(document)
        self._add_section_title(document, "ACHIEVEMENTS")

        for achievement in resume.achievements:
            paragraph = document.add_paragraph()
            paragraph.alignment = WD_ALIGN_PARAGRAPH.JUSTIFY
            paragraph.paragraph_format.space_after = Pt(3)

            run = paragraph.add_run(achievement.title)
            run.bold = True
            run.font.name = ResumeDocxStyles.FONT_NAME
            run.font.size = Pt(ResumeDocxStyles.BODY_SIZE)

            if achievement.description:
                run = paragraph.add_run(
                    f" — {achievement.description}"
                )
                run.font.name = ResumeDocxStyles.FONT_NAME
                run.font.size = Pt(ResumeDocxStyles.BODY_SIZE)

            if achievement.date:
                run = paragraph.add_run(f" | {achievement.date}")
                run.font.name = ResumeDocxStyles.FONT_NAME
                run.font.size = Pt(ResumeDocxStyles.METADATA_SIZE)

    def _add_publications(
        self,
        document: Document,
        resume: ResumeStructuredContent,
    ) -> None:
        if not resume.publications:
            return

        self._add_separator(document)
        self._add_section_title(document, "PUBLICATIONS")

        for publication in resume.publications:
            paragraph = document.add_paragraph()
            paragraph.alignment = WD_ALIGN_PARAGRAPH.JUSTIFY
            paragraph.paragraph_format.space_after = Pt(3)

            run = paragraph.add_run(publication.title)
            run.bold = True
            run.font.name = ResumeDocxStyles.FONT_NAME
            run.font.size = Pt(ResumeDocxStyles.BODY_SIZE)

            metadata = self._join_non_empty(
                [
                    publication.publisher,
                    publication.date,
                ],
                separator=" | ",
            )

            if metadata:
                run = paragraph.add_run(f" | {metadata}")
                run.font.name = ResumeDocxStyles.FONT_NAME
                run.font.size = Pt(ResumeDocxStyles.METADATA_SIZE)

            if publication.description:
                run = paragraph.add_run(
                    f" — {publication.description}"
                )
                run.font.name = ResumeDocxStyles.FONT_NAME
                run.font.size = Pt(ResumeDocxStyles.BODY_SIZE)

            if publication.url:
                paragraph = document.add_paragraph()
                paragraph.paragraph_format.space_after = Pt(3)

                run = paragraph.add_run(publication.url)
                run.font.name = ResumeDocxStyles.FONT_NAME
                run.font.size = Pt(ResumeDocxStyles.METADATA_SIZE)

    def _add_other_sections(
        self,
        document: Document,
        resume: ResumeStructuredContent,
    ) -> None:
        for section in resume.other_sections:
            if not section.title or not section.content:
                continue

            self._add_separator(document)
            self._add_section_title(document, section.title)

            self._add_bullets(document, section.content)

    @staticmethod
    def _add_section_title(
        document: Document,
        title: str,
    ) -> None:
        paragraph = document.add_paragraph()

        paragraph.paragraph_format.space_before = Pt(7)
        paragraph.paragraph_format.space_after = Pt(4)

        run = paragraph.add_run(title.upper())
        run.bold = True
        run.font.name = ResumeDocxStyles.FONT_NAME
        run.font.size = Pt(ResumeDocxStyles.SECTION_SIZE)

    @staticmethod
    def _add_separator(document: Document) -> None:
        paragraph = document.add_paragraph()
        paragraph.paragraph_format.space_before = Pt(1)
        paragraph.paragraph_format.space_after = Pt(4)

        p_pr = paragraph._p.get_or_add_pPr()

        borders = OxmlElement("w:pBdr")
        bottom = OxmlElement("w:bottom")

        bottom.set(
            "{http://schemas.openxmlformats.org/wordprocessingml/2006/main}val",
            "single",
        )
        bottom.set(
            "{http://schemas.openxmlformats.org/wordprocessingml/2006/main}sz",
            "10",
        )
        bottom.set(
            "{http://schemas.openxmlformats.org/wordprocessingml/2006/main}space",
            "1",
        )

        borders.append(bottom)
        p_pr.append(borders)

    @staticmethod
    def _add_bullets(
        document: Document,
        items: list[str],
    ) -> None:
        for item in items:
            if not item:
                continue

            paragraph = document.add_paragraph()

            paragraph.paragraph_format.left_indent = Pt(14)
            paragraph.paragraph_format.first_line_indent = Pt(-10)
            paragraph.paragraph_format.space_after = Pt(2)
            paragraph.alignment = WD_ALIGN_PARAGRAPH.JUSTIFY

            bullet = paragraph.add_run("•  ")
            bullet.font.name = ResumeDocxStyles.FONT_NAME
            bullet.font.size = Pt(ResumeDocxStyles.BULLET_SIZE)

            text = paragraph.add_run(item)
            text.font.name = ResumeDocxStyles.FONT_NAME
            text.font.size = Pt(ResumeDocxStyles.BULLET_SIZE)

    @staticmethod
    def _format_date_range(
        start_date: str | None,
        end_date: str | None,
        is_current: bool,
    ) -> str | None:
        if not start_date and not end_date and not is_current:
            return None

        start = start_date or ""

        if is_current:
            end = "Present"
        else:
            end = end_date or ""

        if start and end:
            return f"{start} - {end}"

        return start or end

    @staticmethod
    def _join_non_empty(
        values: list[str | None],
        separator: str,
    ) -> str:
        return separator.join(
            value for value in values if value
        )