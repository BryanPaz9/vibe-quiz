import { faChartColumn } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link, useParams } from 'react-router-dom';
import { useAdminQuizRanking } from '@/features/quizzes/hooks/use-admin-quiz-results';
import {
  Button,
  EmptyState,
  ErrorMessage,
  Loader,
  PageContainer,
} from '@/shared/components';
import { formatDuration } from '@/shared/utils/format-duration';

export function AdminRankingPage() {
  const { id } = useParams<{ id: string }>();
  const rankingQuery = useAdminQuizRanking(id);

  if (!id) {
    return (
      <PageContainer eyebrow="Administración" title="Enlace inválido">
        <ErrorMessage>
          La dirección no contiene un identificador de cuestionario.
        </ErrorMessage>
      </PageContainer>
    );
  }

  if (rankingQuery.isPending) {
    return (
      <PageContainer eyebrow="Administración" title="Ranking">
        <Loader label="Consultando ranking…" />
      </PageContainer>
    );
  }

  if (rankingQuery.isError || !rankingQuery.data) {
    return (
      <PageContainer eyebrow="Administración" title="Ranking no disponible">
        <ErrorMessage>
          No pudimos consultar el ranking administrativo.
        </ErrorMessage>
        <div className="page-actions">
          <Button
            onClick={() => void rankingQuery.refetch()}
            type="button"
            variant="secondary"
          >
            Reintentar
          </Button>
          <Link
            className="button button--secondary"
            to={`/admin/quizzes/${id}`}
          >
            Volver al detalle
          </Link>
        </div>
      </PageContainer>
    );
  }

  const ranking = rankingQuery.data;
  const generatedAt = new Intl.DateTimeFormat('es-GT', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(ranking.generatedAt));

  return (
    <PageContainer
      actions={
        <Link
          className="button button--secondary"
          to={`/admin/quizzes/${id}/results`}
        >
          <FontAwesomeIcon aria-hidden="true" icon={faChartColumn} />
          <span>Ver resultados</span>
        </Link>
      }
      eyebrow="Administración"
      title="Ranking"
    >
      {ranking.entries.length === 0 ? (
        <EmptyState title="Todavía no hay posiciones">
          El ranking aparecerá cuando finalice la primera participación.
        </EmptyState>
      ) : (
        <div className="panel table-scroll">
          <table className="ranking-table">
            <caption className="sr-only">
              Ranking administrativo generado el {generatedAt}
            </caption>
            <thead>
              <tr>
                <th scope="col">Posición</th>
                <th scope="col">Alias</th>
                <th scope="col">Puntuación</th>
                <th scope="col">Porcentaje</th>
                <th scope="col">Duración</th>
              </tr>
            </thead>
            <tbody>
              {ranking.entries.map((entry) => (
                <tr key={`${entry.position}-${entry.alias}`}>
                  <td>
                    <strong>#{entry.position}</strong>
                  </td>
                  <th scope="row">{entry.alias}</th>
                  <td>
                    {entry.score}/{entry.totalQuestions}
                  </td>
                  <td>{entry.percentage}%</td>
                  <td>{formatDuration(entry.durationMs)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <p className="ranking-generated">Actualizado: {generatedAt}</p>
      <div className="page-actions">
        <Link className="button button--secondary" to={`/admin/quizzes/${id}`}>
          Volver al detalle
        </Link>
      </div>
    </PageContainer>
  );
}
