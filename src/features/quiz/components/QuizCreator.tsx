import { useForm, useFieldArray, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { quizFormSchema, type QuizFormData } from '../types';
import { useQuizAutoSave } from '../hooks/useQuizAutoSave';
import { useCreateQuiz } from '../hooks/useCreateQuiz';
import { Plus, Trash2, Save } from 'lucide-react';
import { createOptions, createOption } from '../utils';
import { DEFAULT_OPTIONS_COUNT, QUIZ_TIMING } from '../constants';

export const QuizCreator = () => {
  const navigate = useNavigate();
  const { saveQuiz, loadQuiz, clearQuiz, lastSaved } = useQuizAutoSave();
  const { createQuiz, loading, error: createError } = useCreateQuiz();

  const {
    register,
    control,
    handleSubmit,
    getValues,
    reset,
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

  const { fields, append, remove, update } = useFieldArray({
    control,
    name: 'questions',
  });

  const autoSaveTimerRef = useRef<number | undefined>(undefined);

  // Watch question types to handle toggle changes
  const watchedQuestions = useWatch({ control, name: 'questions' });

  // Handle question type toggle (MCQ <-> True/False)
  const handleQuestionTypeToggle = useCallback((questionIndex: number, isTrueFalse: boolean) => {
    const currentQuestion = fields[questionIndex];
    const newType = isTrueFalse ? 'true-false' : 'multiple-choice';
    
    let newOptions;
    if (isTrueFalse) {
      // Switch to True/False - create 2 options with preset text
      newOptions = [
        { id: createOption().id, text: 'True' },
        { id: createOption().id, text: 'False' },
      ];
    } else {
      // Switch to MCQ - create 4 empty options
      newOptions = createOptions(DEFAULT_OPTIONS_COUNT.STANDARD);
    }

    update(questionIndex, {
      ...currentQuestion,
      type: newType,
      options: newOptions,
      correctAnswerId: '', // Reset correct answer when switching types
    });
    
    handleAutoSave();
  }, [fields, update]);

  // Load saved draft on mount
  useEffect(() => {
    const saved = loadQuiz();
    if (saved && Object.keys(saved).length > 0) {
      reset(saved as QuizFormData);
    }
  }, [loadQuiz, reset]);

  // Auto-save with debounce
  const handleAutoSave = useCallback(() => {
    if (autoSaveTimerRef.current) {
      clearTimeout(autoSaveTimerRef.current);
    }
    autoSaveTimerRef.current = setTimeout(() => {
      const values = getValues();
      saveQuiz(values);
    }, QUIZ_TIMING.AUTO_SAVE_DEBOUNCE);
  }, [getValues, saveQuiz]);

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (autoSaveTimerRef.current) {
        clearTimeout(autoSaveTimerRef.current);
      }
    };
  }, []);

  const onSubmit = async (data: QuizFormData) => {
    try {
      await createQuiz(data);
      clearQuiz();
      alert('Quiz created successfully!');
      navigate('/dashboard');
    } catch (err) {
      console.error('Failed to create quiz:', err);
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

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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
            const isTrueFalse = watchedQuestions?.[questionIndex]?.type === 'true-false';
            
            return (
            <Card key={field.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Question {questionIndex + 1}</CardTitle>
                  <div className="flex items-center gap-4">
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
    </div>
  );
};
