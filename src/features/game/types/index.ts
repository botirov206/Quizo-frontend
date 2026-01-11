import type { StandardQuiz } from '@/types/quiz';

export type GameStatus = 'IDLE' | 'LOADING' | 'PLAYING' | 'FEEDBACK' | 'FINISHED';

export interface GameState {
  status: GameStatus;
  currentQuestionIndex: number;
  score: number;
  answers: Record<string, string>; // questionId: selectedAnswerId
  userAnswers: Array<{
    questionId: string;
    selectedAnswer: string;
    isCorrect: boolean;
    timeSpent: number;
  }>;
  timeLeft: number;
  questionStartTime: number;
  quiz: StandardQuiz | null;
}

export type GameAction =
  | { type: 'START_QUIZ'; payload: StandardQuiz }
  | { type: 'SELECT_ANSWER'; payload: string }
  | { type: 'NEXT_QUESTION' }
  | { type: 'TICK_TIMER' }
  | { type: 'FINISH_QUIZ' }
  | { type: 'RESET_GAME' };

export interface UseGameEngineReturn {
  state: GameState;
  startQuiz: (quiz: StandardQuiz) => void;
  selectAnswer: (answerId: string) => void;
  nextQuestion: () => void;
  resetGame: () => void;
  currentQuestion: ReturnType<typeof getCurrentQuestion>;
}

export const getCurrentQuestion = (state: GameState) => {
  if (!state.quiz || state.currentQuestionIndex >= state.quiz.questions.length) {
    return null;
  }
  return state.quiz.questions[state.currentQuestionIndex];
};
