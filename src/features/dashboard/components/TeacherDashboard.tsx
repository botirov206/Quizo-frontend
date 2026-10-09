import type { FC } from 'react';
import { Link } from 'react-router-dom';
import { DashboardLayout } from './DashboardLayout';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { useTeacherStats } from '../hooks/useAccountStats';
import { MyQuizzesList } from './MyQuizzesList';
import { RecentStudentResults } from './RecentStudentResults';

export const TeacherDashboard: FC = () => {
  const { user } = useAuth();
  const stats = useTeacherStats();
  if (!user) return null;
  const data = stats.data;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="text-3xl font-bold">Hi, {user.firstName}</h1>
            <p className="text-muted-foreground">Create a quiz, then share its key.</p>
          </div>
          <Button asChild><Link to="/quiz/create">Create quiz</Link></Button>
        </div>
        <MyQuizzesList />
        {data && (
          <p className="text-sm text-muted-foreground">
            {data.totalQuizzes} quizzes · {data.totalStudents} students · {data.totalClassrooms} classes · {Math.round(data.averageScore)}% average
          </p>
        )}
        {data && data.recentResults.length > 0 && (
          <RecentStudentResults results={data.recentResults} />
        )}
      </div>
    </DashboardLayout>
  );
};
