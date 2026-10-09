import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import type { AuthResponse } from '@/api/types';
import {
  googleAuthApi,
  loginApi,
  logoutApi,
  refreshApi,
  registerApi,
  telegramAuthApi,
} from '@/features/auth/api';
import { toApiRole, toUser, type SignupRole } from '@/features/auth/utils';
import { clearAccessToken, onAuthFailure, setAccessToken } from '@/lib/token';
import type { User } from '@/types/auth';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (
    firstName: string,
    lastName: string,
    email: string,
    password: string,
    role?: SignupRole,
  ) => Promise<void>;
  loginWithGoogle: (credential: string, role?: SignupRole) => Promise<void>;
  loginWithTelegram: (idToken: string, role?: SignupRole) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

let sessionBootstrap: Promise<AuthResponse> | null = null;

function loadSession(): Promise<AuthResponse> {
  sessionBootstrap ??= refreshApi().finally(() => {
    sessionBootstrap = null;
  });
  return sessionBootstrap;
}

function acceptSession(session: AuthResponse, setUser: (user: User) => void): void {
  setAccessToken(session.accessToken);
  setUser(toUser(session.user));
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    let active = true;

    loadSession()
      .then((session) => {
        if (active) acceptSession(session, setUser);
      })
      .catch(() => {
        if (active) setUser(null);
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    onAuthFailure(() => setUser(null));
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    acceptSession(await loginApi({ email, password }), setUser);
  }, []);

  const register = useCallback(async (
    firstName: string,
    lastName: string,
    email: string,
    password: string,
    role: SignupRole = 'student',
  ) => {
    acceptSession(await registerApi({
      firstName,
      lastName,
      email,
      password,
      role: toApiRole(role),
    }), setUser);
  }, []);

  const loginWithGoogle = useCallback(async (credential: string, role?: SignupRole) => {
    acceptSession(await googleAuthApi({
      token: credential,
      role: role ? toApiRole(role) : undefined,
    }), setUser);
  }, []);

  const loginWithTelegram = useCallback(async (idToken: string, role?: SignupRole) => {
    acceptSession(await telegramAuthApi({
      idToken,
      role: role ? toApiRole(role) : undefined,
    }), setUser);
  }, []);

  const logout = useCallback(async () => {
    try {
      await logoutApi();
    } catch {
      // Local session still ends when the server cannot be reached.
    }
    clearAccessToken();
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{
      user,
      isLoading,
      login,
      logout,
      register,
      loginWithGoogle,
      loginWithTelegram,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
