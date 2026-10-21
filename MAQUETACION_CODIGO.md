# Código completo de maquetación (ChromaNom → IoNom)

Si IoNom sigue mostrando **hojas en blanco** o **espacios muy grandes**,
compare su código con este, pieza por pieza. Todo lo de aquí está copiado del
generador de `docente.html` de ChromaNom, que no tiene esos problemas, y
reunido en una **plantilla que funciona sola**.

La plantilla se probó con Playwright: 4 hojas dan un PDF de 4 páginas, sin
páginas en blanco, y cada hoja queda llena hasta el pie (como mucho 20 px
libres).

Contenido:
1. Diagnóstico rápido: la causa de cada síntoma.
2. Plantilla completa (HTML + CSS + JS), lista para copiar y probar.
3. Explicación de cada pieza.
4. Prueba automática que cuenta las páginas del PDF.
5. Cómo adaptar la plantilla a IoNom.

---

## 1. Diagnóstico rápido

### Hojas en blanco al imprimir

| Síntoma | Causa más probable | Arreglo |
|---|---|---|
| Una hoja en blanco **después de cada hoja** | La hoja mide 1056 px más los márgenes del navegador, o el redondeo pasa 1 px de la página. | `@page hoja{size:letter;margin:0}`, `.hoja{page:hoja}` y, al imprimir, `height:1055px` (1 px menos). |
| Una hoja en blanco **al final** | `break-after:page` también en la última hoja. | `.hoja:last-child{break-after:auto}`. |
| Hojas en blanco **intercaladas** o contenido partido entre dos páginas | Al imprimir sigue visible algo además de las hojas (formulario, menú, avisos, pie del sitio) o hay `margin`/`padding` alrededor de `#vista`. | En `@media print` ocultar **todo** lo que no sea `#vista` y poner en cero márgenes y rellenos de `body` y de los contenedores. |
| La hoja impresa sale **más pequeña o desplazada** | El `zoom` o `transform` de la vista previa sigue activo al imprimir. | `@media print{#vista{zoom:1!important;transform:none!important}}`. |
| El navegador **agrega** encabezado y pie (fecha, URL) | Opción del navegador. | Con `@page{margin:0}` casi siempre desaparecen; si no, desmarcar «Encabezados y pies de página» al imprimir. |

### Espacios grandes

| Síntoma | Causa más probable | Arreglo |
|---|---|---|
| Huecos grandes al final de las hojas | Los espacios de respuesta tienen alto fijo. | Cuadrículas elásticas: `llenarHoja` reparte el espacio libre (sección 3.5). |
| Hoja casi vacía con un solo ejercicio | Un bloque enorme no cupo y saltó solo. | Bloques más pequeños: un ejercicio por bloque, no una sección entera. |
| Título solo al pie de una hoja y su contenido en la siguiente | El título es un bloque aparte. | Pegar el título al **primer** bloque de su sección. |
| Media hoja vacía en preguntas de selección múltiple | Van en una sola columna. | Doble columna con `.cols2` (sección 3.4). |
| Filas con medio espacio vacío | Ejercicios angostos uno por fila. | Ejercicios angostos de a dos (`.fila2`); los anchos, en fila completa. |
| En pantalla parece desbordar 2–9 px | El `zoom` de la vista previa redondea distinto. | No es real: medir con zoom 1 (en `#medidor`). Al imprimir no pasa. |
| Al imprimir **sí** se corta texto al final | Se midió antes de cargar las fuentes web. | `document.fonts.load(...)` de **cada** fuente y peso **antes** de paginar (sección 3.6). |
| Imágenes o SVG que crecen después | No tenían ancho y alto al insertarse. | Darles `width` y `height` explícitos antes de medir. |

### Reglas de oro

1. Las hojas las arma **usted**, no el navegador. Nunca se imprime un
   documento largo esperando que el navegador lo corte bien.
2. **Hoja = 816 × 1056 px** con `overflow:hidden`. El cuerpo es
   `flex:1; min-height:0`.
3. **Medir** en un contenedor oculto con tamaño real (`visibility:hidden`,
   no `display:none`), con las fuentes ya cargadas y sin zoom.
4. **Bloques indivisibles**, con el título pegado al primero.
5. **Llenar** lo que sobra con cuadrícula elástica.
6. **Imprimir** solo las hojas: `@page` sin márgenes, 1055 px, sin salto
   después de la última.

---

## 2. Plantilla completa

Guárdela como `plantilla.html` y ábrala en el navegador. Arma un taller y
una evaluación de ejemplo, y el botón imprime. Para IoNom solo hay que
cambiar `documentosDeEjemplo()` por los documentos reales (sección 5).

```html
<!doctype html>
<html lang="es">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Plantilla de maquetación</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=STIX+Two+Text:ital,wght@0,400;0,600;0,700;1,400&family=Outfit:wght@400;700&display=swap" rel="stylesheet">
<style>
/* ═══ 1. Pantalla: formulario + vista previa ═══ */
body{margin:0;background:#eef3f8;font-family:'Outfit',Arial,sans-serif}
.barra{padding:12px 16px;display:flex;gap:8px;flex-wrap:wrap}
#vista-wrap{padding:0 16px 24px;min-width:0}
#vista{transform-origin:top left}
/* El medidor: fuera de la pantalla, invisible, pero CON tamaño real.
   (display:none no sirve: no mide nada.) */
#medidor{position:absolute;left:-12000px;top:0;visibility:hidden}

/* ═══ 2. La hoja tamaño carta: 816×1056 px = 8,5×11 in a 96 dpi ═══ */
.hoja{width:816px;height:1056px;box-sizing:border-box;padding:38px 46px 30px;
  margin:0 auto 18px;background:#fff;color:#111;box-shadow:0 2px 14px rgba(13,34,51,.18);
  display:flex;flex-direction:column;overflow:hidden;position:relative;
  font-family:'STIX Two Text','Times New Roman',serif;font-size:13.5px;line-height:1.42}
.hoja *{box-sizing:border-box}
.hoja-cab{font:10px 'Outfit',sans-serif;color:#555;border-bottom:1px solid #bbb;padding-bottom:4px;margin-bottom:10px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.hoja-cuerpo{flex:1;min-height:0;overflow:hidden}      /* el espacio útil exacto */
.hoja-pie{display:flex;justify-content:space-between;font:9.5px 'Outfit',sans-serif;color:#555;border-top:1px solid #bbb;padding-top:4px;margin-top:6px}
.hoja-pie .pie-n{font-weight:800;color:#111}
.hoja .blq{padding:0 0 7px}                            /* separación entre bloques (va DENTRO del bloque) */
.hoja p{margin:0 0 4px}
.hoja h3,.hoja h4{margin:6px 0 4px}

/* ═══ 3. Cuadrícula de cuaderno (5 mm ≈ 18,9 px) ═══ */
.hoja .cuad{border:1px solid #8fb1d6;border-radius:3px;margin-top:4px;background-color:#fff;
  background-image:linear-gradient(#cddff2 1px,transparent 1px),linear-gradient(90deg,#cddff2 1px,transparent 1px);
  background-size:18.9px 18.9px;background-position:-1px -1px;
  -webkit-print-color-adjust:exact;print-color-adjust:exact}
.hoja .notas-tit{font:700 11px 'Outfit',sans-serif;color:#4a5f73;text-transform:uppercase;letter-spacing:.06em;margin-top:4px}

/* ═══ 4. Ejercicios: tarjeta, filas de dos, doble columna ═══ */
.hoja .ej{position:relative;border:1px solid #aaa;border-radius:8px;padding:6px 8px 6px 30px;min-width:0}
.hoja .ej .num{position:absolute;left:8px;top:5px;font-weight:800;font-size:12px}
.hoja .fila2{display:grid;grid-template-columns:1fr 1fr;gap:8px}
.hoja .cols2{column-count:2;column-gap:20px;column-rule:1px solid #ddd}
.hoja .cols2>.blq{break-inside:avoid;-webkit-column-break-inside:avoid;page-break-inside:avoid;display:inline-block;width:100%}
.hoja .ops{list-style:none;margin:2px 0 0;padding:0}

/* ═══ 5. Impresión: SOLO las hojas, sin márgenes del navegador ═══ */
@page hoja{size:letter;margin:0}
@media print{
  .barra,.no-print{display:none!important}
  body{background:#fff!important;margin:0}
  #vista-wrap{padding:0!important}
  #vista{zoom:1!important;transform:none!important}
  .hoja{page:hoja;box-shadow:none;margin:0;break-after:page;page-break-after:always;height:1055px}
  .hoja:last-child{break-after:auto;page-break-after:auto}
  .hoja *{-webkit-print-color-adjust:exact;print-color-adjust:exact}
}
</style>
</head>
<body>
<div class="barra no-print">
  <button id="btn-generar">Generar</button>
  <button id="btn-imprimir">Imprimir / Guardar PDF</button>
</div>
<div id="vista-wrap">
  <div id="vista"></div>
  <div id="medidor" aria-hidden="true"></div>
</div>
<script>
(function(){
'use strict';
var $=function(id){return document.getElementById(id);};
var esc=function(s){return String(s==null?'':s).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c];});};

/* ── Cuadrícula ─────────────────────────────────────────────────────── */
var CUADRO=18.9;                                   // 5 mm a 96 dpi
function cuad(n,cls){return '<div class="cuad'+(cls?' '+cls:'')+'" style="height:'+(n*CUADRO).toFixed(1)+'px"></div>';}

/* ── Bloques de ejemplo (en IoNom: los ejercicios reales) ─────────────
   Un bloque = lo que NUNCA se parte entre hojas. El título de una sección
   va pegado a su primer bloque (así no queda huérfano al pie de una hoja). */
function ejercicio(n,txt,min){return '<div class="ej"><span class="num">'+n+'</span>'+esc(txt)+cuad(min||3)+'</div>';}
function pregunta(n,txt,ops){return '<div class="sq"><p><b>'+n+'.</b> '+esc(txt)+'</p><ol class="ops">'+ops.map(function(o,i){return '<li>'+'ABCD'[i]+') '+esc(o)+'</li>';}).join('')+'</ol></div>';}

function documentosDeEjemplo(){
  var taller=[],n=1;
  for(var i=0;i<14;i+=2){
    taller.push((i===0?'<h4>Nombrar</h4>':'')+'<div class="fila2">'+ejercicio(n++,'Escribe el nombre de Fe₂O₃')+ejercicio(n++,'Escribe el nombre de H₂SO₄')+'</div>');
  }
  for(var j=0;j<6;j++)taller.push((j===0?'<h4>Formular</h4>':'')+ejercicio(n++,'Escribe la fórmula del sulfato de cobre (II).',4));
  var ev=['<p><b>Instrucciones.</b> Marca una sola opción.</p>'];
  for(var k=1;k<=14;k++)ev.push(pregunta(k,'¿Cuál es el nombre del compuesto Na₂CO₃ según la nomenclatura stock?',['Carbonato de sodio','Carbonito de sodio','Bicarbonato de sodio','Óxido de sodio']));
  return [
    {clase:'taller',etiqueta:'Taller',cab:'Taller · Óxidos y sales',primera:'<h2>Taller de ejercicios</h2><p>Nombre: ______________________ Curso: _____</p>',bloques:taller},
    {clase:'eval',etiqueta:'Evaluación',cab:'Evaluación · Óxidos y sales',primera:'<h2>Evaluación</h2><p>Nombre: ______________________ Curso: _____</p>',bloques:ev}
  ];
}

/* ── Paginación ─────────────────────────────────────────────────────── */
function paginar(doc,medidor){
  var hojas=[];
  function nueva(){
    var h=document.createElement('div');h.className='hoja hoja-'+doc.clase;
    h.innerHTML='<div class="hoja-cab">'+doc.cab+'</div><div class="hoja-cuerpo"></div><div class="hoja-pie"><span class="pie-n"></span><span>IoNom</span></div>';
    medidor.appendChild(h);hojas.push(h);return h.querySelector('.hoja-cuerpo');
  }
  var cuerpo=nueva();
  if(doc.primera)cuerpo.parentNode.querySelector('.hoja-cab').style.display='none';   // 1.ª hoja: encabezado grande
  // Preguntas de selección múltiple a doble columna: un contenedor .cols2 por hoja.
  function contenedorCols(){
    var u=cuerpo.lastElementChild;
    if(u&&u.classList.contains('cols2'))return u;
    var c=document.createElement('div');c.className='blq cols2';cuerpo.appendChild(c);return c;
  }
  doc.bloques.forEach(function(html,i){
    var w=document.createElement('div');w.className='blq';
    w.innerHTML=(i===0&&doc.primera?doc.primera:'')+html;            // el encabezado grande va pegado al 1.er bloque
    var enCols=!(i===0&&doc.primera)&&/^<div class="sq"/.test(html);
    var dest=enCols?contenedorCols():cuerpo;
    dest.appendChild(w);
    // ¿Se pasó? Se quita y se lleva a una hoja nueva. (Si es lo único de la
    // hoja, se queda: así no hay ciclo infinito con un bloque gigante.)
    if(cuerpo.scrollHeight>cuerpo.clientHeight+1&&(cuerpo.children.length>1||dest.children.length>1)){
      dest.removeChild(w);
      if(enCols&&!dest.children.length)cuerpo.removeChild(dest);
      cuerpo=nueva();
      (enCols?contenedorCols():cuerpo).appendChild(w);
    }
  });
  hojas.forEach(function(h){llenarHoja(h,doc.clase);});
  hojas.forEach(function(h,i){h.querySelector('.pie-n').textContent=doc.etiqueta+' — página '+(i+1)+' de '+hojas.length;});
  return hojas;
}

/* ── Llenar el espacio libre de cada hoja ──────────────────────────── */
function llenarHoja(h,clase){
  var c=h.querySelector('.hoja-cuerpo');
  function libre(){var u=c.lastElementChild;if(!u)return c.clientHeight;return c.getBoundingClientRect().bottom-u.getBoundingClientRect().bottom-3;}
  var areas=[].slice.call(c.querySelectorAll('.cuad'));
  // a) Hoja sin cuadrículas (lectura, selección múltiple): bloque de notas al final.
  if(!areas.length){
    var n=Math.floor((libre()-30)/CUADRO);       // 30 px ≈ título «Notas» + márgenes
    if(n<2)return;
    var w=document.createElement('div');w.className='blq';
    w.innerHTML='<div class="notas-tit">'+(clase==='eval'?'Borrador (no se califica)':'Notas')+'</div>'+cuad(n,'notas');
    c.appendChild(w);
    while(c.scrollHeight>c.clientHeight+1&&n>2){n--;w.querySelector('.cuad').style.height=(n*CUADRO).toFixed(1)+'px';}
    return;
  }
  // b) Agrupar cuadrículas por fila (las que están lado a lado crecen juntas).
  var filas=[];
  areas.forEach(function(a){var t=Math.round(a.getBoundingClientRect().top);var f=null;filas.forEach(function(x){if(Math.abs(x.t-t)<8)f=x;});if(f)f.a.push(a);else filas.push({t:t,a:[a]});});
  // c) Repartir el espacio libre un cuadro a la vez, en ronda, con tope de 26 cuadros.
  var pasos=Math.floor(libre()/CUADRO),k=0,hechos=[];
  while(pasos>0&&k<400){
    var f=filas[k%filas.length];k++;
    if(parseFloat(f.a[0].style.height)>=26*CUADRO)continue;
    f.a.forEach(function(a){a.style.height=(parseFloat(a.style.height)+CUADRO).toFixed(1)+'px';});
    hechos.push(f);pasos--;
  }
  // d) Si se pasó, devolver cuadros.
  while(c.scrollHeight>c.clientHeight+1&&hechos.length){
    var g=hechos.pop();g.a.forEach(function(a){a.style.height=(parseFloat(a.style.height)-CUADRO).toFixed(1)+'px';});
  }
  // e) Si la hoja ya venía desbordada (un bloque gigante), encoger hasta 2 cuadros.
  var guard=0;
  while(c.scrollHeight>c.clientHeight+1&&guard++<200){
    var mayor=null;filas.forEach(function(x){var hh=parseFloat(x.a[0].style.height);if(hh>2.5*CUADRO&&(!mayor||hh>parseFloat(mayor.a[0].style.height)))mayor=x;});
    if(!mayor)break;
    mayor.a.forEach(function(a){a.style.height=(parseFloat(a.style.height)-CUADRO).toFixed(1)+'px';});
  }
}

/* ── Generar: fuentes primero, luego medir, luego mostrar ───────────── */
function cargarFuentes(){
  if(!document.fonts||!document.fonts.load)return Promise.resolve();
  // TODAS las combinaciones de fuente/peso/estilo que use la hoja.
  return Promise.all(['400 13.5px "STIX Two Text"','700 13.5px "STIX Two Text"','italic 400 13.5px "STIX Two Text"','600 13.5px "STIX Two Text"','400 12px "Outfit"','700 12px "Outfit"']
    .map(function(f){return document.fonts.load(f).catch(function(){});})).then(function(){return document.fonts.ready;});
}
function generar(){
  return cargarFuentes().then(function(){
    var medidor=$('medidor'),vista=$('vista');medidor.innerHTML='';vista.innerHTML='';
    documentosDeEjemplo().forEach(function(doc){paginar(doc,medidor).forEach(function(h){vista.appendChild(h);});});
    medidor.innerHTML='';
    ajustarZoom();
  });
}
// Zoom SOLO para la vista previa en pantalla (al imprimir se fuerza zoom:1).
function ajustarZoom(){var v=$('vista');v.style.zoom=Math.min(1,v.parentNode.clientWidth/820).toFixed(3);}
function imprimir(){if(!$('vista').children.length){generar().then(function(){window.print();});return;}window.print();}

$('btn-generar').addEventListener('click',generar);
$('btn-imprimir').addEventListener('click',imprimir);
window.addEventListener('resize',ajustarZoom);
generar();
})();
</script>
</body>
</html>
```

---

## 3. Explicación de cada pieza

### 3.1 La hoja (CSS)

```css
.hoja{width:816px;height:1056px;box-sizing:border-box;padding:38px 46px 30px;
  display:flex;flex-direction:column;overflow:hidden}
.hoja-cuerpo{flex:1;min-height:0;overflow:hidden}
```

- 816 × 1056 px es una hoja carta (8,5 × 11 pulgadas) a 96 dpi. Para A4 use
  794 × 1123 px y `size:A4`.
- Los **márgenes de impresión son el `padding` de la hoja**, no los del
  navegador (que se ponen en 0).
- `min-height:0` es indispensable. Sin él, el cuerpo de un contenedor flex
  crece con su contenido, `scrollHeight` nunca supera a `clientHeight` y la
  paginación no detecta nada.
- La separación entre bloques va **dentro** del bloque (`.blq{padding-bottom}`),
  nunca como `margin` externo. Los márgenes externos se «escapan» de la
  medición.

### 3.2 El medidor

```css
#medidor{position:absolute;left:-12000px;top:0;visibility:hidden}
```

Las hojas se arman primero aquí, a tamaño real y sin zoom, y cuando están
listas se pasan a `#vista`.

### 3.3 `paginar(doc, medidor)`

`doc` = `{clase, etiqueta, cab, primera, bloques:[html,…]}`.

1. Agrega cada bloque a la hoja actual.
2. Si `cuerpo.scrollHeight > cuerpo.clientHeight + 1`, lo quita, abre una
   hoja nueva y lo pone allí.
3. Si el bloque es **lo único** de la hoja, se queda aunque no quepa. Así no
   hay ciclo infinito; `llenarHoja` luego encoge sus cuadrículas.
4. Al final llama a `llenarHoja` en cada hoja y numera «página X de N».

### 3.4 Doble columna

Las preguntas de selección múltiple (HTML que empieza por `<div class="sq"`)
van dentro de un `.cols2` (`column-count:2`) **por hoja**. Si la pregunta no
cabe, la hoja nueva abre su propio `.cols2`.

Cada pregunta lleva `break-inside:avoid` y `display:inline-block;width:100%`.
Sin eso, una pregunta se parte entre las dos columnas.

### 3.5 `llenarHoja(h, clase)`: cero huecos

- Los espacios de respuesta son `.cuad` con alto múltiplo de `CUADRO`
  (18,9 px ≈ 5 mm) y empiezan en su **mínimo** (3 o 4 cuadros).
- Mide el espacio libre entre el último bloque y el pie.
- Agrupa las cuadrículas por **fila** (las que están lado a lado crecen
  juntas).
- Reparte **un cuadro a la vez, en ronda**, con tope de 26 cuadros.
- Si se pasó, devuelve cuadros.
- Si la hoja no tiene cuadrículas, agrega «Notas» o «Borrador» del alto que
  sobra (mínimo 2 cuadros).

### 3.6 Fuentes antes de medir

```js
document.fonts.load('400 13.5px "STIX Two Text"')  // una línea por cada peso/estilo usado
```

Las fuentes de Google se descargan **solo cuando se usan**. Si se mide
antes, se mide con Times o Arial, y al llegar la fuente el texto crece y la
hoja desborda: se corta texto o salta una hoja. Hay que cargar **cada
combinación** (normal, negrita, cursiva, seminegrita) de **cada** familia
que use la hoja.

### 3.7 Impresión

```css
@page hoja{size:letter;margin:0}
@media print{
  .barra,.no-print{display:none!important}        /* TODO lo que no sea #vista */
  body{background:#fff!important;margin:0}
  #vista-wrap{padding:0!important}
  #vista{zoom:1!important;transform:none!important}
  .hoja{page:hoja;box-shadow:none;margin:0;break-after:page;page-break-after:always;height:1055px}
  .hoja:last-child{break-after:auto;page-break-after:auto}
  .hoja *{-webkit-print-color-adjust:exact;print-color-adjust:exact}
}
```

En ChromaNom, además, al imprimir se ocultan menú, encabezado de la página,
pestañas, formulario, avisos y pie del sitio:

```css
body.tab-gen .site-nav, body.tab-gen .cn-page-head, body.tab-gen .tabs,
body.tab-gen #gen-form, body.tab-gen #vista-info, body.tab-gen .site-footer,
body.tab-gen #panel-ori, body.tab-gen .vista-vacia, body.tab-gen #cn-mol-bg{display:none!important}
body.tab-gen{display:block;background:#fff!important}
body.tab-gen .app{padding:0!important;margin:0!important;max-width:none!important}
body.tab-gen .gen-grid{display:block}       /* la rejilla formulario|vista pasa a bloque */
```

**Ojo con las rejillas y los flex del diseño de pantalla.** Si `#vista` vive
dentro de un `grid` o `flex` con columna lateral, al imprimir hay que
volverlo `display:block`. Si no, las hojas quedan desplazadas o partidas.

### 3.8 Ejercicios de dos en dos (ChromaNom)

```js
// Figuras angostas: dos por fila. Las anchas (cadenas largas): fila completa.
var anchos=items.filter(x=>x._ancho), medios=items.filter(x=>!x._ancho);
for(var i=0;i<medios.length;i+=2){
  var fila='<div class="fila2">'+htmlEjercicio(medios[i],num++)+(medios[i+1]?htmlEjercicio(medios[i+1],num++):'')+'</div>';
  out.push((primero?titulo:'')+fila); primero=false;   // título pegado a la 1.ª fila
}
anchos.forEach(it=>{out.push((primero?titulo:'')+htmlEjercicio(it,num++));primero=false;});
```

---

## 4. Prueba automática (cuenta las páginas del PDF)

```js
// prueba-maquetacion.js — correr con:  node prueba-maquetacion.js
// Requiere Playwright (npm i -D playwright) y la página servida por HTTP
// (python3 -m http.server 8765) o abierta como archivo si no carga bancos.
const {chromium}=require('playwright');
(async()=>{
  const b=await chromium.launch();
  const p=await b.newPage({viewport:{width:1000,height:900}});
  const errores=[];p.on('pageerror',e=>errores.push(e.message));
  await p.goto('http://localhost:8765/plantilla.html');   // ← su página
  await p.waitForTimeout(3000);                            // bancos y fuentes
  // (si su página necesita marcar opciones y pulsar «Generar», hágalo aquí)
  await p.evaluate(()=>document.getElementById('vista').style.zoom='1');  // medir SIN el zoom de la vista previa
  const hojas=await p.evaluate(()=>[...document.querySelectorAll('#vista .hoja')].map(h=>{
    const c=h.querySelector('.hoja-cuerpo'),u=c.lastElementChild;
    return {pie:h.querySelector('.pie-n').textContent,
            libre:u?Math.round(c.getBoundingClientRect().bottom-u.getBoundingClientRect().bottom):c.clientHeight,
            desborde:c.scrollHeight>c.clientHeight+1};
  }));
  hojas.forEach(h=>console.log(h.pie,'· libre',h.libre,'px',h.desborde?'· ¡DESBORDE!':''));
  // El PDF real: debe tener EXACTAMENTE una página por hoja.
  await p.emulateMedia({media:'print'});
  const pdf=await p.pdf({preferCSSPageSize:true,printBackground:true});
  const paginas=(pdf.toString('latin1').match(/\/Type\s*\/Page[^s]/g)||[]).length;
  require('fs').writeFileSync('prueba.pdf',pdf);
  console.log('Hojas:',hojas.length,'· Páginas del PDF:',paginas,paginas===hojas.length?'✅':'❌ hay hojas en blanco o partidas');
  console.log('Hojas con más de 40 px libres (sin contar la última de cada documento):',
    hojas.filter((h,i)=>h.libre>40&&!/página (\d+) de \1$/.test(h.pie)).length);
  console.log('Errores JS:',errores);
  await b.close();
})();
```

Criterios para dar por bueno:
- **Páginas del PDF = número de hojas.** Si hay más páginas, hay hojas en
  blanco o partidas: revise la tabla de la sección 1.
- **0 desbordes.**
- **Menos de 40 px libres** en cada hoja (un cuadro más el título de
  «Notas»), salvo la última de cada documento.
- **Sin errores de JavaScript.**

Abra también `prueba.pdf` y mírelo: títulos huérfanos, columnas desparejas
y figuras diminutas no se ven en los números.

---

## 5. Adaptar la plantilla a IoNom

1. Reemplace `documentosDeEjemplo()` por la función que arma los documentos
   reales. Cada documento es
   `{clase:'taller'|'eval'|…, etiqueta:'Taller', cab:'encabezado corto', primera:'encabezado grande + nombre del estudiante', bloques:[…]}`.
2. Cada **bloque** debe ser un ejercicio o una pregunta completa, con su
   cuadrícula `cuad(n)` (n = mínimo de cuadros). El título de cada sección
   se concatena al primer bloque.
3. Las preguntas de selección múltiple deben empezar exactamente por
   `<div class="sq"` para ir a doble columna.
4. Agregue a `cargarFuentes()` **todas** las fuentes y pesos que usen las
   hojas de IoNom.
5. En `@media print`, oculte **todo** lo demás de la página de IoNom (menú,
   formulario, avisos, pie, fondos decorativos) y neutralice sus `grid`,
   `flex`, `margin` y `padding`.
6. Pase la prueba de la sección 4 con varios temas y varias versiones.
