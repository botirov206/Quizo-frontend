import type { ReactNode } from 'react';
import { Leaderboard } from './Leaderboard';
import type { LeaderboardEntry } from '../types/leaderboard';
import { cn } from '@/lib/utils';

interface QuizWithLeaderboardProps {
  children: ReactNode;
  leaderboardEntries: LeaderboardEntry[];
  currentUserId?: string;
  showLeaderboard?: boolean;
  leaderboardTitle?: string;
  isLeaderboardLoading?: boolean;
  categoryId?: string;
  quizId?: string;
  className?: string;
}

/**
 * QuizWithLeaderboard Layout
 * Two-column layout with quiz content on left and leaderboard on right
 * Responsive: Stacks vertically on mobile (leaderboard below quiz)
 */
export const QuizWithLeaderboard = ({
  children,
  leaderboardEntries,
  currentUserId,
  showLeaderboard = true,
  leaderboardTitle = 'Leaderboard',
  isLeaderboardLoading = false,
  categoryId,
  quizId,
  className,
}: QuizWithLeaderboardProps) => {
  if (!showLeaderboard) {
    return <>{children}</>;
  }

  return (
    <div
      className={cn(
        'flex flex-col lg:flex-row gap-6',
        className
      )}
    >
      {/* Main Quiz Content */}
      <div className="flex-1 min-w-0">
        {children}
      </div>

      {/* Leaderboard - Right side on desktop, below on mobile */}
      <div className="w-full lg:w-80 flex-shrink-0">
        <div className="lg:sticky lg:top-6">
          <Leaderboard
            entries={leaderboardEntries}
            currentUserId={currentUserId}
            title={leaderboardTitle}
            isLoading={isLeaderboardLoading}
            categoryId={categoryId}
            quizId={quizId}
          />
        </div>
      </div>
    </div>
  );
};
