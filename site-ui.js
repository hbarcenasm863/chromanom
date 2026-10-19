/* ── Barra de navegación inferior para celular ─────────────────────────────
   En pantallas angostas (≤640px) el menú superior de 7 íconos sin texto era
   difícil de entender y ocupaba ~100px fijos arriba. Este archivo, compartido
   por todas las páginas, lo reemplaza en celular por:
     - arriba: solo la marca "ChromaNom" y el botón Instalar (una fila delgada);
     - abajo: una barra fija con ícono + texto (Inicio, Teoría, Grupos,
       Reacciones, Juego, Más). "Más" abre Referencia, Isomería, Docente (que
       fusiona el antiguo Generador) y el control de tamaño de texto (que en
       celular deja de flotar encima del contenido).
   En PC no cambia nada. En el juego la barra se oculta durante la partida
   para no tapar las respuestas. */
(function(){
  var ITEMS=[
    {href:'index.html',ico:'🏠',txt:'Inicio'},
    {href:'teoria.html',ico:'⚗️',txt:'Teoría'},
    {href:'grupos.html',ico:'🔬',txt:'Grupos'},
    {href:'reacciones.html',ico:'🧪',txt:'Reacciones'},
    {href:'juego.html',ico:'🎮',txt:'Juego'}
  ];
  var MAS=[
    {href:'referencia.html',ico:'📋',txt:'Hoja de referencia'},
    {href:'isomeria.html',ico:'🔀',txt:'Isomería'},
    {href:'docente.html',ico:'📘',txt:'Docente: guías y evaluaciones'}
  ];
  var page=(location.pathname.split('/').pop()||'index.html').toLowerCase();

  function css(){
    var s=document.createElement('style');
    s.textContent=
      '#bnav,#bnav-sheet,#bnav-backdrop{display:none}'+
      '@media(max-width:640px){'+
        '.site-nav .nav-links>a{display:none!important}'+
        '.site-nav{flex-wrap:nowrap!important;min-height:52px!important;height:52px!important;padding:0 14px!important}'+
        '.site-nav .nav-brand img{height:26px!important}'+
        '.site-nav .nav-links{flex-wrap:nowrap!important}'+
        'body.has-bnav{padding-bottom:calc(64px + env(safe-area-inset-bottom))}'+
        '#bnav{display:flex;position:fixed;left:0;right:0;bottom:0;z-index:1000;'+
          'background:rgba(255,255,255,.96);border-top:1px solid #dfe7ef;box-shadow:0 -4px 16px rgba(13,34,51,.06);'+
          'padding:4px 2px calc(4px + env(safe-area-inset-bottom));justify-content:space-around}'+
        '#bnav a,#bnav button{flex:1;min-width:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:2px;'+
          'min-height:52px;padding:4px 1px;border:none;background:none;border-radius:10px;cursor:pointer;'+
          'color:#3d5166;text-decoration:none;font-family:Outfit,system-ui,sans-serif;'+
          'font-size:10.5px;font-weight:600;line-height:1.1}'+
        '#bnav .bi{font-size:19px;line-height:1}'+
        '#bnav .bt{max-width:100%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}'+
        '#bnav .on{background:#e8f4fb;color:#0d4a73;font-weight:800}'+
        '#bnav a:focus-visible,#bnav button:focus-visible{outline:3px solid #1a6ea8;outline-offset:-3px}'+
        'body.bnav-hide #bnav{display:none}'+
        'body.bnav-hide.has-bnav{padding-bottom:0}'+
        '#bnav-backdrop.open{display:block;position:fixed;inset:0;background:rgba(10,30,50,.45);z-index:1001}'+
        '#bnav-sheet.open{display:block;position:fixed;left:0;right:0;bottom:0;z-index:1002;background:#fff;'+
          'border-radius:18px 18px 0 0;padding:14px 16px calc(18px + env(safe-area-inset-bottom));'+
          'box-shadow:0 -10px 30px rgba(0,0,0,.25);font-family:Outfit,system-ui,sans-serif;color:#0d2d42}'+
        '#bnav-sheet h3{font-size:.8rem;text-transform:uppercase;letter-spacing:.1em;color:#2a3f52;margin:4px 0 10px}'+
        '#bnav-sheet a{display:flex;align-items:center;gap:12px;padding:12px;border-radius:12px;'+
          'text-decoration:none;color:#0d2d42;font-weight:700;font-size:1rem;background:#f0f7ff;margin-bottom:8px;min-height:48px}'+
        '#bnav-sheet .tz{display:flex;align-items:center;gap:10px;margin-top:6px}'+
        '#bnav-sheet .tz button{min-width:48px;min-height:44px;border-radius:10px;border:1.5px solid #d0e6f5;background:#fff;'+
          'font-weight:800;font-size:1rem;color:#0d2d42;cursor:pointer;font-family:inherit}'+
        '#bnav-sheet .tz span{min-width:3.5em;text-align:center;font-family:"JetBrains Mono",monospace;font-weight:700}'+
        '#bnav-sheet .cerrar{width:100%;margin-top:12px;min-height:44px;border:none;border-radius:12px;'+
          'background:#0d4a73;color:#fff;font-weight:700;font-size:.95rem;font-family:inherit;cursor:pointer}'+
        /* El control flotante de tamaño de texto pasa al menú "Más" */
        'body.has-bnav #text-zoom-widget{display:none!important}'+
      '}'+
      '@media print{#bnav,#bnav-sheet,#bnav-backdrop,.scroll-hint{display:none!important}}';
    document.head.appendChild(s);
  }

  function zoomLabel(){
    var l=document.getElementById('tz-label');
    return l?l.textContent:'';
  }

  function build(){
    if(!document.querySelector('.site-nav')) return;
    css();
    // Marca: el logo real en el menú de todas las páginas.
    var brand=document.querySelector('.site-nav .nav-brand');
    if(brand&&!brand.querySelector('img[data-cn-logo]')){
      brand.innerHTML='<img data-cn-logo src="logo-chromanom.png" alt="ChromaNom — inicio" width="106" height="30">';
    }
    var nav=document.createElement('nav');
    nav.id='bnav';
    nav.setAttribute('aria-label','Menú principal');
    var enMas=MAS.some(function(m){return m.href===page;});
    nav.innerHTML=ITEMS.map(function(it){
      var on=(it.href===page)||(page===''&&it.href==='index.html');
      return '<a href="'+it.href+'"'+(on?' class="on" aria-current="page"':'')+'><span class="bi" aria-hidden="true">'+it.ico+'</span><span class="bt">'+it.txt+'</span></a>';
    }).join('')+
      '<button type="button" id="bnav-mas" aria-haspopup="dialog" aria-expanded="false"'+(enMas?' class="on"':'')+'><span class="bi" aria-hidden="true">☰</span><span class="bt">Más</span></button>';
    document.body.appendChild(nav);

    var back=document.createElement('div'); back.id='bnav-backdrop';
    var sheet=document.createElement('div'); sheet.id='bnav-sheet';
    sheet.setAttribute('role','dialog'); sheet.setAttribute('aria-label','Más opciones');
    sheet.innerHTML='<h3>Más herramientas</h3>'+
      MAS.map(function(m){return '<a href="'+m.href+'"><span aria-hidden="true">'+m.ico+'</span>'+m.txt+'</a>';}).join('')+
      '<h3 style="margin-top:14px">Tamaño del texto</h3>'+
      '<div class="tz"><button type="button" data-tz="tz-minus" aria-label="Reducir texto">A−</button>'+
      '<span id="bnav-tz-label"></span>'+
      '<button type="button" data-tz="tz-plus" aria-label="Aumentar texto">A+</button>'+
      '<button type="button" data-tz="tz-reset" aria-label="Restablecer tamaño">↺</button></div>'+
      '<button type="button" class="cerrar">Cerrar</button>';
    document.body.appendChild(back); document.body.appendChild(sheet);
    document.body.classList.add('has-bnav');

    var masBtn=document.getElementById('bnav-mas');
    function abrir(){ sheet.classList.add('open'); back.classList.add('open'); masBtn.setAttribute('aria-expanded','true');
      document.getElementById('bnav-tz-label').textContent=zoomLabel(); }
    function cerrar(){ sheet.classList.remove('open'); back.classList.remove('open'); masBtn.setAttribute('aria-expanded','false'); }
    masBtn.addEventListener('click',abrir);
    back.addEventListener('click',cerrar);
    sheet.querySelector('.cerrar').addEventListener('click',cerrar);
    document.addEventListener('keydown',function(e){ if(e.key==='Escape') cerrar(); });
    // Los botones de tamaño reutilizan el control de text-zoom.js (oculto en celular).
    sheet.querySelectorAll('[data-tz]').forEach(function(b){
      b.addEventListener('click',function(){
        var t=document.getElementById(b.getAttribute('data-tz'));
        if(t) t.click();
        document.getElementById('bnav-tz-label').textContent=zoomLabel();
      });
    });

    // Juego: ocultar la barra mientras hay una partida en pantalla.
    if(page==='juego.html'){
      var revisar=function(){
        var activa=document.querySelector('.screen.active');
        var enPortada=!activa||activa.id==='s-portada';
        document.body.classList.toggle('bnav-hide',!enPortada);
      };
      revisar();
      new MutationObserver(revisar).observe(document.body,{subtree:true,attributes:true,attributeFilter:['class']});
    }
  }

  // Tablas más anchas que la pantalla: aviso de que se pueden deslizar.
  function avisosTablas(){
    document.querySelectorAll('table').forEach(function(t){
      var c=t.parentElement;
      if(!c) return;
      var ox=getComputedStyle(c).overflowX;
      var desborda=(ox==='auto'||ox==='scroll')&&c.scrollWidth>c.clientWidth+4&&c.offsetParent!==null;
      var prev=c.previousElementSibling;
      var tiene=prev&&prev.classList&&prev.classList.contains('scroll-hint');
      if(desborda&&!tiene){
        var h=document.createElement('div');
        h.className='scroll-hint';
        h.textContent='↔ Desliza para ver toda la tabla';
        h.style.cssText='font-size:.7rem;font-weight:600;color:#2a3f52;padding:4px 10px;text-align:right;font-family:Outfit,system-ui,sans-serif';
        c.parentElement.insertBefore(h,c);
      }else if(!desborda&&tiene){ prev.remove(); }
    });
  }
  var tAvisos=null;
  function programarAvisos(){ clearTimeout(tAvisos); tAvisos=setTimeout(avisosTablas,250); }

  // Marca de agua de moléculas al fondo (estilos en chromanom.css).
  function fondo(){
    if(document.getElementById('cn-mol-bg')) return;
    var d=document.createElement('div'); d.id='cn-mol-bg'; d.setAttribute('aria-hidden','true');
    document.body.insertBefore(d,document.body.firstChild);
  }

  function start(){
    fondo();
    build();
    programarAvisos();
    window.addEventListener('resize',programarAvisos);
    window.addEventListener('load',programarAvisos);
    // Las tablas en secciones plegables pueden aparecer después (al abrir un acordeón/pestaña).
    document.addEventListener('click',programarAvisos);
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',start);
  else start();
})();
