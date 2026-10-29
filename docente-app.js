/* ════════════════════════════════════════════════════════════════════════
   ChromaNom — Generador de guías, talleres y evaluaciones para el docente
   (docente.html). Contenido escrito en docente-datos.js.

   CÓMO SE ALIMENTAN LOS BANCOS DE EJERCICIOS
   No se copia ningún ejercicio: generador.html y juego.html se cargan en dos
   marcos ocultos (iframe, mismo sitio) y se leen sus datos y funciones de
   dibujo directamente desde su propio ámbito global con
   marco.contentWindow.eval('NOMBRE'):
     - Generador: MOLS (moléculas con nombre, tema y partes MDEC), BANCO_RXN
       (reacciones), getSVG / mkDevSVG / _parseChainStr (dibujo de
       estructuras) y buildTipoDCard (tarjeta de reacción, la misma del
       Generador).
     - Juego: todos los arreglos cuyo nombre empieza por mayúscula y cuyos
       elementos tienen "type" y "topic" (QBANK, QBANK_EXTRA, … y los que se
       agreguen después), ya decodificados en memoria, más M / MOLDES /
       mkDevSVG para dibujar sus moléculas y NIVEL_LABELS para los nombres
       de los temas.
   Así, los temas nuevos del Juego (p. ej. haluros, polifuncionales,
   «Encuentra la cadena») entran solos: los que coinciden con la expresión
   "jue" de un tema de docente-datos.js se suman a ese tema; los demás
   aparecen como temas extra («solo taller»). No depende de números de línea.
   Sin conexión funciona igual, porque el service worker guarda en caché
   generador.html y juego.html.
   ════════════════════════════════════════════════════════════════════════ */
(function(){
'use strict';
var D=window.DOCENTE_DATOS;
if(!D){return;}
var $=function(id){return document.getElementById(id);};
var esc=function(s){return String(s==null?'':s).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c];});};

/* ── Azar con semilla (Forma A / Forma B reproducibles) ─────────────── */
function hash(str){var h=2166136261;for(var i=0;i<str.length;i++){h^=str.charCodeAt(i);h=Math.imul(h,16777619);}return h>>>0;}
function rng(seedStr){var a=hash(seedStr)||1;return function(){a|=0;a=a+0x6D2B79F5|0;var t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296;};}
function barajar(arr,r){var a=arr.slice();for(var i=a.length-1;i>0;i--){var j=Math.floor(r()*(i+1));var t=a[i];a[i]=a[j];a[j]=t;}return a;}

/* ── Fórmulas dentro del texto ──────────────────────────────────────────
   Una fórmula condensada con ramas entre paréntesis (CH₃−CH(OH)−CH₃) se
   dibuja en semidesarrollada, con la rama colgando de su carbono con un
   enlace hacia arriba (motor FX de fx-libro.js), nunca con paréntesis. */
var RE_FORM=/[A-Za-z0-9₀-₉−=≡()]+/g;
function formulaFx(tok){
  // Quitar paréntesis que encierran toda la fórmula, como en «(CH₃−CH(CH₃)−CH₃)».
  var pre='',pos='';
  function cuenta(t,c){return t.split(c).length-1;}
  function envuelve(t){if(t.charAt(0)!=='('||t.slice(-1)!==')')return false;var d=0;for(var i=0;i<t.length;i++){if(t[i]==='(')d++;else if(t[i]===')'){d--;if(d===0&&i<t.length-1)return false;}}return true;}
  while(envuelve(tok)){pre+='(';pos=')'+pos;tok=tok.slice(1,-1);}
  while(tok.charAt(0)==='('&&cuenta(tok,'(')>cuenta(tok,')')){pre+='(';tok=tok.slice(1);}
  while(tok.slice(-1)===')'&&cuenta(tok,')')>cuenta(tok,'(')){pos=')'+pos;tok=tok.slice(0,-1);}
  if(!/[−=≡]/.test(tok)||!/C(?:H[₂₃]?)?\(/.test(tok)||typeof FX==='undefined')return null;
  var n=fxNorm(tok.replace(/C\(([^()]+)\)\(([^()]+)\)/g,'⟦$1|C|$2⟧'));
  if(/\(/.test(n))return null;
  return esc(pre)+'<span class="fx-in">'+FX.mol(n)+'</span>'+esc(pos);
}
function escQ(s){
  s=String(s==null?'':s);var out='',last=0,m;RE_FORM.lastIndex=0;
  while((m=RE_FORM.exec(s))){var h=formulaFx(m[0]);if(h===null)continue;out+=esc(s.slice(last,m.index))+h;last=m.index+m[0].length;}
  return out+esc(s.slice(last));
}

/* ── Carga de bancos ─────────────────────────────────────────────────── */
var B={G:null,J:null,genMols:[],genRxn:[],jue:[],jueLabels:{},estado:{gen:'cargando',jue:'cargando'}};
function marco(src){
  return new Promise(function(res,rej){
    var f=document.createElement('iframe');
    f.setAttribute('aria-hidden','true');f.tabIndex=-1;f.title='banco';
    f.style.cssText='position:absolute;left:-10000px;top:0;width:1000px;height:700px;border:0;visibility:hidden';
    var t=setTimeout(function(){rej(new Error('tiempo agotado'));},30000);
    f.onload=function(){clearTimeout(t);res(f.contentWindow);};
    f.onerror=function(){clearTimeout(t);rej(new Error('no cargó'));};
    f.src=src;document.body.appendChild(f);
  });
}
function leer(w,nombre){try{return w.eval(nombre);}catch(e){return undefined;}}
var bancosListos=Promise.all([
  marco('generador.html').then(function(w){
    var mols=leer(w,'MOLS'),rxn=leer(w,'BANCO_RXN');
    if(!Array.isArray(mols))throw new Error('sin MOLS');
    B.G={w:w,getSVG:leer(w,'getSVG'),mkDevSVG:leer(w,'mkDevSVG'),parse:leer(w,'_parseChainStr'),alias:leer(w,'_RXN_ALIASES')||{},tipoD:leer(w,'buildTipoDCard'),moldes:leer(w,'MOLDES')||{}};
    B.genMols=mols;B.genRxn=Array.isArray(rxn)?rxn:[];B.estado.gen='ok';
  }).catch(function(){B.estado.gen='error';}),
  marco('juego.html').then(function(w){
    var html=w.document.documentElement.innerHTML;
    var re=/(?:const|let|var)\s+([A-Z][A-Z0-9_]*)\s*=\s*\[/g,m,vistos=new Set(),todos=[];
    while((m=re.exec(html))){
      if(vistos.has(m[1]))continue;vistos.add(m[1]);
      var arr=leer(w,m[1]);
      if(!Array.isArray(arr)||!arr.length||!arr.some(function(q){return q&&q.type&&q.topic;}))continue;
      arr.forEach(function(q){if(q&&q.type&&q.topic&&todos.indexOf(q)<0)todos.push(q);});
    }
    B.J={w:w,M:leer(w,'M')||{},MOLDES:leer(w,'MOLDES')||{},SKT:leer(w,'SKT')||{},mkDevSVG:leer(w,'mkDevSVG')};
    B.jue=todos;B.jueLabels=leer(w,'NIVEL_LABELS')||{};B.estado.jue=todos.length?'ok':'error';
  }).catch(function(){B.estado.jue='error';})
]).then(function(){prepararTemas();pintarEstado();
  // Laberintos y crucigramas (laberinto.js, crucigrama.js) usan los mismos
  // bancos ya cargados: moléculas y dibujos del Generador, reacciones.
  window.DOCENTE_BANCOS=B;
  // Dibujo compacto «estilo libro» (el mismo de las hojas impresas).
  window.DOCENTE_FIGURA=function(spec,wMax,hMax){return figura(spec,wMax,hMax);};
  document.dispatchEvent(new Event('docente-bancos-listos'));
});

/* ── Dibujo de estructuras ───────────────────────────────────────────── */
function tamSvg(svg,wMax,hMax,sMax,sMin){
  if(!svg||svg.indexOf('<svg')<0)return svg||'';
  var vb=svg.match(/viewBox="\s*([-\d.]+)[\s,]+([-\d.]+)[\s,]+([\d.]+)[\s,]+([\d.]+)/);
  if(!vb)return svg;
  var vw=+vb[3],vh=+vb[4];if(!vw||!vh)return svg;
  var s=Math.max(Math.min(wMax/vw,hMax/vh,sMax||1.4),sMin||0.7);
  s=Math.min(s,wMax/vw,hMax/vh);
  return svg.replace(/<svg\b([^>]*)>/,function(all,attrs){
    attrs=attrs.replace(/\s(width|height)="[^"]*"/g,'').replace(/style="[^"]*"/,'');
    return '<svg'+attrs+' width="'+(vw*s).toFixed(1)+'" height="'+(vh*s).toFixed(1)+'" style="display:block;margin:0 auto;overflow:visible">';
  });
}
/* ── Moléculas en semidesarrollada «tipo libro» ─────────────────────────
   Las cadenas (formato MOLDES: {s,h,bn,bu,bd,buBn,bdBn}) se escriben con
   texto, como en un libro: átomos con su letra real, enlaces cortos (—, =, ≡)
   y cada rama colgando de su carbono con enlaces verticales hacia arriba o
   hacia abajo, nunca entre paréntesis. Usa las clases del motor FX
   (fx-libro.js), así se ve igual que las reacciones. Los anillos (benceno,
   ciclos) siguen como dibujo SVG. */
function etiquetaAtomo(a){var y=a.s||'C',h=a.h||0;return y+(h<=0?'':h===1?'H':h===2?'H₂':h===3?'H₃':'H₄');}
function htmlEtq(t){return esc(t).replace(/([₀-₉]+)/g,function(m){return '<sub>'+m.replace(/[₀-₉]/g,function(c){return '₀₁₂₃₄₅₆₇₈₉'.indexOf(c);})+'</sub>';});}
function enlaceV(bn){return '<span class="fx-bd'+(bn===2?' dbl':bn===3?' tpl':'')+'"></span>';}
function cadenaLibro(ch){
  if(!Array.isArray(ch)||!ch.length)return null;
  var arr=0,abj=0,ancho=0,html='';
  ch.forEach(function(a,i){
    if(a.s&&!/^[A-Z][a-z]?$/.test(a.s))throw 0;           // algo que no es un átomo: mejor el SVG
    var lab=etiquetaAtomo(a);
    // Un heteroátomo con H al comienzo se escribe con el H adelante: HO—, H₂N—.
    if(i===0&&a.s&&a.h&&ch.length>1)lab=lab.replace(/^([A-Z][a-z]?)(H[₂₃]?)$/,'$2$1');
    var base='<span class="fx-lab">'+htmlEtq(lab)+'</span>';
    ancho+=lab.replace(/[₀-₉]/g,'').length*0.62+0.3;
    var st='';
    if(a.bu&&a.bu.length){
      var u=[];a.bu.slice().reverse().forEach(function(b,k,v){u.push('<span class="fx-lab">'+(b.izq?'<span class="fx-izq">'+htmlEtq(b.izq)+'</span>':'')+htmlEtq(etiquetaAtomo(b))+'</span>');u.push(enlaceV(k<v.length-1?(v[k+1].bn||1):(a.buBn||1)));});
      st+='<span class="fx-bu">'+u.join('')+'</span>';arr=Math.max(arr,a.bu.length);
    }
    if(a.bd&&a.bd.length){
      var d=[];a.bd.forEach(function(b,k){d.push(enlaceV(k===0?(a.bdBn||1):(a.bd[k-1].bn||1)));d.push('<span class="fx-lab">'+htmlEtq(etiquetaAtomo(b))+'</span>');});
      st+='<span class="fx-bl">'+d.join('')+'</span>';abj=Math.max(abj,a.bd.length);
    }
    html+=st?'<span class="fx-st">'+base+st+'</span>':base;
    if(i<ch.length-1){var bn=a.bn||1;html+='<span class="fx-enl">'+(bn===2?'=':bn===3?'≡':'—')+'</span>';ancho+=1.05;}
  });
  return {html:html,arr:arr,abj:abj,em:ancho};
}
// Cadena del banco a partir de la especificación de la figura (o null).
function cadenaDe(spec){
  if(spec.cadena)return spec.cadena;
  if(spec.gen&&B.G){var mg=B.genMols.filter(function(m){return m.key===spec.gen||m.name===spec.gen;})[0];if(mg&&FIG_LIBRO[mg.key])return FIG_LIBRO[mg.key];}
  if(Array.isArray(spec.f))return spec.f;
  if(spec.gen&&B.G&&B.G.moldes){
    var mol=B.genMols.filter(function(m){return m.key===spec.gen||m.name===spec.gen;})[0];
    if(mol&&Array.isArray(B.G.moldes[mol.key]))return B.G.moldes[mol.key];
    return null;
  }
  if(typeof spec.f==='string'){var mb=spec.f.match(/^C₆H₅−(.+)$/);if(mb&&!/C₆/.test(mb[1]))return {n:6,a:1,s:{0:mb[1].replace(/−/g,'—')}};if(spec.f==='C₆H₆')return {n:6,a:1};}
  if(typeof spec.f==='string'&&B.G&&B.G.parse&&!(B.G.alias&&B.G.alias[spec.f])){try{var c=B.G.parse(spec.f);if(c&&c.length)return c;}catch(e){}}
  return null;
}
/* Anillos y moléculas que el banco dibuja a mano (funciones M del
   Generador y del Juego): aquí se escriben en formato libro. Anillo: n
   lados, a = aromático, d = enlaces dobles del anillo (n.º de lado), het =
   heteroátomo en un vértice, s = sustituyentes por vértice (0 = arriba,
   en sentido horario). «=O» es un oxígeno con doble enlace. Las demás son
   cadenas en formato MOLDES. */
var O2=[{s:'O',h:0}],OH1=[{s:'O',h:1}],NH2=[{s:'N',h:2}];
function cCOOH(){return {h:0,bu:O2,buBn:2,bd:OH1};}
var FIG_LIBRO={
  ciclohexano:{n:6},ciclobutano:{n:4},ciclopentano:{n:5},ciclopenteno:{n:5,d:[1]},
  metilciclopentano:{n:5,s:{0:'CH₃'}},etilciclohexano:{n:6,s:{0:'CH₂—CH₃'}},metilciclohexano:{n:6,s:{0:'CH₃'}},
  propilciclopentano:{n:5,s:{0:'CH₂—CH₂—CH₃'}},ciclohexeno:{n:6,d:[1]},
  ciclohexanol:{n:6,s:{0:'OH'}},ciclopentanol:{n:5,s:{0:'OH'}},ciclobutanol:{n:4,s:{0:'OH'}},ciclohex2en1ol:{n:6,d:[1],s:{0:'OH'}},
  ciclopentanona:{n:5,s:{0:'=O'}},ciclohexanona:{n:6,s:{0:'=O'}},dosMCiclopent1ona:{n:5,s:{0:'=O',1:'CH₃'}},
  tresMCiclohex1ona:{n:6,s:{0:'=O',2:'CH₃'}},cuatroMCiclohex1ona:{n:6,s:{0:'=O',3:'CH₃'}},
  acidoCiclohexanocarboxilico:{n:6,s:{0:'COOH'}},ciclohexanocarboxaldehido:{n:6,s:{0:'CHO'}},ciclohexanocarboxamida:{n:6,s:{0:'CO—NH₂'}},
  ciclohexanocarbonitrilo:{n:6,s:{0:'C≡N'}},ciclohexanamina:{n:6,s:{0:'NH₂'}},etanoatoCiclohexilo:{n:6,s:{0:'O—CO—CH₃'}},
  metoxiciclopentano:{n:5,s:{0:'O—CH₃'}},etoxiciclohexano:{n:6,s:{0:'O—CH₂—CH₃'}},cicloHexilMetilCetona:{n:6,s:{0:'CO—CH₃'}},
  rt_bromociclohexano:{n:6,s:{0:'Br'}},
  tetrahidrofurano:{n:5,het:{0:'O'}},tetrahidropirano:{n:6,het:{0:'O'}},oxirano:{n:3,het:{0:'O'}},
  metilbenceno:{n:6,a:1,s:{0:'CH₃'}},etilbenceno:{n:6,a:1,s:{0:'CH₂—CH₃'}},propilbenceno:{n:6,a:1,s:{0:'CH₂—CH₂—CH₃'}},
  isopropilbenceno:{n:6,a:1,s:{0:'H₃C—CH—CH₃'}},
  ortoXileno:{n:6,a:1,s:{0:'CH₃',1:'CH₃'}},metaXileno:{n:6,a:1,s:{0:'CH₃',2:'CH₃'}},paraXileno:{n:6,a:1,s:{0:'CH₃',3:'CH₃'}},
  trimetilbenceno123:{n:6,a:1,s:{0:'CH₃',1:'CH₃',2:'CH₃'}},trimetilbenceno124:{n:6,a:1,s:{0:'CH₃',1:'CH₃',3:'CH₃'}},
  trimetilbenceno135:{n:6,a:1,s:{0:'CH₃',2:'CH₃',4:'CH₃'}},
  acidobenzoico:{n:6,a:1,s:{0:'COOH'}},nitrobenceno:{n:6,a:1,s:{0:'NO₂'}},benzaldehido:{n:6,a:1,s:{0:'CHO'}},
  anilina:{n:6,a:1,s:{0:'NH₂'}},anisol:{n:6,a:1,s:{0:'O—CH₃'}},clorobenceno:{n:6,a:1,s:{0:'Cl'}},bromobenceno:{n:6,a:1,s:{0:'Br'}},
  ortoNitrotolueno:{n:6,a:1,s:{0:'CH₃',1:'NO₂'}},paraCresol:{n:6,a:1,s:{0:'OH',3:'CH₃'}},resorcinol:{n:6,a:1,s:{0:'OH',2:'OH'}},
  paraCloroanilina:{n:6,a:1,s:{0:'NH₂',3:'Cl'}},triclorobenceno124:{n:6,a:1,s:{0:'Cl',1:'Cl',3:'Cl'}},
  unoCloro4MetilBenceno:{n:6,a:1,s:{0:'Cl',3:'CH₃'}},cuatroCloroBenzonitrilo:{n:6,a:1,s:{0:'C≡N',3:'Cl'}},
  acidoSalicilico:{n:6,a:1,s:{0:'COOH',1:'OH'}},aspirina:{n:6,a:1,s:{0:'COOH',1:'O—CO—CH₃'}},
  paracetamol:{n:6,a:1,s:{0:'OH',3:'NH—CO—CH₃'}},TNT:{n:6,a:1,s:{0:'CH₃',1:'NO₂',3:'NO₂',5:'NO₂'}},
  acidoPicrico:{n:6,a:1,s:{0:'OH',1:'NO₂',3:'NO₂',5:'NO₂'}},vainillina:{n:6,a:1,s:{0:'CHO',3:'OH',4:'O—CH₃'}},
  benzamida:{n:6,a:1,s:{0:'CO—NH₂'}},benzoatoMetilo:{n:6,a:1,s:{0:'COO—CH₃'}},benzoatoEtilo:{n:6,a:1,s:{0:'COO—CH₂—CH₃'}},
  etoxibenceno:{n:6,a:1,s:{0:'O—CH₂—CH₃'}},propoxibenceno:{n:6,a:1,s:{0:'O—CH₂—CH₂—CH₃'}},benzonitrilo:{n:6,a:1,s:{0:'C≡N'}},
  nMetilBencenamina:{n:6,a:1,s:{0:'NH—CH₃'}},fenilMetilCetona:{n:6,a:1,s:{0:'CO—CH₃'}},
  acidoHexanodioico:[cCOOH(),{h:2},{h:2},{h:2},{h:2},cCOOH()],acidoEtanodioico:[cCOOH(),cCOOH()],
  hexanodial:[{h:1,bu:O2,buBn:2},{h:2},{h:2},{h:2},{h:2},{h:1,bu:O2,buBn:2}],
  buta13diino:[{h:1,bn:3},{h:0},{h:0,bn:3},{h:1}],penta14diino:[{h:1,bn:3},{h:0},{h:2},{h:0,bn:3},{h:1}],
  nMetilAcetamida:[{h:3},{h:0,bu:O2,buBn:2},{s:'N',h:1},{h:3}],
  nEtilnMetilAcetamida:[{h:3},{h:0,bu:O2,buBn:2},{s:'N',h:0,bu:[{h:3}],bd:[{h:2},{h:3}]}],
  nEtilPropanamida:[{h:3},{h:2},{h:0,bu:O2,buBn:2},{s:'N',h:1},{h:2},{h:3}],
  hexanodiamida:[{h:0,bu:O2,buBn:2,bd:NH2},{h:2},{h:2},{h:2},{h:2},{h:0,bu:O2,buBn:2,bd:NH2}],
  nnDimetilFormamida:[{h:1,bu:O2,buBn:2},{s:'N',h:0,bu:[{h:3}],bd:[{h:3}]}],
  nnDietilAcetamida:[{h:3},{h:0,bu:O2,buBn:2},{s:'N',h:0,bu:[{h:2},{h:3}],bd:[{h:2},{h:3}]}],
  trietilamina:[{h:3},{h:2},{s:'N',h:0,bu:[{h:2},{h:3}]},{h:2},{h:3}],
  pentano24diona:[{h:3},{h:0,bu:O2,buBn:2},{h:2},{h:0,bu:O2,buBn:2},{h:3}],
  etenilbenceno:{n:6,a:1,s:{0:'CH=CH₂'}},estireno:{n:6,a:1,s:{0:'CH=CH₂'}},
  metanoatoMetilo:[{h:1,bu:O2,buBn:2},{s:'O',h:0},{h:3}],
  cianoetanoatoEtilo:[{s:'N',h:0,bn:3},{h:0},{h:2},{h:0,bu:O2,buBn:2},{s:'O',h:0},{h:2},{h:3}],
  rt_triclorometano:[{h:1,bu:[{s:'Cl',h:0}],bd:[{s:'Cl',h:0}]},{s:'Cl',h:0}],
  rt_2aminoetanol:[{s:'O',h:1},{h:2},{h:2},{s:'N',h:2}],
  rt_1hidroxipropan2ona:[{s:'O',h:1},{h:2},{h:0,bu:O2,buBn:2},{h:3}],
  rt_3etilhexan2ona:[{h:3},{h:0,bu:O2,buBn:2},{h:1,bd:[{h:2},{h:3}]},{h:2},{h:2},{h:3}],
  rt_secbutilmetiloctano:[{h:3},{h:1,bd:[{h:3}]},{h:2},{h:1,bu:[{h:1,izq:'H₃C—'},{h:2},{h:3}]},{h:2},{h:2},{h:2},{h:3}],
  propanoatoTercButilo:[{h:3},{h:2},{h:0,bu:O2,buBn:2},{s:'O',h:0},{h:0,bu:[{h:3}],bd:[{h:3}]},{h:3}]
};
// Texto con subíndices dentro de un SVG.
function svgTexto(t,x,y,anc,px){
  var out='',sub=false;
  String(t).split(/([₀-₉]+)/).forEach(function(p){if(!p)return;
    if(/^[₀-₉]+$/.test(p)){out+='<tspan font-size="'+(px*0.7).toFixed(1)+'" dy="'+(px*0.28).toFixed(1)+'">'+p.replace(/[₀-₉]/g,function(c){return '₀₁₂₃₄₅₆₇₈₉'.indexOf(c);})+'</tspan>';sub=true;}
    else{out+='<tspan'+(sub?' dy="'+(-px*0.28).toFixed(1)+'"':'')+'>'+esc(p)+'</tspan>';sub=false;}
  });
  return '<text x="'+x.toFixed(1)+'" y="'+y.toFixed(1)+'" text-anchor="'+anc+'" font-size="'+px+'">'+out+'</text>';
}
function anchoTexto(t,px){t=String(t);return t.replace(/[₀-₉—≡=]/g,'').length*px*0.72+t.replace(/[^₀-₉]/g,'').length*px*0.45+t.replace(/[^—≡=]/g,'').length*px*1.05;}
// A la izquierda del anillo el grupo se escribe al revés, con el átomo
// enlazado junto al anillo: O—CH₃ → H₃C—O, OH → HO, NO₂ → O₂N.
var INV={'CH₃':'H₃C','CH₂':'H₂C','OH':'HO','NO₂':'O₂N','NH₂':'H₂N','COOH':'HOOC','CHO':'OHC','NH':'HN','C≡N':'N≡C','COO':'OOC','CO':'OC'};
function alReves(t){return t.split('—').reverse().map(function(x){return INV[x]||x;}).join('—');}
// Anillo en formato libro: polígono con letra del tamaño del texto.
function anilloSVG(A,px){
  var n=A.n,R=px*(n===3?1.1:n===4?1.25:n===5?1.45:1.6),L=px*0.9,el=[],box=[1e9,1e9,-1e9,-1e9];
  function caja(x1,y1,x2,y2){box[0]=Math.min(box[0],x1);box[1]=Math.min(box[1],y1);box[2]=Math.max(box[2],x2);box[3]=Math.max(box[3],y2);}
  function ln(x1,y1,x2,y2){el.push('<line x1="'+x1.toFixed(1)+'" y1="'+y1.toFixed(1)+'" x2="'+x2.toFixed(1)+'" y2="'+y2.toFixed(1)+'"/>');caja(Math.min(x1,x2),Math.min(y1,y2),Math.max(x1,x2),Math.max(y1,y2));}
  var off=n===4?-45:-90,V=[];
  for(var k=0;k<n;k++){var a=(off+k*360/n)*Math.PI/180;V.push([R*Math.cos(a),R*Math.sin(a),a]);}
  var het=A.het||{};
  for(k=0;k<n;k++){
    var p=V[k],q=V[(k+1)%n],x1=p[0],y1=p[1],x2=q[0],y2=q[1],dx=x2-x1,dy=y2-y1,l=Math.sqrt(dx*dx+dy*dy),c=px*0.5;
    if(het[k]){x1+=dx/l*c;y1+=dy/l*c;}
    if(het[(k+1)%n]){x2-=dx/l*c;y2-=dy/l*c;}
    ln(x1,y1,x2,y2);
    if((A.d||[]).indexOf(k)>=0){var mx=(p[0]+q[0])/2,my=(p[1]+q[1])/2,f=0.78;ln(p[0]*f+(q[0]-p[0])*0.15*f,p[1]*f+(q[1]-p[1])*0.15*f,q[0]*f-(q[0]-p[0])*0.15*f,q[1]*f-(q[1]-p[1])*0.15*f);}
  }
  if(A.a){el.push('<circle cx="0" cy="0" r="'+(R*0.55).toFixed(1)+'" fill="none"/>');}
  Object.keys(het).forEach(function(k){var p=V[k];el.push(svgTexto(het[k],p[0],p[1]+px*0.35,'middle',px));caja(p[0]-px*0.4,p[1]-px*0.6,p[0]+px*0.4,p[1]+px*0.5);});
  Object.keys(A.s||{}).forEach(function(k){
    var t=A.s[k],p=V[k],ux=Math.cos(p[2]),uy=Math.sin(p[2]),dbl=t.charAt(0)==='=';if(dbl)t=t.slice(1);
    var x1=p[0],y1=p[1],x2=p[0]+ux*L,y2=p[1]+uy*L;
    if(dbl){var nx=-uy*2.2,ny=ux*2.2;ln(x1+nx,y1+ny,x2+nx,y2+ny);ln(x1-nx,y1-ny,x2-nx,y2-ny);}else ln(x1,y1,x2,y2);
    var w=anchoTexto(t,px),anc,tx,ty;
    if(Math.abs(ux)<0.2){anc='middle';tx=x2;ty=uy<0?y2-px*0.3:y2+px*0.95;caja(tx-w/2,ty-px*0.85,tx+w/2,ty+px*0.35);}
    else{anc=ux>0?'start':'end';if(ux<0){t=alReves(t);w=anchoTexto(t,px);}tx=x2+(ux>0?1:-1)*px*0.2;ty=y2+px*0.35+(uy<-0.2?-px*0.15:uy>0.2?px*0.25:0);caja(ux>0?tx:tx-w,ty-px*0.85,ux>0?tx+w:tx,ty+px*0.35);}
    el.push(svgTexto(t,tx,ty,anc,px));
  });
  var m=3,X=box[0]-m,Y=box[1]-m,W=box[2]-box[0]+2*m,H=box[3]-box[1]+2*m;
  return {svg:'<svg class="anillo" xmlns="http://www.w3.org/2000/svg" viewBox="'+X.toFixed(1)+' '+Y.toFixed(1)+' '+W.toFixed(1)+' '+H.toFixed(1)+'" width="'+W.toFixed(0)+'" height="'+H.toFixed(0)+'"><g fill="none" stroke="#111" stroke-width="1.4" stroke-linecap="round">'+el.filter(function(e){return e.indexOf('<text')<0;}).join('')+'</g><g fill="#111" font-family="\'STIX Two Text\',\'Times New Roman\',serif">'+el.filter(function(e){return e.indexOf('<text')===0;}).join('')+'</g></svg>',w:W};
}
// Esqueleto del Juego (SKT: [padre, ángulo, orden de enlace, átomo]) →
// cadena MOLDES. La línea dibujada (átomos 0,1,2… seguidos) queda horizontal
// y lo demás cuelga como ramas; así no se regala la cadena principal en los
// ejercicios de «Encuentra la cadena». Si hay anillos o ramas ramificadas,
// devuelve null (queda el dibujo original).
function grafoACadena(def){
  if(!def||!def.a||def.r)return null;
  var a=def.a,N=a.length,hijos=[];for(var i=0;i<N;i++)hijos.push([]);
  for(i=1;i<N;i++)hijos[a[i][0]].push(i);
  var lin=[0];for(i=1;i<N&&a[i][0]===i-1&&lin.length===i;i++)lin.push(i);
  var enLin={};lin.forEach(function(x){enLin[x]=1;});
  var VAL={C:4,O:2,N:3,S:2,F:1,Cl:1,Br:1,I:1};
  function at(i){var sim=a[i][3]||'C',b=i>0?a[i][2]:0;hijos[i].forEach(function(j){b+=a[j][2];});return {s:sim==='C'?undefined:sim,h:Math.max(0,(VAL[sim]||4)-b)};}
  var ch=lin.map(function(i,k){var o=at(i);if(k<lin.length-1)o.bn=a[lin[k+1]][2];return o;});
  for(var k=0;k<lin.length;k++){
    var ramas=hijos[lin[k]].filter(function(j){return !enLin[j];});
    for(var r=0;r<ramas.length;r++){
      var j=ramas[r],ang=((a[j][1]%360)+360)%360,arriba=ang>180,lista=[],bn=a[j][2],cur=j;
      while(true){lista.push(at(cur));if(hijos[cur].length>1)return null;if(!hijos[cur].length)break;var nx=hijos[cur][0];lista[lista.length-1].bn=a[nx][2];cur=nx;}
      var lado=arriba?'bu':'bd';if(ch[k][lado])lado=lado==='bu'?'bd':'bu';if(ch[k][lado])return null;
      ch[k][lado]=lista;ch[k][lado+'Bn']=bn;
    }
  }
  return ch;
}
var FIG_PX=19;   // tamaño de letra de las moléculas en la hoja impresa (≈14 pt)
function figuraLibro(ch,wMax){
  if(ch&&!Array.isArray(ch)&&ch.n){
    var px0=FIG_PX,an=anilloSVG(ch,px0);
    if(an.w>wMax){px0=Math.max(13,Math.floor(FIG_PX*wMax/an.w));an=anilloSVG(ch,px0);}
    return '<div class="fig fig-libro" data-w="'+Math.round(an.w)+'">'+an.svg+'</div>';
  }
  var r;try{r=cadenaLibro(ch);}catch(e){return null;}
  if(!r)return null;
  // Se reduce la letra solo si la cadena no cabe en el ancho disponible.
  var px=Math.max(14,Math.min(FIG_PX,Math.floor(wMax/Math.max(r.em,1))));
  var w=Math.round(r.em*px);
  return '<div class="fig fig-libro" data-w="'+w+'"><span class="fx-cad" style="font-size:'+px+'px;padding:'+(r.arr*1.8+0.15).toFixed(2)+'em 0 '+(r.abj*1.8+0.15).toFixed(2)+'em">'+r.html+'</span></div>';
}
function figura(spec,wMax,hMax){
  wMax=wMax||300;hMax=hMax||130;
  var lib=figuraLibro(cadenaDe(spec),wMax);if(lib)return lib;
  var svg='';
  try{
    if(spec.svgFn){svg=spec.svgFn();}
    else if(spec.gen&&B.G){
      var mol=B.genMols.filter(function(m){return m.key===spec.gen||m.name===spec.gen;})[0];
      if(mol)svg=B.G.getSVG(mol.key);
    }
    else if(Array.isArray(spec.f)&&B.G){svg=B.G.mkDevSVG(spec.f);}
    else if(typeof spec.f==='string'&&B.G){
      if(B.G.alias[spec.f])svg=B.G.alias[spec.f]();
      else{var ch=B.G.parse(spec.f);if(ch&&ch.length)svg=B.G.mkDevSVG(ch);}
    }
  }catch(e){svg='';}
  if(svg&&svg.indexOf('<svg')>=0)return '<div class="fig" data-k="'+esc(spec.key||spec.gen||'')+'">'+tamSvg(svg,wMax,hMax)+'</div>';
  var txt=spec.t||(typeof spec.f==='string'?spec.f:'');
  return txt?'<div class="fig fig-txt">'+esc(txt)+'</div>':'';
}
function cadenaJuego(mol){
  var J=B.J;if(!J)return null;
  if(FIG_LIBRO[mol])return FIG_LIBRO[mol];
  if(typeof J.M[mol]!=='function'&&Array.isArray(J.MOLDES[mol]))return J.MOLDES[mol];
  if(J.SKT&&J.SKT[mol])return grafoACadena(J.SKT[mol]);
  return null;
}
function svgJuego(mol){
  return function(){
    var J=B.J;if(!J)return '';
    if(typeof J.M[mol]==='function')return J.M[mol]();
    if(Array.isArray(J.MOLDES[mol]))return J.mkDevSVG(J.MOLDES[mol]);
    return '';
  };
}

/* ── Temas y pools de ejercicios ─────────────────────────────────────── */
var TEMAS=[];
function limpiaEtiqueta(s){return String(s||'').replace(/[\u{1F300}-\u{1FAFF}☀-➿️]/gu,'').trim();}
function prepararTemas(){
  TEMAS=D.TEMAS.map(function(t){return Object.assign({},t);});
  // Temas del Juego que no encajan en ningún tema: se ofrecen como «solo taller».
  var topicos={};
  B.jue.forEach(function(q){if(!/^rxn_/.test(q.topic))topicos[q.topic]=1;});
  Object.keys(topicos).forEach(function(tp){
    var usado=TEMAS.some(function(t){return (t.gen||[]).indexOf(tp)>=0||(t.jue&&t.jue.test(tp));});
    if(!usado){TEMAS.push({id:'jue_'+tp,titulo:limpiaEtiqueta(B.jueLabels[tp])||tp,corto:limpiaEtiqueta(B.jueLabels[tp])||tp,gen:[],jue:new RegExp('^'+tp+'$'),rxn:[],extra:true,nomenclatura:true,alin:(D.TEMAS.filter(function(x){return x.id==='cadena';})[0]||D.TEMAS[0]).alin,propia:[]});}
  });
  pintarTemas();
}
function normNombre(s){return String(s||'').toLowerCase().replace(/\s+/g,' ').trim();}
function quitaHtml(s){var d=document.createElement('div');d.innerHTML=s||'';return (d.textContent||'').trim();}

/* ── Cazar errores: nombres equivocados a partir del nombre correcto ────
   Cada molécula del banco recibe UN error típico de los estudiantes, elegido
   entre los que se le pueden aplicar (así el taller trae errores variados):
   - numerar desde el extremo equivocado (localizadores más altos);
   - no ordenar los sustituyentes alfabéticamente;
   - olvidar el prefijo di-/tri- o un localizador repetido;
   - escribir el localizador del grupo a la manera antigua (2-butanol).
   Solo se usan reglas seguras: si el resultado coincide con el nombre
   correcto o el nombre no se deja analizar, la molécula no se usa. */
var SUST='metil|etil|propil|isopropil|butil|cloro|bromo|yodo|fluoro|nitro|hidroxi|amino|oxo|metoxi|etoxi|fenil|vinil';
var RAIZ={met:1,et:2,prop:3,but:4,pent:5,hex:6,hept:7,oct:8,non:9,dec:10};
function partesNombre(n){
  var pre='',m=n.match(/^(ácido )(.*)$/);if(m){pre=m[1];n=m[2];}
  var grupos=[],re=new RegExp('^(\\d+(?:,\\d+)*)-(di|tri|tetra)?('+SUST+')(-)?');
  while((m=n.match(re))){grupos.push({loc:m[1],mul:m[2]||'',nom:m[3]});n=n.slice(m[0].length);if(!m[4])break;}
  return {pre:pre,grupos:grupos,padre:n};
}
function armarNombre(o){
  var g=o.grupos.map(function(x){return x.loc+'-'+x.mul+x.nom;}).join('-');
  return o.pre+(g?g+(/^\d/.test(o.padre)?'-':''):'')+o.padre;
}
function errorDeNombre(nombre){
  // Ésteres sencillos: invertir la parte del ácido y la del alcohol.
  var me=nombre.match(/^(met|et|prop|but|pent|hex)anoato de (met|et|prop|but|pent|hex)ilo$/);
  if(me)return me[1]===me[2]?null:me[2]+'anoato de '+me[1]+'ilo';
  if(/\s(de|éter|cetona)\s|\bN-|ciclo.*ciclo/.test(nombre))return null;
  var o=partesNombre(nombre);if(!o.padre)return null;
  var cands=[];
  function add(t){if(t&&t!==nombre&&cands.indexOf(t)<0)cands.push(t);}
  // a) orden alfabético
  if(o.grupos.length>=2&&o.grupos[0].nom!==o.grupos[1].nom){var c=JSON.parse(JSON.stringify(o));c.grupos.reverse();add(armarNombre(c));}
  // b) sin di-/tri-   c) falta un localizador repetido
  o.grupos.forEach(function(g,i){
    if(!g.mul)return;
    var c=JSON.parse(JSON.stringify(o));c.grupos[i].mul='';add(armarNombre(c));
    var ls=g.loc.split(',');if(ls.length===2&&ls[0]===ls[1]){var d=JSON.parse(JSON.stringify(o));d.grupos[i].loc=ls[0];add(armarNombre(d));}
  });
  // d) numeración desde el otro extremo (solo cadenas abiertas sin grupo en C1 fijo)
  var mr=o.padre.match(/^(met|et|prop|but|pent|hex|hept|oct|non|dec)/);
  if(mr&&!/ciclo|benceno|fenol|anilina|oato/.test(nombre)){
    var N=RAIZ[mr[1]],malo=false;
    var inv=nombre.replace(/\d+(?:,\d+)*/g,function(ls){return ls.split(',').map(function(x){var y=N+1-(+x);if(y<1)malo=true;return y;}).sort(function(a,b){return a-b;}).join(',');});
    if(!malo)add(inv);
  }
  // d2) anillo de benceno numerado en el sentido equivocado: 1,3 → 1,5
  if(/benceno$/.test(nombre)&&!/\d{2}/.test(nombre)){
    var rb=nombre.replace(/\d+(?:,\d+)*/g,function(ls){return ls.split(',').map(function(x){return ((2-(+x))%6+6)%6||6;}).sort(function(a,b){return a-b;}).join(',');});
    add(rb);
  }
  var h=hash(nombre);
  // e) localizador del grupo a la manera antigua: hexan-3-ol → 3-hexanol.
  // Se usa solo de vez en cuando si hay otros errores posibles, para que no
  // domine el taller.
  var mo=o.padre.match(/^([a-z]+?)(an|a)?-(\d+(?:,\d+)*)-((?:di|tri)?(?:en|in|ol|ona|amina)(?:o)?)$/);
  if(mo&&(!cands.length||h%4===0)){var c2=JSON.parse(JSON.stringify(o));c2.padre=mo[3]+'-'+mo[1]+(mo[2]||'')+mo[4];var viejo=armarNombre(c2);if(viejo!==nombre)return viejo;}
  if(!cands.length)return null;
  return cands[h%cands.length];
}
function poolEjercicios(temas){
  var P={A:[],B:[],C:[],D:[],X:[],Q:[],E:[]},nomA={},nomB={},nomC={},rx={};
  function addA(nombre,item){var k=normNombre(nombre);if(!k||nomA[k])return;nomA[k]=1;item.nombre=nombre;P.A.push(item);}
  function addB(nombre,item){var k=normNombre(nombre);if(!k||nomB[k])return;nomB[k]=1;P.B.push(item);}
  function addC(nombre,item){var k=normNombre(nombre);if(!k||nomC[k])return;nomC[k]=1;P.C.push(item);}
  temas.forEach(function(t){
    // 1) Generador (MOLS)
    B.genMols.forEach(function(m){
      if((t.gen||[]).indexOf(m.topic)<0)return;
      if(t.soloRamificados&&(!/\d/.test(m.name)||/^ciclo|ciclo/.test(m.name)))return;
      var nom=m.iupac||m.name;
      addA(nom,{k:'A',fig:{gen:m.key},fuente:'Generador',sub:m.topic});
      addB(nom,{k:'B',nombre:nom,fuente:'Generador',sub:m.topic});
      if(m.parts&&m.parts.length&&!/\s(éter|cetona)$/.test(nom))addC(nom,{k:'C',nombre:nom,partes:m.parts,fuente:'Generador',sub:m.topic});
    });
    // 2) Juego
    if(t.jue)B.jue.forEach(function(q){
      if(/^rxn_/.test(q.topic)||!t.jue.test(q.topic))return;
      var qt=quitaHtml(q.q);
      if(q.mol&&(q.type==='mc'||q.type==='write')&&/nombre IUPAC/i.test(qt)&&!/cl[aá]sico|funcional \(/i.test(qt)&&typeof q.ans==='string'){
        addA(q.ans,{k:'A',fig:{svgFn:svgJuego(q.mol),cadena:cadenaJuego(q.mol),key:q.mol},fuente:'Juego',sub:q.topic});
        addB(q.ans,{k:'B',nombre:q.ans,fuente:'Juego',sub:q.topic});
        if(Array.isArray(q.parts)&&q.parts.length&&!/\s(éter|cetona)$/.test(q.ans))addC(q.ans,{k:'C',nombre:q.ans,partes:q.parts,fuente:'Juego',sub:q.topic});
      }else if(q.type==='build'){
        var mm=String(q.q||'').match(/<strong>([^<]+)<\/strong>/);
        if(mm)addB(mm[1],{k:'B',nombre:mm[1],fuente:'Juego'});
      }else if(q.mol&&q.type==='mc'&&/nombr[óo]/i.test(qt)&&/error/i.test(qt)){
        P.X.push({k:'X',fig:{svgFn:svgJuego(q.mol),cadena:cadenaJuego(q.mol),key:q.mol},texto:q.q,fuente:'Juego'});
      }
    });
    // 3) Práctica propia del tema (docente-datos.js)
    (t.propia||[]).forEach(function(p){
      addA(p.n,{k:'A',fig:{f:p.f,t:p.t},fuente:'Docente'});
      addB(p.n,{k:'B',nombre:p.n,fuente:'Docente'});
    });
    // 4) Reacciones (Generador, tipo D)
    // Se omiten las reacciones de nivel universitario (sales de diazonio,
    // aldólica, acetiluros, Na/NH₃) y las repetidas: dos fichas con el mismo
    // reactivo y el mismo producto cuentan como un solo ejercicio.
    B.genRxn.forEach(function(r){
      if((t.rxn||[]).indexOf(r.topic)<0||r.nivel==='avanzado'||rx[r.key]||RXN_FUERA.test(r.categoria||''))return;
      var prod=String(r.respuesta||'').split(/\s{2}|\s\(|\s→/)[0];
      var s1=r.r+'|'+prod,s2=r.r+'|'+(r.reactivo||'')+'|'+(r.nombre_rxn||'');
      if(rx[s1]||rx[s2])return;
      rx[r.key]=rx[s1]=rx[s2]=1;P.D.push({k:'D',rxn:r,fuente:'Generador'});
    });
    // 5) Cazar errores generados a partir de las moléculas del tema (el
    // Juego solo trae este tipo de pregunta para la cadena principal).
    var vistosX={};P.X.forEach(function(x){if(x.fig&&x.fig.key)vistosX[x.fig.key]=1;});
    P.A.forEach(function(a){
      if(a._xHecho||!a.nombre)return;a._xHecho=1;
      var e=errorDeNombre(a.nombre);if(!e)return;
      P.X.push({k:'X',fig:a.fig,nombre:a.nombre,sub:a.sub,fuente:'Generado',
        texto:'Un compañero nombró esta molécula como <b>«'+esc(e)+'»</b>. ¿Qué error cometió?'});
    });
    // 6) Selección múltiple de conceptos (temas con saberJue)
    preguntasJuego(t).forEach(function(q){P.Q.push({k:'Q',q:quitaHtml(q.q),opts:q.opts.slice(),fig:q.mol?{svgFn:svgJuego(q.mol),key:q.mol}:null,sub:q.topic,fuente:'Juego'});});
    // 7) Ejercicios abiertos del tema
    (t.abiertos||[]).forEach(function(a){P.E.push({k:'E',q:typeof a==='string'?a:a.q,fig:typeof a==='string'?null:{f:a.f},fuente:'Docente'});});
  });
  return P;
}

/* ── Preguntas de selección múltiple del Juego ──────────────────────────
   Los temas con saberJue (Fase 1 «El carbono» e isomería) toman del Juego
   sus preguntas conceptuales de opción múltiple (banco en fundamentos.js):
   - como preguntas tipo Saber 11 de la evaluación (formato de SABER: la
     primera opción es la correcta; al imprimir se barajan);
   - como ejercicios «Selección múltiple» (tipo Q) de talleres y guías. */
function preguntasJuego(t){
  if(!t.saberJue||!t.jue)return [];
  return B.jue.filter(function(q){return q.type==='mc'&&t.jue.test(q.topic)&&Array.isArray(q.opts)&&typeof q.ans==='string'&&!/nombre IUPAC/i.test(quitaHtml(q.q));});
}
function saberDe(t){
  var jue=preguntasJuego(t).map(function(q){
    return {a:'nom',c:'uso',k:'Q',ctx:quitaHtml(q.q),q:'',o:[q.ans].concat(q.opts.filter(function(o){return o!==q.ans;})),
      fig:q.mol?{svgFn:svgJuego(q.mol),key:q.mol}:null,fuente:'Juego'};
  });
  return (D.SABER[t.id]||[]).concat(jue);
}

/* ── Formulario ──────────────────────────────────────────────────────── */
var TIPOS_EJ=[
  {k:'A',t:'Nombrar (estructura → nombre)'},
  {k:'B',t:'Dibujar (nombre → estructura)'},
  {k:'C',t:'Reconocimiento de partes del nombre'},
  {k:'D',t:'Reacciones'},
  {k:'X',t:'Cazar errores de nombres'},
  {k:'Q',t:'Selección múltiple (carbono, cadenas e isomería)'},
  {k:'E',t:'Ejercicios abiertos'}
];
function enfoque(){return valor('enfoque')||'todo';}
function gruposSel(t){
  if(!t.grupos)return null;
  var g=[].map.call(document.querySelectorAll('input[name=grupo][data-tema="'+t.id+'"]:checked'),function(c){return c.value;});
  return g.length&&g.length<t.grupos.length?g:null;
}
// Tema «efectivo»: el mismo tema, pero restringido a los grupos funcionales
// marcados (p. ej. solo Alcoholes, sin Éteres) y al enfoque elegido (con
// «Solo nomenclatura» no entran reacciones). El resto del código usa estos
// objetos sin saber del filtro.
function temaEfectivo(t){
  var g=gruposSel(t),nom=enfoque()==='nom';
  if(!g&&!nom)return t;
  var e=Object.assign({},t);
  if(g){
    var gs=t.grupos.filter(function(x){return g.indexOf(x.id)>=0;});
    e.gen=(t.gen||[]).filter(function(x){return g.indexOf(x)>=0;});
    e.rxn=(t.rxn||[]).filter(function(x){return g.indexOf(x)>=0;});
    e.jue={test:function(tp){return gs.some(function(x){return x.jue.test(tp);});}};
    e.corto=e.titulo=gs.map(function(x){return x.t;}).join(' y ');
    e._g=g;
  }
  if(nom){e.rxn=[];e._nom=true;}
  return e;
}
function filtroPreg(t){return function(q){
  if(t._g&&q.g&&q.g!=='ambos'&&t._g.indexOf(q.g)<0)return false;
  if(t._nom&&(q.a?q.a!=='nom':q.t==='rx'))return false;
  return true;
};}
function temasSel(){return TEMAS.filter(function(t){var c=document.querySelector('input[name=tema][value="'+t.id+'"]');return c&&c.checked;}).map(temaEfectivo);}
function pintarTemas(){
  var cont=$('f-temas');if(!cont)return;
  var previos={};document.querySelectorAll('input[name=tema]:checked').forEach(function(c){previos[c.value]=1;});
  var prevG={};document.querySelectorAll('input[name=grupo]').forEach(function(c){prevG[c.dataset.tema+':'+c.value]=c.checked;});
  cont.innerHTML=TEMAS.map(function(t){
    var P=poolEjercicios([t]);var nEj=P.A.length+P.B.length+P.C.length+P.D.length+P.X.length+P.Q.length+P.E.length;
    var nS=saberDe(t).length;
    var gr=t.grupos?'<div class="grupos" data-tema="'+t.id+'"'+(previos[t.id]?'':' hidden')+'><span>Grupos:</span>'+t.grupos.map(function(x){
      return '<label><input type="checkbox" name="grupo" data-tema="'+t.id+'" value="'+x.id+'"'+(prevG[t.id+':'+x.id]===false?'':' checked')+'> '+esc(x.t)+'</label>';}).join('')+'</div>':'';
    return '<label class="opt"><input type="checkbox" name="tema" value="'+t.id+'"'+(previos[t.id]?' checked':'')+'> <span><b>'+esc(t.titulo)+'</b><small>'+nEj+' ejercicios'+(nS?' · '+nS+' preguntas tipo Saber':'')+(t.extra?' · solo taller (tema nuevo del Juego)':'')+'</small></span></label>'+gr;
  }).join('');
  cont.querySelectorAll('input[name=tema]').forEach(function(c){c.addEventListener('change',function(){
    var g=cont.querySelector('.grupos[data-tema="'+c.value+'"]');if(g)g.hidden=!c.checked;
    alinSugerida();pintarTipos();guardar();});});
  // Cada tema conserva al menos un grupo marcado.
  cont.querySelectorAll('input[name=grupo]').forEach(function(c){c.addEventListener('change',function(){
    if(!cont.querySelector('input[name=grupo][data-tema="'+c.dataset.tema+'"]:checked'))c.checked=true;
    pintarTipos();});});
  pintarTipos();alinSugerida();
}
function pintarTipos(){
  var cont=$('f-tipos');if(!cont)return;
  var P=poolEjercicios(temasSel());
  var prev={};document.querySelectorAll('input[name=tipoej]:not(:disabled)').forEach(function(c){prev[c.value]=c.checked;});
  cont.innerHTML=TIPOS_EJ.map(function(x){
    var n=P[x.k].length,dis=!n;
    var chk=!dis&&(prev[x.k]===undefined?true:prev[x.k]);
    return '<label class="opt'+(dis?' dis':'')+'"><input type="checkbox" name="tipoej" value="'+x.k+'"'+(chk?' checked':'')+(dis?' disabled':'')+'> <span>'+esc(x.t)+' <small>('+n+' disponibles)</small></span></label>';
  }).join('');
}
function pintarAlineacion(sel){
  var g=+(document.querySelector('input[name=grado]:checked')||{value:11}).value;
  var sedSel=$('f-sed');
  var opciones=D.ALINEACION.sed.filter(function(s){return s.grado===g;});
  sedSel.innerHTML=opciones.map(function(s){return '<option value="'+s.id+'">'+esc((s.componente?'Componente '+s.componente.toLowerCase()+' — ':'Construcción del conocimiento — ')+s.texto.slice(0,90))+'…</option>';}).join('');
  if(sel&&sel.sed&&opciones.some(function(s){return s.id===sel.sed;}))sedSel.value=sel.sed;
  pintarEvidencias(sel&&sel.ev);
  var dbas=D.ALINEACION.dba.filter(function(d){return d.grado===g;});
  $('f-dba').innerHTML=dbas.map(function(d){var c=sel&&sel.dba?sel.dba.indexOf(d.id)>=0:false;return '<label class="opt"><input type="checkbox" name="dba" value="'+d.id+'"'+(c?' checked':'')+'> <span>'+esc(d.t)+' <small>('+esc(d.nota)+')</small></span></label>';}).join('');
  $('f-est').innerHTML=D.ALINEACION.estandares.map(function(e){var c=sel&&sel.est?sel.est.indexOf(e.id)>=0:false;return '<label class="opt"><input type="checkbox" name="est" value="'+e.id+'"'+(c?' checked':'')+'> <span>'+esc(e.t)+' <small>('+esc(e.nota)+')</small></span></label>';}).join('');
}
function pintarEvidencias(evSel){
  var s=D.ALINEACION.sed.filter(function(x){return x.id===$('f-sed').value;})[0];
  $('f-sed-texto').textContent=s?s.texto:'';
  $('f-ev').innerHTML=s?s.evid.map(function(e){var c=evSel?evSel.indexOf(e.id)>=0:false;return '<label class="opt"><input type="checkbox" name="ev" value="'+e.id+'"'+(c?' checked':'')+'> <span><small class="comp">'+esc(e.comp)+'</small> '+esc(e.t)+'</span></label>';}).join(''):'';
}
function alinSugerida(){
  var ts=temasSel();var t=ts[0]||D.TEMAS[0];
  var g=+(document.querySelector('input[name=grado]:checked')||{value:11}).value;
  var a=t.alin||D.TEMAS[0].alin;var gg=g===10?a.g10:a.g11;
  var ev=[];ts.forEach(function(x){var al=(x.alin||a)[g===10?'g10':'g11'];if(al&&al.sed===gg.sed)al.ev.forEach(function(e){if(ev.indexOf(e)<0)ev.push(e);});});
  if(!ev.length)ev=gg.ev.slice();
  var est=[],dba=[];ts.forEach(function(x){((x.alin||a).est||[]).forEach(function(e){if(est.indexOf(e)<0)est.push(e);});((x.alin||a).dba||[]).forEach(function(e){if(dba.indexOf(e)<0)dba.push(e);});});
  if(g===10)dba=['dba10a'];
  pintarAlineacion({sed:gg.sed,ev:ev,est:est.length?est:a.est,dba:dba});
}
function valor(name){var c=document.querySelector('input[name='+name+']:checked');return c?c.value:'';}
function marcados(name){return [].map.call(document.querySelectorAll('input[name='+name+']:checked'),function(c){return c.value;});}

/* Recordar el encabezado institucional en este dispositivo (comodidad). */
var CAMPOS=['f-colegio','f-docente','f-curso','f-periodo'];
function guardar(){try{var o={};CAMPOS.forEach(function(id){o[id]=$(id).value;});localStorage.setItem('chromanom_docente_enc',JSON.stringify(o));}catch(e){}}
function restaurar(){try{var o=JSON.parse(localStorage.getItem('chromanom_docente_enc')||'{}');CAMPOS.forEach(function(id){if(o[id])$(id).value=o[id];});}catch(e){}}

function pintarEstado(){
  var el=$('f-estado');if(!el)return;
  var g=B.estado.gen==='ok'?'✅ Generador: '+B.genMols.length+' moléculas y '+B.genRxn.length+' ejercicios de reacción':(B.estado.gen==='cargando'?'⏳ Cargando el banco del Generador…':'⚠️ No se pudo leer el banco del Generador');
  var j=B.estado.jue==='ok'?'✅ Juego: '+B.jue.length+' preguntas':(B.estado.jue==='cargando'?'⏳ Cargando el banco del Juego…':'⚠️ No se pudo leer el banco del Juego');
  var s=0;Object.keys(D.SABER).forEach(function(k){s+=D.SABER[k].length;});
  el.innerHTML=g+'<br>'+j+'<br>✅ Preguntas tipo Saber 11: '+s+' en '+Object.keys(D.SABER).length+' temas';
  $('btn-generar').disabled=false;
}

/* ── Piezas HTML de los documentos ───────────────────────────────────── */
var NOMBRE_PARTE={r:'① Sustituyentes',c:'② Cadena principal',i:'③ Insaturaciones',g:'④ Grupo funcional',cg:'②+④ Anillo aromático'};

function encabezadoInst(e,titulo,sub,forma){
  function campo(l,v,cls){return '<div class="ei-c'+(cls?' '+cls:'')+'"><span>'+l+'</span>'+(v?'<b>'+esc(v)+'</b>':'<i></i>')+'</div>';}
  return '<div class="ei"><div class="ei-top"><div><div class="ei-tipo">'+esc(sub)+'</div><div class="ei-tit">'+esc(titulo)+'</div></div>'+
    '<div class="ei-der"><img src="logo-chromanom.png" alt="ChromaNom" width="120" height="34">'+(forma?'<span class="ei-forma">'+esc(forma)+'</span>':'')+'</div></div>'+
    // Institución en una fila completa (el nombre del colegio sale entero);
    // debajo, docente con más espacio y los datos cortos.
    '<div class="ei-grid">'+campo('Institución',e.colegio,'ei-inst')+campo('Docente',e.docente,'ei-doc')+campo('Grado / curso',e.curso)+campo('Periodo',e.periodo)+campo('Fecha',e.fecha)+'</div></div>';
}
function lineaEstudiante(){return '<div class="est-lin"><div><span>Nombre del estudiante</span><i></i></div><div class="corta"><span>Curso</span><i></i></div></div>';}
function cajaAlineacion(al,compacta){
  var sed=D.ALINEACION.sed.filter(function(s){return s.id===al.sed;})[0];
  var ev=sed?sed.evid.filter(function(e){return al.ev.indexOf(e.id)>=0;}):[];
  var est=D.ALINEACION.estandares.filter(function(e){return al.est.indexOf(e.id)>=0;});
  var dba=D.ALINEACION.dba.filter(function(e){return al.dba.indexOf(e.id)>=0;});
  var h='<table class="alin"><tbody>';
  if(sed)h+='<tr><th>Aprendizaje priorizado<small>SED Bogotá 2025 · grado '+sed.grado+'.º</small></th><td>'+esc(sed.texto)+'</td></tr>';
  if(ev.length)h+='<tr><th>Evidencia'+(ev.length>1?'s':'')+'</th><td>'+ev.map(function(e){return '<div><b>'+esc(e.comp)+':</b> '+esc(e.t)+'</div>';}).join('')+'</td></tr>';
  if(!compacta||est.length)if(est.length)h+='<tr><th>Estándar<small>MEN</small></th><td>'+est.map(function(e){return '<div>'+esc(e.t)+' <span class="nota">('+esc(e.nota)+')</span></div>';}).join('')+'</td></tr>';
  if(dba.length)h+='<tr><th>DBA<small>Ciencias Naturales</small></th><td>'+dba.map(function(e){return '<div>'+esc(e.t)+' <span class="nota">('+esc(e.nota)+')</span></div>';}).join('')+'</td></tr>';
  h+='</tbody></table>';
  if(sed)h+='<p class="fuente">Fuente de los aprendizajes y evidencias: '+esc(D.ALINEACION.fuenteSED)+'</p>';
  return h;
}
// Espacio para escribir: cuadrícula de cuaderno (cuadros de 5 mm). Arranca
// con un tamaño mínimo y, al paginar, crece de a un cuadro para llenar el
// espacio que sobra en la hoja (ver llenarHoja).
var CUADRO=18.9;
function cuad(n,cls){return '<div class="cuad'+(cls?' '+cls:'')+'" style="height:'+(n*CUADRO).toFixed(1)+'px"></div>';}
function lineas(n){return cuad(Math.max(3,Math.round(n*1.3)));}
function pastillas(partes,neutral){return '<div class="pills">'+partes.map(function(p){var t=Array.isArray(p)?p[0]:p.t,c=Array.isArray(p)?p[1]:p.cls;return '<span class="pill p-'+(neutral?'n':c)+'">'+esc(t)+'</span>';}).join('')+'</div>';}

function bloquesPrevios(t){
  var p=t.previos;if(!p)return [];
  var out=[];
  out.push('<h4 class="sub">¿Sabías que…? <small>'+esc(t.corto)+'</small></h4><ul class="lista">'+p.curiosos.map(function(x){return '<li>'+escQ(x)+'</li>';}).join('')+'</ul>');
  out.push('<h4 class="sub">La química en contexto</h4><ul class="lista ctx">'+p.contexto.map(function(x){return '<li><span class="amb">'+esc(x.amb)+'</span> '+esc(x.t)+'</li>';}).join('')+'</ul>');
  out.push('<h4 class="sub">En tu vida diaria</h4><div class="chips">'+p.cotidianos.map(function(x){return '<span>'+esc(x)+'</span>';}).join('')+'</div>');
  p.activacion.forEach(function(q,i){out.push((i===0?'<h4 class="sub">Preguntas de activación <small>Responde con lo que sabes; no hay respuestas malas.</small></h4>':'')+'<div class="act"><b>'+(i+1)+'.</b> '+escQ(q)+lineas(3)+'</div>');});
  return out;
}
function bloquesInfo(t){
  var inf=t.info;if(!inf)return [];
  var out=[];
  inf.lectura.forEach(function(par,i){out.push((i===0?'<h4 class="sub">Lectura: lo esencial <small>'+esc(t.corto)+'</small></h4>':'')+'<p class="lect">'+escQ(par)+'</p>');});
  var e=inf.esquema;
  if(e)out.push('<h4 class="sub">Mapa de ideas</h4><div class="mapa"><div class="mapa-raiz">'+esc(e.raiz)+'</div><div class="mapa-ramas">'+e.ramas.map(function(r){return '<div class="mapa-rama"><b>'+esc(r.t)+'</b><ul>'+r.items.map(function(x){return '<li>'+esc(x)+'</li>';}).join('')+'</ul></div>';}).join('')+'</div></div>');
  var ej=t.ejemplo;
  if(ej&&ej.partes){
    out.push('<h4 class="sub">Ejemplo con el método MDEC</h4><div class="mdec-ej">'+figura(ej.gen?{gen:ej.gen}:{f:ej.f,t:ej.t},320,130)+
      pastillas(ej.partes,false)+'<table class="mdec-tab"><tbody>'+ej.partes.map(function(p){return '<tr><td><span class="pill p-'+p[1]+'">'+esc(p[0])+'</span></td><td>'+esc(NOMBRE_PARTE[p[1]]||'')+'</td><td>'+esc(p[2])+'</td></tr>';}).join('')+'</tbody></table>'+
      '<p class="nota">Se escribe en el orden ① ② ③ ④, pero se resuelve empezando por ④: grupo funcional, cadena y numeración, sustituyentes.</p></div>');
  }else if(ej&&ej.pares){
    out.push('<h4 class="sub">Ejemplo</h4><div class="pares">'+ej.pares.map(function(p){return '<div>'+figura({f:p.f},240,90)+'<b>'+esc(p.n)+'</b></div>';}).join('')+'</div><p class="nota">'+esc(ej.nota)+'</p>');
  }
  return out;
}
var INSTR={
  A:'Escribe el nombre IUPAC de cada estructura.',
  B:'Dibuja la estructura de cada compuesto (fórmula esquelética o semidesarrollada).',
  C:'Cada fragmento del nombre está coloreado según el modelo de cuatro partes. Escribe a qué parte pertenece y qué significa. En los aromáticos, «benceno» es a la vez cadena (②) y grupo (④).',
  D:'Completa cada reacción según lo que se pide. Cuando se pida el producto, dibuja su estructura y escribe su nombre IUPAC.',
  X:'Revisa el nombre que un compañero escribió para cada estructura. Si tiene un error, explícalo y escribe el nombre correcto.',
  Q:'Lee cada pregunta y encierra la letra de la respuesta correcta. Justifica brevemente tu elección.',
  E:'Resuelve en el espacio indicado.'
};
var TIT={A:'Nombrar',B:'Dibujar',C:'Reconocimiento de partes del nombre',D:'Reacciones',X:'Cazar errores',Q:'Selección múltiple',E:'Ejercicios abiertos'};
function htmlEjercicio(it,num){
  if(it.k==='A'){var fa=it._fig||figura(it.fig,330,120);return '<div class="ej'+(it._ancho?'':' mitad')+'"><span class="num">'+num+'</span>'+fa+'<div class="resp">Nombre IUPAC:<i></i></div></div>';}
  if(it.k==='B')return '<div class="ej mitad"><span class="num">'+num+'</span><div class="nom">'+esc(it.nombre)+'</div>'+cuad(6,'dibujo')+'</div>';
  if(it.k==='C')return '<div class="ej"><span class="num">'+num+'</span>'+pastillas(it.partes,false)+'<table class="mdec-tab blanco"><thead><tr><th>Fragmento</th><th>Parte (①–④)</th><th>¿Qué significa?</th></tr></thead><tbody>'+it.partes.map(function(p){return '<tr><td>'+esc(p.t)+'</td><td></td><td></td></tr>';}).join('')+'</tbody></table></div>';
  if(it.k==='D')return htmlRxnLibro(it.rxn,num);
  if(it.k==='X')return '<div class="ej"><span class="num">'+num+'</span><div class="x-fila">'+figura(it.fig,260,110)+'<div class="x-txt"><p>'+it.texto+'</p><div class="resp">Error:<i></i></div><div class="resp">Nombre correcto:<i></i></div></div></div></div>';
  if(it.k==='Q'){var ops=barajar(it.opts,rng('q|'+it.q)),L=['A','B','C','D'];
    return '<div class="ej"><span class="num">'+num+'</span><p class="enun">'+escQ(it.q)+'</p>'+(it.fig?figura(it.fig,300,110):'')+
      '<ol class="sq-ops'+(ops.every(function(o){return o.length<=34;})?' dos':'')+'">'+ops.map(function(o,j){return '<li><span class="let">'+L[j]+'</span> '+escQ(o)+'</li>';}).join('')+'</ol>'+cuad(2)+'</div>';}
  if(it.k==='E')return '<div class="ej"><span class="num">'+num+'</span><p class="enun">'+esc(it.q)+'</p>'+(it.fig?figura(it.fig,260,100):'')+cuad(7,'espacio')+'</div>';
  return '';
}
/* Elige n ejercicios repartidos entre los tipos marcados. */
// Reparte la cola de un tipo por subtema (alcohol, fenol, éter…) de forma
// alterna, para que la selección no quede cargada a un solo subtema.
function alternarSub(lista){
  var g={},orden=[];lista.forEach(function(x){var s=x.sub||'';if(!g[s]){g[s]=[];orden.push(s);}g[s].push(x);});
  if(orden.length<2)return lista;
  var out=[],i=0;while(out.length<lista.length){orden.forEach(function(s){if(g[s][i])out.push(g[s][i]);});i++;}
  return out;
}
function elegirEjercicios(P,tipos,n,r){
  var colas={};tipos.forEach(function(k){colas[k]=alternarSub(barajar(P[k]||[],r));});
  var orden=tipos.filter(function(k){return colas[k].length;});
  var cuenta={};orden.forEach(function(k){cuenta[k]=0;});
  var total=0,avanza=true;
  while(total<n&&avanza){avanza=false;for(var i=0;i<orden.length&&total<n;i++){var k=orden[i];if(cuenta[k]<colas[k].length){cuenta[k]++;total++;avanza=true;}}}
  // Un «cazar errores» no puede ser de una molécula que ya sale en Nombrar,
  // Dibujar o Partes del nombre del mismo documento (se regalaría el nombre).
  if(cuenta.X){
    var usados={};['A','B','C'].forEach(function(k){if(cuenta[k])colas[k].slice(0,cuenta[k]).forEach(function(it){usados[normNombre(it.nombre)]=1;});});
    colas.X=colas.X.filter(function(it){return !it.nombre||!usados[normNombre(it.nombre)];});
    cuenta.X=Math.min(cuenta.X,colas.X.length);
  }
  var porTipo=[];orden.forEach(function(k){if(cuenta[k])porTipo.push({k:k,items:colas[k].slice(0,cuenta[k])});});
  total=0;porTipo.forEach(function(g){total+=g.items.length;});
  return {porTipo:porTipo,total:total};
}
function bloquesEjercicios(sel,numIni){
  var out=[],num=numIni||1;
  sel.porTipo.forEach(function(g){
    var tit='<h4 class="sub">'+esc(TIT[g.k])+' <small>'+esc(INSTR[g.k])+'</small></h4>'+(g.k==='C'?leyendaPartes():'');
    var primero=true;
    if(g.k==='A'||g.k==='B'){
      // Estructuras muy anchas (cadenas largas semidesarrolladas) van en una
      // fila completa para que no queden con letra diminuta.
      var items=g.items.map(function(it){
        if(it.k!=='A')return it;
        var c=Object.assign({},it),ancha=figura(it.fig,640,150),m=ancha.match(/(?:data-w|width)="([\d.]+)"/);
        if(m&&+m[1]>300){c._ancho=true;c._fig=ancha;}else{c._fig=figura(it.fig,300,150);}
        return c;
      });
      var anchos=items.filter(function(x){return x._ancho;}),medios=items.filter(function(x){return !x._ancho;});
      for(var i=0;i<medios.length;i+=2){
        var fila='<div class="fila2">'+htmlEjercicio(medios[i],num++)+(medios[i+1]?htmlEjercicio(medios[i+1],num++):'')+'</div>';
        out.push((primero?tit:'')+fila);primero=false;
      }
      anchos.forEach(function(it){out.push((primero?tit:'')+htmlEjercicio(it,num++));primero=false;});
    }else{
      g.items.forEach(function(it){out.push((primero?tit:'')+htmlEjercicio(it,num++));primero=false;});
    }
  });
  return out;
}
function bloquesSaber(qs,r){
  var letras=['A','B','C','D'];
  return qs.map(function(q,i){
    var ops=barajar(q.o,r);
    var cortas=ops.every(function(o){return o.length<=34;});
    var muyCortas=ops.every(function(o){return o.length<=16;});
    var fig=q.fig?figura(q.fig,330,130):(q.f||q.gen)?figura(q.gen?{gen:q.gen,t:q.t}:{f:q.f,t:q.t},330,130):'';
    // Sin rótulo de competencia: el número va al inicio del contexto.
    return '<div class="sq"><p class="sq-ctx"><span class="num">'+(i+1)+'</span>'+escQ(q.ctx)+'</p>'+fig+(q.q?'<p class="sq-q">'+escQ(q.q)+'</p>':'')+
      '<ol class="sq-ops'+(cortas?' dos':'')+(muyCortas?' mc':'')+'">'+ops.map(function(o,j){return '<li><span class="let">'+letras[j]+'</span> '+escQ(o)+'</li>';}).join('')+'</ol></div>';
  });
}
function bloqueHojaRespuestas(n){
  var h='<div class="hr"><h4 class="sub">Hoja de respuestas <small>Rellena completamente un solo círculo por pregunta.</small></h4><div class="hr-grid">';
  for(var i=1;i<=n;i++){h+='<div class="hr-f"><b>'+i+'</b>'+['A','B','C','D'].map(function(l){return '<span class="bur">'+l+'</span>';}).join('')+'</div>';}
  return h+'</div></div>';
}
// Preguntas abiertas: tres tipos (reacción, nomenclatura, partes del nombre),
// cada una con su rótulo. La de partes trae una tabla para separar el nombre
// en sus 4 partes y colorearlas según el modelo.
var TIPO_AB={rx:'Reacción',nom:'Nomenclatura',mdec:'Partes del nombre',con:'Conceptos'};
// Leyenda con los colores del modelo de cuatro partes.
var PARTES=[['r','①','Sustituyentes'],['c','②','Cadena principal'],['i','③','Insaturaciones'],['g','④','Grupo funcional']];
function leyendaPartes(){return '<div class="leyenda">'+PARTES.map(function(x){return '<span class="pill p-'+x[0]+'">'+x[1]+' '+x[2]+'</span>';}).join('')+'</div>';}
// Categorías de reacción que superan el nivel de bachillerato.
var RXN_FUERA=/diazo|aldólica|acetiluro|Acidez \(alquinos\)|Reducción \(alquinos\)/i;
// Campos de respuesta de cada ejercicio de reacción, según lo que pide su
// enunciado (no siempre «Tipo de reacción / Condiciones»). Cuando hay que
// escribir una estructura, el campo es una cuadrícula y no una línea.
function camposRxn(r){
  var e=String(r.enunciado||''),c=null;
  function f(l){return '<div class="rx-campo"><span>'+l+'</span><i></i></div>';}
  function g(l){return '<div class="rx-campo rx-dib"><span>'+l+'</span></div>'+cuad(3);}
  var REGLAS=[
    [/nucle[oó]filo.*saliente/i,['Tipo de reacción:','Nucleófilo:','Grupo saliente:']],
    [/electr[oó]filo.*posici/i,['Tipo de reacción:','Electrófilo:','Posiciones a las que dirige:']],
    [/activante o desactivante/i,['Activante o desactivante:','Posiciones a las que dirige:']],
    [/posici[oó]n/i,['Tipo de reacción:','Posición en el anillo:']],
    [/no ocurre/i,['¿Ocurre reacción? Producto o explicación:']],
    [/evidencia|observaci[oó]n|qué se observa/i,[/tipo de reacci|clasifica/i.test(e)?'Tipo de reacción:':null,'Observación:']],
    [/equivalentes/i,['Equivalentes de Grignard:','Tipo de alcohol (1°, 2° o 3°):']],
    [/tipo de alcohol/i,['Tipo de alcohol (1°, 2° o 3°):']],
    [/tipo de combusti[oó]n/i,['Tipo de combustión:','Condición de oxígeno:']],
    [/qué oxidante/i,['Oxidante:']],
    [/mecanismo/i,['Tipo de reacción:','Mecanismo:']],
    [/característica/i,['Tipo de reacción:','Característica clave:']],
    [/reactivo necesario/i,['Tipo de reacción:','Reactivo necesario:']],
    [/catalizador necesario/i,['Tipo de reacción:','Catalizador:']],
    [/reacción que ocurre:$/i,['Tipo de reacción:']]
  ];
  if(r.pregunta_tipo==='tipo'){
    for(var i=0;i<REGLAS.length;i++)if(REGLAS[i][0].test(e)){c=REGLAS[i][1].filter(Boolean).map(f).join('');break;}
    if(!c)c=f('Tipo de reacción:')+f('Condiciones / catalizador:');
  }else if(r.pregunta_tipo==='reactivo'){
    c=g(/de partida/i.test(e)?'Compuesto de partida (estructura y nombre):':'Reactivo(s) necesario(s):')+(r.condicion==='???'?f('Condiciones / catalizador:'):'');
  }else{
    c=g(/ecuaci[oó]n/i.test(e)?'Ecuación completa y balanceada:':/productos/i.test(e)?'Productos (estructura y nombre):':'Producto principal (estructura y nombre):');
  }
  return c;
}
/* ── Reacciones en formato «tipo libro» (motor FX de fx-libro.js, el mismo
   de reacciones.html): fórmulas condensadas con los sustituyentes apilados,
   anillos dibujados y condiciones sobre la flecha. ─────────────────────── */
var FX_HUECO='ØQØ';
// Fórmula del banco (texto Unicode) → notación FX.
function aFx(t){
  t=String(t||'').trim();if(!t)return '';
  if(t==='???'||t==='?')return FX_HUECO;
  var coef='';var mc=t.match(/^(\d+)\s+(.+)$/);if(mc){coef=mc[1]+' ';t=mc[2];}
  t=t.replace(/\(CH₃\)₃C−?/g,'⟦CH₃|C|CH₃⟧—').replace(/^⟦CH₃\|C\|CH₃⟧—/,'CH₃—⟦CH₃|C|CH₃⟧—');
  t=t.replace(/C\(([^()]+)\)\(([^()]+)\)/g,'⟦$1|C|$2⟧');
  t=t.replace(/C₆H₁₁/g,'@chex—').replace(/C₆H₆/g,'@ring').replace(/C₆H₅/g,'@ring');
  t=t.replace(/—−/g,'—').replace(/—$/,'');
  return coef+fxNorm(t);
}
// «HBr (1 eq., en frío)» → ['HBr','1 eq., en frío']
function partirNota(t){var m=String(t||'').match(/^(.*?\S)\s+\(([^()]*)\)$/);return m?[m[1],m[2]]:[t,''];}
function ecuacionLibro(r){
  var izq=[],der=[],arriba='',abajo='';
  var reac=String(r.reactivo||'').replace(/^\s*\+\s*/,'').trim(),nota='';
  if(r.r)izq.push(aFx(r.r));else izq.push(FX_HUECO);
  if(reac&&reac.indexOf('→')>=0){
    // Ecuación con productos ya escritos (p. ej. «+ O₂ → 3 CO₂ + 4 H₂O»).
    var pz=reac.split('→');izq.push(pz[0].trim().split(/\s\+\s/).map(aFx).join(' + '));der=pz[1].trim().split(/\s\+\s/).map(aFx);
  }else{
    if(reac){var pn=partirNota(reac);nota=pn[1];izq.push(pn[0].split(/\s\+\s/).map(aFx).join(' + '));}
    der.push(r.pregunta_tipo==='reactivo'&&r.producto?aFx(r.producto):FX_HUECO);
    if(r.subproducto)der.push(aFx(partirNota(String(r.subproducto).replace(/↑|↓/g,''))[0]));
  }
  var cnd=String(r.condicion||'').trim();
  if(cnd==='???')arriba=FX_HUECO;
  else if(cnd){var m2=cnd.match(/^(1\).+?)\s{2,}(2\).+)$/)||cnd.match(/^(.{4,}?)[:;]\s+(.+)$/);var cs=m2?[m2[1],m2[2]]:fxCondSplit(cnd);arriba=cs[0];abajo=cs[1];}
  if(nota)abajo=abajo?abajo+'; '+nota:nota;
  var n=izq.join(' + ')+' -['+arriba+'|'+abajo+']-> '+der.join(' + ');
  var h=FX.eq(n);
  h=h.split('<span class="fx-t">'+FX_HUECO+'</span>').join('<span class="fx-t"><span class="rx-hueco">?</span></span>')
     .split(FX_HUECO).join('<span class="rx-hueco sm">?</span>');
  return '<div class="fx-mol rx-eq'+(/[⟦@]/.test(n)?' fx-hs':'')+'">'+h+'</div>';
}
function htmlRxnLibro(r,num){
  var eq='';try{eq=ecuacionLibro(r);}catch(e){eq='<p>'+esc((r.r||'?')+' '+(r.reactivo||'')+' → ?')+'</p>';}
  return '<div class="ej rx"><span class="num">'+num+'</span><p class="rx-enun">'+esc(r.enunciado||'')+'</p>'+eq+camposRxn(r)+'</div>';
}
// Pregunta abierta de reacción escrita como «A + B → ? (condición). Instrucción»:
// la ecuación se dibuja en formato libro y la instrucción queda como texto.
// Si el enunciado no tiene esa forma (p. ej. «El 2-metilpropano reacciona…»),
// devuelve null y se deja el texto tal cual.
var NOMBRES_FX={'Benceno':'C₆H₆','Tolueno':'C₆H₅−CH₃','Nitrobenceno':'C₆H₅−NO₂'};
function abiertaLibro(q){
  var m=String(q||'').match(/^(.+?)\s*→\s*\?\s*(?:\(([^()]*(?:\([^()]*\)[^()]*)*)\))?\.?\s*(.*)$/);
  if(!m||/→/.test(m[3]))return null;
  var izq=m[1].replace(/\b(Benceno|Tolueno|Nitrobenceno)\b/g,function(x){return NOMBRES_FX[x];});
  if(/[a-záéíóú]{3,}/.test(izq.replace(/\([^()]*\)/g,'')))return null;
  var t=izq.split(/\s\+\s/);
  // Sobre la flecha va solo la condición corta; una explicación larga
  // («…: los dos H se adicionan por el mismo lado») pasa al texto como pista.
  var cond=(m[2]||'').replace(/^con\s+/,''),pista='';
  var mc=cond.match(/^(.+?)[:;]\s+(.+)$/);if(mc){cond=mc[1];pista=mc[2];}
  if(cond.length>24){pista=cond;cond='';}
  var r={r:t[0],reactivo:t.length>1?'+ '+t.slice(1).join(' + '):'',condicion:cond,pregunta_tipo:'producto'};
  var texto=(m[3]||'Escribe y nombra el producto.')+(pista?' Pista: '+pista.charAt(0).toLowerCase()+pista.slice(1)+'.':'');
  try{return {eq:ecuacionLibro(r),texto:texto};}catch(e){return null;}
}
function htmlAbierta(a,num){
  if(typeof a==='string')return '<div class="ab"><b>'+num+'.</b> '+esc(a)+lineas(5)+'</div>';
  var tag='<span class="ab-tag">'+(TIPO_AB[a.t]||'')+'</span>';
  if(a.t==='mdec'){
    return '<div class="ab"><b>'+num+'.</b> '+tag+' Reconoce las partes del nombre y colorea cada una con el color de su parte en el modelo. Escribe cada fragmento en su fila, explica qué indica y dibuja la estructura. Si una parte no aparece en el nombre, escribe «no tiene».'+
      '<div class="ab-nom">'+esc(a.n)+'</div>'+
      '<table class="mdec-tab blanco ab-mdec"><thead><tr><th>Parte</th><th>Fragmento del nombre</th><th>¿Qué indica?</th></tr></thead><tbody>'+
      PARTES.map(function(f){return '<tr><td><span class="pill p-'+f[0]+'">'+f[1]+' '+f[2]+'</span></td><td></td><td></td></tr>';}).join('')+'</tbody></table>'+
      '<div class="ab-est">Estructura:</div>'+cuad(4)+'</div>';
  }
  if(a.t==='rx'){var lb=abiertaLibro(a.q);if(lb)return '<div class="ab"><b>'+num+'.</b> '+tag+' '+escQ(lb.texto)+lb.eq+lineas(5)+'</div>';}
  return '<div class="ab"><b>'+num+'.</b> '+tag+' '+escQ(a.q)+(a.f?figura({f:a.f},600,130):'')+lineas(5)+'</div>';
}
function bloquesAbiertas(as,ini){
  return as.map(function(a,i){
    return (i===0?'<h4 class="sub">Preguntas abiertas <small>Escribe estructuras, nombres y productos en la cuadrícula; justifica cuando se pida.</small></h4>':'')+htmlAbierta(a,ini+i);});
}
// Elige n preguntas abiertas repartidas entre los tres tipos (reacción,
// nomenclatura, partes del nombre), en ronda, para que no salgan todas del mismo tipo.
function elegirAbiertas(pool,n,r){
  var orden=['rx','nom','mdec','con'],colas={};
  orden.forEach(function(t){colas[t]=barajar(pool.filter(function(a){return a&&a.t===t;}),r);});
  var otras=barajar(pool.filter(function(a){return !a||orden.indexOf(a.t)<0;}),r);
  var out=[],k=0,guard=0;
  while(out.length<n&&guard++<200){
    var t=orden[k%orden.length];k++;
    if(colas[t].length)out.push(colas[t].shift());
    else if(!colas.rx.length&&!colas.nom.length&&!colas.mdec.length&&!colas.con.length){if(otras.length)out.push(otras.shift());else break;}
  }
  return out;
}
function bloquesRubricas(temas,conAbiertas){
  // Toda evaluación con preguntas abiertas lleva al menos una de reacción,
  // así que se anexa también la rúbrica D para calificarla.
  var ids=conAbiertas?{'rub-d':1}:{};temas.forEach(function(t){
    var m={cadena:['rub-a','rub-c'],reacciones:['rub-d'],haluros:['rub-a','rub-b','rub-d'],isomeria:['rub-a','rub-b'],carbono:[],tipos_carbono:[],cadenas:[]}[t.id]||['rub-a','rub-b'];
    m.forEach(function(x){ids[x]=1;});
  });
  // Con «Solo nomenclatura» no hay preguntas de reacción que calificar.
  if(temas.length&&temas.every(function(t){return t._nom;}))delete ids['rub-d'];
  var out=[];
  Object.keys(ids).sort().forEach(function(id){
    var el=document.getElementById(id);if(!el)return;
    var tit=el.querySelector('h3');var tabla=el.nextElementSibling;
    out.push('<h4 class="sub">'+esc(tit?tit.textContent:'Rúbrica')+'</h4>'+(tabla?tabla.innerHTML:''));
  });
  return out;
}

/* ── Paginación en hojas tamaño carta ────────────────────────────────── */
// Llena el espacio que sobra al final de una hoja: lo reparte, de a un
// cuadro, entre los espacios cuadriculados de esa hoja (los que quedan en la
// misma fila crecen juntos). Si la hoja no tiene ninguno y sobra bastante,
// agrega un recuadro cuadriculado de notas / borrador.
function llenarHoja(h,clase,ultima){
  var c=h.querySelector('.hoja-cuerpo');
  function libre(){var u=c.lastElementChild;if(!u)return c.clientHeight;return c.getBoundingClientRect().bottom-u.getBoundingClientRect().bottom-3;}
  var areas=[].slice.call(c.querySelectorAll('.cuad'));
  if(!areas.length){
    if(clase==='anexo'||c.querySelector('.hr'))return;
    var n=Math.floor((libre()-30)/CUADRO);
    if(n<4)return;
    var w=document.createElement('div');w.className='blq';
    w.innerHTML='<div class="notas-tit">'+(clase==='eval'?'Borrador y cálculos (no se califica)':'Notas')+'</div>'+cuad(n,'notas');
    c.appendChild(w);
    while(c.scrollHeight>c.clientHeight+1&&n>2){n--;w.querySelector('.cuad').style.height=(n*CUADRO).toFixed(1)+'px';}
    return;
  }
  var filas=[];
  areas.forEach(function(a){var t=Math.round(a.getBoundingClientRect().top);var f=null;filas.forEach(function(x){if(Math.abs(x.t-t)<8)f=x;});if(f)f.a.push(a);else filas.push({t:t,a:[a]});});
  var pasos=Math.floor(libre()/CUADRO),k=0,hechos=[];
  while(pasos>0&&k<400){
    var f=filas[k%filas.length];k++;
    if(parseFloat(f.a[0].style.height)>=26*CUADRO)continue;
    f.a.forEach(function(a){a.style.height=(parseFloat(a.style.height)+CUADRO).toFixed(1)+'px';});
    hechos.push(f);pasos--;
  }
  while(c.scrollHeight>c.clientHeight+1&&hechos.length){
    var g=hechos.pop();g.a.forEach(function(a){a.style.height=(parseFloat(a.style.height)-CUADRO).toFixed(1)+'px';});
  }
  // Si la hoja ya venía desbordada (un bloque más alto que la hoja), se
  // encogen los cuadriculados hasta un mínimo de 2 cuadros para que no
  // queden cortados en el borde inferior.
  var guard=0;
  while(c.scrollHeight>c.clientHeight+1&&guard++<200){
    var mayor=null;filas.forEach(function(x){var hh=parseFloat(x.a[0].style.height);if(hh>2.5*CUADRO&&(!mayor||hh>parseFloat(mayor.a[0].style.height)))mayor=x;});
    if(!mayor)break;
    mayor.a.forEach(function(a){a.style.height=(parseFloat(a.style.height)-CUADRO).toFixed(1)+'px';});
  }
}
function paginar(doc,medidor){
  var hojas=[];
  function nueva(){
    var h=document.createElement('div');h.className='hoja hoja-'+doc.clase;
    // Marca de agua de ChromaNom en el centro de cada hoja (imagen de marca).
    h.innerHTML='<img class="marca-agua" src="icons/marca-agua.png" alt="" aria-hidden="true"><div class="hoja-cab">'+doc.cab+'</div><div class="hoja-cuerpo"></div><div class="hoja-pie"><span class="pie-n"></span><span>ChromaNom · © 2026 Harvey Barcenas Morales · Licencia CC BY-NC 4.0 · hbarcenasm863.github.io/chromanom</span></div>';
    medidor.appendChild(h);hojas.push(h);return h.querySelector('.hoja-cuerpo');
  }
  var cuerpo=nueva();
  if(doc.primera){cuerpo.parentNode.querySelector('.hoja-cab').style.display='none';}
  // Las preguntas de selección múltiple (tipo Saber) van a doble columna:
  // se agrupan en un contenedor .cols2 por hoja; si la siguiente no cabe,
  // se abre otra hoja con su propio contenedor.
  function contenedorCols(){
    var u=cuerpo.lastElementChild;
    if(u&&u.classList.contains('cols2'))return u;
    var c=document.createElement('div');c.className='blq cols2';cuerpo.appendChild(c);return c;
  }
  doc.bloques.forEach(function(html,i){
    var w=document.createElement('div');w.className='blq';w.innerHTML=(i===0&&doc.primera?doc.primera:'')+html;
    var enCols=!(i===0&&doc.primera)&&/^<div class="sq"/.test(html);
    var dest=enCols?contenedorCols():cuerpo;
    dest.appendChild(w);
    if(cuerpo.scrollHeight>cuerpo.clientHeight+1&&(cuerpo.children.length>1||dest.children.length>1)){
      dest.removeChild(w);
      if(enCols&&!dest.children.length)cuerpo.removeChild(dest);
      cuerpo=nueva();
      (enCols?contenedorCols():cuerpo).appendChild(w);
    }
  });
  hojas.forEach(function(h,i){llenarHoja(h,doc.clase,i===hojas.length-1);});
  hojas.forEach(function(h,i){h.querySelector('.pie-n').textContent=doc.etiqueta+' — página '+(i+1)+' de '+hojas.length;});
  return hojas;
}

/* ── Construir los documentos ────────────────────────────────────────── */
function leerForm(){
  var fecha=$('f-fecha').value;var fs='';
  if(fecha){try{fs=new Date(fecha+'T00:00:00').toLocaleDateString('es-CO',{day:'numeric',month:'long',year:'numeric'});}catch(e){fs=fecha;}}
  return {
    tipo:valor('tipodoc')||'guia',temas:temasSel(),grado:+valor('grado')||11,
    alin:{sed:$('f-sed').value,ev:marcados('ev'),est:marcados('est'),dba:marcados('dba')},
    tipos:marcados('tipoej'),nEj:Math.max(2,Math.min(40,+$('f-nej').value||12)),
    nSaber:Math.max(0,Math.min(30,+$('f-nsaber').value||0)),nAb:Math.max(0,Math.min(6,+$('f-nab').value||0)),
    hojaResp:$('f-hr').checked,rubrica:$('f-rub').checked,nVersiones:Math.max(1,Math.min(8,+$('f-nver').value||1)),variante:($('f-var').value||'1').trim(),
    enc:{colegio:$('f-colegio').value.trim(),docente:$('f-docente').value.trim(),curso:$('f-curso').value.trim(),periodo:$('f-periodo').value.trim(),fecha:fs}
  };
}
function construirVersion(F,verIdx,verTotal,soloEval){
  var avisos=[];
  var nombreTemas=F.temas.map(function(t){return t.corto;}).join(' · ');
  var semilla=[F.variante,verIdx,F.tipo,F.temas.map(function(t){return t.id;}).join(',')].join('|');
  var P=poolEjercicios(F.temas);
  var tipos=F.tipos.filter(function(k){return (P[k]||[]).length;});
  var docs=[];
  // Con una sola versión no hace falta el rótulo; con varias, cada hoja dice
  // «Versión X de N» para que el docente reparta/corte sin confundirlas.
  var verLbl=verTotal>1?('Versión '+verIdx+' de '+verTotal):'';
  var cabCorta=function(lbl,sinVersion){return esc(lbl)+' · '+esc(nombreTemas)+(F.enc.colegio?' · '+esc(F.enc.colegio):'')+(verLbl&&!sinVersion?' · '+verLbl:'');};

  // Ejercicios
  var selEj=null;
  if(F.tipo!=='evaluacion'&&!soloEval){
    if(!tipos.length)avisos.push('No hay ejercicios disponibles para los tipos marcados en los temas elegidos.');
    else{selEj=elegirEjercicios(P,tipos,F.nEj,rng(semilla+'|ej'));if(selEj.total<F.nEj)avisos.push('Solo hay '+selEj.total+' ejercicios disponibles para esta selección.');}
  }
  if(F.tipo==='guia'&&!soloEval){
    var b=[];
    b.push('<div class="ruta"><span>Sesión 1 · Aprendizajes previos</span><span>Sesión 2 · Información</span><span>Sesión 3 · Trabajo práctico</span><span>Sesión 4 · Evaluación (hojas aparte)</span></div>');
    b.push('<h3 class="ses"><span>1</span> Aprendizajes previos</h3><p class="intro">Antes de empezar, recordemos lo que ya sabes y dónde aparece este tema en tu vida.</p>');
    F.temas.forEach(function(t){b=b.concat(bloquesPrevios(t));});
    b.push('<h3 class="ses"><span>2</span> Información</h3><p class="intro">Lee con atención y subraya las ideas principales.</p>');
    F.temas.forEach(function(t){b=b.concat(bloquesInfo(t));});
    b.push('<h3 class="ses"><span>3</span> Trabajo práctico</h3><p class="intro">Resuelve en esta guía. Puedes consultar la Hoja de referencia de ChromaNom.</p>');
    if(selEj)b=b.concat(bloquesEjercicios(selEj,1));
    b.push('<h3 class="ses"><span>4</span> Evaluación</h3><p class="intro">La evaluación se entrega en hojas aparte. Antes, marca con una X qué tan bien puedes hacer cada cosa:</p>'+
      '<table class="auto"><thead><tr><th>Puedo…</th><th>Lo logro</th><th>Con ayuda</th><th>Aún no</th></tr></thead><tbody>'+
      ['Identificar la cadena principal y numerarla','Nombrar compuestos del tema con IUPAC 2013','Dibujar una estructura a partir de su nombre','Explicar una propiedad o reacción con la estructura'].map(function(x){return '<tr><td>'+x+'</td><td></td><td></td><td></td></tr>';}).join('')+'</tbody></table>');
    // La guía sale una sola vez (es igual para todos): no lleva rótulo de versión.
    var prim=encabezadoInst(F.enc,'Guía de aprendizaje: '+F.temas.map(function(t){return t.titulo;}).join(' · '),'Química orgánica · Grado '+F.grado+'.º','')+lineaEstudiante();
    docs.push({clase:'guia',etiqueta:'Guía',cab:cabCorta('Guía',true),primera:prim,bloques:b});
  }
  if(F.tipo==='taller'){
    var bt=selEj?bloquesEjercicios(selEj,1):[];
    var primT=encabezadoInst(F.enc,'Taller de ejercicios: '+nombreTemas,'Química orgánica · Grado '+F.grado+'.º',verLbl)+lineaEstudiante();
    docs.push({clase:'taller',etiqueta:verTotal>1?'Taller '+verIdx+'/'+verTotal:'Taller',cab:cabCorta('Taller'),primera:primT,bloques:bt.length?bt:['<p>No hay ejercicios para esta selección.</p>']});
  }
  if(F.tipo==='guia'||F.tipo==='evaluacion'){
    var poolS=[];F.temas.forEach(function(t){poolS=poolS.concat(saberDe(t).filter(filtroPreg(t)));});
    var r=rng(semilla+'|saber');
    var qs=barajar(poolS,r).slice(0,F.nSaber);
    if(F.nSaber&&qs.length<F.nSaber)avisos.push(poolS.length?'El banco tiene '+poolS.length+' preguntas tipo Saber para este tema; se usan todas.':'No hay preguntas tipo Saber para esta selección; la evaluación lleva solo preguntas abiertas.');
    var poolA=[];F.temas.forEach(function(t){poolA=poolA.concat((D.ABIERTAS[t.id]||[]).filter(filtroPreg(t)));});
    var ab=elegirAbiertas(poolA,F.nAb,rng(semilla+'|abiertas'));
    var be=[];
    if(qs.length)be.push('<p class="instr"><b>Instrucciones.</b> Preguntas '+(qs.length>1?'1 a '+qs.length:'1')+': selección múltiple con única respuesta (tipo Saber 11). Lee el contexto, analiza las cuatro opciones y marca una sola '+(F.hojaResp?'en la hoja de respuestas.':'encerrando su letra.')+(ab.length?' Preguntas '+(qs.length+1)+' a '+(qs.length+ab.length)+': abiertas, responde en el espacio indicado.':'')+'</p>');
    be=be.concat(bloquesSaber(qs,r));
    be=be.concat(bloquesAbiertas(ab,qs.length+1));
    if(F.hojaResp&&qs.length)be.push(bloqueHojaRespuestas(qs.length));
    if(!be.length)be.push('<p>No hay preguntas para esta selección.</p>');
    var primE=encabezadoInst(F.enc,'Evaluación: '+nombreTemas,'Química orgánica · Grado '+F.grado+'.º',verLbl)+
      '<div class="est-lin"><div><span>Nombre</span><i></i></div><div class="corta"><span>Curso</span><i></i></div>'+(F.enc&&F.enc.fecha?'':'<div class="corta"><span>Fecha</span><i></i></div>')+'</div>';
    docs.push({clase:'eval',etiqueta:verTotal>1?'Evaluación '+verIdx+'/'+verTotal:'Evaluación',cab:cabCorta('Evaluación'),primera:primE,bloques:be});
    // El anexo de rúbricas no depende de la semilla (es el mismo criterio de
    // evaluación para todas las versiones): con varias versiones solo se
    // agrega una vez, al final, para no repetir la misma hoja N veces.
    if(F.rubrica&&verIdx===verTotal){
      var br=bloquesRubricas(F.temas,ab.some(function(a){return a&&a.t==='rx';}));
      if(br.length)docs.push({clase:'anexo',etiqueta:'Anexo: rúbricas',cab:cabCorta('Anexo: rúbricas',true),primera:'<h3 class="ses ses-anexo">Anexo: rúbricas de evaluación</h3><p class="intro">Niveles de desempeño de la escala nacional (Decreto 1290 de 2009). La equivalencia numérica la define el SIEE de la institución.</p>',bloques:br});
    }
  }
  return {docs:docs,avisos:avisos};
}
// «Guía completa»: las sesiones 1-3 son de estudio y salen una sola vez;
// lo que se reparte para evitar copia es la evaluación (hojas aparte), así
// que con N versiones la guía sale 1 vez y la evaluación sale N veces.
// Taller y evaluación sueltos salen N veces completos.
function construirTodas(F){
  var N=F.nVersiones;
  var avisos=[],docs=[];
  for(var i=1;i<=N;i++){
    var R=construirVersion(F,i,N,F.tipo==='guia'&&i>1);
    docs=docs.concat(R.docs);
    R.avisos.forEach(function(a){if(avisos.indexOf(a)<0)avisos.push(a);});
  }
  return {docs:docs,avisos:avisos};
}

var ultimo=null;
function generar(){
  var F=leerForm();
  var info=$('vista-info');
  if(!F.temas.length){info.innerHTML='<p class="aviso warn">Marque al menos un tema.</p>';return Promise.resolve();}
  info.innerHTML='<p class="aviso">⏳ Armando el documento'+(F.nVersiones>1?'s':'')+'…</p>';
  return bancosListos.then(function(){
    // La letra de libro (STIX) se descarga solo cuando se usa: hay que
    // pedirla ANTES de medir las páginas, o se mide con la letra de
    // reemplazo y después el texto crece y desborda la hoja.
    if(!document.fonts||!document.fonts.load)return null;
    return Promise.all(['400 13.5px "STIX Two Text"','700 13.5px "STIX Two Text"','italic 400 13.5px "STIX Two Text"','600 13.5px "STIX Two Text"','700 12px "JetBrains Mono"','400 12px "Outfit"','700 12px "Outfit"'].map(function(f){return document.fonts.load(f).catch(function(){});})).then(function(){return document.fonts.ready;});
  }).then(function(){
    var R=construirTodas(F);
    var medidor=$('medidor');medidor.innerHTML='';
    var vista=$('vista');vista.innerHTML='';
    var resumen=[];
    R.docs.forEach(function(doc){var hs=paginar(doc,medidor);resumen.push(doc.etiqueta+': '+hs.length+' página'+(hs.length>1?'s':''));hs.forEach(function(h){vista.appendChild(h);});});
    medidor.innerHTML='';
    ultimo=F;
    info.innerHTML='<p class="aviso ok">✅ '+esc(resumen.join(' · '))+'. Revise la vista previa y luego use <b>Imprimir / Guardar PDF</b> (tamaño carta).</p>'+
      R.avisos.map(function(a){return '<p class="aviso warn">'+esc(a)+'</p>';}).join('')+
      '<p class="nota-sin-clave">Por decisión del docente, las evaluaciones no llevan clave de respuestas.</p>';
    $('btn-imprimir').disabled=false;
    ajustarZoom();
    document.body.classList.add('hay-docs');
  });
}
function ajustarZoom(){
  var v=$('vista');if(!v)return;
  var ancho=v.parentNode.clientWidth;
  v.style.zoom=Math.min(1,ancho/820).toFixed(3);
}
// La marca de agua se descarga antes, para que salga en la primera impresión.
var imgMarca=new Image();imgMarca.src='icons/marca-agua.png';
function imprimir(){
  if(!$('vista').children.length){generar().then(function(){window.print();});return;}
  window.print();
}

/* ── Arranque ────────────────────────────────────────────────────────── */
function iniciar(){
  restaurar();
  var hoy=new Date();$('f-fecha').value=hoy.getFullYear()+'-'+String(hoy.getMonth()+1).padStart(2,'0')+'-'+String(hoy.getDate()).padStart(2,'0');
  TEMAS=D.TEMAS.slice();pintarTemas();
  document.querySelectorAll('input[name=grado]').forEach(function(c){c.addEventListener('change',alinSugerida);});
  $('f-sed').addEventListener('change',function(){pintarEvidencias([]);});
  $('btn-sugerida').addEventListener('click',alinSugerida);
  CAMPOS.forEach(function(id){$(id).addEventListener('change',guardar);});
  document.querySelectorAll('input[name=tipodoc]').forEach(function(c){c.addEventListener('change',syncTipoDoc);});
  document.querySelectorAll('input[name=enfoque]').forEach(function(c){c.addEventListener('change',pintarTipos);});
  syncTipoDoc();
  $('btn-generar').addEventListener('click',function(){generar().then(function(){var v=$('vista-wrap');if(v&&v.scrollIntoView)v.scrollIntoView({behavior:'smooth',block:'start'});});});
  $('btn-imprimir').addEventListener('click',imprimir);
  window.addEventListener('resize',ajustarZoom);
  pintarEstado();$('btn-generar').disabled=false;
}
function syncTipoDoc(){
  var t=valor('tipodoc');
  document.body.classList.toggle('sin-ej',t==='evaluacion');
  document.body.classList.toggle('sin-eval',t==='taller');
  if(t==='taller'&&+$('f-nej').value<16)$('f-nej').value=20;
  if(t==='guia'&&+$('f-nej').value>16)$('f-nej').value=12;
  // El número de versiones funciona con los tres tipos (en la guía completa
  // aplica a la evaluación de las hojas aparte); solo cambia la ayuda.
  var ay=$('f-nver-ayuda');
  if(ay)ay.textContent=t==='guia'
    ?'Guía completa: las sesiones de estudio salen una sola vez y la evaluación (hojas aparte) sale en esa cantidad de versiones, cada una con distinto orden de preguntas y de opciones, marcada «Versión X de N».'
    :'Genera esa cantidad de '+(t==='taller'?'talleres':'evaluaciones')+' de una vez —cada versión con distinto orden de preguntas y de opciones, y marcada «Versión X de N»—, listas para imprimir juntas en la misma vista.';
}
window.DocenteGen={generar:generar,bancos:function(){return bancosListos;},_B:B};
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',iniciar);else iniciar();
})();
