import { apiRequest } from '@/shared/api';
import type { ParticipationResult } from '@/shared/types/api';

export function getParticipationResult(
  participationId: string,
  participationToken: string,
): Promise<ParticipationResult> {
  return apiRequest<ParticipationResult>(
    `/participations/${participationId}/result`,
    {
      authentication: {
        kind: 'participation',
        token: participationToken,
      },
    },
  );
}
