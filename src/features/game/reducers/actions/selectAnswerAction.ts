import type { GameState } from '../../types';
import { getCurrentQuestion } from '../../types';

export const handleSelectAnswer = (state: GameState, answerId: string): GameState => {
  const currentQ = getCurrentQuestion(state);
  if (!currentQ || state.status !== 'PLAYING') return state;

  const isCorrect = currentQ.correctAnswerId === answerId;
  const timeSpent = Math.floor((Date.now() - state.questionStartTime) / 1000);

  return {
    ...state,
    status: 'FEEDBACK',
    answers: {
      ...state.answers,
      [currentQ.id]: answerId,
    },
    userAnswers: [
      ...state.userAnswers,
      {
        questionId: currentQ.id,
        selectedAnswer: answerId,
        isCorrect,
        timeSpent,
      },
    ],
    score: isCorrect ? state.score + 1 : state.score,
  };
};
