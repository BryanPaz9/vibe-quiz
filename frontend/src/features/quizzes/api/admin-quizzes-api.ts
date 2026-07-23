import { apiRequest } from '@/shared/api';
import type { QuizListResponse, QuizStatus } from '@/shared/types/api';

export interface AdminQuizListParams {
  page: number;
  pageSize: number;
  status?: QuizStatus;
  search?: string;
}

export function getAdminQuizzes({
  page,
  pageSize,
  search,
  status,
}: AdminQuizListParams): Promise<QuizListResponse> {
  const query = new URLSearchParams({
    page: String(page),
    pageSize: String(pageSize),
  });

  if (status) query.set('status', status);
  if (search) query.set('search', search);

  return apiRequest<QuizListResponse>(`/admin/quizzes?${query.toString()}`, {
    authentication: { kind: 'admin' },
  });
}
