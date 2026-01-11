/**
 * Explore Feature Public API
 * Category browsing and quiz configuration
 */

// Components
export { CategoryBrowser } from './components/CategoryBrowser';
export { CategoryCard } from './components/CategoryCard';
export { QuizConfigDialog } from './components/QuizConfigDialog';
export { OpenTDBGame } from './components/OpenTDBGame';

// Hooks
export { useCategories } from './hooks/useCategories';
export { useQuizResults } from './hooks/useQuizResults';

// Types
export type { Category, QuizConfig, QuizResult, QuizResultsStorage } from './types';
export { DIFFICULTY_POINTS, DEFAULT_QUIZ_CONFIG, QUIZ_CONFIG_LIMITS } from './types';

// Constants
export {
  CATEGORY_ICONS,
  CATEGORY_COLORS,
  EXPLORE_QUERY_KEYS,
  STORAGE_KEYS,
  DIFFICULTY_OPTIONS,
  QUESTION_PRESETS,
  TIME_PRESETS,
} from './constants';
