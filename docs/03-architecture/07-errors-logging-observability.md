# Errores, logging y observabilidad

## Taxonomía de errores

- `VALIDATION_ERROR` — 400.
- `INVALID_CREDENTIALS` — 401.
- `UNAUTHORIZED` — 401.
- `FORBIDDEN` — 403.
- `QUIZ_NOT_FOUND` — 404.
- `QUIZ_NOT_AVAILABLE` — 409.
- `QUIZ_NOT_EDITABLE` — 409.
- `QUIZ_NOT_DELETABLE` — 409.
- `ALIAS_ALREADY_USED` — 409.
- `INCOMPLETE_SUBMISSION` — 400.
- `INVALID_ANSWER` — 400.
- `PARTICIPATION_COMPLETED` — 409.
- `INVALID_PARTICIPATION_TOKEN` — 401.
- `RATE_LIMITED` — 429.
- `INTERNAL_ERROR` — 500.

Los errores de dominio se traducen a HTTP en un filtro global. La capa
de dominio no conoce códigos HTTP.

## Request ID

- Aceptar `X-Request-Id` solo si cumple el formato permitido; de lo
  contrario generar UUID.
- Devolverlo en header y cuerpo de error.
- Propagarlo en todos los logs de la solicitud.

## Logging estructurado

Campos mínimos:

- timestamp
- level
- message
- requestId
- method
- path normalizado
- statusCode
- durationMs
- environment

Cuando aplique, incluir identificadores internos de quiz o
participación, pero nunca:

- Contraseñas o hashes.
- JWT o token de participación.
- `Authorization`.
- Cadenas de conexión.
- Respuestas completas del participante.

## Niveles

- `info`: inicio, fin, transiciones y despliegue.
- `warn`: validación relevante, conflictos y rate limit.
- `error`: fallos inesperados o dependencia no disponible.
- `debug`: solo desarrollo, sin secretos.

## Health

### Liveness

`GET /health/live` verifica que el proceso y event loop responden.

### Readiness

`GET /health/ready` realiza una consulta liviana a PostgreSQL. Devuelve
`503` si la dependencia crítica no está disponible.

## Métricas educativas

Sin incorporar una plataforma compleja, los logs permitirán derivar:

- Cantidad y latencia por endpoint.
- Respuestas por código HTTP.
- Fallos de login.
- Conflictos de alias.
- Envíos completados y fallidos.

El objetivo NFR-016 se evaluará con una prueba repetible, excluyendo
arranque en frío y latencia de Internet.
