# Repositorio y despliegue

## Monorepo

```text
.
├── backend/
│   ├── prisma/
│   │   ├── migrations/
│   │   ├── schema.prisma
│   │   └── seed.ts
│   ├── src/
│   └── test/
├── frontend/
│   ├── public/
│   └── src/
├── docs/
├── prompts/
├── screenshots/
├── .github/
│   └── workflows/
├── AGENTS.md
└── README.md
```

Frontend y backend mantienen manifests y ciclos de build separados. No
se introduce una herramienta compleja de monorepo para el MVP.

## Entornos

### Local

- Frontend Vite.
- Backend NestJS.
- PostgreSQL mediante Docker Compose.
- Variables en archivos locales ignorados.

### CI

- Instalación reproducible.
- Lint y build separados.
- PostgreSQL efímero para integración.
- Pruebas backend y frontend.
- Validación de migraciones.

### Producción

- Vercel: frontend estático.
- Railway: backend.
- Railway PostgreSQL: persistencia.
- GitHub Actions: validación y despliegue según configuración aprobada.

## Flujo

```text
feature branch
  -> pull request
  -> lint/build/tests
  -> merge develop
  -> validación integrada
  -> merge main
  -> despliegue producción
```

## Variables

### Backend

- `NODE_ENV`
- `PORT`
- `DATABASE_URL`
- `JWT_SECRET`
- `JWT_EXPIRES_IN`
- `ADMIN_EMAIL`
- `ADMIN_INITIAL_PASSWORD`
- `FRONTEND_ORIGIN`
- `LOG_LEVEL`

### Frontend

- `VITE_API_BASE_URL`

Los repositorios solo incluyen `.env.example`.

## Migraciones y seed

- Migraciones Prisma versionadas.
- Producción ejecuta migraciones antes de activar la nueva versión.
- Seed administrativo idempotente y explícito.
- No usar sincronización destructiva del esquema en producción.

## Respaldo de demostración

- Docker Compose y datos seed locales.
- Guion de prueba previo.
- Capturas o grabación de respaldo.
- Verificación de health checks antes de presentar.

## Estrategia de ramas por fase

- `feat/project_analysis_with_codex`
- `feat/project_architecture_with_codex`
- rama backend posterior.
- rama frontend posterior para integración de Antigravity.

Cada fase conserva prompts, decisiones y resultados en commits
trazables.
