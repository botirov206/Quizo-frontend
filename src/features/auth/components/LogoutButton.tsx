import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';

export const LogoutButton = () => {
  const { logout } = useAuth();
  return (
    <Button variant="destructive" onClick={logout}>
      Sign Out
    </Button>
  );
};
