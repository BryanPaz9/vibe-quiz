# Modelo de datos PostgreSQL

## Convenciones

- Identificadores internos: UUID.
- Fechas: `timestamptz` almacenadas en UTC.
- Duración: milisegundos enteros.
- Nombres físicos: `snake_case`.
- Prisma usa nombres de dominio y mapea nombres físicos.
- Todas las relaciones tienen claves foráneas explícitas.

## Enumeraciones

### QuizStatus

- `DRAFT`
- `PUBLISHED`
- `CLOSED`

### ParticipationStatus

- `ACTIVE`
- `COMPLETED`

## Entidades

### Admin

| Campo | Tipo | Restricción |
|---|---|---|
| id | uuid | PK |
| email | varchar(254) | único, normalizado |
| passwordHash | varchar | requerido |
| createdAt | timestamptz | requerido |
| updatedAt | timestamptz | requerido |

El único administrador se crea mediante un seed idempotente. La
contraseña en texto plano solo se recibe desde una variable de entorno
durante el seed y nunca se persiste.

### Quiz

| Campo | Tipo | Restricción |
|---|---|---|
| id | uuid | PK |
| publicId | uuid | único, requerido |
| title | varchar(160) | requerido |
| description | varchar(1000) | opcional |
| status | QuizStatus | `DRAFT` por defecto |
| createdAt | timestamptz | requerido |
| updatedAt | timestamptz | requerido |
| publishedAt | timestamptz | opcional |
| closedAt | timestamptz | opcional |

`publicId` desacopla la URL pública del identificador administrativo.

### Question

| Campo | Tipo | Restricción |
|---|---|---|
| id | uuid | PK |
| quizId | uuid | FK Quiz, requerido |
| text | varchar(1000) | requerido |
| position | integer | mayor que cero |

Índice único: `(quizId, position)`.

### Option

| Campo | Tipo | Restricción |
|---|---|---|
| id | uuid | PK |
| questionId | uuid | FK Question, requerido |
| text | varchar(500) | requerido |
| position | integer | mayor que cero |
| isCorrect | boolean | `false` por defecto |

Índice único: `(questionId, position)`.

La aplicación valida al menos dos opciones y exactamente una correcta
antes de publicar. Estas reglas de agregado no se implementarán mediante
triggers para mantener migraciones simples.

### Participation

| Campo | Tipo | Restricción |
|---|---|---|
| id | uuid | PK |
| quizId | uuid | FK Quiz, requerido |
| alias | varchar(80) | requerido |
| normalizedAlias | varchar(80) | requerido |
| accessTokenHash | varchar | requerido |
| status | ParticipationStatus | `ACTIVE` por defecto |
| startedAt | timestamptz | asignado por servidor |
| completedAt | timestamptz | opcional |
| durationMs | integer | opcional, no negativo |
| score | integer | opcional, no negativo |
| totalQuestions | integer | opcional, positivo |

Índice único: `(quizId, normalizedAlias)`.

`normalizedAlias` se obtiene aplicando trim, espacios internos
colapsados y minúsculas Unicode. `alias` conserva la forma visible.

### Answer

| Campo | Tipo | Restricción |
|---|---|---|
| id | uuid | PK |
| participationId | uuid | FK Participation, requerido |
| questionId | uuid | FK Question, requerido |
| optionId | uuid | FK Option, requerido |
| isCorrect | boolean | requerido |

Índice único: `(participationId, questionId)`.

`isCorrect` conserva el resultado evaluado en el momento del envío y
evita recalcular resultados históricos. El contenido publicado no puede
editarse.

## Relaciones y eliminación

```text
Quiz 1 --- * Question 1 --- * Option
Quiz 1 --- * Participation 1 --- * Answer
Question 1 --- * Answer
Option 1 --- * Answer
```

- Eliminar un `DRAFT` sin participaciones puede aplicar cascada a
  preguntas y opciones.
- Quiz con participaciones no se elimina.
- Participaciones y respuestas no se eliminan mediante operaciones del
  MVP.

## Índices

- `admin(email)` único.
- `quiz(publicId)` único.
- `quiz(status, createdAt)`.
- `question(quizId, position)` único.
- `option(questionId, position)` único.
- `participation(quizId, normalizedAlias)` único.
- `participation(quizId, status, score)` para resultados y ranking.
- `answer(participationId, questionId)` único.

Para la demo, el índice de ranking podrá ampliarse con `durationMs` sin
cambiar el modelo lógico.

## Invariantes de aplicación

- Solo `DRAFT` permite cambiar contenido.
- Publicar exige una o más preguntas.
- Cada pregunta publicada exige dos o más opciones y una correcta.
- Solo `PUBLISHED` permite iniciar.
- Enviar exige todas las preguntas exactamente una vez.
- Opción y pregunta deben pertenecer al quiz.
- Solo `ACTIVE` puede finalizar.
- Puntuación, duración y corrección se calculan en el servidor.
