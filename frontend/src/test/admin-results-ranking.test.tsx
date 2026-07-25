import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { http, HttpResponse } from 'msw';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { appRoutes } from '@/app/router';
import { setAdminSession } from '@/features/auth/session/admin-session';
import {
  adminFixture,
  adminQuizDetailFixture,
  adminQuizResultsFixture,
  loginFixture,
  rankingFixture,
} from '@/mocks/fixtures';
import { server } from '@/mocks/server';

const resultsUrl = `http://localhost:3000/api/v1/admin/quizzes/${adminQuizDetailFixture.id}/results`;
const rankingUrl = `http://localhost:3000/api/v1/admin/quizzes/${adminQuizDetailFixture.id}/ranking`;

function renderAdminRoute(path: string) {
  setAdminSession({
    accessToken: loginFixture.accessToken,
    admin: adminFixture,
    expiresAt: Date.now() + 3_600_000,
  });
  const router = createMemoryRouter(appRoutes, { initialEntries: [path] });
  const queryClient = new QueryClient({
    defaultOptions: {
      mutations: { retry: false },
      queries: { retry: false },
    },
  });

  render(
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>,
  );

  return router;
}

function apiError(code = 'INTERNAL_ERROR') {
  return {
    error: {
      code,
      message: 'Request failed',
      details: [],
      requestId: 'request-id',
      timestamp: '2026-07-23T12:00:00.000Z',
      path: '/api/v1/admin/quizzes/results',
    },
  };
}

describe('administrative results and ranking', () => {
  it('renders completed and active results with Bearer authentication', async () => {
    let authorization: string | null = null;
    server.use(
      http.get(resultsUrl, ({ request }) => {
        authorization = request.headers.get('Authorization');
        return HttpResponse.json(adminQuizResultsFixture);
      }),
    );
    renderAdminRoute(`/admin/quizzes/${adminQuizDetailFixture.id}/results`);

    expect(
      await screen.findByRole('row', { name: /Bryger Completada 1\/1 100%/ }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('row', {
        name: /Grace En curso Pendiente Pendiente/,
      }),
    ).toBeInTheDocument();
    expect(authorization).toBe(`Bearer ${loginFixture.accessToken}`);
  });

  it('uses backend metadata to change result pages and synchronize the URL', async () => {
    const requestedPages: string[] = [];
    server.use(
      http.get(resultsUrl, ({ request }) => {
        const requestedPage =
          new URL(request.url).searchParams.get('page') ?? '1';
        requestedPages.push(requestedPage);
        return HttpResponse.json({
          ...adminQuizResultsFixture,
          meta: {
            ...adminQuizResultsFixture.meta,
            page: Number(requestedPage),
            total: 21,
            totalPages: 2,
          },
        });
      }),
    );
    const router = renderAdminRoute(
      `/admin/quizzes/${adminQuizDetailFixture.id}/results`,
    );

    await userEvent.click(
      await screen.findByRole('button', { name: 'Siguiente' }),
    );

    await waitFor(() => expect(router.state.location.search).toBe('?page=2'));
    expect(requestedPages.at(-1)).toBe('2');
    expect(await screen.findByText(/Página 2 de 2/)).toBeInTheDocument();
  });

  it('supports empty results and recoverable errors', async () => {
    let attempts = 0;
    server.use(
      http.get(resultsUrl, () => {
        attempts += 1;
        if (attempts === 1) {
          return HttpResponse.json(apiError(), { status: 500 });
        }
        return HttpResponse.json({
          data: [],
          meta: { page: 1, pageSize: 20, total: 0, totalPages: 0 },
        });
      }),
    );
    renderAdminRoute(`/admin/quizzes/${adminQuizDetailFixture.id}/results`);

    await userEvent.click(
      await screen.findByRole('button', { name: 'Reintentar' }),
    );

    expect(
      await screen.findByText('Todavía no hay participaciones'),
    ).toBeInTheDocument();
    expect(attempts).toBe(2);
  });

  it('renders the administrative ranking and navigates to results', async () => {
    let authorization: string | null = null;
    server.use(
      http.get(rankingUrl, ({ request }) => {
        authorization = request.headers.get('Authorization');
        return HttpResponse.json({
          ...rankingFixture,
          quizPublicId: adminQuizDetailFixture.publicId,
        });
      }),
    );
    const router = renderAdminRoute(
      `/admin/quizzes/${adminQuizDetailFixture.id}/ranking`,
    );

    expect(
      await screen.findByRole('row', { name: /#1 Bryger 1\/1 100%/ }),
    ).toBeInTheDocument();
    expect(authorization).toBe(`Bearer ${loginFixture.accessToken}`);

    await userEvent.click(screen.getByRole('link', { name: 'Ver resultados' }));
    expect(router.state.location.pathname).toBe(
      `/admin/quizzes/${adminQuizDetailFixture.id}/results`,
    );
  });

  it('renders an empty administrative ranking', async () => {
    server.use(
      http.get(rankingUrl, () =>
        HttpResponse.json({
          quizPublicId: adminQuizDetailFixture.publicId,
          generatedAt: '2026-07-23T12:00:00.000Z',
          entries: [],
        }),
      ),
    );
    renderAdminRoute(`/admin/quizzes/${adminQuizDetailFixture.id}/ranking`);

    expect(
      await screen.findByText('Todavía no hay posiciones'),
    ).toBeInTheDocument();
  });

  it('clears the administrative session after a results 401', async () => {
    server.use(
      http.get(resultsUrl, () =>
        HttpResponse.json(apiError('UNAUTHORIZED'), { status: 401 }),
      ),
    );
    const router = renderAdminRoute(
      `/admin/quizzes/${adminQuizDetailFixture.id}/results`,
    );

    expect(
      await screen.findByRole('heading', { name: 'Iniciar sesión' }),
    ).toBeInTheDocument();
    expect(router.state.location.pathname).toBe('/admin/login');
  });
});
