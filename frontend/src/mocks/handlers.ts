import { http, HttpResponse } from 'msw';
import {
  adminFixture,
  loginFixture,
  participationFixture,
  participationResultFixture,
  publicQuizFixture,
  rankingFixture,
} from './fixtures';
import type {
  LoginRequest,
  StartParticipationRequest,
} from '@/shared/types/api';

const baseUrl = 'http://localhost:3000/api/v1';

export const handlers = [
  http.get(`${baseUrl}/health/live`, () => HttpResponse.json({ status: 'ok' })),
  http.post(`${baseUrl}/auth/login`, async ({ request }) => {
    const body = (await request.json()) as LoginRequest;
    if (
      body.email !== adminFixture.email ||
      body.password !== 'correct-password'
    ) {
      return HttpResponse.json(
        {
          error: {
            code: 'INVALID_CREDENTIALS',
            message: 'Invalid credentials',
            details: [],
            requestId: 'request-id',
            timestamp: '2026-07-23T12:00:00.000Z',
            path: '/api/v1/auth/login',
          },
        },
        { status: 401 },
      );
    }
    return HttpResponse.json(loginFixture);
  }),
  http.get(`${baseUrl}/auth/me`, ({ request }) => {
    if (
      request.headers.get('Authorization') !==
      `Bearer ${loginFixture.accessToken}`
    ) {
      return HttpResponse.json(
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
      );
    }
    return HttpResponse.json(adminFixture);
  }),
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
