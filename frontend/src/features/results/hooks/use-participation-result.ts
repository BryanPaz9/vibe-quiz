import { useQuery } from '@tanstack/react-query';
import { getParticipationResult } from '@/features/results/api/result-api';

export const participationResultKeys = {
  detail: (participationId: string) =>
    ['participation-result', participationId] as const,
};

export function useParticipationResult(
  participationId: string | undefined,
  participationToken: string | undefined,
) {
  return useQuery({
    enabled: Boolean(participationId && participationToken),
    queryKey: participationResultKeys.detail(participationId ?? ''),
    queryFn: () =>
      getParticipationResult(
        participationId as string,
        participationToken as string,
      ),
    retry: false,
  });
}
