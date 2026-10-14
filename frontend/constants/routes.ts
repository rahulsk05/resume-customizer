export const ROUTES = {
  LOGIN: "/login",
  SIGNUP: "/signup",
  DASHBOARD: "/dashboard",
  JOB_APPLICATION_ANALYZING: (jobApplicationId: number) =>
    `/job-applications/${jobApplicationId}/analyzing`,

  JOB_APPLICATION_ANALYSIS: (jobApplicationId: number) =>
    `/job-applications/${jobApplicationId}/analysis`,
} as const;
