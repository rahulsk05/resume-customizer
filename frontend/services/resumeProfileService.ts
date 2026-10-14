import { API_CONFIG } from "@/config/api";
import { API_ENDPOINTS } from "@/constants/apiEndpoints";
import apiClient from "@/services/apiClient";
import type { ApiResponse } from "@/types/api";
import type {
  CreateResumeProfileRequest,
  ResumeProfile,
} from "@/types/resumeProfile";

export const resumeProfileService = {
  async create(
    payload: CreateResumeProfileRequest,
  ): Promise<ApiResponse<ResumeProfile>> {
    const formData = new FormData();

    formData.append("name", payload.name);
    formData.append("file", payload.file);

    const response = await apiClient.post<ApiResponse<ResumeProfile>>(
      API_ENDPOINTS.RESUME_PROFILES.BASE,
      formData,
      {
        timeout: API_CONFIG.aiApiTimeout,
      },
    );

    return response.data;
  },

  async getAll(): Promise<ApiResponse<ResumeProfile[]>> {
    const response = await apiClient.get<ApiResponse<ResumeProfile[]>>(
      API_ENDPOINTS.RESUME_PROFILES.BASE,
    );

    return response.data;
  },

  async delete(profileId: number): Promise<ApiResponse<null>> {
    const response = await apiClient.delete<ApiResponse<null>>(
      `${API_ENDPOINTS.RESUME_PROFILES.BASE}/${profileId}`,
    );

    return response.data;
  },
};
