# VibeQuiz Frontend

Aplicación React de VibeQuiz. Consume exclusivamente el contrato REST v1
aprobado en `docs/03-architecture/05-api-contract.md`.

## Requisitos

- Node.js 20.18 o superior.
- Backend local disponible en `http://localhost:3000`.

## Configuración

```powershell
Copy-Item .env.example .env
npm install
```

Variable disponible:

```env
VITE_API_BASE_URL=http://localhost:3000/api/v1
```

No se documentan credenciales ni tokens reales en este repositorio.

## Comandos

```powershell
npm run dev
npm run lint
npm run format:check
npm test
npm run build
npm run test:e2e
```

La primera ejecución E2E requiere instalar Chromium:

```powershell
npx playwright install chromium
```

## Arquitectura

```text
src/
  app/
    layouts/
    providers/
    router/
  features/
    auth/
    participation/
    quizzes/
    ranking/
    results/
  mocks/
  shared/
    api/
    components/
    pages/
    types/
  test/
```

- TanStack Query administra estado remoto.
- React Hook Form y Zod están disponibles para formularios.
- El JWT administrativo permanece exclusivamente en memoria.
- El token opaco de participación se conserva durante el flujo en
  `sessionStorage` y nunca se coloca en la URL.
- El cliente REST utiliza `Bearer` para administración y `Participation` para
  intentos públicos.
- MSW usa fixtures derivados del contrato, no respuestas inventadas.

## Estado de implementación

El scaffold y sus fundamentos están completos: rutas, layouts, providers,
componentes compartidos, cliente REST, tipos contractuales y configuración de
pruebas.

El primer checkpoint del flujo público también está implementado:

- Consulta de un cuestionario publicado.
- Presentación de metadatos sin mostrar preguntas ni respuestas correctas.
- Validación de alias.
- Inicio de participación.
- Persistencia del token por pestaña y navegación al jugador.
- Recuperación de una participación iniciada en la misma pestaña.

La resolución, el envío, el resultado, el ranking y la autenticación
administrativa continúan reservados para sus siguientes checkpoints.
