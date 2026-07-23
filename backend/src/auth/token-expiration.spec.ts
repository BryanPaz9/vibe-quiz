import { expirationToSeconds } from './token-expiration';

describe('expirationToSeconds', () => {
  it.each([
    ['3600', 3600],
    ['60m', 3600],
    ['1h', 3600],
    ['1d', 86400],
  ])('converts %s to %i seconds', (configured, expected) => {
    expect(expirationToSeconds(configured)).toBe(expected);
  });

  it.each(['', '0', '-1', '1 hour', 'abc'])(
    'rejects invalid duration %s',
    (configured) => {
      expect(() => expirationToSeconds(configured)).toThrow('JWT_EXPIRES_IN');
    },
  );
});
