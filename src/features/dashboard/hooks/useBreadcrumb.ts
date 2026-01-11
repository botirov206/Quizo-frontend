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
};

export const useBreadcrumb = (): BreadcrumbItem[] => {
  const location = useLocation();

  return useMemo(() => {
    // Check for exact match first
    if (breadcrumbMap[location.pathname]) {
      return breadcrumbMap[location.pathname];
    }

    // Check for quiz play route pattern (/quiz/:id/play)
    const quizPlayMatch = location.pathname.match(/^\/quiz\/[^/]+\/play$/);
    if (quizPlayMatch) {
      return [
        { label: 'Dashboard', href: '/dashboard' },
        { label: 'Quizzes', href: '/quizzes' },
        { label: 'Playing Quiz', current: true },
      ];
    }

    // Check for OpenTDB play route (/play/opentdb)
    if (location.pathname.startsWith('/play/opentdb')) {
      return [
        { label: 'Dashboard', href: '/dashboard' },
        { label: 'Explore', href: '/explore' },
        { label: 'Playing Quiz', current: true },
      ];
    }

    // Default fallback
    return [
      { label: 'Dashboard', href: '/dashboard' },
      { label: 'Current Page', current: true },
    ];
  }, [location.pathname]);
};
