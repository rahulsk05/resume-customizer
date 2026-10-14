import axios from "axios";

import { API_CONFIG } from "@/config/api";

const apiClient = axios.create({
  baseURL: `${API_CONFIG.baseUrl}${API_CONFIG.version}`,
  timeout: API_CONFIG.timeout,
  withCredentials: true,
});

export default apiClient;
