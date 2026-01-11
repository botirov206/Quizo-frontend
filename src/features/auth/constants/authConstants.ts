/**
 * Auth Feature Constants
 * Centralized configuration for authentication-related values
 */

// Input validation limits
export const MAX_INPUT_LENGTH = 150;
export const MAX_NAME_LENGTH = 100;
export const MIN_PASSWORD_LENGTH = 8;

// Form validation messages
export const AUTH_VALIDATION_MESSAGES = {
  EMAIL_REQUIRED: 'Email is required',
  EMAIL_INVALID: 'Please enter a valid email',
  PASSWORD_REQUIRED: 'Password is required',
  PASSWORD_MIN_LENGTH: `Password must be at least ${MIN_PASSWORD_LENGTH} characters`,
  PASSWORDS_NOT_MATCH: 'Passwords do not match',
  NAME_REQUIRED: 'Name is required',
} as const;

// Error messages returned from auth operations
export const AUTH_ERROR_MESSAGES = {
  INVALID_CREDENTIALS: 'Invalid email or password',
  REGISTRATION_FAILED: 'Registration failed. Try a different email.',
  PASSWORD_RESET_FAILED: 'Failed to send reset email. Please try again.',
  USER_EXISTS: 'User already exists',
} as const;

// LocalStorage keys
export const AUTH_STORAGE_KEYS = {
  TOKEN: 'token',
  USER: 'user',
} as const;

// API simulation delays (for mock)
export const AUTH_MOCK_DELAYS = {
  LOGIN: 1000,
  REGISTER: 1000,
  FORGOT_PASSWORD: 1500,
} as const;

// Initial auth form state
export const INITIAL_AUTH_FORM_STATE = {
  loading: false,
  error: '',
} as const;

export const INITIAL_FORGOT_PASSWORD_STATE = {
  email: '',
  loading: false,
  sent: false,
  error: '',
} as const;
