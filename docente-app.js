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
    B.G={w:w,getSVG:leer(w,'getSVG'),mkDevSVG:leer(w,'mkDevSVG'),parse:leer(w,'_parseChainStr'),alias:leer(w,'_RXN_ALIASES')||{},tipoD:leer(w,'buildTipoDCard')};
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
    B.J={w:w,M:leer(w,'M')||{},MOLDES:leer(w,'MOLDES')||{},mkDevSVG:leer(w,'mkDevSVG')};
    B.jue=todos;B.jueLabels=leer(w,'NIVEL_LABELS')||{};B.estado.jue=todos.length?'ok':'error';
  }).catch(function(){B.estado.jue='error';})
]).then(function(){prepararTemas();pintarEstado();});

/* ── Dibujo de estructuras ───────────────────────────────────────────── */
function tamSvg(svg,wMax,hMax,sMax,sMin){
  if(!svg||svg.indexOf('<svg')<0)return svg||'';
  var vb=svg.match(/viewBox="\s*([-\d.]+)[\s,]+([-\d.]+)[\s,]+([\d.]+)[\s,]+([\d.]+)/);
  if(!vb)return svg;
  var vw=+vb[3],vh=+vb[4];if(!vw||!vh)return svg;
  var s=Math.max(Math.min(wMax/vw,hMax/vh,sMax||1.4),sMin||0.5);
  s=Math.min(s,wMax/vw,hMax/vh);
  return svg.replace(/<svg\b([^>]*)>/,function(all,attrs){
    attrs=attrs.replace(/\s(width|height)="[^"]*"/g,'').replace(/style="[^"]*"/,'');
    return '<svg'+attrs+' width="'+(vw*s).toFixed(1)+'" height="'+(vh*s).toFixed(1)+'" style="display:block;margin:0 auto;overflow:visible">';
  });
}
function figura(spec,wMax,hMax){
  wMax=wMax||300;hMax=hMax||130;
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
  if(svg&&svg.indexOf('<svg')>=0)return '<div class="fig">'+tamSvg(svg,wMax,hMax)+'</div>';
  var txt=spec.t||(typeof spec.f==='string'?spec.f:'');
  return txt?'<div class="fig fig-txt">'+esc(txt)+'</div>':'';
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
    if(!usado){TEMAS.push({id:'jue_'+tp,titulo:limpiaEtiqueta(B.jueLabels[tp])||tp,corto:limpiaEtiqueta(B.jueLabels[tp])||tp,gen:[],jue:new RegExp('^'+tp+'$'),rxn:[],extra:true,nomenclatura:true,alin:D.TEMAS[0].alin,propia:[]});}
  });
  pintarTemas();
}
function normNombre(s){return String(s||'').toLowerCase().replace(/\s+/g,' ').trim();}
function quitaHtml(s){var d=document.createElement('div');d.innerHTML=s||'';return (d.textContent||'').trim();}

function poolEjercicios(temas){
  var P={A:[],B:[],C:[],D:[],X:[],E:[]},nomA={},nomB={},nomC={},rx={};
  function addA(nombre,item){var k=normNombre(nombre);if(!k||nomA[k])return;nomA[k]=1;P.A.push(item);}
  function addB(nombre,item){var k=normNombre(nombre);if(!k||nomB[k])return;nomB[k]=1;P.B.push(item);}
  function addC(nombre,item){var k=normNombre(nombre);if(!k||nomC[k])return;nomC[k]=1;P.C.push(item);}
  temas.forEach(function(t){
    // 1) Generador (MOLS)
    B.genMols.forEach(function(m){
      if((t.gen||[]).indexOf(m.topic)<0)return;
      if(t.soloRamificados&&(!/\d/.test(m.name)||/^ciclo|ciclo/.test(m.name)))return;
      var nom=m.iupac||m.name;
      addA(nom,{k:'A',fig:{gen:m.key},fuente:'Generador'});
      addB(nom,{k:'B',nombre:nom,fuente:'Generador'});
      if(m.parts&&m.parts.length)addC(nom,{k:'C',nombre:nom,partes:m.parts,fuente:'Generador'});
    });
    // 2) Juego
    if(t.jue)B.jue.forEach(function(q){
      if(/^rxn_/.test(q.topic)||!t.jue.test(q.topic))return;
      var qt=quitaHtml(q.q);
      if(q.mol&&(q.type==='mc'||q.type==='write')&&/nombre IUPAC/i.test(qt)&&!/cl[aá]sico|funcional \(/i.test(qt)&&typeof q.ans==='string'){
        addA(q.ans,{k:'A',fig:{svgFn:svgJuego(q.mol)},fuente:'Juego'});
        addB(q.ans,{k:'B',nombre:q.ans,fuente:'Juego'});
        if(Array.isArray(q.parts)&&q.parts.length)addC(q.ans,{k:'C',nombre:q.ans,partes:q.parts,fuente:'Juego'});
      }else if(q.type==='build'){
        var mm=String(q.q||'').match(/<strong>([^<]+)<\/strong>/);
        if(mm)addB(mm[1],{k:'B',nombre:mm[1],fuente:'Juego'});
      }else if(q.mol&&q.type==='mc'&&/nombr[óo]/i.test(qt)&&/error/i.test(qt)){
        P.X.push({k:'X',fig:{svgFn:svgJuego(q.mol)},texto:q.q,fuente:'Juego'});
      }
    });
    // 3) Práctica propia del tema (docente-datos.js)
    (t.propia||[]).forEach(function(p){
      addA(p.n,{k:'A',fig:{f:p.f,t:p.t},fuente:'Docente'});
      addB(p.n,{k:'B',nombre:p.n,fuente:'Docente'});
    });
    // 4) Reacciones (Generador, tipo D)
    B.genRxn.forEach(function(r){
      if((t.rxn||[]).indexOf(r.topic)<0||r.nivel==='avanzado'||rx[r.key])return;
      rx[r.key]=1;P.D.push({k:'D',rxn:r,fuente:'Generador'});
    });
    // 5) Ejercicios abiertos del tema
    (t.abiertos||[]).forEach(function(a){P.E.push({k:'E',q:typeof a==='string'?a:a.q,fig:typeof a==='string'?null:{f:a.f},fuente:'Docente'});});
  });
  return P;
}

/* ── Formulario ──────────────────────────────────────────────────────── */
var TIPOS_EJ=[
  {k:'A',t:'Nombrar (estructura → nombre)'},
  {k:'B',t:'Dibujar (nombre → estructura)'},
  {k:'C',t:'Análisis por partes MDEC'},
  {k:'D',t:'Reacciones'},
  {k:'X',t:'Cazar errores de nombres'},
  {k:'E',t:'Ejercicios abiertos (isomería)'}
];
function temasSel(){return TEMAS.filter(function(t){var c=document.querySelector('input[name=tema][value="'+t.id+'"]');return c&&c.checked;});}
function pintarTemas(){
  var cont=$('f-temas');if(!cont)return;
  var previos={};document.querySelectorAll('input[name=tema]:checked').forEach(function(c){previos[c.value]=1;});
  if(!Object.keys(previos).length)previos={alcoholes:1};
  cont.innerHTML=TEMAS.map(function(t){
    var P=poolEjercicios([t]);var nEj=P.A.length+P.B.length+P.C.length+P.D.length+P.X.length+P.E.length;
    var nS=(D.SABER[t.id]||[]).length;
    return '<label class="opt"><input type="checkbox" name="tema" value="'+t.id+'"'+(previos[t.id]?' checked':'')+'> <span><b>'+esc(t.titulo)+'</b><small>'+nEj+' ejercicios'+(nS?' · '+nS+' preguntas tipo Saber':'')+(t.extra?' · solo taller (tema nuevo del Juego)':'')+'</small></span></label>';
  }).join('');
  cont.querySelectorAll('input').forEach(function(c){c.addEventListener('change',function(){alinSugerida();pintarTipos();guardar();});});
  pintarTipos();alinSugerida();
}
function pintarTipos(){
  var cont=$('f-tipos');if(!cont)return;
  var P=poolEjercicios(temasSel());
  var prev={};document.querySelectorAll('input[name=tipoej]').forEach(function(c){prev[c.value]=c.checked;});
  var hayPrev=Object.keys(prev).length>0;
  cont.innerHTML=TIPOS_EJ.map(function(x){
    var n=P[x.k].length,dis=!n;
    var chk=hayPrev?(prev[x.k]!==false&&!dis):(!dis&&x.k!=='X');
    if(hayPrev&&prev[x.k]===undefined)chk=!dis;
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
var CAMPOS=['f-colegio','f-docente','f-area','f-curso','f-periodo'];
function guardar(){try{var o={};CAMPOS.forEach(function(id){o[id]=$(id).value;});localStorage.setItem('chromanom_docente_enc',JSON.stringify(o));}catch(e){}}
function restaurar(){try{var o=JSON.parse(localStorage.getItem('chromanom_docente_enc')||'{}');CAMPOS.forEach(function(id){if(o[id])$(id).value=o[id];});}catch(e){}}

function pintarEstado(){
  var el=$('f-estado');if(!el)return;
  var g=B.estado.gen==='ok'?'✅ Generador: '+B.genMols.length+' moléculas y '+B.genRxn.length+' reacciones':(B.estado.gen==='cargando'?'⏳ Cargando el banco del Generador…':'⚠️ No se pudo leer el banco del Generador');
  var j=B.estado.jue==='ok'?'✅ Juego: '+B.jue.length+' preguntas':(B.estado.jue==='cargando'?'⏳ Cargando el banco del Juego…':'⚠️ No se pudo leer el banco del Juego');
  var s=0;Object.keys(D.SABER).forEach(function(k){s+=D.SABER[k].length;});
  el.innerHTML=g+'<br>'+j+'<br>✅ Preguntas tipo Saber 11: '+s+' en '+Object.keys(D.SABER).length+' temas';
  $('btn-generar').disabled=false;
}

/* ── Piezas HTML de los documentos ───────────────────────────────────── */
var COMP={uso:'Uso comprensivo del conocimiento científico',exp:'Explicación de fenómenos',ind:'Indagación'};
var COMPO={Q:'Componente químico',CTS:'Ciencia, tecnología y sociedad'};
var NOMBRE_PARTE={r:'① Sustituyentes',c:'② Cadena principal',i:'③ Insaturaciones',g:'④ Grupo funcional',cg:'②+④ Anillo aromático'};

function encabezadoInst(e,titulo,sub,forma){
  function campo(l,v){return '<div class="ei-c"><span>'+l+'</span>'+(v?'<b>'+esc(v)+'</b>':'<i></i>')+'</div>';}
  return '<div class="ei"><div class="ei-top"><div><div class="ei-tipo">'+esc(sub)+'</div><div class="ei-tit">'+esc(titulo)+'</div></div>'+
    '<div class="ei-der"><img src="logo-chromanom.png" alt="ChromaNom" width="120" height="34">'+(forma?'<span class="ei-forma">Forma '+forma+'</span>':'')+'</div></div>'+
    '<div class="ei-grid">'+campo('Institución',e.colegio)+campo('Docente',e.docente)+campo('Área',e.area)+campo('Grado / curso',e.curso)+campo('Periodo',e.periodo)+campo('Fecha',e.fecha)+'</div></div>';
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
function lineas(n){var s='';for(var i=0;i<n;i++)s+='<div class="lin"></div>';return s;}
function pastillas(partes,neutral){return '<div class="pills">'+partes.map(function(p){var t=Array.isArray(p)?p[0]:p.t,c=Array.isArray(p)?p[1]:p.cls;return '<span class="pill p-'+(neutral?'n':c)+'">'+esc(t)+'</span>';}).join('')+'</div>';}

function bloquesPrevios(t){
  var p=t.previos;if(!p)return [];
  var out=[];
  out.push('<h4 class="sub">¿Sabías que…? <small>'+esc(t.corto)+'</small></h4><ul class="lista">'+p.curiosos.map(function(x){return '<li>'+esc(x)+'</li>';}).join('')+'</ul>');
  out.push('<h4 class="sub">La química en contexto</h4><ul class="lista ctx">'+p.contexto.map(function(x){return '<li><span class="amb">'+esc(x.amb)+'</span> '+esc(x.t)+'</li>';}).join('')+'</ul>');
  out.push('<h4 class="sub">En tu vida diaria</h4><div class="chips">'+p.cotidianos.map(function(x){return '<span>'+esc(x)+'</span>';}).join('')+'</div>');
  p.activacion.forEach(function(q,i){out.push((i===0?'<h4 class="sub">Preguntas de activación <small>Responde con lo que sabes; no hay respuestas malas.</small></h4>':'')+'<div class="act"><b>'+(i+1)+'.</b> '+esc(q)+lineas(3)+'</div>');});
  return out;
}
function bloquesInfo(t){
  var inf=t.info;if(!inf)return [];
  var out=[];
  inf.lectura.forEach(function(par,i){out.push((i===0?'<h4 class="sub">Lectura: lo esencial <small>'+esc(t.corto)+'</small></h4>':'')+'<p class="lect">'+esc(par)+'</p>');});
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
  C:'Escribe a qué parte del método MDEC pertenece cada fragmento (① sustituyentes, ② cadena principal, ③ insaturaciones, ④ grupo funcional) y qué significa.',
  D:'Completa cada reacción según lo que se pide.',
  X:'Un compañero cometió un error al nombrar cada estructura. Explica el error y escribe el nombre correcto.',
  E:'Resuelve en el espacio indicado.'
};
var TIT={A:'Nombrar',B:'Dibujar',C:'Análisis por partes (MDEC)',D:'Reacciones',X:'Cazar errores',E:'Ejercicios abiertos'};
function htmlEjercicio(it,num){
  if(it.k==='A')return '<div class="ej mitad"><span class="num">'+num+'</span>'+figura(it.fig,300,120)+'<div class="resp">Nombre IUPAC:<i></i></div></div>';
  if(it.k==='B')return '<div class="ej mitad"><span class="num">'+num+'</span><div class="nom">'+esc(it.nombre)+'</div><div class="dibujo"></div></div>';
  if(it.k==='C')return '<div class="ej"><span class="num">'+num+'</span>'+pastillas(it.partes,true)+'<table class="mdec-tab blanco"><thead><tr><th>Fragmento</th><th>Parte (①–④)</th><th>¿Qué significa?</th></tr></thead><tbody>'+it.partes.map(function(p){return '<tr><td>'+esc(p.t)+'</td><td></td><td></td></tr>';}).join('')+'</tbody></table></div>';
  if(it.k==='D'){var h='';try{h=B.G.tipoD(it.rxn,num);}catch(e){h='';}return '<div class="ej rx">'+h+'</div>';}
  if(it.k==='X')return '<div class="ej"><span class="num">'+num+'</span><div class="x-fila">'+figura(it.fig,260,110)+'<div class="x-txt"><p>'+it.texto+'</p><div class="resp">Error:<i></i></div><div class="resp">Nombre correcto:<i></i></div></div></div></div>';
  if(it.k==='E')return '<div class="ej"><span class="num">'+num+'</span><p class="enun">'+esc(it.q)+'</p>'+(it.fig?figura(it.fig,260,100):'')+'<div class="espacio"></div></div>';
  return '';
}
/* Elige n ejercicios repartidos entre los tipos marcados. */
function elegirEjercicios(P,tipos,n,r){
  var colas={};tipos.forEach(function(k){colas[k]=barajar(P[k]||[],r);});
  var orden=tipos.filter(function(k){return colas[k].length;});
  var cuenta={};orden.forEach(function(k){cuenta[k]=0;});
  var total=0,avanza=true;
  while(total<n&&avanza){avanza=false;for(var i=0;i<orden.length&&total<n;i++){var k=orden[i];if(cuenta[k]<colas[k].length){cuenta[k]++;total++;avanza=true;}}}
  var porTipo=[];orden.forEach(function(k){if(cuenta[k])porTipo.push({k:k,items:colas[k].slice(0,cuenta[k])});});
  return {porTipo:porTipo,total:total};
}
function bloquesEjercicios(sel,numIni){
  var out=[],num=numIni||1;
  sel.porTipo.forEach(function(g){
    var tit='<h4 class="sub">'+esc(TIT[g.k])+' <small>'+esc(INSTR[g.k])+'</small></h4>';
    var primero=true;
    if(g.k==='A'||g.k==='B'){
      for(var i=0;i<g.items.length;i+=2){
        var fila='<div class="fila2">'+htmlEjercicio(g.items[i],num++)+(g.items[i+1]?htmlEjercicio(g.items[i+1],num++):'')+'</div>';
        out.push((primero?tit:'')+fila);primero=false;
      }
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
    var fig=(q.f||q.gen)?figura(q.gen?{gen:q.gen,t:q.t}:{f:q.f,t:q.t},300,110):'';
    return '<div class="sq"><div class="sq-cab"><span class="num">'+(i+1)+'</span><span class="sq-tag">'+esc(COMP[q.c])+' · '+esc(COMPO[q.k])+'</span></div>'+
      '<p class="sq-ctx">'+esc(q.ctx)+'</p>'+fig+'<p class="sq-q">'+esc(q.q)+'</p>'+
      '<ol class="sq-ops'+(cortas?' dos':'')+'">'+ops.map(function(o,j){return '<li><span class="let">'+letras[j]+'</span> '+esc(o)+'</li>';}).join('')+'</ol></div>';
  });
}
function bloqueHojaRespuestas(n){
  var h='<div class="hr"><h4 class="sub">Hoja de respuestas <small>Rellena completamente un solo círculo por pregunta.</small></h4><div class="hr-grid">';
  for(var i=1;i<=n;i++){h+='<div class="hr-f"><b>'+i+'</b>'+['A','B','C','D'].map(function(l){return '<span class="bur">'+l+'</span>';}).join('')+'</div>';}
  return h+'</div></div>';
}
function bloquesAbiertas(as,ini){
  return as.map(function(a,i){var q=typeof a==='string'?a:a.q;var f=typeof a==='string'?null:a.f;
    return (i===0?'<h4 class="sub">Preguntas abiertas <small>Responde con tus palabras y justifica.</small></h4>':'')+'<div class="ab"><b>'+(ini+i)+'.</b> '+esc(q)+(f?figura({f:f},280,100):'')+lineas(5)+'</div>';});
}
function bloquesRubricas(temas){
  var ids={};temas.forEach(function(t){
    var m={cadena:['rub-a','rub-c'],reacciones:['rub-d'],haluros:['rub-a','rub-b','rub-d'],isomeria:['rub-a','rub-b']}[t.id]||['rub-a','rub-b'];
    m.forEach(function(x){ids[x]=1;});
  });
  var out=[];
  Object.keys(ids).sort().forEach(function(id){
    var el=document.getElementById(id);if(!el)return;
    var tit=el.querySelector('h3');var tabla=el.nextElementSibling;
    out.push('<h4 class="sub">'+esc(tit?tit.textContent:'Rúbrica')+'</h4>'+(tabla?tabla.innerHTML:''));
  });
  return out;
}

/* ── Paginación en hojas tamaño carta ────────────────────────────────── */
function paginar(doc,medidor){
  var hojas=[];
  function nueva(){
    var h=document.createElement('div');h.className='hoja hoja-'+doc.clase;
    h.innerHTML='<div class="hoja-cab">'+doc.cab+'</div><div class="hoja-cuerpo"></div><div class="hoja-pie"><span class="pie-n"></span><span>ChromaNom · CC BY-NC 4.0 · hbarcenasm863.github.io/chromanom</span></div>';
    medidor.appendChild(h);hojas.push(h);return h.querySelector('.hoja-cuerpo');
  }
  var cuerpo=nueva();
  if(doc.primera){cuerpo.parentNode.querySelector('.hoja-cab').style.display='none';}
  doc.bloques.forEach(function(html,i){
    var w=document.createElement('div');w.className='blq';w.innerHTML=(i===0&&doc.primera?doc.primera:'')+html;
    cuerpo.appendChild(w);
    if(cuerpo.scrollHeight>cuerpo.clientHeight+1&&cuerpo.children.length>1){
      cuerpo.removeChild(w);cuerpo=nueva();cuerpo.appendChild(w);
    }
  });
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
    hojaResp:$('f-hr').checked,rubrica:$('f-rub').checked,forma:valor('forma')||'A',variante:($('f-var').value||'1').trim(),
    enc:{colegio:$('f-colegio').value.trim(),docente:$('f-docente').value.trim(),area:$('f-area').value.trim(),curso:$('f-curso').value.trim(),periodo:$('f-periodo').value.trim(),fecha:fs}
  };
}
function construir(F){
  var avisos=[];
  var nombreTemas=F.temas.map(function(t){return t.corto;}).join(' · ');
  var semilla=[F.variante,F.forma,F.tipo,F.temas.map(function(t){return t.id;}).join(',')].join('|');
  var P=poolEjercicios(F.temas);
  var tipos=F.tipos.filter(function(k){return (P[k]||[]).length;});
  var docs=[];
  var cabCorta=function(lbl){return esc(lbl)+' · '+esc(nombreTemas)+(F.enc.colegio?' · '+esc(F.enc.colegio):'')+' · Forma '+F.forma;};

  // Ejercicios
  var selEj=null;
  if(F.tipo!=='evaluacion'){
    if(!tipos.length)avisos.push('No hay ejercicios disponibles para los tipos marcados en este tema.');
    else{selEj=elegirEjercicios(P,tipos,F.nEj,rng(semilla+'|ej'));if(selEj.total<F.nEj)avisos.push('Solo hay '+selEj.total+' ejercicios disponibles para esta selección.');}
  }
  if(F.tipo==='guia'){
    var b=[];
    b.push('<div class="ruta"><span>Sesión 1 · Aprendizajes previos</span><span>Sesión 2 · Información</span><span>Sesión 3 · Trabajo práctico</span><span>Sesión 4 · Evaluación (hojas aparte)</span></div>');
    b.push('<h3 class="ses"><span>1</span> Aprendizajes previos</h3><p class="intro">Antes de empezar, recordemos lo que ya sabes y dónde aparece este tema en tu vida.</p>');
    F.temas.forEach(function(t){b=b.concat(bloquesPrevios(t));});
    b.push('<h3 class="ses"><span>2</span> Información</h3><p class="intro">Lee con atención y subraya las ideas principales.</p>');
    F.temas.forEach(function(t){b=b.concat(bloquesInfo(t));});
    b.push('<h3 class="ses"><span>3</span> Trabajo práctico</h3><p class="intro">Resuelve en esta guía. Puedes consultar la Hoja de referencia de ChromaNom.</p>');
    if(selEj)b=b.concat(bloquesEjercicios(selEj,1));
    b.push('<h3 class="ses"><span>4</span> Evaluación</h3><p class="intro">La evaluación se entrega en hojas aparte. Antes, marca cómo te sientes con lo aprendido:</p>'+
      '<table class="auto"><thead><tr><th>Puedo…</th><th>Lo logro</th><th>Con ayuda</th><th>Aún no</th></tr></thead><tbody>'+
      ['Identificar la cadena principal y numerarla','Nombrar compuestos del tema con IUPAC 2013','Dibujar una estructura a partir de su nombre','Explicar una propiedad o reacción con la estructura'].map(function(x){return '<tr><td>'+x+'</td><td></td><td></td><td></td></tr>';}).join('')+'</tbody></table>');
    var prim=encabezadoInst(F.enc,'Guía de aprendizaje: '+F.temas.map(function(t){return t.titulo;}).join(' · '),'Química orgánica · Grado '+F.grado+'.º',F.forma)+lineaEstudiante()+cajaAlineacion(F.alin);
    docs.push({clase:'guia',etiqueta:'Guía',cab:cabCorta('Guía'),primera:prim,bloques:b});
  }
  if(F.tipo==='taller'){
    var bt=selEj?bloquesEjercicios(selEj,1):[];
    var primT=encabezadoInst(F.enc,'Taller de ejercicios: '+nombreTemas,'Química orgánica · Grado '+F.grado+'.º',F.forma)+lineaEstudiante()+cajaAlineacion(F.alin,true);
    docs.push({clase:'taller',etiqueta:'Taller',cab:cabCorta('Taller'),primera:primT,bloques:bt.length?bt:['<p>No hay ejercicios para esta selección.</p>']});
  }
  if(F.tipo==='guia'||F.tipo==='evaluacion'){
    var poolS=[];F.temas.forEach(function(t){poolS=poolS.concat(D.SABER[t.id]||[]);});
    var r=rng(semilla+'|saber');
    var qs=barajar(poolS,r).slice(0,F.nSaber);
    if(F.nSaber&&qs.length<F.nSaber)avisos.push(poolS.length?'El banco tiene '+poolS.length+' preguntas tipo Saber para este tema; se usan todas.':'Este tema todavía no tiene preguntas tipo Saber; la evaluación lleva solo preguntas abiertas.');
    var poolA=[];F.temas.forEach(function(t){poolA=poolA.concat(D.ABIERTAS[t.id]||[]);});
    var ab=barajar(poolA,rng(semilla+'|abiertas')).slice(0,F.nAb);
    var be=[];
    if(qs.length)be.push('<p class="instr"><b>Instrucciones.</b> Preguntas '+(qs.length>1?'1 a '+qs.length:'1')+': selección múltiple con única respuesta (tipo Saber 11). Lee el contexto, analiza las cuatro opciones y marca una sola en la hoja de respuestas.'+(ab.length?' Preguntas '+(qs.length+1)+' a '+(qs.length+ab.length)+': abiertas, responde en el espacio indicado.':'')+'</p>');
    be=be.concat(bloquesSaber(qs,r));
    be=be.concat(bloquesAbiertas(ab,qs.length+1));
    if(F.hojaResp&&qs.length)be.push(bloqueHojaRespuestas(qs.length));
    if(!be.length)be.push('<p>No hay preguntas para esta selección.</p>');
    var primE=encabezadoInst(F.enc,'Evaluación: '+nombreTemas,'Química orgánica · Grado '+F.grado+'.º',F.forma)+
      '<div class="est-lin"><div><span>Nombre</span><i></i></div><div class="corta"><span>Curso</span><i></i></div><div class="corta"><span>Fecha</span><i></i></div></div>'+cajaAlineacion(F.alin,true);
    docs.push({clase:'eval',etiqueta:'Evaluación',cab:cabCorta('Evaluación'),primera:primE,bloques:be});
    if(F.rubrica){
      var br=bloquesRubricas(F.temas);
      if(br.length)docs.push({clase:'anexo',etiqueta:'Anexo: rúbricas',cab:cabCorta('Anexo: rúbricas'),primera:'<h3 class="ses ses-anexo">Anexo: rúbricas de evaluación</h3><p class="intro">Niveles de desempeño de la escala nacional (Decreto 1290 de 2009). La equivalencia numérica la define el SIEE de la institución.</p>',bloques:br});
    }
  }
  return {docs:docs,avisos:avisos};
}

var ultimo=null;
function generar(){
  var F=leerForm();
  var info=$('vista-info');
  if(!F.temas.length){info.innerHTML='<p class="aviso warn">Marca al menos un tema.</p>';return Promise.resolve();}
  info.innerHTML='<p class="aviso">⏳ Armando el documento…</p>';
  return bancosListos.then(function(){return (document.fonts&&document.fonts.ready)||null;}).then(function(){
    var R=construir(F);
    var medidor=$('medidor');medidor.innerHTML='';
    var vista=$('vista');vista.innerHTML='';
    var resumen=[];
    R.docs.forEach(function(doc){var hs=paginar(doc,medidor);resumen.push(doc.etiqueta+': '+hs.length+' página'+(hs.length>1?'s':''));hs.forEach(function(h){vista.appendChild(h);});});
    medidor.innerHTML='';
    ultimo=F;
    info.innerHTML='<p class="aviso ok">✅ '+esc(resumen.join(' · '))+'. Revisa la vista previa y luego usa <b>Imprimir / Guardar PDF</b> (tamaño carta).</p>'+
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
  syncTipoDoc();
  $('btn-generar').addEventListener('click',function(){generar().then(function(){var v=$('vista-wrap');if(v&&v.scrollIntoView)v.scrollIntoView({behavior:'smooth',block:'start'});});});
  $('btn-imprimir').addEventListener('click',imprimir);
  $('btn-forma-b').addEventListener('click',function(){var b=document.querySelector('input[name=forma][value='+(valor('forma')==='A'?'B':'A')+']');if(b){b.checked=true;generar();}});
  window.addEventListener('resize',ajustarZoom);
  pintarEstado();$('btn-generar').disabled=false;
}
function syncTipoDoc(){
  var t=valor('tipodoc');
  document.body.classList.toggle('sin-ej',t==='evaluacion');
  document.body.classList.toggle('sin-eval',t==='taller');
  if(t==='taller'&&+$('f-nej').value<16)$('f-nej').value=20;
  if(t==='guia'&&+$('f-nej').value>16)$('f-nej').value=12;
}
window.DocenteGen={generar:generar,bancos:function(){return bancosListos;},_B:B};
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',iniciar);else iniciar();
})();
