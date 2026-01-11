/**
 * Services Public API
 */

// OpenTDB Service
export {
  fetchOpenTDBQuiz,
  fetchOpenTDBCategories,
  fetchMultipleOpenTDBQuizzes,
} from './opentdbService';

// Backend Service
export {
  fetchBackendQuizzes,
  fetchBackendQuizById,
  fetchBackendQuizzesMock,
  fetchBackendQuizByIdMock,
  fetchQuizzesAuto,
  fetchQuizByIdAuto,
} from './backendService';
