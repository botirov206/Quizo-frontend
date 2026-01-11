// Public API for dashboard feature

// Components
export { Dashboard } from './components/Dashboard';
export { QuizzesPage } from './components/QuizzesPage';
export { DashboardLayout } from './components/DashboardLayout';
export { QuizCard } from './components/QuizCard';
export { QuizGrid } from './components/QuizGrid';
export { StatCard } from './components/StatCard';
export { ScoreChart } from './components/ScoreChart';
export { RecentActivity } from './components/RecentActivity';
export { QuickActions } from './components/QuickActions';

// Teacher-specific components
export { TeacherDashboard } from './components/TeacherDashboard';
export { StudentDashboard } from './components/StudentDashboard';
export { TeacherStats } from './components/TeacherStats';
export { MyQuizzesList } from './components/MyQuizzesList';
export { RecentStudentResults } from './components/RecentStudentResults';
export { TeacherQuickActions } from './components/TeacherQuickActions';

// Filters (currently unused, may use in future)
export { SourceFilter, SOURCE_FILTER_OPTIONS } from './components/filters';
export type { SourceFilterOption } from './components/filters';

// Hooks
export { useQuizzes, useQuizById } from './hooks/useQuizzes';
export { useStudentStats } from './hooks/useStudentStats';
export { useRecentActivity } from './hooks/useRecentActivity';
export { useTeacherStats } from './hooks/useTeacherStats';

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
export type { TeacherStats as TeacherStatsType, TeacherQuiz, StudentResult } from './hooks/useTeacherStats';