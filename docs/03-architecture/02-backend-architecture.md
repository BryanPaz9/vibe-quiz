# Arquitectura del backend

## Enfoque

NestJS implementará un monolito modular. Cada módulo organiza
presentación HTTP, aplicación, dominio e infraestructura sin introducir
microservicios ni complejidad distribuida.

## Módulos

### AuthModule

- Inicio de sesión.
- Verificación de contraseña.
- Emisión y validación de JWT.
- Guard y decorador de administrador.

### AdminModule

- Lectura del administrador inicial.
- Perfil autenticado.
- Seed idempotente del usuario administrador.

### QuizzesModule

- CRUD administrativo.
- Edición transaccional del contenido en `DRAFT`.
- Publicación y cierre.
- Proyección pública sin respuestas correctas.
- Generación y resolución de `publicId`.

### ParticipationsModule

- Normalización y validación del alias.
- Inicio de participación.
- Envío único y transaccional.
- Resultado público.

### ScoringModule

- Comparación de respuestas.
- Cálculo de puntos, total y porcentaje derivado.
- Cálculo de duración desde valores del servidor.

No tendrá controladores; será utilizado por ParticipationsModule.

### RankingsModule

- Ranking administrativo y público.
- Orden base por puntuación.
- Punto aislado de extensión para el desempate de la demo.

### HealthModule

- Estado del proceso.
- Comprobación de PostgreSQL.

### CommonModule

- Filtro global de errores.
- Interceptor de request ID y logging.
- Pipes de validación.
- Tipos compartidos internos.

## Capas por módulo

```text
module/
  presentation/
    controllers/
    dto/
  application/
    use-cases/
    ports/
  domain/
    entities/
    rules/
    errors/
  infrastructure/
    prisma/
    mappers/
```

No es obligatorio crear una clase por cada carpeta si no aporta valor.
La separación expresa dirección de dependencias, no ceremonial.

## Casos de uso principales

- `LoginAdmin`
- `CreateQuiz`
- `ListQuizzes`
- `GetAdminQuiz`
- `UpdateDraftQuiz`
- `DeleteDraftQuiz`
- `PublishQuiz`
- `CloseQuiz`
- `GetPublicQuiz`
- `StartParticipation`
- `SubmitParticipation`
- `GetParticipationResult`
- `ListQuizResults`
- `GetQuizRanking`

## Transacciones

Requieren transacción Prisma:

- Crear quiz con preguntas y opciones.
- Reemplazar contenido completo de un borrador.
- Publicar después de validar el agregado.
- Enviar respuestas, calcular y finalizar participación.

El envío debe actualizar una participación únicamente si continúa en
estado `ACTIVE`; una actualización con cero filas se convierte en
conflicto para impedir doble envío concurrente.

## Validación

- DTO: forma, tipos, longitudes y valores permitidos.
- Caso de uso: autorización, existencia y estado.
- Dominio: reglas entre entidades.
- Base de datos: claves, unicidad y relaciones.

Se habilitará validación global con eliminación de propiedades no
declaradas y rechazo de propiedades desconocidas.
