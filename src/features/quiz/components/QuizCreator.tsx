import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { getErrorMessage } from '@/lib/api-error';
import { toastApiError } from '@/lib/toast-api-error';
import { Save } from 'lucide-react';
import { useCategories, useCreateQuiz } from '../api';
import { DEFAULT_SECONDS_PER_QUESTION } from '../constants';
import { emptyQuestion, quizFormSchema, toCreateQuizBody, type QuizFormValues } from '../types';
import { QuestionList } from './QuestionList';
import { QuizCreatedDialog } from './QuizCreatedDialog';
import { QuizDetailsFields } from './QuizDetailsFields';

export const QuizCreator = () => {
  const navigate = useNavigate();
  const categories = useCategories();
  const createQuiz = useCreateQuiz();
  const [createdKey, setCreatedKey] = useState<string | null>(null);

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<QuizFormValues>({
    resolver: zodResolver(quizFormSchema),
    defaultValues: {
      title: '',
      description: '',
      categoryId: '',
      difficulty: 'MEDIUM',
      timePerQuestion: DEFAULT_SECONDS_PER_QUESTION,
      isPublished: true,
      questions: [emptyQuestion()],
    },
  });

  useEffect(() => {
    if (categories.error) toastApiError(categories.error);
  }, [categories.error]);

  const onSubmit = async (values: QuizFormValues) => {
    try {
      const created = await createQuiz.mutateAsync(toCreateQuizBody(values));
      reset();
      setCreatedKey(created.quizKey);
    } catch (error) {
      toastApiError(error);
    }
  };

  return (
    <div className="container max-w-4xl mx-auto py-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Create New Quiz</h1>
        <p className="text-muted-foreground">Design your custom quiz with questions and answers</p>
      </div>

      <form noValidate onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <QuizDetailsFields
          register={register}
          control={control}
          errors={errors}
          categories={categories.data ?? []}
          categoriesLoading={categories.isLoading}
          categoriesError={categories.error ? getErrorMessage(categories.error) : undefined}
        />
        <QuestionList control={control} register={register} errors={errors} />

        <div className="flex gap-4">
          <Button type="submit" disabled={createQuiz.isPending} className="flex-1">
            <Save className="h-4 w-4 mr-2" />
            {createQuiz.isPending ? 'Creating...' : 'Create Quiz'}
          </Button>
          <Button type="button" variant="outline" onClick={() => navigate('/dashboard')}>
            Cancel
          </Button>
        </div>
      </form>

      <QuizCreatedDialog quizKey={createdKey} onClose={() => navigate('/dashboard')} />
    </div>
  );
};
