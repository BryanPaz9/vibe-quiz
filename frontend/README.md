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

Los tres checkpoints del flujo público están implementados:

- Consulta de un cuestionario publicado.
- Presentación de metadatos sin mostrar preguntas ni respuestas correctas.
- Validación de alias.
- Inicio de participación.
- Persistencia del token por pestaña y navegación al jugador.
- Recuperación de una participación iniciada en la misma pestaña.
- Presentación ordenada de preguntas y opciones públicas.
- Persistencia temporal de cada respuesta seleccionada.
- Validación de que todas las preguntas estén respondidas.
- Envío único mediante el token `Participation`.
- Conservación de respuestas ante errores recuperables.
- Navegación al resultado después de un envío aceptado.
- Consulta autorizada del resultado mediante el token de participación.
- Presentación de puntuación, porcentaje y duración del backend.
- Estado de intento completado que impide volver a responder.
- Ranking público adaptable, incluido su estado vacío.

La autenticación administrativa del cuarto checkpoint está implementada:

- Login validado contra `POST /auth/login`.
- Verificación de identidad mediante `GET /auth/me`.
- JWT de vida corta almacenado únicamente en memoria.
- Protección y recuperación de rutas administrativas internas.
- Limpieza de sesión ante expiración, respuesta `401` o cierre manual.

El primer checkpoint de administración de cuestionarios también está
implementado y conserva trazabilidad con `FR-003`, `US-003`, `AC-001`,
`AC-004`, `AC-015` y `AC-016`:

- Consulta Bearer de `GET /admin/quizzes`.
- Paginación autoritativa mediante la metadata del backend.
- Búsqueda y filtro por estado sincronizados con la URL.
- Presentación de estado, cantidades y fechas contractuales.
- Estados de carga, vacío, búsqueda sin resultados y error con reintento.
- Navegación hacia los placeholders aprobados de creación y detalle.
- Limpieza global de la sesión y regreso al login ante `401`.

El checkpoint de creación administrativa está implementado:

- Formulario dinámico para el agregado completo del cuestionario.
- Gestión y orden explícito de preguntas y opciones.
- Una única respuesta correcta por pregunta.
- Validación de los límites aprobados antes de enviar.
- Creación Bearer mediante `POST /admin/quizzes`.
- Conservación del formulario ante errores recuperables.
- Navegación al detalle creado usando el identificador del backend.

El checkpoint de detalle y edición administrativa está implementado:

- Consulta Bearer mediante `GET /admin/quizzes/:quizId`.
- Precarga del agregado y reutilización del editor completo para borradores.
- Reemplazo transaccional mediante `PUT /admin/quizzes/:quizId`.
- Vista de solo lectura para cuestionarios `PUBLISHED` y `CLOSED`.
- Presentación administrativa de respuestas correctas y fechas contractuales.
- Conservación de cambios locales ante errores recuperables.

El checkpoint de resultados y ranking administrativos está implementado:

- Resultados paginados mediante `GET /admin/quizzes/:quizId/results`.
- Estados `ACTIVE` y `COMPLETED` con valores pendientes explícitos.
- Ranking Bearer mediante `GET /admin/quizzes/:quizId/ranking`.
- Navegación entre detalle, resultados y ranking.
- Estados de carga, vacío, error, reintento y `401`.
- DTO administrativo limitado a los campos aprobados, sin hashes ni alias
  normalizados.

El checkpoint de ciclo de vida administrativo está implementado:

- Publicación confirmada de borradores mediante
  `POST /admin/quizzes/:quizId/publish`.
- Presentación, apertura y copia del enlace público devuelto por el contrato.
- Cierre confirmado de cuestionarios publicados mediante
  `POST /admin/quizzes/:quizId/close`.
- Eliminación permanente y confirmada de borradores elegibles.
- Controles disponibles únicamente para las transiciones válidas de cada
  estado.
- Bloqueo de doble envío, errores recuperables y limpieza global ante `401`.

Permanece la validación funcional final del sistema en navegadores contra el
backend integrado.

El checkpoint de experiencia visual incorpora:

- Favicon, logotipo e isotipo oficiales de VibeQuiz.
- Landing informativa con contexto del flujo de creación, publicación y
  resultados.
- Login administrativo centrado.
- Font Awesome Free 6.7.2 con texto en acciones principales y etiquetas
  accesibles en controles que muestran únicamente el icono.
- Indicadores de carga en consultas y botones con mutaciones pendientes.
- Motion para transiciones en edición y resolución, respetando la preferencia
  de movimiento reducido del sistema.

La sesión administrativa continúa exclusivamente en memoria por decisión de
seguridad. Una recarga requiere autenticarse nuevamente; persistencia o
renovación necesitarían un contrato de refresh token independiente.
