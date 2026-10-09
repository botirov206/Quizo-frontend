import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type {
  CategoryItem,
  CategoryListResponse,
  CreateQuizBody,
  QuizListResponse,
  QuizMutation,
  QuizPreview,
} from '@/api/types';
import { isNotFoundError } from '@/lib/api-error';
import { apiClient } from '@/lib/axios';

const DEFAULT_PAGE_SIZE = 20;

export const quizQueryKeys = {
  all: ['quizzes'] as const,
  categories: ['categories'] as const,
  list: (filter: NormalizedQuizListFilter) => ['quizzes', 'list', filter] as const,
  preview: (quizKey: string) => ['quizzes', 'preview', quizKey] as const,
};

export interface QuizListFilter {
  mine?: boolean;
  categoryId?: string;
  search?: string;
  limit?: number;
}

interface NormalizedQuizListFilter {
  mine: boolean;
  categoryId: string;
  search: string;
  limit: number;
}

function normalizeFilter(filter: QuizListFilter): NormalizedQuizListFilter {
  return {
    mine: filter.mine === true,
    categoryId: filter.categoryId ?? '',
    search: filter.search?.trim() ?? '',
    limit: filter.limit ?? DEFAULT_PAGE_SIZE,
  };
}

function listParams(filter: NormalizedQuizListFilter): Record<string, string> {
  const params: Record<string, string> = { limit: String(filter.limit) };
  if (filter.mine) params.mine = 'true';
  if (filter.categoryId) params.categoryId = filter.categoryId;
  if (filter.search) params.search = filter.search;
  return params;
}

export async function fetchCategories(): Promise<CategoryItem[]> {
  const { data } = await apiClient.get<CategoryListResponse>('/categories');
  return data.items;
}

export function useCategories() {
  return useQuery({
    queryKey: quizQueryKeys.categories,
    queryFn: fetchCategories,
    staleTime: 5 * 60 * 1000,
  });
}

export async function fetchQuizList(filter: QuizListFilter): Promise<QuizListResponse> {
  const normalized = normalizeFilter(filter);
  const { data } = await apiClient.get<QuizListResponse>('/quizzes', {
    params: listParams(normalized),
  });
  return data;
}

// ponytail: first page only; follow nextCursor if a screen needs the rest
export function useQuizList(filter: QuizListFilter) {
  const normalized = normalizeFilter(filter);
  return useQuery({
    queryKey: quizQueryKeys.list(normalized),
    queryFn: () => fetchQuizList(normalized),
    placeholderData: keepPreviousData,
  });
}

async function createQuiz(body: CreateQuizBody): Promise<QuizMutation> {
  const { data } = await apiClient.post<QuizMutation>('/quizzes', body);
  return data;
}

export function useCreateQuiz() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createQuiz,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: quizQueryKeys.all });
    },
  });
}

async function deleteQuiz(id: string): Promise<void> {
  await apiClient.delete(`/quizzes/${id}`);
}

export function useDeleteQuiz() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteQuiz,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: quizQueryKeys.all });
    },
  });
}

export function useQuizPreview(quizKey: string) {
  const key = quizKey.trim().toUpperCase();
  return useQuery({
    queryKey: quizQueryKeys.preview(key),
    queryFn: async () => {
      const { data } = await apiClient.get<QuizPreview>(`/quizzes/by-key/${key}`);
      return data;
    },
    enabled: key.length === 6,
    retry: (failureCount, error) => !isNotFoundError(error) && failureCount < 2,
  });
}
