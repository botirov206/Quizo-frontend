/**
 * Login Hook
 * Email/password and Google login form state
 */

import { useState, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import { getErrorMessage } from '@/lib/api-error';
import type { LoginCredentials, AuthFormState } from '../types';
import { INITIAL_AUTH_FORM_STATE } from '../constants';

/** Submits credentials and tracks loading/error state */
export const useLogin = () => {
  const { login } = useAuth();
  const [state, setState] = useState<AuthFormState>(INITIAL_AUTH_FORM_STATE);

  const handleLogin = useCallback(async (credentials: LoginCredentials) => {
    setState({ loading: true, error: '' });

    try {
      await login(credentials.email, credentials.password);
      return { success: true };
    } catch (err) {
      setState({ loading: false, error: getErrorMessage(err) });
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
