import { useState, useCallback } from 'react';
import type { QuizFormData } from '../types';
import { QUIZ_STORAGE_KEYS } from '../constants';

/**
 * Hook for auto-saving quiz drafts to localStorage
 * Provides save, load, and clear functionality with timestamp tracking
 */
export const useQuizAutoSave = () => {
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  const saveQuiz = useCallback((data: Partial<QuizFormData>) => {
    try {
      localStorage.setItem(QUIZ_STORAGE_KEYS.DRAFT, JSON.stringify(data));
      setLastSaved(new Date());
    } catch (error) {
      console.error('Failed to save quiz draft:', error);
    }
  }, []);

  const loadQuiz = useCallback((): Partial<QuizFormData> | null => {
    try {
      const saved = localStorage.getItem(QUIZ_STORAGE_KEYS.DRAFT);
      return saved ? JSON.parse(saved) : null;
    } catch (error) {
      console.error('Failed to load quiz draft:', error);
      return null;
    }
  }, []);

  const clearQuiz = useCallback(() => {
    localStorage.removeItem(QUIZ_STORAGE_KEYS.DRAFT);
    setLastSaved(null);
  }, []);

  return {
    saveQuiz,
    loadQuiz,
    clearQuiz,
    lastSaved,
  };
};
