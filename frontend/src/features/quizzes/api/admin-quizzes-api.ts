import { apiRequest } from '@/shared/api';
import type {
  AdminQuizDetail,
  QuizContentInput,
  QuizListResponse,
  QuizStatus,
} from '@/shared/types/api';

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

export function createAdminQuiz(
  request: QuizContentInput,
): Promise<AdminQuizDetail> {
  return apiRequest<AdminQuizDetail>('/admin/quizzes', {
    authentication: { kind: 'admin' },
    body: request,
    method: 'POST',
  });
}

export function getAdminQuiz(quizId: string): Promise<AdminQuizDetail> {
  return apiRequest<AdminQuizDetail>(`/admin/quizzes/${quizId}`, {
    authentication: { kind: 'admin' },
  });
}

export function updateAdminQuiz(
  quizId: string,
  request: QuizContentInput,
): Promise<AdminQuizDetail> {
  return apiRequest<AdminQuizDetail>(`/admin/quizzes/${quizId}`, {
    authentication: { kind: 'admin' },
    body: request,
    method: 'PUT',
  });
}
