export interface ResumeProfile {
  id: number;
  name: string;
  original_file_name: string;
  file_size: number;
  file_type: "pdf" | "docx";
  created_at: string;
  updated_at: string;
}

export interface CreateResumeProfileRequest {
  name: string;
  file: File;
}
