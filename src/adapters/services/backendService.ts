/**
 * Backend Service
 * Composes API calls with normalization for api.kahoot.uz
 * 
 * Single Responsibility: Orchestration of fetch + transform
 */

import type { StandardQuiz } from '@/types/quiz';
import type { AdapterResult, SubmitResultRequest, LeaderboardEntry } from '../types';
import { 
  fetchBackendQuizzesRaw, 
  fetchBackendQuizByIdRaw,
  fetchLeaderboardRaw,
  fetchLeaderboardByQuizRaw,
  submitQuizResultRaw,
  joinQuizRaw,
} from '../api';
import { normalizeBackendQuiz, normalizeBackendQuizzes } from '../normalizers';
import { MOCK_QUIZZES, getMockQuizById, MOCK_API_DELAY } from '../mocks';
import { BACKEND_CONFIG, BACKEND_ERROR_MESSAGES } from '../constants';

/**
 * Fetches and normalizes quizzes from backend
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
 * Join a quiz using quiz key
 */
export const joinQuiz = async (
  quizKey: string
): Promise<AdapterResult<StandardQuiz>> => {
  try {
    const data = await joinQuizRaw(quizKey);
    const quiz = normalizeBackendQuiz(data);

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
 * Get all leaderboard entries
 */
export const fetchLeaderboard = async (): Promise<AdapterResult<LeaderboardEntry[]>> => {
  try {
    const data = await fetchLeaderboardRaw();

    return {
      data: data,
      error: null,
      success: true,
    };
  } catch (error) {
    const errorMessage = error instanceof Error 
      ? error.message 
      : 'Failed to fetch leaderboard';
    return {
      data: null,
      error: errorMessage,
      success: false,
    };
  }
};

/**
 * Get leaderboard for a specific quiz
 */
export const fetchQuizLeaderboard = async (
  quizId: string
): Promise<AdapterResult<LeaderboardEntry[]>> => {
  try {
    const data = await fetchLeaderboardByQuizRaw(quizId);

    return {
      data: data,
      error: null,
      success: true,
    };
  } catch (error) {
    const errorMessage = error instanceof Error 
      ? error.message 
      : 'Failed to fetch quiz leaderboard';
    return {
      data: null,
      error: errorMessage,
      success: false,
    };
  }
};

/**
 * Submit quiz result to leaderboard
 */
export const submitQuizResult = async (
  result: SubmitResultRequest
): Promise<AdapterResult<{ message: string }>> => {
  try {
    const data = await submitQuizResultRaw(result);

    return {
      data: data,
      error: null,
      success: true,
    };
  } catch (error) {
    const errorMessage = error instanceof Error 
      ? error.message 
      : 'Failed to submit result';
    return {
      data: null,
      error: errorMessage,
      success: false,
    };
  }
};

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
