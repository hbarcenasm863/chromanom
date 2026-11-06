/* ═════════════════════════════════════════════════════════════════════
   sopa.js — pestaña «Sopa de letras» del generador docente (docente.html)
   Mismo archivo en ChromaNom (sopa.js) e IonNom (assets/sopa.js).
   Usa el banco del Ahorcado (BANCO_AHORCADO y AHORCADO_GRUPOS): palabra
   clave del sitio + 3 pistas basadas en lo que explican sus páginas.
   - Hoja para imprimir: cuadrícula con las palabras escondidas y, debajo,
     las pistas (o la lista de palabras, para cursos que empiezan).
     Versiones paralelas con semilla reproducible y hoja de clave.
   - Modo clase: se marca arrastrando o tocando la primera y la última
     letra; al acertar, la palabra se pinta y su pista queda con ✓.
     Marcador de dos equipos y pantalla completa (gira a horizontal).
   Cada sopa se verifica: todas las palabras caben y cada una aparece una
   sola vez en las direcciones permitidas (sin respuestas repetidas).
   ═════════════════════════════════════════════════════════════════════ */
(function(){
'use strict';

const $ = s => document.querySelector(s), $$ = s => [...document.querySelectorAll(s)];
const esc = s => String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
const MAX_VERSIONES = 40;
const SITIO = window.AHORCADO_SITIO || '';
const GRUPOS = window.AHORCADO_GRUPOS || [];
const COLORES = ['#0891b2','#15803d','#b45309','#CC79A7','#7c3aed','#dc2626','#0d4a73','#65a30d','#db2777','#0e7490','#a16207','#4f46e5','#059669','#c2410c','#9333ea','#be123c'];
const DIRS = {facil:[[0,1],[1,0]], media:[[0,1],[1,0],[1,1],[-1,1]], dificil:[[0,1],[1,0],[1,1],[-1,1],[0,-1],[-1,0],[-1,-1],[1,-1]]};
// Letras de relleno con la frecuencia aproximada del español (la sopa no se ve «rara»).
const RELLENO = 'AAAAAAAAAAAAEEEEEEEEEEEEEOOOOOOOOOSSSSSSSRRRRRRNNNNNNIIIIIIDDDDDLLLLLCCCCTTTTUUUUMMMPPBBGGVYQHFZJÑXKW';

/* ───── semilla reproducible ───── */
function fnv(str){ let h = 0x811c9dc5; for(let i=0;i<str.length;i++){ h ^= str.charCodeAt(i); h = Math.imul(h, 0x01000193); } return h >>> 0; }
function rng(seed){ let a = fnv(String(seed)); return function(){ a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
function barajar(arr, r){ const a = arr.slice(); for(let i=a.length-1;i>0;i--){ const j = Math.floor(r()*(i+1)); [a[i],a[j]] = [a[j],a[i]]; } return a; }
const nuevaSemilla = () => Math.random().toString(36).slice(2, 8).toUpperCase();

// Palabra de la sopa: mayúsculas, sin tildes ni espacios; la Ñ se conserva.
function limpia(s){ return String(s).toUpperCase().replace(/Ñ/g,'\u0001').normalize('NFD').replace(/[̀-ͯ]/g,'').replace(/\u0001/g,'Ñ').replace(/[^A-ZÑ]/g,''); }

let semilla = nuevaSemilla(), vista = 'sheet';

function banco(){ return window.BANCO_AHORCADO || []; }
function getCfg(){
  const grupos = $$('#sp-grupos input:checked').map(i => i.value);
  const temas = GRUPOS.filter(g => grupos.includes(g[0])).reduce((a, g) => a.concat(g[2]), []);
  const tam = Math.max(10, Math.min(18, parseInt($('#sp-tam').value, 10) || 14));
  const pool = banco().filter(w => temas.includes(w[1]) && limpia(w[0]).length >= 3 && limpia(w[0]).length <= tam);
  const n = Math.max(4, Math.min(16, parseInt($('#sp-n').value, 10) || 10));
  const nver = Math.max(1, Math.min(MAX_VERSIONES, parseInt($('#sp-nver').value, 10) || 1));
  const seedTxt = ($('#sp-seed').value || '').trim().toUpperCase();
  return {grupos, pool, tam, n, nver, dif: $('#sp-dif').value, ayuda: $('#sp-ayuda').value, titulo: ($('#sp-title').value || '').trim(),
    seed: seedTxt || semilla, vacio: !grupos.length ? 'Marca al menos un grupo de temas.' : (pool.length < 4 ? 'Hay muy pocas palabras para esos temas: marca otro grupo o agranda la cuadrícula.' : '')};
}

/* ───── construcción y verificación ───── */
function cuenta(grid, w, dirs){
  const N = grid.length; let k = 0;
  for(let f=0; f<N; f++) for(let c=0; c<N; c++) for(const [df,dc] of dirs){
    let ok = true;
    for(let i=0;i<w.length;i++){ const ff = f+df*i, cc = c+dc*i; if(ff<0||cc<0||ff>=N||cc>=N||grid[ff][cc]!==w[i]){ ok = false; break; } }
    if(ok) k++;
  }
  // Un palíndromo se cuenta dos veces en las direcciones al revés.
  if(w === [...w].reverse().join('') && dirs.length === 8) k = k / 2;
  return k;
}
function construir(c, v){
  const dirs = DIRS[c.dif] || DIRS.media;
  for(let intento = 0; intento < 40; intento++){
    const r = rng(c.seed + '|' + v + '|' + intento);
    const cand = barajar(c.pool, r).slice(0, Math.min(c.pool.length, c.n + 6));
    const N = c.tam, grid = Array.from({length:N}, () => Array(N).fill(''));
    const puestas = [];
    for(const w of cand.sort((a, b) => limpia(b[0]).length - limpia(a[0]).length)){
      if(puestas.length >= c.n) break;
      const pal = limpia(w[0]);
      if(puestas.some(p => p.pal === pal)) continue;
      let ok = false;
      for(let t=0; t<300 && !ok; t++){
        const [df,dc] = dirs[Math.floor(r()*dirs.length)];
        const f0 = Math.floor(r()*N), c0 = Math.floor(r()*N);
        const fF = f0 + df*(pal.length-1), cF = c0 + dc*(pal.length-1);
        if(fF<0||cF<0||fF>=N||cF>=N) continue;
        let choca = false;
        for(let i=0;i<pal.length;i++){ const x = grid[f0+df*i][c0+dc*i]; if(x && x !== pal[i]){ choca = true; break; } }
        if(choca) continue;
        for(let i=0;i<pal.length;i++) grid[f0+df*i][c0+dc*i] = pal[i];
        puestas.push({w, pal, f:f0, c:c0, df, dc}); ok = true;
      }
    }
    if(puestas.length < Math.min(c.n, c.pool.length)) continue;
    for(let f=0; f<N; f++) for(let k=0; k<N; k++) if(!grid[f][k]) grid[f][k] = RELLENO[Math.floor(r()*RELLENO.length)];
    // verificación: cada palabra aparece exactamente una vez
    if(puestas.every(p => cuenta(grid, p.pal, dirs) === 1)){
      puestas.sort((a, b) => a.pal.localeCompare(b.pal));
      return {grid, puestas, dirs};
    }
  }
  return {error: 'No se pudo armar una sopa con esas palabras. Agranda la cuadrícula o baja el número de palabras.'};
}
function pistaDe(p, c){
  const idx = Math.max(0, Math.min(2, (parseInt(c.ayuda, 10) || 1) - 1));
  // si la pista elegida contiene la palabra, se usa otra
  const orden = [idx, 0, 1, 2];
  for(const i of orden){ const t = p.w[2+i]; if(t && !limpia(t).includes(p.pal)) return t; }
  return p.w[2+idx];
}
function enCelda(p, f, k){ for(let i=0;i<p.pal.length;i++) if(p.f+p.df*i===f && p.c+p.dc*i===k) return true; return false; }

/* ───── hoja para imprimir ───── */
function tablaHTML(s, clave){
  const N = s.grid.length, celda = Math.floor(Math.min(36, 600 / N));
  let h = '<table class="sp-tab" style="--sc:' + celda + 'px">';
  for(let f=0; f<N; f++){
    h += '<tr>';
    for(let k=0; k<N; k++){
      let st = '';
      if(clave){ const i = s.puestas.findIndex(p => enCelda(p, f, k)); if(i >= 0) st = ' style="background:' + COLORES[i % COLORES.length] + '33;color:' + COLORES[i % COLORES.length] + ';font-weight:900"'; }
      h += '<td' + st + '>' + s.grid[f][k] + '</td>';
    }
    h += '</tr>';
  }
  return h + '</table>';
}
function hoja(s, c, clave, etiqueta){
  const ins = c.ayuda === 'lista'
    ? 'Busca en la sopa las palabras de la lista. Pueden estar ' + txtDirs(c.dif) + '. Enciérralas y tacha cada palabra de la lista al encontrarla.'
    : 'Lee cada pista, escribe la palabra en la línea y búscala en la sopa. Las palabras pueden estar ' + txtDirs(c.dif) + '; no llevan tildes ni espacios.';
  const lista = c.ayuda === 'lista'
    ? '<div class="sp-lista">' + s.puestas.map(p => '<span>' + p.pal + '</span>').join('') + '</div>'
    : '<ol class="sp-pistas">' + s.puestas.map(p => '<li>' + esc(pistaDe(p, c)) + ' <span class="sp-n">(' + p.pal.length + ')</span> <span class="sp-lin">' + (clave ? '<b>' + p.pal + '</b>' : '') + '</span></li>').join('') + '</ol>';
  return '<div class="sp-hoja"><div class="sp-cab"><div><div class="sp-tit">' + esc(c.titulo || 'Sopa de letras de química') + (clave ? ' · Clave' : '') + '</div><div class="sp-sub">' + esc(SITIO) + (SITIO ? ' · ' : '') + esc(etiqueta) + '</div></div>'
    + (clave ? '' : '<div class="sp-est"><span>Nombre</span><i></i><span>Curso</span><i class="c"></i></div>') + '</div>'
    + (clave ? '' : '<p class="sp-ins"><b>Instrucciones.</b> ' + ins + '</p>')
    + '<div class="sp-centro">' + tablaHTML(s, clave) + '</div>' + lista + '</div>';
}
function txtDirs(d){ return d === 'facil' ? 'de izquierda a derecha o de arriba abajo' : d === 'media' ? 'en horizontal, en vertical o en diagonal' : 'en cualquier dirección, también al revés'; }

/* ───── modo clase ───── */
let SP = null;
function iniciarClase(){
  const c = getCfg(); if(c.vacio){ $('#sp-status').textContent = '⚠️ ' + c.vacio; return; }
  const v = Math.max(0, +$('#sp-vsel').value || 0);
  const s = construir(c, v); if(s.error){ $('#sp-status').textContent = '⚠️ ' + s.error; return; }
  SP = {s, c, hallada: s.puestas.map(() => false), eqA: 0, eqB: 0, ini: null, sel: [], rev: false};
  pintarClase();
}
function celdasEntre(a, b){
  const df = Math.sign(b.f - a.f), dc = Math.sign(b.c - a.c), lf = Math.abs(b.f - a.f), lc = Math.abs(b.c - a.c);
  if(!(lf === 0 || lc === 0 || lf === lc)) return null;
  const n = Math.max(lf, lc), out = [];
  for(let i=0;i<=n;i++) out.push({f: a.f + df*i, c: a.c + dc*i});
  return out;
}
function comprobar(cel){
  if(!cel || cel.length < 2) return false;
  const txt = cel.map(x => SP.s.grid[x.f][x.c]).join('');
  for(let i=0;i<SP.s.puestas.length;i++){
    const p = SP.s.puestas[i]; if(SP.hallada[i]) continue;
    const ini = cel[0], fin = cel[cel.length-1];
    const pf = p.f + p.df*(p.pal.length-1), pc = p.c + p.dc*(p.pal.length-1);
    const igual = (ini.f===p.f && ini.c===p.c && fin.f===pf && fin.c===pc) || (fin.f===p.f && fin.c===p.c && ini.f===pf && ini.c===pc);
    if(igual && (txt === p.pal || [...txt].reverse().join('') === p.pal)){ SP.hallada[i] = true; return true; }
  }
  return false;
}
function pintarClase(){
  const box = $('#sp-play'); if(!box || !SP) return;
  const N = SP.s.grid.length;
  const fs = !!(document.fullscreenElement || document.webkitFullscreenElement);
  const horiz = innerWidth > innerHeight;
  // tamaño de celda: cabe a lo ancho (o a lo alto en pantalla completa horizontal)
  const anchoDisp = (box.clientWidth || 900) * (horiz ? 0.56 : 1) - 30;
  const altoDisp = fs ? innerHeight - 90 : 9999;
  const celda = Math.max(18, Math.min(46, Math.floor(Math.min(anchoDisp, altoDisp) / N)));
  const color = {};
  SP.s.puestas.forEach((p, i) => { if(SP.hallada[i] || SP.rev) for(let k=0;k<p.pal.length;k++) color[(p.f+p.df*k)+','+(p.c+p.dc*k)] = COLORES[i % COLORES.length]; });
  const sel = new Set(SP.sel.map(x => x.f + ',' + x.c));
  let g = '<div class="spc-grid" style="--sc:' + celda + 'px;grid-template-columns:repeat(' + N + ',var(--sc))">';
  for(let f=0; f<N; f++) for(let k=0; k<N; k++){
    const col = color[f+','+k];
    g += '<span class="spc-c' + (sel.has(f+','+k) ? ' sel' : '') + (SP.ini && SP.ini.f===f && SP.ini.c===k ? ' ini' : '') + '" data-f="' + f + '" data-c="' + k + '"' + (col ? ' style="background:' + col + ';color:#fff;border-color:' + col + '"' : '') + '>' + SP.s.grid[f][k] + '</span>';
  }
  g += '</div>';
  const nH = SP.hallada.filter(Boolean).length, tot = SP.s.puestas.length;
  const pistas = SP.s.puestas.map((p, i) => '<li class="' + (SP.hallada[i] ? 'ok' : '') + '" style="--pc:' + COLORES[i % COLORES.length] + '"><span class="spc-dot"></span><span>'
    + (SP.c.ayuda === 'lista' ? '' : esc(pistaDe(p, SP.c)) + ' ') + (SP.hallada[i] || SP.rev || SP.c.ayuda === 'lista' ? '<b>' + p.pal + '</b>' : '<span class="sp-n">(' + p.pal.length + ' letras)</span>') + '</span></li>').join('');
  box.innerHTML = '<div class="spc">'
    + '<div class="spc-bar"><b>' + nH + ' de ' + tot + ' palabras</b>'
    + '<span class="spc-eq">Equipo A: <b>' + SP.eqA + '</b> <button type="button" data-eq="A">+1</button></span>'
    + '<span class="spc-eq">Equipo B: <b>' + SP.eqB + '</b> <button type="button" data-eq="B">+1</button></span>'
    + '<button type="button" class="spc-fs">' + (fs ? '✕ Salir de pantalla completa' : '⛶ Pantalla completa') + '</button></div>'
    + '<div class="spc-main">' + g + '<div class="spc-lado"><p class="spc-ayuda">Arrastra de la primera a la última letra, o toca la primera y después la última.</p>'
    + (nH === tot ? '<div class="spc-fin">🎉 ¡Encontraron todas las palabras!</div>' : '')
    + '<ol class="spc-pistas">' + pistas + '</ol>'
    + '<div class="spc-acc">' + (!SP.rev && nH < tot ? '<button type="button" class="spc-btn spc-rev">👁️ Revelar todas</button>' : '') + '<button type="button" class="spc-btn spc-otra">🔁 Otra sopa</button></div></div></div></div>';
  // eventos
  const grid = box.querySelector('.spc-grid');
  const celdaDe = (x, y) => { const e = document.elementFromPoint(x, y); return e && e.classList && e.classList.contains('spc-c') ? {f: +e.dataset.f, c: +e.dataset.c} : null; };
  let arrastre = null;
  grid.addEventListener('pointerdown', e => {
    const a = celdaDe(e.clientX, e.clientY); if(!a) return;
    e.preventDefault(); try{ grid.setPointerCapture(e.pointerId); }catch(err){}
    if(SP.ini && !(SP.ini.f===a.f && SP.ini.c===a.c)){ // segundo toque
      const cel = celdasEntre(SP.ini, a); SP.ini = null; SP.sel = []; comprobar(cel); pintarClase(); return;
    }
    arrastre = {a, movio: false}; SP.sel = [a]; marcar();
  });
  grid.addEventListener('pointermove', e => {
    if(!arrastre) return; const b = celdaDe(e.clientX, e.clientY); if(!b) return;
    const cel = celdasEntre(arrastre.a, b); if(cel){ if(cel.length > 1) arrastre.movio = true; SP.sel = cel; marcar(); }
  });
  const soltar = e => {
    if(!arrastre) return; const a = arrastre; arrastre = null;
    if(!a.movio){ SP.ini = a.a; SP.sel = [a.a]; pintarClase(); return; }
    const cel = SP.sel.slice(); SP.sel = []; SP.ini = null; comprobar(cel); pintarClase();
  };
  grid.addEventListener('pointerup', soltar); grid.addEventListener('pointercancel', () => { arrastre = null; SP.sel = []; pintarClase(); });
  function marcar(){ const s = new Set(SP.sel.map(x => x.f + ',' + x.c)); grid.querySelectorAll('.spc-c').forEach(el => el.classList.toggle('sel', s.has(el.dataset.f + ',' + el.dataset.c))); }
  const on = (sel, fn) => { const el = box.querySelector(sel); if(el) el.addEventListener('click', fn); };
  on('.spc-rev', () => { SP.rev = true; pintarClase(); });
  on('.spc-otra', () => { semilla = nuevaSemilla(); $('#sp-seed').value = ''; iniciarClase(); });
  on('.spc-fs', pantallaCompleta);
  box.querySelectorAll('[data-eq]').forEach(b => b.addEventListener('click', () => { if(b.dataset.eq === 'A') SP.eqA++; else SP.eqB++; pintarClase(); }));
}
function pantallaCompleta(){
  const box = $('#sp-play'); if(!box) return;
  const fe = document.fullscreenElement || document.webkitFullscreenElement;
  if(fe){ (document.exitFullscreen || document.webkitExitFullscreen).call(document); return; }
  const req = box.requestFullscreen || box.webkitRequestFullscreen; if(!req) return;
  const p = req.call(box);
  const girar = () => { try{ if(screen.orientation && screen.orientation.lock) screen.orientation.lock('landscape').catch(() => {}); }catch(e){} };
  if(p && p.then) p.then(girar).catch(() => {}); else girar();
}
function alCambiarPantalla(){
  const fe = document.fullscreenElement || document.webkitFullscreenElement;
  if(!fe){ try{ if(screen.orientation && screen.orientation.unlock) screen.orientation.unlock(); }catch(e){} }
  if(SP && vista === 'play') pintarClase();
}
document.addEventListener('fullscreenchange', alCambiarPantalla);
document.addEventListener('webkitfullscreenchange', alCambiarPantalla);
window.addEventListener('resize', () => { if(SP && vista === 'play' && $('#sp-play') && $('#sp-play').offsetParent !== null) pintarClase(); });

/* ───── vista e impresión ───── */
function render(){
  if(!$('#sp-stage')) return;
  const c = getCfg();
  $$('#sp-grupos label').forEach(l => { const g = GRUPOS.find(x => x[0] === l.querySelector('input').value); const k = banco().filter(w => g[2].includes(w[1]) && limpia(w[0]).length <= c.tam).length; const s = l.querySelector('small'); if(s) s.textContent = k + ' palabras'; });
  $('#sp-status').textContent = !banco().length ? '⚠️ No se cargaron las palabras. Recargue la página.' : c.vacio ? '⚠️ ' + c.vacio : (c.pool.length < c.n ? 'Hay ' + c.pool.length + ' palabras de hasta ' + c.tam + ' letras para esos temas: cada sopa trae las que quepan.' : c.pool.length + ' palabras de hasta ' + c.tam + ' letras para esos temas.');
  $('#sp-stage').style.display = vista === 'play' ? 'none' : '';
  $('#sp-play').style.display = vista === 'play' ? '' : 'none';
  if(c.vacio){ $('#sp-stage').innerHTML = ''; $('#sp-play').innerHTML = ''; return; }
  if(vista === 'play'){ if(!SP) iniciarClase(); else pintarClase(); return; }
  const v = Math.max(0, +$('#sp-vsel').value || 0);
  const s = construir(c, v);
  if(s.error){ $('#sp-stage').innerHTML = ''; $('#sp-status').textContent = '⚠️ ' + s.error; return; }
  $('#sp-stage').innerHTML = hoja(s, c, vista === 'key', vista === 'key' ? 'código ' + c.seed + ' · versión ' + (v+1) : 'Versión ' + (v+1) + ' de ' + c.nver);
}
function llenarVersiones(){
  const n = Math.max(1, Math.min(MAX_VERSIONES, parseInt($('#sp-nver').value, 10) || 1)), sel = $('#sp-vsel'), keep = +sel.value || 0;
  $('#sp-nver').value = n; sel.innerHTML = '';
  for(let i=0;i<n;i++) sel.insertAdjacentHTML('beforeend', '<option value="' + i + '">Versión ' + (i+1) + '</option>');
  sel.value = String(Math.min(keep, n-1));
}
function prepararImpresion(){
  const c = getCfg(); if(c.vacio){ $('#sp-status').textContent = '⚠️ ' + c.vacio; return false; }
  let h = '', ks = '';
  for(let v=0; v<c.nver; v++){ const s = construir(c, v); if(s.error){ $('#sp-status').textContent = '⚠️ ' + s.error; return false; }
    h += hoja(s, c, false, 'Versión ' + (v+1) + ' de ' + c.nver); ks += hoja(s, c, true, 'código ' + c.seed + ' · versión ' + (v+1)); }
  $('#sp-print-root').innerHTML = h + ($('#sp-withkeys').checked ? ks : '');
  document.body.classList.add('sp-printing');
  return true;
}
function imprimir(){ if(prepararImpresion()) setTimeout(() => window.print(), 120); }
function finImpresion(){ if(!document.body.classList.contains('sp-printing')) return; document.body.classList.remove('sp-printing'); $('#sp-print-root').innerHTML = ''; }
function panelVisible(){ const p = $('#sp-app'); return !!(p && p.offsetParent !== null); }

function init(){
  const app = $('#sp-app'); if(!app) return;
  const chk = app.dataset.chk || 'opt';
  $('#sp-grupos').innerHTML = GRUPOS.map((g, i) => chk === 'tema-chk'
    ? '<label class="tema-chk"><input type="checkbox" value="' + g[0] + '"' + (i < 2 ? ' checked' : '') + '><span><strong>' + g[1] + '</strong><br><small></small></span></label>'
    : '<label class="opt"><input type="checkbox" value="' + g[0] + '"' + (i < 2 ? ' checked' : '') + '> <span><b>' + g[1] + '</b><small></small></span></label>').join('');
  llenarVersiones();
  const re = () => { SP = null; render(); };
  $$('#sp-grupos input').forEach(i => i.addEventListener('change', re));
  ['#sp-n', '#sp-title', '#sp-seed'].forEach(s => $(s).addEventListener('input', re));
  ['#sp-tam', '#sp-dif', '#sp-ayuda', '#sp-vsel'].forEach(s => $(s).addEventListener('change', re));
  $('#sp-nver').addEventListener('change', () => { llenarVersiones(); re(); });
  $('#sp-btn-seed').addEventListener('click', () => { semilla = nuevaSemilla(); $('#sp-seed').value = ''; re(); });
  $$('#sp-seg button').forEach(b => b.addEventListener('click', () => {
    vista = b.dataset.view; $$('#sp-seg button').forEach(x => { x.classList.toggle('on', x === b); x.setAttribute('aria-pressed', x === b ? 'true' : 'false'); });
    render();
  }));
  $('#sp-btn-print').addEventListener('click', imprimir);
  window.addEventListener('beforeprint', () => { if(panelVisible() && !/(^| )(ah|cz|lab)-printing/.test(document.body.className) && !document.body.classList.contains('sp-printing')) prepararImpresion(); });
  window.addEventListener('afterprint', finImpresion);
  render();
}
window.SOPA = {render};
if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
