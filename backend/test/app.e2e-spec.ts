import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { hash } from 'bcryptjs';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { GlobalExceptionFilter } from '../src/common/global-exception.filter';
import { PrismaService } from '../src/prisma/prisma.service';

describe('VibeQuiz API', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let token: string;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = module.createNestApplication();
    app.setGlobalPrefix('api/v1');
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );
    app.useGlobalFilters(new GlobalExceptionFilter());
    const document = SwaggerModule.createDocument(
      app,
      new DocumentBuilder()
        .setTitle('VibeQuiz API')
        .setVersion('1.0')
        .addBearerAuth()
        .addApiKey(
          { type: 'apiKey', in: 'header', name: 'Authorization' },
          'participation-token',
        )
        .build(),
    );
    SwaggerModule.setup('api/docs', app, document, {
      jsonDocumentUrl: 'api/docs-json',
    });
    await app.init();

    prisma = app.get(PrismaService);
    await prisma.answer.deleteMany();
    await prisma.participation.deleteMany();
    await prisma.question.deleteMany();
    await prisma.quiz.deleteMany();
    await prisma.admin.deleteMany();
    await prisma.admin.create({
      data: {
        email: 'admin@vibequiz.test',
        passwordHash: await hash('TestPassword123!', 4),
      },
    });
  });

  afterAll(async () => {
    await app.close();
  });

  it('reports liveness and readiness', async () => {
    await request(app.getHttpServer()).get('/api/v1/health/live').expect(200);
    await request(app.getHttpServer()).get('/api/v1/health/ready').expect(200);
  });

  it('exposes the OpenAPI document and protects administration', async () => {
    const docs = await request(app.getHttpServer())
      .get('/api/docs-json')
      .expect(200);
    expect(docs.body.paths['/api/v1/admin/quizzes']).toBeDefined();
    await request(app.getHttpServer()).get('/api/v1/admin/quizzes').expect(401);
  });

  it('authenticates the administrator', async () => {
    const response = await request(app.getHttpServer())
      .post('/api/v1/auth/login')
      .send({
        email: 'admin@vibequiz.test',
        password: 'TestPassword123!',
      })
      .expect(200);
    token = response.body.accessToken as string;
    expect(token).toBeTruthy();
  });

  it('completes the quiz lifecycle without exposing correct answers', async () => {
    const created = await request(app.getHttpServer())
      .post('/api/v1/admin/quizzes')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'AI basics',
        description: 'Demo quiz',
        questions: [
          {
            text: 'What does AI mean?',
            position: 1,
            options: [
              { text: 'Artificial Intelligence', position: 1, isCorrect: true },
              { text: 'Automated Interface', position: 2, isCorrect: false },
            ],
          },
        ],
      })
      .expect(201);

    const quizId = created.body.id as string;
    const publicId = created.body.publicId as string;
    await request(app.getHttpServer())
      .post(`/api/v1/admin/quizzes/${quizId}/publish`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    const publicQuiz = await request(app.getHttpServer())
      .get(`/api/v1/public/quizzes/${publicId}`)
      .expect(200);
    expect(JSON.stringify(publicQuiz.body)).not.toContain('isCorrect');

    const started = await request(app.getHttpServer())
      .post(`/api/v1/public/quizzes/${publicId}/participations`)
      .send({ alias: ' Ada ' })
      .expect(201);
    await request(app.getHttpServer())
      .post(
        `/api/v1/participations/${started.body.participationId as string}/submissions`,
      )
      .set('Authorization', 'Participation invalid')
      .send({
        answers: [
          {
            questionId: '00000000-0000-4000-8000-000000000001',
            optionId: '00000000-0000-4000-8000-000000000002',
          },
        ],
      })
      .expect(401);
    await request(app.getHttpServer())
      .post(`/api/v1/public/quizzes/${publicId}/participations`)
      .send({ alias: 'ada' })
      .expect(409);

    const question = publicQuiz.body.questions[0] as {
      id: string;
      options: Array<{ id: string }>;
    };
    const result = await request(app.getHttpServer())
      .post(
        `/api/v1/participations/${started.body.participationId as string}/submissions`,
      )
      .set(
        'Authorization',
        `Participation ${started.body.participationToken as string}`,
      )
      .send({
        answers: [
          { questionId: question.id, optionId: question.options[0].id },
        ],
      })
      .expect(201);
    expect(result.body).toMatchObject({
      score: 1,
      totalQuestions: 1,
      percentage: 100,
    });

    await request(app.getHttpServer())
      .post(
        `/api/v1/participations/${started.body.participationId as string}/submissions`,
      )
      .set(
        'Authorization',
        `Participation ${started.body.participationToken as string}`,
      )
      .send({
        answers: [
          { questionId: question.id, optionId: question.options[0].id },
        ],
      })
      .expect(409);

    const ranking = await request(app.getHttpServer())
      .get(`/api/v1/public/quizzes/${publicId}/ranking`)
      .expect(200);
    expect(ranking.body.entries).toHaveLength(1);
    expect(ranking.body.entries[0]).toMatchObject({ alias: 'Ada', score: 1 });
  });

  it('rejects blank aliases and invalid pagination', async () => {
    const quiz = await prisma.quiz.findFirstOrThrow({
      where: { status: 'PUBLISHED' },
    });
    await request(app.getHttpServer())
      .post(`/api/v1/public/quizzes/${quiz.publicId}/participations`)
      .send({ alias: '   ' })
      .expect(400);
    await request(app.getHttpServer())
      .get(`/api/v1/admin/quizzes/${quiz.id}/results?page=0&pageSize=101`)
      .set('Authorization', `Bearer ${token}`)
      .expect(400);
  });

  it('rate limits repeated login attempts', async () => {
    const statuses: number[] = [];
    for (let attempt = 0; attempt < 5; attempt += 1) {
      const response = await request(app.getHttpServer())
        .post('/api/v1/auth/login')
        .send({
          email: 'admin@vibequiz.test',
          password: 'wrong-password',
        });
      statuses.push(response.status);
    }
    expect(statuses.at(-1)).toBe(429);
  });
});
