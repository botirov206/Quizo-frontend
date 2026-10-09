import { useQuery } from '@tanstack/react-query';
import { CLASSROOM_QUERY_KEYS } from '../constants';
import { fetchResultRows } from '../api';
import type { ClassroomQuizResult } from '../types';

export const useClassroomResults = (classroomId: string | undefined) => {
  return useQuery({
    queryKey: CLASSROOM_QUERY_KEYS.RESULTS(classroomId || ''),
    queryFn: () => fetchResultRows(classroomId!),
    enabled: !!classroomId,
  });
};

export interface ResultsGridData {
  students: Array<{ id: string; name: string }>;
  quizzes: Array<{ id: string; title: string }>;
  results: Record<string, Record<string, number>>;
}

export const transformToGridData = (rows: ClassroomQuizResult[]): ResultsGridData => {
  const students = new Map<string, string>();
  const quizzes = new Map<string, string>();
  const results: Record<string, Record<string, number>> = {};

  for (const row of rows) {
    students.set(row.studentId, row.studentName);
    quizzes.set(row.quizId, row.quizTitle);
    results[row.studentId] ??= {};
    results[row.studentId][row.quizId] = row.percentage;
  }

  return {
    students: Array.from(students, ([id, name]) => ({ id, name })),
    quizzes: Array.from(quizzes, ([id, title]) => ({ id, title })),
    results,
  };
};
