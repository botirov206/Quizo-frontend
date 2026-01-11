/**
 * Adapter Constants
 * Centralized configuration for all adapters
 */

// ============================================================================
// OpenTDB API Configuration
// ============================================================================

export const OPENTDB_CONFIG = {
  BASE_URL: 'https://opentdb.com',
  ENDPOINTS: {
    QUESTIONS: '/api.php',
    CATEGORIES: '/api_category.php',
    TOKEN: '/api_token.php',
  },
  DEFAULT_AMOUNT: 10,
  DEFAULT_TIME_LIMIT: 30, // seconds per question
  RATE_LIMIT_DELAY: 5500, // 5.5 seconds between requests
  RETRY_DELAY: 6000, // 6 seconds before retry on rate limit
  MAX_RETRIES: 3,
} as const;

// ============================================================================
// Backend API Configuration
// ============================================================================

export const BACKEND_CONFIG = {
  ENDPOINTS: {
    QUIZZES: '/quiz',
    QUIZ_BY_ID: (id: string) => `/quiz/${id}`,
    CREATE_QUIZ: '/quiz',
    JOIN_QUIZ: '/quiz/join',
    USER_QUIZZES: '/quiz/my',
    LEADERBOARD: '/leaderboard',
    LEADERBOARD_BY_QUIZ: (quizId: string) => `/leaderboard/${quizId}`,
    USER_PROFILE: (userId: string) => `/me/${userId}`,
  },
  // Backend is now ready!
  USE_REAL_API: true,
} as const;

// ============================================================================
// OpenTDB Response Codes
// ============================================================================

export const OPENTDB_RESPONSE_CODES = {
  SUCCESS: 0,
  NO_RESULTS: 1,
  INVALID_PARAMETER: 2,
  TOKEN_NOT_FOUND: 3,
  TOKEN_EMPTY: 4,
  RATE_LIMIT: 5,
} as const;

// ============================================================================
// Error Messages
// ============================================================================

export const OPENTDB_ERROR_MESSAGES: Record<number, string> = {
  [OPENTDB_RESPONSE_CODES.NO_RESULTS]: 'Not enough questions available for this query',
  [OPENTDB_RESPONSE_CODES.INVALID_PARAMETER]: 'Invalid API parameters provided',
  [OPENTDB_RESPONSE_CODES.TOKEN_NOT_FOUND]: 'Session token not found',
  [OPENTDB_RESPONSE_CODES.TOKEN_EMPTY]: 'All questions exhausted, please reset token',
  [OPENTDB_RESPONSE_CODES.RATE_LIMIT]: 'Rate limit exceeded. Please wait a moment and try again.',
};

export const HTTP_ERROR_MESSAGES: Record<number, string> = {
  429: 'Too many requests. OpenTDB allows 1 request per 5 seconds. Please wait a moment.',
  500: 'OpenTDB server error. Please try again later.',
  503: 'OpenTDB is temporarily unavailable. Please try again later.',
};

export const BACKEND_ERROR_MESSAGES = {
  FETCH_FAILED: 'Failed to fetch from backend',
  QUIZ_NOT_FOUND: 'Quiz not found',
  UNAUTHORIZED: 'Authentication required',
  NETWORK_ERROR: 'Network error. Please check your connection.',
} as const;

// ============================================================================
// Default Fetch Options
// ============================================================================

export const DEFAULT_FETCH_OPTIONS = {
  amount: 10,
  category: 0, // 0 = any category
  difficulty: 'medium' as const,
  type: 'multiple' as const,
};

// ============================================================================
// Category IDs for Multi-Quiz Fetching
// ============================================================================

export const FEATURED_CATEGORY_IDS = [9, 17, 18, 21, 22, 23] as const;
// 9: General, 17: Science, 18: Computers, 21: Sports, 22: Geography, 23: History

export const DIFFICULTY_LEVELS = ['easy', 'medium', 'hard'] as const;
