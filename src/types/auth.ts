// This defines what a "User" looks like in our app, 
// regardless of whether the backend is Node or Python.

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'student' | 'teacher' | 'admin';
}

export interface AuthResponse {
  user: User;
  token: string; // The JWT
}