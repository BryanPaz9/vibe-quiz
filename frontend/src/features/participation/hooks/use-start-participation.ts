import { useMutation } from '@tanstack/react-query';
import { startParticipation } from '@/features/participation/api/public-quiz-api';

export function useStartParticipation(publicId: string) {
  return useMutation({
    mutationFn: (alias: string) => startParticipation(publicId, { alias }),
  });
}
