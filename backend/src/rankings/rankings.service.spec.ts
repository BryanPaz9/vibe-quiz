import { ParticipationStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { ScoringService } from '../scoring/scoring.service';
import { RankingsService } from './rankings.service';

describe('RankingsService', () => {
  it('orders completed participations by score, duration and stable criteria', async () => {
    const findUnique = jest.fn().mockResolvedValue({
      id: 'quiz-id',
      publicId: 'public-id',
    });
    const findMany = jest.fn().mockResolvedValue([]);
    const prisma = {
      quiz: { findUnique },
      participation: { findMany },
    } as unknown as PrismaService;
    const service = new RankingsService(prisma, new ScoringService());

    await service.byQuizId('quiz-id');

    expect(findMany).toHaveBeenCalledWith({
      where: {
        quizId: 'quiz-id',
        status: ParticipationStatus.COMPLETED,
      },
      orderBy: [
        { score: 'desc' },
        { durationMs: 'asc' },
        { completedAt: 'asc' },
        { id: 'asc' },
      ],
    });
  });
});
