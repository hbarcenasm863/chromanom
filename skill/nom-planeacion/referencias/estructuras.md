# Estructuras de planeación

Usa la que corresponda. Si el colegio tiene su propio formato, ese manda: estas estructuras solo
dicen qué contenido poner en cada casilla. Las tablas funcionan igual en el chat, en un documento,
en Word o en PDF.

## Índice
1. Plan de clase (una sesión)
2. Secuencia didáctica de 4 sesiones (formato del panel docente)
3. Plan de período o unidad (con su tiempo efectivo)
   · Control del avance (diagnóstico, semáforo y repriorización)
4. Malla curricular (año)

---

## 1. Plan de clase (una sesión)

**Encabezado**: colegio · área (Ciencias Naturales y Educación Ambiental) · asignatura · grado y
curso · docente · fecha · duración · período.

**Referentes curriculares** (textuales, con fuente):
- DBA: «…» (MEN, 2016, grado X, n.º Y). Evidencia: «…».
- Estándar: «…» (MEN, 2004, banda X a Y, componente Z).
- Evidencia SED: «…» (SED Bogotá, 2025) — competencia.

**Objetivo de la clase**: verbo observable + contenido + condición («Explica con un modelo por qué la
célula vegetal se hincha en agua destilada»).

**Palabras clave** (preentrenamiento): 4 a 6 términos con una definición corta.

| Momento | Tiempo | Docente | Estudiantes | Recurso (enlace del sitio) |
|---|---|---|---|---|
| Inicio / exploración | 10 min | Pregunta de activación o dato curioso | Responden, discuten en parejas | — |
| Desarrollo / estructuración | 30 min | Explica por pasos; guía la simulación | Usan la simulación, completan la tabla | `…/celula.html#osmosis` |
| Cierre / transferencia | 10 min | Salida de clase | Resuelven 2 preguntas; autoevaluación | Juego (Modo Estudiante) |

**Evaluación**: formativa (qué se observa y con qué instrumento) · competencia Icfes que se trabaja.
**Ajustes razonables (DUA / PIAR)**: 1 o 2 ajustes concretos.
**Tarea o extensión** (opcional) · **Materiales** · **Plan B sin conectividad**.

---

## 2. Secuencia didáctica de 4 sesiones

Es la misma lógica de las guías del panel docente de los tres sitios: así la planeación y la guía
que se imprime para el estudiante coinciden.

| Sesión | Propósito | Contenido que da `plan.js` | Actividad típica |
|---|---|---|---|
| 1 · Aprendizajes previos | Activar lo que saben y despertar interés | Datos curiosos, contexto local/nacional/global, situaciones cotidianas, preguntas de activación | Lluvia de ideas, «¿qué pasaría si…?», predicción escrita que se revisa en la sesión 4 |
| 2 · Información | Construir el concepto | Lectura base (párrafos cortos) y mapa de ideas | Lectura guiada, completar el mapa conceptual, secciones del sitio |
| 3 · Práctica | Aplicar y practicar | Simulaciones y secciones con chequeos; juego | Simulación con tabla de datos, juego en Modo Estudiante, laboratorio virtual con conclusión |
| 4 · Evaluación | Comprobar y reflexionar | Preguntas tipo Saber y abiertas (con `nom-banco`); «Puedo…» | Evaluación corta por competencias, autoevaluación, revisión de la predicción de la sesión 1 |

Para cada sesión escribe: objetivo, momentos con tiempos, recursos con enlace, evidencia que se
recoge y ajuste DUA. Al final: rúbrica o criterios de valoración y la autoevaluación «Puedo…».

---

## 3. Plan de período o unidad

**Encabezado** igual que el plan de clase + número de semanas e intensidad horaria semanal.

**Pregunta problematizadora** del período (relacionada con el contexto colombiano).

**Tiempo efectivo** (tabla de `tiempo.js calcular`): clases según el calendario, festivos y recesos
con sus fechas, horas sin fecha fija, semanas de evaluación final y de refuerzo, holgura,
diagnóstico y horas para planear. Si algún dato es estimado, decirlo.

**Cronograma por semanas** (también de `calcular`): inicio, clase de evaluación y cierre de cada
unidad, festivos, recesos, holgura, evaluación final y refuerzo.

**Unidades** (una fila por unidad):

| Unidad | Meta y evidencia de aprendizaje | Núcleo (no se negocia) | Complementario | Horas | Construcción · Práctica · Experimental · Retroalimentación · Clase de evaluación | Fechas (inicio → evaluación) |
|---|---|---|---|---|---|---|

Debajo de la tabla van:
- los recursos de los sitios por unidad (secciones, simulaciones, juego, hojas de referencia);
- los criterios de evaluación del período (los porcentajes se le preguntan al docente);
- la nivelación o el refuerzo y el producto final;
- la sección **Control del avance**.

## Control del avance (en todo plan de período, unidad o malla)

- **Diagnóstico inicial** (semana 1): una actividad corta sobre los prerrequisitos. Si hay vacíos
  grandes, se ajusta el ritmo desde el principio en vez de avanzar sobre bases débiles.
- **Semáforo** en las semanas que da `calcular` (cada 2 o 3 semanas), con `tiempo.js semaforo`:

| Indicador | 🟢 | 🟡 | 🔴 |
|---|---|---|---|
| Ritmo de cobertura (retraso frente a los hitos) | usa menos de la mitad de la holgura | usa entre la mitad y toda la holgura | ya se pasó de la holgura |
| Apropiación en los chequeos (% del curso que acierta) | 70 % o más | 50 % a 69 %: corregir errores frecuentes | menos de 50 %: detenerse y volver a enseñar |
| Tiempo real de las actividades frente al estimado | hasta 1,2 veces | 1,2 a 1,5 veces | más de 1,5 veces |

- **Si no va a alcanzar, repriorizar a tiempo, no acelerar a ciegas**:
  1. mantener intactos el núcleo y los momentos de práctica y retroalimentación;
  2. compactar o integrar lo complementario en un taller, proyecto o pregunta integradora;
  3. pasar ejercicios extensos a trabajo autónomo (juego en Modo Estudiante, hojas de referencia,
     guías del sitio) y dejar el aula para lo que necesita guía directa.

---

## 4. Malla curricular (año)

Primero se temporiza cada período con `tiempo.js` (un `calcular` por período, con sus propios
descuentos: semana santa, receso de mitad de año, semana de desarrollo institucional, etc.).

| Período | Semanas · horas efectivas | Unidades (núcleo) | DBA (n.º y texto corto) | Estándares | Evidencias de aprendizaje | Hitos de cierre | Recursos de los sitios |
|---|---|---|---|---|---|---|---|

Reglas para la malla:
- Respeta el orden de los módulos de cada sitio (BioNom: Célula → División → Reinos → Ecosistemas →
  Ecosistemas de Colombia → Ambiente → Sistemas → Reproducción → Genética → Evolución), salvo que
  el docente pida otro.
- Usa `node scripts/plan.js curso bio <grado>` para ver qué DBA y estándares tocan a ese grado y
  que ninguno quede sin período.
- Menos temas aislados y más núcleos articulados: si un período tiene más de 4 o 5 unidades para su
  tiempo efectivo, fusiónalas alrededor de una meta común.
- En la última fila, anota los DBA o estándares que el año **no** cubre, si los hay, y lo que quedó
  como complementario.
