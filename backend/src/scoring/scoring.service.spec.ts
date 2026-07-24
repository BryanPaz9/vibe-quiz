import { ScoringService } from './scoring.service';

describe('ScoringService', () => {
  const service = new ScoringService();

  it('awards one point for each correct answer', () => {
    expect(
      service.score([
        { questionId: 'q1', optionId: 'o1', isCorrect: true },
        { questionId: 'q2', optionId: 'o2', isCorrect: false },
        { questionId: 'q3', optionId: 'o3', isCorrect: true },
      ]),
    ).toBe(2);
  });

  it('derives a rounded percentage', () => {
    expect(service.percentage(2, 3)).toBe(67);
    expect(service.percentage(0, 0)).toBe(0);
  });
});
