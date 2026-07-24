import { HttpStatus, Injectable } from '@nestjs/common';
import { ParticipationStatus, Prisma, QuizStatus } from '@prisma/client';
import { createHash, randomBytes } from 'crypto';
import { ApiError } from '../common/api-error';
import { PrismaService } from '../prisma/prisma.service';
import { ScoringService } from '../scoring/scoring.service';
import { StartParticipationDto } from './dto/start-participation.dto';
import { SubmitParticipationDto } from './dto/submit-participation.dto';

@Injectable()
export class ParticipationsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly scoring: ScoringService,
  ) {}

  normalizeAlias(alias: string): string {
    return alias.trim().replace(/\s+/gu, ' ').normalize('NFKC').toLowerCase();
  }

  private tokenHash(token: string): string {
    return createHash('sha256').update(token, 'utf8').digest('hex');
  }

  async start(publicId: string, dto: StartParticipationDto) {
    const quiz = await this.prisma.quiz.findUnique({ where: { publicId } });
    if (!quiz) {
      throw new ApiError(
        'QUIZ_NOT_FOUND',
        'Quiz not found',
        HttpStatus.NOT_FOUND,
      );
    }
    if (quiz.status !== QuizStatus.PUBLISHED) {
      throw new ApiError(
        'QUIZ_NOT_AVAILABLE',
        'Quiz is not available',
        HttpStatus.CONFLICT,
      );
    }

    const alias = dto.alias.trim().replace(/\s+/gu, ' ');
    const normalizedAlias = this.normalizeAlias(alias);
    const participationToken = randomBytes(32).toString('base64url');

    try {
      const participation = await this.prisma.participation.create({
        data: {
          quizId: quiz.id,
          alias,
          normalizedAlias,
          accessTokenHash: this.tokenHash(participationToken),
        },
      });
      return {
        participationId: participation.id,
        participationToken,
        quizPublicId: quiz.publicId,
        alias: participation.alias,
        startedAt: participation.startedAt,
      };
    } catch (error: unknown) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ApiError(
          'ALIAS_ALREADY_USED',
          'Alias has already been used for this quiz',
          HttpStatus.CONFLICT,
        );
      }
      throw error;
    }
  }

  private extractToken(authorization?: string): string {
    const match = /^Participation ([A-Za-z0-9_-]+)$/u.exec(authorization ?? '');
    if (!match) {
      throw new ApiError(
        'INVALID_PARTICIPATION_TOKEN',
        'Invalid participation token',
        HttpStatus.UNAUTHORIZED,
      );
    }
    return match[1];
  }

  private async authorizedParticipation(id: string, authorization?: string) {
    const token = this.extractToken(authorization);
    const participation = await this.prisma.participation.findUnique({
      where: { id },
    });
    if (
      !participation ||
      participation.accessTokenHash !== this.tokenHash(token)
    ) {
      throw new ApiError(
        'INVALID_PARTICIPATION_TOKEN',
        'Invalid participation token',
        HttpStatus.UNAUTHORIZED,
      );
    }
    return participation;
  }

  async submit(
    id: string,
    authorization: string | undefined,
    dto: SubmitParticipationDto,
  ) {
    const participation = await this.authorizedParticipation(id, authorization);
    if (participation.status === ParticipationStatus.COMPLETED) {
      throw new ApiError(
        'PARTICIPATION_COMPLETED',
        'Participation has already been submitted',
        HttpStatus.CONFLICT,
      );
    }

    const quiz = await this.prisma.quiz.findUnique({
      where: { id: participation.quizId },
      include: {
        questions: {
          include: { options: true },
          orderBy: { position: 'asc' },
        },
      },
    });
    if (!quiz) {
      throw new ApiError(
        'QUIZ_NOT_FOUND',
        'Quiz not found',
        HttpStatus.NOT_FOUND,
      );
    }

    const submittedQuestions = new Set(dto.answers.map((a) => a.questionId));
    if (
      dto.answers.length !== quiz.questions.length ||
      submittedQuestions.size !== quiz.questions.length
    ) {
      throw new ApiError(
        'INCOMPLETE_SUBMISSION',
        'Every question must be answered exactly once',
        HttpStatus.BAD_REQUEST,
      );
    }

    const questions = new Map(quiz.questions.map((q) => [q.id, q]));
    const evaluated = dto.answers.map((answer) => {
      const question = questions.get(answer.questionId);
      const option = question?.options.find(
        (item) => item.id === answer.optionId,
      );
      if (!question || !option) {
        throw new ApiError(
          'INVALID_ANSWER',
          'Answer does not belong to this quiz question',
          HttpStatus.BAD_REQUEST,
        );
      }
      return {
        questionId: question.id,
        optionId: option.id,
        isCorrect: option.isCorrect,
      };
    });

    const score = this.scoring.score(evaluated);
    const totalQuestions = quiz.questions.length;
    const completedAt = new Date();
    const durationMs = Math.max(
      0,
      completedAt.getTime() - participation.startedAt.getTime(),
    );

    const completed = await this.prisma.$transaction(async (tx) => {
      const changed = await tx.participation.updateMany({
        where: { id, status: ParticipationStatus.ACTIVE },
        data: {
          status: ParticipationStatus.COMPLETED,
          completedAt,
          durationMs,
          score,
          totalQuestions,
        },
      });
      if (changed.count !== 1) {
        throw new ApiError(
          'PARTICIPATION_COMPLETED',
          'Participation has already been submitted',
          HttpStatus.CONFLICT,
        );
      }
      await tx.answer.createMany({
        data: evaluated.map((answer) => ({
          participationId: id,
          ...answer,
        })),
      });
      return tx.participation.findUniqueOrThrow({ where: { id } });
    });

    return this.publicResult(await this.resultDetails(completed.id));
  }

  async result(id: string, authorization?: string) {
    const participation = await this.authorizedParticipation(id, authorization);
    if (participation.status !== ParticipationStatus.COMPLETED) {
      throw new ApiError(
        'QUIZ_NOT_AVAILABLE',
        'Result is not available before submission',
        HttpStatus.CONFLICT,
      );
    }
    return this.publicResult(await this.resultDetails(participation.id));
  }

  private resultDetails(id: string) {
    return this.prisma.participation.findUniqueOrThrow({
      where: { id },
      include: {
        answers: {
          include: {
            option: {
              select: { id: true, text: true },
            },
            question: {
              select: {
                id: true,
                text: true,
                position: true,
                options: {
                  where: { isCorrect: true },
                  select: { id: true, text: true },
                },
              },
            },
          },
          orderBy: { question: { position: 'asc' } },
        },
      },
    });
  }

  private publicResult(
    participation: Prisma.ParticipationGetPayload<{
      include: {
        answers: {
          include: {
            option: { select: { id: true; text: true } };
            question: {
              select: {
                id: true;
                text: true;
                position: true;
                options: {
                  where: { isCorrect: true };
                  select: { id: true; text: true };
                };
              };
            };
          };
        };
      };
    }>,
  ) {
    const score = participation.score ?? 0;
    const totalQuestions = participation.totalQuestions ?? 0;
    return {
      participationId: participation.id,
      alias: participation.alias,
      score,
      totalQuestions,
      percentage: this.scoring.percentage(score, totalQuestions),
      durationMs: participation.durationMs,
      completedAt: participation.completedAt,
      answers: participation.answers.map((answer) => ({
        questionId: answer.question.id,
        questionText: answer.question.text,
        position: answer.question.position,
        selectedOption: answer.option,
        correctOption: answer.question.options[0],
        isCorrect: answer.isCorrect,
      })),
    };
  }
}
