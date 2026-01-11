import { useReducer, useEffect, useCallback, useRef } from 'react';
import type { StandardQuiz } from '@/types/quiz';
import type { UseGameEngineReturn } from '../types';
import { getCurrentQuestion } from '../types';
import { gameReducer } from '../reducers/gameReducer';
import { INITIAL_GAME_STATE, FEEDBACK_DISPLAY_DURATION, TIMER_INTERVAL } from '../constants/gameConstants';

export const useGameEngine = (): UseGameEngineReturn => {
  const [state, dispatch] = useReducer(gameReducer, INITIAL_GAME_STATE);
  const timerRef = useRef<number | undefined>(undefined);

  // Timer effect
  useEffect(() => {
    if (state.status === 'PLAYING') {
      timerRef.current = setInterval(() => {
        dispatch({ type: 'TICK_TIMER' });
      }, TIMER_INTERVAL);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [state.status]);

  // Auto-advance after feedback
  useEffect(() => {
    if (state.status === 'FEEDBACK') {
      const timeout = setTimeout(() => {
        dispatch({ type: 'NEXT_QUESTION' });
      }, FEEDBACK_DISPLAY_DURATION);

      return () => clearTimeout(timeout);
    }
  }, [state.status]);

  const startQuiz = useCallback((quiz: StandardQuiz) => {
    dispatch({ type: 'START_QUIZ', payload: quiz });
  }, []);

  const selectAnswer = useCallback((answerId: string) => {
    dispatch({ type: 'SELECT_ANSWER', payload: answerId });
  }, []);

  const nextQuestion = useCallback(() => {
    dispatch({ type: 'NEXT_QUESTION' });
  }, []);

  const resetGame = useCallback(() => {
    dispatch({ type: 'RESET_GAME' });
  }, []);

  const endQuizEarly = useCallback(() => {
    dispatch({ type: 'END_QUIZ_EARLY' });
  }, []);

  return {
    state,
    startQuiz,
    selectAnswer,
    nextQuestion,
    resetGame,
    endQuizEarly,
    currentQuestion: getCurrentQuestion(state),
  };
};
