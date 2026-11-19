# Guion de una clase en diapositivas (criterios didácticos del docente)

Toda presentación de ciencias tiene estas cuatro partes. Revisa la lista al final antes de entregar.

## 1. Apertura y contextualización (enganche)

| Elemento | Función de `nom-pptx.js` | Qué va |
|---|---|---|
| Meta de aprendizaje | `objetivo` | Qué podrá **explicar, predecir o modelar** el estudiante al final, en sus palabras, y 2–3 criterios «sabrás que lo lograste si…» |
| Fenómeno ancla o pregunta problematizadora | `contenido` + `foto` | Caso real o cotidiano (de preferencia colombiano), imagen intrigante o discrepancia, **antes** de cualquier definición |
| Activación de ideas previas | `encuesta` | Predicción o votación sin respuesta. Las opciones recogen ideas alternativas frecuentes. Se retoma al cierre |

## 2. Construcción conceptual y modelización

| Elemento | Función | Qué va |
|---|---|---|
| Vocabulario clave | `claves` | 4–6 términos con su significado funcional (≤ 10 palabras cada uno), no definiciones de enciclopedia |
| Representaciones múltiples (triángulo de Johnstone) | `johnstone`, `modeloIonico`, `modeloMolecula`, `tabla` | Al menos dos niveles, idealmente los tres en una diapositiva: **macroscópico** (foto, montaje, datos reales), **submicroscópico** (partículas, moléculas, células, fuerzas, flujos de energía) y **simbólico** (ecuación, fórmula, gráfica, tabla) |
| Andamiaje paso a paso | `pasos` (con `progresivo: true`), `cruce`, `seccion` | Procesos complejos en diapositivas progresivas: cada paso aparece cuando se necesita |
| Mismo desarrollo para cada caso | — | Si hay dos categorías (óxido básico y anhídrido, mitosis y meiosis, autótrofo y heterótrofo), las dos tienen su ejemplo, su modelo y su regla. No dejar una a medias |

## 3. Práctica guiada y aplicación

| Elemento | Función | Qué va |
|---|---|---|
| Modelamiento | `ejemplo` | Ejemplo resuelto con pasos numerados y en colores, revelados uno a uno, **antes** de pedir trabajo solo |
| Ejemplo guiado intermedio | `ejemplo` | Antes de cada chequeo, un caso del mismo tipo que la pregunta (no saltar de la explicación a la pregunta) |
| Chequeos cada 10–15 min | `chequeo` | Opción múltiple con la explicación de **cada** opción, análisis de una gráfica o tabla, o «¿qué pasaría si…?» |
| Consigna de actividad | `consigna` | Diapositiva fija: tarea concreta, roles, criterios de éxito, tiempo y entrega |
| Ejercicios con respuestas | `ejercicios` | De menor a mayor dificultad; las respuestas en otra diapositiva con una explicación corta |

## 4. Cierre y metacognición

| Elemento | Función | Qué va |
|---|---|---|
| Volver al fenómeno ancla | `contenido` + `foto` | «Ahora, ¿cómo explicamos lo del inicio?»: la explicación con lo aprendido y la comparación con la encuesta |
| Síntesis visual | `mapa` | Mapa conceptual con casillas en blanco que el curso completa; luego la versión completa |
| Ticket de salida | `ticket` | 1–3 preguntas breves: transferencia, la meta de la clase y un error que ya no cometen |
| Seguir practicando | `practica` | Enlace y QR a la sección o simulación del sitio y al juego |

## Reglas de diseño visual

- **Una idea central por diapositiva.** No mezclar dos conceptos o procesos en la misma.
- **Máximo 30 % de texto.** Viñetas de 6 a 8 palabras como máximo; diagramas, esquemas, tablas y
  gráficas anotadas antes que párrafos. El detalle va en las notas del orador. `N.guardar` avisa de
  las viñetas de más de 8 palabras y de las diapositivas con más de 45 palabras.
- **Señalización.** Flechas, recuadros y códigos de color con el mismo significado en toda la
  presentación (en IonNom: catión ámbar, anión azul, OH⁻ rosado, oxoanión verde, no metal gris).
- **Letra para el salón.** Títulos de 34 pt, texto de 22 a 28 pt, tablas de 18 a 24 pt; nada por debajo
  de 17 pt salvo las citas de las fotos. Si sobra espacio, agranda; si no cabe, divide la diapositiva.
- **Imágenes que explican.** Cada foto tiene que ver con la idea de la diapositiva (no una foto de
  NaCl para hablar de óxidos) y lleva su cita APA debajo.

## Extensión

Una clase de 55 minutos tiene unas 25 a 35 diapositivas contando los pasos progresivos (que pasan
rápido); un bloque de 110 minutos, unas 50 a 70. Si el tema no cabe, se divide en dos clases y cada
una tiene sus cuatro partes. Ejemplo completo: `referencias/ejemplo.js` (óxidos, 71 diapositivas,
bloque de 110 minutos).

## Lista de revisión antes de entregar

- [ ] Meta, fenómeno ancla y predicción antes de la primera definición.
- [ ] Vocabulario con significados funcionales.
- [ ] Al menos una diapositiva con los tres niveles de representación por concepto central.
- [ ] Procedimientos en pasos progresivos; cada caso con el mismo desarrollo.
- [ ] Ejemplo resuelto y ejemplo guiado antes de cada chequeo; un chequeo cada 10–15 minutos.
- [ ] Consigna fija con roles, criterios de éxito y tiempo si hay actividad.
- [ ] Cierre que vuelve al fenómeno ancla, mapa incompleto y ticket de salida.
- [ ] `avisos` vacío y todas las diapositivas revisadas como imagen.
