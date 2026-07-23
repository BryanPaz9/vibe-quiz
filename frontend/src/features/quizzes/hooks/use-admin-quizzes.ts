import { keepPreviousData, useQuery } from '@tanstack/react-query';
import {
  getAdminQuizzes,
  type AdminQuizListParams,
} from '@/features/quizzes/api/admin-quizzes-api';

export const adminQuizKeys = {
  all: ['admin-quizzes'] as const,
  list: (params: AdminQuizListParams) =>
    [...adminQuizKeys.all, 'list', params] as const,
};

export function useAdminQuizzes(params: AdminQuizListParams) {
  return useQuery({
    placeholderData: keepPreviousData,
    queryFn: () => getAdminQuizzes(params),
    queryKey: adminQuizKeys.list(params),
  });
}
