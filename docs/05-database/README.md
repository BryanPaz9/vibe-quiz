# Base de datos implementada

PostgreSQL se ejecuta mediante `compose.yaml`. Prisma define el esquema y
conserva migraciones versionadas en `backend/prisma/migrations`.

- `vibequiz`, puerto `5432`: desarrollo.
- `vibequiz_test`, puerto `5433`: pruebas e2e aisladas.

El modelo detallado está en `docs/03-architecture/04-data-model.md`.
Producción deberá ejecutar `prisma migrate deploy`. Nunca se debe limpiar
una URL que no esté identificada explícitamente como base de pruebas.

La configuración de Prisma vive en `backend/prisma.config.ts`. Las
credenciales del administrador son requeridas únicamente por el seed.
