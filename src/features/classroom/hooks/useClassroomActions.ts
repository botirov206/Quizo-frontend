/**
 * useClassroomActions Hook
 * Handles classroom mutations: create, join, leave, remove student
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { toast } from 'sonner';
import { useAuth } from '@/context/AuthContext';
import {
  CODE_ALLOWED_CHARS,
  CODE_LENGTH,
  CLASSROOM_QUERY_KEYS,
  MOCK_DELAY,
  CLASSROOM_ERROR_MESSAGES,
  CLASSROOM_SUCCESS_MESSAGES,
} from '../constants';
import { MOCK_CLASSROOMS } from '../data/mock-classrooms';
import type { Classroom, CreateClassroomInput, JoinClassroomInput } from '../types';

/**
 * Generate a random 6-character classroom code
 */
export const generateClassroomCode = (): string => {
  let code = '';
  for (let i = 0; i < CODE_LENGTH; i++) {
    const randomIndex = Math.floor(Math.random() * CODE_ALLOWED_CHARS.length);
    code += CODE_ALLOWED_CHARS[randomIndex];
  }
  return code;
};

/**
 * Create a new classroom (Teacher only)
 */
const createClassroom = async (
  input: CreateClassroomInput,
  teacherId: string,
  teacherName: string
): Promise<Classroom> => {
  await new Promise((resolve) => setTimeout(resolve, MOCK_DELAY));

  // TODO: Replace with real API call
  // const response = await api.post('/classrooms', input);
  // return response.data;

  const newClassroom: Classroom = {
    id: `class-${Date.now()}`,
    name: input.name,
    code: generateClassroomCode(),
    teacherId,
    teacherName,
    studentIds: [],
    quizIds: [],
    createdAt: new Date().toISOString(),
  };

  // Add to mock data (in real app, this would be handled by backend)
  MOCK_CLASSROOMS.push(newClassroom);

  return newClassroom;
};

/**
 * Join a classroom via code (Student only)
 */
const joinClassroom = async (
  input: JoinClassroomInput,
  studentId: string
): Promise<Classroom> => {
  await new Promise((resolve) => setTimeout(resolve, MOCK_DELAY));

  // TODO: Replace with real API call
  // const response = await api.post('/classrooms/join', input);
  // return response.data;

  const classroom = MOCK_CLASSROOMS.find(
    (c) => c.code.toUpperCase() === input.code.toUpperCase()
  );

  if (!classroom) {
    throw new Error(CLASSROOM_ERROR_MESSAGES.INVALID_CODE);
  }

  if (classroom.studentIds.includes(studentId)) {
    throw new Error(CLASSROOM_ERROR_MESSAGES.ALREADY_JOINED);
  }

  // Add student to classroom
  classroom.studentIds.push(studentId);

  return classroom;
};

/**
 * Leave a classroom (Student only)
 */
const leaveClassroom = async (classroomId: string, studentId: string): Promise<void> => {
  await new Promise((resolve) => setTimeout(resolve, MOCK_DELAY));

  // TODO: Replace with real API call
  const classroom = MOCK_CLASSROOMS.find((c) => c.id === classroomId);
  if (classroom) {
    classroom.studentIds = classroom.studentIds.filter((id) => id !== studentId);
  }
};

/**
 * Remove a student from classroom (Teacher only)
 */
const removeStudent = async (classroomId: string, studentId: string): Promise<void> => {
  await new Promise((resolve) => setTimeout(resolve, MOCK_DELAY));

  // TODO: Replace with real API call
  const classroom = MOCK_CLASSROOMS.find((c) => c.id === classroomId);
  if (classroom) {
    classroom.studentIds = classroom.studentIds.filter((id) => id !== studentId);
  }
};

/**
 * Delete a classroom (Teacher only)
 */
const deleteClassroom = async (classroomId: string): Promise<void> => {
  await new Promise((resolve) => setTimeout(resolve, MOCK_DELAY));

  // TODO: Replace with real API call
  const index = MOCK_CLASSROOMS.findIndex((c) => c.id === classroomId);
  if (index !== -1) {
    MOCK_CLASSROOMS.splice(index, 1);
  }
};

export const useClassroomActions = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [error, setError] = useState<string | null>(null);

  const createMutation = useMutation({
    mutationFn: (input: CreateClassroomInput) =>
      createClassroom(input, user!.id, user!.name),
    onSuccess: (classroom) => {
      queryClient.invalidateQueries({ queryKey: CLASSROOM_QUERY_KEYS.ALL });
      setError(null);
      toast.success(CLASSROOM_SUCCESS_MESSAGES.CREATED, {
        description: `Join code: ${classroom.code}`,
      });
    },
    onError: (err: Error) => {
      setError(err.message);
      toast.error('Failed to create classroom', { description: err.message });
    },
  });

  const joinMutation = useMutation({
    mutationFn: (input: JoinClassroomInput) => joinClassroom(input, user!.id),
    onSuccess: (classroom) => {
      queryClient.invalidateQueries({ queryKey: CLASSROOM_QUERY_KEYS.ALL });
      setError(null);
      toast.success(CLASSROOM_SUCCESS_MESSAGES.JOINED, {
        description: `Welcome to ${classroom.name}!`,
      });
    },
    onError: (err: Error) => {
      setError(err.message);
      toast.error('Failed to join classroom', { description: err.message });
    },
  });

  const leaveMutation = useMutation({
    mutationFn: (classroomId: string) => leaveClassroom(classroomId, user!.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CLASSROOM_QUERY_KEYS.ALL });
      setError(null);
      toast.success(CLASSROOM_SUCCESS_MESSAGES.LEFT);
    },
    onError: (err: Error) => {
      setError(err.message);
      toast.error('Failed to leave classroom', { description: err.message });
    },
  });

  const removeStudentMutation = useMutation({
    mutationFn: ({ classroomId, studentId }: { classroomId: string; studentId: string }) =>
      removeStudent(classroomId, studentId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: CLASSROOM_QUERY_KEYS.STUDENTS(variables.classroomId),
      });
      queryClient.invalidateQueries({ queryKey: CLASSROOM_QUERY_KEYS.ALL });
      setError(null);
      toast.success(CLASSROOM_SUCCESS_MESSAGES.STUDENT_REMOVED);
    },
    onError: (err: Error) => {
      setError(err.message);
      toast.error('Failed to remove student', { description: err.message });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (classroomId: string) => deleteClassroom(classroomId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CLASSROOM_QUERY_KEYS.ALL });
      setError(null);
      toast.success('Classroom deleted');
    },
    onError: (err: Error) => {
      setError(err.message);
      toast.error('Failed to delete classroom', { description: err.message });
    },
  });

  return {
    // Create
    createClassroom: createMutation.mutate,
    isCreating: createMutation.isPending,
    // Join
    joinClassroom: joinMutation.mutate,
    isJoining: joinMutation.isPending,
    // Leave
    leaveClassroom: leaveMutation.mutate,
    isLeaving: leaveMutation.isPending,
    // Remove Student
    removeStudent: removeStudentMutation.mutate,
    isRemovingStudent: removeStudentMutation.isPending,
    // Delete
    deleteClassroom: deleteMutation.mutate,
    isDeleting: deleteMutation.isPending,
    // Error
    error,
    clearError: () => setError(null),
  };
};
