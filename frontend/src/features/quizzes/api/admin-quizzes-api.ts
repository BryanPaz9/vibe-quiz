import { apiRequest } from '@/shared/api';
import type {
  AdminQuizDetail,
  QuizContentInput,
  QuizListResponse,
  QuizStatus,
  PublishQuizResponse,
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

export function publishAdminQuiz(quizId: string): Promise<PublishQuizResponse> {
  return apiRequest<PublishQuizResponse>(`/admin/quizzes/${quizId}/publish`, {
    authentication: { kind: 'admin' },
    method: 'POST',
  });
}

export function closeAdminQuiz(quizId: string): Promise<unknown> {
  return apiRequest<unknown>(`/admin/quizzes/${quizId}/close`, {
    authentication: { kind: 'admin' },
    method: 'POST',
  });
}

export function deleteAdminQuiz(quizId: string): Promise<void> {
  return apiRequest<void>(`/admin/quizzes/${quizId}`, {
    authentication: { kind: 'admin' },
    method: 'DELETE',
  });
}
