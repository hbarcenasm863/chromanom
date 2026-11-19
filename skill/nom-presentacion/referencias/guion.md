# Guion de una clase en diapositivas

Plantilla para una clase de 50 a 55 minutos (unas 12 a 16 diapositivas). Ajusta al tiempo real.

| # | Diapositiva | Función `nom-pptx.js` | Qué va |
|---|---|---|---|
| 1 | Portada | `portada` | Tema, pregunta o subtítulo que despierte curiosidad, curso |
| 2 | Pregunta de activación | `contenido` + foto | Un dato curioso o situación cotidiana colombiana (sesión 1 del panel docente) y una pregunta para predecir |
| 3 | Palabras clave | `claves` | 4 a 6 términos con definición corta |
| 4 | Sección 1 | `seccion` | Nombre de la primera idea grande |
| 5–7 | Idea por diapositiva | `contenido` + `texto` + `foto`/`imagen`/`tarjeta` | Una idea, su imagen al lado, ≤ 40 palabras; detalle en notas |
| 8–9 | Chequeo 1 | `chequeo` | Pregunta de la idea anterior con explicación de cada opción |
| 10 | Sección 2 | `seccion` | Segunda idea grande |
| 11–12 | Proceso por pasos | `contenido` + pasos numerados | Un paso por diapositiva o 3–4 pasos con flechas |
| 13–14 | Chequeo 2 | `chequeo` | De preferencia tipo Saber 11 (contexto + pregunta) |
| 15 | Cierre | `contenido` + tarjetas | «Puedo…» o resumen en 3 ideas; volver a la predicción de la diapositiva 2 |
| 16 | Practica en el sitio | `practica` | Enlace a la sección o simulación (QR) y al juego en Modo Estudiante |

Ideas de diapositivas que funcionan en ciencias:
- **Comparación** en dos columnas (procariota / eucariota, mitosis / meiosis, óxido básico / ácido).
- **Tabla** corta (máximo 5 filas) con encabezado en el color del sitio.
- **Dato grande**: un número de 60 pt con su explicación debajo («30 billones de células»).
- **Antes y después** o «¿qué pasaría si…?» con dos fotos.
- **Error frecuente**: tarjeta con la idea equivocada tachada y la correcta al lado.
- **Contexto colombiano**: foto de un ecosistema, una industria o un lugar del país con su cita.

Enlaces útiles para la última diapositiva:
- BioNom `https://hbarcenasm863.github.io/bionom/<página>.html#<sección>` y el juego `…/juego.html`.
- ChromaNom `https://hbarcenasm863.github.io/chromanom/…` · IonNom `https://hbarcenasm863.github.io/ionom/…`.
  Con `nom-planeacion`: `node scripts/plan.js tema <sitio> <id>` da las secciones exactas.
