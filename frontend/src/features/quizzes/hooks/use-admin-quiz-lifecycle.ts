import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  closeAdminQuiz,
  deleteAdminQuiz,
  publishAdminQuiz,
} from '@/features/quizzes/api/admin-quizzes-api';
import { adminQuizKeys } from '@/features/quizzes/hooks/use-admin-quizzes';
import type { AdminQuizDetail } from '@/shared/types/api';

export function usePublishAdminQuiz(quizId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => publishAdminQuiz(quizId),
    onSuccess: (published) => {
      queryClient.setQueryData<AdminQuizDetail>(
        adminQuizKeys.detail(quizId),
        (current) =>
          current
            ? {
                ...current,
                status: published.status,
                publishedAt: published.publishedAt,
              }
            : current,
      );
      return queryClient.invalidateQueries({ queryKey: adminQuizKeys.lists() });
    },
  });
}

export function useCloseAdminQuiz(quizId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => closeAdminQuiz(quizId),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: adminQuizKeys.detail(quizId),
        }),
        queryClient.invalidateQueries({ queryKey: adminQuizKeys.lists() }),
      ]);
    },
  });
}

export function useDeleteAdminQuiz(quizId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => deleteAdminQuiz(quizId),
    onSuccess: async () => {
      queryClient.removeQueries({ queryKey: adminQuizKeys.detail(quizId) });
      await queryClient.invalidateQueries({ queryKey: adminQuizKeys.lists() });
    },
  });
}
