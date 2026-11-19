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
function contenido(p, titulo) { const s = diap(p, 'NOM_CONTENIDO'); s.addText(nota(p, titulo), { placeholder: 'title' }); s._nomP = p; return s; }

/* Texto con viñetas en una caja. items: ['…', '…'] o [{text, options}] */
function texto(s, items, caja, op = {}) {
  const p = s._nomP; const arr = (Array.isArray(items) ? items : [items]);
  const runs = arr.map((t, i) => { const tx = typeof t === 'string' ? t : t.text; nota(p, tx);
    return { text: tx, options: Object.assign({ bullet: op.vinetas === false ? false : { indent: 18 }, breakLine: i < arr.length - 1, paraSpaceAfter: 8 }, typeof t === 'string' ? {} : t.options) }; });
  s.addText(runs, Object.assign({ x: caja.x, y: caja.y, w: caja.w, h: caja.h, fontFace: FUENTE, fontSize: op.tam || 22, color: '1F2937', valign: 'top', margin: 0, isTextBox: true }, op.extra || {}));
}
/* Tarjeta: recuadro con fondo suave, título y texto. */
function tarjeta(s, { titulo, cuerpo, x, y, w, h, color }) {
  const p = s._nomP, S = p._nom.S;
  s.addShape(p.ShapeType.roundRect, { x, y, w, h, rectRadius: 0.12, fill: { color: color || S.claro }, line: { color: color || S.claro }, objectName: 'tarjeta ' + (titulo || '') });
  if (titulo) s.addText(nota(p, titulo), { x: x + 0.2, y: y + 0.15, w: w - 0.4, h: 0.5, fontFace: FUENTE, fontSize: 20, bold: true, color: S.oscuro, margin: 0, isTextBox: true, valign: 'top' });
  if (cuerpo) s.addText(nota(p, cuerpo), { x: x + 0.2, y: y + (titulo ? 0.7 : 0.2), w: w - 0.4, h: h - (titulo ? 0.85 : 0.4), fontFace: FUENTE, fontSize: 18, color: '1F2937', margin: 0, isTextBox: true, valign: 'top' });
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
    for (const u of [`https://raw.githubusercontent.com/hbarcenasm863/${f.repo}/main/${f.archivo}`, `https://hbarcenasm863.github.io/${f.repo}/${f.archivo}`]) {
      try { const r = await fetch(u); if (r.ok) { fs.writeFileSync(archivo, Buffer.from(await r.arrayBuffer())); ok = true; break; } } catch (e) { /* siguiente */ }
    }
    if (!ok) throw new Error('No pude descargar la foto ' + clave);
    const lic = f.licUrl ? `Licencia ${f.lic} (${f.licUrl})` : f.lic;
    cita = `${String(f.autor).replace(/\.$/, '')}. (${f.anio || 's. f.'}). ${f.titulo} [${f.tipo || 'Fotografía'}]. ${f.fuente || 'Wikimedia Commons'}. ${f.url}. ${lic}.`;
    op.w0 = f.w; op.h0 = f.h;
  }
  if (!cita) throw new Error('Toda foto lleva su cita APA: pasa op.cita');
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
  // palabras por diapositiva: aviso si alguna supera 60 (coherencia de Mayer)
  return { archivo: salida, avisos };
}

module.exports = { SITIOS, W, H, M, nueva, portada, seccion, contenido, texto, tarjeta, claves, foto, imagen, chequeo, practica, guardar };
