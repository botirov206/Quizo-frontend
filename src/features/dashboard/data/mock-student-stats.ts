/**
 * Mock Student Statistics Data
 * Simulated data for student dashboard
 */

import type { StudentStats, QuizAttempt, ScoreDataPoint } from '../types';

export const MOCK_STUDENT_STATS: StudentStats = {
  quizzesCompleted: 24,
  averageScore: 78.5,
  currentStreak: 5,
  totalTimeSpent: 187, // minutes
};

export const MOCK_RECENT_ACTIVITY: QuizAttempt[] = [
  {
    id: 'attempt-1',
    quizId: '1',
    quizTitle: 'JavaScript Fundamentals',
    score: 92,
    correctAnswers: 23,
    totalQuestions: 25,
    completedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
    timeSpent: 18,
    category: 'Programming',
  },
  {
    id: 'attempt-2',
    quizId: '3',
    quizTitle: 'React Hooks Deep Dive',
    score: 68,
    correctAnswers: 17,
    totalQuestions: 25,
    completedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
    timeSpent: 25,
    category: 'Programming',
  },
  {
    id: 'attempt-3',
    quizId: '2',
    quizTitle: 'World Geography Trivia',
    score: 84,
    correctAnswers: 21,
    totalQuestions: 25,
    completedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
    timeSpent: 15,
    category: 'Geography',
  },
  {
    id: 'attempt-4',
    quizId: '5',
    quizTitle: 'Math Midterm Practice',
    score: 76,
    correctAnswers: 19,
    totalQuestions: 25,
    completedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
    timeSpent: 32,
    category: 'Mathematics',
  },
  {
    id: 'attempt-5',
    quizId: '4',
    quizTitle: 'General Science Quiz',
    score: 88,
    correctAnswers: 22,
    totalQuestions: 25,
    completedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(), // 4 days ago
    timeSpent: 20,
    category: 'Science',
  },
];

export const MOCK_SCORE_HISTORY: ScoreDataPoint[] = [
  { quizTitle: 'HTML Basics', score: 72, date: '2026-01-01' },
  { quizTitle: 'CSS Flexbox', score: 78, date: '2026-01-02' },
  { quizTitle: 'JS Arrays', score: 65, date: '2026-01-03' },
  { quizTitle: 'React Props', score: 82, date: '2026-01-04' },
  { quizTitle: 'World Capitals', score: 88, date: '2026-01-05' },
  { quizTitle: 'Math Algebra', score: 76, date: '2026-01-06' },
  { quizTitle: 'Science Quiz', score: 88, date: '2026-01-07' },
  { quizTitle: 'Geography', score: 84, date: '2026-01-08' },
  { quizTitle: 'React Hooks', score: 68, date: '2026-01-08' },
  { quizTitle: 'JavaScript', score: 92, date: '2026-01-09' },
];
