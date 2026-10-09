/**
 * Start Quiz Action
 * Resets engine state and begins the first question
 */

import type { GameState } from '../../types';
import type { StandardQuiz } from '@/types/quiz';
import { INITIAL_GAME_STATE, DEFAULT_TIME_PER_QUESTION } from '../../constants/gameConstants';

/** Initializes play state from a loaded quiz */
export const handleStartQuiz = (_state: GameState, quiz: StandardQuiz): GameState => {
  const timeLimit = quiz.timeLimit || DEFAULT_TIME_PER_QUESTION;
  
  return {
    ...INITIAL_GAME_STATE,
    status: 'PLAYING',
    quiz,
    timeLeft: timeLimit,
    questionStartTime: Date.now(),
  };
};
