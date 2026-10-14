from pydantic import BaseModel, ConfigDict, Field


class PersonalInformation(BaseModel):
    model_config = ConfigDict(extra="forbid")

    full_name: str = ""
    email: str | None = None
    phone: str | None = None
    location: str | None = None
    linkedin: str | None = None
    github: str | None = None
    portfolio: str | None = None
    other_links: list[str] = Field(default_factory=list)


class Experience(BaseModel):
    model_config = ConfigDict(extra="forbid")

    company: str = ""
    role: str = ""
    location: str | None = None
    start_date: str | None = None
    end_date: str | None = None
    is_current: bool = False
    employment_type: str | None = None
    description: str | None = None
    bullets: list[str] = Field(default_factory=list)


class Education(BaseModel):
    model_config = ConfigDict(extra="forbid")

    institution: str = ""
    degree: str = ""
    field_of_study: str | None = None
    location: str | None = None
    start_date: str | None = None
    end_date: str | None = None
    details: list[str] = Field(default_factory=list)


class Project(BaseModel):
    model_config = ConfigDict(extra="forbid")

    name: str = ""
    description: str | None = None
    technologies: list[str] = Field(default_factory=list)
    url: str | None = None
    details: list[str] = Field(default_factory=list)


class Certification(BaseModel):
    model_config = ConfigDict(extra="forbid")

    name: str = ""
    issuer: str | None = None
    issue_date: str | None = None
    expiry_date: str | None = None
    credential_url: str | None = None


class Achievement(BaseModel):
    model_config = ConfigDict(extra="forbid")

    title: str = ""
    description: str | None = None
    date: str | None = None


class Publication(BaseModel):
    model_config = ConfigDict(extra="forbid")

    title: str = ""
    publisher: str | None = None
    date: str | None = None
    url: str | None = None
    description: str | None = None


class OtherSection(BaseModel):
    model_config = ConfigDict(extra="forbid")

    title: str = ""
    content: list[str] = Field(default_factory=list)


class ResumeStructuredContent(BaseModel):
    model_config = ConfigDict(extra="forbid")

    personal_information: PersonalInformation = Field(
        default_factory=PersonalInformation
    )
    summary: str | None = None
    skills: list[str] = Field(default_factory=list)
    experience: list[Experience] = Field(default_factory=list)
    education: list[Education] = Field(default_factory=list)
    projects: list[Project] = Field(default_factory=list)
    certifications: list[Certification] = Field(default_factory=list)
    achievements: list[Achievement] = Field(default_factory=list)
    publications: list[Publication] = Field(default_factory=list)
    other_sections: list[OtherSection] = Field(default_factory=list)