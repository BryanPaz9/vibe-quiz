# ADR-003 — JWT corto sin refresh token

**Estado:** Aceptado  
**Fecha:** 2026-07-22
**Fecha de aceptación:** 2026-07-22

## Contexto

Existe un solo administrador y no se requieren registro, recuperación ni
sesiones prolongadas.

## Decisión

Autenticar mediante contraseña con hash y emitir un JWT de acceso de vida
corta configurable. Al expirar, se inicia sesión otra vez.

## Consecuencias

- Implementación y operación simples.
- Autorización backend sin estado de sesión adicional.
- No existe revocación inmediata ni renovación transparente.
- El token no debe persistirse en logs o código.

## Alternativas descartadas

- Sesión de servidor: almacenamiento adicional.
- Refresh token: fuera del alcance del MVP.
