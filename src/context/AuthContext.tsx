import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { User, AuthResponse } from '@/types/auth';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (name: string, email: string, password: string) => Promise<void>; // <--- ADD THIS
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);


  // 1. Check LocalStorage on Load (Persistence)
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

  // 2. The Login Action (Currently Mocked)
  const login = async (email: string, _password: string) => {
    // TODO: Replace this with real API call later:
    // const res = await api.post('/auth/login', { email, password });
    
    // MOCK SIMULATION (Wait 1 second)
    await new Promise((resolve) => setTimeout(resolve, 1000));

    if (email === 'fail@test.com') {
      throw new Error('Invalid credentials');
    }

    // Determine role based on email for testing
    const isTeacher = email.toLowerCase() === 'teacher@test.com';
    
    const mockResponse: AuthResponse = {
      token: isTeacher ? 'fake-jwt-token-teacher-12345' : 'fake-jwt-token-student-12345',
      user: {
        id: isTeacher ? 'teacher-1' : 'student-1',
        email: email,
        name: isTeacher ? 'Test Teacher' : 'Test Student',
        role: isTeacher ? 'teacher' : 'student',
      },
    };

    // Save to State & Storage
    setToken(mockResponse.token);
    setUser(mockResponse.user);
    localStorage.setItem('token', mockResponse.token);
    localStorage.setItem('user', JSON.stringify(mockResponse.user));
  };

  // 3. The Register Action (Mocked)
  const register = async (name: string, email: string, _password: string) => {
    // MOCK SIMULATION
    await new Promise((resolve) => setTimeout(resolve, 1000));

    if (email === 'exists@test.com') {
      throw new Error('User already exists');
    }

    // Determine role based on email pattern for testing
    const isTeacher = email.toLowerCase().includes('teacher');
    
    const mockResponse: AuthResponse = {
      token: 'fake-jwt-token-register-123',
      user: {
        id: isTeacher ? 'teacher-new' : 'student-new',
        email: email,
        name: name,
        role: isTeacher ? 'teacher' : 'student',
      },
    };

    setToken(mockResponse.token);
    setUser(mockResponse.user);
    localStorage.setItem('token', mockResponse.token);
    localStorage.setItem('user', JSON.stringify(mockResponse.user));
  };

  // 4. The Logout Action
  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    // Optional: Redirect to login page here or in the UI
  };

  return (
    <AuthContext.Provider value={{ user, token, isLoading, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};


// 4. Custom Hook for easy usage
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};