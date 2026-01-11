// Public API for quiz feature

// Components
export { QuizCreator } from './components/QuizCreator';

// Hooks
export { useCreateQuiz } from './hooks/useCreateQuiz';
export { useQuizAutoSave } from './hooks/useQuizAutoSave';

// Constants
export {
  QUIZ_VALIDATION,
  DEFAULT_QUIZ_VALUES,
  DEFAULT_QUESTION,
  DEFAULT_OPTIONS_COUNT,
  QUIZ_STORAGE_KEYS,
  QUIZ_TIMING,
  DIFFICULTY_OPTIONS,
  QUESTION_TYPE_OPTIONS,
} from './constants';

// Utilities
export {
  generateOptionId,
  resetOptionIdCounter,
  createOption,
  createOptions,
  mapFormDataToQuiz,
} from './utils';

// Types & Schemas
export { quizFormSchema, questionSchema } from './types';
export type { QuizFormData, QuestionFormData } from './types';
