/**
 * Statistics Utility Functions
 * Helpers for calculating and formatting student statistics
 */

import { SCORE_THRESHOLDS, TIME_FORMAT } from '../constants';

/**
 * Determines performance level based on score
 * @param score - Score percentage (0-100)
 * @returns Performance level string
 */
export const getPerformanceLevel = (score: number): 'EXCELLENT' | 'GOOD' | 'AVERAGE' | 'POOR' => {
  if (score >= SCORE_THRESHOLDS.EXCELLENT) return 'EXCELLENT';
  if (score >= SCORE_THRESHOLDS.GOOD) return 'GOOD';
  if (score >= SCORE_THRESHOLDS.AVERAGE) return 'AVERAGE';
  return 'POOR';
};

/**
 * Formats time in minutes to human-readable string
 * @param minutes - Total minutes
 * @returns Formatted time string (e.g., "2h 30m" or "45m")
 */
export const formatTimeSpent = (minutes: number): string => {
  if (minutes < TIME_FORMAT.HOURS_THRESHOLD) {
    return `${minutes}m`;
  }
  
  const hours = Math.floor(minutes / TIME_FORMAT.MINUTES_IN_HOUR);
  const remainingMinutes = minutes % TIME_FORMAT.MINUTES_IN_HOUR;
  
  return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`;
};

/**
 * Calculates average score from multiple attempts
 * @param scores - Array of score percentages
 * @returns Average score rounded to 1 decimal place
 */
export const calculateAverageScore = (scores: number[]): number => {
  if (scores.length === 0) return 0;
  const sum = scores.reduce((acc, score) => acc + score, 0);
  return Math.round((sum / scores.length) * 10) / 10;
};

/**
 * Formats large numbers with commas
 * @param num - Number to format
 * @returns Formatted string (e.g., "1,234")
 */
export const formatNumber = (num: number): string => {
  return num.toLocaleString('en-US');
};

/**
 * Gets trend indicator based on comparison
 * @param current - Current value
 * @param previous - Previous value
 * @returns Trend direction
 */
export const getTrend = (current: number, previous: number): 'up' | 'down' | 'stable' => {
  if (current > previous) return 'up';
  if (current < previous) return 'down';
  return 'stable';
};

/**
 * Formats score percentage for display
 * @param score - Score percentage (0-100)
 * @returns Formatted string (e.g., "85%")
 */
export const formatScorePercentage = (score: number): string => {
  return `${Math.round(score)}%`;
};

/**
 * Gets relative time description
 * @param dateString - ISO date string
 * @returns Relative time (e.g., "2 hours ago", "Yesterday")
 */
export const getRelativeTime = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins} min${diffMins !== 1 ? 's' : ''} ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};
