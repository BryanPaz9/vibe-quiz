import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateAdminQuiz } from '@/features/quizzes/api/admin-quizzes-api';
import { adminQuizKeys } from '@/features/quizzes/hooks/use-admin-quizzes';
import type { QuizContentInput } from '@/shared/types/api';

export function useUpdateAdminQuiz(quizId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: QuizContentInput) => updateAdminQuiz(quizId, request),
    onSuccess: (quiz) => {
      queryClient.setQueryData(adminQuizKeys.detail(quizId), quiz);
      return queryClient.invalidateQueries({ queryKey: adminQuizKeys.lists() });
    },
  });
}
