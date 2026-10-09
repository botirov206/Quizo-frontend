import { Label } from '@/components/ui/label';
import { Trophy } from 'lucide-react';
import { DIFFICULTY_OPTIONS } from '../constants';
import { countForDifficulty, type Category, type ExploreDifficulty } from '../types';

interface DifficultyPickerProps {
  value: ExploreDifficulty;
  counts?: Category['counts'];
  onChange: (value: ExploreDifficulty) => void;
}

export const DifficultyPicker = ({ value, counts, onChange }: DifficultyPickerProps) => {
  return (
    <div className="space-y-4">
      <Label className="flex items-center gap-2 text-base font-semibold">
        <Trophy className="h-5 w-5 text-primary" />
        Difficulty Level
      </Label>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {DIFFICULTY_OPTIONS.map((option) => {
          const count = countForDifficulty(counts, option.value);
          const unavailable = count === 0;
          const selected = value === option.value;
          return (
            <button
              key={option.value}
              type="button"
              disabled={unavailable}
              onClick={() => onChange(option.value)}
              className={`
                relative rounded-xl border-2 p-4 text-center transition-all
                ${unavailable ? 'cursor-not-allowed opacity-50' : 'hover:scale-105'}
                ${selected
                  ? 'border-primary bg-primary/10 ring-2 ring-primary/20 shadow-lg'
                  : 'border-muted hover:border-primary/50 hover:bg-muted/50'
                }
              `}
            >
              <div className="text-lg font-bold">{option.label}</div>
              <div className={`text-sm font-medium ${option.color}`}>
                {option.points} pts per question
              </div>
              {count !== undefined && (
                <div className="text-xs text-muted-foreground">{count} available</div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
