import { useState, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import type { LoginCredentials, AuthFormState } from '../types';
import { INITIAL_AUTH_FORM_STATE, AUTH_ERROR_MESSAGES } from '../constants';

export const useLogin = () => {
  const { login, loginWithGoogle } = useAuth();
  const [state, setState] = useState<AuthFormState>(INITIAL_AUTH_FORM_STATE);

  const handleLogin = useCallback(async (credentials: LoginCredentials) => {
    setState({ loading: true, error: '' });

    try {
      await login(credentials.email, credentials.password);
      return { success: true };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : AUTH_ERROR_MESSAGES.INVALID_CREDENTIALS;
      setState({ loading: false, error: errorMessage });
      return { success: false };
    } finally {
      setState((prev) => ({ ...prev, loading: false }));
    }
  }, [login]);

  const handleGoogleLogin = useCallback(async (googleToken: string) => {
    setState({ loading: true, error: '' });

    try {
      await loginWithGoogle(googleToken);
      return { success: true };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Google login failed';
      setState({ loading: false, error: errorMessage });
      return { success: false };
    } finally {
      setState((prev) => ({ ...prev, loading: false }));
    }
  }, [loginWithGoogle]);

  const clearError = useCallback(() => {
    setState((prev) => ({ ...prev, error: '' }));
  }, []);

  return {
    ...state,
    handleLogin,
    handleGoogleLogin,
    clearError,
  };
};
