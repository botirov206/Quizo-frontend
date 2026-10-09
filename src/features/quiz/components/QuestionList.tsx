import type { Control, FieldErrors, UseFormRegister } from 'react-hook-form';
import { useFieldArray } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { emptyQuestion, type QuizFormValues } from '../types';
import { QuestionEditor } from './QuestionEditor';

interface QuestionListProps {
  control: Control<QuizFormValues>;
  register: UseFormRegister<QuizFormValues>;
  errors: FieldErrors<QuizFormValues>;
}

export const QuestionList = ({ control, register, errors }: QuestionListProps) => {
  const { fields, append, remove } = useFieldArray({ control, name: 'questions' });

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Questions ({fields.length})</h2>
      {typeof errors.questions?.message === 'string' && (
        <p className="text-sm text-destructive">{errors.questions.message}</p>
      )}
      {fields.map((field, index) => (
        <QuestionEditor
          key={field.id}
          index={index}
          register={register}
          errors={errors}
          onRemove={fields.length > 1 ? () => remove(index) : undefined}
        />
      ))}
      <Button
        type="button"
        variant="outline"
        className="w-full border-dashed"
        disabled={fields.length >= 100}
        onClick={() => append(emptyQuestion())}
      >
        <Plus className="h-4 w-4 mr-2" />
        Add Question
      </Button>
    </div>
  );
};
