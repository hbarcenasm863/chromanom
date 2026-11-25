/* contador.js — Contador de preguntas del sitio (el mismo archivo en BioNom, ChromaNom e IonNom).
   Cuenta en vivo, cada vez que se abre la página, las preguntas de los bancos del sitio: así el número
   cambia solo cuando se agregan o quitan preguntas. Uso:
     <div id="contador-preguntas"></div>
     <script src="contador.js" data-sitio="bionom|chromanom|ionom" defer></script>
   Carga los bancos aparte, en un marco invisible, después de que la página termina de cargar
   (sin estorbarla), y cuenta el banco completo. */
(function(){
'use strict';
var yo=document.currentScript;
var SITIO=(yo&&yo.getAttribute('data-sitio'))||'';
var SUMA_OBJ='function(o){var n=0;for(var k in o)n+=(o[k]||[]).length;return n;}';
var CFG={
  bionom:{scripts:['dba-bio.js','banco.js','docente-datos.js','ahorcado-datos.js'],
    cuentas:{juego:'BANCO_BIO.length',saber:'DOCENTE_DATOS.SABER.length',
      abiertas:'('+SUMA_OBJ+')(DOCENTE_DATOS.ABIERTAS)',palabras:'BANCO_AHORCADO.length'}},
  chromanom:{scripts:['fundamentos.js','temas-extra.js','temas-11.js','docente-datos.js','mdec-moleculas.js','mdec-saber.js','ahorcado-datos.js'],
    cuentas:{juego:'FUND_BANCO.length+(window.MDEC_JUEGO_N||0)',saber:'('+SUMA_OBJ+')(DOCENTE_DATOS.SABER)',
      abiertas:'('+SUMA_OBJ+')(DOCENTE_DATOS.ABIERTAS)',palabras:'BANCO_AHORCADO.length'},
    /* el juego de ChromaNom tiene además bancos escritos dentro de juego.html, y las preguntas MDEC que
       arma al cargar (MDEC_JUEGO_N, en mdec-moleculas.js) */
    juegoHtml:{url:'juego.html',arreglos:['QBANK','QBANK_EXTRA','QBANK_NOMENCLATURA_50','QBANK_HIDRO150']}},
  ionom:{scripts:['banco.js','assets/bancos-extra.js','assets/docente-datos.js','assets/mdec-compuestos.js','assets/mdec-saber.js'],
    cuentas:{juego:'[BANCO_ATOMO,BANCO_ENLACE,BANCO_PH,BANCO_INDUSTRIA,BANCO_MODELOS,BANCO_GASES,BANCO_SOLUCIONES,BANCO_ESTEQUIOMETRIA].reduce(function(a,x){return a+x.length;},0)',
      saber:'DOCENTE_DATOS.SABER.length',abiertas:'DOCENTE_DATOS.ABIERTAS.length',palabras:'BANCO_AHORCADO.length',
      compuestos:'BANCO.length'}}
};
var C=CFG[SITIO];if(!C)return;
var NOMBRES={juego:'del juego',saber:'tipo Saber 11',abiertas:'abiertas',palabras:'palabras con pistas',compuestos:'compuestos para nomenclatura'};
var AYUDA={juego:'Preguntas del Juego y de los laberintos',saber:'Preguntas tipo Saber 11 con situación, para evaluaciones y talleres',
  abiertas:'Preguntas abiertas para talleres y evaluaciones',palabras:'Palabras para crucigramas, sopas de letras, ahorcado y criptogramas',
  compuestos:'Compuestos para los ejercicios de nomenclatura'};

function miles(n){return String(n).replace(/\B(?=(\d{3})+(?!\d))/g,' ');}
function contarEn(win){
  var r={},ok=true;
  for(var k in C.cuentas){try{var v=win.eval(C.cuentas[k]);r[k]=(typeof v==='number'&&v>=0)?v:null;}catch(e){r[k]=null;}if(r[k]==null)ok=false;}
  return {r:r,ok:ok};
}
/* arreglo literal «const NOMBRE=[ … ]» dentro de un texto (respeta comillas y comentarios) */
function arreglo(txt,nombre){
  var ini=txt.indexOf('const '+nombre+'=[');if(ini<0)return null;
  var i=txt.indexOf('[',ini),prof=0,q=null,desde=i;
  for(;i<txt.length;i++){var c=txt[i];
    if(q){if(c==='\\'){i++;continue;}if(c===q)q=null;continue;}
    if(c==='"'||c==="'"||c==='`'){q=c;continue;}
    if(c==='/'&&txt[i+1]==='/'){i=txt.indexOf('\n',i);if(i<0)break;continue;}
    if(c==='/'&&txt[i+1]==='*'){i=txt.indexOf('*/',i)+1;continue;}
    if(c==='[')prof++;else if(c===']'){prof--;if(!prof)break;}}
  try{return (new Function('return '+txt.slice(desde,i+1)))();}catch(e){return null;}
}
function extraJuego(){
  if(!C.juegoHtml||!window.fetch)return Promise.resolve(0);
  return fetch(C.juegoHtml.url).then(function(x){return x.text();}).then(function(t){
    var n=0;C.juegoHtml.arreglos.forEach(function(a){var v=arreglo(t,a);if(v&&v.length)n+=v.length;});return n;
  }).catch(function(){return 0;});
}
function enMarco(){
  return new Promise(function(res){
    var f=document.createElement('iframe');
    f.setAttribute('aria-hidden','true');f.tabIndex=-1;f.title='Conteo de preguntas';
    f.style.cssText='position:absolute;width:0;height:0;border:0;visibility:hidden';
    var html='<!DOCTYPE html><html><head><meta charset="utf-8"></head><body>'+
      C.scripts.map(function(s){return '<script src="'+s+'"><\/script>';}).join('')+'</body></html>';
    var listo=false;function fin(){if(listo)return;listo=true;var c=contarEn(f.contentWindow);setTimeout(function(){f.remove();},50);res(c.r);}
    f.onload=fin;setTimeout(fin,20000);
    f.srcdoc=html;document.body.appendChild(f);
  });
}
function pintar(r,extra){
  var cajas=document.querySelectorAll('#contador-preguntas,[data-contador-preguntas]');if(!cajas.length)return;
  if(r.juego!=null)r.juego+=extra;
  var orden=['juego','saber','abiertas','palabras','compuestos'],total=0,partes=[];
  orden.forEach(function(k){if(r[k]==null)return;if(k!=='compuestos'&&k!=='palabras')total+=r[k];
    partes.push('<span class="cp-item" title="'+AYUDA[k]+'"><b>'+miles(r[k])+'</b> '+NOMBRES[k]+'</span>');});
  if(!partes.length)return;
  var html='<div class="cp-total"><span class="cp-num">'+miles(total)+'</span> preguntas en el banco</div>'+
    '<div class="cp-items">'+partes.join('')+'</div>'+
    '<div class="cp-nota">Se cuentan solas cada vez que abres la página.</div>';
  for(var i=0;i<cajas.length;i++){cajas[i].innerHTML=html;cajas[i].classList.add('cp-listo');}
}
function estilos(){
  if(document.getElementById('cp-css'))return;
  var s=document.createElement('style');s.id='cp-css';
  s.textContent='#contador-preguntas,[data-contador-preguntas]{margin:1em auto;max-width:760px;padding:.8em 1em;border-radius:14px;'+
    'border:1px solid rgba(128,128,128,.35);background:rgba(128,128,128,.07);text-align:center;font-size:.95em;line-height:1.45}'+
    '#contador-preguntas:not(.cp-listo):empty,[data-contador-preguntas]:not(.cp-listo):empty{display:none}'+
    '.cp-total{font-size:1.15em;font-weight:600}.cp-num{font-size:1.6em;font-weight:800;margin-right:.15em}'+
    '.cp-items{display:flex;flex-wrap:wrap;justify-content:center;gap:.35em .9em;margin-top:.35em}'+
    '.cp-item b{font-weight:700}.cp-nota{font-size:.78em;opacity:.7;margin-top:.35em}';
  document.head.appendChild(s);
}
function iniciar(){
  estilos();
  /* siempre en un marco aparte: así se cuenta el banco completo, sin los filtros que aplique la página
     (por ejemplo, el modelo de reinos de BioNom en el panel docente) */
  var datos=enMarco();
  Promise.all([datos,extraJuego()]).then(function(v){pintar(v[0],v[1]);});
}
function cuandoListo(fn){
  if(document.readyState==='complete')setTimeout(fn,300);
  else window.addEventListener('load',function(){setTimeout(fn,300);});
}
cuandoListo(function(){(window.requestIdleCallback||function(f){setTimeout(f,1);})(iniciar);});
})();
