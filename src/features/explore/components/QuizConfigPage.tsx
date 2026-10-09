/**
 * QuizConfigPage Component
 * Full page for configuring quiz settings before starting
 */

import { useState, useCallback } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { DashboardLayout } from '@/features/dashboard';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Play, Clock, Hash, ArrowLeft, Sparkles } from 'lucide-react';
import { toastApiError } from '@/lib/toast-api-error';
import { startPlaySession, toApiDifficulty } from '@/features/play';
import { DEFAULT_QUIZ_CONFIG, QUIZ_CONFIG_LIMITS, DIFFICULTY_POINTS, countForDifficulty, questionChoices, questionsToStart, type ExploreDifficulty } from '../types';
import { QUESTION_PRESETS, TIME_PRESETS } from '../constants';
import { useCategories } from '../hooks/useCategories';
import { DifficultyPicker } from './DifficultyPicker';

export const QuizConfigPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  const categoryId = searchParams.get('categoryId') ?? '';
  const categoryName = searchParams.get('categoryName') || 'General Knowledge';
  const categoryIcon = searchParams.get('icon') || '🎯';
  const { categories } = useCategories();
  const category = categories.find((item) => item.id === categoryId);

  const [difficulty, setDifficulty] = useState<ExploreDifficulty>(DEFAULT_QUIZ_CONFIG.difficulty);
  const [timePerQuestion, setTimePerQuestion] = useState<number>(DEFAULT_QUIZ_CONFIG.timePerQuestion);
  const [numberOfQuestions, setNumberOfQuestions] = useState<number>(DEFAULT_QUIZ_CONFIG.numberOfQuestions);

  const [starting, setStarting] = useState(false);

  const handleStartQuiz = useCallback(() => {
    if (!category || starting) return;
    const amount = questionsToStart(
      numberOfQuestions,
      countForDifficulty(category.counts, difficulty),
    );
    if (amount < 1) return;
    setStarting(true);
    void startPlaySession({
      source: 'OPENTDB',
      categoryId: category.id,
      difficulty: toApiDifficulty(difficulty),
      amount,
      timePerQuestion,
    })
      .then((session) => navigate(`/play/${session.id}`))
      .catch((error: unknown) => {
        toastApiError(error);
        setStarting(false);
      });
  }, [category, difficulty, navigate, numberOfQuestions, starting, timePerQuestion]);

  const handleTimeChange = (value: number) => {
    const clamped = Math.min(Math.max(value, QUIZ_CONFIG_LIMITS.MIN_TIME), QUIZ_CONFIG_LIMITS.MAX_TIME);
    setTimePerQuestion(clamped);
  };

  const handleQuestionsChange = (value: number) => {
    const clamped = Math.min(Math.max(value, QUIZ_CONFIG_LIMITS.MIN_QUESTIONS), QUIZ_CONFIG_LIMITS.MAX_QUESTIONS);
    setNumberOfQuestions(clamped);
  };

  const selectedDifficultyPoints = DIFFICULTY_POINTS[difficulty];
  const available = countForDifficulty(category?.counts, difficulty);
  const shownCount = available ? Math.min(numberOfQuestions, available) : numberOfQuestions;
  const maxPossiblePoints = shownCount * selectedDifficultyPoints;

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Back Button */}
        <Button variant="ghost" asChild className="gap-2 -ml-2">
          <Link to="/explore">
            <ArrowLeft className="h-4 w-4" />
            Back to Categories
          </Link>
        </Button>

        {/* Header */}
        <div className="text-center space-y-2">
          <div className="text-5xl mb-4">{categoryIcon}</div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center justify-center gap-2">
            {categoryName}
          </h1>
          <p className="text-muted-foreground">
            Configure your quiz settings before starting
          </p>
        </div>

        {/* Configuration Card */}
        <Card>
          <CardContent className="pt-6 space-y-8">
            {/* Difficulty Selection */}
            <DifficultyPicker
              value={difficulty}
              counts={category?.counts}
              onChange={setDifficulty}
            />

            {/* Time Per Question */}
            <div className="space-y-4">
              <Label className="flex items-center gap-2 text-base font-semibold">
                <Clock className="h-5 w-5 text-primary" />
                Time per Question (seconds)
              </Label>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <Input
                  type="number"
                  value={timePerQuestion}
                  onChange={(e) => handleTimeChange(parseInt(e.target.value) || DEFAULT_QUIZ_CONFIG.timePerQuestion)}
                  min={QUIZ_CONFIG_LIMITS.MIN_TIME}
                  max={QUIZ_CONFIG_LIMITS.MAX_TIME}
                  className="w-full sm:w-28 text-center text-lg font-semibold"
                />
                <div className="flex flex-wrap gap-2">
                  {TIME_PRESETS.map((preset) => (
                    <Button
                      key={preset}
                      variant={timePerQuestion === preset ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setTimePerQuestion(preset)}
                      className="min-w-[60px]"
                    >
                      {preset}s
                    </Button>
                  ))}
                </div>
              </div>
            </div>

            {/* Number of Questions */}
            <div className="space-y-4">
              <Label className="flex items-center gap-2 text-base font-semibold">
                <Hash className="h-5 w-5 text-primary" />
                Number of Questions
              </Label>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <Input
                  type="number"
                  value={shownCount}
                  onChange={(e) => handleQuestionsChange(parseInt(e.target.value) || DEFAULT_QUIZ_CONFIG.numberOfQuestions)}
                  min={QUIZ_CONFIG_LIMITS.MIN_QUESTIONS}
                  max={QUIZ_CONFIG_LIMITS.MAX_QUESTIONS}
                  className="w-full sm:w-28 text-center text-lg font-semibold"
                />
                <div className="flex flex-wrap gap-2">
                  {questionChoices(available, QUESTION_PRESETS).map((preset) => (
                    <Button
                      key={preset}
                      variant={shownCount === preset ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setNumberOfQuestions(preset)}
                      className="min-w-[50px]"
                    >
                      {preset}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Summary Card */}
        <Card className="bg-muted/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              Quiz Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="text-center p-3 bg-background rounded-lg">
                <div className="text-2xl font-bold text-primary">{shownCount}</div>
                <div className="text-xs text-muted-foreground">Questions</div>
              </div>
              <div className="text-center p-3 bg-background rounded-lg">
                <div className="text-2xl font-bold">{timePerQuestion}s</div>
                <div className="text-xs text-muted-foreground">Per Question</div>
              </div>
              <div className="text-center p-3 bg-background rounded-lg">
                <div className="text-2xl font-bold">{Math.ceil((timePerQuestion * shownCount) / 60)}</div>
                <div className="text-xs text-muted-foreground">Minutes Total</div>
              </div>
              <div className="text-center p-3 bg-background rounded-lg">
                <div className="text-2xl font-bold text-primary">{maxPossiblePoints}</div>
                <div className="text-xs text-muted-foreground">Max Points</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Button variant="outline" asChild className="flex-1">
            <Link to="/explore">Cancel</Link>
          </Button>
          <Button
            onClick={handleStartQuiz}
            size="lg"
            className="flex-1 gap-2 text-lg"
            disabled={!available || starting}
          >
            <Play className="h-5 w-5" />
            Start Quiz
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
};
