import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface QuestionCardProps {
  questionNumber: number;
  totalQuestions: number;
  questionText: string;
  options: string[];
  selectedAnswer?: string;
  correctAnswer?: string;
  isAnswered: boolean;
  onSelectAnswer: (answer: string) => void;
}

export const QuestionCard = ({
  questionNumber,
  totalQuestions,
  questionText,
  options,
  selectedAnswer,
  correctAnswer,
  isAnswered,
  onSelectAnswer,
}: QuestionCardProps) => {
  const getOptionLabel = (index: number) => {
    return String.fromCharCode(65 + index); // A, B, C, D
  };

  const getButtonVariant = (option: string) => {
    if (!isAnswered) return 'outline';
    
    if (option === correctAnswer) return 'default';
    if (option === selectedAnswer && option !== correctAnswer) return 'destructive';
    
    return 'outline';
  };

  const getButtonClasses = (option: string) => {
    if (!isAnswered) {
      return 'hover:bg-primary hover:text-primary-foreground';
    }
    
    if (option === correctAnswer) {
      return 'bg-green-500 hover:bg-green-600 text-white border-green-500';
    }
    
    if (option === selectedAnswer && option !== correctAnswer) {
      return 'bg-red-500 hover:bg-red-600 text-white border-red-500';
    }
    
    return 'opacity-50';
  };

  return (
    <Card className="w-full">
      <CardContent className="pt-6 space-y-6">
        {/* Question Header */}
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">
            Question {questionNumber} of {totalQuestions}
          </p>
          <h2 className="text-2xl font-semibold leading-tight">
            {questionText}
          </h2>
        </div>

        {/* Options Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {options.map((option, index) => (
            <Button
              key={index}
              variant={getButtonVariant(option)}
              className={cn(
                'h-auto min-h-[60px] p-4 text-left justify-start whitespace-normal',
                getButtonClasses(option)
              )}
              onClick={() => !isAnswered && onSelectAnswer(option)}
              disabled={isAnswered}
            >
              <span className="font-bold mr-3">{getOptionLabel(index)}.</span>
              <span>{option}</span>
            </Button>
          ))}
        </div>

        {/* Feedback Message */}
        {isAnswered && (
          <div
            className={cn(
              'p-4 rounded-lg text-center font-medium',
              selectedAnswer === correctAnswer
                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100'
                : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100'
            )}
          >
            {selectedAnswer === correctAnswer ? (
              '✓ Correct! Well done!'
            ) : selectedAnswer ? (
              `✗ Incorrect. The correct answer is: ${correctAnswer}`
            ) : (
              '⏱ Time\'s up! Moving to next question...'
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
