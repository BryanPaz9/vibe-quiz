import { http, HttpResponse } from 'msw';
import {
  participationFixture,
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
  http.get(
    `${baseUrl}/public/quizzes/${publicQuizFixture.publicId}/ranking`,
    () => HttpResponse.json(rankingFixture),
  ),
];
