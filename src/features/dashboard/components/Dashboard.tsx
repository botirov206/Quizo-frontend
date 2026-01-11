/**
 * Dashboard Component
 * Role-based routing to Teacher or Student dashboard
 * 
 * Teachers see:
 * - Quiz management
 * - Student results
 * - Classroom management
 * 
 * Students see:
 * - Learning progress
 * - Quiz history
 * - Achievements
 */

import type { FC } from 'react';
import { useAuth } from '@/context/AuthContext';
import { TeacherDashboard } from './TeacherDashboard';
import { StudentDashboard } from './StudentDashboard';

export const Dashboard: FC = () => {
  const { user } = useAuth();

  if (!user) return null;

  // Role-based dashboard rendering
  if (user.role === 'teacher') {
    return <TeacherDashboard />;
  }

  return <StudentDashboard />;
};
