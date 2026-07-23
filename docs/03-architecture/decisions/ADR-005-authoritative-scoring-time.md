# ADR-005 — Calificación y tiempo autoritativos

**Estado:** Aceptado  
**Fecha:** 2026-07-22
**Fecha de aceptación:** 2026-07-22

## Contexto

El ranking depende de puntuación y tiempo confiables. El navegador puede
ser manipulado.

## Decisión

El backend registra inicio y finalización, calcula duración y puntuación,
y persiste un snapshot del resultado en una transacción.

## Consecuencias

- Resultados reproducibles y protegidos frente a valores del cliente.
- El reloj del servidor es la fuente de verdad.
- `Answer.isCorrect`, score y total conservan el resultado histórico.
- Las pruebas requieren reloj inyectable.

## Alternativa descartada

Aceptar duración o puntuación calculadas en el frontend.
