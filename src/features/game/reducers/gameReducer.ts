import type { GameState, GameAction } from '../types';
import { INITIAL_GAME_STATE } from '../constants/gameConstants';
import {
  handleStartQuiz,
  handleSelectAnswer,
  handleNextQuestion,
  handleTickTimer,
  handleEndQuizEarly,
} from './actions';

export function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'START_QUIZ':
      return handleStartQuiz(state, action.payload);

    case 'SELECT_ANSWER':
      return handleSelectAnswer(state, action.payload);

    case 'NEXT_QUESTION':
      return handleNextQuestion(state);

    case 'TICK_TIMER':
      return handleTickTimer(state);

    case 'FINISH_QUIZ':
      return {
        ...state,
        status: 'FINISHED',
      };

    case 'END_QUIZ_EARLY':
      return handleEndQuizEarly(state);

    case 'RESET_GAME':
      return INITIAL_GAME_STATE;

    default:
      return state;
  }
}
