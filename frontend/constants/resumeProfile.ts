export const RESUME_PROFILE_CONFIG = {
  MAX_FILE_SIZE_BYTES: 2 * 1024 * 1024,
  ACCEPTED_FILE_TYPES: [
    "application/pdf",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ],
  ACCEPTED_FILE_EXTENSIONS: [".pdf", ".docx"],
} as const;
