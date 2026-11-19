---
name: nom-hoja-referencia
description: "Hojas de referencia (hojas de repaso, resúmenes de una página, cheat sheets, fichas, chuletas) en PDF tamaño carta con el logo, la marca de agua, los colores y el pie de BioNom, ChromaNom o IonNom, los sitios del docente de ciencias en Colombia. El contenido se agranda solo hasta llenar la página, se revisan las reglas del docente (emojis, fórmulas) y las fotos llevan cita APA. Úsala SIEMPRE que el docente pida una hoja de referencia, de repaso o de resumen, una ficha, un resumen para imprimir o pegar en el cuaderno, o una guía de una o dos páginas de un tema de biología o química, aunque no nombre los sitios."
---

# Hojas de referencia con el estilo de BioNom, ChromaNom e IonNom

El usuario es **docente de ciencias en Colombia** (hombre: «el docente»). Sus tres sitios tienen
hojas de referencia de una página carta: logo arriba, título, marca de agua, recuadros, tablas y pie
con la licencia. Esta skill hace hojas **nuevas** con ese mismo estilo y las entrega en PDF (y PNG
para verlas en el chat).

| Sitio | `--sitio` | Colores | Pie |
|---|---|---|---|
| BioNom (biología) | `bio` | azul noche y verde hoja | BioNom · Biología por niveles de organización |
| ChromaNom (química orgánica) | `chroma` | azul del logo | ChromaNom · Química orgánica |
| IonNom (química inorgánica) | `ion` | azul y código de 4 colores (catión, anión, OH⁻, oxoanión) | IonNom · Química inorgánica |

## Paso 0: ¿ya existe?

Antes de hacer una hoja, mira si el sitio ya la tiene y ofrécela primero (enlace directo):
- BioNom: `https://hbarcenasm863.github.io/bionom/referencias.html?hoja=<id>` con id `niveles`,
  `metodo`, `microscopio`, `celula`, `biomoleculas`, `division`, `clasificacion`, `ecosistemas`,
  `sistemas`, `mendel`, `codigo`.
- ChromaNom: guías en PDF `https://hbarcenasm863.github.io/chromanom/pdf/guia-<nombre>.pdf`
  (biomoleculas, cadenas, carbono, fuerzas-intermoleculares, grupos-funcionales, isomeria,
  nombrar-paso-a-paso, nomenclatura-iupac, organica-ambiente, reacciones-esenciales,
  reacciones-organicas, reacciones-por-grupo).
- IonNom: `https://hbarcenasm863.github.io/ionom/assets/guia-<nombre>.pdf` (acidos-bases, atomo,
  cinetica, enlace, equilibrio, estequiometria, gases, nomenclatura-inorganica, reacciones,
  soluciones, tabla-periodica, termoquimica).

Si el docente quiere una distinta (otro enfoque, otro curso, otro tema), sigue.

## Paso 1: decidir el contenido

Pregunta solo lo que falte, en un mensaje: **sitio, tema, curso** y si es para el estudiante
(repaso) o para pegar en el cuaderno. Si la skill `nom-planeacion` está disponible, su comando
`node scripts/plan.js tema <sitio> <id>` da la lectura base, el mapa de ideas y los «Puedo…» del
tema: es buen punto de partida. Una hoja de referencia típica tiene, en este orden:

1. Un recuadro destacado con la **idea central** o la definición (2 a 3 líneas).
2. Una **tabla** que compare o clasifique (lo que más se consulta).
3. **Pasos** o un procedimiento, con un **ejemplo resuelto**.
4. Fórmulas, ecuaciones o datos clave.
5. Un recuadro de **errores frecuentes** al final.

Escribe para el estudiante: frases cortas, párrafos de menos de 80 palabras, palabras clave en
negrilla, un emoji de título por recuadro (de los que sí se ven en Windows). Las reglas de
contenido de cada sitio aplican aquí:
- **BioNom**: semanas de embarazo desde la última menstruación (40); unos 30 a 32 ATP por glucosa;
  si el tema es Reinos, pregunta el modelo (5, 6 o 7 reinos, con o sin dominios).
- **ChromaNom**: nunca fórmulas con ramas entre paréntesis. Dibuja las estructuras con la skill
  `chromanom-estructuras` (SVG) y ponlas en `<figure class="fig">`.
- **IonNom**: fórmulas con subíndices y cargas reales y nombres en los tres sistemas como en la
  skill `ionom-formulas`; marca catión, anión, OH⁻ y oxoanión con las clases `cat`, `an`, `oh`, `ox`.

## Paso 2: escribir el cuerpo en HTML

Escribe **solo el cuerpo** en un archivo `.html` con los componentes de
`referencias/componentes.md` (recuadros `.rc`, columnas `.cols2`, tablas `.t-ref`, pasos,
fórmulas `.fx`, figuras y fotos). El programa pone el encabezado, la marca de agua y el pie. Para
una segunda página, escribe una línea `<!-- pagina -->`.

**Fotos reales:** los tres sitios ya tienen 164 fotos con licencia libre y su cita:

```bash
node scripts/fotos.js buscar mitocondria          # también --sitio bio|chroma|ion
node scripts/fotos.js bajar nv_mito ./img         # la descarga al lado de tu HTML
node scripts/fotos.js cita nv_mito                # cita APA para ponerla debajo
```

Toda foto lleva su cita APA debajo, siempre (formato en `componentes.md`). Si hace falta una que
no está, búscala en Wikimedia Commons, Openverse o iNaturalist, con licencia CC0, dominio público,
CC BY o CC BY-SA (nunca NC ni ND), y cítala igual.

## Paso 3: generar el PDF y revisarlo

```bash
node scripts/hoja.js cuerpo.html --sitio bio --titulo "La célula" --tema "La célula" \
     --ico "🔬" --salida celula.pdf --png
```

Opciones: `--horizontal` (carta horizontal, como las guías de ChromaNom e IonNom),
`--pie-izq` y `--pie-der` para cambiar el pie (por ejemplo, el nombre del colegio).

El programa responde con un JSON. Revisa:
- **`escala`** de cada página: entre 0,85 y 1,75 queda bien (1,0 es la letra de las hojas de
  BioNom). Menos de 0,85 = letra muy pequeña (recorta o pasa algo a otra página). 1,75 o más =
  el contenido no alcanza a llenar la hoja (agrega un ejemplo resuelto, una figura o los errores
  frecuentes).
- **`avisos`**: emojis que no se ven en Windows, fórmulas orgánicas con paréntesis, semanas de
  gestación, ATP. Corrige todos y vuelve a generar.
- **Mira el PNG** antes de entregar: tablas que se parten, columnas desparejas, figuras cortadas.

Entrega el PDF (y la imagen si el docente está en el celular). Si el docente quiere la hoja
dentro de su sitio, el HTML del cuerpo usa las mismas clases que `referencias.html` de BioNom:
se pega dentro de un `<article class="hoja" data-hoja="…">` y se suma a `HT` y `NOM` en `bio.js`.

## Requisitos

Node y Playwright con Chromium (`require('playwright')`). Si no hay Playwright, entrega el HTML
completo para que el docente lo abra y lo imprima como PDF desde el navegador (carta, sin
márgenes, con gráficos de fondo).
