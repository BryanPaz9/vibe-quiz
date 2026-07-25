import type {
  AdminQuizResultsResponse,
  AdminQuizDetail,
  AdminIdentity,
  LoginResponse,
  PublishQuizResponse,
  QuizListResponse,
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

export const adminQuizListFixture: QuizListResponse = {
  data: [
    {
      id: '66666666-6666-4666-8666-666666666666',
      publicId: '77777777-7777-4777-8777-777777777777',
      title: 'Fundamentos de IA',
      description: 'Evaluación corta',
      status: 'DRAFT',
      questionCount: 3,
      participationCount: 0,
      createdAt: '2026-07-22T12:00:00.000Z',
      updatedAt: '2026-07-23T14:30:00.000Z',
    },
  ],
  meta: {
    page: 1,
    pageSize: 20,
    total: 1,
    totalPages: 1,
  },
};

export const adminQuizDetailFixture: AdminQuizDetail = {
  id: adminQuizListFixture.data[0].id,
  publicId: adminQuizListFixture.data[0].publicId,
  title: adminQuizListFixture.data[0].title,
  description: adminQuizListFixture.data[0].description,
  status: 'DRAFT',
  questions: [
    {
      id: '88888888-8888-4888-8888-888888888888',
      text: '¿Qué significa IA?',
      position: 1,
      options: [
        {
          id: '99999999-9999-4999-8999-999999999999',
          text: 'Inteligencia Artificial',
          position: 1,
          isCorrect: true,
        },
        {
          id: 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb',
          text: 'Interfaz Abierta',
          position: 2,
          isCorrect: false,
        },
      ],
    },
  ],
  createdAt: adminQuizListFixture.data[0].createdAt,
  updatedAt: adminQuizListFixture.data[0].updatedAt,
  publishedAt: null,
  closedAt: null,
};

export const publishQuizFixture: PublishQuizResponse = {
  id: adminQuizDetailFixture.id,
  publicId: adminQuizDetailFixture.publicId,
  status: 'PUBLISHED',
  publishedAt: '2026-07-23T15:00:00.000Z',
  publicUrlPath: `/quiz/${adminQuizDetailFixture.publicId}`,
};

export const adminQuizResultsFixture: AdminQuizResultsResponse = {
  data: [
    {
      alias: 'Bryger',
      status: 'COMPLETED',
      score: 1,
      totalQuestions: 1,
      percentage: 100,
      startedAt: '2026-07-22T12:00:00.000Z',
      completedAt: '2026-07-22T12:00:42.000Z',
      durationMs: 42_000,
    },
    {
      alias: 'Grace',
      status: 'ACTIVE',
      score: null,
      totalQuestions: null,
      percentage: null,
      startedAt: '2026-07-22T12:05:00.000Z',
      completedAt: null,
      durationMs: null,
    },
  ],
  meta: {
    page: 1,
    pageSize: 20,
    total: 2,
    totalPages: 1,
  },
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
      alias: 'Bryger',
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
  alias: 'Bryger',
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
  answers: [
    {
      questionId: publicQuizFixture.questions[0].id,
      questionText: publicQuizFixture.questions[0].text,
      position: publicQuizFixture.questions[0].position,
      selectedOption: {
        id: publicQuizFixture.questions[0].options[0].id,
        text: publicQuizFixture.questions[0].options[0].text,
      },
      correctOption: {
        id: publicQuizFixture.questions[0].options[0].id,
        text: publicQuizFixture.questions[0].options[0].text,
      },
      isCorrect: true,
    },
  ],
};
