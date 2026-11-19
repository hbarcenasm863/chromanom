#!/usr/bin/env node
/* fotos.js — fotos reales con licencia libre que ya usan BioNom, ChromaNom e IonNom,
   con su cita APA lista (datos/fotos.json).

   node scripts/fotos.js buscar <texto> [--sitio bio|chroma|ion]   busca por clave, título o autor
   node scripts/fotos.js cita <clave> [--html]                      cita APA de una foto
   node scripts/fotos.js bajar <clave[,clave2]> <carpeta>           descarga la imagen (JPG)
   node scripts/fotos.js actualizar <bionom> <chromanom> <ionom>    vuelve a leer los fotos-datos.js

   Si la foto que se necesita no está, se busca una nueva en Wikimedia Commons, Openverse o
   iNaturalist (licencias CC0, dominio público, CC BY o CC BY-SA) y se cita igual. */
'use strict';
const fs = require('fs'), path = require('path'), vm = require('vm');
const DATOS = path.join(__dirname, '..', 'datos', 'fotos.json');
const [cmd, a1, a2, a3] = process.argv.slice(2);
const sitioOp = (() => { const i = process.argv.indexOf('--sitio'); return i > 0 ? process.argv[i + 1] : null; })();
process.stdout.on('error', () => process.exit(0));

function apa(d, html) {
  const e = s => String(s == null ? '' : s);
  const lic = d.licUrl ? `Licencia ${e(d.lic)} (${e(d.licUrl)})` : e(d.lic);
  if (html) return `${e(d.autor).replace(/\.$/, '')}. (${e(d.anio || 's. f.')}). <i>${e(d.titulo)}</i> [${e(d.tipo || 'Fotografía')}]. ${e(d.fuente || 'Wikimedia Commons')}. ${e(d.url)}. ${d.licUrl ? 'Licencia ' + e(d.lic) : e(d.lic)}.`;
  return `${e(d.autor).replace(/\.$/, '')}. (${e(d.anio || 's. f.')}). ${e(d.titulo)} [${e(d.tipo || 'Fotografía')}]. ${e(d.fuente || 'Wikimedia Commons')}. ${e(d.url)}. ${lic}.`;
}

if (cmd === 'actualizar') {
  const [BIO, CHR, ION] = [a1, a2, a3];
  const fuentes = [['bio', BIO, 'fotos-datos.js', 'img/fotos/', 'bionom'], ['chroma', CHR, 'fotos-datos.js', 'img/fotos/', 'chromanom'], ['ion', ION, 'assets/fotos-datos.js', 'assets/fotos/', 'ionom']];
  const todas = [];
  for (const [sitio, dir, archivo, ruta, repo] of fuentes) {
    const w = {}; w.window = w; vm.runInContext(fs.readFileSync(path.join(dir, archivo), 'utf8'), vm.createContext(w));
    const F = w.FOTOS_DATOS || {}, r = w.FOTOS_RUTA || ruta;
    for (const k of Object.keys(F)) {
      const ext = ['jpg', 'png', 'webp'].find(x => fs.existsSync(path.join(dir, r, k + '.' + x))) || 'jpg';
      todas.push(Object.assign({ clave: k, sitio, archivo: r + k + '.' + ext, repo }, F[k]));
    }
  }
  fs.mkdirSync(path.dirname(DATOS), { recursive: true });
  fs.writeFileSync(DATOS, JSON.stringify({ fecha: new Date().toISOString().slice(0, 10), fotos: todas }, null, 0));
  console.log(`Listo: ${todas.length} fotos (${['bio', 'chroma', 'ion'].map(s => s + ' ' + todas.filter(f => f.sitio === s).length).join(', ')}).`);
  process.exit(0);
}

const { fotos } = JSON.parse(fs.readFileSync(DATOS, 'utf8'));
const una = k => { const f = fotos.find(x => x.clave === k && (!sitioOp || x.sitio === sitioOp)); if (!f) { console.log(`No existe la foto «${k}». Busca con: node scripts/fotos.js buscar <texto>`); process.exit(1); } return f; };

if (cmd === 'buscar') {
  const q = (a1 || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
  const norm = s => String(s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
  const r = fotos.filter(f => (!sitioOp || f.sitio === sitioOp) && [f.clave, f.titulo, f.autor].some(x => norm(x).includes(q)));
  r.forEach(f => console.log(`${f.sitio.padEnd(6)} ${f.clave.padEnd(22)} ${f.titulo}  (${f.lic}; ${f.w || '?'}×${f.h || '?'})`));
  console.log(r.length ? `\n${r.length} foto(s). Cita: node scripts/fotos.js cita <clave>` : 'Ninguna. Prueba otra palabra (en inglés también: los títulos de Commons suelen estar en inglés) o busca una foto nueva.');
} else if (cmd === 'cita') {
  console.log(apa(una(a1), process.argv.includes('--html')));
} else if (cmd === 'bajar') {
  const destino = path.resolve(a2 || '.'); fs.mkdirSync(destino, { recursive: true });
  (async () => {
    for (const k of (a1 || '').split(',')) {
      const f = una(k); const nombre = path.join(destino, path.basename(f.archivo));
      const urls = [`https://raw.githubusercontent.com/hbarcenasm863/${f.repo}/main/${f.archivo}`, `https://hbarcenasm863.github.io/${f.repo}/${f.archivo}`];
      let ok = false;
      for (const u of urls) {
        try { const r = await fetch(u); if (r.ok) { fs.writeFileSync(nombre, Buffer.from(await r.arrayBuffer())); ok = true; break; } } catch (e) { /* siguiente */ }
      }
      console.log(ok ? `${nombre}\n  Cita: ${apa(f)}` : `No pude descargar «${k}». Si los repositorios están en el equipo, cópiala de ${f.repo}/${f.archivo}.`);
    }
  })();
} else {
  console.log(fs.readFileSync(__filename, 'utf8').split('\n').slice(1, 11).join('\n'));
}
