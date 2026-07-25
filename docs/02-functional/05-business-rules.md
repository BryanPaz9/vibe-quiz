# Reglas de negocio

## Cuestionarios y preguntas

### BR-001

Un cuestionario deberá tener al menos una pregunta para poder estar
disponible para participación.

**Estado:** aprobada mediante `OD-003`.

### BR-002

Cada pregunta deberá pertenecer a un único cuestionario.

### BR-003

Cada pregunta deberá tener al menos dos opciones y exactamente una
opción correcta.

**Estado:** aprobada. Cada pregunta tendrá al menos dos opciones y una
única respuesta correcta.

### BR-004

El orden de preguntas y opciones deberá ser explícito y estable.

### BR-005

El contenido solo podrá editarse en estado `DRAFT`. La eliminación
física solo se permitirá en `DRAFT` y sin participaciones, según
`OD-003` y `OD-007`.

## Participaciones

### BR-006

Una participación deberá pertenecer a un cuestionario y a un
identificador de participante.

### BR-007

Solo se permitirá una participación por alias normalizado y
cuestionario, según `OD-004`.

### BR-008

Una respuesta seleccionada deberá pertenecer a la pregunta respondida y
esa pregunta deberá pertenecer al cuestionario de la participación.

### BR-009

Una participación finalizada no podrá modificarse ni enviarse otra vez.

### BR-010

El momento de inicio y finalización deberá establecerse en el servidor.
La duración será la diferencia entre ambos valores.

### BR-011

Todas las preguntas deberán tener una respuesta antes del envío, según
`OD-006`.

## Calificación

### BR-012

Solo las respuestas asociadas a la opción correcta otorgarán puntuación.

### BR-013

Cada respuesta correcta otorgará un punto, una respuesta incorrecta
otorgará cero y no habrá penalización. El porcentaje se derivará del
total de preguntas, según `OD-008`.

### BR-014

El cálculo de puntuación deberá ejecutarse en el backend utilizando las
respuestas correctas persistidas.

## Ranking

### BR-015

Solo las participaciones finalizadas deberán formar parte del ranking.

### BR-016

El ranking base se ordenará por puntuación descendente.

### BR-017

Las participaciones con la misma puntuación se ordenarán por menor
duración. La implementación deberá estar precedida por una prueba que
demuestre el empate bajo el ordenamiento base.

### BR-018

Si dos participaciones mantienen la misma puntuación y duración, se
ordenarán por momento de finalización ascendente y luego por
identificador ascendente, según `OD-009`.

## Seguridad y visibilidad

### BR-019

El participante no deberá recibir la marca de opción correcta antes de
finalizar.

### BR-020

El resultado autorizado mostrará aciertos, total, porcentaje, duración y el
detalle de la respuesta seleccionada frente a la correcta. Este detalle solo
se revelará después de finalizar y con el token de la participación. El ranking
seguirá mostrando únicamente alias, puntuación y duración, según `OD-005`.

### BR-021

Las operaciones administrativas deberán ser autorizadas por el backend.

## Orientación en la landing

### BR-022

El recorrido del administrador mostrará, en orden, `Crea`, `Publica y
comparte` y `Analiza resultados`. El recorrido del participante mostrará,
en orden, `Ingresa con un alias`, `Responde` y `Revisa y compite`.

El perfil inicial será `Administrador`. Cada cambio de perfil regresará a
la primera etapa y no persistirá estado.

**Estado:** aprobada durante la demostración en vivo del 2026-07-25.
