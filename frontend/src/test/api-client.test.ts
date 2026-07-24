import { http, HttpResponse } from 'msw';
import {
  getAdminSession,
  setAdminSession,
} from '@/features/auth/session/admin-session';
import { server } from '@/mocks/server';
import { apiRequest } from '@/shared/api';
import type { PublicQuiz } from '@/shared/types/api';
import { publicQuizFixture } from '@/mocks/fixtures';

describe('API client', () => {
  it('parses a response derived from the approved public contract', async () => {
    const quiz = await apiRequest<PublicQuiz>(
      `/public/quizzes/${publicQuizFixture.publicId}`,
    );

    expect(quiz).toEqual(publicQuizFixture);
    expect(quiz.questions[0]?.options[0]).not.toHaveProperty('isCorrect');
  });

  it('uses the Bearer scheme for administrative requests', async () => {
    setAdminSession({
      accessToken: 'admin-token',
      admin: { id: 'admin-id', email: 'admin@example.com' },
      expiresAt: Date.now() + 60_000,
    });
    server.use(
      http.get('http://localhost:3000/api/v1/auth/me', ({ request }) => {
        expect(request.headers.get('Authorization')).toBe('Bearer admin-token');
        return HttpResponse.json({
          id: 'admin-id',
          email: 'admin@example.com',
        });
      }),
    );

    await apiRequest('/auth/me', {
      authentication: { kind: 'admin' },
    });
  });

  it('uses the Participation scheme for attempt requests', async () => {
    server.use(
      http.get(
        'http://localhost:3000/api/v1/participations/participation-id/result',
        ({ request }) => {
          expect(request.headers.get('Authorization')).toBe(
            'Participation opaque-token',
          );
          return HttpResponse.json({ participationId: 'participation-id' });
        },
      ),
    );

    await apiRequest('/participations/participation-id/result', {
      authentication: { kind: 'participation', token: 'opaque-token' },
    });
  });

  it('clears the administrative session after a 401', async () => {
    setAdminSession({
      accessToken: 'expired-token',
      admin: { id: 'admin-id', email: 'admin@example.com' },
      expiresAt: Date.now() + 60_000,
    });
    server.use(
      http.get('http://localhost:3000/api/v1/auth/me', () =>
        HttpResponse.json(
          {
            error: {
              code: 'UNAUTHORIZED',
              message: 'Unauthorized',
              details: [],
              requestId: 'request-id',
              timestamp: '2026-07-23T12:00:00.000Z',
              path: '/api/v1/auth/me',
            },
          },
          { status: 401 },
        ),
      ),
    );

    await expect(
      apiRequest('/auth/me', { authentication: { kind: 'admin' } }),
    ).rejects.toMatchObject({ code: 'UNAUTHORIZED', status: 401 });
    expect(getAdminSession()).toBeNull();
    expect(sessionStorage.getItem('vibequiz:admin-session')).toBeNull();
  });
});
