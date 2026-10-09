/**
 * Auth API Public Exports
 * Re-exports authentication API functions and types
 */

export {
  loginApi,
  registerApi,
  googleAuthApi,
  getUserProfileApi,
  normalizeAuthResponse,
  type LoginRequest,
  type RegisterRequest,
  type GoogleAuthRequest,
  type BackendUser,
  type BackendAuthResponse,
  type AuthResponse,
  type UserProfileResponse,
} from './authApi';
