import { apiRequest } from '@/shared/api';
import type {
  PublicQuiz,
  StartParticipationRequest,
  StartParticipationResponse,
  ParticipationResult,
  SubmitParticipationRequest,
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

export function submitParticipation(
  participationId: string,
  participationToken: string,
  request: SubmitParticipationRequest,
): Promise<ParticipationResult> {
  return apiRequest<ParticipationResult>(
    `/participations/${participationId}/submissions`,
    {
      authentication: {
        kind: 'participation',
        token: participationToken,
      },
      method: 'POST',
      body: request,
    },
  );
}
