# API implementada

La API v1 implementa el contrato aprobado en
`docs/03-architecture/05-api-contract.md`.

Incluye autenticación JWT, gestión atómica de quizzes, publicación,
cierre, vista pública, participaciones protegidas, calificación,
resultados, ranking con desempate por menor duración, errores consistentes y
health checks.

## OpenAPI

- Swagger UI: `/api/docs`
- Especificación JSON: `/api/docs-json`

La especificación se genera desde controladores y DTO de NestJS y debe
permanecer alineada con `docs/03-architecture/05-api-contract.md`.
