import { Injectable } from '@nestjs/common';

export interface EvaluatedAnswer {
  questionId: string;
  optionId: string;
  isCorrect: boolean;
}

@Injectable()
export class ScoringService {
  score(answers: EvaluatedAnswer[]): number {
    return answers.filter((answer) => answer.isCorrect).length;
  }

  percentage(score: number, totalQuestions: number): number {
    return totalQuestions > 0 ? Math.round((score / totalQuestions) * 100) : 0;
  }
}
