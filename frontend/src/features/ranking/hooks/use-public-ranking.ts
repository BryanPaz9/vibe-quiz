import { useQuery } from '@tanstack/react-query';
import { getPublicRanking } from '@/features/ranking/api/ranking-api';

export const publicRankingKeys = {
  detail: (publicId: string) => ['public-ranking', publicId] as const,
};

export function usePublicRanking(publicId: string | undefined) {
  return useQuery({
    enabled: Boolean(publicId),
    queryKey: publicRankingKeys.detail(publicId ?? ''),
    queryFn: () => getPublicRanking(publicId as string),
  });
}
