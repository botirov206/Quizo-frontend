import { useQuery } from '@tanstack/react-query';
import type { QuizAttempt } from '../types';
import { MOCK_RECENT_ACTIVITY } from '../data/mock-student-stats';
import { QUERY_KEYS, MOCK_API_DELAY, MOCK_ERROR_RATE, DASHBOARD_ERROR_MESSAGES } from '../constants';

/**
 * Simulates API call to fetch recent quiz attempts
 */
const fetchRecentActivity = async (): Promise<QuizAttempt[]> => {
  await new Promise((resolve) => setTimeout(resolve, MOCK_API_DELAY));
  
  // Simulate configurable error rate for testing
  if (Math.random() < MOCK_ERROR_RATE) {
    throw new Error(DASHBOARD_ERROR_MESSAGES.FETCH_ACTIVITY_FAILED);
  }
  
  return MOCK_RECENT_ACTIVITY;
};

/**
 * Hook for fetching recent quiz activity
 * Uses TanStack Query for caching and automatic refetching
 */
export const useRecentActivity = () => {
  return useQuery({
    queryKey: QUERY_KEYS.RECENT_ACTIVITY,
    queryFn: fetchRecentActivity,
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
};
