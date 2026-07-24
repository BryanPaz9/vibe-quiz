# Riesgos, supuestos y decisiones aprobadas

> **Fecha de aprobación:** 2026-07-22

## Decisiones aprobadas

Las siguientes decisiones fueron aprobadas por el desarrollador el
2026-07-22 y forman parte del alcance funcional del MVP.

### OD-001 — Autenticación administrativa

**Estado:** aprobada.

**Pregunta:** ¿Cómo se autentica el administrador?

**Recomendación:** un único administrador inicial configurado mediante
seed o variables seguras, contraseña con hash y sesión mediante token.
No incluir registro público, recuperación de contraseña ni gestión de
usuarios en el MVP.

**Impacta:** `FR-001`, seguridad, modelo de datos y API.

### OD-002 — Identidad del participante

**Estado:** aprobada.

**Pregunta:** ¿Qué dato proporciona el participante?

**Recomendación:** alias o nombre visible obligatorio, sin correo ni
cuenta, para minimizar datos personales.

**Impacta:** `FR-010`, ranking, privacidad y modelo de datos.

### OD-003 — Ciclo de vida del cuestionario

**Estado:** aprobada.

**Pregunta:** ¿Qué estados existen y cuándo puede responderse?

**Recomendación:** `DRAFT`, `PUBLISHED` y `CLOSED`. Solo `PUBLISHED`
acepta nuevas participaciones. El contenido solo se edita en `DRAFT`;
un cuestionario publicado puede cerrarse.

**Impacta:** `FR-004`, `FR-008`, `FR-009`, `BR-001`, `BR-005`.

### OD-004 — Número de intentos

**Estado:** aprobada.

**Pregunta:** ¿Cuántas veces puede participar una persona?

**Recomendación:** un alias normalizado por cuestionario. Esto evita
duplicados accidentales, pero debe comunicarse como una restricción de
la demostración y no como verificación real de identidad.

**Impacta:** `FR-010`, `FR-011`, `BR-007`, índice de base de datos.

### OD-005 — Visibilidad de resultados y ranking

**Estado:** aprobada.

**Pregunta:** ¿Qué ve el participante al terminar?

**Decisión actualizada:** mostrar aciertos, total, porcentaje, duración y la
comparación de respuestas seleccionadas contra las correctas únicamente
después de finalizar y con el token opaco de la participación. El ranking
público conserva solo alias, puntuación y duración.

**Actualización aprobada:** el desarrollador autorizó revelar el detalle
post-finalización en el checkpoint de revisión de respuestas.

**Impacta:** `FR-018`, `FR-022`, `NFR-007`, `NFR-021`, `BR-020`.

### OD-006 — Preguntas sin responder

**Estado:** aprobada.

**Pregunta:** ¿Se permite enviar un cuestionario incompleto?

**Recomendación:** requerir una respuesta para cada pregunta y mostrar
validación antes del envío.

**Impacta:** `FR-015`, `BR-011`, experiencia de usuario y pruebas.

### OD-007 — Eliminación con participaciones

**Estado:** aprobada.

**Pregunta:** ¿Puede eliminarse un cuestionario que ya tiene resultados?

**Recomendación:** permitir eliminación física solo en `DRAFT` y sin
participaciones. Para cuestionarios publicados o con resultados, usar
`CLOSED` y conservar la información.

**Impacta:** `FR-005`, integridad, auditoría y modelo de datos.

### OD-008 — Fórmula de puntuación

**Estado:** aprobada.

**Pregunta:** ¿Cómo se representa la puntuación?

**Recomendación:** un punto por respuesta correcta, cero por incorrecta,
sin penalización. Persistir puntos obtenidos y derivar el porcentaje
respecto del total.

**Impacta:** `FR-016`, `FR-018`, `FR-020`, `BR-012`, `BR-013`.

### OD-009 — Empate total

**Estado:** aprobada.

**Pregunta:** ¿Cómo se estabiliza el orden si puntuación y duración son
idénticas?

**Recomendación:** ordenar por momento de finalización ascendente y,
como último criterio técnico, por identificador ascendente.

**Impacta:** `FR-021`, `BR-018` y pruebas del ranking.

### OD-010 — Objetivos de compatibilidad y rendimiento

**Estado:** aprobada.

**Pregunta:** ¿Se aprueban los objetivos propuestos?

**Recomendación:** aceptar `NFR-016` como objetivo educativo, no como SLA,
y soportar las dos versiones estables más recientes de Chrome, Edge y
Firefox según `NFR-019`.

## Supuestos

- El MVP tendrá una carga propia de una demostración educativa, no de
  una plataforma institucional.
- Existirá un único rol administrativo.
- No se requiere localización a múltiples idiomas.
- Todos los puntos tendrán el mismo valor salvo decisión posterior.
- La conectividad en tiempo real no es necesaria.
- Railway, Vercel y PostgreSQL continúan como destinos previstos, sujetos
  a validación durante arquitectura y despliegue.

## Riesgos

### R-001 — Tiempo limitado

**Probabilidad:** alta.  
**Impacto:** alto.

El alcance puede exceder el tiempo disponible antes de la presentación.

**Mitigación:** entregar un flujo vertical completo antes de añadir
operaciones secundarias y mantener la funcionalidad de la demo pequeña,
reversible y visible.

### R-002 — Contrato inestable

**Probabilidad:** media.  
**Impacto:** alto.

Cambios tardíos de API pueden bloquear la integración con Antigravity.

**Mitigación:** aprobar y versionar el contrato antes de iniciar el
frontend.

### R-003 — Requisitos inventados por agentes

**Probabilidad:** media.  
**Impacto:** alto.

Codex o Antigravity podrían alterar silenciosamente decisiones aprobadas
o resolver nuevas decisiones sin autorización.

**Mitigación:** mantener identificadores `OD`, trazabilidad y puntos de
aprobación humana.

### R-004 — Autorrevisión sesgada

**Probabilidad:** media.  
**Impacto:** medio.

Una tarea que revisa su propia implementación puede conservar supuestos
incorrectos.

**Mitigación:** ejecutar la revisión en una tarea nueva de Codex contra
requisitos y criterios aprobados.

### R-005 — Conectividad durante la demostración

**Probabilidad:** media.  
**Impacto:** alto.

Una falla de Internet o de plataformas externas puede impedir la demo.

**Mitigación:** preparar ejecución local, datos de demostración y una
grabación o capturas de respaldo.

### R-006 — Exposición de respuestas correctas

**Probabilidad:** media.  
**Impacto:** alto.

Un DTO reutilizado podría enviar respuestas correctas al participante.

**Mitigación:** contratos públicos separados, pruebas de serialización y
revisión de seguridad.

### R-007 — Manipulación de tiempo o puntuación

**Probabilidad:** media.  
**Impacto:** alto.

El cliente podría intentar enviar valores calculados localmente.

**Mitigación:** hacer autoritativo al backend para tiempo, calificación y
ranking.

### R-008 — Identidad débil

**Probabilidad:** alta.  
**Impacto:** medio.

Un alias sin cuenta no demuestra que dos participaciones pertenezcan a
la misma persona.

**Mitigación:** comunicar la limitación y no presentar la restricción de
alias como seguridad real.

### R-009 — Arranque en frío

**Probabilidad:** media.  
**Impacto:** medio.

El hosting puede introducir latencia antes o durante la exposición.

**Mitigación:** probar el despliegue antes de presentar y mantener el
entorno local listo.
