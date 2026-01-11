import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { ReactNode } from 'react';
import type { User } from '@/types/auth';
import { loginApi, registerApi, googleAuthApi, type BackendUser } from '@/features/auth/api';
import { getErrorMessage } from '@/lib/axios';

/**
 * Convert backend user to app user format
 */
const convertToAppUser = (backendUser: BackendUser): User => ({
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

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (firstName: string, lastName: string, email: string, password: string, role?: 'student' | 'teacher') => Promise<void>;
  loginWithGoogle: (googleToken: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check LocalStorage on Load (Persistence)
  useEffect(() => {
    try {
      const storedToken = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');

      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error('Failed to load auth from localStorage:', error);
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Helper to save auth data
  const saveAuthData = useCallback((authToken: string, authUser: User) => {
    setToken(authToken);
    setUser(authUser);
    localStorage.setItem('token', authToken);
    localStorage.setItem('user', JSON.stringify(authUser));
  }, []);

  // Login with email and password
  const login = useCallback(async (email: string, password: string) => {
    try {
      const response = await loginApi({ email, password });
      
      // Convert backend user to app user format
      const appUser = convertToAppUser(response.user);
      
      saveAuthData(response.token, appUser);
    } catch (error) {
      const message = getErrorMessage(error);
      throw new Error(message || 'Login failed');
    }
  }, [saveAuthData]);

  // Register new user
  const register = useCallback(async (
    firstName: string,
    lastName: string,
    email: string,
    password: string,
    role: 'student' | 'teacher' = 'student'
  ) => {
    try {
      // Map 'student' to 'user' for backend API (backend uses 'user' role)
      const backendRole = role === 'student' ? 'user' : 'teacher';
      
      const response = await registerApi({
        firstName,
        lastName,
        email,
        password,
        role: backendRole,
      });
      
      // Convert backend user to app user format
      const appUser = convertToAppUser(response.user);
      
      saveAuthData(response.token, appUser);
    } catch (error) {
      const message = getErrorMessage(error);
      throw new Error(message || 'Registration failed');
    }
  }, [saveAuthData]);

  // Login with Google OAuth
  const loginWithGoogle = useCallback(async (googleToken: string) => {
    try {
      const response = await googleAuthApi(googleToken);
      
      // Convert backend user to app user format
      const appUser = convertToAppUser(response.user);
      
      saveAuthData(response.token, appUser);
    } catch (error) {
      const message = getErrorMessage(error);
      throw new Error(message || 'Google authentication failed');
    }
  }, [saveAuthData]);

  // Logout
  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }, []);

  return (
    <AuthContext.Provider value={{ 
      user, 
      token, 
      isLoading, 
      login, 
      logout, 
      register,
      loginWithGoogle 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom Hook for easy usage
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
