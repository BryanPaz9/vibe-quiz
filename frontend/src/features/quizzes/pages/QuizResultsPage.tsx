import { faRankingStar } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { useAdminQuizResults } from '@/features/quizzes/hooks/use-admin-quiz-results';
import {
  Badge,
  Button,
  EmptyState,
  ErrorMessage,
  Loader,
  PageContainer,
} from '@/shared/components';
import { formatDuration } from '@/shared/utils/format-duration';

const DEFAULT_PAGE = 1;
const DEFAULT_PAGE_SIZE = 20;
const MAX_PAGE_SIZE = 100;

function parsePositiveInteger(value: string | null, fallback: number): number {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback;
}

function formatDate(value: string | null): string {
  if (!value) return 'Pendiente';
  return new Intl.DateTimeFormat('es-GT', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value));
}

export function QuizResultsPage() {
  const { id } = useParams<{ id: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const page = parsePositiveInteger(searchParams.get('page'), DEFAULT_PAGE);
  const pageSize = Math.min(
    parsePositiveInteger(searchParams.get('pageSize'), DEFAULT_PAGE_SIZE),
    MAX_PAGE_SIZE,
  );
  const resultsQuery = useAdminQuizResults(id, { page, pageSize });

  function changePage(nextPage: number) {
    const next = new URLSearchParams();
    if (nextPage !== DEFAULT_PAGE) next.set('page', String(nextPage));
    if (pageSize !== DEFAULT_PAGE_SIZE) next.set('pageSize', String(pageSize));
    setSearchParams(next);
  }

  if (!id) {
    return (
      <PageContainer eyebrow="Administración" title="Enlace inválido">
        <ErrorMessage>
          La dirección no contiene un identificador de cuestionario.
        </ErrorMessage>
      </PageContainer>
    );
  }

  if (resultsQuery.isPending) {
    return (
      <PageContainer eyebrow="Administración" title="Resultados">
        <Loader label="Consultando resultados…" />
      </PageContainer>
    );
  }

  if (resultsQuery.isError || !resultsQuery.data) {
    return (
      <PageContainer eyebrow="Administración" title="Resultados no disponibles">
        <ErrorMessage>
          No pudimos consultar las participaciones del cuestionario.
        </ErrorMessage>
        <div className="page-actions">
          <Button
            onClick={() => void resultsQuery.refetch()}
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

  const response = resultsQuery.data;

  return (
    <PageContainer
      actions={
        <Link
          className="button button--secondary"
          to={`/admin/quizzes/${id}/ranking`}
        >
          <FontAwesomeIcon aria-hidden="true" icon={faRankingStar} />
          <span>Ver ranking</span>
        </Link>
      }
      eyebrow="Administración"
      title="Resultados"
    >
      {response.data.length === 0 ? (
        <EmptyState title="Todavía no hay participaciones">
          Los resultados aparecerán cuando una persona inicie el cuestionario.
        </EmptyState>
      ) : (
        <>
          <div className="panel table-scroll">
            <table className="ranking-table">
              <caption className="sr-only">
                Resultados administrativos, página {response.meta.page} de{' '}
                {response.meta.totalPages}
              </caption>
              <thead>
                <tr>
                  <th scope="col">Alias</th>
                  <th scope="col">Estado</th>
                  <th scope="col">Puntuación</th>
                  <th scope="col">Porcentaje</th>
                  <th scope="col">Inicio</th>
                  <th scope="col">Finalización</th>
                  <th scope="col">Duración</th>
                </tr>
              </thead>
              <tbody>
                {response.data.map((result) => (
                  <tr key={`${result.alias}-${result.startedAt}`}>
                    <th scope="row">{result.alias}</th>
                    <td>
                      <Badge
                        tone={
                          result.status === 'COMPLETED' ? 'success' : 'warning'
                        }
                      >
                        {result.status === 'COMPLETED'
                          ? 'Completada'
                          : 'En curso'}
                      </Badge>
                    </td>
                    <td>
                      {result.score === null || result.totalQuestions === null
                        ? 'Pendiente'
                        : `${result.score}/${result.totalQuestions}`}
                    </td>
                    <td>
                      {result.percentage === null
                        ? 'Pendiente'
                        : `${result.percentage}%`}
                    </td>
                    <td>{formatDate(result.startedAt)}</td>
                    <td>{formatDate(result.completedAt)}</td>
                    <td>
                      {result.durationMs === null
                        ? 'Pendiente'
                        : formatDuration(result.durationMs)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <nav
            aria-label="Paginación de resultados"
            className="quiz-list-pagination"
          >
            <Button
              disabled={response.meta.page <= 1 || resultsQuery.isFetching}
              onClick={() =>
                changePage(Math.max(DEFAULT_PAGE, response.meta.page - 1))
              }
              type="button"
              variant="secondary"
            >
              Anterior
            </Button>
            <span aria-live="polite">
              Página {response.meta.page} de {response.meta.totalPages} (
              {response.meta.total} participaciones)
            </span>
            <Button
              disabled={
                response.meta.page >= response.meta.totalPages ||
                resultsQuery.isFetching
              }
              onClick={() => changePage(response.meta.page + 1)}
              type="button"
              variant="secondary"
            >
              Siguiente
            </Button>
          </nav>
        </>
      )}
      <div className="page-actions">
        <Link className="button button--secondary" to={`/admin/quizzes/${id}`}>
          Volver al detalle
        </Link>
      </div>
    </PageContainer>
  );
}
