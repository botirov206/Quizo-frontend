/**
 * TeacherStats Component
 * Displays teacher-specific statistics in card format
 */

import type { FC } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { BookOpen, Users, GraduationCap, TrendingUp } from 'lucide-react';
import type { TeacherStats as TeacherStatsType } from '../hooks/useTeacherStats';

interface TeacherStatsProps {
  stats: TeacherStatsType;
}

interface StatItemProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: string;
  trendUp?: boolean;
}

const StatItem: FC<StatItemProps> = ({ title, value, icon, trend, trendUp }) => (
  <Card>
    <CardContent className="p-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">{title}</p>
          <p className="text-2xl font-bold">{value}</p>
          {trend && (
            <p className={`text-xs ${trendUp ? 'text-green-600' : 'text-muted-foreground'}`}>
              {trend}
            </p>
          )}
        </div>
        <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
          {icon}
        </div>
      </div>
    </CardContent>
  </Card>
);

export const TeacherStats: FC<TeacherStatsProps> = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatItem
        title="Total Quizzes"
        value={stats.totalQuizzes}
        icon={<BookOpen className="h-6 w-6 text-primary" />}
        trend={`+${stats.quizzesThisWeek} this week`}
        trendUp={stats.quizzesThisWeek > 0}
      />
      <StatItem
        title="Total Students"
        value={stats.totalStudents}
        icon={<Users className="h-6 w-6 text-primary" />}
        trend={`+${stats.studentsThisWeek} this week`}
        trendUp={stats.studentsThisWeek > 0}
      />
      <StatItem
        title="Classrooms"
        value={stats.totalClassrooms}
        icon={<GraduationCap className="h-6 w-6 text-primary" />}
      />
      <StatItem
        title="Average Score"
        value={`${stats.averageScore.toFixed(1)}%`}
        icon={<TrendingUp className="h-6 w-6 text-primary" />}
      />
    </div>
  );
};
