/* ═════════════════════════════════════════════════════════════════════
   ahorcado.js — pestaña «Ahorcado» de docente.html
   Usa BANCO_AHORCADO (ahorcado-datos.js), el mismo banco del Juego: palabra clave
   del sitio + 3 pistas (de la más general a la más reveladora).
   Dos usos:
   - Hoja para imprimir: N palabras con sus casillas, sus 3 pistas, un
     patíbulo para ir dibujando y el abecedario para tachar. Versiones
     paralelas con semilla reproducible y hoja de clave al final.
   - Modo clase: pantalla grande para proyectar, con teclado, botón de
     pistas, revelar palabra, siguiente palabra y marcador de dos equipos.
   ═════════════════════════════════════════════════════════════════════ */
(function(){
'use strict';

const $ = s => document.querySelector(s), $$ = s => [...document.querySelectorAll(s)];
const esc = s => String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
const MAX_VERSIONES = 40, POR_HOJA = 8, MAX_FALLOS = 6;
const ABC = 'ABCDEFGHIJKLMNÑOPQRSTUVWXYZ'.split('');

// Grupos de temas de la pestaña → temas de BANCO_AHORCADO
// Grupos de la pestaña: [id, rótulo, temas del banco] (ahorcado-datos.js)
const GRUPOS = window.AHORCADO_GRUPOS || [];
const SITIO = window.AHORCADO_SITIO || 'ChromaNom';

/* ───── semilla reproducible (FNV-1a + mulberry32, como el resto del generador) ───── */
function fnv(str){ let h = 0x811c9dc5; for(let i=0;i<str.length;i++){ h ^= str.charCodeAt(i); h = Math.imul(h, 0x01000193); } return h >>> 0; }
function rng(seed){ let a = fnv(String(seed)); return function(){ a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
function barajar(arr, r){ const a = arr.slice(); for(let i=a.length-1;i>0;i--){ const j = Math.floor(r()*(i+1)); [a[i],a[j]] = [a[j],a[i]]; } return a; }
const nuevaSemilla = () => Math.random().toString(36).slice(2, 8).toUpperCase();

const base = ch => ch === 'Ñ' ? 'Ñ' : ch.normalize('NFD').replace(/[̀-ͯ]/g, '');
const esLetra = ch => /[A-ZÁÉÍÓÚÜÑ]/.test(ch);

let semilla = nuevaSemilla(), vista = 'sheet';

function banco(){ return (typeof BANCO_AHORCADO !== 'undefined') ? BANCO_AHORCADO : []; }
function getCfg(){
  const grupos = $$('#ah-grupos input:checked').map(i => i.value);
  const temas = GRUPOS.filter(g => grupos.includes(g[0])).reduce((a, g) => a.concat(g[2]), []);
  const pool = banco().filter(w => temas.includes(w[1]));
  const n = Math.max(4, Math.min(16, parseInt($('#ah-n').value, 10) || 8));
  const nver = Math.max(1, Math.min(MAX_VERSIONES, parseInt($('#ah-nver').value, 10) || 1));
  const pistas = Math.max(1, Math.min(3, parseInt($('#ah-pistas').value, 10) || 3));
  const seedTxt = ($('#ah-seed').value || '').trim().toUpperCase();
  return {grupos, pool, n, nver, pistas, titulo: ($('#ah-title').value || '').trim(), seed: seedTxt || semilla,
    vacio: !grupos.length ? 'Marca al menos un grupo de temas.' : (!pool.length ? 'No hay palabras para esos temas.' : '')};
}
function palabrasDe(c, v){ return barajar(c.pool, rng(c.seed + '|' + v)).slice(0, c.n); }
function contarPalabras(){
  const c = getCfg();
  if(!banco().length){ $('#ah-status').textContent = '⚠️ No se cargaron las palabras del ahorcado. Recargue la página.'; return; }
  $$('#ah-grupos label').forEach(l => { const g = GRUPOS.find(x => x[0] === l.querySelector('input').value); const k = banco().filter(w => g[2].includes(w[1])).length; const s = l.querySelector('small'); if(s) s.textContent = k + ' palabras'; });
  $('#ah-status').textContent = c.vacio ? '⚠️ ' + c.vacio : (c.pool.length < c.n ? 'Hay ' + c.pool.length + ' palabras para esos temas: cada hoja trae todas.' : c.pool.length + ' palabras disponibles para esos temas.');
}

/* ───── hoja para imprimir ───── */
function patibulo(){
  return '<svg viewBox="0 0 90 80" class="ah-pat" aria-hidden="true"><g stroke="#94a3b8" stroke-width="3" stroke-linecap="round" fill="none">'
    + '<line x1="8" y1="76" x2="52" y2="76"/><line x1="24" y1="76" x2="24" y2="6"/><line x1="24" y1="6" x2="62" y2="6"/><line x1="62" y1="6" x2="62" y2="18"/></g></svg>';
}
function casillas(p, clave){
  return [...p].map(ch => ch === ' ' ? '<span class="ah-sp"></span>' : (esLetra(ch) ? '<span class="ah-box">' + (clave ? ch : '') + '</span>' : '<span class="ah-box ah-fija">' + esc(ch) + '</span>')).join('');
}
function tarjeta(w, i, c, clave){
  const n = [...w[0]].filter(esLetra).length;
  return '<div class="ah-card"><div class="ah-card-top"><span class="ah-num">' + (i+1) + '</span>' + patibulo()
    + '<div class="ah-pis"><div class="ah-len">' + n + ' letras' + (w[0].includes(' ') ? ' · dos palabras' : '') + '</div>'
    + w.slice(2, 2 + c.pistas).map((t, k) => '<div><b>Pista ' + (k+1) + ':</b> ' + esc(t) + '</div>').join('')
    + '</div></div><div class="ah-pal">' + casillas(w[0], clave) + '</div>'
    + (clave ? '' : '<div class="ah-abc">' + ABC.map(l => '<span>' + l + '</span>').join('') + '</div>')
    + '</div>';
}
function hojas(c, v, clave, etiqueta){
  const ws = palabrasDe(c, v), out = [];
  for(let ini = 0; ini < ws.length; ini += POR_HOJA){
    const pag = ws.slice(ini, ini + POR_HOJA);
    const cab = ini === 0
      ? '<div class="ah-cab"><div><div class="ah-tit">' + esc(c.titulo || 'Ahorcado de química') + (clave ? ' · Clave' : '') + '</div><div class="ah-sub">' + SITIO + ' · ' + esc(etiqueta) + '</div></div>'
        + (clave ? '' : '<div class="ah-est"><span>Nombre</span><i></i><span>Curso</span><i class="c"></i></div>') + '</div>'
        + (clave ? '' : '<p class="ah-ins"><b>Instrucciones.</b> Lee la primera pista y escribe una letra a la vez en las casillas. Tacha en el abecedario cada letra que uses; por cada letra que no esté, dibuja una parte del muñeco (cabeza, tronco, dos brazos y dos piernas: 6 fallos). Lee la pista siguiente solo si la necesitas. Las tildes no cuentan como letra aparte.</p>')
      : '<div class="ah-cab ah-cab2"><div class="ah-sub">' + esc(c.titulo || 'Ahorcado de química') + (clave ? ' · Clave' : '') + ' · ' + esc(etiqueta) + '</div></div>';
    out.push('<div class="ah-hoja">' + cab + '<div class="ah-grid">' + pag.map((w, k) => tarjeta(w, ini + k, c, clave)).join('') + '</div></div>');
  }
  return out.join('');
}

/* ───── modo clase (proyectar) ───── */
let CL = null;
function dibujoGrande(f){
  const p = ['<circle cx="150" cy="70" r="20" fill="#fff"/>','<line x1="150" y1="90" x2="150" y2="150"/>','<line x1="150" y1="105" x2="122" y2="132"/>',
    '<line x1="150" y1="105" x2="178" y2="132"/>','<line x1="150" y1="150" x2="128" y2="190"/>','<line x1="150" y1="150" x2="172" y2="190"/>'];
  return '<svg viewBox="0 0 220 215" class="ahc-svg" role="img" aria-label="Fallos: ' + f + ' de ' + MAX_FALLOS + '">'
    + '<g stroke="#0d4a73" stroke-width="8" stroke-linecap="round" fill="none"><line x1="20" y1="205" x2="120" y2="205"/><line x1="60" y1="205" x2="60" y2="14"/><line x1="60" y1="14" x2="150" y2="14"/></g><line x1="150" y1="14" x2="150" y2="50" stroke="#94a3b8" stroke-width="4" stroke-linecap="round"/>'
    + '<g stroke="' + (f >= 5 ? '#dc2626' : f >= 3 ? '#ea580c' : '#b45309') + '" stroke-width="7" stroke-linecap="round" fill="none">' + p.slice(0, f).join('') + '</g></svg>';
}
function iniciarClase(){
  const c = getCfg(); if(c.vacio){ $('#ah-status').textContent = '⚠️ ' + c.vacio; return; }
  const v = Math.max(0, +$('#ah-vsel').value || 0);
  CL = {lista: palabrasDe(c, v), i: 0, eqA: 0, eqB: 0};
  nuevaPalabra();
}
function nuevaPalabra(){
  const w = CL.lista[CL.i];
  CL.w = w; CL.pal = w[0].toUpperCase(); CL.base = [...CL.pal].map(base).join(''); CL.usadas = new Set(); CL.fallos = 0; CL.nPistas = 1; CL.fin = false; CL.msg = '';
  pintarClase();
}
function letraClase(l){
  if(!CL || CL.fin || CL.usadas.has(l)) return;
  CL.usadas.add(l);
  if(!CL.base.includes(l)) CL.fallos++;
  const completa = [...CL.pal].every(ch => !esLetra(ch) || CL.usadas.has(base(ch)));
  if(completa){ CL.fin = true; CL.msg = '🎉 ¡Adivinaron la palabra' + (CL.nPistas === 3 ? ' (con las 3 pistas)' : '') + '!'; }
  else if(CL.fallos >= MAX_FALLOS){ CL.fin = true; CL.msg = '✗ Se completó el muñeco. La palabra era ' + CL.pal + '.'; }
  pintarClase();
}
function pintarClase(){
  const box = $('#ah-play'); if(!box || !CL) return;
  const tile = ch => !esLetra(ch) || CL.usadas.has(base(ch)) ? '<span class="ahc-t v">' + esc(ch) + '</span>' : CL.fin ? '<span class="ahc-t falto">' + ch + '</span>' : '<span class="ahc-t"></span>';
  const pal = CL.pal.split(' ').map(w => '<span class="ahc-w">' + [...w].map(tile).join('') + '</span>').join('');
  const maxL = Math.max(...CL.pal.split(' ').map(w => [...w].length));
  const quedan = MAX_FALLOS - CL.fallos;
  const vida = v => '<svg class="ahc-vida' + (v ? '' : ' perdida') + '" viewBox="0 0 24 24" aria-hidden="true"><polygon points="12,2 20.7,7 20.7,17 12,22 3.3,17 3.3,7" fill="' + (v ? '#dcfce7' : '#f1f5f9') + '" stroke="' + (v ? '#15803d' : '#94a3b8') + '" stroke-width="1.8"/><circle cx="12" cy="12" r="4.4" fill="none" stroke="' + (v ? '#15803d' : '#94a3b8') + '" stroke-width="1.6"/></svg>';
  const grupo = (GRUPOS.find(g => g[2].includes(CL.w[1])) || [,''])[1].replace(/^\S+\s/, '');
  const pistas = [0,1,2].map(i => i < CL.nPistas
    ? '<div class="ahc-pista p' + (i+1) + '"><span class="n">' + (i+1) + '</span><span>' + esc(CL.w[2+i]) + '</span></div>'
    : '<button type="button" class="ahc-pista lock"' + (i === CL.nPistas && !CL.fin ? ' data-mas="1"' : ' disabled') + '><span class="n">' + (i+1) + '</span><span>🔒 Pista ' + (i+1) + (i === CL.nPistas && !CL.fin ? ' · clic para mostrarla' : '') + '</span></button>').join('');
  box.innerHTML = '<div class="ahc ahc-cn">'
    + '<div class="ahc-bar"><b>Palabra ' + (CL.i + 1) + ' de ' + CL.lista.length + '</b>' + (grupo ? '<span class="ahc-fase">' + esc(grupo) + '</span>' : '')
    + '<span class="ahc-eq">Equipo A: <b>' + CL.eqA + '</b> <button type="button" data-eq="A">+1</button></span>'
    + '<span class="ahc-eq">Equipo B: <b>' + CL.eqB + '</b> <button type="button" data-eq="B">+1</button></span>'
    + '<button type="button" class="ahc-fs">⛶ Pantalla completa</button></div>'
    + '<div class="ahc-main"><div class="ahc-fig">' + dibujoGrande(CL.fallos) + '</div><div class="ahc-info">'
    + '<div class="ahc-vidas">' + Array.from({length: MAX_FALLOS}, (_, i) => vida(i < quedan)).join('') + '<span class="ahc-quedan">' + (CL.fin ? '' : quedan === 1 ? '¡Última vida!' : 'Quedan ' + quedan + ' fallos') + '</span></div>'
    + '<div class="ahc-pistas">' + pistas + '</div></div></div>'
    + '<div class="ahc-pal" style="--t:' + Math.max(26, Math.min(64, Math.floor(((box.clientWidth || 1000) - 70 - (maxL - 1) * 6) / maxL))) + 'px">' + pal + '</div>'
    + (CL.msg ? '<div class="ahc-msg' + (CL.msg.startsWith('🎉') ? ' ok' : ' err') + '">' + esc(CL.msg) + '</div>' : '')
    + '<div class="ahc-tec">' + ABC.map(l => { const u = CL.usadas.has(l), en = CL.base.includes(l); return '<button type="button" data-l="' + l + '" class="' + (u ? (en ? 'si' : 'no') : '') + '"' + (u || CL.fin ? ' disabled' : '') + '>' + l + '</button>'; }).join('') + '</div>'
    + '<div class="ahc-acc">' + (!CL.fin ? '<button type="button" class="ahc-btn ahc-rev">👁️ Revelar la palabra</button>' : '')
    + (CL.i < CL.lista.length - 1 ? '<button type="button" class="ahc-btn ahc-sig">Siguiente palabra →</button>' : '<button type="button" class="ahc-btn ahc-otra">🔁 Empezar otra ronda</button>') + '</div>'
    + '</div>';
  box.querySelectorAll('.ahc-tec button').forEach(b => b.addEventListener('click', () => letraClase(b.dataset.l)));
  const on = (sel, fn) => { const e = box.querySelector(sel); if(e) e.addEventListener('click', fn); };
  on('[data-mas]', () => { if(CL.nPistas < 3){ CL.nPistas++; pintarClase(); } });
  on('.ahc-rev', () => { CL.fin = true; CL.msg = 'La palabra era ' + CL.pal + '.'; pintarClase(); });
  on('.ahc-sig', () => { CL.i++; nuevaPalabra(); });
  on('.ahc-otra', () => { semilla = nuevaSemilla(); $('#ah-seed').value = ''; iniciarClase(); });
  on('.ahc-fs', () => { const el = box.querySelector('.ahc'); if(document.fullscreenElement) document.exitFullscreen(); else if(el.requestFullscreen) el.requestFullscreen(); });
  box.querySelectorAll('[data-eq]').forEach(b => b.addEventListener('click', () => { if(b.dataset.eq === 'A') CL.eqA++; else CL.eqB++; pintarClase(); }));
}
document.addEventListener('keydown', e => {
  if(vista !== 'play' || !CL || CL.fin || e.ctrlKey || e.metaKey || e.altKey) return;
  const tab = $('#panel-ah'); if(!tab || tab.hidden) return;
  const t = e.target; if(t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.tagName === 'SELECT')) return;
  const k = (e.key || '').toUpperCase(); if(/^[A-ZÑ]$/.test(k)){ e.preventDefault(); letraClase(k); }
});

/* ───── vista e impresión ───── */
function render(){
  if(!$('#ah-stage')) return;
  contarPalabras();
  const c = getCfg();
  const v = Math.max(0, +$('#ah-vsel').value || 0);
  $('#ah-stage').style.display = vista === 'play' ? 'none' : '';
  $('#ah-play').style.display = vista === 'play' ? '' : 'none';
  if(c.vacio){ $('#ah-stage').innerHTML = ''; $('#ah-play').innerHTML = ''; return; }
  if(vista === 'play'){ if(!CL) iniciarClase(); else pintarClase(); return; }
  $('#ah-stage').innerHTML = hojas(c, v, vista === 'key', vista === 'key' ? 'código ' + c.seed + ' · versión ' + (v+1) : 'Versión ' + (v+1) + ' de ' + c.nver);
}
function llenarVersiones(){
  const n = Math.max(1, Math.min(MAX_VERSIONES, parseInt($('#ah-nver').value, 10) || 1)), sel = $('#ah-vsel'), keep = +sel.value || 0;
  $('#ah-nver').value = n; sel.innerHTML = '';
  for(let i=0;i<n;i++) sel.insertAdjacentHTML('beforeend', '<option value="' + i + '">Versión ' + (i+1) + '</option>');
  sel.value = String(Math.min(keep, n-1));
}
function prepararImpresion(){
  const c = getCfg(); if(c.vacio){ $('#ah-status').textContent = '⚠️ ' + c.vacio; return false; }
  const root = $('#ah-print-root'); let h = '';
  for(let v=0; v<c.nver; v++) h += hojas(c, v, false, 'Versión ' + (v+1) + ' de ' + c.nver);
  if($('#ah-withkeys').checked) for(let v=0; v<c.nver; v++) h += hojas(c, v, true, 'código ' + c.seed + ' · versión ' + (v+1));
  root.innerHTML = h;
  document.body.classList.add('ah-printing');
  return true;
}
function imprimir(){ if(prepararImpresion()) setTimeout(() => window.print(), 120); }
function finImpresion(){ if(!document.body.classList.contains('ah-printing')) return; document.body.classList.remove('ah-printing'); $('#ah-print-root').innerHTML = ''; }

function init(){
  if(!$('#panel-ah')) return;
  $('#ah-grupos').innerHTML = GRUPOS.map((g, i) => '<label class="opt"><input type="checkbox" value="' + g[0] + '"' + (i < 2 ? ' checked' : '') + '> <span><b>' + g[1] + '</b><small></small></span></label>').join('');
  llenarVersiones();
  const re = () => { CL = null; render(); };
  $$('#ah-grupos input').forEach(i => i.addEventListener('change', re));
  ['#ah-n', '#ah-pistas', '#ah-title', '#ah-seed'].forEach(s => $(s).addEventListener('input', re));
  $('#ah-nver').addEventListener('change', () => { llenarVersiones(); re(); });
  $('#ah-vsel').addEventListener('change', re);
  $('#ah-btn-seed').addEventListener('click', () => { semilla = nuevaSemilla(); $('#ah-seed').value = ''; re(); });
  $$('#ah-seg button').forEach(b => b.addEventListener('click', () => {
    vista = b.dataset.view; $$('#ah-seg button').forEach(x => { x.classList.toggle('on', x === b); x.setAttribute('aria-pressed', x === b ? 'true' : 'false'); });
    render();
  }));
  $('#ah-btn-print').addEventListener('click', imprimir);
  window.addEventListener('beforeprint', () => { const t = $('#panel-ah'); if(t && !t.hidden && !document.body.classList.contains('ah-printing') && !document.body.classList.contains('cz-printing') && !document.body.classList.contains('lab-printing')) prepararImpresion(); });
  window.addEventListener('afterprint', finImpresion);
  render();
}
window.AHORCADO = {render, iniciarClase};
if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
