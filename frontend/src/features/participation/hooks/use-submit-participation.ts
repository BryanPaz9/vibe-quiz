import { useMutation } from '@tanstack/react-query';
import { submitParticipation } from '@/features/participation/api/public-quiz-api';
import type { SubmitParticipationRequest } from '@/shared/types/api';

export function useSubmitParticipation(
  participationId: string,
  participationToken: string,
) {
  return useMutation({
    mutationFn: (request: SubmitParticipationRequest) =>
      submitParticipation(participationId, participationToken, request),
  });
}
