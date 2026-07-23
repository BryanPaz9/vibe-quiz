import type {
  AdminIdentity,
  LoginResponse,
  PublicQuiz,
  ParticipationResult,
  RankingResponse,
  StartParticipationResponse,
} from '@/shared/types/api';

export const adminFixture: AdminIdentity = {
  id: 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
  email: 'admin@vibequiz.test',
};

export const loginFixture: LoginResponse = {
  accessToken: 'admin-access-token',
  tokenType: 'Bearer',
  expiresIn: 3_600,
  admin: adminFixture,
};

export const publicQuizFixture: PublicQuiz = {
  publicId: '11111111-1111-4111-8111-111111111111',
  title: 'Fundamentos de IA',
  description: 'Evaluación corta',
  questionCount: 1,
  questions: [
    {
      id: '22222222-2222-4222-8222-222222222222',
      text: '¿Qué significa IA?',
      position: 1,
      options: [
        {
          id: '33333333-3333-4333-8333-333333333333',
          text: 'Inteligencia Artificial',
          position: 1,
        },
        {
          id: '44444444-4444-4444-8444-444444444444',
          text: 'Interfaz Abierta',
          position: 2,
        },
      ],
    },
  ],
};

export const rankingFixture: RankingResponse = {
  quizPublicId: publicQuizFixture.publicId,
  generatedAt: '2026-07-22T12:01:00.000Z',
  entries: [
    {
      position: 1,
      alias: 'Ada',
      score: 1,
      totalQuestions: 1,
      percentage: 100,
      durationMs: 42_000,
    },
  ],
};

export const participationFixture: StartParticipationResponse = {
  participationId: '55555555-5555-4555-8555-555555555555',
  participationToken: 'opaque-participation-token',
  quizPublicId: publicQuizFixture.publicId,
  alias: 'Ada',
  startedAt: '2026-07-22T12:00:00.000Z',
};

export const participationResultFixture: ParticipationResult = {
  participationId: participationFixture.participationId,
  alias: participationFixture.alias,
  score: 1,
  totalQuestions: 1,
  percentage: 100,
  durationMs: 42_000,
  completedAt: '2026-07-22T12:00:42.000Z',
};
