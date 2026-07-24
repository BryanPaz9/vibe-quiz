import { useNavigate } from 'react-router-dom';
import { QuizContentForm } from '@/features/quizzes/components/QuizContentForm';
import { useCreateAdminQuiz } from '@/features/quizzes/hooks/use-create-admin-quiz';
import { emptyQuestion } from '@/features/quizzes/schemas/quiz-content-schema';
import { PageContainer } from '@/shared/components';
import type { QuizContentInput } from '@/shared/types/api';

export function QuizCreatePage() {
  const navigate = useNavigate();
  const createQuiz = useCreateAdminQuiz();

  async function submit(request: QuizContentInput) {
    try {
      const created = await createQuiz.mutateAsync(request);
      navigate(`/admin/quizzes/${created.id}`, { replace: true });
    } catch {
      // The mutation exposes the recoverable error state in the form.
    }
  }

  return (
    <PageContainer eyebrow="Administración" title="Crear cuestionario">
      <QuizContentForm
        cancelTo="/admin/quizzes"
        errorTitle="No fue posible crear el cuestionario"
        initialValues={{
          description: '',
          questions: [emptyQuestion],
          title: '',
        }}
        isPending={createQuiz.isPending}
        onSubmit={submit}
        showError={createQuiz.isError}
        submitLabel="Crear cuestionario"
      />
    </PageContainer>
  );
}
