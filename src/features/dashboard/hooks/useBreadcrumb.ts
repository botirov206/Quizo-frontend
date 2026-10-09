/**
 * Breadcrumb Hook
 * Maps the current path to dashboard breadcrumb items
 */

import { useLocation } from 'react-router-dom';
import { useMemo } from 'react';

export interface BreadcrumbItem {
  label: string;
  href?: string;
  current?: boolean;
}

const breadcrumbMap: Record<string, BreadcrumbItem[]> = {
  '/dashboard': [
    { label: 'Dashboard', current: true },
  ],
  '/quizzes': [
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'Quizzes', current: true },
  ],
  '/explore': [
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'Explore', current: true },
  ],
  '/classrooms': [
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'Classrooms', current: true },
  ],
  '/quiz/create': [
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'Create Quiz', current: true },
  ],
  '/history': [
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'History', current: true },
  ],
  '/explore/configure': [
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'Explore', href: '/explore' },
    { label: 'Practice', current: true },
  ],
};

/** Returns breadcrumb items for the current dashboard route */
export const useBreadcrumb = (): BreadcrumbItem[] => {
  const location = useLocation();

  return useMemo(() => {
    // Check for exact match first
    if (breadcrumbMap[location.pathname]) {
      return breadcrumbMap[location.pathname];
    }

    return [
      { label: 'Dashboard', href: '/dashboard' },
      { label: 'Page', current: true },
    ];
  }, [location.pathname]);
};
