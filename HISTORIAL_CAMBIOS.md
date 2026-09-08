# Historial de cambios (sesiones con Claude)

Este archivo registra, sesión por sesión, los cambios hechos al repositorio
con ayuda de Claude Code. Las entradas más recientes van arriba.

Ver `CLAUDE.md` para la regla que mantiene este archivo actualizado.

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
