/**
 * Backend Normalizer
 * Transforms custom backend API responses (api.kahoot.uz) to StandardQuiz format
 * 
 * Single Responsibility: Data transformation only
 * 
 * NOTE: Backend uses snake_case (time_limit, quiz_key, correct_answer)
 * We normalize to camelCase for frontend consistency
 */

import type { StandardQuiz, StandardQuestion } from '@/types/quiz';
import type { BackendQuiz, BackendQuestion, BackendQuizListItem, BackendJoinQuizResponse } from '../types';
import { generateQuestionId } from '../utils';

/**
 * Normalizes a single backend question to StandardQuestion format
 * Backend format: { id, question, options: string[], correct_answer }
 * 
 * NOTE: Backend uses correct_answer (snake_case), we use correctAnswerId
 */
export const normalizeBackendQuestion = (
  question: BackendQuestion,
  index: number
): StandardQuestion => {
  // Backend stores options as string array directly
  const options = question.options || [];
  
  // Handle both snake_case (correct_answer) and camelCase (correctAnswer)
  const correctAnswer = question.correct_answer || question.correctAnswer || '';

  return {
    id: question.id || generateQuestionId(String(index)),
    text: question.question,
    options,
    correctAnswerId: correctAnswer,
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
 * Transforms a quiz list item (from GET /quizzes) to StandardQuiz format
 * Note: List items don't have questions, only metadata
 * 
 * Backend format: { id, title, description, category, difficulty, time_limit, quiz_key }
 */
export const normalizeBackendQuizListItem = (quiz: BackendQuizListItem): StandardQuiz => {
  // Handle both snake_case and camelCase for backwards compatibility
  const quizKey = quiz.quiz_key;
  const timeLimit = quiz.time_limit;

  return {
    id: quiz.id,
    title: quiz.title,
    description: quiz.description || '',
    source: 'custom',
    category: quiz.category || 'General',
    difficulty: quiz.difficulty || 'medium',
    timeLimit: timeLimit ? timeLimit * 60 : 30 * 60, // Convert minutes to seconds, default 30 min
    questions: [], // List items don't have questions
    metadata: {
      quizKey: quizKey,
    },
  };
};

/**
 * Transforms complete backend quiz to StandardQuiz format
 * Backend format: { id, title, description, category, difficulty, time_limit, quiz_key, questions }
 */
export const normalizeBackendQuiz = (quiz: BackendQuiz): StandardQuiz => {
  const questions = quiz.questions 
    ? normalizeBackendQuestions(quiz.questions) 
    : [];

  // Handle both snake_case and camelCase for backwards compatibility
  const quizKey = quiz.quiz_key || quiz.quizKey;
  const timeLimit = quiz.time_limit || quiz.timeLimit;

  return {
    id: quiz.id,
    title: quiz.title,
    description: quiz.description || '',
    source: 'custom',
    category: quiz.category || 'General',
    difficulty: quiz.difficulty || 'medium',
    timeLimit: timeLimit ? timeLimit * 60 : 30 * questions.length, // Default: 30s per question
    questions,
    createdBy: quiz.createdBy?.id,
    createdAt: quiz.createdAt,
    metadata: {
      quizKey: quizKey,
    },
  };
};

/**
 * Transforms join quiz response to StandardQuiz format
 * POST /quiz/join response: { quiz: {...}, questions: [...] }
 */
export const normalizeJoinQuizResponse = (response: BackendJoinQuizResponse): StandardQuiz => {
  const { quiz, questions } = response;
  const normalizedQuestions = normalizeBackendQuestions(questions);
  
  // Handle snake_case from backend
  const quizKey = quiz.quiz_key;
  const timeLimit = quiz.time_limit;

  return {
    id: quiz.id,
    title: quiz.title,
    description: quiz.description || '',
    source: 'custom',
    category: quiz.category || 'General',
    difficulty: quiz.difficulty || 'medium',
    timeLimit: timeLimit ? timeLimit * 60 : 30 * normalizedQuestions.length,
    questions: normalizedQuestions,
    metadata: {
      quizKey: quizKey,
    },
  };
};

/**
 * Normalizes an array of backend quiz list items
 */
export const normalizeBackendQuizzes = (
  quizzes: BackendQuizListItem[] | BackendQuiz[] | unknown
): StandardQuiz[] => {
  if (!quizzes || !Array.isArray(quizzes)) {
    return [];
  }
  // Check if items have quiz_key (list items) or questions (full quiz)
  return quizzes.map((quiz) => {
    if ('questions' in quiz && quiz.questions) {
      return normalizeBackendQuiz(quiz as BackendQuiz);
    }
    return normalizeBackendQuizListItem(quiz as BackendQuizListItem);
  });
};
