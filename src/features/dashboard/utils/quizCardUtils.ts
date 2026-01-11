/**
 * Quiz Card Utilities
 * Helper functions for QuizCard display logic
 */

import { DIFFICULTY_COLORS, SOURCE_LABELS } from '../constants';

/**
 * Gets the appropriate color classes for a difficulty level
 * @param difficulty - The quiz difficulty level
 * @returns Tailwind CSS classes for the difficulty badge
 */
export const getDifficultyColor = (difficulty?: string | null | undefined): string => {
  switch (difficulty?.toLowerCase()) {
    case 'easy':
      return DIFFICULTY_COLORS.easy;
    case 'medium':
      return DIFFICULTY_COLORS.medium;
    case 'hard':
      return DIFFICULTY_COLORS.hard;
    default:
      return DIFFICULTY_COLORS.default;
  }
};

/**
 * Gets the display label for a quiz source
 * @param source - The quiz source type
 * @returns Human-readable source label
 */
export const getSourceBadge = (source: string): string => {
  return source === 'opentdb' ? SOURCE_LABELS.opentdb : SOURCE_LABELS.custom;
};

/**
 * Gets the color classes for a quiz source badge
 * @param source - The quiz source type
 * @returns Tailwind CSS classes for the source badge
 */
export const getSourceBadgeColor = (source: string): string => {
  return source === 'opentdb' 
    ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
    : 'bg-violet-50 text-violet-700 border-violet-200';
};

/**
 * Formats time limit for display
 * @param timeLimit - Time limit in seconds (normalized from backend)
 * @returns Formatted time string
 */
export const formatTimeLimit = (timeLimit?: number): string => {
  if (!timeLimit) return 'No time limit';
  
  // Convert seconds to minutes for display
  const minutes = Math.round(timeLimit / 60);
  
  if (minutes < 1) {
    return `${timeLimit} second${timeLimit !== 1 ? 's' : ''}`;
  }
  
  return `${minutes} minute${minutes !== 1 ? 's' : ''}`;
};
