import { useState, useCallback } from 'react';
import type { QuizFormData } from '../types';
import { createBackendQuiz, type CreateQuizResult } from '@/adapters';
import type { BackendCreateQuizRequest } from '@/adapters';

/**
 * Maps form data to backend API request format
 * 
 * LocalStorage/Form format:
 * {
 *   title: "...",
 *   description: "...",
 *   category: "...",
 *   difficulty: "easy" | "medium" | "hard",
 *   timeLimit: 60, // in minutes
 *   questions: [{
 *     text: "Question text",
 *     type: "multiple-choice" | "true-false",
 *     options: [{ id: "opt-1", text: "Option A" }, ...],
 *     correctAnswerId: "opt-1", // ID of correct option
 *     explanation: "..."
 *   }]
 * }
 * 
 * Backend expects:
 * {
 *   "title": "JavaScript Basics",
 *   "description": "hello world",
 *   "category": "Programming",
 *   "difficulty": "easy",
 *   "time_limit": 60,
 *   "questions": [
 *     {
 *       "question": "What is JS?",
 *       "options": ["Language", "Framework", "DB"],
 *       "correctAnswer": "Language"
 *     }
 *   ]
 * }
 */
const mapFormDataToBackendRequest = (data: QuizFormData): BackendCreateQuizRequest => {
  const mappedQuestions = data.questions.map((q) => {
    // Find the correct answer text by matching the option ID
    const correctOption = q.options.find((opt) => opt.id === q.correctAnswerId);
    
    // Filter out empty options and get only the text values
    const optionTexts = q.options
      .map((opt) => opt.text)
      .filter((text) => text && text.trim() !== '');
    
    return {
      question: q.text,
      options: optionTexts,
      correctAnswer: correctOption?.text || '',
    };
  });

  const requestData: BackendCreateQuizRequest = {
    title: data.title,
    description: data.description,
    category: data.category,
    difficulty: data.difficulty,
    time_limit: data.timeLimit,
    questions: mappedQuestions,
  };

  return requestData;
};

/**
 * Hook for creating quizzes
 * Handles API communication and loading/error states
 * 
 * Now calls the real backend API POST /quiz
 * Returns: { success: boolean, quizKey: string }
 */
export const useCreateQuiz = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createQuiz = useCallback(async (data: QuizFormData): Promise<CreateQuizResult> => {
    setLoading(true);
    setError(null);

    try {
      // Transform form data to backend request format
      const requestData = mapFormDataToBackendRequest(data);
      
      // Call the real backend API
      const result = await createBackendQuiz(requestData);
      
      if (!result.success || !result.data) {
        throw new Error(result.error || 'Failed to create quiz');
      }

      setLoading(false);
      return result.data;
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
