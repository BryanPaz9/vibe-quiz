import { Prisma } from '@prisma/client';

export const quizWithContent = Prisma.validator<Prisma.QuizDefaultArgs>()({
  include: {
    questions: {
      orderBy: { position: 'asc' },
      include: { options: { orderBy: { position: 'asc' } } },
    },
  },
});

export type QuizWithContent = Prisma.QuizGetPayload<typeof quizWithContent>;

export function toAdminQuiz(quiz: QuizWithContent) {
  return quiz;
}

export function toPublicQuiz(quiz: QuizWithContent) {
  return {
    publicId: quiz.publicId,
    title: quiz.title,
    description: quiz.description,
    questionCount: quiz.questions.length,
    questions: quiz.questions.map((question) => ({
      id: question.id,
      text: question.text,
      position: question.position,
      options: question.options.map((option) => ({
        id: option.id,
        text: option.text,
        position: option.position,
      })),
    })),
  };
}
