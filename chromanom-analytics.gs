// ============================================================
//  Chromanom — Apps Script Analytics  v2
//  Desplegar como: Aplicación web
//  Ejecutar como:  Tu cuenta
//  Acceso:         Cualquier persona (incluso anónima)
// ============================================================

const SPREADSHEET_ID   = '1PiLH_bdfmWBbYoOI9QpS7_RrtKhReQ0GaQ18CM9MghA';
const SHEET_REGISTRO   = 'Registro';
const SHEET_STATS      = 'Estadísticas';

// ── Cabeceras del Registro ──────────────────────────────────
const HEADERS = [
  'Timestamp','Fecha','Hora','Nombre','Curso','Nivel','Sesión',
  'Correctas','Total','% Acierto',
  'Errores MC','Errores Drag','Errores ID','Errores Write','Errores Build',
  'Tiempo agotado',
  'Errores por tema','Aciertos por tema','Moléculas falladas',
  'Anónimo','Trigger'
];

// Índices 0-based — actualiza aquí si cambias HEADERS
const C = {
  timestamp:0, fecha:1, hora:2, nombre:3, curso:4, nivel:5, sesion:6,
  correctas:7, total:8, pct:9,
  err_mc:10, err_drag:11, err_id:12, err_write:13, err_build:14,
  timeouts:15,
  err_tema:16, ok_tema:17, mols:18,
  anonimo:19, trigger:20
};

const COLOR = {
  header : '#1a1a2e',
  hText  : '#ffffff',
  green  : '#d9ead3',
  blue   : '#cfe2f3',
  yellow : '#fff2cc',
  red    : '#fce8e6',
};

// ── HTTP POST ───────────────────────────────────────────────
function doPost(e) {
  try {
    const raw  = e.postData ? e.postData.contents : '{}';
    const data = JSON.parse(raw);
    const ss   = getSpreadsheet();
    appendRow(ss, data);
    updateStats(ss);
    return jsonResponse({ ok: true });
  } catch (err) {
    return jsonResponse({ ok: false, error: err.message });
  }
}

// ── HTTP GET (diagnóstico) ──────────────────────────────────
function doGet() {
  return ContentService
    .createTextOutput('Chromanom Analytics v2 — activo ✓')
    .setMimeType(ContentService.MimeType.TEXT);
}

function jsonResponse(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

// ── Abre el spreadsheet por ID ──────────────────────────────
function getSpreadsheet() {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  if (!ss.getSheetByName(SHEET_REGISTRO)) {
    initRegistroSheet(ss.insertSheet(SHEET_REGISTRO));
  }
  return ss;
}

// ── Inicializa la hoja Registro con cabeceras y formato ─────
function initRegistroSheet(sh) {
  sh.setName(SHEET_REGISTRO);
  sh.appendRow(HEADERS);
  sh.getRange(1, 1, 1, HEADERS.length)
    .setBackground(COLOR.header)
    .setFontColor(COLOR.hText)
    .setFontWeight('bold');
  sh.setFrozenRows(1);

  const widths = [
    160, 90, 70, 180, 100, 150, 90,
    90, 70, 90,
    90, 90, 90, 90, 90,
    90,
    250, 250, 350,
    80, 100
  ];
  widths.forEach((w, i) => sh.setColumnWidth(i + 1, w));
}

// ── Añade una fila al Registro ──────────────────────────────
function appendRow(ss, d) {
  let sh = ss.getSheetByName(SHEET_REGISTRO);
  if (!sh) { sh = ss.insertSheet(SHEET_REGISTRO); initRegistroSheet(sh); }

  const pct = d.pct !== undefined
    ? d.pct
    : (d.total ? Math.round(d.correctas / d.total * 100) : 0);

  const safeJson = v =>
    (typeof v === 'object' && v !== null) ? JSON.stringify(v) : (v || '');
  const safeMols = v =>
    Array.isArray(v) ? v.join(', ') : (v || '');

  const row = [
    new Date(),
    d.fecha         ?? '',
    d.hora          ?? '',
    d.nombre        ?? '',
    d.curso         ?? '',
    d.nivel         ?? '',
    d.sesion        ?? '',
    d.correctas     ?? '',
    d.total         ?? '',
    pct,
    d.errores_mc    ?? '',
    d.errores_drag  ?? '',
    d.errores_id    ?? '',
    d.errores_write ?? '',
    d.errores_build ?? '',
    d.timeouts      ?? '',
    safeJson(d.errores_por_tema),
    safeJson(d.aciertos_por_tema),
    safeMols(d.moleculas_falladas),
    d.anonimo ? true : false,
    d.trigger       ?? '',
  ];

  const lastRow = sh.getLastRow() + 1;
  sh.appendRow(row);
  sh.getRange(lastRow, 1, 1, HEADERS.length).setBackground(rowColor(pct));
  sh.getRange(lastRow, C.pct + 1).setNumberFormat('0"%"');
}

// ── Actualiza hojas de resumen ──────────────────────────────
function updateStats(ss) {
  let sh = ss.getSheetByName(SHEET_STATS);
  if (!sh) sh = ss.insertSheet(SHEET_STATS);
  sh.clearContents(); sh.clearFormats();

  const reg = ss.getSheetByName(SHEET_REGISTRO);
  if (!reg || reg.getLastRow() < 2) return;

  const allData   = reg.getRange(2, 1, reg.getLastRow() - 1, HEADERS.length).getValues();
  const namedData = allData.filter(r => !r[C.anonimo]);

  // ── Resumen por estudiante ──────────────────────────────
  const statsHeaders = [
    'Nombre','Curso','Sesiones','Preguntas respondidas','% Acierto global',
    'Hidrocarburos %','Compuestos Oxigenados %','Compuestos Nitrogenados %','Juego Completo %'
  ];
  sh.appendRow(statsHeaders);
  sh.getRange(1, 1, 1, statsHeaders.length)
    .setBackground(COLOR.header).setFontColor(COLOR.hText).setFontWeight('bold');
  sh.setFrozenRows(1);

  const NIVEL_KEYS = ['Hidrocarburos','Compuestos Oxigenados','Compuestos Nitrogenados','Juego Completo'];
  const students = {};

  namedData.forEach(r => {
    const key = r[C.nombre] + '||' + r[C.curso];
    if (!students[key]) students[key] = {
      nombre: r[C.nombre], curso: r[C.curso],
      sesiones: 0, totalC: 0, totalT: 0, niveles: {}
    };
    const s = students[key];
    s.sesiones++;
    s.totalC += Number(r[C.correctas]) || 0;
    s.totalT += Number(r[C.total])     || 0;
    const nk = r[C.nivel];
    if (!s.niveles[nk]) s.niveles[nk] = { totalC: 0, totalT: 0 };
    s.niveles[nk].totalC += Number(r[C.correctas]) || 0;
    s.niveles[nk].totalT += Number(r[C.total])     || 0;
  });

  let row = 2;
  Object.values(students)
    .sort((a, b) => a.curso.localeCompare(b.curso) || a.nombre.localeCompare(b.nombre))
    .forEach(s => {
      const globalPct = s.totalT ? Math.round(s.totalC / s.totalT * 100) : 0;
      const nivelPcts = NIVEL_KEYS.map(nk => {
        const nd = s.niveles[nk];
        return nd && nd.totalT ? Math.round(nd.totalC / nd.totalT * 100) : '';
      });
      sh.appendRow([s.nombre, s.curso, s.sesiones, s.totalT, globalPct, ...nivelPcts]);
      sh.getRange(row, 1, 1, statsHeaders.length).setBackground(rowColor(globalPct));
      sh.getRange(row, 5).setNumberFormat('0"%"');
      [6,7,8,9].forEach(c => {
        if (sh.getRange(row, c).getValue() !== '') sh.getRange(row, c).setNumberFormat('0"%"');
      });
      row++;
    });

  [200,120,80,180,120,160,200,200,120].forEach((w, i) => sh.setColumnWidth(i + 1, w));

  // ── Eficacia por tema (incluye modo libre) ──────────────
  updateTopicStats(ss, allData);

  // ── Hojas por curso (solo estudiantes con nombre) ───────
  const cursos = [...new Set(namedData.map(r => r[C.curso]).filter(Boolean))];
  cursos.forEach(curso => updateCursoSheet(ss, curso, namedData));
}

// ── Estadísticas por tema ───────────────────────────────────
function updateTopicStats(ss, data) {
  const SHEET_TOPICS = 'Eficacia por tema';
  let sh = ss.getSheetByName(SHEET_TOPICS);
  if (!sh) sh = ss.insertSheet(SHEET_TOPICS);
  sh.clearContents(); sh.clearFormats();

  const topicData = {};
  data.forEach(r => {
    let errTema = {}, okTema = {};
    try { errTema = JSON.parse(r[C.err_tema]) || {}; } catch(e) {}
    try { okTema  = JSON.parse(r[C.ok_tema])  || {}; } catch(e) {}
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
  sh.getRange(1, 1, 1, 5)
    .setBackground(COLOR.header).setFontColor(COLOR.hText).setFontWeight('bold');
  sh.setFrozenRows(1);

  let row = 2;
  Object.entries(topicData)
    .sort((a, b) => (b[1].ok + b[1].err) - (a[1].ok + a[1].err))
    .forEach(([tema, d]) => {
      const tot = d.ok + d.err;
      const pct = tot ? Math.round(d.ok / tot * 100) : 0;
      sh.appendRow([tema, d.ok, d.err, tot, pct]);
      sh.getRange(row, 1, 1, 5).setBackground(rowColor(pct));
      sh.getRange(row, 5).setNumberFormat('0"%"');
      row++;
    });

  [200,100,100,140,100].forEach((w, i) => sh.setColumnWidth(i + 1, w));
}

// ── Hoja individual por curso ───────────────────────────────
function updateCursoSheet(ss, curso, data) {
  const shName = 'Curso ' + curso;
  let sh = ss.getSheetByName(shName);
  if (!sh) sh = ss.insertSheet(shName);
  sh.clearContents(); sh.clearFormats();

  sh.appendRow(['Nombre','Sesiones','Preguntas respondidas','% Acierto','Última sesión']);
  sh.getRange(1, 1, 1, 5)
    .setBackground(COLOR.header).setFontColor(COLOR.hText).setFontWeight('bold');
  sh.setFrozenRows(1);

  const students = {};
  data.filter(r => r[C.curso] === curso).forEach(r => {
    const nombre = r[C.nombre];
    if (!students[nombre]) students[nombre] = { sesiones:0, totalC:0, totalT:0, lastDate:'' };
    const s = students[nombre];
    s.sesiones++;
    s.totalC += Number(r[C.correctas]) || 0;
    s.totalT += Number(r[C.total])     || 0;
    const fecha = r[C.fecha] || '';
    if (fecha > s.lastDate) s.lastDate = fecha;
  });

  let row = 2;
  Object.entries(students)
    .sort((a, b) => a[0].localeCompare(b[0]))
    .forEach(([nombre, s]) => {
      const pct = s.totalT ? Math.round(s.totalC / s.totalT * 100) : 0;
      sh.appendRow([nombre, s.sesiones, s.totalT, pct, s.lastDate]);
      sh.getRange(row, 1, 1, 5).setBackground(rowColor(pct));
      sh.getRange(row, 4).setNumberFormat('0"%"');
      row++;
    });

  [200,80,180,100,120].forEach((w, i) => sh.setColumnWidth(i + 1, w));
}

// ── Color de fila según % acierto ───────────────────────────
function rowColor(pct) {
  return pct >= 90 ? COLOR.green
       : pct >= 70 ? COLOR.blue
       : pct >= 50 ? COLOR.yellow
       :             COLOR.red;
}
