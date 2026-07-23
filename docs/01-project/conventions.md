# Development Conventions

## Git

-   main: producción
-   develop: integración
-   feature/\*: nuevas funcionalidades
-   fix/\*: correcciones
-   docs/\*: documentación

## Commits

Formato:

    tipo: :emoji: (descripción)

Ejemplos:

    feat: :sparkles: (quiz creation)
    fix: :bug: (submission validation)
    docs: :memo: (update deployment guide)

## Convenciones de código

-   TypeScript estricto.
-   ESLint.
-   Prettier.
-   Una responsabilidad por clase.
-   Nombres descriptivos.

## Documentación

Toda documentación deberá escribirse en Markdown.

## IA

Todo cambio generado por IA deberá:

1.  Tener prompt documentado.
2.  Ser revisado por un humano.
3.  Pasar pruebas.
4.  Actualizar la documentación cuando aplique.

### Asignación de herramientas

-   Codex realizará análisis, arquitectura, backend, pruebas, despliegue
    y revisión mediante tareas separadas por rol.
-   Antigravity implementará el frontend utilizando el contrato de API
    aprobado.
-   La revisión integral se realizará en una tarea de Codex diferente de
    la tarea de implementación.
-   El desarrollador coordinará la integración y aprobará los cambios.
