/* ═════════════════════════════════════════════════════════════════════
   retos.js — REGLAS comunes de los juegos de ChromaNom, IonNom y BioNom.
   El archivo es el mismo en los tres sitios, pero NO trae preguntas ni
   palabras: cada sitio le pasa su propio banco (BANCO_AHORCADO y el banco
   de preguntas de su juego). Aquí solo viven las reglas:

   1. Tres intentos con pistas progresivas (RETOS.pistas, RETOS.caja…):
      - 1.er error → pista 1 (la más general: qué revisar, sin decir la
        respuesta).
      - 2.º error → pista 2 (más concreta).
      - 3.er error → se acaba la pregunta y se explica toda la respuesta.
      Las pistas se arman con la explicación de la pregunta, pero con las
      palabras de la respuesta tapadas (▢▢▢), para que orienten sin regalarla.
      Puntos: 100 % al primer intento, 50 % al segundo, 20 % al tercero.
   2. Secciones de juego con palabras del banco de cada sitio:
      - Crucigrama de 10 palabras (3 comprobaciones; después de cada una,
        las palabras que siguen mal reciben una pista nueva).
      - Sopa de letras de 10 palabras (se busca la palabra a partir de su
        pista; hasta 3 pistas por palabra).
      - Ahorcado (la pista 2 y la 3 aparecen solas al fallar letras).
      Cada uno trae su propio reloj, con un tiempo que crece con la
      dificultad: cantidad de palabras, letras y tamaño de la cuadrícula.
   ═════════════════════════════════════════════════════════════════════ */
(function(){
'use strict';
var R = {};

/* ───────── utilidades ───────── */
function esc(s){ return String(s == null ? '' : s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }
function sinTilde(s){ return String(s).replace(/ñ/g,'\u0001').replace(/Ñ/g,'\u0002').normalize('NFD').replace(/[̀-ͯ]/g,'').replace(/\u0001/g,'ñ').replace(/\u0002/g,'Ñ'); }
function normal(s){ return sinTilde(String(s).replace(/<[^>]*>/g,'')).toLowerCase(); }
function barajar(a, rnd){ rnd = rnd || Math.random; a = a.slice(); for(var i = a.length - 1; i > 0; i--){ var j = Math.floor(rnd() * (i + 1)), t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
// Palabra para casillas: mayúsculas, sin tildes, sin espacios ni signos (la Ñ se conserva).
function letras(s){ return sinTilde(String(s).toUpperCase()).replace(/[^A-ZÑ]/g,''); }
function mmss(s){ s = Math.max(0, Math.round(s)); return Math.floor(s / 60) + ':' + ('0' + (s % 60)).slice(-2); }
R.esc = esc; R.normal = normal; R.letras = letras; R.barajar = barajar; R.mmss = mmss;

/* ───────── 1. Pistas progresivas ───────── */
var VACIAS = {};
('para como pero porque cuando donde desde hasta entre sobre tiene tienen esta este esto estos estas ese esos esas '
 + 'cual cuales todo toda todos todas otro otra otros otras mismo misma solo sola muy mas menos tambien ademas '
 + 'hace hacen puede pueden sirve forma formas parte partes tipo tipos cada ellos ellas sino segun').split(' ').forEach(function(w){ VACIAS[w] = 1; });
var MASK = '▢▢▢';

// Tapa en «texto» las palabras de las respuestas (y la respuesta completa si
// aparece literal), sin tocar las etiquetas HTML. Una palabra se tapa si
// comparte con una palabra de la respuesta sus primeras 5-6 letras (así se
// tapan también plurales y derivados: «mitocondria», «mitocondrias»).
R.velar = function(texto, respuestas){
  texto = String(texto == null ? '' : texto);
  var resp = [].concat(respuestas || []).map(function(r){ return String(r == null ? '' : r).replace(/<[^>]*>/g,'').trim(); }).filter(Boolean);
  var toks = [];
  resp.forEach(function(r){
    normal(r).split(/[^a-zñ0-9]+/).forEach(function(w){ if(w.length >= 4 && !VACIAS[w]) toks.push(w); });
  });
  return texto.split(/(<[^>]*>)/).map(function(parte){
    if(parte.charAt(0) === '<') return parte;
    resp.forEach(function(r){ if(r.length >= 3 && /[A-Za-zÁÉÍÓÚÑáéíóúñ0-9₀-₉]/.test(r)) parte = parte.split(r).join(MASK); });
    if(!toks.length) return parte;
    return parte.replace(/[A-Za-zÁÉÍÓÚÜÑáéíóúüñ]+/g, function(w){
      var n = normal(w);
      if(n.length < 4) return w;
      for(var i = 0; i < toks.length; i++){
        var t = toks[i], k = Math.min(t.length, n.length, 6);
        if(k >= 4 && n.slice(0, k) === t.slice(0, k)) return MASK;
        if(t.length >= 6 && n.indexOf(t) >= 0) return MASK;
      }
      return w;
    });
  }).join('');
};
R.frases = function(t){
  return String(t || '').replace(/([.!?])\s+(?=[A-ZÁÉÍÓÚÑ¿¡«(▢0-9])/g, '$1\u0001').split('\u0001').map(function(s){ return s.trim(); }).filter(Boolean);
};
// ¿La pista sirve? Debe decir algo (3 palabras o más sin contar lo tapado)
// y no puede contener la respuesta completa.
function util(p, resp){
  var limpio = normal(p).replace(/▢+/g,' ');
  var palabras = limpio.split(/[^a-zñ0-9]+/).filter(function(w){ return w.length > 1; });
  if(palabras.length < 3) return false;
  for(var i = 0; i < resp.length; i++){ var r = normal(resp[i]).trim(); if(r.length >= 4 && limpio.indexOf(r) >= 0) return false; }
  return true;
}
var GENERALES = [
  'Vuelve a leer el enunciado despacio: hay una palabra clave que decide la respuesta. ¿Qué te está preguntando exactamente?',
  'Descarta lo que contradice lo que viste en la página del tema y, entre lo que queda, elige lo más preciso.'
];
// o = {resp:[respuesta y variantes], exp:'explicación', extra:['pistas propias, de la más general a la más concreta'],
//      general:'pista general (solo si faltan concretas)', primera:'pista general que siempre va de primera'}
// Devuelve una lista de pistas (la 1 es la más general). Siempre al menos 2.
R.pistas = function(o){
  var resp = [].concat(o.resp || []).filter(function(x){ return x != null && x !== ''; }).map(String);
  var out = [], vistos = {};
  function add(p, tal){
    if(!p) return;
    p = String(p).trim();
    var v = tal ? p : R.velar(p, resp);
    if(!util(v, resp)) return;
    var k = normal(v).replace(/[^a-zñ0-9]+/g,'');
    if(vistos[k]) return;
    vistos[k] = 1; out.push(v);
  }
  [].concat(o.extra || []).forEach(add);
  var fr = R.frases(R.velar(o.exp || '', resp)).filter(function(f){ return util(f, resp); });
  if(fr.length) add(fr[0]);
  if(fr.length > 1) add(fr.slice(1).join(' '));
  // Si solo hay una pista concreta, va de segunda: la primera es la general
  // (la que da el sitio para el tema, o una de lectura atenta).
  // «primera»: pista general propia del sitio que siempre va de primera
  // (por ejemplo, la regla de nomenclatura del grupo de compuestos).
  if(o.primera){
    var resto = out.slice(0, 1); out = []; vistos = {};
    add(o.primera, true); resto.forEach(function(x){ add(x, true); });
  }
  if(out.length < 2){
    var concretas = out; out = []; vistos = {};
    [].concat(o.general || [], GENERALES).forEach(function(g){ if(out.length < 2 - concretas.length) add(g, true); });
    concretas.forEach(function(c){ out.push(c); });
  }
  return out;
};
// Cuántos intentos permite una pregunta de selección con n opciones: hasta 3,
// pero siempre debe quedar más de una opción para elegir (en verdadero/falso
// un error ya deja una sola: ahí hay un intento y luego la explicación).
R.maxIntentos = function(nOpciones){ return Math.max(1, Math.min(3, (nOpciones || 4) - 1)); };
R.fraccion = function(intento){ return [1, 0.5, 0.2][Math.min(Math.max(intento, 1), 3) - 1]; };
R.puntos = function(intento, base){ return Math.max(1, Math.round((base || 10) * R.fraccion(intento))); };
// Recuadro de pista tras un error. n = número de errores hasta ahora (1 o 2).
R.cajaPista = function(n, max, texto, extra){
  var quedan = max - n;
  return '<div class="rt-pista" role="status"><div class="rt-pista-t">💡 Pista ' + n + ' · te queda' + (quedan === 1 ? ' 1 intento' : 'n ' + quedan + ' intentos') + '</div>'
    + (extra ? '<div class="rt-pista-x">' + extra + '</div>' : '') + '<div>' + texto + '</div></div>';
};
// Recuadro final con la explicación completa.
// o = {ok, intentos, correcta (HTML), exp, elegidas:[respuestas equivocadas], porque:{respuesta: 'por qué no'}, pistas:[ya mostradas]}
R.cajaExplicacion = function(o){
  var h = '<div class="rt-expl"><div class="rt-expl-t">' + (o.titulo || '📘 Explicación completa') + '</div>';
  if(o.correcta != null && o.correcta !== '') h += '<div class="rt-expl-r"><span>Respuesta correcta:</span> <b>' + o.correcta + '</b></div>';
  if(o.exp) h += '<div class="rt-expl-e">' + o.exp + '</div>';
  var malas = [].concat(o.elegidas || []).filter(Boolean);
  if(malas.length){
    h += '<div class="rt-expl-m"><span>' + (malas.length === 1 ? 'Tu intento equivocado:' : 'Tus intentos equivocados:') + '</span><ul>'
      + malas.map(function(m){ var pq = o.porque && o.porque[m]; return '<li><s>' + m + '</s>' + (pq ? ' — ' + pq : '') + '</li>'; }).join('') + '</ul></div>';
  }
  if(o.intentos) h += '<div class="rt-expl-i">' + (o.ok ? 'Lo lograste en el intento ' + o.intentos + ' de 3.' : (o.intentos === 1 ? 'Esta pregunta tenía un solo intento.' : 'Se usaron los ' + o.intentos + ' intentos.')) + '</div>';
  return h + '</div>';
};

/* ───────── 2. Tiempos proporcionales a la dificultad ───────── */
// items: [{pal:'PALABRA', ...}]. Devuelve segundos.
R.tiempo = function(tipo, items, extra){
  items = [].concat(items || []);
  var L = items.map(function(it){ return (it.pal || letras(it.txt || it)).length; });
  var suma = L.reduce(function(a, b){ return a + b; }, 0);
  var lim = function(v, a, b){ return Math.round(Math.max(a, Math.min(b, v)) / 5) * 5; };
  if(tipo === 'crucigrama') return lim(items.length * 22 + suma * 4, 240, 900);    // 10 palabras ≈ 9 a 11 min
  if(tipo === 'sopa'){ var n = (extra && extra.lado) || 12; return lim(items.length * 20 + suma * 2 + n * n * 0.6, 180, 720); } // ≈ 6 a 8 min
  if(tipo === 'ahorcado'){                                                       // 1 palabra ≈ 1,5 a 3,5 min
    var w = items[0] ? (items[0].pal || letras(items[0].txt || items[0])) : '';
    var dist = {}; w.split('').forEach(function(c){ dist[c] = 1; });
    return lim(45 + Object.keys(dist).length * 10 + w.length * 2, 75, 240);
  }
  return 60;
};

// Toma n palabras del banco del sitio: BANCO_AHORCADO = [[palabra, grupo, pista1, pista2, pista3], ...]
// o = {grupos:[...] (opcional), max: largo máximo, min: largo mínimo}
R.elegir = function(banco, n, o){
  o = o || {};
  var vistos = {}, todos = [];
  (banco || []).forEach(function(w){
    var pal = letras(w[0]);
    if(!pal || vistos[pal]) return;
    if(o.max && pal.length > o.max) return;
    if(pal.length < (o.min || 3)) return;
    vistos[pal] = 1;
    todos.push({pal: pal, txt: w[0], grupo: w[1], pistas: [w[2], w[3], w[4]].filter(Boolean)});
  });
  var del = o.grupos && o.grupos.length ? todos.filter(function(it){ return o.grupos.indexOf(it.grupo) >= 0; }) : todos;
  var sel = barajar(del);
  // Si el grupo elegido no alcanza, se completa con el resto del banco del MISMO sitio.
  if(sel.length < n) sel = sel.concat(barajar(todos.filter(function(it){ return del.indexOf(it) < 0; })));
  return n ? sel.slice(0, n) : sel;
};

/* ───────── reloj ───────── */
function reloj(el, seg, alFin){
  var total = seg, quedan = seg, id = null;
  function pintar(){
    if(!el) return;
    var p = quedan / total;
    el.innerHTML = '⏱ <b>' + mmss(quedan) + '</b><i style="--p:' + (p * 100).toFixed(1) + '%"></i>';
    el.className = 'rt-reloj' + (p <= 0.15 ? ' rt-urge' : p <= 0.35 ? ' rt-poco' : '');
  }
  pintar();
  id = setInterval(function(){ quedan--; pintar(); if(quedan <= 0){ parar(); alFin(); } }, 1000);
  function parar(){ if(id){ clearInterval(id); id = null; } }
  return {parar: parar, quedan: function(){ return quedan; }, total: total};
}

/* ───────── estilos (una sola vez) ───────── */
var CSS = ''
+ '.rt-pista{margin:10px 0;border:1.5px solid #f0b429;background:#fff8e6;color:#5c3d00;border-radius:12px;padding:10px 14px;font-size:.95rem;line-height:1.5;animation:rtEntra .3s ease}'
+ '.rt-pista-t{font-weight:800;margin-bottom:3px;color:#8a5a00}.rt-pista-x{font-weight:700;margin-bottom:4px}'
+ '.rt-expl{margin-top:10px;border:1.5px solid #8fb3d9;background:#f2f7fd;color:#1b2b3d;border-radius:12px;padding:10px 14px;font-size:.93rem;line-height:1.55;text-align:left}'
+ '.rt-expl-t{font-weight:800;color:#1e4f86;margin-bottom:4px}.rt-expl-r span,.rt-expl-m span{color:#5a6b7d;font-weight:600}.rt-expl-e{margin:4px 0}'
+ '.rt-expl-m ul{margin:2px 0 0 18px;padding:0}.rt-expl-m s{color:#b42318}.rt-expl-i{font-size:.82rem;color:#5a6b7d;margin-top:4px}'
+ '@keyframes rtEntra{from{opacity:0;transform:translateY(-4px)}to{opacity:1;transform:none}}'
+ '.rt-box{font-family:inherit;color:#1b2b3d;text-align:left;background:#fff;border-radius:14px;padding:12px;box-shadow:0 1px 4px rgba(0,0,0,.08)}'  /* panel claro propio: se lee igual en modo oscuro */
+ '.rt-cab{display:flex;justify-content:space-between;align-items:center;gap:10px;flex-wrap:wrap;margin-bottom:6px}.rt-cab b{font-size:1.05rem}'
+ '.rt-reloj{position:relative;display:inline-flex;align-items:center;gap:6px;padding:4px 12px 7px;border-radius:999px;background:#eef4fb;color:#1e4f86;font-size:.95rem;overflow:hidden}'
+ '.rt-reloj i{position:absolute;left:0;bottom:0;height:3px;width:var(--p);background:#2f80d1;transition:width 1s linear}'
+ '.rt-reloj.rt-poco{background:#fff3df;color:#8a5a00}.rt-reloj.rt-poco i{background:#e8a317}.rt-reloj.rt-urge{background:#fde8e8;color:#b42318}.rt-reloj.rt-urge i{background:#d92d20}'
+ '.rt-inst{font-size:.88rem;color:#5a6b7d;margin:2px 0 10px}'
+ '.rt-btn{border:1.5px solid #c9d6e3;background:#fff;color:#1b2b3d;border-radius:10px;padding:9px 14px;font:inherit;font-weight:700;cursor:pointer;min-height:42px}'
+ '.rt-btn:disabled{opacity:.5;cursor:default}.rt-prim{background:#1e6fd9;border-color:#1e6fd9;color:#fff}'
+ '.rt-acc{display:flex;gap:8px;flex-wrap:wrap;margin:12px 0 4px}.rt-msg{font-size:.9rem;font-weight:600;min-height:1.2em;margin-top:6px}'
+ '.rt-msg.mal{color:#b42318}.rt-msg.bien{color:#11733d}'
/* crucigrama */
+ '.rt-cz-wrap{overflow-x:auto;padding:4px 2px 8px;-webkit-overflow-scrolling:touch}'
+ '.rt-cz{display:grid;gap:2px;width:max-content;margin:0 auto}'
+ '.rt-cz .rt-x{width:var(--cel);height:var(--cel)}'
+ '.rt-cz .rt-c{position:relative;width:var(--cel);height:var(--cel);background:#fff;border:1.5px solid #6b7f95;border-radius:4px}'
+ '.rt-cz .rt-c input{width:100%;height:100%;border:0;background:transparent;text-align:center;font:800 calc(var(--cel) * .5)/1 inherit;text-transform:uppercase;color:#1b2b3d;padding:0;caret-color:#1e6fd9;border-radius:3px}'
+ '.rt-cz .rt-c input:focus{outline:none;background:#ffe9a8}'
+ '.rt-cz .rt-c.rt-act{background:#e3efff}.rt-cz .rt-c.rt-ok{background:#d9f5e3;border-color:#2e9d5b}.rt-cz .rt-c.rt-dada{background:#fff1c2}'
+ '.rt-cz .rt-c.rt-rev{background:#fde8e8;border-color:#d92d20}.rt-cz .rt-c.rt-rev input{color:#b42318}'
+ '.rt-cz .rt-n{position:absolute;top:0;left:2px;font-size:calc(var(--cel) * .3);font-weight:700;color:#4a5d72;pointer-events:none;line-height:1}'
+ '.rt-cz-pistas{display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:12px;margin-top:8px}'
+ '.rt-cz-pistas h4{margin:4px 0;font-size:.95rem;color:#1e4f86}.rt-cz-pistas ol{list-style:none;margin:0;padding:0}'
+ '.rt-cz-pistas li{padding:6px 8px;border-radius:8px;margin-bottom:4px;font-size:.9rem;line-height:1.45;cursor:pointer;border:1.5px solid transparent}'
+ '.rt-cz-pistas li.rt-act{background:#e3efff;border-color:#9cc3f0}.rt-cz-pistas li.rt-ok{background:#ecfaf1;color:#11733d}.rt-cz-pistas li.rt-mal{border-color:#f3a8a3;background:#fff6f5}'
+ '.rt-cz-pistas li b.n{display:inline-block;min-width:1.6em}.rt-cz-pistas li .rt-mas{display:block;margin-top:3px;color:#8a5a00;font-size:.86rem}'
+ '.rt-cz-pistas li .rt-lr{color:#5a6b7d;font-size:.8rem}'
/* sopa */
+ '.rt-sp-wrap{display:flex;justify-content:center;overflow-x:auto;padding:4px 0 8px}'
+ '.rt-sp{display:grid;gap:1px;background:#c9d6e3;border:2px solid #6b7f95;border-radius:8px;overflow:hidden;touch-action:none;user-select:none;-webkit-user-select:none}'
+ '.rt-sp span{width:var(--cel);height:var(--cel);display:grid;place-items:center;background:#fff;font:800 calc(var(--cel) * .55)/1 inherit;color:#1b2b3d;cursor:pointer}'
+ '.rt-sp span.rt-sel{background:#ffe08a}.rt-sp span.rt-ini{background:#ffcf4a;box-shadow:inset 0 0 0 2px #b7791f}'
+ '.rt-sp span.rt-enc{color:#fff}.rt-sp span.rt-falt{background:#fde8e8;color:#b42318;box-shadow:inset 0 0 0 2px #d92d20}'
+ '.rt-sp span.rt-mira{animation:rtPulso 1s ease-in-out infinite}.rt-sp.rt-error span.rt-sel{background:#f7b4ae}'
+ '@keyframes rtPulso{0%,100%{box-shadow:inset 0 0 0 2px #e8a317}50%{box-shadow:inset 0 0 0 4px #e8a317;background:#fff3cf}}'
+ '.rt-sp-lista{list-style:none;margin:8px 0 0;padding:0;display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:6px}'
+ '.rt-sp-lista li{border:1.5px solid #dbe4ee;border-radius:10px;padding:7px 10px;font-size:.9rem;line-height:1.45;background:#fff}'
+ '.rt-sp-lista li.rt-ok{background:#ecfaf1;border-color:#9fdcb6}.rt-sp-lista li.rt-ok .rt-pal{color:#11733d}'
+ '.rt-sp-lista .rt-pal{font-weight:800;letter-spacing:.04em}.rt-sp-lista .rt-mas{display:block;color:#8a5a00;font-size:.86rem;margin-top:2px}'
+ '.rt-sp-lista button{margin-top:4px;border:1px solid #f0b429;background:#fff8e6;color:#8a5a00;border-radius:8px;padding:3px 9px;font:inherit;font-size:.8rem;font-weight:700;cursor:pointer}'
/* ahorcado */
+ '.rt-ah-top{display:flex;gap:14px;align-items:center;flex-wrap:wrap}.rt-ah-top svg{width:120px;height:110px;flex:0 0 auto}'
+ '.rt-ah-pistas{flex:1 1 220px;display:grid;gap:6px}.rt-ah-p{border-radius:10px;padding:7px 10px;font-size:.9rem;line-height:1.4;background:#f2f7fd;border:1.5px solid #c9dcf0}'
+ '.rt-ah-p.lock{background:#f6f7f9;border-style:dashed;color:#7b8794}.rt-ah-p b{color:#1e4f86}'
+ '.rt-ah-pal{display:flex;flex-wrap:wrap;gap:5px;justify-content:center;margin:14px 0}'
+ '.rt-ah-pal span{width:var(--t);height:calc(var(--t) * 1.2);border-bottom:3px solid #1b2b3d;display:grid;place-items:center;font:800 calc(var(--t) * .7)/1 inherit}'
+ '.rt-ah-pal span.esp{border:0;width:12px}.rt-ah-pal span.falto{color:#b42318}'
+ '.rt-ah-tec{display:flex;flex-wrap:wrap;gap:5px;justify-content:center}'
+ '.rt-ah-tec button{width:38px;height:42px;border-radius:8px;border:1.5px solid #c9d6e3;background:#fff;font:800 1rem inherit;cursor:pointer;color:#1b2b3d}'
+ '.rt-ah-tec button.si{background:#d9f5e3;border-color:#2e9d5b;color:#11733d}.rt-ah-tec button.no{background:#f1f3f5;color:#9aa5b1;text-decoration:line-through}'
/* resumen */
+ '.rt-res{margin-top:12px}.rt-res h4{margin:6px 0;color:#1e4f86}.rt-res ol{margin:0;padding-left:20px}.rt-res li{margin:6px 0;line-height:1.5;font-size:.92rem}'
+ '.rt-res li .rt-ok{color:#11733d;font-weight:800}.rt-res li .rt-no{color:#b42318;font-weight:800}.rt-res li small{color:#5a6b7d}';
function estilos(){
  if(document.getElementById('rt-css')) return;
  var s = document.createElement('style'); s.id = 'rt-css'; s.textContent = CSS; document.head.appendChild(s);
}
R.estilos = estilos;

function resumenHTML(titulo, filas){
  return '<div class="rt-res"><h4>' + titulo + '</h4><ol>' + filas.map(function(f){
    var it = f.item;
    return '<li><span class="' + (f.ok ? 'rt-ok">✓ ' : 'rt-no">✗ ') + esc(it.txt) + '</span>'
      + (f.ok ? ' <small>(+' + f.puntos + ' pts' + (f.detalle ? ', ' + f.detalle : '') + ')</small>' : '')
      + '<br>' + it.pistas.map(esc).join(' ') + '</li>';
  }).join('') + '</ol></div>';
}

/* ═════════════════ CRUCIGRAMA ═════════════════ */
// Arma un crucigrama con hasta n palabras conectadas. Prueba varias
// selecciones al azar y se queda con la que ubica más palabras.
function armarCruci(cands, n, rnd){
  var mejor = null;
  for(var intento = 0; intento < 40; intento++){
    var lista = barajar(cands, rnd);
    var r = ubicar(lista, n, rnd);
    if(!mejor || r.length > mejor.length) mejor = r;
    if(mejor.length >= n) break;
  }
  return mejor;
}
function ubicar(lista, n, rnd){
  rnd = rnd || Math.random;
  var G = {}, usadas = [];
  function k(r, c){ return r + ',' + c; }
  function celda(r, c){ return G[k(r, c)]; }
  function cabe(p, r, c, dir){
    var dr = dir === 'V' ? 1 : 0, dc = dir === 'H' ? 1 : 0, cruces = 0;
    if(celda(r - dr, c - dc) || celda(r + dr * p.length, c + dc * p.length)) return -1;
    for(var i = 0; i < p.length; i++){
      var rr = r + dr * i, cc = c + dc * i, g = celda(rr, cc);
      if(g){
        if(g.l !== p[i] || g[dir]) return -1;
        cruces++;
      } else {
        // a los lados no puede haber letras: formarían palabras «accidentales»
        if(celda(rr + dc, cc + dr) || celda(rr - dc, cc - dr)) return -1;
      }
    }
    return cruces;
  }
  function poner(it, r, c, dir){
    var dr = dir === 'V' ? 1 : 0, dc = dir === 'H' ? 1 : 0, p = it.pal;
    for(var i = 0; i < p.length; i++){
      var key = k(r + dr * i, c + dc * i);
      G[key] = G[key] || {l: p[i]};
      G[key][dir] = 1;
    }
    usadas.push({item: it, r: r, c: c, dir: dir});
  }
  for(var w = 0; w < lista.length && usadas.length < n; w++){
    var it = lista[w], p = it.pal;
    if(!usadas.length){ poner(it, 0, 0, 'H'); continue; }
    var ops = [];
    usadas.forEach(function(u){
      for(var i = 0; i < u.item.pal.length; i++){
        var ur = u.r + (u.dir === 'V' ? i : 0), uc = u.c + (u.dir === 'H' ? i : 0);
        for(var j = 0; j < p.length; j++){
          if(p[j] !== u.item.pal[i]) continue;
          var dir = u.dir === 'H' ? 'V' : 'H';
          var r0 = dir === 'V' ? ur - j : ur, c0 = dir === 'H' ? uc - j : uc;
          var cr = cabe(p, r0, c0, dir);
          if(cr > 0) ops.push({r: r0, c: c0, dir: dir, cr: cr});
        }
      }
    });
    if(!ops.length) continue;
    // Preferir más cruces y una forma compacta.
    ops.forEach(function(o){
      var rs = [o.r, o.r + (o.dir === 'V' ? p.length - 1 : 0)], cs = [o.c, o.c + (o.dir === 'H' ? p.length - 1 : 0)];
      usadas.forEach(function(u){ rs.push(u.r, u.r + (u.dir === 'V' ? u.item.pal.length - 1 : 0)); cs.push(u.c, u.c + (u.dir === 'H' ? u.item.pal.length - 1 : 0)); });
      var alto = Math.max.apply(null, rs) - Math.min.apply(null, rs) + 1, ancho = Math.max.apply(null, cs) - Math.min.apply(null, cs) + 1;
      o.s = o.cr * 30 - Math.max(alto, ancho) * 2 - Math.abs(alto - ancho) + rnd() * 6;
    });
    ops.sort(function(a, b){ return b.s - a.s; });
    poner(it, ops[0].r, ops[0].c, ops[0].dir);
  }
  return usadas;
}

/* Crucigrama con semilla para las hojas impresas del panel docente:
   cands = [{pal, txt, pistas}], rnd = función de azar con semilla.
   Devuelve {F, C, palabras:[{item, r, c, dir:'H'|'V', num}]}, ya numerado. */
R.armarCrucigrama = function(cands, n, rnd){
  var pal = armarCruci(cands, n, rnd);
  var minR = Infinity, minC = Infinity, maxR = -Infinity, maxC = -Infinity;
  pal.forEach(function(w){ var L = w.item.pal.length;
    minR = Math.min(minR, w.r); minC = Math.min(minC, w.c);
    maxR = Math.max(maxR, w.r + (w.dir === 'V' ? L - 1 : 0)); maxC = Math.max(maxC, w.c + (w.dir === 'H' ? L - 1 : 0)); });
  pal.forEach(function(w){ w.r -= minR; w.c -= minC; });
  var inicios = pal.map(function(w){ return w.r * 1000 + w.c; }).filter(function(v, i, a){ return a.indexOf(v) === i; }).sort(function(a, b){ return a - b; });
  pal.forEach(function(w){ w.num = inicios.indexOf(w.r * 1000 + w.c) + 1; });
  pal.sort(function(a, b){ return a.num - b.num || (a.dir === 'H' ? -1 : 1); });
  return {F: maxR - minR + 1, C: maxC - minC + 1, palabras: pal};
};

R.crucigrama = function(el, banco, o){
  estilos(); o = o || {};
  var N = o.n || 10;
  var cands = o.fijas ? o.fijas.slice() : R.elegir(banco, 0, {grupos: o.grupos, max: 15, min: 4});
  var pref = cands.slice(0, Math.max(N * 3, 24));
  var pal = armarCruci(pref, N);
  if(pal.length < N) pal = armarCruci(cands, N);
  // normalizar coordenadas y numerar
  var minR = Infinity, minC = Infinity, maxR = -Infinity, maxC = -Infinity;
  pal.forEach(function(w){
    var L = w.item.pal.length;
    minR = Math.min(minR, w.r); minC = Math.min(minC, w.c);
    maxR = Math.max(maxR, w.r + (w.dir === 'V' ? L - 1 : 0)); maxC = Math.max(maxC, w.c + (w.dir === 'H' ? L - 1 : 0));
  });
  var F = maxR - minR + 1, C = maxC - minC + 1, celdas = {};
  pal.forEach(function(w){
    w.r -= minR; w.c -= minC; w.cel = [];
    for(var i = 0; i < w.item.pal.length; i++){
      var r = w.r + (w.dir === 'V' ? i : 0), c = w.c + (w.dir === 'H' ? i : 0), key = r + ',' + c;
      celdas[key] = celdas[key] || {r: r, c: c, l: w.item.pal[i], pal: []};
      celdas[key].pal.push(w); w.cel.push(celdas[key]);
    }
    w.estado = 'pend'; w.pistas = 1; w.puntos = 0;
  });
  var inicios = pal.map(function(w){ return w.r * 1000 + w.c; }).filter(function(v, i, a){ return a.indexOf(v) === i; }).sort(function(a, b){ return a - b; });
  pal.forEach(function(w){ w.num = inicios.indexOf(w.r * 1000 + w.c) + 1; });
  pal.sort(function(a, b){ return a.num - b.num || (a.dir === 'H' ? -1 : 1); });

  var seg = o.segundos || R.tiempo('crucigrama', pal.map(function(w){ return w.item; }));
  var comprobaciones = 0, MAXC = 3, fin = false, actual = null, dirAct = 'H', aviso = false;
  var anchoDisp = Math.max(250, (el.clientWidth || 340) - 36);   // descuenta el margen del panel
  var cel = Math.max(21, Math.min(36, Math.floor((anchoDisp - (C - 1) * 2) / C)));

  var grid = '';
  for(var r = 0; r < F; r++) for(var c = 0; c < C; c++){
    var ce = celdas[r + ',' + c];
    if(!ce){ grid += '<div class="rt-x"></div>'; continue; }
    var num = pal.filter(function(w){ return w.r === r && w.c === c; })[0];
    grid += '<div class="rt-c" data-k="' + r + ',' + c + '">' + (num ? '<span class="rt-n">' + num.num + '</span>' : '')
      + '<input maxlength="2" autocomplete="off" autocapitalize="characters" spellcheck="false" aria-label="Fila ' + (r + 1) + ', columna ' + (c + 1) + '"></div>';
  }
  function lista(dir){
    return pal.filter(function(w){ return w.dir === dir; }).map(function(w){
      return '<li data-w="' + pal.indexOf(w) + '"><b class="n">' + w.num + '.</b>' + esc(w.item.pistas[0]) + ' <span class="rt-lr">(' + w.item.pal.length + ' letras)</span><span class="rt-mas"></span></li>';
    }).join('');
  }
  el.innerHTML = '<div class="rt-box rt-cruci">'
    + '<div class="rt-cab"><b>🔤 Crucigrama · ' + pal.length + ' palabras</b><span class="rt-reloj"></span></div>'
    + '<p class="rt-inst">Toca una pista o una casilla y escribe. Tienes <b>3 comprobaciones</b>: tras cada una, las palabras que aún no están bien reciben una pista nueva. Puntos por palabra: 10 en la 1.ª, 5 en la 2.ª y 2 en la 3.ª.</p>'
    + '<div class="rt-cz-wrap"><div class="rt-cz" style="--cel:' + cel + 'px;grid-template-columns:repeat(' + C + ',var(--cel))">' + grid + '</div></div>'
    + '<div class="rt-cz-pistas"><div><h4>➡ Horizontales</h4><ol>' + lista('H') + '</ol></div><div><h4>⬇ Verticales</h4><ol>' + lista('V') + '</ol></div></div>'
    + '<div class="rt-acc"><button type="button" class="rt-btn rt-prim" data-a="comp">✔ Comprobar (1 de 3)</button><button type="button" class="rt-btn" data-a="fin">Terminar y ver respuestas</button></div>'
    + '<div class="rt-msg" aria-live="polite"></div><div class="rt-final"></div></div>';
  var box = el.querySelector('.rt-cruci'), msg = box.querySelector('.rt-msg');
  Object.keys(celdas).forEach(function(key){
    var d = box.querySelector('.rt-c[data-k="' + key + '"]');
    celdas[key].div = d; celdas[key].inp = d.querySelector('input');
  });
  function valor(ce){ return ce.inp.value; }
  function marcar(w){
    actual = w;
    box.querySelectorAll('.rt-c.rt-act').forEach(function(d){ d.classList.remove('rt-act'); });
    box.querySelectorAll('.rt-cz-pistas li.rt-act').forEach(function(d){ d.classList.remove('rt-act'); });
    if(!w) return;
    dirAct = w.dir;
    w.cel.forEach(function(ce){ ce.div.classList.add('rt-act'); });
    var li = box.querySelector('li[data-w="' + pal.indexOf(w) + '"]'); if(li) li.classList.add('rt-act');
  }
  function libre(ce){ return !ce.inp.readOnly; }
  // Pasa a la casilla vecina de la palabra (aunque ya esté resuelta: así el
  // estudiante puede escribir la palabra completa de corrido).
  function siguiente(ce, paso){
    if(!actual) return;
    var i = actual.cel.indexOf(ce), j = i + paso;
    if(j >= 0 && j < actual.cel.length) actual.cel[j].inp.focus();
  }
  function elegirPalabra(ce){
    var pend = ce.pal.filter(function(x){ return x.estado === 'pend'; });
    var op = pend.length ? pend : ce.pal;
    var w = op.filter(function(x){ return x.dir === dirAct; })[0] || op[0];
    if(actual && ce.pal.indexOf(actual) >= 0) w = actual;
    marcar(w);
  }
  Object.keys(celdas).forEach(function(key){
    var ce = celdas[key], inp = ce.inp;
    inp.addEventListener('focus', function(){ if(!actual || ce.pal.indexOf(actual) < 0) elegirPalabra(ce); else marcar(actual); });
    inp.addEventListener('click', function(){
      if(ce.pal.length > 1 && actual && ce.pal.indexOf(actual) >= 0 && document.activeElement === inp && inp.dataset.toc === '1'){
        marcar(ce.pal.filter(function(x){ return x !== actual; })[0]);
      }
      inp.dataset.toc = '1';
    });
    inp.addEventListener('blur', function(){ inp.dataset.toc = ''; });
    inp.addEventListener('input', function(){
      if(inp.readOnly) return;
      var v = letras(inp.value); v = v.slice(-1);
      inp.value = v; aviso = false;
      if(v) siguiente(ce, 1);
    });
    inp.addEventListener('keydown', function(e){
      // Casilla ya resuelta (cruce con una palabra correcta o letra regalada):
      // la letra se escribe en la siguiente casilla libre de la palabra.
      if(inp.readOnly && !fin && e.key && e.key.length === 1 && letras(e.key) && actual){
        e.preventDefault();
        var L = letras(e.key).slice(-1);
        if(L === inp.value){ siguiente(ce, 1); return; }   // escribió la misma letra: sigue
        var i = actual.cel.indexOf(ce);
        for(var j = i + 1; j < actual.cel.length; j++){ var nx = actual.cel[j]; if(libre(nx)){ nx.inp.value = L; aviso = false; siguiente(nx, 1); break; } }
        return;
      }
      if(e.key === 'Backspace' && !inp.value){ e.preventDefault(); siguiente(ce, -1); }
      else if(e.key === 'Enter'){ e.preventDefault(); comprobar(); }
      else if(/^Arrow/.test(e.key)){
        e.preventDefault();
        var dr = e.key === 'ArrowDown' ? 1 : e.key === 'ArrowUp' ? -1 : 0, dc = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
        var nx = celdas[(ce.r + dr) + ',' + (ce.c + dc)];
        if(nx){ dirAct = dr ? 'V' : 'H'; marcar(nx.pal.filter(function(x){ return x.dir === dirAct; })[0] || nx.pal[0]); nx.inp.focus(); }
      }
    });
  });
  box.querySelectorAll('.rt-cz-pistas li').forEach(function(li){
    li.addEventListener('click', function(){
      if(fin) return;
      var w = pal[+li.getAttribute('data-w')]; marcar(w);
      var ce = w.cel.filter(function(x){ return libre(x) && !x.inp.value; })[0] || w.cel.filter(libre)[0];
      if(ce) ce.inp.focus();
    });
  });
  var rel = reloj(box.querySelector('.rt-reloj'), seg, function(){ terminar('tiempo'); });
  var bComp = box.querySelector('[data-a="comp"]');
  bComp.addEventListener('click', comprobar);
  box.querySelector('[data-a="fin"]').addEventListener('click', function(){
    if(fin) return;
    if(!aviso){ aviso = true; msg.className = 'rt-msg mal'; msg.textContent = 'Si terminas ahora, las palabras que falten cuentan como no resueltas. Toca otra vez «Terminar» para confirmar.'; return; }
    terminar('rendir');
  });
  function comprobar(){
    if(fin) return;
    var pend = pal.filter(function(w){ return w.estado === 'pend'; });
    var vacias = 0;
    pend.forEach(function(w){ w.cel.forEach(function(ce){ if(!valor(ce)) vacias++; }); });
    if(vacias && !aviso){
      aviso = true; msg.className = 'rt-msg mal';
      msg.textContent = 'Te faltan ' + vacias + ' casilla' + (vacias === 1 ? '' : 's') + ' por llenar. Si compruebas ahora gastas una de tus 3 comprobaciones: toca «Comprobar» otra vez para seguir.';
      return;
    }
    aviso = false; comprobaciones++;
    var bien = 0, malas = [];
    pend.forEach(function(w){
      var ok = w.cel.every(function(ce){ return valor(ce) === ce.l; });
      var li = box.querySelector('li[data-w="' + pal.indexOf(w) + '"]');
      if(ok){
        w.estado = 'ok'; w.intento = comprobaciones; w.puntos = [10, 5, 2][comprobaciones - 1]; bien++;
        w.cel.forEach(function(ce){ ce.div.classList.add('rt-ok'); ce.div.classList.remove('rt-dada'); ce.inp.readOnly = true; });
        li.classList.remove('rt-mal'); li.classList.add('rt-ok');
        li.querySelector('.rt-mas').textContent = '✓ ' + w.item.txt;
      } else malas.push(w);
    });
    if(!malas.length || comprobaciones >= MAXC){ terminar('fin'); return; }
    // pistas nuevas para las que siguen mal
    malas.forEach(function(w){
      var li = box.querySelector('li[data-w="' + pal.indexOf(w) + '"]');
      li.classList.add('rt-mal');
      w.pistas = Math.min(3, comprobaciones + 1);
      var extra = '💡 ' + esc(w.item.pistas[w.pistas - 1] || '');
      if(comprobaciones === 2){
        // segunda vez: además se regala la primera letra
        var ce = w.cel[0];
        if(!ce.inp.readOnly){ ce.inp.value = ce.l; ce.inp.readOnly = true; ce.div.classList.add('rt-dada'); }
        extra += ' <i>(Te dimos la primera letra.)</i>';
      }
      li.querySelector('.rt-mas').innerHTML = extra;
    });
    msg.className = 'rt-msg ' + (bien ? 'bien' : 'mal');
    msg.textContent = (bien ? '✓ ' + bien + ' palabra' + (bien === 1 ? '' : 's') + ' bien. ' : '') + '✗ ' + malas.length + ' por corregir: mira las pistas nuevas (en rojo).'
      + ' Te queda' + (MAXC - comprobaciones === 1 ? ' 1 comprobación.' : 'n ' + (MAXC - comprobaciones) + ' comprobaciones.');
    bComp.textContent = '✔ Comprobar (' + (comprobaciones + 1) + ' de 3)';
  }
  function terminar(motivo){
    if(fin) return; fin = true; rel.parar(); marcar(null);
    pal.forEach(function(w){
      if(w.estado === 'ok') return;
      w.estado = 'no';
      w.cel.forEach(function(ce){ if(!ce.div.classList.contains('rt-ok')){ ce.div.classList.remove('rt-dada'); ce.div.classList.add('rt-rev'); ce.inp.value = ce.l; } });
    });
    box.querySelectorAll('input').forEach(function(i){ i.readOnly = true; });
    box.querySelectorAll('.rt-acc button').forEach(function(b){ b.disabled = true; });
    var res = pal.map(function(w){ return {item: w.item, ok: w.estado === 'ok', puntos: w.puntos, intento: w.intento || 0, detalle: w.intento ? 'comprobación ' + w.intento : ''}; });
    var okN = res.filter(function(x){ return x.ok; }).length, pts = res.reduce(function(a, x){ return a + x.puntos; }, 0);
    msg.className = 'rt-msg ' + (okN === pal.length ? 'bien' : 'mal');
    msg.textContent = (motivo === 'tiempo' ? '⏰ ¡Se acabó el tiempo! ' : '') + 'Resolviste ' + okN + ' de ' + pal.length + ' palabras (' + pts + ' puntos).' + (okN < pal.length ? ' En rojo quedaron las que faltaban.' : '');
    box.querySelector('.rt-final').innerHTML = resumenHTML('📘 Las ' + pal.length + ' palabras y lo que significan', res);
    if(o.onFin) o.onFin({resultados: res, puntos: pts, maximo: pal.length * 10, motivo: motivo});
  }
  return {terminar: function(){ terminar('tiempo'); }, palabras: pal};
};

/* ═════════════════ SOPA DE LETRAS ═════════════════ */
var FREC = 'AAAAAAAAAAAAEEEEEEEEEEEEEOOOOOOOOOIIIIIIUUUUSSSSSSRRRRRRNNNNNNLLLLLDDDDDTTTTCCCCMMMPPPBBGGVYQHFZJÑXK';
var DIRS = [[0, 1], [1, 0], [1, 1], [-1, 1]];
function armarSopa(items){
  var largo = Math.max.apply(null, items.map(function(it){ return it.pal.length; }));
  var lado = Math.max(11, Math.min(16, largo + 1));
  for(var vuelta = 0; vuelta < 60; vuelta++){
    var M = [], i, j, pos = [], ok = true;
    for(i = 0; i < lado; i++){ M.push([]); for(j = 0; j < lado; j++) M[i].push(''); }
    var orden = items.slice().sort(function(a, b){ return b.pal.length - a.pal.length; });
    for(var w = 0; w < orden.length && ok; w++){
      var p = orden[w].pal, puesto = false;
      for(var t = 0; t < 400 && !puesto; t++){
        var d = DIRS[Math.floor(Math.random() * DIRS.length)];
        var r0 = Math.floor(Math.random() * lado), c0 = Math.floor(Math.random() * lado);
        var rf = r0 + d[0] * (p.length - 1), cf = c0 + d[1] * (p.length - 1);
        if(rf < 0 || rf >= lado || cf < 0 || cf >= lado) continue;
        var cabe = true;
        for(i = 0; i < p.length; i++){ var x = M[r0 + d[0] * i][c0 + d[1] * i]; if(x && x !== p[i]){ cabe = false; break; } }
        if(!cabe) continue;
        for(i = 0; i < p.length; i++) M[r0 + d[0] * i][c0 + d[1] * i] = p[i];
        pos.push({item: orden[w], r: r0, c: c0, d: d}); puesto = true;
      }
      if(!puesto) ok = false;
    }
    if(!ok) continue;
    for(var relleno = 0; relleno < 15; relleno++){
      var R2 = M.map(function(f){ return f.map(function(x){ return x || FREC[Math.floor(Math.random() * FREC.length)]; }); });
      if(unica(R2, items)) return {M: R2, pos: pos, lado: lado};
    }
  }
  return null;
}
// Cada palabra debe aparecer una sola vez (en 8 direcciones), sin respuestas repetidas.
function unica(M, items){
  var n = M.length, D8 = [[0,1],[1,0],[1,1],[-1,1],[0,-1],[-1,0],[-1,-1],[1,-1]];
  return items.every(function(it){
    var p = it.pal, cuenta = 0;
    for(var r = 0; r < n; r++) for(var c = 0; c < n; c++){
      if(M[r][c] !== p[0]) continue;
      for(var k = 0; k < 8; k++){
        var d = D8[k], i = 0;
        for(; i < p.length; i++){ var rr = r + d[0] * i, cc = c + d[1] * i; if(rr < 0 || rr >= n || cc < 0 || cc >= n || M[rr][cc] !== p[i]) break; }
        if(i === p.length) cuenta++;
      }
    }
    // un palíndromo se cuenta dos veces (ida y vuelta)
    return cuenta === (p === p.split('').reverse().join('') ? 2 : 1);
  });
}
var COLORES = ['#2f80d1','#2e9d5b','#d9822b','#8e44ad','#c0392b','#16a085','#b7791f','#2c3e9e','#d35400','#7f8c8d','#1abc9c','#e91e63'];
R.sopa = function(el, banco, o){
  estilos(); o = o || {};
  var N = o.n || 10, sopa = null, items = null;
  for(var t = 0; t < 8 && !sopa; t++){
    items = R.elegir(banco, N, {grupos: o.grupos, max: 14, min: 4});
    sopa = armarSopa(items);
  }
  if(!sopa){ el.innerHTML = '<p>No se pudo armar la sopa de letras. Intenta de nuevo.</p>'; return null; }
  var M = sopa.M, lado = sopa.lado;
  var est = sopa.pos.map(function(p){ return {item: p.item, r: p.r, c: p.c, d: p.d, ok: false, pistas: 1, puntos: 0}; });
  est.sort(function(a, b){ return items.indexOf(a.item) - items.indexOf(b.item); });
  var seg = o.segundos || R.tiempo('sopa', items, {lado: lado}), fin = false, ini = null, arr = null, aviso = false;
  var anchoDisp = Math.max(250, (el.clientWidth || 340) - 36);   // descuenta el margen del panel
  var cel = Math.max(19, Math.min(34, Math.floor((anchoDisp - 6) / lado) - 1));
  var g = '';
  for(var r = 0; r < lado; r++) for(var c = 0; c < lado; c++) g += '<span data-r="' + r + '" data-c="' + c + '">' + M[r][c] + '</span>';
  el.innerHTML = '<div class="rt-box rt-sopa">'
    + '<div class="rt-cab"><b>🔍 Sopa de letras · ' + est.length + ' palabras</b><span class="rt-reloj"></span></div>'
    + '<p class="rt-inst">Lee cada pista, piensa la palabra y búscala: arrastra de la primera a la última letra (o toca la primera y luego la última). Las palabras van → ↓ ↘ ↗. Si te atascas, pide otra pista (hasta 3 por palabra): 10 puntos con 1 pista, 5 con 2 y 2 con 3.</p>'
    + '<div class="rt-sp-wrap"><div class="rt-sp" style="--cel:' + cel + 'px;grid-template-columns:repeat(' + lado + ',var(--cel))">' + g + '</div></div>'
    + '<ol class="rt-sp-lista">' + est.map(function(e, i){
        return '<li data-i="' + i + '"><b>' + (i + 1) + '.</b> ' + esc(e.item.pistas[0]) + ' <span class="rt-pal">(' + e.item.pal.length + ' letras)</span><span class="rt-mas"></span><button type="button" data-p="' + i + '">💡 Otra pista</button></li>';
      }).join('') + '</ol>'
    + '<div class="rt-acc"><button type="button" class="rt-btn" data-a="fin">Terminar y ver respuestas</button></div>'
    + '<div class="rt-msg" aria-live="polite"></div><div class="rt-final"></div></div>';
  var box = el.querySelector('.rt-sopa'), grid = box.querySelector('.rt-sp'), msg = box.querySelector('.rt-msg');
  function span(r, c){ return grid.querySelector('span[data-r="' + r + '"][data-c="' + c + '"]'); }
  function linea(a, b){
    if(!a || !b) return null;
    var dr = b.r - a.r, dc = b.c - a.c, n = Math.max(Math.abs(dr), Math.abs(dc));
    if(n === 0) return [a];
    if(dr !== 0 && dc !== 0 && Math.abs(dr) !== Math.abs(dc)) return null;
    var sr = dr / n, sc = dc / n, out = [];
    for(var i = 0; i <= n; i++) out.push({r: a.r + sr * i, c: a.c + sc * i});
    return out;
  }
  function limpiarSel(){ grid.querySelectorAll('.rt-sel').forEach(function(s){ s.classList.remove('rt-sel'); }); }
  function pintarSel(l){ limpiarSel(); (l || []).forEach(function(p){ span(p.r, p.c).classList.add('rt-sel'); }); }
  function rc(ev){
    var t = document.elementFromPoint(ev.clientX, ev.clientY);
    if(!t || !t.dataset || t.dataset.r == null || !grid.contains(t)) return null;
    return {r: +t.dataset.r, c: +t.dataset.c};
  }
  var arrastrando = false, movio = false;
  grid.addEventListener('pointerdown', function(ev){
    if(fin) return; var p = rc(ev); if(!p) return;
    ev.preventDefault();
    if(ini && !arrastrando && (ini.r !== p.r || ini.c !== p.c)){ // segundo toque del modo «tocar y tocar»
      evaluar(linea(ini, p)); quitarIni(); return;
    }
    arrastrando = true; movio = false; arr = p; pintarSel([p]);
    try{ grid.setPointerCapture(ev.pointerId); }catch(e){}
  });
  grid.addEventListener('pointermove', function(ev){
    if(!arrastrando) return; var p = rc(ev); if(!p) return;
    if(p.r !== arr.r || p.c !== arr.c) movio = true;
    var l = linea(arr, p); if(l) pintarSel(l);
  });
  grid.addEventListener('pointerup', function(ev){
    if(!arrastrando) return; arrastrando = false;
    var p = rc(ev) || arr;
    if(!movio || (p.r === arr.r && p.c === arr.c)){
      limpiarSel();
      if(ini && ini.r === arr.r && ini.c === arr.c){ quitarIni(); return; }
      quitarIni(); ini = arr; span(ini.r, ini.c).classList.add('rt-ini'); return;
    }
    evaluar(linea(arr, p)); quitarIni();
  });
  function quitarIni(){ if(ini){ var s = span(ini.r, ini.c); if(s) s.classList.remove('rt-ini'); } ini = null; }
  function evaluar(l){
    if(!l || l.length < 2){ limpiarSel(); return; }
    pintarSel(l);
    var s = l.map(function(p){ return M[p.r][p.c]; }).join(''), sr = s.split('').reverse().join('');
    var e = est.filter(function(x){
      if(x.ok || (x.item.pal !== s && x.item.pal !== sr) || l.length !== x.item.pal.length) return false;
      var a = l[0], b = l[l.length - 1], fr = x.r + x.d[0] * (x.item.pal.length - 1), fc = x.c + x.d[1] * (x.item.pal.length - 1);
      return (a.r === x.r && a.c === x.c && b.r === fr && b.c === fc) || (b.r === x.r && b.c === x.c && a.r === fr && a.c === fc);
    })[0];
    if(!e){
      grid.classList.add('rt-error'); msg.className = 'rt-msg mal'; msg.textContent = '✗ «' + s + '» no es ninguna de las palabras. Revisa las pistas.';
      setTimeout(function(){ grid.classList.remove('rt-error'); limpiarSel(); }, 650);
      return;
    }
    limpiarSel();
    e.ok = true; e.puntos = [10, 5, 2][e.pistas - 1];
    var col = COLORES[est.indexOf(e) % COLORES.length];
    l.forEach(function(p){ var sp = span(p.r, p.c); sp.classList.add('rt-enc'); sp.classList.remove('rt-mira'); sp.style.background = col; });
    var li = box.querySelector('li[data-i="' + est.indexOf(e) + '"]');
    li.classList.add('rt-ok'); li.querySelector('.rt-pal').textContent = '✓ ' + e.item.txt;
    var bt = li.querySelector('button'); if(bt) bt.remove();
    var faltan = est.filter(function(x){ return !x.ok; }).length;
    msg.className = 'rt-msg bien'; msg.textContent = '✓ ¡Encontraste ' + e.item.txt + '! +' + e.puntos + ' puntos.' + (faltan ? ' Faltan ' + faltan + '.' : '');
    if(!faltan) terminar('fin');
  }
  box.querySelectorAll('[data-p]').forEach(function(b){
    b.addEventListener('click', function(){
      if(fin) return;
      var e = est[+b.getAttribute('data-p')], li = b.parentNode;
      if(e.ok || e.pistas >= 3) return;
      e.pistas++;
      var h = '💡 ' + esc(e.item.pistas[e.pistas - 1] || '');
      if(e.pistas === 3){
        h += ' <i>(La primera letra parpadea en la sopa.)</i>';
        span(e.r, e.c).classList.add('rt-mira');
        b.remove();
      } else b.textContent = '💡 Última pista (vale 2 puntos)';
      li.querySelector('.rt-mas').innerHTML += (li.querySelector('.rt-mas').innerHTML ? '<br>' : '') + h;
    });
  });
  var rel = reloj(box.querySelector('.rt-reloj'), seg, function(){ terminar('tiempo'); });
  box.querySelector('[data-a="fin"]').addEventListener('click', function(){
    if(fin) return;
    if(!aviso){ aviso = true; msg.className = 'rt-msg mal'; msg.textContent = 'Si terminas ahora, las palabras que falten cuentan como no encontradas. Toca otra vez «Terminar» para confirmar.'; return; }
    terminar('rendir');
  });
  function terminar(motivo){
    if(fin) return; fin = true; rel.parar(); quitarIni(); limpiarSel();
    est.forEach(function(e){
      if(e.ok) return;
      for(var i = 0; i < e.item.pal.length; i++){ var sp = span(e.r + e.d[0] * i, e.c + e.d[1] * i); if(!sp.classList.contains('rt-enc')) sp.classList.add('rt-falt'); sp.classList.remove('rt-mira'); }
      var li = box.querySelector('li[data-i="' + est.indexOf(e) + '"]');
      li.querySelector('.rt-pal').textContent = '✗ ' + e.item.txt;
      var bt = li.querySelector('button'); if(bt) bt.remove();
    });
    box.querySelector('.rt-acc button').disabled = true;
    var res = est.map(function(e){ return {item: e.item, ok: e.ok, puntos: e.puntos, intento: e.ok ? e.pistas : 0, detalle: e.ok ? 'con ' + e.pistas + ' pista' + (e.pistas === 1 ? '' : 's') : ''}; });
    var okN = res.filter(function(x){ return x.ok; }).length, pts = res.reduce(function(a, x){ return a + x.puntos; }, 0);
    msg.className = 'rt-msg ' + (okN === est.length ? 'bien' : 'mal');
    msg.textContent = (motivo === 'tiempo' ? '⏰ ¡Se acabó el tiempo! ' : '') + 'Encontraste ' + okN + ' de ' + est.length + ' palabras (' + pts + ' puntos).' + (okN < est.length ? ' Las que faltaban quedaron marcadas en rojo.' : '');
    box.querySelector('.rt-final').innerHTML = resumenHTML('📘 Las ' + est.length + ' palabras y lo que significan', res);
    if(o.onFin) o.onFin({resultados: res, puntos: pts, maximo: est.length * 10, motivo: motivo});
  }
  return {terminar: function(){ terminar('tiempo'); }, palabras: est};
};

/* ═════════════════ AHORCADO ═════════════════
   Para los sitios que no tienen uno propio (BioNom). Un ítem
   {txt, pal, pistas:[1,2,3]}. 6 fallos. La pista 1 se ve desde el
   principio; la 2 aparece sola al 2.º fallo y la 3 al 4.º (o antes, si el
   estudiante la pide). Puntos: 10 solo con la pista 1, 6 con dos, 3 con tres. */
R.ahorcado = function(el, item, o){
  estilos(); o = o || {};
  var MAXF = 6, pal = String(item.txt).toUpperCase(), usadas = {}, fallos = 0, nP = 1, fin = false;
  var base = function(ch){ return ch === 'Ñ' ? 'Ñ' : sinTilde(ch); };
  var B = pal.split('').map(base).join('');
  var seg = o.segundos || R.tiempo('ahorcado', [item]);
  el.innerHTML = '<div class="rt-box rt-ah"><div class="rt-cab"><b>🔠 Ahorcado</b><span class="rt-reloj"></span></div><div class="rt-ah-cuerpo"></div><div class="rt-msg" aria-live="polite"></div><div class="rt-final"></div></div>';
  var box = el.querySelector('.rt-ah'), cuerpo = box.querySelector('.rt-ah-cuerpo'), msg = box.querySelector('.rt-msg');
  function dibujo(f){
    var p = ['<circle cx="100" cy="44" r="12"/>','<line x1="100" y1="56" x2="100" y2="90"/>','<line x1="100" y1="64" x2="84" y2="80"/>','<line x1="100" y1="64" x2="116" y2="80"/>','<line x1="100" y1="90" x2="88" y2="112"/>','<line x1="100" y1="90" x2="112" y2="112"/>'];
    return '<svg viewBox="0 0 140 125" role="img" aria-label="Fallos: ' + f + ' de ' + MAXF + '"><g stroke="#1e4f86" stroke-width="5" stroke-linecap="round" fill="none"><line x1="20" y1="120" x2="80" y2="120"/><line x1="40" y1="120" x2="40" y2="10"/><line x1="40" y1="10" x2="100" y2="10"/><line x1="100" y1="10" x2="100" y2="32"/></g><g stroke="' + (f >= 5 ? '#d92d20' : '#d9822b') + '" stroke-width="4" stroke-linecap="round" fill="none">' + p.slice(0, f).join('') + '</g></svg>';
  }
  function pintar(){
    var nL = pal.replace(/[^A-ZÁÉÍÓÚÜÑ]/g,'').length;
    var t = Math.max(20, Math.min(34, Math.floor(((el.clientWidth || 340) - 20) / Math.max(8, pal.length + 1)) - 5));
    var huecos = pal.split('').map(function(ch){
      if(ch === ' ') return '<span class="esp"></span>';
      if(!/[A-ZÁÉÍÓÚÜÑ]/.test(ch)) return '<span>' + ch + '</span>';
      if(usadas[base(ch)]) return '<span>' + ch + '</span>';
      return fin ? '<span class="falto">' + ch + '</span>' : '<span></span>';
    }).join('');
    var pistas = [0, 1, 2].map(function(i){
      if(i < nP) return '<div class="rt-ah-p"><b>Pista ' + (i + 1) + ':</b> ' + esc(item.pistas[i] || '') + '</div>';
      return '<div class="rt-ah-p lock">🔒 Pista ' + (i + 1) + ' · aparece ' + (i === 1 ? 'al 2.º fallo' : 'al 4.º fallo') + (i === nP && !fin ? ' <button type="button" class="rt-btn" data-mas style="min-height:30px;padding:2px 8px;margin-left:4px">verla ya</button>' : '') + '</div>';
    }).join('');
    var tec = 'ABCDEFGHIJKLMNÑOPQRSTUVWXYZ'.split('').map(function(l){
      var u = usadas[l], en = B.indexOf(l) >= 0;
      return '<button type="button" data-l="' + l + '"' + (u ? ' class="' + (en ? 'si' : 'no') + '"' : '') + (u || fin ? ' disabled' : '') + '>' + l + '</button>';
    }).join('');
    cuerpo.innerHTML = '<div class="rt-ah-top">' + dibujo(fallos) + '<div class="rt-ah-pistas">' + pistas + '<div style="font-size:.85rem;color:#5a6b7d">' + nL + ' letras · fallos: <b>' + fallos + '</b> de ' + MAXF + '</div></div></div>'
      + '<div class="rt-ah-pal" style="--t:' + t + 'px">' + huecos + '</div><div class="rt-ah-tec">' + tec + '</div>';
    cuerpo.querySelectorAll('[data-l]').forEach(function(b){ b.addEventListener('click', function(){ letra(b.getAttribute('data-l')); }); });
    var m = cuerpo.querySelector('[data-mas]'); if(m) m.addEventListener('click', function(){ if(!fin && nP < 3){ nP++; pintar(); } });
  }
  function letra(l){
    if(fin || usadas[l]) return;
    usadas[l] = 1;
    if(B.indexOf(l) < 0){ fallos++; if(fallos >= 2 && nP < 2) nP = 2; if(fallos >= 4 && nP < 3) nP = 3; }
    var completa = pal.split('').every(function(ch){ return !/[A-ZÁÉÍÓÚÜÑ]/.test(ch) || usadas[base(ch)]; });
    if(completa) return terminar(true, 'fin');
    if(fallos >= MAXF) return terminar(false, 'fin');
    pintar();
  }
  function tecla(e){
    if(fin || e.ctrlKey || e.metaKey || e.altKey) return;
    var t = e.target; if(t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA')) return;
    if(!document.body.contains(box)){ document.removeEventListener('keydown', tecla); return; }
    var k = (e.key || '').toUpperCase(); if(/^[A-ZÑ]$/.test(k)){ e.preventDefault(); letra(k); }
  }
  document.addEventListener('keydown', tecla);
  var rel = reloj(box.querySelector('.rt-reloj'), seg, function(){ terminar(false, 'tiempo'); });
  function terminar(gano, motivo){
    if(fin) return; fin = true; rel.parar(); document.removeEventListener('keydown', tecla);
    var pts = gano ? [10, 6, 3][nP - 1] : 0;
    pintar();
    msg.className = 'rt-msg ' + (gano ? 'bien' : 'mal');
    msg.textContent = gano ? '✓ ¡La adivinaste! +' + pts + ' puntos.' : (motivo === 'tiempo' ? '⏰ ¡Se acabó el tiempo!' : '✗ Se completó el muñeco.') + ' La palabra era ' + item.txt + '.';
    box.querySelector('.rt-final').innerHTML = R.cajaExplicacion({correcta: esc(item.txt), exp: item.pistas.map(esc).join(' ')});
    if(o.onFin) o.onFin({ok: gano, puntos: pts, pistas: nP, fallos: fallos, motivo: motivo});
  }
  pintar();
  return {terminar: function(){ terminar(false, 'tiempo'); }};
};

window.RETOS = R;
})();
