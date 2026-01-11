/**
 * QuizConfigDialog Component
 * Modal for configuring quiz settings before starting
 */

import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Play, Clock, Hash, Trophy } from 'lucide-react';
import type { Category, QuizConfig } from '../types';
import { DEFAULT_QUIZ_CONFIG, QUIZ_CONFIG_LIMITS, DIFFICULTY_POINTS } from '../types';
import { DIFFICULTY_OPTIONS, QUESTION_PRESETS, TIME_PRESETS, STORAGE_KEYS } from '../constants';
import type { OpenTDBDifficulty } from '@/adapters';

interface QuizConfigDialogProps {
  category: Category | null;
  isOpen: boolean;
  onClose: () => void;
}

export const QuizConfigDialog = ({ category, isOpen, onClose }: QuizConfigDialogProps) => {
  const navigate = useNavigate();
  
  const [difficulty, setDifficulty] = useState<OpenTDBDifficulty>(DEFAULT_QUIZ_CONFIG.difficulty);
  const [timePerQuestion, setTimePerQuestion] = useState<number>(DEFAULT_QUIZ_CONFIG.timePerQuestion);
  const [numberOfQuestions, setNumberOfQuestions] = useState<number>(DEFAULT_QUIZ_CONFIG.numberOfQuestions);

  const handleStartQuiz = useCallback(() => {
    if (!category) return;

    const config: QuizConfig = {
      categoryId: category.id,
      categoryName: category.name,
      difficulty,
      timePerQuestion,
      numberOfQuestions,
    };

    // Save config to localStorage for the game engine to use
    localStorage.setItem(STORAGE_KEYS.QUIZ_CONFIG, JSON.stringify(config));

    // Navigate to the game with config params
    navigate(`/play/opentdb?category=${category.id}&difficulty=${difficulty}&amount=${numberOfQuestions}&time=${timePerQuestion}`);
    onClose();
  }, [category, difficulty, timePerQuestion, numberOfQuestions, navigate, onClose]);

  const handleTimeChange = (value: number) => {
    const clamped = Math.min(Math.max(value, QUIZ_CONFIG_LIMITS.MIN_TIME), QUIZ_CONFIG_LIMITS.MAX_TIME);
    setTimePerQuestion(clamped);
  };

  const handleQuestionsChange = (value: number) => {
    const clamped = Math.min(Math.max(value, QUIZ_CONFIG_LIMITS.MIN_QUESTIONS), QUIZ_CONFIG_LIMITS.MAX_QUESTIONS);
    setNumberOfQuestions(clamped);
  };

  const selectedDifficultyPoints = DIFFICULTY_POINTS[difficulty];
  const maxPossiblePoints = numberOfQuestions * selectedDifficultyPoints;

  if (!category) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <span className="text-2xl">{category.icon}</span>
            {category.name}
          </DialogTitle>
          <DialogDescription>
            Configure your quiz settings before starting
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Difficulty Selection */}
          <div className="space-y-3">
            <Label className="flex items-center gap-2 text-base font-medium">
              <Trophy className="h-4 w-4" />
              Difficulty
            </Label>
            <div className="grid grid-cols-3 gap-2">
              {DIFFICULTY_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  onClick={() => setDifficulty(option.value as OpenTDBDifficulty)}
                  className={`
                    relative rounded-lg border-2 p-3 text-center transition-all
                    ${difficulty === option.value
                      ? 'border-primary bg-primary/10 ring-2 ring-primary/20'
                      : 'border-muted hover:border-primary/50 hover:bg-muted/50'
                    }
                  `}
                >
                  <div className="font-semibold">{option.label}</div>
                  <div className={`text-sm ${option.color}`}>
                    {option.points} pts/q
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Time Per Question */}
          <div className="space-y-3">
            <Label className="flex items-center gap-2 text-base font-medium">
              <Clock className="h-4 w-4" />
              Time per Question (seconds)
            </Label>
            <div className="flex items-center gap-3">
              <Input
                type="number"
                value={timePerQuestion}
                onChange={(e) => handleTimeChange(parseInt(e.target.value) || 10)}
                min={QUIZ_CONFIG_LIMITS.MIN_TIME}
                max={QUIZ_CONFIG_LIMITS.MAX_TIME}
                className="w-24"
              />
              <div className="flex flex-wrap gap-1">
                {TIME_PRESETS.map((preset) => (
                  <Button
                    key={preset}
                    variant={timePerQuestion === preset ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setTimePerQuestion(preset)}
                    className="px-2 py-1 h-8"
                  >
                    {preset}s
                  </Button>
                ))}
              </div>
            </div>
          </div>

          {/* Number of Questions */}
          <div className="space-y-3">
            <Label className="flex items-center gap-2 text-base font-medium">
              <Hash className="h-4 w-4" />
              Number of Questions
            </Label>
            <div className="flex items-center gap-3">
              <Input
                type="number"
                value={numberOfQuestions}
                onChange={(e) => handleQuestionsChange(parseInt(e.target.value) || 10)}
                min={QUIZ_CONFIG_LIMITS.MIN_QUESTIONS}
                max={QUIZ_CONFIG_LIMITS.MAX_QUESTIONS}
                className="w-24"
              />
              <div className="flex flex-wrap gap-1">
                {QUESTION_PRESETS.map((preset) => (
                  <Button
                    key={preset}
                    variant={numberOfQuestions === preset ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setNumberOfQuestions(preset)}
                    className="px-2 py-1 h-8"
                  >
                    {preset}
                  </Button>
                ))}
              </div>
            </div>
          </div>

          {/* Summary */}
          <div className="rounded-lg bg-muted/50 p-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Points per question:</span>
              <span className="font-medium">{selectedDifficultyPoints}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Total time:</span>
              <span className="font-medium">{Math.ceil((timePerQuestion * numberOfQuestions) / 60)} min</span>
            </div>
            <div className="flex justify-between text-base font-semibold border-t pt-2 mt-2">
              <span>Max possible points:</span>
              <span className="text-primary">{maxPossiblePoints}</span>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleStartQuiz} className="gap-2">
            <Play className="h-4 w-4" />
            Start Quiz
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
