# API implementada

La API v1 implementa el contrato aprobado en
`docs/03-architecture/05-api-contract.md`.

Incluye autenticación JWT, gestión atómica de quizzes, publicación,
cierre, vista pública, participaciones protegidas, calificación,
resultados, ranking base, errores consistentes y health checks.

El desempate por menor duración permanece reservado para la
demostración en vivo.

## OpenAPI

- Swagger UI: `/api/docs`
- Especificación JSON: `/api/docs-json`

La especificación se genera desde controladores y DTO de NestJS y debe
permanecer alineada con `docs/03-architecture/05-api-contract.md`.
