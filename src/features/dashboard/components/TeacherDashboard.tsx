/**
 * TeacherDashboard Component
 * Main dashboard view for teachers
 * 
 * Features:
 * - Total quizzes created count
 * - Total students enrolled count
 * - Average class score
 * - Recent activity feed
 * - Quick actions: Create Quiz, Manage Classes, Copy Class Code
 */

import type { FC } from 'react';
import { DashboardLayout } from './DashboardLayout';
import { useAuth } from '@/context/AuthContext';
import { useTeacherStats } from '../hooks/useTeacherStats';
import { TeacherStats } from './TeacherStats';
import { MyQuizzesList } from './MyQuizzesList';
import { RecentStudentResults } from './RecentStudentResults';
import { TeacherQuickActions } from './TeacherQuickActions';
import { Loader2 } from 'lucide-react';

export const TeacherDashboard: FC = () => {
  const { user } = useAuth();
  const { data, isLoading } = useTeacherStats();

  if (!user) return null;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Welcome Header */}
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Welcome back, {user.name}!</h1>
          <p className="text-sm text-muted-foreground">
            Manage your quizzes and track student progress
          </p>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : data ? (
          <TeacherStats stats={data.stats} />
        ) : (
          <p className="text-sm text-muted-foreground">No stats available</p>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <MyQuizzesList />
            {data && <RecentStudentResults results={data.recentResults} />}
          </div>
          <div>
            <TeacherQuickActions />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};
