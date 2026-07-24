# Criterios de aceptación

Los siguientes criterios describen el comportamiento verificable
aprobado para el MVP.

## AC-001 — Proteger administración

**Dado** un usuario sin autorización administrativa  
**Cuando** solicita una operación de creación, edición, eliminación o
consulta privada  
**Entonces** la API rechaza la solicitud  
**Y** no modifica información.

Relacionados: `FR-001`, `NFR-005`, `BR-021`.

## AC-002 — Crear cuestionario válido

**Dado** un administrador autorizado  
**Cuando** proporciona un cuestionario que satisface las reglas
aprobadas de preguntas y opciones  
**Entonces** el sistema crea el cuestionario  
**Y** devuelve su identificador y contenido administrativo.

Relacionados: `FR-002`, `FR-006`, `FR-007`, `BR-002` a `BR-004`.

## AC-003 — Rechazar estructura inválida

**Dado** un administrador autorizado  
**Cuando** intenta guardar una pregunta u opción que incumple las reglas
aprobadas  
**Entonces** la API responde con un error de validación consistente  
**Y** no deja datos parciales.

Relacionados: `FR-002`, `FR-024`, `NFR-006`, `NFR-011`.

## AC-004 — Consultar y modificar cuestionario

**Dado** un cuestionario existente y editable  
**Cuando** el administrador consulta y luego actualiza datos válidos  
**Entonces** recibe el detalle actual  
**Y** la consulta posterior refleja la actualización.

Relacionados: `FR-003`, `FR-004`.

## AC-005 — Respetar restricciones de eliminación

**Dado** un cuestionario existente  
**Cuando** el administrador intenta eliminarlo  
**Entonces** el sistema aplica la política aprobada en `OD-007`  
**Y** conserva la integridad de participaciones y resultados.

Relacionados: `FR-005`, `BR-005`.

## AC-006 — Abrir cuestionario disponible

**Dado** un cuestionario disponible para participación  
**Cuando** una persona abre su URL  
**Entonces** recibe su información pública, preguntas y opciones  
**Y** la respuesta no revela las opciones correctas.

Relacionados: `FR-008`, `FR-009`, `FR-012`, `NFR-007`, `BR-019`.

## AC-007 — Rechazar cuestionario no disponible

**Dado** un cuestionario que no está disponible  
**Cuando** una persona abre su URL o intenta iniciar  
**Entonces** el sistema rechaza la operación sin crear una
participación.

Relacionados: `FR-009`, `FR-011`, `OD-003`.

## AC-008 — Iniciar participación

**Dado** un cuestionario disponible y una identidad válida según
`OD-002`  
**Cuando** el participante inicia  
**Entonces** el backend registra una participación  
**Y** asigna el momento de inicio desde el servidor.

Relacionados: `FR-010`, `FR-011`, `NFR-012`, `BR-006`, `BR-010`.

## AC-009 — Enviar y calificar

**Dado** una participación activa con respuestas válidas  
**Cuando** el participante envía sus respuestas  
**Entonces** el sistema las registra de forma atómica  
**Y** calcula la puntuación en el backend  
**Y** registra finalización y duración  
**Y** devuelve el resultado permitido con la comparación ordenada de
respuestas seleccionadas y correctas
**Y** no permite consultar ese detalle antes de finalizar ni con otro token.

Relacionados: `FR-014` a `FR-018`, `NFR-010` a `NFR-012`,
`BR-008`, `BR-010`, `BR-012` a `BR-014`.

## AC-010 — Rechazar respuesta ajena

**Dado** una participación activa  
**Cuando** el envío contiene una pregunta u opción que no pertenece al
cuestionario o a la pregunta correspondiente  
**Entonces** la API rechaza todo el envío  
**Y** la participación permanece sin calificación parcial.

Relacionados: `FR-015`, `NFR-006`, `NFR-011`, `BR-008`.

## AC-011 — Impedir segundo envío

**Dado** una participación finalizada  
**Cuando** se intenta enviar nuevamente  
**Entonces** la API responde con un conflicto  
**Y** conserva sin cambios las respuestas, puntuación y duración
originales.

Relacionados: `FR-014`, `BR-009`.

## AC-012 — Consultar resultados administrativos

**Dado** un administrador autorizado y un cuestionario existente  
**Cuando** consulta sus resultados  
**Entonces** recibe únicamente las participaciones asociadas a ese
cuestionario con su información aprobada.

Relacionados: `FR-019`.

## AC-013 — Ranking base

**Dado** varias participaciones finalizadas con puntuaciones distintas  
**Cuando** se consulta el ranking base  
**Entonces** aparecen ordenadas por puntuación descendente  
**Y** no se incluyen participaciones sin finalizar.

Relacionados: `FR-020`, `FR-022`, `BR-015`, `BR-016`.

## AC-014 — Desempate por duración

**Dado** dos participaciones finalizadas con la misma puntuación y
duraciones diferentes  
**Cuando** se consulta el ranking\
**Entonces** aparece primero la participación con menor duración.

Relacionados: `FR-021`, `BR-017`.

## AC-015 — Errores seguros

**Dado** una solicitud inválida, no autorizada o conflictiva  
**Cuando** la API produce un error  
**Entonces** utiliza la estructura de error documentada  
**Y** no expone trazas, consultas, secretos ni datos internos.

Relacionados: `FR-024`, `NFR-009`.

## AC-016 — Interfaz adaptable y accesible

**Dado** un flujo principal de administración o participación  
**Cuando** se utiliza en móvil, escritorio o mediante teclado  
**Entonces** los controles y estados necesarios permanecen identificables
y utilizables.

Relacionados: `NFR-013`, `NFR-014`, `NFR-015`.

## AC-017 — Verificar salud

**Dado** un despliegue del backend  
**Cuando** el sistema de operación consulta el health check  
**Entonces** puede distinguir un servicio saludable de un fallo en una
dependencia crítica.

Relacionados: `NFR-017`.
