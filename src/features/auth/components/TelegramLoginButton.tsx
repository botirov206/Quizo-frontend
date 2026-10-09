import { Button } from '@/components/ui/button';
import { useTelegramLogin } from '../hooks/useTelegramLogin';
import type { SignupRole } from '../utils';

export function TelegramLoginButton({ role }: { role?: SignupRole }) {
  const clientId = import.meta.env.VITE_TELEGRAM_CLIENT_ID;
  const { start } = useTelegramLogin(role);
  if (!clientId) return null;

  return (
    <Button
      type="button"
      variant="outline"
      className="w-full"
      onClick={() => {
        void start();
      }}
    >
      Continue with Telegram
    </Button>
  );
}
