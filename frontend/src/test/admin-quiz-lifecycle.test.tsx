import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { http, HttpResponse } from 'msw';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { appRoutes } from '@/app/router';
import { setAdminSession } from '@/features/auth/session/admin-session';
import {
  adminFixture,
  adminQuizDetailFixture,
  loginFixture,
  publishQuizFixture,
} from '@/mocks/fixtures';
import { server } from '@/mocks/server';

const detailUrl = `http://localhost:3000/api/v1/admin/quizzes/${adminQuizDetailFixture.id}`;
const publishUrl = `${detailUrl}/publish`;
const closeUrl = `${detailUrl}/close`;

function renderDetail() {
  setAdminSession({
    accessToken: loginFixture.accessToken,
    admin: adminFixture,
    expiresAt: Date.now() + 3_600_000,
  });
  const router = createMemoryRouter(appRoutes, {
    initialEntries: [`/admin/quizzes/${adminQuizDetailFixture.id}`],
  });
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

function apiError(code: string) {
  return {
    error: {
      code,
      message: 'Request failed',
      details: [],
      requestId: 'request-id',
      timestamp: '2026-07-23T12:00:00.000Z',
      path: `/api/v1/admin/quizzes/${adminQuizDetailFixture.id}`,
    },
  };
}

describe('administrative quiz lifecycle', () => {
  it('publishes a draft after confirmation and exposes its public URL', async () => {
    let authorization: string | null = null;
    server.use(
      http.post(publishUrl, ({ request }) => {
        authorization = request.headers.get('Authorization');
        return HttpResponse.json(publishQuizFixture);
      }),
    );
    renderDetail();
    const user = userEvent.setup();

    await user.click(
      await screen.findByRole('button', { name: 'Publicar cuestionario' }),
    );
    expect(
      screen.getByRole('dialog', { name: '¿Publicar cuestionario?' }),
    ).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Publicar' }));

    expect(
      await screen.findByRole('link', {
        name: `http://localhost:3000/quiz/${adminQuizDetailFixture.publicId}`,
      }),
    ).toBeInTheDocument();
    expect(authorization).toBe(`Bearer ${loginFixture.accessToken}`);
    expect(screen.queryByLabelText('Título')).not.toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Cerrar cuestionario' }),
    ).toBeInTheDocument();
  });

  it('copies the public URL from a published quiz', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: { writeText },
    });
    server.use(
      http.get(detailUrl, () =>
        HttpResponse.json({
          ...adminQuizDetailFixture,
          status: 'PUBLISHED',
          publishedAt: publishQuizFixture.publishedAt,
        }),
      ),
    );
    renderDetail();

    await userEvent.click(
      await screen.findByRole('button', { name: 'Copiar enlace' }),
    );

    expect(writeText).toHaveBeenCalledWith(
      `http://localhost:3000/quiz/${adminQuizDetailFixture.publicId}`,
    );
    expect(await screen.findByText('Enlace copiado.')).toBeInTheDocument();
  });

  it('closes a published quiz and refreshes its server state', async () => {
    let status: 'PUBLISHED' | 'CLOSED' = 'PUBLISHED';
    server.use(
      http.get(detailUrl, () =>
        HttpResponse.json({
          ...adminQuizDetailFixture,
          status,
          publishedAt: publishQuizFixture.publishedAt,
          closedAt: status === 'CLOSED' ? '2026-07-23T16:00:00.000Z' : null,
        }),
      ),
      http.post(closeUrl, ({ request }) => {
        expect(request.headers.get('Authorization')).toBe(
          `Bearer ${loginFixture.accessToken}`,
        );
        status = 'CLOSED';
        return HttpResponse.json({ status });
      }),
    );
    renderDetail();
    const user = userEvent.setup();

    await user.click(
      await screen.findByRole('button', { name: 'Cerrar cuestionario' }),
    );
    await user.click(
      within(screen.getByRole('dialog')).getByRole('button', {
        name: 'Cerrar cuestionario',
      }),
    );

    expect(
      await screen.findByText(
        'El cuestionario está cerrado y ya no admite nuevas participaciones.',
      ),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: 'Copiar enlace' }),
    ).not.toBeInTheDocument();
  });

  it('deletes an eligible draft and returns to the list', async () => {
    let authorization: string | null = null;
    server.use(
      http.delete(detailUrl, ({ request }) => {
        authorization = request.headers.get('Authorization');
        return new HttpResponse(null, { status: 204 });
      }),
    );
    const router = renderDetail();
    const user = userEvent.setup();

    await user.click(
      await screen.findByRole('button', { name: 'Eliminar borrador' }),
    );
    await user.click(
      screen.getByRole('button', { name: 'Eliminar definitivamente' }),
    );

    await waitFor(() =>
      expect(router.state.location.pathname).toBe('/admin/quizzes'),
    );
    expect(authorization).toBe(`Bearer ${loginFixture.accessToken}`);
  });

  it('keeps the draft available when deletion is rejected', async () => {
    server.use(
      http.delete(detailUrl, () =>
        HttpResponse.json(apiError('QUIZ_NOT_DELETABLE'), { status: 409 }),
      ),
    );
    renderDetail();
    const user = userEvent.setup();

    await user.click(
      await screen.findByRole('button', { name: 'Eliminar borrador' }),
    );
    await user.click(
      screen.getByRole('button', { name: 'Eliminar definitivamente' }),
    );

    expect(
      await screen.findByText('No fue posible eliminar el cuestionario'),
    ).toBeInTheDocument();
    expect(screen.getByLabelText('Título')).toHaveValue(
      adminQuizDetailFixture.title,
    );
  });

  it('clears the session when a lifecycle action receives a 401', async () => {
    server.use(
      http.post(publishUrl, () =>
        HttpResponse.json(apiError('UNAUTHORIZED'), { status: 401 }),
      ),
    );
    const router = renderDetail();
    const user = userEvent.setup();

    await user.click(
      await screen.findByRole('button', { name: 'Publicar cuestionario' }),
    );
    await user.click(screen.getByRole('button', { name: 'Publicar' }));

    expect(
      await screen.findByRole('heading', { name: 'Iniciar sesión' }),
    ).toBeInTheDocument();
    await waitFor(() =>
      expect(router.state.location.pathname).toBe('/admin/login'),
    );
  });
});
