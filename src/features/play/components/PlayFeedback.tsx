import type { PlayAnswer, PlayerQuestion } from '@/api/types';
import { cn } from '@/lib/utils';

interface PlayFeedbackProps {
  question: PlayerQuestion;
  feedback: PlayAnswer;
  selectedOption: string | null;
}

export function PlayFeedback({ question, feedback, selectedOption }: PlayFeedbackProps) {
  const title = feedback.timedOut ? 'Time’s up' : feedback.isCorrect ? 'Correct' : 'Not quite';

  return (
    <div className="space-y-6">
      <div className="text-center">
        <p className="text-sm uppercase tracking-wide text-muted-foreground">{title}</p>
        <p className="mt-1 text-3xl font-bold">+{feedback.pointsEarned}</p>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        {question.options.map((option) => {
          const correct = option === feedback.correctOption;
          const picked = option === selectedOption && !correct;
          return (
            <div
              key={option}
              className={cn(
                'rounded-2xl border px-4 py-4 text-lg font-semibold',
                correct && 'border-play-green bg-play-green text-white',
                picked && 'border-play-red bg-play-red/10',
                !correct && !picked && 'bg-card',
              )}
            >
              {option}
            </div>
          );
        })}
      </div>
      {feedback.explanation && (
        <p className="rounded-xl bg-card p-4 text-center text-muted-foreground">{feedback.explanation}</p>
      )}
    </div>
  );
}
