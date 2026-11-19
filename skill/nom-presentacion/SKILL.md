---
name: nom-presentacion
description: "Presentaciones de clase (diapositivas para proyectar) con la marca de BioNom, ChromaNom o IonNom, los sitios del docente de ciencias en Colombia: logo, colores, letra legible en el salón, palabras clave al inicio, una idea por diapositiva con su imagen (principios de Mayer), fotos reales con cita APA debajo, chequeos con la explicación de cada error, notas del orador y una diapositiva final con código QR al sitio. Úsala SIEMPRE que el docente pida diapositivas, una presentación, un PowerPoint o material para proyectar en clase de biología o química, aunque no nombre los sitios; para el archivo .pptx trabaja junto con la skill pptx."
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

## Paso 2: el guion de la clase

Antes de diseñar, escribe el guion (ver `referencias/guion.md`). Si está la skill
`nom-planeacion`, `node scripts/plan.js tema <sitio> <id>` da la lectura base, el mapa de ideas,
los «Puedo…», el contexto colombiano y las secciones del sitio con su enlace; si está `nom-banco`,
de ahí salen las preguntas de los chequeos (con sus explicaciones). Reglas del guion:

1. **Palabras clave al inicio** (preentrenamiento): 4 a 6 términos con una definición corta.
2. **Una idea por diapositiva**, con su imagen al lado del texto (contigüidad). Máximo unas 40
   palabras visibles; lo demás va en las **notas del orador** (`slide.addNotes`).
3. **Por pasos**: los procesos se parten en varias diapositivas (segmentación).
4. **Al menos dos chequeos** con la explicación de **cada** opción, no solo de la correcta.
5. **Cierre**: resumen corto o los «Puedo…», y la diapositiva para practicar en el sitio (QR).
6. Una diapositiva cada 1,5 a 2 minutos de exposición, dejando tiempo para los chequeos.

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
const p = N.nueva('ion', { titulo: 'Óxidos', tema: 'Nomenclatura inorgánica', curso: '10.°' });
N.portada(p, { titulo: 'Óxidos básicos y ácidos', subtitulo: '¿Por qué se oxida una reja?', curso: 'Grado 10.°' });
N.claves(p, [{ t: 'Óxido', d: 'Elemento + oxígeno' }, …]);
N.seccion(p, 'Óxidos básicos');                         // divide la clase en partes
const s = N.contenido(p, 'Metal + oxígeno');            // título; lo demás se compone encima
N.texto(s, ['…', '…'], { x: N.M, y: 1.6, w: 6.2, h: 4.6 });
N.imagen(s, 'fe.png', { x: 7.4, y: 2.0, w: 5.0, h: 1.2 }, 'Fe₂O₃ por partes');
await N.foto(s, 'halita', { x: 7.2, y: 1.5, w: 5.5, h: 5.1 }, 'Cristales de halita');   // descarga + cita APA
N.tarjeta(s, { titulo: 'Ojo', cuerpo: '…', x, y, w, h });
N.chequeo(p, { pregunta: '…', opciones: ['…','…','…','…'], correcta: 2, porque: ['…','…','…','…'] });
await N.practica(p, { url: 'https://hbarcenasm863.github.io/ionom/funciones.html', texto: 'Practica en IonNom' });
const r = await N.guardar(p, 'oxidos.pptx');   // { archivo, avisos }
```

- Diapositiva ancha 13,33 × 7,5 in; márgenes `N.M` = 0,6 in; el título ocupa hasta y = 1,3 y el pie
  empieza en y = 6,85. Componer el contenido entre esas dos líneas.
- Letra para el salón: títulos 34 pt, texto 20 a 24 pt, nunca menos de 18 pt (salvo citas, 10 pt).
  Cambria para títulos y Calibri para el texto (vienen con Office y se ven igual en la revisión).
- **Fotos**: `node scripts/fotos.js buscar <palabra>` muestra las 164 fotos de los sitios.
  `N.foto` la descarga y pone la cita APA debajo. Para una foto nueva (Wikimedia Commons, Openverse
  o iNaturalist; solo CC0, dominio público, CC BY o CC BY-SA) pasa `{ archivo, cita }` en el cuarto
  argumento: **ninguna foto va sin su cita**.
- Varía la composición: texto + imagen, tarjetas, tabla (`s.addTable`), proceso en pasos,
  comparación en dos columnas. No repitas la misma diapositiva de viñetas.
- `N.chequeo` hace dos diapositivas: la pregunta y la respuesta con ✔/✘ y el porqué de cada opción
  (y lo copia en las notas). Con `respuesta: false` deja solo la pregunta.

## Paso 4: revisar y entregar

1. `avisos` de `N.guardar` vacío (emojis, fórmulas con paréntesis, semanas, ATP).
2. La revisión de la skill pptx: `validate.py`, convertir a imágenes y mirar **cada** diapositiva
   (texto cortado, cosas encimadas, imágenes deformes, cita APA legible).
3. Entrega el `.pptx` y di cuántas diapositivas tiene, cuánto dura y qué fotos usó.

Requisitos: Node con `pptxgenjs` (y `qrcode` para el QR; sin él, la diapositiva final queda solo
con el enlace). Si `require` falla: `npm install pptxgenjs qrcode`.
