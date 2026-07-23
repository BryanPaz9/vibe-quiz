import { http, HttpResponse } from 'msw';
import { publicQuizFixture, rankingFixture } from './fixtures';

const baseUrl = 'http://localhost:3000/api/v1';

export const handlers = [
  http.get(`${baseUrl}/health/live`, () => HttpResponse.json({ status: 'ok' })),
  http.get(`${baseUrl}/public/quizzes/${publicQuizFixture.publicId}`, () =>
    HttpResponse.json(publicQuizFixture),
  ),
  http.get(
    `${baseUrl}/public/quizzes/${publicQuizFixture.publicId}/ranking`,
    () => HttpResponse.json(rankingFixture),
  ),
];
