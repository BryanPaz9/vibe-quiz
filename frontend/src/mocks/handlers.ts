import { http, HttpResponse } from 'msw';
import {
  adminFixture,
  adminQuizDetailFixture,
  adminQuizListFixture,
  adminQuizResultsFixture,
  loginFixture,
  participationFixture,
  participationResultFixture,
  publicQuizFixture,
  rankingFixture,
} from './fixtures';
import type {
  LoginRequest,
  QuizContentInput,
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
  http.get(`${baseUrl}/admin/quizzes`, ({ request }) => {
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
            path: '/api/v1/admin/quizzes',
          },
        },
        { status: 401 },
      );
    }
    return HttpResponse.json(adminQuizListFixture);
  }),
  http.post(`${baseUrl}/admin/quizzes`, async ({ request }) => {
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
            path: '/api/v1/admin/quizzes',
          },
        },
        { status: 401 },
      );
    }
    const body = (await request.json()) as QuizContentInput;
    return HttpResponse.json(
      {
        ...adminQuizDetailFixture,
        title: body.title,
        description: body.description ?? null,
        questions: body.questions.map((question, questionIndex) => ({
          ...question,
          id: `question-${questionIndex + 1}`,
          options: question.options.map((option, optionIndex) => ({
            ...option,
            id: `option-${questionIndex + 1}-${optionIndex + 1}`,
          })),
        })),
      },
      { status: 201 },
    );
  }),
  http.get(
    `${baseUrl}/admin/quizzes/${adminQuizDetailFixture.id}`,
    ({ request }) => {
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
              path: `/api/v1/admin/quizzes/${adminQuizDetailFixture.id}`,
            },
          },
          { status: 401 },
        );
      }
      return HttpResponse.json(adminQuizDetailFixture);
    },
  ),
  http.put(
    `${baseUrl}/admin/quizzes/${adminQuizDetailFixture.id}`,
    async ({ request }) => {
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
              path: `/api/v1/admin/quizzes/${adminQuizDetailFixture.id}`,
            },
          },
          { status: 401 },
        );
      }
      const body = (await request.json()) as QuizContentInput;
      return HttpResponse.json({
        ...adminQuizDetailFixture,
        title: body.title,
        description: body.description ?? null,
        questions: body.questions.map((question, questionIndex) => ({
          ...question,
          id: `updated-question-${questionIndex + 1}`,
          options: question.options.map((option, optionIndex) => ({
            ...option,
            id: `updated-option-${questionIndex + 1}-${optionIndex + 1}`,
          })),
        })),
        updatedAt: '2026-07-23T18:00:00.000Z',
      });
    },
  ),
  http.get(
    `${baseUrl}/admin/quizzes/${adminQuizDetailFixture.id}/results`,
    ({ request }) => {
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
              path: `/api/v1/admin/quizzes/${adminQuizDetailFixture.id}/results`,
            },
          },
          { status: 401 },
        );
      }
      return HttpResponse.json(adminQuizResultsFixture);
    },
  ),
  http.get(
    `${baseUrl}/admin/quizzes/${adminQuizDetailFixture.id}/ranking`,
    ({ request }) => {
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
              path: `/api/v1/admin/quizzes/${adminQuizDetailFixture.id}/ranking`,
            },
          },
          { status: 401 },
        );
      }
      return HttpResponse.json({
        ...rankingFixture,
        quizPublicId: adminQuizDetailFixture.publicId,
      });
    },
  ),
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
