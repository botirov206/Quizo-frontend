import { z } from 'zod';
import type { CreateQuizBody } from '@/api/types';
import { QUESTION_OPTION_COUNT } from '../constants';

const optionText = z.string().refine((value) => value.trim().length > 0, 'Option text is required');

export const questionSchema = z
  .object({
    text: z.string().refine((value) => value.trim().length > 0, 'Question text is required'),
    options: z.array(optionText).length(QUESTION_OPTION_COUNT),
    correctIndex: z.string().refine((value) => {
      const index = Number(value);
      return Number.isInteger(index) && index >= 0 && index < QUESTION_OPTION_COUNT;
    }, 'Select the correct answer'),
    explanation: z.string(),
  })
  .superRefine((question, ctx) => {
    const texts = question.options.map((option) => option.trim());
    if (new Set(texts).size === texts.length) return;
    ctx.addIssue({
      code: 'custom',
      message: 'Answer options must be unique',
      path: ['options'],
    });
  });

export const quizFormSchema = z.object({
  title: z
    .string()
    .max(100, 'Title must be at most 100 characters')
    .refine((value) => value.trim().length >= 3, 'Title must be at least 3 characters'),
  description: z.string().max(500, 'Description must be at most 500 characters'),
  categoryId: z.string().min(1, 'Category is required'),
  difficulty: z.enum(['EASY', 'MEDIUM', 'HARD']),
  timePerQuestion: z
    .number('Enter the seconds per question')
    .int('Enter a whole number of seconds')
    .min(5, 'At least 5 seconds')
    .max(120, 'At most 120 seconds'),
  isPublished: z.boolean(),
  questions: z
    .array(questionSchema)
    .min(1, 'Add at least one question')
    .max(100, 'A quiz can have at most 100 questions'),
});

export type QuestionFormValues = z.infer<typeof questionSchema>;
export type QuizFormValues = z.infer<typeof quizFormSchema>;

export function emptyQuestion(): QuestionFormValues {
  return {
    text: '',
    options: Array.from({ length: QUESTION_OPTION_COUNT }, () => ''),
    correctIndex: '-1',
    explanation: '',
  };
}

export function toCreateQuizBody(values: QuizFormValues): CreateQuizBody {
  const description = values.description.trim();
  return {
    title: values.title.trim(),
    ...(description ? { description } : {}),
    categoryId: values.categoryId,
    difficulty: values.difficulty,
    timePerQuestion: values.timePerQuestion,
    isPublished: values.isPublished,
    questions: values.questions.map((question) => {
      const options = question.options.map((option) => option.trim());
      const explanation = question.explanation.trim();
      return {
        text: question.text.trim(),
        type: 'MULTIPLE',
        options,
        correctOption: options[Number(question.correctIndex)] ?? '',
        ...(explanation ? { explanation } : {}),
      };
    }),
  };
}
