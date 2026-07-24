import { type FormEvent } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useAdminQuizzes } from '@/features/quizzes/hooks/use-admin-quizzes';
import {
  Badge,
  Button,
  EmptyState,
  ErrorMessage,
  Input,
  Loader,
  PageContainer,
  Select,
} from '@/shared/components';
import { PlaceholderPage } from '@/shared/components/PlaceholderPage';
import type { QuizStatus } from '@/shared/types/api';
export { QuizCreatePage } from './QuizCreatePage';
export { QuizDetailPage } from './QuizDetailPage';

const DEFAULT_PAGE = 1;
const DEFAULT_PAGE_SIZE = 20;
const MAX_PAGE_SIZE = 100;
const quizStatuses: QuizStatus[] = ['DRAFT', 'PUBLISHED', 'CLOSED'];

function parsePositiveInteger(value: string | null, fallback: number): number {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback;
}

function parseStatus(value: string | null): QuizStatus | undefined {
  return quizStatuses.find((status) => status === value);
}

function statusPresentation(status: QuizStatus): {
  label: string;
  tone: 'neutral' | 'success' | 'warning';
} {
  switch (status) {
    case 'DRAFT':
      return { label: 'Borrador', tone: 'warning' };
    case 'PUBLISHED':
      return { label: 'Publicado', tone: 'success' };
    case 'CLOSED':
      return { label: 'Cerrado', tone: 'neutral' };
  }
}

function formatDate(value: string): string {
  return new Intl.DateTimeFormat('es-GT', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value));
}

export function QuizListPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const page = parsePositiveInteger(searchParams.get('page'), DEFAULT_PAGE);
  const pageSize = Math.min(
    parsePositiveInteger(searchParams.get('pageSize'), DEFAULT_PAGE_SIZE),
    MAX_PAGE_SIZE,
  );
  const status = parseStatus(searchParams.get('status'));
  const search = searchParams.get('search')?.trim() ?? '';
  const quizzesQuery = useAdminQuizzes({
    page,
    pageSize,
    search: search || undefined,
    status,
  });

  function updateParams(updates: {
    page?: number;
    search?: string;
    status?: QuizStatus;
  }) {
    const next = new URLSearchParams();
    const nextPage = updates.page ?? page;
    const nextSearch = updates.search ?? search;
    const nextStatus = Object.prototype.hasOwnProperty.call(updates, 'status')
      ? updates.status
      : status;

    if (nextPage !== DEFAULT_PAGE) next.set('page', String(nextPage));
    if (pageSize !== DEFAULT_PAGE_SIZE) next.set('pageSize', String(pageSize));
    if (nextStatus) next.set('status', nextStatus);
    if (nextSearch) next.set('search', nextSearch);
    setSearchParams(next);
  }

  function submitSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const nextSearch = String(form.get('search') ?? '').trim();
    updateParams({ page: DEFAULT_PAGE, search: nextSearch });
  }

  const response = quizzesQuery.data;

  return (
    <PageContainer
      actions={
        <Link className="button button--primary" to="/admin/quizzes/new">
          Crear cuestionario
        </Link>
      }
      eyebrow="Administración"
      title="Cuestionarios"
    >
      <form className="quiz-list-filters panel" onSubmit={submitSearch}>
        <Input
          defaultValue={search}
          id="quiz-search"
          key={search}
          label="Buscar cuestionarios"
          name="search"
          placeholder="Buscar por título"
          type="search"
        />
        <Select
          id="quiz-status"
          label="Estado"
          onChange={(event) =>
            updateParams({
              page: DEFAULT_PAGE,
              status: parseStatus(event.target.value),
            })
          }
          value={status ?? ''}
        >
          <option value="">Todos los estados</option>
          <option value="DRAFT">Borrador</option>
          <option value="PUBLISHED">Publicado</option>
          <option value="CLOSED">Cerrado</option>
        </Select>
        <Button type="submit">Buscar</Button>
      </form>

      {quizzesQuery.isPending ? (
        <Loader label="Consultando cuestionarios…" />
      ) : quizzesQuery.isError || !response ? (
        <div className="quiz-list-state">
          <ErrorMessage>
            No pudimos consultar los cuestionarios. Intenta nuevamente.
          </ErrorMessage>
          <Button
            onClick={() => void quizzesQuery.refetch()}
            type="button"
            variant="secondary"
          >
            Reintentar
          </Button>
        </div>
      ) : response.data.length === 0 ? (
        <EmptyState
          title={
            search || status
              ? 'No se encontraron cuestionarios'
              : 'Todavía no hay cuestionarios'
          }
        >
          {search || status
            ? 'Prueba con otra búsqueda o cambia el filtro de estado.'
            : 'Crea el primer cuestionario para comenzar.'}
        </EmptyState>
      ) : (
        <>
          <div className="panel table-scroll">
            <table className="ranking-table quiz-list-table">
              <caption className="sr-only">
                Cuestionarios administrativos, página {response.meta.page} de{' '}
                {response.meta.totalPages}
              </caption>
              <thead>
                <tr>
                  <th scope="col">Cuestionario</th>
                  <th scope="col">Estado</th>
                  <th scope="col">Preguntas</th>
                  <th scope="col">Participaciones</th>
                  <th scope="col">Creado</th>
                  <th scope="col">Actualizado</th>
                </tr>
              </thead>
              <tbody>
                {response.data.map((quiz) => {
                  const presentation = statusPresentation(quiz.status);
                  return (
                    <tr key={quiz.id}>
                      <th scope="row">
                        <Link to={`/admin/quizzes/${quiz.id}`}>
                          {quiz.title}
                        </Link>
                        {quiz.description && (
                          <span className="quiz-list-table__description">
                            {quiz.description}
                          </span>
                        )}
                      </th>
                      <td>
                        <Badge tone={presentation.tone}>
                          {presentation.label}
                        </Badge>
                      </td>
                      <td>{quiz.questionCount}</td>
                      <td>{quiz.participationCount}</td>
                      <td>{formatDate(quiz.createdAt)}</td>
                      <td>{formatDate(quiz.updatedAt)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <nav
            aria-label="Paginación de cuestionarios"
            className="quiz-list-pagination"
          >
            <Button
              disabled={response.meta.page <= 1 || quizzesQuery.isFetching}
              onClick={() =>
                updateParams({ page: Math.max(1, response.meta.page - 1) })
              }
              type="button"
              variant="secondary"
            >
              Anterior
            </Button>
            <span aria-live="polite">
              Página {response.meta.page} de {response.meta.totalPages} (
              {response.meta.total} cuestionarios)
            </span>
            <Button
              disabled={
                response.meta.page >= response.meta.totalPages ||
                quizzesQuery.isFetching
              }
              onClick={() => updateParams({ page: response.meta.page + 1 })}
              type="button"
              variant="secondary"
            >
              Siguiente
            </Button>
          </nav>
        </>
      )}
    </PageContainer>
  );
}

export function QuizResultsPage() {
  return (
    <PlaceholderPage
      description="Resultados paginados de las participaciones asociadas."
      title="Resultados"
    />
  );
}

export function AdminRankingPage() {
  return (
    <PlaceholderPage
      description="Ranking administrativo de participaciones completadas."
      title="Ranking"
    />
  );
}
