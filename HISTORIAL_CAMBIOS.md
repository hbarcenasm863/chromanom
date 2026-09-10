# Historial de cambios (sesiones con Claude)

Este archivo registra, sesión por sesión, los cambios hechos al repositorio
con ayuda de Claude Code. Las entradas más recientes van arriba.

Ver `CLAUDE.md` para la regla que mantiene este archivo actualizado.

---

## 2026-09-10 (12) — Tope explícito de 5.0 en la Nota

### Contexto
Al revisar la fórmula nueva de la entrada anterior (11), la docente
pidió dejar explícito que la Nota nunca debe pasar de 5.0, el máximo de
la escala.

### Qué se agregó
Matemáticamente la fórmula actual ya no debería poder pasar de 5.0
(los aciertos son un subconjunto de las preguntas respondidas, así que
el % de acierto no puede pasar de 100%) — pero se agregó de todas
formas un `Math.min(5, ...)` explícito al final de `calcularNotaJuego_`,
como cinturón de seguridad ante cualquier dato anómalo (por ejemplo, si
algún día una fila del Registro queda con más "Correctas" que "Total"
por algún error de captura). Probé el caso normal (100% de acierto → 5)
y un caso de dato corrupto a propósito (correctas mayor que preguntas)
para confirmar que el tope funciona en ambos.

### Archivos
- **`chromanom-analytics.gs`**: `calcularNotaJuego_()` ahora limita el
  resultado a 5 como máximo. `BUILD_TAG` actualizado a
  `2026-09-10-nota-tope-5-minimo-22-sesiones`.

### Pasos pendientes (manuales, en Apps Script)
Mismos dos pasos de siempre, por separado:
1. **Redesplegar**: Implementar → Administrar implementaciones → Nueva
   versión.
2. **Recalcular**: ▶ Ejecutar `recalcularAhora()` en el editor (o
   esperar el disparador automático de 30 min).

---

## 2026-09-10 (11) — Nota del periodo: mínimo de 22 sesiones, sin techo

### Contexto
Al explicarle la fórmula de la Nota (la de la sesión anterior, con
"factor de sesiones" con tope en 1), la docente hizo notar un problema:
ya tiene estudiantes que jugaron más de las 22 sesiones esperadas y
todavía queda más de un mes de periodo — con el tope en 1, esos
estudiantes dejaban de ver subir su nota por seguir practicando, lo cual
le pareció injusto. Pidió el cambio contrario: que haya un **mínimo** de
22 sesiones (las que falten deberían contar como 0), pero **sin
máximo** — jugar de más nunca debería dejar de poder subir la nota.

### Cómo queda la fórmula ahora
```
sesiones que faltan  =  máximo(0, 22 − sesiones jugadas)
preguntas ajustadas  =  preguntas respondidas + (sesiones que faltan × 20)
% de acierto         =  correctas / preguntas ajustadas
Nota = % de acierto × 5     (redondeada a 1 decimal)
```

- Si un estudiante **no ha llegado** a 22 sesiones, cada sesión que le
  falte se cuenta como si la hubiera jugado y fallado TODA (0 aciertos
  de 20 preguntas) — así jugar menos de lo esperado sigue penalizando la
  nota, aunque lo poco que jugó lo haya hecho perfecto.
- Una vez que **llega o pasa** las 22 sesiones, ya no se agrega ninguna
  penalización — la nota queda determinada por su % de acierto real
  sobre TODO lo que ha jugado en el periodo, sin importar cuánto sea.
  Si sigue practicando y su % de acierto mejora, la nota sigue subiendo;
  si baja, la nota baja — nunca se "congela".

Ejemplo: un estudiante con 30 sesiones, 550 preguntas y 450 correctas
(81.8% de acierto) tiene Nota 4.1. Si sigue practicando hasta 40
sesiones y su acierto sube a 86.7%, la Nota sube a 4.3 — antes, con el
tope en 1, ambos casos habrían dado el mismo resultado porque el factor
de sesiones ya estaba "topado" desde la sesión 22.

Verifiqué la fórmula con varios casos (0 sesiones, exactamente 22, más
de 22 con mejora de acierto, muchas sesiones con acierto bajo, una sola
sesión perfecta) antes de darla por buena.

### Archivos
- **`chromanom-analytics.gs`**: se reescribió `calcularNotaJuego_()` (ya
  no usa un "factor de sesiones" con tope) y se agregó la constante
  `PREGUNTAS_POR_SESION = 20` (tamaño estándar de una sesión, usado para
  calcular cuánto penalizar las sesiones faltantes). `BUILD_TAG`
  actualizado a `2026-09-10-nota-sin-techo-minimo-22-sesiones`.

### Pasos pendientes (manuales, en Apps Script)
Este cambio SÍ toca `chromanom-analytics.gs` — hacen falta los dos pasos
de siempre, por separado:
1. **Redesplegar**: Implementar → Administrar implementaciones → Nueva
   versión (para que el Web App use este código nuevo).
2. **Recalcular**: ▶ Ejecutar `recalcularAhora()` en el editor (o
   esperar el disparador automático de 30 min) — la hoja "Estadísticas"
   y "Curso X" no se re-escriben solas con el redespliegue, necesitan
   este paso aparte para que las notas ya guardadas se recalculen con la
   fórmula nueva.

---

## 2026-09-09 (10) — Rediseño del menú de la portada: todos los modos visibles

### Contexto
La docente notó que "Constructor por Familia" y "Practicar por Grupo
Funcional" quedaban muy escondidos: eran menús desplegables (`<details>`)
mucho más chicos que las 6 tarjetas principales, y varios estudiantes ni
se daban cuenta de que existían. Pidió una reorganización para que se
vea todo lo que se puede jugar, sin nada escondido.

### La solución
Se elevaron las 3 secciones que antes eran menús desplegables
("Practicar por grupo funcional", "Practicar constructor por familia",
"Practicar reacciones por grupo") a 3 tarjetas nuevas, **del mismo
tamaño y estilo** que las 6 tarjetas principales (Hidrocarburos,
Oxigenados, Nitrogenados, Juego Completo, Constructor Molecular,
Reacciones Orgánicas). Ahora la portada tiene 9 tarjetas visibles de
entrada, todas del mismo peso visual, sin ningún menú colapsado.

Cada una de las 3 tarjetas nuevas abre una pantalla propia con sus
opciones en una cuadrícula de **2 columnas** (como se sugirió), en vez
de la fila de "píldoras" pequeñas de antes. Esto reutiliza exactamente
el mismo patrón que ya usaba la tarjeta "Reacciones Orgánicas" (que
abre su propio selector de grupos) — no se inventó una interacción
nueva, solo se aplicó el mismo patrón ya probado a las otras 3
categorías. Se eligió este enfoque (tarjeta → pantalla dedicada) en vez
de listar las 37 opciones sueltas en la portada para no saturar la
pantalla principal, sobre todo en celular: la portada sigue siendo
fácil de escanear, y cada categoría muestra sus opciones en su propio
espacio, ya sin necesidad de desplegar nada.

Se probó en el navegador (incluyendo pantallas angostas de celular,
360px) que las 3 pantallas nuevas se ven bien, que cada botón arranca
la partida correcta con un solo toque, y que nada del resto del juego
se rompió.

### Archivos
- **`juego.html`**:
  - 3 tarjetas nuevas en la portada: "Practicar por Grupo Funcional"
    (🧬), "Constructor por Familia" (🧩), "Reacciones por Grupo" (🔬),
    con sus propios colores de ícono.
  - Nueva pantalla `s-drill-picker`, reutilizada por las 3 categorías,
    con botón "← Volver" y cuadrícula de 2 columnas.
  - Nueva función `openDrillPicker(categoria)` y los datos de las 3
    categorías (`DRILL_CATEGORIES`) en el script.
  - Se eliminaron los 3 menús `<details>` (colapsados) y su CSS, ya sin
    uso.

### Pendientes
- Ninguno. Cambio solo de `juego.html`, no requiere redesplegar ni
  recalcular nada — basta con el push a `main`.

---

## 2026-09-09 (9) — Reintento automático al registrar que un estudiante entró a jugar

### Contexto
La docente reportó que una estudiante que practicó **solo alcanos** le dijo
que "no se registró", y al revisar la hoja "Registro" no aparece ninguna
sesión de ella con ese grupo.

### Lo que encontré
No es un bug de "alcanos" en particular — el código no distingue entre
grupos funcionales al guardar una sesión, así que le pudo pasar con
cualquier grupo. Lo que sí encontré es una debilidad real en el envío que
marca "el estudiante entró a jugar" (`sendSessionStart`, dispara apenas se
elige un nivel, ANTES de responder cualquier pregunta):

- Cuando termina una partida, si el envío a la hoja falla, el estudiante
  ve un aviso grande ("⚠️ No se pudo guardar tu partida") con un botón
  para reintentar — así ella (o la docente) se entera si algo salió mal.
- Pero el envío de "entró a jugar" no tenía nada de eso: un solo intento,
  sin reintento y sin ningún aviso si fallaba. Si justo en ese momento
  hubo un tropiezo de wifi (típico en un salón con muchos celulares
  conectados a la vez), ese registro se perdía en silencio — y si la
  estudiante además no alcanzó a responder ninguna pregunta antes de
  salir o cerrar la práctica, no queda ninguna otra oportunidad de
  guardar nada de esa sesión.

Esto explica el reporte sin necesidad de que haya nada raro con el grupo
"alcanos" específicamente: probablemente fue justo esa combinación (un
tropiezo de conexión al entrar + salir antes de responder preguntas).

### Qué se corrigió
`sendSessionStart()` ahora reintenta sola hasta 3 veces (con una pausa
creciente entre intentos) si el envío falla, en vez de rendirse con el
primer tropiezo. Esto es automático y no requiere que el estudiante haga
nada ni vea ningún aviso — simplemente hace más difícil que un problema
momentáneo de wifi borre el registro de que entró a practicar.

### Qué NO resuelve esto
Si una estudiante cierra la app/pestaña de golpe (botón de inicio del
celular, cambiar de app) antes de que el reintento termine, o si no hay
conexión en absoluto durante toda la práctica, el registro se puede
seguir perdiendo — eso ya no es un problema de código sino de conexión
real en el momento. Si el problema persiste con este cambio, vale la
pena preguntarle a la estudiante si alcanzó a ver la pantalla de
resultados (el resumen con el puntaje) al terminar, o si jugó en "modo
libre" en vez de con su código (en ese caso su sesión queda guardada
como "(anónimo)", no con su nombre, y no aparece al buscarla por nombre).

### Archivos
- **`juego.html`**: se agregó reintento (hasta 3 intentos) a
  `sendSessionStart()`. No se tocó nada más.

### Pendientes
- Ninguno de código. Cambio solo de `juego.html`, no requiere
  redesplegar ni recalcular nada — basta con el push a `main`.
- Pendiente de la docente: confirmar con la estudiante si terminó la
  práctica y vio la pantalla de resultados, o si jugó en modo libre —
  ayudaría a confirmar si este cambio resuelve el caso reportado.

---

## 2026-09-09 (8) — Vista semidesarrollada para las 37 estructuras nuevas

### Contexto
Después de agregar las 37 estructuras nuevas de la entrada anterior (7),
la docente notó que a esos compuestos no les aparecía el botón para
alternar entre "⬡ Esqueletal" y "— Semidesarrollada" que sí tienen los
compuestos antiguos, y pidió agregarlo.

### La causa
Ese botón solo aparece cuando el compuesto tiene una entrada en
`MOLDES` (la estructura tipo fórmula condensada, CH₃—CH₂—...). Al
agregar las 37 moléculas nuevas se dibujó su estructura esqueletal
(`M`), pero se dejó `MOLDES` sin llenar a propósito porque no era
obligatorio para que las preguntas de nomenclatura funcionaran — solo
faltaba el botón de vista alterna.

### Qué se agregó
Se agregó la entrada `MOLDES` para las 37 moléculas nuevas de la sesión
anterior (alquenos, alquinos, alcoholes, cetonas, aldehídos, ácidos,
ésteres, éteres, amidas y nitrilos), siguiendo el mismo formato que las
demás. Cada una se verificó por separado: que renderice sin errores, que
el conteo de hidrógenos coincida con la fórmula molecular real del
compuesto, y visualmente que no haya textos superpuestos. También se
probó en el juego real que el botón de alternar aparece y que la
fórmula semidesarrollada se ve correcta (por ejemplo, heptan-2-ona).

### Archivos
- **`juego.html`**: se agregaron 37 entradas nuevas al objeto `MOLDES`,
  justo antes de su cierre. No se tocó nada más.

### Pendientes
- Ninguno. Cambio solo de `juego.html`, no requiere redesplegar ni
  recalcular nada — basta con el push a `main`.

---

## 2026-09-09 (7) — 50 preguntas de nomenclatura por cada grupo funcional

### Contexto
La docente pidió aumentar el banco de preguntas de nomenclatura IUPAC:
que cada grupo funcional individual (alquenos, alquinos, alcoholes,
cetonas, aldehídos, ácidos, ésteres, éteres, amidas, nitrilos) llegue a
**50 preguntas** en su práctica, dejando intactos los que ya tenían 50 o
más (alcanos, aminas, benceno). Se acotó el alcance explícitamente a
**solo nomenclatura** (opción múltiple, arrastrar, identificar y
escribir) — sin tocar "Constructor por familia" ni "Reacciones por
grupo", que quedan igual que antes.

### Qué se agregó
131 preguntas nuevas de nomenclatura (más algunas de sobra para no dejar
compuestos a medias) repartidas en 10 grupos funcionales, cada una con su
estructura química nueva dibujada (37 moléculas nuevas en total) y sus 4
preguntas asociadas (opción múltiple, arrastrar, identificar, escribir):

- **Alquenos** (+3 moléculas): hex-2-eno, hex-3-eno, 2-metilpropeno.
- **Alquinos** (+4): hex-2-ino, hept-1-ino, hept-2-ino, 4-metilpent-2-ino.
- **Alcoholes** (+2): hexan-1-ol, heptan-2-ol.
- **Cetonas** (+4): heptan-2-ona, heptan-3-ona, heptan-4-ona,
  3-metilbutan-2-ona.
- **Aldehídos** (+4): heptanal, 2-metilpropanal, 2-metilbutanal,
  3-metilbutanal.
- **Ácidos** (+4): ácido heptanoico, ácido 2-metilpropanoico, ácido
  2-metilbutanoico, ácido 3-metilbutanoico.
- **Ésteres** (+4): propanoato de etilo, metanoato de metilo, metanoato
  de etilo, butanoato de etilo.
- **Éteres** (+4): etoxipropano, metoxibutano, metoxipentano,
  etoxibutano.
- **Amidas** (+4): heptanamida, 2-metilpropanamida, 2-metilbutanamida,
  3-metilbutanamida.
- **Nitrilos** (+4): heptanonitrilo, 2-metilpropanonitrilo,
  2-metilbutanonitrilo, 3-metilbutanonitrilo.

Cada compuesto nuevo se verificó contra el inventario existente para no
repetir ningún nombre ni estructura. Todos los grupos quedan en 50
preguntas o un poco más (por ejemplo alquinos queda en 53) porque las
moléculas se agregaron en paquetes de 4 preguntas cada una.

### Archivos
- **`juego.html`**: se agregaron 37 funciones nuevas al objeto `M`
  (dibujo de cada estructura) y un nuevo bloque `QBANK_NOMENCLATURA_50`
  con las 148 preguntas nuevas (37 moléculas × 4 tipos de pregunta),
  fusionado al banco principal con `QBANK.push(...)`. No se tocó
  `MOLDES` (no hace falta para preguntas de nomenclatura pura) ni las
  preguntas de "Constructor por familia"/"Reacciones por grupo".

### Verificación
- Cada una de las 37 estructuras nuevas se probó por separado (sin
  errores de JavaScript, SVG válido) y se revisó visualmente que no haya
  líneas superpuestas ni átomos mal ubicados.
- Se validó automáticamente que ninguna respuesta nueva choque con una
  respuesta ya existente en el juego, que las 4 preguntas de cada
  molécula sean consistentes entre sí (opción correcta entre las
  opciones, fragmentos de arrastrar completos, etc.), y que los 10
  grupos funcionales lleguen a 50 preguntas o más en la práctica real.
- Se jugó una ronda completa (opción múltiple, arrastrar, identificar,
  escribir) con una de las cetonas nuevas directamente en el juego para
  confirmar que se ve y se puntúa bien.

### Pendientes
- Ninguno. Este cambio es solo de `juego.html`: no requiere redesplegar
  `chromanom-analytics.gs` ni recalcular nada, basta con el push a
  `main` (GitHub Pages lo sirve directo).

---

## 2026-09-08 (6) — Nota ponderada por preguntas y desglose de prácticas por grupo

### Contexto
Tras confirmar que las prácticas por grupo funcional, constructor por
familia y reacciones por grupo ya contaban como sesión para el periodo
(sesión anterior), la docente pidió dos cosas más:
1. Que esas 3 categorías de práctica también aparezcan desglosadas en la
   hoja "Estadísticas" (como ya pasa con Hidrocarburos/Oxigenados/
   Nitrogenados/Juego Completo).
2. Que la Nota de juego tenga en cuenta el **% de acierto real ponderado
   por número de preguntas respondidas**, no solo la sesión como unidad —
   para que sea "más certera".

### El problema con la fórmula anterior
Antes, cada SESIÓN aportaba su propio `% acierto / 20` al promedio, sin
importar cuántas preguntas tuviera esa sesión. Una práctica cortica de 3
preguntas al 100% pesaba exactamente igual que una sesión completa de 20
preguntas al 100% — y, peor aún, igual de "barato" era subir el promedio
con varias prácticas cortas y fáciles que con sesiones completas más
exigentes.

### Cómo queda la nota ahora
`calcularNotaJuego_(correctasEnElPeriodo, preguntasEnElPeriodo, sesionesJugadas)`:

```
% de acierto real  =  correctasEnElPeriodo / preguntasEnElPeriodo
factor de sesiones =  mín(1, sesionesJugadas / 22)   ← 22 = SESIONES_ESPERADAS
Nota = % de acierto real × 5 × factor de sesiones     (redondeada a 1 decimal)
```

- El **% de acierto** ahora es el real: todas las preguntas correctas del
  periodo sobre todas las preguntas respondidas, sin importar en cuántas
  sesiones se repartieron. Una práctica corta ya no "cuenta como sesión
  completa" para la nota — aporta exactamente las preguntas que tuvo, ni
  más ni menos.
- El **factor de sesiones** sigue existiendo para no perder el incentivo
  original de jugar seguido: si aún faltan sesiones por completar (menos
  de 22 en el periodo), la nota se reduce proporcionalmente aunque el
  acierto sea perfecto. Jugar MÁS de 22 sesiones ya no sigue subiendo la
  nota por sí solo (el factor se topa en 1) — solo terminar de definir
  mejor el % de acierto real.
- Ejemplo concreto que muestra la diferencia: un estudiante con una
  sesión completa de 20 preguntas al 40% (le fue mal) y una práctica
  cortica de 3 preguntas al 100% — antes el promedio por sesión daba
  (2.0+5.0)/22 ≈ 0.3; ahora, el % real ponderado es 11/23 ≈ 48%, dando
  ≈ 0.2. La práctica fácil corta ya no "tapa" que le fue mal en la
  sesión que de verdad importa.
- Se aplicó la MISMA fórmula en la hoja "Curso X" (antes solo estaba en
  "Estadísticas"), para que un estudiante no vea dos notas distintas
  según en qué hoja se mire.

### Desglose nuevo por categoría de práctica
- 3 columnas nuevas al final de "Estadísticas": **"Grupo funcional
  (práctica) %"**, **"Constructor por familia (práctica) %"**,
  **"Reacciones por grupo (práctica) %"** — mismo espíritu que las 4
  columnas de nivel que ya existían, pero para las prácticas cortas por
  grupo.
- Para clasificar de forma confiable (sin depender del texto exacto de
  la etiqueta que ve el estudiante), se agregó una columna nueva al
  Registro, **"Nivel (clave)"**, con la clave interna del nivel tal cual
  la usa `juego.html` (p. ej. `constructor_nitrilos`, `rxn_halogenuros`).
  `juego.html` ahora envía esa clave (`nivelKey`) junto con el nombre
  bonito en cada partida.

### Pruebas
Se amplió el arnés de Node (scratchpad de la sesión) con casos que
verifican: la fórmula nueva coincide con la vieja cuando todas las
sesiones tienen el mismo % (no cambia nada en ese caso), difiere
correctamente cuando se mezclan sesiones grandes y chicas con distinto
acierto (el caso que motivó el cambio), los bordes (0 preguntas → nota 0;
más sesiones de las esperadas → tope en 1), y que las 3 columnas nuevas
clasifican bien según la clave real del nivel. También se confirmó en
navegador (Playwright) que `juego.html` sí envía `nivelKey` en cada
partida.

### Pendiente
- **Requiere redesplegar `chromanom-analytics.gs`** (Implementar →
  Administrar implementaciones → Nueva versión) Y luego ejecutar
  `recalcularAhora()` para que la hoja "Estadísticas" recalcule con la
  fórmula y las columnas nuevas (redesplegar ≠ recalcular, ver CLAUDE.md).
  Confirmar con el build: `2026-09-08-nota-ponderada-y-desglose-practicas`.
- Las partidas guardadas ANTES de este cambio no tienen "Nivel (clave)"
  (columna en blanco) — simplemente no se clasifican en ninguna de las 3
  categorías nuevas de práctica, pero sí siguen contando en todo lo demás
  (sesiones, preguntas, nota).

---

## 2026-09-08 (5) — El "% de acierto en el periodo" salía en blanco (aclaración: redesplegar ≠ recalcular)

### Contexto
Tras redesplegar el `.gs` con el % de acierto del periodo, la docente
reportó (con captura) que la tarjeta mostraba bien las fechas, sesiones y
preguntas del periodo, pero el % de acierto salía vacío (un "%" suelto,
sin número).

### Diagnóstico
No fue un bug de cálculo: **redesplegar el `.gs` actualiza el código que
corre el Web App, pero NO vuelve a escribir la hoja "Estadísticas".** Esa
hoja solo se regenera cuando se ejecuta `recalcularAhora()` (▶ Ejecutar en
el editor) o pasa el disparador automático de 30 minutos — y eso hay que
hacerlo con el código ya actualizado. Como la última recalculación había
corrido con una versión anterior (que ya tenía sesiones/preguntas del
periodo pero todavía no la columna "% Acierto en el periodo"), esa
columna simplemente no existía aún en la hoja real. `getRange()` sobre una
columna que no existe en Sheets no da error: devuelve `''` (cadena vacía,
no `undefined`), y el frontend mostraba ese `''` seguido de "%" — de ahí
el símbolo suelto.

### Cambios
- `juego.html` (`cargarProgresoInline`): ahora trata `''` igual que
  `null`/`undefined` en sesiones/preguntas/% del periodo, así que mientras
  la hoja no tenga esas columnas escritas se ve "0"/"—" con claridad, en
  vez de un "%" o un espacio en blanco que parece un error.
- No hizo falta ningún cambio en `chromanom-analytics.gs` — el cálculo ya
  era correcto (verificado de nuevo con Playwright, simulando exactamente
  este caso: sesiones/preguntas del periodo con valor real y `pctPeriodo`
  vacío).

### Pendiente
- La docente debe volver a ejecutar `recalcularAhora()` desde el editor de
  Apps Script (▶ Ejecutar) — o esperar al disparador automático de 30
  min — para que la hoja "Estadísticas" termine de escribir la columna
  "% Acierto en el periodo" con el código ya desplegado. **A partir de
  ahora, cada vez que se cambie algo que afecte esa hoja, avisar
  explícitamente que hacen falta DOS pasos: redesplegar Y recalcular —
  no solo uno.**

---

## 2026-09-08 (4) — % de acierto del periodo y fechas visibles para el estudiante

### Contexto
Tras conectar sesiones/preguntas del periodo hacia la tarjeta del
estudiante, la docente pidió dos cosas más: que también se vea el **%
de acierto dentro del periodo** (no solo el histórico), y que las
**fechas del periodo** (10 de agosto al 30 de octubre) aparezcan en la
tarjeta para que el estudiante sepa a qué rango corresponden esos datos.

### Cambios
- `chromanom-analytics.gs`:
  - `updateStatsCore_`: se agrega `correctasPeriodo` a la agrupación por
    estudiante y una columna nueva **"% Acierto en el periodo"** al final
    de la hoja "Estadísticas" (columna 13), calculada solo con las
    sesiones dentro del periodo — distinta del "% Acierto global"
    histórico de la columna 5.
  - `handleProgreso_`: ahora lee las 13 columnas y devuelve también
    `pctPeriodo`. Además, **todas** las respuestas `ok:true` (haya o no
    datos aún) incluyen `periodoInicio`/`periodoFin` (las mismas
    `FECHA_INICIO_PERIODO`/`FECHA_FIN_PERIODO` del código), para que el
    frontend muestre el rango de fechas sin duplicarlas como constante
    aparte. `BUILD_TAG` → `2026-09-08-progreso-pct-y-fechas-periodo`.
- `juego.html`: la tarjeta de bienvenida ahora muestra, bajo el título
  "Este periodo académico", el rango de fechas en formato corto ("10 ago
  – 30 oct") y una fila más de "% de acierto" del periodo. Si el `.gs`
  desplegado fuera uno viejo sin estos campos, la línea de fechas queda
  en blanco y el % en "—", sin mostrar "undefined".
- Pruebas agregadas (Node y Playwright, en el scratchpad de la sesión):
  que el % de acierto del periodo se calcula distinto del histórico
  (caso de prueba con 73% histórico vs. 85% en el periodo), que las
  fechas llegan y se formatean bien, y que nada se rompe con una
  respuesta de un `.gs` todavía no redesplegado.

### Pendiente
- **Requiere redesplegar `chromanom-analytics.gs`** una vez más
  (Implementar → Administrar implementaciones → Nueva versión). Confirmar
  con el `build`: `2026-09-08-progreso-pct-y-fechas-periodo`.

---

## 2026-09-08 (3) — El estudiante también ve su progreso del periodo, no solo el total

### Contexto
La sesión anterior agregó "Sesiones en el periodo" y "Preguntas en el
periodo" a la hoja "Estadísticas" (para la docente), pero la tarjeta de
progreso que ve el ESTUDIANTE al entrar con su código seguía mostrando solo
el total histórico — la docente probó tras redesplegar y recalcular, y la
tarjeta del estudiante no había cambiado. Faltaba conectar esos dos datos
nuevos hacia el frontend: `handleProgreso_()` solo leía las primeras 6
columnas de "Estadísticas" y nunca los exponía.

### Cambios
- `chromanom-analytics.gs` (`handleProgreso_`): ahora lee las 12 columnas
  de "Estadísticas" (antes solo 6) y devuelve también `sesionesPeriodo` y
  `preguntasPeriodo` en la respuesta JSON. `BUILD_TAG` actualizado a
  `2026-09-08-progreso-con-periodo`.
- `juego.html`: la tarjeta de bienvenida ahora separa claramente dos
  bloques — **"Total histórico"** (sesiones, preguntas, % de acierto de
  siempre) y **"Este periodo académico"** (sesiones y preguntas del
  periodo vigente, más la Nota de juego, que ya era del periodo). Si el
  `.gs` desplegado todavía fuera una versión vieja sin estos dos campos,
  se muestra "0" en vez de "undefined" — no revienta ni queda a medias.
- Confirmado con la docente que el periodo configurado (10 de agosto al
  30 de octubre de 2026) ya coincide exactamente con
  `FECHA_INICIO_PERIODO`/`FECHA_FIN_PERIODO` en el `.gs` — no hizo falta
  ajustar esas fechas.
- Probado en navegador (Playwright): la tarjeta muestra ambos bloques con
  datos reales, y no se rompe si el backend todavía no tiene los campos
  nuevos.

### Pendiente
- **Requiere redesplegar `chromanom-analytics.gs`** otra vez (Implementar
  → Administrar implementaciones → Nueva versión) para que
  `handleProgreso_` empiece a devolver los campos del periodo. Se puede
  confirmar revisando el `build` en la URL del Apps Script:
  `2026-09-08-progreso-con-periodo`.

---

## 2026-09-08 (2) — Sesiones y preguntas del periodo en la hoja "Estadísticas"

### Contexto
La docente pidió que la hoja "Estadísticas" muestre, además del total
histórico de siempre, cuántas veces ha ingresado cada estudiante y cuántas
preguntas ha respondido **dentro del periodo académico vigente**
(`FECHA_INICIO_PERIODO`/`FECHA_FIN_PERIODO`, ya usadas para la Nota de
juego) — para poder distinguir la actividad de este periodo de lo jugado
en periodos anteriores.

### Cambios
- `chromanom-analytics.gs` (`updateStatsCore_`): se agregan dos columnas
  nuevas al final de la hoja "Estadísticas" — **"Sesiones en el periodo"**
  y **"Preguntas en el periodo"** — calculadas con el mismo filtro de
  fecha que ya usa la Nota de juego. Van al final (después de las columnas
  de % por nivel), no intercaladas, para no correr el índice de columnas
  fijas que ya lee `handleProgreso_()` (Nombre, Curso, Sesiones, Preguntas,
  % Acierto, Nota siguen en las columnas 1-6).
- Como la hoja "Estadísticas" se reconstruye por completo en cada
  recálculo (no es incremental como "Registro"), las columnas nuevas
  aparecen solas la próxima vez que corra el disparador automático (cada
  30 min) o se ejecute `recalcularAhora()` — no requiere ningún ajuste
  manual sobre la hoja.
- Agregada una prueba al arnés de Node (`gs_test.js`, en el scratchpad de
  la sesión) que confirma que una sesión anterior al inicio del periodo
  cuenta en el total histórico pero NO en los conteos del periodo.

### Pendiente
- **Requiere redesplegar `chromanom-analytics.gs`** en el editor de Apps
  Script (Implementar → Administrar implementaciones → Nueva versión)
  para que las columnas nuevas empiecen a calcularse. El ancho de columna
  de las 2 nuevas no se ajusta solo en la hoja ya existente (solo pasa al
  crear la hoja desde cero) — es cosmético, se puede ajustar a mano si se
  ven muy angostas.

---

## 2026-09-08 — El progreso personal se quedaba en "–" o mostraba 0 durante clase

### Contexto
La docente reportó que hoy, con el curso completo jugando, el recuadro de
progreso (sesiones/preguntas/% acierto/nota) que se agregó ayer se quedaba
en rayitas mucho tiempo o terminaba mostrando 0 para todos, cuando ayer
funcionó bien. No se había tocado nada del `.gs` ni de `juego.html` hoy.

### Diagnóstico
Con la clase completa entrando su código casi al mismo tiempo al arrancar
la sesión, la consulta de progreso (`accion=progreso` → `handleProgreso_`)
puede toparse con el mismo error transitorio de "demasiadas invocaciones
simultáneas" al Spreadsheet que ya afectaba el guardado de resultados
antes de la auditoría — pero a diferencia de `doPost()`, `handleProgreso_`
no tenía ningún reintento, y el frontend solo esperaba 4 segundos antes de
rendirse y mostrar "0/—". En las pruebas (una sola sesión a la vez) esto
nunca se manifestaba — solo aparece con carga real de varios estudiantes
simultáneos.

### Cambios
- `chromanom-analytics.gs` (`handleProgreso_`): agregado un reintento corto
  con backoff (hasta 3 intentos, igual que `doPost()` pero con pausas más
  cortas por ser una simple consulta de lectura) ante fallos transitorios
  del Spreadsheet. `BUILD_TAG` actualizado a
  `2026-09-08-progreso-con-reintento` para verificar el despliegue.
- `juego.html` (`cargarProgresoInline`): el tiempo de espera del lado del
  navegador subió de 4 a 9 segundos, para no cortar la consulta antes de
  que el servidor (con su propio reintento) alcance a responder.
- Agregadas 2 pruebas al arnés de Node (`gs_test.js`, en el scratchpad de
  la sesión, no en el repositorio): que `handleProgreso_` se recupera de
  fallos transitorios, y que un fallo persistente sigue devolviendo
  `ok:false` sin reventar. Probado también en navegador (Playwright)
  simulando una respuesta de ~6.5s, confirmando que con el timeout viejo
  de 4s se habría perdido y con el nuevo de 9s sí se muestra el dato real.

### Pendiente
- **Este cambio requiere redesplegar `chromanom-analytics.gs`** en el
  editor de Apps Script (Implementar → Administrar implementaciones →
  Nueva versión) para que tenga efecto — el archivo en el repositorio por
  sí solo no actualiza el Web App en producción. Se puede confirmar que
  quedó desplegado abriendo la URL del Apps Script en el navegador y
  verificando que el texto diga `build 2026-09-08-progreso-con-reintento`.

---

## 2026-09-07 — Panel de estudiante inline, reto de la coordinación y protecciones del juego

### Contexto
Sesión larga enfocada en tres frentes: (1) endurecer el backend de
analíticas para que nunca se pierda una partida por un error transitorio,
(2) corregir bugs reales de calificación de respuestas reportados por
estudiantes, y (3) rediseñar cómo se identifica el estudiante al entrar al
juego, a pedido de la docente, siguiendo el patrón usado en el proyecto
hermano `ionom`.

### Backend — `chromanom-analytics.gs`
- Auditoría funcional completa con un arnés de pruebas en Node.js que
  simula Apps Script (Sheets, Drive, Lock, ContentService), sin necesidad
  de desplegar para probar.
- Corregido un bug real que solo se manifestaba la primera vez que se creaba
  la hoja "Registro" desde cero (`setFrozenRows` llamado sobre un `Range`
  en vez de sobre el `Sheet`).
- El reintento de `doPost()` (6 intentos con backoff exponencial) ahora
  cubre también `getOrCreateSpreadsheet()`, no solo el guardado de la fila
  — antes una falla transitoria ahí se traducía en un error inmediato al
  estudiante, sin usar los reintentos.
- Movida la verificación de zona horaria fuera de la ruta activa por cada
  partida (antes se ejecutaba en cada `doPost`/`doGet`; ahora solo en la
  recalculación periódica de estadísticas).
- Nuevo endpoint de solo lectura `accion=progreso` (`handleProgreso_`) que
  expone, por nombre y curso, las sesiones jugadas, preguntas respondidas,
  % de acierto y nota de juego ya calculadas en la hoja "Estadísticas".
- `updateStats_` ahora registra el error en la hoja "Errores" antes de
  relanzarlo, para poder diagnosticar fallas de la recalculación automática.

### Corrección de respuestas — `juego.html`
- Corregido el bug reportado por una estudiante: "benceno-1,3-diol" (y en
  general cualquier respuesta con guion, espacio, guion largo/corto o
  punto como separador de localizadores) se calificaba como incorrecta
  aunque coincidiera con la retroalimentación. La función `norm()` ahora
  trata guiones y espacios como equivalentes, normaliza guiones
  tipográficos y tolera "1.3" vs "1,3". Verificado sin colisiones nuevas
  contra las 771 preguntas del banco.
- Constructor Molecular pasó de 60s a 90s por pregunta (más tiempo al
  dibujar una estructura).

### Progreso personal y protección de la partida
- Al identificarse, el estudiante ve un resumen de su progreso (sesiones
  jugadas, preguntas respondidas, % de acierto, nota actual), consultado
  al nuevo endpoint `accion=progreso`. Si la consulta falla o tarda, nunca
  bloquea el inicio del juego.
- Agregada una confirmación ("¿Salir de la partida?") cuando el estudiante
  presiona atrás en el celular o intenta recargar/cerrar la pestaña a
  mitad de una partida, para evitar perder el progreso por error.
- Corregidas dos regresiones sucesivas causadas por el foco del teclado
  quedando en un botón oculto tras cerrarse un modal (Enter/Espacio
  volvían a activarlo): el modal de progreso se disparaba varias veces, y
  después el botón "Comenzar" quedaba bloqueado en silencio. Se limpia el
  foco al entrar a la pantalla de juego y se añadieron guardas de estado
  (`gameActive`, `_iniciandoPartida`) con liberación automática a los 15s
  por si algo queda inconsistente.

### Rediseño del ingreso de estudiante (a pedido de la docente)
- Reemplazado el flujo de dos modales (código → progreso) por un panel fijo
  en la portada, igual al patrón de `hbarcenasm863.github.io/ionom`: se
  ingresa el código una sola vez (el curso se deduce de los primeros 4
  dígitos, sin selector aparte) y ese mismo panel se convierte en una
  tarjeta de bienvenida con nombre, curso y las 4 estadísticas de
  seguimiento. Se puede elegir cualquier nivel después sin repetir el
  código, hay un enlace "Cambiar de estudiante" para equipos compartidos,
  y el progreso se refresca cada vez que se vuelve a la portada.
- El modal del "reto de la coordinación" (1.000 preguntas al 80%+) se movió
  para mostrarse justo al reconocer el código (antes aparecía al elegir
  nivel, mezclado con el arranque de la partida). Además, en modo colegio
  se corrigió para que se muestre **siempre** al identificar a un
  estudiante — el tope de "una vez al día" que tenía sentido antes hacía
  que, en un computador compartido del salón, solo el primer estudiante
  del día lo viera.
- Probado extensivamente con Playwright (Chromium), incluida emulación de
  celulares reales (Galaxy S24/A55, Pixel 7, iPhone 13/SE), para descartar
  que el rediseño duplicara partidas, bloqueara el juego, o rompiera el
  temporizador, el envío/reintento a la hoja, o la corrección de
  respuestas.

### Pendiente / follow-up
- Cada cambio a `chromanom-analytics.gs` requiere redesplegar manualmente
  en el editor de Apps Script (Implementar → Administrar implementaciones
  → Nueva versión) — no se sirve solo por estar en el repositorio.
- Se entregó a la docente un prompt para replicar en `ionom` la parte de
  analíticas (sesiones/preguntas/% acierto/nota) sobre su panel de código
  inline, que en ese repo ya existía pero sin esa información.

---

## 2026-09-04 a 2026-09-05 — Trabajo previo (resumen breve)

- Se agregó el modal promocional del "reto de la coordinación".
- Se corrigieron hallazgos de auditoría: conteo de errores Build/Rxnq que
  se perdía, íconos maskable de la PWA, copy desactualizado.
- Se fijó la zona horaria de Bogotá y el formato de la columna Timestamp.
- Los encabezados de la hoja "Registro" se sincronizan solos si se agregan
  columnas nuevas al código.
- Se colorearon los nombres IUPAC en las opciones de respuesta del juego y
  se agregó la etiqueta faltante para el nivel `rxn_mixto`.
