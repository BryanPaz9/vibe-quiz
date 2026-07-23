# Requisitos no funcionales

## Calidad y mantenibilidad

### NFR-001 — Tipado y calidad estática

El frontend y el backend deberán utilizar TypeScript estricto y pasar
las reglas configuradas de ESLint y Prettier.

### NFR-002 — Modularidad

La solución deberá separar presentación, aplicación, dominio y acceso a
datos de acuerdo con la arquitectura aprobada, evitando dependencias
circulares y responsabilidades mezcladas.

### NFR-003 — Pruebas automatizadas

Las reglas críticas de creación, envío, calificación, ranking y manejo de
errores deberán contar con pruebas unitarias o de integración
reproducibles.

### NFR-004 — Documentación sincronizada

Los cambios de comportamiento, API, base de datos, despliegue o
arquitectura deberán actualizar su documentación asociada.

## Seguridad

### NFR-005 — Autorización

Las operaciones administrativas deberán validar autorización en el
backend. Ocultar controles en el frontend no será un mecanismo de
seguridad suficiente.

### NFR-006 — Validación de entradas

Toda entrada externa deberá validarse en el límite de la API. Los datos
inválidos deberán rechazarse antes de ejecutar reglas o persistencia.

### NFR-007 — Protección de respuestas

La API del participante no deberá incluir la respuesta correcta antes de
que se complete la participación ni cuando la política de visibilidad lo
prohíba.

### NFR-008 — Manejo de secretos

Contraseñas, tokens, cadenas de conexión y claves no deberán almacenarse
en el repositorio. Las variables requeridas deberán documentarse mediante
archivos de ejemplo sin valores sensibles.

### NFR-009 — Divulgación mínima de errores

Las respuestas de error no deberán exponer trazas, consultas, secretos ni
detalles internos en producción.

## Integridad y confiabilidad

### NFR-010 — Autoridad del servidor

La puntuación, duración, estado de participación y posición del ranking
deberán calcularse o validarse en el backend.

### NFR-011 — Consistencia del envío

El registro de respuestas, calificación y finalización deberá producir
un único resultado consistente. Un fallo no deberá dejar una
participación parcialmente calificada.

### NFR-012 — Tiempo consistente

Los tiempos utilizados para inicio, finalización y desempate deberán
provenir del servidor y almacenarse de forma consistente.

## Experiencia de usuario

### NFR-013 — Diseño adaptable

Las pantallas de administración y participación deberán ser utilizables
en dispositivos móviles y de escritorio.

### NFR-014 — Estados visibles

La interfaz deberá comunicar carga, éxito, validación, ausencia de datos
y errores recuperables sin depender únicamente del registro de consola.

### NFR-015 — Accesibilidad básica

Los controles deberán poder identificarse mediante etiquetas, mantener
contraste legible y permitir navegación mediante teclado en los flujos
principales.

## Rendimiento y operación

### NFR-016 — Objetivo de respuesta

Para la carga educativa esperada, el 95 % de solicitudes normales de la
API debería responder en menos de 500 ms, excluyendo latencia de red y
arranque en frío de la plataforma.

Este es un objetivo educativo para la carga esperada del MVP y no
constituye un SLA de producción.

### NFR-017 — Salud del servicio

El backend deberá exponer un mecanismo de health check que permita
verificar la disponibilidad de la aplicación y su dependencia crítica de
base de datos.

### NFR-018 — Despliegue reproducible

El frontend, backend y base de datos deberán poder configurarse en los
entornos documentados mediante variables de entorno y migraciones
versionadas.

### NFR-019 — Compatibilidad

La interfaz debería soportar las dos versiones estables más recientes de
Chrome, Edge y Firefox.

El alcance aprobado comprende las dos versiones estables más recientes
de Chrome, Edge y Firefox.

## Privacidad

### NFR-020 — Minimización de datos

El sistema deberá solicitar únicamente los datos personales necesarios
para identificar al participante según la decisión `OD-002`.

### NFR-021 — Exposición controlada

El ranking no deberá mostrar datos personales distintos del identificador
público aprobado para el participante.
