import type { ReactNode } from 'react';

export interface DashboardLayoutProps {
  children: ReactNode;
}

// Re-export student stats types
export type { StudentStats, QuizAttempt, ScoreDataPoint } from './studentStats';
