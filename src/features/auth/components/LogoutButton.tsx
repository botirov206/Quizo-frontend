/**
 * Logout Button
 * Signs the current user out of the session
 */

import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';

export const LogoutButton = () => {
  const { logout } = useAuth();
  return (
    <Button variant="destructive" onClick={() => { void logout(); }}>
      Sign Out
    </Button>
  );
};
