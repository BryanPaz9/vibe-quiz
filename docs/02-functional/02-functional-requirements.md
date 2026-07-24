# Requisitos funcionales

## Administración

### FR-001 — Acceso administrativo

El sistema deberá restringir las operaciones administrativas a un
administrador autorizado.

La autenticación seguirá la decisión aprobada `OD-001`.

### FR-002 — Crear cuestionario

El administrador deberá poder crear un cuestionario con título,
descripción y preguntas de opción múltiple.

### FR-003 — Consultar cuestionarios

El administrador deberá poder listar los cuestionarios y consultar el
detalle de uno de ellos.

### FR-004 — Actualizar cuestionario

El administrador deberá poder actualizar los datos y preguntas de un
cuestionario cuando sus reglas de estado lo permitan.

### FR-005 — Eliminar cuestionario

El administrador deberá poder eliminar un cuestionario cuando las reglas
de integridad y participación lo permitan.

### FR-006 — Gestionar preguntas

El administrador deberá poder agregar, actualizar, ordenar y eliminar
preguntas de opción múltiple dentro de un cuestionario editable.

### FR-007 — Gestionar opciones

El administrador deberá poder agregar, actualizar, ordenar y eliminar
opciones, e indicar cuál es la respuesta correcta.

### FR-008 — Publicar acceso

El sistema deberá proporcionar una URL que permita acceder al
cuestionario cuando este se encuentre disponible para participación.

Solo los cuestionarios en estado `PUBLISHED` estarán disponibles, según
`OD-003`.

## Participación

### FR-009 — Abrir cuestionario

El participante deberá poder abrir mediante URL un cuestionario
disponible y consultar su información inicial.

### FR-010 — Identificar participante

El sistema deberá solicitar y registrar la identidad mínima aprobada
antes de iniciar una participación.

El participante deberá proporcionar un alias, según `OD-002`.

### FR-011 — Iniciar participación

El sistema deberá crear una participación y registrar el momento de
inicio utilizando la hora del servidor.

### FR-012 — Presentar preguntas

El participante deberá poder consultar las preguntas y sus opciones sin
recibir indicadores que revelen la respuesta correcta.

### FR-013 — Seleccionar respuestas

El participante deberá poder seleccionar una opción por cada pregunta.

### FR-014 — Enviar respuestas

El participante deberá poder enviar sus respuestas para calificación.
El sistema deberá impedir que una participación finalizada sea enviada
de nuevo.

### FR-015 — Validar envío

El sistema deberá rechazar respuestas que no pertenezcan a la pregunta,
preguntas que no pertenezcan al cuestionario o estructuras incompletas
según la política aprobada en `OD-006`.

## Calificación y resultados

### FR-016 — Calificar automáticamente

El backend deberá comparar las respuestas enviadas con las opciones
correctas y calcular una puntuación reproducible.

### FR-017 — Registrar finalización

Al aceptar un envío, el sistema deberá registrar el momento de
finalización y la duración calculada por el servidor.

### FR-018 — Mostrar resultado

El sistema deberá mostrar al participante la información de resultado
aprobada después de finalizar, incluida la comparación entre cada respuesta
seleccionada y la opción correcta.

El detalle solo estará disponible con la autorización de la participación y
seguirá la información aprobada en `OD-005`.

### FR-019 — Consultar resultados administrativos

El administrador deberá poder consultar las participaciones y
puntuaciones de un cuestionario.

## Ranking

### FR-020 — Generar ranking

El sistema deberá generar un ranking de participaciones finalizadas para
un cuestionario.

### FR-021 — Ordenar ranking

El ranking deberá ordenar primero por puntuación descendente. Para
participantes con la misma puntuación, deberá ordenar por menor tiempo de
finalización.

La regla se implementa en el backend para los rankings público y
administrativo sin modificar el contrato de respuesta.

### FR-022 — Consultar ranking

El administrador deberá poder consultar el ranking. El acceso del
participante depende de `OD-005`.

## API y errores

### FR-023 — Exponer API REST

Las operaciones funcionales del MVP deberán estar disponibles mediante
una API REST documentada y consumible por el frontend.

### FR-024 — Responder errores consistentes

La API deberá responder de forma consistente ante validaciones fallidas,
recursos inexistentes, operaciones no autorizadas y conflictos de
estado, sin exponer información interna.
