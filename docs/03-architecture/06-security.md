# Arquitectura de seguridad

## Objetivos

- Restringir toda operación administrativa en el backend.
- Proteger cada participación sin crear cuentas públicas.
- Evitar exposición de respuestas correctas.
- Mantener secretos fuera del repositorio.
- Limitar abuso básico en endpoints sensibles.

## Administrador

- Un administrador persistido mediante seed idempotente.
- Contraseña almacenada con un algoritmo adaptativo de hash.
- Login por email normalizado y contraseña.
- JWT de acceso con vida corta configurable.
- Claim mínimo: `sub`, `email`, `role`, `iat`, `exp`.
- Algoritmo y secreto configurados explícitamente; no aceptar algoritmos
  indicados libremente por el cliente.
- Guard global o por controlador para `/admin/*` y `/auth/me`.

No habrá registro, refresh token ni recuperación de contraseña en el
MVP. Al expirar, el administrador inicia sesión nuevamente.

## Participante

Al iniciar se genera un token aleatorio criptográficamente seguro:

- Se devuelve una sola vez.
- Se almacena únicamente su hash.
- Se exige para enviar y consultar el resultado.
- Se compara mediante operación segura.
- No se registra en logs.

Las rutas públicas de quiz y ranking no requieren este token.

## Contratos separados

- DTO administrativo: puede incluir `isCorrect`.
- DTO público: nunca incluye `isCorrect`.
- DTO de resultado: no incluye respuestas correctas.

No se reutilizarán entidades Prisma como responses HTTP.

## Validación y límites

- Validación global y rechazo de propiedades desconocidas.
- Longitudes según el modelo de datos.
- UUID válidos antes de ejecutar consultas.
- Rate limit más estricto en login e inicio de participación.
- Límite de tamaño JSON.
- CORS limitado al origen configurado del frontend.
- HTTPS obligatorio en producción.

## Alias

- Trim.
- Colapso de espacios.
- Normalización Unicode.
- Comparación sin distinguir mayúsculas.
- Salida escapada por React; no renderizar HTML proporcionado.

El alias no demuestra identidad real y esta limitación debe mantenerse
visible en documentación.

## Secretos

Variables mínimas:

- `DATABASE_URL`
- `JWT_SECRET`
- `JWT_EXPIRES_IN`
- `ADMIN_EMAIL`
- `ADMIN_INITIAL_PASSWORD`
- `FRONTEND_ORIGIN`

`ADMIN_INITIAL_PASSWORD` se utiliza para el seed inicial y debe rotarse o
retirarse del entorno después de provisionar.

## Amenazas y controles

| Amenaza | Control |
|---|---|
| Fuerza bruta de login | Rate limit y mensaje genérico |
| Enumeración de administrador | `INVALID_CREDENTIALS` uniforme |
| Acceso por ID de participación | Token opaco y hash persistido |
| Manipulación de puntuación | Cálculo exclusivo en backend |
| Manipulación de tiempo | Reloj del servidor |
| Exposición de respuestas | DTO público separado y pruebas |
| Segundo envío concurrente | Transacción y transición condicional |
| Inyección | Prisma parametrizado y DTO validado |
| XSS por alias o contenido | Renderizado de texto, sin HTML crudo |
| Secretos en repositorio | `.env.example`, CI secrets y revisión |

## Fuera del alcance de seguridad

- Identidad verificada del participante.
- SSO o MFA administrativo.
- WAF empresarial.
- Auditoría regulatoria.
- Revocación distribuida de tokens.
