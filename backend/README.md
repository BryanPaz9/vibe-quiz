# VibeQuiz Backend

API REST del MVP construida con NestJS, Prisma y PostgreSQL.

## Requisitos

- Node.js 20 o superior.
- npm.
- Docker Desktop con contenedores Linux.

## Inicio local

Desde la raíz:

```powershell
docker compose up -d postgres
```

Desde `backend/`:

```powershell
npm install
Copy-Item .env.example .env
npm run prisma:generate
npm run prisma:migrate
npm run prisma:seed
npm run start:dev
```

Cambie los secretos de `.env` antes de usar un entorno compartido.

## Validación

```powershell
npm run lint
npm run build
npm test -- --runInBand
```

Para pruebas e2e:

```powershell
docker compose --profile test up -d postgres-test
$env:DATABASE_URL="postgresql://vibequiz:vibequiz@localhost:5433/vibequiz_test?schema=public"
npm run prisma:migrate:deploy
npm run test:e2e -- --runInBand
```

La base de pruebas es independiente de `vibequiz`.

## Contrato

El contrato aprobado se encuentra en
`docs/03-architecture/05-api-contract.md`.

- API: `http://localhost:3000/api/v1`
- Liveness: `/api/v1/health/live`
- Readiness: `/api/v1/health/ready`
- Swagger UI: `/api/docs`
- OpenAPI JSON: `/api/docs-json`

`ADMIN_EMAIL` y `ADMIN_INITIAL_PASSWORD` solo son necesarios al ejecutar
el seed. No son requisitos para iniciar la API una vez provisionado el
administrador.

`JWT_EXPIRES_IN` acepta segundos o duraciones con sufijo (`s`, `m`, `h`,
`d`). La respuesta de login siempre expone `expiresIn` como segundos
numéricos, según el contrato REST.

## Postman

Importe los dos archivos de `../postman/`, seleccione el environment
`VibeQuiz Local`, establezca `adminPassword` con el valor local de
`ADMIN_INITIAL_PASSWORD` y ejecute las solicitudes numeradas en orden.
