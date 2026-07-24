import { keepPreviousData, useQuery } from '@tanstack/react-query';
import {
  getAdminQuiz,
  getAdminQuizzes,
  type AdminQuizListParams,
} from '@/features/quizzes/api/admin-quizzes-api';

export const adminQuizKeys = {
  all: ['admin-quizzes'] as const,
  lists: () => [...adminQuizKeys.all, 'list'] as const,
  list: (params: AdminQuizListParams) =>
    [...adminQuizKeys.lists(), params] as const,
  detail: (quizId: string) => [...adminQuizKeys.all, 'detail', quizId] as const,
};

export function useAdminQuizzes(params: AdminQuizListParams) {
  return useQuery({
    placeholderData: keepPreviousData,
    queryFn: () => getAdminQuizzes(params),
    queryKey: adminQuizKeys.list(params),
  });
}

export function useAdminQuiz(quizId: string | undefined) {
  return useQuery({
    enabled: Boolean(quizId),
    queryFn: () => getAdminQuiz(quizId as string),
    queryKey: adminQuizKeys.detail(quizId ?? ''),
  });
}
