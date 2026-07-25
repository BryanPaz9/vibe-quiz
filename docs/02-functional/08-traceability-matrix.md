# Matriz de trazabilidad

## Requisitos funcionales

| Requisito | Historias | Reglas o decisiones | Criterios |
|---|---|---|---|
| FR-001 | US-001 | BR-021, OD-001 | AC-001 |
| FR-002 | US-002 | BR-001 a BR-004 | AC-002, AC-003 |
| FR-003 | US-003 | — | AC-004 |
| FR-004 | US-004 | BR-005, OD-003 | AC-004 |
| FR-005 | US-005 | BR-005, OD-007 | AC-005 |
| FR-006 | US-002, US-004 | BR-002 a BR-004 | AC-002, AC-003 |
| FR-007 | US-002, US-004 | BR-003, BR-004 | AC-002, AC-003 |
| FR-008 | US-006 | BR-001, OD-003 | AC-006, AC-007 |
| FR-009 | US-009 | OD-003 | AC-006, AC-007 |
| FR-010 | US-010 | BR-006, BR-007, OD-002, OD-004 | AC-008 |
| FR-011 | US-011 | BR-006, BR-007, BR-010 | AC-007, AC-008 |
| FR-012 | US-012 | BR-019 | AC-006 |
| FR-013 | US-012 | BR-008 | AC-009, AC-010 |
| FR-014 | US-013 | BR-009, BR-011 | AC-009, AC-011 |
| FR-015 | US-013 | BR-008, BR-011, OD-006 | AC-009, AC-010 |
| FR-016 | US-013 | BR-012 a BR-014, OD-008 | AC-009 |
| FR-017 | US-013 | BR-010 | AC-009 |
| FR-018 | US-014 | BR-020, OD-005, OD-008 | AC-009 |
| FR-019 | US-007 | — | AC-012 |
| FR-020 | US-008, US-015 | BR-015, BR-016 | AC-013 |
| FR-021 | US-008, US-015 | BR-017, BR-018, OD-009 | AC-014 |
| FR-022 | US-008, US-015 | BR-020, OD-005 | AC-013, AC-014 |
| FR-023 | Todas | Contrato de API por diseñar | AC-001 a AC-015 |
| FR-024 | US-016 | — | AC-003, AC-010, AC-011, AC-015 |
| FR-025 | US-018 | BR-022 | AC-018 a AC-022 |

## Trazabilidad del recorrido interactivo

| Requisito | Componente | Prueba de componente | Prueba E2E |
|---|---|---|---|
| FR-025 | `PlatformJourney` en `HomePage` | `platform-journey.test.tsx` | `explores both platform journeys from the landing` en `smoke.spec.ts` |

## Requisitos no funcionales

| Requisitos | Evidencia esperada |
|---|---|
| NFR-001 a NFR-004 | Configuración, build, lint, pruebas y revisión documental |
| NFR-005 a NFR-009 | Pruebas de autorización, validación y seguridad |
| NFR-010 a NFR-012 | Pruebas de integración de envío, tiempo y calificación |
| NFR-013 a NFR-015 | AC-016 y revisión visual/manual del frontend |
| NFR-016 | Medición de rendimiento después del despliegue |
| NFR-017 | AC-017 |
| NFR-018 | Pipeline y guía de despliegue reproducible |
| NFR-019 | Pruebas manuales en navegadores aprobados |
| NFR-020, NFR-021 | Revisión de contratos públicos y datos persistidos |

## Puerta de salida del análisis

La fase de arquitectura puede comenzar porque:

1. Las decisiones `OD-001` a `OD-010` fueron aprobadas el 2026-07-22.
2. Los requisitos y reglas afectados reflejan esas decisiones.
3. No existen contradicciones conocidas con el contexto maestro.
4. El desarrollador aprobó el alcance funcional del MVP.
