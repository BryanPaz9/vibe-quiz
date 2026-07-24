import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen } from '@testing-library/react';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { appRoutes } from '@/app/router';
import { publicQuizFixture } from '@/mocks/fixtures';

function renderRoute(path: string) {
  const router = createMemoryRouter(appRoutes, { initialEntries: [path] });
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>,
  );
}

describe('application routing', () => {
  it('renders the home page', () => {
    renderRoute('/');
    expect(
      screen.getByRole('heading', {
        name: 'Crea, comparte y responde cuestionarios',
      }),
    ).toBeInTheDocument();
    expect(screen.getByRole('img', { name: 'VibeQuiz' })).toHaveAttribute(
      'src',
      '/brand/vq-logo.png',
    );
    expect(
      screen.getByRole('heading', {
        name: 'De una idea a resultados en tres pasos',
      }),
    ).toBeInTheDocument();
    expect(screen.queryByText('Scaffold activo')).not.toBeInTheDocument();
  });

  it('renders the public quiz route without exposing correct answers', async () => {
    renderRoute(`/quiz/${publicQuizFixture.publicId}`);
    expect(
      await screen.findByRole('heading', { name: publicQuizFixture.title }),
    ).toBeInTheDocument();
    expect(screen.queryByText(/isCorrect/i)).not.toBeInTheDocument();
  });

  it('redirects protected routes to login without a session', async () => {
    renderRoute('/admin/quizzes');
    expect(
      await screen.findByRole('heading', { name: 'Iniciar sesión' }),
    ).toBeInTheDocument();
  });
});
