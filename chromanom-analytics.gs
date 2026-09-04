// ============================================================
//  Chromanom — Apps Script Analytics
//  Desplegar como: Aplicación web → Cualquier usuario
//  Método de acceso: Cualquier persona
// ============================================================

const SPREADSHEET_NAME = 'Chromanom — Registro de estudiantes';
const SHEET_REGISTRO   = 'Registro';
const SHEET_STATS      = 'Estadísticas';

// ── Cabeceras del Registro ──────────────────────────────────
// Errores Build/Rxnq van AL FINAL (no intercalados con Errores Write) para
// no correr el índice de las columnas siguientes — updateTopicStats() y
// otras funciones leen columnas de Registro por posición fija (r[15],
// r[16], etc.), y moverlas habría exigido re-numerar todas esas lecturas.
const HEADERS = [
  'Timestamp','Fecha','Hora','Nombre','Curso','Nivel','Sesión',
  'Correctas','Total','% Acierto',
  'Errores MC','Errores Drag','Errores ID','Errores Write',
  'Tiempo agotado',
  'Errores por tema','Aciertos por tema','Moléculas falladas',
  'Trigger',
  'Errores Build','Errores Rxnq'
];

// ── Nota de juego (0-5) por periodo ─────────────────────────
// Los cursos ingresan 2 veces por semana; se espera que cada estudiante
// juegue SESIONES_ESPERADAS veces entre FECHA_INICIO_PERIODO y
// FECHA_FIN_PERIODO. Cada sesión jugada aporta una nota (% Acierto / 20,
// o sea 100% = 5.0); lo que falte por jugar cuenta como 0 en el promedio.
// Para cambiar de periodo (siguiente corte), solo hay que editar estas
// tres constantes.
const FECHA_INICIO_PERIODO = '2026-08-10';
const FECHA_FIN_PERIODO    = '2026-10-30';
const SESIONES_ESPERADAS   = 22;

// ── Paleta de colores ───────────────────────────────────────
const COLOR = {
  header  : '#1a1a2e',
  hText   : '#ffffff',
  green   : '#d9ead3',  // ≥ 90 %
  blue    : '#cfe2f3',  // 70–89 %
  yellow  : '#fff2cc',  // 50–69 %
  red     : '#fce8e6',  // < 50 %
  altRow  : '#f8f9fa',
  border  : '#cccccc',
};

// ── Punto de entrada HTTP POST ──────────────────────────────
// OJO: ya NO llama updateStats() en cada envío. Antes recalculaba TODAS
// las hojas de Estadísticas (por estudiante, por tema, y una por curso)
// en cada partida — con una clase completa jugando a la vez, eso saturaba
// la ejecución del script y provocaba errores de envío ("puede haber
// error en la URL de Apps Script") que en realidad eran timeouts/fallos
// por sobrecarga, no un problema de la URL. Guardar la fila (appendRow)
// es rápido y sigue pasando al instante; el recálculo pesado de
// Estadísticas lo hace ahora solo el disparador automático cada 30 min
// (ver actualizarEstadisticasAutomatico) o recalcularAhora() manualmente.
//
// appendRow() y updateStats() comparten el mismo LockService (ver más
// abajo) para no chocar entre sí, pero eso significa que un envío de
// partida puede quedar esperando detrás de un recálculo largo de
// Estadísticas que esté en curso, o detrás de otros estudiantes enviando
// al mismo tiempo. Si esa espera se agota (o Google devuelve su error
// transitorio de cuota "Too many simultaneous invocations: Spreadsheets"),
// reintentamos aquí varias veces con una pausa creciente y aleatoria
// (jitter) antes de rendirnos.
//
// El jitter es clave con un curso completo enviando a la vez: sin él,
// todos los intentos que fallan al mismo tiempo esperan exactamente el
// mismo tiempo fijo y vuelven a chocar juntos en el siguiente intento
// ("efecto manada"); con una pausa aleatoria se reparten en el tiempo y
// se destraban solos. En el peor caso (6 intentos, esperando hasta 15s
// por el lock en cada uno, más las pausas entre intentos) esto tarda
// como mucho ~2 minutos, muy por debajo del límite de ejecución de
// Apps Script (6 minutos) — así un tropiezo momentáneo de la hoja no le
// llega al estudiante como un error real.
function doPost(e) {
  try {
    const raw  = e.postData ? e.postData.contents : '{}';
    const data = JSON.parse(raw);
    const ss   = getOrCreateSpreadsheet();

    const INTENTOS = 6;
    let ultimoError;
    for (let intento = 0; intento < INTENTOS; intento++) {
      try {
        appendRow(ss, data);
        ultimoError = null;
        break;
      } catch (err) {
        ultimoError = err;
        if (intento < INTENTOS - 1) {
          const base   = 1200 * Math.pow(1.7, intento);
          const jitter = Math.random() * 1000;
          Utilities.sleep(Math.min(base + jitter, 8000));
        }
      }
    }
    if (ultimoError) throw ultimoError;

    return ContentService
      .createTextOutput(JSON.stringify({ ok: true }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ ok: false, error: err.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// ── Marca de versión del código, para verificar que el despliegue web ──
// esté sirviendo esta versión y no una anterior. Súbela cada vez que
// cambies el código y vuelvas a implementar. Ver doGet() más abajo.
const BUILD_TAG = '2026-09-04-ensure-headers-v1';

// ── Punto de entrada HTTP GET (diagnóstico) ─────────────────
function doGet() {
  return ContentService
    .createTextOutput('Chromanom Analytics — activo ✓ (build ' + BUILD_TAG + ')')
    .setMimeType(ContentService.MimeType.TEXT);
}

// ── Obtiene o crea el spreadsheet ──────────────────────────
function getOrCreateSpreadsheet() {
  const files = DriveApp.getFilesByName(SPREADSHEET_NAME);
  if (files.hasNext()) {
    return SpreadsheetApp.open(files.next());
  }
  const ss = SpreadsheetApp.create(SPREADSHEET_NAME);
  initRegistroSheet(ss.getSheets()[0]);
  return ss;
}

// ── Inicializa la hoja Registro con cabeceras ───────────────
function initRegistroSheet(sh) {
  sh.setName(SHEET_REGISTRO);
  sh.appendRow(HEADERS);
  const hRange = sh.getRange(1, 1, 1, HEADERS.length);
  hRange.setBackground(COLOR.header).setFontColor(COLOR.hText)
        .setFontWeight('bold').setFrozenRows(1);
  sh.setColumnWidth(1,  160);  // Timestamp
  sh.setColumnWidth(2,  90);   // Fecha
  sh.setColumnWidth(3,  70);   // Hora
  sh.setColumnWidth(4,  180);  // Nombre
  sh.setColumnWidth(5,  100);  // Curso
  sh.setColumnWidth(6,  150);  // Nivel
  sh.setColumnWidth(16, 250);  // Errores por tema
  sh.setColumnWidth(17, 250);  // Aciertos por tema
  sh.setColumnWidth(18, 350);  // Moléculas falladas
}

// ── Mantiene la fila de cabeceras al día en una hoja "Registro" YA ─────
// existente. Cuando se agregan columnas nuevas a HEADERS (como pasó con
// "Errores Build"/"Errores Rxnq"), initRegistroSheet() no vuelve a
// ejecutarse porque la hoja ya existe — appendRow() igual empezaría a
// escribir esas columnas nuevas al final de cada fila, pero sin este
// chequeo la fila de títulos (fila 1) se quedaría corta y esas columnas
// aparecerían sin nombre. Es barato (una sola lectura de getLastColumn())
// y no hace nada si la hoja ya tiene todas las cabeceras.
function ensureHeaders_(sh) {
  if (sh.getLastColumn() >= HEADERS.length) return;
  sh.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS])
    .setBackground(COLOR.header).setFontColor(COLOR.hText).setFontWeight('bold');
}

// ── Busca una fila existente por código de sesión (columna 'Sesión') ──
// Un mismo código de sesión llega en varias peticiones (evento "inicio" al
// entrar, "fin_partida" al terminar, "cierre" si cierra la pestaña, reintentos
// manuales de envío): sin esta búsqueda cada una añadía una fila nueva,
// duplicando el código de sesión en el Registro e inflando el conteo de
// "Sesiones" en Estadísticas.
function findRowBySession(sh, sesion) {
  const lastRow = sh.getLastRow();
  if (lastRow < 2) return -1;
  const col = sh.getRange(2, 7, lastRow - 1, 1).getValues(); // columna 7 = 'Sesión'
  // Comparación como texto: si un código de sesión generado al azar resulta
  // ser todo dígitos (ej. "048213"), Sheets lo guarda como Number al
  // escribirlo con setValues(), y "048213" === 48213 sería false con ===
  // estricto — la sesión nunca se encontraría y se duplicaría la fila.
  const buscado = String(sesion);
  for (let i = 0; i < col.length; i++) {
    if (String(col[i][0]) === buscado) return i + 2;
  }
  return -1;
}

// ── Añade o actualiza (upsert) la fila del Registro para una sesión ────
// Envuelta en LockService: sin esto, dos peticiones concurrentes (p. ej.
// dos estudiantes iniciando partida casi al mismo tiempo) podían leer
// getLastRow() antes de que ninguna hubiera escrito, calcular la misma
// fila destino, y la segunda escritura sobrescribía silenciosamente los
// datos de la primera en vez de añadir una fila nueva.
function appendRow(ss, d) {
  const lock = LockService.getScriptLock();
  // Espera corta (no 60s): junto con los 6 reintentos con jitter de
  // doPost() esto da varias oportunidades cortas de tomar el lock en vez
  // de una sola espera larga — si updateStats() sigue ocupado, es mejor
  // fallar rápido y que doPost() reintente, que quedarse esperando cerca
  // del límite de ejecución de Apps Script (6 min) en un solo intento.
  lock.waitLock(15000);
  try {
    let sh = ss.getSheetByName(SHEET_REGISTRO);
    if (!sh) {
      sh = ss.insertSheet(SHEET_REGISTRO);
      initRegistroSheet(sh);
    } else {
      ensureHeaders_(sh);
    }

    const pct = d.pct !== undefined ? d.pct : (d.total ? Math.round(d.correctas / d.total * 100) : 0);

    const existingRow = d.sesion ? findRowBySession(sh, d.sesion) : -1;
    // Conserva el timestamp original (momento del "inicio") en vez de pisarlo
    // con el de cada actualización posterior de la misma sesión.
    const timestamp = existingRow > 0 ? sh.getRange(existingRow, 1).getValue() : new Date();

    const row = [
      timestamp,                                      // Timestamp
      d.fecha       || '',                            // Fecha
      d.hora        || '',                            // Hora
      d.nombre      || '',                            // Nombre
      d.curso       || '',                            // Curso
      d.nivel       || '',                            // Nivel
      d.sesion      || '',                            // Sesión
      d.correctas   !== undefined ? d.correctas : '', // Correctas
      d.total       !== undefined ? d.total     : '', // Total
      pct,                                            // % Acierto
      d.errores_mc   !== undefined ? d.errores_mc   : '',
      d.errores_drag !== undefined ? d.errores_drag : '',
      d.errores_id   !== undefined ? d.errores_id   : '',
      d.errores_write!== undefined ? d.errores_write: '',
      d.timeouts     !== undefined ? d.timeouts     : '',
      typeof d.errores_por_tema  === 'object' ? JSON.stringify(d.errores_por_tema)  : (d.errores_por_tema  || ''),
      typeof d.aciertos_por_tema === 'object' ? JSON.stringify(d.aciertos_por_tema) : (d.aciertos_por_tema || ''),
      Array.isArray(d.moleculas_falladas) ? d.moleculas_falladas.join(', ') : (d.moleculas_falladas || ''),
      d.trigger || '',
      d.errores_build!== undefined ? d.errores_build: '',
      d.errores_rxnq !== undefined ? d.errores_rxnq : '',
    ];

    const targetRow = existingRow > 0 ? existingRow : sh.getLastRow() + 1;
    sh.getRange(targetRow, 1, 1, HEADERS.length).setValues([row]);

    // Color de fila según % acierto
    sh.getRange(targetRow, 1, 1, HEADERS.length).setBackground(colorForPct(pct));

    // Formato % (columna 10)
    sh.getRange(targetRow, 10).setNumberFormat('0"%"');
  } finally {
    lock.releaseLock();
  }
}

// ── Helpers de escritura por lotes ──────────────────────────
// Evitan cientos de llamadas individuales a appendRow/getRange/setBackground
// (lentas y propensas a agotar el límite de ejecución de Apps Script a medida
// que el Registro crece); en su lugar arman los datos en memoria y hacen una
// sola llamada setValues()/setBackgrounds() por hoja.
function colorForPct(pct) {
  return pct >= 90 ? COLOR.green : pct >= 70 ? COLOR.blue : pct >= 50 ? COLOR.yellow : COLOR.red;
}

function writeSheetBatch(sh, headers, rows, pctColIndexes) {
  sh.getRange(1, 1, 1, headers.length).setValues([headers])
    .setBackground(COLOR.header).setFontColor(COLOR.hText).setFontWeight('bold');
  sh.setFrozenRows(1);

  if (!rows.length) return;

  sh.getRange(2, 1, rows.length, headers.length).setValues(rows);

  // Colores de fila según la primera columna % (o el índice indicado)
  const mainPctCol = pctColIndexes[0];
  const bgMatrix = rows.map(r => {
    const c = colorForPct(Number(r[mainPctCol]) || 0);
    return headers.map(() => c);
  });
  sh.getRange(2, 1, rows.length, headers.length).setBackgrounds(bgMatrix);

  // Formato "0%" en las columnas porcentuales indicadas
  pctColIndexes.forEach(ci => {
    sh.getRange(2, ci + 1, rows.length, 1).setNumberFormat('0"%"');
  });
}

// ── Normaliza un nombre para agrupar estudiantes de forma robusta ──────
// El mismo estudiante puede llegar con distinto formato: mayúsculas o
// minúsculas, con o sin tildes, o en orden "Nombres Apellidos" vs.
// "Apellidos Nombres" (así llegaban los registros del juego_v2.html
// antiguo, con nombre libre, frente al juego.html actual que usa el
// nombre oficial del curso). Sin esto, updateStats() agrupaba a la misma
// persona en 2-3 "estudiantes" distintos, multiplicando sus sesiones y
// repartiendo su % de acierto entre identidades separadas.
function normalizeName_(nombre) {
  const sinTildes = String(nombre || '')
    .toUpperCase()
    .replace(/[ÁÀÄÂ]/g, 'A').replace(/[ÉÈËÊ]/g, 'E').replace(/[ÍÌÏÎ]/g, 'I')
    .replace(/[ÓÒÖÔ]/g, 'O').replace(/[ÚÙÜÛ]/g, 'U').replace(/Ñ/g, 'N');
  return sinTildes.split(/\s+/).filter(Boolean).sort().join(' ');
}

// Elige qué variante de nombre mostrar cuando hay varias para la misma
// persona: prioriza la que viene en mayúsculas (formato oficial del curso).
function pickDisplayName_(actual, candidato) {
  if (!actual) return candidato;
  // Un candidato vacío ('' === ''.toUpperCase() es true) no debe poder
  // reemplazar un nombre ya guardado — un envío con d.nombre vacío no
  // debe borrar el nombre real del estudiante en Estadísticas.
  if (!candidato) return actual;
  const actualEsMayus = actual === actual.toUpperCase();
  if (!actualEsMayus && candidato === candidato.toUpperCase()) return candidato;
  return actual;
}

// ── Normaliza la columna "Fecha" a texto 'yyyy-MM-dd' ────────────────────
// Igual que con Curso (ver más abajo), Sheets puede guardar un texto tipo
// fecha ISO como un objeto Date real en vez de como String al escribirlo
// vía setValues(). Sin esto, comparar r[1] contra FECHA_INICIO_PERIODO /
// FECHA_FIN_PERIODO (strings) sería comparar un Date con un String y daría
// resultados incorrectos.
function toISODate_(v) {
  if (v instanceof Date) {
    return Utilities.formatDate(v, Session.getScriptTimeZone(), 'yyyy-MM-dd');
  }
  return String(v || '');
}

// ── Calcula la nota de juego (0-5) a partir de los % de acierto de las ──
// sesiones jugadas dentro del periodo.
// - Si jugó SESIONES_ESPERADAS veces o menos: se divide entre
//   SESIONES_ESPERADAS, así que lo que falte por jugar cuenta como 0.
// - Si jugó MÁS de SESIONES_ESPERADAS veces: se divide entre el número
//   real de sesiones jugadas (promedio total de todas, sin tope) — no se
//   descarta ninguna sesión.
function calcularNotaJuego_(porcentajesEnPeriodo) {
  const notas = porcentajesEnPeriodo.map(pct => pct / 20); // 100% de acierto → 5.0
  const divisor = Math.max(SESIONES_ESPERADAS, notas.length);
  const suma = notas.reduce((a, b) => a + b, 0);
  return Math.round((suma / divisor) * 10) / 10;
}

// ── Colapsa filas duplicadas del mismo código de sesión ─────────────────
// Filas ya existentes en el Registro (guardadas ANTES del fix de upsert en
// appendRow) pueden tener el mismo código de sesión repetido varias veces
// ("inicio" + "fin_partida" + reintentos). Antes de calcular Estadísticas,
// nos quedamos con una sola fila por código de sesión — la de mayor
// 'Total' (la más completa) — para que esas sesiones ya guardadas no se
// cuenten dos o más veces. Filas sin código de sesión (registros muy
// antiguos) se conservan tal cual, ya que no hay forma de fusionarlas.
function dedupeBySesion_(data) {
  const bySesion = new Map();
  const sinSesion = [];
  data.forEach(r => {
    const sesion = r[6];
    if (!sesion) { sinSesion.push(r); return; }
    const prev = bySesion.get(sesion);
    if (!prev || (Number(r[8]) || 0) > (Number(prev[8]) || 0)) {
      bySesion.set(sesion, r);
    }
  });
  return [...bySesion.values(), ...sinSesion];
}

// ── Función de un clic: fuerza el recálculo de Estadísticas ahora mismo ──
// Ejecútala manualmente desde el editor de Apps Script (▶ Ejecutar, eligiendo
// "recalcularAhora") para aplicar la deduplicación a los datos que YA están
// en el Registro, sin esperar a que otro estudiante juegue.
// OJO: esto solo recalcula "Estadísticas" y las hojas "Curso X" — NO borra
// las filas duplicadas de "Registro" (esa hoja es la bitácora cruda). Para
// eso usar limpiarRegistroDuplicados().
function recalcularAhora() {
  const ss = getOrCreateSpreadsheet();
  updateStats(ss);
}

// ── Actualización automática (sin tener que ejecutar recalcularAhora) ──
// doPost() YA NO recalcula Estadísticas en cada partida (ver el comentario
// en doPost más arriba — se quitó por sobrecarga con clases completas
// jugando a la vez). Este disparador de tiempo es ahora la única forma en
// que Estadísticas se mantiene al día sola, cada 30 minutos, sin depender
// de que alguien juegue o de que el profesor entre a ejecutar nada
// manualmente (recalcularAhora() sigue disponible para forzarlo al
// instante cuando se necesite).
const NOMBRE_FUNCION_AUTO = 'actualizarEstadisticasAutomatico';

function actualizarEstadisticasAutomatico() {
  const ss = getOrCreateSpreadsheet();
  updateStats(ss);
}

// ── Ejecutar UNA SOLA VEZ desde el editor para instalar el disparador ───
// automático de arriba. Es idempotente: si ya existe un disparador para
// actualizarEstadisticasAutomatico lo reemplaza en vez de duplicarlo (el
// mismo tipo de duplicado que ya nos dio problemas con las sesiones, pero
// aquí con disparadores de Apps Script).
function instalarActualizacionAutomatica() {
  ScriptApp.getProjectTriggers()
    .filter(t => t.getHandlerFunction() === NOMBRE_FUNCION_AUTO)
    .forEach(t => ScriptApp.deleteTrigger(t));

  ScriptApp.newTrigger(NOMBRE_FUNCION_AUTO)
    .timeBased()
    .everyMinutes(30)
    .create();

  return 'Disparador automático instalado: Estadísticas se recalculará sola cada 30 minutos.';
}

// ── Función de un clic: borra en "Registro" las filas duplicadas ────────
// por código de sesión, dejando solo la más completa (mayor 'Total') de
// cada sesión. A diferencia de recalcularAhora(), esta SÍ modifica
// permanentemente la hoja "Registro" (elimina filas). Úsala una sola vez
// para limpiar el historial acumulado antes del fix de appendRow; una vez
// que la Web App esté redesplegada con la versión nueva del código, no
// debería volver a generar duplicados nuevos.
// Ejecútala desde el editor: selecciona "limpiarRegistroDuplicados" y ▶.
function limpiarRegistroDuplicados() {
  const ss = getOrCreateSpreadsheet();
  const sh = ss.getSheetByName(SHEET_REGISTRO);
  if (!sh || sh.getLastRow() < 3) return 'Nada que limpiar.';

  const numRows = sh.getLastRow() - 1;
  const values = sh.getRange(2, 1, numRows, HEADERS.length).getValues();

  // Para cada código de sesión, se guarda el índice (dentro de `values`)
  // de la fila con mayor 'Total' — esa es la que se conserva.
  const bestIndexBySesion = new Map();
  values.forEach((r, i) => {
    const sesion = r[6];
    if (!sesion) return; // sin código de sesión: se conserva, no se toca
    const total = Number(r[8]) || 0;
    const bestIdx = bestIndexBySesion.get(sesion);
    if (bestIdx === undefined || total > (Number(values[bestIdx][8]) || 0)) {
      bestIndexBySesion.set(sesion, i);
    }
  });
  const keepIndexes = new Set(bestIndexBySesion.values());

  // El resto de filas que sí tienen sesión pero no son la "mejor" se borran.
  const rowsToDelete = [];
  values.forEach((r, i) => {
    if (r[6] && !keepIndexes.has(i)) rowsToDelete.push(i);
  });

  // De abajo hacia arriba para no desfasar los números de fila al borrar.
  rowsToDelete.sort((a, b) => b - a).forEach(i => sh.deleteRow(i + 2));

  updateStats(ss);
  return 'Filas eliminadas: ' + rowsToDelete.length;
}

// ── Función de diagnóstico: lista los valores reales de "Curso" ─────────
// que hay en Registro y cuántas filas tiene cada uno, tal cual están
// guardados (sin normalizar). Si un curso como "1006" aparece con muy
// pocas filas comparado con lo esperado, esto ayuda a ver si el problema
// es que casi no ha jugado nadie de ese curso, o si sus filas quedaron
// guardadas con un valor de Curso distinto (espacios de más, mayúsculas,
// número en vez de texto, etc.) que no coincide con "1006".
// Ejecutar desde el editor (▶, eligiendo "diagnosticoCursos") y revisar el
// resultado en Ver → Registros de ejecución (o el valor que devuelve).
function diagnosticoCursos() {
  const ss = getOrCreateSpreadsheet();
  const reg = ss.getSheetByName(SHEET_REGISTRO);
  if (!reg || reg.getLastRow() < 2) return 'Registro vacío.';

  const data = reg.getRange(2, 1, reg.getLastRow() - 1, HEADERS.length).getValues();
  const counts = {};
  data.forEach(r => {
    const raw = r[4];
    const key = JSON.stringify(raw) + '  (tipo: ' + typeof raw + ')';
    counts[key] = (counts[key] || 0) + 1;
  });

  const lines = Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .map(([k, v]) => v + ' fila(s) → Curso = ' + k);

  const resultado = lines.join('\n');
  Logger.log(resultado);
  return resultado;
}

// ── Actualiza la hoja Estadísticas ─────────────────────────
// Envuelta en el MISMO LockService que appendRow(): sin esto, el
// disparador automático (cada 30 min) podía disparar updateStats() justo
// mientras varios estudiantes seguían enviando partidas (appendRow), y
// ambas cosas tocando la hoja de cálculo al mismo tiempo producía el
// error real de Google "Too many simultaneous invocations: Spreadsheets"
// (visible en la hoja "Errores") — que el frontend del estudiante mostraba
// como el mensaje genérico "Error al enviar. Verifica la URL del Apps
// Script.", sin relación real con la URL. Con el mismo lock, appendRow()
// y updateStats() quedan serializados: nunca corren a la vez.
function updateStats(ss) {
  const lock = LockService.getScriptLock();
  lock.waitLock(60000);
  try {
    updateStats_(ss);
  } finally {
    lock.releaseLock();
  }
}

function updateStats_(ss) {
  let sh = ss.getSheetByName(SHEET_STATS);
  const esNueva = !sh;
  if (esNueva) sh = ss.insertSheet(SHEET_STATS);
  sh.clearContents();
  sh.clearFormats();

  const reg = ss.getSheetByName(SHEET_REGISTRO);
  if (!reg || reg.getLastRow() < 2) return;

  const rawData = reg.getRange(2, 1, reg.getLastRow() - 1, HEADERS.length).getValues();
  const data = dedupeBySesion_(rawData);

  // Google Sheets puede guardar "Nombre"/"Curso" como número si alguna vez
  // se escribió un valor puramente numérico (p. ej. un código de curso como
  // 1101) — getValues() los devuelve como Number, no como String, y
  // .localeCompare() más abajo falla sobre un número. También normaliza
  // "Fecha" a texto 'yyyy-MM-dd' (ver toISODate_) para poder compararla con
  // el periodo de la nota de juego. Todo esto una sola vez, para todo lo
  // que use `data` de aquí en adelante.
  data.forEach(r => {
    r[1] = toISODate_(r[1]);
    r[3] = String(r[3] == null ? '' : r[3]);
    r[4] = String(r[4] == null ? '' : r[4]);
  });

  // Agrupación: por estudiante (nombre+curso), con nombre normalizado para
  // que variantes de mayúsculas/tildes/orden de la misma persona no se
  // cuenten como estudiantes distintos.
  const students = {};
  data.forEach(r => {
    const nombre  = r[3];
    const curso   = r[4];
    const nivel   = r[5];
    const fecha     = r[1];
    const correctas = Number(r[7]) || 0;
    const total     = Number(r[8]) || 0;
    const pct       = Number(r[9]) || 0;
    const key       = normalizeName_(nombre) + '||' + curso;
    if (!students[key]) students[key] = { nombre, curso, sesiones: 0, totalC: 0, totalT: 0, niveles: {}, notasPeriodo: [] };
    const s = students[key];
    s.nombre = pickDisplayName_(s.nombre, nombre);
    s.sesiones++;
    s.totalC += correctas;
    s.totalT += total;
    if (fecha >= FECHA_INICIO_PERIODO && fecha <= FECHA_FIN_PERIODO) s.notasPeriodo.push(pct);
    if (!s.niveles[nivel]) s.niveles[nivel] = { sesiones: 0, totalC: 0, totalT: 0 };
    s.niveles[nivel].sesiones++;
    s.niveles[nivel].totalC += correctas;
    s.niveles[nivel].totalT += total;
  });

  // ── Tabla resumen por estudiante ───────────────────────────
  const statsHeaders = ['Nombre','Curso','Sesiones','Preguntas respondidas','% Acierto global',
                        'Nota juego (0-5)',
                        'Hidrocarburos %','Compuestos Oxigenados %','Compuestos Nitrogenados %','Juego Completo %'];
  const nivelKeys = ['Hidrocarburos','Compuestos Oxigenados','Compuestos Nitrogenados','Juego Completo'];

  const rows = Object.values(students)
    .sort((a, b) => a.curso.localeCompare(b.curso) || a.nombre.localeCompare(b.nombre))
    .map(s => {
      const globalPct = s.totalT ? Math.round(s.totalC / s.totalT * 100) : 0;
      const notaJuego = calcularNotaJuego_(s.notasPeriodo);
      const nivelPcts = nivelKeys.map(nk => {
        const nd = s.niveles[nk];
        return nd && nd.totalT ? Math.round(nd.totalC / nd.totalT * 100) : '';
      });
      return [s.nombre, s.curso, s.sesiones, s.totalT, globalPct, notaJuego, ...nivelPcts];
    });

  // Columnas porcentuales (para el color de fondo y formato "0%"): la
  // columna de Nota (índice 5, escala 0-5) queda fuera de esta lista, se
  // formatea aparte más abajo.
  writeSheetBatch(sh, statsHeaders, rows, [4,6,7,8,9]);
  if (rows.length) sh.getRange(2, 6, rows.length, 1).setNumberFormat('0.0');

  // Anchos: solo la primera vez que se crea la hoja — no cambian entre
  // ejecuciones y clearFormats() no los borra (es formato de celda, no
  // ancho de columna), así que fijarlos en cada recálculo es puro
  // desperdicio de llamadas a la API de Sheets. Menos llamadas = el
  // bloqueo compartido con appendRow() se libera más rápido.
  if (esNueva) {
    [200,120,80,180,120,110,160,200,200,120].forEach((w, i) => sh.setColumnWidth(i+1, w));
  }

  // ── Hoja resumen por tema (eficacia de la herramienta) ────
  // Envuelto en try/catch: un fallo aquí (o en una hoja de curso) no debe
  // impedir que las demás hojas de estadísticas terminen de actualizarse.
  try { updateTopicStats(ss, data); } catch (err) { logStatsError_(ss, 'updateTopicStats', err); }

  // ── Hojas individuales por curso ──────────────────────────
  const cursos = [...new Set(data.map(r => r[4]).filter(Boolean))];
  cursos.forEach(curso => {
    try { updateCursoSheet(ss, curso, data); }
    catch (err) { logStatsError_(ss, 'updateCursoSheet(' + curso + ')', err); }
  });
}

// ── Registra errores de actualización de estadísticas en una hoja visible ──
// (antes fallaban en silencio: doPost() atrapa cualquier excepción y el
// frontend solo revisa el status HTTP, nunca el cuerpo JSON de la respuesta,
// así que una falla aquí nunca se veía en ningún lado).
function logStatsError_(ss, where, err) {
  let sh = ss.getSheetByName('Errores');
  if (!sh) {
    sh = ss.insertSheet('Errores');
    sh.appendRow(['Timestamp', 'Función', 'Error']);
    sh.getRange(1,1,1,3).setBackground(COLOR.header).setFontColor(COLOR.hText).setFontWeight('bold');
    sh.setFrozenRows(1);
  }
  sh.appendRow([new Date(), where, String(err && err.message || err)]);
}

// ── Estadísticas por tema ──────────────────────────────────
function updateTopicStats(ss, data) {
  const SHEET_TOPICS = 'Eficacia por tema';
  let sh = ss.getSheetByName(SHEET_TOPICS);
  const esNueva = !sh;
  if (esNueva) sh = ss.insertSheet(SHEET_TOPICS);
  sh.clearContents(); sh.clearFormats();

  // Acumular desde los campos JSON
  const topicData = {};
  data.forEach(r => {
    let errTema = {}, okTema = {};
    try { errTema = JSON.parse(r[15]) || {}; } catch(e) {}
    try { okTema  = JSON.parse(r[16]) || {}; } catch(e) {}
    Object.entries(errTema).forEach(([t, v]) => {
      if (!topicData[t]) topicData[t] = { err: 0, ok: 0 };
      topicData[t].err += Number(v) || 0;
    });
    Object.entries(okTema).forEach(([t, v]) => {
      if (!topicData[t]) topicData[t] = { err: 0, ok: 0 };
      topicData[t].ok += Number(v) || 0;
    });
  });

  const sorted = Object.entries(topicData).sort((a,b) => {
    const totA = a[1].ok + a[1].err, totB = b[1].ok + b[1].err;
    return totB - totA;
  });

  const rows = sorted.map(([tema, d]) => {
    const tot = d.ok + d.err;
    const pct = tot ? Math.round(d.ok / tot * 100) : 0;
    return [tema, d.ok, d.err, tot, pct];
  });

  writeSheetBatch(sh, ['Tema','Correctas','Errores','Total intentos','% Acierto'], rows, [4]);

  if (esNueva) [200,100,100,140,100].forEach((w,i) => sh.setColumnWidth(i+1, w));
}

// ── Hoja individual por curso ──────────────────────────────
function updateCursoSheet(ss, curso, allData) {
  const shName = 'Curso ' + curso;
  let sh = ss.getSheetByName(shName);
  const esNueva = !sh;
  if (esNueva) sh = ss.insertSheet(shName);
  sh.clearContents(); sh.clearFormats();

  const cursoData = allData.filter(r => r[4] === curso);

  // Agrupación por nombre normalizado (ver normalizeName_)
  const students = {};
  cursoData.forEach(r => {
    const nombre = r[3];
    const fecha  = r[1] || '';
    const pct    = Number(r[9]) || 0;
    const key = normalizeName_(nombre);
    if (!students[key]) students[key] = { nombre, sesiones:0, totalC:0, totalT:0, lastDate:'', notasPeriodo: [] };
    const s = students[key];
    s.nombre = pickDisplayName_(s.nombre, nombre);
    s.sesiones++;
    s.totalC += Number(r[7]) || 0;
    s.totalT += Number(r[8]) || 0;
    if (fecha >= FECHA_INICIO_PERIODO && fecha <= FECHA_FIN_PERIODO) s.notasPeriodo.push(pct);
    if (fecha > s.lastDate) s.lastDate = fecha;
  });

  const rows = Object.values(students)
    .sort((a,b) => a.nombre.localeCompare(b.nombre))
    .map(s => {
      const pct = s.totalT ? Math.round(s.totalC / s.totalT * 100) : 0;
      const notaJuego = calcularNotaJuego_(s.notasPeriodo);
      return [s.nombre, s.sesiones, s.totalT, pct, notaJuego, s.lastDate];
    });

  writeSheetBatch(sh, ['Nombre','Sesiones','Preguntas respondidas','% Acierto','Nota juego (0-5)','Última sesión'], rows, [3]);
  if (rows.length) sh.getRange(2, 5, rows.length, 1).setNumberFormat('0.0');

  if (esNueva) [200,80,180,100,110,120].forEach((w,i) => sh.setColumnWidth(i+1, w));
}
