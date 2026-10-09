export { LoginForm } from './components/LoginForm';
export { RegisterForm } from './components/RegisterForm';
export { LogoutButton } from './components/LogoutButton';
export { ForgotPasswordForm } from './components/ForgotPasswordForm';
export { ResetPasswordForm } from './components/ResetPasswordForm';
export { RequireAuth } from './components/RequireAuth';
export { RequireRole } from './components/RequireRole';

export { useLogin } from './hooks/useLogin';
export { useRegister, type RegisterFormData } from './hooks/useRegister';
export { useForgotPassword } from './hooks/useForgotPassword';

export {
  MAX_INPUT_LENGTH,
  MAX_NAME_LENGTH,
  MIN_PASSWORD_LENGTH,
  AUTH_VALIDATION_MESSAGES,
  INITIAL_AUTH_FORM_STATE,
  INITIAL_FORGOT_PASSWORD_STATE,
} from './constants';

export { createPasteHandler, isPasteValid, toApiRole, toUser } from './utils';
export type { SignupRole } from './utils';
export type { LoginCredentials, AuthFormState, ForgotPasswordState } from './types';
