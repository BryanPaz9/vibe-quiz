import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faChartColumn,
  faRankingStar,
} from '@fortawesome/free-solid-svg-icons';
import { Link, useParams } from 'react-router-dom';
import { QuizLifecyclePanel } from '@/features/quizzes/components/QuizLifecyclePanel';
import { QuizContentForm } from '@/features/quizzes/components/QuizContentForm';
import { useAdminQuiz } from '@/features/quizzes/hooks/use-admin-quizzes';
import { useUpdateAdminQuiz } from '@/features/quizzes/hooks/use-update-admin-quiz';
import {
  Badge,
  Button,
  ErrorMessage,
  Loader,
  PageContainer,
} from '@/shared/components';
import type {
  AdminQuizDetail,
  QuizContentInput,
  QuizStatus,
} from '@/shared/types/api';

function statusPresentation(status: QuizStatus) {
  switch (status) {
    case 'DRAFT':
      return { label: 'Borrador', tone: 'warning' as const };
    case 'PUBLISHED':
      return { label: 'Publicado', tone: 'success' as const };
    case 'CLOSED':
      return { label: 'Cerrado', tone: 'neutral' as const };
  }
}

function formatDate(value: string | null): string {
  if (!value) return 'No disponible';
  return new Intl.DateTimeFormat('es-GT', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value));
}

function ReadOnlyQuiz({ quiz }: { quiz: AdminQuizDetail }) {
  return (
    <div className="quiz-detail">
      <section className="panel quiz-detail-metadata">
        <div>
          <span>Título</span>
          <strong>{quiz.title}</strong>
        </div>
        <div>
          <span>Descripción</span>
          <strong>{quiz.description || 'Sin descripción'}</strong>
        </div>
        <div>
          <span>Creado</span>
          <strong>{formatDate(quiz.createdAt)}</strong>
        </div>
        <div>
          <span>Actualizado</span>
          <strong>{formatDate(quiz.updatedAt)}</strong>
        </div>
        <div>
          <span>Publicado</span>
          <strong>{formatDate(quiz.publishedAt)}</strong>
        </div>
        <div>
          <span>Cerrado</span>
          <strong>{formatDate(quiz.closedAt)}</strong>
        </div>
      </section>

      {quiz.questions.map((question, questionIndex) => (
        <section className="panel quiz-detail-question" key={question.id}>
          <p>Pregunta {questionIndex + 1}</p>
          <h2>{question.text}</h2>
          <ol>
            {question.options.map((option) => (
              <li key={option.id}>
                {option.text}
                {option.isCorrect && <Badge tone="success">Correcta</Badge>}
              </li>
            ))}
          </ol>
        </section>
      ))}
    </div>
  );
}

export function QuizDetailPage() {
  const { id } = useParams<{ id: string }>();
  const quizQuery = useAdminQuiz(id);
  const updateQuiz = useUpdateAdminQuiz(id ?? '');

  if (!id) {
    return (
      <PageContainer eyebrow="Administración" title="Enlace inválido">
        <ErrorMessage>
          La dirección no contiene un identificador de cuestionario.
        </ErrorMessage>
      </PageContainer>
    );
  }

  if (quizQuery.isPending) {
    return (
      <PageContainer eyebrow="Administración" title="Detalle del cuestionario">
        <Loader label="Consultando cuestionario…" />
      </PageContainer>
    );
  }

  if (quizQuery.isError || !quizQuery.data) {
    return (
      <PageContainer eyebrow="Administración" title="Detalle no disponible">
        <ErrorMessage>
          No pudimos consultar el cuestionario solicitado.
        </ErrorMessage>
        <div className="page-actions">
          <Button
            onClick={() => void quizQuery.refetch()}
            type="button"
            variant="secondary"
          >
            Reintentar
          </Button>
          <Link className="button button--secondary" to="/admin/quizzes">
            Volver al listado
          </Link>
        </div>
      </PageContainer>
    );
  }

  const quiz = quizQuery.data;
  const presentation = statusPresentation(quiz.status);

  async function submit(request: QuizContentInput) {
    try {
      await updateQuiz.mutateAsync(request);
    } catch {
      // The mutation exposes the recoverable error state in the form.
    }
  }

  return (
    <PageContainer
      actions={
        <div className="page-header__action-group">
          <Badge tone={presentation.tone}>{presentation.label}</Badge>
          <Link
            className="button button--secondary"
            to={`/admin/quizzes/${id}/results`}
          >
            <FontAwesomeIcon aria-hidden="true" icon={faChartColumn} />
            <span>Resultados</span>
          </Link>
          <Link
            className="button button--secondary"
            to={`/admin/quizzes/${id}/ranking`}
          >
            <FontAwesomeIcon aria-hidden="true" icon={faRankingStar} />
            <span>Ranking</span>
          </Link>
        </div>
      }
      eyebrow="Administración"
      title="Detalle del cuestionario"
    >
      <QuizLifecyclePanel quiz={quiz} />

      {quiz.status === 'DRAFT' ? (
        <QuizContentForm
          cancelTo="/admin/quizzes"
          errorTitle="No fue posible guardar el cuestionario"
          initialValues={{
            description: quiz.description ?? '',
            questions: quiz.questions.map((question) => ({
              text: question.text,
              options: question.options.map((option) => ({
                text: option.text,
                isCorrect: option.isCorrect,
              })),
            })),
            title: quiz.title,
          }}
          isPending={updateQuiz.isPending}
          onSubmit={submit}
          showError={updateQuiz.isError}
          submitLabel="Guardar cambios"
          successMessage={
            updateQuiz.isSuccess
              ? 'Los cambios se guardaron correctamente.'
              : ''
          }
        />
      ) : (
        <>
          <p className="state-message">
            Este cuestionario no puede editarse porque ya no está en borrador.
          </p>
          <ReadOnlyQuiz quiz={quiz} />
          <div className="page-actions">
            <Link className="button button--secondary" to="/admin/quizzes">
              Volver al listado
            </Link>
          </div>
        </>
      )}
    </PageContainer>
  );
}
