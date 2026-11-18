/* ChromaNom · calidad.js — accesibilidad en tiempo de ejecución.
   Arregla, sin tocar el contenido, cosas que se generan con JavaScript:
   1) Emojis decorativos al inicio de botones, enlaces y títulos → aria-hidden.
   2) Elementos clicables que no son <button>/<a> → role="button", foco y
      activación con Enter/Espacio.
   3) <svg> sin nombre → se describe con su propio texto, o se oculta al
      lector de pantalla si es solo adorno.
   No cambia colores ni estilos. Si falla, la página sigue igual. */
(function(){
  'use strict';
  var EMOJI=/^(\s*)((?:\p{Extended_Pictographic}[️‍⃣]*)+)(\s*)/u;
  var SEL_EMOJI='button,a,h1,h2,h3,h4,summary,label,.cn-btn,[role=button],[role=tab]';
  var INTERACTIVOS=/^(A|BUTTON|INPUT|SELECT|TEXTAREA|SUMMARY|LABEL|OPTION|DETAILS)$/;
  var cola=new Set(), pendiente=false;

  function emojis(root){
    var els=root.matches&&root.matches(SEL_EMOJI)?[root]:[];
    if(root.querySelectorAll) els=els.concat([].slice.call(root.querySelectorAll(SEL_EMOJI)));
    els.forEach(function(el){
      var n=el.firstChild;
      // ignora espacios iniciales
      while(n&&n.nodeType===3&&!n.nodeValue.trim()) n=n.nextSibling;
      if(!n||n.nodeType!==3) return;
      var m=EMOJI.exec(n.nodeValue);
      if(!m) return;
      var resto=n.nodeValue.slice(m[0].length);
      var hayMasTexto=resto.trim()||(el.textContent.replace(n.nodeValue,'').trim());
      if(!hayMasTexto) return;            // solo emoji: lo resuelve su aria-label/title
      // si el resto del texto está oculto (p. ej. «.full» en pantallas angostas),
      // el emoji es lo único que da nombre al control: se deja como está
      if(el.closest('.site-nav,#bnav,#bnav-sheet')||!(el.innerText||'').replace(n.nodeValue.slice(0,m[0].length),'').trim()) return;
      var sp=document.createElement('span');
      sp.setAttribute('aria-hidden','true');
      sp.textContent=m[2];
      n.nodeValue=(m[1]||'')+(m[3]?' ':'')+resto;
      el.insertBefore(sp,n);
    });
  }

  function clicables(root){
    var els=[].slice.call((root.querySelectorAll?root.querySelectorAll('[onclick]'):[]));
    if(root.matches&&root.matches('[onclick]')) els.push(root);
    els.forEach(function(el){
      if(INTERACTIVOS.test(el.tagName)||el.getAttribute('role')||el.getAttribute('data-kb')) return;
      if(el.closest('a,button,[role=button]')&&el.closest('a,button,[role=button]')!==el) return;
      el.setAttribute('role','button');
      el.setAttribute('data-kb','1');
      if(!el.hasAttribute('tabindex')) el.setAttribute('tabindex','0');
    });
  }

  function svgs(root){
    var els=[].slice.call((root.querySelectorAll?root.querySelectorAll('svg:not([role]):not([aria-label]):not([aria-hidden]):not([aria-labelledby])'):[]));
    els.forEach(function(sv){
      if(sv.querySelector('title')||sv.closest('[aria-hidden="true"]')) return;
      if(sv.closest('[role=img],button,a,[role=button]')) { sv.setAttribute('aria-hidden','true'); return; }
      var t=[].slice.call(sv.querySelectorAll('text')).map(function(x){return x.textContent.replace(/\s+/g,' ').trim();}).filter(Boolean).join(' ');
      if(t.length>140) t=t.slice(0,137)+'…';
      if(t){ sv.setAttribute('role','img'); sv.setAttribute('aria-label','Esquema: '+t); }
      else sv.setAttribute('aria-hidden','true');
    });
  }

  function procesa(root){
    try{emojis(root);}catch(e){}
    try{clicables(root);}catch(e){}
    try{svgs(root);}catch(e){}
  }
  function vacia(){
    pendiente=false;
    var raices=[].slice.call(cola);cola.clear();
    raices.forEach(function(r){ if(r.isConnected) procesa(r); });
  }
  function agenda(r){
    cola.add(r);
    if(!pendiente){pendiente=true;(window.requestIdleCallback||function(f){return setTimeout(f,150);})(vacia);}
  }

  // Enter y Espacio activan lo que se marcó como botón
  document.addEventListener('keydown',function(e){
    var el=e.target;
    if(!el||!el.getAttribute||el.getAttribute('data-kb')!=='1') return;
    if(e.key==='Enter'||e.key===' '){ e.preventDefault(); el.click(); }
  });

  function iniciar(){
    procesa(document.body);
    if(!window.MutationObserver) return;
    new MutationObserver(function(ms){
      ms.forEach(function(m){ m.addedNodes.forEach(function(n){ if(n.nodeType===1) agenda(n); }); });
    }).observe(document.body,{childList:true,subtree:true});
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',iniciar); else iniciar();
})();
