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
  'Timestamp','Fecha','Hora','Nombre','Código','Curso','Nivel','Sesión',
  'Correctas','Total','% Acierto',
  'Errores MC','Errores Drag','Errores ID','Errores Write','Errores Constructor',
  'Tiempo agotado',
  'Errores por tema','Aciertos por tema','Moléculas falladas',
  'Trigger'
];

// ── Índices de columna (0-based) ────────────────────────────
const C = {
  TIMESTAMP : 0,
  FECHA     : 1,
  HORA      : 2,
  NOMBRE    : 3,
  CODIGO    : 4,
  CURSO     : 5,
  NIVEL     : 6,
  SESION    : 7,
  CORRECTAS : 8,
  TOTAL     : 9,
  PCT       : 10,
  ERR_MC    : 11,
  ERR_DRAG  : 12,
  ERR_ID    : 13,
  ERR_WRITE : 14,
  ERR_BUILD : 15,
  TIMEOUTS  : 16,
  ERR_TEMA  : 17,
  OK_TEMA   : 18,
  MOL_FALL  : 19,
  TRIGGER   : 20,
};

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
  sh.setColumnWidth(5,  90);   // Código
  sh.setColumnWidth(6,  100);  // Curso
  sh.setColumnWidth(7,  150);  // Nivel
  sh.setColumnWidth(18, 250);  // Errores por tema
  sh.setColumnWidth(19, 250);  // Aciertos por tema
  sh.setColumnWidth(20, 350);  // Moléculas falladas
}

// ── Añade una fila al Registro ──────────────────────────────
function appendRow(ss, d) {
  let sh = ss.getSheetByName(SHEET_REGISTRO);
  if (!sh) {
    sh = ss.insertSheet(SHEET_REGISTRO);
    initRegistroSheet(sh);
  }

  const pct = d.pct !== undefined ? d.pct : (d.total ? Math.round(d.correctas / d.total * 100) : 0);

  const row = [
    new Date(),                                          // Timestamp
    d.fecha        || '',                               // Fecha
    d.hora         || '',                               // Hora
    d.nombre       || '',                               // Nombre
    d.codigo       || '',                               // Código
    d.curso        || '',                               // Curso
    d.nivel        || '',                               // Nivel
    d.sesion       || '',                               // Sesión
    d.correctas    !== undefined ? d.correctas : '',    // Correctas
    d.total        !== undefined ? d.total     : '',    // Total
    pct,                                                // % Acierto
    d.errores_mc    !== undefined ? d.errores_mc    : '',
    d.errores_drag  !== undefined ? d.errores_drag  : '',
    d.errores_id    !== undefined ? d.errores_id    : '',
    d.errores_write !== undefined ? d.errores_write : '',
    d.errores_build !== undefined ? d.errores_build : '',
    d.timeouts      !== undefined ? d.timeouts      : '',
    typeof d.errores_por_tema  === 'object' ? JSON.stringify(d.errores_por_tema)  : (d.errores_por_tema  || ''),
    typeof d.aciertos_por_tema === 'object' ? JSON.stringify(d.aciertos_por_tema) : (d.aciertos_por_tema || ''),
    Array.isArray(d.moleculas_falladas) ? d.moleculas_falladas : (d.moleculas_falladas || ''),
    d.trigger || '',
  ];

  const lastRow = sh.getLastRow() + 1;
  sh.appendRow(row);

  const bgColor = pct >= 90 ? COLOR.green
                : pct >= 70 ? COLOR.blue
                : pct >= 50 ? COLOR.yellow
                :             COLOR.red;
  sh.getRange(lastRow, 1, 1, HEADERS.length).setBackground(bgColor);
  sh.getRange(lastRow, C.PCT + 1).setNumberFormat('0"%"');
}

// ── Actualiza todas las hojas de estadísticas ───────────────
function updateStats(ss) {
  let sh = ss.getSheetByName(SHEET_STATS);
  if (!sh) sh = ss.insertSheet(SHEET_STATS);
  sh.clearContents();
  sh.clearFormats();

  const reg = ss.getSheetByName(SHEET_REGISTRO);
  if (!reg || reg.getLastRow() < 2) return;

  const data = reg.getRange(2, 1, reg.getLastRow() - 1, HEADERS.length).getValues();

  // Agrupación por estudiante (nombre+curso)
  const students = {};
  data.forEach(r => {
    const nombre = r[C.NOMBRE];
    const codigo = r[C.CODIGO];
    const curso  = r[C.CURSO];
    const nivel  = r[C.NIVEL];
    const correctas = Number(r[C.CORRECTAS]) || 0;
    const total     = Number(r[C.TOTAL])     || 0;
    const key = nombre + '||' + curso;
    if (!students[key]) students[key] = { nombre, codigo, curso, sesiones: 0, totalC: 0, totalT: 0, niveles: {}, topicErr: {}, topicOk: {} };
    const s = students[key];
    s.sesiones++;
    s.totalC += correctas;
    s.totalT += total;
    if (!s.niveles[nivel]) s.niveles[nivel] = { sesiones: 0, totalC: 0, totalT: 0 };
    s.niveles[nivel].sesiones++;
    s.niveles[nivel].totalC += correctas;
    s.niveles[nivel].totalT += total;
    _accumulateTema(r[C.ERR_TEMA], r[C.OK_TEMA], s.topicErr, s.topicOk);
  });

  // ── Tabla resumen por estudiante ───────────────────────────
  const statsHeaders = [
    'Nombre','Código','Curso','Sesiones','Preguntas respondidas','% Acierto global',
    'Hidrocarburos %','Compuestos Oxigenados %','Compuestos Nitrogenados %','Juego Completo %',
    'Tema más débil'
  ];
  sh.appendRow(statsHeaders);
  sh.getRange(1, 1, 1, statsHeaders.length)
    .setBackground(COLOR.header).setFontColor(COLOR.hText).setFontWeight('bold');
  sh.setFrozenRows(1);

  const nivelKeys = ['Hidrocarburos','Compuestos Oxigenados','Compuestos Nitrogenados','Juego Completo'];

  let row = 2;
  Object.values(students)
    .sort((a, b) => a.curso.localeCompare(b.curso) || a.nombre.localeCompare(b.nombre))
    .forEach(s => {
      const globalPct = s.totalT ? Math.round(s.totalC / s.totalT * 100) : 0;
      const nivelPcts = nivelKeys.map(nk => {
        const nd = s.niveles[nk];
        return nd && nd.totalT ? Math.round(nd.totalC / nd.totalT * 100) : '';
      });
      const weakTopic = _weakestTopic(s.topicErr, s.topicOk);
      sh.appendRow([s.nombre, s.codigo, s.curso, s.sesiones, s.totalT, globalPct, ...nivelPcts, weakTopic]);

      const bgColor = globalPct >= 90 ? COLOR.green
                    : globalPct >= 70 ? COLOR.blue
                    : globalPct >= 50 ? COLOR.yellow
                    :                   COLOR.red;
      sh.getRange(row, 1, 1, statsHeaders.length).setBackground(bgColor);
      sh.getRange(row, 6).setNumberFormat('0"%"');
      [7,8,9,10].forEach(c => {
        if (sh.getRange(row, c).getValue() !== '') sh.getRange(row, c).setNumberFormat('0"%"');
      });
      row++;
    });

  [200,90,120,80,180,120,150,200,200,120,200].forEach((w, i) => sh.setColumnWidth(i+1, w));

  // ── Resumen por curso (vista del profesor) ─────────────────
  updateResumenCursos(ss, data);

  // ── Hoja por tema (eficacia de la herramienta) ────────────
  updateTopicStats(ss, data);

  // ── Hojas individuales por curso ──────────────────────────
  const cursos = [...new Set(data.map(r => r[C.CURSO]).filter(Boolean))];
  cursos.forEach(curso => updateCursoSheet(ss, curso, data));
}

// ── Resumen consolidado por curso (para el profesor) ────────
function updateResumenCursos(ss, data) {
  const SHEET_CURSOS = 'Resumen por Curso';
  let sh = ss.getSheetByName(SHEET_CURSOS);
  if (!sh) sh = ss.insertSheet(SHEET_CURSOS, 1);
  sh.clearContents(); sh.clearFormats();

  const cursoMap = {};
  data.forEach(r => {
    const curso     = r[C.CURSO];
    const nombre    = r[C.NOMBRE];
    const correctas = Number(r[C.CORRECTAS]) || 0;
    const total     = Number(r[C.TOTAL])     || 0;
    if (!curso) return;
    if (!cursoMap[curso]) cursoMap[curso] = { estudiantes: new Set(), sesiones: 0, totalC: 0, totalT: 0, topicErr: {}, topicOk: {} };
    const c = cursoMap[curso];
    c.estudiantes.add(nombre);
    c.sesiones++;
    c.totalC += correctas;
    c.totalT += total;
    _accumulateTema(r[C.ERR_TEMA], r[C.OK_TEMA], c.topicErr, c.topicOk);
  });

  const headers = ['Curso','Estudiantes activos','Sesiones totales','Preguntas respondidas','% Acierto promedio','Tema más débil','Tema más fuerte'];
  sh.appendRow(headers);
  sh.getRange(1, 1, 1, headers.length)
    .setBackground(COLOR.header).setFontColor(COLOR.hText).setFontWeight('bold');
  sh.setFrozenRows(1);

  let row = 2;
  Object.entries(cursoMap)
    .sort((a, b) => a[0].localeCompare(b[0]))
    .forEach(([curso, c]) => {
      const pct       = c.totalT ? Math.round(c.totalC / c.totalT * 100) : 0;
      const weakTopic = _weakestTopic(c.topicErr, c.topicOk);
      const strongTopic = _strongestTopic(c.topicErr, c.topicOk);
      sh.appendRow([curso, c.estudiantes.size, c.sesiones, c.totalT, pct, weakTopic, strongTopic]);
      const bg = pct >= 90 ? COLOR.green : pct >= 70 ? COLOR.blue : pct >= 50 ? COLOR.yellow : COLOR.red;
      sh.getRange(row, 1, 1, headers.length).setBackground(bg);
      sh.getRange(row, 5).setNumberFormat('0"%"');
      row++;
    });

  [120,150,130,180,150,220,220].forEach((w, i) => sh.setColumnWidth(i+1, w));
}

// ── Estadísticas por tema ──────────────────────────────────
function updateTopicStats(ss, data) {
  const SHEET_TOPICS = 'Eficacia por tema';
  let sh = ss.getSheetByName(SHEET_TOPICS);
  if (!sh) sh = ss.insertSheet(SHEET_TOPICS);
  sh.clearContents(); sh.clearFormats();

  const topicData = {};
  data.forEach(r => {
    let errTema = {}, okTema = {};
    try { errTema = JSON.parse(r[C.ERR_TEMA]) || {}; } catch(e) {}
    try { okTema  = JSON.parse(r[C.OK_TEMA])  || {}; } catch(e) {}
    Object.entries(errTema).forEach(([t, v]) => {
      if (!topicData[t]) topicData[t] = { err: 0, ok: 0 };
      topicData[t].err += Number(v) || 0;
    });
    Object.entries(okTema).forEach(([t, v]) => {
      if (!topicData[t]) topicData[t] = { err: 0, ok: 0 };
      topicData[t].ok += Number(v) || 0;
    });
  });

  sh.appendRow(['Tema','Correctas','Errores','Total intentos','% Acierto']);
  sh.getRange(1,1,1,5).setBackground(COLOR.header).setFontColor(COLOR.hText).setFontWeight('bold');
  sh.setFrozenRows(1);

  const sorted = Object.entries(topicData).sort((a, b) => {
    return (b[1].ok + b[1].err) - (a[1].ok + a[1].err);
  });

  let row = 2;
  sorted.forEach(([tema, d]) => {
    const tot = d.ok + d.err;
    const pct = tot ? Math.round(d.ok / tot * 100) : 0;
    sh.appendRow([tema, d.ok, d.err, tot, pct]);
    const bg = pct >= 90 ? COLOR.green : pct >= 70 ? COLOR.blue : pct >= 50 ? COLOR.yellow : COLOR.red;
    sh.getRange(row, 1, 1, 5).setBackground(bg);
    sh.getRange(row, 5).setNumberFormat('0"%"');
    row++;
  });

  [200,100,100,140,100].forEach((w,i) => sh.setColumnWidth(i+1, w));
}

// ── Hoja individual por curso ──────────────────────────────
function updateCursoSheet(ss, curso, allData) {
  const shName = 'Curso ' + curso;
  let sh = ss.getSheetByName(shName);
  if (!sh) sh = ss.insertSheet(shName);
  sh.clearContents(); sh.clearFormats();

  const cursoData = allData.filter(r => r[C.CURSO] === curso);

  sh.appendRow(['Nombre','Código','Sesiones','Preguntas respondidas','% Acierto','Última sesión','Tema más débil']);
  sh.getRange(1,1,1,7).setBackground(COLOR.header).setFontColor(COLOR.hText).setFontWeight('bold');
  sh.setFrozenRows(1);

  const students = {};
  cursoData.forEach(r => {
    const nombre = r[C.NOMBRE];
    const codigo = r[C.CODIGO];
    if (!students[nombre]) students[nombre] = { codigo, sesiones:0, totalC:0, totalT:0, lastDate:'', topicErr:{}, topicOk:{} };
    const s = students[nombre];
    s.sesiones++;
    s.totalC += Number(r[C.CORRECTAS]) || 0;
    s.totalT += Number(r[C.TOTAL])     || 0;
    const fecha = r[C.FECHA] || '';
    if (fecha > s.lastDate) s.lastDate = fecha;
    _accumulateTema(r[C.ERR_TEMA], r[C.OK_TEMA], s.topicErr, s.topicOk);
  });

  let row = 2;
  Object.entries(students).sort((a,b) => a[0].localeCompare(b[0])).forEach(([nombre, s]) => {
    const pct = s.totalT ? Math.round(s.totalC / s.totalT * 100) : 0;
    const weakTopic = _weakestTopic(s.topicErr, s.topicOk);
    sh.appendRow([nombre, s.codigo, s.sesiones, s.totalT, pct, s.lastDate, weakTopic]);
    const bg = pct >= 90 ? COLOR.green : pct >= 70 ? COLOR.blue : pct >= 50 ? COLOR.yellow : COLOR.red;
    sh.getRange(row,1,1,7).setBackground(bg);
    sh.getRange(row,5).setNumberFormat('0"%"');
    row++;
  });

  [200,90,80,180,100,120,220].forEach((w,i) => sh.setColumnWidth(i+1, w));
}

// ── Helpers ─────────────────────────────────────────────────
function _accumulateTema(errJson, okJson, errAcc, okAcc) {
  let errTema = {}, okTema = {};
  try { errTema = JSON.parse(errJson) || {}; } catch(e) {}
  try { okTema  = JSON.parse(okJson)  || {}; } catch(e) {}
  Object.entries(errTema).forEach(([t, v]) => { errAcc[t] = (errAcc[t] || 0) + (Number(v) || 0); });
  Object.entries(okTema).forEach( ([t, v]) => { okAcc[t]  = (okAcc[t]  || 0) + (Number(v) || 0); });
}

function _weakestTopic(errAcc, okAcc) {
  const all = new Set([...Object.keys(errAcc), ...Object.keys(okAcc)]);
  let worst = '', worstPct = Infinity;
  all.forEach(t => {
    const err = errAcc[t] || 0, ok = okAcc[t] || 0, tot = err + ok;
    if (tot < 3) return;
    const pct = ok / tot;
    if (pct < worstPct) { worstPct = pct; worst = t; }
  });
  return worst;
}

function _strongestTopic(errAcc, okAcc) {
  const all = new Set([...Object.keys(errAcc), ...Object.keys(okAcc)]);
  let best = '', bestPct = -1;
  all.forEach(t => {
    const err = errAcc[t] || 0, ok = okAcc[t] || 0, tot = err + ok;
    if (tot < 3) return;
    const pct = ok / tot;
    if (pct > bestPct) { bestPct = pct; best = t; }
  });
  return best;
}
