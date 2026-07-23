import { http, HttpResponse } from 'msw';
import {
  participationFixture,
  participationResultFixture,
  publicQuizFixture,
  rankingFixture,
} from './fixtures';
import type { StartParticipationRequest } from '@/shared/types/api';

const baseUrl = 'http://localhost:3000/api/v1';

export const handlers = [
  http.get(`${baseUrl}/health/live`, () => HttpResponse.json({ status: 'ok' })),
  http.get(`${baseUrl}/public/quizzes/${publicQuizFixture.publicId}`, () =>
    HttpResponse.json(publicQuizFixture),
  ),
  http.post(
    `${baseUrl}/public/quizzes/${publicQuizFixture.publicId}/participations`,
    async ({ request }) => {
      const body = (await request.json()) as StartParticipationRequest;
      return HttpResponse.json(
        { ...participationFixture, alias: body.alias },
        { status: 201 },
      );
    },
  ),
  http.post(
    `${baseUrl}/participations/${participationFixture.participationId}/submissions`,
    ({ request }) => {
      if (
        request.headers.get('Authorization') !==
        `Participation ${participationFixture.participationToken}`
      ) {
        return HttpResponse.json(
          {
            error: {
              code: 'INVALID_PARTICIPATION_TOKEN',
              message: 'Invalid participation token',
              details: [],
              requestId: 'request-id',
              timestamp: '2026-07-23T12:00:00.000Z',
              path: `/api/v1/participations/${participationFixture.participationId}/submissions`,
            },
          },
          { status: 401 },
        );
      }
      return HttpResponse.json(participationResultFixture, { status: 201 });
    },
  ),
  http.get(
    `${baseUrl}/participations/${participationFixture.participationId}/result`,
    ({ request }) => {
      if (
        request.headers.get('Authorization') !==
        `Participation ${participationFixture.participationToken}`
      ) {
        return HttpResponse.json(
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
        );
      }
      return HttpResponse.json(participationResultFixture);
    },
  ),
  http.get(
    `${baseUrl}/public/quizzes/${publicQuizFixture.publicId}/ranking`,
    () => HttpResponse.json(rankingFixture),
  ),
];
