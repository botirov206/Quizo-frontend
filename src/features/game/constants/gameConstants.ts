import type { GameState } from '../types';

export const DEFAULT_TIME_PER_QUESTION = 30; // seconds

export const INITIAL_GAME_STATE: GameState = {
  status: 'IDLE',
  currentQuestionIndex: 0,
  score: 0,
  answers: {},
  userAnswers: [],
  timeLeft: 0,
  questionStartTime: Date.now(),
  quiz: null,
};

export const FEEDBACK_DISPLAY_DURATION = 2000; // 2 seconds
export const TIMER_INTERVAL = 1000; // 1 second
