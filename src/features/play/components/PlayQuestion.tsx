import type { PlayerQuestion } from '@/api/types';
import { cn } from '@/lib/utils';

const COLORS = [
  'bg-play-red text-white',
  'bg-play-blue text-white',
  'bg-play-yellow text-zinc-950',
  'bg-play-green text-white',
] as const;

const LETTERS = ['A', 'B', 'C', 'D', 'E', 'F'];

interface PlayQuestionProps {
  question: PlayerQuestion;
  disabled: boolean;
  pendingOption: string | null;
  onChoose: (option: string) => void;
}

export function PlayQuestion({ question, disabled, pendingOption, onChoose }: PlayQuestionProps) {
  return (
    <div className="space-y-6">
      <h2 className="text-center text-2xl font-bold leading-snug md:text-4xl">{question.text}</h2>
      <div className="grid gap-3 sm:grid-cols-2">
        {question.options.map((option, index) => {
          const pending = pendingOption === option;
          return (
            <button
              key={option}
              type="button"
              disabled={disabled}
              onClick={() => onChoose(option)}
              className={cn(
                'flex min-h-20 items-center gap-3 rounded-2xl px-4 py-3 text-left text-lg font-semibold transition disabled:opacity-70',
                COLORS[index % COLORS.length],
                pending && 'ring-4 ring-white',
              )}
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-black/15 text-sm">
                {LETTERS[index] ?? index + 1}
              </span>
              <span>{option}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
