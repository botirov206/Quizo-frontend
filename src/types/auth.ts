/**
 * App User
 * UI-facing user shape. AuthContext maps backend `user` role to `student`.
 */

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
