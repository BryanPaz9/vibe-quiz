import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { appRoutes } from '@/app/router';
import {
  getAdminSession,
  setAdminSession,
} from '@/features/auth/session/admin-session';
import { adminFixture, loginFixture } from '@/mocks/fixtures';

function renderRoute(path: string) {
  const router = createMemoryRouter(appRoutes, { initialEntries: [path] });
  const queryClient = new QueryClient({
    defaultOptions: {
      mutations: { retry: false },
      queries: { retry: false },
    },
  });

  render(
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>,
  );

  return router;
}

async function fillCredentials(
  email = adminFixture.email,
  password = 'correct-password',
) {
  const user = userEvent.setup();
  await user.type(screen.getByLabelText('Correo electrónico'), email);
  await user.type(screen.getByLabelText('Contraseña'), password);
  await user.click(screen.getByRole('button', { name: 'Ingresar' }));
  return user;
}

describe('administrative authentication', () => {
  it('discards an expired in-memory session', () => {
    setAdminSession({
      accessToken: 'expired-token',
      admin: adminFixture,
      expiresAt: Date.now() - 1,
    });

    expect(getAdminSession()).toBeNull();
  });

  it('validates credentials before contacting the API', async () => {
    renderRoute('/admin/login');
    const user = userEvent.setup();

    await user.click(screen.getByRole('button', { name: 'Ingresar' }));

    expect(
      await screen.findByText('Ingresa el correo electrónico.'),
    ).toBeInTheDocument();
    expect(screen.getByText('Ingresa la contraseña.')).toBeInTheDocument();
    expect(getAdminSession()).toBeNull();
  });

  it('shows a generic error for invalid credentials', async () => {
    renderRoute('/admin/login');

    await fillCredentials('admin@vibequiz.test', 'wrong-password');

    expect(
      await screen.findByText('El correo o la contraseña no son válidos.'),
    ).toBeInTheDocument();
    expect(getAdminSession()).toBeNull();
  });

  it('authenticates, verifies identity and returns to the requested route', async () => {
    const router = renderRoute('/admin/quizzes/new');

    expect(
      await screen.findByRole('heading', { name: 'Iniciar sesión' }),
    ).toBeInTheDocument();
    await fillCredentials();

    expect(
      await screen.findByRole('heading', { name: 'Crear cuestionario' }),
    ).toBeInTheDocument();
    expect(router.state.location.pathname).toBe('/admin/quizzes/new');
    expect(screen.getByText(adminFixture.email)).toBeInTheDocument();
    expect(getAdminSession()).toMatchObject({
      accessToken: loginFixture.accessToken,
      admin: adminFixture,
    });
  });

  it('clears the in-memory session when the administrator logs out', async () => {
    const router = renderRoute('/admin/quizzes');
    await fillCredentials();
    const user = userEvent.setup();

    await user.click(
      await screen.findByRole('button', { name: 'Cerrar sesión' }),
    );

    await waitFor(() =>
      expect(router.state.location.pathname).toBe('/admin/login'),
    );
    expect(getAdminSession()).toBeNull();
  });
});
