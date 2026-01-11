/**
 * useClassroomResults Hook
 * Fetches quiz results for a classroom
 */

import { useQuery } from '@tanstack/react-query';
import { CLASSROOM_QUERY_KEYS, MOCK_DELAY } from '../constants';
import { getResultsForClassroom } from '../data/mock-classrooms';
import type { ClassroomQuizResult } from '../types';

/**
 * Fetch results for a classroom
 */
const fetchClassroomResults = async (classroomId: string): Promise<ClassroomQuizResult[]> => {
  await new Promise((resolve) => setTimeout(resolve, MOCK_DELAY));
  
  // TODO: Replace with real API call
  // const response = await api.get(`/classrooms/${classroomId}/results`);
  // return response.data;
  
  return getResultsForClassroom(classroomId);
};

export const useClassroomResults = (classroomId: string | undefined) => {
  return useQuery({
    queryKey: CLASSROOM_QUERY_KEYS.RESULTS(classroomId || ''),
    queryFn: () => fetchClassroomResults(classroomId!),
    enabled: !!classroomId,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

/**
 * Transform results into a grid format for display
 * Rows: Students, Columns: Quizzes, Cells: Scores
 */
export interface ResultsGridData {
  students: Array<{ id: string; name: string }>;
  quizzes: Array<{ id: string; title: string }>;
  results: Record<string, Record<string, number>>; // studentId -> quizId -> percentage
}

export const transformToGridData = (results: ClassroomQuizResult[]): ResultsGridData => {
  const studentsMap = new Map<string, string>();
  const quizzesMap = new Map<string, string>();
  const resultsMap: Record<string, Record<string, number>> = {};

  results.forEach((result) => {
    // Track unique students
    if (!studentsMap.has(result.studentId)) {
      studentsMap.set(result.studentId, result.studentName);
    }

    // Track unique quizzes
    if (!quizzesMap.has(result.quizId)) {
      quizzesMap.set(result.quizId, result.quizTitle);
    }

    // Build results matrix
    if (!resultsMap[result.studentId]) {
      resultsMap[result.studentId] = {};
    }
    resultsMap[result.studentId][result.quizId] = result.percentage;
  });

  return {
    students: Array.from(studentsMap.entries()).map(([id, name]) => ({ id, name })),
    quizzes: Array.from(quizzesMap.entries()).map(([id, title]) => ({ id, title })),
    results: resultsMap,
  };
};
