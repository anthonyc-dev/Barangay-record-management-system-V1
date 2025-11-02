import axios from "axios";

// Base API configuration
export const API_BASE_URL = "http://localhost:8000";
export const API_PREFIX = "/api";

// Create axios instance with default config
export const apiClient = axios.create({
  baseURL: `${API_BASE_URL}${API_PREFIX}`,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 30000, // 30 seconds
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("auth_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response) {
      // Handle 401 Unauthorized - redirect to login
      if (error.response.status === 401) {
        localStorage.removeItem("auth_token");
        localStorage.removeItem("user_info");
        localStorage.removeItem("admin_info");
        window.location.href = "/";
      }

      // Handle 403 Forbidden
      if (error.response.status === 403) {
        console.error("Access forbidden");
      }

      // Return formatted error response
      return Promise.reject({
        status: error.response.status,
        message: error.response.data.message || "An error occurred",
        errors: error.response.data.errors || null,
        data: error.response.data,
      });
    } else if (error.request) {
      // Request made but no response received
      return Promise.reject({
        status: 0,
        message: "No response from server. Please check your connection.",
        errors: null,
      });
    } else {
      // Something else happened
      return Promise.reject({
        status: 0,
        message: error.message || "An unexpected error occurred",
        errors: null,
      });
    }
  }
);

export default apiClient;
