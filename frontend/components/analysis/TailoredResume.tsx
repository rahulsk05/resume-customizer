"use client";

import { Mail, MapPin, Phone } from "lucide-react";

import type { TailoredResume } from "@/types/analysis";

interface TailoredResumeProps {
  resume: TailoredResume;
}

function formatDateRange(
  startDate: string | null,
  endDate: string | null,
  isCurrent: boolean,
) {
  if (!startDate && !endDate) {
    return "";
  }

  return `${startDate ?? ""} - ${isCurrent ? "Present" : (endDate ?? "")}`;
}

export default function TailoredResume({ resume }: TailoredResumeProps) {
  const personal = resume.personal_information;

  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden rounded-xl border border-border bg-surface shadow-card">
      {/* Resume viewer toolbar */}
      <div className="flex h-12 shrink-0 items-center justify-between bg-primary-dark px-4 text-white">
        <div className="flex items-center gap-4 text-sm">
          <span className="font-medium">Tailored Resume</span>
        </div>

        <span className="text-xs text-white/70">ATS-friendly format</span>
      </div>

      {/* Resume document */}
      <div className="min-h-0 flex-1 overflow-y-auto bg-surface-muted p-4 sm:p-6">
        <article className="mx-auto min-h-full w-full max-w-3xl bg-white px-7 py-8 text-text-primary shadow-sm sm:px-10 sm:py-10">
          {/* Personal information */}
          <header className="border-b border-border pb-5 text-center">
            <h1 className="text-2xl font-bold tracking-wide text-text-primary">
              {personal.full_name}
            </h1>

            <div className="mt-3 flex flex-wrap justify-center gap-x-4 gap-y-2 text-xs text-text-secondary">
              {personal.email && (
                <span className="flex items-center gap-1.5">
                  <Mail className="h-3.5 w-3.5" />
                  {personal.email}
                </span>
              )}

              {personal.phone && (
                <span className="flex items-center gap-1.5">
                  <Phone className="h-3.5 w-3.5" />
                  {personal.phone}
                </span>
              )}

              {personal.location && (
                <span className="flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5" />
                  {personal.location}
                </span>
              )}

              {personal.linkedin && <span>{personal.linkedin}</span>}

              {personal.github && <span>{personal.github}</span>}

              {personal.portfolio && <span>{personal.portfolio}</span>}
            </div>
          </header>

          {/* Summary */}
          {resume.summary && (
            <ResumeSection title="Professional Summary">
              <p className="text-sm leading-6 text-text-primary">
                {resume.summary}
              </p>
            </ResumeSection>
          )}

          {/* Skills */}
          {resume.skills.length > 0 && (
            <ResumeSection title="Skills">
              <div className="flex flex-wrap gap-2">
                {resume.skills.map((skill) => (
                  <span
                    key={skill}
                    className="rounded-md border border-border bg-surface-muted px-2.5 py-1 text-xs font-medium text-text-primary"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </ResumeSection>
          )}

          {/* Experience */}
          {resume.experience.length > 0 && (
            <ResumeSection title="Professional Experience">
              <div className="space-y-6">
                {resume.experience.map((experience, index) => (
                  <div key={`${experience.company}-${index}`}>
                    <div className="flex flex-col justify-between gap-1 sm:flex-row">
                      <div>
                        <h3 className="text-sm font-bold text-text-primary">
                          {experience.role}
                        </h3>

                        <p className="text-sm text-text-secondary">
                          {experience.company}
                          {experience.location
                            ? `, ${experience.location}`
                            : ""}
                        </p>
                      </div>

                      <p className="shrink-0 text-xs text-text-secondary">
                        {formatDateRange(
                          experience.start_date,
                          experience.end_date,
                          experience.is_current,
                        )}
                      </p>
                    </div>

                    {experience.description && (
                      <p className="mt-2 text-sm leading-6 text-text-secondary">
                        {experience.description}
                      </p>
                    )}

                    {experience.bullets.length > 0 && (
                      <ul className="mt-2 space-y-1 pl-5">
                        {experience.bullets.map((bullet, bulletIndex) => (
                          <li
                            key={bulletIndex}
                            className="list-disc text-sm leading-6 text-text-primary"
                          >
                            {bullet}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </ResumeSection>
          )}

          {/* Education */}
          {resume.education.length > 0 && (
            <ResumeSection title="Education">
              <div className="space-y-4">
                {resume.education.map((education, index) => (
                  <div key={`${education.institution}-${index}`}>
                    <div className="flex flex-col justify-between gap-1 sm:flex-row">
                      <div>
                        <h3 className="text-sm font-bold text-text-primary">
                          {education.degree}
                          {education.field_of_study
                            ? ` in ${education.field_of_study}`
                            : ""}
                        </h3>

                        <p className="text-sm text-text-secondary">
                          {education.institution}
                        </p>
                      </div>

                      <p className="shrink-0 text-xs text-text-secondary">
                        {education.start_date ?? ""}{" "}
                        {education.end_date ? `- ${education.end_date}` : ""}
                      </p>
                    </div>

                    {education.details.length > 0 && (
                      <ul className="mt-2 space-y-1 pl-5">
                        {education.details.map((detail, detailIndex) => (
                          <li
                            key={detailIndex}
                            className="list-disc text-sm leading-6 text-text-primary"
                          >
                            {detail}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </ResumeSection>
          )}

          {/* Projects */}
          {resume.projects.length > 0 && (
            <ResumeSection title="Projects">
              <div className="space-y-5">
                {resume.projects.map((project, index) => (
                  <div key={`${project.name}-${index}`}>
                    <h3 className="text-sm font-bold text-text-primary">
                      {project.name}
                    </h3>

                    {project.technologies.length > 0 && (
                      <p className="mt-1 text-xs text-text-secondary">
                        {project.technologies.join(" • ")}
                      </p>
                    )}

                    {project.description && (
                      <p className="mt-2 text-sm leading-6 text-text-secondary">
                        {project.description}
                      </p>
                    )}

                    {project.details.length > 0 && (
                      <ul className="mt-2 space-y-1 pl-5">
                        {project.details.map((detail, detailIndex) => (
                          <li
                            key={detailIndex}
                            className="list-disc text-sm leading-6 text-text-primary"
                          >
                            {detail}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </ResumeSection>
          )}

          {/* Certifications */}
          {resume.certifications.length > 0 && (
            <ResumeSection title="Certifications">
              <div className="space-y-3">
                {resume.certifications.map((certification, index) => (
                  <div key={`${certification.name}-${index}`}>
                    <p className="text-sm font-semibold text-text-primary">
                      {certification.name}
                    </p>

                    {certification.issuer && (
                      <p className="text-sm text-text-secondary">
                        {certification.issuer}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </ResumeSection>
          )}

          {/* Achievements */}
          {resume.achievements.length > 0 && (
            <ResumeSection title="Achievements">
              <ul className="space-y-1 pl-5">
                {resume.achievements.map((achievement, index) => (
                  <li
                    key={index}
                    className="list-disc text-sm leading-6 text-text-primary"
                  >
                    {achievement}
                  </li>
                ))}
              </ul>
            </ResumeSection>
          )}

          {/* Publications */}
          {resume.publications.length > 0 && (
            <ResumeSection title="Publications">
              <ul className="space-y-1 pl-5">
                {resume.publications.map((publication, index) => (
                  <li
                    key={index}
                    className="list-disc text-sm leading-6 text-text-primary"
                  >
                    {publication}
                  </li>
                ))}
              </ul>
            </ResumeSection>
          )}

          {/* Other sections */}
          {resume.other_sections.length > 0 && (
            <ResumeSection title="Additional Information">
              <ul className="space-y-1 pl-5">
                {resume.other_sections.map((section, index) => (
                  <li
                    key={index}
                    className="list-disc text-sm leading-6 text-text-primary"
                  >
                    {section}
                  </li>
                ))}
              </ul>
            </ResumeSection>
          )}
        </article>
      </div>
    </div>
  );
}

interface ResumeSectionProps {
  title: string;
  children: React.ReactNode;
}

function ResumeSection({ title, children }: ResumeSectionProps) {
  return (
    <section className="mt-6">
      <h2 className="border-b border-border pb-1.5 text-sm font-bold uppercase tracking-wide text-text-primary">
        {title}
      </h2>

      <div className="mt-3">{children}</div>
    </section>
  );
}
