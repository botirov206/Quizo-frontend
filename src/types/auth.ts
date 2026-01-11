// This defines what a "User" looks like in our app, 
// regardless of whether the backend is Node or Python.

export interface User {
  id: string;
  email: string;
  name: string;
  firstName?: string;
  lastName?: string;
  role: 'student' | 'teacher' | 'admin' | 'user';
  totalScore?: number;
  quizzesPlayed?: number;
}

export interface AuthResponse {
  user: User;
  token: string; // The JWT
  message?: string;
}

// Backend-specific user structure (for API responses)
export interface BackendUserResponse {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: 'user' | 'teacher' | 'admin';
  totalScore?: number;
  quizzesPlayed?: number;
}

// Helper to convert backend user to app user
export const normalizeBackendUser = (backendUser: BackendUserResponse): User => ({
  id: backendUser.id,
  email: backendUser.email,
  name: `${backendUser.firstName} ${backendUser.lastName}`.trim(),
  firstName: backendUser.firstName,
  lastName: backendUser.lastName,
  // Map 'user' role to 'student' for UI compatibility
  role: backendUser.role === 'user' ? 'student' : backendUser.role,
  totalScore: backendUser.totalScore,
  quizzesPlayed: backendUser.quizzesPlayed,
});