/**
 * Classroom Feature Types
 * Based on PRD Section 7.4
 */

export interface Classroom {
  id: string;
  name: string;
  code: string; // 6-digit alphanumeric join code
  teacherId: string;
  teacherName: string;
  studentIds: string[];
  quizIds: string[];
  createdAt: string;
  updatedAt?: string;
}

export interface ClassroomStudent {
  id: string;
  name: string;
  email: string;
  joinedAt: string;
  quizzesCompleted: number;
  averageScore: number;
}

export interface ClassroomQuizResult {
  studentId: string;
  studentName: string;
  quizId: string;
  quizTitle: string;
  score: number;
  totalQuestions: number;
  percentage: number;
  completedAt: string;
}

export interface CreateClassroomInput {
  name: string;
}

export interface JoinClassroomInput {
  code: string;
}

export interface ClassroomStats {
  totalStudents: number;
  totalQuizzes: number;
  averageScore: number;
  completionRate: number;
}
