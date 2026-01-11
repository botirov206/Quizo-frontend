/**
 * Backend Normalizer
 * Transforms custom backend API responses to StandardQuiz format
 * 
 * Single Responsibility: Data transformation only
 */

import type { StandardQuiz, StandardQuestion } from '@/types/quiz';
import type { BackendQuiz, BackendQuestion } from '../types';

/**
 * Normalizes a single backend question to StandardQuestion format
 */
export const normalizeBackendQuestion = (
  question: BackendQuestion
): StandardQuestion => {
  // Backend stores options as objects, we need string array
  const options = question.options.map(opt => opt.text);

  // Find the correct answer text from the option ID
  const correctOption = question.options.find(
    opt => opt.id === question.correctAnswerId
  );
  const correctAnswerId = correctOption
    ? correctOption.text
    : question.correctAnswerId;

  return {
    id: question.id,
    text: question.text,
    options,
    correctAnswerId,
    type: question.type === 'true-false' ? 'boolean' : 'multiple',
    explanation: question.explanation,
  };
};

/**
 * Normalizes an array of backend questions
 */
export const normalizeBackendQuestions = (
  questions: BackendQuestion[]
): StandardQuestion[] => {
  return questions.map(normalizeBackendQuestion);
};

/**
 * Transforms complete backend quiz to StandardQuiz format
 */
export const normalizeBackendQuiz = (quiz: BackendQuiz): StandardQuiz => {
  return {
    id: quiz.id,
    title: quiz.title,
    description: quiz.description,
    source: 'custom',
    category: quiz.category,
    difficulty: quiz.difficulty,
    timeLimit: quiz.timeLimit * 60, // Convert minutes to seconds
    questions: normalizeBackendQuestions(quiz.questions),
    createdBy: quiz.createdBy.id,
    createdAt: quiz.createdAt,
  };
};

/**
 * Normalizes an array of backend quizzes
 */
export const normalizeBackendQuizzes = (
  quizzes: BackendQuiz[]
): StandardQuiz[] => {
  return quizzes.map(normalizeBackendQuiz);
};
