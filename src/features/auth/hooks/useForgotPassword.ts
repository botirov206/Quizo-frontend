import { useState, useCallback } from 'react';
import type { ForgotPasswordState } from '../types/index';
import { INITIAL_FORGOT_PASSWORD_STATE, AUTH_ERROR_MESSAGES, AUTH_MOCK_DELAYS } from '../constants';

export const useForgotPassword = () => {
  const [state, setState] = useState<ForgotPasswordState>(INITIAL_FORGOT_PASSWORD_STATE);

  const handleEmailChange = useCallback((email: string) => {
    setState((prev) => ({ ...prev, email }));
  }, []);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setState((prev) => ({ ...prev, loading: true, error: '' }));
    try {
      // TODO: Implement actual password reset API call
      await new Promise((resolve) => setTimeout(resolve, AUTH_MOCK_DELAYS.FORGOT_PASSWORD));
      setState((prev) => ({ ...prev, sent: true, loading: false }));
    } catch (_err) {
      setState((prev) => ({ ...prev, error: AUTH_ERROR_MESSAGES.PASSWORD_RESET_FAILED, loading: false }));
    }
  }, []);

  const reset = useCallback(() => {
    setState((prev) => ({ ...prev, sent: false, error: '', loading: false }));
  }, []);

  return {
    ...state,
    handleEmailChange,
    handleSubmit,
    reset,
  };
};
