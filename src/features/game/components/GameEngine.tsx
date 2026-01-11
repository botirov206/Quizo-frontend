import { useEffect, useState } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Play, StopCircle } from 'lucide-react';
import { useGameEngine } from '../hooks/useGameEngine';
import { QuestionCard } from './QuestionCard';
import { Timer } from './Timer';
import { ProgressBar } from './ProgressBar';
import { ScoreBoard } from './ScoreBoard';
import type { StandardQuiz } from '@/types/quiz';
import { joinQuiz } from '@/adapters';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

// Location state type for quiz data passed from JoinPage or QuizCard
interface LocationState {
  quiz?: StandardQuiz;
  quizKey?: string;
}

/**
 * Fetches quiz using quiz_key from backend
 * POST /quiz/join returns full quiz with questions
 */
const fetchQuizByKey = async (quizKey: string): Promise<StandardQuiz> => {
  const result = await joinQuiz(quizKey);
  
  if (!result.success || !result.data) {
    throw new Error(result.error || 'Failed to fetch quiz');
  }
  
  return result.data;
};

export const GameEngine = () => {
  const { quizId } = useParams<{ quizId: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const { state, startQuiz, selectAnswer, resetGame, endQuizEarly, currentQuestion } = useGameEngine();
  const [showEndDialog, setShowEndDialog] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);
  
  // Get quiz data from navigation state (passed from JoinPage or QuizCard)
  const locationState = location.state as LocationState | undefined;
  const passedQuiz = locationState?.quiz;
  const passedQuizKey = locationState?.quizKey;

  useEffect(() => {
    if (quizId && state.status === 'IDLE') {
      // Quiz will be loaded when user clicks "Start Quiz"
      // This effect is for future enhancements like pre-loading quiz data
    }
  }, [quizId, state.status]);

  const handleStartQuiz = async () => {
    setFetchError(null);
    
    try {
      let quiz: StandardQuiz;
      
      // Priority 1: Use quiz data passed from navigation state
      if (passedQuiz && passedQuiz.questions && passedQuiz.questions.length > 0) {
        quiz = passedQuiz;
      }
      // Priority 2: Fetch using quiz_key passed from navigation
      else if (passedQuizKey) {
        quiz = await fetchQuizByKey(passedQuizKey);
      }
      // Priority 3: Use quizId as quiz_key (for direct URL access or from QuizCard)
      else if (quizId) {
        // Try to use quizId as a quiz_key
        quiz = await fetchQuizByKey(quizId);
      }
      else {
        throw new Error('No quiz ID or key provided');
      }
      
      startQuiz(quiz);
    } catch (error) {
      console.error('Failed to start quiz:', error);
      const message = error instanceof Error ? error.message : 'Failed to load quiz';
      setFetchError(message);
    }
  };

  const handlePlayAgain = () => {
    resetGame();
    handleStartQuiz();
  };

  const handleGoHome = () => {
    navigate('/dashboard');
  };

  // Error state
  if (fetchError) {
    return (
      <div className="container max-w-2xl mx-auto py-8">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-3xl text-destructive">Error</CardTitle>
            <CardDescription>{fetchError}</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-4 py-8">
            <Button size="lg" onClick={() => navigate('/dashboard')} variant="outline">
              Back to Dashboard
            </Button>
            <Button size="lg" onClick={() => navigate('/join')} variant="default">
              Try Another Code
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Loading state
  if (state.status === 'LOADING') {
    return (
      <div className="container max-w-4xl mx-auto py-8">
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
            <p className="text-lg text-muted-foreground">Loading quiz...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Start screen
  if (state.status === 'IDLE' && !state.quiz) {
    return (
      <div className="container max-w-2xl mx-auto py-8">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-3xl">Ready to Play?</CardTitle>
            <CardDescription>
              {passedQuiz?.title || 'Click the button below to start the quiz'}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-4 py-8">
            <Button size="lg" onClick={handleStartQuiz} className="px-8">
              <Play className="h-5 w-5 mr-2" />
              Start Quiz
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Finished state
  if (state.status === 'FINISHED' && state.quiz) {
    return (
      <div className="container max-w-4xl mx-auto py-8">
        <ScoreBoard
          quiz={state.quiz}
          score={state.score}
          totalQuestions={state.quiz.questions.length}
          userAnswers={state.userAnswers}
          onPlayAgain={handlePlayAgain}
          onGoHome={handleGoHome}
        />
      </div>
    );
  }

  // Playing/Feedback state
  if ((state.status === 'PLAYING' || state.status === 'FEEDBACK') && currentQuestion && state.quiz) {
    const isAnswered = state.status === 'FEEDBACK';
    const selectedAnswer = state.answers[currentQuestion.id];
    const totalTime = state.quiz.timeLimit || 30;
    const remainingQuestions = state.quiz.questions.length - state.currentQuestionIndex - 1;

    return (
      <div className="container max-w-4xl mx-auto py-8 space-y-6">
        {/* Header with Progress and Timer */}
        <Card>
          <CardContent className="pt-6 space-y-4">
            <div className="flex items-center justify-between">
              <ProgressBar
                current={state.currentQuestionIndex + 1}
                total={state.quiz.questions.length}
              />
              <AlertDialog open={showEndDialog} onOpenChange={setShowEndDialog}>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" size="sm" className="ml-4">
                    <StopCircle className="h-4 w-4 mr-2" />
                    End Quiz
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>End Quiz Early?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to end the quiz now? 
                      {remainingQuestions > 0 && (
                        <span className="block mt-2 font-medium text-foreground">
                          {remainingQuestions} remaining question{remainingQuestions !== 1 ? 's' : ''} will be marked as incorrect.
                        </span>
                      )}
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Continue Quiz</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => {
                        endQuizEarly();
                        setShowEndDialog(false);
                      }}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                      End Quiz
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
            {state.status === 'PLAYING' && (
              <Timer timeLeft={state.timeLeft} totalTime={totalTime} />
            )}
          </CardContent>
        </Card>

        {/* Question Card */}
        <QuestionCard
          questionNumber={state.currentQuestionIndex + 1}
          totalQuestions={state.quiz.questions.length}
          questionText={currentQuestion.text}
          options={currentQuestion.options}
          selectedAnswer={selectedAnswer}
          correctAnswer={currentQuestion.correctAnswerId}
          isAnswered={isAnswered}
          onSelectAnswer={selectAnswer}
        />
      </div>
    );
  }

  return null;
};
