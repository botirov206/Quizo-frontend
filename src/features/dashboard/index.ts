/**
 * Dashboard Feature Public API
 * Re-exports dashboard pages, stats widgets, and data hooks
 */

// Components
export { Dashboard } from './components/Dashboard';
export { QuizzesPage } from './components/QuizzesPage';
export { DashboardLayout } from './components/DashboardLayout';
export { QuizCard } from './components/QuizCard';
export { QuizGrid } from './components/QuizGrid';
export { HistoryPage } from './components/HistoryPage';
export { MyQuizzesList } from './components/MyQuizzesList';
export { RecentStudentResults } from './components/RecentStudentResults';

export { useStudentStats, useTeacherStats, useHistory } from './hooks/useAccountStats';

// Constants
export {
  MOCK_API_DELAY,
  MOCK_ERROR_RATE,
  QUIZ_GRID_COLUMNS,
  DIFFICULTY_COLORS,
  SOURCE_LABELS,
  QUERY_KEYS,
  DASHBOARD_ERROR_MESSAGES,
  SCORE_THRESHOLDS,
  SCORE_COLORS,
  RECENT_ACTIVITY_LIMIT,
  CHART_CONFIG,
  TIME_FORMAT,
} from './constants';

// Utilities
export {
  getDifficultyColor,
  getSourceBadge,
  getSourceBadgeColor,
  formatTimeLimit,
  getPerformanceLevel,
  formatTimeSpent,
  calculateAverageScore,
  formatNumber,
  getTrend,
  formatScorePercentage,
  getRelativeTime,
} from './utils';

// Types
export type { DashboardLayoutProps, StudentStats, QuizAttempt, ScoreDataPoint } from './types';