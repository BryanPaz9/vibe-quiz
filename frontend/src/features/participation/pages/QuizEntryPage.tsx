import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { usePublicQuiz } from '@/features/participation/hooks/use-public-quiz';
import { useStartParticipation } from '@/features/participation/hooks/use-start-participation';
import {
  aliasSchema,
  type AliasFormValues,
} from '@/features/participation/schemas/alias-schema';
import {
  getParticipationSessionByQuiz,
  saveParticipationSession,
} from '@/features/participation/session/participation-session';
import { ApiError } from '@/shared/api';
import {
  Badge,
  Button,
  ErrorMessage,
  Input,
  Loader,
  PageContainer,
} from '@/shared/components';

function participationErrorMessage(error: unknown): string {
  if (!(error instanceof ApiError)) {
    return 'Revisa tu conexión e inténtalo nuevamente.';
  }

  switch (error.code) {
    case 'ALIAS_ALREADY_USED':
      return 'Este alias ya fue utilizado en el cuestionario.';
    case 'QUIZ_NOT_AVAILABLE':
    case 'QUIZ_NOT_FOUND':
      return 'El cuestionario ya no está disponible para participar.';
    case 'RATE_LIMITED':
      return 'Se realizaron demasiados intentos. Espera un momento.';
    default:
      return 'No fue posible iniciar la participación. Inténtalo nuevamente.';
  }
}

export default function QuizEntryPage() {
  const { publicId } = useParams<{ publicId: string }>();
  const navigate = useNavigate();
  const quizQuery = usePublicQuiz(publicId);
  const startMutation = useStartParticipation(publicId ?? '');
  const existingSession = publicId
    ? getParticipationSessionByQuiz(publicId)
    : null;
  const {
    formState: { errors },
    handleSubmit,
    register,
    setError,
  } = useForm<AliasFormValues>({
    resolver: zodResolver(aliasSchema),
    defaultValues: { alias: '' },
  });

  if (!publicId) {
    return (
      <PageContainer eyebrow="Participación" title="Enlace inválido">
        <ErrorMessage>
          La dirección no contiene un identificador de cuestionario.
        </ErrorMessage>
      </PageContainer>
    );
  }

  if (quizQuery.isPending) {
    return (
      <PageContainer eyebrow="Participación" title="Preparando cuestionario">
        <Loader label="Consultando el cuestionario…" />
      </PageContainer>
    );
  }

  if (quizQuery.isError || !quizQuery.data) {
    return (
      <PageContainer eyebrow="Participación" title="Cuestionario no disponible">
        <ErrorMessage>
          No encontramos un cuestionario publicado para este enlace.
        </ErrorMessage>
        <div className="page-actions">
          <Button onClick={() => void quizQuery.refetch()} variant="secondary">
            Reintentar
          </Button>
        </div>
      </PageContainer>
    );
  }

  const quiz = quizQuery.data;

  const submitAlias = handleSubmit(async ({ alias }) => {
    try {
      const participation = await startMutation.mutateAsync(
        alias.trim().replace(/\s+/gu, ' '),
      );
      saveParticipationSession({
        participationId: participation.participationId,
        participationToken: participation.participationToken,
        quizPublicId: participation.quizPublicId,
        alias: participation.alias,
      });
      navigate(`/quiz/${participation.quizPublicId}/play`);
    } catch (error: unknown) {
      setError('root', {
        message: participationErrorMessage(error),
      });
    }
  });

  return (
    <PageContainer
      actions={<Badge tone="success">Disponible</Badge>}
      eyebrow="Participación"
      title={quiz.title}
    >
      <div className="entry-grid">
        <section className="panel quiz-introduction">
          <p className="quiz-introduction__description">
            {quiz.description || 'Cuestionario de opción múltiple.'}
          </p>
          <dl className="quiz-facts">
            <div>
              <dt>Preguntas</dt>
              <dd>{quiz.questionCount}</dd>
            </div>
            <div>
              <dt>Modalidad</dt>
              <dd>Un intento por alias</dd>
            </div>
          </dl>
          <p className="muted">
            Tu tiempo comienza cuando confirmas el alias. Debes responder todas
            las preguntas antes de enviar.
          </p>
        </section>

        <section className="panel entry-card">
          {existingSession ? (
            <>
              <p className="page-header__eyebrow">Intento activo</p>
              <h2>Continúa como {existingSession.alias}</h2>
              <p className="muted">
                Encontramos una participación iniciada en esta pestaña.
              </p>
              <Button onClick={() => navigate(`/quiz/${publicId}/play`)}>
                Continuar cuestionario
              </Button>
            </>
          ) : (
            <>
              <p className="page-header__eyebrow">Antes de comenzar</p>
              <h2>¿Cómo quieres aparecer?</h2>
              <form noValidate onSubmit={(event) => void submitAlias(event)}>
                <Input
                  autoComplete="nickname"
                  autoFocus
                  error={errors.alias?.message}
                  label="Alias"
                  maxLength={80}
                  placeholder="Ejemplo: Ada"
                  {...register('alias')}
                />
                {errors.root?.message && (
                  <ErrorMessage title="No pudimos iniciar">
                    {errors.root.message}
                  </ErrorMessage>
                )}
                <Button
                  className="entry-card__submit"
                  isLoading={startMutation.isPending}
                  type="submit"
                >
                  Comenzar cuestionario
                </Button>
              </form>
            </>
          )}
        </section>
      </div>
    </PageContainer>
  );
}
