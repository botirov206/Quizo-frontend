/**
 * Backend API
 * Handles all HTTP requests to our custom backend (api.kahoot.uz)
 * 
 * Single Responsibility: HTTP requests only, no data transformation
 */

import type { 
  BackendQuizzesResponse, 
  BackendQuizResponse, 
  BackendQuiz,
  JoinQuizRequest,
  LeaderboardEntry,
  SubmitResultRequest 
} from '../types';
import { apiClient } from '@/lib/axios';
import { BACKEND_CONFIG } from '../constants';

/**
 * Fetches all quizzes from the backend
 * GET /quiz - Returns array of quizzes
 */
export const fetchBackendQuizzesRaw = async (): Promise<BackendQuizzesResponse> => {
  const response = await apiClient.get<BackendQuizzesResponse>(
    BACKEND_CONFIG.ENDPOINTS.QUIZZES
  );
  return response.data;
};

/**
 * Fetches a single quiz by ID from the backend
 * Note: Backend might return quiz directly or wrapped in object
 */
export const fetchBackendQuizByIdRaw = async (
  id: string
): Promise<BackendQuiz> => {
  const response = await apiClient.get<BackendQuiz | BackendQuizResponse>(
    BACKEND_CONFIG.ENDPOINTS.QUIZ_BY_ID(id)
  );
  // Handle both { quiz: {...} } and direct {...} responses
  const data = response.data;
  if ('quiz' in data) {
    return data.quiz;
  }
  return data;
};

/**
 * Fetches quizzes created by the current user
 */
export const fetchUserQuizzesRaw = async (): Promise<BackendQuizzesResponse> => {
  const response = await apiClient.get<BackendQuizzesResponse>(
    BACKEND_CONFIG.ENDPOINTS.USER_QUIZZES
  );
  return response.data;
};

/**
 * Creates a new quiz
 * POST /quiz
 */
export const createQuizRaw = async (quizData: {
  title: string;
  quizKey: string;
  questions: Array<{
    question: string;
    options: string[];
    correctAnswer: string;
  }>;
}): Promise<BackendQuizResponse> => {
  const response = await apiClient.post<BackendQuizResponse>(
    BACKEND_CONFIG.ENDPOINTS.CREATE_QUIZ,
    quizData
  );
  return response.data;
};

/**
 * Join a quiz using quiz key
 * POST /quiz/join
 */
export const joinQuizRaw = async (quizKey: string): Promise<BackendQuiz> => {
  const response = await apiClient.post<BackendQuiz>(
    BACKEND_CONFIG.ENDPOINTS.JOIN_QUIZ,
    { quizKey } as JoinQuizRequest
  );
  return response.data;
};

/**
 * Get all leaderboard entries
 * GET /leaderboard
 */
export const fetchLeaderboardRaw = async (): Promise<LeaderboardEntry[]> => {
  const response = await apiClient.get<LeaderboardEntry[]>(
    BACKEND_CONFIG.ENDPOINTS.LEADERBOARD
  );
  return response.data;
};

/**
 * Get leaderboard for a specific quiz
 * GET /leaderboard/{quizId}
 */
export const fetchLeaderboardByQuizRaw = async (
  quizId: string
): Promise<LeaderboardEntry[]> => {
  const response = await apiClient.get<LeaderboardEntry[]>(
    BACKEND_CONFIG.ENDPOINTS.LEADERBOARD_BY_QUIZ(quizId)
  );
  return response.data;
};

/**
 * Submit quiz result to leaderboard
 * POST /leaderboard
 */
export const submitQuizResultRaw = async (
  result: SubmitResultRequest
): Promise<{ message: string }> => {
  const response = await apiClient.post<{ message: string }>(
    BACKEND_CONFIG.ENDPOINTS.LEADERBOARD,
    result
  );
  return response.data;
};
