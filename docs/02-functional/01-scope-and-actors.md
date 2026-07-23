# Alcance y actores

## Objetivo del MVP

Permitir que un administrador cree y gestione cuestionarios de opción
múltiple, que los estudiantes participen mediante una URL y que el
sistema califique automáticamente sus respuestas y muestre resultados y
ranking.

## Alcance incluido

- Gestión de cuestionarios.
- Preguntas de opción múltiple.
- Participación mediante URL.
- Calificación automática.
- Resultados.
- Ranking.
- API REST.
- Panel administrativo.

## Fuera del alcance

- Integración con Canvas u otros LMS.
- Comunicación en tiempo real mediante WebSockets.
- Gamificación avanzada.
- Generación de preguntas mediante IA.
- Funciones empresariales o multitenancy.
- Tipos de pregunta distintos de opción múltiple.
- Aplicaciones móviles nativas.

Agregar cualquier elemento fuera del alcance requiere aprobación humana
y actualización del contexto maestro.

## Actores

### Administrador

Persona responsable de preparar y gestionar los cuestionarios.

Capacidades confirmadas:

- Acceder al panel administrativo.
- Crear cuestionarios.
- Consultar cuestionarios.
- Actualizar cuestionarios.
- Eliminar cuestionarios.
- Gestionar preguntas y opciones.
- Consultar resultados.
- Consultar el ranking.

La autenticación utilizará un único administrador inicial y las
restricciones aplicables a cuestionarios con participaciones seguirán el
ciclo de vida aprobado.

### Participante

Persona que responde un cuestionario.

Capacidades confirmadas:

- Acceder a un cuestionario mediante una URL.
- Proporcionar los datos de identificación requeridos.
- Responder preguntas de opción múltiple.
- Enviar sus respuestas.
- Obtener el resultado permitido por la configuración del MVP.
- Consultar el ranking si este es público.

El participante se identificará mediante un alias único por cuestionario
y podrá consultar la información pública de resultados aprobada.

### Sistema

Responsable de aplicar de forma consistente las reglas definidas.

Capacidades:

- Validar los datos recibidos.
- Registrar participaciones y respuestas.
- Calcular la puntuación.
- Registrar el tiempo necesario para el ranking.
- Ordenar el ranking.
- Rechazar operaciones inválidas.

## Límites del sistema

El navegador consume una API REST. El backend aplica las reglas de
negocio y persiste los datos en PostgreSQL. El frontend no debe calcular
ni decidir de forma autoritativa puntuaciones, posiciones o permisos.
