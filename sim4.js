/* ═══════════════════════════════════════════════════════════════════════
   ChromaNom — simulaciones en canvas de la Fase 4
   Cada página pone un <div class="sim" data-sim="nombre"></div> y este
   archivo arma el canvas, los controles y la animación:
   - enlaceH2     (orbitales.html)    dos H que se acercan: nube y energía
   - evaporacion  (propiedades.html)  moléculas que se atraen y se evaporan
   - enzima       (biomoleculas.html) enzimas, sustrato y temperatura
   - invernadero  (ambiente.html)     fotones, suelo y moléculas de CO₂
   - adn, traduccion, jabon (biomoleculas.html) doble hélice y replicación;
                  transcripción y traducción con ARNm y ARNt; micelas de jabón
   Comunes: se ajustan al ancho de la pantalla, se pausan solas cuando no
   se ven (IntersectionObserver), arrancan en pausa si el sistema pide
   «reducir movimiento» y se pueden manejar con el dedo o el mouse.
   Son MODELOS: simplifican la realidad para mostrar la idea central.
   ═══════════════════════════════════════════════════════════════════════ */
(function(){
'use strict';
var PI2=Math.PI*2;
function el(tag,attrs,html){var x=document.createElement(tag);for(var k in attrs||{})x.setAttribute(k,attrs[k]);if(html!=null)x.innerHTML=html;return x;}
function coma(v,d){return v.toFixed(d).replace('.',',');}
function rnd(a,b){return a+Math.random()*(b-a);}
function gauss(){return (Math.random()+Math.random()+Math.random()-1.5)*1.15;}

/* Canvas nítido en cualquier pantalla y animación que solo corre si se ve. */
function lienzo(box,ratio,alt){
  var cv=el('canvas',{role:'img','aria-label':alt||'Simulación'});cv.className='sim-cv';box.appendChild(cv);
  var ctx=cv.getContext('2d'),o={cv:cv,ctx:ctx,W:0,H:0};
  o.size=function(){var dpr=Math.min(window.devicePixelRatio||1,2),full=box.classList.contains('en-pantalla'),w=full?Math.max(280,Math.min(box.clientWidth-40,1500,Math.round((window.innerHeight-150)/ratio))):Math.max(280,Math.min(box.clientWidth||640,900));
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
  pedir();
  return {get corre(){return corre;},alternar:function(){corre=!corre;if(corre)pedir();return corre;},dibujar:pedir,play:function(){corre=true;pedir();}};
}
function botonPausa(A,cont){var b=el('button',{type:'button',class:'btn-sm'},A.corre?'⏸ Pausar':'▶ Animar');
  b.addEventListener('click',function(){b.textContent=A.alternar()?'⏸ Pausar':'▶ Animar';});cont.appendChild(b);return b;}
function fila(box){var f=el('div',{class:'sim-ctl'});box.appendChild(f);return f;}
function deslizador(cont,etq,min,max,paso,val,fn){var l=el('label',{class:'sim-rng'});l.innerHTML='<span>'+etq+'</span>';
  var r=el('input',{type:'range',min:min,max:max,step:paso,value:val});var v=el('b');l.appendChild(r);l.appendChild(v);cont.appendChild(l);
  function upd(){v.textContent=fn(+r.value);}r.addEventListener('input',upd);upd();return r;}
function pildoras(cont,ops,ini,fn){var s=el('div',{class:'seg',role:'group'});ops.forEach(function(o){var b=el('button',{type:'button'},o[1]);b.dataset.k=o[0];if(o[0]===ini)b.classList.add('on');s.appendChild(b);});
  s.addEventListener('click',function(e){var b=e.target.closest('button');if(!b)return;s.querySelectorAll('button').forEach(function(x){x.classList.toggle('on',x===b);});fn(b.dataset.k);});cont.appendChild(s);return s;}
function nota(box,html){var n=el('div',{class:'sim-msg','aria-live':'polite'},html);box.appendChild(n);return n;}

var SIM={};

/* ── 1. Dos átomos de hidrógeno que se acercan ───────────────────────────
   Arriba: la nube electrónica, con la densidad (φA ± φB)² de dos orbitales
   1s (radio de Bohr 53 pm), dibujada con puntos al azar. Abajo: la curva
   de energía potencial. Enlazante: curva de Morse del H₂ (De = 436 kJ/mol,
   Re = 74 pm). Antienlazante: curva repulsiva aproximada. Al «soltar», los
   núcleos se mueven con la fuerza −dE/dR: el H₂ queda vibrando cerca de
   74 pm; con el orbital antienlazante los átomos se separan. */
SIM.enlaceH2=function(box){
  var L=lienzo(box,0.78,'Dos átomos de hidrógeno: nube electrónica arriba y curva de energía abajo'),ctx=L.ctx;
  var modo='enl',R=220,v=0,libre=false,arr=false,a0=53,De=436,Re=74,am=0.0194;
  function E(r){return modo==='enl'?De*(Math.pow(1-Math.exp(-am*(r-Re)),2)-1):De*0.95*Math.exp(-0.0125*(r-Re));}
  var c1=fila(box);
  pildoras(c1,[['enl','σ enlazante (φA + φB)'],['anti','σ* antienlazante (φA − φB)']],'enl',function(k){modo=k;v=0;A.dibujar();});
  var c2=fila(box);
  var rg=deslizador(c2,'Distancia entre núcleos',40,320,1,R,function(x){if(!libre)R=x;return Math.round(R)+' pm';});
  rg.addEventListener('input',function(){libre=false;v=0;R=+rg.value;A.dibujar();});
  var bS=el('button',{type:'button',class:'btn-sm prim'},'🫳 Soltar los átomos');c2.appendChild(bS);
  bS.addEventListener('click',function(){libre=true;v=0;A.play();});
  var msg=nota(box,'');
  L.cv.addEventListener('pointerdown',function(e){var p=L.pos(e),s=escala();if(Math.abs(p.x-(L.W/2+R/2*s))<26&&p.y<L.H*0.5){arr=true;libre=false;v=0;L.cv.setPointerCapture(e.pointerId);}});
  L.cv.addEventListener('pointermove',function(e){if(!arr)return;var p=L.pos(e),s=escala();R=Math.max(40,Math.min(320,(p.x-L.W/2)*2/s));rg.value=Math.round(R);rg.nextSibling.textContent=Math.round(R)+' pm';A.dibujar();});
  L.cv.addEventListener('pointerup',function(){arr=false;});
  function escala(){return L.W*0.8/420;}
  function dens(x,y,xa,xb){var ra=Math.hypot(x-xa,y),rb=Math.hypot(x-xb,y),fa=Math.exp(-ra/a0),fb=Math.exp(-rb/a0);var p=modo==='enl'?fa+fb:fa-fb;return p;}
  function paso(dt){
    if(libre&&dt>0){var h=0.5,sub=6;for(var i=0;i<sub;i++){var F=-(E(R+h)-E(R-h))/(2*h);v+=F/0.012*dt/sub;v*=Math.exp(-0.35*dt/sub);R+=v*dt/sub;
      if(R<38){R=38;v=Math.abs(v);}if(R>320){R=320;v=0;libre=false;}}rg.value=Math.round(R);rg.nextSibling.textContent=Math.round(R)+' pm';}
    var W=L.W,H=L.H,s=escala(),cx=W/2,cy=H*0.25,xa=-R/2,xb=R/2;
    ctx.clearRect(0,0,W,H);
    ctx.fillStyle='#f8fbff';ctx.fillRect(0,0,W,H*0.5);
    // nube: puntos al azar con probabilidad ∝ ψ²
    var max=modo==='enl'?Math.pow(1+Math.exp(-R/a0),2):1,n=0,t=0;
    while(n<950&&t<24000){t++;var x=rnd(-R/2-170,R/2+170),y=rnd(-140,140),p=dens(x,y,xa,xb);if(Math.random()*max<p*p){n++;
      ctx.fillStyle=modo==='enl'?'rgba(26,110,168,.6)':(p>0?'rgba(220,38,38,.5)':'rgba(180,83,9,.55)');ctx.fillRect(cx+x*s-1.3,cy+y*s*0.6-1.3,2.6,2.6);}}
    if(modo==='anti'){ctx.strokeStyle='#0d2d42';ctx.setLineDash([5,5]);ctx.beginPath();ctx.moveTo(cx,cy-70);ctx.lineTo(cx,cy+70);ctx.stroke();ctx.setLineDash([]);
      ctx.fillStyle='#991b1b';ctx.font='700 11px Outfit,sans-serif';ctx.textAlign='center';ctx.fillText('nodo: sin electrones',cx,cy+84);}
    [xa,xb].forEach(function(xn,i){ctx.beginPath();ctx.arc(cx+xn*s,cy,9,0,PI2);ctx.fillStyle='#0d2d42';ctx.fill();ctx.fillStyle='#fff';ctx.font='800 10px Outfit,sans-serif';ctx.textAlign='center';ctx.fillText('H',cx+xn*s,cy+3.5);
      if(i===1&&!libre){ctx.strokeStyle='rgba(13,45,66,.35)';ctx.beginPath();ctx.arc(cx+xn*s,cy,15,0,PI2);ctx.stroke();}});
    ctx.fillStyle='#0d2d42';ctx.font='600 11px Outfit,sans-serif';ctx.textAlign='left';ctx.fillText('Arrastra el núcleo de la derecha o usa el control',10,16);
    // curva de energía
    var gx=50,gy=H*0.56,gw=W-70,gh=H*0.4,Rmin=30,Rmax=330,Emin=-480,Emax=520,X=function(r){return gx+(r-Rmin)/(Rmax-Rmin)*gw;},Y=function(e){return gy+(Emax-e)/(Emax-Emin)*gh;};
    ctx.strokeStyle='#cbd5e1';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(gx,Y(0));ctx.lineTo(gx+gw,Y(0));ctx.stroke();
    ctx.strokeStyle='#64748b';ctx.beginPath();ctx.moveTo(gx,gy);ctx.lineTo(gx,gy+gh);ctx.lineTo(gx+gw,gy+gh);ctx.stroke();
    ctx.fillStyle='#475569';ctx.font='10px Outfit,sans-serif';ctx.textAlign='right';[-400,0,400].forEach(function(e){ctx.fillText(String(e),gx-4,Y(e)+3);});
    ctx.textAlign='center';[50,100,150,200,250,300].forEach(function(r){ctx.fillText(r,X(r),gy+gh+12);});
    ctx.fillText('distancia entre núcleos (pm)',gx+gw/2,gy+gh+24);
    ctx.save();ctx.translate(12,gy+gh/2);ctx.rotate(-Math.PI/2);ctx.fillText('energía (kJ/mol)',0,0);ctx.restore();
    ctx.strokeStyle=modo==='enl'?'#1a6ea8':'#dc2626';ctx.lineWidth=2.5;ctx.beginPath();
    for(var r=Rmin;r<=Rmax;r+=2){var e=Math.max(Emin,Math.min(Emax,E(r)));if(r===Rmin)ctx.moveTo(X(r),Y(e));else ctx.lineTo(X(r),Y(e));}ctx.stroke();
    var eR=E(R);ctx.beginPath();ctx.arc(X(R),Y(Math.max(Emin,Math.min(Emax,eR))),7,0,PI2);ctx.fillStyle='#f59e0b';ctx.fill();ctx.strokeStyle='#fff';ctx.lineWidth=2;ctx.stroke();
    if(modo==='enl'){ctx.setLineDash([3,4]);ctx.strokeStyle='#94a3b8';ctx.beginPath();ctx.moveTo(X(Re),Y(-De));ctx.lineTo(X(Re),gy+gh);ctx.stroke();ctx.setLineDash([]);ctx.fillStyle='#1a6ea8';ctx.textAlign='left';ctx.fillText('mínimo: 74 pm, −436 kJ/mol',X(Re)+6,Y(-De)+4);}
    msg.innerHTML='R = <b>'+Math.round(R)+' pm</b> · energía ≈ <b>'+Math.round(eR)+' kJ/mol</b>. '+(modo==='enl'
      ?(eR<-300?'Los electrones se concentran <b>entre</b> los núcleos y los atraen a los dos: la energía es mínima cerca de 74 pm. Si sueltas los átomos ahí, quedan <b>vibrando</b>: es el enlace H−H.':R<60?'Demasiado cerca: los núcleos se repelen y la energía sube.':'Acércalos o suéltalos: la energía baja al formarse el enlace.')
      :'Con el orbital antienlazante la energía es siempre mayor que la de los átomos separados (0): los electrones se alejan del centro (nodo) y los núcleos se repelen. Suéltalos: <b>se separan</b>.');
  }
  var A=animar(L,paso);botonPausa(A,c2);
};

/* ── 2. Evaporación: moléculas que se atraen ─────────────────────────────
   Dinámica molecular sencilla en 2D (potencial de Lennard-Jones recortado,
   unidades reducidas, un poco de gravedad para que el líquido quede abajo
   y un termostato que lleva la energía cinética a la temperatura elegida).
   La «intensidad de la atracción» de cada sustancia es un parámetro del
   modelo: crece de London (propano) a dipolo-dipolo (etanal) a puentes de
   hidrógeno (etanol, agua). Las moléculas con menos de 2 vecinas cercanas
   se cuentan como «vapor». */
SIM.evaporacion=function(box){
  var L=lienzo(box,0.62,'Moléculas de un líquido que se atraen; al calentar, algunas escapan al vapor'),ctx=L.ctx;
  var SUST={propano:{e:0.45,c:'#64748b',n:'Propano (London)',hb:false},etanal:{e:0.8,c:'#b45309',n:'Etanal (dipolo-dipolo)',hb:false},etanol:{e:1.25,c:'#1a6ea8',n:'Etanol (puentes de H)',hb:true},agua:{e:1.6,c:'#0891b2',n:'Agua (puentes de H)',hb:true}};
  var sk='etanal',T0=0.55,Lx=22,Ly=14,N=64,P=[],g=0.12,rc=2.4;
  function iniciar(){P=[];var k=0;for(var j=0;k<N;j++)for(var i=0;i<10&&k<N;i++,k++)P.push({x:2+i*1.12+(j%2)*0.5,y:Ly-1-j*1.0,vx:gauss()*0.4,vy:gauss()*0.4});}
  iniciar();
  var c1=fila(box);pildoras(c1,Object.keys(SUST).map(function(k){return [k,SUST[k].n];}),sk,function(k){sk=k;A.dibujar();});
  var c2=fila(box);
  deslizador(c2,'Temperatura',0.2,1.4,0.05,T0,function(x){T0=x;return x<0.4?'fría':x<0.8?'tibia':x<1.1?'caliente':'muy caliente';});
  var bR=el('button',{type:'button',class:'btn-sm'},'↺ Reiniciar');c2.appendChild(bR);bR.addEventListener('click',function(){iniciar();A.dibujar();});
  var msg=nota(box,'');var hist=[];
  function fuerzas(){var e=SUST[sk].e,n=P.length,i,j;for(i=0;i<n;i++){P[i].ax=0;P[i].ay=g;}
    for(i=0;i<n;i++)for(j=i+1;j<n;j++){var dx=P[j].x-P[i].x,dy=P[j].y-P[i].y,r2=dx*dx+dy*dy;if(r2>rc*rc)continue;if(r2<0.64)r2=0.64;
      var s6=1/(r2*r2*r2),f=24*e*(2*s6*s6-s6)/r2;dx*=f;dy*=f;P[i].ax-=dx;P[i].ay-=dy;P[j].ax+=dx;P[j].ay+=dy;}}
  function paso(dt){
    if(dt>0){var sub=Math.round(dt/0.004);sub=Math.max(2,Math.min(14,sub));var h=0.004*1.6;fuerzas();
      for(var k=0;k<sub;k++){P.forEach(function(p){p.vx+=p.ax*h/2;p.vy+=p.ay*h/2;p.x+=p.vx*h;p.y+=p.vy*h;
          if(p.x<0.5){p.x=0.5;p.vx=Math.abs(p.vx);}if(p.x>Lx-0.5){p.x=Lx-0.5;p.vx=-Math.abs(p.vx);}if(p.y<0.5){p.y=0.5;p.vy=Math.abs(p.vy);}if(p.y>Ly-0.5){p.y=Ly-0.5;p.vy=-Math.abs(p.vy);}});
        fuerzas();var ke=0;P.forEach(function(p){p.vx+=p.ax*h/2;p.vy+=p.ay*h/2;var v=p.vx*p.vx+p.vy*p.vy;if(v>40){var c=Math.sqrt(40/v);p.vx*=c;p.vy*=c;}ke+=p.vx*p.vx+p.vy*p.vy;});
        var T=ke/(2*P.length),lam=Math.sqrt(1+0.02*(T0/Math.max(T,1e-3)-1));P.forEach(function(p){p.vx*=lam;p.vy*=lam;});}}
    var W=L.W,H=L.H,s=Math.min(W/Lx,H/Ly),ox=(W-Lx*s)/2,oy=(H-Ly*s)/2,su=SUST[sk];
    ctx.clearRect(0,0,W,H);ctx.fillStyle='#f8fbff';ctx.fillRect(ox,oy,Lx*s,Ly*s);ctx.strokeStyle='#94a3b8';ctx.strokeRect(ox,oy,Lx*s,Ly*s);
    var vapor=0,vec=P.map(function(){return 0;});
    for(var i=0;i<P.length;i++)for(var j=i+1;j<P.length;j++){var dx=P[j].x-P[i].x,dy=P[j].y-P[i].y,r=Math.hypot(dx,dy);if(r<1.6){vec[i]++;vec[j]++;
      if(su.hb&&r<1.25){ctx.strokeStyle='rgba(26,110,168,.6)';ctx.setLineDash([3,3]);ctx.beginPath();ctx.moveTo(ox+P[i].x*s,oy+P[i].y*s);ctx.lineTo(ox+P[j].x*s,oy+P[j].y*s);ctx.stroke();ctx.setLineDash([]);}}}
    P.forEach(function(p,i){var vap=vec[i]<2;if(vap)vapor++;ctx.beginPath();ctx.arc(ox+p.x*s,oy+p.y*s,s*0.42,0,PI2);ctx.fillStyle=vap?'#fbbf24':su.c;ctx.globalAlpha=vap?0.9:0.85;ctx.fill();ctx.globalAlpha=1;});
    var pct=Math.round(vapor/P.length*100);hist.push(pct);if(hist.length>120)hist.shift();var prom=Math.round(hist.reduce(function(a,b){return a+b;},0)/hist.length);
    ctx.fillStyle='#0d2d42';ctx.font='700 12px Outfit,sans-serif';ctx.textAlign='left';ctx.fillText('En el vapor: '+prom+' %',ox+8,oy+18);
    ctx.fillStyle='#b45309';ctx.font='11px Outfit,sans-serif';ctx.fillText('● amarillo = molécula que escapó al vapor',ox+8,oy+34);
    msg.innerHTML='<b>'+su.n+'</b>: '+(su.hb?'las líneas punteadas son puentes de hidrógeno entre moléculas vecinas. ':'')+'a la misma temperatura, cuanto más fuerte es la atracción, <b>menos</b> moléculas escapan al vapor: hay que calentar más para hervir. Compara las cuatro sustancias a la misma temperatura.';
  }
  var A=animar(L,paso);botonPausa(A,c2);
};

/* ── 3. Enzimas en acción ────────────────────────────────────────────────
   Enzimas (con un sitio activo en forma de muesca) y moléculas de sacarosa
   que se mueven al azar. Si una sacarosa entra al sitio activo de una enzima
   activa, se hidroliza en glucosa + fructosa. La temperatura acelera el
   movimiento (más choques), pero por encima de unos 42 °C las enzimas se
   desnaturalizan poco a poco y pierden el sitio activo. Modelo cualitativo. */
SIM.enzima=function(box){
  var L=lienzo(box,0.6,'Enzimas que rompen sacarosa en glucosa y fructosa; la temperatura cambia la rapidez'),ctx=L.ctx;
  var T=37,E=[],S=[],Pr=[],tiempo=0,serie=[],cuenta=0;
  function iniciar(){E=[];S=[];Pr=[];tiempo=0;serie=[];cuenta=0;for(var i=0;i<5;i++)E.push({x:0.15+0.17*i,y:0.35+0.3*(i%2),a:rnd(0,PI2),va:rnd(-0.4,0.4),ok:true,ocup:0});
    for(i=0;i<55;i++)S.push({x:rnd(0.05,0.95),y:rnd(0.1,0.9),vx:0,vy:0});}
  iniciar();
  var c1=fila(box);
  deslizador(c1,'Temperatura',0,80,1,T,function(x){T=x;return x+' °C';});
  var bA=el('button',{type:'button',class:'btn-sm'},'➕ Más sacarosa');c1.appendChild(bA);bA.addEventListener('click',function(){for(var i=0;i<12;i++)S.push({x:rnd(0.05,0.95),y:rnd(0.1,0.9),vx:0,vy:0});});
  var bR=el('button',{type:'button',class:'btn-sm'},'↺ Enzimas nuevas');c1.appendChild(bR);bR.addEventListener('click',function(){iniciar();A.dibujar();});
  var msg=nota(box,'');
  function paso(dt){
    var W=L.W,H=L.H,ar=W/H,vel=0.012+0.007*T;
    if(dt>0){tiempo+=dt;
      E.forEach(function(e){e.a+=e.va*dt;if(e.ocup>0){e.ocup-=dt;if(e.ocup<=0){var dx=Math.cos(e.a),dy=Math.sin(e.a);Pr.push({x:e.x+dx*0.06,y:e.y+dy*0.06*ar,vx:dx*0.08,vy:dy*0.08,t:'g'},{x:e.x+dx*0.07,y:e.y+dy*0.08*ar,vx:dx*0.05-dy*0.05,vy:dy*0.05+dx*0.05,t:'f'});cuenta++;}}
        if(e.ok&&T>42&&Math.random()<(T-42)*0.03*dt)e.ok=false;});
      S.forEach(function(s){s.vx+=gauss()*vel*dt*6;s.vy+=gauss()*vel*dt*6;s.vx*=0.9;s.vy*=0.9;var sp=Math.hypot(s.vx,s.vy),mx=vel*1.6;if(sp>mx){s.vx*=mx/sp;s.vy*=mx/sp;}
        s.x+=s.vx*dt;s.y+=s.vy*dt*ar;if(s.x<0.02||s.x>0.98)s.vx*=-1;if(s.y<0.04||s.y>0.96)s.vy*=-1;s.x=Math.max(0.02,Math.min(0.98,s.x));s.y=Math.max(0.04,Math.min(0.96,s.y));});
      Pr.forEach(function(p){p.vx+=gauss()*vel*dt*6;p.vy+=gauss()*vel*dt*6;p.vx*=0.92;p.vy*=0.92;p.x+=p.vx*dt;p.y+=p.vy*dt*ar;if(p.x<0.02||p.x>0.98)p.vx*=-1;if(p.y<0.04||p.y>0.96)p.vy*=-1;p.x=Math.max(0.02,Math.min(0.98,p.x));p.y=Math.max(0.04,Math.min(0.96,p.y));});
      if(Pr.length>140)Pr.splice(0,Pr.length-140);
      for(var i=S.length-1;i>=0;i--){var s=S[i];for(var k=0;k<E.length;k++){var e=E[k];if(!e.ok||e.ocup>0)continue;var dxs=(s.x-e.x)*W,dys=(s.y-e.y)*H,dd=Math.hypot(dxs,dys),Rr=Math.min(W,H)*0.075,dang=Math.atan2(dys,dxs)-e.a;dang=Math.atan2(Math.sin(dang),Math.cos(dang));
        if(dd<Rr*1.3&&Math.abs(dang)<0.95){S.splice(i,1);e.ocup=0.45;break;}}}
      if(!serie.length||tiempo-serie[serie.length-1][0]>0.5){serie.push([tiempo,cuenta]);if(serie.length>40)serie.shift();}}
    ctx.clearRect(0,0,W,H);ctx.fillStyle='#f0fdf4';ctx.fillRect(0,0,W,H);
    var R=Math.min(W,H)*0.075;
    E.forEach(function(e){var x=e.x*W,y=e.y*H;ctx.save();ctx.translate(x,y);ctx.rotate(e.a);ctx.beginPath();
      if(e.ok){ctx.moveTo(0,0);ctx.arc(0,0,R,0.45,PI2-0.45);ctx.closePath();ctx.fillStyle=e.ocup>0?'#7c3aed':'#8b5cf6';}
      else{for(var t=0;t<=PI2+0.01;t+=0.3){var rr=R*(0.75+0.25*Math.sin(t*5+1));ctx.lineTo(Math.cos(t)*rr,Math.sin(t)*rr);}ctx.fillStyle='#a8a29e';}
      ctx.fill();if(e.ocup>0){ctx.fillStyle='#16a34a';ctx.beginPath();ctx.arc(R*0.55,-4,5,0,PI2);ctx.fill();ctx.fillStyle='#eab308';ctx.beginPath();ctx.arc(R*0.55,5,5,0,PI2);ctx.fill();}
      ctx.restore();});
    S.forEach(function(s){var x=s.x*W,y=s.y*H;ctx.fillStyle='#16a34a';ctx.beginPath();ctx.arc(x-4,y,5,0,PI2);ctx.fill();ctx.fillStyle='#eab308';ctx.beginPath();ctx.arc(x+4,y,5,0,PI2);ctx.fill();});
    Pr.forEach(function(p){ctx.fillStyle=p.t==='g'?'#16a34a':'#eab308';ctx.globalAlpha=.75;ctx.beginPath();ctx.arc(p.x*W,p.y*H,4,0,PI2);ctx.fill();ctx.globalAlpha=1;});
    // gráfica de productos en el tiempo
    var gw=Math.min(170,W*0.34),gh=60,gx=W-gw-10,gy=10;ctx.fillStyle='rgba(255,255,255,.92)';ctx.fillRect(gx,gy,gw,gh+18);ctx.strokeStyle='#cbd5e1';ctx.strokeRect(gx,gy,gw,gh+18);
    ctx.fillStyle='#0d2d42';ctx.font='700 10px Outfit,sans-serif';ctx.textAlign='left';ctx.fillText('Sacarosas hidrolizadas: '+cuenta,gx+6,gy+12);
    if(serie.length>1){var t0=serie[0][0],t1=serie[serie.length-1][0],c0=serie[0][1],c1v=Math.max(c0+1,serie[serie.length-1][1]);ctx.strokeStyle='#7c3aed';ctx.lineWidth=2;ctx.beginPath();
      serie.forEach(function(p,i){var x=gx+6+(p[0]-t0)/Math.max(1e-3,t1-t0)*(gw-12),y=gy+gh+12-(p[1]-c0)/(c1v-c0)*(gh-6);if(i)ctx.lineTo(x,y);else ctx.moveTo(x,y);});ctx.stroke();ctx.lineWidth=1;}
    var act=E.filter(function(e){return e.ok;}).length,rap=0;if(serie.length>4){var a=serie[Math.max(0,serie.length-17)],b=serie[serie.length-1];rap=(b[1]-a[1])/(b[0]-a[0]);}
    msg.innerHTML='Enzimas activas: <b>'+act+' de '+E.length+'</b> · rapidez ≈ <b>'+coma(rap,1)+'</b> sacarosas por segundo. '+(T<15?'En frío las moléculas se mueven despacio y chocan poco con el sitio activo.':T<=42?'Cerca de 37 °C (la temperatura del cuerpo) las enzimas trabajan bien.':act<E.length?'Por encima de unos 42 °C las enzimas se <b>desnaturalizan</b> (en gris): pierden la forma de su sitio activo y ya no funcionan, aunque las moléculas se muevan más rápido. Pulsa «Enzimas nuevas» para empezar de nuevo.':'A esta temperatura las enzimas empiezan a desnaturalizarse: espera unos segundos y observa.');
  }
  var A=animar(L,paso);botonPausa(A,c1);
};

/* ── 4. Efecto invernadero ───────────────────────────────────────────────
   Fotones de luz solar (amarillos) atraviesan el aire y calientan el suelo.
   El suelo emite infrarrojo (rojo) con una rapidez ∝ T⁴. Las moléculas de
   CO₂ absorben infrarrojo y lo reemiten en cualquier dirección: parte
   vuelve al suelo. Sin CO₂ el modelo se equilibra cerca de −18 °C, la
   temperatura que tendría la Tierra sin efecto invernadero. Es un modelo
   cualitativo: muestra la tendencia, no el valor real de cada año. Con el
   vapor de agua (fijo) y CO₂ de 280 a 420 ppm se calibró para quedar cerca
   de 13–15 °C; sin vapor ni CO₂ se equilibra cerca de −18 °C. */
var VAPOR=22,RADIO_IR=15,VEL_INV=2.2,DIV_CO2=80;
SIM.invernadero=function(box){
  var L=lienzo(box,0.62,'Modelo del efecto invernadero: luz solar, infrarrojo y moléculas de CO₂'),ctx=L.ctx;
  var ppm=420,Tk=285,F=[],M=[],V=[],acc=0,acs=0,esc=0,vuelve=0,rate0=16,sol=16,RC=RADIO_IR;
  for(var iv=0;iv<VAPOR;iv++)V.push({x:(iv+0.5)/VAPOR+rnd(-0.03,0.03),y:rnd(0.55,0.8),ex:0});
  function moleculas(){var n=Math.round(ppm/DIV_CO2);while(M.length<n)M.push({x:rnd(0.04,0.96),y:rnd(0.12,0.7),ex:0,a:rnd(0,PI2)});M.length=n;}
  moleculas();
  var c1=fila(box);
  deslizador(c1,'CO₂ en el aire',0,1000,10,ppm,function(x){ppm=x;moleculas();return x+' ppm'+(x===280?' (año 1800)':x===420?' (hoy)':'');});
  var conVapor=true;pildoras(c1,[['si','💧 Con vapor de agua'],['no','Sin vapor de agua']],'si',function(k){conVapor=k==='si';A.dibujar();});
  var bR=el('button',{type:'button',class:'btn-sm'},'↺ Reiniciar contadores');c1.appendChild(bR);bR.addEventListener('click',function(){esc=0;vuelve=0;});
  var msg=nota(box,'');
  function paso(dt){
    var W=L.W,H=L.H,suelo=H*0.84;
    if(dt>0){var k=dt*VEL_INV;
      acs+=sol*k;while(acs>=1){acs--;F.push({x:rnd(0.02,0.98)*W,y:0,vx:0,vy:240,t:'s'});}
      acc+=rate0*Math.pow(Tk/255,4)*k;while(acc>=1){acc--;var an=rnd(-1,1);F.push({x:rnd(0.02,0.98)*W,y:suelo-2,vx:Math.sin(an)*190,vy:-Math.cos(an)*190,t:'i',cd:0});Tk-=0.12;}
      for(var i=F.length-1;i>=0;i--){var f=F[i];f.x+=f.vx*k;f.y+=f.vy*k;if(f.cd)f.cd-=k;
        if(f.x<0)f.x+=W;if(f.x>W)f.x-=W;
        if(f.y>=suelo){Tk+=0.12;if(f.t==='i')vuelve++;F.splice(i,1);continue;}
        if(f.y<0&&f.vy<0){if(f.t==='i')esc++;F.splice(i,1);continue;}
        if(f.t==='i'&&!(f.cd>0)){var todas=conVapor?M.concat(V):M;for(var j=0;j<todas.length;j++){var m=todas[j];if(Math.hypot(f.x-m.x*W,f.y-m.y*H)<RC){var a=rnd(0,PI2);f.vx=Math.cos(a)*190;f.vy=Math.sin(a)*190;f.cd=0.25;m.ex=0.4;break;}}}}
      M.forEach(function(m){if(m.ex>0)m.ex-=dt;});V.forEach(function(m){if(m.ex>0)m.ex-=dt;});
      Tk=Math.max(200,Math.min(340,Tk));}
    ctx.clearRect(0,0,W,H);var gr=ctx.createLinearGradient(0,0,0,suelo);gr.addColorStop(0,'#0c4a6e');gr.addColorStop(1,'#7dd3fc');ctx.fillStyle=gr;ctx.fillRect(0,0,W,suelo);
    var tc=Tk-273.15,cs=tc<0?'#bae6fd':tc<20?'#86efac':tc<30?'#fde047':'#fb923c';ctx.fillStyle=cs;ctx.fillRect(0,suelo,W,H-suelo);
    ctx.fillStyle='#fde047';ctx.beginPath();ctx.arc(W*0.08,H*0.07,16,0,PI2);ctx.fill();
    M.forEach(function(m){var x=m.x*W,y=m.y*H,d=m.ex>0?Math.sin(performance.now()/30)*2.5:0;ctx.fillStyle='#ef4444';ctx.beginPath();ctx.arc(x-9-d,y,4.5,0,PI2);ctx.fill();ctx.beginPath();ctx.arc(x+9+d,y,4.5,0,PI2);ctx.fill();
      ctx.fillStyle='#1f2937';ctx.beginPath();ctx.arc(x,y,5,0,PI2);ctx.fill();if(m.ex>0){ctx.strokeStyle='rgba(254,202,202,.9)';ctx.beginPath();ctx.arc(x,y,13,0,PI2);ctx.stroke();}});
    if(conVapor)V.forEach(function(m){var x=m.x*W,y=m.y*H;ctx.fillStyle='#e2e8f0';ctx.beginPath();ctx.arc(x-6,y+4,3,0,PI2);ctx.arc(x+6,y+4,3,0,PI2);ctx.fill();ctx.fillStyle='#2563eb';ctx.beginPath();ctx.arc(x,y,4.5,0,PI2);ctx.fill();if(m.ex>0){ctx.strokeStyle='rgba(254,202,202,.9)';ctx.beginPath();ctx.arc(x,y,11,0,PI2);ctx.stroke();}});
    F.forEach(function(f){if(f.t==='s'){ctx.fillStyle='#fde047';ctx.fillRect(f.x-1.5,f.y-5,3,10);}else{ctx.strokeStyle='#f87171';ctx.lineWidth=2;ctx.beginPath();var ang=Math.atan2(f.vy,f.vx);for(var u=0;u<12;u++){var px=f.x-Math.cos(ang)*u,py=f.y-Math.sin(ang)*u+Math.sin(u*1.3)*2;if(u)ctx.lineTo(px,py);else ctx.moveTo(px,py);}ctx.stroke();ctx.lineWidth=1;}});
    ctx.fillStyle='rgba(255,255,255,.92)';ctx.fillRect(W-158,8,150,46);ctx.fillStyle='#0d2d42';ctx.font='800 15px Outfit,sans-serif';ctx.textAlign='left';ctx.fillText('Suelo: '+coma(tc,0)+' °C',W-150,28);
    ctx.font='10px Outfit,sans-serif';ctx.fillText('(temperatura del modelo)',W-150,44);
    ctx.fillStyle='#fff';ctx.font='700 11px Outfit,sans-serif';ctx.fillText('☀ luz solar',W*0.08+22,H*0.07+4);
    ctx.fillStyle='#fff';ctx.font='10px Outfit,sans-serif';ctx.fillText('● azul = vapor de agua · ● negro y rojo = CO₂',8,suelo-6);
    var tot=esc+vuelve;msg.innerHTML='CO₂: <b>'+ppm+' ppm</b> · del infrarrojo que sale del suelo, '+(tot>20?'<b>'+Math.round(vuelve/tot*100)+' %</b> vuelve al suelo':'…')+'. '+(ppm<40&&!conVapor?'Sin ningún gas de efecto invernadero casi todo el infrarrojo escapa al espacio: el suelo se enfría hasta cerca de −18 °C, la temperatura que tendría la Tierra sin efecto invernadero.':!conVapor?'Solo con CO₂ (sin vapor de agua) el efecto es más débil. El vapor de agua es el gas de efecto invernadero más abundante; el CO₂ que agregamos refuerza el efecto.':'Cada molécula de CO₂ absorbe infrarrojo y lo reemite en cualquier dirección: con más CO₂, más calor vuelve al suelo y la temperatura de equilibrio <b>sube</b>. Espera unos segundos después de mover el control.');
  }
  var A=animar(L,paso);botonPausa(A,c1);
  box._prueba=function(seg){for(var t=0;t<seg;t+=0.05)paso(0.05);return {T:Tk-273.15,ppm:ppm,vuelve:vuelve,esc:esc};};
};

/* ── 5. ADN: doble hélice y replicación ─────────────────────────────────
   Modo hélice: la doble hélice gira en 3D (proyección); cada peldaño es un
   par de bases (A−T con 2 puentes de hidrógeno, G−C con 3). Una vuelta
   completa tiene unos 10 pares (3,4 nm). Modo replicación: la hélice se
   «desenrolla» como escalera, la horquilla avanza y cada hebra vieja sirve
   de molde para una nueva (replicación semiconservativa). */
var COLB={A:'#ef4444',T:'#eab308',G:'#16a34a',C:'#2563eb'},COMP={A:'T',T:'A',G:'C',C:'G'};
SIM.adn=function(box){
  var L=lienzo(box,0.5,'Doble hélice de ADN que gira; se puede ver como escalera y replicar'),ctx=L.ctx;
  var sec='ATGCGTACCGATTGCAGC',rot=0,modo='helice',hor=0,nuevas=0,girar=true;
  var c1=fila(box);pildoras(c1,[['helice','🧬 Doble hélice 3D'],['replica','🪜 Replicación']],modo,function(k){modo=k;hor=0;nuevas=0;A.play();});
  var inp=el('input',{type:'text',value:sec,maxlength:24,'aria-label':'Secuencia de la hebra 5′→3′',style:'text-transform:uppercase;width:220px;min-height:44px;border:1.5px solid #d0e6f5;border-radius:9px;padding:6px 10px;font-family:JetBrains Mono,monospace'});
  var lab=el('label',{class:'sim-rng'},'<span>Hebra 5′→3′:</span>');lab.appendChild(inp);c1.appendChild(lab);
  inp.addEventListener('input',function(){var v=inp.value.toUpperCase().replace(/[^ATGC]/g,'');if(v.length>=4){sec=v;hor=0;nuevas=0;A.dibujar();}});
  var c2=fila(box);
  var bR=el('button',{type:'button',class:'btn-sm prim'},'▶ Replicar');c2.appendChild(bR);bR.addEventListener('click',function(){modo='replica';hor=0;nuevas=0;c1.querySelectorAll('.seg button').forEach(function(x){x.classList.toggle('on',x.dataset.k==='replica');});A.play();});
  var msg=nota(box,'');
  function paso(dt){
    var W=L.W,H=L.H,n=sec.length,mx=40,esp=(W-2*mx)/(n-1),cy=H*0.5;
    ctx.clearRect(0,0,W,H);ctx.fillStyle='#f8fafc';ctx.fillRect(0,0,W,H);
    var nGC=sec.split('').filter(function(b){return b==='G'||b==='C';}).length,ph=sec.split('').reduce(function(s,b){return s+(b==='G'||b==='C'?3:2);},0);
    if(modo==='helice'){if(dt>0)rot+=dt*0.9;var R=H*0.3;
      var pts=[];for(var i=0;i<n;i++){var th=i*Math.PI*2/10+rot;pts.push({x:mx+i*esp,y1:cy+R*Math.cos(th),y2:cy-R*Math.cos(th),z:Math.sin(th)});}
      // peldaños (pares de bases) detrás → delante
      var ord=pts.map(function(p,i){return i;}).sort(function(a,b){return pts[a].z-pts[b].z;});
      function hebra(k,col){ctx.strokeStyle=col;ctx.lineWidth=5;ctx.beginPath();for(var t=0;t<=(n-1)*8;t++){var u=t/8,th=u*Math.PI*2/10+rot,x=mx+u*esp,y=cy+(k?-1:1)*R*Math.cos(th);if(t)ctx.lineTo(x,y);else ctx.moveTo(x,y);}ctx.stroke();ctx.lineWidth=1;}
      hebra(0,'rgba(234,88,12,.9)');hebra(1,'rgba(14,116,144,.9)');
      ord.forEach(function(i){var p=pts[i],b=sec[i],c=COMP[b],ym=(p.y1+p.y2)/2,al=0.45+0.55*(p.z+1)/2;ctx.globalAlpha=al;ctx.lineWidth=6;
        ctx.strokeStyle=COLB[b];ctx.beginPath();ctx.moveTo(p.x,p.y1);ctx.lineTo(p.x,ym-2);ctx.stroke();ctx.strokeStyle=COLB[c];ctx.beginPath();ctx.moveTo(p.x,ym+2);ctx.lineTo(p.x,p.y2);ctx.stroke();ctx.lineWidth=1;
        if(Math.abs(p.y1-p.y2)>34){ctx.fillStyle='#0d2d42';ctx.font='800 10px Outfit,sans-serif';ctx.textAlign='center';ctx.fillText(b,p.x+8,p.y1+(p.y1<p.y2?10:-4));ctx.fillText(c,p.x+8,p.y2+(p.y2<p.y1?10:-4));}
        ctx.globalAlpha=1;});
      ctx.fillStyle='#ea580c';ctx.font='700 11px Outfit,sans-serif';ctx.textAlign='left';ctx.fillText('5′',mx-26,cy+R*Math.cos(rot)+4);ctx.fillText('3′',W-mx+8,cy+R*Math.cos((n-1)*Math.PI*2/10+rot)+4);
      ctx.fillStyle='#0e7490';ctx.fillText('3′',mx-26,cy-R*Math.cos(rot)+4);ctx.fillText('5′',W-mx+8,cy-R*Math.cos((n-1)*Math.PI*2/10+rot)+4);
      msg.innerHTML='Dos hebras <b>antiparalelas</b> (una va de 5′ a 3′ y la otra de 3′ a 5′) enrolladas en una <b>doble hélice</b>; el esqueleto es azúcar (desoxirribosa) y fosfato, y las bases quedan adentro. A siempre con T (2 puentes de hidrógeno) y G con C (3). Esta secuencia: '+n+' pares, '+Math.round(nGC/n*100)+' % de G−C, <b>'+ph+' puentes de hidrógeno</b>. Una vuelta completa tiene unos 10 pares de bases.';
    }else{
      if(dt>0){hor=Math.min(n,hor+dt*1.6);nuevas=Math.floor(hor);}
      var yA=cy-H*0.32,yB=cy+H*0.32,gap=H*0.1,f=hor;
      for(var i=0;i<n;i++){var x=mx+i*esp,b=sec[i],c=COMP[b];
        if(i>=f){ // aún cerrada: escalera
          var y1=cy-gap*1.4,y2=cy+gap*1.4;ctx.strokeStyle=COLB[b];ctx.lineWidth=6;ctx.beginPath();ctx.moveTo(x,y1);ctx.lineTo(x,cy-1);ctx.stroke();ctx.strokeStyle=COLB[c];ctx.beginPath();ctx.moveTo(x,cy+1);ctx.lineTo(x,y2);ctx.stroke();ctx.lineWidth=1;
          ctx.fillStyle='#ea580c';ctx.fillRect(x-esp/2,y1-6,esp,5);ctx.fillStyle='#0e7490';ctx.fillRect(x-esp/2,y2+1,esp,5);
          etq(b,x+7,y1+12);etq(c,x+7,y2-4);}
        else{ // abierta: dos hélices hijas
          var hn=i<nuevas;
          ctx.fillStyle='#ea580c';ctx.fillRect(x-esp/2,yA-6,esp,5);ctx.strokeStyle=COLB[b];ctx.lineWidth=6;ctx.beginPath();ctx.moveTo(x,yA);ctx.lineTo(x,yA+gap-1);ctx.stroke();etq(b,x+7,yA+12);
          if(hn){ctx.globalAlpha=0.75;ctx.strokeStyle=COLB[c];ctx.beginPath();ctx.moveTo(x,yA+gap+1);ctx.lineTo(x,yA+2*gap);ctx.stroke();ctx.fillStyle='#94a3b8';ctx.fillRect(x-esp/2,yA+2*gap,esp,5);etq(c,x+7,yA+2*gap-3);ctx.globalAlpha=1;}
          ctx.fillStyle='#0e7490';ctx.fillRect(x-esp/2,yB+1,esp,5);ctx.strokeStyle=COLB[c];ctx.beginPath();ctx.moveTo(x,yB);ctx.lineTo(x,yB-gap+1);ctx.stroke();etq(c,x+7,yB-4);
          if(hn){ctx.globalAlpha=0.75;ctx.strokeStyle=COLB[b];ctx.beginPath();ctx.moveTo(x,yB-gap-1);ctx.lineTo(x,yB-2*gap);ctx.stroke();ctx.fillStyle='#94a3b8';ctx.fillRect(x-esp/2,yB-2*gap-5,esp,5);etq(b,x+7,yB-2*gap+12);ctx.globalAlpha=1;}
          ctx.lineWidth=1;}}
      if(f<n){var xf=mx+f*esp;ctx.fillStyle='rgba(124,58,237,.85)';ctx.beginPath();ctx.moveTo(xf,cy-20);ctx.lineTo(xf+18,cy);ctx.lineTo(xf,cy+20);ctx.closePath();ctx.fill();ctx.fillStyle='#5b21b6';ctx.font='700 10px Outfit,sans-serif';ctx.textAlign='center';ctx.fillText('helicasa',xf,cy+34);}
      ctx.fillStyle='#334155';ctx.font='10px Outfit,sans-serif';ctx.textAlign='left';ctx.fillText('naranja/azul oscuro = hebras viejas · gris = hebras nuevas',8,H-8);
      msg.innerHTML=f<n?'La <b>helicasa</b> rompe los puentes de hidrógeno y abre la doble hélice. La <b>ADN polimerasa</b> lee cada hebra vieja y agrega nucleótidos complementarios (A frente a T, G frente a C).':'<b>Replicación terminada:</b> hay dos moléculas de ADN idénticas y cada una tiene una hebra vieja y una nueva. Por eso se dice que la replicación es <b>semiconservativa</b>. Así, cada célula hija recibe una copia exacta de la información.';
    }
    function etq(t,x,y){ctx.fillStyle='#0d2d42';ctx.font='800 10px Outfit,sans-serif';ctx.textAlign='left';ctx.fillText(t,x,y);}
  }
  var A=animar(L,paso);botonPausa(A,c2);
  box._prueba=function(seg){for(var t=0;t<seg;t+=0.05)paso(0.05);return {hor:hor,modo:modo};};
};

/* ── 6. Síntesis de proteínas: transcripción y traducción ───────────────
   Fase 1 (transcripción): la ARN polimerasa copia la hebra de ADN en ARNm
   (U en vez de T). Fase 2 (traducción): el ribosoma lee el ARNm de 3 en 3
   (codones). Cada ARNt trae su aminoácido y tiene el anticodón
   complementario; en el ribosoma se forma el ENLACE PEPTÍDICO entre la
   cadena que crece y el aminoácido nuevo; el ribosoma avanza un codón y el
   ARNt vacío sale. El codón de parada libera la proteína. Código genético
   estándar completo. */
var CODIGO=(function(){var b='UCAG',aa='FFLLSSSSYY**CC*WLLLLPPPPHHQQRRRRIIIMTTTTNNKKSSRRVVVVAAAADDEEGGGG',m={},k=0;
  for(var i=0;i<4;i++)for(var j=0;j<4;j++)for(var l=0;l<4;l++)m[b[i]+b[j]+b[l]]=aa[k++];return m;})();
var AA3={A:'Ala',R:'Arg',N:'Asn',D:'Asp',C:'Cys',Q:'Gln',E:'Glu',G:'Gly',H:'His',I:'Ile',L:'Leu',K:'Lys',M:'Met',F:'Phe',P:'Pro',S:'Ser',T:'Thr',W:'Trp',Y:'Tyr',V:'Val'};
var AACOL={M:'#7c3aed',A:'#0891b2',K:'#2563eb',F:'#ea580c',G:'#16a34a',W:'#be185d',L:'#0d9488',S:'#ca8a04',Y:'#9333ea',C:'#65a30d',R:'#1d4ed8',H:'#0369a1',E:'#dc2626',D:'#b91c1c',N:'#a16207',Q:'#c2410c',P:'#475569',T:'#059669',I:'#15803d',V:'#0f766e'};
SIM.traduccion=function(box){
  var L=lienzo(box,0.62,'Síntesis de proteínas: transcripción del ADN a ARNm y traducción en el ribosoma con ARNt'),ctx=L.ctx;
  var GENES={corto:'ATGGCTAAATTTGGCTGGTAA',insulina:'ATGTTTGTGAACCAACACCTGTGCGGCTCACACCTGGTGTAA',propio:''};
  var adn=GENES.corto,arn='',fase='trans',tt=0,i=0,sub='llega',cad=[],t=0,vel=1,fin=false,flash=0;
  var c1=fila(box);
  pildoras(c1,[['corto','Gen de ejemplo (6 aminoácidos)'],['insulina','Comienzo de la cadena B de la insulina']],'corto',function(k){adn=GENES[k];reiniciar();});
  var inp=el('input',{type:'text',placeholder:'o escribe ADN: ATG…',maxlength:60,'aria-label':'Secuencia de ADN codificante',style:'text-transform:uppercase;width:210px;min-height:44px;border:1.5px solid #d0e6f5;border-radius:9px;padding:6px 10px;font-family:JetBrains Mono,monospace'});
  c1.appendChild(inp);inp.addEventListener('change',function(){var v=inp.value.toUpperCase().replace(/[^ATGC]/g,'');if(v.length>=6){adn=v;reiniciar();}});
  var c2=fila(box);
  deslizador(c2,'Velocidad',0.3,3,0.1,1,function(x){vel=x;return '×'+x.toFixed(1).replace('.',',');});
  var bP=el('button',{type:'button',class:'btn-sm'},'⏭ Siguiente paso');c2.appendChild(bP);
  var bR=el('button',{type:'button',class:'btn-sm'},'↺ Empezar de nuevo');c2.appendChild(bR);bR.addEventListener('click',function(){reiniciar();});
  var msg=nota(box,'');
  function reiniciar(){arn=adn.replace(/T/g,'U');fase='trans';tt=0;i=0;sub='llega';cad=[];t=0;fin=false;flash=0;
    var k=arn.indexOf('AUG');if(k<0){k=0;}inicio=k;A&&A.dibujar();}
  var inicio=0,A=null;
  bP.addEventListener('click',function(){avanzar(true);A.dibujar();});
  function codon(j){return arn.substr(inicio+3*j,3);}
  function avanzar(forzar){
    if(fase==='trans'){tt=arn.length;fase='trad';t=0;return;}
    if(fin)return;
    var cd=codon(i),aa=CODIGO[cd];
    if(sub==='llega'){if(cd.length<3||aa==='*'){sub='para';t=0;return;}sub='enlace';t=0;if(i===0){cad.push(aa);sub='transloca';}else{cad.push(aa);flash=1;}return;}
    if(sub==='enlace'){sub='transloca';t=0;return;}
    if(sub==='transloca'){i++;sub='llega';t=0;return;}
    if(sub==='para'){fin=true;return;}
  }
  function paso(dt){
    var W=L.W,H=L.H;
    if(dt>0){t+=dt*vel;flash=Math.max(0,flash-dt*1.2);
      if(fase==='trans'){tt+=dt*vel*8;if(tt>=arn.length+4)avanzar();}
      else if(!fin&&t>1.1)avanzar();}
    ctx.clearRect(0,0,W,H);ctx.fillStyle='#f8fafc';ctx.fillRect(0,0,W,H);
    var nb=Math.max(arn.length,21),bw=Math.min(30,(W-40)/Math.min(nb,22)),ym=H*0.74;ctx.save();
    // desplazamiento para que el ribosoma quede a la vista
    var off=0;if(fase==='trad'){var xr=20+(inicio+3*i)*bw;off=Math.max(0,xr-W/1.35*0.42);}
    // ADN arriba (solo en transcripción) y ARNm abajo
    ctx.font='700 11px JetBrains Mono,monospace';ctx.textAlign='center';
    if(fase==='trans'){ctx.fillStyle='#334155';ctx.font='700 11px Outfit,sans-serif';ctx.textAlign='left';ctx.fillText('ADN (hebra codificante)',20,H*0.2);ctx.fillText('ARNm que se va formando',20,ym+38);
      for(var k=0;k<adn.length;k++){var x=20+k*bw-off;ctx.fillStyle='#e2e8f0';ctx.fillRect(x,H*0.24,bw-2,22);ctx.fillStyle=COLB[adn[k]];ctx.font='800 12px JetBrains Mono,monospace';ctx.textAlign='center';ctx.fillText(adn[k],x+bw/2-1,H*0.24+15);}
      var hecho=Math.min(arn.length,Math.floor(tt));for(k=0;k<hecho;k++){x=20+k*bw-off;ctx.fillStyle='#fef3c7';ctx.fillRect(x,ym,bw-2,22);ctx.fillStyle=arn[k]==='U'?'#ca8a04':COLB[arn[k]];ctx.fillText(arn[k],x+bw/2-1,ym+15);}
      var xp=20+hecho*bw-off;ctx.fillStyle='rgba(13,148,136,.25)';ctx.strokeStyle='#0d9488';ctx.beginPath();ctx.ellipse(xp,(H*0.24+ym)/2+10,34,H*0.3,0,0,PI2);ctx.fill();ctx.stroke();
      ctx.fillStyle='#0f766e';ctx.font='700 10px Outfit,sans-serif';ctx.fillText('ARN polimerasa',xp,H*0.2-8);
      msg.innerHTML='<b>1 · Transcripción</b> (en el núcleo): la <b>ARN polimerasa</b> copia el gen en una molécula de <b>ARN mensajero</b>. Es la misma secuencia de la hebra codificante, pero con <b>U (uracilo)</b> en lugar de T. Luego el ARNm sale al citoplasma, donde están los ribosomas.';
      return;}
    // ARNm con codones (escena ampliada ×1,35 desde abajo)
    var K=1.35;ctx.save();ctx.translate(0,H*0.97);ctx.scale(K,K);ctx.translate(0,-H*0.97);
    for(var k=0;k<arn.length;k++){var x=20+k*bw-off;if(x<-bw||x>W)continue;var j=Math.floor((k-inicio)/3),enC=k>=inicio;
      ctx.fillStyle=enC&&j%2===0?'#fef3c7':'#fde68a';if(!enC)ctx.fillStyle='#f1f5f9';ctx.fillRect(x,ym,bw-1,22);ctx.fillStyle=arn[k]==='U'?'#ca8a04':COLB[arn[k]];ctx.font='800 12px JetBrains Mono,monospace';ctx.textAlign='center';ctx.fillText(arn[k],x+bw/2,ym+15);}
    ctx.fillStyle='#334155';ctx.font='700 11px Outfit,sans-serif';ctx.textAlign='left';ctx.fillText('ARNm  5′ →',4,ym+40);
    // ribosoma sobre los sitios P (codón i−1) y A (codón i)
    var pP=20+(inicio+3*(i-1))*bw-off,pA=20+(inicio+3*i)*bw-off,mov=sub==='transloca'?Math.min(1,t)*3*bw:0;
    var rx=(sub==='transloca'?pP+mov:pP)+1.5*bw;
    ctx.fillStyle='rgba(148,163,184,.35)';ctx.strokeStyle='#64748b';ctx.beginPath();ctx.ellipse(rx+1.5*bw,ym+14,3.6*bw,26,0,0,PI2);ctx.fill();ctx.stroke();
    ctx.beginPath();ctx.ellipse(rx+1.5*bw,ym-44,4*bw,44,0,Math.PI,PI2);ctx.fill();ctx.stroke();
    ctx.fillStyle='#475569';ctx.font='700 10px Outfit,sans-serif';ctx.textAlign='center';ctx.fillText('ribosoma',rx+1.5*bw,ym-70);
    if(i>0){ctx.fillText('P',pP+1.5*bw,ym-4);}ctx.fillText('A',pA+1.5*bw,ym-4);
    // ARNt
    function arnt(xc,cd,aa,y,lleno){var anti=cd.split('').map(function(b){return {A:'U',U:'A',G:'C',C:'G'}[b];}).join('');
      ctx.fillStyle='#fecaca';ctx.strokeStyle='#dc2626';ctx.beginPath();ctx.moveTo(xc-16,y);ctx.lineTo(xc+16,y);ctx.lineTo(xc+10,y-34);ctx.lineTo(xc-10,y-34);ctx.closePath();ctx.fill();ctx.stroke();
      ctx.fillStyle='#7f1d1d';ctx.font='800 10px JetBrains Mono,monospace';ctx.fillText(anti,xc,y-4);ctx.font='9px Outfit,sans-serif';ctx.fillText('ARNt',xc,y-20);
      if(lleno){ctx.fillStyle=AACOL[aa]||'#64748b';ctx.beginPath();ctx.arc(xc,y-46,12,0,PI2);ctx.fill();ctx.fillStyle='#fff';ctx.font='800 9px Outfit,sans-serif';ctx.fillText(AA3[aa]||aa,xc,y-43);}}
    var cdA=codon(i),aaA=CODIGO[cdA];
    if(i>0&&sub!=='transloca'){arnt(pP+1.5*bw,codon(i-1),CODIGO[codon(i-1)],ym-2,false);}
    if(sub==='llega'&&cdA.length===3&&aaA!=='*'){var yd=ym-2-Math.max(0,1-t)*90;arnt(pA+1.5*bw,cdA,aaA,yd,true);}
    if(sub==='enlace'||sub==='transloca'){var xA=sub==='transloca'?rx:pA+1.5*bw;arnt(xA,i===0&&sub==='transloca'?codon(0):cdA,aaA,ym-2,false);
      if(sub==='transloca'&&i>0){var xs=pP+1.5*bw,ys=ym-2-Math.min(1,t)*80;ctx.globalAlpha=1-Math.min(1,t);arnt(xs,codon(i-1),'',ys,false);ctx.globalAlpha=1;}}
    // cadena de aminoácidos (encima del ARNt del sitio que corresponde)
    var xa=(sub==='enlace'||sub==='transloca')?(sub==='transloca'?rx:pA+1.5*bw):(i>0?pP+1.5*bw:pA+1.5*bw),ya=ym-50;
    for(var q=cad.length-1,m=0;q>=0;q--,m++){var cx=xa-m*18,cyy=ya-m*9;if(q<cad.length-1){ctx.strokeStyle=(q===cad.length-2&&flash>0)?'#f59e0b':'#94a3b8';ctx.lineWidth=(q===cad.length-2&&flash>0)?5:2;ctx.beginPath();ctx.moveTo(cx,cyy);ctx.lineTo(cx+18,cyy+9);ctx.stroke();ctx.lineWidth=1;}
      ctx.fillStyle=AACOL[cad[q]]||'#64748b';ctx.beginPath();ctx.arc(cx,cyy,11,0,PI2);ctx.fill();ctx.fillStyle='#fff';ctx.font='800 9px Outfit,sans-serif';ctx.textAlign='center';ctx.fillText(AA3[cad[q]],cx,cyy+3);}
    if(flash>0){ctx.globalAlpha=flash;ctx.fillStyle='#b45309';ctx.font='800 12px Outfit,sans-serif';ctx.textAlign='center';ctx.fillText('¡enlace peptídico! −CO−NH−',xa-9,ya-30);ctx.globalAlpha=1;}
    ctx.restore();
    // tabla de lo leído: codón → anticodón → aminoácido
    var leidos=Math.min(i+(sub==='llega'?0:1),Math.floor((arn.length-inicio)/3));ctx.fillStyle='rgba(255,255,255,.95)';ctx.strokeStyle='#cbd5e1';var tw=Math.min(260,W*0.42),tx0=W-tw-10;ctx.fillRect(tx0,10,tw,22+Math.min(8,leidos)*16);ctx.strokeRect(tx0,10,tw,22+Math.min(8,leidos)*16);
    ctx.fillStyle='#0d2d42';ctx.font='800 10px Outfit,sans-serif';ctx.textAlign='left';ctx.fillText('Codón (ARNm)   Anticodón (ARNt)   Aminoácido',tx0+8,25);
    for(var r=Math.max(0,leidos-8);r<leidos;r++){var cr=codon(r),ar=cr.split('').map(function(b){return {A:'U',U:'A',G:'C',C:'G'}[b];}).join(''),yy=25+16*(r-Math.max(0,leidos-8)+1);ctx.font='700 11px JetBrains Mono,monospace';ctx.fillStyle='#92400e';ctx.fillText(cr,tx0+14,yy);ctx.fillStyle='#b91c1c';ctx.fillText(ar,tx0+100,yy);ctx.fillStyle=AACOL[CODIGO[cr]]||'#0d2d42';ctx.fillText(CODIGO[cr]==='*'?'parada':AA3[CODIGO[cr]],tx0+190,yy);}
    ctx.fillStyle='#94a3b8';ctx.font='700 11px Outfit,sans-serif';ctx.textAlign='left';ctx.fillText('CITOPLASMA',12,20);
    ctx.restore();
    var prot=cad.map(function(a){return AA3[a];}).join('–');
    var txt={llega:i===0?'<b>2 · Inicio de la traducción:</b> el ribosoma se une al ARNm en el codón <b>AUG</b> (inicio). Llega el primer ARNt, con el anticodón <b>UAC</b>, trayendo <b>metionina (Met)</b>.':'<b>Llega un ARNt</b> al sitio A: su anticodón <b>'+cdA.split('').map(function(b){return {A:'U',U:'A',G:'C',C:'G'}[b];}).join('')+'</b> es complementario del codón <b>'+cdA+'</b>, así que trae <b>'+(AA3[aaA]||'—')+'</b>.',
      enlace:'<b>Se forma el enlace peptídico:</b> el ribosoma une el −COOH del último aminoácido de la cadena con el −NH₂ del aminoácido nuevo: −CO−NH− (una amida). La cadena pasa al ARNt del sitio A.',
      transloca:'<b>El ribosoma avanza un codón</b> (3 bases). El ARNt que quedó vacío sale y el sitio A queda libre para el siguiente.',para:'<b>Codón de parada ('+cdA+'):</b> no hay ARNt para él. Un factor de liberación suelta la cadena.'}[sub];
    msg.innerHTML=(fin?'✅ <b>Proteína terminada:</b> '+prot+' ('+cad.length+' aminoácidos unidos por '+Math.max(0,cad.length-1)+' enlaces peptídicos). Luego la cadena se pliega y adquiere su forma 3D.':txt)+(prot&&!fin?'<br>Cadena: <b>'+prot+'</b>':'');
  }
  A=animar(L,paso);botonPausa(A,c2);reiniciar();
  box._prueba=function(seg){for(var s=0;s<seg;s+=0.05)paso(0.05);return {fase:fase,fin:fin,prot:cad.map(function(a){return AA3[a];}).join('-')};};
};

/* ── 7. ¿Cómo limpia un jabón? Micelas ───────────────────────────────────
   Moléculas de jabón: cabeza iónica (−COO⁻, se atrae con el agua) y cola de
   hidrocarburo (apolar, se mete en la grasa). Se pegan a la mancha de grasa
   con la cola hacia adentro; cuando la rodean y se agita, la grasa se
   desprende como una MICELA (gota de grasa envuelta en jabón) que el
   enjuague se lleva. Sin jabón, el agua sola no quita la grasa. */
SIM.jabon=function(box){
  var L=lienzo(box,0.56,'Moléculas de jabón que rodean una mancha de grasa y forman micelas'),ctx=L.ctx;
  var J=[],G=[],nj=50,agita=0,enjuaga=0,quitada=0,total=0;
  function iniciar(){var W=L.W,H=L.H;J=[];G=[];quitada=0;
    [[0.25,0.86,26],[0.55,0.87,22],[0.8,0.86,24]].forEach(function(g){G.push({x:g[0]*W,y:g[1]*H,r:g[2],pegadas:0,suelta:false,vx:0,vy:0,fuera:false});});total=G.length;
    for(var k=0;k<nj;k++)J.push({x:Math.random()*W,y:Math.random()*H*0.6+H*0.08,a:Math.random()*PI2,vx:0,vy:0,g:null,ang:0});}
  var c1=fila(box);
  deslizador(c1,'Jabón',0,80,5,nj,function(x){nj=x;return x+' moléculas';});
  var bA=el('button',{type:'button',class:'btn-sm prim'},'🌀 Agitar (lavar)');c1.appendChild(bA);bA.addEventListener('click',function(){agita=3;A.play();});
  var bE=el('button',{type:'button',class:'btn-sm'},'🚿 Enjuagar');c1.appendChild(bE);bE.addEventListener('click',function(){enjuaga=2.5;A.play();});
  var bR=el('button',{type:'button',class:'btn-sm'},'↺ Ropa sucia otra vez');c1.appendChild(bR);bR.addEventListener('click',function(){iniciar();});
  c1.querySelector('input').addEventListener('change',function(){iniciar();});
  var msg=nota(box,'');
  function paso(dt){
    var W=L.W,H=L.H,tela=H*0.9;
    if(dt>0){agita=Math.max(0,agita-dt);enjuaga=Math.max(0,enjuaga-dt);
      J.forEach(function(j){if(j.g){var g=j.g;j.x=g.x+Math.cos(j.ang)*(g.r+14);j.y=g.y+Math.sin(j.ang)*(g.r+14);j.a=j.ang;return;}
        j.vx+=gauss()*90*dt+(agita>0?Math.sin(j.y/30)*120*dt:0);j.vy+=gauss()*90*dt;
        // las colas apolares «buscan» la grasa: atracción suave hacia la mancha más cercana que todavía tenga espacio
        var obj=null,dmin=400;G.forEach(function(g){if(g.fuera||g.pegadas>=Math.round(g.r/3)+1)return;var d=Math.hypot(j.x-g.x,j.y-g.y);if(d<dmin){dmin=d;obj=g;}});
        if(obj&&nj>0){j.vx+=(obj.x-j.x)/dmin*140*dt;j.vy+=(obj.y-obj.r*0.6-j.y)/dmin*140*dt;}j.vx*=0.95;j.vy*=0.95;j.x+=j.vx*dt;j.y+=j.vy*dt;j.a+=gauss()*2*dt;
        if(enjuaga>0)j.x+=160*dt;if(j.x<0)j.x+=W;if(j.x>W)j.x-=W;j.y=Math.max(10,Math.min(tela-6,j.y));
        G.forEach(function(g){if(j.g||g.fuera)return;var d=Math.hypot(j.x-g.x,j.y-g.y);if(d<g.r+26){var an=Math.atan2(j.y-g.y,j.x-g.x);if(!g.suelta&&an>0.2&&an<Math.PI-0.2)return;j.g=g;j.ang=an;g.pegadas++;}});});
      G.forEach(function(g){if(g.fuera)return;var lim=Math.round(g.r/3);
        if(!g.suelta&&g.pegadas>=lim&&agita>0){g.suelta=true;g.vy=-40;var mias=J.filter(function(j){return j.g===g;});mias.forEach(function(j,k){j.ang=k*PI2/mias.length;});}
        if(g.suelta){g.vx+=gauss()*40*dt+(agita>0?Math.sin(g.y/40)*60*dt:0);g.vy+=(-10+gauss()*40)*dt;g.vx*=0.97;g.vy*=0.97;g.x+=g.vx*dt+(enjuaga>0?170*dt:0);g.y=Math.max(g.r+16,Math.min(tela-g.r-20,g.y+g.vy*dt));
          if(g.x>W+g.r+20){g.fuera=true;quitada++;J=J.filter(function(j){return j.g!==g;});}}});}
    ctx.clearRect(0,0,W,H);ctx.fillStyle='#e0f2fe';ctx.fillRect(0,0,W,tela);
    ctx.fillStyle='#c4b5fd';ctx.fillRect(0,tela,W,H-tela);ctx.fillStyle='#5b21b6';ctx.font='700 11px Outfit,sans-serif';ctx.textAlign='left';ctx.fillText('tela',8,H-6);
    G.forEach(function(g){if(g.fuera)return;ctx.fillStyle='#facc15';ctx.beginPath();ctx.arc(g.x,g.y,g.r,0,PI2);ctx.fill();ctx.fillStyle='#854d0e';ctx.font='700 10px Outfit,sans-serif';ctx.textAlign='center';ctx.fillText(g.suelta?'micela':'grasa',g.x,g.y+3);});
    J.forEach(function(j){var hx=j.x,hy=j.y,ta=j.a+Math.PI;ctx.strokeStyle='#334155';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(hx,hy);for(var u=1;u<=5;u++)ctx.lineTo(hx+Math.cos(ta)*u*3.4+Math.cos(ta+Math.PI/2)*(u%2?2:-2),hy+Math.sin(ta)*u*3.4+Math.sin(ta+Math.PI/2)*(u%2?2:-2));ctx.stroke();ctx.lineWidth=1;
      ctx.fillStyle='#2563eb';ctx.beginPath();ctx.arc(hx,hy,4.5,0,PI2);ctx.fill();});
    ctx.fillStyle='#0d2d42';ctx.font='700 11px Outfit,sans-serif';ctx.textAlign='left';ctx.fillText('Grasa quitada: '+quitada+' de '+total,8,16);
    ctx.font='10px Outfit,sans-serif';ctx.fillText('● azul = cabeza −COO⁻ Na⁺ (le gusta el agua) · línea = cola de hidrocarburo (le gusta la grasa)',8,30);
    var suel=G.filter(function(g){return g.suelta&&!g.fuera;}).length;
    msg.innerHTML=nj===0?'Sin jabón, el agua no puede quitar la grasa: el agua es polar y la grasa apolar, así que no se mezclan aunque agites.':
      quitada===total?'✅ <b>¡Ropa limpia!</b> Cada gota de grasa salió envuelta en jabón (una <b>micela</b>): las colas apolares adentro, con la grasa, y las cabezas iónicas afuera, hacia el agua.':
      suel?'Se formaron <b>micelas</b>: la grasa quedó envuelta en jabón y ya flota en el agua. Pulsa <b>Enjuagar</b> para que el agua se las lleve.':
      'Las <b>colas</b> apolares del jabón se meten en la grasa y las <b>cabezas</b> iónicas quedan hacia el agua. Cuando la mancha está rodeada, <b>agita</b> para despegarla de la tela.';
  }
  var A=animar(L,paso);botonPausa(A,c1);iniciar();
  box._prueba=function(seg,acc){if(acc==='agita')agita=3;if(acc==='enjuaga')enjuaga=2.5;for(var s=0;s<seg;s+=0.05)paso(0.05);return {quitada:quitada,total:total,pegadas:G.map(function(g){return g.pegadas;})};};
};

function iniciar(){document.querySelectorAll('.sim[data-sim]').forEach(function(b){if(b.dataset.listo)return;b.dataset.listo='1';var f=SIM[b.dataset.sim];if(f)try{f(b);}catch(e){b.innerHTML='<p>No se pudo iniciar la simulación.</p>';if(window.console)console.error(e);}});}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',iniciar);else iniciar();
window.SIM4=SIM;
})();
