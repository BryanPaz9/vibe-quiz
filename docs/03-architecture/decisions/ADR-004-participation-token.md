# ADR-004 — Token opaco por participación

**Estado:** Aceptado  
**Fecha:** 2026-07-22
**Fecha de aceptación:** 2026-07-22

## Contexto

Los participantes no tienen cuenta. Un UUID de participación por sí solo
no debe autorizar consulta o envío.

## Decisión

Generar un token aleatorio al iniciar, devolverlo una vez y almacenar
solo su hash. Exigirlo para enviar y consultar el resultado.

## Consecuencias

- Evita autorización basada únicamente en identificadores.
- Mantiene el flujo sin cuentas.
- El cliente debe conservar el token durante el intento.
- Perder el token impide recuperar ese intento en el MVP.

## Alternativa descartada

Usar únicamente `participationId`, por ser susceptible a acceso
indebido si se comparte o descubre.
