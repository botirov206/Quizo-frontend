/**
 * Backend API
 * Handles all HTTP requests to our custom backend
 * 
 * Single Responsibility: HTTP requests only, no data transformation
 */

import type { BackendQuizzesResponse, BackendQuizResponse } from '../types';
import { apiClient } from '@/lib/axios';
import { BACKEND_CONFIG } from '../constants';

/**
 * Fetches all quizzes from the backend
 * Returns raw API response
 */
export const fetchBackendQuizzesRaw = async (
  page: number = 1,
  pageSize: number = 20
): Promise<BackendQuizzesResponse> => {
  const response = await apiClient.get<BackendQuizzesResponse>(
    BACKEND_CONFIG.ENDPOINTS.QUIZZES,
    { params: { page, pageSize } }
  );
  return response.data;
};

/**
 * Fetches a single quiz by ID from the backend
 * Returns raw API response
 */
export const fetchBackendQuizByIdRaw = async (
  id: string
): Promise<BackendQuizResponse> => {
  const response = await apiClient.get<BackendQuizResponse>(
    BACKEND_CONFIG.ENDPOINTS.QUIZ_BY_ID(id)
  );
  return response.data;
};

/**
 * Fetches quizzes created by the current user
 * Returns raw API response
 */
export const fetchUserQuizzesRaw = async (): Promise<BackendQuizzesResponse> => {
  const response = await apiClient.get<BackendQuizzesResponse>(
    BACKEND_CONFIG.ENDPOINTS.USER_QUIZZES
  );
  return response.data;
};

/**
 * Creates a new quiz
 */
export const createQuizRaw = async <T>(quizData: T): Promise<BackendQuizResponse> => {
  const response = await apiClient.post<BackendQuizResponse>(
    BACKEND_CONFIG.ENDPOINTS.CREATE_QUIZ,
    quizData
  );
  return response.data;
};
