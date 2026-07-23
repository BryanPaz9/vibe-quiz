import { HttpStatus, Injectable } from '@nestjs/common';
import { Prisma, QuizStatus } from '@prisma/client';
import { ApiError } from '../common/api-error';
import { PrismaService } from '../prisma/prisma.service';
import { ListQuizzesDto } from './dto/list-quizzes.dto';
import { QuizContentDto } from './dto/quiz-content.dto';
import { quizWithContent, toAdminQuiz, toPublicQuiz } from './quiz.mapper';

@Injectable()
export class QuizzesService {
  constructor(private readonly prisma: PrismaService) {}

  private validateAggregate(dto: QuizContentDto): void {
    const questionPositions = new Set(dto.questions.map((q) => q.position));
    if (questionPositions.size !== dto.questions.length) {
      throw new ApiError(
        'VALIDATION_ERROR',
        'Question positions must be unique',
        HttpStatus.BAD_REQUEST,
      );
    }

    for (const question of dto.questions) {
      const optionPositions = new Set(question.options.map((o) => o.position));
      const correctCount = question.options.filter((o) => o.isCorrect).length;
      if (optionPositions.size !== question.options.length) {
        throw new ApiError(
          'VALIDATION_ERROR',
          'Option positions must be unique per question',
          HttpStatus.BAD_REQUEST,
        );
      }
      if (correctCount !== 1) {
        throw new ApiError(
          'VALIDATION_ERROR',
          'Each question must have exactly one correct option',
          HttpStatus.BAD_REQUEST,
        );
      }
    }
  }

  private nestedQuestions(dto: QuizContentDto) {
    return dto.questions.map((question) => ({
      text: question.text.trim(),
      position: question.position,
      options: {
        create: question.options.map((option) => ({
          text: option.text.trim(),
          position: option.position,
          isCorrect: option.isCorrect,
        })),
      },
    }));
  }

  async create(dto: QuizContentDto) {
    this.validateAggregate(dto);
    const quiz = await this.prisma.quiz.create({
      data: {
        title: dto.title.trim(),
        description: dto.description?.trim() || null,
        questions: { create: this.nestedQuestions(dto) },
      },
      ...quizWithContent,
    });
    return toAdminQuiz(quiz);
  }

  async list(query: ListQuizzesDto) {
    const where: Prisma.QuizWhereInput = {
      status: query.status,
      title: query.search
        ? { contains: query.search.trim(), mode: 'insensitive' }
        : undefined,
    };
    const skip = (query.page - 1) * query.pageSize;
    const [data, total] = await this.prisma.$transaction([
      this.prisma.quiz.findMany({
        where,
        skip,
        take: query.pageSize,
        orderBy: { createdAt: 'desc' },
        include: {
          _count: { select: { questions: true, participations: true } },
        },
      }),
      this.prisma.quiz.count({ where }),
    ]);

    return {
      data: data.map(({ _count, ...quiz }) => ({
        ...quiz,
        questionCount: _count.questions,
        participationCount: _count.participations,
      })),
      meta: {
        page: query.page,
        pageSize: query.pageSize,
        total,
        totalPages: Math.ceil(total / query.pageSize),
      },
    };
  }

  async getAdmin(id: string) {
    const quiz = await this.prisma.quiz.findUnique({
      where: { id },
      ...quizWithContent,
    });
    if (!quiz) {
      throw new ApiError(
        'QUIZ_NOT_FOUND',
        'Quiz not found',
        HttpStatus.NOT_FOUND,
      );
    }
    return toAdminQuiz(quiz);
  }

  async replace(id: string, dto: QuizContentDto) {
    this.validateAggregate(dto);
    const existing = await this.prisma.quiz.findUnique({ where: { id } });
    if (!existing) {
      throw new ApiError(
        'QUIZ_NOT_FOUND',
        'Quiz not found',
        HttpStatus.NOT_FOUND,
      );
    }
    if (existing.status !== QuizStatus.DRAFT) {
      throw new ApiError(
        'QUIZ_NOT_EDITABLE',
        'Only draft quizzes can be edited',
        HttpStatus.CONFLICT,
      );
    }

    await this.prisma.$transaction(async (tx) => {
      await tx.question.deleteMany({ where: { quizId: id } });
      await tx.quiz.update({
        where: { id },
        data: {
          title: dto.title.trim(),
          description: dto.description?.trim() || null,
          questions: { create: this.nestedQuestions(dto) },
        },
      });
    });
    return this.getAdmin(id);
  }

  async remove(id: string): Promise<void> {
    const quiz = await this.prisma.quiz.findUnique({
      where: { id },
      include: { _count: { select: { participations: true } } },
    });
    if (!quiz) {
      throw new ApiError(
        'QUIZ_NOT_FOUND',
        'Quiz not found',
        HttpStatus.NOT_FOUND,
      );
    }
    if (quiz.status !== QuizStatus.DRAFT || quiz._count.participations > 0) {
      throw new ApiError(
        'QUIZ_NOT_DELETABLE',
        'Only draft quizzes without participations can be deleted',
        HttpStatus.CONFLICT,
      );
    }
    await this.prisma.quiz.delete({ where: { id } });
  }

  async publish(id: string) {
    const quiz = await this.prisma.quiz.findUnique({
      where: { id },
      ...quizWithContent,
    });
    if (!quiz) {
      throw new ApiError(
        'QUIZ_NOT_FOUND',
        'Quiz not found',
        HttpStatus.NOT_FOUND,
      );
    }
    if (quiz.status !== QuizStatus.DRAFT) {
      throw new ApiError(
        'QUIZ_NOT_EDITABLE',
        'Only draft quizzes can be published',
        HttpStatus.CONFLICT,
      );
    }
    if (
      quiz.questions.length === 0 ||
      quiz.questions.some(
        (q) =>
          q.options.length < 2 ||
          q.options.filter((o) => o.isCorrect).length !== 1,
      )
    ) {
      throw new ApiError(
        'VALIDATION_ERROR',
        'Quiz content is not publishable',
        HttpStatus.BAD_REQUEST,
      );
    }
    const updated = await this.prisma.quiz.update({
      where: { id },
      data: { status: QuizStatus.PUBLISHED, publishedAt: new Date() },
    });
    return {
      id: updated.id,
      publicId: updated.publicId,
      status: updated.status,
      publishedAt: updated.publishedAt,
      publicUrlPath: `/quiz/${updated.publicId}`,
    };
  }

  async close(id: string) {
    const quiz = await this.prisma.quiz.findUnique({ where: { id } });
    if (!quiz) {
      throw new ApiError(
        'QUIZ_NOT_FOUND',
        'Quiz not found',
        HttpStatus.NOT_FOUND,
      );
    }
    if (quiz.status !== QuizStatus.PUBLISHED) {
      throw new ApiError(
        'QUIZ_NOT_EDITABLE',
        'Only published quizzes can be closed',
        HttpStatus.CONFLICT,
      );
    }
    return this.prisma.quiz.update({
      where: { id },
      data: { status: QuizStatus.CLOSED, closedAt: new Date() },
    });
  }

  async getPublic(publicId: string) {
    const quiz = await this.prisma.quiz.findFirst({
      where: { publicId, status: QuizStatus.PUBLISHED },
      ...quizWithContent,
    });
    if (!quiz) {
      throw new ApiError(
        'QUIZ_NOT_FOUND',
        'Quiz not found',
        HttpStatus.NOT_FOUND,
      );
    }
    return toPublicQuiz(quiz);
  }

  async results(id: string, page = 1, pageSize = 20) {
    await this.getAdmin(id);
    const where = { quizId: id };
    const [rows, total] = await this.prisma.$transaction([
      this.prisma.participation.findMany({
        where,
        orderBy: { startedAt: 'desc' },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      this.prisma.participation.count({ where }),
    ]);
    return {
      data: rows.map((row) => ({
        ...row,
        percentage:
          row.score !== null && row.totalQuestions
            ? Math.round((row.score / row.totalQuestions) * 100)
            : null,
      })),
      meta: { page, pageSize, total, totalPages: Math.ceil(total / pageSize) },
    };
  }
}
