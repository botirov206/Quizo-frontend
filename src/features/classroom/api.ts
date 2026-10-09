import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { ClassroomList, ClassroomMember, ClassroomResults } from '@/api/types';
import { apiClient } from '@/lib/axios';
import { toastApiError } from '@/lib/toast-api-error';
import { CLASSROOM_QUERY_KEYS } from './constants';
import type { ClassroomQuizResult, ClassroomStudent } from './types';

export async function fetchClassrooms(): Promise<ClassroomList['items']> {
  const { data } = await apiClient.get<ClassroomList>('/classrooms');
  return data.items;
}

export async function fetchMembers(classroomId: string): Promise<ClassroomStudent[]> {
  const { data } = await apiClient.get<{ items: ClassroomMember[] }>(`/classrooms/${classroomId}/members`);
  return data.items.map((member) => ({
    id: member.id,
    name: `${member.firstName} ${member.lastName}`.trim(),
    email: member.email,
    joinedAt: member.joinedAt,
    quizzesCompleted: member.quizzesCompleted,
    averageScore: member.averageScore,
  }));
}

export async function fetchResultRows(classroomId: string): Promise<ClassroomQuizResult[]> {
  const { data } = await apiClient.get<ClassroomResults>(`/classrooms/${classroomId}/results`);
  const rows: ClassroomQuizResult[] = [];
  for (const student of data.students) {
    const scores = data.cells[student.id] ?? {};
    for (const assignment of data.assignments) {
      const percentage = scores[assignment.id];
      if (percentage == null) continue;
      rows.push({
        studentId: student.id,
        studentName: student.name,
        quizId: assignment.id,
        quizTitle: assignment.quizTitle,
        score: percentage,
        totalQuestions: 100,
        percentage,
        completedAt: '',
      });
    }
  }
  return rows;
}

export function useAssignQuiz(classroomId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (quizId: string) => apiClient.post(`/classrooms/${classroomId}/assignments`, {
      quizId,
      dueAt: null,
    }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: CLASSROOM_QUERY_KEYS.RESULTS(classroomId) });
    },
    onError: (error) => toastApiError(error),
  });
}
