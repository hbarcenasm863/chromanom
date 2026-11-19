#!/usr/bin/env node
/* hoja.js — arma una hoja de referencia (carta) con el logo, la marca de agua y el pie
   de BioNom, ChromaNom o IonNom, agranda el contenido hasta llenar la página sin tapar
   el pie y la guarda en PDF (y PNG para revisarla).

   node scripts/hoja.js contenido.html --sitio bio --titulo "La célula" --tema "La célula"
        --ico "🔬" --salida celula.pdf [--png] [--horizontal] [--pie-izq "…"] [--pie-der "…"]

   contenido.html: solo el cuerpo (recuadros .rc, .cols2, tablas .t-ref…). Para varias
   páginas, sepáralas con una línea <!-- pagina -->. */
'use strict';
const fs = require('fs'), path = require('path'), os = require('os');
const { revisar } = require('./revisar-texto');
const A = path.join(__dirname, '..', 'assets');
const args = process.argv.slice(2);
const op = (n, d) => { const i = args.indexOf('--' + n); if (i < 0) return d; const v = args[i + 1]; return v !== undefined && !v.startsWith('--') ? v : true; };
const CON_VALOR = ['sitio', 'titulo', 'tema', 'ico', 'salida', 'pie-izq', 'pie-der'];
const entrada = args.find((a, i) => !a.startsWith('--') && !(i > 0 && CON_VALOR.includes(args[i - 1].slice(2))));
if (!entrada) { console.log(fs.readFileSync(__filename, 'utf8').split('\n').slice(1, 10).join('\n')); process.exit(1); }

const SITIOS = {
  bio: { nombre: 'BioNom', logo: 'logo-bio.png', marca: 'marca-bio.png', azul: '#0f2a5f', acento: '#1f7a3f',
    tira: 'linear-gradient(90deg,#1565d8 0 25%,#3cc11f 25% 50%,#f6c400 50% 75%,#e91e63 75%)',
    pie: '<span>Bio<b>Nom</b> · Biología por niveles de organización</span>' },
  chroma: { nombre: 'ChromaNom', logo: 'logo-chroma.png', marca: 'marca-chroma.png', azul: '#0d4a73', acento: '#1a6ea8',
    tira: 'linear-gradient(90deg,#1565d8 0 25%,#3cc11f 25% 50%,#f6c400 50% 75%,#e91e63 75%)',
    pie: '<span>Chroma<b>Nom</b> · Química orgánica</span>' },
  ion: { nombre: 'IonNom', logo: 'logo-ion.png', marca: 'marca-ion.png', azul: '#0d4a73', acento: '#00659e',
    tira: 'linear-gradient(90deg,#E69F00 0 25%,#0072B2 25% 50%,#CC79A7 50% 75%,#009E73 75%)',
    pie: '<span>Ion<b>Nom</b> · Química inorgánica</span>' }
};
const S = SITIOS[op('sitio', 'bio')];
if (!S) { console.error('--sitio debe ser bio, chroma o ion'); process.exit(1); }
const titulo = op('titulo', 'Hoja de referencia'), tema = op('tema', titulo), ico = op('ico', '');
const salida = path.resolve(op('salida', path.basename(entrada).replace(/\.html?$/, '') + '.pdf'));
const pieIzq = op('pie-izq', S.pie), pieDer = op('pie-der', '© 2026 Harvey Bárcenas Morales · Licencia CC BY-NC 4.0');
const horizontal = op('horizontal', false) === true;

const cuerpo = fs.readFileSync(entrada, 'utf8');
const avisos = revisar(cuerpo.replace(/<[^>]+>/g, ' '));
const paginas = cuerpo.split(/<!--\s*pagina\s*-->/i).map(s => s.trim()).filter(Boolean);
const enc = n => `<div class="h-enc"><img src="${S.logo}" alt="${S.nombre}"><div class="t"><div class="k">Hoja de referencia · ${tema}${paginas.length > 1 ? ' · página ' + (n + 1) + ' de ' + paginas.length : ''}</div><h3>${ico ? ico + ' ' : ''}${titulo}</h3></div><div class="tira"></div></div>`;
let html = `<!DOCTYPE html><html lang="es"><head><meta charset="utf-8"><title>${titulo}</title><link rel="stylesheet" href="hoja.css">
<style>.hoja{--h-azul:${S.azul};--h-acento:${S.acento};--h-tira:${S.tira}}</style></head><body class="${horizontal ? 'horizontal' : ''}">
${paginas.map((p, i) => `<article class="hoja">${enc(i)}<div class="h-cuerpo">${p}</div><img class="h-wm" src="${S.marca}" alt=""><div class="h-pie">${pieIzq}<span>${pieDer}</span></div></article>`).join('\n')}
</body></html>`;

/* Carpeta de trabajo con los recursos al lado; las imágenes locales del contenido se copian. */
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'hoja-'));
fs.cpSync(A, tmp, { recursive: true });
const dirEntrada = path.dirname(path.resolve(entrada));
html = html.replace(/(<img[^>]+src=")(?!https?:|data:|logo-|marca-)([^"]+)"/g, (m, a, src) => {
  const abs = path.resolve(dirEntrada, src);
  if (!fs.existsSync(abs)) { avisos.push('No encontré la imagen ' + src); return m; }
  const dest = 'img-' + path.basename(abs); fs.copyFileSync(abs, path.join(tmp, dest)); return a + dest + '"';
});
fs.writeFileSync(path.join(tmp, 'hoja.html'), html);

(async () => {
  let chromium;
  try { ({ chromium } = require('playwright')); } catch (e) { console.error('Falta Playwright (npm i playwright).'); process.exit(1); }
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: horizontal ? 1100 : 900, height: 1200 } });
  await p.goto('file://' + path.join(tmp, 'hoja.html'));
  await p.evaluate(() => document.fonts.ready);
  await p.waitForTimeout(300);
  /* el mismo ajustar() de referencias.js de BioNom: búsqueda binaria del zoom */
  const escalas = await p.evaluate(() => [...document.querySelectorAll('.hoja')].map(h => {
    const cu = h.querySelector('.h-cuerpo'), pie = h.querySelector('.h-pie'), cs = getComputedStyle(h);
    const ancho = h.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
    const cabe = f => { cu.style.zoom = f; cu.style.width = (ancho / f) + 'px'; return cu.getBoundingClientRect().bottom <= pie.getBoundingClientRect().top - 10; };
    let lo = 1, hi = 1.8; if (!cabe(lo)) { lo = 0.4; hi = 1; }
    for (let i = 0; i < 16; i++) { const m = (lo + hi) / 2; if (cabe(m)) lo = m; else hi = m; }
    cabe(lo); return +lo.toFixed(3);
  }));
  await p.emulateMedia({ media: 'print' });
  await p.pdf({ path: salida, printBackground: true, preferCSSPageSize: true });
  const pngs = [];
  if (op('png', false) === true) {
    await p.emulateMedia({ media: 'screen' });
    const hs = await p.$$('.hoja');
    for (let i = 0; i < hs.length; i++) {
      const f = salida.replace(/\.pdf$/, '') + (hs.length > 1 ? '-p' + (i + 1) : '') + '.png';
      await hs[i].screenshot({ path: f }); pngs.push(f);
    }
  }
  await b.close();
  escalas.forEach((e, i) => {
    if (e < 0.85) avisos.push(`Página ${i + 1}: el contenido quedó al ${Math.round(e * 100)} % (letra muy pequeña). Recorta texto o pasa parte a otra página.`);
    if (e >= 1.75) avisos.push(`Página ${i + 1}: el contenido llegó al tope (${Math.round(e * 100)} %) y aún sobra espacio. Agrega un ejemplo, una figura o un recuadro de errores frecuentes.`);
  });
  console.log(JSON.stringify({ pdf: salida, png: pngs, paginas: paginas.length, escala: escalas, carpetaTrabajo: tmp, avisos }, null, 1));
})();
