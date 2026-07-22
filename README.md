# VibeQuiz

> **Una plataforma educativa construida mediante Vibe Coding y
> desarrollo de software asistido por Inteligencia Artificial.**

![Estado](https://img.shields.io/badge/estado-En%20desarrollo-blue)
![Licencia](https://img.shields.io/badge/licencia-MIT-green)
![Frontend](https://img.shields.io/badge/frontend-React-61DAFB)
![Backend](https://img.shields.io/badge/backend-NestJS-E0234E)
![Base%20de%20Datos](https://img.shields.io/badge/PostgreSQL-336791)

------------------------------------------------------------------------

# Acerca del proyecto

**VibeQuiz** es un proyecto educativo desarrollado para el curso
**Seminario de Tecnologías de la Información**.

Este proyecto **no pretende convertirse en la mejor plataforma de
cuestionarios**, ni competir con soluciones comerciales.

Su propósito es demostrar cómo construir una aplicación completa
utilizando:

-   🤖 Agentes de Inteligencia Artificial
-   💬 Vibe Coding
-   👨‍💻 Supervisión humana
-   🏗️ Buenas prácticas de Ingeniería de Software

El verdadero objetivo del repositorio es documentar de principio a fin
el proceso de desarrollo de software moderno.

------------------------------------------------------------------------

# ¿Qué encontrarás en este repositorio?

-   ✅ Código fuente
-   ✅ Prompts completos utilizados durante el desarrollo
-   ✅ Arquitectura de software
-   ✅ Decisiones técnicas (ADR)
-   ✅ Documentación funcional
-   ✅ Documentación técnica
-   ✅ Pruebas automatizadas
-   ✅ Guías de despliegue
-   ✅ Revisiones realizadas por IA

------------------------------------------------------------------------

# Stack tecnológico

## Frontend

-   React
-   TypeScript
-   Vite
-   Tailwind CSS

## Backend

-   NestJS
-   Prisma ORM

## Base de datos

-   PostgreSQL

## Pruebas

-   Jest
-   Supertest

## Despliegue

-   Vercel
-   Railway
-   GitHub Actions

------------------------------------------------------------------------

# Estructura del repositorio

``` text
.
├── backend/
├── frontend/
├── docs/
├── prompts/
├── screenshots/
├── .github/
├── README.md
└── LICENSE
```

------------------------------------------------------------------------

# Documentación

  Carpeta                Descripción
  ---------------------- ----------------------------
  docs/01-project        Definición del proyecto
  docs/02-functional     Análisis funcional
  docs/03-architecture   Arquitectura
  docs/04-api            Documentación de API
  docs/05-database       Diseño de base de datos
  docs/06-deployment     Guía de despliegue
  docs/07-testing        Estrategia de pruebas
  docs/08-security       Seguridad
  docs/09-decisions      Decisiones arquitectónicas
  prompts/               Prompts utilizados

------------------------------------------------------------------------

# Flujo de desarrollo

``` text
Requerimientos
      │
Arquitectura
      │
Planeación con IA
      │
Implementación
      │
Pruebas
      │
Revisión
      │
Despliegue
      │
Documentación
```

------------------------------------------------------------------------

# Arquitectura de despliegue

``` text
GitHub
   │
GitHub Actions
   │
├── Railway (Backend)
├── Railway (PostgreSQL)
└── Vercel (Frontend)
```

------------------------------------------------------------------------

# Agentes de IA

  Participante    Responsabilidad
  --------------- ------------------------------------------------------
  OpenAI Codex    Análisis, arquitectura, backend, pruebas y revisión
  Antigravity     Diseño e implementación del frontend
  Desarrollador   Coordinación, integración, validación y aprobación

Codex trabajará en tareas separadas según el rol asignado: analista,
arquitecto, ingeniero backend, QA y revisor. La revisión se realizará en
una tarea independiente de la implementación para mantener su contexto
separado y evaluar el resultado contra los requisitos aprobados.

Antigravity implementará el frontend a partir del contrato de API y la
arquitectura previamente aprobados.

## Flujo de colaboración

``` text
Desarrollador define el objetivo
              │
Codex analiza y diseña
              │
Desarrollador aprueba la arquitectura
              │
Codex implementa backend y pruebas
              │
Antigravity implementa frontend
              │
Codex revisa la integración
              │
Desarrollador valida y aprueba
```

------------------------------------------------------------------------

# Filosofía

La Inteligencia Artificial **no reemplaza al desarrollador**.

El desarrollador continúa siendo responsable de:

-   Arquitectura
-   Seguridad
-   Revisión de código
-   Pruebas
-   Documentación
-   Aprobación final

------------------------------------------------------------------------

# Licencia

Este proyecto se distribuye bajo la licencia MIT.

------------------------------------------------------------------------

# Agradecimientos

Desarrollado como un proyecto educativo para demostrar el potencial del
**Vibe Coding** y del desarrollo de software asistido por Inteligencia
Artificial.
