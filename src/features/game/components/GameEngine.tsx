import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Play, StopCircle } from 'lucide-react';
import { useGameEngine } from '../hooks/useGameEngine';
import { QuestionCard } from './QuestionCard';
import { Timer } from './Timer';
import { ProgressBar } from './ProgressBar';
import { ScoreBoard } from './ScoreBoard';
import type { StandardQuiz } from '@/types/quiz';
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

// Mock function to fetch quiz - replace with real API call
const fetchQuizById = async (id: string): Promise<StandardQuiz> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));

  // Mock quiz data
  return {
    id,
    title: 'JavaScript Fundamentals Quiz',
    description: 'Test your knowledge of JavaScript basics',
    source: 'custom',
    category: 'Programming',
    difficulty: 'medium',
    timeLimit: 30,
    questions: [
      {
        id: 'q1',
        text: 'What is the correct way to declare a variable in JavaScript?',
        type: 'multiple',
        options: ['let myVar = 10', 'variable myVar = 10', 'var = 10 myVar', 'myVar := 10'],
        correctAnswerId: 'let myVar = 10',
        explanation: 'In modern JavaScript, we use let, const, or var to declare variables.',
      },
      {
        id: 'q2',
        text: 'Which of the following is NOT a JavaScript data type?',
        type: 'multiple',
        options: ['String', 'Boolean', 'Float', 'Undefined'],
        correctAnswerId: 'Float',
        explanation: 'JavaScript uses the Number type for both integers and floating-point numbers.',
      },
      {
        id: 'q3',
        text: 'What does "===" operator do in JavaScript?',
        type: 'multiple',
        options: [
          'Checks equality without type coercion',
          'Assigns a value',
          'Checks inequality',
          'Compares memory addresses',
        ],
        correctAnswerId: 'Checks equality without type coercion',
        explanation: 'The === operator checks for strict equality, comparing both value and type.',
      },
      {
        id: 'q4',
        text: 'What is a closure in JavaScript?',
        type: 'multiple',
        options: [
          'A function with access to parent scope',
          'A way to close the browser',
          'An error handling mechanism',
          'A type of loop',
        ],
        correctAnswerId: 'A function with access to parent scope',
        explanation: 'A closure is a function that has access to variables in its outer (enclosing) scope.',
      },
      {
        id: 'q5',
        text: 'Which method is used to add an element at the end of an array?',
        type: 'multiple',
        options: ['push()', 'pop()', 'shift()', 'unshift()'],
        correctAnswerId: 'push()',
        explanation: 'The push() method adds one or more elements to the end of an array.',
      },
    ],
    createdBy: 'teacher-1',
    createdAt: new Date().toISOString(),
  };
};

export const GameEngine = () => {
  const { quizId } = useParams<{ quizId: string }>();
  const navigate = useNavigate();
  const { state, startQuiz, selectAnswer, resetGame, endQuizEarly, currentQuestion } = useGameEngine();
  const [showEndDialog, setShowEndDialog] = useState(false);

  useEffect(() => {
    if (quizId && state.status === 'IDLE') {
      // Quiz will be loaded when user clicks "Start Quiz"
      // This effect is for future enhancements like pre-loading quiz data
    }
  }, [quizId, state.status]);

  const handleStartQuiz = async () => {
    if (!quizId) return;
    
    try {
      const quiz = await fetchQuizById(quizId);
      startQuiz(quiz);
    } catch (error) {
      console.error('Failed to start quiz:', error);
    }
  };

  const handlePlayAgain = () => {
    resetGame();
    if (quizId) {
      handleStartQuiz();
    }
  };

  const handleGoHome = () => {
    navigate('/dashboard');
  };

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
            <CardDescription>Click the button below to start the quiz</CardDescription>
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
