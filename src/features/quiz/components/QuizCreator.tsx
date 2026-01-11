import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useRef, useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
// Switch disabled - backend doesn't support question types yet
// import { Switch } from '@/components/ui/switch';
import { quizFormSchema, type QuizFormData } from '../types';
import { useQuizAutoSave } from '../hooks/useQuizAutoSave';
import { useCreateQuiz } from '../hooks/useCreateQuiz';
import { Plus, Trash2, Save, CheckCircle, Copy } from 'lucide-react';
import { createOptions } from '../utils';
import { DEFAULT_OPTIONS_COUNT } from '../constants';

export const QuizCreator = () => {
  const navigate = useNavigate();
  // NOTE: Auto-save feature disabled - clearQuiz still used on submit
  const { clearQuiz, lastSaved } = useQuizAutoSave();
  const { createQuiz, loading, error: createError } = useCreateQuiz();
  
  // Success dialog state
  const [showSuccess, setShowSuccess] = useState(false);
  const [createdQuizKey, setCreatedQuizKey] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<QuizFormData>({
    resolver: zodResolver(quizFormSchema),
    defaultValues: {
      title: '',
      description: '',
      category: '',
      difficulty: 'medium',
      timeLimit: 30,
      questions: [
        {
          text: '',
          type: 'multiple-choice',
          options: createOptions(DEFAULT_OPTIONS_COUNT.INITIAL),
          correctAnswerId: '',
          explanation: '',
        },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'questions',
  });

  const autoSaveTimerRef = useRef<number | undefined>(undefined);

  // NOTE: Question type toggle disabled - backend doesn't support it yet
  // When backend is updated, uncomment these:
  // const watchedQuestions = useWatch({ control, name: 'questions' });
  // const handleQuestionTypeToggle = useCallback((questionIndex: number, isTrueFalse: boolean) => { ... });

  // NOTE: Auto-save feature disabled - was causing issues with stale data
  // When re-enabling, uncomment the useEffect below
  // Load saved draft on mount
  // useEffect(() => {
  //   const saved = loadQuiz();
  //   if (saved && Object.keys(saved).length > 0) {
  //     reset(saved as QuizFormData);
  //   }
  // }, [loadQuiz, reset]);

  // NOTE: Auto-save feature disabled - was causing issues with stale data
  // When re-enabling, uncomment the function body below
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleAutoSave = useCallback(() => {
    // Auto-save disabled
    // if (autoSaveTimerRef.current) {
    //   clearTimeout(autoSaveTimerRef.current);
    // }
    // autoSaveTimerRef.current = setTimeout(() => {
    //   const values = getValues();
    //   saveQuiz(values);
    // }, QUIZ_TIMING.AUTO_SAVE_DEBOUNCE);
  }, []);

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (autoSaveTimerRef.current) {
        clearTimeout(autoSaveTimerRef.current);
      }
    };
  }, []);

  // Handle validation errors (for debugging, can be removed)
  const onFormError = (_validationErrors: unknown) => {
    // Validation errors are shown inline in the form
  };

  const handleCopyQuizKey = useCallback(() => {
    if (createdQuizKey) {
      navigator.clipboard.writeText(createdQuizKey);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [createdQuizKey]);

  const handleSuccessClose = useCallback(() => {
    setShowSuccess(false);
    setCreatedQuizKey(null);
    navigate('/dashboard');
  }, [navigate]);

  const onSubmit = async (data: QuizFormData) => {
    try {
      const result = await createQuiz(data);
      clearQuiz();
      
      // Show success dialog with quiz key
      setCreatedQuizKey(result.quizKey);
      setShowSuccess(true);
    } catch (err) {
      // Error is handled by useCreateQuiz hook
    }
  };

  const addQuestion = useCallback(() => {
    append({
      text: '',
      type: 'multiple-choice',
      options: createOptions(DEFAULT_OPTIONS_COUNT.STANDARD),
      correctAnswerId: '',
      explanation: '',
    });
  }, [append]);

  return (
    <div className="container max-w-4xl mx-auto py-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Create New Quiz</h1>
          <p className="text-muted-foreground">Design your custom quiz with questions and answers</p>
        </div>
        {lastSaved && (
          <p className="text-sm text-muted-foreground">
            Last saved: {lastSaved.toLocaleTimeString()}
          </p>
        )}
      </div>

      <form onSubmit={handleSubmit(onSubmit, onFormError)} className="space-y-6">
        {/* Quiz Details */}
        <Card>
          <CardHeader>
            <CardTitle>Quiz Details</CardTitle>
            <CardDescription>Basic information about your quiz</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                {...register('title')}
                placeholder="e.g., JavaScript Fundamentals"
                onBlur={handleAutoSave}
              />
              {errors.title && (
                <p className="text-sm text-destructive mt-1">{errors.title.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="description">Description *</Label>
              <Input
                id="description"
                {...register('description')}
                placeholder="Brief description of the quiz content"
                onBlur={handleAutoSave}
              />
              {errors.description && (
                <p className="text-sm text-destructive mt-1">{errors.description.message}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="category">Category *</Label>
                <Input
                  id="category"
                  {...register('category')}
                  placeholder="e.g., Programming"
                  onBlur={handleAutoSave}
                />
                {errors.category && (
                  <p className="text-sm text-destructive mt-1">{errors.category.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="difficulty">Difficulty *</Label>
                <select
                  id="difficulty"
                  {...register('difficulty')}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                  onChange={handleAutoSave}
                >
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
                {errors.difficulty && (
                  <p className="text-sm text-destructive mt-1">{errors.difficulty.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="timeLimit">Time Limit (minutes) *</Label>
                <Input
                  id="timeLimit"
                  type="number"
                  {...register('timeLimit', { valueAsNumber: true })}
                  placeholder="30"
                  onBlur={handleAutoSave}
                />
                {errors.timeLimit && (
                  <p className="text-sm text-destructive mt-1">{errors.timeLimit.message}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Questions */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Questions ({fields.length})</h2>
          </div>

          {errors.questions && (
            <p className="text-sm text-destructive">{errors.questions.message}</p>
          )}

          {fields.map((field, questionIndex) => {
            // NOTE: Type toggle disabled - backend doesn't support question types yet
            // const isTrueFalse = watchedQuestions?.[questionIndex]?.type === 'true-false';
            
            return (
            <Card key={field.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Question {questionIndex + 1}</CardTitle>
                  <div className="flex items-center gap-4">
                    {/* 
                      MCQ/True-False Toggle - DISABLED
                      Backend API doesn't support question type parameter yet.
                      When backend is updated, uncomment this section.
                      
                    <div className="flex items-center gap-2">
                      <Label htmlFor={`question-type-${questionIndex}`} className="text-sm text-muted-foreground">
                        MCQ
                      </Label>
                      <Switch
                        id={`question-type-${questionIndex}`}
                        checked={isTrueFalse}
                        onCheckedChange={(checked: boolean) => handleQuestionTypeToggle(questionIndex, checked)}
                      />
                      <Label htmlFor={`question-type-${questionIndex}`} className="text-sm text-muted-foreground">
                        True/False
                      </Label>
                    </div>
                    */}
                    {fields.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => remove(questionIndex)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor={`questions.${questionIndex}.text`}>Question Text *</Label>
                  <Input
                    id={`questions.${questionIndex}.text`}
                    {...register(`questions.${questionIndex}.text`)}
                    placeholder="Enter your question"
                    onBlur={handleAutoSave}
                  />
                  {errors.questions?.[questionIndex]?.text && (
                    <p className="text-sm text-destructive mt-1">
                      {errors.questions[questionIndex]?.text?.message}
                    </p>
                  )}
                </div>

                <div>
                  <Label>Answer Options *</Label>
                  <div className="space-y-2 mt-2">
                    {field.options.map((option, optionIndex) => (
                      <div key={option.id} className="flex items-center gap-2">
                        <input
                          type="radio"
                          {...register(`questions.${questionIndex}.correctAnswerId`)}
                          value={option.id}
                          className="h-4 w-4"
                          onChange={handleAutoSave}
                        />
                        <Input
                          {...register(`questions.${questionIndex}.options.${optionIndex}.text`)}
                          placeholder={`Option ${optionIndex + 1}`}
                          className="flex-1"
                          onBlur={handleAutoSave}
                        />
                      </div>
                    ))}
                  </div>
                  {errors.questions?.[questionIndex]?.correctAnswerId && (
                    <p className="text-sm text-destructive mt-1">
                      {errors.questions[questionIndex]?.correctAnswerId?.message}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor={`questions.${questionIndex}.explanation`}>
                    Explanation (Optional)
                  </Label>
                  <Input
                    id={`questions.${questionIndex}.explanation`}
                    {...register(`questions.${questionIndex}.explanation`)}
                    placeholder="Explain why this is the correct answer"
                    onBlur={handleAutoSave}
                  />
                </div>
              </CardContent>
            </Card>
          );
          })}

          {/* Add Question Button - at bottom for better UX */}
          <Button 
            type="button" 
            onClick={addQuestion} 
            variant="outline" 
            className="w-full border-dashed"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Question
          </Button>
        </div>

        {/* Submit */}
        <div className="flex gap-4">
          <Button type="submit" disabled={loading} className="flex-1">
            <Save className="h-4 w-4 mr-2" />
            {loading ? 'Creating...' : 'Create Quiz'}
          </Button>
          <Button type="button" variant="outline" onClick={() => navigate('/dashboard')}>
            Cancel
          </Button>
        </div>

        {createError && (
          <p className="text-sm text-destructive text-center">{createError}</p>
        )}
      </form>

      {/* Success Dialog */}
      <AlertDialog open={showSuccess} onOpenChange={setShowSuccess}>
        <AlertDialogContent className="sm:max-w-md">
          <AlertDialogHeader>
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <AlertDialogTitle className="text-center">Quiz Created Successfully!</AlertDialogTitle>
            <AlertDialogDescription className="text-center">
              Your quiz has been created. Share the quiz key with your students so they can join.
            </AlertDialogDescription>
          </AlertDialogHeader>
          
          <div className="flex items-center justify-center gap-2 my-4">
            <div className="flex-1 rounded-lg bg-muted px-4 py-3 text-center">
              <p className="text-xs text-muted-foreground mb-1">Quiz Key</p>
              <p className="text-2xl font-bold tracking-widest">{createdQuizKey}</p>
            </div>
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={handleCopyQuizKey}
              className="h-12 w-12"
            >
              <Copy className="h-4 w-4" />
            </Button>
          </div>
          
          {copied && (
            <p className="text-sm text-green-600 text-center">Copied to clipboard!</p>
          )}

          <AlertDialogFooter className="sm:justify-center">
            <AlertDialogAction onClick={handleSuccessClose} className="w-full sm:w-auto">
              Go to Dashboard
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
