import type { AdminIdentity } from '@/shared/types/api';

export interface AdminSession {
  accessToken: string;
  admin: AdminIdentity;
  expiresAt: number;
}

type SessionListener = (session: AdminSession | null) => void;

let currentSession: AdminSession | null = null;
let expirationTimer: ReturnType<typeof setTimeout> | null = null;
const listeners = new Set<SessionListener>();

export function getAdminSession(): AdminSession | null {
  if (currentSession && currentSession.expiresAt <= Date.now()) {
    clearAdminSession();
  }
  return currentSession;
}

export function setAdminSession(session: AdminSession): void {
  if (expirationTimer) clearTimeout(expirationTimer);
  currentSession = session;
  expirationTimer = setTimeout(
    clearAdminSession,
    Math.max(0, session.expiresAt - Date.now()),
  );
  listeners.forEach((listener) => listener(currentSession));
}

export function clearAdminSession(): void {
  if (expirationTimer) clearTimeout(expirationTimer);
  expirationTimer = null;
  currentSession = null;
  listeners.forEach((listener) => listener(currentSession));
}

export function subscribeToAdminSession(listener: SessionListener): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}
