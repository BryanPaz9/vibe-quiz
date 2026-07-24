import { apiRequest } from '@/shared/api';
import type {
  AdminQuizResultsResponse,
  RankingResponse,
} from '@/shared/types/api';

export interface AdminQuizResultsParams {
  page: number;
  pageSize: number;
}

export function getAdminQuizResults(
  quizId: string,
  { page, pageSize }: AdminQuizResultsParams,
): Promise<AdminQuizResultsResponse> {
  const query = new URLSearchParams({
    page: String(page),
    pageSize: String(pageSize),
  });
  return apiRequest<AdminQuizResultsResponse>(
    `/admin/quizzes/${quizId}/results?${query.toString()}`,
    { authentication: { kind: 'admin' } },
  );
}

export function getAdminQuizRanking(quizId: string): Promise<RankingResponse> {
  return apiRequest<RankingResponse>(`/admin/quizzes/${quizId}/ranking`, {
    authentication: { kind: 'admin' },
  });
}
