import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { usePublicQuiz } from '@/features/participation/hooks/use-public-quiz';
import { useSubmitParticipation } from '@/features/participation/hooks/use-submit-participation';
import {
  clearParticipationAnswers,
  clearParticipationSession,
  getParticipationAnswers,
  getParticipationSessionByQuiz,
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
      clearParticipationAnswers(session.participationId);
      navigate(`/quiz/${publicId}/result/${session.participationId}`);
    } catch (error: unknown) {
      if (
        error instanceof ApiError &&
        error.code === 'PARTICIPATION_COMPLETED'
      ) {
        clearParticipationAnswers(session.participationId);
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
      actions={
        <Badge
          tone={answeredCount === questions.length ? 'success' : 'neutral'}
        >
          {answeredCount} de {questions.length} respondidas
        </Badge>
      }
      eyebrow={`Participando como ${session.alias}`}
      title={quiz.title}
    >
      <div className="quiz-player">
        {questions.map((question, questionIndex) => (
          <fieldset
            className="panel question-card"
            id={`question-${question.id}`}
            key={question.id}
            tabIndex={-1}
          >
            <legend>
              <span>Pregunta {questionIndex + 1}</span>
              {question.text}
            </legend>
            <div className="option-list">
              {[...question.options]
                .sort((first, second) => first.position - second.position)
                .map((option) => (
                  <label className="quiz-option" key={option.id}>
                    <input
                      checked={answers[question.id] === option.id}
                      disabled={submitMutation.isPending}
                      name={`question-${question.id}`}
                      onChange={() => selectAnswer(question.id, option.id)}
                      type="radio"
                      value={option.id}
                    />
                    <span>{option.text}</span>
                  </label>
                ))}
            </div>
          </fieldset>
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
