// ============================================================
//  Chromanom — Apps Script Analytics  v3
//  Desplegar como: Aplicación web
//  Ejecutar como:  Tu cuenta
//  Acceso:         Cualquier persona (incluso anónima)
// ============================================================

const SPREADSHEET_ID = '1PiLH_bdfmWBbYoOI9QpS7_RrtKhReQ0GaQ18CM9MghA';
const SHEET_REGISTRO = 'Registro';
const SHEET_STATS    = 'Estadísticas';
const SHEET_CURSOS   = 'Resumen por Curso';

const HEADERS = [
  'Timestamp','Fecha','Hora','Nombre','Curso','Nivel','Sesión',
  'Correctas','Total','% Acierto',
  'Errores MC','Errores Drag','Errores ID','Errores Write','Errores Build',
  'Tiempo agotado',
  'Errores por tema','Aciertos por tema','Moléculas falladas',
  'Anónimo','Trigger'
];

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

const NIVEL_KEYS = ['Hidrocarburos','Compuestos Oxigenados','Compuestos Nitrogenados','Juego Completo'];

// ── HTTP POST — guarda dato y actualiza stats ───────────────
function doPost(e) {
  try {
    const raw  = e.postData ? e.postData.contents : '{}';
    const data = JSON.parse(raw);
    const ss   = getSpreadsheet();
    appendRow(ss, data);
    // updateStats corre en try separado para que un error en stats
    // no bloquee la respuesta ni pierda el dato del Registro
    try { updateStats(ss); } catch(statErr) {
      logError(ss, 'updateStats', statErr.message);
    }
    return jsonResponse({ ok: true });
  } catch (err) {
    return jsonResponse({ ok: false, error: err.message });
  }
}

// ── HTTP GET (diagnóstico) ──────────────────────────────────
function doGet() {
  return ContentService
    .createTextOutput('Chromanom Analytics v3 — activo ✓')
    .setMimeType(ContentService.MimeType.TEXT);
}

function jsonResponse(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

// ── Reconstruye estadísticas manualmente desde el editor ────
// Selecciona esta función y pulsa ▶ Ejecutar para forzar el recálculo
function reconstruirEstadisticas() {
  const ss = getSpreadsheet();
  updateStats(ss);
  SpreadsheetApp.getUi().alert('✅ Estadísticas actualizadas correctamente.');
}

// ── Log de errores en hoja Diagnóstico ─────────────────────
function logError(ss, fn, msg) {
  let sh = ss.getSheetByName('Diagnóstico');
  if (!sh) {
    sh = ss.insertSheet('Diagnóstico');
    sh.appendRow(['Timestamp','Función','Error']);
    sh.getRange(1,1,1,3).setBackground(COLOR.header).setFontColor(COLOR.hText).setFontWeight('bold');
  }
  sh.appendRow([new Date(), fn, msg]);
}

// ── Abre el spreadsheet por ID ──────────────────────────────
function getSpreadsheet() {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  if (!ss.getSheetByName(SHEET_REGISTRO)) {
    initRegistroSheet(ss.insertSheet(SHEET_REGISTRO));
  }
  return ss;
}

// ── Inicializa la hoja Registro ─────────────────────────────
function initRegistroSheet(sh) {
  sh.setName(SHEET_REGISTRO);
  sh.appendRow(HEADERS);
  sh.getRange(1, 1, 1, HEADERS.length)
    .setBackground(COLOR.header).setFontColor(COLOR.hText).setFontWeight('bold');
  sh.setFrozenRows(1);
  const widths = [160,90,70,180,100,150,90,90,70,90,90,90,90,90,90,90,250,250,350,80,100];
  widths.forEach((w, i) => sh.setColumnWidth(i + 1, w));
}

// ── Añade una fila al Registro ──────────────────────────────
function appendRow(ss, d) {
  let sh = ss.getSheetByName(SHEET_REGISTRO);
  if (!sh) { sh = ss.insertSheet(SHEET_REGISTRO); initRegistroSheet(sh); }

  const pct = d.pct !== undefined
    ? d.pct
    : (d.total ? Math.round(d.correctas / d.total * 100) : 0);

  const safeJson = v => (typeof v === 'object' && v !== null) ? JSON.stringify(v) : (v || '');
  const safeMols = v => Array.isArray(v) ? v.join(', ') : (v || '');

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

// ── Carga y agrupa todos los datos de Registro ──────────────
function loadData(ss) {
  const reg = ss.getSheetByName(SHEET_REGISTRO);
  if (!reg || reg.getLastRow() < 2) return { allData: [], namedData: [] };
  // Lee tantas columnas como tenga la hoja (compatible con esquemas viejos)
  const nCols = Math.max(reg.getLastColumn(), HEADERS.length);
  const allData = reg.getRange(2, 1, reg.getLastRow() - 1, nCols).getValues();
  // Excluye filas anónimas (columna 19) y filas sin nombre/curso
  const namedData = allData.filter(r => {
    const anon = r[C.anonimo];
    if (anon === true || anon === 'TRUE') return false;
    return r[C.nombre] && r[C.curso];
  });
  return { allData, namedData };
}

// ── Reconstruye todas las hojas de estadísticas ─────────────
function updateStats(ss) {
  const { allData, namedData } = loadData(ss);

  buildEstadisticas(ss, namedData);
  buildResumenCursos(ss, namedData);
  updateTopicStats(ss, allData);

  const cursos = [...new Set(namedData.map(r => r[C.curso]).filter(Boolean))];
  cursos.forEach(curso => updateCursoSheet(ss, curso, namedData));
}

// ── Hoja Estadísticas: un alumno por fila ───────────────────
function buildEstadisticas(ss, namedData) {
  let sh = ss.getSheetByName(SHEET_STATS);
  if (!sh) sh = ss.insertSheet(SHEET_STATS);
  sh.clearContents(); sh.clearFormats();

  const hdrs = [
    'Nombre','Curso','Sesiones','Preguntas respondidas','% Acierto global',
    'Hidrocarburos %','Compuestos Oxigenados %','Compuestos Nitrogenados %','Juego Completo %'
  ];
  sh.appendRow(hdrs);
  sh.getRange(1, 1, 1, hdrs.length)
    .setBackground(COLOR.header).setFontColor(COLOR.hText).setFontWeight('bold');
  sh.setFrozenRows(1);

  const students = agruparEstudiantes(namedData);
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
      sh.getRange(row, 1, 1, hdrs.length).setBackground(rowColor(globalPct));
      sh.getRange(row, 5).setNumberFormat('0"%"');
      [6,7,8,9].forEach(c => {
        if (sh.getRange(row, c).getValue() !== '') sh.getRange(row, c).setNumberFormat('0"%"');
      });
      row++;
    });

  [200,100,80,180,120,160,200,200,120].forEach((w, i) => sh.setColumnWidth(i + 1, w));
}

// ── Hoja Resumen por Curso: un curso por fila ────────────────
function buildResumenCursos(ss, namedData) {
  let sh = ss.getSheetByName(SHEET_CURSOS);
  if (!sh) sh = ss.insertSheet(SHEET_CURSOS, 1); // segunda pestaña
  sh.clearContents(); sh.clearFormats();

  const hdrs = [
    'Curso','Estudiantes activos','Sesiones totales',
    'Preguntas respondidas','% Acierto promedio',
    'Hidrocarburos %','Oxigenados %','Nitrogenados %','Juego Completo %'
  ];
  sh.appendRow(hdrs);
  sh.getRange(1, 1, 1, hdrs.length)
    .setBackground(COLOR.header).setFontColor(COLOR.hText).setFontWeight('bold');
  sh.setFrozenRows(1);

  // Agrupar por curso
  const cursos = {};
  namedData.forEach(r => {
    const curso = r[C.curso];
    if (!curso) return;
    if (!cursos[curso]) cursos[curso] = { alumnos: new Set(), sesiones:0, totalC:0, totalT:0, niveles:{} };
    const c = cursos[curso];
    c.alumnos.add(r[C.nombre]);
    c.sesiones++;
    c.totalC += Number(r[C.correctas]) || 0;
    c.totalT += Number(r[C.total])     || 0;
    const nk = r[C.nivel];
    if (!c.niveles[nk]) c.niveles[nk] = { totalC:0, totalT:0 };
    c.niveles[nk].totalC += Number(r[C.correctas]) || 0;
    c.niveles[nk].totalT += Number(r[C.total])     || 0;
  });

  let row = 2;
  Object.entries(cursos)
    .sort((a, b) => a[0].localeCompare(b[0]))
    .forEach(([curso, c]) => {
      const pct = c.totalT ? Math.round(c.totalC / c.totalT * 100) : 0;
      const nivelPcts = NIVEL_KEYS.map(nk => {
        const nd = c.niveles[nk];
        return nd && nd.totalT ? Math.round(nd.totalC / nd.totalT * 100) : '';
      });
      sh.appendRow([curso, c.alumnos.size, c.sesiones, c.totalT, pct, ...nivelPcts]);
      sh.getRange(row, 1, 1, hdrs.length).setBackground(rowColor(pct));
      sh.getRange(row, 5).setNumberFormat('0"%"');
      [6,7,8,9].forEach(col => {
        if (sh.getRange(row, col).getValue() !== '') sh.getRange(row, col).setNumberFormat('0"%"');
      });
      row++;
    });

  [120,160,130,180,150,140,120,140,140].forEach((w, i) => sh.setColumnWidth(i + 1, w));
}

// ── Hoja Eficacia por tema ──────────────────────────────────
function updateTopicStats(ss, allData) {
  const SHEET_TOPICS = 'Eficacia por tema';
  let sh = ss.getSheetByName(SHEET_TOPICS);
  if (!sh) sh = ss.insertSheet(SHEET_TOPICS);
  sh.clearContents(); sh.clearFormats();

  const topicData = {};
  allData.forEach(r => {
    let errTema = {}, okTema = {};
    try { errTema = JSON.parse(r[C.err_tema]) || {}; } catch(e) {}
    try { okTema  = JSON.parse(r[C.ok_tema])  || {}; } catch(e) {}
    Object.entries(errTema).forEach(([t, v]) => {
      if (!topicData[t]) topicData[t] = { err:0, ok:0 };
      topicData[t].err += Number(v) || 0;
    });
    Object.entries(okTema).forEach(([t, v]) => {
      if (!topicData[t]) topicData[t] = { err:0, ok:0 };
      topicData[t].ok += Number(v) || 0;
    });
  });

  sh.appendRow(['Tema','Correctas','Errores','Total intentos','% Acierto']);
  sh.getRange(1,1,1,5).setBackground(COLOR.header).setFontColor(COLOR.hText).setFontWeight('bold');
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

  [200,100,100,140,100].forEach((w,i) => sh.setColumnWidth(i+1, w));
}

// ── Hoja individual por curso ───────────────────────────────
function updateCursoSheet(ss, curso, data) {
  const shName = 'Curso ' + curso;
  let sh = ss.getSheetByName(shName);
  if (!sh) sh = ss.insertSheet(shName);
  sh.clearContents(); sh.clearFormats();

  sh.appendRow(['Nombre','Sesiones','Preguntas respondidas','% Acierto','Última sesión']);
  sh.getRange(1,1,1,5).setBackground(COLOR.header).setFontColor(COLOR.hText).setFontWeight('bold');
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
    if (String(fecha) > String(s.lastDate)) s.lastDate = fecha;
  });

  let row = 2;
  Object.entries(students)
    .sort((a, b) => a[0].localeCompare(b[0]))
    .forEach(([nombre, s]) => {
      const pct = s.totalT ? Math.round(s.totalC / s.totalT * 100) : 0;
      sh.appendRow([nombre, s.sesiones, s.totalT, pct, s.lastDate]);
      sh.getRange(row,1,1,5).setBackground(rowColor(pct));
      sh.getRange(row,4).setNumberFormat('0"%"');
      row++;
    });

  [200,80,180,100,120].forEach((w,i) => sh.setColumnWidth(i+1, w));
}

// ── Helpers ─────────────────────────────────────────────────
function agruparEstudiantes(namedData) {
  const students = {};
  namedData.forEach(r => {
    const key = r[C.nombre] + '||' + r[C.curso];
    if (!students[key]) students[key] = {
      nombre: r[C.nombre], curso: r[C.curso],
      sesiones:0, totalC:0, totalT:0, niveles:{}
    };
    const s = students[key];
    s.sesiones++;
    s.totalC += Number(r[C.correctas]) || 0;
    s.totalT += Number(r[C.total])     || 0;
    const nk = r[C.nivel];
    if (!s.niveles[nk]) s.niveles[nk] = { totalC:0, totalT:0 };
    s.niveles[nk].totalC += Number(r[C.correctas]) || 0;
    s.niveles[nk].totalT += Number(r[C.total])     || 0;
  });
  return students;
}

function rowColor(pct) {
  return pct >= 90 ? COLOR.green
       : pct >= 70 ? COLOR.blue
       : pct >= 50 ? COLOR.yellow
       :             COLOR.red;
}
