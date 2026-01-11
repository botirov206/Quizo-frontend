/**
 * Normalizers Public API
 * Re-exports all normalizer functions
 */

// OpenTDB Normalizers
export {
  normalizeOpenTDBQuestion,
  normalizeOpenTDBQuestions,
  normalizeOpenTDBQuiz,
  generateQuizTitle,
  generateQuizDescription,
} from './opentdbNormalizer';

// Backend Normalizers
export {
  normalizeBackendQuestion,
  normalizeBackendQuestions,
  normalizeBackendQuiz,
  normalizeBackendQuizzes,
  normalizeBackendQuizListItem,
  normalizeJoinQuizResponse,
} from './backendNormalizer';
