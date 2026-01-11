import { useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertCircle, Loader2, RotateCcw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useRecentActivity } from '../hooks/useRecentActivity';
import { getRelativeTime, formatScorePercentage, getPerformanceLevel } from '../utils';
import { SCORE_COLORS } from '../constants';
import { cn } from '@/lib/utils';

export const RecentActivity = () => {
  const navigate = useNavigate();
  const { data: activities, isLoading, error } = useRecentActivity();

  const handleRetry = useCallback((quizId: string) => {
    navigate(`/quiz/${quizId}/play`);
  }, [navigate]);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Recent Activity</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Recent Activity</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center py-12 gap-2">
          <AlertCircle className="h-8 w-8 text-destructive" />
          <p className="text-sm text-muted-foreground">Failed to load recent activity</p>
        </CardContent>
      </Card>
    );
  }

  if (!activities || activities.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Recent Activity</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center py-12">
          <p className="text-sm text-muted-foreground">No recent quiz attempts</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Recent Activity</CardTitle>
        <p className="text-sm text-muted-foreground">Your last {activities.length} quiz attempts</p>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {activities.map((activity) => {
            const performanceLevel = getPerformanceLevel(activity.score);
            const scoreColor = SCORE_COLORS[performanceLevel];

            return (
              <div
                key={activity.id}
                className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
              >
                <div className="flex-1 min-w-0 mr-4">
                  <h4 className="font-medium text-sm truncate">{activity.quizTitle}</h4>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-muted-foreground">
                      {getRelativeTime(activity.completedAt)}
                    </span>
                    {activity.category && (
                      <>
                        <span className="text-xs text-muted-foreground">•</span>
                        <span className="text-xs text-muted-foreground">{activity.category}</span>
                      </>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className={cn('px-3 py-1 rounded-md border', scoreColor)}>
                    <span className="text-sm font-semibold">
                      {formatScorePercentage(activity.score)}
                    </span>
                  </div>

                  {activity.score < 70 && (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleRetry(activity.quizId)}
                      className="shrink-0"
                    >
                      <RotateCcw className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};
