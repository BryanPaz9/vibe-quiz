# Estrategia de pruebas

## Principio

Cada regla crítica debe verificarse en la capa más baja que aporte
confianza, complementada por integración real para transacciones y
contratos.

## Backend

### Unitarias

- Normalización de alias.
- Transiciones de estado.
- Validación del agregado antes de publicar.
- Cálculo de puntuación y porcentaje.
- Duración.
- Ordenamiento base del ranking.
- Desempate agregado durante la demo.
- Mapeo de DTO público sin `isCorrect`.

### Integración

Con PostgreSQL aislado:

- Seed idempotente.
- Crear y reemplazar borrador.
- Restricciones de unicidad.
- Publicar y cerrar.
- Inicio con alias duplicado.
- Envío atómico completo.
- Rechazo de pregunta u opción ajena.
- Segundo envío y concurrencia.
- Resultados y ranking.
- Migraciones desde base vacía.

### API end-to-end

- Login válido e inválido.
- Protección de rutas administrativas.
- CRUD y transiciones.
- Flujo público completo.
- Forma estándar de errores.
- Health checks.

## Frontend

### Componentes y hooks

- Formularios y mensajes de validación.
- Estados de carga, vacío y error.
- Protección de rutas como experiencia.
- Persistencia temporal de respuestas ante error.
- Deshabilitar doble envío.
- Renderizado del ranking.

### Integración con contrato

Mockear el API a nivel de red usando fixtures derivados de
`05-api-contract.md`, no implementaciones inventadas.

### End-to-end

- Administrador crea y publica quiz.
- Participante abre, inicia, responde y envía.
- Resultado y ranking aparecen.
- Segundo alias igual es rechazado.
- Quiz cerrado no acepta participación.

## Matriz de criterios

| Criterios | Nivel principal |
|---|---|
| AC-001 | API e2e |
| AC-002 a AC-005 | integración + API e2e |
| AC-006 a AC-008 | API e2e + frontend |
| AC-009 a AC-011 | integración transaccional + API e2e |
| AC-012 a AC-014 | integración + e2e |
| AC-015 | API e2e |
| AC-016 | frontend + revisión manual |
| AC-017 | API e2e y despliegue |

## Datos de prueba

- Fixtures pequeños y deterministas.
- Reloj inyectable en casos de uso de tiempo.
- Tokens y secretos exclusivos de test.
- Una base limpia por suite o estrategia equivalente aislada.
- No depender de servicios de producción.

## Puertas de calidad

Antes de integrar:

- Build exitoso.
- Lint sin errores.
- Pruebas unitarias, integración y e2e relevantes exitosas.
- Migración aplicable desde una base vacía.
- Contratos y documentación sincronizados.

La cobertura numérica será señal de apoyo, no sustituto de escenarios
críticos. Se propondrá un umbral cuando exista código real.
