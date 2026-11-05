/* ═══════════════════════════════════════════════════════════════════════
   ChromaNom — utilidades de la Fase 4 (orbitales, propiedades,
   biomoléculas y ambiente). Se carga después de fx-libro.js.
   - .glos button      → voltea la tarjeta (pre-entrenamiento de Mayer)
   - .pasos            → muestra un paso del ejemplo resuelto a la vez
   - [data-fx="…"]     → dibuja la fórmula con el motor FX (sin paréntesis)
   - F4.clasificador() → tarjetas con botones de categoría y retroalimentación
   ═══════════════════════════════════════════════════════════════════════ */
(function(){
'use strict';
function $$(s,r){return Array.prototype.slice.call((r||document).querySelectorAll(s));}

function glosario(){
  $$('.glos button').forEach(function(b){
    b.setAttribute('aria-pressed','false');
    b.addEventListener('click',function(){var on=!b.classList.contains('on');b.classList.toggle('on',on);b.setAttribute('aria-pressed',on?'true':'false');});
  });
}

function pasos(){
  $$('.pasos').forEach(function(box){
    var li=$$('li',box);if(!li.length)return;
    var n=1;
    var ctl=document.createElement('div');ctl.className='pasos-ctl';
    ctl.innerHTML='<button type="button" class="btn-sm prim" data-a="sig">Siguiente paso →</button><button type="button" class="btn-sm" data-a="todo">Ver todos</button><button type="button" class="btn-sm" data-a="rei">↺ Empezar de nuevo</button>';
    box.appendChild(ctl);
    function pinta(nuevo){li.forEach(function(x,i){x.classList.toggle('oculto',i>=n);x.classList.toggle('nuevo',nuevo&&i===n-1);});
      ctl.querySelector('[data-a=sig]').disabled=n>=li.length;
      ctl.querySelector('[data-a=sig]').textContent=n>=li.length?'✓ Ejemplo completo':'Siguiente paso ('+(n+1)+' de '+li.length+') →';}
    ctl.addEventListener('click',function(e){var b=e.target.closest('button');if(!b)return;
      var a=b.dataset.a;if(a==='sig'&&n<li.length){n++;pinta(true);}else if(a==='todo'){n=li.length;pinta(false);}else if(a==='rei'){n=1;pinta(false);}});
    pinta(false);
  });
}

function formulas(){
  if(typeof FX==='undefined')return;
  $$('[data-fx]').forEach(function(el){
    el.innerHTML='<span class="fx-in"><span class="fx-sr">'+(el.getAttribute('aria-label')||el.dataset.fx.replace(/[⟦⟧|]/g,' '))+'</span><span aria-hidden="true">'+FX.mol(el.dataset.fx)+'</span></span>';
    el.classList.add('fxm');
  });
}

/* Clasificador: items=[{t:'texto', ok:'categoría', fb:'por qué'}], cats=['A','B'] */
function clasificador(box,items,cats,onDone){
  if(typeof box==='string')box=document.getElementById(box);if(!box)return;
  var hechos=0,bien=0;
  box.classList.add('clasif');
  box.innerHTML=items.map(function(it,i){
    return '<div class="item" data-i="'+i+'">'+it.t+'<div class="seg">'+cats.map(function(c){return '<button type="button" data-c="'+c+'">'+c+'</button>';}).join('')+'</div><small aria-live="polite"></small></div>';
  }).join('');
  box.addEventListener('click',function(e){
    var b=e.target.closest('button');if(!b)return;
    var card=b.closest('.item'),it=items[+card.dataset.i];if(card.dataset.listo)return;
    var ok=b.dataset.c===it.ok;
    if(!card.dataset.intento){card.dataset.intento='1';if(ok)bien++;}
    if(ok){card.dataset.listo='1';card.classList.remove('fail');card.classList.add('ok');b.classList.add('on');
      $$('button',card).forEach(function(x){x.disabled=true;});card.querySelector('small').innerHTML='✓ '+it.fb;hechos++;
      if(hechos===items.length&&onDone)onDone(bien,items.length);}
    else{card.classList.add('fail');b.disabled=true;card.querySelector('small').innerHTML='✗ No es «'+b.dataset.c+'». '+(it.pista||'Revisa la explicación de arriba e inténtalo otra vez.');}
  });
}

function iniciar(){glosario();pasos();formulas();}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',iniciar);else iniciar();
window.F4={clasificador:clasificador,formulas:formulas};
})();
