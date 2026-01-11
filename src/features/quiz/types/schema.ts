import { z } from 'zod';

export const questionSchema = z.object({
  text: z.string().min(5, 'Question must be at least 5 characters'),
  type: z.enum(['multiple-choice', 'true-false']),
  options: z.array(
    z.object({
      id: z.string(),
      text: z.string().min(1, 'Option text is required'),
    })
  ).min(2, 'At least 2 options required'),
  correctAnswerId: z.string().min(1, 'Please select the correct answer'),
  explanation: z.string().optional(),
}).refine(
  (data) => data.options.some((opt) => opt.id === data.correctAnswerId),
  { message: 'Correct answer must match one of the option IDs', path: ['correctAnswerId'] }
);

export const quizFormSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters').max(100, 'Title too long'),
  description: z.string().min(10, 'Description must be at least 10 characters').max(500, 'Description too long'),
  category: z.string().min(1, 'Category is required'),
  difficulty: z.enum(['easy', 'medium', 'hard']),
  timeLimit: z.number().min(5, 'Minimum 5 minutes').max(180, 'Maximum 180 minutes'),
  questions: z.array(questionSchema).min(1, 'Quiz must have at least 1 question'),
});

export type QuestionFormData = z.infer<typeof questionSchema>;
export type QuizFormData = z.infer<typeof quizFormSchema>;
