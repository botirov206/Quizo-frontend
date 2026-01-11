/**
 * Adapters Public API
 * Central export point for all adapter functionality
 * 
 * The Adapter Pattern ensures that the UI layer never speaks directly
 * to external APIs. All data is normalized to StandardQuiz format.
 * 
 * Architecture:
 * ┌─────────────────────────────────────────────────────────────────┐
 * │                        ADAPTERS LAYER                          │
 * ├─────────────────────────────────────────────────────────────────┤
 * │  constants/    - Configuration, endpoints, error messages      │
 * │  api/          - Raw HTTP fetch functions (no transformation)  │
 * │  normalizers/  - Data transformation (API → StandardQuiz)      │
 * │  mocks/        - Mock data for development                     │
 * │  services/     - Composed fetch + transform operations         │
 * │  quizService   - Unified multi-source orchestration            │
 * └─────────────────────────────────────────────────────────────────┘
 */

// ============================================================================
// Unified Quiz Service (Main Entry Point)
// ============================================================================

export {
  fetchAllQuizzes,
  fetchQuizById,
  fetchQuizzesBySource,
  fetchRandomQuiz,
  type QuizSource,
  type FetchAllQuizzesOptions,
  BACKEND_CONFIG,
} from './quizService';

// ============================================================================
// Individual Services
// ============================================================================

export {
  // OpenTDB
  fetchOpenTDBQuiz,
  fetchOpenTDBCategories,
  fetchMultipleOpenTDBQuizzes,
  // Backend
  fetchBackendQuizzes,
  fetchBackendQuizById,
  fetchBackendQuizzesMock,
  fetchQuizzesAuto,
  fetchQuizByIdAuto,
} from './services';

// ============================================================================
// Raw API Functions (for advanced use cases)
// ============================================================================

export {
  buildOpenTDBUrl,
  fetchOpenTDBRaw,
  fetchOpenTDBCategoriesRaw,
  requestOpenTDBToken,
  resetOpenTDBToken,
  fetchBackendQuizzesRaw,
  fetchBackendQuizByIdRaw,
} from './api';

// ============================================================================
// Normalizers (for custom transformations)
// ============================================================================

export {
  normalizeOpenTDBQuestion,
  normalizeOpenTDBQuestions,
  normalizeOpenTDBQuiz,
  normalizeBackendQuestion,
  normalizeBackendQuestions,
  normalizeBackendQuiz,
  normalizeBackendQuizzes,
} from './normalizers';

// ============================================================================
// Constants
// ============================================================================

export {
  OPENTDB_CONFIG,
  OPENTDB_RESPONSE_CODES,
  OPENTDB_ERROR_MESSAGES,
  BACKEND_ERROR_MESSAGES,
  DEFAULT_FETCH_OPTIONS,
  FEATURED_CATEGORY_IDS,
  DIFFICULTY_LEVELS,
} from './constants';

// ============================================================================
// Mock Data
// ============================================================================

export {
  MOCK_QUIZZES,
  getMockQuizById,
  MOCK_API_DELAY,
} from './mocks';

// ============================================================================
// Utilities
// ============================================================================

export {
  decodeHtmlEntities,
  decodeHtmlEntitiesSSR,
  shuffleArray,
  generateQuestionId,
  generateOpenTDBQuizId,
  mapDifficulty,
  mapQuestionType,
  cleanCategoryName,
} from './utils';

// ============================================================================
// Types
// ============================================================================

export type {
  // OpenTDB Types
  OpenTDBResponse,
  OpenTDBQuestion,
  OpenTDBCategory,
  OpenTDBCategoriesResponse,
  OpenTDBResponseCode,
  OpenTDBDifficulty,
  OpenTDBType,

  // Backend Types
  BackendQuiz,
  BackendQuestion,
  BackendQuizzesResponse,
  BackendQuizResponse,

  // Adapter Types
  QuizFetchOptions,
  AdapterResult,
  QuizAdapter,

  // Re-exports
  StandardQuiz,
  StandardQuestion,
} from './types';
