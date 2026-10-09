import type { FC } from 'react';
import { Link } from 'react-router-dom';
import { DashboardLayout } from './DashboardLayout';
import { useAuth } from '@/context/AuthContext';
import { JoinKeyForm } from '@/features/play';
import { useStudentStats } from '../hooks/useAccountStats';
import { Button } from '@/components/ui/button';

export const StudentDashboard: FC = () => {
  const { user } = useAuth();
  const stats = useStudentStats();
  if (!user) return null;

  const summary = stats.data;
  const hasPlayed = (summary?.quizzesCompleted ?? 0) > 0;

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-xl space-y-8">
        <div>
          <h1 className="text-3xl font-bold">Hi, {user.firstName}</h1>
          <p className="text-muted-foreground">Type the key from the board to join.</p>
        </div>
        <JoinKeyForm buttonLabel="Play" />
        <div className="flex gap-3">
          <Button variant="outline" asChild><Link to="/explore">Explore</Link></Button>
          <Button variant="outline" asChild><Link to="/classrooms">Classes</Link></Button>
        </div>
        {hasPlayed && summary && (
          <p className="text-sm text-muted-foreground">
            {summary.quizzesCompleted} played · {Math.round(summary.averageScore)}% average · {summary.currentStreak} day streak.{' '}
            <Link to="/history" className="text-primary underline">See history</Link>
          </p>
        )}
      </div>
    </DashboardLayout>
  );
};
