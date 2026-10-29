/* ════════════════════════════════════════════════════════════════════════
   crucigrama.js — pestaña «Crucigramas» del generador docente (docente.html)
   Adaptado del generador de crucigramas de IonNom a la química orgánica:
   - Fórmula → nombre: compuestos del Generador sin localizadores (en las
     casillas no van números), con la fórmula semidesarrollada en una línea.
   - Grupos funcionales, prefijos y terminaciones.
   - Glosarios de la Fase 1 «El carbono», de isomería y de reacciones.
   Igual que en IonNom se verifica cada crucigrama: todas las palabras
   conectadas, ninguna palabra «accidental» formada al cruzarse y respuestas
   sin repetir. Semilla reproducible y hasta 40 versiones.
   ════════════════════════════════════════════════════════════════════════ */
(function(){
'use strict';

/* ───────────── utilidades ───────────── */
const $ = s => document.querySelector(s), $$ = s => [...document.querySelectorAll(s)];
const esc = s => String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
const cap = s => s ? s.charAt(0).toUpperCase() + s.slice(1) : s;
const SUB_A = {'₀':'0','₁':'1','₂':'2','₃':'3','₄':'4','₅':'5','₆':'6','₇':'7','₈':'8','₉':'9'};
const aAscii = f => String(f).replace(/[₀-₉]/g, c => SUB_A[c]);
const aSub = f => String(f).replace(/([A-Za-z)])(\d+)/g, (m, a, d) => a + d.split('').map(x => '₀₁₂₃₄₅₆₇₈₉'[x]).join(''));
const SUP = {'0':'⁰','1':'¹','2':'²','3':'³','4':'⁴','5':'⁵','6':'⁶','7':'⁷','8':'⁸','9':'⁹','+':'⁺','-':'⁻'};
const sup = s => String(s).split('').map(c => SUP[c] || c).join('');
// Respuesta del crucigrama: mayúsculas, sin tildes ni espacios ni signos;
// la Ñ se conserva (es una letra distinta en español: «estaño»).
function palabra(s){
  return String(s).toUpperCase().replace(/Ñ/g, '\u0001').normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/\u0001/g, 'Ñ').replace(/[^A-ZÑ]/g, '');
}
function parseF(f){
  const s = aAscii(f), out = {};
  (function g(str, mult){
    let i = 0;
    while(i < str.length){
      if(str[i] === '('){ let d = 1, j = i + 1; while(j < str.length && d){ if(str[j]==='(') d++; else if(str[j]===')') d--; j++; }
        let n = ''; while(/\d/.test(str[j] || '')) n += str[j++]; g(str.slice(i+1, j-1), mult*(n ? +n : 1)); i = j; }
      else if(/[A-Z]/.test(str[i])){ let e = str[i++]; while(/[a-z]/.test(str[i] || '')) e += str[i++]; let n = ''; while(/\d/.test(str[i] || '')) n += str[i++]; out[e] = (out[e]||0) + mult*(n ? +n : 1); }
      else i++;
    }
  })(s, 1);
  return out;
}
function makeRng(str){
  let h = 2166136261 >>> 0;
  for(let i=0;i<str.length;i++){ h ^= str.charCodeAt(i); h = Math.imul(h, 16777619) >>> 0; }
  let a = h || 1;
  const r = () => { a = (a + 0x6D2B79F5)|0; let t = Math.imul(a ^ (a>>>15), 1|a); t = (t + Math.imul(t ^ (t>>>7), 61|t)) ^ t; return ((t ^ (t>>>14)) >>> 0) / 4294967296; };
  for(let i=0;i<6;i++) r();
  return r;
}
const pick = (a, r) => a[Math.floor(r()*a.length)];
function shuffle(a, r){ a = a.slice(); for(let i=a.length-1;i>0;i--){ const j = Math.floor(r()*(i+1)); [a[i],a[j]] = [a[j],a[i]]; } return a; }
/* ───────────── pistas ───────────── */
// Bancos: moléculas del Generador (docente-app.js → DOCENTE_BANCOS) para
// «fórmula → nombre»; glosarios escritos aquí para los conceptos.
function DB(){ return window.DOCENTE_BANCOS || {}; }
function mols(){ return DB().genMols || []; }
const nombreDe = m => m.iupac || m.name;
const FAM_TIT = {alcanos:'Alcanos', alquenos:'Alquenos', alquinos:'Alquinos', alcoholes:'Alcoholes', eteres:'Éteres',
  aldehidos:'Aldehídos', cetonas:'Cetonas', acidos:'Ácidos carboxílicos', esteres:'Ésteres', aminas:'Aminas', amidas:'Amidas', nitrilos:'Nitrilos'};

// Fórmula semidesarrollada en una línea a partir del formato MOLDES del
// Generador ({h, s, bu/bd: ramas, bn/buBn/bdBn: orden de enlace}).
const SUBD = '₀₁₂₃₄₅₆₇₈₉';
const subN = n => n > 1 ? String(n).split('').map(d => SUBD[d]).join('') : '';
const ENL = {1:'−', 2:'=', 3:'≡'};
function etiqueta(a){ return (a.s || 'C') + (a.h ? 'H' + subN(a.h) : ''); }
function textoCadena(ch){
  if(!Array.isArray(ch) || !ch.length) return null;
  let out = '';
  for(let i=0; i<ch.length; i++){
    const a = ch[i]; let t = etiqueta(a);
    const ramas = [];
    [['bu','buBn'], ['bd','bdBn']].forEach(([k, kb]) => { if(a[k]) ramas.push({c:a[k], o:a[kb] || 1}); });
    // C=O del carbonilo y, después, el −OH o −NH₂ del mismo carbono: CHO, CO, COOH, CONH₂
    const oxo = ramas.findIndex(x => x.o === 2 && x.c.length === 1 && x.c[0].s === 'O' && !x.c[0].h);
    if(oxo >= 0){ t += 'O'; ramas.splice(oxo, 1);
      const oh = ramas.findIndex(x => x.o === 1 && x.c.length === 1 && (x.c[0].s === 'O' || x.c[0].s === 'N'));
      if(oh >= 0){ t += etiqueta(ramas[oh].c[0]); ramas.splice(oh, 1); } }
    // ramas iguales se agrupan: N(CH₃)₂
    const txt = ramas.map(x => (x.o > 1 ? ENL[x.o] : '') + textoCadena(x.c));
    if(txt.some(x => x == null)) return null;
    if(txt.length === 2 && txt[0] === txt[1]) t += '(' + txt[0] + ')₂';
    else txt.forEach(x => { t += '(' + x + ')'; });
    out += t + (i < ch.length - 1 ? ENL[a.bn || 1] : '');
  }
  return out.replace(/CO−O−/g, 'COO−');
}
// «Fórmula → nombre»: solo nombres sin números (en las casillas no van
// localizadores) y que el Generador pueda escribir en una línea.
function pistasNom(cfg){
  const moldes = (DB().G && DB().G.moldes) || {}, vistos = {}, out = [];
  mols().filter(m => cfg.fam.includes(m.topic)).forEach(m => {
    const n = nombreDe(m);
    if(/\d|[A-Z]|,/.test(n)) return;
    const f = textoCadena(moldes[m.key]); if(!f) return;
    const w = palabra(n); if(!w || vistos[w] || vistos['f:' + f]) return;
    vistos[w] = 1; vistos['f:' + f] = 1;
    out.push({tipo:'nom', clave:'m:' + m.key, respuesta:w, solucion:n, pista:'Nombre IUPAC de <b class="fx">' + esc(f) + '</b>'});
  });
  return out;
}
const GLOS = {
  gf: [
    ['ALCOHOL','Familia del grupo −OH'], ['ALDEHIDO','Familia del grupo −CHO (en el extremo de la cadena)'], ['CETONA','Familia con C=O entre dos carbonos'],
    ['ACIDOCARBOXILICO','Familia del grupo −COOH'], ['ESTER','Familia del grupo −COO− entre dos carbonos'], ['ETER','Familia con un oxígeno entre dos carbonos (−O−)'],
    ['AMINA','Familia del grupo −NH₂'], ['AMIDA','Familia del grupo −CONH₂'], ['NITRILO','Familia del grupo −C≡N'],
    ['ALQUENO','Hidrocarburo con un doble enlace C=C'], ['ALQUINO','Hidrocarburo con un triple enlace C≡C'], ['ALCANO','Hidrocarburo con solo enlaces sencillos'],
    ['BENCENO','Anillo aromático de seis carbonos'], ['HIDROXI','Prefijo del −OH cuando no es el grupo principal'], ['OXO','Prefijo del C=O cuando no es el grupo principal'],
    ['AMINO','Prefijo del −NH₂ cuando no es el grupo principal'], ['METIL','Sustituyente −CH₃'], ['ETIL','Sustituyente −CH₂−CH₃'], ['PROPIL','Sustituyente −CH₂−CH₂−CH₃'],
    ['MET','Prefijo de cadena de 1 carbono'], ['PROP','Prefijo de cadena de 3 carbonos'], ['BUT','Prefijo de cadena de 4 carbonos'], ['PENT','Prefijo de cadena de 5 carbonos'],
    ['HEX','Prefijo de cadena de 6 carbonos'], ['HEPT','Prefijo de cadena de 7 carbonos'], ['OCT','Prefijo de cadena de 8 carbonos'], ['NON','Prefijo de cadena de 9 carbonos'],
    ['DEC','Prefijo de cadena de 10 carbonos'], ['ONA','Terminación de las cetonas'], ['OICO','Terminación de los ácidos carboxílicos (ácido …)'], ['OATO','Terminación de la primera palabra de un éster (… de metilo)']
  ],
  car: [
    ['HIBRIDACION','Mezcla de orbitales s y p que forma orbitales nuevos e iguales'], ['TETRAVALENCIA','Propiedad del carbono de formar cuatro enlaces covalentes'],
    ['CONCATENACION','Capacidad del carbono de unirse a otros carbonos formando cadenas'], ['TETRAEDRICA','Geometría de un carbono sp³ (109,5°)'],
    ['TRIGONAL','Geometría ____ plana: la de un carbono sp² (120°)'], ['LINEAL','Geometría de un carbono sp (180°)'], ['SIGMA','Enlace por solapamiento frontal de orbitales (σ)'],
    ['PROMOCION','Salto de un electrón del 2s al 2p vacío'], ['VALENCIA','Electrones de ____: el carbono tiene cuatro'], ['PRIMARIO','Carbono unido a un solo carbono'],
    ['SECUNDARIO','Carbono unido a dos carbonos'], ['TERCIARIO','Carbono unido a tres carbonos'], ['CUATERNARIO','Carbono unido a cuatro carbonos'],
    ['SATURADA','Cadena con solo enlaces sencillos'], ['INSATURADA','Cadena con al menos un enlace doble o triple'], ['HOMOGENEA','Cadena cuyo esqueleto tiene solo átomos de carbono'],
    ['HETEROGENEA','Cadena con un O, N o S intercalado entre carbonos'], ['HETEROATOMO','Átomo distinto del carbono dentro de la cadena (O, N, S)'],
    ['RAMIFICADA','Cadena de la que sale otra cadena desde algún carbono'], ['ACICLICA','Cadena «sin ciclo»: abierta'], ['CICLICA','Cadena cerrada en forma de anillo'],
    ['ALICICLICA','Cadena cerrada que no es aromática'], ['AROMATICA','Cadena cerrada tipo benceno'], ['HETEROCICLICA','Cadena cerrada con un heteroátomo en el anillo'],
    ['DIAMANTE','Carbono puro con todos sus átomos sp³ en una red rígida'], ['GRAFITO','Carbono puro de la mina del lápiz (carbonos sp²)'], ['ORBITAL','Región donde es más probable encontrar un electrón']
  ],
  iso: [
    ['ISOMEROS','Compuestos con la misma fórmula molecular y distinta estructura'], ['ESTRUCTURAL','Isomería en la que los átomos se unen en distinto orden'],
    ['ESTEREOISOMERIA','Isomería con el mismo orden de unión y distinta disposición en el espacio'], ['CADENA','Isomería de ____: butano y 2-metilpropano'],
    ['POSICION','Isomería de ____: propan-1-ol y propan-2-ol'], ['FUNCION','Isomería de ____: etanol y metoximetano'], ['CIS','Isómero con los grupos del mismo lado del doble enlace'],
    ['TRANS','Isómero con los grupos en lados opuestos del doble enlace'], ['GEOMETRICA','Otro nombre de la isomería cis/trans'], ['QUIRAL','Carbono unido a cuatro grupos distintos'],
    ['ENANTIOMEROS','Isómeros que son imágenes especulares no superponibles'], ['OPTICA','Isomería debida a un carbono quiral'], ['ESPEJO','Los enantiómeros son como una mano y su imagen en el ____'],
    ['POLARIZADA','Luz ____: los enantiómeros la desvían en sentidos opuestos'], ['ZUSAMMEN','Palabra alemana («juntos») de la que viene la Z'], ['ENTGEGEN','Palabra alemana («opuestos») de la que viene la E'],
    ['TALIDOMIDA','Medicamento de los años 50 cuyo enantiómero causó malformaciones'], ['CARVONA','Molécula con un enantiómero que huele a hierbabuena'],
    ['CONFORMACION','Forma que toma una molécula al girar un enlace sencillo (no es un isómero)']
  ],
  rx: [
    ['SUSTITUCION','Reacción en la que un átomo sale y otro entra en su lugar'], ['ADICION','Reacción en la que dos grupos se suman a un doble enlace'],
    ['ELIMINACION','Reacción en la que sale una molécula pequeña y se forma un doble enlace'], ['COMBUSTION','Reacción con oxígeno que produce CO₂ y agua'],
    ['OXIDACION','Transformación de un alcohol primario en aldehído'], ['HIDRATACION','Adición de agua a un alqueno'], ['HALOGENACION','Reacción de un alcano con Cl₂ o Br₂ y luz'],
    ['HIDROGENACION','Adición de H₂ a un doble enlace con catalizador'], ['MARKOVNIKOV','Regla: el H se une al carbono del doble enlace que tiene más H'],
    ['ESTERIFICACION','Reacción de un ácido carboxílico con un alcohol'], ['SAPONIFICACION','Hidrólisis de una grasa con NaOH: así se hace el jabón'],
    ['POLIMERIZACION','Unión de muchos monómeros para formar un plástico'], ['CARBOCATION','Intermediario con un carbono con carga positiva'], ['RADICAL','Especie con un electrón desapareado'],
    ['NUCLEOFILO','Especie rica en electrones que ataca a un carbono con carga parcial positiva'], ['ELECTROFILO','Especie pobre en electrones que los busca'],
    ['CATALIZADOR','Sustancia que acelera la reacción sin gastarse'], ['DESHIDRATACION','Eliminación de agua de un alcohol para formar un alqueno'],
    ['FERMENTACION','Proceso con levaduras que produce etanol a partir de azúcares']
  ]
};
const TIPOS = ['nom','gf','car','iso','rx'];
function candidatos(cfg, r){
  const listas = cfg.tipos.map(t => shuffle(t === 'nom' ? pistasNom(cfg)
    : GLOS[t].map(([w, p]) => ({tipo:t, clave:'g:' + w, respuesta: palabra(w), solucion: w.toLowerCase(), pista: p})), r)
    .filter(x => x.respuesta.length >= 3 && x.respuesta.length <= cfg.maxLen));
  // en ronda entre los tipos marcados, sin repetir respuestas
  const out = [], vistas = new Set();
  for(let i=0; listas.some(l => i < l.length); i++) listas.forEach(l => { const x = l[i]; if(x && !vistas.has(x.respuesta)){ vistas.add(x.respuesta); out.push(x); } });
  return out;
}

function armar(lista, objetivo, r){
  const g = new Map();      // "f,c" → {l, h, v}  (letra y si la usa una palabra horizontal/vertical)
  const K = (f, c) => f + ',' + c;
  const puestas = [];
  const cabe = (w, f, c, dir) => {
    const df = dir === 'v' ? 1 : 0, dc = dir === 'h' ? 1 : 0;
    if(g.has(K(f - df, c - dc)) || g.has(K(f + df*w.length, c + dc*w.length))) return -1;
    let cruces = 0;
    for(let i=0;i<w.length;i++){
      const ff = f + df*i, cc = c + dc*i, x = g.get(K(ff, cc));
      if(x){ if(x.l !== w[i] || x[dir]) return -1; cruces++; }
      else if(dir === 'h' ? (g.has(K(ff-1, cc)) || g.has(K(ff+1, cc))) : (g.has(K(ff, cc-1)) || g.has(K(ff, cc+1)))) return -1;
    }
    return cruces;
  };
  const poner = (x, f, c, dir) => {
    const w = x.respuesta, df = dir === 'v' ? 1 : 0, dc = dir === 'h' ? 1 : 0;
    for(let i=0;i<w.length;i++){ const k = K(f + df*i, c + dc*i), e = g.get(k) || {l: w[i]}; e[dir] = true; g.set(k, e); }
    puestas.push({x, f, c, dir});
  };
  const caja = () => { let a=1e9,b=-1e9,cc=1e9,d=-1e9; g.forEach((v, k) => { const [f, c] = k.split(',').map(Number); a=Math.min(a,f); b=Math.max(b,f); cc=Math.min(cc,c); d=Math.max(d,c); }); return {f0:a, f1:b, c0:cc, c1:d}; };
  // `lista` viene en ronda entre los tipos de pista: se colocan en ese orden
  // (si se ordenaran por largo, los nombres completos llenarían todo y no
  // quedarían pistas de iones, funciones ni de completar). La primera es la
  // más larga de las que se van a usar, horizontal en el centro.
  const pend = lista.slice();
  const primeras = pend.slice(0, objetivo);
  const i0 = pend.indexOf(primeras.reduce((m, x) => x.respuesta.length > m.respuesta.length ? x : m, primeras[0]));
  poner(pend.splice(i0, 1)[0], 0, 0, 'h');
  let vueltas = 0;
  while(puestas.length < objetivo && pend.length && vueltas++ < 4){
    for(let p = 0; p < pend.length && puestas.length < objetivo; ){
      const x = pend[p], w = x.respuesta;
      let mejor = null;
      g.forEach((e, k) => {
        const [f, c] = k.split(',').map(Number);
        for(let i=0;i<w.length;i++){ if(w[i] !== e.l) continue;
          for(const dir of (e.h && e.v ? [] : e.h ? ['v'] : ['h'])){
            const sf = dir === 'v' ? f - i : f, sc = dir === 'h' ? c - i : c;
            const n = cabe(w, sf, sc, dir); if(n < 1) continue;
            // preferir más cruces y una cuadrícula compacta (casi cuadrada)
            const b = caja(), f0 = Math.min(b.f0, sf), f1 = Math.max(b.f1, dir === 'v' ? sf + w.length - 1 : sf), c0 = Math.min(b.c0, sc), c1 = Math.max(b.c1, dir === 'h' ? sc + w.length - 1 : sc);
            const alto = f1 - f0 + 1, ancho = c1 - c0 + 1;
            const pts = n*10 - Math.max(alto, ancho)*3 - Math.abs(alto - ancho) + r();
            if(!mejor || pts > mejor.pts) mejor = {pts, sf, sc, dir};
          }
        }
      });
      if(mejor){ poner(x, mejor.sf, mejor.sc, mejor.dir); pend.splice(p, 1); } else p++;
    }
  }
  // normalizar a (0,0) y numerar
  const b = caja();
  const pal = puestas.map(p => ({...p, f: p.f - b.f0, c: p.c - b.c0}));
  const filas = b.f1 - b.f0 + 1, cols = b.c1 - b.c0 + 1;
  const celdas = Array.from({length: filas}, () => Array(cols).fill(null));
  pal.forEach(p => { const w = p.x.respuesta; for(let i=0;i<w.length;i++){ const f = p.f + (p.dir === 'v' ? i : 0), c = p.c + (p.dir === 'h' ? i : 0); celdas[f][c] = w[i]; } });
  const inicios = [...new Set(pal.map(p => p.f*1000 + p.c))].sort((a, b) => a - b);
  pal.forEach(p => p.num = inicios.indexOf(p.f*1000 + p.c) + 1);
  return {filas, cols, celdas, pal};
}

// Verificación independiente: cada tramo de 2+ letras seguidas (horizontal
// o vertical) es exactamente una de las palabras puestas, y todo está conectado.
function verificar(cz){
  const err = [];
  const tramos = [];
  for(let f=0; f<cz.filas; f++){ let c=0; while(c<cz.cols){ if(cz.celdas[f][c]){ let k=c; while(k<cz.cols && cz.celdas[f][k]) k++; if(k-c>1) tramos.push({f, c, dir:'h', w: cz.celdas[f].slice(c, k).join('')}); c=k; } else c++; } }
  for(let c=0; c<cz.cols; c++){ let f=0; while(f<cz.filas){ if(cz.celdas[f][c]){ let k=f; while(k<cz.filas && cz.celdas[k][c]) k++; if(k-f>1) tramos.push({f, c, dir:'v', w: cz.celdas.slice(f, k).map(x => x[c]).join('')}); f=k; } else f++; } }
  const clave = t => t.dir + t.f + ',' + t.c + t.w;
  const puestas = new Set(cz.pal.map(p => clave({f:p.f, c:p.c, dir:p.dir, w:p.x.respuesta})));
  tramos.forEach(t => { if(!puestas.has(clave(t))) err.push('palabra accidental ' + t.w); });
  if(tramos.length !== cz.pal.length) err.push('tramos ' + tramos.length + ' ≠ palabras ' + cz.pal.length);
  const resp = cz.pal.map(p => p.x.respuesta); if(new Set(resp).size !== resp.length) err.push('respuesta repetida');
  // conexión (BFS por celdas)
  const llenas = []; cz.celdas.forEach((row, f) => row.forEach((x, c) => { if(x) llenas.push(f*1000 + c); }));
  const vis = new Set([llenas[0]]), cola = [llenas[0]];
  while(cola.length){ const v = cola.pop(), f = Math.floor(v/1000), c = v % 1000;
    [[1,0],[-1,0],[0,1],[0,-1]].forEach(([a, b]) => { const ff = f+a, cc = c+b; if(ff>=0 && cc>=0 && ff<cz.filas && cc<cz.cols && cz.celdas[ff][cc] && !vis.has(ff*1000+cc)){ vis.add(ff*1000+cc); cola.push(ff*1000+cc); } }); }
  if(vis.size !== llenas.length) err.push('palabras sueltas');
  return {ok: !err.length, err};
}

function construir(cfg, seed){
  const lista0 = candidatos(cfg, makeRng(seed));
  if(lista0.length < Math.min(cfg.n, 4)) return {error: 'Con estas opciones solo hay ' + lista0.length + ' pistas posibles: marque más tipos de pista o familias, o suba el largo máximo de palabra.'};
  let mejor = null;
  for(let i=0;i<40;i++){
    // cada intento sale con otra selección de pistas (misma semilla → mismo resultado)
    const rr = makeRng(seed + '~' + i);
    const lista = i ? candidatos(cfg, rr) : lista0;
    const cz = armar(lista.slice(0, Math.max(cfg.n * 4, 40)), cfg.n, rr);
    const v = verificar(cz); if(!v.ok) continue;
    cz.verif = v;
    const pts = cz.pal.length * 1000 - Math.max(cz.filas, cz.cols) * 10 - Math.abs(cz.filas - cz.cols);
    if(!mejor || pts > mejor.pts){ mejor = cz; mejor.pts = pts; }
    if(cz.pal.length >= cfg.n && Math.max(cz.filas, cz.cols) <= cfg.maxLen + 1) break;
  }
  if(!mejor) return {error: 'No se pudo armar un crucigrama con estas opciones.'};
  mejor.seed = seed;
  return mejor;
}

/* ───────────── hoja ───────────── */
const DEF_TIT = 'Crucigrama de química orgánica';
function cuadricula(cz, modo, celda){
  // modo: 'hoja' (vacía), 'clave' (con letras), 'jugar' (inputs)
  const nums = {}; cz.pal.forEach(p => { nums[p.f + ',' + p.c] = p.num; });
  let h = '<div class="cz-grid" style="grid-template-columns:repeat(' + cz.cols + ',' + celda + 'px);grid-auto-rows:' + celda + 'px;--celda:' + celda + 'px">';
  for(let f=0; f<cz.filas; f++) for(let c=0; c<cz.cols; c++){
    const l = cz.celdas[f][c];
    if(!l){ h += '<span class="cz-v"></span>'; continue; }
    const n = nums[f + ',' + c];
    h += '<span class="cz-c" data-f="' + f + '" data-c="' + c + '">' + (n ? '<i>' + n + '</i>' : '')
      + (modo === 'clave' ? '<b>' + l + '</b>' : modo === 'jugar' ? '<input maxlength="1" autocomplete="off" autocapitalize="characters" spellcheck="false" aria-label="Fila ' + (f+1) + ', columna ' + (c+1) + '">' : '') + '</span>';
  }
  return h + '</div>';
}
function listaPistas(cz, conSol){
  const fila = p => '<li value="' + p.num + '"><span>' + p.x.pista + ' <em>(' + p.x.respuesta.length + ')</em>' + (conSol ? ' → <b class="cz-sol">' + esc(p.x.respuesta) + '</b>' : '') + '</span></li>';
  const H = cz.pal.filter(p => p.dir === 'h').sort((a, b) => a.num - b.num), V = cz.pal.filter(p => p.dir === 'v').sort((a, b) => a.num - b.num);
  return '<div class="cz-pistas"><div><h4>Horizontales</h4><ol>' + H.map(fila).join('') + '</ol></div><div><h4>Verticales</h4><ol>' + V.map(fila).join('') + '</ol></div></div>';
}
function hoja(cz, c, o){
  const celda = Math.max(18, Math.min(34, Math.floor(700 / cz.cols), Math.floor(520 / cz.filas)));
  const el = document.createElement('div');
  el.className = 'cz-hoja' + (o.clave ? ' clave' : '');
  el.innerHTML = '<img class="cz-wm" src="icons/marca-agua.png" alt="" aria-hidden="true">'
    + '<div class="cz-head"><img src="logo-chromanom.png" alt="ChromaNom"><div class="cz-tit"><div class="t">' + esc(c.title) + '</div>'
    + '<div class="s">Resuelve cada pista y escribe la respuesta en las casillas, en mayúsculas: sin espacios, tildes, guiones ni números.</div></div>'
    + '<div class="cz-ver">' + esc(o.label || '') + '</div></div>'
    + '<div class="cz-form"><span>Nombre: <i class="w1"></i></span><span>Curso: <i class="w2"></i></span><span>Fecha: <i class="w3"></i></span></div>'
    + '<div class="cz-cuerpo">' + cuadricula(cz, o.clave ? 'clave' : 'hoja', celda) + listaPistas(cz, o.clave) + '</div>'
    + '<div class="cz-pie"><span class="m">Chroma<b>Nom</b> · Nomenclatura orgánica</span><span>© 2026 Harvey Barcenas Morales · Licencia CC BY-NC 4.0</span></div>';
  return el;
}
// Si las pistas no caben en la hoja carta, se reduce su letra hasta que quepan.
function ajustarHoja(el){
  const cuerpo = el.querySelector('.cz-cuerpo'), pistas = el.querySelector('.cz-pistas');
  let fs = 13;
  pistas.style.fontSize = fs + 'px';
  for(let i=0; i<12 && cuerpo.scrollHeight > cuerpo.clientHeight + 1; i++){ fs -= 0.5; pistas.style.fontSize = fs + 'px'; }
}

/* ───────────── interfaz ───────────── */
const MAX_VERSIONES = 40;
const rndSeed = () => Math.random().toString(36).slice(2, 6);
const seedOf = (c, i) => c.seed + '-' + (i+1);
let vista = 'sheet', actual = null, listo = false;

function getCfg(){
  const c = {
    tipos: $$('#cz-tipos input:checked').map(x => x.value),
    fam: $$('#cz-fam input:checked').map(x => x.value),
    n: Math.max(6, Math.min(20, parseInt($('#cz-n').value, 10) || 12)),
    maxLen: Math.max(8, Math.min(22, parseInt($('#cz-max').value, 10) || 16)),
    title: $('#cz-title').value.trim() || DEF_TIT,
    seed: $('#cz-seed').value.trim().replace(/-\d+$/, '') || 'chromanom',
    nver: Math.max(1, Math.min(MAX_VERSIONES, parseInt($('#cz-nver').value, 10) || 1))
  };
  if(!c.tipos.length) c.vacio = 'Marque al menos un tipo de pista.';
  if(c.tipos.includes('nom') && !c.fam.length) c.vacio = 'Marque al menos una familia de compuestos para «Fórmula → nombre».';
  $('#cz-app').classList.toggle('sin-nom', !c.tipos.includes('nom'));
  return c;
}
function envolver(el){
  const w = document.createElement('div'); w.className = 'cz-escala'; w.appendChild(el); return w;
}
function escalar(){
  const st = $('#cz-stage'), w = st.querySelector('.cz-escala'); if(!w) return;
  const el = w.firstElementChild, avail = st.clientWidth - 4; if(avail <= 0) return;
  const s = Math.min(1, avail / 816);
  el.style.transform = 'scale(' + s + ')'; w.style.width = 816*s + 'px'; w.style.height = 1056*s + 'px';
}
function render(){
  if(!listo) return;
  const c = getCfg(), vi = Math.min(+$('#cz-vsel').value || 0, c.nver - 1);
  const cz = c.vacio ? {error: c.vacio} : construir(c, seedOf(c, vi));
  const st = $('#cz-stage'), v = $('#cz-verif');
  st.innerHTML = ''; $('#cz-play').innerHTML = '';
  if(cz.error){ actual = null; v.className = 'lab-verif bad'; v.textContent = '⚠️ ' + cz.error; $('#cz-status').textContent = ''; return; }
  actual = cz;
  v.className = 'lab-verif ' + (cz.pal.length >= c.n ? 'ok' : 'bad');
  v.textContent = (cz.pal.length >= c.n ? '✔ ' : '⚠️ ') + 'Crucigrama verificado: ' + cz.pal.length + ' palabras' + (cz.pal.length < c.n ? ' (de ' + c.n + ' pedidas: no cabían más con estas opciones)' : '') + ', todas conectadas, sin palabras accidentales · ' + cz.filas + '×' + cz.cols;
  if(vista === 'play'){ $('#cz-status').textContent = 'Escribe en las casillas. Toca una pista para resaltar su palabra.'; jugar(cz); return; }
  $('#cz-status').textContent = vista === 'key' ? 'Clave: código para volver a generar estas hojas: ' + c.seed : 'Hoja del estudiante (carta vertical).';
  const el = hoja(cz, c, {clave: vista === 'key', label: vista === 'key' ? 'Clave · código ' + c.seed + ' · versión ' + (vi+1) : 'Versión ' + (vi+1) + ' de ' + c.nver});
  st.appendChild(envolver(el)); ajustarHoja(el); escalar();
}

/* ----- resolver en pantalla ----- */
function jugar(cz){
  const box = $('#cz-play');
  // ancho real disponible dentro de la tarjeta (padding 14 + borde 2 + margen)
  const avail = Math.max(240, (box.clientWidth || $('#cz-app').clientWidth || 360) - 40);
  const celda = Math.max(22, Math.min(40, Math.floor(avail / cz.cols)));
  box.innerHTML = '<div class="cz-jugar"><div class="cz-gwrap">' + cuadricula(cz, 'jugar', celda) + '</div>' + listaPistas(cz, false)
    + '<div class="cz-bar"><button type="button" class="cn-btn cn-btn--primary" id="cz-check">✔ Comprobar</button><button type="button" class="cn-btn cn-btn--secondary" id="cz-clear">↺ Borrar todo</button><span id="cz-msg" aria-live="polite"></span></div></div>';
  const celdaEl = (f, c) => box.querySelector('.cz-c[data-f="' + f + '"][data-c="' + c + '"] input');
  let dir = 'h', activa = null;
  const palDe = (f, c, d) => cz.pal.find(p => p.dir === d && (d === 'h' ? p.f === f && c >= p.c && c < p.c + p.x.respuesta.length : p.c === c && f >= p.f && f < p.f + p.x.respuesta.length));
  const resaltar = p => { box.querySelectorAll('.cz-c.sel').forEach(x => x.classList.remove('sel')); box.querySelectorAll('.cz-pistas li.sel').forEach(x => x.classList.remove('sel'));
    if(!p) return; activa = p; for(let i=0;i<p.x.respuesta.length;i++){ const e = celdaEl(p.f + (p.dir==='v'?i:0), p.c + (p.dir==='h'?i:0)); if(e) e.parentNode.classList.add('sel'); }
    const li = [...box.querySelectorAll('.cz-pistas li')].find(l => +l.value === p.num && l.closest('div').querySelector('h4').textContent === (p.dir === 'h' ? 'Horizontales' : 'Verticales')); if(li) li.classList.add('sel'); };
  box.querySelectorAll('.cz-c input').forEach(inp => {
    const f = +inp.parentNode.dataset.f, c = +inp.parentNode.dataset.c;
    inp.addEventListener('focus', () => { const p = palDe(f, c, dir) || palDe(f, c, dir === 'h' ? 'v' : 'h'); if(p) dir = p.dir; resaltar(p); });
    // la dirección se alterna solo al tocar OTRA VEZ la casilla que ya estaba
    // activa (con el primer toque se escribía en la dirección contraria)
    let yaActiva = false;
    inp.addEventListener('pointerdown', () => { yaActiva = document.activeElement === inp; });
    inp.addEventListener('click', () => { if(yaActiva && palDe(f, c, 'h') && palDe(f, c, 'v')){ dir = dir === 'h' ? 'v' : 'h'; resaltar(palDe(f, c, dir)); } yaActiva = false; });
    inp.addEventListener('input', () => {
      inp.value = palabra(inp.value).slice(-1); inp.parentNode.classList.remove('bien', 'mal');
      if(inp.value){ const n = celdaEl(f + (dir==='v'?1:0), c + (dir==='h'?1:0)); if(n) n.focus(); }
    });
    inp.addEventListener('keydown', e => {
      const mov = {ArrowRight:[0,1,'h'], ArrowLeft:[0,-1,'h'], ArrowDown:[1,0,'v'], ArrowUp:[-1,0,'v']}[e.key];
      if(mov){ e.preventDefault(); dir = mov[2]; const n = celdaEl(f + mov[0], c + mov[1]); if(n) n.focus(); else resaltar(palDe(f, c, dir)); }
      if(e.key === 'Backspace' && !inp.value){ const n = celdaEl(f - (dir==='v'?1:0), c - (dir==='h'?1:0)); if(n){ e.preventDefault(); n.value = ''; n.focus(); } }
    });
  });
  box.querySelectorAll('.cz-pistas li').forEach(li => li.addEventListener('click', () => {
    const d = li.closest('div').querySelector('h4').textContent === 'Horizontales' ? 'h' : 'v';
    const p = cz.pal.find(x => x.num === +li.value && x.dir === d); if(!p) return; dir = d; const e = celdaEl(p.f, p.c); if(e) e.focus();
  }));
  $('#cz-check').addEventListener('click', () => {
    let bien = 0, mal = 0, vacias = 0;
    box.querySelectorAll('.cz-c input').forEach(inp => { const f = +inp.parentNode.dataset.f, c = +inp.parentNode.dataset.c, l = cz.celdas[f][c];
      inp.parentNode.classList.remove('bien', 'mal'); if(!inp.value){ vacias++; return; } if(inp.value === l){ bien++; inp.parentNode.classList.add('bien'); } else { mal++; inp.parentNode.classList.add('mal'); } });
    const comp = cz.pal.filter(p => { for(let i=0;i<p.x.respuesta.length;i++){ const e = celdaEl(p.f + (p.dir==='v'?i:0), p.c + (p.dir==='h'?i:0)); if(!e || e.value !== p.x.respuesta[i]) return false; } return true; }).length;
    $('#cz-msg').textContent = (comp === cz.pal.length ? '🏁 ¡Crucigrama completo! ' : '') + comp + ' de ' + cz.pal.length + ' palabras correctas · ' + mal + ' letras por corregir · ' + vacias + ' casillas vacías';
  });
  $('#cz-clear').addEventListener('click', () => { box.querySelectorAll('.cz-c input').forEach(i => { i.value = ''; i.parentNode.classList.remove('bien', 'mal'); }); $('#cz-msg').textContent = ''; });
}

/* ----- imprimir ----- */
function prepararImpresion(){
  if(!listo) return false;
  const c = getCfg(); if(c.vacio){ $('#cz-verif').textContent = '⚠️ ' + c.vacio; return false; }
  const root = $('#cz-print-root'); root.innerHTML = '';
  const czs = [];
  for(let i=0;i<c.nver;i++){ const cz = construir(c, seedOf(c, i)); if(cz.error){ $('#cz-verif').textContent = '⚠️ ' + cz.error; return false; } czs.push(cz); }
  const add = el => { root.appendChild(el); ajustarHoja(el); };
  czs.forEach((cz, i) => add(hoja(cz, c, {label: 'Versión ' + (i+1) + ' de ' + c.nver})));
  if($('#cz-withkeys').checked) czs.forEach((cz, i) => add(hoja(cz, c, {clave: true, label: 'Clave · código ' + c.seed + ' · versión ' + (i+1)})));
  const pgGuias = document.getElementById('estilo-pagina-guias'); if(pgGuias) pgGuias.media = 'not all';
  document.body.classList.add('cz-printing');
  return true;
}
function imprimir(){
  if(!prepararImpresion()) return;
  const imgs = [...$('#cz-print-root').querySelectorAll('img')];
  Promise.all(imgs.map(im => im.complete ? 0 : new Promise(r => { im.onload = im.onerror = r; }))).then(() => setTimeout(() => window.print(), 120));
}
function antesDeImprimir(){
  if(document.body.classList.contains('cz-printing') || document.body.classList.contains('lab-printing')) return;
  const tab = document.getElementById('panel-cz');
  if(tab && !tab.hidden) prepararImpresion();
}
function finImpresion(){ if(!document.body.classList.contains('cz-printing')) return; document.body.classList.remove('cz-printing'); $('#cz-print-root').innerHTML = '';
  const pgGuias = document.getElementById('estilo-pagina-guias'); if(pgGuias) pgGuias.media = ''; }

function llenarVersiones(){
  const n = Math.max(1, Math.min(MAX_VERSIONES, parseInt($('#cz-nver').value, 10) || 1)), sel = $('#cz-vsel'), keep = +sel.value || 0;
  $('#cz-nver').value = n;
  sel.innerHTML = ''; for(let i=0;i<n;i++) sel.insertAdjacentHTML('beforeend', '<option value="' + i + '">Versión ' + (i+1) + '</option>');
  sel.value = String(Math.min(keep, n-1));
}
// Casillas de familias (temas del Generador) con cuántos compuestos sirven.
function contar(){
  const box = $('#cz-fam');
  if(box && !box.children.length){
    box.innerHTML = Object.keys(FAM_TIT).map(t => '<label class="opt"><input type="checkbox" value="' + t + '" checked> <span><b>' + FAM_TIT[t] + '</b><small></small></span></label>').join('');
    box.querySelectorAll('input').forEach(x => x.addEventListener('change', render));
  }
  $$('#cz-fam label').forEach(l => { const t = l.querySelector('input').value, sm = l.querySelector('small'); if(sm) sm.textContent = pistasNom({fam:[t]}).length + ' compuestos'; });
}
function init(){
  if(!$('#cz-app')) return;
  $('#cz-seed').value = rndSeed(); $('#cz-title').value = DEF_TIT;
  llenarVersiones();
  let tmr = null; const diferido = () => { clearTimeout(tmr); tmr = setTimeout(render, 250); };
  $$('#cz-tipos input, #cz-fam input').forEach(x => x.addEventListener('change', render));
  ['#cz-vsel'].forEach(s => $(s).addEventListener('change', render));
  ['#cz-title','#cz-seed','#cz-n','#cz-max'].forEach(s => $(s).addEventListener('input', diferido));
  $('#cz-nver').addEventListener('change', () => { llenarVersiones(); render(); });
  $('#cz-btn-seed').addEventListener('click', () => { $('#cz-seed').value = rndSeed(); render(); });
  $$('#cz-seg button').forEach(b => b.addEventListener('click', () => {
    vista = b.dataset.view; $$('#cz-seg button').forEach(x => { x.classList.toggle('on', x === b); x.setAttribute('aria-pressed', x === b ? 'true' : 'false'); }); render();
  }));
  $('#cz-btn-print').addEventListener('click', imprimir);
  // En «Resolver» no se redibuja al cambiar el tamaño: en celular el teclado
  // cambia el alto de la ventana y redibujar borraría lo escrito.
  window.addEventListener('resize', () => { if(vista !== 'play') escalar(); });
  window.addEventListener('beforeprint', antesDeImprimir);
  window.addEventListener('afterprint', finImpresion);
  if(window.matchMedia){ const mq = matchMedia('print'); const f = e => { if(!e.matches) finImpresion(); }; mq.addEventListener ? mq.addEventListener('change', f) : mq.addListener && mq.addListener(f); }
  // «Fórmula → nombre» necesita las moléculas del Generador (docente-app.js)
  const arrancar = () => { if(listo) return; listo = true; contar(); render(); };
  if(window.DOCENTE_BANCOS) arrancar();
  else { document.addEventListener('docente-bancos-listos', arrancar, {once:true}); setTimeout(arrancar, 15000); }
}
window.CRUCIGRAMA = {render, escalar, construir, verificar, getCfg, _interno: {candidatos, palabra, textoCadena, pistasNom}};
document.addEventListener('DOMContentLoaded', init);
})();
