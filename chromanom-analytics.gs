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

// ── Añade una fila al Registro ──────────────────────────────
function appendRow(ss, d) {
  let sh = ss.getSheetByName(SHEET_REGISTRO);
  if (!sh) {
    sh = ss.insertSheet(SHEET_REGISTRO);
    initRegistroSheet(sh);
  }

  const pct = d.pct !== undefined ? d.pct : (d.total ? Math.round(d.correctas / d.total * 100) : 0);

  const row = [
    new Date(),                                     // Timestamp
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

  const lastRow = sh.getLastRow() + 1;
  sh.appendRow(row);

  // Color de fila según % acierto
  const bgColor = pct >= 90 ? COLOR.green
                : pct >= 70 ? COLOR.blue
                : pct >= 50 ? COLOR.yellow
                :             COLOR.red;
  sh.getRange(lastRow, 1, 1, HEADERS.length).setBackground(bgColor);

  // Formato % (columna 10)
  sh.getRange(lastRow, 10).setNumberFormat('0"%"');
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

  // Agrupación: por estudiante (nombre+curso)
  const students = {};
  data.forEach(r => {
    const nombre  = r[3];
    const curso   = r[4];
    const nivel   = r[5];
    const correctas = Number(r[7]) || 0;
    const total     = Number(r[8]) || 0;
    const pct       = Number(r[9]) || 0;
    const key       = nombre + '||' + curso;
    if (!students[key]) students[key] = { nombre, curso, sesiones: 0, totalC: 0, totalT: 0, niveles: {} };
    const s = students[key];
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
  sh.appendRow(statsHeaders);
  const hRange = sh.getRange(1, 1, 1, statsHeaders.length);
  hRange.setBackground(COLOR.header).setFontColor(COLOR.hText).setFontWeight('bold');
  sh.setFrozenRows(1);

  const nivelKeys = ['Hidrocarburos','Compuestos Oxigenados','Compuestos Nitrogenados','Juego Completo'];

  let row = 2;
  Object.values(students).sort((a, b) => a.curso.localeCompare(b.curso) || a.nombre.localeCompare(b.nombre))
    .forEach(s => {
      const globalPct = s.totalT ? Math.round(s.totalC / s.totalT * 100) : 0;
      const nivelPcts = nivelKeys.map(nk => {
        const nd = s.niveles[nk];
        return nd && nd.totalT ? Math.round(nd.totalC / nd.totalT * 100) : '';
      });
      sh.appendRow([s.nombre, s.curso, s.sesiones, s.totalT, globalPct, ...nivelPcts]);

      const bgColor = globalPct >= 90 ? COLOR.green
                    : globalPct >= 70 ? COLOR.blue
                    : globalPct >= 50 ? COLOR.yellow
                    :                   COLOR.red;
      sh.getRange(row, 1, 1, statsHeaders.length).setBackground(bgColor);
      sh.getRange(row, 5).setNumberFormat('0"%"');
      [6,7,8,9].forEach(c => { if (sh.getRange(row, c).getValue() !== '') sh.getRange(row, c).setNumberFormat('0"%"'); });
      row++;
    });

  // Anchos
  [200,120,80,180,120,160,200,200,120].forEach((w, i) => sh.setColumnWidth(i+1, w));

  // ── Hoja resumen por tema (eficacia de la herramienta) ────
  updateTopicStats(ss, data);

  // ── Hojas individuales por curso ──────────────────────────
  const cursos = [...new Set(data.map(r => r[4]).filter(Boolean))];
  cursos.forEach(curso => updateCursoSheet(ss, curso, data));
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

  sh.appendRow(['Tema','Correctas','Errores','Total intentos','% Acierto']);
  sh.getRange(1,1,1,5).setBackground(COLOR.header).setFontColor(COLOR.hText).setFontWeight('bold');
  sh.setFrozenRows(1);

  const sorted = Object.entries(topicData).sort((a,b) => {
    const totA = a[1].ok + a[1].err, totB = b[1].ok + b[1].err;
    return totB - totA;
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

  const cursoData = allData.filter(r => r[4] === curso);

  sh.appendRow(['Nombre','Sesiones','Preguntas respondidas','% Acierto','Última sesión']);
  sh.getRange(1,1,1,5).setBackground(COLOR.header).setFontColor(COLOR.hText).setFontWeight('bold');
  sh.setFrozenRows(1);

  // Agrupación por nombre
  const students = {};
  cursoData.forEach(r => {
    const nombre = r[3];
    if (!students[nombre]) students[nombre] = { sesiones:0, totalC:0, totalT:0, lastDate:'' };
    const s = students[nombre];
    s.sesiones++;
    s.totalC += Number(r[7]) || 0;
    s.totalT += Number(r[8]) || 0;
    const fecha = r[1] || '';
    if (fecha > s.lastDate) s.lastDate = fecha;
  });

  let row = 2;
  Object.entries(students).sort((a,b) => a[0].localeCompare(b[0])).forEach(([nombre, s]) => {
    const pct = s.totalT ? Math.round(s.totalC / s.totalT * 100) : 0;
    sh.appendRow([nombre, s.sesiones, s.totalT, pct, s.lastDate]);
    const bg = pct >= 90 ? COLOR.green : pct >= 70 ? COLOR.blue : pct >= 50 ? COLOR.yellow : COLOR.red;
    sh.getRange(row,1,1,5).setBackground(bg);
    sh.getRange(row,4).setNumberFormat('0"%"');
    row++;
  });

  [200,80,180,100,120].forEach((w,i) => sh.setColumnWidth(i+1, w));
}
