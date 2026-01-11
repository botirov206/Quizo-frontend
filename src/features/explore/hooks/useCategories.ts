/**
 * Hook for fetching OpenTDB categories
 */

import { useQuery } from '@tanstack/react-query';
import { fetchOpenTDBCategories, type OpenTDBCategory } from '@/adapters';
import { EXPLORE_QUERY_KEYS, CATEGORY_ICONS, CATEGORY_COLORS } from '../constants';
import type { Category } from '../types';

/**
 * Transforms OpenTDB category to our Category type with icons
 */
const transformCategory = (category: OpenTDBCategory): Category => ({
  id: category.id,
  name: category.name
    .replace(/^Entertainment:\s*/i, '')
    .replace(/^Science:\s*/i, ''),
  icon: CATEGORY_ICONS[category.id] || '❓',
});

/**
 * Hook to fetch and cache OpenTDB categories
 */
export const useCategories = () => {
  const query = useQuery({
    queryKey: EXPLORE_QUERY_KEYS.CATEGORIES,
    queryFn: async () => {
      const result = await fetchOpenTDBCategories();
      if (!result.success || !result.data) {
        throw new Error(result.error || 'Failed to fetch categories');
      }
      return result.data.map(transformCategory);
    },
    staleTime: 60 * 60 * 1000, // 1 hour - categories don't change often
    retry: 3,
  });

  return {
    ...query,
    categories: query.data ?? [],
    getCategoryColor: (categoryId: number) => 
      CATEGORY_COLORS[categoryId] || 'from-gray-500 to-gray-600',
  };
};
