import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterAll, afterEach, beforeAll } from 'vitest';
import { clearAdminSession } from '@/features/auth/session/admin-session';
import { server } from '@/mocks/server';

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
afterEach(() => {
  cleanup();
  clearAdminSession();
  server.resetHandlers();
  sessionStorage.clear();
});
afterAll(() => server.close());
