import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createAdminQuiz } from '@/features/quizzes/api/admin-quizzes-api';
import { adminQuizKeys } from '@/features/quizzes/hooks/use-admin-quizzes';

export function useCreateAdminQuiz() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createAdminQuiz,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: adminQuizKeys.all }),
  });
}
