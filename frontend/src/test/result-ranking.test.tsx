import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen } from '@testing-library/react';
import { http, HttpResponse } from 'msw';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { appRoutes } from '@/app/router';
import {
  getParticipationSessionByQuiz,
  saveParticipationSession,
} from '@/features/participation/session/participation-session';
import {
  participationFixture,
  publicQuizFixture,
  rankingFixture,
} from '@/mocks/fixtures';
import { server } from '@/mocks/server';

function storeCompletedParticipation(): void {
  saveParticipationSession({
    participationId: participationFixture.participationId,
    participationToken: participationFixture.participationToken,
    quizPublicId: publicQuizFixture.publicId,
    alias: participationFixture.alias,
    quiz: publicQuizFixture,
    status: 'COMPLETED',
  });
}

function renderRoute(path: string) {
  const router = createMemoryRouter(appRoutes, { initialEntries: [path] });
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return render(
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>,
  );
}

describe('public result', () => {
  it('requires the participation token from the current tab', async () => {
    renderRoute(
      `/quiz/${publicQuizFixture.publicId}/result/${participationFixture.participationId}`,
    );

    expect(
      await screen.findByRole('heading', {
        name: 'No podemos autorizar esta consulta',
      }),
    ).toBeInTheDocument();
  });

  it('renders the authoritative result and marks the attempt completed', async () => {
    saveParticipationSession({
      participationId: participationFixture.participationId,
      participationToken: participationFixture.participationToken,
      quizPublicId: publicQuizFixture.publicId,
      alias: participationFixture.alias,
      quiz: publicQuizFixture,
      status: 'ACTIVE',
    });
    renderRoute(
      `/quiz/${publicQuizFixture.publicId}/result/${participationFixture.participationId}`,
    );

    expect(
      await screen.findByRole('heading', { name: 'Tu resultado' }),
    ).toBeInTheDocument();
    expect(screen.getByLabelText('100 por ciento')).toHaveValue(100);
    expect(screen.getByText('1 de 1')).toBeInTheDocument();
    expect(screen.getByText('42 s')).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: 'Ver tabla de clasificación' }),
    ).toHaveAttribute('href', `/quiz/${publicQuizFixture.publicId}/ranking`);
    expect(
      getParticipationSessionByQuiz(publicQuizFixture.publicId)?.status,
    ).toBe('COMPLETED');
  });

  it('clears a session rejected by the backend', async () => {
    storeCompletedParticipation();
    server.use(
      http.get(
        `http://localhost:3000/api/v1/participations/${participationFixture.participationId}/result`,
        () =>
          HttpResponse.json(
            {
              error: {
                code: 'INVALID_PARTICIPATION_TOKEN',
                message: 'Invalid participation token',
                details: [],
                requestId: 'request-id',
                timestamp: '2026-07-23T12:00:00.000Z',
                path: `/api/v1/participations/${participationFixture.participationId}/result`,
              },
            },
            { status: 401 },
          ),
      ),
    );
    renderRoute(
      `/quiz/${publicQuizFixture.publicId}/result/${participationFixture.participationId}`,
    );

    expect(
      await screen.findByText(
        'La autorización de esta participación ya no es válida.',
      ),
    ).toBeInTheDocument();
    expect(
      getParticipationSessionByQuiz(publicQuizFixture.publicId),
    ).toBeNull();
  });
});

describe('public ranking', () => {
  it('renders completed entries and identifies the current participant', async () => {
    storeCompletedParticipation();
    renderRoute(`/quiz/${publicQuizFixture.publicId}/ranking`);

    expect(
      await screen.findByRole('heading', {
        name: 'Tabla de clasificación',
      }),
    ).toBeInTheDocument();
    expect(
      await screen.findByRole('cell', {
        name: new RegExp(rankingFixture.entries[0]!.alias),
      }),
    ).toBeInTheDocument();
    expect(screen.getByText('Tú')).toBeInTheDocument();
    expect(screen.getByRole('cell', { name: '42 s' })).toBeInTheDocument();
  });

  it('shows an empty state when there are no completed attempts', async () => {
    server.use(
      http.get(
        `http://localhost:3000/api/v1/public/quizzes/${publicQuizFixture.publicId}/ranking`,
        () =>
          HttpResponse.json({
            quizPublicId: publicQuizFixture.publicId,
            generatedAt: rankingFixture.generatedAt,
            entries: [],
          }),
      ),
    );
    renderRoute(`/quiz/${publicQuizFixture.publicId}/ranking`);

    expect(
      await screen.findByText('Todavía no hay resultados'),
    ).toBeInTheDocument();
  });
});
