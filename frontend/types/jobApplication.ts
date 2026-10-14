export type JobApplicationStatus =
  | "PENDING"
  | "PROCESSING"
  | "COMPLETED"
  | "FAILED";

export interface JobApplication {
  id: number;
  created_by: number;
  resume_profile_id: number;
  company_name: string;
  job_role: string;
  job_description: string;
  status: JobApplicationStatus;
  error_message: string | null;
  match_score: number | null;
  created_at: string;
  updated_at: string;
}

export interface CreateJobApplicationRequest {
  resume_profile_id: number;
  company_name: string;
  job_description: string;
}

export interface JobApplicationListData {
  items: JobApplication[];
  page: number;
  page_size: number;
  total: number;
  total_pages: number;
}

export interface JobApplicationStatusData {
  id: number;
  status: JobApplicationStatus;
}
