/**
 * JoinClassDialog Component
 * Dialog for students to join a classroom via 6-digit code
 */

import type { FC } from 'react';
import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';
import { CODE_LENGTH } from '../constants';

interface JoinClassDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (code: string) => void;
  isLoading?: boolean;
  error?: string | null;
}

export const JoinClassDialog: FC<JoinClassDialogProps> = ({
  isOpen,
  onClose,
  onSubmit,
  isLoading = false,
  error,
}) => {
  const [code, setCode] = useState('');
  const [localError, setLocalError] = useState<string | null>(null);

  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Only allow alphanumeric characters, convert to uppercase
    const value = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '');
    if (value.length <= CODE_LENGTH) {
      setCode(value);
      setLocalError(null);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (code.length !== CODE_LENGTH) {
      setLocalError(`Code must be exactly ${CODE_LENGTH} characters`);
      return;
    }

    setLocalError(null);
    onSubmit(code);
  };

  const handleClose = () => {
    setCode('');
    setLocalError(null);
    onClose();
  };

  const displayError = error || localError;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>Join Classroom</DialogTitle>
          <DialogDescription>
            Enter the 6-digit code provided by your teacher to join a classroom.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="code">Classroom Code</Label>
              <Input
                id="code"
                value={code}
                onChange={handleCodeChange}
                placeholder="ABC123"
                className="text-center text-2xl font-mono tracking-widest"
                maxLength={CODE_LENGTH}
                disabled={isLoading}
                autoFocus
              />
              <p className="text-xs text-muted-foreground text-center">
                {code.length}/{CODE_LENGTH} characters
              </p>
              {displayError && (
                <p className="text-sm text-destructive text-center">{displayError}</p>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose} disabled={isLoading}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading || code.length !== CODE_LENGTH}>
              {isLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Join Classroom
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
