# Maquetación de guías, talleres y evaluaciones sin espacios ni hojas en blanco

Consejos y código probados en ChromaNom (`docente.html` / `docente-app.js`)
para que los documentos imprimibles queden **compactos, sin huecos grandes y
sin hojas en blanco**. Pensado para replicarlo en IoNom.

---

## 1. Idea central: paginar uno mismo, no dejarlo al navegador

Si se arma un solo documento largo y se deja que el navegador lo corte al
imprimir, aparecen tres problemas:
- ejercicios partidos entre dos hojas;
- huecos grandes al final de las páginas;
- hojas en blanco.

La solución es **construir cada hoja como un `div` de tamaño carta fijo** y
repartir el contenido a mano, midiendo:

```css
.hoja{width:816px;height:1056px;              /* carta a 96 dpi */
      padding:38px 46px 30px;box-sizing:border-box;
      display:flex;flex-direction:column;overflow:hidden}
.hoja-cab{ /* encabezado corto */ }
.hoja-cuerpo{flex:1;min-height:0;overflow:hidden}   /* aquí va el contenido */
.hoja-pie{ /* «Taller — página 2 de 4» */ }
```

El cuerpo ocupa exactamente lo que queda entre encabezado y pie. Así
`cuerpo.scrollHeight > cuerpo.clientHeight` dice con precisión si algo no
cabe.

---

## 2. Pensar en «bloques» indivisibles

Todo documento es una **lista de bloques HTML**. Un bloque es lo que nunca
se debe partir:
- un ejercicio con su espacio de respuesta;
- una pregunta tipo Saber con sus opciones;
- un párrafo de lectura;
- un subtítulo **junto con** su primer elemento.

El último punto evita títulos huérfanos al final de una hoja: el título se
concatena al primer bloque de su sección, no va solo.

```js
lectura.forEach((par,i)=>out.push((i===0?'<h4>Lectura</h4>':'')+'<p>'+par+'</p>'));
```

---

## 3. Algoritmo de paginación

```js
function paginar(doc, medidor){
  const hojas=[];
  function nueva(){ /* crea .hoja dentro de #medidor y devuelve su .hoja-cuerpo */ }
  let cuerpo=nueva();
  doc.bloques.forEach((html,i)=>{
    const w=document.createElement('div'); w.className='blq'; w.innerHTML=html;
    cuerpo.appendChild(w);
    if(cuerpo.scrollHeight>cuerpo.clientHeight+1 && cuerpo.children.length>1){
      cuerpo.removeChild(w);          // no cabe: a la hoja siguiente
      cuerpo=nueva(); cuerpo.appendChild(w);
    }
  });
  hojas.forEach(llenarHoja);          // ver sección 5
  hojas.forEach((h,i)=>h.querySelector('.pie-n').textContent=`${doc.etiqueta} — página ${i+1} de ${hojas.length}`);
  return hojas;
}
```

Detalles importantes:

- **Se mide en un contenedor oculto a tamaño real**:
  ```css
  #medidor{position:absolute;left:-12000px;top:0;visibility:hidden}
  ```
  No uses `display:none`, porque así no se mide nada. Cuando todo está
  paginado, se mueven las hojas a la vista previa.
- La condición `children.length>1` evita un ciclo infinito si un bloque solo
  es más alto que una hoja. En ese caso se queda donde está; conviene que
  ningún bloque supere una hoja.
- **Primera hoja distinta:** el encabezado institucional y la línea del
  estudiante van pegados al primer bloque, y esa hoja oculta el encabezado
  corto.

---

## 4. Doble columna para preguntas de selección múltiple

Las preguntas cortas en una sola columna desperdician media hoja. Se agrupan
en un contenedor de dos columnas **por hoja**:

```css
.cols2{column-count:2;column-gap:20px;column-rule:1px solid #ddd}
.cols2>.blq{break-inside:avoid;display:inline-block;width:100%}
```

```js
const enCols=/^<div class="sq"/.test(html);           // es pregunta tipo Saber
const dest=enCols ? contenedorCols() : cuerpo;        // reusa el .cols2 de la hoja o crea uno
```

Si la pregunta no cabe, se abre una hoja nueva con **su propio** `.cols2`.

Además:
- Las opciones muy cortas (fórmulas, números) van en 2×2 dentro de la columna.
- Las figuras dentro de columnas llevan `max-width:100%`.

---

## 5. Llenar el espacio libre: cuadrícula tipo cuaderno elástica

Este es el truco que elimina los huecos. Los espacios de respuesta no tienen
alto fijo. Son cuadrículas cuyo alto es un **múltiplo de un cuadro de 5 mm**:

```css
.cuad{border:1px solid #8fb1d6;border-radius:3px;
  background-image:linear-gradient(#cddff2 1px,transparent 1px),
                   linear-gradient(90deg,#cddff2 1px,transparent 1px);
  background-size:18.9px 18.9px;background-position:-1px -1px;
  print-color-adjust:exact;-webkit-print-color-adjust:exact}
```

```js
const CUADRO=18.9;   // ≈ 5 mm
const cuad=(n,cls='')=>`<div class="cuad ${cls}" style="height:${(n*CUADRO).toFixed(1)}px"></div>`;
```

Cada ejercicio nace con su **mínimo** de cuadros (3–5). Después de paginar,
`llenarHoja` reparte lo que sobra:

1. Mide el espacio libre entre el último bloque y el pie.
2. Agrupa las cuadrículas por **fila**: las que están lado a lado crecen
   juntas, para que queden parejas.
3. Reparte **un cuadro a la vez, en ronda**, entre las filas, con un tope
   (26 cuadros) para que ninguna crezca absurdamente.
4. Si al final se pasó, devuelve cuadros hasta que todo cabe.
5. Si la hoja **no tiene** cuadrículas (lectura, preguntas Saber), agrega al
   final un bloque «Notas» o, en evaluaciones, «Borrador y cálculos (no se
   califica)» del alto exacto que sobra (si sobran al menos 4 cuadros).

```js
let pasos=Math.floor(libre()/CUADRO), k=0;
while(pasos>0){
  const f=filas[k++%filas.length];
  if(alto(f)>=26*CUADRO) continue;
  f.forEach(a=>a.style.height=(alto(a)+CUADRO)+'px'); pasos--;
}
while(cuerpo.scrollHeight>cuerpo.clientHeight+1) quitarUnCuadroAlMayor();
```

Resultado: todas las hojas terminan **llenas hasta el pie**, y el espacio
extra se convierte en espacio útil para escribir.

---

## 6. Evitar hojas en blanco al imprimir

```css
@page hoja{size:letter;margin:0}
@media print{
  /* ocultar todo lo que no sea la vista previa */
  .menu,.formulario,.avisos,.pie-sitio{display:none!important}
  #vista{zoom:1!important;transform:none!important}
  .hoja{page:hoja;box-shadow:none;margin:0;
        break-after:page;page-break-after:always;
        height:1055px}                               /* 1 px menos que la hoja */
  .hoja:last-child{break-after:auto;page-break-after:auto}
  .hoja *{print-color-adjust:exact;-webkit-print-color-adjust:exact}
}
```

Cada línea evita una causa concreta de hoja en blanco:

| Línea | Qué evita |
|---|---|
| `margin:0` en `@page` + hoja de 816×1056 | Que el margen del navegador sumado al de la hoja la haga más grande que el papel y salte a otra página. Los márgenes los da el `padding` de la hoja. |
| `height:1055px` | Que el redondeo de 1056 px haga que un píxel se pase y genere una hoja vacía después de cada hoja. |
| `.hoja:last-child{break-after:auto}` | La hoja en blanco al final del documento. |
| Ocultar todo lo demás y `zoom:1` | Que el formulario o el zoom de la vista previa empujen o deformen las hojas. |
| `print-color-adjust:exact` | Que se pierdan la cuadrícula y los colores (los navegadores no imprimen fondos por defecto). |

Indique siempre al docente que imprima en **tamaño carta, márgenes
«ninguno» o «predeterminados» y escala 100 %**.

---

## 7. Medir con lo que de verdad se va a imprimir

Varios desbordes de ChromaNom salieron de aquí:

- **Fuentes web:** se descargan solo cuando se usan. Si se mide antes, se
  mide con la fuente de reemplazo y luego el texto crece y desborda. Antes de
  paginar hay que cargar **cada fuente y peso** que usa la hoja:
  ```js
  await Promise.all(['400 13.5px "STIX Two Text"','700 13.5px "STIX Two Text"',
    'italic 400 13.5px "STIX Two Text"','700 12px "JetBrains Mono"','400 12px "Outfit"']
    .map(f=>document.fonts.load(f).catch(()=>{})));
  ```
- **Zoom de la vista previa:** para que la hoja quepa en pantalla se usa
  `zoom`, y eso cambia los redondeos. En pantalla puede verse un «recorte» de
  2 a 9 px que **no existe al imprimir**. Por eso se mide en `#medidor` (zoom 1)
  y, en las pruebas automáticas, se pone `zoom=1` antes de comprobar.
- **Imágenes y SVG:** deben tener ancho y alto explícitos al insertarse. Si
  no, miden 0 al paginar y crecen después.

---

## 8. Figuras: tamaño según su forma

Si a todas las estructuras se les da la misma caja, las anchas quedan
diminutas y las angostas desperdician espacio. Se escala cada SVG según su
`viewBox`, dentro de una caja máxima, con escala mínima y máxima:

```js
s = clamp(min(wMax/vw, hMax/vh), 0.7, 1.4);   // ancho y alto finales = viewBox × s
```

Además:
- Los ejercicios con figura **angosta van de a dos por fila**
  (`grid-template-columns:1fr 1fr`).
- Las figuras **anchas** (cadenas largas) van en fila completa.

Así no quedan medias filas vacías.

---

## 9. Organización de documentos que ahorra hojas

- **Cada documento empieza en hoja nueva**: guía, evaluación, anexo de
  rúbricas. Las evaluaciones nunca comparten hoja con la guía.
- **Con varias versiones**, la parte que es igual para todos (la guía de
  estudio) sale **una sola vez**. Solo se repite lo que cambia (la
  evaluación). El anexo de rúbricas sale una vez, al final.
- **Rótulos que no aportan, fuera.** Quitar el rótulo de competencia de cada
  pregunta ahorró una línea por pregunta. Llevar el número de la pregunta en
  línea con el contexto ahorró otra.
- **No repetir datos** que ya están en el encabezado (por ejemplo, la fecha
  en la línea del estudiante).
- **Sin documentos vacíos:** si una sección se queda sin contenido, se avisa
  al docente («Solo hay 8 ejercicios disponibles…») en vez de imprimir hojas
  vacías.

---

## 10. Prueba automática (Playwright)

Hay que probarlo de verdad. Varios errores solo aparecieron al generar
documentos reales.

Corre la prueba en un servidor local (`python3 -m http.server`), no con
`file://`. Para cada tema × tipo de documento × varias versiones:

```js
await page.evaluate(()=>document.getElementById('vista').style.zoom='1');
const desbordes=await page.evaluate(()=>[...document.querySelectorAll('#vista .hoja')]
  .filter(h=>{const c=h.querySelector('.hoja-cuerpo');return c.scrollHeight>c.clientHeight+1;}).length);
const libre=await page.evaluate(()=>[...document.querySelectorAll('#vista .hoja')].map(h=>{
  const c=h.querySelector('.hoja-cuerpo'),u=c.lastElementChild;
  return Math.round(c.getBoundingClientRect().bottom-u.getBoundingClientRect().bottom);}));
```

Criterios para aprobar:
- **0 hojas desbordadas.**
- **Espacio libre menor que un cuadro (≈19 px) en cada hoja**, salvo la última
  de cada documento.
- **Ningún error de JavaScript.**
- **Revisión visual con capturas** (`hoja.screenshot()`) de unas cuantas
  hojas: títulos huérfanos, columnas desparejas, figuras diminutas.

---

## Resumen en una línea

**Hojas de tamaño fijo + bloques indivisibles + medir a tamaño real con las
fuentes ya cargadas + cuadrículas elásticas que llenan lo que sobra + CSS de
impresión con `@page` sin márgenes, hoja de 1055 px y sin salto después de la
última.**
