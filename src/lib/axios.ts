import axios, { type AxiosInstance, type InternalAxiosRequestConfig } from 'axios';
import type { RefreshResponse } from '@/api/types';
import { clearAccessToken, getAccessToken, notifyAuthFailure, setAccessToken } from './token';

export { getErrorMessage } from './api-error';

declare module 'axios' {
  interface AxiosRequestConfig {
    _retry?: boolean;
  }
}

const SKIP_REFRESH = [
  '/auth/login',
  '/auth/register',
  '/auth/google',
  '/auth/telegram',
  '/auth/refresh',
];

function skipsRefresh(url: string | undefined): boolean {
  if (!url) return false;
  const path = url.split('?')[0] ?? '';
  return SKIP_REFRESH.some((skip) => path.endsWith(skip));
}

export const apiClient: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api/v1',
  withCredentials: true,
  timeout: 15_000,
});

apiClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

let refreshInFlight: Promise<string> | null = null;

function refreshAccessToken(): Promise<string> {
  if (refreshInFlight) return refreshInFlight;
  const pending = apiClient
    .post<RefreshResponse>('/auth/refresh')
    .then((response) => {
      setAccessToken(response.data.accessToken);
      return response.data.accessToken;
    })
    .finally(() => {
      refreshInFlight = null;
    });
  refreshInFlight = pending;
  return pending;
}

apiClient.interceptors.response.use(
  (response) => response,
  async (error: unknown) => {
    if (!axios.isAxiosError(error) || error.response?.status !== 401) {
      return Promise.reject(error);
    }

    const config = error.config;
    if (!config || config._retry || skipsRefresh(config.url)) {
      return Promise.reject(error);
    }

    config._retry = true;
    try {
      await refreshAccessToken();
    } catch {
      clearAccessToken();
      notifyAuthFailure();
      return Promise.reject(error);
    }

    return apiClient(config);
  },
);

export default apiClient;
