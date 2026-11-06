/* ═════════════════════════════════════════════════════════════════════
   extras.js — pestañas «Criptograma», «Mapa conceptual» y «Detective
   químico» del generador docente (docente.html).
   Mismo archivo en ChromaNom (extras.js) e IonNom (assets/extras.js).
   Datos:
   - Criptograma: BANCO_AHORCADO (palabra + pista 1 = la frase a descifrar).
   - Mapa conceptual: DOCENTE_DATOS.TEMAS[].info.esquema (raíz, ramas, ítems).
   - Detective: window.DETECTIVE (historias con puntos dudosos escritos en
     versión correcta y con error; cada hoja elige cuáles salen con error).
   Todas: hoja carta con la marca del sitio (logo, Nombre / Curso / Fecha,
   marca de agua, pie), versiones con semilla y clave, y modo clase con
   pantalla completa (respaldo .pseudo-fs en iPhone; gira a horizontal).
   ═════════════════════════════════════════════════════════════════════ */
(function(){
'use strict';

const $ = s => document.querySelector(s), $$ = s => [...document.querySelectorAll(s)];
const esc = s => String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
const MAX_VERSIONES = 40;
const MARCA = window.HOJA_SITIO || {logo:'', marca:'', nombre:'', pie:''};
const GRUPOS = window.AHORCADO_GRUPOS || [];

/* ───── utilidades comunes ───── */
function fnv(str){ let h = 0x811c9dc5; for(let i=0;i<str.length;i++){ h ^= str.charCodeAt(i); h = Math.imul(h, 0x01000193); } return h >>> 0; }
function rng(seed){ let a = fnv(String(seed)); return function(){ a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
function barajar(arr, r){ const a = arr.slice(); for(let i=a.length-1;i>0;i--){ const j = Math.floor(r()*(i+1)); [a[i],a[j]] = [a[j],a[i]]; } return a; }
const nuevaSemilla = () => Math.random().toString(36).slice(2, 8).toUpperCase();
const sinTilde = s => String(s).replace(/Ñ/g,'\u0001').replace(/ñ/g,'\u0002').normalize('NFD').replace(/[̀-ͯ]/g,'').replace(/\u0001/g,'Ñ').replace(/\u0002/g,'ñ');

function encabezadoHoja(titulo, sub, etiqueta, conForm){
  return (MARCA.marca ? '<img class="cz-wm" src="' + MARCA.marca + '" alt="" aria-hidden="true">' : '')
    + '<div class="cz-head">' + (MARCA.logo ? '<img src="' + MARCA.logo + '" alt="' + esc(MARCA.nombre) + '">' : '')
    + '<div class="cz-tit"><div class="t">' + esc(titulo) + '</div>' + (sub ? '<div class="s">' + sub + '</div>' : '') + '</div>'
    + '<div class="cz-ver">' + esc(etiqueta || '') + '</div></div>'
    + (conForm ? '<div class="cz-form"><span>Nombre: <i class="w1"></i></span><span>Curso: <i class="w2"></i></span><span>Fecha: <i class="w3"></i></span></div>' : '');
}
const pieHoja = () => MARCA.pie ? '<div class="cz-pie">' + MARCA.pie + '</div>' : '';
function ajustarHojas(cont){
  cont.querySelectorAll('.ex-hoja').forEach(h => {
    let f = 1; h.style.removeProperty('--f');
    while(h.scrollHeight > 1057 && f > 0.6){ f = Math.round((f - 0.04) * 100) / 100; h.style.setProperty('--f', f); }
  });
}
// pantalla completa con respaldo (iPhone) y giro a horizontal
function esPC(box){ return !!box && (document.fullscreenElement === box || document.webkitFullscreenElement === box || box.classList.contains('pseudo-fs')); }
function alternarPC(box, repintar){
  if(!box) return;
  if(esPC(box)){
    if(box.classList.contains('pseudo-fs')){ box.classList.remove('pseudo-fs', 'fs-on'); document.body.style.overflow = ''; repintar(); }
    else (document.exitFullscreen || document.webkitExitFullscreen).call(document);
    return;
  }
  const pseudo = () => { box.classList.add('pseudo-fs', 'fs-on'); document.body.style.overflow = 'hidden'; repintar(); };
  const req = box.requestFullscreen || box.webkitRequestFullscreen;
  if(!req){ pseudo(); return; }
  box.classList.add('fs-on');
  let p; try{ p = req.call(box); }catch(e){ pseudo(); return; }
  const girar = () => { try{ if(screen.orientation && screen.orientation.lock) screen.orientation.lock('landscape').catch(() => {}); }catch(e){} repintar(); };
  if(p && p.then) p.then(girar).catch(pseudo); else girar();
}
function vigilarPC(box, repintar){
  const f = () => {
    const real = document.fullscreenElement === box || document.webkitFullscreenElement === box;
    if(!real && !box.classList.contains('pseudo-fs') && box.classList.contains('fs-on')){ box.classList.remove('fs-on'); try{ if(screen.orientation && screen.orientation.unlock) screen.orientation.unlock(); }catch(e){} repintar(); }
    else if(real) repintar();
  };
  document.addEventListener('fullscreenchange', f); document.addEventListener('webkitfullscreenchange', f);
}
const btnPC = box => '<button type="button" class="exc-fs">' + (esPC(box) ? '✕ Salir de pantalla completa' : '⛶ Pantalla completa') + '</button>';

/* ───── formulario de cada pestaña (estilo del sitio) ───── */
// data-estilo="cn" (ChromaNom) o "ion" (IonNom) en el contenedor .ex-app
function estilo(app){ return app.dataset.estilo === 'ion'
  ? {sect:'sect', chks:'temas-grid', chk:(v,t,on) => '<label class="tema-chk"><input type="checkbox" value="' + v + '"' + (on ? ' checked' : '') + '><span><strong>' + t + '</strong><br><small></small></span></label>',
     campos:a => '<div class="field-row" style="flex-wrap:wrap">' + a.join('') + '</div>', campo:(l,h) => '<div class="field"><label>' + l + '</label>' + h + '</div>',
     hint:'sect-hint', adv:'lab-adv', bar:'lab-bar', seg:'lab-seg', b2:'btn-sec lab-nuevo', b1:'btn-generar', inl:(id,t) => '<label class="chk-linea" style="margin:0"><input type="checkbox" id="' + id + '" checked> ' + t + '</label>', verif:'lab-verif'}
  : {sect:'act-sect', chks:'act-chks', chk:(v,t,on) => '<label class="opt"><input type="checkbox" value="' + v + '"' + (on ? ' checked' : '') + '> <span><b>' + t + '</b><small></small></span></label>',
     campos:a => '<div class="campos">' + a.join('') + '</div>', campo:(l,h) => '<label>' + l + ' ' + h + '</label>',
     hint:'ayuda', adv:'act-adv', bar:'act-bar', seg:'act-seg', b2:'cn-btn cn-btn--secondary', b1:'cn-btn cn-btn--primary', inl:(id,t) => '<label class="opt act-inl"><input type="checkbox" id="' + id + '" checked> <span>' + t + '</span></label>', verif:'act-verif'}; }

function montar(A){
  const app = $('#' + A.id + '-app'); if(!app) return false;
  const E = estilo(app), p = A.id;
  app.innerHTML = '<div class="tipo-intro"><strong>' + A.icono + ' ' + A.nombre + '</strong> ' + A.intro + '</div>'
    + '<div class="' + E.sect + '"><h2>1 · ' + A.t1 + '</h2>' + A.seccion1(E) + '</div>'
    + '<div class="' + E.sect + '"><h2>2 · Hoja y versiones</h2>' + E.campos(A.campos(E).concat([
        E.campo('Título', '<input type="text" id="' + p + '-title" maxlength="50" placeholder="' + esc(A.tituloDef) + '">'),
        E.campo('Versiones paralelas (1 a 40)', '<input type="number" inputmode="numeric" id="' + p + '-nver" value="2" min="1" max="40">'),
        E.campo('Versión en pantalla', '<select id="' + p + '-vsel"></select>')]))
    + '<p class="' + E.hint + '">' + A.ayuda + '</p>'
    + '<details class="' + E.adv + '"><summary>Volver a generar hojas de otro día</summary>' + E.campos([E.campo('Código de la hoja de clave', '<input type="text" id="' + p + '-seed" maxlength="20" autocomplete="off">')]) + '</details></div>'
    + '<div class="' + E.bar + '"><button type="button" class="' + E.b2 + '" id="' + p + '-btn-seed">🎲 Otra versión</button>'
    + '<div class="' + E.seg + '" id="' + p + '-seg" role="group" aria-label="Vista"><button type="button" data-view="sheet" class="on" aria-pressed="true">📄 Hoja</button><button type="button" data-view="key" aria-pressed="false">🔑 Clave</button><button type="button" data-view="play" aria-pressed="false">📽️ Modo clase</button></div>'
    + '<button type="button" class="' + E.b1 + '" id="' + p + '-btn-print">🖨️ Imprimir versiones</button>' + E.inl(p + '-withkeys', 'con hojas de clave al final') + '</div>'
    + '<div id="' + p + '-status" class="' + E.verif + '" aria-live="polite"></div><div id="' + p + '-stage" class="ex-stage"></div><div id="' + p + '-play" class="ex-play" style="display:none"></div>';
  A.semilla = nuevaSemilla(); A.vista = 'sheet'; A.juego = null;
  const nver = $('#' + p + '-nver'), vsel = $('#' + p + '-vsel');
  const versiones = () => { const n = Math.max(1, Math.min(MAX_VERSIONES, parseInt(nver.value, 10) || 1)), k = +vsel.value || 0; nver.value = n; vsel.innerHTML = ''; for(let i=0;i<n;i++) vsel.insertAdjacentHTML('beforeend', '<option value="' + i + '">Versión ' + (i+1) + '</option>'); vsel.value = String(Math.min(k, n-1)); };
  versiones();
  const re = () => { A.juego = null; render(A); };
  app.addEventListener('change', e => { if(e.target === nver) versiones(); if(e.target.closest('.ex-play')) return; re(); });
  app.addEventListener('input', e => { if(!e.target.closest('.ex-play') && e.target.matches('input[type=text],input[type=number]')) re(); });
  $('#' + p + '-btn-seed').addEventListener('click', () => { A.semilla = nuevaSemilla(); $('#' + p + '-seed').value = ''; re(); });
  $$('#' + p + '-seg button').forEach(b => b.addEventListener('click', () => { A.vista = b.dataset.view; $$('#' + p + '-seg button').forEach(x => { x.classList.toggle('on', x === b); x.setAttribute('aria-pressed', x === b ? 'true' : 'false'); }); render(A); }));
  $('#' + p + '-btn-print').addEventListener('click', () => imprimir(A));
  const play = $('#' + p + '-play');
  vigilarPC(play, () => { if(A.juego && A.vista === 'play') A.pintar(play); });
  window.addEventListener('resize', () => { if(A.juego && A.vista === 'play' && play.offsetParent !== null) A.pintar(play); });
  if(A.init) A.init();
  render(A);
  return true;
}
function cfgBase(A){
  const p = A.id;
  return {seed: (($('#' + p + '-seed').value || '').trim().toUpperCase()) || A.semilla, nver: Math.max(1, Math.min(MAX_VERSIONES, parseInt($('#' + p + '-nver').value, 10) || 1)),
    titulo: ($('#' + p + '-title').value || '').trim() || A.tituloDef, v: Math.max(0, +$('#' + p + '-vsel').value || 0)};
}
function render(A){
  const p = A.id, st = $('#' + p + '-stage'), pl = $('#' + p + '-play'); if(!st) return;
  const c = Object.assign(cfgBase(A), A.cfg());
  $('#' + p + '-status').innerHTML = c.vacio ? '⚠️ ' + c.vacio : (c.info || '');
  st.style.display = A.vista === 'play' ? 'none' : ''; pl.style.display = A.vista === 'play' ? '' : 'none';
  if(c.vacio){ st.innerHTML = ''; pl.innerHTML = ''; return; }
  if(A.vista === 'play'){ if(!A.juego) A.juego = A.nuevoJuego(c); A.pintar(pl); return; }
  const clave = A.vista === 'key';
  st.innerHTML = A.hoja(c, c.v, clave, clave ? 'código ' + c.seed + ' · versión ' + (c.v+1) : 'Versión ' + (c.v+1) + ' de ' + c.nver);
  ajustarHojas(st);
}
function imprimir(A){
  const c = Object.assign(cfgBase(A), A.cfg()); if(c.vacio){ $('#' + A.id + '-status').textContent = '⚠️ ' + c.vacio; return; }
  const root = $('#ex-print-root'); let h = '', k = '';
  for(let v=0; v<c.nver; v++){ h += A.hoja(c, v, false, 'Versión ' + (v+1) + ' de ' + c.nver); k += A.hoja(c, v, true, 'código ' + c.seed + ' · versión ' + (v+1)); }
  root.innerHTML = h + ($('#' + A.id + '-withkeys').checked ? k : '');
  root.style.cssText = 'display:block;position:absolute;left:-12000px;top:0'; ajustarHojas(root); root.style.cssText = '';
  document.body.classList.add('ex-printing');
  setTimeout(() => window.print(), 120);
}
window.addEventListener('afterprint', () => { if(document.body.classList.contains('ex-printing')){ document.body.classList.remove('ex-printing'); $('#ex-print-root').innerHTML = ''; } });
// marcador de dos equipos para los modos clase
const equipos = J => '<span class="exc-eq">Equipo A: <b>' + (J.eqA||0) + '</b> <button type="button" data-eq="A">+1</button></span><span class="exc-eq">Equipo B: <b>' + (J.eqB||0) + '</b> <button type="button" data-eq="B">+1</button></span>';
function enlazarComunes(A, box){
  box.querySelectorAll('[data-eq]').forEach(b => b.addEventListener('click', () => { if(b.dataset.eq === 'A') A.juego.eqA = (A.juego.eqA||0) + 1; else A.juego.eqB = (A.juego.eqB||0) + 1; A.pintar(box); }));
  const f = box.querySelector('.exc-fs'); if(f) f.addEventListener('click', () => alternarPC(box, () => A.pintar(box)));
}

/* ═════════ 1. CRIPTOGRAMA QUÍMICO ═════════
   Cada letra de la frase se cifra con el número atómico Z de un elemento
   cuyo símbolo empieza por esa letra (C → 6 C, 17 Cl, 20 Ca…). El
   estudiante pasa de Z al símbolo con la tabla periódica y toma la
   primera letra. Las letras sin elemento en el rango elegido se regalan. */
const SIMBOLOS = ['','H','He','Li','Be','B','C','N','O','F','Ne','Na','Mg','Al','Si','P','S','Cl','Ar','K','Ca','Sc','Ti','V','Cr','Mn','Fe','Co','Ni','Cu','Zn','Ga','Ge','As','Se','Br','Kr','Rb','Sr','Y','Zr','Nb','Mo','Tc','Ru','Rh','Pd','Ag','Cd','In','Sn','Sb','Te','I','Xe','Cs','Ba','La','Ce','Pr','Nd','Pm','Sm','Eu','Gd','Tb','Dy','Ho','Er','Tm','Yb','Lu','Hf','Ta','W','Re','Os','Ir','Pt','Au','Hg','Tl','Pb','Bi','Po','At','Rn','Fr','Ra','Ac','Th','Pa','U'];
function candidatos(maxZ){ const m = {}; for(let z=1; z<=maxZ; z++){ const l = SIMBOLOS[z][0]; (m[l] = m[l] || []).push(z); } return m; }
const CR = {
  id:'cr', icono:'🔐', nombre:'Criptograma químico', t1:'Frases y clave', tituloDef:'Criptograma químico',
  intro:'Una definición del sitio cifrada con la tabla periódica: cada letra es el número atómico Z de un elemento cuyo símbolo empieza por esa letra. El estudiante descifra con la tabla periódica.',
  ayuda:'Ejemplo: «CARBONO» puede salir como 20 · 13 · 37 · 5 · 8 · 7 · 8 (Ca · Al · Rb · B · O · N · O). Las letras sin elemento en el rango elegido se dan de regalo. Cada versión trae otras frases y otros números.',
  seccion1:E => '<div class="' + E.chks + '" id="cr-grupos">' + GRUPOS.map((g, i) => E.chk(g[0], g[1], i < 2)).join('') + '</div>',
  campos:E => [
    E.campo('Frases por hoja (1 a 5)', '<input type="number" inputmode="numeric" id="cr-n" value="4" min="1" max="5">'),
    E.campo('Elementos usados', '<select id="cr-z"><option value="36">Z del 1 al 36 (más fácil)</option><option value="56" selected>Z del 1 al 56</option><option value="92">Z del 1 al 92 (más difícil)</option></select>'),
    E.campo('Misma letra, mismo número', '<select id="cr-fijo"><option value="si">Sí: cada letra siempre con el mismo Z</option><option value="no" selected>No: puede variar (más reto)</option></select>')],
  cfg(){
    const gr = $$('#cr-grupos input:checked').map(i => i.value), temas = GRUPOS.filter(g => gr.includes(g[0])).reduce((a, g) => a.concat(g[2]), []);
    const pool = (window.BANCO_AHORCADO || []).filter(w => temas.includes(w[1]) && !/___/.test(w[2]) && (w[0] + w[2]).length <= 95);
    $$('#cr-grupos label').forEach(l => { const g = GRUPOS.find(x => x[0] === l.querySelector('input').value); const s = l.querySelector('small'); if(s) s.textContent = (window.BANCO_AHORCADO || []).filter(w => g[2].includes(w[1]) && !/___/.test(w[2])).length + ' frases'; });
    return {pool, n: Math.max(1, Math.min(5, parseInt($('#cr-n').value, 10) || 4)), maxZ: +$('#cr-z').value || 56, fijo: $('#cr-fijo').value === 'si',
      vacio: !gr.length ? 'Marca al menos un grupo de temas.' : (!pool.length ? 'No hay frases para esos temas.' : ''), info: pool.length + ' frases disponibles para esos temas.'};
  },
  frases(c, v){
    const r = rng(c.seed + '|cr|' + v), cand = candidatos(c.maxZ);
    return barajar(c.pool, r).slice(0, c.n).map(w => {
      const texto = (w[0] + ': ' + w[2]).toUpperCase();
      const fijo = {};
      const celdas = [...texto].map(ch => {
        const l = sinTilde(ch);
        if(!/[A-ZÑ]/.test(l)) return {t: ch, signo: true};
        const op = cand[l];
        if(!op) return {t: ch, l, regalo: true};
        const z = c.fijo ? (fijo[l] = fijo[l] || op[Math.floor(r() * op.length)]) : op[Math.floor(r() * op.length)];
        return {t: ch, l, z};
      });
      return {w, texto, celdas};
    });
  },
  dibujar(f, clave, modo){
    // agrupa por palabras para que no se partan al saltar de línea
    const pal = []; let cur = [];
    f.celdas.forEach(c => { if(c.signo && c.t === ' '){ if(cur.length) pal.push(cur); cur = []; } else cur.push(c); }); if(cur.length) pal.push(cur);
    return '<div class="cr-frase">' + pal.map(p => '<span class="cr-pal">' + p.map(c => {
      if(c.signo) return '<span class="cr-c cr-signo"><b>' + esc(c.t) + '</b></span>';
      if(c.regalo) return '<span class="cr-c cr-regalo"><i>·</i><b>' + esc(c.t) + '</b></span>';
      if(modo === 'play') return '<span class="cr-c"><i>' + c.z + '</i><input maxlength="1" data-l="' + c.l + '" autocomplete="off" autocapitalize="characters" aria-label="Letra del número ' + c.z + '"></span>';
      return '<span class="cr-c"><i>' + c.z + '</i><b>' + (clave ? esc(c.t) : '') + '</b></span>';
    }).join('') + '</span>').join('') + '</div>';
  },
  hoja(c, v, clave, etiqueta){
    const fs = this.frases(c, v);
    const usados = [...new Set(fs.flatMap(f => f.celdas.filter(x => x.z).map(x => x.z)))].sort((a, b) => a - b);
    const ins = 'Cada número es el número atómico (Z) de un elemento. Busca su símbolo en la tabla periódica y escribe la <b>primera letra</b> del símbolo en la casilla (por ejemplo, 17 → Cl → C). Las letras con punto ya están dadas.';
    return '<div class="ex-hoja cr-hoja">' + encabezadoHoja(c.titulo + (clave ? ' · Clave' : ''), clave ? '' : ins, etiqueta, !clave)
      + '<div class="ex-cuerpo">' + fs.map((f, i) => '<div class="cr-bloque"><div class="cr-n">' + (i+1) + '</div>' + this.dibujar(f, clave) + '</div>').join('')
      + (clave ? '<p class="cr-zs"><b>Números usados:</b> ' + usados.map(z => z + ' ' + SIMBOLOS[z]).join(' · ') + '</p>' : '') + '</div>' + pieHoja() + '</div>';
  },
  nuevoJuego(c){ return {c, fs: this.frases(c, c.v), i: 0}; },
  pintar(box){
    const J = this.juego, f = J.fs[J.i];
    const antes = {}; box.querySelectorAll('.cr-c input').forEach((x, k) => { antes[k] = x.value; });
    const mismo = box.dataset.frase === String(J.i);
    box.innerHTML = '<div class="exc"><div class="exc-bar"><b>Frase ' + (J.i+1) + ' de ' + J.fs.length + '</b>' + equipos(J) + btnPC(box) + '</div>'
      + '<p class="exc-ayuda">Número atómico → símbolo en la tabla periódica → primera letra. Escribe una letra en cada casilla.</p>'
      + this.dibujar(f, false, 'play')
      + '<div class="exc-msg" id="cr-msg"></div>'
      + '<div class="exc-acc"><button type="button" class="exc-btn exc-ok" data-a="comp">✔ Comprobar</button><button type="button" class="exc-btn" data-a="pista">💡 Revelar una letra</button><button type="button" class="exc-btn" data-a="rev">👁️ Revelar la frase</button>'
      + (J.i < J.fs.length - 1 ? '<button type="button" class="exc-btn exc-sig" data-a="sig">Siguiente frase →</button>' : '') + '</div></div>';
    box.dataset.frase = String(J.i);
    const ins = [...box.querySelectorAll('.cr-c input')];
    if(mismo) ins.forEach((x, k) => { if(antes[k]) x.value = antes[k]; });
    ins.forEach((x, k) => {
      x.addEventListener('input', () => { x.value = sinTilde(x.value.toUpperCase()).replace(/[^A-ZÑ]/g, '').slice(0, 1); x.parentNode.classList.remove('bien', 'mal'); if(x.value && ins[k+1]) ins[k+1].focus(); });
      x.addEventListener('keydown', e => { if(e.key === 'Backspace' && !x.value && ins[k-1]) ins[k-1].focus(); });
    });
    const msg = box.querySelector('#cr-msg');
    box.querySelector('[data-a=comp]').addEventListener('click', () => { let b = 0, m = 0, v = 0; ins.forEach(x => { x.parentNode.classList.remove('bien', 'mal'); if(!x.value){ v++; return; } if(x.value === x.dataset.l){ b++; x.parentNode.classList.add('bien'); } else { m++; x.parentNode.classList.add('mal'); } }); msg.textContent = (m === 0 && v === 0 ? '🎉 ¡Frase descifrada! ' : '') + b + ' bien · ' + m + ' por corregir · ' + v + ' vacías'; });
    box.querySelector('[data-a=pista]').addEventListener('click', () => { const x = ins.find(y => y.value !== y.dataset.l); if(x){ x.value = x.dataset.l; x.parentNode.classList.add('bien'); } });
    box.querySelector('[data-a=rev]').addEventListener('click', () => { ins.forEach(x => { x.value = x.dataset.l; x.parentNode.classList.add('bien'); }); msg.textContent = f.texto; });
    const s = box.querySelector('[data-a=sig]'); if(s) s.addEventListener('click', () => { J.i++; this.pintar(box); });
    enlazarComunes(this, box);
  }
};

/* ═════════ 2. MAPA CONCEPTUAL CON HUECOS ═════════
   El esquema de cada tema (raíz → ramas → ejemplos) con sus conectores;
   algunos recuadros quedan en blanco. Con banco de palabras, los textos
   que faltan aparecen desordenados abajo. */
const MP = {
  id:'mp', icono:'🗺️', nombre:'Mapa conceptual con huecos', t1:'Tema', tituloDef:'Mapa conceptual',
  intro:'El esquema de cada tema (el mismo de la lectura de las guías), dibujado con sus conectores y con algunos recuadros en blanco para completar.',
  ayuda:'Cada versión deja en blanco otros recuadros. Sin banco de palabras es más difícil: el estudiante escribe el concepto con sus propias palabras.',
  temas(){ return ((window.DOCENTE_DATOS || {}).TEMAS || []).filter(t => t.info && t.info.esquema && t.info.esquema.ramas && t.info.esquema.ramas.length); },
  seccion1(E){ return E.campos([E.campo('Tema del mapa', '<select id="mp-tema">' + this.temas().map(t => '<option value="' + esc(t.id) + '">' + esc(t.titulo) + '</option>').join('') + '</select>')]); },
  campos:E => [
    E.campo('Recuadros en blanco', '<select id="mp-huecos"><option value="ramas">Solo las ramas</option><option value="items">Solo los ejemplos</option><option value="mitad" selected>La mitad, al azar</option><option value="todo">Casi todos</option></select>'),
    E.campo('Banco de palabras', '<select id="mp-banco"><option value="si" selected>Sí, abajo y desordenado</option><option value="no">No</option></select>')],
  cfg(){
    const t = this.temas().find(x => x.id === $('#mp-tema').value) || this.temas()[0];
    return {t, huecos: $('#mp-huecos').value, banco: $('#mp-banco').value === 'si', vacio: t ? '' : 'No hay esquemas disponibles.', info: t ? 'Mapa de «' + esc(t.titulo) + '»: ' + t.info.esquema.ramas.length + ' ramas.' : ''};
  },
  armar(c, v){
    const e = c.t.info.esquema, r = rng(c.seed + '|mp|' + v + '|' + c.t.id);
    const nodos = []; e.ramas.forEach((ra, i) => { nodos.push({k:'r', i, txt: ra.t}); (ra.items || []).forEach((it, j) => nodos.push({k:'i', i, j, txt: it})); });
    let elegibles = c.huecos === 'ramas' ? nodos.filter(n => n.k === 'r') : c.huecos === 'items' ? nodos.filter(n => n.k === 'i') : nodos;
    const cuantos = c.huecos === 'mitad' ? Math.ceil(nodos.length / 2) : c.huecos === 'todo' ? Math.max(1, nodos.length - 1) : elegibles.length;
    const blancos = new Set(barajar(elegibles, r).slice(0, cuantos));
    return {e, nodos, blancos, banco: barajar([...blancos].map(n => n.txt), r)};
  },
  dibujar(m, clave, modo){
    const caja = (n, cls) => {
      const b = m.blancos.has(n);
      if(modo === 'play' && b) return '<div class="mp-n ' + cls + ' mp-hueco' + (n.ok ? ' ok' : '') + '" data-k="' + m.nodos.indexOf(n) + '">' + (n.ok ? esc(n.txt) : '?') + '</div>';
      return '<div class="mp-n ' + cls + (b ? (clave ? ' mp-clave' : ' mp-blanco') : '') + '">' + (b && !clave ? '' : esc(n.txt)) + '</div>';
    };
    const ramas = m.e.ramas.map((ra, i) => {
      const nr = m.nodos.find(n => n.k === 'r' && n.i === i), its = m.nodos.filter(n => n.k === 'i' && n.i === i);
      return '<div class="mp-rama">' + caja(nr, 'mp-r') + (its.length ? '<div class="mp-con">incluye</div><div class="mp-items">' + its.map(n => caja(n, 'mp-i')).join('') + '</div>' : '') + '</div>';
    }).join('');
    return '<div class="mp-mapa"><div class="mp-raiz">' + esc(m.e.raiz) + '</div><div class="mp-con mp-con-raiz">se organiza en</div><div class="mp-ramas" style="--n:' + m.e.ramas.length + '">' + ramas + '</div></div>';
  },
  hoja(c, v, clave, etiqueta){
    const m = this.armar(c, v);
    const ins = c.banco ? 'Completa los recuadros en blanco con los conceptos del banco de palabras. Cada concepto se usa una sola vez.' : 'Completa los recuadros en blanco con el concepto que corresponde. Fíjate en los conectores.';
    return '<div class="ex-hoja mp-hoja">' + encabezadoHoja(c.titulo + ' · ' + (c.t.corto || c.t.titulo) + (clave ? ' · Clave' : ''), clave ? '' : ins, etiqueta, !clave)
      + '<div class="ex-cuerpo">' + this.dibujar(m, clave) + (c.banco && !clave ? '<div class="mp-banco"><b>Banco de palabras:</b> ' + m.banco.map(t => '<span>' + esc(t) + '</span>').join('') + '</div>' : '') + '</div>' + pieHoja() + '</div>';
  },
  nuevoJuego(c){ const m = this.armar(c, c.v); return {c, m, sel: null}; },
  pintar(box){
    const J = this.juego, m = J.m, faltan = [...m.blancos].filter(n => !n.ok);
    box.innerHTML = '<div class="exc"><div class="exc-bar"><b>' + ([...m.blancos].length - faltan.length) + ' de ' + m.blancos.size + ' recuadros</b>' + equipos(J) + btnPC(box) + '</div>'
      + '<p class="exc-ayuda">Toca un concepto del banco y después el recuadro «?» donde va.</p>'
      + this.dibujar(m, false, 'play')
      + (faltan.length ? '' : '<div class="exc-msg ok">🎉 ¡Mapa completo!</div>')
      + '<div class="mp-banco exc-banco">' + m.banco.map((t, k) => { const usado = [...m.blancos].some(n => n.ok && n.txt === t && n._k === k); return '<button type="button" class="mp-chip' + (J.sel === k ? ' sel' : '') + (usado ? ' usado' : '') + '" data-b="' + k + '"' + (usado ? ' disabled' : '') + '>' + esc(t) + '</button>'; }).join('') + '</div>'
      + '<div class="exc-acc"><button type="button" class="exc-btn" data-a="rev">👁️ Revelar todo</button></div></div>';
    box.querySelectorAll('.mp-chip').forEach(b => b.addEventListener('click', () => { J.sel = +b.dataset.b; this.pintar(box); }));
    box.querySelectorAll('.mp-hueco:not(.ok)').forEach(h => h.addEventListener('click', () => {
      if(J.sel === null) return;
      const n = m.nodos[+h.dataset.k], t = m.banco[J.sel];
      if(n.txt === t){ n.ok = true; n._k = J.sel; J.sel = null; this.pintar(box); }
      else { h.classList.add('mal'); setTimeout(() => h.classList.remove('mal'), 600); }
    }));
    box.querySelector('[data-a=rev]').addEventListener('click', () => { m.blancos.forEach(n => { if(!n.ok){ n.ok = true; n._k = m.banco.indexOf(n.txt); } }); this.pintar(box); });
    enlazarComunes(this, box);
  }
};

/* ═════════ 3. EL DETECTIVE QUÍMICO ═════════
   Historias con puntos dudosos escritos en versión correcta y con error
   (window.DETECTIVE). Cada versión elige al azar cuáles salen con error. */
const DT = {
  id:'dt', icono:'🕵️', nombre:'El detective químico', t1:'Historia', tituloDef:'El detective químico',
  intro:'Una historia de un día en el laboratorio o de un fenómeno cotidiano con errores conceptuales camuflados. El estudiante los subraya y los corrige.',
  ayuda:'Cada historia tiene 8 puntos dudosos. Cada versión elige al azar cuáles salen con error, así que dos versiones de la misma historia tienen errores distintos.',
  historias(){ return window.DETECTIVE || []; },
  seccion1(E){ return E.campos([E.campo('Historia', '<select id="dt-h">' + this.historias().map((h, i) => '<option value="' + i + '">' + esc(h[1]) + ' · ' + esc(((GRUPOS.find(g => g[0] === h[0]) || [,''])[1]).replace(/^\S+\s/, '')) + '</option>').join('') + '</select>')]); },
  campos:E => [E.campo('Errores escondidos', '<select id="dt-n"><option value="3">3</option><option value="4">4</option><option value="5" selected>5</option><option value="6">6</option></select>')],
  cfg(){
    const hs = this.historias(), h = hs[+$('#dt-h').value || 0];
    return {h, n: +$('#dt-n').value || 5, vacio: h ? '' : 'No hay historias disponibles.', info: h ? 'Historia «' + esc(h[1]) + '» con ' + (+$('#dt-n').value || 5) + ' errores.' : ''};
  },
  armar(c, v){
    const r = rng(c.seed + '|dt|' + v + '|' + c.h[1]);
    const dudosos = c.h[2].map((p, i) => Array.isArray(p) ? i : -1).filter(i => i >= 0);
    const malos = new Set(barajar(dudosos, r).slice(0, Math.min(c.n, dudosos.length)));
    let k = 0;
    return c.h[2].map((p, i) => Array.isArray(p) ? (malos.has(i) ? {t: p[1], err: true, corr: p[0], n: ++k} : {t: p[0]}) : {t: p});
  },
  hoja(c, v, clave, etiqueta){
    const partes = this.armar(c, v), nErr = partes.filter(p => p.err).length;
    const ins = 'Lee la historia con atención. Tiene <b>' + nErr + ' errores</b> de química. Subraya cada error y escribe abajo la versión correcta, explicando por qué estaba mal.';
    const texto = '<p class="dt-texto">' + partes.map(p => p.err && clave ? '<mark>' + esc(p.t) + ' <sup>' + p.n + '</sup></mark>' : esc(p.t)).join(' ') + '</p>';
    const tabla = clave
      ? '<ol class="dt-corr">' + partes.filter(p => p.err).map(p => '<li><s>' + esc(p.t) + '</s><br>✔ ' + esc(p.corr) + '</li>').join('') + '</ol>'
      : '<div class="dt-lineas">' + Array.from({length: nErr}, (_, i) => '<div class="dt-l"><b>' + (i+1) + '.</b><i></i><i></i></div>').join('') + '</div>';
    return '<div class="ex-hoja dt-hoja">' + encabezadoHoja(c.titulo + (clave ? ' · Clave' : ''), clave ? '' : ins, etiqueta, !clave)
      + '<div class="ex-cuerpo"><h3 class="dt-tit">' + esc(c.h[1]) + '</h3>' + texto + tabla + '</div>' + pieHoja() + '</div>';
  },
  nuevoJuego(c){ return {c, partes: this.armar(c, c.v), marcadas: new Set(), fallos: 0}; },
  pintar(box){
    const J = this.juego, P = J.partes, tot = P.filter(p => p.err).length, hall = P.filter((p, i) => p.err && J.marcadas.has(i)).length;
    box.innerHTML = '<div class="exc"><div class="exc-bar"><b>' + hall + ' de ' + tot + ' errores</b><span class="exc-fallo">Toques en frases correctas: ' + J.fallos + '</span>' + equipos(J) + btnPC(box) + '</div>'
      + '<h3 class="dt-tit">' + esc(J.c.h[1]) + '</h3>'
      + '<p class="exc-ayuda">Toca cada frase que tenga un error de química.</p>'
      + '<p class="dt-texto dtc">' + P.map((p, i) => '<span class="dt-f' + (J.marcadas.has(i) ? (p.err ? ' hallado' : ' bien') : '') + '" data-i="' + i + '"><span class="dt-txt">' + esc(p.t) + '</span>' + (J.marcadas.has(i) && p.err ? '<span class="dt-cor">✔ ' + esc(p.corr) + '</span>' : '') + '</span>').join(' ') + '</p>'
      + (hall === tot ? '<div class="exc-msg ok">🎉 ¡Caso resuelto! Encontraron los ' + tot + ' errores.</div>' : '')
      + '<div class="exc-acc"><button type="button" class="exc-btn" data-a="rev">👁️ Revelar los errores</button></div></div>';
    box.querySelectorAll('.dt-f').forEach(s => s.addEventListener('click', () => {
      const i = +s.dataset.i; if(J.marcadas.has(i)) return;
      J.marcadas.add(i); if(!P[i].err) J.fallos++;
      this.pintar(box);
    }));
    box.querySelector('[data-a=rev]').addEventListener('click', () => { P.forEach((p, i) => { if(p.err) J.marcadas.add(i); }); this.pintar(box); });
    enlazarComunes(this, box);
  }
};

const ACTS = {cr: CR, mp: MP, dt: DT};
function init(){ Object.values(ACTS).forEach(A => montar(A)); }
window.EXTRAS = {render: id => { if(ACTS[id] && $('#' + id + '-app')) render(ACTS[id]); }};
if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
