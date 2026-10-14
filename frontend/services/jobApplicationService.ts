import { API_ENDPOINTS } from "@/constants/apiEndpoints";
import apiClient from "@/services/apiClient";
import { AnalysisResult } from "@/types/analysis";
import type { ApiResponse } from "@/types/api";
import type {
  CreateJobApplicationRequest,
  JobApplication,
  JobApplicationListData,
  JobApplicationStatusData,
} from "@/types/jobApplication";

export const jobApplicationService = {
  async getByResumeProfile(
    resumeProfileId: number,
    page = 1,
    pageSize = 6,
  ): Promise<ApiResponse<JobApplicationListData>> {
    const response = await apiClient.get<ApiResponse<JobApplicationListData>>(
      API_ENDPOINTS.JOB_APPLICATIONS.BY_RESUME_PROFILE(resumeProfileId),
      {
        params: {
          page,
          page_size: pageSize,
        },
      },
    );

    return response.data;
  },

  async create(
    payload: CreateJobApplicationRequest,
  ): Promise<ApiResponse<JobApplication>> {
    const response = await apiClient.post<ApiResponse<JobApplication>>(
      API_ENDPOINTS.JOB_APPLICATIONS.BASE,
      payload,
    );

    return response.data;
  },

  async startAnalysis(
    jobApplicationId: number,
  ): Promise<ApiResponse<JobApplication>> {
    const response = await apiClient.post<ApiResponse<JobApplication>>(
      API_ENDPOINTS.JOB_APPLICATIONS.ANALYSIS(jobApplicationId),
    );

    return response.data;
  },

  async getStatus(
    jobApplicationId: number,
  ): Promise<ApiResponse<JobApplicationStatusData>> {
    const response = await apiClient.get<ApiResponse<JobApplicationStatusData>>(
      API_ENDPOINTS.JOB_APPLICATIONS.STATUS(jobApplicationId),
    );

    return response.data;
  },

  async getAnalysis(
    jobApplicationId: number,
  ): Promise<ApiResponse<AnalysisResult>> {
    const response = await apiClient.get<ApiResponse<AnalysisResult>>(
      API_ENDPOINTS.JOB_APPLICATIONS.ANALYSIS(jobApplicationId),
    );

    return response.data;
  },

  async getById(
    jobApplicationId: number,
  ): Promise<ApiResponse<JobApplication>> {
    const response = await apiClient.get<ApiResponse<JobApplication>>(
      `${API_ENDPOINTS.JOB_APPLICATIONS.BASE}/${jobApplicationId}`,
    );

    return response.data;
  },

  async getResumePdf(jobApplicationId: number): Promise<Blob> {
    const response = await apiClient.get<Blob>(
      API_ENDPOINTS.JOB_APPLICATIONS.RESUME_PDF(jobApplicationId),
      {
        responseType: "blob",
      },
    );

    return response.data;
  },

  async getResumeDocx(jobApplicationId: number): Promise<Blob> {
    const response = await apiClient.get<Blob>(
      API_ENDPOINTS.JOB_APPLICATIONS.RESUME_DOCX(jobApplicationId),
      {
        responseType: "blob",
      },
    );

    return response.data;
  },

  async delete(jobApplicationId: number): Promise<ApiResponse<null>> {
    const response = await apiClient.delete<ApiResponse<null>>(
      `${API_ENDPOINTS.JOB_APPLICATIONS.BASE}/${jobApplicationId}`,
    );

    return response.data;
  },
};
