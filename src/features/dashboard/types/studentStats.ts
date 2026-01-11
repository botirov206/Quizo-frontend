/**
 * Student Statistics Types
 */

export interface StudentStats {
  quizzesCompleted: number;
  averageScore: number; // Percentage 0-100
  currentStreak: number; // Days
  totalTimeSpent: number; // Minutes
}

export interface QuizAttempt {
  id: string;
  quizId: string;
  quizTitle: string;
  score: number; // Percentage 0-100
  correctAnswers: number;
  totalQuestions: number;
  completedAt: string; // ISO date
  timeSpent: number; // Minutes
  category?: string;
}

export interface ScoreDataPoint {
  quizTitle: string;
  score: number;
  date: string;
}
