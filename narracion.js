/* ════════════════════════════════════════════════════════════════════════
   ChromaNom — narración opcional (como en IonNom)

   Principio de modalidad de Mayer: el estudiante puede ESCUCHAR la
   explicación mientras mira las figuras y animaciones, en vez de leerla.
   Es opcional y por partes (segmentación): cada sección (.sec con un h2)
   recibe su propio botón «🔊 Escuchar», que lee solo el texto explicativo
   de esa sección (no las preguntas de práctica, ni las tablas). El
   encabezado de la página (.cn-page-head) recibe «🔊 Escuchar introducción».

   Usa la voz del propio navegador (Web Speech API), en español de
   Colombia si existe; no necesita internet ni guarda nada. Si el
   navegador no tiene voz, no aparece ningún botón.

   Otras páginas pueden usar window.CN_NARRAR.leer(texto, boton).
   ════════════════════════════════════════════════════════════════════════ */
(function(){
  var S=window.speechSynthesis;
  if(!S||!window.SpeechSynthesisUtterance)return;
  var activo=null; // {btn, sec, txt}
  var voz=null;
  function elegirVoz(){
    var vs=S.getVoices(),prefs=['es-co','es-us','es-419','es-mx','es-es','es-ar','es-cl'];
    for(var i=0;i<prefs.length;i++){for(var j=0;j<vs.length;j++){if(vs[j].lang.toLowerCase()===prefs[i])return vs[j];}}
    for(j=0;j<vs.length;j++){if(/^es/i.test(vs[j].lang))return vs[j];}
    return null;
  }
  voz=elegirVoz();
  if('onvoiceschanged' in S)S.addEventListener?S.addEventListener('voiceschanged',function(){voz=elegirVoz();}):(S.onvoiceschanged=function(){voz=elegirVoz();});

  // Notación química → texto que la voz lee bien.
  var SUB={'₀':'0','₁':'1','₂':'2','₃':'3','₄':'4','₅':'5','₆':'6','₇':'7','₈':'8','₉':'9'};
  var SUP={'⁰':'0','¹':'1','²':'2','³':'3','⁴':'4','⁵':'5','⁶':'6','⁷':'7','⁸':'8','⁹':'9'};
  var CIRC={'①':'uno','②':'dos','③':'tres','④':'cuatro'};
  function hablable(t){
    var d=function(m,map){return ' '+m.split('').map(function(c){return map[c];}).join('')+' ';};
    return String(t)
      .replace(/σ\s*\(sigma\)/g,'σ').replace(/π\s*\(pi\)/g,'π')
      // primero los enlaces (antes de separar los subíndices con espacios)
      .replace(/(\S)[−–](?=\S)/g,'$1 ')
      .replace(/(\S)≡(?=\S)/g,'$1, triple enlace, ').replace(/(\S)=(?=\S)/g,'$1, doble enlace, ')
      .replace(/\s=\s/g,' igual a ').replace(/\s\+\s/g,' más ').replace(/\s→\s/g,' da ').replace(/→/g,' da ')
      .replace(/sp³/g,' s p tres ').replace(/sp²/g,' s p dos ').replace(/\bsp\b/g,' s p ')
      .replace(/[₀-₉]+/g,function(m){return d(m,SUB);})
      .replace(/[⁰-⁹¹²³]+/g,function(m){return d(m,SUP);})
      .replace(/[①②③④]/g,function(c){return ' '+CIRC[c]+' ';})
      .replace(/σ/g,' sigma ').replace(/π/g,' pi ')
      .replace(/(\d),(\d)/g,'$1 coma $2').replace(/°/g,' grados').replace(/kJ\/mol/g,'kilojulios por mol')
      .replace(/·/g,', ').replace(/[«»"]/g,' ').replace(/[🔑⚠️🧩✍️📘⛽☕🧴🧬✏️🏁]/gu,'')
      .replace(/\s+([,.:;])/g,'$1').replace(/\s+/g,' ').trim();
  }
  // Lee una lista de frases en cola (en algunos navegadores una sola
  // frase muy larga se corta a los ~15 s).
  function frases(t){return hablable(t).replace(/([.!?:;])\s+/g,'$1\n').split('\n').filter(function(x){return x.length>1;});}
  function parar(){
    S.cancel();
    if(activo){activo.btn.classList.remove('playing');activo.btn.innerHTML=activo.txt;activo.btn.setAttribute('aria-pressed','false');if(activo.sec)activo.sec.classList.remove('narrando');}
    activo=null;
  }
  function leer(texto,btn,sec){
    var mismo=activo&&activo.btn===btn;
    parar();if(mismo)return; // segundo toque = detener
    var fs=frases(texto);if(!fs.length)return;
    activo={btn:btn,sec:sec,txt:btn.innerHTML};
    btn.classList.add('playing');btn.innerHTML='⏹ Detener';btn.setAttribute('aria-pressed','true');
    if(sec)sec.classList.add('narrando');
    fs.forEach(function(f,i){
      var u=new SpeechSynthesisUtterance(f);u.lang='es-CO';u.rate=0.92;u.pitch=1.05;if(voz)u.voice=voz;
      if(i===fs.length-1)u.onend=function(){if(activo&&activo.btn===btn)parar();};
      S.speak(u);
    });
  }
  // Texto explicativo de una sección: títulos, párrafos, listas y recuadros
  // de idea clave; sin práctica, tablas, figuras ni controles.
  function textoDe(sec){
    var out=[],h=sec.querySelector('h1,h2');if(h){var th=h.textContent.trim();out.push(/[.!?:]$/.test(th)?th:th+'.');}
    sec.querySelectorAll('p,li,.key,.warn,.lab-msg,.tree-col h4,.tree-col p,.crit h4').forEach(function(el){
      if(el.closest('.prac,.pq,.lab-view,.fig,.tbl-wrap,.cn-legend,figure,button,svg,.fase-nav,.tipo,.dato'))return;
      if(el.parentElement&&el.parentElement.closest('.key,.warn,li,.lab-msg'))return; // ya incluido en su contenedor
      var t=el.textContent.replace(/\s+/g,' ').trim();if(t)out.push(/[.!?:]$/.test(t)?t:t+'.');
    });
    return out.join(' ');
  }
  function boton(etq){var b=document.createElement('button');b.type='button';b.className='narr-btn';b.innerHTML=etq;b.setAttribute('aria-pressed','false');b.title='Escuchar esta parte en voz alta';return b;}
  function montar(){
    var head=document.querySelector('.cn-page-head');
    if(head&&!head.querySelector('.narr-btn')&&!head.hasAttribute('data-sin-narracion')){
      var bh=boton('🔊 Escuchar introducción');bh.addEventListener('click',function(){leer(textoDe(head),bh,null);});head.appendChild(bh);
    }
    document.querySelectorAll('.sec').forEach(function(sec){
      var h2=sec.querySelector('h2');if(!h2||sec.querySelector('.narr-btn'))return;
      if(sec.id==='practica'||sec.id==='repaso')return; // las preguntas se leen, no se escuchan
      var b=boton('🔊 Escuchar');b.classList.add('narr-sec');
      b.addEventListener('click',function(){leer(textoDe(sec),b,sec);});
      h2.insertAdjacentElement('afterend',b);
    });
  }
  // La voz no sigue sonando al salir de la página o cambiarla de fondo.
  window.addEventListener('pagehide',parar);
  document.addEventListener('visibilitychange',function(){if(document.hidden)parar();});
  var css=document.createElement('style');
  css.textContent='.narr-btn{display:inline-flex;align-items:center;gap:6px;min-height:40px;padding:6px 14px;margin:2px 0 10px;border-radius:999px;border:1.5px solid var(--cn-brd,#d0e6f5);background:var(--cn-surf,#fff);color:var(--cn-brand-d,#0d4a73);font:inherit;font-size:.82rem;font-weight:800;cursor:pointer}'+
    '.narr-btn:hover,.narr-btn.playing{background:var(--cn-brand-l,#e8f4fb);border-color:var(--cn-brand,#1a6ea8)}'+
    '.cn-page-head .narr-btn{margin-top:12px}'+
    '.sec.narrando{box-shadow:0 0 0 3px rgba(26,110,168,.35),0 2px 14px rgba(26,110,168,.08)}'+
    '@media print{.narr-btn{display:none!important}}';
  document.head.appendChild(css);
  window.CN_NARRAR={leer:function(t,btn){leer(t,btn,null);},parar:parar};
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',montar);else montar();
})();
