import { useState, useCallback } from 'react';
import { getErrorMessage } from '@/lib/api-error';
import { forgotPasswordApi } from '../api';
import type { ForgotPasswordState } from '../types/index';
import { INITIAL_FORGOT_PASSWORD_STATE } from '../constants';

export const useForgotPassword = () => {
  const [state, setState] = useState<ForgotPasswordState>(INITIAL_FORGOT_PASSWORD_STATE);

  const handleEmailChange = useCallback((email: string) => {
    setState((prev) => ({ ...prev, email }));
  }, []);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    const submittedEmail = state.email;
    setState((prev) => ({ ...prev, loading: true, error: '' }));
    try {
      await forgotPasswordApi({ email: submittedEmail });
      setState((prev) => ({ ...prev, sent: true, loading: false }));
    } catch (error) {
      setState((prev) => ({ ...prev, error: getErrorMessage(error), loading: false }));
    }
  }, [state.email]);

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
