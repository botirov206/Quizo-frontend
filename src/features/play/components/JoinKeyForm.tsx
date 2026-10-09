import { useState } from 'react';
import type { FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/context/AuthContext';
import { getErrorMessage } from '@/lib/api-error';
import { startCustomPlay } from '../api';
import { playHref } from '../session';

function sanitizeKey(value: string): string {
  return value.replace(/[^a-zA-Z0-9]/g, '').toUpperCase().slice(0, 6);
}

export function JoinKeyForm({
  requireAuth = false,
  buttonLabel = 'Join',
}: {
  requireAuth?: boolean;
  buttonLabel?: string;
}) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [quizKey, setQuizKey] = useState('');
  const [pending, setPending] = useState(false);
  const [error, setError] = useState('');

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (quizKey.length !== 6 || pending) return;
    if (requireAuth && !user) {
      navigate('/login', { state: { from: `/join?code=${quizKey}` } });
      return;
    }
    setPending(true);
    setError('');
    try {
      const started = await startCustomPlay(quizKey);
      navigate(playHref(started.sessionId, started.quizId));
    } catch (err) {
      setError(getErrorMessage(err));
      setPending(false);
    }
  };

  return (
    <form onSubmit={(event) => { void submit(event); }} className="space-y-3">
      <Input
        value={quizKey}
        onChange={(event) => setQuizKey(sanitizeKey(event.target.value))}
        placeholder="ABC123"
        maxLength={6}
        autoComplete="off"
        aria-label="Quiz key"
        className="h-14 text-center font-mono text-2xl uppercase tracking-[0.3em]"
      />
      {error && <p className="text-center text-sm text-destructive">{error}</p>}
      <Button type="submit" className="h-12 w-full text-base" disabled={quizKey.length !== 6 || pending}>
        {pending ? 'Joining…' : buttonLabel}
      </Button>
    </form>
  );
}
