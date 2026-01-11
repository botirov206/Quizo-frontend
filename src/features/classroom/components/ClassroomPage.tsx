/**
 * ClassroomPage Component
 * Main routing component for classroom feature
 * Routes to Teacher or Student view based on user role
 */

import type { FC } from 'react';
import { useAuth } from '@/context/AuthContext';
import { DashboardLayout } from '@/features/dashboard';
import { TeacherClassroom } from './TeacherClassroom';
import { StudentClassroom } from './StudentClassroom';

export const ClassroomPage: FC = () => {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <DashboardLayout>
      {user.role === 'teacher' ? <TeacherClassroom /> : <StudentClassroom />}
    </DashboardLayout>
  );
};
