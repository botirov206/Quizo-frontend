// Public API for auth feature

// Components
export { LoginForm } from './components/LoginForm';
export { RegisterForm } from './components/RegisterForm';
export { LogoutButton } from './components/LogoutButton';
export { ForgotPasswordForm } from './components/ForgotPasswordForm';

// Hooks
export { useLogin } from './hooks/useLogin';
export { useRegister } from './hooks/useRegister';
export { useForgotPassword } from './hooks/useForgotPassword';

// Constants
export {
  MAX_INPUT_LENGTH,
  MAX_NAME_LENGTH,
  MIN_PASSWORD_LENGTH,
  AUTH_VALIDATION_MESSAGES,
  AUTH_ERROR_MESSAGES,
  AUTH_STORAGE_KEYS,
  INITIAL_AUTH_FORM_STATE,
  INITIAL_FORGOT_PASSWORD_STATE,
} from './constants';

// Utilities
export { createPasteHandler, isPasteValid } from './utils';

// Types
export type { LoginCredentials, RegisterCredentials, AuthFormState, ForgotPasswordState } from './types';
