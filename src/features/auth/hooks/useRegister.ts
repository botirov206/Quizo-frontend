import { useState, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import type { RegisterCredentials, AuthFormState } from '../types';
import { INITIAL_AUTH_FORM_STATE, AUTH_ERROR_MESSAGES, AUTH_VALIDATION_MESSAGES } from '../constants';

export const useRegister = () => {
  const { register } = useAuth();
  const [state, setState] = useState<AuthFormState>(INITIAL_AUTH_FORM_STATE);

  const handleRegister = useCallback(async (credentials: RegisterCredentials) => {
    setState({ loading: true, error: '' });

    // Validate password match
    if (credentials.password !== credentials.confirmPassword) {
      setState({ loading: false, error: AUTH_VALIDATION_MESSAGES.PASSWORDS_NOT_MATCH });
      return { success: false };
    }

    try {
      await register(credentials.name, credentials.email, credentials.password);
      return { success: true };
    } catch (err) {
      setState({ loading: false, error: AUTH_ERROR_MESSAGES.REGISTRATION_FAILED });
      return { success: false };
    } finally {
      setState((prev) => ({ ...prev, loading: false }));
    }
  }, [register]);

  const clearError = useCallback(() => {
    setState((prev) => ({ ...prev, error: '' }));
  }, []);

  return {
    ...state,
    handleRegister,
    clearError,
  };
};
