import { useCategories as useQuizCategories } from '@/features/quiz';
import { CATEGORY_ICONS } from '../constants';
import type { Category } from '../types';

export const useCategories = () => {
  const query = useQuizCategories();
  const categories: Category[] = (query.data ?? []).map((item) => ({
    id: item.id,
    name: item.name,
    externalId: item.externalId,
    counts: item.counts,
    icon: item.externalId != null ? (CATEGORY_ICONS[item.externalId] ?? '❓') : '❓',
  }));

  return { ...query, categories };
};
