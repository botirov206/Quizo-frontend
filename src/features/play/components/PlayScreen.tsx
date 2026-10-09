import { useState } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { PlayFeedback } from './PlayFeedback';
import { PlayQuestion } from './PlayQuestion';
import { PlayResult } from './PlayResult';
import { usePlaySession } from '../hooks/usePlaySession';

export function PlayScreen() {
  const { sessionId = '' } = useParams();
  const [params] = useSearchParams();
  const quizId = params.get('quizId') ?? undefined;
  const play = usePlaySession(sessionId, quizId);
  const [againPending, setAgainPending] = useState(false);

  if (play.status === 'loading') {
    return <p className="p-10 text-center text-muted-foreground">Getting the first question…</p>;
  }

  if (play.status === 'error') {
    return (
      <div className="mx-auto max-w-md space-y-4 p-10 text-center">
        <p className="text-lg font-semibold">{play.error}</p>
        <Button asChild variant="outline"><Link to="/dashboard">Back home</Link></Button>
      </div>
    );
  }

  if (play.status === 'result' && play.result) {
    return (
      <PlayResult
        result={play.result}
        quizId={quizId}
        againPending={againPending}
        onAgain={() => {
          setAgainPending(true);
          void play.playAgain().catch(() => setAgainPending(false));
        }}
      />
    );
  }

  const end = () => {
    if (window.confirm('End this quiz? Unanswered questions score 0.')) {
      void play.endEarly();
    }
  };

  return (
    <div className="mx-auto flex min-h-screen max-w-4xl flex-col gap-6 px-4 py-6">
      <header className="flex items-center justify-between gap-4">
        <p className="font-semibold">Question {play.questionNumber} of {play.total}</p>
        <p className="text-2xl font-bold tabular-nums">{play.status === 'question' ? `${play.secondsLeft}s` : ''}</p>
        <p className="font-semibold">{play.totalScore} pts</p>
      </header>
      {play.status === 'question' && play.question && (
        <PlayQuestion
          question={play.question}
          disabled={play.busy}
          pendingOption={play.pendingOption}
          onChoose={play.choose}
        />
      )}
      {play.status === 'feedback' && play.question && play.feedback && (
        <PlayFeedback
          question={play.question}
          feedback={play.feedback}
          selectedOption={play.pendingOption}
        />
      )}
      <div className="mt-auto">
        <Button variant="ghost" onClick={end}>End quiz</Button>
      </div>
    </div>
  );
}
