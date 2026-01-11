import { useState, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import type { AuthFormState } from '../types';
import { INITIAL_AUTH_FORM_STATE, AUTH_ERROR_MESSAGES, AUTH_VALIDATION_MESSAGES } from '../constants';

export interface RegisterFormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  role?: 'student' | 'teacher';
}

export const useRegister = () => {
  const { register } = useAuth();
  const [state, setState] = useState<AuthFormState>(INITIAL_AUTH_FORM_STATE);

  const handleRegister = useCallback(async (credentials: RegisterFormData) => {
    setState({ loading: true, error: '' });

    // Validate password match
    if (credentials.password !== credentials.confirmPassword) {
      setState({ loading: false, error: AUTH_VALIDATION_MESSAGES.PASSWORDS_NOT_MATCH });
      return { success: false };
    }

    try {
      await register(
        credentials.firstName,
        credentials.lastName,
        credentials.email,
        credentials.password,
        credentials.role || 'student'
      );
      return { success: true };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : AUTH_ERROR_MESSAGES.REGISTRATION_FAILED;
      setState({ loading: false, error: errorMessage });
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
