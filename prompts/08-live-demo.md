# Prompt 08 — Demostración en vivo: recorrido interactivo

## Objetivo

Implementar durante la demostración en vivo un recorrido interactivo en la
landing page de VibeQuiz que explique claramente la experiencia de los dos
roles de la plataforma: administrador y participante.

El cambio debe producir un antes y un después evidente sin depender del
backend, de datos precargados ni de que otras personas completen un
cuestionario. Debe ser pequeño, reversible, accesible, responsive y coherente
con la identidad visual existente.

El desempate del ranking ya forma parte de la línea base y no pertenece a este
alcance. Su orden es: puntuación descendente, menor duración, finalización
ascendente e identificador ascendente.

## Forma de trabajo obligatoria

Antes de modificar archivos:

1. Lee completamente `AGENTS.md` y el contexto obligatorio que este indique.
2. Revisa la documentación funcional y de arquitectura relacionada con
   frontend, UX, accesibilidad, pruebas y demostración.
3. Inspecciona la implementación actual de la landing, sus estilos, componentes
   compartidos, pruebas y dependencias.
4. Comprueba la rama y el estado de Git. No sobrescribas ni mezcles cambios
   ajenos.
5. Identifica impactos, dependencias, supuestos, archivos afectados y riesgos.
6. Presenta un plan acotado con criterios de aceptación y estrategia de
   pruebas.
7. Detente y espera la aprobación explícita del desarrollador antes de
   implementar.

No inventes endpoints, campos, reglas de negocio ni dependencias. Este
checkpoint es exclusivamente frontend y debe utilizar contenido local.

Respeta la asignación de responsabilidades del repositorio:

- Codex: análisis de impacto, arquitectura, pruebas, documentación y revisión.
- Antigravity: diseño e implementación frontend conforme al alcance aprobado.
- Developer: aprobación del plan, coordinación, validación funcional e
  integración.

Si la tarea que recibe este prompt actúa como Codex, no debe atribuirse la
implementación frontend: debe preparar el análisis y el plan, coordinar o hacer
handoff a Antigravity y después ejecutar las pruebas y la revisión que le
corresponden. Si no existe acceso a Antigravity, debe declarar el bloqueo al
desarrollador en vez de ignorar silenciosamente la asignación.

La revisión final debe realizarse en una tarea distinta de la implementación,
como exige `AGENTS.md`.

## Resultado funcional requerido

Sustituye la presentación estática de “De una idea a resultados en tres pasos”
por un componente interactivo y reutilizable llamado
`PlatformJourney`.

El componente debe incluir:

### Selector de perfil

Dos controles mutuamente excluyentes:

- `Administrador`
- `Participante`

Estado inicial: `Administrador`.

El selector debe:

- Indicar visualmente y mediante semántica accesible cuál perfil está activo.
- Poder operarse con teclado.
- No depender de la URL ni persistir datos.
- Cambiar inmediatamente el contenido del recorrido sin recargar la página.

### Recorrido del administrador

Debe contener exactamente estas tres etapas, en este orden:

1. `Crea`
   - Organiza preguntas y opciones.
   - Define la respuesta correcta.
   - Conserva el cuestionario como borrador mientras lo prepara.
2. `Publica y comparte`
   - Publica el cuestionario.
   - Obtiene y comparte el enlace público.
3. `Analiza resultados`
   - Consulta puntuaciones, duración y ranking.
   - Identifica el desempeño de los participantes.

### Recorrido del participante

Debe contener exactamente estas tres etapas, en este orden:

1. `Ingresa con un alias`
   - Abre el enlace público.
   - Participa sin crear una cuenta.
2. `Responde`
   - Recorre las preguntas y selecciona una opción por cada una.
   - Visualiza el tiempo transcurrido durante el intento.
3. `Revisa y compite`
   - Consulta su puntuación y duración.
   - Revisa sus respuestas frente a las correctas.
   - Accede al ranking público.

### Navegación entre etapas

El componente debe mostrar una sola etapa activa en detalle y permitir:

- Avanzar mediante `Siguiente`.
- Retroceder mediante `Anterior`.
- Seleccionar directamente una etapa desde su indicador.
- Deshabilitar `Anterior` en la primera etapa.
- Deshabilitar `Siguiente` en la última etapa.
- Volver a la primera etapa al cambiar de perfil.

El indicador debe comunicar el progreso de manera textual, por ejemplo:
`Paso 2 de 3`, y no depender únicamente del color.

### Representación visual

Cada etapa debe incluir:

- Un icono gratuito ya disponible en Font Awesome 6.7.2.
- Título.
- Descripción.
- Indicador de posición.

Usa la línea gráfica violeta y azul existente. No agregues imágenes externas,
servicios remotos ni una nueva librería de iconos.

Usa la dependencia de Motion que ya existe para animar el cambio de perfil y
etapa. Las transiciones deben ser breves y no bloquear la interacción. Respeta
`prefers-reduced-motion`; con movimiento reducido el contenido debe cambiar sin
animaciones relevantes.

## Diseño responsive

El comportamiento mínimo esperado es:

- Escritorio: selector y recorrido claramente visibles, con indicadores de
  etapas aprovechando el espacio horizontal.
- Tablet: controles sin superposición y texto legible.
- Móvil: estructura vertical, botones táctiles de tamaño suficiente, sin
  desplazamiento horizontal y sin texto truncado.

No alteres la navegación principal, el hero, el CTA administrativo ni las
rutas existentes.

## Accesibilidad

La implementación debe:

- Usar elementos `button` reales para acciones.
- Exponer nombres accesibles claros.
- Mantener foco visible.
- Permitir completar todo el recorrido solo con teclado.
- Comunicar el perfil y la etapa seleccionados semánticamente.
- No depender exclusivamente de iconos, animación o color.
- Conservar jerarquía correcta de encabezados.
- Evitar anuncios innecesarios o repetitivos de lectores de pantalla.

## Límites de alcance

No implementar:

- Endpoints o cambios de backend.
- Persistencia en `localStorage` o `sessionStorage`.
- Un cuestionario de demostración funcional.
- Personalización de temas.
- Modificaciones al ranking.
- Nuevas rutas.
- Contenido administrable.
- Telemetría o servicios externos.
- Dependencias nuevas, salvo que el análisis demuestre que son imprescindibles
  y el desarrollador las apruebe expresamente.

## Criterios de aceptación

1. La landing permite alternar entre `Administrador` y `Participante`.
2. Cada perfil presenta exactamente sus tres etapas aprobadas y en el orden
   definido.
3. Cambiar de perfil regresa al primer paso.
4. `Anterior`, `Siguiente` y los indicadores directos actualizan correctamente
   la etapa activa.
5. Los límites de navegación quedan deshabilitados correctamente.
6. El progreso se comunica con texto y semántica, no solo mediante color.
7. El cambio de contenido utiliza Motion y respeta movimiento reducido.
8. El componente funciona sin API y no modifica rutas ni contratos.
9. La vista no presenta overflow horizontal en escritorio, tablet ni móvil.
10. El flujo completo puede operarse con teclado y mantiene foco visible.
11. La landing conserva su hero, CTA, marca y navegación actuales.
12. Las pruebas, lint, formato y build finalizan correctamente.
13. La documentación explica el propósito, responsabilidades, estados,
    accesibilidad y uso del componente.

## Pruebas obligatorias

Antes de declarar terminado el checkpoint:

### Pruebas de componente

Cubre como mínimo:

- Render inicial del perfil administrador y su primer paso.
- Cambio al perfil participante.
- Reinicio al primer paso al cambiar de perfil.
- Navegación con `Anterior` y `Siguiente`.
- Selección directa de una etapa.
- Estados deshabilitados del primer y último paso.
- Nombres accesibles y estado seleccionado de los controles.
- Ausencia de llamadas de red causadas por el componente.

### Prueba end-to-end

Amplía Playwright para comprobar en Chromium:

- Apertura de la landing.
- Cambio de perfil.
- Avance hasta el último paso.
- Regreso a una etapa anterior.
- Conservación del CTA administrativo y su destino.

### Validación visual y responsive

Verifica manualmente o mediante navegador automatizado al menos:

- Escritorio: 1440 × 900.
- Tablet: 768 × 1024.
- Móvil: 390 × 844.
- Preferencia `prefers-reduced-motion: reduce`.

Confirma que no existe overflow horizontal, superposición de controles ni
contenido inaccesible.

### Puertas de calidad

Ejecuta:

- Pruebas unitarias y de componentes del frontend.
- Suite E2E relevante.
- ESLint.
- Prettier.
- Build de producción.
- Auditoría de dependencias si el manifiesto cambia.

No ocultes fallos preexistentes. Distingue claramente entre una regresión y un
problema previo reproducible.

## Documentación obligatoria

Actualiza como mínimo:

- `frontend/README.md`: estado del checkpoint y comportamiento de
  `PlatformJourney`.
- `docs/03-architecture/03-frontend-architecture.md`: responsabilidad,
  estado local, accesibilidad, Motion y ausencia de dependencia del backend.
- `docs/02-functional/02-functional-requirements.md`: requisito funcional de
  orientación interactiva en la landing.
- `docs/02-functional/04-user-stories.md`: necesidad del visitante de
  comprender los recorridos antes de comenzar.
- `docs/02-functional/05-business-rules.md`: contenido y orden aprobados para
  cada perfil.
- `docs/02-functional/06-acceptance-criteria.md`: criterios verificables del
  componente sin duplicar ni contradecir los enumerados en este prompt.
- `docs/02-functional/08-traceability-matrix.md`: relación explícita entre
  requisito, historia, regla, criterios, pruebas y componente.
- Este archivo: resultado final, evidencia ejecutada y cualquier decisión
  aprobada durante la demostración.

La numeración definitiva debe continuar la secuencia existente y decidirse
durante el análisis, sin reutilizar identificadores. No declares capacidades
que no hayan sido implementadas y verificadas.

## Preparación de la demostración en vivo

Antes de la presentación:

1. Conserva un commit o tag estable con la landing anterior para mostrar el
   “antes”.
2. Usa una rama sugerida `feature/interactive-landing-journey`.
3. Confirma que dependencias estén instaladas y que las pruebas puedan
   ejecutarse sin descargar recursos durante la demo.
4. Abre previamente la landing en escritorio y prepara las vistas responsive
   del navegador.
5. Mantén disponible una captura del estado anterior como respaldo.
6. Ensaya la implementación con los mismos comandos y entorno que se usarán en
   vivo.
7. Prepara un commit de respaldo terminado, pero no lo mezcles con la rama de
   la demostración.
8. Evita depender de Internet, servicios externos o datos creados por la
   audiencia.

## Guion sugerido de presentación

1. Mostrar la landing actual y explicar que el flujo se presenta mediante
   tarjetas estáticas.
2. Exponer el objetivo y los criterios de aceptación.
3. Presentar el plan antes de modificar código.
4. Implementar el componente y sus estados.
5. Ejecutar la prueba de componente enfocada.
6. Mostrar el cambio de perfil y navegación entre etapas.
7. Mostrar brevemente escritorio, tablet y móvil.
8. Ejecutar lint, build y la prueba E2E relevante.
9. Mostrar la documentación actualizada.
10. Resumir cambios, evidencia, riesgos residuales y siguiente paso.

Si el tiempo se reduce, prioriza en este orden:

1. Selector de perfil y contenido correcto.
2. Navegación entre etapas.
3. Accesibilidad y responsive.
4. Pruebas.
5. Animaciones.

Las pruebas, documentación y validación no pueden omitirse para declarar el
checkpoint completo; si no caben en vivo, utiliza el respaldo preparado y
explica con transparencia qué parte fue recuperada.

## Entrega esperada

Al finalizar, informa:

- Archivos modificados.
- Decisiones y supuestos aprobados.
- Criterios de aceptación cumplidos.
- Pruebas y comandos ejecutados con sus resultados.
- Validaciones responsive y de accesibilidad.
- Hallazgos de la revisión independiente.
- Riesgos residuales.
- Estado de Git.
- Próximo paso recomendado.

Commit sugerido conforme a las convenciones del repositorio:

```text
feat: :sparkles: (interactive landing journey)
```
