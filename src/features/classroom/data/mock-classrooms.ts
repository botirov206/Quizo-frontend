/**
 * Mock Classroom Data
 * Used for development until backend is connected
 */

import type { Classroom, ClassroomStudent, ClassroomQuizResult } from '../types';

export const MOCK_CLASSROOMS: Classroom[] = [
  {
    id: 'class-1',
    name: 'Math 101 - Grade 9',
    code: 'ABC123',
    teacherId: 'teacher-1',
    teacherName: 'Test Teacher',
    studentIds: ['s-1', 's-2', 's-3', 's-4', 's-5'],
    quizIds: ['tq-1', 'tq-2'],
    createdAt: '2026-01-01T10:00:00Z',
  },
  {
    id: 'class-2',
    name: 'English Literature',
    code: 'XYZ789',
    teacherId: 'teacher-1',
    teacherName: 'Test Teacher',
    studentIds: ['s-1', 's-3', 's-6', 's-7'],
    quizIds: ['tq-4'],
    createdAt: '2026-01-03T14:30:00Z',
  },
  {
    id: 'class-3',
    name: 'History of Uzbekistan',
    code: 'HIS456',
    teacherId: 'teacher-1',
    teacherName: 'Test Teacher',
    studentIds: ['s-2', 's-4', 's-5', 's-8', 's-9', 's-10'],
    quizIds: ['tq-3'],
    createdAt: '2026-01-05T09:00:00Z',
  },
];

export const MOCK_STUDENTS: ClassroomStudent[] = [
  {
    id: 's-1',
    name: 'Ali Karimov',
    email: 'ali@student.edu',
    joinedAt: '2026-01-02T10:00:00Z',
    quizzesCompleted: 8,
    averageScore: 85,
  },
  {
    id: 's-2',
    name: 'Dilnoza Umarova',
    email: 'dilnoza@student.edu',
    joinedAt: '2026-01-02T11:00:00Z',
    quizzesCompleted: 6,
    averageScore: 78,
  },
  {
    id: 's-3',
    name: 'Bobur Toshev',
    email: 'bobur@student.edu',
    joinedAt: '2026-01-03T09:00:00Z',
    quizzesCompleted: 10,
    averageScore: 92,
  },
  {
    id: 's-4',
    name: 'Nilufar Azizova',
    email: 'nilufar@student.edu',
    joinedAt: '2026-01-03T10:00:00Z',
    quizzesCompleted: 5,
    averageScore: 70,
  },
  {
    id: 's-5',
    name: 'Sardor Rahimov',
    email: 'sardor@student.edu',
    joinedAt: '2026-01-04T08:00:00Z',
    quizzesCompleted: 7,
    averageScore: 88,
  },
  {
    id: 's-6',
    name: 'Madina Yusupova',
    email: 'madina@student.edu',
    joinedAt: '2026-01-04T09:00:00Z',
    quizzesCompleted: 4,
    averageScore: 75,
  },
  {
    id: 's-7',
    name: 'Jasur Aliyev',
    email: 'jasur@student.edu',
    joinedAt: '2026-01-05T10:00:00Z',
    quizzesCompleted: 9,
    averageScore: 82,
  },
  {
    id: 's-8',
    name: 'Gulnora Saidova',
    email: 'gulnora@student.edu',
    joinedAt: '2026-01-05T11:00:00Z',
    quizzesCompleted: 3,
    averageScore: 65,
  },
  {
    id: 's-9',
    name: 'Otabek Nazarov',
    email: 'otabek@student.edu',
    joinedAt: '2026-01-06T08:00:00Z',
    quizzesCompleted: 6,
    averageScore: 79,
  },
  {
    id: 's-10',
    name: 'Zarina Mirzayeva',
    email: 'zarina@student.edu',
    joinedAt: '2026-01-06T09:00:00Z',
    quizzesCompleted: 8,
    averageScore: 91,
  },
];

export const MOCK_RESULTS: ClassroomQuizResult[] = [
  {
    studentId: 's-1',
    studentName: 'Ali Karimov',
    quizId: 'tq-1',
    quizTitle: 'Math Fundamentals',
    score: 9,
    totalQuestions: 10,
    percentage: 90,
    completedAt: '2026-01-10T14:30:00Z',
  },
  {
    studentId: 's-2',
    studentName: 'Dilnoza Umarova',
    quizId: 'tq-1',
    quizTitle: 'Math Fundamentals',
    score: 8,
    totalQuestions: 10,
    percentage: 80,
    completedAt: '2026-01-10T15:00:00Z',
  },
  {
    studentId: 's-3',
    studentName: 'Bobur Toshev',
    quizId: 'tq-1',
    quizTitle: 'Math Fundamentals',
    score: 10,
    totalQuestions: 10,
    percentage: 100,
    completedAt: '2026-01-10T13:00:00Z',
  },
  {
    studentId: 's-1',
    studentName: 'Ali Karimov',
    quizId: 'tq-2',
    quizTitle: 'Algebra Basics',
    score: 12,
    totalQuestions: 15,
    percentage: 80,
    completedAt: '2026-01-11T10:00:00Z',
  },
  {
    studentId: 's-4',
    studentName: 'Nilufar Azizova',
    quizId: 'tq-2',
    quizTitle: 'Algebra Basics',
    score: 11,
    totalQuestions: 15,
    percentage: 73,
    completedAt: '2026-01-11T11:00:00Z',
  },
];

// Helper to get students for a classroom
export const getStudentsForClassroom = (classroomId: string): ClassroomStudent[] => {
  const classroom = MOCK_CLASSROOMS.find((c) => c.id === classroomId);
  if (!classroom) return [];
  return MOCK_STUDENTS.filter((s) => classroom.studentIds.includes(s.id));
};

// Helper to get results for a classroom
export const getResultsForClassroom = (classroomId: string): ClassroomQuizResult[] => {
  const classroom = MOCK_CLASSROOMS.find((c) => c.id === classroomId);
  if (!classroom) return [];
  return MOCK_RESULTS.filter(
    (r) => classroom.studentIds.includes(r.studentId) && classroom.quizIds.includes(r.quizId)
  );
};

// Helper to get classrooms for a teacher
export const getClassroomsForTeacher = (teacherId: string): Classroom[] => {
  return MOCK_CLASSROOMS.filter((c) => c.teacherId === teacherId);
};

// Helper to get classrooms for a student
export const getClassroomsForStudent = (studentId: string): Classroom[] => {
  return MOCK_CLASSROOMS.filter((c) => c.studentIds.includes(studentId));
};
