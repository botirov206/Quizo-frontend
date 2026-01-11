/**
 * Dashboard Feature Constants
 * Centralized configuration for dashboard-related values
 */

// API simulation settings
export const MOCK_API_DELAY = 800;
export const MOCK_ERROR_RATE = 0.05; // 5% chance of error for testing

// Grid layout configuration
export const QUIZ_GRID_COLUMNS = {
  MOBILE: 1,
  TABLET: 2,
  DESKTOP: 3,
} as const;

// Difficulty colors for quiz cards
export const DIFFICULTY_COLORS = {
  easy: 'text-green-600 bg-green-50',
  medium: 'text-yellow-600 bg-yellow-50',
  hard: 'text-red-600 bg-red-50',
  default: 'text-gray-600 bg-gray-50',
} as const;

// Source badge labels
export const SOURCE_LABELS = {
  opentdb: 'OpenTDB',
  custom: 'Custom',
} as const;

// Query keys for TanStack Query
export const QUERY_KEYS = {
  QUIZZES: ['quizzes'] as const,
  QUIZ_BY_ID: (id: string) => ['quiz', id] as const,
  USER_QUIZZES: (userId: string) => ['quizzes', 'user', userId] as const,
  STUDENT_STATS: ['student', 'stats'] as const,
  RECENT_ACTIVITY: ['student', 'recent-activity'] as const,
  TEACHER_STATS: ['teacher', 'stats'] as const,
  CLASSROOMS: ['classrooms'] as const,
  CLASSROOM_BY_ID: (id: string) => ['classroom', id] as const,
} as const;

// Error messages
export const DASHBOARD_ERROR_MESSAGES = {
  FETCH_QUIZZES_FAILED: 'Failed to fetch quizzes',
  NO_QUIZZES_AVAILABLE: 'No quizzes available',
  FETCH_STATS_FAILED: 'Failed to load student statistics',
  FETCH_ACTIVITY_FAILED: 'Failed to load recent activity',
} as const;

// Score performance thresholds
export const SCORE_THRESHOLDS = {
  EXCELLENT: 90,
  GOOD: 75,
  AVERAGE: 60,
  NEEDS_IMPROVEMENT: 50,
} as const;

// Score color mappings based on performance
export const SCORE_COLORS = {
  EXCELLENT: 'text-green-600 bg-green-50 border-green-200',
  GOOD: 'text-blue-600 bg-blue-50 border-blue-200',
  AVERAGE: 'text-yellow-600 bg-yellow-50 border-yellow-200',
  POOR: 'text-red-600 bg-red-50 border-red-200',
} as const;

// Recent activity display limits
export const RECENT_ACTIVITY_LIMIT = 5;

// Chart configuration
export const CHART_CONFIG = {
  MAX_DATA_POINTS: 10,
  HEIGHT: 200,
  GRID_COLOR: '#e5e7eb',
  LINE_COLOR: '#3b82f6',
  POINT_COLOR: '#2563eb',
} as const;

// Time formatting
export const TIME_FORMAT = {
  HOURS_THRESHOLD: 60, // minutes
  SECONDS_IN_MINUTE: 60,
  MINUTES_IN_HOUR: 60,
} as const;
