/**
 * OpenTDB Normalizer
 * Transforms OpenTDB API responses to StandardQuiz format
 * 
 * Single Responsibility: Data transformation only
 */

import type { StandardQuiz, StandardQuestion } from '@/types/quiz';
import type { OpenTDBQuestion, QuizFetchOptions } from '../types';
import {
  decodeHtmlEntities,
  shuffleArray,
  generateQuestionId,
  generateOpenTDBQuizId,
  mapQuestionType,
  cleanCategoryName,
  mapDifficulty,
} from '../utils';
import { OPENTDB_CONFIG } from '../constants';

/**
 * Normalizes a single OpenTDB question to StandardQuestion format
 */
export const normalizeOpenTDBQuestion = (
  question: OpenTDBQuestion,
  index: number
): StandardQuestion => {
  // Decode HTML entities from all text fields
  const decodedQuestion = decodeHtmlEntities(question.question);
  const decodedCorrect = decodeHtmlEntities(question.correct_answer);
  const decodedIncorrect = question.incorrect_answers.map(decodeHtmlEntities);

  // Combine and shuffle all options
  const allOptions = shuffleArray([decodedCorrect, ...decodedIncorrect]);

  return {
    id: generateQuestionId(`otdb_${index}`),
    text: decodedQuestion,
    options: allOptions,
    correctAnswerId: decodedCorrect,
    type: mapQuestionType(question.type),
    explanation: undefined, // OpenTDB doesn't provide explanations
  };
};

/**
 * Normalizes an array of OpenTDB questions
 */
export const normalizeOpenTDBQuestions = (
  questions: OpenTDBQuestion[]
): StandardQuestion[] => {
  return questions.map(normalizeOpenTDBQuestion);
};

/**
 * Generates a quiz title based on the first question's category and difficulty
 */
export const generateQuizTitle = (
  questions: OpenTDBQuestion[],
  options: QuizFetchOptions
): string => {
  const firstQuestion = questions[0];
  if (!firstQuestion) return 'Trivia Quiz';

  const category = cleanCategoryName(firstQuestion.category);
  const difficulty = options.difficulty
    ? options.difficulty.charAt(0).toUpperCase() + options.difficulty.slice(1)
    : 'Mixed';

  return `${category} - ${difficulty} Trivia`;
};

/**
 * Generates quiz description
 */
export const generateQuizDescription = (questionCount: number): string => {
  return `${questionCount} questions from OpenTDB`;
};

/**
 * Transforms complete OpenTDB response to StandardQuiz format
 */
export const normalizeOpenTDBQuiz = (
  questions: OpenTDBQuestion[],
  options: QuizFetchOptions
): StandardQuiz => {
  const normalizedQuestions = normalizeOpenTDBQuestions(questions);
  const firstQuestion = questions[0];

  return {
    id: generateOpenTDBQuizId(
      options.category,
      options.difficulty,
      options.amount
    ),
    title: generateQuizTitle(questions, options),
    description: generateQuizDescription(normalizedQuestions.length),
    source: 'opentdb',
    category: firstQuestion ? cleanCategoryName(firstQuestion.category) : undefined,
    difficulty: options.difficulty ? mapDifficulty(options.difficulty) : undefined,
    timeLimit: OPENTDB_CONFIG.DEFAULT_TIME_LIMIT,
    questions: normalizedQuestions,
    createdAt: new Date().toISOString(),
  };
};
