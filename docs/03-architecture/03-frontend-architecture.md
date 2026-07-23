# Arquitectura del frontend

## Responsabilidad de Antigravity

Antigravity implementará esta arquitectura después de aprobarse el
contrato REST. No podrá inventar endpoints, campos, estados ni reglas.

## Enfoque

Aplicación React de una sola página, organizada por funcionalidades y
con límites entre rutas, componentes visuales, acceso a API y estado
remoto.

## Áreas

### Pública

- `/quiz/:publicId`: presentación e ingreso de alias.
- `/quiz/:publicId/play`: resolución.
- `/quiz/:publicId/result/:participationId`: resultado.
- `/quiz/:publicId/ranking`: ranking público.

### Administrativa

- `/admin/login`: autenticación.
- `/admin/quizzes`: listado.
- `/admin/quizzes/new`: creación.
- `/admin/quizzes/:id`: detalle y edición.
- `/admin/quizzes/:id/results`: resultados.
- `/admin/quizzes/:id/ranking`: ranking.

## Estructura propuesta

```text
frontend/src/
  app/
    router/
    providers/
    layouts/
  features/
    auth/
    quizzes/
    participation/
    results/
    ranking/
  shared/
    api/
    components/
    hooks/
    types/
    validation/
    utils/
  styles/
```

Cada feature puede contener:

```text
feature/
  api/
  components/
  hooks/
  pages/
  schemas/
  types/
```

## Estado

- Estado remoto: biblioteca de consultas con caché y mutaciones.
- Formularios: biblioteca de formularios más esquemas de validación.
- Estado local: React para interacción efímera.
- Sesión administrativa: token en memoria; no almacenar secretos en
  código ni registrar el token.

La selección exacta de bibliotecas se fijará al iniciar frontend sin
alterar el contrato ni las responsabilidades descritas.

## Sesión administrativa

El cliente enviará `Authorization: Bearer <token>`. Ante `401`, limpiará
la sesión y redirigirá a login. Las rutas protegidas mejoran la
experiencia, pero el backend conserva la autorización real.

## Participación

El identificador y token opaco de participación devueltos al iniciar se
mantendrán durante el flujo. El token permite consultar y enviar esa
participación sin crear cuentas públicas.

Esta propuesta evita que conocer un `participationId` sea suficiente
para consultar o modificar el intento.

## Componentes compartidos mínimos

- Botón, campo, textarea y selector.
- Mensaje de validación.
- Estado de carga, vacío y error.
- Confirmación de acción destructiva.
- Tabla o lista adaptable.
- Badge de estado.
- Contenedor de página y navegación.

## Reglas de UX

- Deshabilitar doble envío mientras una mutación está pendiente.
- Mantener preguntas respondidas ante errores recuperables.
- Confirmar publicación, cierre y eliminación.
- No mostrar marcas de respuesta correcta.
- Mostrar duración únicamente con el valor devuelto por el backend.
- Etiquetar controles y conservar navegación mediante teclado.

## Selección de bibliotecas

La fase de fundamentos fijó las siguientes bibliotecas:

- React 18 y TypeScript 5.9.
- Vite 6 y Tailwind CSS 4.
- React Router 7.
- TanStack Query para estado remoto.
- React Hook Form y Zod para formularios y validación.
- `fetch` encapsulado para acceso REST.
- Vitest, React Testing Library y MSW para pruebas.
- Playwright para pruebas de extremo a extremo.

React Router 7 sustituyó la propuesta inicial de la línea 6 porque la
versión 6 disponible conservaba vulnerabilidades conocidas. Este cambio
no modifica las rutas ni el contrato aprobados.

El token opaco de participación se conserva en `sessionStorage`,
asociado a `participationId`, durante el flujo de la pestaña. No se
incluye en URL, logs ni estado persistente de larga duración.

## Estado de implementación

La fase inicial implementa el scaffold, todas las rutas, layouts,
providers, componentes compartidos, tipos contractuales, cliente REST y
configuración de pruebas. Las páginas funcionales permanecen como
marcadores explícitos hasta sus respectivas entregas.
