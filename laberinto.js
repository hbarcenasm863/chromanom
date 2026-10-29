/* ════════════════════════════════════════════════════════════════════════
   laberinto.js — pestaña «Laberintos» del generador docente (docente.html)
   Adaptado del generador de laberintos de IonNom a la química orgánica de
   ChromaNom: hoja con casillas A, B, C…; en cada una el estudiante resuelve
   un ejercicio y sigue la flecha rotulada con su resultado hasta FIN.

   Modos:
   - nom: estructura → nombre IUPAC (distractores con errores típicos de
     numeración, orden alfabético y multiplicadores) y estructura → familia.
     Moléculas y dibujos del Generador (docente-app.js → DOCENTE_BANCOS).
   - fund: preguntas de la Fase 1 «El carbono» e isomería (fundamentos.js,
     el mismo banco de las páginas y del Juego).
   - rx: tipo de reacción (BANCO_RXN del Generador).

   Igual que en IonNom:
   - Ruta única: cada casilla tiene UNA sola salida con la respuesta
     correcta (o ninguna, si es trampa) y cada pregunta trae su propio
     validador `acepta(rótulo)`. Antes de mostrar un laberinto se verifica
     entero (verificar()); si algo falla, se rehace con la misma semilla +
     un sufijo (misma semilla → mismo laberinto).
   - Semilla reproducible y hasta 40 versiones paralelas para imprimir.
   ════════════════════════════════════════════════════════════════════════ */
(function(){
'use strict';

/* ───────────────────────── 1. Utilidades ───────────────────────── */
const SUB_A = {'₀':'0','₁':'1','₂':'2','₃':'3','₄':'4','₅':'5','₆':'6','₇':'7','₈':'8','₉':'9'};
const A_SUB = '₀₁₂₃₄₅₆₇₈₉';
const A_SUP = {'0':'⁰','1':'¹','2':'²','3':'³','4':'⁴','5':'⁵','6':'⁶','7':'⁷','8':'⁸','9':'⁹','+':'⁺','-':'⁻'};
const aAscii = f => String(f).replace(/[₀-₉]/g, c => SUB_A[c]);
// Dígitos tras letra o ")" → subíndice Unicode (igual que las fórmulas de banco.js)
const aSub = f => String(f).replace(/([A-Za-z)])(\d+)/g, (m, a, d) => a + d.split('').map(x => A_SUB[x]).join(''));
const sup = s => String(s).split('').map(c => A_SUP[c] || c).join('');
const esc = s => String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
const cap = s => s ? s.charAt(0).toUpperCase() + s.slice(1) : s;
const normNombre = s => String(s||'').toLowerCase().normalize('NFC').replace(/\s+/g,' ').replace(/\s*\(\s*/g,'(').replace(/\s*\)\s*/g,')').trim();

function parseF(f){
  const s = aAscii(f).replace(/\((aq|g|l|s)\)$/i,'');
  const out = {};
  (function grupo(str, mult){
    let i = 0;
    while(i < str.length){
      if(str[i] === '('){
        let d = 1, j = i + 1;
        while(j < str.length && d){ if(str[j]==='(') d++; else if(str[j]===')') d--; j++; }
        let n = ''; while(j < str.length && /\d/.test(str[j])) n += str[j++];
        grupo(str.slice(i+1, j-1), mult * (n ? +n : 1)); i = j;
      } else if(/[A-Z]/.test(str[i])){
        let el = str[i++]; while(i < str.length && /[a-z]/.test(str[i])) el += str[i++];
        let n = ''; while(i < str.length && /\d/.test(str[i])) n += str[i++];
        out[el] = (out[el]||0) + mult * (n ? +n : 1);
      } else i++;
    }
  })(s, 1);
  return out;
}
const contarAtomos = f => Object.values(parseF(f)).reduce((a,b) => a+b, 0);

function fmtNum(x, d){
  if(d == null) d = 2;
  const k = Math.pow(10, d), v = Math.round(x*k)/k;
  let s = v.toFixed(d);
  if(s.indexOf('.') >= 0) s = s.replace(/0+$/,'').replace(/\.$/,'');
  let [ent, dec] = s.split('.');
  ent = ent.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  return dec ? ent + ',' + dec : ent;
}
// Rótulo: h = HTML visible, k = clave única (comparación exacta), v/u =
// valor numérico y unidad (para el validador por tolerancia).
const L = (h, k, extra) => Object.assign({h, k: k || h.replace(/<[^>]+>/g,'')}, extra||{});
const numL = (x, u) => L(fmtNum(x) + ' ' + u, 'N:' + fmtNum(x) + ' ' + u, {v:x, u});
function sciPartes(x){
  let e = Math.floor(Math.log10(x) + 1e-12), m = x / Math.pow(10, e);
  m = Math.round(m*100)/100; if(m >= 10){ m = 1; e++; }
  return {m, e};
}
function sciL(x, u){
  const p = sciPartes(x), ms = p.m.toFixed(2).replace('.', ','); // siempre 3 cifras: 1,20×10²⁴
  return L(ms + '×10<sup>' + p.e + '</sup> ' + u, 'N:' + ms + 'e' + p.e + ' ' + u, {v:x, u});
}
const autoL = (x, u) => x >= 1e5 ? sciL(x, u) : numL(x, u);
const valido = x => isFinite(x) && x > 0 && Math.round(x*100)/100 > 0;

/* ───────────────────────── 2. Azar con semilla ───────────────────────── */
function makeRng(str){
  let h = 2166136261 >>> 0;
  for(let i=0;i<str.length;i++){ h ^= str.charCodeAt(i); h = Math.imul(h, 16777619) >>> 0; }
  let a = h || 1;
  const r = function(){ a = (a + 0x6D2B79F5)|0; let t = Math.imul(a ^ (a>>>15), 1|a); t = (t + Math.imul(t ^ (t>>>7), 61|t)) ^ t; return ((t ^ (t>>>14)) >>> 0) / 4294967296; };
  for(let i=0;i<6;i++) r();
  return r;
}
const pick = (a, r) => a[Math.floor(r()*a.length)];
function shuffle(a, r){ a = a.slice(); for(let i=a.length-1;i>0;i--){ const j = Math.floor(r()*(i+1)); [a[i],a[j]] = [a[j],a[i]]; } return a; }


/* ───────────────────────── 3. Bancos de ChromaNom ───────────────────────── */
// Moléculas y dibujos del Generador y reacciones: los lee docente-app.js
// (window.DOCENTE_BANCOS). Preguntas de la Fase 1 e isomería: fundamentos.js.
function DB(){ return window.DOCENTE_BANCOS || {}; }
function mols(){ return DB().genMols || []; }
function rxns(){ return DB().genRxn || []; }
// Dibujo para una casilla: el «estilo libro» de las hojas impresas (las
// ramas cuelgan del carbono; se lee bien en tamaño pequeño). Si no está,
// el dibujo del Generador.
const _figs = {};
function figMol(key){
  if(key in _figs) return _figs[key];
  let h = '';
  try{
    if(window.DOCENTE_FIGURA){
      h = window.DOCENTE_FIGURA({gen:key}, 186, 90) || '';
      // se reduce para caber en la casilla (186 px); si quedaría con letra
      // de menos de ~10 px, la molécula no se usa en el laberinto
      const m = h.match(/data-w="(\d+)"/);
      if(m){ const w = +m[1], z = Math.min(1, 186 / w); h = z < 0.7 ? '' : (z < 1 ? '<div style="zoom:' + z.toFixed(3) + '">' + h + '</div>' : h); }
    }
  }catch(e){ h = ''; }
  if(!h) h = '';
  return (_figs[key] = h || (window.DOCENTE_FIGURA ? '' : svgMol(key)));
}
function svgMol(key){ try{ const G = DB().G; const s = G && G.getSVG ? G.getSVG(key) : ''; return s && s.indexOf('<svg') >= 0 ? s : ''; }catch(e){ return ''; } }
const nombreDe = m => m.iupac || m.name;

const FAM = {alcanos:'Alcano', alquenos:'Alqueno', alquinos:'Alquino', benceno:'Aromático', alcoholes:'Alcohol', eteres:'Éter',
  aldehidos:'Aldehído', cetonas:'Cetona', acidos:'Ácido carboxílico', esteres:'Éster', aminas:'Amina', amidas:'Amida', nitrilos:'Nitrilo'};
const FAM_TIT = {alcanos:'Alcanos', alquenos:'Alquenos', alquinos:'Alquinos', benceno:'Aromáticos', alcoholes:'Alcoholes', eteres:'Éteres',
  aldehidos:'Aldehídos', cetonas:'Cetonas', acidos:'Ácidos carboxílicos', esteres:'Ésteres', aminas:'Aminas', amidas:'Amidas', nitrilos:'Nitrilos'};
// Familias con las que se suele confundir cada una (distractores «cercanos»)
const FAM_CONF = {alcoholes:['eteres','aldehidos'], eteres:['alcoholes','esteres'], aldehidos:['cetonas','acidos'], cetonas:['aldehidos','esteres'],
  acidos:['esteres','aldehidos'], esteres:['acidos','eteres'], aminas:['amidas','nitrilos'], amidas:['aminas','acidos'], nitrilos:['aminas','amidas'],
  alquenos:['alquinos','alcanos'], alquinos:['alquenos','alcanos'], alcanos:['alquenos','alquinos'], benceno:['alquenos','alcanos']};
// Para «¿a qué familia pertenece?» se descartan moléculas con dos familias a
// la vez (nitrobenceno, benzaldehído, anilina, un éter con anillo bencénico…).
const DOS_FAMILIAS = m => m.topic === 'benceno' ? /nitro|aldeh|anilin|fenol|benzoic|amin|ol$|ona$|oico/.test(nombreDe(m)) : /benc|fenil|fenol|fen/.test(nombreDe(m));
// Nombres clásicos o funcionales: no se usan como distractores (podrían ser
// un nombre correcto de la misma molécula).
const CLASICO = /(^|\s)(éter|cetona)(\s|$)|\biso|\bsec-|\bterc-|^(di|tri)?(metil|etil|propil|butil|fenil)\s/;

// Errores típicos de un nombre IUPAC (los mismos del «cazar errores» del
// generador de guías): numerar desde el otro extremo, olvidar el orden
// alfabético, quitar di-/tri- o un localizador repetido.
const SUST = 'metil|etil|propil|isopropil|butil|cloro|bromo|yodo|fluoro|nitro|hidroxi|amino|oxo|metoxi|etoxi|fenil|vinil';
const RAIZ = {met:1, et:2, prop:3, but:4, pent:5, hex:6, hept:7, oct:8, non:9, dec:10};
function partesNombre(n){
  let pre = '', m = n.match(/^(ácido )(.*)$/); if(m){ pre = m[1]; n = m[2]; }
  const grupos = [], re = new RegExp('^(\\d+(?:,\\d+)*)-(di|tri|tetra)?(' + SUST + ')(-)?');
  while((m = n.match(re))){ grupos.push({loc:m[1], mul:m[2]||'', nom:m[3]}); n = n.slice(m[0].length); if(!m[4]) break; }
  return {pre, grupos, padre:n};
}
function armarNombre(o){
  const g = o.grupos.map(x => x.loc + '-' + x.mul + x.nom).join('-');
  return o.pre + (g ? g + (/^\d/.test(o.padre) ? '-' : '') : '') + o.padre;
}
function erroresDeNombre(nombre){
  const cands = [], add = t => { if(t && t !== nombre && cands.indexOf(t) < 0) cands.push(t); };
  const me = nombre.match(/^(met|et|prop|but|pent|hex)anoato de (met|et|prop|but|pent|hex)ilo$/);
  if(me){ if(me[1] !== me[2]) add(me[2] + 'anoato de ' + me[1] + 'ilo'); return cands; }
  if(/\s(de|éter|cetona)\s|\bN-|ciclo.*ciclo/.test(nombre)) return cands;
  const o = partesNombre(nombre); if(!o.padre) return cands;
  if(o.grupos.length >= 2 && o.grupos[0].nom !== o.grupos[1].nom){ const c = JSON.parse(JSON.stringify(o)); c.grupos.reverse(); add(armarNombre(c)); }
  o.grupos.forEach((g, i) => {
    if(!g.mul) return;
    const c = JSON.parse(JSON.stringify(o)); c.grupos[i].mul = ''; add(armarNombre(c));
    const ls = g.loc.split(','); if(ls.length === 2 && ls[0] === ls[1]){ const d = JSON.parse(JSON.stringify(o)); d.grupos[i].loc = ls[0]; add(armarNombre(d)); }
  });
  const mr = o.padre.match(/^(met|et|prop|but|pent|hex|hept|oct|non|dec)/);
  if(mr && !/ciclo|benceno|fenol|anilina|oato/.test(nombre)){
    const N = RAIZ[mr[1]]; let malo = false;
    const inv = nombre.replace(/\d+(?:,\d+)*/g, ls => ls.split(',').map(x => { const y = N + 1 - (+x); if(y < 1) malo = true; return y; }).sort((a, b) => a - b).join(','));
    if(!malo) add(inv);
  }
  // localizador corrido una posición (el grupo «se movió» de carbono)
  const m1 = nombre.match(/^(.*?)(\d+)(-(?:en|in|ol|ona|amina)o?|-ol$|-ona$)/);
  if(m1){ const k = +m1[2]; [k+1, k-1].forEach(x => { if(x >= 1) add(nombre.replace(m1[1] + m1[2] + m1[3], m1[1] + x + m1[3])); }); }
  return cands;
}

// ¿Este nombre es de una molécula del banco? (si un «error» resulta ser el
// nombre de otra molécula real, igual es incorrecto para ESTA estructura,
// pero se evita para no confundir; también se evita repetir la respuesta)
let _idx = null;
function indiceMols(){
  if(_idx && _idx.n === mols().length) return _idx;
  const porNombre = {}; mols().forEach(m => { porNombre[normNombre(nombreDe(m))] = m; });
  return (_idx = {n: mols().length, porNombre});
}

function poolNom(cfg){
  return mols().filter(m => cfg.fam.includes(m.topic) && figMol(m.key));
}
function genNom(forma, r, o){
  const c = pick(o.pool, r); if(!c) return null;
  const fo = figMol(c.key); if(!fo) return null;
  const nombre = nombreDe(c);
  if(forma === 'fam'){
    if(DOS_FAMILIAS(c)) return null;
    const fL = t => L(FAM[t], 'F:' + t);
    return {key:'fam' + c.key, qh:'¿A qué familia pertenece?', fo, foc:'mol', ft:'',
      ans: fL(c.topic), niveles:[(FAM_CONF[c.topic] || []).map(fL)], cands: Object.keys(FAM).filter(t => t !== c.topic).map(fL),
      more: rr => fL(pick(Object.keys(FAM), rr)), acepta: lab => lab.k === 'F:' + c.topic, fs:[]};
  }
  const nomL = n => L(esc(n), 'N:' + normNombre(n));
  const idx = indiceMols();
  const errores = erroresDeNombre(nombre).filter(n => !idx.porNombre[normNombre(n)]).map(nomL);
  const mismos = shuffle(mols().filter(m => m.topic === c.topic && m.key !== c.key && !CLASICO.test(nombreDe(m))), r);
  // nivel 2: misma familia y casi el mismo largo de nombre (cadena parecida)
  const largo = nombre.length;
  const n2 = mismos.filter(m => Math.abs(nombreDe(m).length - largo) <= 3).slice(0, 6).map(m => nomL(nombreDe(m)));
  return {key:'f2n' + c.key, qh:'Nombra según la IUPAC:', fo, foc:'mol', ft:'',
    ans: nomL(nombre), niveles:[errores, n2], cands: mismos.slice(0, 8).map(m => nomL(nombreDe(m))),
    more: rr => { const m = pick(mols().filter(x => !CLASICO.test(nombreDe(x))), rr); return m ? nomL(nombreDe(m)) : null; },
    acepta: lab => lab.k === 'N:' + normNombre(nombre), fs:[]};
}

// Preguntas de la Fase 1 e isomería (fundamentos.js) con respuestas que
// caben en el rótulo de una flecha.
const FUND_TIT = {hibridacion:'Átomo de carbono e hibridación', tipos_carbono:'Tipos de carbono', cadenas:'Clasificación de cadenas', isomeria:'Isomería'};
const sinHtml = s => String(s).replace(/<[^>]+>/g, '');
function poolFund(cfg){
  return (window.FUND_BANCO || []).filter(q => cfg.temas.includes(q.topic) && sinHtml(q.q).length <= 120 && q.opts.every(o => o.length <= 36));
}
function genFund(r, o){
  const q = pick(o.pool, r); if(!q) return null;
  const tL = t => L(esc(t), 'T:' + t);
  const fig = q.mol && window.FUND_FIG && window.FUND_FIG[q.mol] ? window.FUND_FIG[q.mol]() : '';
  return {key:'fund' + q.q, qh: q.q, qhc: (sinHtml(q.q).length > 60 || fig) ? 'sm' : '', fo: fig, foc:'mol', ft:'',
    ans: tL(q.ans), cands: q.opts.filter(x => x !== q.ans).map(tL), more: () => null,
    acepta: lab => lab.k === 'T:' + q.ans, fs:[]};
}

// Tipos de reacción (BANCO_RXN del Generador). Solo categorías con un tipo
// claro de bachillerato; las de nivel universitario (diazonio, Grignard,
// aldólica…) quedan fuera.
function tipoRx(cat){
  cat = String(cat || '');
  if(/^Adición/.test(cat)) return 'Adición';
  if(/^Sustitución|^SEA|^Síntesis de Williamson|^Ruptura de éteres/.test(cat)) return 'Sustitución';
  if(/^Eliminación|^Deshidratación \(alcoholes\)/.test(cat)) return 'Eliminación';
  if(/^Combustión/.test(cat)) return 'Combustión';
  if(/^Oxidación/.test(cat)) return 'Oxidación';
  if(/^Reducción/.test(cat)) return 'Reducción';
  if(/^Neutralización|^Sales de amonio/.test(cat)) return 'Neutralización';
  if(/^Saponificación|^Hidrólisis/.test(cat)) return 'Hidrólisis';
  if(/^Esterificación/.test(cat)) return 'Esterificación';
  if(/^Polimerización/.test(cat)) return 'Polimerización';
  return null;
}
const TIPOS_RX = ['Sustitución','Adición','Eliminación','Combustión','Oxidación','Reducción','Neutralización','Hidrólisis','Esterificación','Polimerización'];
// Otras respuestas también válidas: la combustión es una oxidación; la
// esterificación y la hidrólisis de ésteres son sustituciones (de acilo).
const RX_TAMBIEN = {Combustión:['Oxidación'], Esterificación:['Sustitución'], Hidrólisis:['Sustitución']};
const RX_CONF = {Sustitución:['Adición','Eliminación'], Adición:['Sustitución','Eliminación'], Eliminación:['Adición','Sustitución'],
  Combustión:['Reducción','Adición'], Oxidación:['Reducción','Combustión'], Reducción:['Oxidación','Adición'], Neutralización:['Hidrólisis','Esterificación'],
  Hidrólisis:['Esterificación','Neutralización'], Esterificación:['Hidrólisis','Neutralización'], Polimerización:['Adición','Eliminación']};
function productoDe(rx){ return String(rx.respuesta || '').split(/\s{2,}|\s\(|\s→/)[0].trim(); }
function poolRx(){
  // mismas exclusiones de nivel universitario que el generador de guías (docente-app.js)
  const FUERA = /diazo|aldólica|acetiluro|Acidez \(alquinos\)|Reducción \(alquinos\)|Grignard/i;
  return rxns().filter(x => x.pregunta_tipo === 'producto' && tipoRx(x.categoria) && x.nivel !== 'avanzado' && !FUERA.test(x.categoria || '') && productoDe(x) && !/^[a-záéíóúñ]/.test(productoDe(x)) && productoDe(x).length <= 60
    && !fxQuedanParentesis(x.r) && !fxQuedanParentesis(productoDe(x)));
}
// fórmula de texto → dibujada sin paréntesis (fx-libro.js)
const fxh = t => fxTexto(t) || esc(t);
function genRx(r, o){
  const x = pick(o.pool, r); if(!x) return null;
  const tipo = tipoRx(x.categoria), tL = t => L(t, 'R:' + t);
  const ok = [tipo].concat(RX_TAMBIEN[tipo] || []);
  const fo = '<span class="nw">' + fxh(x.r) + '</span> ' + (x.reactivo ? '<span class="nw">' + fxh(x.reactivo) + '</span> ' : '') + '→ <span class="nw">' + fxh(productoDe(x)) + '</span>';
  return {key:'rx' + x.key, qh:'¿Qué tipo de reacción es?', fo, foc:'eqx', ft: x.condicion ? esc(x.condicion) : '',
    ans: tL(tipo), niveles:[(RX_CONF[tipo] || []).map(tL)], cands: TIPOS_RX.map(tL),
    more: rr => tL(pick(TIPOS_RX, rr)), acepta: lab => ok.some(t => lab.k === 'R:' + t), fs:[]};
}

/* ───────────────────────── 7. Construcción del laberinto ───────────────────────── */
function pickD(q, k, r){
  // Distractores: clave distinta entre sí y de la respuesta, y que el
  // validador de la pregunta NO acepte (si lo acepta, sería una segunda
  // salida correcta).
  const seen = new Set([q.ans.k]), out = [];
  const sirve = c => c && !seen.has(c.k) && !q.acepta(c);
  // Primero los distractores «cercanos» a la pregunta (mismo elemento,
  // mismo anión, número de oxidación o subíndice cambiado, función con la
  // que se suele confundir); solo si faltan, el resto. Vale también para
  // las casillas trampa: todas sus salidas siguen siendo plausibles.
  // niveles: 1) mismo elemento/metal, 2) mismo anión con otro metal, 3) resto
  const niveles = q.niveles || [q.cercanos || [], q.cercanos2 || []];
  for(const c of [].concat(...niveles.map(nv => shuffle(nv.filter(Boolean), r)), shuffle(q.cands, r))){ if(sirve(c)){ seen.add(c.k); out.push(c); if(out.length >= k) return out; } }
  let g = 0;
  while(out.length < k && g++ < 300){ const c = q.more(r); if(sirve(c)){ seen.add(c.k); out.push(c); } }
  return out.length >= k ? out : null;
}

function intentar(cfg, seed){
  const r = makeRng(seed);
  const R = cfg.R, C = cfg.C, N = R*C, fin = N-1;
  const out = [];
  for(let u=0; u<N; u++){
    out[u] = []; if(u === fin) continue;
    const rr = Math.floor(u/C), cc = u % C;
    if(cc+1 < C) out[u].push({to:u+1, k:'h'});
    if(rr+1 < R) out[u].push({to:u+C, k:'v'});
    if(cc+1 < C && rr+1 < R) out[u].push({to:u+C+1, k:'d'});
  }
  const paths = [];
  (function dfs(u, p){ if(u === fin){ paths.push(p.slice()); return; } for(const e of out[u]){ p.push(e.to); dfs(e.to, p); p.pop(); } })(0, [0]);
  const maxE = (R-1) + (C-1);
  // cfg.paradas: ejercicios exactos en la ruta (casillas antes de FIN);
  // 0 = automático (rutas largas, para que haya que resolver casi todo).
  let cand = cfg.paradas ? paths.filter(p => p.length-1 === cfg.paradas) : paths.filter(p => p.length-1 >= maxE-1);
  if(!cand.length) cand = paths;
  const path = pick(cand, r), onPath = new Set(path);

  let gen, grupos;
  if(cfg.mode === 'nom'){
    const pool = poolNom(cfg);
    if(pool.length < Math.min(N-1, 8)) return {error:'Con estas familias solo hay ' + pool.length + ' moléculas dibujables en el banco para ' + (N-1) + ' casillas: marque más familias o elija un tamaño menor.'};
    grupos = cfg.forms.slice();
    const o = {pool};
    gen = g => genNom(g, r, o);
  } else if(cfg.mode === 'fund'){
    const o = {pool: poolFund(cfg)};
    if(o.pool.length < N-1) return {error:'Con estos temas hay ' + o.pool.length + ' preguntas cortas para ' + (N-1) + ' casillas: marque más temas o elija un tamaño menor.'};
    grupos = ['fund'];
    gen = () => genFund(r, o);
  } else {
    const o = {pool: poolRx()};
    if(o.pool.length < N-1) return {error:'Solo hay ' + o.pool.length + ' reacciones en el banco para ' + (N-1) + ' casillas: elija un tamaño menor.'};
    grupos = ['rx'];
    gen = () => genRx(r, o);
  }
  let seq = []; while(seq.length < N-1) seq = seq.concat(shuffle(grupos, r));
  seq = shuffle(seq.slice(0, N-1), r);

  const usados = new Set(), nodes = [], fs = new Set();
  for(let u=0; u<N-1; u++){
    const es = out[u].map(e => ({to:e.to, k:e.k}));
    let okIdx = -1;
    if(onPath.has(u)){ const nx = path[path.indexOf(u)+1]; okIdx = es.findIndex(e => e.to === nx); }
    else {
      // Casilla fuera de la ruta: su salida correcta (si la tiene) nunca
      // vuelve a una casilla de la ruta -- así, quien se equivocó no puede
      // "reengancharse" respondiendo bien y llegar a FIN por otro camino.
      const cs = es.map((e,i) => ({e,i})).filter(x => !onPath.has(x.e.to));
      if(cs.length && r() < .6) okIdx = pick(cs, r).i;
    }
    const k = es.length - (okIdx >= 0 ? 1 : 0);
    let q = null, ds = null;
    for(let t=0; t<60; t++){
      const g = seq[u];
      const cq = gen(t < 30 ? g : pick(grupos, r));
      if(!cq || usados.has(cq.key) || !cq.acepta(cq.ans)) continue;
      const d = pickD(cq, k, r);
      if(!d) continue;
      q = cq; ds = d; break;
    }
    if(!q) return null;
    usados.add(q.key); (q.fs||[]).forEach(f => fs.add(f));
    let di = 0;
    es.forEach((e,i) => { if(i === okIdx){ e.lab = q.ans; e.ok = true; } else { e.lab = ds[di++]; e.ok = false; } });
    nodes.push({u, letter:String.fromCharCode(65+u), q, edges:es, onPath:onPath.has(u)});
  }
  return {R, C, N, fin, path, nodes, fs:[...fs], seed};
}

// Verificación independiente del laberinto ya armado.
function verificar(mz){
  const errores = [];
  let checks = 0;
  mz.nodes.forEach(nd => {
    const ks = new Set();
    nd.edges.forEach(e => {
      checks++;
      if(ks.has(e.lab.k)) errores.push(nd.letter + ': dos salidas con el mismo rótulo');
      ks.add(e.lab.k);
      if(!!nd.q.acepta(e.lab) !== !!e.ok) errores.push(nd.letter + ': la salida «' + e.lab.k + '» ' + (e.ok ? 'no es correcta' : 'también sería correcta'));
    });
    const nOk = nd.edges.filter(e => e.ok).length;
    if(nOk > 1) errores.push(nd.letter + ': más de una salida correcta');
    if(nd.onPath && nOk !== 1) errores.push(nd.letter + ': casilla de la ruta sin salida correcta');
  });
  const siguiente = u => { const nd = mz.nodes[u]; if(!nd) return null; const e = nd.edges.find(x => x.ok); return e ? e.to : null; };
  // Desde A, solo respuestas correctas → debe ser exactamente la ruta de la clave
  const rec = [0]; let u = 0, g = 0;
  while(u !== mz.fin && u != null && g++ < mz.N){ u = siguiente(u); if(u != null) rec.push(u); }
  if(rec.join(',') !== mz.path.join(',')) errores.push('siguiendo respuestas correctas desde A no se recorre la ruta de la clave');
  // Desde cualquier casilla fuera de la ruta, respondiendo bien, nunca se llega a FIN
  const enRuta = new Set(mz.path);
  mz.nodes.filter(nd => !nd.onPath).forEach(nd => {
    let v = nd.u, h = 0;
    while(v != null && v !== mz.fin && h++ < mz.N){ v = siguiente(v); if(v != null && enRuta.has(v)){ errores.push(nd.letter + ': su salida correcta regresa a la ruta'); break; } }
    if(v === mz.fin) errores.push(nd.letter + ': llega a FIN por fuera de la ruta');
  });
  return {ok: !errores.length, errores, checks};
}

function construir(cfg, seed){
  let ultimo = null;
  for(let i=0; i<25; i++){
    const mz = intentar(cfg, i ? seed + '~' + i : seed);
    if(mz && mz.error) return mz;
    if(!mz) continue;
    const v = verificar(mz);
    mz.verif = v;
    if(v.ok) return mz;
    ultimo = mz;
  }
  return ultimo || {error:'No se pudo armar un laberinto con ruta única con estas opciones. Prueba otro tamaño o marca más contenidos.'};
}

/* ───────────────────────── 8. Hoja (HTML) ───────────────────────── */
const DEF = {nom:'Laberinto de nomenclatura', fund:'Laberinto del carbono', rx:'Laberinto de reacciones'};
const SUBT = {
  nom:'Resuelve cada casilla y sigue la flecha con la respuesta correcta hasta llegar a FIN.',
  fund:'Responde cada casilla y sigue la flecha con la respuesta correcta hasta llegar a FIN.',
  rx:'Clasifica cada reacción y sigue la flecha con su tipo hasta llegar a FIN.'
};
function claseLargo(h){
  const n = h.replace(/<[^>]+>/g,'').length;
  return n > 30 ? ' xl' : n > 18 ? ' lg' : '';
}

let _nHoja = 0;
// Punta de flecha de tamaño fijo (userSpaceOnUse): con markerUnits por
// defecto crecía con el grosor de la línea y salía gigante en Jugar/Clave.
// Una por color, para que la punta tome el color de la ruta.
const marcador = (id, color) => '<marker id="' + id + '" viewBox="0 0 10 10" refX="9" refY="5" markerUnits="userSpaceOnUse" markerWidth="15" markerHeight="15" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="' + color + '"/></marker>';
// Ecuación con cada sustancia sin partir: solo se salta de línea entre
// sustancias (antes quedaba «Fe +» / «CO» en renglones distintos).
const fmtEq = eq => '<span class="lf">' + esc(eq).split(' → ').map(lado => lado.split(' + ').map(m => '<span class="nw">' + m + '</span>').join(' + ')).join(' → ') + '</span>';
function hoja(mz, c, o){
  o = o || {};
  // id de la punta de flecha único por hoja: con varias hojas en el mismo
  // documento (pantalla + impresión), url(#id) apuntaba a la de la hoja
  // oculta y las flechas impresas salían sin punta.
  const mk = 'lab-flecha-' + (++_nHoja);
  let data = '';
  // Pie en dos franjas que no se cruzan: «Ruta seguida» + marca/licencia
  // arriba y, debajo, los datos (N_A, masas atómicas) o la leyenda de colores.
  // Clave: leyenda de colores. La ruta correcta va en VERDE (antes en rojo,
  // que en una hoja de examen se lee como «incorrecto»).
  if(o.key) data = '<span class="sley"><b>Clave</b> · <span class="sv">━ verde</span>: ruta correcta · <span class="sn">┅ punteado naranja</span>: respuesta correcta de una casilla trampa (no lleva a FIN)</span>' + (data ? '<br>' + data : '');
  const lineasData = !data ? 0 : (data.indexOf('<br>') >= 0 ? 2 : 1);
  const largo = true; // los nombres orgánicos y las respuestas de la Fase 1 son largos
  // GX amplio: el rótulo de una flecha horizontal no debe tapar su punta
  // (auditoría UX); el ancho extra no reduce la escala al imprimir, que la
  // limita el alto de la hoja.
  const G = {NW:210, NH:160, GX: largo ? 150 : 132, GY: largo ? 76 : 70, PX:30, TOP:160, BOT: 62 + lineasData*20};
  const maxW = {h: G.GX - 38, v: G.NW - 14, d: G.GX - 36};
  const {R, C, fin} = mz;
  const W = G.PX*2 + C*G.NW + (C-1)*G.GX, H = G.TOP + R*G.NH + (R-1)*G.GY + G.BOT;
  const P = u => ({x: G.PX + (u % C)*(G.NW + G.GX), y: G.TOP + Math.floor(u/C)*(G.NH + G.GY)});
  const M = u => { const p = P(u); return {x: p.x + G.NW/2, y: p.y + G.NH/2}; };
  const onE = new Set(); for(let i=0;i<mz.path.length-1;i++) onE.add(mz.path[i] + '-' + mz.path[i+1]);
  let lines = '', labels = '', nodes = '';
  mz.nodes.forEach(nd => {
    const a = M(nd.u);
    nd.edges.forEach(e => {
      const b = M(e.to), id = nd.u + '-' + e.to, on = onE.has(id);
      // Flecha: la línea termina antes del borde de la casilla destino
      const dx = b.x - a.x, dy = b.y - a.y, len = Math.hypot(dx, dy);
      const tx = e.k === 'h' ? G.NW/2 + 4 : e.k === 'v' ? G.NH/2 + 4 : Math.min((G.NW/2+4)/Math.abs(dx/len), (G.NH/2+4)/Math.abs(dy/len));
      const x2 = b.x - dx/len*tx, y2 = b.y - dy/len*tx;
      // El rótulo va en el 42 % del tramo libre contando desde la casilla de
      // ORIGEN (no en la mitad): así se lee como salida de esa casilla y no
      // como opción de la casilla a la que llega la flecha.
      const x1 = a.x + dx/len*tx, y1 = a.y + dy/len*tx;
      const lx = x1 + (x2 - x1)*0.42, ly = y1 + (y2 - y1)*0.42;
      lines += '<line class="ln' + (on ? ' on' : '') + '" data-e="' + id + '" data-mk="' + mk + '" x1="' + a.x + '" y1="' + a.y + '" x2="' + x2.toFixed(1) + '" y2="' + y2.toFixed(1) + '" marker-end="url(#' + mk + (on && o.key ? '-r' : '') + ')"/>';
      labels += '<button type="button" class="el ' + e.k + (on ? ' on' : '') + (e.ok ? ' good' : '') + claseLargo(e.lab.h) + '" data-e="' + id + '" data-u="' + nd.u + '" style="left:' + lx.toFixed(1) + 'px;top:' + ly.toFixed(1) + 'px;max-width:' + maxW[e.k] + 'px" tabindex="-1">' + e.lab.h + '</button>';
    });
    const p = P(nd.u), q = nd.q, cierra = q.qh.includes('¿') && !q.qh.includes('?') ? '<span class="qm">?</span>' : '';
    nodes += '<div class="node' + (nd.onPath ? ' onp' : '') + '" data-n="' + nd.u + '" style="left:' + p.x + 'px;top:' + p.y + 'px;width:' + G.NW + 'px;height:' + G.NH + 'px">'
      + '<span class="badge">' + nd.letter + '</span><div class="q' + (q.qhc ? ' ' + q.qhc : '') + '">' + q.qh + '</div>'
      + (q.fo ? '<div class="fo ' + (q.foc||'') + '">' + q.fo + cierra + '</div>' : '')
      + (q.ft ? '<div class="ft">' + q.ft + '</div>' : '') + '</div>';
  });
  const pf = P(fin);
  nodes += '<div class="node fin" data-n="' + fin + '" style="left:' + pf.x + 'px;top:' + pf.y + 'px;width:' + G.NW + 'px;height:' + G.NH + 'px"><div class="flag">🏁</div><div class="finw">FIN</div></div>';

  const titulo = esc(c.title);
  const el = document.createElement('div');
  el.className = 'lab-sheet' + (o.key ? ' key' : '') + (o.play ? ' play' : '') + (c.color ? '' : ' nocolor');
  el.style.width = W + 'px'; el.style.height = H + 'px';
  el.innerHTML =
    '<img class="wm" src="icons/marca-agua.png" alt="" aria-hidden="true">'
    + '<div class="shead' + (W < 1150 ? ' angosta' : '') + '">'
    +   '<img class="slogo" src="logo-chromanom.png" alt="ChromaNom">'
    // tamaño del título según el ancho REAL de la hoja (en 3×3 se cortaba)
    +   '<div class="stit"><div class="title' + (W < 1150 || c.title.length > 26 ? ' sm' : '') + (W < 1150 && c.title.length > 26 ? ' xs' : '') + '">' + titulo + '</div><div class="sub">' + SUBT[c.mode] + '</div></div>'
    +   '<div class="sver">' + esc(o.label || '') + '</div>'
    + '</div>'
    + '<div class="sform"><span>Nombre: <i class="w-nom"></i></span><span>Curso: <i class="w-cur"></i></span><span>Fecha: <i class="w-fec"></i></span></div>'
    + '<svg class="lines" width="' + W + '" height="' + H + '"><defs>' + marcador(mk, '#5b7389') + marcador(mk + '-r', '#15803d') + marcador(mk + '-g', '#16a34a') + '</defs>' + lines + '</svg>'
    + nodes + labels
    + '<div class="sfoot" style="top:' + (H - G.BOT + 8) + 'px"><div class="fields">Ruta seguida: <i></i></div><div class="smark">Chroma<b>Nom</b> · Nomenclatura orgánica<span class="slic">© 2026 Harvey Barcenas Morales · Licencia CC BY-NC 4.0</span></div></div>'
    + (data ? '<div class="sdata" style="top:' + (H - G.BOT + 52) + 'px">' + data + '</div>' : '');
  return {el, W, H};
}

function tablaClave(mz, desde, hasta){
  let h = '<table class="lab-kt"><thead><tr><th>Casilla</th><th>Ejercicio</th><th>Respuesta correcta</th><th>Sigue a</th></tr></thead><tbody>';
  mz.nodes.slice(desde || 0, hasta == null ? mz.nodes.length : hasta).forEach(nd => {
    const e = nd.edges.find(x => x.ok);
    const dest = e ? (e.to === mz.fin ? 'FIN' : String.fromCharCode(65 + e.to)) : '— (trampa: no hay salida)';
    h += '<tr class="' + (nd.onPath ? 'main' : '') + '"><td>' + nd.letter + (nd.onPath ? ' ★' : '') + '</td><td>' + nd.q.qh + ' ' + (nd.q.foc === 'mol' ? '' : (nd.q.fo || '')) + // los dibujos ya están en el laberinto: la tabla queda corta
       (nd.q.qh.includes('¿') && !nd.q.qh.includes('?') ? '?' : '') + '</td><td>' + nd.q.ans.h + '</td><td>' + dest + '</td></tr>';
  });
  return h + '</tbody></table>';
}
const textoRuta = mz => mz.path.map(u => u === mz.fin ? 'FIN' : mz.nodes[u].letter).join(' → ');

/* ───────────────────────── 9. Interfaz ───────────────────────── */
const $ = s => document.querySelector(s), $$ = s => [...document.querySelectorAll(s)];
let vista = 'sheet', curMz = null, curCfg = null, curSheet = null, juego = null, listo = false;

// Hasta 40 versiones: una por estudiante en un curso completo (antes el
// tope era 8 y pedir 23 dejaba 8 sin avisar).
const MAX_VERSIONES = 40;
const rndSeed = () => Math.random().toString(36).slice(2, 6);
const seedOf = (c, i) => c.seed + '-' + (i+1);

function getCfg(){
  const mode = ($('input[name="lab-mode"]:checked') || {}).value || 'nom';
  const [C, R] = $('#lab-size').value.split('x').map(Number);
  const c = {mode, R, C, title: $('#lab-title').value.trim() || DEF[mode], seed: $('#lab-seed').value.trim().replace(/-\d+$/, '') || 'chromanom',
    nver: Math.max(1, Math.min(MAX_VERSIONES, parseInt($('#lab-nver').value, 10) || 1)),
    paradas: parseInt($('#lab-paradas').value, 10) || 0};
  if(mode === 'nom'){
    c.forms = $$('#lab-fs-forma input:checked').map(x => x.value);
    c.fam = $$('#lab-fs-fam input:checked').map(x => x.value);
    if(!c.forms.length) c.vacio = 'Marque al menos un tipo de pregunta.';
    if(!c.fam.length) c.vacio = 'Marque al menos una familia de compuestos.';
  }
  if(mode === 'fund'){ c.temas = $$('#lab-fs-fund input:checked').map(x => x.value); if(!c.temas.length) c.vacio = 'Marque al menos un tema.'; }
  return c;
}

// Rango de ejercicios en la ruta según el tamaño: con pasos a la derecha,
// abajo o en diagonal, de A a FIN hay entre max(C,R)−1 y (C−1)+(R−1).
function rangoParadas(C, R){ return [Math.max(C, R) - 1, (C - 1) + (R - 1)]; }
function llenarParadas(){
  const sel = $('#lab-paradas'), prev = sel.value;
  const [C, R] = $('#lab-size').value.split('x').map(Number), [a, b] = rangoParadas(C, R);
  let h = '<option value="0">Automático (' + (b - 1) + ' o ' + b + ')</option>';
  for(let k = a; k <= b; k++) h += '<option value="' + k + '">' + k + ' ejercicios</option>';
  sel.innerHTML = h;
  sel.value = (+prev >= a && +prev <= b) ? prev : '0';
}

// Casillas de familias (se arman con los temas del Generador) y conteos.
function contarFamilias(){
  const box = $('#lab-fs-fam');
  if(box && !box.children.length){
    const PRE = ['alcanos','alquenos','alcoholes','aldehidos','cetonas','acidos'];
    box.innerHTML = Object.keys(FAM_TIT).map(t => '<label class="opt"><input type="checkbox" value="' + t + '"' + (PRE.includes(t) ? ' checked' : '') + '> <span><b>' + FAM_TIT[t] + '</b><small></small></span></label>').join('');
    box.querySelectorAll('input').forEach(x => x.addEventListener('change', render));
  }
  $$('#lab-fs-fam label').forEach(l => { const t = l.querySelector('input').value, sm = l.querySelector('small'); if(sm) sm.textContent = mols().filter(m => m.topic === t).length + ' moléculas'; });
  $$('#lab-fs-fund label').forEach(l => { const t = l.querySelector('input').value, sm = l.querySelector('small'); if(sm) sm.textContent = poolFund({temas:[t]}).length + ' preguntas cortas'; });
  const ri = $('#lab-rx-info'); if(ri) ri.textContent = poolRx().length + ' reacciones del banco: ' + TIPOS_RX.join(', ').toLowerCase() + '.';
}

function render(){
  if(!listo) return;
  const c = getCfg(), vi = Math.min(+$('#lab-vsel').value || 0, c.nver - 1);
  const mz = c.vacio ? {error: c.vacio} : construir(c, seedOf(c, vi));
  curCfg = c;
  const stage = $('#lab-stage'); stage.innerHTML = '';
  $('#lab-keybox').innerHTML = '';
  if(mz.error){
    curMz = null; curSheet = null;
    $('#lab-status').textContent = '⚠️ ' + mz.error;
    $('#lab-verif').className = 'lab-verif bad'; $('#lab-verif').textContent = '';
    $('#lab-card').hidden = true;
    return;
  }
  curMz = mz;
  juego = {cur:0, errors:0, t0:0, path:[0], done:false};
  const sh = hoja(mz, c, {key: vista === 'key', play: vista === 'play', label: vista === 'key' ? 'Clave · código ' + c.seed + ' · versión ' + (vi+1) : 'Versión ' + (vi+1) + ' de ' + c.nver});
  curSheet = sh;
  const w = document.createElement('div'); w.className = 'lab-scaled'; w.appendChild(sh.el); stage.appendChild(w);
  ajustar();
  const v = $('#lab-verif');
  if(mz.verif && mz.verif.ok){ v.className = 'lab-verif ok'; v.textContent = '✔ Ruta única verificada · ' + (mz.path.length - 1) + ' ejercicios hasta FIN · ' + mz.verif.checks + ' salidas revisadas'; }
  else { v.className = 'lab-verif bad'; v.textContent = '⚠️ ' + ((mz.verif && mz.verif.errores[0]) || 'No se pudo verificar'); }
  if(vista === 'key') $('#lab-keybox').innerHTML = '<p class="lab-ruta"><b>Ruta correcta:</b> ' + textoRuta(mz) + ' &nbsp;·&nbsp; <span style="color:var(--dimmer)">código para volver a generar estas hojas: <b>' + esc(c.seed) + '</b></span></p>' + tablaClave(mz);
  $('#lab-routebox').style.display = vista === 'play' ? 'none' : '';
  $('#lab-routemsg').textContent = '';
  $('#lab-fs-btn').style.display = vista === 'play' ? '' : 'none';
  $('#lab-restart2').style.display = vista === 'play' ? '' : 'none';
  if(vista === 'play') pintarJuego();
  else $('#lab-status').textContent = vista === 'key'
    ? 'Clave: la ruta correcta va en verde; las salidas punteadas naranja son la respuesta correcta de las casillas trampa (llevan a otra trampa, nunca a FIN).'
    : 'Hoja del estudiante. Imprímala o proyéctela; con «Jugar» se resuelve en pantalla.';
}

// Celular o tableta pequeña (pantalla táctil de menos de 820 px en su lado corto)
const esMovil = () => !!(window.matchMedia && matchMedia('(pointer: coarse)').matches) && Math.min(screen.width, screen.height) < 820;
function ajustar(){
  if(!curSheet) return;
  const stage = $('#lab-stage'), wrap = $('#lab-playwrap'), card = $('#lab-card');
  const fs = esPantallaCompleta();
  if(wrap.clientWidth <= 0) return; // pestaña oculta: se reajusta al mostrarla
  // Tarjeta de juego (casilla actual + salidas como botones grandes):
  // - en pantallas angostas (celular/tableta vertical) la hoja entera queda
  //   ilegible para jugar, así que la tarjeta va arriba y la hoja debajo
  //   como mapa;
  // - en pantalla completa con el celular en horizontal, la tarjeta va a la
  //   izquierda y el mapa a la derecha (el alto es muy poco para apilarlos).
  const apaisado = fs && window.innerWidth > window.innerHeight && window.innerHeight < 600;
  const conTarjeta = vista === 'play' && !!curMz && (wrap.clientWidth < 760 || apaisado);
  card.hidden = !conTarjeta;
  wrap.classList.toggle('con-tarjeta', conTarjeta);
  wrap.classList.toggle('lado', conTarjeta && apaisado);
  if(conTarjeta) pintarTarjeta();
  avisoGirar();
  const availW = stage.clientWidth - 4;
  if(availW <= 0) return;
  let s = Math.min(1, availW / curSheet.W);
  if(fs){
    const availH = window.innerHeight - (stage.getBoundingClientRect().top - wrap.getBoundingClientRect().top) - 16;
    s = Math.max(0.2, Math.min(availW / curSheet.W, availH / curSheet.H));
  }
  const w = curSheet.el.parentNode;
  w.style.width = curSheet.W*s + 'px'; w.style.height = curSheet.H*s + 'px';
  curSheet.el.style.transform = 'scale(' + s + ')';
}
// En iPhone (y si el navegador no deja bloquear la orientación) se pide al
// estudiante que gire el celular; el aviso se quita solo al girarlo.
function avisoGirar(){
  const g = $('#lab-girar');
  const vertical = window.innerHeight > window.innerWidth;
  g.hidden = !(esPantallaCompleta() && esMovil() && vertical && !g.dataset.cerrado);
}

/* ----- jugar ----- */
function pintarJuego(){
  const st = $('#lab-stage');
  st.querySelectorAll('.node').forEach(n => n.classList.remove('visited','cur'));
  juego.path.forEach(u => { const n = st.querySelector('.node[data-n="' + u + '"]'); if(n) n.classList.add('visited'); });
  const cur = st.querySelector('.node[data-n="' + juego.cur + '"]'); if(cur) cur.classList.add('cur');
  const taken = new Set(); for(let i=0;i<juego.path.length-1;i++) taken.add(juego.path[i] + '-' + juego.path[i+1]);
  st.querySelectorAll('.el').forEach(b => {
    const hot = !juego.done && +b.dataset.u === juego.cur;
    b.classList.toggle('hot', hot); b.tabIndex = hot ? 0 : -1;
    b.classList.toggle('taken', taken.has(b.dataset.e));
  });
  st.querySelectorAll('.ln').forEach(l => {
    const t = taken.has(l.dataset.e);
    l.classList.toggle('trav', t);
    l.setAttribute('marker-end', 'url(#' + l.dataset.mk + (t ? '-g' : '') + ')');
  });
  if(!$('#lab-card').hidden) pintarTarjeta();
  let msg;
  if(juego.done){
    const s = Math.round((Date.now() - juego.t0)/1000);
    msg = '🏁 ¡Llegaste a FIN! Errores: ' + juego.errors + ' · Tiempo: ' + Math.floor(s/60) + ':' + String(s%60).padStart(2,'0');
  } else msg = 'Estás en la casilla ' + curMz.nodes[juego.cur].letter + '. Resuelve y toca la salida con tu resultado. Errores: ' + juego.errors;
  $('#lab-status').textContent = msg;
  $('#lab-play-msg').textContent = msg;
}
const FLECHA = {h:'→', v:'↓', d:'↘'};
function pintarTarjeta(){
  const card = $('#lab-card');
  if(!curMz || !juego) return;
  if(juego.done){
    card.innerHTML = '<div class="lc-fin">🏁 ¡Llegaste a FIN!</div><button type="button" class="lab-op lc-re" data-accion="reiniciar">↺ Jugar otra vez</button>';
    return;
  }
  const nd = curMz.nodes[juego.cur], q = nd.q;
  const cierra = q.qh.includes('¿') && !q.qh.includes('?') ? '?' : '';
  card.innerHTML = '<div class="lc-head"><span class="lc-badge">' + nd.letter + '</span><span>Casilla ' + nd.letter + ' · errores: ' + juego.errors + '</span></div>'
    + '<div class="lc-q">' + q.qh + '</div>'
    + (q.fo ? '<div class="lc-fo">' + q.fo + cierra + '</div>' : '')
    + (q.ft ? '<div class="lc-ft">' + q.ft + '</div>' : '')
    + '<div class="lc-ops">' + nd.edges.map(e => '<button type="button" class="lab-op" data-e="' + nd.u + '-' + e.to + '" data-u="' + nd.u + '"><span class="lc-dir" aria-hidden="true">' + FLECHA[e.k] + '</span><span>' + e.lab.h + '</span></button>').join('') + '</div>';
}
function clicJuego(ev){
  if(vista !== 'play' || !juego || !curMz) return;
  if(ev.target.closest('[data-accion="reiniciar"]')){ reiniciarJuego(); return; }
  if(juego.done || juego.pausa) return;
  const b = ev.target.closest('.el, .lab-op'); if(!b || !b.dataset.e) return;
  const u = +b.dataset.u; if(u !== juego.cur) return;
  const v = +b.dataset.e.split('-')[1];
  const e = curMz.nodes[u].edges.find(x => x.to === v);
  if(!e) return;
  if(!juego.t0) juego.t0 = Date.now();
  const desdeTarjeta = b.classList.contains('lab-op');
  if(e.ok){
    juego.cur = v; juego.path.push(v); if(v === curMz.fin) juego.done = true;
    if(desdeTarjeta){
      // en la tarjeta el acierto se ve en verde un instante antes de pasar de casilla
      const j = juego; j.pausa = true; b.classList.add('good');
      setTimeout(() => { if(juego !== j) return; j.pausa = false; pintarJuego(); const s = $('#lab-card .lab-op'); if(s) s.focus(); }, 450);
      return;
    }
    pintarJuego();
    // el foco pasa a la primera salida de la nueva casilla (teclado)
    const sig = desdeTarjeta ? $('#lab-card .lab-op') : $('#lab-stage .el.hot');
    if(sig) sig.focus();
  } else {
    juego.errors++; pintarJuego();
    const mal = desdeTarjeta ? $('#lab-card .lab-op[data-e="' + b.dataset.e + '"]') : b;
    const enHoja = $('#lab-stage .el[data-e="' + b.dataset.e + '"]');
    [mal, enHoja].forEach(x => { if(x){ x.classList.remove('bad'); void x.offsetWidth; x.classList.add('bad'); } });
    if(mal && desdeTarjeta) mal.focus();
  }
}
function reiniciarJuego(){
  if(!curMz) return;
  juego = {cur:0, errors:0, t0:0, path:[0], done:false};
  $$('#lab-stage .el.bad, #lab-card .bad').forEach(b => b.classList.remove('bad'));
  pintarJuego();
}

/* ----- pantalla completa ----- */
function esPantallaCompleta(){
  const w = $('#lab-playwrap');
  return !!w && (document.fullscreenElement === w || document.webkitFullscreenElement === w || w.classList.contains('pseudo-fs'));
}
function entrarPantallaCompleta(){
  const w = $('#lab-playwrap');
  const req = w.requestFullscreen || w.webkitRequestFullscreen;
  w.classList.add('fs-on');
  if(req){
    try{
      const p = req.call(w);
      if(p && p.catch) p.catch(() => { w.classList.add('pseudo-fs'); document.body.style.overflow = 'hidden'; ajustar(); });
    }catch(e){ w.classList.add('pseudo-fs'); document.body.style.overflow = 'hidden'; }
  } else { w.classList.add('pseudo-fs'); document.body.style.overflow = 'hidden'; } // iPhone: sin API de pantalla completa
  delete $('#lab-girar').dataset.cerrado;
  // En celular se gira a horizontal. screen.orientation.lock solo funciona
  // con la pantalla completa ya activa (Android/Chrome); en iPhone no
  // existe y queda el aviso «Gira tu celular».
  if(esMovil()) setTimeout(() => {
    try{
      const o = screen.orientation;
      if(o && o.lock && (document.fullscreenElement || document.webkitFullscreenElement)) o.lock('landscape').catch(() => {}).then(() => setTimeout(ajustar, 120));
    }catch(e){}
  }, 250);
  setTimeout(ajustar, 60);
}
function salirPantallaCompleta(){
  const w = $('#lab-playwrap');
  if(document.fullscreenElement || document.webkitFullscreenElement){ (document.exitFullscreen || document.webkitExitFullscreen).call(document); }
  w.classList.remove('pseudo-fs', 'fs-on'); document.body.style.overflow = '';
  try{ if(screen.orientation && screen.orientation.unlock) screen.orientation.unlock(); }catch(e){}
  setTimeout(ajustar, 60);
}
function cambioPantallaCompleta(){
  const w = $('#lab-playwrap');
  if(!(document.fullscreenElement || document.webkitFullscreenElement) && !w.classList.contains('pseudo-fs')) w.classList.remove('fs-on');
  setTimeout(ajustar, 60);
}

/* ----- verificar ruta del estudiante ----- */
function comprobarRuta(){
  if(!curMz) return;
  const t = ($('#lab-routein').value.toUpperCase().replace(/FIN/g, ' ').match(/[A-Z]/g)) || [];
  const clave = curMz.path.filter(u => u !== curMz.fin).map(u => curMz.nodes[u].letter);
  const m = $('#lab-routemsg');
  if(!t.length){ m.textContent = 'Escriba la ruta, p. ej. ' + clave.slice(0, 3).join(' ') + '…'; m.style.color = 'var(--dimmer)'; return; }
  if(t.join('') === clave.join('')){ m.textContent = '✔ Ruta correcta'; m.style.color = 'var(--ok-t)'; return; }
  let i = 0; while(i < t.length && i < clave.length && t[i] === clave[i]) i++;
  m.textContent = i >= clave.length ? '✖ Sobran casillas después del paso ' + clave.length
    : i >= t.length ? '✖ Ruta incompleta: faltan casillas desde el paso ' + (i+1)
    : '✖ La ruta no coincide (primer desvío en el paso ' + (i+1) + ')';
  m.style.color = 'var(--err-t)';
}

/* ----- imprimir ----- */
function esperarImagenes(root){
  return Promise.all([...root.querySelectorAll('img')].map(img => img.complete ? Promise.resolve() :
    new Promise(res => { img.addEventListener('load', res, {once:true}); img.addEventListener('error', res, {once:true}); })));
}
// Para imprimir se reduce con `zoom` y no con transform: el motor de
// impresión de Chrome pagina con el tamaño SIN transformar y recortaba la
// hoja (en 4×4 se perdía la última fila). Respaldo con transform solo si
// el navegador no soporta zoom.
const ZOOM_OK = !!(window.CSS && CSS.supports && CSS.supports('zoom', '0.5'));
function envolver(sh, s){
  const w = document.createElement('div'); w.className = 'lab-scaled';
  w.style.width = sh.W*s + 'px'; w.style.height = sh.H*s + 'px';
  if(ZOOM_OK) sh.el.style.zoom = s; else sh.el.style.transform = 'scale(' + s + ')';
  w.appendChild(sh.el); return w;
}
// Área imprimible de una carta horizontal con márgenes de 0,3 in:
// 10,4 × 7,9 in = 998 × 758 px (a 96 px/in). Se deja un pequeño respiro
// para que ningún navegador empuje la hoja a una segunda página.
const PAG_W = 990, PAG_H = 740;
function prepararImpresion(){
  if(!listo) return false;
  const c = getCfg(), root = $('#lab-print-root'); root.innerHTML = '';
  const mzs = [];
  for(let i=0; i<c.nver; i++){
    const mz = construir(c, seedOf(c, i));
    if(mz.error){ $('#lab-status').textContent = '⚠️ ' + mz.error; root.innerHTML = ''; return false; }
    mzs.push(mz);
    const sh = hoja(mz, c, {label: 'Versión ' + (i+1) + ' de ' + c.nver});
    // escala para que quepa TODO el laberinto (se agranda si sobra espacio)
    const s = Math.min(1.25, PAG_W/sh.W, PAG_H/sh.H);
    const pp = document.createElement('div'); pp.className = 'lab-pp'; pp.appendChild(envolver(sh, s)); root.appendChild(pp);
  }
  if($('#lab-withkeys').checked){
    mzs.forEach((mz, i) => {
      const sh = hoja(mz, c, {key:true, label: 'Clave · código ' + c.seed + ' · versión ' + (i+1)});
      const cab = extra => '<div class="kh"><img src="logo-chromanom.png" alt="ChromaNom"><span><b>CLAVE — Versión ' + (i+1) + '</b>' + extra + ' · código ' + esc(c.seed) + ' · Ruta: <b>' + textoRuta(mz) + '</b></span></div><div class="kb"></div>';
      const pp = document.createElement('div'); pp.className = 'lab-pp keypage';
      // Hasta 4×4 (15 casillas) la tabla cabe al lado del laberinto. En 5×4
      // y 5×5 no cabe: el laberinto va en su propia página y la tabla en la
      // siguiente, repartida en dos columnas.
      const aparte = mz.nodes.length > 15;
      pp.innerHTML = cab('');
      const kb = pp.querySelector('.kb');
      if(!aparte){
        kb.appendChild(envolver(sh, Math.min(640/sh.W, (PAG_H - 40)/sh.H)));
        const tw = document.createElement('div'); tw.className = 'kt-wrap'; tw.innerHTML = tablaClave(mz); kb.appendChild(tw);
        root.appendChild(pp);
        return;
      }
      kb.classList.add('sola'); kb.appendChild(envolver(sh, Math.min(PAG_W/sh.W, (PAG_H - 44)/sh.H)));
      root.appendChild(pp);
      const pt = document.createElement('div'); pt.className = 'lab-pp keypage';
      pt.innerHTML = cab(' · tabla de respuestas');
      const mitad = Math.ceil(mz.nodes.length / 2), kt = pt.querySelector('.kb');
      [[0, mitad], [mitad, mz.nodes.length]].forEach(([a, b]) => { const tw = document.createElement('div'); tw.className = 'kt-wrap'; tw.innerHTML = tablaClave(mz, a, b); kt.appendChild(tw); });
      root.appendChild(pt);
    });
  }
  // docente.html imprime sus guías en carta VERTICAL (@page global). Las
  // hojas del laberinto usan además la página con nombre «lab» (ver
  // docente.html: @page lab{size:letter landscape}) y, como respaldo para
  // navegadores sin páginas con nombre, un @page horizontal agregado al
  // final del <head> solo mientras dura esta impresión (el último gana).
  let pg = document.getElementById('lab-page-style');
  if(!pg){ pg = document.createElement('style'); pg.id = 'lab-page-style'; document.head.appendChild(pg); }
  pg.textContent = '@page{size:letter landscape;margin:.3in!important}';
  const pgGuias = document.getElementById('estilo-pagina-guias'); if(pgGuias) pgGuias.media = 'not all';
  document.body.classList.add('lab-printing');
  return true;
}
function imprimir(){
  if(!prepararImpresion()) return;
  esperarImagenes($('#lab-print-root')).then(() => setTimeout(() => window.print(), 120));
}
// Ctrl+P / menú del navegador estando en la pestaña Laberintos: se arma la
// misma impresión (horizontal, todas las versiones) en vez de imprimir la
// página con los controles.
function antesDeImprimir(){
  if(document.body.classList.contains('lab-printing')) return;
  const tab = document.getElementById('panel-lab');
  if(tab && !tab.hidden) prepararImpresion();
}
function finImpresion(){
  if(!document.body.classList.contains('lab-printing')) return;
  document.body.classList.remove('lab-printing');
  $('#lab-print-root').innerHTML = '';
  const pg = document.getElementById('lab-page-style'); if(pg) pg.remove();
  const pgGuias = document.getElementById('estilo-pagina-guias'); if(pgGuias) pgGuias.media = '';
}

/* ----- controles ----- */
function llenarVersiones(){
  const n = Math.max(1, Math.min(MAX_VERSIONES, parseInt($('#lab-nver').value, 10) || 1)), sel = $('#lab-vsel'), keep = +sel.value || 0;
  $('#lab-nver').value = n; // muestra el valor real usado (1 a MAX_VERSIONES)
  sel.innerHTML = ''; for(let i=0;i<n;i++) sel.insertAdjacentHTML('beforeend', '<option value="' + i + '">Versión ' + (i+1) + '</option>');
  sel.value = String(Math.min(keep, n-1));
}
function cambiarModo(){
  const m = getCfg().mode;
  $('#lab-app').dataset.mode = m;
  const t = $('#lab-title');
  if(!t.value || Object.values(DEF).includes(t.value)) t.value = DEF[m];
}

function init(){
  if(!$('#lab-app')) return;
  $('#lab-seed').value = rndSeed();
  llenarVersiones(); llenarParadas(); cambiarModo();
  $$('input[name="lab-mode"]').forEach(x => x.addEventListener('change', () => { cambiarModo(); render(); }));
  $('#lab-size').addEventListener('change', llenarParadas);
  ['#lab-size','#lab-paradas','#lab-vsel'].forEach(s => $(s).addEventListener('change', render));
  let tmr = null;
  ['#lab-title','#lab-seed'].forEach(s => $(s).addEventListener('input', () => { clearTimeout(tmr); tmr = setTimeout(render, 250); }));
  $$('#lab-fs-forma input, #lab-fs-fund input').forEach(x => x.addEventListener('change', render));
  $('#lab-nver').addEventListener('change', () => { llenarVersiones(); render(); });
  $('#lab-btn-seed').addEventListener('click', () => { $('#lab-seed').value = rndSeed(); render(); });
  $$('#lab-seg button').forEach(b => b.addEventListener('click', () => {
    vista = b.dataset.view; $$('#lab-seg button').forEach(x => { x.classList.toggle('on', x === b); x.setAttribute('aria-pressed', x === b ? 'true' : 'false'); });
    if(vista !== 'play' && esPantallaCompleta()) salirPantallaCompleta();
    render();
  }));
  $('#lab-btn-print').addEventListener('click', imprimir);
  $('#lab-stage').addEventListener('click', clicJuego);
  $('#lab-routebtn').addEventListener('click', comprobarRuta);
  $('#lab-routein').addEventListener('keydown', e => { if(e.key === 'Enter') comprobarRuta(); });
  $('#lab-fs-btn').addEventListener('click', entrarPantallaCompleta);
  $('#lab-fs-exit').addEventListener('click', salirPantallaCompleta);
  $('#lab-restart').addEventListener('click', reiniciarJuego);
  $('#lab-restart2').addEventListener('click', reiniciarJuego);
  $('#lab-card').addEventListener('click', clicJuego);
  $('#lab-girar-ok').addEventListener('click', () => { $('#lab-girar').dataset.cerrado = '1'; avisoGirar(); });
  window.addEventListener('orientationchange', () => setTimeout(ajustar, 150));
  document.addEventListener('fullscreenchange', cambioPantallaCompleta);
  document.addEventListener('webkitfullscreenchange', cambioPantallaCompleta);
  document.addEventListener('keydown', e => { if(e.key === 'Escape' && $('#lab-playwrap').classList.contains('pseudo-fs')) salirPantallaCompleta(); });
  window.addEventListener('resize', ajustar);
  window.addEventListener('beforeprint', antesDeImprimir);
  window.addEventListener('afterprint', finImpresion);
  if(window.matchMedia){ const mq = window.matchMedia('print'); const f = e => { if(!e.matches) finImpresion(); }; mq.addEventListener ? mq.addEventListener('change', f) : mq.addListener && mq.addListener(f); }

  // Esperar a que docente-app.js termine de leer los bancos (moléculas y
  // reacciones del Generador). Las preguntas de la Fase 1 ya están.
  const arrancar = () => { if(listo) return; listo = true; _idx = null; contarFamilias(); render(); };
  if(window.DOCENTE_BANCOS) arrancar();
  else {
    document.addEventListener('docente-bancos-listos', arrancar, {once:true});
    setTimeout(arrancar, 15000); // si el Generador nunca responde, al menos funciona la Fase 1
  }
}

window.LABERINTO = {render, ajustar, construir, verificar, getCfg, _interno: {intentar, genNom, genFund, genRx, erroresDeNombre, poolNom, poolFund, poolRx}};
document.addEventListener('DOMContentLoaded', init);
})();
