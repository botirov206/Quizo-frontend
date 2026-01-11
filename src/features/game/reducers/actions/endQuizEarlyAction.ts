import type { GameState } from '../../types';

/**
 * Handles ending the quiz early
 * Marks all remaining unanswered questions as incorrect with null answer
 */
export const handleEndQuizEarly = (state: GameState): GameState => {
  if (!state.quiz || state.status === 'FINISHED') {
    return state;
  }

  const remainingQuestions = state.quiz.questions.slice(state.currentQuestionIndex);
  
  // Check if current question was already answered
  const isCurrentQuestionAnswered = state.userAnswers.some(
    answer => answer.questionId === remainingQuestions[0]?.id
  );

  // Mark all remaining unanswered questions as incorrect
  const unansweredQuestions = remainingQuestions
    .filter((_, index) => {
      // If current question is already answered (in FEEDBACK state), skip it
      if (index === 0 && isCurrentQuestionAnswered) {
        return false;
      }
      return true;
    })
    .map(question => ({
      questionId: question.id,
      selectedAnswer: null as unknown as string, // null indicates unanswered
      isCorrect: false,
      timeSpent: 0,
    }));

  // Create answers record for remaining questions
  const remainingAnswers: Record<string, string> = {};
  unansweredQuestions.forEach(answer => {
    remainingAnswers[answer.questionId] = '';
  });

  return {
    ...state,
    status: 'FINISHED',
    answers: {
      ...state.answers,
      ...remainingAnswers,
    },
    userAnswers: [
      ...state.userAnswers,
      ...unansweredQuestions,
    ],
    timeLeft: 0,
  };
};
