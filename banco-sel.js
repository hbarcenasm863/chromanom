/* ════════════════════════════════════════════════════════════════════════
   banco-sel.js — «Banco de preguntas» del panel docente (mismo archivo en
   BioNom, ChromaNom e IonNom).

   El docente filtra las preguntas tipo Saber 11 por grado, DBA, estándar
   básico de competencias, aprendizaje priorizado (SED Bogotá 2025), tema,
   competencia y afirmación, escoge las que quiere y las usa en guías,
   talleres y evaluaciones: mientras la selección esté activa, el sorteo de
   preguntas Saber de los generadores (SABER_ICFES.elegir) usa las elegidas.

   Necesita, cargados antes:
     saber-icfes.js            (competencia, afirmación y dibujo de tablas/gráficas)
     referentes-men.js         (window.REFERENTES_MEN: DBA, estándares y priorizados)
     banco-sel-cfg.js          (window.BANCO_SEL_CFG: lo propio de cada sitio y
                                window.BANCO_SEL_MAPA: tema → DBA → estándares
                                y priorizados)
   ════════════════════════════════════════════════════════════════════════ */
(function(){
'use strict';
var R=window.REFERENTES_MEN,CFG=window.BANCO_SEL_CFG||{},MAPA=window.BANCO_SEL_MAPA||{temas:{},dba:{}};
var SI=window.SABER_ICFES;
if(!R||!CFG.preguntas)return;
var LS=(CFG.sitio||'sitio')+'-banco-sel';
var estado={claves:[],usar:true,completar:true};
try{var g=JSON.parse(localStorage.getItem(LS)||'null');if(g&&g.claves)estado=g;}catch(e){}
function guardar(){try{localStorage.setItem(LS,JSON.stringify(estado));}catch(e){}}
function e(s){return String(s==null?'':s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');}
function hash(s){var h=5381;s=String(s);for(var i=0;i<s.length;i++){h=((h<<5)+h+s.charCodeAt(i))>>>0;}return h.toString(36);}
function limpio(s){return String(s==null?'':s).replace(/<[^>]+>/g,' ');}
function claveDe(q,tema){return (q.icfes?'icfes'+q.icfes:tema+'|'+hash(limpio(q.ctx)+'|'+limpio(q.q)));}

/* ── índices de los referentes ── */
var DBA={},EST={},PRI={};
R.dba.forEach(function(d){DBA[d.grado+'.'+d.num]=d;});
R.estandares.forEach(function(s){EST[s.id]=s;});
R.priorizados.forEach(function(p){PRI[p.id]=p;});
function nombreComp(c){return c==='uso'?'Uso comprensivo':c==='exp'?'Explicación':'Indagación';}
function corto(t,n){t=String(t||'').replace(/\s+/g,' ');return t.length>n?t.slice(0,n-1)+'…':t;}
function unicos(a){var o=[],v={};a.forEach(function(x){if(x!=null&&!v[x]){v[x]=1;o.push(x);}});return o;}

/* ── banco completo, con las etiquetas de cada pregunta ── */
var TODAS=null,POR_CLAVE={};
function construir(){
  if(TODAS)return TODAS;
  var fuente=CFG.preguntas()||[];TODAS=[];
  fuente.forEach(function(x){
    var q=x.q,tema=x.tema,c=SI?SI.competencia(q):(q.c||'uso'),af=SI?SI.afirmacion(q).cod:(q.af||'');
    var mt=MAPA.temas[tema]||{};
    var delTema=(mt.dba||[]).map(function(d){return d.id||d;});
    var propios=CFG.dbaDe?CFG.dbaDe(q,tema):(q.dba?[].concat(q.dba).filter(function(d){return d&&d!=='sin';}).map(String):null);
    var dba=unicos(propios||delTema);
    var est=(mt.estandares||[]).slice(),pri=[];
    /* sin DBA propio, hereda estándares y priorizados de los DBA «cercanos» del tema */
    (dba.length?dba:(mt.dbaCercano||[])).forEach(function(d){var m=MAPA.dba[d]||{};est=est.concat(m.estandares||[]);pri=pri.concat(m.priorizados||[]);});
    (mt.priorizados||[]).forEach(function(p){pri.push(p);});
    /* Método MDEC (modelo propio del docente): no se enlaza a ningún DBA, estándar ni priorizado */
    if(q.mdec){dba=[];est=[];pri=[];}
    var grados=[];
    if(CFG.gradoDe){var gq=CFG.gradoDe(q,tema);if(gq!=null)grados=[].concat(gq);}
    else if(q.curso)grados=[].concat(q.curso);
    if(!grados.length){dba.forEach(function(d){var n=parseInt(d,10);if(n)grados.push(n);});}
    if(!grados.length){grados=[].concat(mt.grados||mt.grado||[]);}
    if(q.mdec&&CFG.gradoMdec)grados=[].concat(CFG.gradoMdec);
    var it={q:q,tema:tema,key:claveDe(q,tema),c:c,af:af,dba:dba,est:unicos(est),pri:unicos(pri),grados:unicos(grados).sort(function(a,b){return a-b;}),
      texto:(limpio(q.ctx)+' '+limpio(q.q)+' '+(q.o||[]).map(limpio).join(' ')).toLowerCase(),datos:!!(q.tabla||q.graf||q.esq||q.opsGraf)};
    if(POR_CLAVE[it.key])return;POR_CLAVE[it.key]=it;TODAS.push(it);
  });
  return TODAS;
}

/* ── selección y uso en los generadores ── */
function elegidasItems(){return estado.claves.map(function(k){return POR_CLAVE[k];}).filter(Boolean);}
function activo(){return !!(estado.usar&&estado.claves.length&&construir());}
var orig=SI&&SI.elegir;
if(SI&&orig){
  SI.elegir=function(pool,n,r,op){
    if(!activo())return orig.apply(this,arguments);
    var sel=elegidasItems().map(function(x){return x.q;});
    var res=sel.slice();
    if(estado.completar&&n>sel.length){
      var usadas={};elegidasItems().forEach(function(x){usadas[x.key]=1;});
      var resto=(pool||[]).filter(function(q){return !usadas[claveDe(q,q.t||q.tema)];});
      res=res.concat(orig.call(this,resto,n-sel.length,r,op));
    }
    return res;
  };
}
function evento(){try{document.dispatchEvent(new CustomEvent('bancosel-cambio'));}catch(x){}pintarAviso();pintarInsignia();}

/* ── estilos ── */
function css(){
  if(document.getElementById('bsel-css'))return;
  var s=document.createElement('style');s.id='bsel-css';
  s.textContent=
  '.bsel{font:inherit;color:inherit}.bsel *{box-sizing:border-box}'+
  '.bsel h3{margin:0 0 .4em;font-size:1.15em}.bsel .bs-sub{opacity:.75;font-size:.9em;margin:0 0 .8em}'+
  '.bsel .bs-filtros{display:grid;grid-template-columns:repeat(auto-fit,minmax(210px,1fr));gap:.6em;margin:.6em 0}'+
  '.bsel label{display:block;font-size:.82em;font-weight:600;margin-bottom:.15em}'+
  '.bsel select,.bsel input[type=search]{width:100%;padding:.4em .5em;border:1px solid rgba(128,128,128,.5);border-radius:6px;background:transparent;color:inherit;font:inherit;font-size:.9em}'+
  '.bsel select option{color:#111}'+
  '.bsel .bs-barra{display:flex;flex-wrap:wrap;gap:.5em;align-items:center;margin:.6em 0;padding:.6em;border:1px solid rgba(128,128,128,.4);border-radius:8px}'+
  '.bsel .bs-barra b{font-size:1.05em}.bsel button.bs-b{padding:.35em .7em;border-radius:6px;border:1px solid rgba(128,128,128,.6);background:transparent;color:inherit;cursor:pointer;font:inherit;font-size:.88em}'+
  '.bsel button.bs-b:hover{background:rgba(128,128,128,.18)}.bsel button.bs-p{background:#1d6f42;color:#fff;border-color:#1d6f42}'+
  '.bsel .bs-ref{margin:.6em 0;padding:.6em .8em;border-left:4px solid #888;background:rgba(128,128,128,.1);border-radius:4px;font-size:.88em}'+
  '.bsel .bs-ref small{display:block;opacity:.7;margin-top:.3em}'+
  '.bsel .bs-q{border:1px solid rgba(128,128,128,.4);border-radius:8px;padding:.6em .8em;margin:.5em 0}'+
  '.bsel .bs-q.on{border-color:#1d6f42;box-shadow:0 0 0 2px rgba(29,111,66,.35)}'+
  '.bsel .bs-cab{display:flex;gap:.6em;align-items:flex-start}.bsel .bs-cab input{margin-top:.25em;width:1.15em;height:1.15em;flex:none}'+
  '.bsel .bs-tags{display:flex;flex-wrap:wrap;gap:.3em;margin:.2em 0 .4em}.bsel .bs-t{font-size:.72em;padding:.1em .5em;border-radius:99px;background:rgba(128,128,128,.22)}'+
  '.bsel .bs-ctx{opacity:.85;font-size:.9em;margin:.2em 0}.bsel .bs-enun{font-weight:600;margin:.2em 0}'+
  '.bsel ol.bs-o{margin:.3em 0 .3em 1.4em;padding:0;list-style:upper-alpha}.bsel ol.bs-o li.ok{font-weight:700;color:#1d6f42}'+
  '.bsel details{font-size:.88em;margin-top:.3em}.bsel .bs-vacio{padding:1em;opacity:.7}'+
  '.bsel .bs-chk{display:flex;align-items:center;gap:.4em;font-size:.88em;font-weight:400;margin:0}.bsel .bs-chk input{width:auto}'+
  '.bsel table{border-collapse:collapse;font-size:.85em;margin:.3em 0}.bsel td,.bsel th{border:1px solid rgba(128,128,128,.5);padding:.15em .5em}'+
  '#bsel-aviso .bs-av{margin:.5em 0;padding:.5em .8em;border-radius:8px;background:#fff3cd;color:#664d03;border:1px solid #ffecb5;font-size:.9em}'+
  '@media print{.bsel,#bsel-aviso{display:none!important}}';
  document.head.appendChild(s);
}

/* ── interfaz ── */
var F={grado:'',dba:'',est:'',pri:'',tema:'',comp:'',af:'',nd:'',datos:'',q:'',soloSel:false,max:40};
var RAIZ=null;
function opcionesCuenta(campo,items){
  var m={};items.forEach(function(it){[].concat(it[campo]).forEach(function(v){m[v]=(m[v]||0)+1;});});return m;
}
function ordenIds(a){return a.sort(function(x,y){return String(x).localeCompare(String(y),'es',{numeric:true});});}
function selectHTML(id,rot,opts,val){
  return '<div><label for="'+id+'">'+e(rot)+'</label><select id="'+id+'"><option value="">Todos</option>'+
    opts.map(function(o){return '<option value="'+e(o[0])+'"'+(String(val)===String(o[0])?' selected':'')+'>'+e(o[1])+'</option>';}).join('')+'</select></div>';
}
function infoRef(){
  var h='';
  if(F.dba&&DBA[F.dba]){var d=DBA[F.dba];h+='<div class="bs-ref"><b>DBA '+e(F.dba)+'.</b> '+e(d.texto)+(d.evidencias&&d.evidencias.length?'<small><b>Evidencias de aprendizaje:</b> '+d.evidencias.map(e).join(' · ')+'</small>':'')+'<small>'+e(R.fuentes.dba)+'</small></div>';}
  if(F.est&&EST[F.est]){var s=EST[F.est];h+='<div class="bs-ref"><b>Estándar '+e(F.est)+' ('+e(String(s.entorno||'').replace(/^Enunciado general de «Al final de grado\.\.\.» \(|\)$/g,''))+').</b> '+e(s.texto)+'<small>'+e(R.fuentes.estandares)+'</small></div>';}
  if(F.pri&&PRI[F.pri]){var p=PRI[F.pri];h+='<div class="bs-ref"><b>Aprendizaje priorizado '+e(F.pri)+(p.componente?' ('+e(p.componente)+')':'')+(p.semestre?' · '+e(p.semestre):'')+'.</b> '+e(p.aprendizaje)+'<small>'+e(R.fuentes.priorizados)+'</small></div>';}
  return h;
}
function filtrar(){
  var qlow=F.q.toLowerCase().trim(),sel={};estado.claves.forEach(function(k){sel[k]=1;});
  return construir().filter(function(it){
    if(F.soloSel&&!sel[it.key])return false;
    if(F.grado&&it.grados.indexOf(parseInt(F.grado,10))<0)return false;
    if(F.dba&&it.dba.indexOf(F.dba)<0)return false;
    if(F.est&&it.est.indexOf(F.est)<0)return false;
    if(F.pri&&it.pri.indexOf(F.pri)<0)return false;
    if(F.tema&&it.tema!==F.tema)return false;
    if(F.comp&&it.c!==F.comp)return false;
    if(F.af&&it.af!==F.af)return false;
    if(F.nd&&String(it.q.nd||'')!==F.nd)return false;
    if(F.datos==='si'&&!it.datos)return false;
    if(F.datos==='mdec'&&!it.q.mdec)return false;
    if(F.datos==='sinmdec'&&it.q.mdec)return false;
    if(qlow&&it.texto.indexOf(qlow)<0)return false;
    return true;
  });
}
function tarjeta(it,sel){
  /* las preguntas MDEC traen su versión con los colores del método (q.html), que es lo central del modelo */
  var q=it.q,H=(q.mdec&&q.html)||{},ok=(q.icfes||q.fijo)?q.r:0,ops=(q.o||[]).map(function(o,i){return '<li'+(i===ok?' class="ok"':'')+'>'+((H.o&&H.o[o])||e(limpio(o)))+'</li>';}).join('');
  var extra=SI&&SI.extraHTML?SI.extraHTML(q):'';
  var tags='<span class="bs-t">'+e(CFG.temaNombre?CFG.temaNombre(it.tema):it.tema)+'</span>'+
    (it.grados.length?'<span class="bs-t">Grado '+it.grados.join('–')+'.°</span>':'')+
    '<span class="bs-t">'+nombreComp(it.c)+(it.af?' · '+e(it.af):'')+'</span>'+
    it.dba.map(function(d){return '<span class="bs-t">DBA '+e(d)+'</span>';}).join('')+
    (q.ev?'<span class="bs-t" title="Evidencia del Marco de referencia Saber 11.° (Icfes, 2019)">Evidencia '+e(q.ev)+'</span>':'')+(q.nd?'<span class="bs-t" title="Nivel de desempeño Saber 11.° que exige la pregunta">Nivel '+e(q.nd)+'</span>':'')+
    (q.mdec?'<span class="bs-t" title="Método MDEC: modelo propio del docente, sin DBA ni estándar">Método MDEC</span>':'')+
    (q.icfes?'<span class="bs-t">Oficial Icfes '+e(q.icfes)+'</span>':'')+(it.datos?'<span class="bs-t">Con datos</span>':'');
  return '<div class="bs-q'+(sel?' on':'')+'" data-k="'+e(it.key)+'"><div class="bs-cab"><input type="checkbox" aria-label="Elegir esta pregunta"'+(sel?' checked':'')+'><div style="flex:1"><div class="bs-tags">'+tags+'</div>'+
    (q.ctx?'<div class="bs-ctx">'+(H.ctx||e(limpio(q.ctx)))+'</div>':'')+extra+'<div class="bs-enun">'+(H.q||e(limpio(q.q)))+'</div>'+
    ((q.f||q.fig||q.gen)?'<div class="bs-ctx">(Esta pregunta lleva una estructura o figura dibujada: se ve en el documento.)</div>':'')+((q.imgOps||q.opsGraf)?(q.opsGraf?SI.opsImgHTML(q):'<div class="bs-ctx">(Opciones dibujadas: se ven en el documento.)</div>'):'<ol class="bs-o">'+ops+'</ol>')+
    (q.exp?'<details><summary>Explicación</summary>'+e(limpio(q.exp))+'</details>':'')+'</div></div></div>';
}
function resumenSel(){
  var its=elegidasItems(),c={uso:0,exp:0,ind:0};its.forEach(function(x){c[x.c]++;});
  return its.length+' elegida'+(its.length===1?'':'s')+(its.length?' · uso '+c.uso+' · explicación '+c.exp+' · indagación '+c.ind:'');
}
function pintar(){
  if(!RAIZ)return;
  var items=construir(),lista=filtrar(),sel={};estado.claves.forEach(function(k){sel[k]=1;});
  var cG=opcionesCuenta('grados',items),cD=opcionesCuenta('dba',items),cE=opcionesCuenta('est',items),cP=opcionesCuenta('pri',items),cT=opcionesCuenta('tema',items);
  var gOpts=ordenIds(Object.keys(cG)).map(function(g){return [g,g+'.° ('+cG[g]+')'];});
  var dOpts=ordenIds(Object.keys(cD)).map(function(d){return [d,'DBA '+d+' — '+corto(DBA[d]&&DBA[d].texto,70)+' ('+cD[d]+')'];});
  var eOpts=ordenIds(Object.keys(cE)).map(function(s){return [s,s+' — '+corto(EST[s]&&EST[s].texto,70)+' ('+cE[s]+')'];});
  var pOpts=ordenIds(Object.keys(cP)).map(function(p){return [p,p+(PRI[p]&&PRI[p].componente?' · '+PRI[p].componente:'')+' — '+corto(PRI[p]&&PRI[p].aprendizaje,60)+' ('+cP[p]+')'];});
  var tOpts=Object.keys(cT).map(function(t){return [t,(CFG.temaNombre?CFG.temaNombre(t):t)+' ('+cT[t]+')'];});
  var afs=['I1','I2','I3','E1','E2','E3','N1','N2','N3','N4'];
  var cA=opcionesCuenta('af',items);
  var aOpts=afs.filter(function(a){return cA[a];}).map(function(a){return [a,a+' ('+cA[a]+')'];});
  var h='<div class="bsel"><h3>📚 Banco de preguntas</h3><p class="bs-sub">Filtra por grado, DBA, estándar básico o aprendizaje priorizado, elige las preguntas y úsalas en las guías, talleres y evaluaciones. Hay '+items.length+' preguntas tipo Saber 11.</p>'+
   '<div class="bs-filtros">'+selectHTML('bs-grado','Grado',gOpts,F.grado)+selectHTML('bs-dba','DBA (MEN, 2016)',dOpts,F.dba)+selectHTML('bs-est','Estándar básico (MEN, 2004)',eOpts,F.est)+selectHTML('bs-pri','Aprendizaje priorizado (SED Bogotá, 2025)',pOpts,F.pri)+
   selectHTML('bs-tema','Tema',tOpts,F.tema)+selectHTML('bs-comp','Competencia',[['uso','Uso comprensivo'],['exp','Explicación de fenómenos'],['ind','Indagación']],F.comp)+selectHTML('bs-af','Afirmación (Icfes)',aOpts,F.af)+selectHTML('bs-nd','Nivel de desempeño (Icfes)',[['1','Nivel 1'],['2','Nivel 2'],['3','Nivel 3'],['4','Nivel 4']],F.nd)+
   selectHTML('bs-datos','Datos y tipo',[['si','Con tabla o gráfica'],['mdec','Solo método MDEC'],['sinmdec','Sin método MDEC']],F.datos)+
   '<div><label for="bs-q">Buscar en el texto</label><input type="search" id="bs-q" value="'+e(F.q)+'" placeholder="palabra o frase"></div></div>'+
   infoRef()+
   '<div class="bs-barra" id="bs-sel"><b>'+e(resumenSel())+'</b>'+
   '<button type="button" class="bs-b" data-a="todas">Elegir las '+lista.length+' visibles</button>'+
   '<button type="button" class="bs-b" data-a="quitar">Quitar las visibles</button>'+
   '<button type="button" class="bs-b" data-a="solo">'+(F.soloSel?'Ver todas':'Ver solo las elegidas')+'</button>'+
   '<button type="button" class="bs-b" data-a="limpiar">Vaciar la selección</button>'+
   '<label class="bs-chk"><input type="checkbox" id="bs-usar"'+(estado.usar?' checked':'')+'> Usar mi selección en guías, talleres y evaluaciones</label>'+
   '<label class="bs-chk"><input type="checkbox" id="bs-comp2"'+(estado.completar?' checked':'')+'> Completar con preguntas al azar si piden más</label></div>'+
   '<div class="bs-sub">'+lista.length+' pregunta'+(lista.length===1?'':'s')+' con estos filtros.</div>'+
   (lista.length?lista.slice(0,F.max).map(function(it){return tarjeta(it,!!sel[it.key]);}).join(''):'<div class="bs-vacio">Ninguna pregunta cumple los filtros.</div>')+
   (lista.length>F.max?'<p><button type="button" class="bs-b" data-a="mas">Mostrar '+Math.min(40,lista.length-F.max)+' más ('+(lista.length-F.max)+' restantes)</button></p>':'')+'</div>';
  var foco=document.activeElement&&document.activeElement.id,pos=document.activeElement&&document.activeElement.selectionStart;
  RAIZ.innerHTML=h;enlazar(lista);
  if(foco){var f=document.getElementById(foco);if(f&&f.id==='bs-q'){f.focus();try{f.setSelectionRange(pos,pos);}catch(x){}}}
}
function enlazar(lista){
  var ids={'bs-grado':'grado','bs-dba':'dba','bs-est':'est','bs-pri':'pri','bs-tema':'tema','bs-comp':'comp','bs-af':'af','bs-nd':'nd','bs-datos':'datos'};
  Object.keys(ids).forEach(function(id){var el=document.getElementById(id);if(el)el.onchange=function(){F[ids[id]]=el.value;F.max=40;pintar();};});
  var q=document.getElementById('bs-q');if(q)q.oninput=function(){F.q=q.value;F.max=40;clearTimeout(enlazar.t);enlazar.t=setTimeout(pintar,250);};
  var u=document.getElementById('bs-usar');if(u)u.onchange=function(){estado.usar=u.checked;guardar();evento();};
  var c2=document.getElementById('bs-comp2');if(c2)c2.onchange=function(){estado.completar=c2.checked;guardar();evento();};
  RAIZ.querySelectorAll('.bs-q input[type=checkbox]').forEach(function(cb){cb.onchange=function(){
    var k=cb.closest('.bs-q').getAttribute('data-k'),i=estado.claves.indexOf(k);
    if(cb.checked&&i<0)estado.claves.push(k);else if(!cb.checked&&i>=0)estado.claves.splice(i,1);
    guardar();evento();cb.closest('.bs-q').classList.toggle('on',cb.checked);var b=document.querySelector('#bs-sel b');if(b)b.textContent=resumenSel();};});
  RAIZ.querySelectorAll('[data-a]').forEach(function(b){b.onclick=function(){
    var a=b.getAttribute('data-a');
    if(a==='todas'){lista.forEach(function(it){if(estado.claves.indexOf(it.key)<0)estado.claves.push(it.key);});}
    else if(a==='quitar'){var v={};lista.forEach(function(it){v[it.key]=1;});estado.claves=estado.claves.filter(function(k){return !v[k];});}
    else if(a==='limpiar'){if(estado.claves.length&&!confirm('¿Vaciar la selección ('+estado.claves.length+' preguntas)?'))return;estado.claves=[];F.soloSel=false;}
    else if(a==='solo'){F.soloSel=!F.soloSel;F.max=40;}
    else if(a==='mas'){F.max+=40;}
    guardar();evento();pintar();};});
}

/* ── avisos fuera de la pestaña ── */
function pintarAviso(){
  var el=document.getElementById('bsel-aviso');if(!el)return;
  el.innerHTML=activo()?'<div class="bs-av">📚 <b>Usando tu selección del Banco de preguntas</b> ('+e(resumenSel())+'). '+(estado.completar?'Si el documento pide más preguntas, se completan al azar. ':'Solo se usan las elegidas. ')+'Para volver al sorteo, desactívala en la pestaña «Banco de preguntas».</div>':'';
}
function pintarInsignia(){
  var b=document.getElementById('bsel-insignia');if(!b)return;
  b.textContent=estado.claves.length?' ('+estado.claves.length+')':'';
}

window.BancoSel={
  montar:function(el){css();RAIZ=el;construir();pintar();pintarAviso();pintarInsignia();},
  activo:activo,
  elegidas:function(){return elegidasItems().map(function(x){return x.q;});},
  total:function(){return estado.claves.length;},
  refrescar:function(){pintarAviso();pintarInsignia();},
  _todas:construir
};
css();
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',function(){pintarAviso();pintarInsignia();});else{pintarAviso();pintarInsignia();}
})();
