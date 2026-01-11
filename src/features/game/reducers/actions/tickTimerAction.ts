import type { GameState } from '../../types';
import { getCurrentQuestion } from '../../types';

export const handleTickTimer = (state: GameState): GameState => {
  if (state.status !== 'PLAYING') return state;
  
  const newTimeLeft = Math.max(0, state.timeLeft - 1);
  
  // Auto-advance when time runs out
  if (newTimeLeft === 0) {
    const currentQ = getCurrentQuestion(state);
    if (!currentQ) return state;

    const timeSpent = Math.floor((Date.now() - state.questionStartTime) / 1000);

    return {
      ...state,
      status: 'FEEDBACK',
      answers: {
        ...state.answers,
        [currentQ.id]: '', // No answer selected
      },
      userAnswers: [
        ...state.userAnswers,
        {
          questionId: currentQ.id,
          selectedAnswer: '',
          isCorrect: false,
          timeSpent,
        },
      ],
    };
  }

  return {
    ...state,
    timeLeft: newTimeLeft,
  };
};
