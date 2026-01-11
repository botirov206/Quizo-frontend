/**
 * Quiz Feature Constants
 * Centralized configuration for quiz creation and management
 */

// Form validation limits
export const QUIZ_VALIDATION = {
  TITLE_MIN_LENGTH: 3,
  TITLE_MAX_LENGTH: 100,
  DESCRIPTION_MIN_LENGTH: 10,
  DESCRIPTION_MAX_LENGTH: 500,
  QUESTION_MIN_LENGTH: 5,
  MIN_OPTIONS: 2,
  MIN_QUESTIONS: 5,
  TIME_LIMIT_MIN: 5,
  TIME_LIMIT_MAX: 180,
} as const;

// Default form values
export const DEFAULT_QUIZ_VALUES = {
  title: '',
  description: '',
  category: '',
  difficulty: 'medium' as const,
  timeLimit: 30,
} as const;

export const DEFAULT_QUESTION = {
  text: '',
  type: 'multiple-choice' as const,
  correctAnswerId: '',
  explanation: '',
} as const;

export const DEFAULT_OPTIONS_COUNT = {
  INITIAL: 2,
  STANDARD: 4,
} as const;

// Storage keys
export const QUIZ_STORAGE_KEYS = {
  DRAFT: 'quiz-draft',
} as const;

// Timing configuration
export const QUIZ_TIMING = {
  AUTO_SAVE_DEBOUNCE: 1000, // 1 second
  API_SIMULATION_DELAY: 1000,
} as const;

// Difficulty options
export const DIFFICULTY_OPTIONS = [
  { value: 'easy', label: 'Easy' },
  { value: 'medium', label: 'Medium' },
  { value: 'hard', label: 'Hard' },
] as const;

// Question type options
export const QUESTION_TYPE_OPTIONS = [
  { value: 'multiple-choice', label: 'Multiple Choice' },
  { value: 'true-false', label: 'True/False' },
] as const;
