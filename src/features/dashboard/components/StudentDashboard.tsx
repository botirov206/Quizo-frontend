/**
 * StudentDashboard Component
 * Main dashboard view for students
 * 
 * Features:
 * - Quizzes completed count
 * - Average score
 * - Current streak
 * - Time spent learning
 * - Score chart
 * - Recent activity
 * - Quick actions
 */

import type { FC } from 'react';
import { DashboardLayout } from './DashboardLayout';
import { useAuth } from '@/context/AuthContext';
import { useStudentStats } from '../hooks/useStudentStats';
import { StatCard } from './StatCard';
import { ScoreChart } from './ScoreChart';
import { RecentActivity } from './RecentActivity';
import { QuickActions } from './QuickActions';
import { formatTimeSpent, formatScorePercentage } from '../utils';
import { Loader2 } from 'lucide-react';

export const StudentDashboard: FC = () => {
  const { user } = useAuth();
  const { data: stats, isLoading } = useStudentStats();

  if (!user) return null;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Welcome Header */}
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Welcome back, {user.name}!</h1>
          <p className="text-sm text-muted-foreground">Here's your learning progress at a glance</p>
        </div>

        {/* Stats Cards */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : stats ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard
                title="Quizzes Completed"
                value={stats.quizzesCompleted}
                icon="completed"
                trend={{ value: '+3 this week', direction: 'up' }}
              />
              <StatCard
                title="Average Score"
                value={formatScorePercentage(stats.averageScore)}
                icon="average"
                trend={{ value: '+2.5% from last week', direction: 'up' }}
              />
              <StatCard
                title="Current Streak"
                value={`${stats.currentStreak} days`}
                icon="streak"
              />
              <StatCard
                title="Time Spent Learning"
                value={formatTimeSpent(stats.totalTimeSpent)}
                icon="time"
              />
            </div>

            {/* Charts and Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <ScoreChart />
                <RecentActivity />
              </div>
              <div>
                <QuickActions />
              </div>
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <p className="text-sm text-muted-foreground">No data available</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};
