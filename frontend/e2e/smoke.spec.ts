import { expect, test } from '@playwright/test';

test('renders the application shell', async ({ page }) => {
  await page.goto('/');

  await expect(
    page.getByRole('heading', {
      name: 'Crea, comparte y responde cuestionarios',
    }),
  ).toBeVisible();
  await expect(page.getByRole('link', { name: 'VibeQuiz' })).toBeVisible();
});

test('renders a public quiz route placeholder', async ({ page }) => {
  await page.goto('/quiz/quiz-public-id');

  await expect(
    page.getByRole('heading', { name: 'Preparando cuestionario' }),
  ).toBeVisible();
  await expect(page.getByText('Quiz: quiz-public-id')).toBeVisible();
});
