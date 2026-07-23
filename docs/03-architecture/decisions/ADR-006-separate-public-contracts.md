# ADR-006 — Contratos públicos separados

**Estado:** Aceptado  
**Fecha:** 2026-07-22
**Fecha de aceptación:** 2026-07-22

## Contexto

Los administradores necesitan configurar respuestas correctas; los
participantes nunca deben recibirlas.

## Decisión

Definir DTO y mappers diferentes para vistas administrativas, quiz
público, resultado y ranking. No serializar modelos Prisma directamente.

## Consecuencias

- Reduce exposición accidental.
- Hace explícita la evolución del contrato.
- Introduce mappers adicionales.
- Requiere pruebas que aseguren ausencia de `isCorrect`.

## Alternativa descartada

Reutilizar el mismo DTO y ocultar campos condicionalmente.
