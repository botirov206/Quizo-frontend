// Standard Quiz Types - The Single Source of Truth
// All quiz data must conform to these interfaces

export interface StandardQuestion {
  id: string;
  text: string;
  options: string[]; // Shuffled [A, B, C, D]
  correctAnswerId: string; // The value to match against
  type: 'multiple' | 'boolean';
  explanation?: string; // Optional feedback text
}

export interface StandardQuiz {
  id: string;
  title: string;
  description?: string;
  source: 'opentdb' | 'custom';
  category?: string;
  difficulty?: 'easy' | 'medium' | 'hard';
  timeLimit?: number; // seconds per question
  questions: StandardQuestion[];
  createdBy?: string; // User ID (for custom quizzes)
  createdAt?: string;
}

export type GameStatus = 'IDLE' | 'LOADING' | 'PLAYING' | 'FEEDBACK' | 'FINISHED';

export interface GameState {
  status: GameStatus;
  currentQuestionIndex: number;
  score: number;
  answers: Record<string, string>; // questionId: selectedAnswerId
  timeLeft: number;
  quiz: StandardQuiz | null;
}
