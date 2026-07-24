import type { AdminIdentity } from '@/shared/types/api';

const ADMIN_SESSION_KEY = 'vibequiz:admin-session';
const MAX_TIMER_DELAY_MS = 2_147_483_647;

export interface AdminSession {
  accessToken: string;
  admin: AdminIdentity;
  expiresAt: number;
}

type SessionListener = (session: AdminSession | null) => void;

let currentSession: AdminSession | null = null;
let expirationTimer: ReturnType<typeof setTimeout> | null = null;
const listeners = new Set<SessionListener>();

function isAdminSession(value: unknown): value is AdminSession {
  if (!value || typeof value !== 'object') return false;
  const session = value as Record<string, unknown>;
  if (!session.admin || typeof session.admin !== 'object') return false;
  const admin = session.admin as Record<string, unknown>;

  return (
    typeof session.accessToken === 'string' &&
    session.accessToken.length > 0 &&
    typeof session.expiresAt === 'number' &&
    Number.isFinite(session.expiresAt) &&
    typeof admin.id === 'string' &&
    typeof admin.email === 'string'
  );
}

function readStoredSession(): AdminSession | null {
  try {
    const serialized = sessionStorage.getItem(ADMIN_SESSION_KEY);
    if (!serialized) return null;
    const session: unknown = JSON.parse(serialized);
    if (!isAdminSession(session) || session.expiresAt <= Date.now()) {
      sessionStorage.removeItem(ADMIN_SESSION_KEY);
      return null;
    }
    return session;
  } catch {
    try {
      sessionStorage.removeItem(ADMIN_SESSION_KEY);
    } catch {
      // In-memory authentication remains available when storage is blocked.
    }
    return null;
  }
}

function persistSession(session: AdminSession): void {
  try {
    sessionStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify(session));
  } catch {
    // In-memory authentication remains available when storage is blocked.
  }
}

function removePersistedSession(): void {
  try {
    sessionStorage.removeItem(ADMIN_SESSION_KEY);
  } catch {
    // There is no persisted state to clean when storage is unavailable.
  }
}

function scheduleExpiration(): void {
  if (expirationTimer) clearTimeout(expirationTimer);
  expirationTimer = null;
  if (!currentSession) return;

  expirationTimer = setTimeout(
    clearAdminSession,
    Math.min(
      MAX_TIMER_DELAY_MS,
      Math.max(0, currentSession.expiresAt - Date.now()),
    ),
  );
}

export function getAdminSession(): AdminSession | null {
  if (currentSession && currentSession.expiresAt <= Date.now()) {
    clearAdminSession();
  }
  return currentSession;
}

export function setAdminSession(session: AdminSession): void {
  currentSession = session;
  persistSession(session);
  scheduleExpiration();
  listeners.forEach((listener) => listener(currentSession));
}

export function clearAdminSession(): void {
  if (expirationTimer) clearTimeout(expirationTimer);
  expirationTimer = null;
  currentSession = null;
  removePersistedSession();
  listeners.forEach((listener) => listener(currentSession));
}

export function subscribeToAdminSession(listener: SessionListener): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function restoreAdminSession(): AdminSession | null {
  currentSession = readStoredSession();
  scheduleExpiration();
  listeners.forEach((listener) => listener(currentSession));
  return currentSession;
}

restoreAdminSession();
