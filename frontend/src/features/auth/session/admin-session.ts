import type { AdminIdentity } from '@/shared/types/api';

export interface AdminSession {
  accessToken: string;
  admin: AdminIdentity;
}

type SessionListener = (session: AdminSession | null) => void;

let currentSession: AdminSession | null = null;
const listeners = new Set<SessionListener>();

export function getAdminSession(): AdminSession | null {
  return currentSession;
}

export function setAdminSession(session: AdminSession): void {
  currentSession = session;
  listeners.forEach((listener) => listener(currentSession));
}

export function clearAdminSession(): void {
  currentSession = null;
  listeners.forEach((listener) => listener(currentSession));
}

export function subscribeToAdminSession(listener: SessionListener): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}
