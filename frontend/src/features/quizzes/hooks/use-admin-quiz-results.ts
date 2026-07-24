import { keepPreviousData, useQuery } from '@tanstack/react-query';
import {
  getAdminQuizRanking,
  getAdminQuizResults,
  type AdminQuizResultsParams,
} from '@/features/quizzes/api/admin-quiz-results-api';

export const adminQuizResultKeys = {
  all: ['admin-quiz-results'] as const,
  results: (quizId: string, params: AdminQuizResultsParams) =>
    [...adminQuizResultKeys.all, quizId, 'results', params] as const,
  ranking: (quizId: string) =>
    [...adminQuizResultKeys.all, quizId, 'ranking'] as const,
};

export function useAdminQuizResults(
  quizId: string | undefined,
  params: AdminQuizResultsParams,
) {
  return useQuery({
    enabled: Boolean(quizId),
    placeholderData: keepPreviousData,
    queryFn: () => getAdminQuizResults(quizId as string, params),
    queryKey: adminQuizResultKeys.results(quizId ?? '', params),
  });
}

export function useAdminQuizRanking(quizId: string | undefined) {
  return useQuery({
    enabled: Boolean(quizId),
    queryFn: () => getAdminQuizRanking(quizId as string),
    queryKey: adminQuizResultKeys.ranking(quizId ?? ''),
  });
}
