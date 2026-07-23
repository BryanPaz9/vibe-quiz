import { expect, test } from '@playwright/test';
import {
  adminFixture,
  loginFixture,
  participationFixture,
  participationResultFixture,
  publicQuizFixture,
  rankingFixture,
} from '../src/mocks/fixtures';

test('renders the application shell', async ({ page }) => {
  await page.goto('/');

  await expect(
    page.getByRole('heading', {
      name: 'Crea, comparte y responde cuestionarios',
    }),
  ).toBeVisible();
  await expect(page.getByRole('link', { name: 'VibeQuiz' })).toBeVisible();
});

test('authenticates and closes the administrative session', async ({
  page,
}) => {
  await page.route('**/api/v1/auth/login', async (route) => {
    expect(route.request().postDataJSON()).toEqual({
      email: adminFixture.email,
      password: 'correct-password',
    });
    await route.fulfill({ json: loginFixture });
  });
  await page.route('**/api/v1/auth/me', async (route) => {
    expect(route.request().headers()['authorization']).toBe(
      `Bearer ${loginFixture.accessToken}`,
    );
    await route.fulfill({ json: adminFixture });
  });
  await page.goto('/admin/quizzes');

  await expect(
    page.getByRole('heading', { name: 'Iniciar sesión' }),
  ).toBeVisible();
  await page.getByLabel('Correo electrónico').fill(adminFixture.email);
  await page.getByLabel('Contraseña').fill('correct-password');
  await page.getByRole('button', { name: 'Ingresar' }).click();

  await expect(
    page.getByRole('heading', { name: 'Cuestionarios' }),
  ).toBeVisible();
  await expect(page.getByText(adminFixture.email)).toBeVisible();
  await page.getByRole('button', { name: 'Cerrar sesión' }).click();
  await expect(
    page.getByRole('heading', { name: 'Iniciar sesión' }),
  ).toBeVisible();
});

test('starts, resolves and submits a public quiz', async ({ page }) => {
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
  await page.route(
    `**/api/v1/participations/${participationFixture.participationId}/submissions`,
    async (route) => {
      expect(route.request().headers()['authorization']).toBe(
        `Participation ${participationFixture.participationToken}`,
      );
      await route.fulfill({
        json: participationResultFixture,
        status: 201,
      });
    },
  );
  await page.route(
    `**/api/v1/participations/${participationFixture.participationId}/result`,
    async (route) => {
      expect(route.request().headers()['authorization']).toBe(
        `Participation ${participationFixture.participationToken}`,
      );
      await route.fulfill({ json: participationResultFixture });
    },
  );
  await page.route(
    `**/api/v1/public/quizzes/${publicQuizFixture.publicId}/ranking`,
    async (route) => {
      await route.fulfill({ json: rankingFixture });
    },
  );
  await page.goto(`/quiz/${publicQuizFixture.publicId}`);

  await expect(
    page.getByRole('heading', { name: publicQuizFixture.title }),
  ).toBeVisible();
  await page.getByLabel('Alias').fill('Ada');
  await page.getByRole('button', { name: 'Comenzar cuestionario' }).click();

  await expect(page).toHaveURL(
    new RegExp(`/quiz/${publicQuizFixture.publicId}/play$`),
  );
  await page.getByRole('radio', { name: 'Inteligencia Artificial' }).check();
  await page.getByRole('button', { name: 'Finalizar cuestionario' }).click();

  await expect(
    page.getByRole('heading', { name: 'Tu resultado' }),
  ).toBeVisible();
  await expect(page).toHaveURL(
    new RegExp(
      `/quiz/${publicQuizFixture.publicId}/result/${participationFixture.participationId}$`,
    ),
  );
  await expect(page.getByText('100%', { exact: true }).first()).toBeVisible();
  await page.getByRole('link', { name: 'Ver tabla de clasificación' }).click();

  await expect(
    page.getByRole('heading', { name: 'Tabla de clasificación' }),
  ).toBeVisible();
  await expect(page.getByRole('cell', { name: 'Ada Tú' })).toBeVisible();
});
