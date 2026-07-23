# Trazabilidad arquitectónica

## Requisitos funcionales

| Requisitos | Componentes y contratos |
|---|---|
| FR-001 | AuthModule, AdminModule, `/auth/*`, JWT |
| FR-002, FR-003, FR-004, FR-005, FR-006, FR-007 | QuizzesModule, `/admin/quizzes/*`, Quiz/Question/Option |
| FR-008, FR-009 | QuizzesModule, `publicId`, `/public/quizzes/:publicId` |
| FR-010, FR-011 | ParticipationsModule, Participation, inicio público |
| FR-012, FR-013 | DTO público separado, frontend participation |
| FR-014, FR-015, FR-016, FR-017, FR-018 | ParticipationsModule, ScoringModule, transacción de submission |
| FR-019 | QuizzesModule, endpoint administrativo de resultados |
| FR-020, FR-021, FR-022 | RankingsModule, endpoint público y administrativo |
| FR-023 | API `/api/v1` documentada |
| FR-024 | Errores de dominio y filtro HTTP global |

## Requisitos no funcionales

| Requisitos | Decisión o mecanismo |
|---|---|
| NFR-001, NFR-002, NFR-003, NFR-004 | TypeScript estricto, módulos, CI y documentación |
| NFR-005 | Guard JWT en backend |
| NFR-006 | DTO y pipe global |
| NFR-007 | DTO público separado y pruebas |
| NFR-008 | Variables y `.env.example` |
| NFR-009 | Filtro global y sanitización de logs |
| NFR-010, NFR-011, NFR-012 | Backend autoritativo, transacción y reloj del servidor |
| NFR-013, NFR-014, NFR-015 | Arquitectura frontend y componentes accesibles |
| NFR-016 | Logs de duración y prueba repetible |
| NFR-017 | `/health/live` y `/health/ready` |
| NFR-018 | Docker local, migraciones, CI y hosting |
| NFR-019 | Validación manual/e2e de navegadores |
| NFR-020, NFR-021 | Alias mínimo y contratos públicos limitados |

## Riesgos

| Riesgo | Respuesta arquitectónica |
|---|---|
| R-001 | Monolito modular y flujo vertical |
| R-002 | Contrato REST versionado antes del frontend |
| R-003 | ADR y trazabilidad |
| R-004 | Revisión en tarea separada |
| R-005 | Docker, seed y respaldo de demo |
| R-006 | DTO públicos separados |
| R-007 | Backend autoritativo |
| R-008 | Limitación de alias documentada |
| R-009 | Health checks y entorno local |

## Cambios que requieren actualización

- Un endpoint cambia `05-api-contract.md` y sus pruebas.
- Una tabla cambia `04-data-model.md`, Prisma y migraciones.
- Una regla cambia análisis funcional, arquitectura y pruebas.
- Una decisión aceptada se modifica mediante un nuevo ADR que sustituya
  al anterior.
