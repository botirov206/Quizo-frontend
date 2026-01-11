/**
 * Auth API Service
 * Handles all authentication-related API calls to the backend
 */

import { apiClient } from '@/lib/axios';

// ============================================================================
// Types
// ============================================================================

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: 'user' | 'teacher'; // Backend uses 'user' for students
}

export interface GoogleAuthRequest {
  token: string;
}

export interface BackendUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: 'user' | 'teacher' | 'admin';
  totalScore?: number;
  quizzesPlayed?: number;
}

/**
 * Backend auth response - user data is at root level with token
 * Example: { id, firstName, lastName, email, role, token }
 */
export interface BackendAuthResponse {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: 'user' | 'teacher' | 'admin';
  token: string;
  message?: string;
}

/**
 * Normalized auth response for frontend use
 */
export interface AuthResponse {
  token: string;
  user: BackendUser;
  message?: string;
}

/**
 * Normalize backend auth response to frontend format
 */
export const normalizeAuthResponse = (response: BackendAuthResponse): AuthResponse => ({
  token: response.token,
  user: {
    id: response.id,
    firstName: response.firstName,
    lastName: response.lastName,
    email: response.email,
    role: response.role,
  },
  message: response.message,
});

export interface UserProfileResponse {
  firstName: string;
  lastName: string;
  email: string;
  totalScore: number;
  quizzesPlayed: number;
}

// ============================================================================
// API Endpoints
// ============================================================================

const AUTH_ENDPOINTS = {
  LOGIN: '/login',
  REGISTER: '/register',
  GOOGLE_AUTH: '/auth/google',
  USER_PROFILE: (userId: string) => `/me/${userId}`,
} as const;

// ============================================================================
// API Functions
// ============================================================================

/**
 * Login with email and password
 */
export const loginApi = async (credentials: LoginRequest): Promise<AuthResponse> => {
  const response = await apiClient.post<BackendAuthResponse>(
    AUTH_ENDPOINTS.LOGIN,
    credentials
  );
  return normalizeAuthResponse(response.data);
};

/**
 * Register a new user
 */
export const registerApi = async (userData: RegisterRequest): Promise<AuthResponse> => {
  const response = await apiClient.post<BackendAuthResponse>(
    AUTH_ENDPOINTS.REGISTER,
    userData
  );
  return normalizeAuthResponse(response.data);
};

/**
 * Authenticate with Google OAuth token
 */
export const googleAuthApi = async (googleToken: string): Promise<AuthResponse> => {
  const response = await apiClient.post<BackendAuthResponse>(
    AUTH_ENDPOINTS.GOOGLE_AUTH,
    { token: googleToken }
  );
  return normalizeAuthResponse(response.data);
};

/**
 * Get user profile and stats
 */
export const getUserProfileApi = async (userId: string): Promise<UserProfileResponse> => {
  const response = await apiClient.get<UserProfileResponse>(
    AUTH_ENDPOINTS.USER_PROFILE(userId)
  );
  return response.data;
};
