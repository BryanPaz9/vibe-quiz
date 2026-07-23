# Arquitectura del sistema

## Estilo

VibeQuiz será una aplicación web cliente-servidor con un backend de
monolito modular. React entrega la interfaz, NestJS expone la API REST y
PostgreSQL conserva el estado.

```text
Usuario
  |
  v
Frontend React + TypeScript (Vercel)
  |
  | HTTPS / JSON
  v
API REST NestJS (Railway)
  |
  | Prisma
  v
PostgreSQL (Railway)
```

## Contenedores

### Frontend

- Panel administrativo.
- Flujo público de participación.
- Resultado y ranking.
- Validación de experiencia de usuario.
- Consumo exclusivo del contrato `/api/v1`.

No calcula de forma autoritativa puntuación, duración ni posiciones.

### Backend

- Autenticación y autorización administrativa.
- Gestión del ciclo de vida de quizzes.
- Validación de preguntas, opciones y respuestas.
- Inicio y finalización de participaciones.
- Calificación transaccional.
- Resultados y ranking.
- Errores consistentes, logs y health checks.

### PostgreSQL

- Administrador inicial.
- Quizzes, preguntas y opciones.
- Participaciones y respuestas.
- Restricciones de unicidad e integridad.

## Flujos principales

### Administración

1. El administrador inicia sesión.
2. El backend valida la contraseña y emite un token.
3. El frontend envía el token en operaciones privadas.
4. El administrador crea o modifica contenido en `DRAFT`.
5. El backend valida el agregado completo antes de publicar.
6. Un quiz `PUBLISHED` puede compartirse y luego cerrarse.

### Participación

1. El participante abre `/quiz/:publicId`.
2. El frontend consulta el quiz público sin respuestas correctas.
3. El participante proporciona un alias.
4. El backend normaliza el alias, verifica unicidad y registra el inicio.
5. El participante envía una respuesta por pregunta.
6. Una transacción valida, registra, califica y finaliza.
7. El backend devuelve el resultado público.

### Ranking

El backend consulta solo participaciones `COMPLETED`, inicialmente
ordenadas por puntuación descendente. El desempate por duración se
agregará durante la demo sin cambiar el contrato público.

## Límites

- No hay WebSockets; los datos se consultan bajo demanda.
- No hay cuentas de participantes.
- No hay multitenancy.
- No hay edición de contenido publicado.
- No hay recuperación de contraseña.
- No hay generación de preguntas mediante IA.

## Dependencias y dirección

```text
HTTP/controllers
       |
application/use cases
       |
domain rules and ports
       |
infrastructure/Prisma
```

Las capas interiores no dependen de NestJS HTTP, Prisma ni React.
