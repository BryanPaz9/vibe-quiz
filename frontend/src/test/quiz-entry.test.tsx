import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { http, HttpResponse } from 'msw';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { appRoutes } from '@/app/router';
import { getParticipationSessionByQuiz } from '@/features/participation/session/participation-session';
import { participationFixture, publicQuizFixture } from '@/mocks/fixtures';
import { server } from '@/mocks/server';

function renderEntry(publicId = publicQuizFixture.publicId) {
  const router = createMemoryRouter(appRoutes, {
    initialEntries: [`/quiz/${publicId}`],
  });
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  render(
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>,
  );
  return router;
}

describe('public quiz entry', () => {
  it('shows public metadata without rendering questions', async () => {
    renderEntry();

    expect(
      await screen.findByRole('heading', { name: publicQuizFixture.title }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(publicQuizFixture.description!),
    ).toBeInTheDocument();
    expect(
      screen.queryByText(publicQuizFixture.questions[0]!.text),
    ).not.toBeInTheDocument();
  });

  it('validates that an alias is required', async () => {
    const user = userEvent.setup();
    renderEntry();

    await screen.findByRole('heading', { name: publicQuizFixture.title });
    await user.click(
      screen.getByRole('button', { name: 'Comenzar cuestionario' }),
    );

    expect(
      await screen.findByText('Ingresa un alias para comenzar.'),
    ).toBeInTheDocument();
  });

  it('shows a safe unavailable state for an unpublished quiz', async () => {
    const unavailableId = '99999999-9999-4999-8999-999999999999';
    server.use(
      http.get(
        `http://localhost:3000/api/v1/public/quizzes/${unavailableId}`,
        () =>
          HttpResponse.json(
            {
              error: {
                code: 'QUIZ_NOT_FOUND',
                message: 'Quiz not found',
                details: [],
                requestId: 'request-id',
                timestamp: '2026-07-23T12:00:00.000Z',
                path: `/api/v1/public/quizzes/${unavailableId}`,
              },
            },
            { status: 404 },
          ),
      ),
    );

    renderEntry(unavailableId);

    expect(
      await screen.findByRole('heading', {
        name: 'Cuestionario no disponible',
      }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole('textbox', { name: 'Alias' }),
    ).not.toBeInTheDocument();
  });

  it('starts a participation, stores its token and navigates to play', async () => {
    const user = userEvent.setup();
    const router = renderEntry();

    await screen.findByRole('heading', { name: publicQuizFixture.title });
    await user.type(screen.getByLabelText('Alias'), '  Grace   Hopper  ');
    await user.click(
      screen.getByRole('button', { name: 'Comenzar cuestionario' }),
    );

    expect(
      await screen.findByRole('radio', { name: 'Inteligencia Artificial' }),
    ).toBeInTheDocument();
    expect(router.state.location.pathname).toBe(
      `/quiz/${publicQuizFixture.publicId}/play`,
    );
    expect(getParticipationSessionByQuiz(publicQuizFixture.publicId)).toEqual({
      participationId: participationFixture.participationId,
      participationToken: participationFixture.participationToken,
      quizPublicId: publicQuizFixture.publicId,
      alias: 'Grace Hopper',
      startedAt: participationFixture.startedAt,
      quiz: publicQuizFixture,
      status: 'ACTIVE',
    });
  });

  it('presents an alias conflict as a recoverable error', async () => {
    server.use(
      http.post(
        `http://localhost:3000/api/v1/public/quizzes/${publicQuizFixture.publicId}/participations`,
        () =>
          HttpResponse.json(
            {
              error: {
                code: 'ALIAS_ALREADY_USED',
                message: 'Alias has already been used for this quiz',
                details: [],
                requestId: 'request-id',
                timestamp: '2026-07-23T12:00:00.000Z',
                path: `/api/v1/public/quizzes/${publicQuizFixture.publicId}/participations`,
              },
            },
            { status: 409 },
          ),
      ),
    );
    const user = userEvent.setup();
    renderEntry();

    await screen.findByRole('heading', { name: publicQuizFixture.title });
    await user.type(screen.getByLabelText('Alias'), 'Ada');
    await user.click(
      screen.getByRole('button', { name: 'Comenzar cuestionario' }),
    );

    expect(
      await screen.findByText(
        'Este alias ya fue utilizado en el cuestionario.',
      ),
    ).toBeInTheDocument();
    expect(screen.getByLabelText('Alias')).toHaveValue('Ada');
  });
});
