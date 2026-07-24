import { useState } from 'react';
import { m } from 'motion/react';
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom';
import { ElapsedTimer } from '@/features/participation/components/ElapsedTimer';
import { usePublicQuiz } from '@/features/participation/hooks/use-public-quiz';
import { useSubmitParticipation } from '@/features/participation/hooks/use-submit-participation';
import {
  clearParticipationSession,
  getParticipationAnswers,
  getParticipationSessionByQuiz,
  markParticipationCompleted,
  saveParticipationAnswers,
  type ParticipationAnswerDraft,
} from '@/features/participation/session/participation-session';
import { ApiError } from '@/shared/api';
import {
  Badge,
  Button,
  ErrorMessage,
  Loader,
  PageContainer,
} from '@/shared/components';

function submissionErrorMessage(error: unknown): string {
  if (!(error instanceof ApiError)) {
    return 'Revisa tu conexión. Tus respuestas permanecen guardadas.';
  }

  switch (error.code) {
    case 'INCOMPLETE_SUBMISSION':
      return 'El servidor indicó que faltan respuestas. Revisa el cuestionario.';
    case 'INVALID_ANSWER':
      return 'Una respuesta ya no es válida para este cuestionario.';
    case 'INVALID_PARTICIPATION_TOKEN':
      return 'La autorización del intento ya no es válida.';
    case 'PARTICIPATION_COMPLETED':
      return 'Este intento ya fue enviado.';
    default:
      return 'No fue posible enviar. Tus respuestas permanecen guardadas.';
  }
}

export default function QuizPlayPage() {
  const { publicId } = useParams<{ publicId: string }>();
  const navigate = useNavigate();
  const session = publicId ? getParticipationSessionByQuiz(publicId) : null;
  const quizQuery = usePublicQuiz(session?.quiz ? undefined : publicId);
  const quiz = session?.quiz ?? quizQuery.data;
  const submitMutation = useSubmitParticipation(
    session?.participationId ?? '',
    session?.participationToken ?? '',
  );
  const [answers, setAnswers] = useState<ParticipationAnswerDraft>(() =>
    session ? getParticipationAnswers(session.participationId) : {},
  );
  const [submissionError, setSubmissionError] = useState<string | null>(null);
  const [timerStartedAt] = useState(
    () => session?.startedAt ?? new Date().toISOString(),
  );

  if (!publicId || !session) {
    return (
      <PageContainer eyebrow="Participación" title="No hay un intento activo">
        <ErrorMessage>
          Abre el cuestionario e ingresa tu alias para comenzar.
        </ErrorMessage>
        <div className="page-actions">
          <Link
            className="button button--primary"
            to={`/quiz/${publicId ?? ''}`}
          >
            Volver a la entrada
          </Link>
        </div>
      </PageContainer>
    );
  }

  if (session.status === 'COMPLETED') {
    return (
      <Navigate
        replace
        to={`/quiz/${publicId}/result/${session.participationId}`}
      />
    );
  }

  if (!quiz && quizQuery.isPending) {
    return (
      <PageContainer eyebrow="Participación" title="Cargando preguntas">
        <Loader label="Recuperando el cuestionario…" />
      </PageContainer>
    );
  }

  if (!quiz) {
    return (
      <PageContainer
        eyebrow="Participación"
        title="No pudimos recuperar el cuestionario"
      >
        <ErrorMessage>
          Tus datos de participación permanecen en esta pestaña. Inténtalo
          nuevamente.
        </ErrorMessage>
        <div className="page-actions">
          <Button onClick={() => void quizQuery.refetch()} variant="secondary">
            Reintentar
          </Button>
        </div>
      </PageContainer>
    );
  }

  const questions = [...quiz.questions].sort(
    (first, second) => first.position - second.position,
  );
  const answeredCount = questions.filter((question) =>
    Boolean(answers[question.id]),
  ).length;

  function selectAnswer(questionId: string, optionId: string): void {
    const nextAnswers = { ...answers, [questionId]: optionId };
    setAnswers(nextAnswers);
    saveParticipationAnswers(session.participationId, nextAnswers);
    setSubmissionError(null);
  }

  async function submitAnswers(): Promise<void> {
    if (submitMutation.isPending) return;

    const firstUnanswered = questions.find((question) => !answers[question.id]);
    if (firstUnanswered) {
      setSubmissionError('Responde todas las preguntas antes de enviar.');
      requestAnimationFrame(() => {
        document.getElementById(`question-${firstUnanswered.id}`)?.focus();
      });
      return;
    }

    try {
      await submitMutation.mutateAsync({
        answers: questions.map((question) => ({
          questionId: question.id,
          optionId: answers[question.id]!,
        })),
      });
      markParticipationCompleted(session.participationId);
      navigate(`/quiz/${publicId}/result/${session.participationId}`);
    } catch (error: unknown) {
      if (
        error instanceof ApiError &&
        error.code === 'PARTICIPATION_COMPLETED'
      ) {
        markParticipationCompleted(session.participationId);
        navigate(`/quiz/${publicId}/result/${session.participationId}`);
        return;
      }
      if (
        error instanceof ApiError &&
        error.code === 'INVALID_PARTICIPATION_TOKEN'
      ) {
        clearParticipationSession(session.participationId);
      }
      setSubmissionError(submissionErrorMessage(error));
    }
  }

  return (
    <PageContainer
      eyebrow={`Participando como ${session.alias}`}
      title={quiz.title}
    >
      <div
        aria-label="Progreso del cuestionario"
        className="quiz-player-status"
        role="region"
      >
        <Badge
          tone={answeredCount === questions.length ? 'success' : 'neutral'}
        >
          {answeredCount} de {questions.length} respondidas
        </Badge>
        <ElapsedTimer startedAt={timerStartedAt} />
      </div>
      <div className="quiz-player">
        {questions.map((question, questionIndex) => (
          <m.fieldset
            animate={{ opacity: 1, y: 0 }}
            className="panel question-card"
            id={`question-${question.id}`}
            initial={{ opacity: 0, y: 18 }}
            key={question.id}
            layout
            tabIndex={-1}
            transition={{
              delay: Math.min(questionIndex * 0.06, 0.3),
              duration: 0.28,
            }}
          >
            <legend>
              <span>Pregunta {questionIndex + 1}</span>
              {question.text}
            </legend>
            <div className="option-list">
              {[...question.options]
                .sort((first, second) => first.position - second.position)
                .map((option) => (
                  <m.label
                    animate={
                      answers[question.id] === option.id
                        ? { scale: 1.01 }
                        : { scale: 1 }
                    }
                    className="quiz-option"
                    key={option.id}
                    transition={{ duration: 0.15 }}
                    whileHover={{ x: 3 }}
                  >
                    <input
                      checked={answers[question.id] === option.id}
                      disabled={submitMutation.isPending}
                      name={`question-${question.id}`}
                      onChange={() => selectAnswer(question.id, option.id)}
                      type="radio"
                      value={option.id}
                    />
                    <span>{option.text}</span>
                  </m.label>
                ))}
            </div>
          </m.fieldset>
        ))}

        <section className="panel submission-panel">
          <div>
            <h2>Enviar respuestas</h2>
            <p className="muted">
              El envío es definitivo. La puntuación y la duración serán
              calculadas por el servidor.
            </p>
          </div>
          {submissionError && (
            <ErrorMessage title="No pudimos enviar">
              {submissionError}
            </ErrorMessage>
          )}
          <Button
            isLoading={submitMutation.isPending}
            onClick={() => void submitAnswers()}
          >
            Finalizar cuestionario
          </Button>
        </section>
      </div>
    </PageContainer>
  );
}
