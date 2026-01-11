import { useState, useCallback } from 'react';
import type { StandardQuiz } from '@/types/quiz';
import type { QuizFormData } from '../types';
import { mapFormDataToQuiz } from '../utils';
import { QUIZ_TIMING } from '../constants';

/**
 * Hook for creating quizzes
 * Handles API communication and loading/error states
 */
export const useCreateQuiz = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createQuiz = useCallback(async (data: QuizFormData): Promise<StandardQuiz> => {
    setLoading(true);
    setError(null);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, QUIZ_TIMING.API_SIMULATION_DELAY));

      // Transform form data to StandardQuiz format
      const newQuiz = mapFormDataToQuiz(data);

      setLoading(false);
      return newQuiz;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to create quiz';
      setError(message);
      setLoading(false);
      throw err;
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    createQuiz,
    loading,
    error,
    clearError,
  };
};
