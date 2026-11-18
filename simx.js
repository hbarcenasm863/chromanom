/* ═══ ChromaNom — simulaciones nuevas (simx.js)
   Cada página pone <div data-simx="nombre" data-titulo="…"></div> y este archivo arma el canvas,
   los controles y la animación (con botón de pantalla completa de pantalla.js):
   - destilacion    (ambiente.html)   torre de destilación fraccionada del petróleo
   - polimero       (ambiente.html)   polimerización por adición del etileno
   - sn2            (reacciones.html) ataque por la espalda e inversión del carbono
   - conformaciones (cadenas.html)    proyección de Newman y energía del giro
   - molecula3d     (carbono.html)    moléculas en 3D que se giran con el dedo
   - energia        (reacciones.html) perfil de energía: exotérmica, endotérmica y catalizador
   - diels          (reacciones.html) cicloadición de Diels-Alder: mecanismo pericíclico en un solo paso
   - pruebas        (biomoleculas.html)     laboratorio virtual: reactivos que identifican grupos y biomoléculas
   Se pausan solas cuando no se ven y arrancan en pausa si el sistema pide «reducir movimiento».
   Son MODELOS: simplifican la realidad para mostrar la idea central. ═══ */
(function(){
'use strict';
var PI2=Math.PI*2,SIMX={};
var css='.sx{margin:14px 0;border:1.5px solid #cbd5e1;border-radius:14px;background:#fff;color:#0d2d42;padding:10px;overflow:hidden}'+
'.sx .sx-cv{display:block;margin:0 auto;border-radius:10px;touch-action:none;max-width:100%}'+
'.sx .sx-ctl{display:flex;flex-wrap:wrap;gap:8px 14px;align-items:center;margin:8px 2px 0}'+
'.sx .sx-seg{display:inline-flex;flex-wrap:wrap;gap:4px}'+
'.sx .sx-seg button,.sx .sx-btn{font:700 .84rem/1.1 inherit;font-family:inherit;border:1.5px solid #94a3b8;background:#fff;color:#0d2d42;border-radius:999px;padding:7px 12px;min-height:34px;cursor:pointer}'+
'.sx .sx-seg button.on,.sx .sx-btn.on{background:#0d2d42;color:#fff;border-color:#0d2d42}'+
'.sx .sx-rng{display:flex;align-items:center;gap:8px;font-size:.85rem;font-weight:700;color:#334155}'+
'.sx .sx-rng input{width:210px;max-width:52vw}'+
'.sx .sx-rng b{font-family:monospace;color:#0f4c75;min-width:5.5em}'+
'.sx .sx-msg{margin-top:8px;font-size:.88rem;line-height:1.6;color:#334155;background:#f1f5f9;border-radius:10px;padding:9px 12px}'+
'@media(max-width:520px){.sx .sx-rng{flex-wrap:wrap;max-width:100%}.sx .sx-rng input{width:100%;max-width:100%;flex:1 1 160px}}';
var st=document.createElement('style');st.textContent=css;document.head.appendChild(st);
function el(tag,attrs,html){var x=document.createElement(tag);for(var k in attrs||{})x.setAttribute(k,attrs[k]);if(html!=null)x.innerHTML=html;return x;}
function coma(v,d){return v.toFixed(d).replace('.',',');}
function rnd(a,b){return a+Math.random()*(b-a);}
function cl(x,a,b){return x<a?a:x>b?b:x;}
function sm(a,b,x){var t=cl((x-a)/(b-a),0,1);return t*t*(3-2*t);}
/* Canvas nítido en cualquier pantalla; en pantalla completa se agranda a lo que quepa. */
function lienzo(box,ratio,alt){
  var cv=el('canvas',{role:'img','aria-label':alt||'Simulación'});cv.className='sx-cv';box.appendChild(cv);
  var ctx=cv.getContext('2d'),o={cv:cv,ctx:ctx,W:0,H:0};
  o.size=function(){var dpr=Math.min(window.devicePixelRatio||1,2),full=box.classList.contains('en-pantalla'),
    w=full?Math.max(280,Math.min(box.clientWidth-40,1500,Math.round((window.innerHeight-150)/ratio))):Math.max(280,Math.min(box.clientWidth-22||640,900));
    o.W=w;o.H=Math.round(w*ratio);cv.style.width=w+'px';cv.style.height=o.H+'px';cv.width=Math.round(w*dpr);cv.height=Math.round(o.H*dpr);ctx.setTransform(dpr,0,0,dpr,0,0);};
  o.size();
  o.pos=function(e){var r=cv.getBoundingClientRect();return {x:(e.clientX-r.left)*o.W/r.width,y:(e.clientY-r.top)*o.H/r.height};};
  return o;
}
function animar(L,paso){
  var vis=true,corre=!(window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches),ult=0,id=0;
  function cuadro(t){id=0;var dt=ult?Math.min(0.05,(t-ult)/1000):0.016;ult=t;paso(corre?dt:0);if(vis&&corre)pedir();else ult=0;}
  function pedir(){if(!id)id=requestAnimationFrame(cuadro);}
  if('IntersectionObserver' in window)new IntersectionObserver(function(e){vis=e[0].isIntersecting;if(vis)pedir();}).observe(L.cv);
  window.addEventListener('resize',function(){L.size();pedir();});
  if('ResizeObserver' in window){var anc=0;new ResizeObserver(function(){var w=L.cv.parentNode.clientWidth;if(Math.abs(w-anc)>2){anc=w;L.size();pedir();}}).observe(L.cv.parentNode);}
  pedir();
  return {get corre(){return corre;},alternar:function(){corre=!corre;if(corre)pedir();return corre;},dibujar:pedir,play:function(){corre=true;pedir();}};
}
function fila(box){var f=el('div',{class:'sx-ctl'});box.appendChild(f);return f;}
function boton(cont,txt,fn){var b=el('button',{type:'button',class:'sx-btn'},txt);b.addEventListener('click',function(){fn(b);});cont.appendChild(b);return b;}
function botonPausa(A,cont){return boton(cont,A.corre?'⏸ Pausar':'▶ Animar',function(b){b.textContent=A.alternar()?'⏸ Pausar':'▶ Animar';});}
function deslizador(cont,etq,min,max,paso,val,fn){var l=el('label',{class:'sx-rng'});l.innerHTML='<span>'+etq+'</span>';
  var r=el('input',{type:'range',min:min,max:max,step:paso,value:val});var v=el('b');l.appendChild(r);l.appendChild(v);cont.appendChild(l);
  function upd(){v.textContent=fn(+r.value);}r.addEventListener('input',upd);upd();r._upd=upd;return r;}
function pildoras(cont,ops,ini,fn){var s=el('div',{class:'sx-seg',role:'group'});ops.forEach(function(o){var b=el('button',{type:'button'},o[1]);b.dataset.k=o[0];if(o[0]===ini)b.classList.add('on');s.appendChild(b);});
  s.addEventListener('click',function(e){var b=e.target.closest('button');if(!b)return;s.querySelectorAll('button').forEach(function(x){x.classList.toggle('on',x===b);});fn(b.dataset.k);});cont.appendChild(s);return s;}
function nota(box,html){var n=el('div',{class:'sx-msg','aria-live':'polite'},html);box.appendChild(n);return n;}
function circ(ctx,x,y,r,c){ctx.beginPath();ctx.arc(x,y,r,0,PI2);ctx.fillStyle=c;ctx.fill();}
function txt(ctx,t,x,y,c,f,al){ctx.fillStyle=c||'#0d2d42';ctx.font=f||'700 12px sans-serif';ctx.textAlign=al||'left';ctx.fillText(t,x,y);}
function bola(ctx,x,y,r,c){var g=ctx.createRadialGradient(x-r*.35,y-r*.35,r*.1,x,y,r);g.addColorStop(0,'#fff');g.addColorStop(.25,c);g.addColorStop(1,shade(c,-.45));ctx.beginPath();ctx.arc(x,y,r,0,PI2);ctx.fillStyle=g;ctx.fill();}
function shade(h,f){var n=parseInt(h.slice(1),16),r=n>>16,g=n>>8&255,b=n&255;function m(v){return Math.round(f<0?v*(1+f):v+(255-v)*f);}return 'rgb('+m(r)+','+m(g)+','+m(b)+')';}
var FUENTE='700 12px "Outfit",sans-serif';

/* ── 1. Destilación fraccionada del petróleo (ambiente.html) ──────────────
   El crudo se calienta; lo que hierve por debajo de la temperatura del horno
   sube por la torre y se condensa en la bandeja donde la temperatura baja de
   su punto de ebullición. Las moléculas más grandes (más fuerzas de London)
   hierven más alto y se quedan más abajo. Los círculos son más grandes en las
   fracciones de cadenas más largas. */
SIMX.destilacion=function(box){
  var L=lienzo(box,0.82,'Torre de destilación fraccionada del petróleo con partículas que suben y se condensan en cada bandeja'),ctx=L.ctx;
  var F=[{n:'Gases',r:'C₁–C₄',bp:30,y:.12,c:'#0ea5e9',u:'gas de cocina (GLP)',w:3},
         {n:'Gasolina',r:'C₅–C₁₀',bp:110,y:.29,c:'#eab308',u:'combustible de carros y motos',w:5},
         {n:'Queroseno',r:'C₁₀–C₁₆',bp:220,y:.45,c:'#f97316',u:'combustible de aviones',w:3},
         {n:'Diésel',r:'C₁₄–C₂₀',bp:305,y:.61,c:'#a16207',u:'buses y camiones',w:3},
         {n:'Aceites y parafinas',r:'C₂₀–C₄₀',bp:400,y:.75,c:'#64748b',u:'lubricantes y velas',w:2}];
  var Th=380,P=[],cont=[0,0,0,0,0],asf=0,acu=0,tot=0;
  var c1=fila(box);
  deslizador(c1,'Temperatura del horno',250,450,10,Th,function(v){Th=v;return v+' °C';});
  boton(c1,'↺ Vaciar tanques',function(){cont=[0,0,0,0,0];asf=0;P=[];});
  var msg=nota(box,'');
  function geo(){var W=L.W,H=L.H;return {x0:W*.30,x1:W*.52,y0:H*.05,y1:H*.90,feed:H*.82};}
  function temp(y,g){return 30+(Th-30)*cl((y-g.y0)/(g.feed-g.y0),0,1);}
  function nuevo(){var g=geo(),k=Math.random()*14|0,t=k<2?0:k<5?1:k<8?2:k<11?3:k<13?4:5;
    return {k:t,x:g.x0-L.W*.05,y:g.feed,e:'entra',vx:0};}
  function paso(dt){
    var g=geo(),W=L.W,H=L.H;
    acu+=dt;while(acu>0.09){acu-=0.09;if(P.length<110)P.push(nuevo());}
    P.forEach(function(p){
      var f=p.k<5?F[p.k]:null;
      if(p.e==='entra'){p.x+=W*.22*dt;if(p.x>=g.x0+W*.04){p.x=g.x0+W*.04+rnd(0,W*.1);p.e=(!f||Th<f.bp+10)?'residuo':'sube';}}
      else if(p.e==='sube'){p.y-=H*.17*dt;p.x+=rnd(-1,1)*30*dt;p.x=cl(p.x,g.x0+8,g.x1-8);var ty=f.k===0?g.y0+4:f.y*H;if(p.k===0){if(p.y<=g.y0+6){p.e='sale';p.vx=0;}}else if(p.y<=ty){p.y=ty;p.e='lado';}}
      else if(p.e==='lado'){p.x+=W*.22*dt;if(p.x>g.x1+W*.1){p.e='tanque';}}
      else if(p.e==='sale'){p.y-=H*.12*dt;if(p.y<H*.01){p.e='fin';cont[0]++;}}
      else if(p.e==='residuo'){p.y+=H*.1*dt;p.x+=rnd(-1,1)*20*dt;if(p.y>g.y1-8){p.e='fin';asf++;}}
      if(p.e==='tanque'){p.e='fin';cont[p.k]++;}
    });
    P=P.filter(function(p){return p.e!=='fin';});
    ctx.clearRect(0,0,W,H);ctx.fillStyle='#f8fbff';ctx.fillRect(0,0,W,H);
    /* torre con degradado de temperatura */
    var gr=ctx.createLinearGradient(0,g.y0,0,g.y1);gr.addColorStop(0,'#bfdbfe');gr.addColorStop(.55,'#fde68a');gr.addColorStop(1,'#fca5a5');
    ctx.fillStyle=gr;ctx.fillRect(g.x0,g.y0,g.x1-g.x0,g.y1-g.y0);ctx.strokeStyle='#0d2d42';ctx.lineWidth=2.5;ctx.strokeRect(g.x0,g.y0,g.x1-g.x0,g.y1-g.y0);
    /* horno */
    ctx.fillStyle='#7f1d1d';ctx.fillRect(W*.04,g.feed-H*.07,W*.14,H*.14);txt(ctx,'Horno',W*.11,g.feed+H*.11,'#7f1d1d',FUENTE,'center');txt(ctx,Th+' °C',W*.11,g.feed+H*.005,'#fff',FUENTE,'center');
    ctx.fillStyle='#fde68a';ctx.fillRect(W*.18,g.feed-3,g.x0-W*.18,6);txt(ctx,'crudo',W*.11,g.feed-H*.09,'#0d2d42',FUENTE,'center');
    /* bandejas y salidas */
    F.forEach(function(f,i){var y=i===0?g.y0+4:f.y*H;ctx.strokeStyle=f.c;ctx.lineWidth=3;
      if(i>0){ctx.beginPath();ctx.moveTo(g.x0,y);ctx.lineTo(g.x1,y);ctx.stroke();}
      ctx.beginPath();ctx.moveTo(g.x1,y);ctx.lineTo(g.x1+W*.09,y);ctx.lineTo(g.x1+W*.09,y+H*.04);ctx.stroke();
      var tx=g.x1+W*.06,ty=y+H*.04,tw=W*.34,th=H*.075;ctx.strokeStyle='#64748b';ctx.lineWidth=1.5;ctx.strokeRect(tx,ty,tw,th);
      ctx.fillStyle=f.c;ctx.globalAlpha=.8;ctx.fillRect(tx,ty,tw*Math.min(1,cont[i]/40),th);ctx.globalAlpha=1;
      txt(ctx,f.n+' · '+f.r,tx+4,ty-3,'#0d2d42','700 '+Math.max(10,Math.round(W/62))+'px "Outfit",sans-serif');
      txt(ctx,Math.round(temp(y,g))+' °C',g.x0-6,y+4,'#475569','700 '+Math.max(9,Math.round(W/70))+'px "Outfit",sans-serif','right');});
    txt(ctx,'Gases',g.x0+(g.x1-g.x0)/2,g.y0-4,'#0369a1',FUENTE,'center');
    /* partículas */
    P.forEach(function(p){var f=p.k<5?F[p.k]:null;circ(ctx,p.x,p.y,f?1.6+f.w*.9:5.5,f?f.c:'#111827');});
    ctx.fillStyle='#111827';ctx.fillRect(g.x0,g.y1,g.x1-g.x0,H*.05*Math.min(1,.25+asf/60));txt(ctx,'Residuo (asfalto): '+asf,g.x0,g.y1+H*.065,'#111827',FUENTE);
    txt(ctx,'más frío ↑',g.x0-6,g.y0+14,'#0369a1',FUENTE,'right');txt(ctx,'más caliente ↓',g.x0-6,g.y1-6,'#b91c1c',FUENTE,'right');
    var vap=F.filter(function(f){return Th>=f.bp+10;}).length;
    msg.innerHTML=Th<340?'Con el horno a <b>'+Th+' °C</b> las fracciones más pesadas no alcanzan a evaporarse y se van con el residuo. Sube la temperatura y mira cuántas más salen.':
      '<b>Cada fracción se condensa donde la torre está más fría que su punto de ebullición.</b> Los círculos más grandes son moléculas más largas: tienen más fuerzas de London, hierven más alto y se quedan abajo; las pequeñas suben hasta arriba.';
  }
  var A=animar(L,paso);botonPausa(A,c1);
};

/* ── 2. SN2: el ataque por la espalda y la inversión del carbono ─────────
   Reacción modelo: HO⁻ + CH₃Br → CH₃OH + Br⁻. Se ve de lado: el HO⁻ entra
   por el lado opuesto al Br, los tres H se abren como un paraguas hasta
   quedar en un plano (estado de transición) y se invierten. Abajo, el
   diagrama de energía con la posición actual. */
SIMX.sn2=function(box){
  var L=lienzo(box,0.78,'Reacción SN2: el ion hidróxido ataca el carbono por el lado opuesto al bromo y la molécula se invierte'),ctx=L.ctx;
  var xi=0,auto=true,espera=0;
  var c1=fila(box);
  var rg=deslizador(c1,'Avance de la reacción',0,100,1,0,function(v){xi=v/100;auto=false;return Math.round(v)+' %';});
  rg.addEventListener('input',function(){auto=false;A.dibujar();});
  var bPl=boton(c1,'▶ Animar',function(b){auto=!auto;if(auto&&xi>=1)xi=0;b.textContent=auto?'⏸ Pausar':'▶ Animar';A.play();});
  var msg=nota(box,'');
  function E(x){return 62*Math.exp(-Math.pow((x-.5)/.17,2))-30*sm(.35,.95,x)+8*(1-sm(0,.25,x))*0;}
  function paso(dt){
    if(auto){if(xi<1){xi=Math.min(1,xi+dt*.22);espera=0;}else{espera+=dt;if(espera>1.6){xi=0;}}rg.value=Math.round(xi*100);rg._upd();bPl.textContent='⏸ Pausar';}
    var W=L.W,H=L.H,s=W/15.5,cx=W*.5,cy=H*.31;
    ctx.clearRect(0,0,W,H);ctx.fillStyle='#f8fbff';ctx.fillRect(0,0,W,H);
    var phi=(109.5-39*xi)*Math.PI/180,hx=1.1*Math.cos(phi),hr=1.1*Math.sin(phi);
    var dL=1.5+0.5*sm(0,.5,xi)+1.7*sm(.5,1,xi),dN=4.2-2.0*sm(0,.5,xi)-0.5*sm(.5,1,xi);
    var C={x:cx,y:cy},Nu={x:cx-dN*s,y:cy},LG={x:cx+dL*s,y:cy};
    var Hs=[{x:hx,y:hr,z:0},{x:hx+.38,y:-hr*.5,z:1},{x:hx-.38,y:-hr*.5,z:-1}];
    function enlace(a,b,solido,gr){ctx.strokeStyle='#334155';ctx.lineWidth=gr||3;ctx.setLineDash(solido?[]:[6,5]);ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.stroke();ctx.setLineDash([]);}
    var wN=sm(.3,.7,xi),wL=1-sm(.3,.7,xi);
    /* enlaces C–Nu y C–LG */
    ctx.globalAlpha=.25+.75*wN;enlace(Nu,C,xi>.75,2+2*wN);ctx.globalAlpha=.25+.75*wL;enlace(C,LG,xi<.25,2+2*wL);ctx.globalAlpha=1;
    Hs.forEach(function(h){var p={x:cx+h.x*s,y:cy-h.y*s};
      if(h.z<0){ctx.setLineDash([4,4]);}ctx.strokeStyle='#334155';ctx.lineWidth=h.z>0?5:2.5;ctx.beginPath();ctx.moveTo(C.x,C.y);ctx.lineTo(p.x,p.y);ctx.stroke();ctx.setLineDash([]);});
    circ(ctx,C.x,C.y,s*.55,'#475569');txt(ctx,'C',C.x,C.y+4,'#fff','800 '+Math.round(s*.5)+'px sans-serif','center');
    Hs.forEach(function(h){var p={x:cx+h.x*s,y:cy-h.y*s};bola(ctx,p.x,p.y,s*.34,'#e2e8f0');txt(ctx,'H',p.x,p.y+3.5,'#0d2d42','700 '+Math.round(s*.34)+'px sans-serif','center');});
    bola(ctx,Nu.x,Nu.y,s*.55,'#ef4444');txt(ctx,'O',Nu.x,Nu.y+4,'#fff','800 '+Math.round(s*.48)+'px sans-serif','center');
    bola(ctx,Nu.x-s*.55,Nu.y-s*.42,s*.3,'#e2e8f0');
    bola(ctx,LG.x,LG.y,s*.9,'#9a3412');txt(ctx,'Br',LG.x,LG.y+5,'#fff','800 '+Math.round(s*.6)+'px sans-serif','center');
    var lc=function(t,p,c){txt(ctx,t,p.x,p.y,c||'#b91c1c','800 '+Math.round(s*.75)+'px sans-serif','center');};
    lc(xi<.3?'−':xi<.7?'δ−':'',{x:Nu.x,y:Nu.y-s*.95});lc(xi<.3?'δ−':xi<.7?'δ−':'−',{x:LG.x,y:LG.y-s*1.3});
    /* flecha de ataque */
    if(xi<.5){ctx.strokeStyle='#16a34a';ctx.lineWidth=2.5;ctx.beginPath();ctx.moveTo(Nu.x+s*.7,Nu.y+s*1.05);ctx.quadraticCurveTo((Nu.x+C.x)/2,Nu.y+s*1.9,C.x-s*.6,C.y+s*.85);ctx.stroke();txt(ctx,'ataque por la espalda',(Nu.x+C.x)/2,Nu.y+s*2.4,'#15803d',FUENTE,'center');}
    /* diagrama de energía */
    var gx=W*.12,gw=W*.76,gy=H*.93,gh=H*.34;
    ctx.strokeStyle='#94a3b8';ctx.lineWidth=1.5;ctx.beginPath();ctx.moveTo(gx,gy-gh-4);ctx.lineTo(gx,gy);ctx.lineTo(gx+gw,gy);ctx.stroke();
    txt(ctx,'Energía',gx+4,gy-gh-8,'#475569','700 11px sans-serif');txt(ctx,'avance de la reacción →',gx+gw,gy+14,'#475569','700 11px sans-serif','right');
    ctx.strokeStyle='#2563eb';ctx.lineWidth=2.5;ctx.beginPath();for(var i=0;i<=100;i++){var x=i/100,y=gy-(E(x)+34)/100*gh*1.0;i?ctx.lineTo(gx+gw*x,y):ctx.moveTo(gx+gw*x,y);}ctx.stroke();
    circ(ctx,gx+gw*xi,gy-(E(xi)+34)/100*gh,6,'#dc2626');
    txt(ctx,'reactivos',gx+gw*.04,gy-gh*.3,'#475569','700 10px sans-serif');txt(ctx,'productos',gx+gw*.96,gy-gh*.05,'#475569','700 10px sans-serif','right');
    txt(ctx,'estado de transición',gx+gw*.5,gy-gh*1.0-6,'#475569','700 10px sans-serif','center');
    msg.innerHTML=xi<.2?'<b>Reactivos.</b> El HO⁻ se acerca al carbono por el lado <b>opuesto</b> al bromo: ahí el Br no le estorba y no lo repele.':
      xi<.45?'El HO⁻ empieza a formar un enlace con el carbono mientras el enlace C−Br se debilita. Los tres H se van aplanando.':
      xi<.58?'<b>Estado de transición.</b> El carbono tiene cinco enlaces parciales: los tres H quedan en un plano. Es el punto más alto de energía; solo dura un instante, y todo ocurre en <b>un solo paso</b>.':
      xi<.95?'El Br se aleja con el par de electrones del enlace y los H siguen abriéndose hacia el otro lado.':
      '<b>Productos.</b> La molécula quedó <b>invertida</b>, como un paraguas que el viento voltea. Por eso, si el carbono era quiral, la SN2 produce el enantiómero contrario (inversión de Walden).';
  }
  var A=animar(L,paso);
};

/* ── 3. Polimerización por adición del etileno (ambiente.html) ───────────
   Un radical libre abre el doble enlace de un monómero y se queda con el
   electrón desapareado en el extremo: la cadena crece de a una unidad. */
SIMX.polimero=function(box){
  var L=lienzo(box,0.6,'Cadena de polietileno que crece cuando monómeros de etileno se unen al extremo activo'),ctx=L.ctx;
  var N=26,M=[],chain=[],activo=true,acu=0,ult=0;
  var c1=fila(box);
  deslizador(c1,'Etileno disponible',8,50,1,N,function(v){N=v;return v+' moléculas';});
  boton(c1,'⛔ Terminar la cadena',function(){activo=false;});
  boton(c1,'↺ Nueva cadena',function(){chain=[];activo=true;ini();});
  var msg=nota(box,'');
  function paso0(){return Math.max(13,L.W/46);}
  function pto(n){var st=paso0(),per=Math.max(6,Math.floor((L.W-70)/st)),row=Math.floor(n/per),c=n%per,x=row%2?L.W-35-c*st:35+c*st;return {x:x,y:L.H*.18+row*L.H*.22+(n%2?-st*.28:st*.28)};}
  function ini(){chain=[pto(0),pto(1)];}
  ini();
  function mono(){var m={x:rnd(20,L.W-20),y:rnd(20,L.H-24),a:rnd(0,PI2),vx:rnd(-30,30),vy:rnd(-30,30)};return m;}
  function paso(dt){
    var W=L.W,H=L.H,fin=chain[chain.length-1];
    while(M.length<N)M.push(mono());M.length=N;
    M.forEach(function(m,i){m.x+=m.vx*dt;m.y+=m.vy*dt;m.a+=rnd(-1,1)*dt*3;m.vx+=rnd(-1,1)*60*dt;m.vy+=rnd(-1,1)*60*dt;
      var v=Math.hypot(m.vx,m.vy);if(v>90){m.vx*=90/v;m.vy*=90/v;}
      if(m.x<10||m.x>W-10)m.vx*=-1;if(m.y<10||m.y>H-10)m.vy*=-1;m.x=cl(m.x,6,W-6);m.y=cl(m.y,6,H-6);
      if(activo&&chain.length<260){var dx=fin.x-m.x,dy=fin.y-m.y,d=Math.hypot(dx,dy);
        if(d<paso0()*16){m.vx+=dx/d*260*dt;m.vy+=dy/d*260*dt;}
        if(d<paso0()*.9){var k=chain.length;chain.push(pto(k),pto(k+1));M.splice(i,1);}}});
    ctx.clearRect(0,0,W,H);ctx.fillStyle='#f8fbff';ctx.fillRect(0,0,W,H);
    ctx.strokeStyle='#334155';ctx.lineWidth=3;ctx.lineJoin='round';ctx.beginPath();chain.forEach(function(p,i){i?ctx.lineTo(p.x,p.y):ctx.moveTo(p.x,p.y);});ctx.stroke();
    var r=paso0()*.3;chain.forEach(function(p){circ(ctx,p.x,p.y,r,'#475569');});
    M.forEach(function(m){ctx.save();ctx.translate(m.x,m.y);ctx.rotate(m.a);var h=paso0()*.5;ctx.strokeStyle='#0d9488';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(-h*.5,-2);ctx.lineTo(h*.5,-2);ctx.moveTo(-h*.5,2);ctx.lineTo(h*.5,2);ctx.stroke();circ(ctx,-h*.5,0,r*.95,'#14b8a6');circ(ctx,h*.5,0,r*.95,'#14b8a6');ctx.restore();});
    if(activo){var f=chain[chain.length-1],pu=1+.25*Math.sin(Date.now()/160);ctx.beginPath();ctx.arc(f.x,f.y,r*2.1*pu,0,PI2);ctx.fillStyle='rgba(250,204,21,.45)';ctx.fill();circ(ctx,f.x,f.y,r*1.1,'#eab308');txt(ctx,'• extremo activo (radical)',Math.min(W-160,Math.max(10,f.x-70)),f.y-r*3.4,'#a16207','700 11px sans-serif');}
    var n=chain.length/2;txt(ctx,'Unidades en la cadena: '+n,10,H-8,'#0d2d42',FUENTE);txt(ctx,'Masa molar ≈ '+Math.round(n*28).toLocaleString('es-CO')+' g/mol',W-10,H-8,'#0d2d42',FUENTE,'right');
    txt(ctx,'— etileno (monómero, tiene C=C)',10,14,'#0d9488',FUENTE);
    msg.innerHTML=activo?'Cada monómero que toca el <b>extremo activo</b> abre su doble enlace C=C: un enlace π se convierte en un enlace σ que une la cadena y el electrón desapareado pasa al nuevo extremo. No se pierde nada: es una <b>polimerización por adición</b>. Con más etileno, la cadena crece más rápido.':
      '<b>Cadena terminada.</b> El polietileno solo tiene enlaces C−C y C−H: apolares y muy estables. Por eso los plásticos casi no reaccionan ni se degradan; una cadena real tiene miles de unidades, no unas pocas.';
  }
  var A=animar(L,paso);
};

/* ── 4. Conformaciones: proyección de Newman y energía (cadenas.html) ───── */
SIMX.conformaciones=function(box){
  var L=lienzo(box,0.56,'Proyección de Newman que gira y la curva de energía de la rotación del enlace simple'),ctx=L.ctx;
  var mol='etano',th=60,auto=false;
  var c1=fila(box);
  pildoras(c1,[['etano','Etano'],['butano','Butano (C2–C3)']],mol,function(k){mol=k;th=k==='etano'?60:180;rg.value=th;rg._upd();A.dibujar();});
  var c2=fila(box);
  var rg=deslizador(c2,'Giro del carbono de atrás',0,360,1,th,function(v){th=v;return Math.round(v)+'°';});
  rg.addEventListener('input',function(){auto=false;bA.textContent='▶ Girar solo';A.dibujar();});
  var bA=boton(c2,'▶ Girar solo',function(b){auto=!auto;b.textContent=auto?'⏸ Detener':'▶ Girar solo';A.play();});
  var msg=nota(box,'');
  function En(t){t=t*Math.PI/180;return mol==='etano'?6*(1+Math.cos(3*t)):9.767+2.267*Math.cos(t)-0.267*Math.cos(2*t)+7.233*Math.cos(3*t);}
  function nombre(t){if(mol==='etano')return Math.abs(((t%120)+120)%120-60)<4?'alternada (la más estable)':(((t%120)+120)%120<4||((t%120)+120)%120>116)?'eclipsada (la menos estable)':'intermedia';
    var u=((t%360)+360)%360;if(Math.abs(u-180)<6)return 'anti (la más estable)';if(Math.abs(u-60)<6||Math.abs(u-300)<6)return 'gauche';if(u<6||u>354)return 'eclipsada, CH₃ con CH₃ (la menos estable)';if(Math.abs(u-120)<6||Math.abs(u-240)<6)return 'eclipsada, CH₃ con H';return 'intermedia';}
  function paso(dt){
    if(auto){th=(th+dt*40)%360;rg.value=Math.round(th);rg._upd();}
    var W=L.W,H=L.H,R=Math.min(W*.14,H*.24),cx=W*.26,cy=H*.54,t=th*Math.PI/180;
    ctx.clearRect(0,0,W,H);ctx.fillStyle='#f8fbff';ctx.fillRect(0,0,W,H);
    var fs='700 '+Math.max(11,Math.round(R*.2))+'px sans-serif';
    ctx.strokeStyle='#0d2d42';ctx.lineWidth=3;ctx.beginPath();ctx.arc(cx,cy,R,0,PI2);ctx.fillStyle='#fff';ctx.fill();ctx.stroke();
    var base=-Math.PI/2;
    /* carbono de atrás: enlaces que salen del borde del círculo */
    for(var i=0;i<3;i++){var a=base+t+i*PI2/3,gr=(mol==='butano'&&i===0)?'CH₃':'H';
      ctx.strokeStyle='#64748b';ctx.lineWidth=5;ctx.beginPath();ctx.moveTo(cx+Math.cos(a)*R,cy+Math.sin(a)*R);ctx.lineTo(cx+Math.cos(a)*R*1.55,cy+Math.sin(a)*R*1.55);ctx.stroke();
      circ(ctx,cx+Math.cos(a)*R*1.68,cy+Math.sin(a)*R*1.68,R*.2,gr==='H'?'#94a3b8':'#475569');txt(ctx,gr,cx+Math.cos(a)*R*1.68,cy+Math.sin(a)*R*1.68+4,'#fff','700 '+Math.max(9,Math.round(R*.17))+'px sans-serif','center');}
    /* carbono de adelante: enlaces que salen del centro */
    for(var j=0;j<3;j++){var b=base+j*PI2/3,g2=(mol==='butano'&&j===0)?'CH₃':'H';
      ctx.strokeStyle='#dc2626';ctx.lineWidth=5;ctx.beginPath();ctx.moveTo(cx,cy);ctx.lineTo(cx+Math.cos(b)*R*.95,cy+Math.sin(b)*R*.95);ctx.stroke();
      circ(ctx,cx+Math.cos(b)*R*.62,cy+Math.sin(b)*R*.62,R*.2,g2==='H'?'#fca5a5':'#ef4444');txt(ctx,g2,cx+Math.cos(b)*R*.62,cy+Math.sin(b)*R*.62+4,'#450a0a','700 '+Math.max(9,Math.round(R*.17))+'px sans-serif','center');}
    circ(ctx,cx,cy,R*.1,'#0d2d42');
    txt(ctx,'rojo = carbono de adelante · gris = carbono de atrás',cx,H*.115,'#475569','700 11px sans-serif','center');
    txt(ctx,'Vista Newman',cx,H*.05,'#0d2d42',FUENTE,'center');
    /* curva de energía */
    var gx=W*.55,gw=W*.40,gy=H*.8,gh=H*.55,Em=mol==='etano'?12:19.5;
    ctx.strokeStyle='#94a3b8';ctx.lineWidth=1.5;ctx.beginPath();ctx.moveTo(gx,gy-gh-8);ctx.lineTo(gx,gy);ctx.lineTo(gx+gw,gy);ctx.stroke();
    txt(ctx,'Energía (kJ/mol)',gx,gy-gh-12,'#475569','700 11px sans-serif');txt(ctx,'ángulo de giro',gx+gw,gy+30,'#475569','700 11px sans-serif','right');
    [0,60,120,180,240,300,360].forEach(function(a){txt(ctx,a+'°',gx+gw*a/360,gy+14,'#64748b','10px sans-serif','center');});
    ctx.strokeStyle='#2563eb';ctx.lineWidth=2.5;ctx.beginPath();for(var q=0;q<=360;q+=3){var xx=gx+gw*q/360,yy=gy-En(q)/Em*gh;q?ctx.lineTo(xx,yy):ctx.moveTo(xx,yy);}ctx.stroke();
    circ(ctx,gx+gw*th/360,gy-En(th)/Em*gh,7,'#dc2626');
    txt(ctx,coma(En(th),1)+' kJ/mol',gx+gw*.5,gy+48,'#0d2d42',FUENTE,'center');
    msg.innerHTML='Conformación <b>'+nombre(th)+'</b>. '+(mol==='etano'?'Cuando los H de adelante tapan a los de atrás (eclipsada) se repelen más; en la alternada están lo más lejos posible. La diferencia es de solo unos 12 kJ/mol: a temperatura ambiente el etano gira libremente.':
      'En el butano los grupos grandes (CH₃) se estorban: la <b>anti</b> (180°) es la más estable y la eclipsada con CH₃ frente a CH₃ es la de mayor energía (unos 19 kJ/mol). La <b>gauche</b> queda 3,8 kJ/mol arriba de la anti.');
  }
  var A=animar(L,paso);
};

/* ── 5. Moléculas en 3D que se giran con el dedo (carbono.html) ───────── */
SIMX.molecula3d=function(box){
  var L=lienzo(box,0.62,'Modelo de bolas y varillas de una molécula que se gira arrastrando'),ctx=L.ctx;
  var COL={C:'#475569',H:'#e2e8f0'},RAD={C:.55,H:.34};
  function metano(){var s=1.09/Math.sqrt(3),a=[{e:'C',p:[0,0,0]}],b=[];[[1,1,1],[1,-1,-1],[-1,1,-1],[-1,-1,1]].forEach(function(v,i){a.push({e:'H',p:[v[0]*s,v[1]*s,v[2]*s]});b.push([0,i+1]);});return {a:a,b:b};}
  function etano(){var a=[{e:'C',p:[-.77,0,0]},{e:'C',p:[.77,0,0]}],b=[[0,1]],k=2;for(var i=0;i<3;i++){var f=i*PI2/3;
    a.push({e:'H',p:[-.77-1.09*.334,1.09*.943*Math.cos(f),1.09*.943*Math.sin(f)]});b.push([0,k++]);
    a.push({e:'H',p:[.77+1.09*.334,1.09*.943*Math.cos(f+Math.PI/3),1.09*.943*Math.sin(f+Math.PI/3)]});b.push([1,k++]);}return {a:a,b:b};}
  function eteno(){var a=[{e:'C',p:[-.67,0,0]},{e:'C',p:[.67,0,0]}],b=[[0,1]],ang=58.5*Math.PI/180;
    [[-1,-1],[-1,1],[1,-1],[1,1]].forEach(function(v,i){a.push({e:'H',p:[v[0]*(.67+1.09*Math.cos(ang)),v[1]*1.09*Math.sin(ang),0]});b.push([v[0]<0?0:1,i+2]);});return {a:a,b:b};}
  function etino(){return {a:[{e:'C',p:[-.6,0,0]},{e:'C',p:[.6,0,0]},{e:'H',p:[-1.66,0,0]},{e:'H',p:[1.66,0,0]}],b:[[0,1],[0,2],[1,3]]};}
  function benceno(){var a=[],b=[];for(var i=0;i<6;i++){var f=i*Math.PI/3;a.push({e:'C',p:[1.4*Math.cos(f),1.4*Math.sin(f),0]});}
    for(i=0;i<6;i++){f=i*Math.PI/3;a.push({e:'H',p:[2.49*Math.cos(f),2.49*Math.sin(f),0]});b.push([i,(i+1)%6]);b.push([i,6+i]);}return {a:a,b:b};}
  function ciclohexano(){var a=[],b=[];for(var i=0;i<6;i++){var f=i*Math.PI/3,up=i%2===0,z=up?.25:-.25;a.push({e:'C',p:[1.45*Math.cos(f),1.45*Math.sin(f),z]});}
    for(i=0;i<6;i++){f=i*Math.PI/3;up=i%2===0;z=up?.25:-.25;var sg=up?1:-1;a.push({e:'H',p:[1.45*Math.cos(f),1.45*Math.sin(f),z+sg*1.09]});
      a.push({e:'H',p:[1.45*Math.cos(f)+1.09*.943*Math.cos(f),1.45*Math.sin(f)+1.09*.943*Math.sin(f),z-sg*1.09*.334]});b.push([i,(i+1)%6]);b.push([i,6+2*i]);b.push([i,7+2*i]);}return {a:a,b:b};}
  var MOL={metano:{n:'Metano',f:'CH₄',g:metano(),t:'Carbono <b>sp³</b>: tetraédrico, los cuatro enlaces C−H forman ángulos de <b>109,5°</b>.'},
    etano:{n:'Etano',f:'C₂H₆',g:etano(),t:'Dos carbonos <b>sp³</b> unidos por un enlace σ simple que puede girar. Cada carbono es un tetraedro (109,5°).'},
    eteno:{n:'Eteno',f:'C₂H₄',g:eteno(),t:'Carbonos <b>sp²</b>: la molécula es <b>plana</b> con ángulos de unos <b>120°</b>. El doble enlace (σ + π) no gira.'},
    etino:{n:'Etino',f:'C₂H₂',g:etino(),t:'Carbonos <b>sp</b>: la molécula es <b>lineal</b> (180°), con un triple enlace (una σ y dos π).'},
    benceno:{n:'Benceno',f:'C₆H₆',g:benceno(),t:'Seis carbonos <b>sp²</b> en un anillo <b>plano</b> con ángulos de 120° y todos los enlaces C−C iguales (1,40 Å).'},
    ciclohexano:{n:'Ciclohexano (silla)',f:'C₆H₁₂',g:ciclohexano(),t:'Seis carbonos <b>sp³</b>: el anillo no es plano sino una <b>silla</b>, sin tensión, con 109,5° en cada carbono. Hay H axiales (arriba/abajo) y ecuatoriales.'}};
  var k='metano',ry=.6,rx=-.35,auto=true,drag=null;
  var c1=fila(box);pildoras(c1,Object.keys(MOL).map(function(x){return [x,MOL[x].n];}),k,function(x){k=x;ry=.6;rx=-.35;A.dibujar();});
  var c2=fila(box);var bA=boton(c2,'⏸ Girar solo',function(b){auto=!auto;b.textContent=auto?'⏸ Girar solo':'▶ Girar solo';A.play();});
  var msg=nota(box,'');
  L.cv.style.cursor='grab';
  L.cv.addEventListener('pointerdown',function(e){drag={x:e.clientX,y:e.clientY};L.cv.setPointerCapture(e.pointerId);auto=false;bA.textContent='▶ Girar solo';});
  L.cv.addEventListener('pointermove',function(e){if(!drag)return;ry+=(e.clientX-drag.x)*.012;rx+=(e.clientY-drag.y)*.012;drag={x:e.clientX,y:e.clientY};A.dibujar();});
  ['pointerup','pointercancel'].forEach(function(n){L.cv.addEventListener(n,function(){drag=null;});});
  function paso(dt){
    if(auto&&!drag)ry+=dt*.7;
    var W=L.W,H=L.H,m=MOL[k],G=m.g,s=Math.min(W,H*1.55)/(k==='benceno'?7.3:k==='ciclohexano'?7:6.6);
    ctx.clearRect(0,0,W,H);ctx.fillStyle='#f8fbff';ctx.fillRect(0,0,W,H);
    var cy=Math.cos(ry),sy=Math.sin(ry),cx=Math.cos(rx),sx=Math.sin(rx);
    var P=G.a.map(function(a){var x=a.p[0],y=a.p[1],z=a.p[2],x1=x*cy+z*sy,z1=-x*sy+z*cy,y1=y*cx-z1*sx,z2=y*sx+z1*cx;var f=1/(1-z2*.06);return {x:W/2+x1*s*f,y:H/2+y1*s*f,z:z2,f:f,e:a.e};});
    var items=[];G.b.forEach(function(b){var p=P[b[0]],q=P[b[1]];items.push({z:(p.z+q.z)/2,b:[p,q]});});P.forEach(function(p){items.push({z:p.z,a:p});});
    items.sort(function(u,v){return u.z-v.z;});
    items.forEach(function(it){
      if(it.b){var p=it.b[0],q=it.b[1];ctx.lineCap='round';ctx.strokeStyle='#64748b';ctx.lineWidth=Math.max(3,s*.12*(p.f+q.f)/2);ctx.beginPath();ctx.moveTo(p.x,p.y);ctx.lineTo(q.x,q.y);ctx.stroke();
        if(k==='eteno'&&p.e==='C'&&q.e==='C'||k==='etino'&&p.e==='C'&&q.e==='C'){var dx=q.y-p.y,dy=p.x-q.x,d=Math.hypot(dx,dy)||1;dx=dx/d*s*.13;dy=dy/d*s*.13;ctx.strokeStyle='#cbd5e1';ctx.lineWidth=2;(k==='etino'?[1,-1]:[1]).forEach(function(sg){ctx.beginPath();ctx.moveTo(p.x+dx*sg,p.y+dy*sg);ctx.lineTo(q.x+dx*sg,q.y+dy*sg);ctx.stroke();});}}
      else{var a=it.a,r=s*RAD[a.e]*.62*a.f;bola(ctx,a.x,a.y,r,COL[a.e]==='#e2e8f0'?'#cbd5e1':COL[a.e]);}});
    txt(ctx,m.n+' · '+m.f,12,22,'#0d2d42','800 15px "Outfit",sans-serif');txt(ctx,'gris = carbono · claro = hidrógeno · arrastra para girar',12,H-10,'#64748b','700 11px sans-serif');
    msg.innerHTML=m.t;
  }
  var A=animar(L,paso);
};

/* ── 6. Energía de la reacción: exotérmica, endotérmica y catalizador (reacciones.html) ──
   Perfil de energía de tres reacciones orgánicas. La bolita es un choque entre moléculas: su
   energía se sortea según la temperatura; si alcanza la energía de activación (Ea) supera la
   barrera y reacciona, si no, vuelve a los reactivos. ΔH son valores reales aproximados (en fase
   gaseosa, salvo la combustión, con H₂O líquida); las Ea y la energía de los choques son
   ILUSTRATIVAS (a escala didáctica) para que la diferencia se vea. */
SIMX.energia=function(box){
  var RX={
    hidro:{n:'Hidrogenación del eteno',r:'C₂H₄ + H₂',p:'C₂H₆',dH:-137,Ea:180,Ec:45,
      cat:'níquel o platino',
      t:'Es una <b>adición</b>: el H₂ se rompe sobre la superficie del metal y se suma al doble enlace. Sin catalizador la barrera es altísima; con Ni o Pt baja mucho.'},
    deshid:{n:'Deshidratación del etanol',r:'CH₃CH₂OH',p:'C₂H₄ + H₂O',dH:45,Ea:210,Ec:150,
      cat:'ácido sulfúrico',
      t:'Es una <b>eliminación</b>: sale una molécula de agua y aparece el doble enlace. Como es endotérmica, hay que calentar de forma continua: si se deja de calentar, la reacción se frena.'},
    comb:{n:'Combustión del metano',r:'CH₄ + 2 O₂',p:'CO₂ + 2 H₂O',dH:-890,Ea:240,Ec:120,
      cat:'platino',
      t:'Es una <b>oxidación</b> por radicales. Aunque libera muchísima energía, necesita una chispa que aporte la Ea para empezar; después el propio calor liberado mantiene la reacción.'}
  };
  var L=lienzo(box,0.62,'Perfil de energía de una reacción: barrera de activación, diferencia de energía entre reactivos y productos, y choques de moléculas que la superan o no'),ctx=L.ctx;
  var k='hidro',cat=false,TC=25,Yc={};
  var c1=fila(box);
  pildoras(c1,[['hidro','Hidrogenación (exotérmica)'],['deshid','Deshidratación (endotérmica)'],['comb','Combustión (exotérmica)']],k,function(q){k=q;reiniciar();});
  var c2=fila(box);
  var bC=boton(c2,'Catalizador: no',function(b){cat=!cat;b.classList.toggle('on',cat);b.textContent='Catalizador: '+(cat?'sí ('+RX[k].cat+')':'no');reiniciar();});
  var rg=deslizador(c2,'Temperatura',25,225,5,TC,function(v){TC=v;return v+' °C';});
  rg.addEventListener('input',function(){reiniciar();});
  var bR=boton(c2,'↺ Reiniciar conteo',function(){reiniciar();});
  var msg=nota(box,'');
  function sdo(x){x=(x-.2)/.6;return x<=0?0:x>=1?1:x*x*(3-2*x);}
  function pico(x){var u=(x-.5)/.16;return Math.exp(-u*u);}
  function curva(dH,Ea){var key=dH+'_'+Ea;if(Yc[key])return Yc[key];
    function mk(h){var a=[];for(var i=0;i<=200;i++){var x=i/200;a.push(dH*sdo(x)+h*pico(x));}return a;}
    function mx(a){var m=-1e9;a.forEach(function(v){if(v>m)m=v;});return m;}
    var lo=0,hi=6*Ea;for(var n=0;n<40;n++){var mid=(lo+hi)/2;if(mx(mk(mid))<Ea)lo=mid;else hi=mid;}
    return (Yc[key]=mk((lo+hi)/2));}
  var i,dir,stop,exito,espera,E,att,ok;
  function Ea(){var r=RX[k];return cat?r.Ec:r.Ea;}
  function Y(){var r=RX[k];return curva(r.dH,Ea());}
  function nuevo(){var Em=60*(TC+273)/298;E=-Em*Math.log(1-Math.random());if(E>400)E=400;att++;
    i=0;dir=1;exito=E>=Ea();
    if(exito)stop=200;else{var a=Y();stop=0;for(var j=0;j<=100;j++){if(a[j]>=E){stop=j;break;}}}}
  function reiniciar(){bC.textContent='Catalizador: '+(cat?'sí ('+RX[k].cat+')':'no');att=0;ok=0;espera=0;nuevo();A&&A.dibujar();}
  function flecha(x,y1,y2,c,etq,lado){ctx.strokeStyle=c;ctx.fillStyle=c;ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(x,y1);ctx.lineTo(x,y2);ctx.stroke();
    var d=y2>y1?-1:1;[[y1,-d],[y2,d]].forEach(function(p){ctx.beginPath();ctx.moveTo(x,p[0]);ctx.lineTo(x-5,p[0]+p[1]*9);ctx.lineTo(x+5,p[0]+p[1]*9);ctx.closePath();ctx.fill();});
    var f='800 '+Math.max(11,Math.round(L.W*.02))+'px "Outfit",sans-serif',izq=(lado||8)<0;ctx.font=f;var w=ctx.measureText(etq).width,tx=x+(lado||8),ty=(y1+y2)/2+4;
    ctx.fillStyle='rgba(248,251,255,.88)';ctx.fillRect(izq?tx-w-3:tx-3,ty-Math.round(L.W*.02),w+6,Math.round(L.W*.026));
    txt(ctx,etq,tx,ty,c,f,izq?'right':'left');}
  function paso(dt){
    var r=RX[k],a=Y(),a0=curva(r.dH,r.Ea);
    if(espera>0){espera-=dt;if(espera<=0)nuevo();}
    else{var v=(exito?70:55)*dt;i+=dir*v;
      if(dir===1&&i>=stop){i=stop;if(exito){ok++;espera=1.1;}else dir=-1;}
      else if(dir===-1&&i<=0){i=0;espera=.2;}}
    var W=L.W,H=L.H,x0=W*.1,pw=W*.86,y0=H*.88,ph=H*.74,rango=Math.max(r.Ea,0)-Math.min(0,r.dH),yMin=Math.min(0,r.dH)-rango*.12,yMax=r.Ea+rango*.12;
    function PX(ii){return x0+ii/200*pw;}function PY(e){return y0-(e-yMin)/(yMax-yMin)*ph;}
    var fs=Math.max(10,Math.round(W*.017));
    ctx.clearRect(0,0,W,H);ctx.fillStyle='#f8fbff';ctx.fillRect(0,0,W,H);
    ctx.strokeStyle='#94a3b8';ctx.lineWidth=1.5;ctx.beginPath();ctx.moveTo(x0,H*.06);ctx.lineTo(x0,y0);ctx.lineTo(x0+pw,y0);ctx.stroke();
    txt(ctx,'Energía',4,H*.05,'#475569','700 '+fs+'px sans-serif','left');
    txt(ctx,'Avance de la reacción →',x0+pw,y0+Math.round(fs*1.9),'#475569','700 '+fs+'px sans-serif','right');
    txt(ctx,r.n,x0+pw,H*.05,'#0d2d42','800 '+Math.round(fs*1.15)+'px "Outfit",sans-serif','right');
    /* nivel de los reactivos (referencia) */
    ctx.setLineDash([5,4]);ctx.strokeStyle='#64748b';ctx.lineWidth=1.2;ctx.beginPath();ctx.moveTo(x0,PY(0));ctx.lineTo(x0+pw,PY(0));ctx.stroke();ctx.setLineDash([]);
    /* energía del choque actual */
    if(espera<=0||!exito){ctx.setLineDash([2,4]);ctx.strokeStyle='#f59e0b';ctx.lineWidth=1.5;ctx.beginPath();ctx.moveTo(x0,PY(E));ctx.lineTo(x0+pw,PY(E));ctx.stroke();ctx.setLineDash([]);}
    /* curva sin catalizador (si hay catalizador, queda tenue) */
    if(cat){ctx.setLineDash([6,4]);ctx.strokeStyle='#94a3b8';ctx.lineWidth=2;ctx.beginPath();a0.forEach(function(e,j){j?ctx.lineTo(PX(j),PY(e)):ctx.moveTo(PX(j),PY(e));});ctx.stroke();ctx.setLineDash([]);}
    ctx.strokeStyle='#2563eb';ctx.lineWidth=3;ctx.beginPath();a.forEach(function(e,j){j?ctx.lineTo(PX(j),PY(e)):ctx.moveTo(PX(j),PY(e));});ctx.stroke();
    /* flechas de Ea y ΔH */
    flecha(PX(100),PY(0),PY(Ea()),'#c2410c','Ea ≈ '+Ea()+' kJ/mol',9);
    var xd=PX(188);flecha(xd,PY(0),PY(r.dH),r.dH<0?'#15803d':'#7c3aed','ΔH = '+(r.dH>0?'+':'−')+Math.abs(r.dH)+' kJ/mol',-8);
    /* formulas */
    txt(ctx,r.r,PX(16),PY(0)-8,'#0d2d42','800 '+fs+'px "Outfit",sans-serif','left');
    txt(ctx,r.p,PX(200)-4,PY(r.dH)+(r.dH<0?Math.round(fs*1.7):-8),'#0d2d42','800 '+fs+'px "Outfit",sans-serif','right');
    /* bolita (choque) */
    var bx=PX(i),by=PY(a[Math.round(i)]),rad=Math.max(7,W*.013);
    bola(ctx,bx,by-rad,rad,exito&&i>=198?'#16a34a':'#f59e0b');
    if(exito&&espera>0){var c=r.dH<0?'#dc2626':'#2563eb';txt(ctx,r.dH<0?'🔥 sale calor al entorno':'❄ toma calor del entorno',PX(200)-4,y0-Math.round(fs*.6)-(r.dH<0?0:Math.round(ph*.1)),c,'800 '+fs+'px "Outfit",sans-serif','right');}
    var pc=att?Math.round(100*ok/att):0;
    var exo=r.dH<0;
    msg.innerHTML='<b>'+(exo?'Exotérmica (ΔH &lt; 0)':'Endotérmica (ΔH &gt; 0)')+'</b>: '+(exo?'los productos quedan con <b>menos</b> energía que los reactivos y la diferencia sale al entorno como calor.':'los productos quedan con <b>más</b> energía que los reactivos: el sistema la toma del entorno.')+
      ' '+r.t+'<br>Choques: <b>'+att+'</b> · lograron reaccionar: <b>'+ok+'</b> ('+pc+' %). La línea punteada naranja es la energía del choque: solo reacciona si pasa por encima de la barrera. '+
      (cat?'<br>El <b>catalizador</b> ('+r.cat+') baja la Ea de '+r.Ea+' a '+r.Ec+' kJ/mol por otro camino de reacción, pero <b>ΔH no cambia</b>: no hace la reacción «más exotérmica».':'<br>Sube la temperatura: más choques superan la barrera y la reacción es más rápida, pero <b>ΔH sigue igual</b>.')+
      '<br><small>ΔH: valores reales aproximados. Ea y energía de los choques: a escala ilustrativa.</small>';
  }
  var A=null;att=0;ok=0;espera=0;nuevo();
  A=animar(L,paso);
};

/* ── 7. Laboratorio virtual de pruebas químicas (grupos.html) ──────────────
   Cada reactivo se agrega a una muestra y se ve el resultado en el tubo. Dos modos:
   «Explorar» (eliges muestra y reactivo) y «Muestra misteriosa» (la muestra está oculta:
   haces pruebas, anotas en la bitácora y decides qué tipo de compuesto es).
   Resultados de libro de texto a temperatura ambiente o con baño de agua; son un MODELO. */
SIMX.pruebas=function(box){
  var st=document.createElement('style');st.textContent='.sx select{font:700 .85rem inherit;font-family:inherit;border:1.5px solid #94a3b8;border-radius:10px;padding:7px 10px;min-height:34px;background:#fff;color:#0d2d42;max-width:100%}'+
    '.sx .sx-log{margin-top:8px;overflow-x:auto}.sx .sx-log table{border-collapse:collapse;font-size:.82rem;width:100%}.sx .sx-log th,.sx .sx-log td{border:1px solid #cbd5e1;padding:5px 8px;text-align:left}.sx .sx-log th{background:#f1f5f9}'+
    '.sx .sx-log .p{color:#15803d;font-weight:800}.sx .sx-log .n{color:#b91c1c;font-weight:800}.sx .sx-log .a{color:#64748b}';
  document.head.appendChild(st);
  var AG='#e0f2fe';
  var MU={al1:{n:'Etanol',t:'Alcohol primario',c:AG},al2:{n:'Propan-2-ol',t:'Alcohol secundario',c:AG},al3:{n:'2-metilpropan-2-ol',t:'Alcohol terciario',c:AG},
    fen:{n:'Fenol',t:'Fenol',c:AG},ald:{n:'Etanal',t:'Aldehído alifático',c:AG},bza:{n:'Benzaldehído',t:'Aldehído aromático',c:AG},cet:{n:'Propanona',t:'Cetona',c:AG},
    aci:{n:'Ácido etanoico (vinagre)',t:'Ácido carboxílico',c:AG},glu:{n:'Glucosa',t:'Azúcar reductor',c:AG},sac:{n:'Sacarosa (azúcar de mesa)',t:'Azúcar no reductor',c:AG},
    alm:{n:'Almidón (maicena)',t:'Almidón',c:'#f1f5f9',turb:1},pro:{n:'Clara de huevo',t:'Proteína',c:'#fef3c7'},lip:{n:'Aceite vegetal',t:'Lípido',c:'#fcd34d'}};
  var KS=Object.keys(MU),ORG=['al1','al2','al3','fen','ald','bza','cet','aci'];
  var RE={
    tollens:{n:'Tollens',f:'Ag(NH₃)₂⁺ en medio básico',nota:'baño de agua tibia',base:'#e5e7eb',ef:'espejo',pos:['ald','bza','glu'],
      tp:'Espejo de plata en la pared del tubo: el aldehído se oxida a ácido carboxílico y el Ag⁺ se reduce a plata metálica (RCHO + 2 Ag⁺ → RCOOH + 2 Ag).',
      tn:'Sin espejo: la muestra no tiene un grupo aldehído libre que reduzca el Ag⁺.',
      ov:{cet:'Sin espejo: las cetonas no se oxidan con un oxidante tan suave. Por eso Tollens distingue aldehídos de cetonas.',sac:'Sin espejo: en la sacarosa los dos azúcares están unidos por sus extremos reductores, así que no hay aldehído libre.'},
      op:{glu:'Espejo de plata: la glucosa, en su forma abierta, tiene un grupo aldehído. Es un azúcar reductor.'}},
    fehling:{n:'Fehling',f:'Cu²⁺ con tartrato en medio básico',nota:'se calienta suavemente',base:'#1d4ed8',ef:'ppt',cp:'#b91c1c',pos:['ald','glu'],
      tp:'Precipitado rojo ladrillo de Cu₂O: el aldehído se oxida y el Cu²⁺ (azul) se reduce a Cu⁺.',
      tn:'Sigue azul: no hay un aldehído alifático ni un azúcar reductor que reduzca el Cu²⁺.',
      ov:{bza:'Sigue azul: los aldehídos aromáticos no reaccionan con Fehling (sí con Tollens). Así se distinguen unos de otros.',cet:'Sigue azul: las cetonas no reducen el Cu²⁺.',sac:'Sigue azul: la sacarosa no es azúcar reductor.'},
      op:{glu:'Precipitado rojo ladrillo: la glucosa reduce el Cu²⁺ a Cu₂O. Es un azúcar reductor.'}},
    benedict:{n:'Benedict',f:'Cu²⁺ con citrato y carbonato',nota:'se calienta en baño de agua',base:'#2563eb',ef:'ppt',cp:'#ea580c',pos:['glu','ald'],
      tp:'Precipitado naranja a rojo ladrillo de Cu₂O: los azúcares reductores reducen el Cu²⁺. Cuanto más azúcar, más rojizo.',
      tn:'Sigue azul: no hay azúcar reductor (ni aldehído alifático).',
      ov:{sac:'Sigue azul: la sacarosa no es reductora (sí lo sería después de hidrolizarla con ácido).',alm:'Sigue azul: el almidón tiene muy pocos extremos reductores y no alcanza a dar color.',bza:'Sigue azul: los aldehídos aromáticos no reducen el reactivo de Benedict.'}},
    bicarb:{n:'Bicarbonato de sodio',f:'NaHCO₃',nota:'',base:'#e5e7eb',ef:'burbujas',pos:['aci'],
      tp:'Burbujeo de CO₂: el ácido carboxílico cede H⁺ al bicarbonato (RCOOH + NaHCO₃ → RCOONa + H₂O + CO₂).',
      tn:'Sin burbujas: la muestra no es lo bastante ácida para desprender CO₂.',
      ov:{fen:'Sin burbujas: el fenol es ácido, pero mucho más débil que un ácido carboxílico y no desplaza al CO₂. Se reconoce con FeCl₃.'}},
    fecl3:{n:'Cloruro de hierro III',f:'FeCl₃',nota:'',base:'#fde047',ef:'color',cp:'#6d28d9',pos:['fen'],
      tp:'Color violeta intenso: el fenol forma un complejo con el ion Fe³⁺.',tn:'Sigue amarillo pálido (el color del propio FeCl₃): no hay un fenol.'},
    lugol:{n:'Lugol',f:'I₂ en KI',nota:'',base:'#d97706',ef:'color',cp:'#1e1b4b',pos:['alm'],
      tp:'Azul-negro: el yodo entra en la hélice del almidón y forma un complejo coloreado.',tn:'Sigue pardo-amarillo (el color del Lugol): no hay almidón.'},
    biuret:{n:'Biuret',f:'NaOH y CuSO₄ diluido',nota:'',base:'#60a5fa',ef:'color',cp:'#7c3aed',pos:['pro'],
      tp:'Violeta: el Cu²⁺ se une a los enlaces peptídicos, así que hay proteína.',tn:'Sigue azul: no hay enlaces peptídicos.'},
    sudan:{n:'Sudán III',f:'colorante liposoluble',nota:'',base:'#e5e7eb',ef:'gotas',pos:['lip'],ap:['glu','sac','alm','pro','lip'],
      tp:'Capa y gotas teñidas de rojo-naranja: el colorante se disuelve en grasas y aceites, no en el agua.',tn:'No se tiñe nada: el colorante no se disuelve en la parte acuosa.',
      na:'No aplica: el Sudán III también se disuelve en disolventes orgánicos y daría un falso positivo. Se usa en alimentos y muestras acuosas.'},
    dicr:{n:'Dicromato de potasio',f:'K₂Cr₂O₇ con ácido sulfúrico',nota:'',base:'#f97316',ef:'color',cp:'#15803d',pos:['al1','al2','ald','bza'],ap:['al1','al2','al3','ald','bza','cet','aci'],
      tp:'De naranja a verde: el alcohol primario o secundario, o el aldehído, se oxida y el Cr⁶⁺ se reduce a Cr³⁺.',tn:'Sigue naranja: la muestra no se oxida con facilidad.',
      ov:{al3:'Sigue naranja: el alcohol terciario no tiene H en el carbono del −OH y no se oxida.',cet:'Sigue naranja: las cetonas no se oxidan con facilidad.'},
      na:'No aplica: con fenoles, azúcares y proteínas el dicromato da oxidaciones complicadas. Se usa para alcoholes y compuestos carbonílicos.'},
    lucas:{n:'Lucas',f:'ZnCl₂ en HCl concentrado',nota:'a temperatura ambiente',base:'#e5e7eb',ef:'turbio',pos:['al3','al2'],ap:ORG,
      tp:'Se enturbia: el alcohol pasa a cloruro de alquilo, que no se disuelve en el reactivo.',tn:'Sin turbidez: el alcohol primario casi no forma carbocatión a temperatura ambiente.',
      op:{al3:'Turbidez inmediata: el alcohol terciario forma con facilidad el carbocatión y pasa a cloruro de alquilo.',al2:'Turbidez lenta (en la práctica, unos 5 minutos): el alcohol secundario forma el carbocatión más despacio.'},
      ov:{fen:'Sin cambio: el fenol no reacciona con el reactivo de Lucas.',ald:'Sin cambio: no es un alcohol.',bza:'Sin cambio: no es un alcohol.',cet:'Sin cambio: no es un alcohol.',aci:'Sin cambio: no es un alcohol.'},
      na:'No aplica: esta prueba es para distinguir alcoholes en muestras orgánicas.'}};
  var ORD=['tollens','fehling','benedict','bicarb','fecl3','lugol','biuret','sudan','dicr','lucas'];
  function res(r,s){var R=RE[r];
    if(R.ap&&R.ap.indexOf(s)<0)return {e:'na',t:R.na};
    if(R.pos.indexOf(s)>=0)return {e:'pos',t:(R.op&&R.op[s])||R.tp};
    return {e:'neg',t:(R.ov&&R.ov[s])||R.tn};}
  var L=lienzo(box,0.5,'Dos tubos de ensayo: la muestra sola y el resultado después de agregar el reactivo'),ctx=L.ctx;
  var modo='explorar',sel='al1',oculta=null,cur=null,t=0,log={},burb=[],fin=false;
  var c1=fila(box);
  pildoras(c1,[['explorar','Explorar'],['misterio','🕵️ Muestra misteriosa']],modo,function(k){modo=k;if(k==='misterio')nueva();else{sel=sel||'al1';reiniciar();}ui();});
  var sMu=el('select',{'aria-label':'Muestra'});KS.forEach(function(k){sMu.appendChild(el('option',{value:k},MU[k].n));});sMu.value=sel;
  sMu.addEventListener('change',function(){sel=sMu.value;reiniciar();});c1.appendChild(sMu);
  var bN=boton(c1,'🎲 Nueva muestra',function(){nueva();});
  var c2=fila(box);c2.appendChild(el('span',{class:'sx-rng'},'<span>Reactivo:</span>'));
  var pr=el('div',{class:'sx-seg',role:'group','aria-label':'Reactivos'});c2.appendChild(pr);
  ORD.forEach(function(k){var b=el('button',{type:'button'},RE[k].n);b.dataset.k=k;pr.appendChild(b);});
  pr.addEventListener('click',function(e){var b=e.target.closest('button');if(!b||fin&&modo==='misterio')return;probar(b.dataset.k);});
  var c3=fila(box);var sT=el('select',{'aria-label':'Tipo de compuesto'});sT.appendChild(el('option',{value:''},'¿Qué tipo de compuesto es?'));
  KS.forEach(function(k){sT.appendChild(el('option',{value:k},MU[k].t));});c3.appendChild(sT);
  var bC=boton(c3,'✔ Comprobar',function(){comprobar();});
  var msg=nota(box,'Elige una muestra y un reactivo para ver qué pasa en el tubo.');
  var lg=el('div',{class:'sx-log'});box.appendChild(lg);
  function nombre(){return modo==='misterio'?'Muestra ?':MU[sel].n;}
  function muestra(){return modo==='misterio'?oculta:sel;}
  function ui(){sMu.style.display=modo==='explorar'?'':'none';bN.style.display=modo==='misterio'?'':'none';c3.style.display=modo==='misterio'?'':'none';pintaLog();}
  function nueva(){oculta=KS[Math.floor(Math.random()*KS.length)];fin=false;sT.value='';reiniciar();msg.innerHTML='Hay una <b>muestra misteriosa</b>. Prueba los reactivos que quieras y anota: ¿qué tipo de compuesto es? Escoge la respuesta y pulsa «Comprobar».';}
  function reiniciar(){log={};cur=null;t=0;burb=[];pintaLog();if(modo==='explorar')msg.innerHTML='Elige un reactivo para agregarlo a <b>'+MU[sel].n+'</b>.';A&&A.dibujar();}
  function probar(r){cur=r;t=0;burb=[];var o=res(r,muestra());log[r]=o.e;pintaLog();A.play();
    var R=RE[r];msg.innerHTML='<b>'+R.n+'</b> ('+R.f+')'+(R.nota?' · '+R.nota:'')+' sobre <b>'+nombre()+'</b>: '+(o.e==='pos'?'<b style="color:#15803d">positiva</b>. ':o.e==='neg'?'<b style="color:#b91c1c">negativa</b>. ':'<b>no aplica</b>. ')+o.t;}
  function pintaLog(){var h='<table><thead><tr><th>Reactivo</th><th>Resultado</th></tr></thead><tbody>',n=0;
    ORD.forEach(function(r){if(log[r]){n++;h+='<tr><td>'+RE[r].n+'</td><td class="'+(log[r]==='pos'?'p':log[r]==='neg'?'n':'a')+'">'+(log[r]==='pos'?'(+) positiva':log[r]==='neg'?'(−) negativa':'— no aplica')+'</td></tr>';}});
    lg.innerHTML=n?'<div style="font-weight:800;margin:4px 0 2px">📒 Bitácora de '+nombre()+'</div>'+h+'</tbody></table>':'';}
  function comprobar(){if(!sT.value){msg.innerHTML='Primero escoge un tipo de compuesto en la lista.';return;}
    fin=true;var ok=sT.value===oculta,M=MU[oculta];
    var pos=ORD.filter(function(r){return res(r,oculta).e==='pos';}).map(function(r){return RE[r].n;});
    msg.innerHTML=(ok?'✅ <b>¡Correcto!</b> ':'❌ <b>No era ese.</b> ')+'La muestra era <b>'+M.n+'</b> ('+M.t.toLowerCase()+'). '+(pos.length?'Da positivas: '+pos.join(', ')+'.':'No da positiva ninguna de estas pruebas: se reconoce por descarte.')+' Pulsa «Nueva muestra» para otra.';}
  /* dibujo */
  function tubo(cx,top,w,h,liq,o){
    var r=w/2,yb=top+h-r,nivel=top+h*.30;
    function trazo(){ctx.beginPath();ctx.moveTo(cx-r,top);ctx.lineTo(cx-r,yb);ctx.arc(cx,yb,r,Math.PI,0,true);ctx.lineTo(cx+r,top);}
    ctx.save();trazo();ctx.closePath();ctx.clip();
    ctx.fillStyle=liq;ctx.fillRect(cx-r,nivel,w,top+h-nivel);
    if(o.turb){ctx.fillStyle='rgba(248,250,252,'+(.88*o.turb)+')';ctx.fillRect(cx-r,nivel,w,top+h-nivel);}
    if(o.ppt){ctx.fillStyle=o.ppt;var hh=h*.16*Math.min(1,o.pk);ctx.beginPath();ctx.ellipse(cx,top+h-hh*.45,r*.95,hh,0,0,PI2);ctx.fill();ctx.fillRect(cx-r,top+h-hh,w,hh);}
    if(o.espejo){var g=ctx.createLinearGradient(cx-r,0,cx+r,0);g.addColorStop(0,'rgba(248,250,252,'+o.espejo+')');g.addColorStop(.4,'rgba(100,116,139,'+o.espejo+')');g.addColorStop(1,'rgba(226,232,240,'+o.espejo+')');
      ctx.strokeStyle=g;ctx.lineWidth=14;ctx.beginPath();ctx.moveTo(cx-r+6,nivel);ctx.lineTo(cx-r+6,yb);ctx.arc(cx,yb,r-6,Math.PI,0,true);ctx.lineTo(cx+r-6,nivel);ctx.stroke();}
    if(o.gotas){ctx.fillStyle='rgba(239,68,68,'+o.gotas+')';ctx.fillRect(cx-r,nivel,w,h*.07);for(var i=0;i<5;i++){circ(ctx,cx-r*.6+i*r*.3,nivel+h*.18+(i%2)*h*.12,r*.14,'rgba(239,68,68,'+o.gotas+')');}}
    ctx.restore();
    ctx.strokeStyle='#475569';ctx.lineWidth=3;trazo();ctx.stroke();
    ctx.strokeStyle='rgba(255,255,255,.7)';ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(cx-r+6,top+8);ctx.lineTo(cx-r+6,yb-4);ctx.stroke();}
  function paso(dt){
    t=Math.min(1,t+dt/2.2);var W=L.W,H=L.H,w=Math.min(W*.14,82),top=H*.2,h=H*.62,s=muestra(),M=MU[s]||MU.al1,fs=Math.max(11,Math.round(W*.02));
    ctx.clearRect(0,0,W,H);ctx.fillStyle='#f8fbff';ctx.fillRect(0,0,W,H);
    var x1=W*.27,x2=W*.73;
    txt(ctx,nombre(),x1,H*.1,'#0d2d42','800 '+(fs+1)+'px "Outfit",sans-serif','center');
    tubo(x1,top,w,h,modo==='misterio'?'#e2e8f0':M.c,{turb:(modo==='misterio'?0:(M.turb?1:0))});
    var o=cur?res(cur,s):null,R=cur?RE[cur]:null;
    txt(ctx,cur?R.n:'Reactivo',x2,H*.1,'#0d2d42','800 '+(fs+1)+'px "Outfit",sans-serif','center');
    /* flecha con gotero */
    ctx.strokeStyle='#94a3b8';ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(W*.4,H*.5);ctx.lineTo(W*.58,H*.5);ctx.stroke();ctx.beginPath();ctx.moveTo(W*.6,H*.5);ctx.lineTo(W*.56,H*.46);ctx.lineTo(W*.56,H*.54);ctx.closePath();ctx.fillStyle='#94a3b8';ctx.fill();
    txt(ctx,cur?'+ '+R.n:'+ reactivo',W*.5,H*.43,'#64748b','700 '+fs+'px sans-serif','center');
    if(cur&&R.nota)txt(ctx,'🔥 '+R.nota,W*.5,H*.6,'#c2410c','700 '+(fs-1)+'px sans-serif','center');
    if(!cur){tubo(x2,top,w,h,'rgba(226,232,240,.6)',{});txt(ctx,'elige un reactivo',x2,top+h*.55,'#94a3b8','700 '+fs+'px sans-serif','center');}
    else if(o.e==='na'){tubo(x2,top,w,h,'rgba(226,232,240,.6)',{});txt(ctx,'no aplica',x2,top+h*.55,'#64748b','800 '+fs+'px sans-serif','center');}
    else{var pos=o.e==='pos',op={},liq=R.base;
      if(pos&&R.ef==='color')liq=mezcla(R.base,R.cp,t);
      if(pos&&R.ef==='ppt')op.ppt=R.cp,op.pk=sm(.1,.9,t);
      if(pos&&R.ef==='espejo')op.espejo=sm(.2,1,t);
      if(pos&&R.ef==='gotas')op.gotas=sm(.1,.8,t);
      if(R.ef==='turbio')op.turb=pos?sm(0,1,cur==='lucas'&&s==='al2'?t*.55:t):0;
      if(R.ef==='ppt'&&!pos&&false)op={};
      tubo(x2,top,w,h,liq,op);
      if(pos&&R.ef==='burbujas'&&t>.1){if(Math.random()<.5)burb.push({x:x2+rnd(-w*.35,w*.35),y:top+h*.9,r:rnd(2,5),v:rnd(30,70)});
        burb.forEach(function(b){b.y-=b.v*dt;});burb=burb.filter(function(b){return b.y>top+h*.3;});
        burb.forEach(function(b){ctx.beginPath();ctx.arc(b.x,b.y,b.r,0,PI2);ctx.strokeStyle='rgba(30,64,175,.7)';ctx.lineWidth=1.5;ctx.stroke();});}
      txt(ctx,pos?'(+)':'(−)',x2,top+h+Math.round(fs*1.6),pos?'#15803d':'#b91c1c','800 '+(fs+4)+'px "Outfit",sans-serif','center');}
  }
  function mezcla(a,b,k){function h(x){var n=parseInt(x.slice(1),16);return [n>>16,n>>8&255,n&255];}var p=h(a),q=h(b);return 'rgb('+p.map(function(v,i){return Math.round(v+(q[i]-v)*k);}).join(',')+')';}
  var A=null;ui();A=animar(L,paso);
};

/* ── 8. Reacción pericíclica: Diels-Alder (reacciones.html) ────────────────
   1,3-butadieno + eteno → ciclohexeno, en un solo paso. Los enlaces se rompen y se forman
   a la vez en un estado de transición cíclico (seis electrones que se mueven en círculo):
   no hay radicales ni iones intermedios. MODELO: vista plana, sin los H. */
SIMX.diels=function(box){
  var L=lienzo(box,0.56,'Cicloadición de Diels-Alder: el butadieno y el eteno forman ciclohexeno en un solo paso, con un perfil de energía de una sola barrera'),ctx=L.ctx;
  var p=0,auto=false,flujo=true;
  var c1=fila(box);
  var rg=deslizador(c1,'Avance de la reacción',0,100,1,0,function(v){p=v/100;return Math.round(v)+' %';});
  rg.addEventListener('input',function(){auto=false;bA.textContent='▶ Animar';A.dibujar();});
  var bA=boton(c1,'▶ Animar',function(b){if(p>=.995){p=0;rg.value=0;rg._upd();}auto=!auto;b.textContent=auto?'⏸ Pausar':'▶ Animar';A.play();});
  boton(c1,'Flechas de electrones: sí',function(b){flujo=!flujo;b.textContent='Flechas de electrones: '+(flujo?'sí':'no');A.dibujar();});
  var msg=nota(box,'');
  /* átomos: [x, y, etiqueta]; y hacia abajo */
  function at(){var q=sm(.1,.9,p);
    return [[-1.5+.25*q,.15-.15*q,'CH₂'],[-.75,-.9,'CH'],[.75,-.9,'CH'],[1.5-.25*q,.15-.15*q,'CH₂'],
            [-.75,3.1-2.1*q,'CH₂'],[.75,3.1-2.1*q,'CH₂']];}
  /* enlaces: [a, b, orden inicial, orden final] */
  var EN=[[0,1,2,1],[1,2,1,2],[2,3,2,1],[4,5,2,1],[0,4,0,1],[3,5,0,1]];
  function paso(dt){
    if(auto){p=Math.min(1,p+dt/5);rg.value=Math.round(p*100);rg._upd();if(p>=1){auto=false;bA.textContent='▶ Animar';}}
    var W=L.W,H=L.H,mx=W*.33,my=H*.28,s=Math.min(W*.17,H*.13),fs=Math.max(11,Math.round(W*.02));
    ctx.clearRect(0,0,W,H);ctx.fillStyle='#f8fbff';ctx.fillRect(0,0,W,H);
    var A_=at();function X(i){return mx+A_[i][0]*s;}function Y(i){return my+A_[i][1]*s;}
    txt(ctx,'Vista plana (sin dibujar los H)',W*.02,H-8,'#64748b','700 '+(fs-1)+'px sans-serif');
    /* enlaces */
    EN.forEach(function(e){var o=e[2]+(e[3]-e[2])*sm(.2,.8,p),x1=X(e[0]),y1=Y(e[0]),x2=X(e[1]),y2=Y(e[1]),dx=y2-y1,dy=x1-x2,d=Math.hypot(dx,dy)||1;dx=dx/d*s*.07;dy=dy/d*s*.07;
      function ln(a,ox,oy,dash){ctx.setLineDash(dash?[6,5]:[]);ctx.strokeStyle='rgba(13,45,66,'+a+')';ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(x1+ox,y1+oy);ctx.lineTo(x2+ox,y2+oy);ctx.stroke();ctx.setLineDash([]);}
      if(o<=1){if(o>.03)ln(o,0,0,o<.97);}
      else{var a2=o-1;ln(1,-dx,-dy,false);ln(Math.max(.15,a2),dx,dy,a2<.97);}
    });
    /* átomos */
    A_.forEach(function(a,i){var x=X(i),y=Y(i),r=s*.27;ctx.beginPath();ctx.arc(x,y,r,0,PI2);ctx.fillStyle='#fff';ctx.fill();ctx.strokeStyle='#475569';ctx.lineWidth=2;ctx.stroke();
      txt(ctx,a[2],x,y+4,'#0d2d42','800 '+Math.max(10,Math.round(s*.2))+'px "Outfit",sans-serif','center');});
    /* nombres */
    if(p<.5){txt(ctx,'1,3-butadieno (diene)',mx,my-s*1.3,'#0f766e','800 '+fs+'px "Outfit",sans-serif','center');
      txt(ctx,'eteno (dienófilo)',mx,Y(4)+s*.75,'#9a3412','800 '+fs+'px "Outfit",sans-serif','center');}
    if(p>.9)txt(ctx,'ciclohexeno',mx,Y(4)+s*.75,'#0d2d42','800 '+(fs+2)+'px "Outfit",sans-serif','center');
    /* flechas de electrones */
    if(flujo&&p>.08&&p<.92){var k=sm(.08,.3,p)*(1-sm(.72,.92,p));
      function mid(i,j){return [(X(i)+X(j))/2,(Y(i)+Y(j))/2];}
      function arco(a,b,dx,dy){var u=mid(a[0],a[1]),v=mid(b[0],b[1]);ctx.strokeStyle='rgba(220,38,38,'+k+')';ctx.fillStyle=ctx.strokeStyle;ctx.lineWidth=2.5;
        var cxp=(u[0]+v[0])/2+dx*s,cyp=(u[1]+v[1])/2+dy*s;ctx.beginPath();ctx.moveTo(u[0],u[1]);ctx.quadraticCurveTo(cxp,cyp,v[0],v[1]);ctx.stroke();
        var ang=Math.atan2(v[1]-cyp,v[0]-cxp);ctx.beginPath();ctx.moveTo(v[0],v[1]);ctx.lineTo(v[0]-9*Math.cos(ang-.45),v[1]-9*Math.sin(ang-.45));ctx.lineTo(v[0]-9*Math.cos(ang+.45),v[1]-9*Math.sin(ang+.45));ctx.closePath();ctx.fill();}
      arco([0,1],[1,2],-.2,-.5);arco([2,3],[3,5],.55,.1);arco([4,5],[0,4],-.45,.1);
      txt(ctx,'seis electrones se mueven a la vez',mx,Y(4)+s*.75,'rgba(220,38,38,'+k+')','800 '+fs+'px "Outfit",sans-serif','center');}
    /* perfil de energía: una sola barrera */
    var gx=W*.66,gw=W*.31,gy=H*.8,gh=H*.52;
    ctx.strokeStyle='#94a3b8';ctx.lineWidth=1.5;ctx.beginPath();ctx.moveTo(gx,gy-gh-8);ctx.lineTo(gx,gy);ctx.lineTo(gx+gw,gy);ctx.stroke();
    txt(ctx,'Energía',gx,gy-gh-12,'#475569','700 '+(fs-1)+'px sans-serif');txt(ctx,'avance →',gx+gw,gy+fs*1.6,'#475569','700 '+(fs-1)+'px sans-serif','right');
    function E(q){return .62*Math.exp(-Math.pow((q-.45)/.17,2))-.22*sm(.2,.8,q);}
    var base=gy-gh*.45;ctx.strokeStyle='#2563eb';ctx.lineWidth=3;ctx.beginPath();for(var q=0;q<=1.001;q+=.01){var xx=gx+gw*q,yy=base-E(q)*gh*1.1;q?ctx.lineTo(xx,yy):ctx.moveTo(xx,yy);}ctx.stroke();
    circ(ctx,gx+gw*p,base-E(p)*gh*1.1,7,'#dc2626');
    txt(ctx,'un solo paso',gx+gw*.45,base-.62*gh*1.1-12,'#0d2d42','800 '+(fs-1)+'px "Outfit",sans-serif','center');
    msg.innerHTML=(p<.25?'<b>Reactivos.</b> El 1,3-butadieno (diene, cuatro carbonos con dos dobles enlaces) y el eteno (dienófilo, un doble enlace) se acercan.':p<.75?'<b>Estado de transición cíclico.</b> Los enlaces π se están rompiendo y los σ nuevos se están formando <b>al mismo tiempo</b>: los seis electrones giran en un anillo. No hay radicales ni iones.':'<b>Producto.</b> Ciclohexeno: se formaron dos enlaces σ nuevos (C−C) y el doble enlace quedó en el centro del antiguo diene. Todo en un solo paso.')+
      '<br><small>Es una cicloadición [4+2] (cuatro electrones del diene y dos del dienófilo). Es exotérmica (ΔH ≈ −170 kJ/mol) y necesita una barrera de unos 115 kJ/mol; ambos valores aproximados.</small>';
  }
  var A=animar(L,paso);
};

function iniciar(){document.querySelectorAll('[data-simx]').forEach(function(b){if(b.dataset.listo)return;b.dataset.listo='1';b.classList.add('sx');
  if(!b.getAttribute('data-pantalla'))b.setAttribute('data-pantalla',b.getAttribute('data-titulo')||'la simulación');
  var f=SIMX[b.dataset.simx];if(f)try{f(b);}catch(e){b.innerHTML='<p>No se pudo iniciar la simulación.</p>';if(window.console)console.error(e);}});
  if(window.PANTALLA_MONTAR)window.PANTALLA_MONTAR();}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',iniciar);else iniciar();
window.SIMX=SIMX;
})();
