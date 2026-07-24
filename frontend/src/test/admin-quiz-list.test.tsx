import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { act, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { http, HttpResponse } from 'msw';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { appRoutes } from '@/app/router';
import { setAdminSession } from '@/features/auth/session/admin-session';
import {
  adminFixture,
  adminQuizListFixture,
  loginFixture,
} from '@/mocks/fixtures';
import { server } from '@/mocks/server';

const listUrl = 'http://localhost:3000/api/v1/admin/quizzes';

function renderAdminList(path = '/admin/quizzes') {
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

function errorBody(code = 'INTERNAL_ERROR') {
  return {
    error: {
      code,
      message: 'Request failed',
      details: [],
      requestId: 'request-id',
      timestamp: '2026-07-23T12:00:00.000Z',
      path: '/api/v1/admin/quizzes',
    },
  };
}

describe('administrative quiz list', () => {
  it('renders contract data and sends the Bearer token', async () => {
    let authorization: string | null = null;
    server.use(
      http.get(listUrl, ({ request }) => {
        authorization = request.headers.get('Authorization');
        return HttpResponse.json(adminQuizListFixture);
      }),
    );

    renderAdminList();

    expect(
      await screen.findByRole('link', {
        name: adminQuizListFixture.data[0].title,
      }),
    ).toBeInTheDocument();
    expect(screen.getByRole('cell', { name: 'Borrador' })).toBeInTheDocument();
    expect(screen.getByRole('cell', { name: '3' })).toBeInTheDocument();
    expect(screen.getByRole('cell', { name: '0' })).toBeInTheDocument();
    expect(authorization).toBe(`Bearer ${loginFixture.accessToken}`);
  });

  it('distinguishes an empty list from a search without results', async () => {
    server.use(
      http.get(listUrl, () =>
        HttpResponse.json({
          data: [],
          meta: { page: 1, pageSize: 20, total: 0, totalPages: 0 },
        }),
      ),
    );
    const router = renderAdminList();

    expect(
      await screen.findByText('Todavía no hay cuestionarios'),
    ).toBeInTheDocument();

    await act(() => router.navigate('/admin/quizzes?search=arquitectura'));
    expect(
      await screen.findByText('No se encontraron cuestionarios'),
    ).toBeInTheDocument();
  });

  it('shows a recoverable error and retries the request', async () => {
    let attempts = 0;
    server.use(
      http.get(listUrl, () => {
        attempts += 1;
        return attempts === 1
          ? HttpResponse.json(errorBody(), { status: 500 })
          : HttpResponse.json(adminQuizListFixture);
      }),
    );
    renderAdminList();

    const retry = await screen.findByRole('button', { name: 'Reintentar' });
    await userEvent.click(retry);

    expect(
      await screen.findByRole('link', {
        name: adminQuizListFixture.data[0].title,
      }),
    ).toBeInTheDocument();
    expect(attempts).toBe(2);
  });

  it('synchronizes search and status with the URL and resets the page', async () => {
    const requestedUrls: string[] = [];
    server.use(
      http.get(listUrl, ({ request }) => {
        requestedUrls.push(request.url);
        return HttpResponse.json(adminQuizListFixture);
      }),
    );
    const router = renderAdminList('/admin/quizzes?page=3');
    const user = userEvent.setup();

    await screen.findByText(adminQuizListFixture.data[0].title);
    await user.type(
      screen.getByLabelText('Buscar cuestionarios'),
      'inteligencia artificial',
    );
    await user.click(screen.getByRole('button', { name: 'Buscar' }));

    await waitFor(() =>
      expect(router.state.location.search).toBe(
        '?search=inteligencia+artificial',
      ),
    );
    await user.selectOptions(screen.getByLabelText('Estado'), 'PUBLISHED');

    await waitFor(() =>
      expect(router.state.location.search).toBe(
        '?status=PUBLISHED&search=inteligencia+artificial',
      ),
    );
    expect(requestedUrls.at(-1)).toContain('page=1');
    expect(requestedUrls.at(-1)).toContain('pageSize=20');
    expect(requestedUrls.at(-1)).toContain('status=PUBLISHED');
    expect(requestedUrls.at(-1)).toContain('search=inteligencia+artificial');
  });

  it('changes pages using backend metadata', async () => {
    server.use(
      http.get(listUrl, ({ request }) => {
        const page = Number(new URL(request.url).searchParams.get('page'));
        return HttpResponse.json({
          ...adminQuizListFixture,
          meta: {
            ...adminQuizListFixture.meta,
            page,
            total: 21,
            totalPages: 2,
          },
        });
      }),
    );
    const router = renderAdminList();

    await userEvent.click(
      await screen.findByRole('button', { name: 'Siguiente' }),
    );

    await waitFor(() => expect(router.state.location.search).toBe('?page=2'));
    expect(await screen.findByText(/Página 2 de 2/)).toBeInTheDocument();
  });

  it('navigates to quiz creation and detail placeholders', async () => {
    const router = renderAdminList();
    const user = userEvent.setup();

    await user.click(
      await screen.findByRole('link', { name: 'Crear cuestionario' }),
    );
    expect(router.state.location.pathname).toBe('/admin/quizzes/new');

    await act(() => router.navigate('/admin/quizzes'));
    await user.click(
      await screen.findByRole('link', {
        name: adminQuizListFixture.data[0].title,
      }),
    );
    expect(router.state.location.pathname).toBe(
      `/admin/quizzes/${adminQuizListFixture.data[0].id}`,
    );
  });

  it('clears the session and redirects to login after an administrative 401', async () => {
    server.use(
      http.get(listUrl, () =>
        HttpResponse.json(errorBody('UNAUTHORIZED'), { status: 401 }),
      ),
    );
    const router = renderAdminList();

    expect(
      await screen.findByRole('heading', { name: 'Iniciar sesión' }),
    ).toBeInTheDocument();
    expect(router.state.location.pathname).toBe('/admin/login');
  });
});
