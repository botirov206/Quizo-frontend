/**
 * Backend API
 * Handles all HTTP requests to our custom backend (api.kahoot.uz)
 * 
 * Single Responsibility: HTTP requests only, no data transformation
 * 
 * Endpoints (legacy api.kahoot.uz):
 * - GET /quiz lists quizzes (no questions)
 * - POST /quiz creates a quiz
 * - POST /quiz/join joins a quiz with quiz_key
 */

import type { 
  BackendQuizzesResponse, 
  BackendQuizResponse, 
  BackendQuiz,
  BackendJoinQuizResponse,
  BackendCreateQuizRequest,
  BackendCreateQuizResponse,
  JoinQuizRequest,
} from '../types';
import { apiClient } from '@/lib/axios';
import { BACKEND_CONFIG } from '../constants';

/**
 * Fetches all quizzes from the backend
 * GET /quiz — returns array of quizzes without questions
 */
export const fetchBackendQuizzesRaw = async (): Promise<BackendQuizzesResponse> => {
  const response = await apiClient.get<BackendQuizzesResponse>(
    BACKEND_CONFIG.ENDPOINTS.QUIZZES
  );
  return response.data;
};

/**
 * Fetches a single quiz by ID from the backend
 * Note: This endpoint may not be fully functional in current backend
 * Use joinQuizRaw with quiz_key instead for getting full quiz with questions
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
 * NOTE: May not be implemented in current backend
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
 * 
 * Request format:
 * {
 *   "title": "JavaScript Basics",
 *   "description": "hello world",
 *   "category": "Programming",
 *   "difficulty": "easy",
 *   "time_limit": 60,
 *   "questions": [
 *     {
 *       "question": "What is JS?",
 *       "options": ["Language", "Framework", "DB"],
 *       "correctAnswer": "Language"
 *     }
 *   ]
 * }
 */
export const createQuizRaw = async (quizData: BackendCreateQuizRequest): Promise<BackendCreateQuizResponse> => {
  const response = await apiClient.post<BackendCreateQuizResponse>(
    BACKEND_CONFIG.ENDPOINTS.CREATE_QUIZ,
    quizData
  );
  return response.data;
};

/**
 * Join a quiz using quiz_key
 * POST /quiz/join
 * 
 * Request: { quizKey: "V8QLAP" }
 * 
 * Response:
 * {
 *   "quiz": { id, title, description, category, difficulty, time_limit, quiz_key },
 *   "questions": [{ id, question, options, correct_answer }]
 * }
 */
export const joinQuizRaw = async (quizKey: string): Promise<BackendJoinQuizResponse> => {
  const response = await apiClient.post<BackendJoinQuizResponse>(
    BACKEND_CONFIG.ENDPOINTS.JOIN_QUIZ,
    { quizKey } as JoinQuizRequest
  );
  return response.data;
};

// ============================================================================
// LEADERBOARD FUNCTIONS - REMOVED
// ============================================================================
// The following leaderboard functions have been removed as the backend
// leaderboard API is not yet fully functional. When the backend is ready,
// uncomment and restore these functions.
//
// export const fetchLeaderboardRaw = async (): Promise<LeaderboardEntry[]> => { ... };
// export const fetchLeaderboardByQuizRaw = async (quizId: string): Promise<LeaderboardEntry[]> => { ... };
// export const submitQuizResultRaw = async (result: SubmitResultRequest): Promise<{ message: string }> => { ... };
// ============================================================================
