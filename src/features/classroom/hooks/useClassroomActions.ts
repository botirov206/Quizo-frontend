import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { toast } from 'sonner';
import type { Classroom } from '@/api/types';
import { apiClient } from '@/lib/axios';
import { getErrorMessage } from '@/lib/api-error';
import { CLASSROOM_QUERY_KEYS, CLASSROOM_SUCCESS_MESSAGES } from '../constants';
import type { CreateClassroomInput, JoinClassroomInput } from '../types';

export const useClassroomActions = () => {
  const queryClient = useQueryClient();
  const [error, setError] = useState<string | null>(null);

  const invalidate = async () => {
    await queryClient.invalidateQueries({ queryKey: CLASSROOM_QUERY_KEYS.ALL });
  };

  const fail = (err: unknown, title: string) => {
    const message = getErrorMessage(err);
    setError(message);
    toast.error(title, { description: message });
  };

  const createMutation = useMutation({
    mutationFn: async (input: CreateClassroomInput) => {
      const { data } = await apiClient.post<Classroom>('/classrooms', input);
      return data;
    },
    onSuccess: async (classroom) => {
      await invalidate();
      setError(null);
      toast.success(CLASSROOM_SUCCESS_MESSAGES.CREATED, { description: `Join code: ${classroom.code}` });
    },
    onError: (err) => fail(err, 'Could not create the class'),
  });

  const joinMutation = useMutation({
    mutationFn: async (input: JoinClassroomInput) => {
      const { data } = await apiClient.post<Classroom>('/classrooms/join', { code: input.code.toUpperCase() });
      return data;
    },
    onSuccess: async (classroom) => {
      await invalidate();
      setError(null);
      toast.success(CLASSROOM_SUCCESS_MESSAGES.JOINED, { description: classroom.name });
    },
    onError: (err) => fail(err, 'Could not join the class'),
  });

  const leaveMutation = useMutation({
    mutationFn: (classroomId: string) => apiClient.post(`/classrooms/${classroomId}/leave`),
    onSuccess: async () => {
      await invalidate();
      setError(null);
      toast.success(CLASSROOM_SUCCESS_MESSAGES.LEFT);
    },
    onError: (err) => fail(err, 'Could not leave the class'),
  });

  const removeStudentMutation = useMutation({
    mutationFn: ({ classroomId, studentId }: { classroomId: string; studentId: string }) => (
      apiClient.delete(`/classrooms/${classroomId}/members/${studentId}`)
    ),
    onSuccess: async (_, variables) => {
      await queryClient.invalidateQueries({ queryKey: CLASSROOM_QUERY_KEYS.STUDENTS(variables.classroomId) });
      await invalidate();
      setError(null);
      toast.success(CLASSROOM_SUCCESS_MESSAGES.STUDENT_REMOVED);
    },
    onError: (err) => fail(err, 'Could not remove the student'),
  });

  const deleteMutation = useMutation({
    mutationFn: (classroomId: string) => apiClient.delete(`/classrooms/${classroomId}`),
    onSuccess: async () => {
      await invalidate();
      setError(null);
      toast.success('Class deleted');
    },
    onError: (err) => fail(err, 'Could not delete the class'),
  });

  return {
    createClassroom: createMutation.mutate,
    isCreating: createMutation.isPending,
    joinClassroom: joinMutation.mutate,
    isJoining: joinMutation.isPending,
    leaveClassroom: leaveMutation.mutate,
    isLeaving: leaveMutation.isPending,
    removeStudent: removeStudentMutation.mutate,
    isRemovingStudent: removeStudentMutation.isPending,
    deleteClassroom: deleteMutation.mutate,
    isDeleting: deleteMutation.isPending,
    error,
    clearError: () => setError(null),
  };
};
