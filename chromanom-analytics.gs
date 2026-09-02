// ============================================================
//  Chromanom — Apps Script Analytics
//  Desplegar como: Aplicación web → Cualquier usuario
//  Método de acceso: Cualquier persona
// ============================================================

const SPREADSHEET_NAME = 'Chromanom — Registro de estudiantes';
const SHEET_REGISTRO   = 'Registro';
const SHEET_STATS      = 'Estadísticas';

// ── Cabeceras del Registro ──────────────────────────────────
const HEADERS = [
  'Timestamp','Fecha','Hora','Nombre','Curso','Nivel','Sesión',
  'Correctas','Total','% Acierto',
  'Errores MC','Errores Drag','Errores ID','Errores Write',
  'Tiempo agotado',
  'Errores por tema','Aciertos por tema','Moléculas falladas',
  'Trigger'
];

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
function doPost(e) {
  try {
    const raw  = e.postData ? e.postData.contents : '{}';
    const data = JSON.parse(raw);

    const ss   = getOrCreateSpreadsheet();
    appendRow(ss, data);
    updateStats(ss);

    return ContentService
      .createTextOutput(JSON.stringify({ ok: true }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ ok: false, error: err.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// ── Punto de entrada HTTP GET (diagnóstico) ─────────────────
function doGet() {
  return ContentService
    .createTextOutput('Chromanom Analytics — activo ✓')
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
  for (let i = 0; i < col.length; i++) {
    if (col[i][0] === sesion) return i + 2;
  }
  return -1;
}

// ── Añade o actualiza (upsert) la fila del Registro para una sesión ────
function appendRow(ss, d) {
  let sh = ss.getSheetByName(SHEET_REGISTRO);
  if (!sh) {
    sh = ss.insertSheet(SHEET_REGISTRO);
    initRegistroSheet(sh);
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
  ];

  const targetRow = existingRow > 0 ? existingRow : sh.getLastRow() + 1;
  sh.getRange(targetRow, 1, 1, HEADERS.length).setValues([row]);

  // Color de fila según % acierto
  sh.getRange(targetRow, 1, 1, HEADERS.length).setBackground(colorForPct(pct));

  // Formato % (columna 10)
  sh.getRange(targetRow, 10).setNumberFormat('0"%"');
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
  const actualEsMayus = actual === actual.toUpperCase();
  if (!actualEsMayus && candidato === candidato.toUpperCase()) return candidato;
  return actual;
}

// ── Actualiza la hoja Estadísticas ─────────────────────────
function updateStats(ss) {
  let sh = ss.getSheetByName(SHEET_STATS);
  if (!sh) sh = ss.insertSheet(SHEET_STATS);
  sh.clearContents();
  sh.clearFormats();

  const reg = ss.getSheetByName(SHEET_REGISTRO);
  if (!reg || reg.getLastRow() < 2) return;

  const data = reg.getRange(2, 1, reg.getLastRow() - 1, HEADERS.length).getValues();

  // Agrupación: por estudiante (nombre+curso), con nombre normalizado para
  // que variantes de mayúsculas/tildes/orden de la misma persona no se
  // cuenten como estudiantes distintos.
  const students = {};
  data.forEach(r => {
    const nombre  = r[3];
    const curso   = r[4];
    const nivel   = r[5];
    const correctas = Number(r[7]) || 0;
    const total     = Number(r[8]) || 0;
    const key       = normalizeName_(nombre) + '||' + curso;
    if (!students[key]) students[key] = { nombre, curso, sesiones: 0, totalC: 0, totalT: 0, niveles: {} };
    const s = students[key];
    s.nombre = pickDisplayName_(s.nombre, nombre);
    s.sesiones++;
    s.totalC += correctas;
    s.totalT += total;
    if (!s.niveles[nivel]) s.niveles[nivel] = { sesiones: 0, totalC: 0, totalT: 0 };
    s.niveles[nivel].sesiones++;
    s.niveles[nivel].totalC += correctas;
    s.niveles[nivel].totalT += total;
  });

  // ── Tabla resumen por estudiante ───────────────────────────
  const statsHeaders = ['Nombre','Curso','Sesiones','Preguntas respondidas','% Acierto global',
                        'Hidrocarburos %','Compuestos Oxigenados %','Compuestos Nitrogenados %','Juego Completo %'];
  const nivelKeys = ['Hidrocarburos','Compuestos Oxigenados','Compuestos Nitrogenados','Juego Completo'];

  const rows = Object.values(students)
    .sort((a, b) => a.curso.localeCompare(b.curso) || a.nombre.localeCompare(b.nombre))
    .map(s => {
      const globalPct = s.totalT ? Math.round(s.totalC / s.totalT * 100) : 0;
      const nivelPcts = nivelKeys.map(nk => {
        const nd = s.niveles[nk];
        return nd && nd.totalT ? Math.round(nd.totalC / nd.totalT * 100) : '';
      });
      return [s.nombre, s.curso, s.sesiones, s.totalT, globalPct, ...nivelPcts];
    });

  writeSheetBatch(sh, statsHeaders, rows, [4,5,6,7,8]);

  // Anchos
  [200,120,80,180,120,160,200,200,120].forEach((w, i) => sh.setColumnWidth(i+1, w));

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
  if (!sh) sh = ss.insertSheet(SHEET_TOPICS);
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

  [200,100,100,140,100].forEach((w,i) => sh.setColumnWidth(i+1, w));
}

// ── Hoja individual por curso ──────────────────────────────
function updateCursoSheet(ss, curso, allData) {
  const shName = 'Curso ' + curso;
  let sh = ss.getSheetByName(shName);
  if (!sh) sh = ss.insertSheet(shName);
  sh.clearContents(); sh.clearFormats();

  const cursoData = allData.filter(r => r[4] === curso);

  // Agrupación por nombre normalizado (ver normalizeName_)
  const students = {};
  cursoData.forEach(r => {
    const nombre = r[3];
    const key = normalizeName_(nombre);
    if (!students[key]) students[key] = { nombre, sesiones:0, totalC:0, totalT:0, lastDate:'' };
    const s = students[key];
    s.nombre = pickDisplayName_(s.nombre, nombre);
    s.sesiones++;
    s.totalC += Number(r[7]) || 0;
    s.totalT += Number(r[8]) || 0;
    const fecha = r[1] || '';
    if (fecha > s.lastDate) s.lastDate = fecha;
  });

  const rows = Object.values(students)
    .sort((a,b) => a.nombre.localeCompare(b.nombre))
    .map(s => {
      const pct = s.totalT ? Math.round(s.totalC / s.totalT * 100) : 0;
      return [s.nombre, s.sesiones, s.totalT, pct, s.lastDate];
    });

  writeSheetBatch(sh, ['Nombre','Sesiones','Preguntas respondidas','% Acierto','Última sesión'], rows, [3]);

  [200,80,180,100,120].forEach((w,i) => sh.setColumnWidth(i+1, w));
}
