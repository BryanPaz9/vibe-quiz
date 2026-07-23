import { apiRequest } from '@/shared/api';
import type { RankingResponse } from '@/shared/types/api';

export function getPublicRanking(publicId: string): Promise<RankingResponse> {
  return apiRequest<RankingResponse>(`/public/quizzes/${publicId}/ranking`);
}
