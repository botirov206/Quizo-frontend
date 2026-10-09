/**
 * Dashboard Utilities Public API
 * Re-exports quiz-card and stats formatting helpers
 */
export { getDifficultyColor, getSourceBadge, getSourceBadgeColor, formatTimeLimit } from './quizCardUtils';
export {
  getPerformanceLevel,
  formatTimeSpent,
  calculateAverageScore,
  formatNumber,
  getTrend,
  formatScorePercentage,
  getRelativeTime,
} from './statsUtils';
