import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Trophy, Medal, Clock, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { LeaderboardProps } from '../types/leaderboard';
import { getInitials, formatTime } from '../types/leaderboard';

/**
 * Leaderboard Component
 * Displays ranked list of quiz participants with name, points, and time
 * Responsive design - stacks below quiz on mobile
 */
export const Leaderboard = ({
  entries,
  currentUserId,
  title = 'Leaderboard',
  showRank = true,
  maxEntries = 10,
  isLoading = false,
}: LeaderboardProps) => {
  // Sort entries by points (desc), then by time (asc)
  const sortedEntries = [...entries]
    .sort((a, b) => {
      if (b.points !== a.points) return b.points - a.points;
      return a.timeSpent - b.timeSpent;
    })
    .slice(0, maxEntries)
    .map((entry, index) => ({ ...entry, rank: index + 1 }));

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="h-4 w-4 text-yellow-500" />;
      case 2:
        return <Medal className="h-4 w-4 text-gray-400" />;
      case 3:
        return <Medal className="h-4 w-4 text-amber-600" />;
      default:
        return <span className="text-sm font-medium text-muted-foreground w-4 text-center">{rank}</span>;
    }
  };

  const getRankBgColor = (rank: number) => {
    switch (rank) {
      case 1:
        return 'bg-yellow-50 dark:bg-yellow-950/20 border-yellow-200 dark:border-yellow-800';
      case 2:
        return 'bg-gray-50 dark:bg-gray-950/20 border-gray-200 dark:border-gray-800';
      case 3:
        return 'bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800';
      default:
        return 'bg-background border-border';
    }
  };

  if (isLoading) {
    return (
      <Card className="h-fit">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Trophy className="h-5 w-5 text-primary" />
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex items-center gap-3 p-2 animate-pulse">
              <div className="h-8 w-8 rounded-full bg-muted" />
              <div className="flex-1 space-y-1">
                <div className="h-4 bg-muted rounded w-24" />
                <div className="h-3 bg-muted rounded w-16" />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  if (entries.length === 0) {
    return (
      <Card className="h-fit">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Trophy className="h-5 w-5 text-primary" />
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground text-center py-4">
            No entries yet. Be the first to complete the quiz!
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-fit">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Trophy className="h-5 w-5 text-primary" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {sortedEntries.map((entry) => {
          const isCurrentUser = entry.id === currentUserId;
          
          return (
            <div
              key={entry.id}
              className={cn(
                'flex items-center gap-3 p-2 rounded-lg border transition-colors',
                getRankBgColor(entry.rank!),
                isCurrentUser && 'ring-2 ring-primary ring-offset-1'
              )}
            >
              {/* Rank */}
              {showRank && (
                <div className="flex-shrink-0 w-6 flex justify-center">
                  {getRankIcon(entry.rank!)}
                </div>
              )}

              {/* Avatar with Initials */}
              <Avatar className="h-8 w-8 flex-shrink-0">
                <AvatarFallback className="text-xs font-medium bg-primary/10 text-primary">
                  {getInitials(entry.firstName, entry.lastName)}
                </AvatarFallback>
              </Avatar>

              {/* Name and Stats */}
              <div className="flex-1 min-w-0">
                <p className={cn(
                  'text-sm font-medium truncate',
                  isCurrentUser && 'text-primary'
                )}>
                  {entry.name}
                  {isCurrentUser && <span className="text-xs ml-1">(You)</span>}
                </p>
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Zap className="h-3 w-3" />
                    {entry.points} pts
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {formatTime(entry.timeSpent)}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
};
