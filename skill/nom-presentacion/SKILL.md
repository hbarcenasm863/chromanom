---
name: nom-presentacion
description: "Presentaciones de clase (diapositivas para proyectar) con la marca de BioNom, ChromaNom o IonNom, los sitios del docente de ciencias en Colombia, completas y con la estructura didáctica del docente: meta de aprendizaje, fenómeno ancla y predicción inicial; vocabulario; los tres niveles de representación (foto, modelo de partículas y símbolos); procedimientos paso a paso; ejemplos resueltos; chequeos cada 10 a 15 minutos con la explicación de cada error; consigna de actividad; ejercicios con respuestas; cierre con mapa conceptual incompleto y ticket de salida. Fotos reales con cita APA, poco texto, notas del orador y código QR al sitio. Úsala SIEMPRE que el docente pida diapositivas, una presentación, un PowerPoint o material para proyectar en clase de biología o química, aunque no nombre los sitios; para el archivo .pptx trabaja junto con la skill pptx."
---

# Presentaciones de clase con la marca de BioNom, ChromaNom e IonNom

El usuario es **docente de ciencias en un colegio público de Colombia** (hombre: «el docente»).
Proyecta en el salón, a veces sin internet, desde un Windows. Esta skill hace presentaciones que
se ven como sus sitios y que siguen las mismas reglas didácticas. Trae los logos (`assets/`), 164
fotos con licencia libre y su cita (`datos/fotos.json`) y un módulo para pptxgenjs
(`scripts/nom-pptx.js`) con las diapositivas típicas ya armadas.

| Sitio | `sitio` | Color dominante | Acento |
|---|---|---|---|
| BioNom (biología) | `bio` | verde bosque 14532D | ámbar F59E0B |
| ChromaNom (química orgánica) | `chroma` | azul noche 0D4A73 | naranja F07C1E |
| IonNom (química inorgánica) | `ion` | azul noche 0D4A73 | ámbar E69F00 (y su código de 4 colores) |

## Paso 1: lo que hay que saber

En un solo mensaje, con valores propuestos: **sitio, tema, curso, duración de la clase** y
**formato** (PowerPoint `.pptx` para proyectar sin internet, que es lo normal; Google Slides con la
skill `google-workspace` si lo pide). Si va a llevar el nombre del colegio, pregúntalo; no lo
inventes.

## Paso 2: el guion de la clase (obligatorio, con los criterios del docente)

Antes de diseñar, escribe el guion siguiendo **`referencias/guion.md`**: es la estructura que el
docente pidió para toda presentación y trae la lista de revisión final. En resumen:

1. **Apertura**: meta de aprendizaje (`objetivo`), fenómeno ancla con foto (preferiblemente
   colombiano) y predicción o encuesta sin respuesta (`encuesta`), antes de cualquier definición.
2. **Construcción**: vocabulario funcional (`claves`); **los tres niveles de representación**
   (`johnstone`: foto + modelo de partículas + símbolos) para cada concepto central; procedimientos
   en pasos progresivos (`pasos`, `cruce`); si hay dos categorías, **las dos con el mismo desarrollo**.
3. **Práctica guiada**: ejemplo resuelto revelado paso a paso (`ejemplo`), un ejemplo guiado del
   mismo tipo **antes** de cada chequeo, chequeos cada 10–15 minutos con el porqué de cada opción
   (`chequeo`, también «¿qué pasaría si…?»), consigna fija con roles, criterios de éxito y tiempo
   (`consigna`) y ejercicios graduados con su diapositiva de respuestas (`ejercicios`).
4. **Cierre**: volver al fenómeno ancla y a la encuesta, mapa conceptual incompleto (`mapa`),
   ticket de salida (`ticket`) y práctica en el sitio con QR (`practica`).

**Profundidad**: una presentación «básica» no sirve. Cada regla va con su explicación, su ejemplo
resuelto y ejercicios. Para nomenclatura: el procedimiento para formular, varios cruces de cargas
(sin simplificar, simplificando, y de cada familia) y **un sistema por diapositiva con su ejemplo
resuelto**. Una clase de 55 minutos tiene unas 25 a 35 diapositivas contando los pasos progresivos;
un bloque de 110, unas 50 a 70 (`referencias/ejemplo.js`: óxidos, 71).

**Diseño**: una idea por diapositiva; viñetas de 6 a 8 palabras y máximo un 30 % de texto (el
detalle en las notas del orador); flechas, recuadros y colores con el mismo significado en toda la
presentación; cada imagen relacionada con la idea (nada de una foto de NaCl para hablar de óxidos).
Si la skill `nom-planeacion` está, `node scripts/plan.js tema <sitio> <id>` da el contexto
colombiano, la lectura base y las secciones del sitio; si está `nom-banco`, de ahí salen las
preguntas de los chequeos.

Reglas de contenido de los sitios:
- **BioNom**: semanas de embarazo desde la última menstruación (40); unos 30 a 32 ATP por glucosa;
  en Reinos, preguntar el modelo (5, 6 o 7 reinos, con o sin dominios); lo de 10.°–11.° se marca
  «Profundización».
- **ChromaNom**: toda estructura orgánica dibujada con `chromanom-estructuras` (SVG → PNG), nunca
  con ramas entre paréntesis.
- **IonNom**: fórmulas y nombres con `ionom-formulas`; para «desarmar» un compuesto usa
  `node scripts/formula.js colorear "Fe2(SO4)3" --png fe.png` (código de 4 colores).
- **Emojis**: nada de banderas ni emojis de la versión 12 en adelante (🫁 🫀 🩸 🟢…): en el Windows
  del docente salen como rectángulos negros. El módulo los avisa al guardar.

## Paso 3: construir el .pptx

Usa el módulo; resuelve el diseño y deja lo repetitivo hecho. Lee antes la skill **pptx** (detalles
de pptxgenjs y la revisión obligatoria). Ejemplo completo en `referencias/ejemplo.js`.

```js
const N = require('<carpeta de esta skill>/scripts/nom-pptx.js');
const p = N.nueva('ion', { titulo: 'Óxidos', tema: 'Óxidos básicos y ácidos', curso: '10.°' });
N.portada(p, { titulo, subtitulo, curso });
N.objetivo(p, { meta: 'diferenciar…', criterios: ['…', '…'] });
N.encuesta(p, { pregunta: '¿Qué le pasó al hierro?', opciones: ['…', '…', '…', '…'] });
N.claves(p, [{ t: 'Óxido', d: 'Elemento unido al oxígeno (O²⁻).' }, …]);
N.seccion(p, '1. ¿Qué es un óxido?');
N.comparar(p, 'Dos familias', { titulo, items, color }, { titulo, items, color });
await N.johnstone(p, 'Tres niveles', { macro: { foto: 'oxido_hierro', pie }, submicro: { ionico: { cat, an, proporcion } }, simbolico: ['4 Fe + 3 O₂ → 2 Fe₂O₃'] });
N.pasos(p, 'Cómo formular', [{ t, d, ej }, …], { progresivo: true });
N.cruce(p, { titulo, cat: { sim: 'Fe', q: 3 }, an: { sim: 'O', q: -2 }, nombre: 'óxido férrico' });
N.ejemplo(p, { titulo, enunciado, pasos: [{ t, r }, …], respuesta });
N.chequeo(p, { pregunta, opciones, correcta, porque: [ …una explicación por opción… ] });
N.consigna(p, { tarea, roles, criterios, tiempo: 20, entrega });
N.ejercicios(p, { titulo, instruccion, items: [{ q, r, x }, …] });
N.mapa(p, { raiz, ramas: [{ t, items }], ocultar: ['…'] });
N.ticket(p, { preguntas: ['…', '…'] });
await N.practica(p, { url, texto });
const r = await N.guardar(p, 'oxidos.pptx');   // { archivo, avisos }
```

Para componer a mano: `N.contenido(p, título)` devuelve la diapositiva y encima van `N.texto`,
`N.tabla` (con `h` para que las filas llenen el alto), `N.tarjeta`, `N.fichas` (recuadros con el
código de colores), `await N.foto`, `N.imagen`, `N.modeloIonico` y `N.modeloMolecula`.

- Diapositiva ancha 13,33 × 7,5 in; márgenes `N.M` = 0,6 in; el título ocupa hasta y = 1,3 y el pie
  empieza en y = 6,85. Componer el contenido entre esas dos líneas.
- Letra para el salón: títulos 34 pt, texto de 22 a 28 pt, tablas de 18 a 24 pt; nada por debajo de
  17 pt salvo las citas. Si sobra espacio, agranda; si no cabe, divide. Cambria y Calibri.
- **Fotos**: `node scripts/fotos.js buscar <palabra>` muestra las fotos de los sitios (y las que
  trae la skill, como `oxido_hierro`). `N.foto` la pone con su cita APA debajo. Para una foto nueva
  (Wikimedia Commons, Openverse o iNaturalist; solo CC0, dominio público, CC BY o CC BY-SA) pasa
  `{ archivo, cita }` en el cuarto argumento: **ninguna foto va sin su cita**.
- **Flechas ordenadas**: que salgan del elemento que causa y lleguen al que recibe, sin pasar por
  encima de recuadros ni textos, y del color de su origen. `N.cruce` ya lo hace así.

## Paso 4: revisar y entregar

1. `avisos` de `N.guardar` vacío (emojis, fórmulas con paréntesis, semanas, ATP, viñetas de más
   de 8 palabras, diapositivas con más de 45 palabras) y la lista de revisión de `referencias/guion.md`.
2. La revisión de la skill pptx: `validate.py`, convertir a imágenes y mirar **cada** diapositiva
   (texto cortado, cosas encimadas, imágenes deformes, cita APA legible).
3. Entrega el `.pptx` y di cuántas diapositivas tiene, cuánto dura y qué fotos usó.

Requisitos: Node con `pptxgenjs` (y `qrcode` para el QR; sin él, la diapositiva final queda solo
con el enlace). Si `require` falla: `npm install pptxgenjs qrcode`.
