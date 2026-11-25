# Instrucciones para Claude en este repositorio

## Regla obligatoria: registrar cada sesión de trabajo en `HISTORIAL_CAMBIOS.md`

Al terminar cada sesión de trabajo en este repositorio — cuando el usuario
se despide, da por cerrado el tema, o la conversación llega a un punto de
cierre natural tras haber hecho cambios — Claude DEBE, sin que se le pida
explícitamente cada vez:

1. Agregar una entrada nueva **arriba de todas las anteriores** en
   `HISTORIAL_CAMBIOS.md` (orden: más reciente primero), con:
   - Fecha de la sesión.
   - Contexto breve: qué pidió el usuario y por qué (el motivo real detrás
     del cambio, no solo "qué se tocó").
   - Cambios concretos realizados, agrupados por archivo o por tema si hay
     varios frentes.
   - Cualquier paso manual pendiente que el cambio requiera (por ejemplo,
     redesplegar `chromanom-analytics.gs` en el editor de Apps Script —
     los cambios a ese archivo NUNCA se aplican solos por estar en el
     repositorio).
   - Cualquier cosa que haya quedado pendiente o sin resolver.
2. Confirmar que los cambios de código y la entrada del historial quedaron
   en la rama `main` (fast-forward o merge desde la rama de trabajo), igual
   que con cualquier otro cambio — este repositorio no usa pull requests
   como flujo normal de trabajo.
3. Hacer commit y push de la entrada del historial junto con los cambios de
   código de la sesión (o en un commit aparte inmediatamente después) — no
   dejarla para la próxima sesión ni esperar a que el usuario la pida.

Esta regla aplica a cualquier sesión que modifique código, configuración o
contenido del repositorio (`juego.html`, `chromanom-analytics.gs`,
`generador.html`, etc.) — no solo a cambios grandes. Si la sesión fue
puramente de consulta (preguntas, explicaciones) sin tocar archivos, no
hace falta registrar nada.

## Push a `main`

El docente estableció (22-11-2026) que hacer **push a `main` está autorizado**
en este repositorio: cuando una tarea queda lista y probada, Claude hace commit y
push a `main` (desde la rama de trabajo, fast-forward) sin volver a preguntar. Si
en una sesión el docente indica otra cosa, se respeta lo que diga en esa sesión.

## Regla: toda auditoría de contenido se hace con agentes expertos

Establecida por el docente (22-11-2026). Cada lote de preguntas, guías, talleres
o contenido nuevo que se agregue a los bancos o a las páginas **se audita con
agentes expertos independientes** (no basta la revisión del mismo autor), uno
por cada categoría que el contenido necesite. Como mínimo:

- **Experto en ciencias naturales** de la disciplina (biología, química orgánica
  o química inorgánica): resuelve cada pregunta a ciegas y verifica datos,
  cálculos, nomenclatura y rigor científico.
- **Experto en evaluación Saber 11 / Icfes**: modelo basado en evidencias,
  competencia y afirmación correctas (`c`, `af`), calidad de ítem y distractores.
- **Experto en currículo MEN**: Estándares Básicos de Competencias y DBA que
  cubre cada pregunta.
- **Experto en datos, tablas y gráficas** (cuando haya): calidad de libro de
  texto, unidades, fuentes o «Datos de ejemplo», y que los datos sustenten la clave.
- Otros expertos según el contenido (didáctica y principios de Mayer, fórmulas
  sin paréntesis, imágenes y licencias, accesibilidad, etc.).

Los agentes reciben el archivo del lote, resuelven a ciegas y entregan una
versión corregida más un informe; Claude aplica el informe completo, regenera
lo que dependa (p. ej. `saber-juego.js`) y deja constancia en el historial de
cuántos agentes participaron y qué hallaron.

## Banco de preguntas del panel docente (22-11-2026)

La pestaña «📚 Banco de preguntas» (`banco-sel.js`, igual en los tres sitios) filtra las
preguntas Saber por grado, DBA (MEN, 2016), estándar básico (MEN, 2004), aprendizaje
priorizado (SED Bogotá, 2025), tema, competencia y afirmación, y deja elegir las que se
usarán: con la selección activa, `SABER_ICFES.elegir` devuelve las elegidas en guías,
talleres y evaluaciones (completa al azar si piden más). `referentes-men.js` (generado) trae
los textos oficiales y ``banco-sel-cfg.js`` (generado) la tabla tema → DBA → estándares y priorizados,
auditada por un agente experto. Cada pregunta hereda sus referentes de su tema. Al agregar un
tema o preguntas, revisar esa tabla; los priorizados de Bogotá se citan sin modificar (licencia
CC BY-NC-ND 4.0).

## Regla: todo contenido se revisa contra `REFERENTES_CURRICULARES.md`

Establecida por el docente (23-11-2026). `REFERENTES_CURRICULARES.md` (el mismo
archivo en BioNom, ChromaNom e IonNom) resume, grado por grado de 6.° a 11.°,
los Estándares Básicos de Competencias (MEN, 2004), los DBA (MEN, 2016) y los
Aprendizajes priorizados (SED Bogotá, 2025) de biología, química y física, más
el modelo basado en evidencias del Icfes (DCE, Marco Saber 11.° 2019).

- **Antes de agregar** preguntas del juego, Saber, abiertas, guías, talleres,
  evaluaciones, crucigramas, sopas, ahorcados, criptogramas, detective o
  laberintos, se pasa la lista de verificación de su sección 7: grado y DBA,
  estándar, priorizado, competencia, vocabulario del grado y rigor.
- **Toda pregunta de opción múltiple se construye con el modelo basado en
  evidencias del Icfes** (sección 6): primero competencia (`c`), afirmación
  (`af`), evidencia del Marco, componente y nivel (1 a 4); después la tarea y el
  ítem, con distractores que nacen de errores concretos.
- Los agentes expertos que auditan cada lote reciben este archivo y verifican
  contra él; el historial deja constancia de lo que encontraron.
- Si se cambia el archivo en un repositorio, se copia igual a los otros dos.

## El método MDEC no se enlaza a DBA ni estándares

Establecido por el docente (26-11-2026). El método MDEC (código de cuatro colores para leer y armar nombres)
es un **modelo propio del docente**: sus ejercicios (abiertas `t:'mdec'`), explicaciones y actividades no se
enlazan a ningún DBA ni estándar. `revision-ref.js` los omite al poner etiquetas; no agregarles `dba` ni `curso`.

## Preguntas MDEC en todo el banco (26-11-2026)

`herramientas/generar-mdec.js` genera `mdec-moleculas.js` desde las moléculas del Generador (`MOLS` de
`generador.html`), con la partición de cada nombre en las cuatro partes del MDEC y, para las que el Juego no
sabe dibujar, el dibujo del Generador. Volver a correrlo si cambian esas moléculas. Con esos datos:
- **Juego** (`juego.html`, bloque «Más preguntas MDEC»): preguntas de arrastrar fragmentos y de reconocer la
  parte, hasta 20 por familia, más selección múltiple MDEC con fichas de colores (hasta 12 por familia).
- **Panel docente**: ejercicio imprimible «Armar el nombre con fichas» (tipo `M` en `docente-app.js`) y
  `mdec-saber.js`, que agrega preguntas MDEC de selección múltiple (`mdec:true`, con `q.html` en colores)
  a evaluaciones, talleres, guías y al «Banco de preguntas» (que las marca «Método MDEC», sin DBA).
- **Los colores del método son lo central**: toda pregunta MDEC nueva lleva sus colores (① cian, ② verde,
  ③ ámbar, ④ rosado); solo se dejan sin color cuando el color daría la respuesta.

## Regla: los colores del MDEC son solo los tonos predefinidos

Establecida por el docente (26-11-2026). Los colores son la parte central del método MDEC y se usan **solo**
los tonos ya definidos en el sitio, sin inventar ni «mejorar» ninguno, en todo lo que muestre partes del
nombre (páginas, juego, panel docente, preguntas, fichas, hojas impresas):

| Parte | Nombre del color | Borde / base | Texto | Fondo claro |
|---|---|---|---|---|
| ① Sustituyentes | turquesa | `#0891b2` | `#0e7490` | `#ecfeff` |
| ② Cadena principal | verde | `#166534` | `#14532d` | `#f0fdf4` |
| ③ Insaturaciones | **dorado** | `#b45309` | `#92400e` | `#fffbeb` (o `#fef3c7`) |
| ④ Grupo funcional | rosa | `#CC79A7` | `#9a4a78` | `#fdf2f8` |

Fuente: `.cn-chip.r/.c/.i/.g` de `chromanom.css` y las variables `--c1…--c4` (`--c1t…`, `--c1b…`) de cada
página. Si se agrega algo nuevo, usar esas clases o variables (o exactamente estos valores). Si algún día se
cambia un tono, se cambia en todo el sitio a la vez. El color nunca se usa en un botón ni para otra cosa que
las cuatro partes del nombre.

## Otras convenciones del repositorio

- El usuario es docente de química (no necesariamente técnico); las
  explicaciones y los mensajes de commit deben ser claros, en español, y
  evitar jerga innecesaria.
- El docente es hombre: referirse a él siempre en masculino ("el docente",
  "al docente", "del docente"), nunca "la docente" — también en
  `HISTORIAL_CAMBIOS.md`, en comentarios del código y en mensajes de commit.
- Antes de dar por resuelto un bug reportado como "no funciona" o "salió
  este error", reproducirlo primero (Playwright con Chromium está
  disponible) en vez de solo razonar sobre el código — varios bugs de este
  proyecto solo se manifestaron al probarlos funcionalmente.
- **Fórmulas químicas: nunca con paréntesis.** Regla general del docente
  para todo el sitio (páginas, juego, generador, laberintos, crucigramas,
  hojas impresas): ninguna fórmula se muestra al estudiante con ramas entre
  paréntesis (nada de `CH₃−CH(CH₃)−CH₃`, `(CH₃)₃C−OH`, `C(CH₃)₄`,
  `CH₃CH(OH)CH₃`). Solo se permiten dos formas:
  1. **Semidesarrollada mostrando todos sus enlaces**: cada rama cuelga de
     su carbono con su enlace dibujado (arriba y, si hay otra, abajo), como
     en un libro. En el código se escribe con la notación del motor FX de
     `fx-libro.js` (`CH₃—⟦CH₃|CH⟧—CH₃`, `⟦arriba|C|abajo⟧`), o con figuras
     SVG que dibujen los enlaces.
  2. **Fórmula molecular** (C₄H₁₀, C₂H₆O…) cuando lo que importa es la
     composición y no la estructura.
  Red de seguridad: `fx-libro.js` (cargado en todas las páginas de
  contenido y en el generador) convierte solo, al pintarse la página, las
  fórmulas condensadas con paréntesis que hayan quedado en los datos
  (`fxAuto`, `fxTexto`, `fxCondensada`). Aun así, el contenido NUEVO se
  escribe ya sin paréntesis, y lo que el convertidor no sepa dibujar
  (paréntesis anidados, textos dentro de SVG, `<option>` de un `<select>`)
  se corrige a mano. Para ejercicios generados al azar, descartar los que
  aún tengan paréntesis con `fxQuedanParentesis(texto)`. Excepciones: los
  complejos y reactivos inorgánicos que por norma IUPAC se escriben así
  (Ag(NH₃)₂⁺ de Tollens, Pb(OAc)₂…) y los paréntesis que no son de una
  fórmula (nombres como «(1-metilpropil)», aclaraciones en el texto).
- `juego.html` se sirve directo por GitHub Pages: un cambio ahí no necesita
  ningún paso de despliegue aparte de hacer push a `main`.
- `chromanom-analytics.gs` sí necesita redespliegue manual en el editor de
  Apps Script (Implementar → Administrar implementaciones → Nueva versión)
  después de cada cambio — avisar siempre que se toque este archivo.
- **Redesplegar ≠ recalcular.** Redesplegar actualiza el código que corre
  el Web App (`doPost`/`doGet`), pero la hoja "Estadísticas" (y "Curso X",
  "Eficacia por tema") solo se vuelve a ESCRIBIR cuando corre
  `recalcularAhora()` (▶ Ejecutar en el editor) o el disparador automático
  de 30 min. Si un cambio agrega/modifica columnas que lee esa hoja (como
  `handleProgreso_`), avisar los DOS pasos por separado — redesplegar y
  recalcular — no dar por hecho que uno implica el otro.
- **Service worker y `?v=` en las páginas.** Los `.js` y `.css` locales se
  piden con `?v=N` en todas las páginas `.html`, y `sw.js` los sirve «red
  primero». Así un celular con la app vieja instalada no mezcla un `.js`
  nuevo con un `.css` viejo, que fue lo que pasó con el mapa conceptual
  impreso como texto suelto (sesión 168). Si se agrega un archivo nuevo o
  cambia mucho un CSS, subir `CACHE` en `sw.js` y el `?v=` de las páginas
  (`?v=69` → `?v=70`).

- **Simulaciones, pantalla completa y fotos (sesión 179).** Las simulaciones
  nuevas se escriben en `simx.js` (`<div data-simx="nombre" data-titulo="…">`,
  mismo esquema que `sim4.js`, sin depender de `fase4.css`). **Toda simulación
  nueva debe poder verse en pantalla completa**: `pantalla.js` pone solo el
  botón «⛶ Pantalla completa» en cada `.sim`, en cada `data-simx` y en lo que
  declare `window.PANTALLA_EXTRA` (por ejemplo `['.lab']`); si no la detecta,
  ponerle `data-pantalla="Nombre"`. Los canvas deben calcular su tamaño con
  la clase `en-pantalla` (ver `lienzo()` en `sim4.js`/`simx.js`). Las fotos
  reales van en `img/fotos/` con su cita APA en `fotos-datos.js`
  (`<div data-foto="clave" data-pie="…"></div>`): solo bancos libres (Wikimedia
  Commons, buscados con Openverse), licencias CC0, dominio público, CC BY o
  CC BY-SA, y la cita siempre debajo. Wikimedia limita las descargas
  automáticas (error 429): bajar las imágenes de a una y con pausas.

- **Guías descargables (`guias.html`).** Los PDF de `pdf/guia-*.pdf` son archivos fijos generados desde `guias.html` y `referencia.html` (carta horizontal, con logo y marca de agua). Si se cambia el contenido de una guía, correr `node herramientas/generar-guias-pdf.js . pdf` (con `FUENTES=<node_modules/@fontsource>` para la letra Outfit) y subir los PDF en el mismo commit. Las estructuras de las guías van **dibujadas en SVG** con el código de cuatro colores y sin paréntesis; nunca escribir ramas entre paréntesis.
