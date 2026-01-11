/**
 * Quiz Mapper Utilities
 * Functions for transforming form data to API format
 */

import type { StandardQuiz, StandardQuestion } from '@/types/quiz';
import type { QuizFormData } from '../types';

/**
 * Maps quiz form data to StandardQuiz format
 * @param data - The quiz form data
 * @param userId - Optional user ID for created by field
 * @returns StandardQuiz object ready for API
 */
export const mapFormDataToQuiz = (
  data: QuizFormData,
  userId: string = 'current-user-id'
): StandardQuiz => {
  return {
    id: `quiz-${Date.now()}`,
    title: data.title,
    description: data.description,
    source: 'custom',
    category: data.category,
    difficulty: data.difficulty,
    timeLimit: data.timeLimit,
    questions: data.questions.map((q, index) => mapFormQuestionToStandard(q, index)),
    createdBy: userId,
    createdAt: new Date().toISOString(),
  };
};

/**
 * Maps a form question to StandardQuestion format
 * @param question - The form question data
 * @param index - The question index
 * @returns StandardQuestion object
 */
const mapFormQuestionToStandard = (
  question: QuizFormData['questions'][0],
  index: number
): StandardQuestion => {
  return {
    id: `q-${index + 1}`,
    text: question.text,
    type: question.type === 'multiple-choice' ? 'multiple' : 'boolean',
    options: question.options.map((opt) => opt.text),
    correctAnswerId: question.correctAnswerId,
    explanation: question.explanation,
  };
};
