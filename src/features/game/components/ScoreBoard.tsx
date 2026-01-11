import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trophy, RotateCcw, Home, CheckCircle, XCircle, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { StandardQuiz } from '@/types/quiz';

interface ScoreBoardProps {
  quiz: StandardQuiz;
  score: number;
  totalQuestions: number;
  userAnswers: Array<{
    questionId: string;
    selectedAnswer: string;
    isCorrect: boolean;
    timeSpent: number;
  }>;
  onPlayAgain: () => void;
  onGoHome: () => void;
}

export const ScoreBoard = ({
  quiz,
  score,
  totalQuestions,
  userAnswers,
  onPlayAgain,
  onGoHome,
}: ScoreBoardProps) => {
  const percentage = Math.round((score / totalQuestions) * 100);
  const averageTime = Math.round(
    userAnswers.reduce((sum, answer) => sum + answer.timeSpent, 0) / userAnswers.length
  );

  const getPerformanceMessage = () => {
    if (percentage >= 90) return { text: 'Outstanding! 🎉', color: 'text-green-600' };
    if (percentage >= 75) return { text: 'Great Job! 👏', color: 'text-blue-600' };
    if (percentage >= 60) return { text: 'Good Effort! 👍', color: 'text-yellow-600' };
    return { text: 'Keep Practicing! 💪', color: 'text-orange-600' };
  };

  const performance = getPerformanceMessage();

  return (
    <div className="space-y-6">
      {/* Main Score Card */}
      <Card className="border-2">
        <CardHeader className="text-center pb-4">
          <div className="mx-auto mb-4">
            <Trophy className="h-16 w-16 text-yellow-500" />
          </div>
          <CardTitle className="text-3xl">{quiz.title}</CardTitle>
          <CardDescription className={cn('text-xl font-semibold', performance.color)}>
            {performance.text}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Score Display */}
          <div className="text-center p-6 bg-primary/5 rounded-lg">
            <p className="text-sm text-muted-foreground mb-2">Your Score</p>
            <p className="text-5xl font-bold text-primary">
              {percentage}%
            </p>
            <p className="text-muted-foreground mt-2">
              {score} out of {totalQuestions} correct
            </p>
          </div>

          {/* Statistics Grid */}
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="space-y-1">
              <CheckCircle className="h-6 w-6 mx-auto text-green-500" />
              <p className="text-2xl font-bold">{score}</p>
              <p className="text-xs text-muted-foreground">Correct</p>
            </div>
            <div className="space-y-1">
              <XCircle className="h-6 w-6 mx-auto text-red-500" />
              <p className="text-2xl font-bold">{totalQuestions - score}</p>
              <p className="text-xs text-muted-foreground">Incorrect</p>
            </div>
            <div className="space-y-1">
              <Clock className="h-6 w-6 mx-auto text-blue-500" />
              <p className="text-2xl font-bold">{averageTime}s</p>
              <p className="text-xs text-muted-foreground">Avg Time</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button onClick={onPlayAgain} className="flex-1" size="lg">
              <RotateCcw className="h-4 w-4 mr-2" />
              Play Again
            </Button>
            <Button onClick={onGoHome} variant="outline" className="flex-1" size="lg">
              <Home className="h-4 w-4 mr-2" />
              Dashboard
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Answer Review */}
      <Card>
        <CardHeader>
          <CardTitle>Answer Review</CardTitle>
          <CardDescription>Review your answers and learn from mistakes</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {quiz.questions.map((question, index) => {
              const userAnswer = userAnswers.find(a => a.questionId === question.id);
              const isCorrect = userAnswer?.isCorrect ?? false;

              return (
                <div
                  key={question.id}
                  className={cn(
                    'p-4 rounded-lg border-l-4',
                    isCorrect
                      ? 'bg-green-50 border-green-500 dark:bg-green-950'
                      : 'bg-red-50 border-red-500 dark:bg-red-950'
                  )}
                >
                  <div className="flex items-start gap-3">
                    {isCorrect ? (
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
                    )}
                    <div className="flex-1 space-y-2">
                      <p className="font-medium">
                        Q{index + 1}: {question.text}
                      </p>
                      <div className="text-sm space-y-1">
                        {!isCorrect && userAnswer?.selectedAnswer && (
                          <p className="text-red-600 dark:text-red-400">
                            Your answer: {userAnswer.selectedAnswer}
                          </p>
                        )}
                        <p className="text-green-600 dark:text-green-400">
                          Correct answer: {question.correctAnswerId}
                        </p>
                        {question.explanation && (
                          <p className="text-muted-foreground italic mt-2">
                            💡 {question.explanation}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
