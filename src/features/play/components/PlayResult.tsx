import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import type { PlayResult as PlayResultData } from '@/api/types';
import { Button } from '@/components/ui/button';
import { fetchLeaderboard } from '../api';

interface PlayResultProps {
  result: PlayResultData;
  quizId?: string;
  onAgain: () => void;
  againPending: boolean;
}

export function PlayResult({ result, quizId, onAgain, againPending }: PlayResultProps) {
  const board = useQuery({
    queryKey: ['leaderboard', quizId],
    queryFn: () => fetchLeaderboard(quizId ?? ''),
    enabled: Boolean(quizId),
  });

  return (
    <div className="mx-auto max-w-3xl space-y-8 px-4 py-10">
      <div className="text-center">
        <p className="text-sm uppercase tracking-wide text-muted-foreground">{result.quizTitle}</p>
        <p className="mt-2 text-6xl font-bold">{result.percentage}%</p>
        <p className="mt-2 text-muted-foreground">
          {result.correctCount} of {result.totalQuestions} correct · {result.totalScore} points · {result.timeSpent}s
        </p>
      </div>

      <div className="flex justify-center gap-3">
        <Button onClick={onAgain} disabled={againPending}>Play again</Button>
        <Button variant="outline" asChild>
          <Link to="/dashboard">Back home</Link>
        </Button>
      </div>

      {quizId && (
        <section className="rounded-2xl bg-card p-4">
          <h2 className="mb-3 text-lg font-bold">Leaderboard</h2>
          {board.isLoading && <p className="text-sm text-muted-foreground">Loading scores…</p>}
          {board.data && board.data.items.length === 0 && (
            <p className="text-sm text-muted-foreground">No finished scores yet.</p>
          )}
          <ol className="space-y-2">
            {board.data?.items.map((entry) => (
              <li key={entry.userId} className="flex items-center justify-between text-sm">
                <span>{entry.rank}. {entry.firstName} {entry.lastName}</span>
                <span className="font-semibold">{entry.totalScore}</span>
              </li>
            ))}
          </ol>
        </section>
      )}

      <section className="space-y-3">
        <h2 className="text-lg font-bold">Review</h2>
        {result.answers.map((answer, index) => (
          <article key={answer.questionId} className="rounded-2xl bg-card p-4">
            <p className="font-semibold">{index + 1}. {answer.questionText}</p>
            <p className="mt-2 text-sm">
              {answer.timedOut ? 'Timed out' : `You chose ${answer.selectedOption ?? 'nothing'}`}
              {answer.isCorrect ? '' : ` · Answer: ${answer.correctOption}`}
            </p>
          </article>
        ))}
      </section>
    </div>
  );
}
