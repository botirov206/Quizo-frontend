import { useQuery } from '@tanstack/react-query';
import type { HistoryList, MeStats, TeacherStats } from '@/api/types';
import { apiClient } from '@/lib/axios';

export function useTeacherStats() {
  return useQuery({
    queryKey: ['teacher-stats'],
    queryFn: async () => {
      const { data } = await apiClient.get<TeacherStats>('/teacher/stats');
      return data;
    },
  });
}

export function useStudentStats() {
  return useQuery({
    queryKey: ['me-stats'],
    queryFn: async () => {
      const { data } = await apiClient.get<MeStats>('/me/stats');
      return data;
    },
  });
}

export function useHistory() {
  return useQuery({
    queryKey: ['me-history'],
    queryFn: async () => {
      const { data } = await apiClient.get<HistoryList>('/me/history', { params: { limit: '20' } });
      return data.items;
    },
  });
}

export type { TeacherStats, MeStats };
