import { expect, test } from '@playwright/test';
import { participationFixture, publicQuizFixture } from '../src/mocks/fixtures';

test('renders the application shell', async ({ page }) => {
  await page.goto('/');

  await expect(
    page.getByRole('heading', {
      name: 'Crea, comparte y responde cuestionarios',
    }),
  ).toBeVisible();
  await expect(page.getByRole('link', { name: 'VibeQuiz' })).toBeVisible();
});

test('starts the public quiz entry flow', async ({ page }) => {
  await page.route(
    `**/api/v1/public/quizzes/${publicQuizFixture.publicId}`,
    async (route) => {
      await route.fulfill({ json: publicQuizFixture });
    },
  );
  await page.route(
    `**/api/v1/public/quizzes/${publicQuizFixture.publicId}/participations`,
    async (route) => {
      const request = route.request().postDataJSON() as { alias: string };
      await route.fulfill({
        json: { ...participationFixture, alias: request.alias },
        status: 201,
      });
    },
  );
  await page.goto(`/quiz/${publicQuizFixture.publicId}`);

  await expect(
    page.getByRole('heading', { name: publicQuizFixture.title }),
  ).toBeVisible();
  await page.getByLabel('Alias').fill('Ada');
  await page.getByRole('button', { name: 'Comenzar cuestionario' }).click();

  await expect(
    page.getByRole('heading', { name: 'Resolver cuestionario' }),
  ).toBeVisible();
  await expect(page).toHaveURL(
    new RegExp(`/quiz/${publicQuizFixture.publicId}/play$`),
  );
});
