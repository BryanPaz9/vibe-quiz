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

const createUrl = 'http://localhost:3000/api/v1/admin/quizzes';

function renderCreatePage() {
  setAdminSession({
    accessToken: loginFixture.accessToken,
    admin: adminFixture,
    expiresAt: Date.now() + 3_600_000,
  });
  const router = createMemoryRouter(appRoutes, {
    initialEntries: ['/admin/quizzes/new'],
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

async function fillInitialQuestion() {
  const user = userEvent.setup();
  await user.type(screen.getByLabelText('Título'), 'Fundamentos de IA');
  await user.type(
    screen.getByLabelText('Descripción (opcional)'),
    'Evaluación corta',
  );
  await user.type(screen.getByLabelText('Texto de la pregunta'), '¿Qué es IA?');
  await user.type(screen.getByLabelText('Opción 1'), 'Inteligencia Artificial');
  await user.type(screen.getByLabelText('Opción 2'), 'Interfaz Abierta');
  return user;
}

function apiError(code = 'VALIDATION_ERROR') {
  return {
    error: {
      code,
      message: 'Invalid quiz',
      details: [],
      requestId: 'request-id',
      timestamp: '2026-07-23T12:00:00.000Z',
      path: '/api/v1/admin/quizzes',
    },
  };
}

describe('administrative quiz creation', () => {
  it('validates the complete aggregate before contacting the API', async () => {
    let requests = 0;
    server.use(
      http.post(createUrl, () => {
        requests += 1;
        return HttpResponse.json(adminQuizDetailFixture, { status: 201 });
      }),
    );
    renderCreatePage();

    await userEvent.click(
      screen.getByRole('button', { name: 'Crear cuestionario' }),
    );

    expect(
      await screen.findByText('Escribe el título del cuestionario.'),
    ).toBeInTheDocument();
    expect(
      screen.getByText('Escribe el texto de la pregunta.'),
    ).toBeInTheDocument();
    expect(screen.getAllByText('Escribe el texto de la opción.')).toHaveLength(
      2,
    );
    expect(requests).toBe(0);
  });

  it('creates with Bearer authorization, explicit positions and visual order', async () => {
    let authorization: string | null = null;
    let submitted: QuizContentInput | null = null;
    server.use(
      http.post(createUrl, async ({ request }) => {
        authorization = request.headers.get('Authorization');
        submitted = (await request.json()) as QuizContentInput;
        return HttpResponse.json(adminQuizDetailFixture, { status: 201 });
      }),
    );
    const router = renderCreatePage();
    const user = await fillInitialQuestion();

    await user.click(screen.getByLabelText('Marcar opción 2 como correcta'));
    await user.click(screen.getByRole('button', { name: 'Agregar pregunta' }));

    const questions = screen.getAllByLabelText('Texto de la pregunta');
    const firstOptions = screen.getAllByLabelText('Opción 1');
    const secondOptions = screen.getAllByLabelText('Opción 2');
    await user.type(questions[1], '¿Qué es ML?');
    await user.type(firstOptions[1], 'Aprendizaje automático');
    await user.type(secondOptions[1], 'Lenguaje de marcado');
    await user.click(
      screen.getAllByLabelText('Marcar opción 1 como correcta')[1],
    );
    await user.click(
      screen.getAllByRole('button', { name: 'Subir pregunta' })[1],
    );
    await user.click(
      screen.getByRole('button', { name: 'Crear cuestionario' }),
    );

    await waitFor(() =>
      expect(router.state.location.pathname).toBe(
        `/admin/quizzes/${adminQuizDetailFixture.id}`,
      ),
    );
    expect(authorization).toBe(`Bearer ${loginFixture.accessToken}`);
    expect(submitted).toEqual({
      title: 'Fundamentos de IA',
      description: 'Evaluación corta',
      questions: [
        {
          text: '¿Qué es ML?',
          position: 1,
          options: [
            {
              text: 'Aprendizaje automático',
              position: 1,
              isCorrect: true,
            },
            {
              text: 'Lenguaje de marcado',
              position: 2,
              isCorrect: false,
            },
          ],
        },
        {
          text: '¿Qué es IA?',
          position: 2,
          options: [
            {
              text: 'Inteligencia Artificial',
              position: 1,
              isCorrect: false,
            },
            {
              text: 'Interfaz Abierta',
              position: 2,
              isCorrect: true,
            },
          ],
        },
      ],
    });
  }, 10_000);

  it('supports adding, removing and validating options', async () => {
    renderCreatePage();
    const user = await fillInitialQuestion();

    await user.click(screen.getByRole('button', { name: 'Agregar opción' }));
    expect(screen.getByLabelText('Opción 3')).toBeInTheDocument();
    await user.click(
      screen.getAllByRole('button', { name: 'Eliminar opción' })[2],
    );
    expect(screen.queryByLabelText('Opción 3')).not.toBeInTheDocument();

    await user.click(screen.getByLabelText('Marcar opción 2 como correcta'));
    expect(
      screen.getByLabelText('Marcar opción 2 como correcta'),
    ).toBeChecked();
  });

  it('preserves the form after an API error and allows retry', async () => {
    let attempts = 0;
    server.use(
      http.post(createUrl, () => {
        attempts += 1;
        return attempts === 1
          ? HttpResponse.json(apiError(), { status: 400 })
          : HttpResponse.json(adminQuizDetailFixture, { status: 201 });
      }),
    );
    const router = renderCreatePage();
    const user = await fillInitialQuestion();

    await user.click(
      screen.getByRole('button', { name: 'Crear cuestionario' }),
    );
    expect(
      await screen.findByText('No fue posible crear el cuestionario'),
    ).toBeInTheDocument();
    expect(screen.getByLabelText('Título')).toHaveValue('Fundamentos de IA');

    await user.click(
      screen.getByRole('button', { name: 'Crear cuestionario' }),
    );
    await waitFor(() =>
      expect(router.state.location.pathname).toBe(
        `/admin/quizzes/${adminQuizDetailFixture.id}`,
      ),
    );
    expect(attempts).toBe(2);
  });

  it('clears the session and redirects to login after a 401', async () => {
    server.use(
      http.post(createUrl, () =>
        HttpResponse.json(apiError('UNAUTHORIZED'), { status: 401 }),
      ),
    );
    const router = renderCreatePage();
    const user = await fillInitialQuestion();

    await user.click(
      screen.getByRole('button', { name: 'Crear cuestionario' }),
    );

    expect(
      await screen.findByRole('heading', { name: 'Iniciar sesión' }),
    ).toBeInTheDocument();
    expect(router.state.location.pathname).toBe('/admin/login');
  });
});
