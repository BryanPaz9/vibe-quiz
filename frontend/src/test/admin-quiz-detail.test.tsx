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
  loginFixture,
} from '@/mocks/fixtures';
import { server } from '@/mocks/server';
import type { QuizContentInput } from '@/shared/types/api';

const detailUrl = `http://localhost:3000/api/v1/admin/quizzes/${adminQuizDetailFixture.id}`;

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

describe('administrative quiz detail and editing', () => {
  it('loads the administrative contract with Bearer and pre-fills a draft', async () => {
    let authorization: string | null = null;
    server.use(
      http.get(detailUrl, ({ request }) => {
        authorization = request.headers.get('Authorization');
        return HttpResponse.json(adminQuizDetailFixture);
      }),
    );
    renderDetail();

    expect(await screen.findByLabelText('Título')).toHaveValue(
      adminQuizDetailFixture.title,
    );
    expect(screen.getByLabelText('Texto de la pregunta')).toHaveValue(
      adminQuizDetailFixture.questions[0].text,
    );
    expect(
      screen.getByLabelText('Marcar opción 1 como correcta'),
    ).toBeChecked();
    expect(authorization).toBe(`Bearer ${loginFixture.accessToken}`);
  });

  it('replaces the complete draft and shows confirmation', async () => {
    let submitted: QuizContentInput | null = null;
    server.use(
      http.put(detailUrl, async ({ request }) => {
        submitted = (await request.json()) as QuizContentInput;
        return HttpResponse.json({
          ...adminQuizDetailFixture,
          title: submitted.title,
          updatedAt: '2026-07-23T18:00:00.000Z',
        });
      }),
    );
    renderDetail();
    const user = userEvent.setup();

    const title = await screen.findByLabelText('Título');
    await user.clear(title);
    await user.type(title, 'Fundamentos actualizados');
    await user.click(screen.getByRole('button', { name: 'Guardar cambios' }));

    expect(
      await screen.findByText('Los cambios se guardaron correctamente.'),
    ).toBeInTheDocument();
    expect(submitted).toMatchObject({
      title: 'Fundamentos actualizados',
      description: adminQuizDetailFixture.description,
      questions: [
        {
          text: adminQuizDetailFixture.questions[0].text,
          position: 1,
        },
      ],
    });
  });

  it('renders a published quiz as read-only', async () => {
    server.use(
      http.get(detailUrl, () =>
        HttpResponse.json({
          ...adminQuizDetailFixture,
          status: 'PUBLISHED',
          publishedAt: '2026-07-23T15:00:00.000Z',
        }),
      ),
    );
    renderDetail();

    expect(
      await screen.findByText(
        'Este cuestionario no puede editarse porque ya no está en borrador.',
      ),
    ).toBeInTheDocument();
    expect(screen.queryByLabelText('Título')).not.toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: 'Guardar cambios' }),
    ).not.toBeInTheDocument();
    expect(screen.getByText('Correcta')).toBeInTheDocument();
    expect(screen.getAllByText('Publicado')).toHaveLength(2);
  });

  it('retries a recoverable detail error', async () => {
    let attempts = 0;
    server.use(
      http.get(detailUrl, () => {
        attempts += 1;
        return attempts === 1
          ? HttpResponse.json(apiError('INTERNAL_ERROR'), { status: 500 })
          : HttpResponse.json(adminQuizDetailFixture);
      }),
    );
    renderDetail();

    await userEvent.click(
      await screen.findByRole('button', { name: 'Reintentar' }),
    );

    expect(await screen.findByLabelText('Título')).toHaveValue(
      adminQuizDetailFixture.title,
    );
    expect(attempts).toBe(2);
  });

  it('preserves draft values after an update conflict', async () => {
    server.use(
      http.put(detailUrl, () =>
        HttpResponse.json(apiError('QUIZ_NOT_EDITABLE'), { status: 409 }),
      ),
    );
    renderDetail();
    const user = userEvent.setup();

    const title = await screen.findByLabelText('Título');
    await user.clear(title);
    await user.type(title, 'Cambio local');
    await user.click(screen.getByRole('button', { name: 'Guardar cambios' }));

    expect(
      await screen.findByText('No fue posible guardar el cuestionario'),
    ).toBeInTheDocument();
    expect(screen.getByLabelText('Título')).toHaveValue('Cambio local');
  });

  it('clears the session after an administrative 401', async () => {
    server.use(
      http.get(detailUrl, () =>
        HttpResponse.json(apiError('UNAUTHORIZED'), { status: 401 }),
      ),
    );
    const router = renderDetail();

    expect(
      await screen.findByRole('heading', { name: 'Iniciar sesión' }),
    ).toBeInTheDocument();
    await waitFor(() =>
      expect(router.state.location.pathname).toBe('/admin/login'),
    );
  });
});
