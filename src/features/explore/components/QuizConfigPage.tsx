/**
 * QuizConfigPage Component
 * Full page for configuring quiz settings before starting
 */

import { useState, useCallback, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { DashboardLayout } from '@/features/dashboard';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Play, Clock, Hash, Trophy, ArrowLeft, Sparkles } from 'lucide-react';
import type { QuizConfig } from '../types';
import { DEFAULT_QUIZ_CONFIG, QUIZ_CONFIG_LIMITS, DIFFICULTY_POINTS } from '../types';
import { DIFFICULTY_OPTIONS, QUESTION_PRESETS, TIME_PRESETS, STORAGE_KEYS } from '../constants';
import type { OpenTDBDifficulty } from '@/adapters';

export const QuizConfigPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  // Get category info from URL params
  const categoryId = parseInt(searchParams.get('categoryId') || '0');
  const categoryName = searchParams.get('categoryName') || 'General Knowledge';
  const categoryIcon = searchParams.get('icon') || '🎯';
  
  const [difficulty, setDifficulty] = useState<OpenTDBDifficulty>(DEFAULT_QUIZ_CONFIG.difficulty);
  const [timePerQuestion, setTimePerQuestion] = useState<number>(DEFAULT_QUIZ_CONFIG.timePerQuestion);
  const [numberOfQuestions, setNumberOfQuestions] = useState<number>(DEFAULT_QUIZ_CONFIG.numberOfQuestions);

  const handleStartQuiz = useCallback(() => {
    const config: QuizConfig = {
      categoryId,
      categoryName,
      difficulty,
      timePerQuestion,
      numberOfQuestions,
    };

    // Save config to localStorage for the game engine to use
    localStorage.setItem(STORAGE_KEYS.QUIZ_CONFIG, JSON.stringify(config));

    // Navigate to the game with config params
    navigate(`/play/opentdb?category=${categoryId}&difficulty=${difficulty}&amount=${numberOfQuestions}&time=${timePerQuestion}`);
  }, [categoryId, categoryName, difficulty, timePerQuestion, numberOfQuestions, navigate]);

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
            <div className="space-y-4">
              <Label className="flex items-center gap-2 text-base font-semibold">
                <Trophy className="h-5 w-5 text-primary" />
                Difficulty Level
              </Label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {DIFFICULTY_OPTIONS.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setDifficulty(option.value as OpenTDBDifficulty)}
                    className={`
                      relative rounded-xl border-2 p-4 text-center transition-all hover:scale-105
                      ${difficulty === option.value
                        ? 'border-primary bg-primary/10 ring-2 ring-primary/20 shadow-lg'
                        : 'border-muted hover:border-primary/50 hover:bg-muted/50'
                      }
                    `}
                  >
                    <div className="text-lg font-bold">{option.label}</div>
                    <div className={`text-sm font-medium ${option.color}`}>
                      {option.points} pts per question
                    </div>
                  </button>
                ))}
              </div>
            </div>

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
                  onChange={(e) => handleTimeChange(parseInt(e.target.value) || 10)}
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
                  value={numberOfQuestions}
                  onChange={(e) => handleQuestionsChange(parseInt(e.target.value) || 10)}
                  min={QUIZ_CONFIG_LIMITS.MIN_QUESTIONS}
                  max={QUIZ_CONFIG_LIMITS.MAX_QUESTIONS}
                  className="w-full sm:w-28 text-center text-lg font-semibold"
                />
                <div className="flex flex-wrap gap-2">
                  {QUESTION_PRESETS.map((preset) => (
                    <Button
                      key={preset}
                      variant={numberOfQuestions === preset ? 'default' : 'outline'}
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
                <div className="text-2xl font-bold text-primary">{numberOfQuestions}</div>
                <div className="text-xs text-muted-foreground">Questions</div>
              </div>
              <div className="text-center p-3 bg-background rounded-lg">
                <div className="text-2xl font-bold">{timePerQuestion}s</div>
                <div className="text-xs text-muted-foreground">Per Question</div>
              </div>
              <div className="text-center p-3 bg-background rounded-lg">
                <div className="text-2xl font-bold">{Math.ceil((timePerQuestion * numberOfQuestions) / 60)}</div>
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
          <Button 
            variant="outline" 
            asChild 
            className="flex-1"
          >
            <Link to="/explore">Cancel</Link>
          </Button>
          <Button 
            onClick={handleStartQuiz} 
            size="lg"
            className="flex-1 gap-2 text-lg"
          >
            <Play className="h-5 w-5" />
            Start Quiz
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
};
