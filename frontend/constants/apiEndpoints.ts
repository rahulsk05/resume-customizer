export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: "/auth/login",
    SIGNUP: "/auth/signup",
    LOGOUT: "/auth/logout",
    ME: "/auth/me",
  },
  RESUME_PROFILES: {
    BASE: "/resume-profiles",
  },
  JOB_APPLICATIONS: {
    BASE: "/job-applications",
    BY_RESUME_PROFILE: (resumeProfileId: number) =>
      `/job-applications/resume-profile/${resumeProfileId}`,
    ANALYSIS: (jobApplicationId: number) =>
      `/job-applications/${jobApplicationId}/analysis`,
    STATUS: (jobApplicationId: number) =>
      `/job-applications/${jobApplicationId}/status`,
    RESUME_PDF: (jobApplicationId: number) =>
      `/job-applications/${jobApplicationId}/resume/pdf`,
    RESUME_DOCX: (jobApplicationId: number) =>
      `/job-applications/${jobApplicationId}/resume/docx`,
  },
} as const;
