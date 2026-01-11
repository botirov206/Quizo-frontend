/**
 * Backend Normalizer
 * Transforms custom backend API responses (api.kahoot.uz) to StandardQuiz format
 * 
 * Single Responsibility: Data transformation only
 */

import type { StandardQuiz, StandardQuestion } from '@/types/quiz';
import type { BackendQuiz, BackendQuestion } from '../types';
import { generateQuestionId } from '../utils';

/**
 * Normalizes a single backend question to StandardQuestion format
 * Backend format: { question, options: string[], correctAnswer }
 */
export const normalizeBackendQuestion = (
  question: BackendQuestion,
  index: number
): StandardQuestion => {
  // Backend stores options as string array directly
  const options = question.options || [];

  return {
    id: generateQuestionId(index),
    text: question.question,
    options,
    correctAnswerId: question.correctAnswer,
    type: options.length === 2 && 
          options.includes('True') && 
          options.includes('False') 
            ? 'boolean' 
            : 'multiple',
  };
};

/**
 * Normalizes an array of backend questions
 */
export const normalizeBackendQuestions = (
  questions: BackendQuestion[]
): StandardQuestion[] => {
  if (!questions || !Array.isArray(questions)) {
    return [];
  }
  return questions.map((q, index) => normalizeBackendQuestion(q, index));
};

/**
 * Transforms complete backend quiz to StandardQuiz format
 * Backend format: { id, title, quizKey, questions }
 */
export const normalizeBackendQuiz = (quiz: BackendQuiz): StandardQuiz => {
  const questions = quiz.questions 
    ? normalizeBackendQuestions(quiz.questions) 
    : [];

  return {
    id: quiz.id,
    title: quiz.title,
    description: quiz.description || `Quiz Key: ${quiz.quizKey}`,
    source: 'custom',
    category: quiz.category || 'General',
    difficulty: quiz.difficulty || 'medium',
    timeLimit: quiz.timeLimit ? quiz.timeLimit * 60 : 30 * questions.length, // Default: 30s per question
    questions,
    createdBy: quiz.createdBy?.id,
    createdAt: quiz.createdAt,
    // Store quizKey for joining quizzes
    metadata: {
      quizKey: quiz.quizKey,
    },
  };
};

/**
 * Normalizes an array of backend quizzes
 */
export const normalizeBackendQuizzes = (
  quizzes: BackendQuiz[] | unknown
): StandardQuiz[] => {
  if (!quizzes || !Array.isArray(quizzes)) {
    return [];
  }
  return quizzes.map(normalizeBackendQuiz);
};
