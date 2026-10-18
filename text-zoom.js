/* ── Control de tamaño de texto (Aa) ──────────────────────────────────────
   Botón flotante que escala html{font-size}, afectando toda la tipografía
   basada en rem del sitio. La preferencia se guarda en localStorage y se
   comparte entre teoria.html, grupos.html, reacciones.html y referencia.html.
   Un script mínimo inline en <head> de cada página aplica el valor guardado
   de inmediato (antes de este archivo) para evitar parpadeo de tamaño. */
(function(){
  var KEY='chromanom_text_zoom';
  var MIN=90, MAX=160, STEP=10, DEFAULT=115;

  function clamp(v){ return Math.min(MAX, Math.max(MIN, v)); }
  function getZoom(){
    var v=parseInt(localStorage.getItem(KEY),10);
    return isNaN(v) ? DEFAULT : clamp(v);
  }
  function applyZoom(v){
    v=clamp(v);
    document.documentElement.style.fontSize=v+'%';
    try{ localStorage.setItem(KEY,String(v)); }catch(e){}
    var label=document.getElementById('tz-label');
    if(label) label.textContent=v+'%';
    var minusBtn=document.getElementById('tz-minus');
    var plusBtn=document.getElementById('tz-plus');
    if(minusBtn) minusBtn.disabled=(v<=MIN);
    if(plusBtn) plusBtn.disabled=(v>=MAX);
  }

  function injectUI(){
    var style=document.createElement('style');
    style.textContent=
      /* Opaco siempre: semitransparente se leía mal ("115%" gris claro).
         En celular (≤640px) no flota: pasa al menú "Más" de site-ui.js. */
      '#text-zoom-widget{position:fixed;bottom:18px;right:18px;z-index:999;'+
        'display:flex;align-items:center;gap:2px;'+
        'background:rgba(255,255,255,.96);border:1px solid #dfe7ef;'+
        'border-radius:100px;padding:5px;'+
        '-webkit-backdrop-filter:blur(16px) saturate(160%);backdrop-filter:blur(16px) saturate(160%);'+
        'box-shadow:inset 0 1px 0 rgba(255,255,255,.7),0 6px 18px rgba(26,110,168,.16);'+
        'font-family:Outfit,system-ui,sans-serif;'+
        'opacity:1}'+
      '#text-zoom-widget button{width:42px;height:42px;border-radius:50%;border:none;'+
        'background:#f1f5f9;color:#0d2d42;font-weight:800;cursor:pointer;font-family:inherit;'+
        'display:flex;align-items:center;justify-content:center;font-size:15px;line-height:1;'+
        'transition:background .15s,color .15s,transform .15s cubic-bezier(.34,1.56,.64,1)}'+
      '#text-zoom-widget button:hover:not(:disabled){background:#1a6ea8;color:#fff;transform:scale(1.08)}'+
      '#text-zoom-widget button:active:not(:disabled){transform:scale(.92)}'+
      '#text-zoom-widget button:disabled{opacity:.35;cursor:default}'+
      '#tz-label{font-size:13px;font-weight:700;color:#0d2233;min-width:40px;text-align:center;'+
        'font-family:"JetBrains Mono",monospace;user-select:none}'+
      '@media(max-width:480px){#text-zoom-widget{bottom:12px;right:12px}'+
        '#text-zoom-widget button{width:40px;height:40px;font-size:14px}}'+
      '@media print{#text-zoom-widget{display:none}}';
    document.head.appendChild(style);

    var wrap=document.createElement('div');
    wrap.id='text-zoom-widget';
    wrap.setAttribute('role','group');
    wrap.setAttribute('aria-label','Tamaño de texto');
    wrap.innerHTML=
      '<button type="button" id="tz-minus" aria-label="Reducir tamaño de texto" title="Reducir texto">A−</button>'+
      '<span id="tz-label" aria-live="polite"></span>'+
      '<button type="button" id="tz-plus" aria-label="Aumentar tamaño de texto" title="Aumentar texto">A+</button>'+
      '<button type="button" id="tz-reset" aria-label="Restablecer tamaño de texto" title="Restablecer (115%)">↺</button>';
    document.body.appendChild(wrap);

    document.getElementById('tz-minus').addEventListener('click',function(){ applyZoom(getZoom()-STEP); });
    document.getElementById('tz-plus').addEventListener('click',function(){ applyZoom(getZoom()+STEP); });
    document.getElementById('tz-reset').addEventListener('click',function(){ applyZoom(DEFAULT); });
  }

  function start(){ injectUI(); applyZoom(getZoom()); }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',start);
  else start();
})();
