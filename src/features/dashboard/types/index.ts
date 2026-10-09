/**
 * Dashboard Feature Types
 * Layout props and re-exported student stats shapes
 */

import type { ReactNode } from 'react';

export interface DashboardLayoutProps {
  children: ReactNode;
}

// Re-export student stats types
export type { StudentStats, QuizAttempt, ScoreDataPoint } from './studentStats';
