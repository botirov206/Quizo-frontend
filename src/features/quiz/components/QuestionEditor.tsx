import type { FieldErrors, UseFormRegister } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Trash2 } from 'lucide-react';
import { QUESTION_OPTION_COUNT } from '../constants';
import type { QuizFormValues } from '../types';

interface QuestionEditorProps {
  index: number;
  register: UseFormRegister<QuizFormValues>;
  errors: FieldErrors<QuizFormValues>;
  onRemove?: () => void;
}

function FieldMessage({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="text-sm text-destructive mt-1">{message}</p>;
}

export const QuestionEditor = ({ index, register, errors, onRemove }: QuestionEditorProps) => {
  const questionErrors = errors.questions?.[index];
  const optionsError = questionErrors?.options;
  const duplicateMessage =
    optionsError && !Array.isArray(optionsError) ? optionsError.message : undefined;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Question {index + 1}</CardTitle>
          {onRemove && (
            <Button type="button" variant="ghost" size="sm" onClick={onRemove}>
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor={`questions.${index}.text`}>Question text</Label>
          <Input
            id={`questions.${index}.text`}
            {...register(`questions.${index}.text`)}
            placeholder="Enter your question"
          />
          <FieldMessage message={questionErrors?.text?.message} />
        </div>

        <div>
          <Label>Answer options</Label>
          <div className="space-y-2 mt-2">
            {Array.from({ length: QUESTION_OPTION_COUNT }, (_, optionIndex) => (
              <div key={optionIndex} className="flex items-center gap-2">
                <input
                  type="radio"
                  className="h-4 w-4"
                  aria-label={`Correct answer, option ${optionIndex + 1}`}
                  {...register(`questions.${index}.correctIndex`)}
                  value={String(optionIndex)}
                />
                <Input
                  {...register(`questions.${index}.options.${optionIndex}`)}
                  placeholder={`Option ${optionIndex + 1}`}
                  className="flex-1"
                />
              </div>
            ))}
          </div>
          <FieldMessage message={questionErrors?.correctIndex?.message} />
          <FieldMessage message={duplicateMessage} />
          {Array.from({ length: QUESTION_OPTION_COUNT }, (_, optionIndex) => (
            <FieldMessage
              key={optionIndex}
              message={questionErrors?.options?.[optionIndex]?.message}
            />
          ))}
        </div>

        <div>
          <Label htmlFor={`questions.${index}.explanation`}>Explanation (optional)</Label>
          <Input
            id={`questions.${index}.explanation`}
            {...register(`questions.${index}.explanation`)}
            placeholder="Explain why this is the correct answer"
          />
        </div>
      </CardContent>
    </Card>
  );
};
