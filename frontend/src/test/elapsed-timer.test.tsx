import { act, render, screen } from '@testing-library/react';
import { ElapsedTimer } from '@/features/participation/components/ElapsedTimer';
import { formatElapsedTime } from '@/features/participation/utils/format-elapsed-time';

describe('elapsed participation timer', () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it('formats elapsed seconds for short and long attempts', () => {
    expect(formatElapsedTime(65)).toBe('01:05');
    expect(formatElapsedTime(3_661)).toBe('01:01:01');
  });

  it('continues from the authoritative participation start time', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-07-23T12:01:05.000Z'));

    render(<ElapsedTimer startedAt="2026-07-23T12:00:00.000Z" />);

    expect(
      screen.getByRole('timer', { name: 'Tiempo transcurrido: 01:05' }),
    ).toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(1_000);
    });

    expect(
      screen.getByRole('timer', { name: 'Tiempo transcurrido: 01:06' }),
    ).toBeInTheDocument();
  });
});
