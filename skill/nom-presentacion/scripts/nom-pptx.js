/* nom-pptx.js — diapositivas de clase con la marca de BioNom, ChromaNom o IonNom (pptxgenjs).

   const N = require('<skill>/scripts/nom-pptx.js');
   const p = N.nueva('bio', { titulo: 'La célula', tema: 'La célula', curso: '6.°' });
   N.portada(p, { titulo: 'La célula', subtitulo: 'La unidad de la vida', curso: '6.°' });
   N.claves(p, [{ t: 'Célula', d: 'Unidad básica de los seres vivos' }, …]);
   const s = N.contenido(p, 'Procariota y eucariota');   // diapositiva con título; lo demás se compone encima
   await N.foto(s, 'nv_mito', { x: 7.2, y: 1.5, w: 5.4, h: 4.0 }, 'Mitocondrias');   // foto + cita APA debajo
   N.chequeo(p, { pregunta: '…', opciones: ['…','…','…','…'], correcta: 1, porque: ['…','…','…','…'] });
   await N.practica(p, { url: 'https://hbarcenasm863.github.io/bionom/celula.html#partes', texto: 'Explora las partes' });
   await N.guardar(p, 'celula.pptx');   // escribe, aplica el tema y revisa el texto

   Todo color va en hex sin «#». Medidas en pulgadas, diapositiva 13,33 × 7,5 (LAYOUT_WIDE). */
'use strict';
const fs = require('fs'), path = require('path'), os = require('os');
const { revisar } = require('./revisar-texto');
const A = path.join(__dirname, '..', 'assets');
let pptxgen;
try { pptxgen = require('pptxgenjs'); } catch (e) { throw new Error('Falta pptxgenjs: npm install pptxgenjs'); }

const SITIOS = {
  bio: { nombre: 'BioNom', lema: 'Biología por niveles de organización', url: 'https://hbarcenasm863.github.io/bionom/',
    oscuro: '14532D', medio: '2E7D4F', claro: 'E7F6EC', acento: 'F59E0B', tinta: '0F2A5F' },
  chroma: { nombre: 'ChromaNom', lema: 'Química orgánica', url: 'https://hbarcenasm863.github.io/chromanom/',
    oscuro: '0D4A73', medio: '1A6EA8', claro: 'E8F4FB', acento: 'F07C1E', tinta: '0D2233' },
  ion: { nombre: 'IonNom', lema: 'Química inorgánica', url: 'https://hbarcenasm863.github.io/ionom/',
    oscuro: '0D4A73', medio: '0072B2', claro: 'DBEBF4', acento: 'E69F00', tinta: '0D2D42' }
};
const W = 13.333, H = 7.5, M = 0.6;
const FUENTE_T = 'Cambria', FUENTE = 'Calibri';

function nueva(sitio, { titulo = '', tema = '', curso = '', autor = 'Harvey Bárcenas Morales', pie = null } = {}) {
  const S = SITIOS[sitio]; if (!S) throw new Error('sitio debe ser bio, chroma o ion');
  const p = new pptxgen(); p.layout = 'LAYOUT_WIDE'; p.title = titulo; p.author = autor; p.subject = S.nombre + (tema ? ' · ' + tema : '');
  p.theme = { headFontFace: FUENTE_T, bodyFontFace: FUENTE };
  const logo = path.join(A, 'logo-' + sitio + '.png');
  const piePag = pie || `${S.nombre} · ${tema || titulo}${curso ? ' · ' + curso : ''}`;
  p.defineSlideMaster({ title: 'NOM_CONTENIDO', background: { color: 'FFFFFF' },
    objects: [
      { image: { path: logo, x: W - M - 0.5 / ratio(sitio), y: H - 0.66, w: 0.5 / ratio(sitio), h: 0.5 } },
      { text: { text: piePag, options: { x: M, y: H - 0.55, w: 8, h: 0.35, fontFace: FUENTE, fontSize: 11, color: '64748B', margin: 0 } } },
      { placeholder: { options: { name: 'title', type: 'title', x: M, y: 0.4, w: W - 2 * M, h: 0.9, fontFace: FUENTE_T, fontSize: 34, bold: true, color: S.oscuro, align: 'left', valign: 'middle', margin: 0 }, text: '' } }
    ],
    slideNumber: { x: W - M - 0.5 / ratio(sitio) - 0.8, y: H - 0.55, w: 0.6, h: 0.35, fontFace: FUENTE, fontSize: 11, color: '64748B' } });
  p.defineSlideMaster({ title: 'NOM_SECCION', background: { color: S.oscuro },
    objects: [{ placeholder: { options: { name: 'title', type: 'title', x: M + 0.4, y: 2.6, w: W - 2 * M - 0.8, h: 1.6, fontFace: FUENTE_T, fontSize: 44, bold: true, color: 'FFFFFF', align: 'left', valign: 'middle', margin: 0 }, text: '' } }],
    slideNumber: { x: W - M - 0.6, y: H - 0.55, w: 0.6, h: 0.35, fontFace: FUENTE, fontSize: 11, color: 'FFFFFF' } });
  p.defineSlideMaster({ title: 'NOM_PORTADA', background: { color: 'FFFFFF' }, objects: [] });
  p._nom = { sitio, S, logo, tema, curso, textos: [], seccion: null };
  return p;
}
function ratio(sitio) { return { bio: 221 / 360, chroma: 102 / 360, ion: 120 / 360 }[sitio]; }
function nota(p, t) { p._nom.textos.push(String(t || '')); return t; }
function diap(p, master) { const o = { masterName: master }; if (p._nom.seccion) o.sectionTitle = p._nom.seccion; return p.addSlide(o); }

function portada(p, { titulo, subtitulo = '', curso = '', colegio = '' }) {
  const { S, logo, sitio } = p._nom;
  const s = diap(p, 'NOM_PORTADA');
  s.addShape(p.ShapeType.rect, { x: 0, y: 0, w: W * 0.58, h: H, fill: { color: S.oscuro }, line: { color: S.oscuro }, objectName: 'panel' });
  s.addText(nota(p, titulo), { x: M, y: 2.0, w: W * 0.58 - 2 * M, h: 2.0, fontFace: FUENTE_T, fontSize: 44, bold: true, color: 'FFFFFF', valign: 'bottom', margin: 0, isTextBox: true, fit: 'shrink' });
  if (subtitulo) s.addText(nota(p, subtitulo), { x: M, y: 4.15, w: W * 0.58 - 2 * M, h: 1.0, fontFace: FUENTE, fontSize: 22, color: S.claro, valign: 'top', margin: 0, isTextBox: true });
  const linea = [curso, colegio].filter(Boolean).join(' · ');
  if (linea) s.addText(nota(p, linea), { x: M, y: H - 1.1, w: W * 0.58 - 2 * M, h: 0.5, fontFace: FUENTE, fontSize: 16, color: 'FFFFFF', margin: 0, isTextBox: true });
  const lw = 4.4; s.addImage({ path: logo, x: W * 0.58 + (W * 0.42 - lw) / 2, y: 2.2, w: lw, h: lw * ratio(sitio), altText: S.nombre });
  s.addText(S.lema, { x: W * 0.58 + 0.4, y: 2.4 + lw * ratio(sitio), w: W * 0.42 - 0.8, h: 0.5, fontFace: FUENTE, fontSize: 16, color: '475569', align: 'center', margin: 0, isTextBox: true });
  return s;
}
function seccion(p, titulo) { p._nom.seccion = titulo; p.addSection({ title: titulo }); const s = diap(p, 'NOM_SECCION'); s.addText(nota(p, titulo), { placeholder: 'title' }); return s; }
function contenido(p, titulo) {
  const s = diap(p, 'NOM_CONTENIDO'); s.addText(nota(p, titulo), { placeholder: 'title' }); s._nomP = p;
  s._nomD = { titulo, palabras: 0, largas: [] }; (p._nom.diaps = p._nom.diaps || []).push(s._nomD); return s;
}
/* Cuenta palabras del texto corrido de una diapositiva (regla del 30 %: viñetas de 6 a 8 palabras). */
const palabras = t => String(t || '').replace(/[☐✔✘•·→]/g, ' ').trim().split(/\s+/).filter(Boolean).length;
function cuenta(s, t, vineta) { if (!s._nomD) return; const n = palabras(t); s._nomD.palabras += n; if (vineta && n > 8) s._nomD.largas.push(t); }

/* Texto con viñetas en una caja. items: ['…', '…'] o [{text, options}] */
function texto(s, items, caja, op = {}) {
  const p = s._nomP; const arr = (Array.isArray(items) ? items : [items]);
  const runs = arr.map((t, i) => { const tx = typeof t === 'string' ? t : t.text; nota(p, tx); cuenta(s, tx, true);
    return { text: tx, options: Object.assign({ bullet: op.vinetas === false ? false : { indent: 18 }, breakLine: i < arr.length - 1, paraSpaceAfter: 8 }, typeof t === 'string' ? {} : t.options) }; });
  s.addText(runs, Object.assign({ x: caja.x, y: caja.y, w: caja.w, h: caja.h, fontFace: FUENTE, fontSize: op.tam || 22, color: '1F2937', valign: 'top', margin: 0, isTextBox: true }, op.extra || {}));
}
/* Tarjeta: recuadro con fondo suave, título y texto. */
function tarjeta(s, { titulo, cuerpo, x, y, w, h, color }) {
  const p = s._nomP, S = p._nom.S;
  s.addShape(p.ShapeType.roundRect, { x, y, w, h, rectRadius: 0.12, fill: { color: color || S.claro }, line: { color: color || S.claro }, objectName: 'tarjeta ' + (titulo || '') });
  if (titulo) s.addText(nota(p, titulo), { x: x + 0.2, y: y + 0.15, w: w - 0.4, h: 0.5, fontFace: FUENTE, fontSize: 22, bold: true, color: S.oscuro, margin: 0, isTextBox: true, valign: 'top' });
  if (cuerpo) cuenta(s, cuerpo, false);
  if (cuerpo) s.addText(nota(p, cuerpo), { x: x + 0.2, y: y + (titulo ? 0.7 : 0.2), w: w - 0.4, h: h - (titulo ? 0.85 : 0.4), fontFace: FUENTE, fontSize: 21, color: '1F2937', margin: 0, isTextBox: true, valign: 'top', fit: 'shrink' });
}

/* Palabras clave al inicio (preentrenamiento, principio de Mayer). */
function claves(p, palabras, titulo = 'Palabras clave') {
  const s = contenido(p, titulo); const n = palabras.length, cols = n <= 4 ? 2 : 3, filas = Math.ceil(n / cols);
  const gx = 0.3, gy = 0.3, w = (W - 2 * M - gx * (cols - 1)) / cols, h = Math.min(1.6, (H - 1.6 - 0.9 - gy * (filas - 1)) / filas);
  palabras.forEach((k, i) => tarjeta(s, { titulo: k.t, cuerpo: k.d, x: M + (i % cols) * (w + gx), y: 1.55 + Math.floor(i / cols) * (h + gy), w, h }));
  s.addNotes('Leer cada palabra con el curso antes de empezar. ' + palabras.map(k => k.t + ': ' + k.d).join('. '));
  return s;
}

/* Foto de los sitios (o un archivo propio) con su cita APA debajo. */
async function foto(s, clave, caja, pie = '', op = {}) {
  const p = s._nomP; const F = require(path.join(__dirname, '..', 'datos', 'fotos.json')).fotos;
  let archivo = op.archivo, cita = op.cita;
  if (!archivo) {
    const f = F.find(x => x.clave === clave); if (!f) throw new Error('No existe la foto ' + clave + ' (node scripts/fotos.js buscar …)');
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'fotos-')); archivo = path.join(dir, path.basename(f.archivo));
    let ok = false;
    if (f.local) { archivo = path.join(__dirname, '..', f.local); ok = fs.existsSync(archivo); }
    if (!ok)
    for (const u of [`https://raw.githubusercontent.com/hbarcenasm863/${f.repo}/main/${f.archivo}`, `https://hbarcenasm863.github.io/${f.repo}/${f.archivo}`]) {
      try { const r = await fetch(u); if (r.ok) { fs.writeFileSync(archivo, Buffer.from(await r.arrayBuffer())); ok = true; break; } } catch (e) { /* siguiente */ }
    }
    if (!ok) throw new Error('No pude descargar la foto ' + clave);
    const lic = f.licUrl ? `Licencia ${f.lic} (${f.licUrl})` : f.lic;
    cita = `${String(f.autor).replace(/\.$/, '')}. (${f.anio || 's. f.'}). ${f.titulo} [${f.tipo || 'Fotografía'}]. ${f.fuente || 'Wikimedia Commons'}. ${f.url}. ${lic}.`;
    op.w0 = f.w; op.h0 = f.h;
  }
  if (!cita) throw new Error('Toda foto lleva su cita APA: pasa op.cita');
  if (!op.w0) { const d = medidas(archivo); if (d) { op.w0 = d.w; op.h0 = d.h; } }
  const hPie = pie ? 0.45 : 0, hCita = 0.55, hImg = caja.h - hPie - hCita;
  let iw = caja.w, ih = hImg;
  if (op.w0 && op.h0) { const r = op.w0 / op.h0; if (iw / ih > r) iw = ih * r; else ih = iw / r; }
  s.addImage({ path: archivo, x: caja.x + (caja.w - iw) / 2, y: caja.y + (hImg - ih) / 2, w: iw, h: ih, altText: pie || clave, rounding: false });
  if (pie) s.addText(nota(p, pie), { x: caja.x, y: caja.y + hImg + 0.05, w: caja.w, h: hPie - 0.05, fontFace: FUENTE, fontSize: 16, bold: true, color: p._nom.S.oscuro, align: 'center', margin: 0, isTextBox: true });
  s.addText(cita, { x: caja.x, y: caja.y + hImg + hPie, w: caja.w, h: hCita, fontFace: FUENTE, fontSize: 10, color: '475569', valign: 'top', margin: 0, isTextBox: true, fit: 'shrink' });
  return cita;
}

/* Imagen propia (SVG de estructuras o fórmulas convertido a PNG, esquemas). */
function imagen(s, archivo, caja, alt = '') { s.addImage({ path: archivo, x: caja.x, y: caja.y, w: caja.w, h: caja.h, altText: alt }); }

/* Chequeo con explicación de cada opción (Mayer: retroalimentación de cada error). */
function chequeo(p, { pregunta, opciones, correcta, porque = [], titulo = 'Chequeo', respuesta = true }) {
  const L = 'ABCDEF', S = p._nom.S;
  const pinta = (mostrar) => {
    const s = contenido(p, titulo + (mostrar ? ': respuesta' : ''));
    s.addText(nota(p, pregunta), { x: M, y: 1.45, w: W - 2 * M, h: 1.2, fontFace: FUENTE, fontSize: 24, color: '1F2937', margin: 0, isTextBox: true, valign: 'top' });
    const n = opciones.length, cols = 2, gx = 0.3, gy = 0.25, w = (W - 2 * M - gx) / cols, h = mostrar ? 1.55 : 1.0;
    opciones.forEach((o, i) => {
      const x = M + (i % cols) * (w + gx), y = 2.85 + Math.floor(i / cols) * (h + gy), ok = i === correcta;
      const fondo = mostrar ? (ok ? 'DCFCE7' : 'FEE4E2') : 'F1F5F9';
      s.addShape(p.ShapeType.roundRect, { x, y, w, h, rectRadius: 0.1, fill: { color: fondo }, line: { color: mostrar && ok ? '15803D' : 'CBD5E1', width: mostrar && ok ? 2 : 1 }, objectName: 'opción ' + L[i] });
      const runs = [{ text: L[i] + '. ', options: { bold: true, color: S.oscuro } }, { text: nota(p, o), options: { color: '1F2937' } }];
      if (mostrar && porque[i]) runs.push({ text: '\n' + (ok ? '✔ ' : '✘ ') + nota(p, porque[i]), options: { fontSize: 15, color: ok ? '15803D' : 'B42318' } });
      s.addText(runs, { x: x + 0.2, y: y + 0.1, w: w - 0.4, h: h - 0.2, fontFace: FUENTE, fontSize: 20, margin: 0, isTextBox: true, valign: 'middle', fit: 'shrink' });
    });
    s.addNotes(`Respuesta: ${L[correcta]}. ` + opciones.map((o, i) => `${L[i]}) ${porque[i] || ''}`).join(' '));
    return s;
  };
  if (porque.length && porque.length !== opciones.length) throw new Error('chequeo: «porque» debe explicar cada opción');
  pinta(false); if (respuesta) pinta(true);
}

/* Tamaño real de un PNG o JPG (para no deformar fotos e imágenes propias). */
function medidas(archivo) {
  try {
    const b = fs.readFileSync(archivo);
    if (b[0] === 0x89) return { w: b.readUInt32BE(16), h: b.readUInt32BE(20) };
    let i = 2;
    while (i < b.length - 9) {
      if (b[i] !== 0xFF) { i++; continue; }
      const m = b[i + 1], len = b.readUInt16BE(i + 2);
      if (m >= 0xC0 && m <= 0xCF && ![0xC4, 0xC8, 0xCC].includes(m)) return { h: b.readUInt16BE(i + 5), w: b.readUInt16BE(i + 7) };
      i += 2 + len;
    }
  } catch (e) { /* sin medidas */ }
  return null;
}

/* ───────────── Diapositivas para explicar a fondo ───────────── */

/* Colores de IonNom para las partes de un compuesto (borde, fondo, texto). */
const PARTES = { cat: ['E69F00', 'FCF2DB', '8A5F00'], an: ['0072B2', 'DBEBF4', '00659E'], oh: ['CC79A7', 'F8ECF3', '8D5373'],
  ox: ['009E73', 'DBF1EB', '007253'], neu: ['94A3B8', 'F1F5F9', '334155'] };
const SUBS = '₀₁₂₃₄₅₆₇₈₉';
const sub = n => String(n).split('').map(d => SUBS[d]).join('');
const supCarga = q => (Math.abs(q) === 1 ? '' : String(Math.abs(q)).split('').map(d => '⁰¹²³⁴⁵⁶⁷⁸⁹'[d]).join('')) + (q > 0 ? '⁺' : '⁻');
const anchoTexto = (t, tam) => [...String(t)].length * tam * 0.0088 + 0.1;

/* Fichas de colores: [['Fe₂', 'cat'], ['O₃', 'an']] → recuadros pegados. Devuelve el ancho total. */
function fichas(s, partes, { x, y, h = 0.9, tam = 36, centro = null }) {
  const p = s._nomP, anchos = partes.map(([t]) => anchoTexto(t, tam) + 0.35), total = anchos.reduce((a, b) => a + b, 0) + 0.08 * (partes.length - 1);
  let cx = centro != null ? centro - total / 2 : x;
  partes.forEach(([t, tipo], i) => {
    const C = PARTES[tipo] || PARTES.neu;
    s.addShape(p.ShapeType.roundRect, { x: cx, y, w: anchos[i], h, rectRadius: 0.12, fill: { color: C[1] }, line: { color: C[0], width: 2.5 }, objectName: 'ficha ' + t });
    s.addText(nota(p, t), { x: cx, y, w: anchos[i], h, fontFace: FUENTE, fontSize: tam, bold: true, color: C[2], align: 'center', valign: 'middle', margin: 0, isTextBox: true });
    cx += anchos[i] + 0.08;
  });
  return total;
}

/* Tabla con el encabezado en el color del sitio. filas[0] = encabezados. Celdas: texto o {text, options}. */
function tabla(s, filas, caja, op = {}) {
  const p = s._nomP, S = p._nom.S, tam = op.tam || 20;
  const rows = filas.map((f, i) => f.map(c => {
    const o = typeof c === 'object' ? c : { text: String(c) }; nota(p, o.text);
    const base = i === 0 ? { bold: true, color: 'FFFFFF', fill: { color: S.oscuro } } : { color: '1F2937', fill: { color: i % 2 ? 'FFFFFF' : 'F1F5F9' } };
    return { text: o.text, options: Object.assign(base, o.options || {}) };
  }));
  const rowH = op.rowH || (caja.h ? caja.h / rows.length : Math.max(0.5, tam / 36));
  s.addTable(rows, { x: caja.x, y: caja.y, w: caja.w, colW: op.colW, rowH, fontFace: FUENTE, fontSize: tam, valign: 'middle', margin: [3, 6, 3, 6],
    border: { type: 'solid', pt: 1, color: 'CBD5E1' }, autoPage: false });
}

/* Procedimiento numerado. items: [{t: 'Qué se hace', d: 'detalle', ej: 'ejemplo del paso'}].
   progresivo: una diapositiva por paso (los anteriores quedan, el actual resaltado, los siguientes ocultos). */
function pasos(p, titulo, items, op = {}) {
  const S = p._nom.S, n = items.length, conEj = items.some(i => i.ej);
  const anchoL = conEj ? 7.6 : W - 2 * M, alto = Math.min(1.3, (H - 1.55 - 0.95) / n);
  const dibujar = (hasta) => {
    const s = contenido(p, titulo);
    items.forEach((it, i) => {
      if (i > hasta) return;
      const y = 1.5 + i * alto, actual = op.progresivo && i === hasta;
      s.addShape(p.ShapeType.ellipse, { x: M, y: y + 0.08, w: 0.62, h: 0.62, fill: { color: actual || !op.progresivo ? S.oscuro : 'CBD5E1' }, line: { color: 'FFFFFF' }, objectName: 'paso ' + (i + 1) });
      s.addText(String(i + 1), { x: M, y: y + 0.08, w: 0.62, h: 0.62, fontFace: FUENTE, fontSize: 22, bold: true, color: 'FFFFFF', align: 'center', valign: 'middle', margin: 0, isTextBox: true });
      const runs = [{ text: nota(p, it.t), options: { bold: true, color: S.oscuro, breakLine: !!it.d } }];
      if (it.d) runs.push({ text: nota(p, it.d), options: { color: actual || !op.progresivo ? '1F2937' : '64748B', fontSize: 21 } });
      s.addText(runs, { x: M + 0.8, y, w: anchoL - 0.8, h: alto - 0.08, fontFace: FUENTE, fontSize: 26, valign: 'top', margin: 0, isTextBox: true, fit: 'shrink' });
    });
    const ej = items[hasta] && items[hasta].ej;
    if (conEj && (op.progresivo ? ej : true)) {
      const x = M + anchoL + 0.3, w = W - M - x;
      s.addShape(p.ShapeType.roundRect, { x, y: 1.5, w, h: 4.9, rectRadius: 0.12, fill: { color: S.claro }, line: { color: S.claro }, objectName: 'ejemplo del paso' });
      s.addText('Ejemplo', { x: x + 0.25, y: 1.65, w: w - 0.5, h: 0.45, fontFace: FUENTE, fontSize: 18, bold: true, color: S.medio, margin: 0, isTextBox: true });
      const txt = op.progresivo ? ej : items.map((it, i) => (i + 1) + '. ' + (it.ej || '')).join('\n');
      s.addText(nota(p, txt), { x: x + 0.25, y: 2.2, w: w - 0.5, h: 4.0, fontFace: FUENTE, fontSize: op.progresivo ? 44 : 20, bold: !!op.progresivo, color: S.tinta, valign: 'middle', margin: 0, isTextBox: true, fit: 'shrink' });
    }
    s.addNotes(op.notas || items.map((it, i) => `Paso ${i + 1}: ${it.t}. ${it.d || ''} ${it.ej ? 'Ejemplo: ' + it.ej : ''}`).join(' '));
    return s;
  };
  if (op.progresivo) items.forEach((_, k) => dibujar(k)); else dibujar(n - 1);
}

/* Cruce de cargas dibujado (formular un compuesto iónico).
   cat: {sim:'Fe', q:3, tipo?}  an: {sim:'O', q:-2, tipo:'an'|'oh'|'ox'}  nombre: texto opcional bajo la fórmula.
   Cada flecha sale justo debajo de una carga y llega justo encima del subíndice que produce; las dos
   se cruzan en el espacio vacío entre las filas. El número que viaja va del color de su flecha. */
function cruce(p, { titulo = 'Cruce de cargas', cat, an, nombre = '', notas = '' }) {
  const S = p._nom.S, s = contenido(p, titulo);
  const qa = Math.abs(an.q), qc = Math.abs(cat.q), g = (a, b) => b ? g(b, a % b) : a, d = g(qa, qc);
  const nCat = qa, nAn = qc, fCat = nCat / d, fAn = nAn / d;
  const poli = x => (x.match(/[A-Z]/g) || []).length > 1;
  const escribe = (sim, k) => k === 1 ? sim : (poli(sim) ? '(' + sim + ')' : sim) + sub(k);
  const tc = cat.tipo || 'cat', ta = an.tipo || 'an';
  const colC = PARTES.cat[2], colA = PARTES.an[2];          // color de la carga del catión y del anión
  const wC = 2.5, hC = 1.15, xC = 1.0, xA = 5.4, y1 = 1.8, y2 = 4.55, tam = 46;
  const simA = poli(an.sim) && nAn > 1 ? '(' + an.sim + ')' : an.sim;
  // recuadro con el símbolo y la parte de color (carga o subíndice); devuelve la x donde queda esa parte
  const caja = (x, y, tipo, simb, extra, colExtra) => {
    const C = PARTES[tipo] || PARTES.neu;
    s.addShape(p.ShapeType.roundRect, { x, y, w: wC, h: hC, rectRadius: 0.12, fill: { color: C[1] }, line: { color: C[0], width: 2.5 }, objectName: 'ion ' + simb });
    s.addText([{ text: nota(p, simb), options: { color: C[2] } }, { text: extra, options: { color: colExtra } }],
      { x, y, w: wC, h: hC, fontFace: FUENTE, fontSize: tam, bold: true, align: 'center', valign: 'middle', margin: 0, isTextBox: true });
    const ancho = anchoTexto(simb + extra, tam) - 0.1, finTexto = x + wC / 2 + ancho / 2;
    return finTexto - anchoTexto(extra, tam) / 2 - 0.02;   // centro de la carga o del subíndice
  };
  const cC = caja(xC, y1, tc, cat.sim, supCarga(cat.q), colC);
  const cA = caja(xA, y1, ta, an.sim, supCarga(an.q), colA);
  s.addText('+', { x: xC + wC, y: y1, w: xA - xC - wC, h: hC, fontFace: FUENTE, fontSize: 40, bold: true, color: '64748B', align: 'center', valign: 'middle', margin: 0, isTextBox: true });
  const sC = caja(xC, y2, tc, cat.sim, nCat > 1 ? sub(nCat) : '₁', colA);   // el subíndice del catión viene de la carga del anión
  const sA = caja(xA, y2, ta, simA, nAn > 1 ? sub(nAn) : '₁', colC);       // y el del anión, de la carga del catión
  const flecha = (x1, x2, color) => s.addShape(p.ShapeType.line, { x: Math.min(x1, x2), y: y1 + hC + 0.08, w: Math.abs(x2 - x1), h: (y2 - 0.08) - (y1 + hC + 0.08), flipH: x2 < x1,
    line: { color, width: 3.5, endArrowType: 'triangle' }, objectName: 'flecha del cruce' });
  flecha(cC, sA, colC);
  flecha(cA, sC, colA);
  s.addText([{ text: 'la carga de uno → el subíndice del otro', options: { italic: true } }], { x: xC, y: y2 + hC + 0.1, w: xA + wC - xC, h: 0.45, fontFace: FUENTE, fontSize: 16, color: '475569', align: 'center', margin: 0, isTextBox: true });
  // explicación a la derecha
  const xT = 8.55, wT = W - M - xT;
  const lineas = [
    `${qc} (carga del ${cat.sim}) → subíndice del ${an.sim}.`,
    `${qa} (carga del ${an.sim}) → subíndice del ${cat.sim}.`,
    d > 1 ? `Ambos se dividen entre ${d}: ${escribe(cat.sim, nCat)}${escribe(an.sim, nAn)} → ${escribe(cat.sim, fCat)}${escribe(an.sim, fAn)}.` : `${nCat} y ${nAn} no se simplifican.`,
    'El subíndice 1 no se escribe.',
    `Comprueba: ${fCat}(${cat.q > 0 ? '+' : ''}${cat.q}) + ${fAn}(${an.q}) = 0 ✔`];
  s.addText(lineas.map((l, i) => ({ text: nota(p, l), options: { bullet: { type: 'number' }, breakLine: i < lineas.length - 1, paraSpaceAfter: 10 } })),
    { x: xT, y: 1.55, w: wT, h: 3.65, fontFace: FUENTE, fontSize: 20, color: '1F2937', valign: 'top', margin: 0, isTextBox: true, fit: 'shrink' });
  const formula = escribe(cat.sim, fCat) + escribe(an.sim, fAn);
  s.addShape(p.ShapeType.roundRect, { x: xT, y: 5.3, w: wT, h: 1.25, rectRadius: 0.12, fill: { color: 'DCFCE7' }, line: { color: '15803D', width: 2 }, objectName: 'resultado' });
  s.addText([{ text: nota(p, formula), options: { fontSize: 34, bold: true, color: '14532D', breakLine: !!nombre } }].concat(nombre ? [{ text: nota(p, nombre), options: { fontSize: 16, color: '14532D' } }] : []),
    { x: xT, y: 5.3, w: wT, h: 1.25, fontFace: FUENTE, align: 'center', valign: 'middle', margin: 0, isTextBox: true });
  s.addNotes(notas || `Ion ${cat.sim} con carga ${cat.q} y ion ${an.sim} con carga ${an.q}. ${lineas.join(' ')} Resultado: ${formula}${nombre ? ' (' + nombre + ')' : ''}.`);
  return { s, formula };
}

/* Ejemplo resuelto que se revela paso a paso (una diapositiva por paso).
   pasos: [{t: 'Qué hago', r: 'resultado del paso'}]; respuesta: texto final. */
function ejemplo(p, { titulo = 'Ejemplo resuelto', enunciado, pasos: P, respuesta, progresivo = true }) {
  const S = p._nom.S, n = P.length;
  const alto = Math.min(1.0, (H - 2.75 - 2.0) / n);
  const dibujar = (hasta, final) => {
    const s = contenido(p, titulo);
    s.addShape(p.ShapeType.roundRect, { x: M, y: 1.45, w: W - 2 * M, h: 0.95, rectRadius: 0.1, fill: { color: S.claro }, line: { color: S.claro }, objectName: 'enunciado' });
    s.addText(nota(p, enunciado), { x: M + 0.25, y: 1.45, w: W - 2 * M - 0.5, h: 0.95, fontFace: FUENTE, fontSize: 28, bold: true, color: S.tinta, valign: 'middle', margin: 0, isTextBox: true, fit: 'shrink' });
    P.forEach((st, i) => {
      if (i > hasta) return;
      const y = 2.6 + i * alto;
      const C = ['E69F00', '0072B2', 'CC79A7', '009E73', '64748B'][i % 5];
      s.addShape(p.ShapeType.ellipse, { x: M, y: y + (alto - 0.6) / 2, w: 0.6, h: 0.6, fill: { color: C }, line: { color: C }, objectName: 'paso ' + (i + 1) });
      s.addText(String(i + 1), { x: M, y: y + (alto - 0.6) / 2, w: 0.6, h: 0.6, fontFace: FUENTE, fontSize: 22, bold: true, color: 'FFFFFF', align: 'center', valign: 'middle', margin: 0, isTextBox: true });
      s.addText([{ text: nota(p, st.t) + '  ', options: { color: '1F2937' } }, { text: nota(p, st.r || ''), options: { bold: true, color: S.medio } }],
        { x: M + 0.8, y, w: W - 2 * M - 0.8, h: alto - 0.05, fontFace: FUENTE, fontSize: 26, valign: 'middle', margin: 0, isTextBox: true, fit: 'shrink' });
    });
    if (final && respuesta) {
      s.addShape(p.ShapeType.roundRect, { x: M, y: H - 1.95, w: W - 2 * M, h: 0.95, rectRadius: 0.1, fill: { color: 'DCFCE7' }, line: { color: '15803D', width: 2 }, objectName: 'respuesta' });
      s.addText(nota(p, respuesta), { x: M + 0.25, y: H - 1.95, w: W - 2 * M - 0.5, h: 0.95, fontFace: FUENTE, fontSize: 28, bold: true, color: '14532D', valign: 'middle', margin: 0, isTextBox: true, fit: 'shrink' });
    }
    s.addNotes(`${enunciado} ` + P.map((st, i) => `Paso ${i + 1}: ${st.t} ${st.r || ''}`).join(' ') + (respuesta ? ' Respuesta: ' + respuesta : ''));
  };
  if (progresivo) for (let k = 0; k < n; k++) dibujar(k, k === n - 1); else dibujar(n - 1, true);
}

/* Ejercicios numerados y, aparte, la diapositiva de respuestas.
   items: [{q: 'Na₂O', r: 'óxido de sodio', x: 'explicación corta'}] (hasta 10). */
function ejercicios(p, { titulo = 'Ejercicios', instruccion = '', items, respuestas = true }) {
  const S = p._nom.S, n = items.length, cols = n > 5 ? 2 : 1, filas = Math.ceil(n / cols);
  const y0 = instruccion ? 2.1 : 1.55, alto = Math.min(1.0, (H - y0 - 0.95) / filas), w = (W - 2 * M - 0.4 * (cols - 1)) / cols;
  const dibujar = (conR) => {
    const s = contenido(p, titulo + (conR ? ': respuestas' : ''));
    if (instruccion) s.addText(nota(p, instruccion), { x: M, y: 1.45, w: W - 2 * M, h: 0.55, fontFace: FUENTE, fontSize: 20, italic: true, color: '334155', margin: 0, isTextBox: true });
    items.forEach((it, i) => {
      const x = M + Math.floor(i / filas) * (w + 0.4), y = y0 + (i % filas) * alto;
      const runs = [{ text: `${i + 1}. `, options: { bold: true, color: S.oscuro } }, { text: nota(p, it.q), options: { color: '1F2937', bold: !conR } }];
      if (conR) { runs.push({ text: '  →  ' + nota(p, it.r), options: { bold: true, color: '15803D' } }); if (it.x) runs.push({ text: '\n' + nota(p, it.x), options: { fontSize: 14, color: '475569' } }); }
      else runs.push({ text: '   ______________', options: { color: '94A3B8' } });
      s.addText(runs, { x, y, w, h: alto - 0.05, fontFace: FUENTE, fontSize: conR ? 19 : 22, valign: 'middle', margin: 0, isTextBox: true, fit: 'shrink' });
    });
    s.addNotes((conR ? 'Respuestas: ' : 'Dar tiempo para resolver en el cuaderno. Respuestas: ') + items.map((it, i) => `${i + 1}) ${it.q}: ${it.r}. ${it.x || ''}`).join(' '));
  };
  dibujar(false); if (respuestas) dibujar(true);
}

/* Comparación en dos columnas: izq/der = {titulo, items: [...], color} */
function comparar(p, titulo, izq, der) {
  const s = contenido(p, titulo), w = (W - 2 * M - 0.4) / 2;
  [izq, der].forEach((c, i) => {
    const x = M + i * (w + 0.4);
    tarjeta(s, { titulo: c.titulo, x, y: 1.5, w, h: 4.95, color: c.color });
    texto(s, c.items, { x: x + 0.25, y: 2.35, w: w - 0.5, h: 4.0 }, { tam: c.tam || 28 });
  });
  return s;
}

/* ───────────── Apertura, modelos y cierre (criterios didácticos del docente) ───────────── */

/* Meta de aprendizaje en lenguaje del estudiante + cómo sabrá que lo logró. */
function objetivo(p, { meta, criterios = [], titulo = 'Lo que vas a lograr hoy' }) {
  const S = p._nom.S, s = contenido(p, titulo);
  s.addShape(p.ShapeType.roundRect, { x: M, y: 1.55, w: W - 2 * M, h: 1.7, rectRadius: 0.14, fill: { color: S.claro }, line: { color: S.medio, width: 2 }, objectName: 'meta' });
  s.addText([{ text: 'Al terminar podrás ', options: { color: S.medio } }, { text: nota(p, meta), options: { color: S.tinta, bold: true } }],
    { x: M + 0.3, y: 1.55, w: W - 2 * M - 0.6, h: 1.7, fontFace: FUENTE, fontSize: 28, valign: 'middle', margin: 0, isTextBox: true, fit: 'shrink' });
  if (criterios.length) {
    s.addText('Sabrás que lo lograste si puedes:', { x: M, y: 3.55, w: W - 2 * M, h: 0.5, fontFace: FUENTE, fontSize: 20, bold: true, color: S.oscuro, margin: 0, isTextBox: true });
    texto(s, criterios.map(c => '☐ ' + c), { x: M + 0.2, y: 4.15, w: W - 2 * M - 0.2, h: 2.4 }, { vinetas: false, tam: 22 });
  }
  s.addNotes('Leer la meta en voz alta. Al cierre se vuelve a ella con el ticket de salida.');
  return s;
}

/* Activación de ideas previas: predicción o encuesta SIN respuesta (se retoma al cierre). */
function encuesta(p, { pregunta, opciones, titulo = '¿Tú qué crees?', instruccion = 'Vota levantando la mano. No hay respuesta mala: es tu predicción.', notas = '' }) {
  const L = 'ABCDEF', S = p._nom.S, s = contenido(p, titulo);
  s.addText(nota(p, pregunta), { x: M, y: 1.45, w: W - 2 * M, h: 1.0, fontFace: FUENTE, fontSize: 26, bold: true, color: '1F2937', margin: 0, isTextBox: true, valign: 'top', fit: 'shrink' });
  const w = (W - 2 * M - 0.3) / 2;
  opciones.forEach((o, i) => {
    const x = M + (i % 2) * (w + 0.3), y = 2.65 + Math.floor(i / 2) * 1.3;
    s.addShape(p.ShapeType.roundRect, { x, y, w, h: 1.1, rectRadius: 0.1, fill: { color: 'F1F5F9' }, line: { color: 'CBD5E1' }, objectName: 'opción ' + L[i] });
    s.addText([{ text: L[i] + '. ', options: { bold: true, color: S.oscuro } }, { text: nota(p, o), options: { color: '1F2937' } }], { x: x + 0.2, y, w: w - 0.4, h: 1.1, fontFace: FUENTE, fontSize: 21, valign: 'middle', margin: 0, isTextBox: true, fit: 'shrink' });
  });
  s.addText(nota(p, instruccion), { x: M, y: 5.35 + (opciones.length > 4 ? 1.3 : 0), w: W - 2 * M, h: 0.6, fontFace: FUENTE, fontSize: 18, italic: true, color: S.medio, margin: 0, isTextBox: true });
  s.addNotes(notas || 'Contar los votos en el tablero y guardarlos: al cierre se compara con lo aprendido. Las opciones incorrectas recogen ideas alternativas frecuentes.');
  return s;
}

/* Modelo submicroscópico de un compuesto iónico: red de cationes y aniones. */
function modeloIonico(s, { cat, an, proporcion = [1, 1], leyenda = 'Iones + y − se atraen: enlace iónico' }, caja) {
  const p = s._nomP, [nc, na] = proporcion, total = nc + na;
  const reps = Math.max(1, Math.round(10 / total)), lista = [];
  for (let r = 0; r < reps; r++) { for (let i = 0; i < Math.max(nc, na); i++) { if (i < nc) lista.push('c'); if (i < na) lista.push('a'); } }
  const cols = Math.ceil(Math.sqrt(lista.length * caja.w / (caja.h - 0.6))), filas = Math.ceil(lista.length / cols);
  const paso = Math.min(caja.w / cols, (caja.h - 0.6) / filas), x0 = caja.x + (caja.w - paso * cols) / 2;
  lista.forEach((t, i) => {
    const C = t === 'c' ? PARTES.cat : PARTES[an.tipo || 'an'], ion = t === 'c' ? cat : an, r = paso * (t === 'c' ? 0.42 : 0.5);
    const cx = x0 + (i % cols + 0.5) * paso, cy = caja.y + (Math.floor(i / cols) + 0.5) * paso;
    s.addShape(p.ShapeType.ellipse, { x: cx - r, y: cy - r, w: 2 * r, h: 2 * r, fill: { color: C[1] }, line: { color: C[0], width: 2 }, objectName: 'ion ' + ion.sim });
    s.addText(ion.sim + supCarga(ion.q), { x: cx - r, y: cy - r, w: 2 * r, h: 2 * r, fontFace: FUENTE, fontSize: Math.max(13, Math.round(r * 52)), bold: true, color: C[2], align: 'center', valign: 'middle', margin: 0, isTextBox: true });
  });
  s.addText(nota(p, leyenda), { x: caja.x, y: caja.y + caja.h - 0.55, w: caja.w, h: 0.5, fontFace: FUENTE, fontSize: 16, color: '334155', align: 'center', margin: 0, isTextBox: true });
}

/* Modelo de moléculas: atomos [{sim, x, y}] en 0..1 dentro de la caja de UNA molécula, enlaces [[i, j, orden]].
   copias: cuántas moléculas dibujar lado a lado. */
function modeloMolecula(s, { atomos, enlaces = [], copias = 2, leyenda = 'Comparten electrones: enlace covalente, molécula' }, caja) {
  const p = s._nomP, COL = { O: ['C8230A', 'FDE2E1'], C: ['334155', 'E2E8F0'], S: ['A16207', 'FEF3C7'], N: ['0033AA', 'DBEAFE'], H: ['64748B', 'FFFFFF'], Cl: ['1A7A1A', 'DCFCE7'] };
  const vertical = caja.h > caja.w, hTot = caja.h - 0.6;
  const wMol = vertical ? caja.w : caja.w / copias, hUtil = vertical ? hTot / copias : hTot;
  for (let k = 0; k < copias; k++) {
    const bx = caja.x + (vertical ? 0 : k * wMol), by = caja.y + (vertical ? k * hUtil : 0);
    const pos = atomos.map(a => ({ x: bx + 0.15 * wMol + a.x * wMol * 0.7, y: by + 0.15 * hUtil + a.y * hUtil * 0.7 }));
    const r = Math.min(wMol * 0.13, hUtil * 0.3);
    enlaces.forEach(([i, j, orden = 1]) => {
      const a = pos[i], b = pos[j], dx = b.x - a.x, dy = b.y - a.y, L = Math.hypot(dx, dy), ox = -dy / L * 0.07, oy = dx / L * 0.07;
      for (let m = 0; m < orden; m++) {
        const f = orden === 1 ? 0 : (m - (orden - 1) / 2) * 2;
        const x1 = a.x + ox * f, y1 = a.y + oy * f, x2 = b.x + ox * f, y2 = b.y + oy * f;
        s.addShape(p.ShapeType.line, { x: Math.min(x1, x2), y: Math.min(y1, y2), w: Math.abs(x2 - x1) || 0.001, h: Math.abs(y2 - y1) || 0.001, flipV: (x2 - x1) * (y2 - y1) < 0, line: { color: '334155', width: 3 }, objectName: 'enlace' });
      }
    });
    atomos.forEach((a, i) => {
      const C = COL[a.sim] || COL.C, rr = a.sim === 'H' ? r * 0.7 : r;
      s.addShape(p.ShapeType.ellipse, { x: pos[i].x - rr, y: pos[i].y - rr, w: 2 * rr, h: 2 * rr, fill: { color: C[1] }, line: { color: C[0], width: 2 }, objectName: 'átomo ' + a.sim });
      s.addText(a.sim, { x: pos[i].x - rr, y: pos[i].y - rr, w: 2 * rr, h: 2 * rr, fontFace: FUENTE, fontSize: Math.max(12, Math.round(rr * 50)), bold: true, color: C[0], align: 'center', valign: 'middle', margin: 0, isTextBox: true });
    });
  }
  s.addText(nota(p, leyenda), { x: caja.x, y: caja.y + caja.h - 0.55, w: caja.w, h: 0.5, fontFace: FUENTE, fontSize: 16, color: '334155', align: 'center', margin: 0, isTextBox: true });
}

/* Los tres niveles de Johnstone en una diapositiva: lo que vemos, las partículas, los símbolos.
   macro: {foto: clave} o {archivo, cita} y pie · submicro: {ionico: {...}} o {molecula: {...}} · simbolico: ['…'] */
async function johnstone(p, titulo, { macro, submicro, simbolico, notas = '' }) {
  const S = p._nom.S, s = contenido(p, titulo), w = (W - 2 * M - 0.5) / 3, y = 1.5, h = 5.05;
  ['Lo que vemos', 'Lo que pasa con las partículas', 'Cómo lo escribimos'].forEach((t, i) => {
    const x = M + i * (w + 0.25);
    s.addShape(p.ShapeType.roundRect, { x, y, w, h, rectRadius: 0.12, fill: { color: i === 1 ? 'FFFFFF' : S.claro }, line: { color: S.claro, width: 2 }, objectName: 'nivel ' + t });
    s.addText(t, { x: x + 0.15, y: y + 0.1, w: w - 0.3, h: 0.5, fontFace: FUENTE, fontSize: 18, bold: true, color: S.medio, align: 'center', margin: 0, isTextBox: true });
  });
  const cx = (i) => ({ x: M + i * (w + 0.25) + 0.15, y: y + 0.7, w: w - 0.3, h: h - 0.85 });
  await foto(s, macro.foto || null, cx(0), macro.pie || '', macro.foto ? {} : { archivo: macro.archivo, cita: macro.cita });
  if (submicro.ionico) modeloIonico(s, submicro.ionico, cx(1)); else if (submicro.molecula) modeloMolecula(s, submicro.molecula, cx(1));
  const c2 = cx(2);
  s.addText(simbolico.map((t, i) => ({ text: nota(p, t), options: { breakLine: i < simbolico.length - 1, paraSpaceAfter: 14 } })),
    { x: c2.x, y: c2.y + 0.2, w: c2.w, h: c2.h - 0.4, fontFace: FUENTE, fontSize: 22, bold: true, color: S.tinta, align: 'center', valign: 'middle', margin: 0, isTextBox: true, fit: 'shrink' });
  s.addNotes(notas || 'Recorrer los tres niveles de izquierda a derecha: lo observable, el modelo de partículas y la representación simbólica.');
  return s;
}

/* Consigna fija de actividad: tarea, roles, criterios de éxito, tiempo y entrega. */
function consigna(p, { titulo = 'Manos a la obra', tarea, roles = [], criterios = [], tiempo, entrega = '' }) {
  const S = p._nom.S, s = contenido(p, titulo), wI = 8.6;
  s.addText(nota(p, tarea), { x: M, y: 1.45, w: wI, h: 0.9, fontFace: FUENTE, fontSize: 24, bold: true, color: S.tinta, valign: 'middle', margin: 0, isTextBox: true, fit: 'shrink' });
  const col = (t, items, x, y, ww, hh) => { tarjeta(s, { titulo: t, x, y, w: ww, h: hh }); texto(s, items, { x: x + 0.2, y: y + 0.75, w: ww - 0.4, h: hh - 0.9 }, { tam: 21 }); };
  if (roles.length) col('Roles', roles, M, 2.5, wI / 2 - 0.15, 3.95);
  col('Criterios de éxito', criterios, roles.length ? M + wI / 2 + 0.15 : M, 2.5, roles.length ? wI / 2 - 0.15 : wI, 3.95);
  const x = M + wI + 0.3, w = W - M - x;
  s.addShape(p.ShapeType.ellipse, { x: x + (w - 2.6) / 2, y: 1.6, w: 2.6, h: 2.6, fill: { color: S.oscuro }, line: { color: S.acento, width: 6 }, objectName: 'tiempo' });
  s.addText([{ text: String(tiempo), options: { fontSize: 54, bold: true, breakLine: true } }, { text: 'minutos', options: { fontSize: 18 } }],
    { x: x + (w - 2.6) / 2, y: 1.6, w: 2.6, h: 2.6, fontFace: FUENTE, color: 'FFFFFF', align: 'center', valign: 'middle', margin: 0, isTextBox: true });
  if (entrega) s.addText([{ text: 'Entrega: ', options: { bold: true, color: S.oscuro } }, { text: nota(p, entrega), options: { color: '1F2937' } }],
    { x, y: 4.45, w, h: 2.0, fontFace: FUENTE, fontSize: 18, valign: 'top', margin: 0, isTextBox: true, fit: 'shrink' });
  s.addNotes('Dejar esta diapositiva proyectada durante la actividad.');
  return s;
}

/* Mapa conceptual de síntesis: raíz, ramas e ideas; las de «ocultar» salen en blanco y luego resueltas. */
function mapa(p, { titulo = 'Síntesis', raiz, ramas, ocultar = [], completar = true }) {
  const S = p._nom.S, n = ramas.length;
  const dibujar = (resuelto) => {
    const s = contenido(p, titulo + (resuelto ? ': completo' : ': complétalo'));
    const rw = 3.6, rx = (W - rw) / 2;
    s.addShape(p.ShapeType.roundRect, { x: rx, y: 1.45, w: rw, h: 0.85, rectRadius: 0.14, fill: { color: S.oscuro }, line: { color: S.oscuro }, objectName: 'raíz' });
    s.addText(nota(p, raiz), { x: rx, y: 1.45, w: rw, h: 0.85, fontFace: FUENTE, fontSize: 24, bold: true, color: 'FFFFFF', align: 'center', valign: 'middle', margin: 0, isTextBox: true });
    const w = (W - 2 * M - 0.25 * (n - 1)) / n;
    ramas.forEach((r, i) => {
      const x = M + i * (w + 0.25), cx = x + w / 2, top = 2.3, yb = 3.05;
      s.addShape(p.ShapeType.line, { x: Math.min(W / 2, cx), y: top, w: Math.abs(cx - W / 2) || 0.001, h: yb - top, flipH: cx < W / 2, line: { color: S.medio, width: 2, endArrowType: 'triangle' }, objectName: 'conector' });
      s.addShape(p.ShapeType.roundRect, { x, y: yb, w, h: 0.75, rectRadius: 0.1, fill: { color: S.claro }, line: { color: S.medio, width: 1.5 }, objectName: 'rama ' + r.t });
      s.addText(nota(p, r.t), { x, y: yb, w, h: 0.75, fontFace: FUENTE, fontSize: 22, bold: true, color: S.oscuro, align: 'center', valign: 'middle', margin: 0.05, isTextBox: true, fit: 'shrink' });
      (r.items || []).forEach((it, j) => {
        const y = 4.0 + j * 0.85, oculto = ocultar.includes(it) && !resuelto, nuevo = ocultar.includes(it) && resuelto;
        s.addShape(p.ShapeType.roundRect, { x: x + 0.1, y, w: w - 0.2, h: 0.72, rectRadius: 0.08, fill: { color: nuevo ? 'DCFCE7' : 'FFFFFF' }, line: { color: oculto ? '94A3B8' : 'CBD5E1', dashType: oculto ? 'dash' : 'solid' }, objectName: 'idea' });
        s.addText(oculto ? '?' : nota(p, it), { x: x + 0.1, y, w: w - 0.2, h: 0.72, fontFace: FUENTE, fontSize: 19, bold: nuevo || oculto, color: oculto ? '94A3B8' : '1F2937', align: 'center', valign: 'middle', margin: 0.04, isTextBox: true, fit: 'shrink' });
      });
    });
    s.addNotes(resuelto ? 'Mapa completo para comparar.' : 'Los estudiantes completan las casillas con «?» en el cuaderno. Faltan: ' + ocultar.join(', ') + '.');
  };
  dibujar(false); if (completar && ocultar.length) dibujar(true);
}

/* Ticket de salida: 1 a 3 preguntas breves de transferencia o autoevaluación. */
function ticket(p, { preguntas, titulo = 'Ticket de salida', instruccion = 'Responde en un papel y entrégalo al salir.' }) {
  const S = p._nom.S, s = contenido(p, titulo);
  s.addText(nota(p, instruccion), { x: M, y: 1.45, w: W - 2 * M, h: 0.55, fontFace: FUENTE, fontSize: 20, italic: true, color: S.medio, margin: 0, isTextBox: true });
  const h = Math.min(1.5, 4.4 / preguntas.length);
  preguntas.forEach((q, i) => {
    const y = 2.15 + i * h;
    s.addShape(p.ShapeType.roundRect, { x: M, y, w: W - 2 * M, h: h - 0.15, rectRadius: 0.1, fill: { color: i % 2 ? 'FFFFFF' : S.claro }, line: { color: S.claro }, objectName: 'pregunta ' + (i + 1) });
    s.addText([{ text: (i + 1) + '. ', options: { bold: true, color: S.oscuro } }, { text: nota(p, q), options: { color: '1F2937' } }],
      { x: M + 0.25, y, w: W - 2 * M - 0.5, h: h - 0.15, fontFace: FUENTE, fontSize: 22, valign: 'middle', margin: 0, isTextBox: true, fit: 'shrink' });
  });
  s.addNotes('Revisar los tickets para decidir qué retomar la próxima clase.');
  return s;
}

/* Diapositiva final: practicar en el sitio, con código QR si está el módulo qrcode. */
async function practica(p, { url, texto: tx = 'Practica en el sitio', detalle = '' }) {
  const s = contenido(p, tx), S = p._nom.S;
  let qr = null; try { qr = await require('qrcode').toDataURL(url, { margin: 1, width: 600, color: { dark: '#' + S.oscuro } }); } catch (e) { /* sin QR */ }
  if (qr) s.addImage({ data: qr, x: W - M - 3.6, y: 1.6, w: 3.6, h: 3.6, altText: 'Código QR: ' + url });
  s.addText([{ text: nota(p, detalle || 'Abre el enlace en el celular o en la sala de sistemas.'), options: { breakLine: true } }, { text: url, options: { hyperlink: { url }, color: S.medio, bold: true } }],
    { x: M, y: 1.7, w: qr ? W - 2 * M - 4.0 : W - 2 * M, h: 3.4, fontFace: FUENTE, fontSize: 24, color: '1F2937', margin: 0, isTextBox: true, valign: 'top', paraSpaceAfter: 14 });
  return s;
}

async function guardar(p, archivo) {
  const salida = path.resolve(archivo);
  await p.writeFile({ fileName: salida });
  const S = p._nom.S;
  const THEME = { name: S.nombre, headFontFace: FUENTE_T, bodyFontFace: FUENTE,
    colors: { dk1: '1F2937', lt1: 'FFFFFF', dk2: S.oscuro, lt2: S.claro, accent1: S.medio, accent2: S.acento, accent3: '15803D', accent4: 'B42318', accent5: '64748B', accent6: S.tinta, hlink: S.medio, folHlink: S.oscuro } };
  // tema de la skill pptx, si está instalada al lado
  const cand = [path.join(__dirname, '..', '..', 'pptx', 'scripts', 'apply_theme.js')];
  for (const c of cand) if (fs.existsSync(c)) { try { await require(c).applyTheme(salida, THEME); } catch (e) { /* sigue sin tema */ } break; }
  // quita las entradas de carpeta del ZIP (algunos servicios en la nube no abren el archivo con ellas)
  try { require('child_process').execFileSync('zip', ['-dq', salida, '*/'], { stdio: 'ignore' }); } catch (e) { /* sin zip o sin carpetas */ }
  const avisos = revisar(p._nom.textos.join('\n'));
  (p._nom.diaps || []).forEach(d => {
    d.largas.forEach(t => avisos.push(`«${d.titulo}»: viñeta de ${palabras(t)} palabras (máximo 8): «${t}»`));
    if (d.palabras > 45) avisos.push(`«${d.titulo}»: ${d.palabras} palabras de texto corrido; deja el detalle en las notas o usa un esquema.`);
  });
  return { archivo: salida, avisos };
}

module.exports = { SITIOS, W, H, M, nueva, portada, seccion, contenido, texto, tarjeta, claves, foto, imagen, chequeo, practica, guardar,
  fichas, tabla, pasos, cruce, ejemplo, ejercicios, comparar, medidas,
  objetivo, encuesta, johnstone, modeloIonico, modeloMolecula, consigna, mapa, ticket };
