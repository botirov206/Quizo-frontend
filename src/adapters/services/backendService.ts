/**
 * Backend Service
 * Composes API calls with normalization
 * 
 * Single Responsibility: Orchestration of fetch + transform
 */

import type { StandardQuiz } from '@/types/quiz';
import type { AdapterResult } from '../types';
import { fetchBackendQuizzesRaw, fetchBackendQuizByIdRaw } from '../api';
import { normalizeBackendQuiz, normalizeBackendQuizzes } from '../normalizers';
import { MOCK_QUIZZES, getMockQuizById, MOCK_API_DELAY } from '../mocks';
import { BACKEND_CONFIG, BACKEND_ERROR_MESSAGES } from '../constants';

/**
 * Fetches and normalizes quizzes from backend
 */
export const fetchBackendQuizzes = async (
  page: number = 1,
  pageSize: number = 20
): Promise<AdapterResult<StandardQuiz[]>> => {
  try {
    const data = await fetchBackendQuizzesRaw(page, pageSize);
    const quizzes = normalizeBackendQuizzes(data.quizzes);

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
    const quiz = normalizeBackendQuiz(data.quiz);

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
