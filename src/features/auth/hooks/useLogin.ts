import { useState, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import type { LoginCredentials, AuthFormState } from '../types';
import { INITIAL_AUTH_FORM_STATE, AUTH_ERROR_MESSAGES } from '../constants';

export const useLogin = () => {
  const { login } = useAuth();
  const [state, setState] = useState<AuthFormState>(INITIAL_AUTH_FORM_STATE);

  const handleLogin = useCallback(async (credentials: LoginCredentials) => {
    setState({ loading: true, error: '' });

    try {
      await login(credentials.email, credentials.password);
      return { success: true };
    } catch (err) {
      setState({ loading: false, error: AUTH_ERROR_MESSAGES.INVALID_CREDENTIALS });
      return { success: false };
    } finally {
      setState((prev) => ({ ...prev, loading: false }));
    }
  }, [login]);

  const clearError = useCallback(() => {
    setState((prev) => ({ ...prev, error: '' }));
  }, []);

  return {
    ...state,
    handleLogin,
    clearError,
  };
};
