/* Pantalla completa para simulaciones (ChromaNom e IonNom — mismo archivo).
   Pone el botón «⛶ Pantalla completa» arriba a la derecha de cada simulación:
   los recuadros .sim (sim4.js / sim10.js / sim-extra.js), los que lleven
   data-pantalla="Nombre" y, si la página lo declara, window.PANTALLA_EXTRA
   (lista de selectores CSS). En computador y Android usa la pantalla completa
   del navegador (y gira el celular a horizontal); en iPhone, que no la permite
   en una página, el recuadro llena la ventana. Se sale con el botón o con Esc.
   El CSS va aquí mismo para que funcione igual en todas las páginas. */
(function(){
'use strict';
var css='.con-pantalla{position:relative}'+
'.btn-pantalla{display:flex;align-items:center;gap:6px;margin:0 0 8px auto;font:700 .82rem/1 inherit;font-family:inherit;padding:7px 12px;border-radius:999px;border:1.5px solid currentColor;background:transparent;color:inherit;cursor:pointer;opacity:.85;min-height:34px}'+
'.btn-pantalla:hover,.btn-pantalla:focus-visible{opacity:1;outline:2px solid currentColor;outline-offset:2px}'+
'.btn-pantalla .gira-aviso{display:block;font-weight:400;font-size:.72rem;margin-left:6px}'+
'.con-pantalla.en-pantalla{display:flex;flex-direction:column;background:var(--surf,var(--bg,#fff));color:var(--tx,#111);padding:14px 18px;overflow:auto;border-radius:0;margin:0;max-width:none;width:100%;height:100%;box-sizing:border-box;border:0}'+
'.con-pantalla.pantalla-activa{position:fixed;inset:0;z-index:9000;height:100dvh;width:100vw}'+
'.con-pantalla.en-pantalla .sim-cv{max-height:calc(100dvh - 130px);width:auto;max-width:100%}'+
'.con-pantalla.en-pantalla canvas,.con-pantalla.en-pantalla svg{max-width:100%}'+
'.con-pantalla.en-pantalla canvas:not(.sim-cv):not(.sx-cv){max-height:calc(100dvh - 130px);object-fit:contain}'+
'.con-pantalla.en-pantalla svg{max-height:calc(100dvh - 110px)}'+
'.con-pantalla.en-pantalla .sim-msg{font-size:1rem}'+
'html.sin-scroll,html.sin-scroll body{overflow:hidden}'+
'.en-pantalla #text-zoom-widget,html.sin-scroll #text-zoom-widget,html.sin-scroll .narr-btn,html.sin-scroll .menu-flota{display:none!important}'+
'@media (orientation:landscape) and (max-height:500px){.con-pantalla.en-pantalla{padding:8px 12px}.con-pantalla.en-pantalla>.btn-pantalla{font-size:.72rem;padding:4px 10px;margin-bottom:4px;min-height:28px}.con-pantalla.en-pantalla .sim-cv{max-height:calc(100dvh - 90px)}}'+
'@media print{.btn-pantalla{display:none!important}}';
var st=document.createElement('style');st.textContent=css;document.head.appendChild(st);

function marcar(){
  var sel=['.sim','[data-pantalla]'].concat(window.PANTALLA_EXTRA||[]).join(',');
  document.querySelectorAll(sel).forEach(function(c){
    if(c.closest('.con-pantalla')&&!c.hasAttribute('data-pantalla-listo')&&c.parentElement.closest('.con-pantalla,[data-pantalla-listo]'))return;
    if(!c.getAttribute('data-pantalla')){
      var s=c.getAttribute('data-sim'),h=c.closest('section,.sec,.card');h=h&&h.querySelector('h2,h3');
      c.setAttribute('data-pantalla',(h&&h.textContent.trim().replace(/^\W*\d+\s*/,'').slice(0,60))||'la simulación');
    }
  });
}
function montar(){
  marcar();
  document.querySelectorAll('[data-pantalla]:not([data-pantalla-listo])').forEach(function(C){
    if(C.parentElement&&C.parentElement.closest('[data-pantalla-listo]'))return;
    C.setAttribute('data-pantalla-listo','');C.classList.add('con-pantalla');
    var b=document.createElement('button');b.type='button';b.className='btn-pantalla';
    b.setAttribute('aria-label','Ver '+C.getAttribute('data-pantalla')+' en pantalla completa');
    b.innerHTML='⛶ Pantalla completa';C.insertBefore(b,C.firstChild);
    function activo(){return document.fullscreenElement===C||document.webkitFullscreenElement===C||C.classList.contains('pantalla-activa');}
    function pintar(){
      var on=activo();
      b.innerHTML=on?'✕ Salir de pantalla completa'+(matchMedia('(orientation:portrait) and (max-width:700px)').matches?'<small class="gira-aviso">Gira el celular para verla más grande</small>':''):'⛶ Pantalla completa';
      C.classList.toggle('en-pantalla',on);
      if(!on&&screen.orientation&&screen.orientation.unlock){try{screen.orientation.unlock();}catch(e){}}
      document.documentElement.classList.toggle('sin-scroll',C.classList.contains('pantalla-activa'));
      setTimeout(function(){window.dispatchEvent(new Event('resize'));},60);
    }
    b.addEventListener('click',function(){
      if(activo()){if(document.fullscreenElement||document.webkitFullscreenElement)(document.exitFullscreen||document.webkitExitFullscreen).call(document);C.classList.remove('pantalla-activa');pintar();return;}
      var f=C.requestFullscreen||C.webkitRequestFullscreen;
      if(f){Promise.resolve(f.call(C)).then(function(){if(screen.orientation&&screen.orientation.lock&&matchMedia('(pointer:coarse)').matches)screen.orientation.lock('landscape').catch(function(){});pintar();}).catch(function(){C.classList.add('pantalla-activa');pintar();});}
      else{C.classList.add('pantalla-activa');pintar();}
    });
    document.addEventListener('fullscreenchange',pintar);document.addEventListener('webkitfullscreenchange',pintar);
    document.addEventListener('keydown',function(ev){if(ev.key==='Escape'&&C.classList.contains('pantalla-activa')){C.classList.remove('pantalla-activa');pintar();}});
  });
}
window.PANTALLA_MONTAR=montar;
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',function(){setTimeout(montar,0);});else setTimeout(montar,0);
window.addEventListener('load',function(){setTimeout(montar,200);});
})();
