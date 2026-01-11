/**
 * RecentStudentResults Component
 * Shows recent quiz results from students
 */

import type { FC } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { SCORE_THRESHOLDS } from '../constants';
import type { StudentResult } from '../hooks/useTeacherStats';

interface RecentStudentResultsProps {
  results: StudentResult[];
}

const getScoreColor = (percentage: number): string => {
  if (percentage >= SCORE_THRESHOLDS.EXCELLENT) return 'text-green-600 bg-green-50';
  if (percentage >= SCORE_THRESHOLDS.GOOD) return 'text-blue-600 bg-blue-50';
  if (percentage >= SCORE_THRESHOLDS.AVERAGE) return 'text-yellow-600 bg-yellow-50';
  return 'text-red-600 bg-red-50';
};

const getInitials = (name: string): string => {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

const formatTimeAgo = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  return `${diffDays}d ago`;
};

export const RecentStudentResults: FC<RecentStudentResultsProps> = ({ results }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Recent Student Results</CardTitle>
      </CardHeader>
      <CardContent>
        {results.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <p>No student results yet.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {results.slice(0, 5).map((result, index) => {
              const percentage = Math.round((result.score / result.totalQuestions) * 100);
              return (
                <div
                  key={`${result.studentId}-${result.quizId}-${index}`}
                  className="flex items-center gap-4"
                >
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="text-sm bg-primary/10">
                      {getInitials(result.studentName)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{result.studentName}</p>
                    <p className="text-sm text-muted-foreground truncate">
                      {result.quizTitle}
                    </p>
                  </div>
                  <div className="text-right">
                    <div
                      className={`inline-flex items-center px-2 py-1 rounded-md text-sm font-medium ${getScoreColor(percentage)}`}
                    >
                      {result.score}/{result.totalQuestions}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {formatTimeAgo(result.completedAt)}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
