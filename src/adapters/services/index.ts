/**
 * Services Public API
 */

// OpenTDB Service
export {
  fetchOpenTDBQuiz,
  fetchOpenTDBCategories,
  fetchMultipleOpenTDBQuizzes,
} from './opentdbService';

// Backend Service (api.kahoot.uz)
export {
  fetchBackendQuizzes,
  fetchBackendQuizById,
  fetchBackendQuizzesMock,
  fetchBackendQuizByIdMock,
  fetchQuizzesAuto,
  fetchQuizByIdAuto,
  joinQuiz,
  createBackendQuiz,
  type CreateQuizResult,
  // Leaderboard functions removed - backend not ready
  // fetchLeaderboard,
  // fetchQuizLeaderboard,
  // submitQuizResult,
} from './backendService';
