const required = ['DATABASE_URL', 'JWT_SECRET', 'FRONTEND_ORIGIN'] as const;

export function validateEnvironment(
  environment: Record<string, unknown>,
): Record<string, unknown> {
  for (const key of required) {
    if (typeof environment[key] !== 'string' || environment[key] === '') {
      throw new Error(`${key} is required`);
    }
  }

  if ((environment.JWT_SECRET as string).length < 32) {
    throw new Error('JWT_SECRET must contain at least 32 characters');
  }

  const port = Number(environment.PORT ?? 3000);
  if (!Number.isInteger(port) || port <= 0 || port > 65_535) {
    throw new Error('PORT must be a valid TCP port');
  }

  return { ...environment, PORT: port };
}
