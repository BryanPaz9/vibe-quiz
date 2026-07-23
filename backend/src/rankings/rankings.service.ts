import { HttpStatus, Injectable } from '@nestjs/common';
import { ParticipationStatus, QuizStatus } from '@prisma/client';
import { ApiError } from '../common/api-error';
import { PrismaService } from '../prisma/prisma.service';
import { ScoringService } from '../scoring/scoring.service';

@Injectable()
export class RankingsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly scoring: ScoringService,
  ) {}

  async byQuizId(id: string) {
    const quiz = await this.prisma.quiz.findUnique({ where: { id } });
    if (!quiz) {
      throw new ApiError(
        'QUIZ_NOT_FOUND',
        'Quiz not found',
        HttpStatus.NOT_FOUND,
      );
    }
    return this.build(quiz.id, quiz.publicId);
  }

  async byPublicId(publicId: string) {
    const quiz = await this.prisma.quiz.findUnique({ where: { publicId } });
    if (!quiz || quiz.status === QuizStatus.DRAFT) {
      throw new ApiError(
        'QUIZ_NOT_FOUND',
        'Quiz not found',
        HttpStatus.NOT_FOUND,
      );
    }
    return this.build(quiz.id, quiz.publicId);
  }

  private async build(quizId: string, publicId: string) {
    const rows = await this.prisma.participation.findMany({
      where: { quizId, status: ParticipationStatus.COMPLETED },
      orderBy: [{ score: 'desc' }, { completedAt: 'asc' }, { id: 'asc' }],
    });
    return {
      quizPublicId: publicId,
      generatedAt: new Date(),
      entries: rows.map((row, index) => ({
        position: index + 1,
        alias: row.alias,
        score: row.score,
        totalQuestions: row.totalQuestions,
        percentage: this.scoring.percentage(
          row.score ?? 0,
          row.totalQuestions ?? 0,
        ),
        durationMs: row.durationMs,
      })),
    };
  }
}
