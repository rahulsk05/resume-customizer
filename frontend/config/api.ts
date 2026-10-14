export const API_CONFIG = {
  baseUrl: process.env.NEXT_PUBLIC_API_URL ?? "",
  version: "/api/v1",
  timeout: 10000,
  aiApiTimeout: 60000,
} as const;
