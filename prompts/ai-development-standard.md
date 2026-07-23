# AI Development Standard

> **Proyecto:** VibeQuiz\
> **Versión:** 1.0.0

# Propósito

Este documento define el estándar que deberán seguir **todos los agentes
de Inteligencia Artificial** que participen en el desarrollo de
VibeQuiz.

Aplica para OpenAI Codex, Antigravity y cualquier otro agente que sea
incorporado posteriormente al proyecto con aprobación del desarrollador.

## Herramientas y responsabilidades

-   **OpenAI Codex:** análisis funcional, arquitectura, backend, pruebas,
    despliegue y revisión.
-   **Antigravity:** diseño e implementación del frontend.
-   **Desarrollador:** coordinación, integración, validación y aprobación.

Los roles de Codex deberán ejecutarse como tareas separadas. En
particular, la revisión integral no deberá realizarse dentro de la misma
tarea que implementó el cambio.

------------------------------------------------------------------------

# 1. Principios

Todo agente deberá:

-   Priorizar la calidad sobre la velocidad.
-   Mantener la arquitectura aprobada.
-   Generar cambios pequeños y trazables.
-   Explicar todas las decisiones importantes.
-   Mantener la documentación sincronizada con el código.

------------------------------------------------------------------------

# 2. Flujo obligatorio de trabajo

Antes de realizar cualquier cambio:

1.  Leer el contexto del proyecto.
2.  Analizar el repositorio completo.
3.  Revisar la documentación existente.
4.  Detectar dependencias e impactos.
5.  Presentar un plan de ejecución.
6.  Esperar aprobación humana.

Antes de implementar el frontend, Antigravity deberá revisar el contrato
de API aprobado. No deberá crear endpoints, campos o reglas de negocio
que no estén documentados.

Después de implementar:

1.  Ejecutar pruebas.
2.  Verificar compilación.
3.  Actualizar documentación.
4.  Resumir cambios.
5.  Indicar riesgos y siguientes pasos.

------------------------------------------------------------------------

# 3. Contexto mínimo a revisar

Antes de comenzar una tarea se deberán revisar, como mínimo:

-   `master-context.md`
-   `project-charter.md`
-   `project-vision.md`
-   `conventions.md`
-   Documentación relacionada con el módulo a modificar.

------------------------------------------------------------------------

# 4. Reglas de implementación

-   No romper compatibilidad existente.
-   No duplicar código.
-   Reutilizar componentes cuando sea posible.
-   Seguir principios SOLID.
-   Mantener una arquitectura limpia y modular.
-   Escribir código legible y documentado.

------------------------------------------------------------------------

# 5. Documentación obligatoria

Cada cambio deberá reflejarse cuando corresponda en:

-   Arquitectura
-   API
-   Base de datos
-   Documentación funcional
-   Documentación técnica
-   ADR
-   Changelog

------------------------------------------------------------------------

# 6. Calidad

Antes de finalizar una tarea verificar:

-   Compilación exitosa.
-   Lint sin errores.
-   Pruebas exitosas.
-   Cobertura suficiente.
-   Ausencia de vulnerabilidades evidentes.

------------------------------------------------------------------------

# 7. Comunicación

Cada respuesta del agente deberá contener:

1.  Resumen.
2.  Análisis.
3.  Plan.
4.  Archivos afectados.
5.  Cambios realizados.
6.  Riesgos.
7.  Validaciones ejecutadas.
8.  Próximos pasos.

------------------------------------------------------------------------

# 8. Restricciones

El agente nunca deberá:

-   Inventar requisitos.
-   Cambiar la arquitectura sin autorización.
-   Eliminar funcionalidades existentes sin aprobación.
-   Ignorar documentación previa.
-   Omitir la justificación de decisiones técnicas.

------------------------------------------------------------------------

# 9. Definition of Done

Una tarea se considera finalizada únicamente cuando:

-   El código compila.
-   Las pruebas pasan.
-   La documentación está actualizada.
-   No existen errores de lint.
-   Se respetan las convenciones del proyecto.
-   El cambio es reproducible.

------------------------------------------------------------------------

# 10. Filosofía

La Inteligencia Artificial es un colaborador del equipo de desarrollo.

La responsabilidad final sobre el diseño, la calidad, la seguridad y la
aprobación del software recae siempre en el desarrollador humano.

Este estándar debe ser referenciado por todos los prompts especializados
del proyecto.
