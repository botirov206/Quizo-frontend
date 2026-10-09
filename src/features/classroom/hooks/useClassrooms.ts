import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/context/AuthContext';
import { CLASSROOM_QUERY_KEYS } from '../constants';
import { fetchClassrooms, fetchMembers } from '../api';

export const useClassrooms = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: [...CLASSROOM_QUERY_KEYS.ALL, user?.id],
    queryFn: async () => {
      const classrooms = await fetchClassrooms();
      const totalStudents = classrooms.reduce((sum, classroom) => sum + classroom.studentCount, 0);
      return { classrooms, totalStudents };
    },
    enabled: !!user,
  });
};

export const useClassroomStudents = (classroomId: string | undefined) => {
  return useQuery({
    queryKey: CLASSROOM_QUERY_KEYS.STUDENTS(classroomId || ''),
    queryFn: () => fetchMembers(classroomId!),
    enabled: !!classroomId,
  });
};
