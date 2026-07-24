# Contrato API REST v1

> **Estado:** Aprobado  
> **Versión:** 1.0.0  
> **Fecha de aprobación:** 2026-07-22  
> **Base path:** `/api/v1`  
> **Formato:** JSON UTF-8

## Convenciones

- Identificadores: UUID.
- Fechas: ISO 8601 UTC.
- Duración: milisegundos.
- Paginación: `page` desde 1 y `pageSize` con máximo 100.
- Rutas administrativas: JWT Bearer obligatorio.
- Rutas de una participación: token opaco obligatorio.
- Propiedades desconocidas en requests: rechazadas.

## Autenticación

### POST `/auth/login`

Request:

```json
{
  "email": "admin@example.com",
  "password": "secret"
}
```

Response `200`:

```json
{
  "accessToken": "<jwt>",
  "tokenType": "Bearer",
  "expiresIn": 3600,
  "admin": {
    "id": "uuid",
    "email": "admin@example.com"
  }
}
```

Errores: `401 INVALID_CREDENTIALS`, `429 RATE_LIMITED`.

### GET `/auth/me`

Response `200`: identidad administrativa.  
Errores: `401 UNAUTHORIZED`.

## Administración de quizzes

### GET `/admin/quizzes`

Query: `page`, `pageSize`, `status`, `search`.

Response:

```json
{
  "data": [
    {
      "id": "uuid",
      "publicId": "uuid",
      "title": "Fundamentos de IA",
      "description": "Evaluación corta",
      "status": "DRAFT",
      "questionCount": 3,
      "participationCount": 0,
      "createdAt": "2026-07-22T12:00:00.000Z",
      "updatedAt": "2026-07-22T12:00:00.000Z"
    }
  ],
  "meta": {
    "page": 1,
    "pageSize": 20,
    "total": 1,
    "totalPages": 1
  }
}
```

### POST `/admin/quizzes`

Crea el agregado completo en borrador.

```json
{
  "title": "Fundamentos de IA",
  "description": "Evaluación corta",
  "questions": [
    {
      "text": "¿Qué significa IA?",
      "position": 1,
      "options": [
        { "text": "Inteligencia Artificial", "position": 1, "isCorrect": true },
        { "text": "Interfaz Abierta", "position": 2, "isCorrect": false }
      ]
    }
  ]
}
```

Response `201`: detalle administrativo del quiz.

### GET `/admin/quizzes/:quizId`

Devuelve metadatos, preguntas, opciones y `isCorrect`.

### PUT `/admin/quizzes/:quizId`

Reemplaza metadatos y contenido completo de un `DRAFT` en una
transacción. Utiliza la misma forma de `POST`.

Esta operación de agregado reduce endpoints de reordenamiento y evita
estados parciales durante la edición.

### DELETE `/admin/quizzes/:quizId`

Response `204` únicamente para `DRAFT` sin participaciones.  
Errores: `404 QUIZ_NOT_FOUND`, `409 QUIZ_NOT_DELETABLE`.

### POST `/admin/quizzes/:quizId/publish`

Valida el agregado y cambia `DRAFT` a `PUBLISHED`.

Response `200`:

```json
{
  "id": "uuid",
  "publicId": "uuid",
  "status": "PUBLISHED",
  "publishedAt": "2026-07-22T12:00:00.000Z",
  "publicUrlPath": "/quiz/uuid"
}
```

### POST `/admin/quizzes/:quizId/close`

Cambia `PUBLISHED` a `CLOSED`. No se reabre en el MVP.

## Resultados administrativos

### GET `/admin/quizzes/:quizId/results`

Query: `page`, `pageSize`.

Response:

```json
{
  "data": [
    {
      "alias": "Ada",
      "status": "COMPLETED",
      "score": 8,
      "totalQuestions": 10,
      "percentage": 80,
      "startedAt": "2026-07-22T12:00:00.000Z",
      "completedAt": "2026-07-22T12:00:42.000Z",
      "durationMs": 42000
    }
  ],
  "meta": {
    "page": 1,
    "pageSize": 20,
    "total": 1,
    "totalPages": 1
  }
}
```

Para participaciones `ACTIVE`, `score`, `totalQuestions`, `percentage`,
`completedAt` y `durationMs` son `null`. La respuesta no incluye
`normalizedAlias`, hashes de acceso ni otros campos internos.

### GET `/admin/quizzes/:quizId/ranking`

Devuelve el mismo contrato público de ranking e incluye únicamente
participaciones completadas.

## Quiz público

### GET `/public/quizzes/:publicId`

Disponible solo para `PUBLISHED`.

```json
{
  "publicId": "uuid",
  "title": "Fundamentos de IA",
  "description": "Evaluación corta",
  "questionCount": 1,
  "questions": [
    {
      "id": "uuid",
      "text": "¿Qué significa IA?",
      "position": 1,
      "options": [
        {
          "id": "uuid",
          "text": "Inteligencia Artificial",
          "position": 1
        }
      ]
    }
  ]
}
```

Nunca incluye `isCorrect`.

### POST `/public/quizzes/:publicId/participations`

Request:

```json
{
  "alias": "Ada"
}
```

Response `201`:

```json
{
  "participationId": "uuid",
  "participationToken": "<opaque-token>",
  "quizPublicId": "uuid",
  "alias": "Ada",
  "startedAt": "2026-07-22T12:00:00.000Z"
}
```

El token se devuelve una sola vez; solo se persiste su hash.

Errores: `404 QUIZ_NOT_FOUND`, `409 ALIAS_ALREADY_USED`,
`409 QUIZ_NOT_AVAILABLE`.

## Participación

Estas rutas requieren:

```text
Authorization: Participation <opaque-token>
```

### POST `/participations/:participationId/submissions`

Request:

```json
{
  "answers": [
    {
      "questionId": "uuid",
      "optionId": "uuid"
    }
  ]
}
```

Response `201`:

```json
{
  "participationId": "uuid",
  "alias": "Ada",
  "score": 1,
  "totalQuestions": 1,
  "percentage": 100,
  "durationMs": 42000,
  "completedAt": "2026-07-22T12:00:42.000Z"
}
```

Errores: `400 INCOMPLETE_SUBMISSION`, `400 INVALID_ANSWER`,
`401 INVALID_PARTICIPATION_TOKEN`, `409 PARTICIPATION_COMPLETED`.

### GET `/participations/:participationId/result`

Devuelve el mismo resultado público. No incluye respuestas correctas.

## Ranking público

### GET `/public/quizzes/:publicId/ranking`

Response:

```json
{
  "quizPublicId": "uuid",
  "generatedAt": "2026-07-22T12:01:00.000Z",
  "entries": [
    {
      "position": 1,
      "alias": "Ada",
      "score": 8,
      "totalQuestions": 10,
      "percentage": 80,
      "durationMs": 42000
    }
  ]
}
```

Antes de la demo, `position` refleja puntuación descendente con un orden
técnico estable. La demo agrega menor duración como segundo criterio sin
modificar este contrato.

## Health checks

### GET `/health/live`

Confirma que el proceso responde.

### GET `/health/ready`

Confirma que el proceso y PostgreSQL están disponibles.

## Respuesta de error

```json
{
  "error": {
    "code": "QUIZ_NOT_FOUND",
    "message": "Quiz not found",
    "details": [],
    "requestId": "uuid",
    "timestamp": "2026-07-22T12:00:00.000Z",
    "path": "/api/v1/public/quizzes/uuid"
  }
}
```

`details` puede contener campos y restricciones de validación, pero no
trazas ni información interna.

## Códigos HTTP

- `200`: consulta o transición exitosa.
- `201`: recurso o envío creado.
- `204`: eliminación exitosa.
- `400`: request inválido.
- `401`: credencial ausente o inválida.
- `403`: identidad válida sin permiso.
- `404`: recurso no disponible.
- `409`: conflicto de estado o unicidad.
- `429`: límite excedido.
- `500`: error interno con mensaje seguro.
