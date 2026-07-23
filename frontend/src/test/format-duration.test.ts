import { formatDuration } from '@/shared/utils/format-duration';

describe('formatDuration', () => {
  it.each([
    [0, '0 s'],
    [42_999, '42 s'],
    [65_000, '1 min 5 s'],
    [3_725_000, '1 h 2 min 5 s'],
    [-1, '0 s'],
  ])('formats %i milliseconds as %s', (durationMs, expected) => {
    expect(formatDuration(durationMs)).toBe(expected);
  });
});
