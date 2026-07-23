import { apiRequest } from '@/shared/api';
import type {
  PublicQuiz,
  StartParticipationRequest,
  StartParticipationResponse,
} from '@/shared/types/api';

export function getPublicQuiz(publicId: string): Promise<PublicQuiz> {
  return apiRequest<PublicQuiz>(`/public/quizzes/${publicId}`);
}

export function startParticipation(
  publicId: string,
  request: StartParticipationRequest,
): Promise<StartParticipationResponse> {
  return apiRequest<StartParticipationResponse>(
    `/public/quizzes/${publicId}/participations`,
    {
      method: 'POST',
      body: request,
    },
  );
}
