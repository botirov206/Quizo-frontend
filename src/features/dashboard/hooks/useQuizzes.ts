import { useQuery } from '@tanstack/react-query';
import type { StandardQuiz } from '@/types/quiz';
import { fetchAllQuizzes, type QuizSource } from '@/adapters';
import { QUERY_KEYS, DASHBOARD_ERROR_MESSAGES } from '../constants';

/**
 * Fetches quizzes from custom backend only
 * OpenTDB quizzes are available in /explore page
 */
const fetchQuizzes = async (source: QuizSource = 'custom'): Promise<StandardQuiz[]> => {
  const result = await fetchAllQuizzes({ source });
  
  if (!result.success || !result.data) {
    throw new Error(result.error || DASHBOARD_ERROR_MESSAGES.FETCH_QUIZZES_FAILED);
  }
  
  return result.data;
};

/**
 * Hook for fetching quizzes from custom backend only
 * OpenTDB quizzes are available in /explore page
 * 
 * Uses TanStack Query for caching and automatic refetching
 * 
 * @example
 * const { data, isLoading } = useQuizzes();
 * // Returns only custom quizzes (no OpenTDB)
 */
export const useQuizzes = (initialSource: QuizSource = 'custom') => {
  const query = useQuery({
    queryKey: [...QUERY_KEYS.QUIZZES, initialSource],
    queryFn: () => fetchQuizzes(initialSource),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
  });

  return {
    ...query,
    totalCount: query.data?.length ?? 0,
  };
};

/**
 * Hook for fetching a single quiz by ID
 */
export const useQuizById = (quizId: string | undefined) => {
  return useQuery({
    queryKey: QUERY_KEYS.QUIZ_BY_ID(quizId || ''),
    queryFn: async () => {
      if (!quizId) throw new Error('Quiz ID is required');
      
      // First try to find in cached data
      const allResult = await fetchAllQuizzes();
      if (allResult.success && allResult.data) {
        const quiz = allResult.data.find(q => q.id === quizId);
        if (quiz) return quiz;
      }
      
      throw new Error('Quiz not found');
    },
    enabled: !!quizId,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};
