/**
 * useClassrooms Hook
 * Fetches classrooms based on user role
 */

import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/context/AuthContext';
import { CLASSROOM_QUERY_KEYS, MOCK_DELAY } from '../constants';
import {
  MOCK_CLASSROOMS,
  getClassroomsForTeacher,
  getClassroomsForStudent,
  getStudentsForClassroom,
} from '../data/mock-classrooms';
import type { Classroom, ClassroomStudent } from '../types';

interface ClassroomsData {
  classrooms: Classroom[];
  totalStudents: number;
}

/**
 * Fetch classrooms for the current user
 */
const fetchClassrooms = async (
  userId: string,
  role: 'teacher' | 'student' | 'admin'
): Promise<ClassroomsData> => {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, MOCK_DELAY));

  // TODO: Replace with real API call
  // const response = await api.get('/classrooms');
  // return response.data;

  const classrooms =
    role === 'teacher'
      ? getClassroomsForTeacher(userId)
      : getClassroomsForStudent(userId);

  const totalStudents = classrooms.reduce((sum, c) => sum + c.studentIds.length, 0);

  return { classrooms, totalStudents };
};

export const useClassrooms = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: [...CLASSROOM_QUERY_KEYS.ALL, user?.id],
    queryFn: () => {
      // Map 'user' role to 'student' for classroom fetching
      const role = user!.role === 'user' ? 'student' : user!.role;
      return fetchClassrooms(user!.id, role as 'student' | 'teacher' | 'admin');
    },
    enabled: !!user,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

/**
 * Fetch a single classroom by ID
 */
const fetchClassroomById = async (classroomId: string): Promise<Classroom | null> => {
  await new Promise((resolve) => setTimeout(resolve, MOCK_DELAY));
  
  // TODO: Replace with real API call
  return MOCK_CLASSROOMS.find((c) => c.id === classroomId) || null;
};

export const useClassroomById = (classroomId: string | undefined) => {
  return useQuery({
    queryKey: CLASSROOM_QUERY_KEYS.BY_ID(classroomId || ''),
    queryFn: () => fetchClassroomById(classroomId!),
    enabled: !!classroomId,
    staleTime: 5 * 60 * 1000,
  });
};

/**
 * Fetch students for a classroom
 */
const fetchClassroomStudents = async (classroomId: string): Promise<ClassroomStudent[]> => {
  await new Promise((resolve) => setTimeout(resolve, MOCK_DELAY));
  
  // TODO: Replace with real API call
  return getStudentsForClassroom(classroomId);
};

export const useClassroomStudents = (classroomId: string | undefined) => {
  return useQuery({
    queryKey: CLASSROOM_QUERY_KEYS.STUDENTS(classroomId || ''),
    queryFn: () => fetchClassroomStudents(classroomId!),
    enabled: !!classroomId,
    staleTime: 5 * 60 * 1000,
  });
};
