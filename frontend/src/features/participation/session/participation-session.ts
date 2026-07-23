const STORAGE_PREFIX = 'vibequiz:participation:';

export interface ParticipationSession {
  participationId: string;
  participationToken: string;
  quizPublicId: string;
  alias: string;
}

function storageKey(participationId: string): string {
  return `${STORAGE_PREFIX}${participationId}`;
}

export function saveParticipationSession(session: ParticipationSession): void {
  sessionStorage.setItem(
    storageKey(session.participationId),
    JSON.stringify(session),
  );
}

export function getParticipationSession(
  participationId: string,
): ParticipationSession | null {
  const serialized = sessionStorage.getItem(storageKey(participationId));
  if (!serialized) return null;

  try {
    return JSON.parse(serialized) as ParticipationSession;
  } catch {
    sessionStorage.removeItem(storageKey(participationId));
    return null;
  }
}

export function clearParticipationSession(participationId: string): void {
  sessionStorage.removeItem(storageKey(participationId));
}
