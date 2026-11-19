#!/usr/bin/env node
/* actualizar.js — vuelve a sacar de los tres sitios del docente los datos que usa
   nom-planeacion (temas, guías de 4 sesiones, alineación curricular y páginas).
   Uso: node scripts/actualizar.js <carpeta bionom> <carpeta chromanom> <carpeta ionom>
   Deja datos/planeacion.json. */
'use strict';
const fs = require('fs'), path = require('path'), vm = require('vm');
const [BIO, CHR, ION] = process.argv.slice(2);
if (!ION) { console.error('Uso: node scripts/actualizar.js <bionom> <chromanom> <ionom>'); process.exit(1); }
const SALIDA = path.join(__dirname, '..', 'datos', 'planeacion.json');

function cargar(archivos) {
  const w = {}; w.window = w; w.self = w;
  w.document = { querySelector() { return null; }, querySelectorAll() { return []; }, addEventListener() {}, getElementById() { return null; }, createElement() { return { style: {}, setAttribute() {}, appendChild() {} }; } };
  w.navigator = {}; w.localStorage = { getItem() { return null; }, setItem() {} }; w.location = { search: '', pathname: '' };
  const c = vm.createContext(w);
  for (const f of archivos) vm.runInContext(fs.readFileSync(f, 'utf8'), c, { filename: f });
  return w;
}
const limpiar = s => String(s || '').replace(/<[^>]+>/g, '').replace(/🔊\s*Escuchar/g, '').replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/\s+/g, ' ').trim();

/* Índice de una página: título y secciones (id + primer h2). */
function indice(dir, archivo, base) {
  const f = path.join(dir, archivo);
  if (!fs.existsSync(f)) return null;
  const h = fs.readFileSync(f, 'utf8');
  const titulo = limpiar((h.match(/<title>([\s\S]*?)<\/title>/) || [])[1]);
  const secciones = [], vistos = new Set();
  const nivel = (h.match(/<h2\b/g) || []).length >= 3 ? 'h2' : 'h[23]';
  const re = new RegExp('<(' + nivel + ')\\b[^>]*>([\\s\\S]*?)<\\/\\1>', 'g'); let m;
  while ((m = re.exec(h))) {
    const t = limpiar(m[2]);
    if (!t || /['+]\s*\+|\+\s*'/.test(t) || /^Palabras clave/i.test(t) || vistos.has(t)) continue;
    const antes = h.slice(Math.max(0, m.index - 2500), m.index);
    const ids = [...antes.matchAll(/<section\b[^>]*\bid="([^"]+)"/g)].map(x => x[1]);
    vistos.add(t); secciones.push({ id: ids.length ? ids[ids.length - 1] : null, titulo: t.slice(0, 110) });
  }
  const sims = (h.match(/data-(simx|anim|pantalla)="[^"]+"/g) || []).length + (h.match(/<canvas\b/g) || []).length;
  return { archivo, url: base + archivo, titulo, secciones, simulaciones: sims > 0 };
}

const sitios = {};

/* ───────────── BioNom ───────────── */
{
  const w = cargar([path.join(BIO, 'docente-datos.js'), path.join(BIO, 'dba-bio.js')]);
  const D = w.DOCENTE_DATOS, B = w.BIO_DBA, base = 'https://hbarcenasm863.github.io/bionom/';
  const bioJs = fs.readFileSync(path.join(BIO, 'bio.js'), 'utf8');
  const mod = {}; (bioJs.match(/\{id:'[a-z]+'[^\n]*href:'[a-z-]+\.html'[^\n]*\}/g) || []).forEach(l => {
    const id = l.match(/id:'([a-z]+)'/)[1], href = l.match(/href:'([^']+)'/)[1], padre = (l.match(/padre:'([a-z]+)'/) || [])[1];
    mod[id] = { href, padre };
  });
  const pag = { colombia: ['regiones.html'] };
  const dbaPorTema = {};
  Object.keys(B.DBA).forEach(g => B.DBA[g].forEach(d => (d.temas || []).forEach(t => {
    (dbaPorTema[t] = dbaPorTema[t] || []).push({ id: g + '.' + d.n, grado: +g, num: d.n, texto: d.tx, evidencias: d.ev || [] });
  })));
  /* Estándares MEN (MATRIZ_MEN.md) */
  const men = fs.readFileSync(path.join(BIO, 'MATRIZ_MEN.md'), 'utf8').split('\n');
  const estandares = []; let banda = '', comp = '';
  for (const l of men) {
    if (/^## /.test(l)) { banda = l.slice(3).trim(); comp = ''; if (/^(Resumen|Actualizaci|Grado sugerido)/.test(banda)) banda = ''; continue; }
    if (/^### /.test(l)) { comp = l.slice(4).trim(); continue; }
    const c = l.split('|').map(s => s.trim());
    if (banda && c.length >= 4 && c[1] && !/^(Estándar|---)/.test(c[1]) && !/^-+$/.test(c[1])) estandares.push({ banda, componente: comp, texto: c[1].replace(/\*\*/g, ''), dondeEnBioNom: c[3] ? c[3].replace(/\*\*/g, '') : '' });
  }
  const conteo = (lista, id) => (Array.isArray(lista) ? lista.filter(q => q.t === id).length : ((lista || {})[id] || []).length);
  sitios.bio = {
    nombre: 'BioNom', materia: 'Biología (6.° a 11.°)', url: base,
    fuenteDBA: B.FUENTE || 'Ministerio de Educación Nacional. (2016). Derechos Básicos de Aprendizaje. Ciencias Naturales (V.1).',
    fuenteEstandares: 'Ministerio de Educación Nacional. (2004). Estándares Básicos de Competencias en Ciencias Naturales y Ciencias Sociales.',
    estandaresMEN: estandares,
    temas: D.TEMAS.map(t => {
      const m = mod[t.id]; const archivos = pag[t.id] || (m ? [m.href] : []);
      if (t.id === 'celula') archivos.push('microscopio.html');
      return {
        id: t.id, titulo: t.titulo, corto: t.corto, cursoBase: B.BASE[t.id] || null,
        dba: dbaPorTema[t.id] || [],
        paginas: archivos.map(a => indice(BIO, a, base)).filter(Boolean),
        hojaReferencia: null,
        previos: t.previos, lectura: (t.info.lectura || []).map(limpiar), esquema: t.info.esquema || null, puedo: t.puedo || [],
        banco: { saber: conteo(D.SABER, t.id), abiertas: conteo(D.ABIERTAS, t.id) }
      };
    })
  };
  const ref = fs.readFileSync(path.join(BIO, 'referencias.html'), 'utf8');
  const hojas = [...ref.matchAll(/data-hoja="([a-z]+)" data-tit="([^"]+)"[^>]*data-tema="([^"]+)"/g)];
  sitios.bio.hojasReferencia = hojas.map(h => ({ id: h[1], titulo: h[2], tema: h[3], url: base + 'referencias.html?hoja=' + h[1] }));
}

/* ───────────── ChromaNom ───────────── */
{
  const w = cargar([path.join(CHR, 'docente-datos.js')]);
  const D = w.DOCENTE_DATOS, A = D.ALINEACION, base = 'https://hbarcenasm863.github.io/chromanom/';
  const P = { carbono: ['carbono.html'], tipos_carbono: ['carbono.html'], cadenas: ['cadenas.html'], cadena: ['cadenas.html', 'teoria.html'],
    isomeria: ['isomeria.html'], reacciones: ['reacciones.html'], orbitales: ['orbitales.html'], propiedades: ['propiedades.html'],
    biomoleculas: ['biomoleculas.html'], ambiente: ['ambiente.html'] };
  const ev = {}; A.sed.forEach(s => s.evid.forEach(e => ev[e.id] = { id: e.id, sed: s.id, grado: s.grado, competencia: e.comp, texto: e.t }));
  const conteo = (lista, id) => (Array.isArray(lista) ? lista.filter(q => q.t === id).length : ((lista || {})[id] || []).length);
  sitios.chroma = {
    nombre: 'ChromaNom', materia: 'Química orgánica (11.°)', url: base,
    fuenteSED: A.fuenteSED,
    sed: A.sed.map(s => ({ id: s.id, grado: s.grado, pagina: s.pag, proceso: s.proceso, componente: s.componente, texto: s.texto, evidencias: s.evid.map(e => ({ id: e.id, competencia: e.comp, texto: e.t })) })),
    estandares: A.estandares, dba: A.dba,
    temas: D.TEMAS.map(t => {
      const al = t.alin || {};
      return {
        id: t.id, titulo: t.titulo, corto: t.corto, cursoBase: 11,
        dba: (al.dba || []).map(id => A.dba.find(d => d.id === id)).filter(Boolean),
        estandares: (al.est || []).map(id => A.estandares.find(e => e.id === id)).filter(Boolean),
        sed: { g11: al.g11 ? { enunciado: al.g11.sed, evidencias: (al.g11.ev || []).map(i => ev[i]).filter(Boolean) } : null,
               g10: al.g10 ? { enunciado: al.g10.sed, evidencias: (al.g10.ev || []).map(i => ev[i]).filter(Boolean) } : null },
        paginas: (P[t.id] || ['teoria.html', 'grupos.html']).map(a => indice(CHR, a, base)).filter(Boolean),
        previos: t.previos, lectura: ((t.info || {}).lectura || []).map(limpiar), esquema: (t.info || {}).esquema || null, puedo: t.puedo || [],
        banco: { saber: conteo(D.SABER, t.id), abiertas: conteo(D.ABIERTAS, t.id) }
      };
    })
  };
}

/* ───────────── IonNom ───────────── */
{
  const w = cargar([path.join(ION, 'assets', 'docente-datos.js')]);
  const D = w.DOCENTE_DATOS, base = 'https://hbarcenasm863.github.io/ionom/';
  const chr = sitios.chroma; const sed10 = chr.sed.find(s => s.id === 'sed10q'), sed10c = chr.sed.find(s => s.id === 'sed10c');
  const E = id => { const s = [sed10, sed10c].find(x => x.evidencias.some(e => e.id === id)); const e = s.evidencias.find(x => x.id === id); return { id, sed: s.id, grado: 10, competencia: e.competencia, texto: e.texto }; };
  const nom = ['ox-bas', 'anhid', 'hidru', 'ac-hid', 'base', 'ac-ox', 'sal-bin', 'sal-ox', 'sal-ac'];
  /* Alineación propuesta por la skill (IonNom no la trae escrita): revisar con el docente. */
  const AL = { balanceo: ['10q-ind2', '10q-uso2'], reaccion: ['10q-ind2', '10q-exp2'], 'mol-masa': ['10q-uso2'], elemento: ['10q-exp1', '10q-exp2'],
    reactividad: ['10q-exp2'], estequiometria: ['10q-uso2', '10q-ind2'], atomo: ['10q-exp1', '10c-exp'], 'config-e': ['10q-exp1'], enlace: ['10q-exp3'],
    modelos: ['10c-ind', '10c-exp', '10c-uso'], acidobase: ['10q-ind1', '10q-ind3', '10q-exp4'], industria: ['10q-uso3', '10q-uso2'], gases: ['10c-uso', '10c-ind'], soluciones: ['10q-uso2', '10c-uso'] };
  nom.forEach(n => AL[n] = ['10q-uso1', '10q-exp3']);
  const P = { balanceo: ['balanceo.html', 'balanceo-avanzado.html'], reaccion: ['reacciones.html'], 'mol-masa': ['moles.html'], elemento: ['tabla.html'],
    reactividad: ['teoria.html'], estequiometria: ['estequiometria.html'], atomo: ['atomo.html', 'modelos.html'], 'config-e': ['configuracion.html'], enlace: ['enlace.html'],
    modelos: ['modelos.html'], acidobase: ['ph.html'], industria: ['industria.html'], gases: ['gases.html'], soluciones: ['soluciones.html'] };
  nom.forEach(n => P[n] = ['funciones.html', 'teoria.html']);
  const conteo = (lista, id) => (Array.isArray(lista) ? lista.filter(q => q.t === id).length : ((lista || {})[id] || []).length);
  sitios.ion = {
    nombre: 'IonNom', materia: 'Química inorgánica (10.°)', url: base,
    notaAlineacion: 'IonNom no trae la alineación escrita en sus datos: las evidencias de la SED (10.°) de cada tema son una propuesta de la skill. Confirmarlas con el docente.',
    fuenteSED: chr.fuenteSED, sed: [sed10, sed10c],
    temas: D.TEMAS.map(t => ({
      id: t.id, titulo: t.titulo, corto: t.titulo, cursoBase: 10,
      sed: { g10: { evidencias: (AL[t.id] || []).map(E), propuesta: true } },
      paginas: (P[t.id] || []).map(a => indice(ION, a, base)).filter(Boolean),
      previos: t.previos, lectura: ((t.info || {}).lectura || []).map(limpiar), esquema: (t.info || {}).esquema || null, puedo: t.puedo || [],
      ejemplo: t.ejemplo || null,
      banco: { saber: conteo(D.SABER, t.id), abiertas: conteo(D.ABIERTAS, t.id) }
    }))
  };
  const g = fs.readdirSync(path.join(ION, 'assets')).filter(f => /^guia-.*\.pdf$/.test(f));
  sitios.ion.guiasPDF = g.map(f => ({ archivo: f, url: base + 'assets/' + f }));
}
{
  const g = fs.existsSync(path.join(CHR, 'pdf')) ? fs.readdirSync(path.join(CHR, 'pdf')).filter(f => /^guia-.*\.pdf$/.test(f)) : [];
  sitios.chroma.guiasPDF = g.map(f => ({ archivo: f, url: sitios.chroma.url + 'pdf/' + f }));
}

const fecha = new Date().toISOString().slice(0, 10);
fs.writeFileSync(SALIDA, JSON.stringify({ fecha, sitios }, null, 1));
const n = s => sitios[s].temas.length;
console.log(`Listo (${fecha}): BioNom ${n('bio')} temas, ChromaNom ${n('chroma')}, IonNom ${n('ion')} → ${SALIDA}`);
