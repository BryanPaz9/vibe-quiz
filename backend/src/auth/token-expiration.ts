const durationPattern = /^(\d+)([smhd])?$/u;

const unitSeconds: Record<string, number> = {
  s: 1,
  m: 60,
  h: 60 * 60,
  d: 24 * 60 * 60,
};

export function expirationToSeconds(value: string): number {
  const match = durationPattern.exec(value.trim().toLowerCase());
  if (!match) {
    throw new Error(
      'JWT_EXPIRES_IN must be a positive number optionally followed by s, m, h, or d',
    );
  }

  const amount = Number(match[1]);
  const multiplier = match[2] ? unitSeconds[match[2]] : 1;
  const seconds = amount * multiplier;

  if (!Number.isSafeInteger(seconds) || seconds <= 0) {
    throw new Error('JWT_EXPIRES_IN must resolve to positive whole seconds');
  }

  return seconds;
}
