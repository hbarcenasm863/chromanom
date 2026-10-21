# Lógica de `docente.html` (ChromaNom): cómo replicarla en IoNom

Este documento explica cómo funciona el **generador de guías, talleres y
evaluaciones** de ChromaNom (`docente.html`). Sirve para construir algo
equivalente en otro sitio (por ejemplo, IoNom). No depende de ningún
servidor: es HTML + JavaScript estático, servido por GitHub Pages, y funciona
sin conexión gracias al service worker.

---

## 1. Idea general

El docente marca en un formulario:

- los **temas**,
- el **tipo de documento** (guía completa, solo taller, solo evaluación),
- los **tipos de ejercicio** y cuántos,
- cuántas **preguntas tipo Saber 11** y cuántas **abiertas**,
- el **número de versiones** (para evitar copia),
- los datos del encabezado (colegio, docente, curso, fecha…).

Con eso la página arma uno o varios documentos en hojas **tamaño carta**,
listas para *Imprimir / Guardar PDF*. Todo se arma en el navegador.

Principios que guían el diseño:

1. **No copiar bancos.** Los ejercicios se leen en vivo de las otras páginas
   del sitio (el juego y el generador antiguo). Si se agrega una molécula o
   un tema al juego, el docente la usa sin tocar nada.
2. **Separar contenido de lógica.** Todo el texto escrito a mano (lecturas,
   preguntas Saber, preguntas abiertas) vive en un archivo de datos; la
   lógica, en otro.
3. **Azar con semilla.** Las versiones son reproducibles: la misma
   configuración da siempre el mismo documento.
4. **Sin clave de respuestas impresa** (decisión pedagógica: los estudiantes
   también entran a la página).
5. **Hojas llenas.** Los espacios de respuesta (cuadrícula tipo cuaderno) se
   estiran para ocupar el espacio libre de cada hoja; nada de huecos grandes.

---

## 2. Archivos

| Archivo | Qué contiene |
|---|---|
| `docente.html` | Formulario, pestaña de orientaciones para el docente, estilos de pantalla y de impresión (`.hoja`), rúbricas (se reutilizan como anexo). |
| `docente-datos.js` | **Solo contenido**: `TEMAS`, `SABER`, `ABIERTAS` (y la alineación curricular de referencia). Expone `window.DOCENTE_DATOS`. |
| `docente-app.js` | **Solo lógica**: carga de bancos, selección, armado de bloques HTML, paginación, impresión. |
| `generador.html`, `juego.html` | Fuentes de ejercicios y de las funciones de dibujo (se leen, no se copian). |
| `sw.js` | Service worker; hay que subir la versión de caché en cada cambio. |

---

## 3. Carga de bancos (sin copiar datos)

`docente-app.js` crea dos **iframes ocultos** (mismo dominio) con
`generador.html` y `juego.html`. Cuando cargan, lee sus variables globales
con `iframe.contentWindow.eval('NOMBRE')`:

- Del generador: lista de moléculas (`MOLS`: nombre, tema, partes MDEC),
  banco de reacciones (`BANCO_RXN`) y funciones de dibujo (`getSVG`,
  `mkDevSVG`, `_parseChainStr`, `buildTipoDCard`).
- Del juego: todos los arreglos globales en MAYÚSCULAS cuyos elementos tienen
  `type` y `topic` (se descubren con una expresión regular sobre el HTML), más
  sus funciones de dibujo y las etiquetas de los niveles.

Todo queda en un objeto `B` con un `estado` por banco (`cargando / ok /
error`), que se muestra al docente («✅ Juego: 1338 preguntas»).

**Para IoNom:** si el sitio ya tiene un juego y un generador con bancos en
variables globales, se puede hacer exactamente igual. Si no, basta con poner
los bancos en un `.js` compartido y cargarlo con `<script>`.

---

## 4. Archivo de datos (`docente-datos.js`)

### 4.1 `TEMAS` — un objeto por tema

```js
{id:'alcoholes', titulo:'Alcoholes, fenoles y éteres', corto:'Alcoholes, fenoles y éteres',
 gen:['alcoholes','eteres'],          // temas del generador que alimentan los ejercicios
 jue:/^alcoholes$|^eteres$|fenol/i,   // temas del juego que se suman (regex)
 rxn:['alcoholes','eteres'],          // temas del banco de reacciones
 previos:{curiosos:[…], contexto:[{amb:'Local|Nacional|Global', t:'…'}], cotidianos:[…], activacion:[…]},
 info:{lectura:[…párrafos…], esquema:{raiz:'…', ramas:[{t:'…', items:[…]}]}},
 ejemplo:{f:'CH₃−CH(OH)−…', partes:[['4-metil','r','metilo en C4'], …]},
 propia:[]}                           // práctica propia si los bancos no cubren el tema
```

- `previos` = **Sesión 1** (aprendizajes previos: ¿sabías que…?, química en
  contexto local/nacional/global, vida diaria, preguntas de activación).
- `info` = **Sesión 2** (lectura corta, mapa de ideas, ejemplo resuelto).
- Los temas del juego que no coinciden con ningún `jue` aparecen solos como
  temas extra («solo taller»).

### 4.2 `SABER` — preguntas tipo Saber 11

```js
{c:'uso|exp|ind', k:'Q|CTS', ctx:'contexto…', q:'pregunta…', o:['CORRECTA','d1','d2','d3'], f:'fórmula opcional'}
```

- **Convención clave:** la **primera** opción siempre es la correcta. Al
  imprimir se barajan, así que el archivo se puede revisar fácil y el
  documento no delata la respuesta.
- `c` y `k` (competencia y componente) se guardan para el banco, pero **no se
  imprimen** (decisión del docente).
- Reglas de calidad que aplicamos en la auditoría:
  - un solo nombre/respuesta defendible (cuidado con nombres alternativos
    aceptados por IUPAC, que no pueden ser distractores);
  - la correcta no puede ser notablemente más larga que los distractores;
  - distractores plausibles (errores típicos de estudiantes), no absurdos;
  - el contexto no puede dar la respuesta;
  - no evaluar nada que la lectura de la guía no haya enseñado;
  - datos numéricos verificados.

### 4.3 `ABIERTAS` — preguntas abiertas por tema

```js
{t:'rx',   q:'CH₃−CH₂−OH + HBr → ? Escribe y nombra el producto.'}
{t:'nom',  q:'Escribe el nombre IUPAC del compuesto.', f:'CH₃−CH₂−CH(OH)−…'}
{t:'mdec', n:'2-metilbutan-2-ol'}   // el estudiante separa el nombre en sus 4 partes
```

Se eligen **en ronda** entre los tres tipos (reacción → nomenclatura → MDEC)
para que no salgan todas iguales. Reglas: no repetir el ejemplo resuelto de
la guía y que dos preguntas de la misma evaluación no se den la respuesta.

---

## 5. Del formulario al documento

```
generar()
 ├─ leerForm()                → objeto F con todo lo que marcó el docente
 ├─ precarga de fuentes       → document.fonts.load(...) ANTES de medir
 ├─ construirTodas(F)         → lista de documentos {clase, etiqueta, cab, primera, bloques[]}
 │    └─ construirVersion(F, i, N)
 └─ paginar(doc) + llenarHoja → hojas .hoja de 816×1056 px (carta a 96 dpi)
```

### 5.1 Semilla y versiones

```js
semilla = [variante, númeroDeVersión, tipoDoc, idsDeTemas].join('|')
rng(semilla+'|ej'), rng(semilla+'|saber'), rng(semilla+'|abiertas')
```

`rng` es un generador pseudoaleatorio (hash FNV + mulberry32). `barajar` es
Fisher-Yates con ese `rng`. Cambiar el campo «variante» da otra serie.

- **Guía completa** con N versiones: la guía (sesiones 1–3) sale **una vez**;
  la evaluación sale **N veces** (hojas aparte), cada una con otro orden de
  preguntas y de opciones.
- **Taller** o **evaluación** sueltos: salen N veces completos.
- Cada hoja dice «Versión X de N» cuando hay más de una.
- El anexo de rúbricas sale una sola vez, al final.

### 5.2 Selección de ejercicios

1. `poolEjercicios(temas)` arma una cola por tipo de ejercicio
   (A nombrar, B dibujar, C análisis por partes, D reacciones, X cazar
   errores, E abiertos), **sin repetidos** (se compara el nombre normalizado;
   en reacciones, mismo reactivo + mismo producto).
2. Se filtran contenidos de nivel universitario (lista negra de categorías).
3. Cada cola se baraja y luego se **alterna por subtema** (por ejemplo,
   alcohol / éter / fenol), para no cargar la selección a uno solo.
4. `elegirEjercicios` reparte el total pedido **en ronda** entre los tipos
   marcados.
5. Si no alcanza, avisa: «Solo hay 8 ejercicios disponibles…».

### 5.3 Estructura de la guía (4 sesiones)

1. **Aprendizajes previos** (sesión 1).
2. **Información** (sesión 2).
3. **Trabajo práctico** (sesión 3): los ejercicios elegidos.
4. **Evaluación**: autoevaluación («Puedo… / Lo logro / Con ayuda / Aún no»)
   y la evaluación en **hojas aparte**.

La evaluación lleva:
- instrucciones (dependen de si hay hoja de respuestas);
- preguntas Saber a **doble columna**;
- preguntas abiertas con cuadrícula;
- hoja de respuestas de burbujas (opcional);
- anexo de rúbricas (opcional; si hay abiertas se agrega la de reacciones).

### 5.4 Bloques

Todo documento es una lista de **bloques HTML** (strings). Un bloque es la
unidad que no se parte entre hojas (un ejercicio, una pregunta, un párrafo).
Las preguntas Saber empiezan por `<div class="sq"` y eso le indica al
paginador que van en el contenedor de doble columna.

---

## 6. Paginación (lo más delicado)

```js
paginar(doc, medidor):
  crea una hoja vacía dentro de #medidor (fuera de pantalla, visibility:hidden, tamaño real)
  para cada bloque:
     lo agrega a la hoja actual (o al contenedor .cols2 si es pregunta Saber)
     si cuerpo.scrollHeight > cuerpo.clientHeight + 1  → lo quita, abre hoja nueva y lo pone allí
  llenarHoja(cada hoja)
  numera: «Evaluación — página 2 de 4»
```

Claves aprendidas a la fuerza:

- **Medir con la letra definitiva.** Las fuentes web se descargan solo
  cuando se usan; si se mide antes, el texto crece después y desborda. Por
  eso `generar()` hace `document.fonts.load()` de cada fuente/peso que usa
  la hoja **antes** de paginar.
- **Medir a tamaño real.** La vista previa en pantalla usa `zoom` para caber
  en la ventana; ese zoom cambia los redondeos y puede mostrar 2–9 px de
  «desborde» que **no existe al imprimir**. Mide siempre en `#medidor` a
  zoom 1, y en las pruebas pon `#vista.style.zoom = 1` antes de medir.
- La primera hoja lleva el encabezado institucional completo; las siguientes,
  un encabezado corto.

### `llenarHoja` (cuadrícula de cuaderno)

- Los espacios de respuesta son `<div class="cuad">` con fondo de cuadrícula
  (CSS `linear-gradient`) y altura múltiplo de `CUADRO = 18.9 px` (≈ 5 mm).
- Después de paginar, en cada hoja se calcula el espacio libre al final y se
  reparte **un cuadro a la vez, en ronda,** entre las filas de cuadrículas de
  esa hoja (las que están lado a lado crecen juntas), con tope de 26 cuadros.
  Si se pasa, se devuelve el último cuadro.
- Si la hoja no tiene cuadrículas, se agrega al final un bloque «Notas» (o
  «Borrador y cálculos (no se califica)» en evaluaciones).

---

## 7. Impresión

- `.hoja { width:816px; height:1056px }` en pantalla; en `@media print`:
  `@page { size: letter; margin: … }`, sin sombras, `break-after: page` en
  cada hoja, `zoom:1`, y se oculta todo lo que no sea `#vista`.
- `print-color-adjust: exact` para que salgan los colores y la cuadrícula.
- Tipografía de libro (STIX Two Text) para el cuerpo; sans-serif para
  rótulos; monoespaciada para reactivos.

---

## 8. Cómo adaptarlo a IoNom (química inorgánica)

| ChromaNom (orgánica) | Equivalente sugerido en IoNom |
|---|---|
| Temas: cadena, alcanos, alcoholes… | Óxidos, hidróxidos, ácidos (hidrácidos y oxácidos), sales, hidruros, iones… |
| Método MDEC (① sustituyentes ② cadena ③ insaturaciones ④ grupo) | Partes del nombre en el sistema que se enseñe: prefijos de cantidad, número de oxidación (stock), raíz + terminación (-uro, -ato, -ito, -ico, -oso)… |
| A Nombrar (estructura → nombre) | Fórmula → nombre (en uno o varios sistemas: sistemática, stock, tradicional) |
| B Dibujar (nombre → estructura) | Nombre → fórmula (con cruce de números de oxidación) |
| D Reacciones | Reacciones de formación: metal + O₂ → óxido; óxido + H₂O → hidróxido/oxácido; ácido + base → sal + agua |
| X Cazar errores | Nombres o fórmulas mal escritos (cargas mal cruzadas, terminación equivocada) |
| Saber 11 | Igual: contexto colombiano + pregunta + 4 opciones, la primera correcta en el archivo |
| Dibujo SVG de moléculas | Basta con texto con subíndices (Fe₂O₃, H₂SO₄); no hace falta motor de dibujo |

Lo que se puede copiar **tal cual**: `rng/barajar`, el esquema de versiones,
`paginar`, `llenarHoja`, la hoja de respuestas, el encabezado institucional,
los estilos `.hoja` y de impresión, la precarga de fuentes, el reparto en
ronda de ejercicios y de preguntas abiertas.

Lo que hay que **escribir nuevo**: `docente-datos.js` (temas, Saber,
abiertas de IoNom) y las funciones que convierten cada ejercicio en HTML.

### Lista de pasos

1. Crear `docente-datos.js` con `TEMAS`, `SABER`, `ABIERTAS` siguiendo los
   formatos de la sección 4.
2. Copiar `docente-app.js` y cambiar: carga de bancos (sección 3), tipos de
   ejercicio (`TIPOS_EJ`, `INSTR`, `htmlEjercicio`) y textos del encabezado
   («Química inorgánica»).
3. Copiar de `docente.html` el formulario, `#medidor`, `#vista` y los estilos
   `.hoja` + `@media print`.
4. Agregar los archivos nuevos al caché de `sw.js` y subir su versión.
5. Probar con Playwright, en un servidor local (no `file://`, porque los
   iframes de los bancos no cargan): generar cada tema × cada tipo de
   documento × varias versiones y comprobar
   - que no haya errores de JavaScript,
   - que ninguna hoja se desborde (a zoom 1),
   - que no salgan ejercicios repetidos ni sin figura/fórmula.
6. Hacer una auditoría química y didáctica del banco con las reglas de la
   sección 4.2.
