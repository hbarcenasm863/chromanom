/* ═══ ChromaNom — simulaciones nuevas (simx.js)
   Cada página pone <div data-simx="nombre" data-titulo="…"></div> y este archivo arma el canvas,
   los controles y la animación (con botón de pantalla completa de pantalla.js):
   - destilacion    (ambiente.html)   torre de destilación fraccionada del petróleo
   - polimero       (ambiente.html)   polimerización por adición del etileno
   - sn2            (reacciones.html) ataque por la espalda e inversión del carbono
   - conformaciones (cadenas.html)    proyección de Newman y energía del giro
   - molecula3d     (carbono.html)    moléculas en 3D que se giran con el dedo
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

function iniciar(){document.querySelectorAll('[data-simx]').forEach(function(b){if(b.dataset.listo)return;b.dataset.listo='1';b.classList.add('sx');
  if(!b.getAttribute('data-pantalla'))b.setAttribute('data-pantalla',b.getAttribute('data-titulo')||'la simulación');
  var f=SIMX[b.dataset.simx];if(f)try{f(b);}catch(e){b.innerHTML='<p>No se pudo iniciar la simulación.</p>';if(window.console)console.error(e);}});
  if(window.PANTALLA_MONTAR)window.PANTALLA_MONTAR();}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',iniciar);else iniciar();
window.SIMX=SIMX;
})();
