/**
 * Mock Teacher Statistics Data
 * Used for development until backend is connected
 */

export interface TeacherStats {
  totalQuizzes: number;
  totalStudents: number;
  totalClassrooms: number;
  averageScore: number;
  quizzesThisWeek: number;
  studentsThisWeek: number;
}

export interface TeacherQuiz {
  id: string;
  title: string;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
  questionCount: number;
  timesPlayed: number;
  averageScore: number;
  createdAt: string;
}

export interface StudentResult {
  studentId: string;
  studentName: string;
  quizId: string;
  quizTitle: string;
  score: number;
  totalQuestions: number;
  completedAt: string;
}

export const MOCK_TEACHER_STATS: TeacherStats = {
  totalQuizzes: 12,
  totalStudents: 45,
  totalClassrooms: 3,
  averageScore: 78.5,
  quizzesThisWeek: 2,
  studentsThisWeek: 8,
};

export const MOCK_TEACHER_QUIZZES: TeacherQuiz[] = [
  {
    id: 'tq-1',
    title: 'Math Fundamentals',
    category: 'Mathematics',
    difficulty: 'easy',
    questionCount: 10,
    timesPlayed: 24,
    averageScore: 82,
    createdAt: '2026-01-05T10:00:00Z',
  },
  {
    id: 'tq-2',
    title: 'Algebra Basics',
    category: 'Mathematics',
    difficulty: 'medium',
    questionCount: 15,
    timesPlayed: 18,
    averageScore: 71,
    createdAt: '2026-01-03T14:30:00Z',
  },
  {
    id: 'tq-3',
    title: 'History of Uzbekistan',
    category: 'History',
    difficulty: 'medium',
    questionCount: 12,
    timesPlayed: 32,
    averageScore: 68,
    createdAt: '2026-01-01T09:00:00Z',
  },
  {
    id: 'tq-4',
    title: 'English Grammar',
    category: 'English',
    difficulty: 'hard',
    questionCount: 20,
    timesPlayed: 15,
    averageScore: 65,
    createdAt: '2025-12-28T11:00:00Z',
  },
];

export const MOCK_RECENT_RESULTS: StudentResult[] = [
  {
    studentId: 's-1',
    studentName: 'Ali Karimov',
    quizId: 'tq-1',
    quizTitle: 'Math Fundamentals',
    score: 9,
    totalQuestions: 10,
    completedAt: '2026-01-11T14:30:00Z',
  },
  {
    studentId: 's-2',
    studentName: 'Dilnoza Umarova',
    quizId: 'tq-2',
    quizTitle: 'Algebra Basics',
    score: 12,
    totalQuestions: 15,
    completedAt: '2026-01-11T13:45:00Z',
  },
  {
    studentId: 's-3',
    studentName: 'Bobur Toshev',
    quizId: 'tq-3',
    quizTitle: 'History of Uzbekistan',
    score: 8,
    totalQuestions: 12,
    completedAt: '2026-01-11T12:00:00Z',
  },
  {
    studentId: 's-1',
    studentName: 'Ali Karimov',
    quizId: 'tq-4',
    quizTitle: 'English Grammar',
    score: 14,
    totalQuestions: 20,
    completedAt: '2026-01-10T16:20:00Z',
  },
  {
    studentId: 's-4',
    studentName: 'Nilufar Azizova',
    quizId: 'tq-1',
    quizTitle: 'Math Fundamentals',
    score: 10,
    totalQuestions: 10,
    completedAt: '2026-01-10T15:00:00Z',
  },
];
