# VibeQuiz - Master Context

> **Version:** 1.0.0\
> **Project:** Seminario de Tecnologías de la Información

## 1. Propósito

**VibeQuiz** es un proyecto educativo desarrollado para el curso
**Seminario de Tecnologías de la Información**.

Este proyecto **NO pretende ser la mejor plataforma de quizzes**.

Su objetivo es demostrar cómo construir una aplicación completa
utilizando:

-   Vibe Coding
-   Agentes de Inteligencia Artificial
-   Supervisión humana

El repositorio incluirá:

-   Código fuente
-   Prompts completos
-   Arquitectura
-   Commits documentados
-   Decisiones técnicas
-   Revisiones realizadas por IA
-   Flujo de despliegue
-   Pruebas automatizadas

## 2. Objetivos

### Objetivo general

Construir una plataforma educativa de cuestionarios utilizando Vibe
Coding y documentar completamente su proceso de desarrollo.

### Objetivos específicos

-   Construir un MVP funcional.
-   Publicar todo el código fuente.
-   Publicar todos los prompts utilizados.
-   Documentar la arquitectura.
-   Publicar pruebas automatizadas.
-   Documentar el despliegue.
-   Servir como proyecto educativo de referencia.

## 3. Filosofía

La IA no reemplaza al desarrollador.

El desarrollador:

1.  Comprende el problema.
2.  Diseña la solución.
3.  Coordina agentes.
4.  Revisa el código.
5.  Ejecuta pruebas.
6.  Aprueba los cambios.

## 3.1 Equipo de desarrollo asistido por IA

El proyecto utilizará dos herramientas de IA con responsabilidades
definidas:

-   **OpenAI Codex:** análisis funcional, arquitectura, implementación
    del backend, pruebas automatizadas, despliegue y revisión integral.
-   **Antigravity:** diseño e implementación del frontend conforme a la
    arquitectura y al contrato de API aprobados.
-   **Desarrollador:** definición de objetivos, coordinación, decisiones
    técnicas, integración, validación y aprobación final.

Codex operará mediante tareas separadas para los roles de analista,
arquitecto, ingeniero backend, QA y revisor. La tarea de revisión deberá
iniciarse con un contexto independiente y evaluar el resultado contra
los requisitos, la arquitectura y los criterios de aceptación.

## 4. Alcance del MVP

Incluye:

-   Gestión de quizzes.
-   Preguntas de opción múltiple.
-   Participación mediante URL.
-   Calificación automática.
-   Ranking.
-   API REST.
-   Panel administrativo.

No incluye:

-   Integración con Canvas.
-   WebSockets.
-   Gamificación.
-   IA generativa para preguntas.
-   Plataforma empresarial.

## 5. Arquitectura

Frontend: - React - TypeScript - Vite - Tailwind CSS - Vercel

Backend: - NestJS - Prisma - Railway

Base de datos: - PostgreSQL - Railway

Testing: - Jest - Supertest

Repositorio: - GitHub

CI/CD: - GitHub Actions

## 6. Flujo de despliegue

``` text
GitHub
   │
   ▼
GitHub Actions
   │
   ├── Railway
   │      Backend (NestJS)
   │
   ├── Railway
   │      PostgreSQL
   │
   └── Vercel
          Frontend (React)
```

URLs esperadas:

-   Frontend: https://vibequiz.vercel.app
-   Backend: https://vibequiz-api.up.railway.app

## 7. Documentación

Toda la documentación se escribirá en Markdown.

Se documentará:

-   Arquitectura
-   Funcional
-   Técnica
-   API
-   Base de datos
-   Seguridad
-   Testing
-   Deployment
-   ADR
-   Lecciones aprendidas

## 8. Prompts

Cada prompt incluirá:

-   Objetivo
-   Herramienta
-   Contexto
-   Prompt completo
-   Resultado esperado
-   Resultado obtenido
-   Cambios humanos
-   Lecciones aprendidas

## 9. Reglas para los agentes

Antes de modificar:

-   Analizar
-   Presentar plan
-   Esperar aprobación

Después de modificar:

-   Ejecutar pruebas
-   Actualizar documentación
-   Explicar decisiones

Reglas de coordinación:

-   El contrato de API deberá aprobarse antes de iniciar el frontend.
-   Antigravity no deberá inventar endpoints ni estructuras de datos.
-   Los cambios de contrato deberán ser aprobados y documentados antes
    de actualizar frontend o backend.
-   La revisión de Codex se ejecutará en una tarea distinta de la tarea
    que realizó la implementación.
-   La aprobación final siempre corresponderá al desarrollador.

## 10. Resultado esperado

VibeQuiz será un repositorio educativo que documentará de extremo a
extremo el proceso de desarrollo moderno mediante Vibe Coding y agentes
de IA.
