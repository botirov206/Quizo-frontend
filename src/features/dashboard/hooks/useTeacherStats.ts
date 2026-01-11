/**
 * useTeacherStats Hook
 * Fetches teacher-specific statistics for the dashboard
 */

import { useQuery } from '@tanstack/react-query';
import { QUERY_KEYS } from '../constants';
import {
  MOCK_TEACHER_STATS,
  MOCK_TEACHER_QUIZZES,
  MOCK_RECENT_RESULTS,
  type TeacherStats,
  type TeacherQuiz,
  type StudentResult,
} from '../data/mock-teacher-stats';

interface TeacherDashboardData {
  stats: TeacherStats;
  quizzes: TeacherQuiz[];
  recentResults: StudentResult[];
}

/**
 * Fetches teacher dashboard data
 * Currently uses mock data, will connect to backend API later
 */
const fetchTeacherData = async (): Promise<TeacherDashboardData> => {
  // TODO: Replace with real API call
  // const response = await api.get('/teacher/dashboard');
  // return response.data;

  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  return {
    stats: MOCK_TEACHER_STATS,
    quizzes: MOCK_TEACHER_QUIZZES,
    recentResults: MOCK_RECENT_RESULTS,
  };
};

export const useTeacherStats = () => {
  return useQuery({
    queryKey: QUERY_KEYS.TEACHER_STATS,
    queryFn: fetchTeacherData,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Re-export types for convenience
export type { TeacherStats, TeacherQuiz, StudentResult };
