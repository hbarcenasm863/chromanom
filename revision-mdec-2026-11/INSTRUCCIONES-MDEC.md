# Auditoría de las preguntas MDEC nuevas (ChromaNom e IonNom)

El docente (química, Colombia) pidió ampliar las preguntas de su **método MDEC** (modelo propio para
leer y armar nombres; no se enlaza a DBA ni estándar). Se generaron automáticamente a partir de los
datos del sitio. Eres un auditor experto e independiente. **No modifiques nada en /home/user**; escribe
solo tu salida.

- **ChromaNom (química orgánica 11.°)**: el MDEC lee el nombre IUPAC en cuatro partes:
  ① sustituyentes [r], ② cadena principal [c], ③ insaturación o saturación [i: «an», «en», «in»],
  ④ grupo funcional [g: «o», «ol», «al», «ona», «oico»…]. El lote trae (a) 84 preguntas de selección
  múltiple (la primera opción es la correcta) y (b) las 381 moléculas con la partición de su nombre,
  que el juego y los talleres usan para «arrastra cada fragmento», «¿a qué parte corresponde?» y
  «arma el nombre con fichas».
- **IonNom (química inorgánica 10.°)**: el MDEC separa cada compuesto iónico en sus partes con colores:
  catión, anión [an], hidróxido [oh] u oxoanión [ox], con su carga. El lote trae (a) 86 preguntas de
  selección múltiple y (b) los 503 compuestos separados en iones (ion ×cuántos).

## Qué revisar
- **Experto en química**: cada partición/separación es correcta (fragmentos y su parte; iones, cargas y
  cantidades; nombres IUPAC); resuelve cada pregunta a ciegas (sin mirar cuál va primero) y confirma que
  hay **una sola** correcta; los distractores son errores típicos y no son también correctos (por ejemplo,
  un nombre distractor que sea un compuesto real con esas mismas fichas, o una carga posible del mismo
  ion en ese compuesto). Fórmulas orgánicas nunca con ramas entre paréntesis (en inorgánica sí se
  permiten paréntesis de iones poliatómicos).
- **Experto en evaluación**: calidad del ítem (enunciado claro, una sola correcta, distractores
  plausibles que nacen de errores concretos, sin pistas gramaticales, longitudes parejas), adecuación al
  grado y redacción en español de Colombia. No asignes DBA ni estándar (regla del docente).

## Salida (JSON válido)
```json
{"lote":"…","experto":"quimica|evaluacion","revisadas":0,
 "preguntas":[{"id":"mdec-chr-12","gravedad":"alta|media|baja","problema":"…","propuesta":"…"}],
 "particiones":[{"item":"nombre o fórmula","gravedad":"alta|media|baja","problema":"…","correccion":"partición o iones correctos"}],
 "patrones":["problemas que se repiten y cómo corregirlos en el generador"]}
```
Reporta solo lo que haya que cambiar. Además, un informe breve en Markdown.
