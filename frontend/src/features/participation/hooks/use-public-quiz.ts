import { useQuery } from '@tanstack/react-query';
import { getPublicQuiz } from '@/features/participation/api/public-quiz-api';

export const publicQuizKeys = {
  all: ['public-quizzes'] as const,
  detail: (publicId: string) => [...publicQuizKeys.all, publicId] as const,
};

export function usePublicQuiz(publicId: string | undefined) {
  return useQuery({
    enabled: Boolean(publicId),
    queryKey: publicQuizKeys.detail(publicId ?? ''),
    queryFn: () => getPublicQuiz(publicId as string),
  });
}
