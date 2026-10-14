from io import BytesIO
from xml.sax.saxutils import escape

from reportlab.lib.pagesizes import A4
from reportlab.lib.units import mm
from reportlab.platypus import (
    Paragraph,
    SimpleDocTemplate,
    Spacer,
)

from app.common.pdf.resume_pdf_styles import ResumePdfStyles
from app.modules.resume_management.schemas.resume_content_schema import (
    ResumeStructuredContent,
)


class ResumePdfRenderer:
    """Renders a structured tailored resume as an ATS-friendly PDF."""

    def render(self, resume: ResumeStructuredContent) -> bytes:
        buffer = BytesIO()

        document = SimpleDocTemplate(
            buffer,
            pagesize=A4,
            rightMargin=18 * mm,
            leftMargin=18 * mm,
            topMargin=15 * mm,
            bottomMargin=15 * mm,
            title=resume.personal_information.full_name or "Tailored Resume",
        )

        styles = ResumePdfStyles.build()
        story = self._build_story(resume, styles)

        document.build(story)

        return buffer.getvalue()

    def _build_story(
        self,
        resume: ResumeStructuredContent,
        styles,
    ) -> list:
        story = []

        self._add_personal_information(
            story=story,
            resume=resume,
            styles=styles,
        )

        self._add_summary(
            story=story,
            resume=resume,
            styles=styles,
        )

        self._add_skills(
            story=story,
            resume=resume,
            styles=styles,
        )

        self._add_experience(
            story=story,
            resume=resume,
            styles=styles,
        )

        self._add_education(
            story=story,
            resume=resume,
            styles=styles,
        )

        self._add_projects(
            story=story,
            resume=resume,
            styles=styles,
        )

        self._add_certifications(
            story=story,
            resume=resume,
            styles=styles,
        )

        self._add_achievements(
            story=story,
            resume=resume,
            styles=styles,
        )

        self._add_publications(
            story=story,
            resume=resume,
            styles=styles,
        )

        self._add_other_sections(
            story=story,
            resume=resume,
            styles=styles,
        )

        return story

    def _add_personal_information(
        self,
        story: list,
        resume: ResumeStructuredContent,
        styles,
    ) -> None:
        personal = resume.personal_information

        if personal.full_name:
            story.append(
                Paragraph(
                    self._text(personal.full_name),
                    styles["name"],
                )
            )

        contact_items = [
            personal.email,
            personal.phone,
            personal.location,
            personal.linkedin,
            personal.github,
            personal.portfolio,
            *personal.other_links,
        ]

        contact_items = [
            item for item in contact_items if item
        ]

        if contact_items:
            story.append(
                Paragraph(
                    self._text(" | ".join(contact_items)),
                    styles["contact"],
                )
            )

    def _add_summary(
        self,
        story: list,
        resume: ResumeStructuredContent,
        styles,
    ) -> None:
        if not resume.summary:
            return

        self._add_separator(story)

        self._add_section_title(
            story,
            "SUMMARY",
            styles,
        )

        story.append(
            Paragraph(
                self._text(resume.summary),
                styles["body"],
            )
        )

    def _add_skills(
        self,
        story: list,
        resume: ResumeStructuredContent,
        styles,
    ) -> None:
        if not resume.skills:
            return

        self._add_separator(story)

        self._add_section_title(
            story,
            "SKILLS",
            styles,
        )

        story.append(
            Paragraph(
                self._text(", ".join(resume.skills)),
                styles["body"],
            )
        )

    def _add_experience(
        self,
        story: list,
        resume: ResumeStructuredContent,
        styles,
    ) -> None:
        if not resume.experience:
            return

        self._add_separator(story)

        self._add_section_title(
            story,
            "EXPERIENCE",
            styles,
        )

        for experience in resume.experience:
            role_parts = []

            if experience.role:
                role_parts.append(experience.role)

            if experience.company:
                role_parts.append(experience.company)

            if role_parts:
                story.append(
                    Paragraph(
                        self._text(" | ".join(role_parts)),
                        styles["role"],
                    )
                )

            metadata = self._build_experience_metadata(
                experience
            )

            if metadata:
                story.append(
                    Paragraph(
                        self._text(metadata),
                        styles["metadata"],
                    )
                )

            if experience.description:
                story.append(
                    Paragraph(
                        self._text(experience.description),
                        styles["body"],
                    )
                )

            self._add_bullets(
                story=story,
                items=experience.bullets,
                styles=styles,
            )

    def _add_education(
        self,
        story: list,
        resume: ResumeStructuredContent,
        styles,
    ) -> None:
        if not resume.education:
            return

        self._add_separator(story)

        self._add_section_title(
            story,
            "EDUCATION",
            styles,
        )

        for education in resume.education:
            title_parts = []

            if education.degree:
                title_parts.append(education.degree)

            if education.institution:
                title_parts.append(education.institution)

            if title_parts:
                story.append(
                    Paragraph(
                        self._text(" | ".join(title_parts)),
                        styles["role"],
                    )
                )

            metadata_parts = []

            if education.field_of_study:
                metadata_parts.append(
                    education.field_of_study
                )

            if education.location:
                metadata_parts.append(
                    education.location
                )

            dates = self._format_date_range(
                education.start_date,
                education.end_date,
            )

            if dates:
                metadata_parts.append(dates)

            if metadata_parts:
                story.append(
                    Paragraph(
                        self._text(" | ".join(metadata_parts)),
                        styles["metadata"],
                    )
                )

            self._add_bullets(
                story=story,
                items=education.details,
                styles=styles,
            )

    def _add_projects(
        self,
        story: list,
        resume: ResumeStructuredContent,
        styles,
    ) -> None:
        if not resume.projects:
            return

        self._add_separator(story)

        self._add_section_title(
            story,
            "PROJECTS",
            styles,
        )

        for project in resume.projects:
            if project.name:
                story.append(
                    Paragraph(
                        self._text(project.name),
                        styles["role"],
                    )
                )

            if project.description:
                story.append(
                    Paragraph(
                        self._text(project.description),
                        styles["body"],
                    )
                )

            if project.technologies:
                story.append(
                    Paragraph(
                        self._text(
                            f"Technologies: "
                            f"{', '.join(project.technologies)}"
                        ),
                        styles["metadata"],
                    )
                )

            if project.url:
                story.append(
                    Paragraph(
                        self._text(project.url),
                        styles["metadata"],
                    )
                )

            self._add_bullets(
                story=story,
                items=project.details,
                styles=styles,
            )

    def _add_certifications(
        self,
        story: list,
        resume: ResumeStructuredContent,
        styles,
    ) -> None:
        if not resume.certifications:
            return

        self._add_separator(story)

        self._add_section_title(
            story,
            "CERTIFICATIONS",
            styles,
        )

        for certification in resume.certifications:
            title_parts = []

            if certification.name:
                title_parts.append(certification.name)

            if certification.issuer:
                title_parts.append(certification.issuer)

            if title_parts:
                story.append(
                    Paragraph(
                        self._text(" | ".join(title_parts)),
                        styles["body"],
                    )
                )

            metadata_parts = []

            if certification.issue_date:
                metadata_parts.append(
                    f"Issued: {certification.issue_date}"
                )

            if certification.expiry_date:
                metadata_parts.append(
                    f"Expires: {certification.expiry_date}"
                )

            if metadata_parts:
                story.append(
                    Paragraph(
                        self._text(" | ".join(metadata_parts)),
                        styles["metadata"],
                    )
                )

            if certification.credential_url:
                story.append(
                    Paragraph(
                        self._text(
                            certification.credential_url
                        ),
                        styles["metadata"],
                    )
                )

    def _add_achievements(
        self,
        story: list,
        resume: ResumeStructuredContent,
        styles,
    ) -> None:
        if not resume.achievements:
            return

        self._add_separator(story)

        self._add_section_title(
            story,
            "ACHIEVEMENTS",
            styles,
        )

        for achievement in resume.achievements:
            if achievement.title:
                story.append(
                    Paragraph(
                        self._text(achievement.title),
                        styles["role"],
                    )
                )

            if achievement.description:
                story.append(
                    Paragraph(
                        self._text(achievement.description),
                        styles["body"],
                    )
                )

            if achievement.date:
                story.append(
                    Paragraph(
                        self._text(achievement.date),
                        styles["metadata"],
                    )
                )

    def _add_publications(
        self,
        story: list,
        resume: ResumeStructuredContent,
        styles,
    ) -> None:
        if not resume.publications:
            return

        self._add_separator(story)

        self._add_section_title(
            story,
            "PUBLICATIONS",
            styles,
        )

        for publication in resume.publications:
            if publication.title:
                story.append(
                    Paragraph(
                        self._text(publication.title),
                        styles["role"],
                    )
                )

            metadata_parts = []

            if publication.publisher:
                metadata_parts.append(
                    publication.publisher
                )

            if publication.date:
                metadata_parts.append(
                    publication.date
                )

            if metadata_parts:
                story.append(
                    Paragraph(
                        self._text(" | ".join(metadata_parts)),
                        styles["metadata"],
                    )
                )

            if publication.description:
                story.append(
                    Paragraph(
                        self._text(publication.description),
                        styles["body"],
                    )
                )

            if publication.url:
                story.append(
                    Paragraph(
                        self._text(publication.url),
                        styles["metadata"],
                    )
                )

    def _add_other_sections(
        self,
        story: list,
        resume: ResumeStructuredContent,
        styles,
    ) -> None:
        for section in resume.other_sections:
            if not section.title:
                continue

            self._add_separator(story)

            self._add_section_title(
                story,
                section.title,
                styles,
            )

            self._add_bullets(
                story=story,
                items=section.content,
                styles=styles,
            )

    @staticmethod
    def _add_section_title(
        story: list,
        title: str,
        styles,
    ) -> None:
        story.append(
            Paragraph(
                ResumePdfRenderer._text(title),
                styles["section"],
            )
        )

    @staticmethod
    def _add_separator(story: list) -> None:
        story.append(
            ResumePdfStyles.section_separator()
        )

    @staticmethod
    def _add_bullets(
        story: list,
        items: list[str],
        styles,
    ) -> None:
        valid_items = [
            item for item in items if item
        ]

        if not valid_items:
            return

        for item in valid_items:
            story.append(
                Paragraph(
                    f"&bull;&nbsp;&nbsp;"
                    f"{ResumePdfRenderer._text(item)}",
                    styles["bullet"],
                )
            )

        story.append(Spacer(1, 2))

    @staticmethod
    def _build_experience_metadata(
        experience,
    ) -> str:
        metadata_parts = []

        if experience.location:
            metadata_parts.append(
                experience.location
            )

        dates = ResumePdfRenderer._format_date_range(
            experience.start_date,
            experience.end_date,
        )

        if dates:
            metadata_parts.append(dates)

        if experience.employment_type:
            metadata_parts.append(
                experience.employment_type
            )

        return " | ".join(metadata_parts)

    @staticmethod
    def _format_date_range(
        start_date: str | None,
        end_date: str | None,
    ) -> str:
        if start_date and end_date:
            return f"{start_date} - {end_date}"

        if start_date:
            return f"{start_date} - Present"

        if end_date:
            return end_date

        return ""

    @staticmethod
    def _text(value: str) -> str:
        return escape(value).replace(
            "\n",
            "<br/>",
        )