/**
 * OpenTDB Service
 * Composes API calls with normalization
 * 
 * Single Responsibility: Orchestration of fetch + transform
 */

import type { StandardQuiz } from '@/types/quiz';
import type { AdapterResult, QuizFetchOptions, OpenTDBCategory } from '../types';
import { fetchOpenTDBRaw, fetchOpenTDBCategoriesRaw } from '../api';
import { normalizeOpenTDBQuiz } from '../normalizers';
import {
  OPENTDB_RESPONSE_CODES,
  OPENTDB_ERROR_MESSAGES,
  DEFAULT_FETCH_OPTIONS,
  FEATURED_CATEGORY_IDS,
  DIFFICULTY_LEVELS,
  OPENTDB_CONFIG,
} from '../constants';

/**
 * Fetches and normalizes a quiz from OpenTDB
 */
export const fetchOpenTDBQuiz = async (
  options: QuizFetchOptions = {}
): Promise<AdapterResult<StandardQuiz>> => {
  const mergedOptions = { ...DEFAULT_FETCH_OPTIONS, ...options };

  try {
    const data = await fetchOpenTDBRaw(mergedOptions);

    // Handle API response codes
    if (data.response_code !== OPENTDB_RESPONSE_CODES.SUCCESS) {
      return {
        data: null,
        error: OPENTDB_ERROR_MESSAGES[data.response_code] || 'Unknown API error',
        success: false,
      };
    }

    if (!data.results || data.results.length === 0) {
      return {
        data: null,
        error: 'No questions returned from API',
        success: false,
      };
    }

    // Normalize to StandardQuiz
    const quiz = normalizeOpenTDBQuiz(data.results, mergedOptions);

    return {
      data: quiz,
      error: null,
      success: true,
    };
  } catch (error) {
    const errorMessage = error instanceof Error 
      ? error.message 
      : 'Failed to fetch from OpenTDB';
    return {
      data: null,
      error: errorMessage,
      success: false,
    };
  }
};

/**
 * Fetches OpenTDB categories
 */
export const fetchOpenTDBCategories = async (): Promise<AdapterResult<OpenTDBCategory[]>> => {
  try {
    const data = await fetchOpenTDBCategoriesRaw();

    return {
      data: data.trivia_categories,
      error: null,
      success: true,
    };
  } catch (error) {
    const errorMessage = error instanceof Error 
      ? error.message 
      : 'Failed to fetch categories';
    return {
      data: null,
      error: errorMessage,
      success: false,
    };
  }
};

/**
 * Fetches multiple quizzes from different categories
 * Useful for populating dashboard with varied content
 */
export const fetchMultipleOpenTDBQuizzes = async (
  count: number = 3,
  questionsPerQuiz: number = 5
): Promise<AdapterResult<StandardQuiz[]>> => {
  const quizzes: StandardQuiz[] = [];
  const errors: string[] = [];

  for (let i = 0; i < count; i++) {
    const category = FEATURED_CATEGORY_IDS[i % FEATURED_CATEGORY_IDS.length];
    const difficulty = DIFFICULTY_LEVELS[i % DIFFICULTY_LEVELS.length];

    // Respect rate limiting
    if (i > 0) {
      await new Promise(resolve => setTimeout(resolve, OPENTDB_CONFIG.RATE_LIMIT_DELAY));
    }

    const result = await fetchOpenTDBQuiz({
      amount: questionsPerQuiz,
      category,
      difficulty,
    });

    if (result.success && result.data) {
      quizzes.push(result.data);
    } else if (result.error) {
      errors.push(result.error);
    }
  }

  if (quizzes.length === 0 && errors.length > 0) {
    return {
      data: null,
      error: errors.join('; '),
      success: false,
    };
  }

  return {
    data: quizzes,
    error: errors.length > 0 ? `Partial success: ${errors.join('; ')}` : null,
    success: true,
  };
};
