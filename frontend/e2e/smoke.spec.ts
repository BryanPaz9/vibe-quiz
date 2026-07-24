import { expect, test } from '@playwright/test';
import {
  adminFixture,
  adminQuizDetailFixture,
  adminQuizListFixture,
  adminQuizResultsFixture,
  loginFixture,
  participationFixture,
  participationResultFixture,
  publishQuizFixture,
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

test('authenticates and lists administrative quizzes', async ({ page }) => {
  await page.route('**/api/v1/auth/login', async (route) => {
    await route.fulfill({ json: loginFixture });
  });
  await page.route('**/api/v1/auth/me', async (route) => {
    await route.fulfill({ json: adminFixture });
  });
  await page.route('**/api/v1/admin/quizzes?**', async (route) => {
    expect(route.request().headers()['authorization']).toBe(
      `Bearer ${loginFixture.accessToken}`,
    );
    const requestUrl = new URL(route.request().url());
    expect(requestUrl.searchParams.get('page')).toBe('1');
    expect(requestUrl.searchParams.get('pageSize')).toBe('20');
    await route.fulfill({ json: adminQuizListFixture });
  });
  await page.goto('/admin/quizzes');

  await page.getByLabel('Correo electrónico').fill(adminFixture.email);
  await page.getByLabel('Contraseña').fill('correct-password');
  await page.getByRole('button', { name: 'Ingresar' }).click();

  await expect(
    page.getByRole('link', { name: adminQuizListFixture.data[0].title }),
  ).toBeVisible();
  await expect(page.getByRole('cell', { name: 'Borrador' })).toBeVisible();
  await expect(
    page.getByRole('link', { name: 'Crear cuestionario' }),
  ).toBeVisible();
});

test('authenticates and creates an administrative quiz', async ({ page }) => {
  await page.route('**/api/v1/auth/login', async (route) => {
    await route.fulfill({ json: loginFixture });
  });
  await page.route('**/api/v1/auth/me', async (route) => {
    await route.fulfill({ json: adminFixture });
  });
  await page.route('**/api/v1/admin/quizzes?**', async (route) => {
    await route.fulfill({ json: adminQuizListFixture });
  });
  await page.route('**/api/v1/admin/quizzes', async (route) => {
    if (route.request().method() !== 'POST') {
      await route.fallback();
      return;
    }
    expect(route.request().headers()['authorization']).toBe(
      `Bearer ${loginFixture.accessToken}`,
    );
    expect(route.request().postDataJSON()).toEqual({
      title: 'Arquitectura web',
      description: 'Evaluación del módulo',
      questions: [
        {
          text: '¿Qué protocolo utiliza la web?',
          position: 1,
          options: [
            { text: 'HTTP', position: 1, isCorrect: true },
            { text: 'SMTP', position: 2, isCorrect: false },
          ],
        },
      ],
    });
    await route.fulfill({ json: adminQuizDetailFixture, status: 201 });
  });
  await page.route(
    `**/api/v1/admin/quizzes/${adminQuizDetailFixture.id}`,
    async (route) => {
      await route.fulfill({ json: adminQuizDetailFixture });
    },
  );
  await page.goto('/admin/quizzes');

  await page.getByLabel('Correo electrónico').fill(adminFixture.email);
  await page.getByLabel('Contraseña').fill('correct-password');
  await page.getByRole('button', { name: 'Ingresar' }).click();
  await page.getByRole('link', { name: 'Crear cuestionario' }).click();

  await expect(
    page.getByRole('button', { name: 'Nueva pregunta' }),
  ).toBeVisible();
  await page.getByLabel('Título').fill('Arquitectura web');
  await page.getByLabel('Descripción (opcional)').fill('Evaluación del módulo');
  await page
    .getByLabel('Texto de la pregunta')
    .fill('¿Qué protocolo utiliza la web?');
  await page.getByRole('textbox', { name: 'Opción 1' }).fill('HTTP');
  await page.getByRole('textbox', { name: 'Opción 2' }).fill('SMTP');
  await page.getByRole('button', { name: 'Crear cuestionario' }).click();

  await expect(page).toHaveURL(
    new RegExp(`/admin/quizzes/${adminQuizDetailFixture.id}$`),
  );
  await expect(page.getByLabel('Título')).toBeVisible();
});

test('loads and edits an administrative draft', async ({ page }) => {
  await page.route('**/api/v1/auth/login', async (route) => {
    await route.fulfill({ json: loginFixture });
  });
  await page.route('**/api/v1/auth/me', async (route) => {
    await route.fulfill({ json: adminFixture });
  });
  await page.route('**/api/v1/admin/quizzes?**', async (route) => {
    await route.fulfill({ json: adminQuizListFixture });
  });
  await page.route(
    `**/api/v1/admin/quizzes/${adminQuizDetailFixture.id}`,
    async (route) => {
      expect(route.request().headers()['authorization']).toBe(
        `Bearer ${loginFixture.accessToken}`,
      );
      if (route.request().method() === 'PUT') {
        const request = route.request().postDataJSON();
        expect(request.title).toBe('Fundamentos actualizados');
        await route.fulfill({
          json: {
            ...adminQuizDetailFixture,
            title: request.title,
            updatedAt: '2026-07-23T18:00:00.000Z',
          },
        });
        return;
      }
      await route.fulfill({ json: adminQuizDetailFixture });
    },
  );
  await page.goto('/admin/quizzes');

  await page.getByLabel('Correo electrónico').fill(adminFixture.email);
  await page.getByLabel('Contraseña').fill('correct-password');
  await page.getByRole('button', { name: 'Ingresar' }).click();
  await page.getByRole('link', { name: adminQuizDetailFixture.title }).click();

  await page.getByLabel('Título').fill('Fundamentos actualizados');
  await page.getByRole('button', { name: 'Guardar cambios' }).click();

  await expect(
    page.getByText('Los cambios se guardaron correctamente.'),
  ).toBeVisible();
});

test('consults administrative results and ranking', async ({ page }) => {
  await page.route('**/api/v1/auth/login', async (route) => {
    await route.fulfill({ json: loginFixture });
  });
  await page.route('**/api/v1/auth/me', async (route) => {
    await route.fulfill({ json: adminFixture });
  });
  await page.route('**/api/v1/admin/quizzes?**', async (route) => {
    await route.fulfill({ json: adminQuizListFixture });
  });
  await page.route(
    `**/api/v1/admin/quizzes/${adminQuizDetailFixture.id}`,
    async (route) => {
      await route.fulfill({ json: adminQuizDetailFixture });
    },
  );
  await page.route(
    `**/api/v1/admin/quizzes/${adminQuizDetailFixture.id}/results?**`,
    async (route) => {
      expect(route.request().headers()['authorization']).toBe(
        `Bearer ${loginFixture.accessToken}`,
      );
      await route.fulfill({ json: adminQuizResultsFixture });
    },
  );
  await page.route(
    `**/api/v1/admin/quizzes/${adminQuizDetailFixture.id}/ranking`,
    async (route) => {
      expect(route.request().headers()['authorization']).toBe(
        `Bearer ${loginFixture.accessToken}`,
      );
      await route.fulfill({
        json: {
          ...rankingFixture,
          quizPublicId: adminQuizDetailFixture.publicId,
        },
      });
    },
  );
  await page.goto('/admin/quizzes');

  await page.getByLabel('Correo electrónico').fill(adminFixture.email);
  await page.getByLabel('Contraseña').fill('correct-password');
  await page.getByRole('button', { name: 'Ingresar' }).click();
  await page.getByRole('link', { name: adminQuizDetailFixture.title }).click();
  await page.getByRole('link', { name: 'Resultados' }).click();

  await expect(page.getByRole('row', { name: /Ada Completada/ })).toBeVisible();
  await page.getByRole('link', { name: 'Ver ranking' }).click();
  await expect(page.getByRole('row', { name: /#1 Ada/ })).toBeVisible();
});

test('publishes and closes an administrative quiz', async ({ page }) => {
  let status: 'DRAFT' | 'PUBLISHED' | 'CLOSED' = 'DRAFT';
  await page.route('**/api/v1/auth/login', async (route) => {
    await route.fulfill({ json: loginFixture });
  });
  await page.route('**/api/v1/auth/me', async (route) => {
    await route.fulfill({ json: adminFixture });
  });
  await page.route('**/api/v1/admin/quizzes?**', async (route) => {
    await route.fulfill({ json: adminQuizListFixture });
  });
  await page.route(
    `**/api/v1/admin/quizzes/${adminQuizDetailFixture.id}/publish`,
    async (route) => {
      expect(route.request().headers()['authorization']).toBe(
        `Bearer ${loginFixture.accessToken}`,
      );
      status = 'PUBLISHED';
      await route.fulfill({ json: publishQuizFixture });
    },
  );
  await page.route(
    `**/api/v1/admin/quizzes/${adminQuizDetailFixture.id}/close`,
    async (route) => {
      expect(route.request().headers()['authorization']).toBe(
        `Bearer ${loginFixture.accessToken}`,
      );
      status = 'CLOSED';
      await route.fulfill({ json: { status } });
    },
  );
  await page.route(
    `**/api/v1/admin/quizzes/${adminQuizDetailFixture.id}`,
    async (route) => {
      await route.fulfill({
        json: {
          ...adminQuizDetailFixture,
          status,
          publishedAt:
            status === 'DRAFT' ? null : publishQuizFixture.publishedAt,
          closedAt: status === 'CLOSED' ? '2026-07-23T16:00:00.000Z' : null,
        },
      });
    },
  );
  await page.goto(`/admin/quizzes/${adminQuizDetailFixture.id}`);

  await page.getByLabel('Correo electrónico').fill(adminFixture.email);
  await page.getByLabel('Contraseña').fill('correct-password');
  await page.getByRole('button', { name: 'Ingresar' }).click();
  await page.getByRole('button', { name: 'Publicar cuestionario' }).click();
  await page.getByRole('button', { name: 'Publicar', exact: true }).click();

  await expect(
    page.getByRole('button', { name: 'Copiar enlace' }),
  ).toBeVisible();
  await expect(
    page.getByRole('link', {
      name: new RegExp(`/quiz/${adminQuizDetailFixture.publicId}$`),
    }),
  ).toBeVisible();
  await page.getByRole('button', { name: 'Cerrar cuestionario' }).click();
  await page
    .getByRole('dialog')
    .getByRole('button', { name: 'Cerrar cuestionario' })
    .click();

  await expect(
    page.getByText(
      'El cuestionario está cerrado y ya no admite nuevas participaciones.',
    ),
  ).toBeVisible();
});

test('starts, resolves and submits a public quiz', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
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
  await expect(page.getByRole('timer')).toBeVisible();
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
  await expect(
    page.getByRole('heading', { name: 'Revisa cómo obtuviste tu nota' }),
  ).toBeVisible();
  await expect(page.getByText('Tu respuesta · Correcta')).toBeVisible();
  await page.getByRole('link', { name: 'Ver tabla de clasificación' }).click();

  await expect(
    page.getByRole('heading', { name: 'Tabla de clasificación' }),
  ).toBeVisible();
  await expect(page.getByRole('cell', { name: 'Ada Tú' })).toBeVisible();
});
