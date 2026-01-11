/**
 * Axios Instance Configuration
 * Centralized HTTP client with interceptors for auth and error handling
 */

import axios, { type AxiosInstance, type AxiosError, type InternalAxiosRequestConfig } from 'axios';

// ============================================================================
// Configuration
// ============================================================================

const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000',
  TIMEOUT: 10000, // 10 seconds
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000, // 1 second
} as const;

// ============================================================================
// Axios Instance
// ============================================================================

/**
 * Main API client for backend requests
 * Includes auth token injection and error handling
 */
export const apiClient: AxiosInstance = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ============================================================================
// Request Interceptor
// ============================================================================

apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Inject auth token from localStorage
    const token = localStorage.getItem('token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// ============================================================================
// Response Interceptor
// ============================================================================

apiClient.interceptors.response.use(
  (response) => {
    // Return successful responses as-is
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config;

    // Handle 401 Unauthorized - Clear auth and redirect to login
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      // Redirect to login if not already there
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
      return Promise.reject(error);
    }

    // Handle 403 Forbidden
    if (error.response?.status === 403) {
      console.error('Access denied:', error.response.data);
      return Promise.reject(new Error('You do not have permission to access this resource'));
    }

    // Handle 404 Not Found
    if (error.response?.status === 404) {
      return Promise.reject(new Error('Resource not found'));
    }

    // Handle 500 Server Error
    if (error.response?.status === 500) {
      return Promise.reject(new Error('Server error. Please try again later.'));
    }

    // Handle network errors
    if (!error.response) {
      return Promise.reject(new Error('Network error. Please check your connection.'));
    }

    // Retry logic for specific errors (optional)
    if (originalRequest && !originalRequest.headers['x-retry']) {
      originalRequest.headers['x-retry'] = 'true';
      // Could implement retry logic here
    }

    return Promise.reject(error);
  }
);

// ============================================================================
// OpenTDB Client (No Auth Required)
// ============================================================================

/**
 * Separate client for OpenTDB API requests
 * No auth headers, different base URL
 */
export const openTDBClient: AxiosInstance = axios.create({
  baseURL: 'https://opentdb.com',
  timeout: 15000, // OpenTDB can be slow
  headers: {
    'Content-Type': 'application/json',
  },
});

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Type-safe error message extraction
 */
export const getErrorMessage = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    // Server responded with error
    if (error.response?.data?.message) {
      return error.response.data.message as string;
    }
    if (error.response?.data?.error) {
      return error.response.data.error as string;
    }
    if (error.message) {
      return error.message;
    }
  }
  
  if (error instanceof Error) {
    return error.message;
  }
  
  return 'An unexpected error occurred';
};

/**
 * Check if error is a network error
 */
export const isNetworkError = (error: unknown): boolean => {
  return axios.isAxiosError(error) && !error.response;
};

/**
 * Check if error is an auth error (401/403)
 */
export const isAuthError = (error: unknown): boolean => {
  if (axios.isAxiosError(error) && error.response) {
    return error.response.status === 401 || error.response.status === 403;
  }
  return false;
};

// ============================================================================
// Exports
// ============================================================================

export { API_CONFIG };
export default apiClient;
