import { API_ENDPOINTS } from "@/constants/apiEndpoints";
import apiClient from "@/services/apiClient";
import type { ApiResponse } from "@/types/api";
import type { LoginRequest, SignupRequest, User } from "@/types/auth";

export const authService = {
  async login(payload: LoginRequest): Promise<ApiResponse<User>> {
    const response = await apiClient.post<ApiResponse<User>>(
      API_ENDPOINTS.AUTH.LOGIN,
      payload,
    );

    return response.data;
  },

  async signup(payload: SignupRequest): Promise<ApiResponse<User>> {
    const response = await apiClient.post<ApiResponse<User>>(
      API_ENDPOINTS.AUTH.SIGNUP,
      payload,
    );

    return response.data;
  },

  async logout(): Promise<ApiResponse<null>> {
    const response = await apiClient.post<ApiResponse<null>>(
      API_ENDPOINTS.AUTH.LOGOUT,
    );

    return response.data;
  },

  async me(): Promise<ApiResponse<User>> {
    const response = await apiClient.get<ApiResponse<User>>(
      API_ENDPOINTS.AUTH.ME,
    );

    return response.data;
  },
};
