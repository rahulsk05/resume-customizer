from app.ai.rag.schema import ResumeEmbeddingEntry
from app.modules.resume_management.schemas.resume_content_schema import (
    ResumeStructuredContent,
)


def build_resume_embedding_entries(
    resume: ResumeStructuredContent,
) -> list[ResumeEmbeddingEntry]:
    entries: list[ResumeEmbeddingEntry] = []

    _add_summary_entry(entries, resume)
    _add_experience_entries(entries, resume)
    _add_skill_entries(entries, resume)
    _add_project_entries(entries, resume)
    _add_education_entries(entries, resume)
    _add_certification_entries(entries, resume)
    _add_achievement_entries(entries, resume)
    _add_publication_entries(entries, resume)
    _add_other_section_entries(entries, resume)

    return entries

def _add_experience_entries(
    entries: list[ResumeEmbeddingEntry],
    resume: ResumeStructuredContent,
) -> None:
    for experience in resume.experience:
        content_parts = [
            experience.role,
            experience.company,
        ]

        if experience.location:
            content_parts.append(experience.location)

        if experience.description:
            content_parts.append(experience.description)

        content_parts.extend(experience.bullets)

        content = "\n".join(
            part.strip()
            for part in content_parts
            if part and part.strip()
        )

        if content:
            entries.append(
                ResumeEmbeddingEntry(
                    section="experience",
                    source=experience.company,
                    content=content,
                )
            )


def _add_skill_entries(
    entries: list[ResumeEmbeddingEntry],
    resume: ResumeStructuredContent,
) -> None:
    for skill in resume.skills:
        skill = skill.strip()

        if skill:
            entries.append(
                ResumeEmbeddingEntry(
                    section="skills",
                    source="skills",
                    content=skill,
                )
            )


def _add_project_entries(
    entries: list[ResumeEmbeddingEntry],
    resume: ResumeStructuredContent,
) -> None:
    for project in resume.projects:
        content_parts = [project.name]

        if project.description:
            content_parts.append(project.description)

        if project.technologies:
            content_parts.append(
                f"Technologies: {', '.join(project.technologies)}"
            )

        content_parts.extend(project.details)

        content = "\n".join(
            part.strip()
            for part in content_parts
            if part and part.strip()
        )

        if content:
            entries.append(
                ResumeEmbeddingEntry(
                    section="projects",
                    source=project.name,
                    content=content,
                )
            )

def _add_education_entries(
    entries: list[ResumeEmbeddingEntry],
    resume: ResumeStructuredContent,
) -> None:
    for education in resume.education:
        content_parts = [
            education.degree,
            education.field_of_study,
            education.institution,
            education.location,
        ]

        content_parts.extend(education.details)

        content = "\n".join(
            part.strip()
            for part in content_parts
            if part and part.strip()
        )

        if content:
            entries.append(
                ResumeEmbeddingEntry(
                    section="education",
                    source=education.institution,
                    content=content,
                )
            )

def _add_certification_entries(
    entries: list[ResumeEmbeddingEntry],
    resume: ResumeStructuredContent,
) -> None:
    for certification in resume.certifications:
        content_parts = [
            certification.name,
            certification.issuer,
            certification.issue_date,
            certification.expiry_date,
        ]

        content = "\n".join(
            part.strip()
            for part in content_parts
            if part and part.strip()
        )

        if content:
            entries.append(
                ResumeEmbeddingEntry(
                    section="certifications",
                    source=certification.name,
                    content=content,
                )
            )

def _add_achievement_entries(
    entries: list[ResumeEmbeddingEntry],
    resume: ResumeStructuredContent,
) -> None:
    for achievement in resume.achievements:
        content_parts = [
            achievement.title,
            achievement.description,
            achievement.date,
        ]

        content = "\n".join(
            part.strip()
            for part in content_parts
            if part and part.strip()
        )

        if content:
            entries.append(
                ResumeEmbeddingEntry(
                    section="achievements",
                    source=achievement.title,
                    content=content,
                )
            )

def _add_publication_entries(
    entries: list[ResumeEmbeddingEntry],
    resume: ResumeStructuredContent,
) -> None:
    for publication in resume.publications:
        content_parts = [
            publication.title,
            publication.publisher,
            publication.date,
            publication.description,
        ]

        content = "\n".join(
            part.strip()
            for part in content_parts
            if part and part.strip()
        )

        if content:
            entries.append(
                ResumeEmbeddingEntry(
                    section="publications",
                    source=publication.title,
                    content=content,
                )
            )

def _add_other_section_entries(
    entries: list[ResumeEmbeddingEntry],
    resume: ResumeStructuredContent,
) -> None:
    for section in resume.other_sections:
        content_parts = [section.title]
        content_parts.extend(section.content)

        content = "\n".join(
            part.strip()
            for part in content_parts
            if part and part.strip()
        )

        if content:
            entries.append(
                ResumeEmbeddingEntry(
                    section="other_sections",
                    source=section.title,
                    content=content,
                )
            )

def _add_summary_entry(
    entries: list[ResumeEmbeddingEntry],
    resume: ResumeStructuredContent,
) -> None:
    if resume.summary and resume.summary.strip():
        entries.append(
            ResumeEmbeddingEntry(
                section="summary",
                source="summary",
                content=resume.summary.strip(),
            )
        )