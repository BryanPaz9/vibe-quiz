# ADR-001 — Monorepo con monolito modular

**Estado:** Aceptado  
**Fecha:** 2026-07-22
**Fecha de aceptación:** 2026-07-22

## Contexto

El MVP tiene frontend, backend y documentación, tiempo limitado y una
finalidad educativa. No requiere escalamiento independiente por dominio.

## Decisión

Mantener frontend y backend en un único repositorio, con builds
separados, y construir NestJS como monolito modular.

## Consecuencias

- Facilita trazabilidad y coordinación entre agentes.
- Reduce despliegue y operación.
- Mantiene límites internos sin costo de microservicios.
- Los módulos no se despliegan de forma independiente.

## Alternativas descartadas

- Repositorios separados: aumenta coordinación para el MVP.
- Microservicios: complejidad distribuida sin requisito que la justifique.
