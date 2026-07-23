const STORAGE_PREFIX = 'vibequiz:participation:';
const QUIZ_INDEX_PREFIX = 'vibequiz:participation-quiz:';

export interface ParticipationSession {
  participationId: string;
  participationToken: string;
  quizPublicId: string;
  alias: string;
}

function storageKey(participationId: string): string {
  return `${STORAGE_PREFIX}${participationId}`;
}

function quizIndexKey(publicId: string): string {
  return `${QUIZ_INDEX_PREFIX}${publicId}`;
}

function isParticipationSession(value: unknown): value is ParticipationSession {
  if (!value || typeof value !== 'object') return false;
  const session = value as Record<string, unknown>;
  return (
    typeof session.participationId === 'string' &&
    typeof session.participationToken === 'string' &&
    typeof session.quizPublicId === 'string' &&
    typeof session.alias === 'string'
  );
}

export function saveParticipationSession(session: ParticipationSession): void {
  const previousParticipationId = sessionStorage.getItem(
    quizIndexKey(session.quizPublicId),
  );
  if (previousParticipationId) {
    sessionStorage.removeItem(storageKey(previousParticipationId));
  }

  sessionStorage.setItem(
    storageKey(session.participationId),
    JSON.stringify(session),
  );
  sessionStorage.setItem(
    quizIndexKey(session.quizPublicId),
    session.participationId,
  );
}

export function getParticipationSession(
  participationId: string,
): ParticipationSession | null {
  const serialized = sessionStorage.getItem(storageKey(participationId));
  if (!serialized) return null;

  try {
    const session: unknown = JSON.parse(serialized);
    if (isParticipationSession(session)) return session;
    sessionStorage.removeItem(storageKey(participationId));
    return null;
  } catch {
    sessionStorage.removeItem(storageKey(participationId));
    return null;
  }
}

export function getParticipationSessionByQuiz(
  publicId: string,
): ParticipationSession | null {
  const participationId = sessionStorage.getItem(quizIndexKey(publicId));
  if (!participationId) return null;

  const session = getParticipationSession(participationId);
  if (!session || session.quizPublicId !== publicId) {
    sessionStorage.removeItem(quizIndexKey(publicId));
    return null;
  }
  return session;
}

export function clearParticipationSession(participationId: string): void {
  const session = getParticipationSession(participationId);
  sessionStorage.removeItem(storageKey(participationId));
  if (session) {
    sessionStorage.removeItem(quizIndexKey(session.quizPublicId));
  }
}
