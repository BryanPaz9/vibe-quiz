import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { delay, http, HttpResponse } from 'msw';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { appRoutes } from '@/app/router';
import {
  getParticipationAnswers,
  saveParticipationSession,
} from '@/features/participation/session/participation-session';
import {
  participationFixture,
  participationResultFixture,
  publicQuizFixture,
} from '@/mocks/fixtures';
import { server } from '@/mocks/server';
import type { SubmitParticipationRequest } from '@/shared/types/api';

function storeActiveParticipation(): void {
  saveParticipationSession({
    participationId: participationFixture.participationId,
    participationToken: participationFixture.participationToken,
    quizPublicId: publicQuizFixture.publicId,
    alias: participationFixture.alias,
    startedAt: participationFixture.startedAt,
    quiz: publicQuizFixture,
  });
}

function renderPlay() {
  const router = createMemoryRouter(appRoutes, {
    initialEntries: [`/quiz/${publicQuizFixture.publicId}/play`],
  });
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });
  const view = render(
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>,
  );
  return { router, ...view };
}

describe('public quiz resolution', () => {
  it('requires an active participation', async () => {
    renderPlay();

    expect(
      await screen.findByRole('heading', { name: 'No hay un intento activo' }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: 'Finalizar cuestionario' }),
    ).not.toBeInTheDocument();
  });

  it('renders ordered questions and public options without correctness marks', () => {
    storeActiveParticipation();
    renderPlay();

    expect(
      screen.getByRole('heading', { name: publicQuizFixture.title }),
    ).toBeInTheDocument();
    expect(screen.getByRole('timer')).toHaveAccessibleName(
      /Tiempo transcurrido:/,
    );
    expect(
      screen.getByRole('group', { name: /¿Qué significa IA\?/ }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('radio', { name: 'Inteligencia Artificial' }),
    ).toBeInTheDocument();
    expect(screen.queryByText(/isCorrect/i)).not.toBeInTheDocument();
  });

  it('prevents an incomplete submission', async () => {
    const user = userEvent.setup();
    storeActiveParticipation();
    renderPlay();

    await user.click(
      screen.getByRole('button', { name: 'Finalizar cuestionario' }),
    );

    expect(
      await screen.findByText('Responde todas las preguntas antes de enviar.'),
    ).toBeInTheDocument();
  });

  it('restores selected answers after remounting the player', async () => {
    const user = userEvent.setup();
    storeActiveParticipation();
    const firstView = renderPlay();
    const correctOption = screen.getByRole('radio', {
      name: 'Inteligencia Artificial',
    });

    await user.click(correctOption);
    expect(
      getParticipationAnswers(participationFixture.participationId),
    ).toEqual({
      [publicQuizFixture.questions[0]!.id]:
        publicQuizFixture.questions[0]!.options[0]!.id,
    });

    firstView.unmount();
    renderPlay();
    expect(
      screen.getByRole('radio', { name: 'Inteligencia Artificial' }),
    ).toBeChecked();
  });

  it('submits once with the Participation token and navigates to result', async () => {
    let requestCount = 0;
    server.use(
      http.post(
        `http://localhost:3000/api/v1/participations/${participationFixture.participationId}/submissions`,
        async ({ request }) => {
          requestCount += 1;
          expect(request.headers.get('Authorization')).toBe(
            `Participation ${participationFixture.participationToken}`,
          );
          const body = (await request.json()) as SubmitParticipationRequest;
          expect(body.answers).toEqual([
            {
              questionId: publicQuizFixture.questions[0]!.id,
              optionId: publicQuizFixture.questions[0]!.options[0]!.id,
            },
          ]);
          await delay(100);
          return HttpResponse.json(participationResultFixture, {
            status: 201,
          });
        },
      ),
    );
    const user = userEvent.setup();
    storeActiveParticipation();
    const { router } = renderPlay();

    await user.click(
      screen.getByRole('radio', { name: 'Inteligencia Artificial' }),
    );
    const submitButton = screen.getByRole('button', {
      name: 'Finalizar cuestionario',
    });
    await user.click(submitButton);

    await waitFor(() => expect(submitButton).toBeDisabled());
    await user.click(submitButton);
    expect(
      await screen.findByRole('heading', { name: 'Tu resultado' }),
    ).toBeInTheDocument();
    expect(requestCount).toBe(1);
    expect(router.state.location.pathname).toBe(
      `/quiz/${publicQuizFixture.publicId}/result/${participationFixture.participationId}`,
    );
  });

  it('keeps answers after a recoverable server error', async () => {
    server.use(
      http.post(
        `http://localhost:3000/api/v1/participations/${participationFixture.participationId}/submissions`,
        () =>
          HttpResponse.json(
            {
              error: {
                code: 'INCOMPLETE_SUBMISSION',
                message: 'Every question must be answered exactly once',
                details: [],
                requestId: 'request-id',
                timestamp: '2026-07-23T12:00:00.000Z',
                path: `/api/v1/participations/${participationFixture.participationId}/submissions`,
              },
            },
            { status: 400 },
          ),
      ),
    );
    const user = userEvent.setup();
    storeActiveParticipation();
    renderPlay();

    const selectedOption = screen.getByRole('radio', {
      name: 'Inteligencia Artificial',
    });
    await user.click(selectedOption);
    await user.click(
      screen.getByRole('button', { name: 'Finalizar cuestionario' }),
    );

    expect(
      await screen.findByText(
        'El servidor indicó que faltan respuestas. Revisa el cuestionario.',
      ),
    ).toBeInTheDocument();
    expect(selectedOption).toBeChecked();
  });
});
