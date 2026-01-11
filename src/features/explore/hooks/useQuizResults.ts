/**
 * Hook for managing quiz results in localStorage
 * Results are stored locally until backend API is connected
 */

import { useState, useCallback, useEffect } from 'react';
import type { QuizResult, QuizResultsStorage } from '../types';
import { STORAGE_KEYS } from '../constants';

const MAX_STORED_RESULTS = 100; // Keep last 100 results

/**
 * Load results from localStorage
 */
const loadResults = (): QuizResult[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.QUIZ_RESULTS);
    if (!stored) return [];
    
    const parsed: QuizResultsStorage = JSON.parse(stored);
    return parsed.results || [];
  } catch (error) {
    console.error('Failed to load quiz results:', error);
    return [];
  }
};

/**
 * Save results to localStorage
 */
const saveResults = (results: QuizResult[]): void => {
  try {
    const storage: QuizResultsStorage = {
      results: results.slice(0, MAX_STORED_RESULTS),
      lastUpdated: new Date().toISOString(),
    };
    localStorage.setItem(STORAGE_KEYS.QUIZ_RESULTS, JSON.stringify(storage));
  } catch (error) {
    console.error('Failed to save quiz results:', error);
  }
};

/**
 * Generate unique result ID
 */
const generateResultId = (): string => {
  return `result_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
};

/**
 * Hook for managing quiz results
 */
export const useQuizResults = () => {
  const [results, setResults] = useState<QuizResult[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load results on mount
  useEffect(() => {
    const loaded = loadResults();
    setResults(loaded);
    setIsLoaded(true);
  }, []);

  // Save a new quiz result
  const saveResult = useCallback((result: Omit<QuizResult, 'id' | 'completedAt'>) => {
    const newResult: QuizResult = {
      ...result,
      id: generateResultId(),
      completedAt: new Date().toISOString(),
    };

    setResults(prev => {
      const updated = [newResult, ...prev];
      saveResults(updated);
      return updated;
    });

    return newResult;
  }, []);

  // Get result by ID
  const getResultById = useCallback((id: string): QuizResult | undefined => {
    return results.find(r => r.id === id);
  }, [results]);

  // Get results by category
  const getResultsByCategory = useCallback((category: string): QuizResult[] => {
    return results.filter(r => r.category === category);
  }, [results]);

  // Get recent results
  const getRecentResults = useCallback((limit: number = 10): QuizResult[] => {
    return results.slice(0, limit);
  }, [results]);

  // Calculate total stats
  const getTotalStats = useCallback(() => {
    if (results.length === 0) {
      return {
        totalQuizzes: 0,
        totalPoints: 0,
        totalCorrect: 0,
        totalQuestions: 0,
        averageScore: 0,
        averagePercentage: 0,
      };
    }

    const totalQuizzes = results.length;
    const totalPoints = results.reduce((sum, r) => sum + r.score, 0);
    const totalCorrect = results.reduce((sum, r) => sum + r.correctAnswers, 0);
    const totalQuestions = results.reduce((sum, r) => sum + r.totalQuestions, 0);
    const averagePercentage = results.reduce((sum, r) => sum + r.percentage, 0) / totalQuizzes;

    return {
      totalQuizzes,
      totalPoints: Math.round(totalPoints * 10) / 10,
      totalCorrect,
      totalQuestions,
      averageScore: Math.round((totalPoints / totalQuizzes) * 10) / 10,
      averagePercentage: Math.round(averagePercentage * 10) / 10,
    };
  }, [results]);

  // Clear all results
  const clearResults = useCallback(() => {
    setResults([]);
    localStorage.removeItem(STORAGE_KEYS.QUIZ_RESULTS);
  }, []);

  // Delete a specific result
  const deleteResult = useCallback((id: string) => {
    setResults(prev => {
      const updated = prev.filter(r => r.id !== id);
      saveResults(updated);
      return updated;
    });
  }, []);

  return {
    results,
    isLoaded,
    saveResult,
    getResultById,
    getResultsByCategory,
    getRecentResults,
    getTotalStats,
    clearResults,
    deleteResult,
  };
};
