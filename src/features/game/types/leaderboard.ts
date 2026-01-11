/**
 * Leaderboard Types
 * Types for displaying rankings in quiz sessions
 */

export interface LeaderboardEntry {
  id: string;
  name: string;
  firstName: string;
  lastName: string;
  points: number;
  timeSpent: number; // in seconds
  rank?: number;
}

export interface LeaderboardProps {
  entries: LeaderboardEntry[];
  currentUserId?: string;
  title?: string;
  showRank?: boolean;
  maxEntries?: number;
  isLoading?: boolean;
  categoryId?: string;
  quizId?: string;
}

/**
 * Get initials from first and last name
 * @param firstName - User's first name
 * @param lastName - User's last name
 * @returns Two-letter initials (uppercase)
 */
export const getInitials = (firstName: string, lastName: string): string => {
  const first = firstName?.charAt(0) || '';
  const last = lastName?.charAt(0) || '';
  return `${first}${last}`.toUpperCase() || '??';
};

/**
 * Format time in seconds to display string
 * @param seconds - Time in seconds
 * @returns Formatted time string (e.g., "1m 30s" or "45s")
 */
export const formatTime = (seconds: number): string => {
  if (seconds < 60) {
    return `${seconds}s`;
  }
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return remainingSeconds > 0 ? `${minutes}m ${remainingSeconds}s` : `${minutes}m`;
};
