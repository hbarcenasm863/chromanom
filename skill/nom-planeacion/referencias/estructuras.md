# Estructuras de planeación

Usa la que corresponda. Si el colegio tiene su propio formato, ese manda: estas estructuras solo
dicen qué contenido poner en cada casilla. Las tablas funcionan igual en el chat, en un documento,
en Word o en PDF.

## Índice
1. Plan de clase (una sesión)
2. Secuencia didáctica de 4 sesiones (formato del panel docente)
3. Plan de período o unidad
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

| Semana | Tema (sitio · id) | DBA / estándar / evidencia SED | Objetivo | Actividades y recursos | Evaluación |
|---|---|---|---|---|---|

Debajo: criterios de evaluación del período (porcentajes si el colegio los usa, preguntados al
docente), actividades de nivelación o refuerzo y producto final.

---

## 4. Malla curricular (año)

| Período | Ejes / temas | DBA (n.º y texto corto) | Estándares | Evidencias de aprendizaje | Recursos de los sitios |
|---|---|---|---|---|---|

Reglas para la malla:
- Respeta el orden de los módulos de cada sitio (BioNom: Célula → División → Reinos → Ecosistemas →
  Ecosistemas de Colombia → Ambiente → Sistemas → Reproducción → Genética → Evolución), salvo que
  el docente pida otro.
- Usa `node scripts/plan.js curso bio <grado>` para ver qué DBA y estándares tocan a ese grado y
  que ninguno quede sin período.
- En la última fila, anota los DBA o estándares que el año **no** cubre, si los hay.
