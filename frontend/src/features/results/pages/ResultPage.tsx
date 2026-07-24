import { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { AnswerReview } from '@/features/results/components/AnswerReview';
import {
  clearParticipationSession,
  getParticipationSessionByQuiz,
  markParticipationCompleted,
} from '@/features/participation/session/participation-session';
import { useParticipationResult } from '@/features/results/hooks/use-participation-result';
import { ApiError } from '@/shared/api';
import {
  Badge,
  Button,
  ErrorMessage,
  Loader,
  PageContainer,
} from '@/shared/components';
import { formatDuration } from '@/shared/utils/format-duration';

export default function ResultPage() {
  const { publicId, participationId } = useParams<{
    publicId: string;
    participationId: string;
  }>();
  const session = publicId ? getParticipationSessionByQuiz(publicId) : null;
  const authorizedSession =
    session && session.participationId === participationId ? session : null;
  const resultQuery = useParticipationResult(
    authorizedSession?.participationId,
    authorizedSession?.participationToken,
  );

  useEffect(() => {
    if (resultQuery.data) {
      markParticipationCompleted(resultQuery.data.participationId);
    }
  }, [resultQuery.data]);

  useEffect(() => {
    if (
      resultQuery.error instanceof ApiError &&
      resultQuery.error.code === 'INVALID_PARTICIPATION_TOKEN' &&
      authorizedSession
    ) {
      clearParticipationSession(authorizedSession.participationId);
    }
  }, [authorizedSession, resultQuery.error]);

  if (!publicId || !participationId || !authorizedSession) {
    return (
      <PageContainer
        eyebrow="Resultado"
        title="No podemos autorizar esta consulta"
      >
        <ErrorMessage>
          El resultado solo está disponible desde la pestaña donde se inició la
          participación.
        </ErrorMessage>
        {publicId && (
          <div className="page-actions">
            <Link className="button button--primary" to={`/quiz/${publicId}`}>
              Volver al cuestionario
            </Link>
          </div>
        )}
      </PageContainer>
    );
  }

  if (resultQuery.isPending) {
    return (
      <PageContainer eyebrow="Resultado" title="Calculando tu resultado">
        <Loader label="Consultando el resultado del servidor…" />
      </PageContainer>
    );
  }

  if (resultQuery.isError || !resultQuery.data) {
    const invalidToken =
      resultQuery.error instanceof ApiError &&
      resultQuery.error.code === 'INVALID_PARTICIPATION_TOKEN';
    return (
      <PageContainer eyebrow="Resultado" title="Resultado no disponible">
        <ErrorMessage>
          {invalidToken
            ? 'La autorización de esta participación ya no es válida.'
            : 'No pudimos consultar el resultado. Inténtalo nuevamente.'}
        </ErrorMessage>
        {!invalidToken && (
          <div className="page-actions">
            <Button
              onClick={() => void resultQuery.refetch()}
              variant="secondary"
            >
              Reintentar
            </Button>
          </div>
        )}
      </PageContainer>
    );
  }

  const result = resultQuery.data;
  const completedAt = new Intl.DateTimeFormat('es-GT', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(result.completedAt));

  return (
    <PageContainer
      actions={<Badge tone="success">Completado</Badge>}
      eyebrow={`Resultado de ${result.alias}`}
      title="Tu resultado"
    >
      <section className="panel result-hero">
        <div className="result-percentage" aria-label="Porcentaje obtenido">
          <strong>{result.percentage}%</strong>
          <span>de respuestas correctas</span>
        </div>
        <meter
          aria-label={`${result.percentage} por ciento`}
          max="100"
          min="0"
          value={result.percentage}
        >
          {result.percentage}%
        </meter>
        <dl className="result-facts">
          <div>
            <dt>Puntuación</dt>
            <dd>
              {result.score} de {result.totalQuestions}
            </dd>
          </div>
          <div>
            <dt>Duración</dt>
            <dd>{formatDuration(result.durationMs)}</dd>
          </div>
          <div>
            <dt>Finalizado</dt>
            <dd>{completedAt}</dd>
          </div>
        </dl>
      </section>

      <AnswerReview answers={result.answers} />

      <div className="result-actions">
        <Link
          className="button button--primary"
          to={`/quiz/${publicId}/ranking`}
        >
          Ver tabla de clasificación
        </Link>
        <Link className="button button--secondary" to="/">
          Volver al inicio
        </Link>
      </div>
    </PageContainer>
  );
}
