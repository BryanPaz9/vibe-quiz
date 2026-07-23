# Arquitectura de VibeQuiz

> **Estado:** Aprobada  
> **Versión:** 1.0.0  
> **Fase:** Diseño de arquitectura  
> **Fecha:** 2026-07-22
> **Fecha de aprobación:** 2026-07-22

## Propósito

Definir una arquitectura implementable y trazable para el MVP aprobado,
sin generar todavía código de frontend o backend.

## Principios

- El backend es autoritativo para permisos, tiempo, puntuación y ranking.
- El contrato REST se aprueba antes de iniciar el frontend.
- La solución favorece simplicidad, claridad y demostración educativa.
- Las reglas de negocio permanecen separadas de HTTP y persistencia.
- Los contratos públicos nunca exponen respuestas correctas.
- Los cambios de estado y calificación se ejecutan transaccionalmente.

## Documentos

| Documento | Contenido |
|---|---|
| `01-system-architecture.md` | Contexto, contenedores y flujos |
| `02-backend-architecture.md` | Módulos y capas de NestJS |
| `03-frontend-architecture.md` | Estructura React para Antigravity |
| `04-data-model.md` | Modelo PostgreSQL y restricciones |
| `05-api-contract.md` | Contrato REST v1 |
| `06-security.md` | Autenticación, autorización y protección |
| `07-errors-logging-observability.md` | Errores, logs y health checks |
| `08-testing-strategy.md` | Pirámide y cobertura de pruebas |
| `09-repository-and-deployment.md` | Monorepo, configuración y despliegue |
| `10-architecture-traceability.md` | Requisitos a componentes |
| `decisions/` | Registros de decisiones arquitectónicas |

## Decisiones aprobadas

Las decisiones `ADR-001` a `ADR-006` fueron aceptadas por el
desarrollador el 2026-07-22 y forman parte de la arquitectura vigente.

## Puerta de salida

La puerta de salida de arquitectura está satisfecha:

1. Los seis ADR están aceptados.
2. El modelo de datos y el contrato REST están aprobados.
3. `03-frontend-architecture.md` y `05-api-contract.md` serán fuentes
   obligatorias para Antigravity.
4. Las variables y límites de seguridad están definidos.

Backend y frontend pueden pasar a implementación en ramas y tareas
separadas.
