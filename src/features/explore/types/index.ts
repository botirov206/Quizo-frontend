/**
 * Explore Feature Types
 * Types for category browsing and quiz configuration
 */

import type { OpenTDBDifficulty } from '@/adapters';

export interface Category {
  id: number;
  name: string;
  icon?: string;
}

export interface QuizConfig {
  categoryId: number;
  categoryName: string;
  difficulty: OpenTDBDifficulty;
  timePerQuestion: number; // in seconds
  numberOfQuestions: number;
}

export interface QuizResult {
  id: string;
  quizId: string;
  quizTitle: string;
  category: string;
  difficulty: OpenTDBDifficulty;
  score: number;
  totalPoints: number;
  correctAnswers: number;
  totalQuestions: number;
  percentage: number;
  timeSpent: number; // total seconds
  completedAt: string;
  answers: Array<{
    questionId: string;
    questionText: string;
    selectedAnswer: string;
    correctAnswer: string;
    isCorrect: boolean;
    timeSpent: number;
    pointsEarned: number;
  }>;
}

export interface QuizResultsStorage {
  results: QuizResult[];
  lastUpdated: string;
}

// Scoring constants based on difficulty
export const DIFFICULTY_POINTS = {
  easy: 0.5,
  medium: 1,
  hard: 1.5,
} as const;

// Default quiz configuration
export const DEFAULT_QUIZ_CONFIG = {
  timePerQuestion: 10, // seconds
  numberOfQuestions: 10,
  difficulty: 'medium' as OpenTDBDifficulty,
} as const;

// Configuration limits
export const QUIZ_CONFIG_LIMITS = {
  MIN_QUESTIONS: 5,
  MAX_QUESTIONS: 50,
  MIN_TIME: 5,
  MAX_TIME: 60,
} as const;
