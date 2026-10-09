import { useCallback } from 'react';
import { GoogleLogin, type CredentialResponse } from '@react-oauth/google';
import { toast } from 'sonner';
import { useAuth } from '@/context/AuthContext';
import { toastApiError } from '@/lib/toast-api-error';
import type { SignupRole } from '../utils';
import { TelegramLoginButton } from './TelegramLoginButton';

interface SocialAuthButtonsProps {
  role?: SignupRole;
  googleText?: 'continue_with' | 'signup_with';
  useOneTap?: boolean;
}

export function SocialAuthButtons({
  role,
  googleText = 'continue_with',
  useOneTap = false,
}: SocialAuthButtonsProps) {
  const { loginWithGoogle } = useAuth();

  const onGoogleSuccess = useCallback(async (response: CredentialResponse) => {
    const credential = response.credential;
    if (!credential) {
      toast.error('Google sign-in failed');
      return;
    }
    try {
      await loginWithGoogle(credential, role);
    } catch (error) {
      toastApiError(error);
    }
  }, [loginWithGoogle, role]);

  return (
    <div className="space-y-4">
      <div className="flex justify-center">
        <GoogleLogin
          onSuccess={(response) => {
            void onGoogleSuccess(response);
          }}
          onError={() => {
            toast.error('Google sign-in failed');
          }}
          theme="outline"
          size="large"
          text={googleText}
          width="320"
          useOneTap={useOneTap}
        />
      </div>
      <TelegramLoginButton role={role} />
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">or</span>
        </div>
      </div>
    </div>
  );
}
