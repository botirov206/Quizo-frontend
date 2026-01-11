/**
 * Unified Quiz Service
 * High-level API for fetching quizzes from any source
 * 
 * Single Responsibility: Source orchestration and combination
 */

import type { StandardQuiz } from '@/types/quiz';
import type { AdapterResult, QuizFetchOptions } from './types';
import {
  fetchOpenTDBQuiz,
  fetchQuizzesAuto,
  fetchQuizByIdAuto,
} from './services';
import { BACKEND_CONFIG } from './constants';

// ============================================================================
// Types
// ============================================================================

export type QuizSource = 'all' | 'opentdb' | 'custom';

export interface FetchAllQuizzesOptions {
  source?: QuizSource;
  opentdbOptions?: QuizFetchOptions;
  includeOpenTDB?: boolean;
  includeBackend?: boolean;
}

// ============================================================================
// Main Service Functions
// ============================================================================

/**
 * Fetches quizzes from both sources and combines them
 */
export const fetchAllQuizzes = async (
  options: FetchAllQuizzesOptions = {}
): Promise<AdapterResult<StandardQuiz[]>> => {
  const {
    source = 'all',
    opentdbOptions = { amount: 10 },
    includeOpenTDB = source === 'all' || source === 'opentdb',
    includeBackend = source === 'all' || source === 'custom',
  } = options;

  const allQuizzes: StandardQuiz[] = [];
  const errors: string[] = [];

  // Fetch from OpenTDB
  if (includeOpenTDB) {
    const result = await fetchFromOpenTDB(opentdbOptions);
    if (result.quizzes.length > 0) {
      allQuizzes.push(...result.quizzes);
    }
    if (result.error) {
      errors.push(result.error);
    }
  }

  // Fetch from Backend
  if (includeBackend) {
    const result = await fetchFromBackend();
    if (result.quizzes.length > 0) {
      allQuizzes.push(...result.quizzes);
    }
    if (result.error) {
      errors.push(result.error);
    }
  }

  // Handle complete failure
  if (allQuizzes.length === 0 && errors.length > 0) {
    return {
      data: null,
      error: errors.join('; '),
      success: false,
    };
  }

  // Sort by creation date (newest first)
  sortQuizzesByDate(allQuizzes);

  return {
    data: allQuizzes,
    error: errors.length > 0 ? errors.join('; ') : null,
    success: true,
  };
};

/**
 * Fetches a single quiz by ID
 * Determines source based on ID prefix
 */
export const fetchQuizById = async (
  id: string
): Promise<AdapterResult<StandardQuiz>> => {
  const isOpenTDB = id.startsWith('opentdb_');

  if (isOpenTDB) {
    // OpenTDB doesn't have quiz IDs, fetch a new one
    return fetchOpenTDBQuiz();
  }

  return fetchQuizByIdAuto(id);
};

/**
 * Fetches quizzes filtered by source
 */
export const fetchQuizzesBySource = async (
  source: QuizSource
): Promise<AdapterResult<StandardQuiz[]>> => {
  return fetchAllQuizzes({ source });
};

/**
 * Fetches a random OpenTDB quiz
 */
export const fetchRandomQuiz = async (
  options?: QuizFetchOptions
): Promise<AdapterResult<StandardQuiz>> => {
  return fetchOpenTDBQuiz(options);
};

// ============================================================================
// Private Helpers
// ============================================================================

interface FetchResult {
  quizzes: StandardQuiz[];
  error: string | null;
}

const fetchFromOpenTDB = async (
  options: QuizFetchOptions
): Promise<FetchResult> => {
  try {
    const result = await fetchOpenTDBQuiz(options);
    if (result.success && result.data) {
      return { quizzes: [result.data], error: null };
    }
    return { quizzes: [], error: `OpenTDB: ${result.error}` };
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Unknown error';
    return { quizzes: [], error: `OpenTDB: ${msg}` };
  }
};

const fetchFromBackend = async (): Promise<FetchResult> => {
  try {
    const result = await fetchQuizzesAuto();
    if (result.success && result.data) {
      return { quizzes: result.data, error: null };
    }
    return { quizzes: [], error: `Backend: ${result.error}` };
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Unknown error';
    return { quizzes: [], error: `Backend: ${msg}` };
  }
};

const sortQuizzesByDate = (quizzes: StandardQuiz[]): void => {
  quizzes.sort((a, b) => {
    const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
    const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
    return dateB - dateA;
  });
};

// ============================================================================
// Configuration Export
// ============================================================================

export { BACKEND_CONFIG };
