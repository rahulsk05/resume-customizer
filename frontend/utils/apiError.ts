import axios from "axios";
import type { ApiErrorResponse } from "@/types/api";

export function getApiErrorMessage(
  error: unknown,
  fallbackMessage: string,
): string {
  if (axios.isAxiosError<ApiErrorResponse>(error)) {
    const response = error.response?.data;

    if (response?.success === false && response.message) {
      return response.message;
    }
  }

  return fallbackMessage;
}
