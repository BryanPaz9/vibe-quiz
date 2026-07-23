# ADR-002 — Edición atómica del agregado Quiz

**Estado:** Aceptado  
**Fecha:** 2026-07-22
**Fecha de aceptación:** 2026-07-22

## Contexto

Preguntas, opciones, orden y respuesta correcta deben permanecer
consistentes. Muchos endpoints granulares introducen reordenamientos y
estados parciales.

## Decisión

Crear y reemplazar el contenido completo de un quiz `DRAFT` mediante
operaciones transaccionales `POST` y `PUT`.

## Consecuencias

- Contrato frontend más simple.
- Validación del agregado en una sola operación.
- Payload mayor, aceptable para el MVP.
- Requiere controlar IDs y reemplazo de hijos cuidadosamente.

## Alternativa descartada

CRUD individual y endpoint de reordenamiento por cada recurso.
