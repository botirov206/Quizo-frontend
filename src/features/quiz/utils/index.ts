/**
 * Quiz Utilities Public API
 * Re-exports option helpers and form-to-quiz mapping
 */
export {
  generateOptionId,
  resetOptionIdCounter,
  createOption,
  createOptions,
} from './optionUtils';

export { mapFormDataToQuiz } from './quizMapper';
