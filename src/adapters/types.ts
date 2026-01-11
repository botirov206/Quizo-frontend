/**
 * Adapter Types
 * Defines interfaces for external API responses and adapter contracts
 */

import type { StandardQuiz, StandardQuestion } from '@/types/quiz';

// ============================================================================
// OpenTDB API Types
// ============================================================================

export type OpenTDBResponseCode = 0 | 1 | 2 | 3 | 4 | 5;

export const OPENTDB_RESPONSE_CODES = {
  SUCCESS: 0,
  NO_RESULTS: 1,
  INVALID_PARAMETER: 2,
  TOKEN_NOT_FOUND: 3,
  TOKEN_EMPTY: 4,
  RATE_LIMIT: 5,
} as const;

export type OpenTDBDifficulty = 'easy' | 'medium' | 'hard';
export type OpenTDBType = 'multiple' | 'boolean';

export interface OpenTDBQuestion {
  type: OpenTDBType;
  difficulty: OpenTDBDifficulty;
  category: string;
  question: string; // HTML encoded
  correct_answer: string; // HTML encoded
  incorrect_answers: string[]; // HTML encoded
}

export interface OpenTDBResponse {
  response_code: OpenTDBResponseCode;
  results: OpenTDBQuestion[];
}

export interface OpenTDBCategory {
  id: number;
  name: string;
}

export interface OpenTDBCategoriesResponse {
  trivia_categories: OpenTDBCategory[];
}

// ============================================================================
// Backend API Types (Custom Backend - api.kahoot.uz)
// ============================================================================

/**
 * Backend question format from api.kahoot.uz
 * Format: { id, question, options: string[], correct_answer }
 * 
 * NOTE: Backend uses snake_case (correct_answer), we normalize to camelCase
 */
export interface BackendQuestion {
  id?: string;
  question: string;
  options: string[];
  correct_answer?: string;  // Backend uses snake_case
  correctAnswer?: string;   // For creation request (camelCase)
}

/**
 * Backend quiz format from api.kahoot.uz (list response)
 * GET /quizzes returns quizzes WITHOUT questions
 * Format: { id, title, description, category, difficulty, time_limit, quiz_key }
 */
export interface BackendQuizListItem {
  id: string;
  title: string;
  description?: string;
  category?: string;
  difficulty?: 'easy' | 'medium' | 'hard';
  time_limit?: number;  // Backend uses snake_case
  quiz_key: string;     // Backend uses snake_case
}

/**
 * Backend quiz format from api.kahoot.uz (full quiz with questions)
 * POST /quiz/join returns the full quiz with questions
 */
export interface BackendQuiz {
  id: string;
  title: string;
  description?: string;
  category?: string;
  difficulty?: 'easy' | 'medium' | 'hard';
  time_limit?: number;    // Backend uses snake_case
  quiz_key: string;       // Backend uses snake_case
  questions?: BackendQuestion[];
  // Legacy support (kept for backwards compatibility)
  quizKey?: string;
  timeLimit?: number;
  createdBy?: {
    id: string;
    name: string;
  };
  createdAt?: string;
  updatedAt?: string;
}

/**
 * POST /quiz/join response
 * Returns quiz metadata and questions separately
 */
export interface BackendJoinQuizResponse {
  quiz: BackendQuizListItem;
  questions: BackendQuestion[];
}

/**
 * GET /quizzes response - returns array of quiz list items (no questions)
 */
export type BackendQuizzesResponse = BackendQuizListItem[];

/**
 * POST /quiz request body
 */
export interface BackendCreateQuizRequest {
  title: string;
  description: string;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
  time_limit: number;
  questions: Array<{
    question: string;
    options: string[];
    correctAnswer: string;
  }>;
}

/**
 * POST /quiz response
 * Backend returns: {"success":true,"quizKey":"BV7AZY"}
 */
export interface BackendCreateQuizResponse {
  success: boolean;
  quizKey: string;
}

/**
 * Legacy quiz response (for fetching quiz details)
 */
export interface BackendQuizResponse {
  quiz: BackendQuiz;
  message?: string;
}

/**
 * POST /quiz/join request
 */
export interface JoinQuizRequest {
  quizKey: string;
}

/**
 * Leaderboard entry format
 */
export interface LeaderboardEntry {
  userId: string;
  quizId: string;
  score: number;
  time: number;
  userName?: string;
  createdAt?: string;
}

/**
 * POST /leaderboard request
 */
export interface SubmitResultRequest {
  userId: string;
  quizId: string;
  score: number;
  time: number;
}

// ============================================================================
// Adapter Contracts
// ============================================================================

export interface QuizFetchOptions {
  amount?: number;
  category?: number;
  difficulty?: OpenTDBDifficulty;
  type?: OpenTDBType;
}

export interface AdapterResult<T> {
  data: T | null;
  error: string | null;
  success: boolean;
}

export interface QuizAdapter {
  fetchQuizzes: (options?: QuizFetchOptions) => Promise<AdapterResult<StandardQuiz[]>>;
  fetchQuizById?: (id: string) => Promise<AdapterResult<StandardQuiz>>;
}

// ============================================================================
// Re-exports for convenience
// ============================================================================

export type { StandardQuiz, StandardQuestion };
