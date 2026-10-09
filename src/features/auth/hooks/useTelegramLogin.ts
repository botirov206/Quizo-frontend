import { useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import { toastApiError } from '@/lib/toast-api-error';
import { toast } from 'sonner';
import type { SignupRole } from '../utils';

const SCRIPT_URL = 'https://oauth.telegram.org/js/telegram-login.js';

let scriptPromise: Promise<void> | null = null;

function loadTelegramScript(): Promise<void> {
  if (window.Telegram?.Login) return Promise.resolve();
  if (scriptPromise) return scriptPromise;

  scriptPromise = new Promise((resolve, reject) => {
    const found = document.querySelector<HTMLScriptElement>(`script[src="${SCRIPT_URL}"]`);
    const script = found ?? document.createElement('script');
    const fail = () => {
      script.remove();
      scriptPromise = null;
      reject(new Error('Telegram login failed to load'));
    };
    script.addEventListener('load', () => {
      if (window.Telegram?.Login) resolve();
      else fail();
    }, { once: true });
    script.addEventListener('error', fail, { once: true });
    if (!found) {
      script.src = SCRIPT_URL;
      script.async = true;
      document.head.appendChild(script);
    }
  });

  return scriptPromise;
}

export function useTelegramLogin(role?: SignupRole) {
  const { loginWithTelegram } = useAuth();

  const start = useCallback(async () => {
    const clientId = import.meta.env.VITE_TELEGRAM_CLIENT_ID;
    if (!clientId) return;

    try {
      await loadTelegramScript();
    } catch (error) {
      toastApiError(error);
      return;
    }

    window.Telegram?.Login.auth(
      { client_id: Number(clientId), scope: ['profile'] },
      (data) => {
        if (data.error) {
          toast.error(data.error);
          return;
        }
        if (!data.id_token) return;
        void loginWithTelegram(data.id_token, role).catch((error: unknown) => {
          toastApiError(error);
        });
      },
    );
  }, [loginWithTelegram, role]);

  return { start };
}
