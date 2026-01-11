import type { GameState } from '../../types';
import { DEFAULT_TIME_PER_QUESTION } from '../../constants/gameConstants';

export const handleNextQuestion = (state: GameState): GameState => {
  if (!state.quiz) return state;

  const nextIndex = state.currentQuestionIndex + 1;
  const isLastQuestion = nextIndex >= state.quiz.questions.length;

  if (isLastQuestion) {
    return {
      ...state,
      status: 'FINISHED',
    };
  }

  const timeLimit = state.quiz.timeLimit || DEFAULT_TIME_PER_QUESTION;
  
  return {
    ...state,
    status: 'PLAYING',
    currentQuestionIndex: nextIndex,
    timeLeft: timeLimit,
    questionStartTime: Date.now(),
  };
};
