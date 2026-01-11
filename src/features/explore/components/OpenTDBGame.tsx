/**
 * OpenTDBGame Component
 * Game engine for OpenTDB quizzes with difficulty-based scoring
 */

import { useEffect, useState, useCallback, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Play, Home, RotateCcw, Trophy, Clock, CheckCircle2, XCircle, AlertCircle } from 'lucide-react';
import { fetchOpenTDBQuiz, type OpenTDBDifficulty } from '@/adapters';
import type { StandardQuiz } from '@/types/quiz';
import { useQuizResults } from '../hooks/useQuizResults';
import { DIFFICULTY_POINTS, type QuizResult } from '../types';

type GameStatus = 'LOADING' | 'READY' | 'PLAYING' | 'FEEDBACK' | 'FINISHED' | 'ERROR' | 'RATE_LIMITED';

interface GameState {
  status: GameStatus;
  quiz: StandardQuiz | null;
  currentQuestionIndex: number;
  score: number;
  timeLeft: number;
  selectedAnswer: string | null;
  answers: Array<{
    questionId: string;
    questionText: string;
    selectedAnswer: string;
    correctAnswer: string;
    isCorrect: boolean;
    timeSpent: number;
    pointsEarned: number;
  }>;
  questionStartTime: number;
  error: string | null;
  retryCountdown: number;
}

const FEEDBACK_DURATION = 1500; // 1.5 seconds
const RATE_LIMIT_WAIT = 6; // 6 seconds countdown

export const OpenTDBGame = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { saveResult } = useQuizResults();
  
  // Prevent double fetch from React Strict Mode
  const fetchedRef = useRef(false);
  const retryTimerRef = useRef<number | null>(null);

  // Parse URL params
  const categoryId = parseInt(searchParams.get('category') || '0');
  const difficulty = (searchParams.get('difficulty') || 'medium') as OpenTDBDifficulty;
  const amount = parseInt(searchParams.get('amount') || '10');
  const timePerQuestion = parseInt(searchParams.get('time') || '10');

  const pointsPerQuestion = DIFFICULTY_POINTS[difficulty];

  const [state, setState] = useState<GameState>({
    status: 'LOADING',
    quiz: null,
    currentQuestionIndex: 0,
    score: 0,
    timeLeft: timePerQuestion,
    selectedAnswer: null,
    answers: [],
    questionStartTime: Date.now(),
    error: null,
    retryCountdown: 0,
  });

  // Fetch quiz function
  const fetchQuiz = useCallback(async () => {
    setState(prev => ({ ...prev, status: 'LOADING', error: null, retryCountdown: 0 }));

    const result = await fetchOpenTDBQuiz({
      amount,
      category: categoryId > 0 ? categoryId : undefined,
      difficulty,
    });

    if (result.success && result.data) {
      setState(prev => ({
        ...prev,
        status: 'READY',
        quiz: result.data,
      }));
    } else {
      // Check if it's a rate limit error
      const isRateLimit = result.error?.toLowerCase().includes('rate') || 
                          result.error?.toLowerCase().includes('429') ||
                          result.error?.toLowerCase().includes('too many');
      
      setState(prev => ({
        ...prev,
        status: isRateLimit ? 'RATE_LIMITED' : 'ERROR',
        error: result.error || 'Failed to load quiz',
        retryCountdown: isRateLimit ? RATE_LIMIT_WAIT : 0,
      }));
    }
  }, [amount, categoryId, difficulty]);

  // Fetch quiz on mount (with protection against double-fetch)
  useEffect(() => {
    if (fetchedRef.current) return;
    fetchedRef.current = true;
    
    fetchQuiz();

    return () => {
      if (retryTimerRef.current) {
        clearInterval(retryTimerRef.current);
      }
    };
  }, [fetchQuiz]);

  // Countdown timer for rate limit
  useEffect(() => {
    if (state.status !== 'RATE_LIMITED' || state.retryCountdown <= 0) return;

    retryTimerRef.current = window.setInterval(() => {
      setState(prev => {
        if (prev.retryCountdown <= 1) {
          if (retryTimerRef.current) clearInterval(retryTimerRef.current);
          return { ...prev, retryCountdown: 0 };
        }
        return { ...prev, retryCountdown: prev.retryCountdown - 1 };
      });
    }, 1000);

    return () => {
      if (retryTimerRef.current) clearInterval(retryTimerRef.current);
    };
  }, [state.status, state.retryCountdown]);

  // Timer effect
  useEffect(() => {
    if (state.status !== 'PLAYING') return;

    const timer = setInterval(() => {
      setState(prev => {
        if (prev.timeLeft <= 1) {
          // Time's up - auto submit with no answer
          clearInterval(timer);
          return handleTimeUp(prev);
        }
        return { ...prev, timeLeft: prev.timeLeft - 1 };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [state.status, state.currentQuestionIndex]);

  // Handle time up
  const handleTimeUp = (prev: GameState): GameState => {
    const currentQuestion = prev.quiz?.questions[prev.currentQuestionIndex];
    if (!currentQuestion) return prev;

    const timeSpent = timePerQuestion;
    const answer = {
      questionId: currentQuestion.id,
      questionText: currentQuestion.text,
      selectedAnswer: '',
      correctAnswer: currentQuestion.correctAnswerId,
      isCorrect: false,
      timeSpent,
      pointsEarned: 0,
    };

    return {
      ...prev,
      status: 'FEEDBACK',
      selectedAnswer: '',
      answers: [...prev.answers, answer],
    };
  };

  // Start the quiz
  const handleStart = useCallback(() => {
    setState(prev => ({
      ...prev,
      status: 'PLAYING',
      timeLeft: timePerQuestion,
      questionStartTime: Date.now(),
    }));
  }, [timePerQuestion]);

  // Select an answer
  const handleSelectAnswer = useCallback((answer: string) => {
    if (state.status !== 'PLAYING') return;

    const currentQuestion = state.quiz?.questions[state.currentQuestionIndex];
    if (!currentQuestion) return;

    const timeSpent = Math.round((Date.now() - state.questionStartTime) / 1000);
    const isCorrect = answer === currentQuestion.correctAnswerId;
    const pointsEarned = isCorrect ? pointsPerQuestion : 0;

    const answerRecord = {
      questionId: currentQuestion.id,
      questionText: currentQuestion.text,
      selectedAnswer: answer,
      correctAnswer: currentQuestion.correctAnswerId,
      isCorrect,
      timeSpent,
      pointsEarned,
    };

    setState(prev => ({
      ...prev,
      status: 'FEEDBACK',
      selectedAnswer: answer,
      score: prev.score + pointsEarned,
      answers: [...prev.answers, answerRecord],
    }));

    // Auto advance after feedback
    setTimeout(() => {
      setState(prev => {
        const isLastQuestion = prev.currentQuestionIndex >= (prev.quiz?.questions.length ?? 0) - 1;
        
        if (isLastQuestion) {
          // Save results to localStorage
          saveQuizResult(prev);
          return { ...prev, status: 'FINISHED' };
        }

        return {
          ...prev,
          status: 'PLAYING',
          currentQuestionIndex: prev.currentQuestionIndex + 1,
          timeLeft: timePerQuestion,
          selectedAnswer: null,
          questionStartTime: Date.now(),
        };
      });
    }, FEEDBACK_DURATION);
  }, [state.status, state.quiz, state.currentQuestionIndex, state.questionStartTime, pointsPerQuestion, timePerQuestion]);

  // Save quiz result
  const saveQuizResult = (gameState: GameState) => {
    if (!gameState.quiz) return;

    const totalPoints = gameState.quiz.questions.length * pointsPerQuestion;
    const correctAnswers = gameState.answers.filter(a => a.isCorrect).length;
    const totalTimeSpent = gameState.answers.reduce((sum, a) => sum + a.timeSpent, 0);

    const result: Omit<QuizResult, 'id' | 'completedAt'> = {
      quizId: gameState.quiz.id,
      quizTitle: gameState.quiz.title,
      category: gameState.quiz.category || 'General',
      difficulty,
      score: gameState.score,
      totalPoints,
      correctAnswers,
      totalQuestions: gameState.quiz.questions.length,
      percentage: Math.round((correctAnswers / gameState.quiz.questions.length) * 100),
      timeSpent: totalTimeSpent,
      answers: gameState.answers,
    };

    saveResult(result);
  };

  // Restart quiz
  const handleRestart = useCallback(() => {
    setState({
      status: 'LOADING',
      quiz: null,
      currentQuestionIndex: 0,
      score: 0,
      timeLeft: timePerQuestion,
      selectedAnswer: null,
      answers: [],
      questionStartTime: Date.now(),
      error: null,
      retryCountdown: 0,
    });

    fetchQuiz();
  }, [timePerQuestion, fetchQuiz]);

  // Retry after rate limit
  const handleRetryAfterRateLimit = useCallback(() => {
    fetchedRef.current = false;
    fetchQuiz();
  }, [fetchQuiz]);

  // Render based on status
  const currentQuestion = state.quiz?.questions[state.currentQuestionIndex];

  // Loading state
  if (state.status === 'LOADING') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted">
        <Card className="w-full max-w-md mx-4">
          <CardContent className="flex flex-col items-center justify-center py-16 gap-4">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
            <p className="text-lg text-muted-foreground">Loading quiz...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Rate limit state
  if (state.status === 'RATE_LIMITED') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted p-4">
        <Card className="w-full max-w-md">
          <CardContent className="flex flex-col items-center justify-center py-16 gap-4 text-center">
            <AlertCircle className="h-16 w-16 text-amber-500" />
            <h2 className="text-xl font-semibold">Rate Limited</h2>
            <p className="text-muted-foreground">
              OpenTDB allows only 1 request per 5 seconds.
              {state.retryCountdown > 0 && (
                <span className="block mt-2 text-lg font-medium">
                  Please wait {state.retryCountdown} seconds...
                </span>
              )}
            </p>
            <div className="flex gap-2 mt-4">
              <Button variant="outline" onClick={() => navigate('/explore')}>
                <Home className="h-4 w-4 mr-2" />
                Back
              </Button>
              <Button 
                onClick={handleRetryAfterRateLimit}
                disabled={state.retryCountdown > 0}
              >
                <RotateCcw className={`h-4 w-4 mr-2 ${state.retryCountdown > 0 ? '' : ''}`} />
                {state.retryCountdown > 0 ? `Wait ${state.retryCountdown}s` : 'Try Again'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Error state
  if (state.status === 'ERROR') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted p-4">
        <Card className="w-full max-w-md">
          <CardContent className="flex flex-col items-center justify-center py-16 gap-4 text-center">
            <div className="text-6xl">😕</div>
            <h2 className="text-xl font-semibold">Failed to load quiz</h2>
            <p className="text-muted-foreground">{state.error}</p>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => navigate('/explore')}>
                <Home className="h-4 w-4 mr-2" />
                Back
              </Button>
              <Button onClick={handleRestart}>
                <RotateCcw className="h-4 w-4 mr-2" />
                Try Again
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Ready state
  if (state.status === 'READY' && state.quiz) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted p-4">
        <Card className="w-full max-w-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">{state.quiz.title}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="bg-muted rounded-lg p-4">
                <div className="text-2xl font-bold">{state.quiz.questions.length}</div>
                <div className="text-sm text-muted-foreground">Questions</div>
              </div>
              <div className="bg-muted rounded-lg p-4">
                <div className="text-2xl font-bold capitalize">{difficulty}</div>
                <div className="text-sm text-muted-foreground">{pointsPerQuestion} pts each</div>
              </div>
              <div className="bg-muted rounded-lg p-4">
                <div className="text-2xl font-bold">{timePerQuestion}s</div>
                <div className="text-sm text-muted-foreground">Per question</div>
              </div>
              <div className="bg-muted rounded-lg p-4">
                <div className="text-2xl font-bold text-primary">
                  {state.quiz.questions.length * pointsPerQuestion}
                </div>
                <div className="text-sm text-muted-foreground">Max points</div>
              </div>
            </div>
            <Button onClick={handleStart} size="lg" className="w-full gap-2">
              <Play className="h-5 w-5" />
              Start Quiz
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Playing / Feedback state
  if ((state.status === 'PLAYING' || state.status === 'FEEDBACK') && currentQuestion && state.quiz) {
    const progress = ((state.currentQuestionIndex + 1) / state.quiz.questions.length) * 100;
    const timerPercentage = (state.timeLeft / timePerQuestion) * 100;

    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-muted p-4">
        <div className="max-w-2xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="text-sm font-medium">
              Question {state.currentQuestionIndex + 1} of {state.quiz.questions.length}
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Trophy className="h-4 w-4 text-yellow-500" />
                <span className="font-bold">{state.score}</span>
              </div>
              <div className={`flex items-center gap-2 ${state.timeLeft <= 5 ? 'text-red-500' : ''}`}>
                <Clock className="h-4 w-4" />
                <span className="font-bold">{state.timeLeft}s</span>
              </div>
            </div>
          </div>

          {/* Progress bar */}
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div 
              className="h-full bg-primary transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Timer bar */}
          <div className="h-1 bg-muted rounded-full overflow-hidden">
            <div 
              className={`h-full transition-all duration-1000 ${
                state.timeLeft <= 5 ? 'bg-red-500' : 'bg-green-500'
              }`}
              style={{ width: `${timerPercentage}%` }}
            />
          </div>

          {/* Question Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl leading-relaxed">
                {currentQuestion.text}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {currentQuestion.options.map((option, index) => {
                const isSelected = state.selectedAnswer === option;
                const isCorrect = option === currentQuestion.correctAnswerId;
                const showResult = state.status === 'FEEDBACK';

                let buttonClass = 'w-full justify-start text-left h-auto py-4 px-6';
                
                if (showResult) {
                  if (isCorrect) {
                    buttonClass += ' bg-green-100 border-green-500 text-green-700 hover:bg-green-100';
                  } else if (isSelected && !isCorrect) {
                    buttonClass += ' bg-red-100 border-red-500 text-red-700 hover:bg-red-100';
                  }
                }

                return (
                  <Button
                    key={index}
                    variant="outline"
                    className={buttonClass}
                    onClick={() => handleSelectAnswer(option)}
                    disabled={state.status === 'FEEDBACK'}
                  >
                    <span className="flex items-center gap-3 w-full">
                      <span className="flex-shrink-0 w-8 h-8 rounded-full bg-muted flex items-center justify-center text-sm font-medium">
                        {String.fromCharCode(65 + index)}
                      </span>
                      <span className="flex-grow">{option}</span>
                      {showResult && isCorrect && (
                        <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0" />
                      )}
                      {showResult && isSelected && !isCorrect && (
                        <XCircle className="h-5 w-5 text-red-600 flex-shrink-0" />
                      )}
                    </span>
                  </Button>
                );
              })}
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Finished state
  if (state.status === 'FINISHED' && state.quiz) {
    const correctCount = state.answers.filter(a => a.isCorrect).length;
    const totalQuestions = state.quiz.questions.length;
    const percentage = Math.round((correctCount / totalQuestions) * 100);
    const maxPoints = totalQuestions * pointsPerQuestion;

    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-muted p-4">
        <div className="max-w-2xl mx-auto space-y-6">
          <Card>
            <CardHeader className="text-center pb-2">
              <div className="text-6xl mb-4">
                {percentage >= 80 ? '🏆' : percentage >= 60 ? '🎉' : percentage >= 40 ? '💪' : '📚'}
              </div>
              <CardTitle className="text-3xl">Quiz Complete!</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Score summary */}
              <div className="grid grid-cols-2 gap-4 text-center">
                <div className="bg-primary/10 rounded-xl p-6">
                  <div className="text-4xl font-bold text-primary">{state.score}</div>
                  <div className="text-sm text-muted-foreground">Points Earned</div>
                  <div className="text-xs text-muted-foreground mt-1">out of {maxPoints}</div>
                </div>
                <div className="bg-muted rounded-xl p-6">
                  <div className="text-4xl font-bold">{percentage}%</div>
                  <div className="text-sm text-muted-foreground">Accuracy</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {correctCount}/{totalQuestions} correct
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="flex justify-center gap-8 text-center">
                <div>
                  <div className="flex items-center gap-1 text-green-600">
                    <CheckCircle2 className="h-4 w-4" />
                    <span className="font-bold">{correctCount}</span>
                  </div>
                  <div className="text-xs text-muted-foreground">Correct</div>
                </div>
                <div>
                  <div className="flex items-center gap-1 text-red-600">
                    <XCircle className="h-4 w-4" />
                    <span className="font-bold">{totalQuestions - correctCount}</span>
                  </div>
                  <div className="text-xs text-muted-foreground">Incorrect</div>
                </div>
                <div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span className="font-bold">
                      {Math.round(state.answers.reduce((sum, a) => sum + a.timeSpent, 0))}s
                    </span>
                  </div>
                  <div className="text-xs text-muted-foreground">Total Time</div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4">
                <Button 
                  variant="outline" 
                  onClick={() => navigate('/explore')}
                  className="flex-1 gap-2"
                >
                  <Home className="h-4 w-4" />
                  Categories
                </Button>
                <Button 
                  onClick={handleRestart}
                  className="flex-1 gap-2"
                >
                  <RotateCcw className="h-4 w-4" />
                  Play Again
                </Button>
              </div>

              {/* Result saved notice */}
              <div className="text-center text-sm text-muted-foreground">
                ✓ Result saved to your history
              </div>
            </CardContent>
          </Card>

          {/* Answer Review */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Answer Review</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {state.answers.map((answer, index) => (
                <div 
                  key={answer.questionId}
                  className={`p-4 rounded-lg border-l-4 ${
                    answer.isCorrect 
                      ? 'bg-green-50 border-green-500' 
                      : 'bg-red-50 border-red-500'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-grow">
                      <div className="font-medium text-sm mb-1">
                        Q{index + 1}: {answer.questionText}
                      </div>
                      <div className="text-sm">
                        <span className="text-muted-foreground">Your answer: </span>
                        <span className={answer.isCorrect ? 'text-green-700' : 'text-red-700'}>
                          {answer.selectedAnswer || '(No answer)'}
                        </span>
                      </div>
                      {!answer.isCorrect && (
                        <div className="text-sm">
                          <span className="text-muted-foreground">Correct: </span>
                          <span className="text-green-700">{answer.correctAnswer}</span>
                        </div>
                      )}
                    </div>
                    <div className="text-right flex-shrink-0">
                      <div className={`font-bold ${answer.isCorrect ? 'text-green-600' : 'text-red-600'}`}>
                        +{answer.pointsEarned}
                      </div>
                      <div className="text-xs text-muted-foreground">{answer.timeSpent}s</div>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return null;
};
