/**
 * Backend Service
 * Composes API calls with normalization for api.kahoot.uz
 * 
 * Single Responsibility: Orchestration of fetch + transform
 * 
 * NOTE: Leaderboard functions have been removed as the backend
 * leaderboard API is not yet fully functional.
 */

import type { StandardQuiz } from '@/types/quiz';
import type { AdapterResult, BackendCreateQuizRequest } from '../types';
import { 
  fetchBackendQuizzesRaw, 
  fetchBackendQuizByIdRaw,
  joinQuizRaw,
  createQuizRaw,
} from '../api';
import { normalizeBackendQuiz, normalizeBackendQuizzes, normalizeJoinQuizResponse } from '../normalizers';
import { MOCK_QUIZZES, getMockQuizById, MOCK_API_DELAY } from '../mocks';
import { BACKEND_CONFIG, BACKEND_ERROR_MESSAGES } from '../constants';

/**
 * Fetches and normalizes quizzes from backend
 * GET /quizzes - Returns list of quizzes without questions
 */
export const fetchBackendQuizzes = async (): Promise<AdapterResult<StandardQuiz[]>> => {
  try {
    const data = await fetchBackendQuizzesRaw();
    const quizzes = normalizeBackendQuizzes(data);

    return {
      data: quizzes,
      error: null,
      success: true,
    };
  } catch (error) {
    const errorMessage = error instanceof Error 
      ? error.message 
      : BACKEND_ERROR_MESSAGES.FETCH_FAILED;
    return {
      data: null,
      error: errorMessage,
      success: false,
    };
  }
};

/**
 * Fetches and normalizes a single quiz by ID
 * Note: This may not include questions - use joinQuiz with quizKey instead
 */
export const fetchBackendQuizById = async (
  id: string
): Promise<AdapterResult<StandardQuiz>> => {
  try {
    const data = await fetchBackendQuizByIdRaw(id);
    const quiz = normalizeBackendQuiz(data);

    return {
      data: quiz,
      error: null,
      success: true,
    };
  } catch (error) {
    const errorMessage = error instanceof Error 
      ? error.message 
      : BACKEND_ERROR_MESSAGES.FETCH_FAILED;
    return {
      data: null,
      error: errorMessage,
      success: false,
    };
  }
};

/**
 * Join a quiz using quiz_key
 * POST /quiz/join - Returns full quiz with questions
 * 
 * This is the primary way to get a playable quiz from the backend
 */
export const joinQuiz = async (
  quizKey: string
): Promise<AdapterResult<StandardQuiz>> => {
  try {
    const data = await joinQuizRaw(quizKey);
    // Use the new normalizer that handles the join response format
    const quiz = normalizeJoinQuizResponse(data);

    return {
      data: quiz,
      error: null,
      success: true,
    };
  } catch (error) {
    const errorMessage = error instanceof Error 
      ? error.message 
      : 'Failed to join quiz';
    return {
      data: null,
      error: errorMessage,
      success: false,
    };
  }
};

/**
 * Create quiz response type
 */
export interface CreateQuizResult {
  success: boolean;
  quizKey: string;
}

/**
 * Creates a new quiz
 * POST /quiz
 * Returns: {"success":true,"quizKey":"BV7AZY"}
 */
export const createBackendQuiz = async (
  quizData: BackendCreateQuizRequest
): Promise<AdapterResult<CreateQuizResult>> => {
  try {
    const response = await createQuizRaw(quizData);
    
    // Backend returns {success: true, quizKey: "..."}
    return {
      data: {
        success: response.success,
        quizKey: response.quizKey,
      },
      error: null,
      success: true,
    };
  } catch (error) {
    const errorMessage = error instanceof Error 
      ? error.message 
      : 'Failed to create quiz';
    return {
      data: null,
      error: errorMessage,
      success: false,
    };
  }
};

// ============================================================================
// LEADERBOARD FUNCTIONS - REMOVED
// ============================================================================
// The following leaderboard functions have been removed as the backend
// leaderboard API is not yet fully functional. When the backend is ready,
// uncomment and restore these functions.
//
// export const fetchLeaderboard = async (): Promise<AdapterResult<LeaderboardEntry[]>> => { ... };
// export const fetchQuizLeaderboard = async (quizId: string): Promise<AdapterResult<LeaderboardEntry[]>> => { ... };
// export const submitQuizResult = async (result: SubmitResultRequest): Promise<AdapterResult<{ message: string }>> => { ... };
// ============================================================================

/**
 * Mock implementation for development
 * Returns sample quizzes without API call
 */
export const fetchBackendQuizzesMock = async (): Promise<AdapterResult<StandardQuiz[]>> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, MOCK_API_DELAY));

  return {
    data: MOCK_QUIZZES,
    error: null,
    success: true,
  };
};

/**
 * Mock implementation for fetching single quiz
 */
export const fetchBackendQuizByIdMock = async (
  id: string
): Promise<AdapterResult<StandardQuiz>> => {
  await new Promise(resolve => setTimeout(resolve, MOCK_API_DELAY));

  const quiz = getMockQuizById(id);

  if (!quiz) {
    return {
      data: null,
      error: BACKEND_ERROR_MESSAGES.QUIZ_NOT_FOUND,
      success: false,
    };
  }

  return {
    data: quiz,
    error: null,
    success: true,
  };
};

/**
 * Smart fetch that uses mock or real API based on config
 */
export const fetchQuizzesAuto = async (): Promise<AdapterResult<StandardQuiz[]>> => {
  if (BACKEND_CONFIG.USE_REAL_API) {
    return fetchBackendQuizzes();
  }
  return fetchBackendQuizzesMock();
};

/**
 * Smart fetch by ID that uses mock or real API based on config
 */
export const fetchQuizByIdAuto = async (
  id: string
): Promise<AdapterResult<StandardQuiz>> => {
  if (BACKEND_CONFIG.USE_REAL_API) {
    return fetchBackendQuizById(id);
  }
  return fetchBackendQuizByIdMock(id);
};
