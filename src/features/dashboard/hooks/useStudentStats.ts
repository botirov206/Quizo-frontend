import { useQuery } from '@tanstack/react-query';
import type { StudentStats } from '../types';
import { MOCK_STUDENT_STATS } from '../data/mock-student-stats';
import { QUERY_KEYS, MOCK_API_DELAY, MOCK_ERROR_RATE, DASHBOARD_ERROR_MESSAGES } from '../constants';

/**
 * Simulates API call to fetch student statistics
 */
const fetchStudentStats = async (): Promise<StudentStats> => {
  await new Promise((resolve) => setTimeout(resolve, MOCK_API_DELAY));
  
  // Simulate configurable error rate for testing
  if (Math.random() < MOCK_ERROR_RATE) {
    throw new Error(DASHBOARD_ERROR_MESSAGES.FETCH_STATS_FAILED);
  }
  
  return MOCK_STUDENT_STATS;
};

/**
 * Hook for fetching student statistics
 * Uses TanStack Query for caching and automatic refetching
 */
export const useStudentStats = () => {
  return useQuery({
    queryKey: QUERY_KEYS.STUDENT_STATS,
    queryFn: fetchStudentStats,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};
