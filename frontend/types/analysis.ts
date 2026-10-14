export interface AnalysisFeedback {
  overall: string;
  strengths: string[];
  gaps: string[];
}

export interface AnalysisSuggestion {
  type: string;
  priority: "High" | "Medium" | "Low";
  text: string;
}

export interface TailoredPersonalInformation {
  full_name: string;
  email: string;
  phone: string | null;
  location: string | null;
  linkedin: string | null;
  github: string | null;
  portfolio: string | null;
  other_links: string[];
}

export interface TailoredExperience {
  company: string;
  role: string;
  location: string | null;
  start_date: string | null;
  end_date: string | null;
  is_current: boolean;
  employment_type: string | null;
  description: string | null;
  bullets: string[];
}

export interface TailoredEducation {
  institution: string;
  degree: string;
  field_of_study: string | null;
  location: string | null;
  start_date: string | null;
  end_date: string | null;
  details: string[];
}

export interface TailoredProject {
  name: string;
  description: string | null;
  technologies: string[];
  url: string | null;
  details: string[];
}

export interface TailoredCertification {
  name: string;
  issuer: string | null;
  issue_date: string | null;
  expiry_date: string | null;
  credential_url: string | null;
}

export interface TailoredResume {
  personal_information: TailoredPersonalInformation;
  summary: string | null;
  skills: string[];
  experience: TailoredExperience[];
  education: TailoredEducation[];
  projects: TailoredProject[];
  certifications: TailoredCertification[];
  achievements: string[];
  publications: string[];
  other_sections: string[];
}

export type AnalysisChangeType = "modified" | "removed" | "added" | "reordered";

export interface AnalysisChange {
  section: string;
  source: string;
  change_type: AnalysisChangeType;
  original: string;
  tailored: string;
  reason: string;
}

export interface AnalysisResult {
  id: number;
  job_application_id: number;
  match_score: number;
  feedback: AnalysisFeedback;
  suggestions: AnalysisSuggestion[];
  tailored_resume: TailoredResume;
  changes: AnalysisChange[];
  created_at: string;
  updated_at: string;
}
