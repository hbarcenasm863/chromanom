/* ════════════════════════════════════════════════════════════════════════
   ChromaNom — Fase 1 «El carbono» (y banco de Isomería)

   Una sola fuente para tres lugares:
   - Las páginas carbono.html, tipos-carbono.html, cadenas.html e
     isomeria.html (práctica rápida al final de cada sección).
   - El Juego (juego.html): FUND_BANCO se suma a QBANK con los temas
     hibridacion, tipos_carbono, cadenas e isomeria, y FUND_FIG se suma al
     objeto M de dibujos del juego.
   - El generador del docente (docente.html), que lee el banco del Juego y
     convierte estas preguntas de opción múltiple en preguntas tipo Saber 11
     y en ejercicios de selección para los talleres.

   Formato de cada pregunta (el mismo de las preguntas 'mc' del Juego):
     {type:'mc', topic, mol (clave de FUND_FIG, opcional), q, ans,
      opts (incluye ans), optfb (retroalimentación por opción, en el mismo
      orden que opts; '' en la correcta), expl}
   Para agregar preguntas basta con escribirlas aquí: el Juego, las páginas
   y el generador del docente las toman solas.
   ════════════════════════════════════════════════════════════════════════ */
(function(){
'use strict';

/* ── Dibujos ─────────────────────────────────────────────────────────── */
var INK='#0d2233', GRIS='#64748b';
var COL={O:'#b42318',N:'#1a6ea8',S:'#a16207',Cl:'#15803d',Br:'#9a3412',H:'#64748b'};
// Colores de los tipos de carbono (distintos de los 4 colores del método).
var TIPO={p:'#2563eb',s:'#7c3aed',t:'#c2410c',q:'#be185d'};
function colTxt(t){
  if(/^(OH|HO|O)$/.test(t))return COL.O;
  if(/^(NH|NH₂|N)$/.test(t))return COL.N;
  if(/^S$/.test(t))return COL.S;
  if(/^Cl$/.test(t))return COL.Cl;
  if(/^H$/.test(t))return COL.H;
  return INK;
}
function hw(t){return t.length*4.7+3;}
function svgWrap(x0,y0,x1,y1,body,aria){
  var p=10;x0-=p;y0-=p;x1+=p;y1+=p;
  return '<svg class="fu-fig" viewBox="'+x0.toFixed(0)+' '+y0.toFixed(0)+' '+(x1-x0).toFixed(0)+' '+(y1-y0).toFixed(0)+'" role="img" aria-label="'+(aria||'estructura')+'" style="max-width:100%;height:auto">'+body+'</svg>';
}
function ln(x1,y1,x2,y2,c,w){return '<line x1="'+x1.toFixed(1)+'" y1="'+y1.toFixed(1)+'" x2="'+x2.toFixed(1)+'" y2="'+y2.toFixed(1)+'" stroke="'+(c||GRIS)+'" stroke-width="'+(w||1.8)+'" stroke-linecap="round"/>';}
function tx(x,y,t,c,sz,w,anc){return '<text x="'+x.toFixed(1)+'" y="'+y.toFixed(1)+'" text-anchor="'+(anc||'middle')+'" dominant-baseline="central" font-family="JetBrains Mono,Courier New,monospace" font-size="'+(sz||15)+'" font-weight="'+(w||700)+'" fill="'+(c||INK)+'">'+t+'</text>';}
// Enlace horizontal (1, 2 o 3 rayas)
function bondH(x1,x2,y,o,c){
  if(o===2)return ln(x1,y-3,x2,y-3,c)+ln(x1,y+3,x2,y+3,c);
  if(o===3)return ln(x1,y-4.5,x2,y-4.5,c)+ln(x1,y,x2,y,c)+ln(x1,y+4.5,x2,y+4.5,c);
  return ln(x1,y,x2,y,c);
}
function bondV(x,y1,y2,o,c){
  if(o===2)return ln(x-3,y1,x-3,y2,c)+ln(x+3,y1,x+3,y2,c);
  return ln(x,y1,x,y2,c);
}
/* Fórmula semidesarrollada en una fila. Cada átomo: {t:'CH', u:'CH₃' (rama
   arriba), d:'OH' (rama abajo), ub/db: orden del enlace de la rama, b:
   orden del enlace con el siguiente, n: número que se escribe debajo,
   k: tipo de carbono p/s/t/q para colorearlo (solo si se pide). */
function semi(at,aria,conTipo){
  var x=0,xs=[],body='',minY=-12,maxY=12,BL=26;
  at.forEach(function(a,i){ if(i>0)x+=hw(at[i-1].t)+BL+hw(a.t); xs.push(x); });
  at.forEach(function(a,i){
    var cx=xs[i];
    if(i<at.length-1)body+=bondH(cx+hw(a.t),xs[i+1]-hw(at[i+1].t),0,a.b||1);
    if(a.u){body+=bondV(cx,-11,-29,a.ub||1)+tx(cx,-41,a.u,colTxt(a.u),14);minY=-52;}
    if(a.u2){body+=bondV(cx,-52,-70,1)+tx(cx,-82,a.u2,colTxt(a.u2),14);minY=-93;}
    if(a.d){body+=bondV(cx,11,29,a.db||1)+tx(cx,41,a.d,colTxt(a.d),14);maxY=Math.max(maxY,52);}
    var c=(conTipo&&a.k)?TIPO[a.k]:colTxt(a.t);
    body+=tx(cx,0,a.t,c,15);
    if(a.n!=null){
      if(a.d)body+=tx(cx+hw(a.t)+6,17,String(a.n),'#0e7490',11,800,'start');
      else{body+=tx(cx,24,String(a.n),'#0e7490',11,800);maxY=Math.max(maxY,32);}
    }
  });
  return svgWrap(-hw(at[0].t),minY,xs[xs.length-1]+hw(at[at.length-1].t),maxY,body,aria);
}
/* Anillo en fórmula de esqueleto. o: {arom, dbl:[i], het:{i:'O'}, sub:{i:'CH₃'}} */
function anillo(n,o,aria){
  o=o||{};var R=n===3?30:n===4?32:n===5?34:38,P=[],body='',i;
  for(i=0;i<n;i++){var a=(-90+i*360/n)*Math.PI/180;P.push([R*Math.cos(a),R*Math.sin(a)]);}
  var het=o.het||{},sub=o.sub||{},dbl=o.dbl||[];
  for(i=0;i<n;i++){
    var p=P[i],q=P[(i+1)%n],cut=function(pt,other,isH){if(!isH)return pt;var dx=other[0]-pt[0],dy=other[1]-pt[1],L=Math.hypot(dx,dy);return [pt[0]+dx/L*10,pt[1]+dy/L*10];};
    var a1=cut(p,q,het[i]),b1=cut(q,p,het[(i+1)%n]);
    body+=ln(a1[0],a1[1],b1[0],b1[1],INK,2);
    if(dbl.indexOf(i)>=0){ // segunda raya, por dentro del anillo
      var k=0.76,px=p[0]*k,py=p[1]*k,qx=q[0]*k,qy=q[1]*k,dx=(qx-px)*0.12,dy=(qy-py)*0.12;
      body+=ln(px+dx,py+dy,qx-dx,qy-dy,INK,2);
    }
  }
  if(o.arom)body+='<circle r="'+(R*0.55).toFixed(1)+'" fill="none" stroke="'+INK+'" stroke-width="1.8"/>';
  Object.keys(het).forEach(function(k){var p=P[+k];body+=tx(p[0],p[1],het[k],colTxt(het[k]),15);});
  var minX=-R,maxX=R,minY=-R,maxY=R;
  Object.keys(sub).forEach(function(k){
    var p=P[+k],L=Math.hypot(p[0],p[1]),ux=p[0]/L,uy=p[1]/L,e=[p[0]+ux*20,p[1]+uy*20],t=[p[0]+ux*20+ux*hw(sub[k])+ux*4,p[1]+uy*34];
    if(Math.abs(uy)>0.9)t=[p[0],p[1]+uy*40];
    body+=ln(p[0],p[1],e[0],e[1],INK,2)+tx(t[0],t[1],sub[k],colTxt(sub[k]),14);
    minX=Math.min(minX,t[0]-hw(sub[k]));maxX=Math.max(maxX,t[0]+hw(sub[k]));minY=Math.min(minY,t[1]-10);maxY=Math.max(maxY,t[1]+10);
  });
  return svgWrap(minX,minY,maxX,maxY,body,aria);
}
/* Cadena en zigzag (fórmula de esqueleto) */
function zigzag(n,aria){
  var body='',pts=[];for(var i=0;i<n;i++)pts.push([i*30,i%2?-17:0]);
  for(i=0;i<n-1;i++)body+=ln(pts[i][0],pts[i][1],pts[i+1][0],pts[i+1][1],INK,2);
  return svgWrap(0,-17,(n-1)*30,0,body,aria);
}
/* Geometrías de la hibridación */
function geoSp3(){
  var b='';
  b+=ln(0,0,0,-46,INK,2.2)+ln(0,0,-42,22,INK,2.2);
  b+='<polygon points="0,-2 44,20 38,28" fill="'+INK+'"/>';
  for(var i=1;i<=6;i++){var f=i/7,cx=16*f,cy=36*f,w=1.5+f*5;b+=ln(cx-w*0.91,cy+w*0.41,cx+w*0.91,cy-w*0.41,INK,1.6);}
  b+=tx(0,-58,'H',COL.H,15)+tx(-52,28,'H',COL.H,15)+tx(52,30,'H',COL.H,15)+tx(16,48,'H',COL.H,15);
  b+='<circle r="13" fill="#fff" stroke="none"/>'+tx(0,0,'C',INK,17,800);
  b+='<path d="M -9 -28 A 30 30 0 0 0 -26 6" fill="none" stroke="#c2410c" stroke-width="1.5" stroke-dasharray="3 2"/>'+tx(-40,-20,'109,5°','#c2410c',11,800);
  return svgWrap(-66,-68,66,58,b,'metano: carbono sp³ con geometría tetraédrica y ángulos de 109,5°');
}
function geoSp2(conP){
  var b='';
  if(conP)b+='<ellipse cx="-24" cy="-26" rx="9" ry="18" fill="#e9d5ff" opacity=".9"/><ellipse cx="-24" cy="26" rx="9" ry="18" fill="#e9d5ff" opacity=".9"/><ellipse cx="24" cy="-26" rx="9" ry="18" fill="#e9d5ff" opacity=".9"/><ellipse cx="24" cy="26" rx="9" ry="18" fill="#e9d5ff" opacity=".9"/><path d="M -24 -40 Q 0 -52 24 -40" fill="none" stroke="#7c3aed" stroke-width="1.4" stroke-dasharray="3 2"/>'+tx(0,-56,'π','#7c3aed',13,800);
  b+=bondH(-14,14,0,2,INK);
  b+=ln(-34,-6,-58,-36,INK,2)+ln(-34,6,-58,36,INK,2)+ln(34,-6,58,-36,INK,2)+ln(34,6,58,36,INK,2);
  b+=tx(-24,0,'C',INK,17,800)+tx(24,0,'C',INK,17,800);
  b+=tx(-66,-44,'H',COL.H,15)+tx(-66,44,'H',COL.H,15)+tx(66,-44,'H',COL.H,15)+tx(66,44,'H',COL.H,15);
  b+='<path d="M 46 -20 A 26 26 0 0 1 46 20" fill="none" stroke="#c2410c" stroke-width="1.5" stroke-dasharray="3 2"/>'+tx(84,0,'120°','#c2410c',11,800);
  return svgWrap(-78,conP?-64:-54,100,54,b,'eteno: carbonos sp² con geometría trigonal plana y ángulos de 120°');
}
function geoSp(){
  var b=ln(-74,0,-50,0,INK,2)+bondH(-26,26,0,3,INK)+ln(50,0,74,0,INK,2);
  b+=tx(-38,0,'C',INK,17,800)+tx(38,0,'C',INK,17,800)+tx(-86,0,'H',COL.H,15)+tx(86,0,'H',COL.H,15);
  b+='<path d="M -60 -10 A 22 22 0 0 1 -16 -10" fill="none" stroke="#c2410c" stroke-width="1.5" stroke-dasharray="3 2"/>'+tx(-38,-30,'180°','#c2410c',11,800);
  return svgWrap(-96,-40,96,12,b,'etino: carbonos sp con geometría lineal y ángulo de 180°');
}
/* Diagrama de cajas de orbitales: est = 'f' fundamental, 'e' excitado, 'h' sp³ */
function cajas(est){
  var b='',x=0,W=30,G=6,y=0;
  function caja(cx,lab,e){
    var s='<rect x="'+cx+'" y="-16" width="'+W+'" height="32" rx="4" fill="#fff" stroke="'+INK+'" stroke-width="1.6"/>';
    if(e>=1)s+=tx(cx+W/2-(e===2?6:0),0,'↑','#1a6ea8',17,800);
    if(e===2)s+=tx(cx+W/2+6,0,'↓','#1a6ea8',17,800);
    return s+tx(cx+W/2,28,lab,GRIS,11,700);
  }
  if(est==='h'){
    b+=caja(0,'1s',2);x=W+18;
    for(var i=0;i<4;i++)b+=caja(x+i*(W+G),'sp³',1);
    b+=tx(x+2*(W+G)-G/2,48,'4 orbitales híbridos iguales','#7c3aed',11,800);
  }else{
    b+=caja(0,'1s',2);b+=caja(W+18,'2s',est==='e'?1:2);x=2*W+36;
    var p=est==='e'?[1,1,1]:[1,1,0];
    for(var j=0;j<3;j++)b+=caja(x+j*(W+G),'2p',p[j]);
  }
  var lab={f:'Estado fundamental: 1s² 2s² 2p²',e:'Estado excitado: 1s² 2s¹ 2p³',h:'Hibridación sp³'}[est];
  b+=tx(0,-34,lab,INK,12,800,'start');
  return svgWrap(0,-44,Math.max(x+3*(W+G)+(est==='h'?W:0),245),est==='h'?54:38,b,lab);
}

var A=function(t,o){o=o||{};o.t=t;return o;};
var F={
  /* hibridación */
  fu_metano:function(){return geoSp3();},
  fu_eteno:function(){return geoSp2(true);},
  fu_etino:function(){return geoSp();},
  fu_cajas_f:function(){return cajas('f');},
  fu_cajas_e:function(){return cajas('e');},
  fu_cajas_h:function(){return cajas('h');},
  fu_propeno_n:function(){return semi([A('CH₂',{b:2,n:1}),A('CH',{n:2}),A('CH₃',{n:3})],'CH₂=CH−CH₃ con los carbonos numerados');},
  fu_propino_n:function(){return semi([A('CH',{b:3,n:1}),A('C',{n:2}),A('CH₃',{n:3})],'CH≡C−CH₃ con los carbonos numerados');},
  fu_eninoN:function(){return semi([A('CH₂',{b:2,n:1}),A('CH',{n:2}),A('C',{b:3,n:3}),A('CH',{n:4})],'CH₂=CH−C≡CH con los carbonos numerados');},
  fu_acetona:function(){return semi([A('CH₃'),A('C',{u:'O',ub:2}),A('CH₃')],'propanona: CH₃−CO−CH₃');},
  /* tipos de carbono */
  fu_etano:function(){return semi([A('CH₃',{n:1,k:'p'}),A('CH₃',{n:2,k:'p'})],'CH₃−CH₃');},
  fu_propano_n:function(){return semi([A('CH₃',{n:1,k:'p'}),A('CH₂',{n:2,k:'s'}),A('CH₃',{n:3,k:'p'})],'CH₃−CH₂−CH₃ con los carbonos numerados');},
  fu_isobutano_n:function(){return semi([A('CH₃',{n:1,k:'p'}),A('CH',{u:'CH₃',n:2,k:'t'}),A('CH₃',{n:3,k:'p'})],'CH₃−CH(CH₃)−CH₃ con los carbonos numerados');},
  fu_neopentano_n:function(){return semi([A('CH₃',{n:1,k:'p'}),A('C',{u:'CH₃',d:'CH₃',n:2,k:'q'}),A('CH₃',{n:3,k:'p'})],'C(CH₃)₄ con los carbonos numerados');},
  fu_22dmb_n:function(){return semi([A('CH₃',{n:1,k:'p'}),A('C',{u:'CH₃',d:'CH₃',n:2,k:'q'}),A('CH₂',{n:3,k:'s'}),A('CH₃',{n:4,k:'p'})],'CH₃−C(CH₃)₂−CH₂−CH₃ con los carbonos numerados');},
  fu_23dmb_n:function(){return semi([A('CH₃',{n:1,k:'p'}),A('CH',{u:'CH₃',n:2,k:'t'}),A('CH',{u:'CH₃',n:3,k:'t'}),A('CH₃',{n:4,k:'p'})],'CH₃−CH(CH₃)−CH(CH₃)−CH₃ con los carbonos numerados');},
  fu_2mb_n:function(){return semi([A('CH₃',{n:1,k:'p'}),A('CH',{u:'CH₃',n:2,k:'t'}),A('CH₂',{n:3,k:'s'}),A('CH₃',{n:4,k:'p'})],'CH₃−CH(CH₃)−CH₂−CH₃ con los carbonos numerados');},
  fu_isooctano_n:function(){return semi([A('CH₃',{n:1,k:'p'}),A('C',{u:'CH₃',d:'CH₃',n:2,k:'q'}),A('CH₂',{n:3,k:'s'}),A('CH',{u:'CH₃',n:4,k:'t'}),A('CH₃',{n:5,k:'p'})],'CH₃−C(CH₃)₂−CH₂−CH(CH₃)−CH₃ con los carbonos numerados');},
  fu_3e2mp_n:function(){return semi([A('CH₃',{n:1,k:'p'}),A('CH',{u:'CH₃',n:2,k:'t'}),A('CH',{d:'CH₂−CH₃',n:3,k:'t'}),A('CH₂',{n:4,k:'s'}),A('CH₃',{n:5,k:'p'})],'CH₃−CH(CH₃)−CH(CH₂CH₃)−CH₂−CH₃ con los carbonos numerados');},
  fu_ciclohexano:function(){return anillo(6,{},'ciclohexano');},
  fu_metilciclohexano:function(){return anillo(6,{sub:{0:'CH₃'}},'metilciclohexano');},
  fu_etanol:function(){return semi([A('CH₃'),A('CH₂'),A('OH')],'CH₃−CH₂−OH');},
  fu_propan2ol:function(){return semi([A('CH₃'),A('CH',{u:'OH'}),A('CH₃')],'CH₃−CH(OH)−CH₃');},
  fu_terbutanol:function(){return semi([A('CH₃'),A('C',{u:'OH',d:'CH₃'}),A('CH₃')],'(CH₃)₃C−OH');},
  fu_hexano_n:function(){return semi([1,2,3,4,5,6].map(function(n,i){return A(i===0||i===5?'CH₃':'CH₂',{n:n,k:i===0||i===5?'p':'s'});}),'hexano con los carbonos numerados');},
  /* cadenas */
  fu_butano:function(){return semi([A('CH₃'),A('CH₂'),A('CH₂'),A('CH₃')],'CH₃−CH₂−CH₂−CH₃');},
  fu_butano_zz:function(){return zigzag(4,'cadena de 4 carbonos en zigzag');},
  fu_hexano_zz:function(){return zigzag(6,'cadena de 6 carbonos en zigzag');},
  fu_isobutano:function(){return semi([A('CH₃'),A('CH',{u:'CH₃'}),A('CH₃')],'CH₃−CH(CH₃)−CH₃');},
  fu_benceno:function(){return anillo(6,{arom:true},'benceno');},
  fu_tolueno:function(){return anillo(6,{arom:true,sub:{0:'CH₃'}},'metilbenceno (tolueno)');},
  fu_ciclohexeno:function(){return anillo(6,{dbl:[1]},'ciclohexeno');},
  fu_ciclopropano:function(){return anillo(3,{},'ciclopropano');},
  fu_ciclopentano:function(){return anillo(5,{},'ciclopentano');},
  fu_thf:function(){return anillo(5,{het:{0:'O'}},'anillo de 5 átomos con un oxígeno (tetrahidrofurano)');},
  fu_piridina:function(){return anillo(6,{arom:true,het:{0:'N'}},'piridina: anillo aromático con un nitrógeno');},
  fu_eter:function(){return semi([A('CH₃'),A('O'),A('CH₃')],'CH₃−O−CH₃');},
  fu_dma:function(){return semi([A('CH₃'),A('NH'),A('CH₃')],'CH₃−NH−CH₃');},
  fu_tioeter:function(){return semi([A('CH₃'),A('CH₂'),A('S'),A('CH₃')],'CH₃−CH₂−S−CH₃');},
  fu_eteretil:function(){return semi([A('CH₃'),A('CH₂'),A('O'),A('CH₂'),A('CH₃')],'CH₃−CH₂−O−CH₂−CH₃');},
  fu_cloroetano:function(){return semi([A('CH₃'),A('CH₂'),A('Cl')],'CH₃−CH₂−Cl');},
  fu_propeno:function(){return semi([A('CH₂',{b:2}),A('CH'),A('CH₃')],'CH₂=CH−CH₃');},
  fu_propino:function(){return semi([A('CH',{b:3}),A('C'),A('CH₃')],'CH≡C−CH₃');},
  fu_mixta:function(){return semi([A('CH₃'),A('CH',{u:'CH₃'}),A('CH',{b:2}),A('CH₂')],'CH₃−CH(CH₃)−CH=CH₂');},
  fu_metilamina_ch:function(){return semi([A('CH₃'),A('CH₂'),A('CH₂'),A('NH₂')],'CH₃−CH₂−CH₂−NH₂');},
  fu_dieno:function(){return semi([A('CH₂',{b:2}),A('CH'),A('CH',{b:2}),A('CH₂')],'CH₂=CH−CH=CH₂');},
  fu_ramificadaU:function(){return semi([A('CH₃'),A('CH₂'),A('CH',{d:'CH₂−CH₃'}),A('CH₂'),A('CH₃')],'CH₃−CH₂−CH(CH₂CH₃)−CH₂−CH₃');},
  fu_cadenaU:function(){return semi([A('CH₂',{d:'CH₃'}),A('CH₂'),A('CH₂',{d:'CH₃'})],'cadena lineal de 5 carbonos dibujada en forma de U');}
};

/* ── Banco de preguntas ──────────────────────────────────────────────── */
// q(topic, mol, enunciado, [ [opción, retro] ... ] (la primera es la correcta), explicación)
function Q(topic,mol,q,ops,expl){
  return {type:'mc',topic:topic,mol:mol||undefined,q:q,ans:ops[0][0],
    opts:ops.map(function(o){return o[0];}),optfb:ops.map(function(o,i){return i?o[1]:'';}),expl:expl};
}
var H='hibridacion',T='tipos_carbono',C='cadenas',I='isomeria';
var B=[
/* ═══ 1. ÁTOMO DE CARBONO E HIBRIDACIÓN ═══ */
Q(H,null,'¿Cuál es el número atómico (Z) del carbono?',[['6'],['12','12 es su número de masa más común (6 protones + 6 neutrones), no su número atómico.'],['4','4 son sus electrones de valencia, no el total de protones.'],['14','El carbono-14 es un isótopo radiactivo: 14 es su número de masa.']],'El carbono tiene <b>6 protones</b>: Z = 6. Por eso tiene 6 electrones en el átomo neutro.'),
Q(H,null,'¿Cuál es la configuración electrónica del carbono en su estado fundamental?',[['1s² 2s² 2p²'],['1s² 2s² 2p⁴','Esa configuración tiene 8 electrones: es la del oxígeno.'],['1s² 2s¹ 2p³','Esa es la configuración del <b>estado excitado</b>, después de promover un electrón del 2s al 2p.'],['1s² 2p⁴','Por la regla de Aufbau el 2s se llena antes que el 2p.']],'6 electrones: 2 en 1s, 2 en 2s y 2 en 2p → <b>1s² 2s² 2p²</b>.'),
Q(H,'fu_cajas_f','Según este diagrama del estado fundamental, ¿cuántos electrones desapareados tiene el carbono?',[['2'],['4','En el estado fundamental el 2s está lleno (↑↓). Solo hay 4 desapareados en el estado <b>excitado</b>.'],['0','Mira las cajas del 2p: dos tienen una sola flecha.'],['6','6 es el total de electrones, no los desapareados.']],'Solo las dos cajas 2p con una flecha tienen electrones <b>desapareados</b>: 2.'),
Q(H,null,'¿Cuántos electrones de valencia tiene el carbono?',[['4'],['2','Cuenta los del último nivel (n = 2): 2s² 2p² → 2 + 2.'],['6','6 son todos sus electrones; los de valencia son solo los del último nivel.'],['3','Revisa: 2s² 2p² suman cuatro.']],'Los electrones de valencia son los del último nivel: 2s² 2p² → <b>4</b>. Por eso el carbono está en el grupo 14.'),
Q(H,null,'¿Qué significa que el carbono sea <b>tetravalente</b>?',[['Que forma cuatro enlaces covalentes'],['Que tiene cuatro protones','Tiene seis protones. "Tetra-valente" habla de la capacidad de enlace.'],['Que forma cuatro iones distintos','El carbono casi no forma iones: comparte electrones.'],['Que tiene cuatro isótopos','Los isótopos no tienen relación con la valencia.']],'Tetravalente = <b>forma 4 enlaces</b>. En los compuestos orgánicos cada carbono suma siempre 4 enlaces (una raya simple cuenta 1, un doble 2, un triple 3).'),
Q(H,'fu_cajas_e','En el estado fundamental el carbono tiene 2 electrones desapareados, pero forma 4 enlaces. ¿Cómo se explica?',[['Un electrón del 2s se promueve al 2p y quedan 4 desapareados'],['El carbono gana dos electrones','Si ganara electrones sería un ion; en los compuestos orgánicos comparte electrones.'],['El carbono pierde sus electrones del 1s','Los electrones del 1s son internos y no participan en el enlace.'],['Los 6 electrones forman enlaces','Solo participan los 4 de valencia.']],'Al <b>promover</b> un electrón del 2s al 2p vacío, el carbono queda con 4 electrones desapareados (2s¹ 2p³) y puede formar 4 enlaces. La energía que cuesta se recupera con creces al formar los enlaces.'),
Q(H,'fu_metano','En el metano (CH₄) el carbono forma 4 enlaces sencillos. ¿Qué hibridación tiene?',[['sp³'],['sp²','sp² aparece cuando el carbono tiene un doble enlace (3 regiones de enlace).'],['sp','sp aparece con un triple enlace o dos dobles (2 regiones de enlace).'],['No tiene hibridación','Los cuatro enlaces C−H del metano son idénticos: eso solo se explica con 4 orbitales híbridos iguales.']],'4 enlaces sencillos → 4 regiones de enlace → <b>sp³</b> (1 orbital s + 3 orbitales p).'),
Q(H,'fu_metano','¿Cuál es el ángulo entre los enlaces de un carbono sp³?',[['109,5°'],['120°','120° corresponde a sp² (trigonal plana).'],['180°','180° corresponde a sp (lineal).'],['90°','Con 90° los electrones de los enlaces estarían más cerca y se repelerían más; los 4 enlaces se separan al máximo en 3D.']],'Cuatro enlaces se reparten en el espacio lo más lejos posible: forman un <b>tetraedro</b> con ángulos de <b>109,5°</b>.'),
Q(H,null,'¿Qué geometría tiene un carbono con hibridación sp³?',[['Tetraédrica'],['Trigonal plana','Esa es la del carbono sp² (3 regiones de enlace).'],['Lineal','Esa es la del carbono sp (2 regiones de enlace).'],['Cuadrada plana','En un cuadrado los ángulos serían de 90°: los enlaces quedarían más cerca de lo necesario.']],'sp³ → 4 enlaces en las esquinas de un <b>tetraedro</b> (109,5°).'),
Q(H,'fu_eteno','En el eteno (CH₂=CH₂), ¿qué hibridación tiene cada carbono?',[['sp²'],['sp³','sp³ es para carbonos con 4 enlaces sencillos. Aquí cada C tiene un doble enlace.'],['sp','sp es para carbonos con triple enlace o dos dobles.'],['Uno sp² y otro sp³','Los dos carbonos son iguales: cada uno tiene un doble enlace y dos H.']],'Cada C está unido a 3 átomos (2 H y el otro C) → 3 regiones de enlace → <b>sp²</b>. El orbital p que sobra forma el enlace π.'),
Q(H,'fu_eteno','¿Cuál es el ángulo entre los enlaces de un carbono sp²?',[['120°'],['109,5°','109,5° es el ángulo del carbono sp³ (tetraédrico).'],['180°','180° es el ángulo del carbono sp (lineal).'],['60°','Tres enlaces en un plano se reparten la vuelta completa: 360° / 3.']],'Tres enlaces en un mismo plano se separan al máximo: 360° / 3 = <b>120°</b>.'),
Q(H,null,'¿Qué geometría tiene un carbono con hibridación sp²?',[['Trigonal plana'],['Tetraédrica','La tetraédrica es la de sp³ (4 regiones).'],['Lineal','La lineal es la de sp (2 regiones).'],['Piramidal','En una pirámide los enlaces no estarían en un plano; los 3 orbitales sp² sí lo están.']],'sp² → 3 enlaces en un plano formando un triángulo: geometría <b>trigonal plana</b>, 120°.'),
Q(H,'fu_etino','En el etino (HC≡CH), ¿qué hibridación tiene cada carbono?',[['sp'],['sp²','sp² es para carbonos con un doble enlace.'],['sp³','sp³ es para carbonos con solo enlaces sencillos.'],['sp⁴','No existe la hibridación sp⁴: el máximo es sp³ (1 s + 3 p).']],'Cada C está unido a solo 2 átomos (H y el otro C) → 2 regiones de enlace → <b>sp</b>. Le sobran 2 orbitales p que forman los 2 enlaces π.'),
Q(H,'fu_etino','¿Cuál es el ángulo de enlace de un carbono sp?',[['180°'],['120°','120° es el de sp².'],['109,5°','109,5° es el de sp³.'],['90°','Dos regiones de enlace se separan al máximo cuando quedan opuestas: en línea recta.']],'Dos enlaces opuestos → <b>180°</b>, geometría lineal.'),
Q(H,null,'¿Qué geometría tiene un carbono con hibridación sp?',[['Lineal'],['Angular','Una molécula angular (como el agua) tiene pares libres; el carbono sp no los tiene.'],['Trigonal plana','Esa es la de sp².'],['Tetraédrica','Esa es la de sp³.']],'sp → 2 enlaces opuestos → geometría <b>lineal</b>.'),
Q(H,'fu_eteno','Un doble enlace C=C está formado por:',[['Un enlace σ (sigma) y un enlace π (pi)'],['Dos enlaces σ','Entre dos átomos solo cabe un enlace σ (frontal); el segundo se forma de lado con orbitales p: es π.'],['Dos enlaces π','Siempre hay un σ primero; los π se suman a él.'],['Un enlace iónico y uno covalente','Entre dos carbonos los enlaces son covalentes.']],'El primer enlace entre dos átomos siempre es <b>σ</b> (orbitales híbridos de frente). El segundo es <b>π</b>, formado por los orbitales p sin hibridar, de lado.'),
Q(H,'fu_etino','Un triple enlace C≡C está formado por:',[['Un enlace σ y dos enlaces π'],['Tres enlaces σ','Entre dos átomos solo hay un σ.'],['Dos σ y un π','Solo puede haber un σ entre dos átomos.'],['Tres enlaces π','El primer enlace siempre es σ.']],'1 σ (frontal) + <b>2 π</b> (de lado, con los dos orbitales p que le quedan a cada carbono sp).'),
Q(H,null,'¿Cuántos orbitales p sin hibridar le quedan a un carbono sp²?',[['1'],['0','El carbono sp³ es el que usa todos sus orbitales p. El sp² mezcla solo 2 de los 3.'],['2','Al carbono sp le quedan 2; al sp², 1.'],['3','Si no mezclara ningún p no habría hibridación.']],'sp² = 1 s + <b>2</b> p → de los 3 orbitales p queda <b>1</b> sin hibridar, que forma el enlace π.'),
Q(H,null,'¿Cuántos orbitales p sin hibridar le quedan a un carbono sp?',[['2'],['1','Ese es el caso de sp².'],['0','Ese es el caso de sp³.'],['3','sp mezcla un orbital p, así que no quedan los 3.']],'sp = 1 s + 1 p → quedan <b>2</b> orbitales p, que forman los 2 enlaces π del triple enlace.'),
Q(H,'fu_cajas_h','¿Cuántos orbitales híbridos sp³ se forman y con qué orbitales?',[['4, mezclando 1 orbital s y 3 orbitales p'],['3, mezclando 1 s y 2 p','Esa es la hibridación sp².'],['2, mezclando 1 s y 1 p','Esa es la hibridación sp.'],['4, mezclando 2 s y 2 p','En el nivel 2 solo hay un orbital s.']],'El número de orbitales híbridos es igual al de orbitales que se mezclan: 1 s + 3 p = <b>4 sp³</b>, todos iguales.'),
Q(H,null,'¿Qué orbitales se mezclan para formar la hibridación sp²?',[['1 orbital s y 2 orbitales p'],['1 orbital s y 3 orbitales p','Esa mezcla da sp³.'],['1 orbital s y 1 orbital p','Esa mezcla da sp.'],['2 orbitales s y 1 orbital p','Solo hay un orbital 2s.']],'El nombre lo dice: s¹ p² → <b>sp²</b>, tres orbitales híbridos.'),
Q(H,null,'¿Cuál de estos enlaces es el <b>más corto</b>?',[['C≡C (triple)'],['C−C (sencillo)','Es el más largo: con más enlaces los átomos se acercan más.'],['C=C (doble)','Es más corto que el sencillo, pero el triple lo es aún más.'],['Todos miden lo mismo','No: C−C 154 pm, C=C 134 pm, C≡C 120 pm.']],'Más enlaces entre los mismos átomos → más fuerte y más corto: C−C (154 pm) > C=C (134 pm) > <b>C≡C (120 pm)</b>.'),
Q(H,null,'¿Por qué un doble enlace C=C <b>no puede girar</b> libremente?',[['Porque al girar se rompería el enlace π'],['Porque el enlace σ es muy débil','El σ permite el giro; es el π el que lo impide.'],['Porque los carbonos sp² son más pesados','El giro no depende de la masa.'],['Sí puede girar libremente','El enlace sencillo gira; el doble no.']],'El enlace π se forma con orbitales p paralelos. Si un carbono gira, los orbitales dejan de estar paralelos y el π se rompe. Por eso existen los isómeros cis/trans.'),
Q(H,'fu_propeno_n','En el propeno, ¿qué hibridación tiene el <b>C3</b> (el CH₃)?',[['sp³'],['sp²','El C3 no participa del doble enlace: solo tiene enlaces sencillos.'],['sp','sp sería con triple enlace.'],['Igual que el C1, porque están en la misma molécula','Cada carbono tiene su propia hibridación según sus enlaces.']],'El C3 tiene 4 enlaces sencillos (3 H y el C2) → <b>sp³</b>. Los C1 y C2, del doble enlace, son sp².'),
Q(H,'fu_propeno_n','En el propeno, ¿qué hibridación tiene el <b>C2</b>?',[['sp²'],['sp³','El C2 forma parte del doble enlace.'],['sp','Para ser sp necesitaría un triple enlace o dos dobles.'],['sp³ porque tiene un H','Lo que cuenta son las regiones de enlace: H, C1 (doble) y C3 = 3 → sp².']],'C2: unido a H, C1 (doble) y C3 → 3 regiones de enlace → <b>sp²</b>.'),
Q(H,'fu_propino_n','En el propino, ¿qué hibridación tiene el <b>C2</b>?',[['sp'],['sp²','sp² sería con un doble enlace; el C2 tiene un triple.'],['sp³','El C2 tiene un triple enlace, no solo sencillos.'],['sp³ porque está unido al CH₃','Lo que manda es el triple enlace: el C2 tiene solo 2 regiones de enlace.']],'C2: triple enlace con C1 y sencillo con C3 → 2 regiones → <b>sp</b>.'),
Q(H,'fu_eninoN','En CH₂=CH−C≡CH, ¿qué hibridación tiene el <b>C3</b>?',[['sp'],['sp²','El C3 participa del triple enlace, no del doble.'],['sp³','El C3 no tiene solo enlaces sencillos.'],['sp³d','Esa hibridación no la tiene el carbono.']],'C3: sencillo con C2 y triple con C4 → 2 regiones → <b>sp</b>. En esta molécula C1 y C2 son sp², y C3 y C4 son sp.'),
Q(H,'fu_eteno','¿Cuántos enlaces σ (sigma) hay en el eteno, CH₂=CH₂?',[['5'],['6','Cuenta: 4 enlaces C−H + 1 σ del doble enlace. El otro enlace del doble es π.'],['4','Te faltó el σ que hay dentro del doble enlace C=C.'],['1','Todos los enlaces C−H también son σ.']],'4 enlaces C−H (σ) + 1 σ en el C=C = <b>5 σ</b>, y además 1 π.'),
Q(H,'fu_etino','¿Cuántos enlaces π (pi) hay en el etino, HC≡CH?',[['2'],['3','Un triple enlace tiene 1 σ y 2 π.'],['1','Un solo π es lo que tiene un doble enlace.'],['0','Los enlaces múltiples siempre tienen π.']],'Triple enlace = 1 σ + <b>2 π</b>. Los enlaces C−H son σ.'),
Q(H,'fu_etino','¿Cuántos enlaces σ hay en el etino, HC≡CH?',[['3'],['2','Te faltó el σ del triple enlace.'],['5','Del triple enlace solo uno es σ.'],['4','El etino tiene solo 2 enlaces C−H.']],'2 enlaces C−H + 1 σ del C≡C = <b>3 σ</b> (y 2 π).'),
Q(H,null,'Regla rápida: un carbono unido a <b>4 átomos</b> (todos con enlace sencillo) es…',[['sp³'],['sp²','sp² está unido a 3 átomos.'],['sp','sp está unido a 2 átomos.'],['No se puede saber sin dibujarlo','Sí se puede: cuenta los átomos unidos (regiones de enlace).']],'Cuenta los átomos unidos al carbono: 4 → <b>sp³</b>, 3 → sp², 2 → sp.'),
Q(H,'fu_benceno','En el benceno cada carbono está unido a 2 carbonos y 1 hidrógeno, con enlaces dobles alternados. ¿Qué hibridación tiene?',[['sp²'],['sp³','Cada carbono del benceno está unido a solo 3 átomos.'],['sp','sp sería con solo 2 átomos unidos.'],['Mitad sp² y mitad sp³','Los 6 carbonos son iguales: el anillo es plano y todos son sp².']],'3 átomos unidos → <b>sp²</b>. Por eso el benceno es plano, con ángulos de 120°.'),
Q(H,null,'En el diamante cada carbono está unido a otros 4 carbonos en una red tridimensional. ¿Qué hibridación tiene?',[['sp³'],['sp²','sp² es la del grafito, que forma capas planas.'],['sp','sp formaría cadenas lineales.'],['Ninguna, porque es un elemento puro','La hibridación depende de los enlaces, no de si es compuesto o elemento.']],'4 enlaces sencillos → <b>sp³</b>, una red tetraédrica muy rígida: por eso el diamante es tan duro. En el grafito los C son sp² y forman capas que se deslizan.'),
Q(H,'fu_acetona','En la propanona (acetona), ¿qué hibridación tiene el carbono unido al oxígeno con doble enlace?',[['sp²'],['sp³','Ese carbono tiene un doble enlace C=O.'],['sp','Para ser sp necesitaría dos regiones de enlace; tiene tres.'],['sp³ porque el oxígeno es muy electronegativo','La hibridación depende de las regiones de enlace, no de la electronegatividad.']],'Unido a 2 C y a 1 O (doble enlace) → 3 regiones → <b>sp²</b>, igual que en un C=C.'),
Q(H,null,'¿Qué propiedad del carbono le permite unirse a otros carbonos y formar cadenas muy largas?',[['La concatenación'],['La alta electronegatividad','El carbono tiene electronegatividad intermedia; lo que forma cadenas es su capacidad de enlazarse consigo mismo.'],['Su carácter metálico','El carbono es un no metal.'],['La radiactividad','Solo el isótopo carbono-14 es radiactivo, y no tiene relación con las cadenas.']],'La <b>concatenación</b> es la capacidad del carbono de formar enlaces C−C estables, en cadenas y anillos. Junto con la tetravalencia explica los millones de compuestos orgánicos.'),

/* ═══ 2. TIPOS DE CARBONO ═══ */
Q(T,null,'Un carbono <b>primario</b> es el que está unido a…',[['un solo átomo de carbono'],['dos átomos de carbono','Ese es el carbono secundario.'],['tres hidrógenos siempre','En una cadena el CH₃ suele ser primario, pero la definición se basa en cuántos <b>carbonos</b> tiene unidos.'],['ningún carbono','Un carbono sin otros carbonos unidos (como el del metano) no se clasifica así.']],'Primario = unido a <b>1</b> carbono. Secundario = 2, terciario = 3, cuaternario = 4.'),
Q(T,null,'Un carbono <b>secundario</b> es el que está unido a…',[['dos átomos de carbono'],['un átomo de carbono','Ese es el primario.'],['tres átomos de carbono','Ese es el terciario.'],['dos hidrógenos','Para clasificar se cuentan los carbonos unidos, no los hidrógenos.']],'Secundario = unido a <b>2</b> carbonos (por ejemplo, un CH₂ en medio de la cadena).'),
Q(T,null,'Un carbono <b>terciario</b> es el que está unido a…',[['tres átomos de carbono'],['tres hidrógenos','El CH₃ tiene 3 H, pero es primario: está unido a un solo carbono.'],['cuatro átomos de carbono','Ese es el cuaternario.'],['dos carbonos y un oxígeno','Los átomos que no son carbono no cuentan: sería secundario.']],'Terciario = unido a <b>3</b> carbonos. En un alcano es un CH con una ramificación.'),
Q(T,null,'Un carbono <b>cuaternario</b> es el que está unido a…',[['cuatro átomos de carbono'],['cuatro hidrógenos','Ese es el metano, que no tiene carbonos unidos.'],['tres carbonos y un hidrógeno','Ese es el terciario.'],['cuatro átomos cualesquiera','Solo cuentan los átomos de carbono.']],'Cuaternario = unido a <b>4</b> carbonos. No le queda espacio para ningún hidrógeno.'),
Q(T,null,'En una cadena, un grupo <b>CH₃</b> unido a otro carbono es un carbono…',[['primario'],['secundario','Un CH₃ solo tiene un enlace libre para unirse a un carbono.'],['terciario','Un CH₃ tiene 3 H y solo 1 enlace hacia un carbono.'],['cuaternario','El cuaternario no tiene hidrógenos.']],'CH₃ → 3 enlaces con H y <b>1</b> con un carbono → primario.'),
Q(T,null,'En una cadena de alcano, un grupo <b>CH₂</b> en el medio es un carbono…',[['secundario'],['primario','El CH₂ intermedio tiene dos vecinos carbono, uno a cada lado.'],['terciario','Un CH₂ solo tiene 2 enlaces libres para carbonos.'],['cuaternario','Tiene 2 H: no puede estar unido a 4 carbonos.']],'CH₂ → 2 H y <b>2</b> carbonos vecinos → secundario.'),
Q(T,null,'En un alcano, ¿cuántos hidrógenos tiene un carbono <b>terciario</b>?',[['1'],['2','Con 2 H sería secundario.'],['3','Con 3 H sería primario.'],['0','Con 0 H sería cuaternario.']],'4 enlaces − 3 carbonos = <b>1 H</b>. Por eso un carbono terciario de alcano se escribe CH.'),
Q(T,null,'En un alcano, ¿cuántos hidrógenos tiene un carbono <b>cuaternario</b>?',[['0'],['1','Con 1 H sería terciario.'],['4','Ese sería el metano (sin carbonos vecinos).'],['2','Con 2 H sería secundario.']],'Sus 4 enlaces están ocupados por carbonos: <b>0 H</b>. Se escribe solo "C".'),
Q(T,'fu_propano_n','En esta molécula, ¿de qué tipo es el <b>C2</b>?',[['Secundario'],['Primario','El C2 está unido al C1 y al C3: dos carbonos.'],['Terciario','Para ser terciario necesitaría un tercer carbono (una rama).'],['Cuaternario','El C2 todavía tiene 2 H.']],'C2 (CH₂) está unido a C1 y C3 → <b>secundario</b>. C1 y C3 son primarios.'),
Q(T,'fu_propano_n','¿Cuántos carbonos <b>primarios</b> tiene esta molécula?',[['2'],['3','El C2 está unido a dos carbonos: no es primario.'],['1','Los dos extremos (C1 y C3) son primarios.'],['0','Los extremos de una cadena siempre están unidos a un solo carbono.']],'Los dos CH₃ de los extremos son primarios: <b>2</b>.'),
Q(T,'fu_isobutano_n','¿Cuántos carbonos <b>terciarios</b> tiene esta molécula?',[['1'],['0','Revisa el C2: está unido al C1, al C3 y al CH₃ de arriba.'],['3','Los tres CH₃ son primarios.'],['4','Solo uno de los cuatro carbonos tiene tres vecinos carbono.']],'El C2 (CH) está unido a 3 carbonos → <b>1 terciario</b>. Los otros 3 son primarios.'),
Q(T,'fu_isobutano_n','¿Cuántos carbonos <b>primarios</b> tiene esta molécula?',[['3'],['2','No olvides el CH₃ de la rama: también está unido a un solo carbono.'],['1','Cuenta todos los CH₃, incluido el de arriba.'],['4','El C2 está unido a tres carbonos: es terciario.']],'Los tres CH₃ (C1, C3 y la rama) son primarios: <b>3</b>.'),
Q(T,'fu_neopentano_n','¿De qué tipo es el <b>C2</b> de esta molécula?',[['Cuaternario'],['Terciario','Cuenta también la rama de abajo: son cuatro carbonos vecinos.'],['Secundario','El C2 tiene dos ramas además de C1 y C3.'],['Primario','El C2 es el centro: tiene cuatro vecinos.']],'El C2 está unido a C1, C3 y dos CH₃ → 4 carbonos → <b>cuaternario</b>.'),
Q(T,'fu_neopentano_n','¿Cuántos carbonos <b>primarios</b> tiene esta molécula?',[['4'],['2','Cuenta también los dos CH₃ de las ramas.'],['3','Hay cuatro CH₃ alrededor del carbono central.'],['5','El carbono central es cuaternario.']],'Los 4 CH₃ que rodean al carbono central son primarios: <b>4</b>.'),
Q(T,'fu_22dmb_n','¿Cuántos carbonos <b>primarios</b> tiene esta molécula?',[['4'],['2','Además de C1 y C4, los dos CH₃ de las ramas también son primarios.'],['3','Hay cuatro CH₃ en total.'],['5','El C3 (CH₂) es secundario.']],'C1, C4 y los dos CH₃ de las ramas → <b>4 primarios</b>. C2 es cuaternario y C3 secundario.'),
Q(T,'fu_22dmb_n','¿De qué tipo es el <b>C3</b> de esta molécula?',[['Secundario'],['Terciario','El C3 no tiene ramas: está unido solo a C2 y C4.'],['Cuaternario','El cuaternario es el C2.'],['Primario','El C3 tiene dos vecinos carbono.']],'C3 (CH₂) → unido a C2 y C4 → <b>secundario</b>.'),
Q(T,'fu_23dmb_n','¿Cuántos carbonos <b>terciarios</b> tiene esta molécula?',[['2'],['1','El C2 y el C3 tienen cada uno una rama.'],['0','Revisa C2 y C3: cada uno está unido a tres carbonos.'],['4','Los CH₃ son primarios.']],'C2 y C3 (CH) están unidos a 3 carbonos cada uno → <b>2 terciarios</b>.'),
Q(T,'fu_2mb_n','Clasifica los carbonos de esta molécula. ¿Cuál opción es correcta?',[['3 primarios, 1 secundario, 1 terciario'],['2 primarios, 2 secundarios, 1 terciario','El CH₃ de la rama también es primario.'],['3 primarios, 2 secundarios','El C2 tiene una rama: es terciario.'],['4 primarios, 1 cuaternario','El C2 tiene un H: es terciario, no cuaternario.']],'C1, C4 y la rama: primarios (3). C3: secundario. C2: terciario. Total 5 carbonos.'),
Q(T,'fu_isooctano_n','Este es el isooctano, el patrón del "octanaje" de la gasolina. ¿Cuántos carbonos <b>primarios</b> tiene?',[['5'],['4','Cuenta: C1, C5 y los tres CH₃ de las ramas.'],['3','Las ramas también son CH₃ primarios.'],['6','Solo hay cinco grupos CH₃.']],'C1, C5 y los 3 CH₃ de las ramas → <b>5 primarios</b>; C3 secundario, C4 terciario y C2 cuaternario.'),
Q(T,'fu_isooctano_n','En el isooctano, ¿cuál es el carbono <b>cuaternario</b>?',[['C2'],['C4','El C4 tiene un H y una rama: es terciario.'],['C3','El C3 es un CH₂: secundario.'],['No tiene','El C2 está unido a C1, C3 y dos CH₃.']],'El C2 está unido a 4 carbonos (C1, C3 y dos ramas) → <b>cuaternario</b>.'),
Q(T,'fu_3e2mp_n','¿Cuántos carbonos <b>terciarios</b> tiene esta molécula?',[['2'],['1','No solo el C2: el C3 también tiene una rama (el etilo).'],['3','Los carbonos del etilo son uno secundario (CH₂) y uno primario (CH₃).'],['0','Mira el C2 y el C3: cada uno tiene tres vecinos carbono.']],'C2 (con el metilo) y C3 (con el etilo) son <b>terciarios</b>.'),
Q(T,'fu_etano','En el etano (CH₃−CH₃), ¿cómo son sus dos carbonos?',[['Los dos son primarios'],['Uno primario y uno secundario','Cada carbono está unido a un solo carbono: el otro.'],['Los dos son secundarios','Para ser secundarios necesitarían dos carbonos vecinos cada uno.'],['No se pueden clasificar','Sí se pueden: cada uno está unido a 1 carbono.']],'Cada CH₃ está unido a <b>un</b> carbono → ambos primarios.'),
Q(T,'fu_hexano_zz','En una cadena lineal (sin ramas), ¿cómo son los carbonos de los <b>extremos</b>?',[['Primarios'],['Secundarios','Los del medio son secundarios; los extremos tienen un solo vecino.'],['Terciarios','Una cadena lineal no tiene carbonos terciarios.'],['Cuaternarios','Una cadena lineal no tiene carbonos cuaternarios.']],'En una cadena lineal los extremos son <b>primarios</b> y todos los demás son secundarios.'),
Q(T,'fu_hexano_n','¿Cuántos carbonos <b>secundarios</b> tiene esta cadena lineal de 6 carbonos?',[['4'],['6','Los dos extremos son primarios.'],['2','Los dos del extremo son primarios; los demás, secundarios.'],['5','Hay 6 carbonos y 2 son extremos.']],'6 carbonos − 2 extremos (primarios) = <b>4 secundarios</b>.'),
Q(T,'fu_ciclohexano','En el ciclohexano, ¿de qué tipo son sus carbonos?',[['Todos secundarios'],['Todos primarios','En un anillo cada carbono tiene dos vecinos carbono.'],['Todos terciarios','Sin ramas, cada carbono del anillo solo tiene 2 vecinos.'],['3 primarios y 3 secundarios','En un anillo no hay extremos.']],'Cada carbono del anillo está unido a sus dos vecinos → los 6 son <b>secundarios</b>.'),
Q(T,'fu_metilciclohexano','En el metilciclohexano, ¿cuántos carbonos <b>secundarios</b> hay?',[['5'],['6','El carbono que lleva el CH₃ tiene tres vecinos carbono: es terciario.'],['4','Solo uno del anillo cambia de tipo.'],['1','La mayoría de los carbonos del anillo son secundarios.']],'El carbono con el CH₃ es terciario, el CH₃ es primario, y los otros <b>5</b> del anillo son secundarios.'),
Q(T,'fu_etanol','En el etanol, ¿de qué tipo es el carbono unido al −OH?',[['Primario'],['Secundario','El oxígeno no cuenta: ese carbono solo tiene un vecino carbono.'],['Terciario','Solo se cuentan átomos de carbono.'],['No se clasifica por tener oxígeno','Se clasifica igual, contando solo los carbonos vecinos.']],'Está unido a 1 carbono (el CH₃) → <b>primario</b>. Por eso el etanol es un "alcohol primario".'),
Q(T,'fu_propan2ol','En esta molécula, ¿de qué tipo es el carbono unido al −OH?',[['Secundario'],['Terciario','El OH no se cuenta: solo los carbonos vecinos (dos).'],['Primario','Está en el medio: tiene dos vecinos carbono.'],['Cuaternario','Tiene un H y un OH.']],'Unido a 2 carbonos → <b>secundario</b>. Es un "alcohol secundario".'),
Q(T,'fu_terbutanol','En esta molécula, ¿de qué tipo es el carbono unido al −OH?',[['Terciario'],['Cuaternario','Tiene 4 enlaces, pero uno es con el O: solo 3 son con carbonos.'],['Secundario','Cuenta los tres CH₃ que lo rodean.'],['Primario','Tiene tres vecinos carbono.']],'Unido a 3 carbonos (y al OH) → <b>terciario</b>. Es un "alcohol terciario".'),
Q(T,null,'Un carbono unido a dos carbonos, a un −OH y a un H es…',[['secundario'],['terciario','El OH no es un carbono: no cuenta.'],['cuaternario','Solo se cuentan los carbonos vecinos.'],['primario','Tiene dos carbonos vecinos.']],'Solo cuentan los carbonos: 2 → <b>secundario</b>.'),
Q(T,null,'Un carbono unido a un átomo de cloro y a tres carbonos es…',[['terciario'],['cuaternario','El cloro no cuenta: hay solo 3 carbonos vecinos.'],['secundario','Son 3 carbonos vecinos, no 2.'],['primario','Tiene tres carbonos vecinos.']],'3 carbonos vecinos → <b>terciario</b>, aunque tenga 4 enlaces ocupados.'),
Q(T,null,'¿Cuál de estas estructuras tiene un carbono <b>cuaternario</b>?',[['C(CH₃)₄'],['CH₃−CH(CH₃)−CH₃','Su carbono central tiene un H: es terciario.'],['CH₃−CH₂−CH₂−CH₃','Cadena lineal: solo primarios y secundarios.'],['CH₃−CH(CH₃)−CH(CH₃)−CH₃','Tiene dos carbonos terciarios, ninguno cuaternario.']],'En C(CH₃)₄ el carbono central está unido a 4 CH₃ → <b>cuaternario</b>.'),
Q(T,null,'¿Cuál de estas estructuras tiene <b>solo</b> carbonos primarios y secundarios?',[['CH₃−CH₂−CH₂−CH₂−CH₃'],['CH₃−CH(CH₃)−CH₂−CH₃','El CH con la rama es terciario.'],['C(CH₃)₄','El carbono central es cuaternario.'],['CH₃−C(CH₃)₂−CH₃','El carbono central es cuaternario.']],'Una cadena <b>lineal</b> solo tiene primarios (extremos) y secundarios (medio). Las ramas crean terciarios o cuaternarios.'),

/* ═══ 3. CLASIFICACIÓN DE CADENAS CARBONADAS ═══ */
Q(C,'fu_butano','Por su forma, ¿cómo se clasifica esta cadena?',[['Abierta y lineal'],['Abierta y ramificada','No hay ningún carbono unido a tres o cuatro carbonos: no hay ramas.'],['Cerrada','No forma un anillo: tiene dos extremos.'],['Aromática','Las aromáticas son anillos como el benceno.']],'Tiene dos extremos (abierta o acíclica) y ninguna rama → <b>abierta lineal</b>.'),
Q(C,'fu_isobutano','Por su forma, ¿cómo se clasifica esta cadena?',[['Abierta y ramificada'],['Abierta y lineal','El CH₃ de arriba es una ramificación.'],['Cerrada','No forma anillo.'],['Heterogénea','Solo tiene carbonos en la cadena.']],'Tiene extremos (abierta) y un CH₃ que sale de la cadena → <b>ramificada</b>.'),
Q(C,'fu_ciclohexano','¿Cómo se clasifica esta cadena por su forma?',[['Cerrada (cíclica)'],['Abierta lineal','No tiene extremos: el último carbono se une al primero.'],['Abierta ramificada','No tiene extremos ni ramas.'],['Aromática','No tiene enlaces dobles alternados: es alicíclica.']],'Los carbonos forman un anillo → cadena <b>cerrada</b> o cíclica (alicíclica, porque no es aromática).'),
Q(C,'fu_benceno','¿Cómo se clasifica este anillo de seis carbonos con dobles enlaces alternados?',[['Cerrada aromática'],['Cerrada alicíclica','Alicíclicos son los anillos que NO son aromáticos, como el ciclohexano.'],['Abierta insaturada','Es un anillo: no tiene extremos.'],['Heterocíclica','Solo tiene carbonos en el anillo.']],'El benceno es la cadena cerrada <b>aromática</b> por excelencia: 6 carbonos sp² con electrones π deslocalizados (el círculo del dibujo).'),
Q(C,'fu_eter','¿Cómo se clasifica esta cadena según los átomos que la forman?',[['Heterogénea'],['Homogénea','El oxígeno está DENTRO de la cadena, entre dos carbonos.'],['Ramificada','No hay ramas: es una cadena de 3 átomos en fila.'],['Insaturada','Todos los enlaces son sencillos.']],'Un átomo distinto del carbono (heteroátomo: O, N, S) intercalado entre carbonos hace la cadena <b>heterogénea</b>.'),
Q(C,'fu_etanol','¿Cómo se clasifica esta cadena según sus átomos?',[['Homogénea'],['Heterogénea','El O no está entre dos carbonos: es un grupo (−OH) al final de la cadena.'],['Cerrada','Tiene extremos.'],['Insaturada','Todos los enlaces son sencillos.']],'La cadena carbonada es C−C; el −OH es un grupo que cuelga de ella. Como no hay heteroátomo <b>entre</b> carbonos, es <b>homogénea</b>.'),
Q(C,'fu_propeno','¿Cómo se clasifica esta cadena según sus enlaces?',[['Insaturada'],['Saturada','Tiene un doble enlace C=C.'],['Aromática','Es una cadena abierta.'],['Heterogénea','Solo tiene carbonos.']],'Tiene un enlace doble → <b>insaturada</b>.'),
Q(C,'fu_propino','¿Cómo se clasifica esta cadena según sus enlaces?',[['Insaturada'],['Saturada','Tiene un triple enlace.'],['Cerrada','Tiene extremos.'],['Cuaternaria','Las cadenas no se clasifican así; los carbonos sí.']],'Un triple enlace también es una insaturación → <b>insaturada</b>.'),
Q(C,'fu_dma','¿Cómo se clasifica esta cadena según sus átomos?',[['Heterogénea'],['Homogénea','El nitrógeno está entre dos carbonos.'],['Ramificada','El H del NH no es una rama.'],['Aromática','Es una cadena abierta.']],'El N está intercalado entre los dos carbonos → <b>heterogénea</b>.'),
Q(C,null,'Una cadena <b>saturada</b> es la que tiene…',[['solo enlaces sencillos entre carbonos'],['al menos un doble enlace','Eso es una cadena insaturada.'],['solo carbonos e hidrógenos','Eso describe a un hidrocarburo, no a una cadena saturada.'],['un anillo','Eso es una cadena cerrada.']],'Saturada = solo enlaces <b>sencillos</b> C−C: cada carbono tiene "saturados" sus enlaces con el máximo de H.'),
Q(C,null,'¿Qué es un <b>heteroátomo</b> en una cadena carbonada?',[['Un átomo distinto de C y H (como O, N o S) dentro de la cadena'],['Un carbono con doble enlace','Eso es una insaturación.'],['Un carbono de una ramificación','La rama sigue siendo de carbonos.'],['Un hidrógeno','El H no forma parte del esqueleto de la cadena.']],'"Hetero" = distinto. O, N y S intercalados en la cadena la hacen <b>heterogénea</b>.'),
Q(C,null,'¿Qué es una cadena <b>alicíclica</b>?',[['Una cadena cerrada que no es aromática'],['Una cadena abierta sin ramas','Esa es la lineal.'],['Un anillo con un oxígeno','Ese es un heterociclo.'],['Un anillo de benceno','El benceno es aromático, no alicíclico.']],'Alicíclica = <b>cíclica</b> pero con propiedades parecidas a las cadenas alifáticas (abiertas): ciclopropano, ciclohexano, ciclohexeno…'),
Q(C,'fu_thf','¿Cómo se clasifica este anillo con un oxígeno?',[['Cerrada heterocíclica'],['Cerrada homocíclica','Homocíclica es cuando el anillo tiene solo carbonos.'],['Abierta heterogénea','Es un anillo: no tiene extremos.'],['Aromática','No tiene dobles enlaces alternados.']],'Un anillo con un heteroátomo (O) en el ciclo → <b>heterocíclica</b>.'),
Q(C,'fu_piridina','La piridina es un anillo de 6 átomos con un nitrógeno y dobles enlaces alternados. ¿Cómo se clasifica?',[['Cerrada, heterocíclica y aromática'],['Cerrada, homocíclica y aromática','El N forma parte del anillo: es heterocíclica.'],['Cerrada, heterocíclica y alicíclica','Tiene electrones π deslocalizados como el benceno: es aromática.'],['Abierta y heterogénea','Es un anillo.']],'Anillo con N → heterocíclica; dobles enlaces alternados deslocalizados → aromática.'),
Q(C,'fu_ciclohexeno','¿Cuál es la clasificación completa de esta cadena?',[['Cerrada, alicíclica e insaturada'],['Cerrada, aromática e insaturada','Un solo doble enlace no hace aromático un anillo.'],['Cerrada, alicíclica y saturada','Tiene un doble enlace.'],['Abierta e insaturada','Es un anillo.']],'Anillo → cerrada; no aromático → alicíclica; con un doble enlace → <b>insaturada</b>.'),
Q(C,'fu_mixta','¿Cuál es la clasificación completa de esta cadena?',[['Abierta, ramificada, insaturada y homogénea'],['Abierta, lineal, insaturada y homogénea','El CH₃ de arriba es una rama.'],['Abierta, ramificada, saturada y homogénea','Tiene un doble enlace al final.'],['Abierta, ramificada, insaturada y heterogénea','Solo hay carbonos en la cadena.']],'Extremos → abierta; un CH₃ que sale → ramificada; C=C → insaturada; solo C → homogénea.'),
Q(C,null,'Otro nombre para una cadena <b>abierta</b> es…',[['acíclica o alifática'],['aromática','Las aromáticas son anillos.'],['alicíclica','Alicíclica es una cadena cerrada.'],['heterocíclica','Heterocíclica es un anillo con heteroátomo.']],'Abierta = <b>acíclica</b> (sin ciclo) = <b>alifática</b>.'),
Q(C,null,'¿Cuál de estas cadenas es <b>ramificada</b>?',[['CH₃−CH(CH₃)−CH₂−CH₃'],['CH₃−CH₂−CH₂−CH₃','Todos sus carbonos están en una sola fila.'],['CH₂=CH−CH₂−CH₃','El doble enlace no es una rama.'],['CH₃−O−CH₂−CH₃','El oxígeno está dentro de la cadena, no es una rama.']],'En CH₃−CH(CH₃)−CH₂−CH₃ el grupo entre paréntesis sale del segundo carbono: es una <b>rama</b>.'),
Q(C,null,'¿Cuál de estas cadenas es <b>heterogénea</b>?',[['CH₃−CH₂−O−CH₃'],['CH₃−CH₂−CH₂−OH','El O está al final, como grupo −OH, no entre carbonos.'],['CH₃−CH₂−Cl','El Cl es un sustituyente al final de la cadena.'],['CH₃−CH=CH₂','Solo tiene carbonos en la cadena.']],'En CH₃−CH₂−O−CH₃ el oxígeno está <b>entre</b> dos carbonos → heterogénea.'),
Q(C,null,'¿Cuál de estas cadenas es <b>insaturada</b>?',[['CH₃−C≡C−CH₃'],['CH₃−CH₂−CH₂−CH₃','Solo tiene enlaces sencillos.'],['CH₃−CH(CH₃)−CH₃','Las ramas no son insaturaciones.'],['CH₃−O−CH₃','El O no forma enlaces dobles aquí.']],'El triple enlace C≡C es una insaturación → <b>insaturada</b>.'),
Q(C,'fu_hexano_zz','Esta cadena se dibujó en zigzag. ¿Es ramificada?',[['No, es lineal: el zigzag es solo la forma del dibujo'],['Sí, cada vértice es una rama','Los vértices son carbonos de la misma cadena, uno tras otro.'],['Sí, porque no es recta','Los enlaces sencillos giran: una cadena lineal puede doblarse.'],['No se puede saber','Sigue el camino: todos los carbonos están en una sola fila sin bifurcaciones.']],'La cadena sigue un solo camino sin bifurcaciones → <b>lineal</b>. El zigzag refleja los ángulos de 109,5° del carbono sp³.'),
Q(C,'fu_cadenaU','Esta cadena está dibujada "doblada" en forma de U. ¿Cómo se clasifica?',[['Abierta lineal'],['Abierta ramificada','Los CH₃ de abajo son los extremos de la cadena, no ramas: sigue el camino de un extremo al otro.'],['Cerrada','Los extremos no se unen entre sí.'],['Heterogénea','Solo tiene carbonos.']],'Sigue el camino: CH₃−CH₂−CH₂−CH₂−CH₃, 5 carbonos en fila sin bifurcaciones → <b>lineal</b>. Doblar el dibujo no crea ramas.'),
Q(C,'fu_ciclopropano','¿Cómo se clasifica esta cadena?',[['Cerrada, alicíclica y saturada'],['Abierta y saturada','Los tres carbonos forman un triángulo cerrado.'],['Cerrada y aromática','Un anillo de 3 carbonos sin dobles enlaces no es aromático.'],['Cerrada e insaturada','Todos sus enlaces son sencillos.']],'El ciclopropano es el anillo más pequeño: <b>cerrado</b>, no aromático (alicíclico) y <b>saturado</b>.'),
Q(C,'fu_tolueno','¿Cómo se clasifica esta cadena?',[['Cerrada aromática con una ramificación'],['Abierta ramificada','El esqueleto principal es un anillo.'],['Cerrada alicíclica','El anillo es de benceno: aromático.'],['Cerrada heterocíclica','El anillo solo tiene carbonos.']],'Anillo de benceno (aromático) + un CH₃ que sale de él → <b>cerrada aromática ramificada</b>.'),
Q(C,'fu_tioeter','¿Cómo se clasifica esta cadena según sus átomos?',[['Heterogénea'],['Homogénea','El azufre está entre dos carbonos.'],['Cerrada','Tiene extremos.'],['Aromática','Es abierta.']],'El S intercalado en la cadena es un heteroátomo → <b>heterogénea</b>.'),
Q(C,'fu_cloroetano','¿Cómo se clasifica esta cadena según sus átomos?',[['Homogénea'],['Heterogénea','El Cl está al final, como sustituyente: no interrumpe la cadena de carbonos.'],['Ramificada','El Cl no es una rama de carbono.'],['Insaturada','Todos los enlaces son sencillos.']],'Los únicos átomos de la cadena son carbonos; el Cl es un sustituyente → <b>homogénea</b>.'),
Q(C,null,'Una cadena abierta y saturada de 4 carbonos tiene fórmula C₄H₁₀. Si la cadena tiene un doble enlace, ¿cuántos hidrógenos tiene?',[['8'],['10','Cada doble enlace "quita" 2 hidrógenos.'],['6','Eso sería con un triple enlace o dos dobles.'],['12','Con más enlaces entre carbonos caben menos H, no más.']],'Cada insaturación (un doble enlace) resta 2 H: C₄H₁₀ → <b>C₄H₈</b>.'),
Q(C,null,'El hexano (C₆H₁₄) y el ciclohexano (C₆H₁₂) son ambos saturados. ¿En qué se diferencian sus cadenas?',[['El hexano es abierto y el ciclohexano es cerrado'],['El hexano es insaturado','Los dos tienen solo enlaces sencillos.'],['El ciclohexano es aromático','No tiene dobles enlaces alternados.'],['El hexano es ramificado','El hexano es lineal.']],'Cerrar el anillo une los dos extremos y "gasta" 2 H: hexano (abierto, C₆H₁₄) → ciclohexano (<b>cerrado</b>, C₆H₁₂).'),
Q(C,null,'La parafina de las velas está formada por cadenas largas de solo C e H unidos con enlaces sencillos. ¿Cómo son esas cadenas?',[['Saturadas y homogéneas'],['Insaturadas','Solo hay enlaces sencillos.'],['Heterogéneas','Solo hay carbonos en la cadena.'],['Aromáticas','Son cadenas abiertas.']],'Solo enlaces sencillos → saturadas; solo carbonos en la cadena → homogéneas. La parafina es una mezcla de alcanos.'),
Q(C,'fu_dieno','El caucho natural se forma a partir de moléculas con dobles enlaces como esta. ¿Cómo es esta cadena?',[['Abierta, lineal e insaturada'],['Abierta, lineal y saturada','Tiene dos dobles enlaces.'],['Cerrada y aromática','Tiene extremos.'],['Abierta, ramificada e insaturada','No tiene ramas.']],'Cuatro carbonos en fila, con extremos, y dos C=C → <b>abierta, lineal e insaturada</b>.'),
Q(C,null,'En una cadena <b>homogénea</b>, el esqueleto está formado solo por…',[['átomos de carbono'],['átomos de carbono e hidrógeno','Los H no forman el esqueleto: van unidos a los carbonos.'],['enlaces sencillos','Eso describe una cadena saturada.'],['un anillo','Eso describe una cadena cerrada.']],'Homogénea = esqueleto solo de <b>carbonos</b> (sin O, N o S intercalados).'),
Q(C,'fu_ciclopentano','¿Cómo se clasifica esta cadena de cinco carbonos?',[['Cerrada, alicíclica y saturada'],['Cerrada, aromática y saturada','Sin dobles enlaces alternados no hay aromaticidad.'],['Abierta, ramificada y saturada','Los cinco carbonos forman un anillo: no hay extremos.'],['Cerrada, heterocíclica y saturada','El anillo solo tiene carbonos.']],'Pentágono de carbonos con solo enlaces sencillos → <b>cerrada, alicíclica y saturada</b> (ciclopentano).'),
Q(C,'fu_metilamina_ch','¿Cómo se clasifica esta cadena según sus átomos?',[['Homogénea'],['Heterogénea','El N está al final, como grupo −NH₂: no queda entre dos carbonos.'],['Ramificada','El NH₂ no es una rama de carbono.'],['Cerrada','Tiene extremos.']],'El esqueleto C−C−C es solo de carbonos; el −NH₂ es un grupo al final → <b>homogénea</b>. Compárala con CH₃−NH−CH₃, que sí es heterogénea.'),

/* ═══ 4. ISOMERÍA ═══ */
Q(I,null,'¿Qué son los isómeros?',[['Compuestos con la misma fórmula molecular y distinta estructura'],['Compuestos con la misma estructura y distinta fórmula','Si la fórmula cambia, no son isómeros.'],['Átomos del mismo elemento con distinto número de neutrones','Esos son isótopos, no isómeros.'],['Compuestos con el mismo nombre IUPAC','Si tienen el mismo nombre son el mismo compuesto.']],'Isómeros = <b>misma fórmula molecular</b>, átomos <b>organizados de otra manera</b> → sustancias distintas.'),
Q(I,null,'El <b>butano</b> (CH₃−CH₂−CH₂−CH₃) y el <b>2-metilpropano</b> (CH₃−CH(CH₃)−CH₃), ambos C₄H₁₀, son isómeros…',[['de cadena'],['de posición','No hay un grupo funcional que cambie de lugar: cambia la forma de la cadena.'],['de función','Los dos son alcanos.'],['cis/trans','No tienen dobles enlaces.']],'Uno es lineal y el otro ramificado → isómeros <b>de cadena</b>.'),
Q(I,null,'El <b>propan-1-ol</b> y el <b>propan-2-ol</b> (C₃H₈O) son isómeros…',[['de posición'],['de cadena','Las dos cadenas son iguales: 3 C sin ramas.'],['de función','Los dos son alcoholes (−OH).'],['ópticos','Ninguno tiene carbono quiral.']],'Mismo grupo −OH en otro carbono (C1 o C2) → isómeros <b>de posición</b>.'),
Q(I,null,'El <b>etanol</b> (CH₃−CH₂−OH) y el <b>metoximetano</b> (CH₃−O−CH₃) son isómeros…',[['de función'],['de posición','El O no solo cambió de lugar: forma otro grupo funcional (éter).'],['de cadena','La diferencia está en el grupo funcional.'],['No son isómeros','Los dos son C₂H₆O.']],'Alcohol frente a éter, ambos C₂H₆O → isómeros <b>de función</b>.'),
Q(I,null,'El <b>propanal</b> (CH₃−CH₂−CHO) y la <b>propanona</b> (CH₃−CO−CH₃) son isómeros…',[['de función'],['de posición','Un C=O en el extremo es un aldehído y en el medio una cetona: son familias distintas.'],['de cadena','Las dos cadenas tienen 3 C sin ramas.'],['geométricos','No tienen C=C.']],'Aldehído frente a cetona (C₃H₆O) → isómeros <b>de función</b>.'),
Q(I,null,'El <b>but-1-eno</b> y el <b>but-2-eno</b> (C₄H₈) son isómeros…',[['de posición'],['de cadena','Las dos cadenas son lineales de 4 C.'],['de función','Los dos son alquenos.'],['No son isómeros','Los dos son C₄H₈.']],'Solo cambia el lugar del doble enlace → isómeros <b>de posición</b>.'),
Q(I,null,'El <b>pentano</b> y el <b>2,2-dimetilpropano</b> son isómeros…',[['de cadena'],['de función','Los dos son alcanos.'],['de posición','No hay grupo funcional que cambie de lugar.'],['No son isómeros','Los dos tienen 5 C: son C₅H₁₂.']],'Lineal (5 C) frente a ramificado (3 C + 2 metilos) → <b>de cadena</b>.'),
Q(I,null,'El <b>propan-1-ol</b> (C₃H₈O) y el <b>propanal</b> (C₃H₆O), ¿son isómeros?',[['No, porque no tienen la misma fórmula molecular'],['Sí, de función','Antes de clasificar revisa la fórmula: tienen 2 H de diferencia.'],['Sí, de posición','Las fórmulas no coinciden.'],['Sí, de cadena','Las fórmulas no coinciden.']],'C₃H₈O ≠ C₃H₆O → <b>no son isómeros</b>.'),
Q(I,null,'¿Cuántos isómeros estructurales tiene el C₅H₁₂?',[['3'],['2','Te falta el que tiene dos metilos en el mismo carbono (2,2-dimetilpropano).'],['4','"3-metilbutano" es el 2-metilbutano numerado al revés.'],['5','5 es el número de isómeros del C₆H₁₄.']],'Pentano, 2-metilbutano y 2,2-dimetilpropano: <b>3</b>.'),
Q(I,null,'¿Cuántos isómeros estructurales tiene el C₄H₁₀?',[['2'],['1','Además del butano existe el 2-metilpropano.'],['3','3 son los del C₅H₁₂.'],['4','Con 4 carbonos solo hay dos formas de unirlos.']],'Butano y 2-metilpropano: <b>2</b>.'),
Q(I,null,'¿Cuántos isómeros estructurales tiene el C₆H₁₄?',[['5'],['3','3 son los del C₅H₁₂.'],['4','Revisa: hexano, 2-metilpentano, 3-metilpentano, 2,2-dimetilbutano y 2,3-dimetilbutano.'],['6','"2-etilbutano" es en realidad 3-metilpentano.']],'Hexano, 2-metilpentano, 3-metilpentano, 2,2-dimetilbutano y 2,3-dimetilbutano: <b>5</b>.'),
Q(I,null,'¿Cuál de estos compuestos <b>NO</b> es isómero del hexano (C₆H₁₄)?',[['2-metilhexano'],['2-metilpentano','5 + 1 = 6 C: sí es C₆H₁₄.'],['2,3-dimetilbutano','4 + 2 = 6 C: sí es C₆H₁₄.'],['3-metilpentano','5 + 1 = 6 C: sí es C₆H₁₄.']],'El 2-metilhexano tiene 6 + 1 = 7 C (C₇H₁₆): <b>no es isómero</b> del hexano.'),
Q(I,null,'El <b>ácido propanoico</b> (CH₃−CH₂−COOH) y el <b>etanoato de metilo</b> (CH₃−COO−CH₃), ambos C₃H₆O₂, son isómeros…',[['de función'],['de posición','Ácido y éster son familias distintas.'],['de cadena','La diferencia está en el grupo funcional.'],['No son isómeros','Los dos son C₃H₆O₂.']],'Ácido carboxílico frente a éster → isómeros <b>de función</b>.'),
Q(I,null,'El <b>ciclohexano</b> y el <b>hex-1-eno</b> (ambos C₆H₁₂) son isómeros…',[['de función'],['de posición','No se trata del mismo grupo en otro lugar: uno es un anillo y el otro tiene un C=C.'],['cis/trans','El hex-1-eno no tiene cis/trans (su C1 tiene dos H).'],['No son isómeros','Los dos son C₆H₁₂.']],'Un cicloalcano y un alqueno con la misma fórmula son isómeros <b>de función</b>.'),
Q(I,null,'El <b>butan-1-ol</b> y el <b>etoxietano</b> (CH₃−CH₂−O−CH₂−CH₃), ambos C₄H₁₀O, son isómeros…',[['de función'],['de posición','No es el mismo grupo: uno es alcohol y el otro éter.'],['de cadena','La diferencia está en el grupo funcional.'],['No son isómeros','Los dos son C₄H₁₀O.']],'Alcohol frente a éter → <b>de función</b>.'),
Q(I,null,'¿El <b>but-2-eno</b> (CH₃−CH=CH−CH₃) tiene isomería cis/trans?',[['Sí'],['No, porque tiene dos CH₃ iguales','Lo que importa es que cada carbono del doble enlace tenga dos grupos distintos: el C2 tiene H y CH₃, el C3 también.'],['No, porque es un alcano','Es un alqueno: tiene un doble enlace.'],['Solo si se calienta','Depende de la estructura, no de la temperatura.']],'C2: H y CH₃; C3: H y CH₃ → existen el <i>cis</i>- y el <i>trans</i>-but-2-eno.'),
Q(I,null,'¿El <b>propeno</b> (CH₂=CH−CH₃) tiene isomería cis/trans?',[['No'],['Sí','El C1 tiene dos H iguales: al intercambiarlos se obtiene la misma molécula.'],['Solo el isómero cis','Sin dos grupos distintos en cada carbono del doble enlace no hay cis ni trans.'],['Sí, porque tiene un doble enlace','Tener doble enlace es necesario pero no suficiente.']],'El C1 (CH₂) tiene dos H → <b>no</b> hay isomería cis/trans.'),
Q(I,null,'¿El <b>2-metilbut-2-eno</b> (CH₃−C(CH₃)=CH−CH₃) tiene isomería cis/trans?',[['No, porque el C2 tiene dos CH₃'],['Sí, porque el C3 tiene H y CH₃','Ambos carbonos del doble enlace deben cumplir.'],['Sí, porque tiene una rama','Las ramas no producen cis/trans.'],['No, porque tiene 5 carbonos','El número de carbonos no importa.']],'El C2 tiene dos grupos iguales (CH₃ y CH₃) → <b>no</b> hay cis/trans.'),
Q(I,null,'¿El <b>1,2-dicloroeteno</b> (ClCH=CHCl) tiene isomería cis/trans?',[['Sí'],['No, porque los dos carbonos son iguales','Se revisa cada carbono: cada uno tiene H y Cl, dos grupos distintos.'],['No, porque el cloro no es un alquilo','La regla vale para cualquier sustituyente.'],['No, porque solo tiene 2 carbonos','El número de carbonos no importa.']],'Cada carbono tiene H y Cl → existen el <i>cis</i>- y el <i>trans</i>-1,2-dicloroeteno.'),
Q(I,null,'En la notación IUPAC, el isómero <i>trans</i>-but-2-eno se escribe como…',[['(E)-but-2-eno'],['(Z)-but-2-eno','Z (<i>zusammen</i>, "juntos") corresponde al cis.'],['(R)-but-2-eno','R y S son para carbonos quirales.'],['(S)-but-2-eno','R y S son para carbonos quirales.']],'E viene de <i>entgegen</i>, "opuestos" → <b>(E)</b> = trans.'),
Q(I,null,'En la notación IUPAC, el isómero <i>cis</i> de un alqueno corresponde a…',[['(Z)'],['(E)','E corresponde al trans.'],['(R)','R se usa en carbonos quirales.'],['(+)','(+) indica el sentido en que se desvía la luz polarizada.']],'Z (<i>zusammen</i>, "juntos"): los grupos principales del <b>mismo lado</b>.'),
Q(I,null,'¿Por qué existen los isómeros cis/trans en los alquenos?',[['Porque el doble enlace no puede girar'],['Porque los alquenos tienen carbonos quirales','La quiralidad produce otro tipo de isomería (óptica).'],['Porque el enlace sencillo no puede girar','El enlace sencillo sí gira libremente.'],['Porque tienen distinta fórmula molecular','Los isómeros siempre tienen la misma fórmula.']],'El enlace π impide el giro: los grupos quedan "fijos" a un lado u otro del doble enlace.'),
Q(I,null,'Un <b>carbono quiral</b> (asimétrico) es el que está unido a…',[['cuatro grupos distintos'],['cuatro carbonos','Ese es un carbono cuaternario: pueden ser grupos iguales.'],['un doble enlace','Un carbono con doble enlace solo tiene 3 grupos.'],['un grupo −OH','El −OH no basta: los cuatro grupos deben ser distintos.']],'C* = unido a <b>4 grupos diferentes</b>. La molécula y su imagen en el espejo no se pueden superponer.'),
Q(I,null,'En el <b>butan-2-ol</b>, CH₃−CH(OH)−CH₂−CH₃, ¿cuál carbono es quiral?',[['C2'],['C1','El C1 es un CH₃: tiene tres H iguales.'],['C3','El C3 es un CH₂: tiene dos H iguales.'],['Ninguno','El C2 tiene H, OH, CH₃ y CH₂CH₃: cuatro grupos distintos.']],'C2: H, OH, CH₃ y CH₂CH₃ → <b>quiral</b>.'),
Q(I,null,'¿El <b>propan-2-ol</b>, CH₃−CH(OH)−CH₃, tiene carbono quiral?',[['No'],['Sí, el C2','El C2 tiene dos CH₃ iguales.'],['Sí, el C1','El C1 tiene tres H.'],['Sí, todos','Ningún carbono tiene cuatro grupos distintos.']],'El C2 está unido a dos CH₃ iguales → <b>no es quiral</b>.'),
Q(I,null,'¿Cuál de estas moléculas tiene un carbono quiral?',[['CH₃−CHBr−CH₂−CH₃'],['CH₃−CHBr−CH₃','El C2 tiene dos CH₃ iguales.'],['CH₃−CH₂−CH₂−Br','Ningún carbono tiene cuatro grupos distintos.'],['CH₂Br−CH₂Br','Cada carbono tiene dos H.']],'En CH₃−CHBr−CH₂−CH₃ el C2 tiene H, Br, CH₃ y CH₂CH₃ → <b>quiral</b>.'),
Q(I,null,'¿Qué son los <b>enantiómeros</b>?',[['Isómeros que son imágenes en el espejo y no se pueden superponer'],['Isómeros con el doble enlace en otra posición','Esos son isómeros de posición.'],['Isómeros con distinto grupo funcional','Esos son isómeros de función.'],['Isómeros cis y trans','Esos son isómeros geométricos.']],'Como la mano derecha y la izquierda: <b>imágenes especulares no superponibles</b>.'),
Q(I,null,'¿En qué se diferencian dos enantiómeros?',[['En el sentido en que desvían la luz polarizada'],['En su punto de ebullición','Tienen el mismo punto de ebullición y de fusión.'],['En su fórmula molecular','Son isómeros: misma fórmula.'],['En el orden de unión de sus átomos','Tienen el mismo orden; cambia la disposición en el espacio.']],'Tienen las mismas propiedades físicas, pero desvían la luz polarizada en <b>sentidos opuestos</b> y pueden actuar distinto en el cuerpo.'),
Q(I,null,'La isomería cis/trans es un tipo de…',[['estereoisomería'],['isomería estructural','En la estructural los átomos se unen en otro orden; en cis/trans el orden es el mismo.'],['isomería de función','No cambia el grupo funcional.'],['isotopía','Los isótopos son átomos, no moléculas.']],'Mismo orden de unión, distinta disposición en el espacio → <b>estereoisomería</b> (geométrica).'),
Q(I,null,'Las isomerías de cadena, de posición y de función son tipos de…',[['isomería estructural'],['estereoisomería','En ellas los átomos se unen en distinto orden: eso es estructural.'],['isomería óptica','La óptica es por carbonos quirales.'],['isomería geométrica','La geométrica es la cis/trans.']],'Los átomos se unen en <b>distinto orden</b> → isomería <b>estructural</b> (constitucional).'),
Q(I,null,'¿El <b>3-metilpentano</b>, CH₃−CH₂−CH(CH₃)−CH₂−CH₃, tiene carbono quiral?',[['No'],['Sí, el C3','El C3 tiene dos etilos iguales (uno a cada lado).'],['Sí, el C2','El C2 tiene dos H.'],['Sí, el metilo','Un CH₃ tiene tres H iguales.']],'El C3 está unido a H, CH₃ y dos −CH₂CH₃ iguales → <b>no es quiral</b>.'),
Q(I,null,'Las "grasas trans" de algunos alimentos procesados tienen ese nombre por un tipo de isomería. ¿Cuál?',[['Isomería geométrica (cis/trans)'],['Isomería de cadena','"Trans" se refiere a la posición de los grupos respecto al doble enlace.'],['Isomería óptica','La óptica se debe a carbonos quirales, no a dobles enlaces.'],['Isomería de función','Siguen siendo ácidos grasos.']],'En las grasas trans los grupos están en lados opuestos del C=C: <b>isomería geométrica</b>.'),
Q(I,null,'El <b>but-1-ino</b> (CH≡C−CH₂−CH₃) y el <b>buta-1,3-dieno</b> (CH₂=CH−CH=CH₂), ambos C₄H₆, son isómeros…',[['de función'],['de posición','No es el mismo grupo en otro lugar: un triple enlace frente a dos dobles.'],['de cadena','Las dos cadenas son lineales de 4 C.'],['No son isómeros','Los dos son C₄H₆.']],'Alquino frente a dieno con la misma fórmula → isómeros <b>de función</b>.')
];

/* ── Práctica en las páginas ─────────────────────────────────────────── */
function barajar(a){a=a.slice();for(var i=a.length-1;i>0;i--){var j=Math.floor(Math.random()*(i+1)),t=a[i];a[i]=a[j];a[j]=t;}return a;}
function practica(box,topic,n,titulo){
  if(typeof box==='string')box=document.getElementById(box);if(!box)return;
  var pool=B.filter(function(q){return q.topic===topic;});
  var qs=barajar(pool).slice(0,n||6),first=qs.map(function(){return null;}),id='fp'+Math.random().toString(36).slice(2,7);
  var h='<div class="prac-head"><div class="prac-title">✏️ '+(titulo||'Practica')+'</div><div class="prac-score" id="'+id+'-s" aria-live="polite"></div></div>';
  qs.forEach(function(q,i){
    var opts=barajar(q.opts.map(function(t,j){return j;}));
    h+='<div class="pq" data-i="'+i+'"><div class="pq-n">Pregunta '+(i+1)+' de '+qs.length+'</div><div class="pq-q">'+q.q+'</div>'+
      (q.mol&&F[q.mol]?'<div class="pq-fig"><div class="fig">'+F[q.mol]()+'</div></div>':'')+
      '<div class="pq-opts">'+opts.map(function(j){return '<button type="button" class="opt" data-o="'+j+'">'+q.opts[j]+'</button>';}).join('')+'</div>'+
      '<div class="pq-fb" aria-live="polite"></div></div>';
  });
  h+='<div class="links-row"><button type="button" class="btn-sm fp-otra">🔀 Otras '+qs.length+' preguntas</button><a class="btn-sm" href="juego.html?tema='+topic+'" style="text-decoration:none">🎮 Jugar con las '+pool.length+' preguntas del tema</a></div>';
  box.innerHTML=h;
  function score(){var d=first.filter(function(x){return x!==null;}).length,ok=first.filter(function(x){return x===true;}).length;
    document.getElementById(id+'-s').textContent='Al primer intento: '+ok+' de '+qs.length+(d<qs.length?' · faltan '+(qs.length-d):' · ¡terminaste!');}
  score();
  box.onclick=function(e){
    var b=e.target.closest('button');if(!b)return;
    if(b.classList.contains('fp-otra')){practica(box,topic,n,titulo);box.scrollIntoView({behavior:'smooth',block:'start'});return;}
    if(!b.classList.contains('opt')||b.disabled)return;
    var card=b.closest('.pq'),i=+card.dataset.i,q=qs[i],j=+b.dataset.o,fb=card.querySelector('.pq-fb'),ok=q.opts[j]===q.ans;
    if(first[i]===null)first[i]=ok;
    if(ok){b.classList.add('si');card.querySelectorAll('.opt').forEach(function(x){x.disabled=true;});card.classList.add('done-ok');
      fb.className='pq-fb show ok';fb.innerHTML='<span class="h">✓ ¡Correcto!</span>'+q.expl;}
    else{b.classList.add('no');b.disabled=true;fb.className='pq-fb show fail';fb.innerHTML='<span class="h">✗ «'+q.opts[j]+'» no es correcto — inténtalo otra vez</span>'+(q.optfb[j]||'');}
    score();
  };
}


/* ── Modelos 3D de bolas y barras (hibridación, giro de enlaces) ─────────
   mol3d(svg, modelo, op): dibuja y hace girar un modelo {at:[{x,y,z,el}],
   bd:[[i,j,orden]], lobes:[{at,d:[x,y,z],c}], lab:[{at,t,dy}]} dentro de
   un <svg viewBox="-150 -110 300 220">. Se puede arrastrar con el dedo o el
   ratón; mientras se toca, deja de girar solo. modelo puede ser una
   función (se vuelve a leer en cada cuadro, para modelos que cambian). */
var ELC={C:['#475569','#1e293b'],H:['#ffffff','#cbd5e1'],O:['#f87171','#b91c1c'],X:['#86efac','#15803d'],M:['#7dd3fc','#0369a1']};
var nGrad=0;
function mol3d(svg,modelo,op){
  op=op||{};var S=op.escala||62,ay=op.ay||0.5,ax=op.ax==null?-0.35:op.ax,pausa=false,drag=null,vivo=true;
  var quieto=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;
  var g='g'+(nGrad++),defs='<defs>'+Object.keys(ELC).map(function(k){return '<radialGradient id="'+g+k+'" cx="35%" cy="30%" r="70%"><stop offset="0" stop-color="'+ELC[k][0]+'"/><stop offset="1" stop-color="'+ELC[k][1]+'"/></radialGradient>';}).join('')+'</defs>';
  function pr(p){
    var ca=Math.cos(ay),sa=Math.sin(ay),cb=Math.cos(ax),sb=Math.sin(ax);
    var x=p[0]*ca+p[2]*sa,z=-p[0]*sa+p[2]*ca,y=p[1]*cb-z*sb,z2=p[1]*sb+z*cb,k=1+z2*0.14;
    return {x:x*S*k,y:-y*S*k,z:z2,k:k};
  }
  function dibuja(){
    var m=typeof modelo==='function'?modelo():modelo,P=m.at.map(function(a){return pr([a.x,a.y,a.z]);}),it=[];
    (m.bd||[]).forEach(function(b){var p=P[b[0]],q=P[b[1]];it.push({z:(p.z+q.z)/2-0.01,h:function(){
      var dx=q.x-p.x,dy=q.y-p.y,L=Math.hypot(dx,dy)||1,ox=-dy/L,oy=dx/L,o=b[2]||1,s='',w=b[3]||'#94a3b8';
      var offs=o===1?[0]:o===2?[-4,4]:[-6,0,6];
      offs.forEach(function(f){s+='<line x1="'+(p.x+ox*f).toFixed(1)+'" y1="'+(p.y+oy*f).toFixed(1)+'" x2="'+(q.x+ox*f).toFixed(1)+'" y2="'+(q.y+oy*f).toFixed(1)+'" stroke="'+w+'" stroke-width="'+(o===1?6:3.6)*((p.k+q.k)/2)+'" stroke-linecap="round"/>';});
      return s;}});});
    (m.lobes||[]).forEach(function(l){var a=m.at[l.at],len=l.len||0.62,c=pr([a.x+l.d[0]*len,a.y+l.d[1]*len,a.z+l.d[2]*len]),r=(l.r||0.3)*S*c.k;
      it.push({z:c.z,h:function(){return '<circle cx="'+c.x.toFixed(1)+'" cy="'+c.y.toFixed(1)+'" r="'+r.toFixed(1)+'" fill="'+(l.c||'#a78bfa')+'" fill-opacity="'+(l.op||0.45)+'" stroke="'+(l.c||'#7c3aed')+'" stroke-opacity=".6"/>';}});});
    m.at.forEach(function(a,i){var p=P[i],r=(a.el==='H'?0.2:0.32)*S*p.k*(a.r||1);it.push({z:p.z,h:function(){
      return '<circle cx="'+p.x.toFixed(1)+'" cy="'+p.y.toFixed(1)+'" r="'+r.toFixed(1)+'" fill="url(#'+g+(ELC[a.el]?a.el:'C')+')" stroke="rgba(15,23,42,.35)" stroke-width="1"/>'+
        (a.el==='H'?'':'<text x="'+p.x.toFixed(1)+'" y="'+(p.y+0.5).toFixed(1)+'" text-anchor="middle" dominant-baseline="central" font-family="Outfit,sans-serif" font-weight="800" font-size="'+(11*p.k).toFixed(1)+'" fill="#fff">'+(a.lt||a.el)+'</text>');}});});
    it.sort(function(a,b){return a.z-b.z;});
    var lab=(m.lab||[]).map(function(l){var p=P[l.at];return '<text x="'+p.x.toFixed(1)+'" y="'+(p.y+(l.dy||-26)).toFixed(1)+'" text-anchor="middle" font-family="JetBrains Mono,monospace" font-weight="800" font-size="12" fill="'+(l.c||'#0d2233')+'" paint-order="stroke" stroke="#fff" stroke-width="4">'+l.t+'</text>';}).join('');
    svg.innerHTML=defs+it.map(function(x){return x.h();}).join('')+lab+(m.extra||'');
  }
  var last=performance.now();
  function tick(now){if(!vivo)return;var dt=Math.min(.1,(now-last)/1000);last=now;
    if(op.gira!==false&&!pausa&&!drag&&!quieto&&!document.hidden)ay+=dt*(op.vel||0.6);
    dibuja();requestAnimationFrame(tick);}
  svg.addEventListener('pointerdown',function(e){drag={x:e.clientX,y:e.clientY,ay:ay,ax:ax};try{svg.setPointerCapture(e.pointerId);}catch(_){}});
  svg.addEventListener('pointermove',function(e){if(!drag)return;ay=drag.ay+(e.clientX-drag.x)*0.012;ax=Math.max(-1.4,Math.min(1.4,drag.ax+(e.clientY-drag.y)*0.01));if(quieto)dibuja();});
  ['pointerup','pointercancel'].forEach(function(t){svg.addEventListener(t,function(){drag=null;});});
  svg.addEventListener('pointerenter',function(){pausa=true;});
  svg.addEventListener('pointerleave',function(){pausa=false;});
  svg.style.cursor='grab';svg.style.touchAction='none';
  dibuja();requestAnimationFrame(tick);
  return {redibuja:dibuja,angulo:function(a,b){ay=a;if(b!=null)ax=b;dibuja();},pausa:function(v){pausa=v;}};
}
/* Modelos de las tres hibridaciones */
var R3=Math.sqrt(3);
var MOD={
  sp3:{at:[{x:0,y:0,z:0,el:'C'},{x:0,y:1.1,z:0,el:'H'},{x:1.04,y:-0.37,z:0,el:'H'},{x:-0.52,y:-0.37,z:0.9,el:'H'},{x:-0.52,y:-0.37,z:-0.9,el:'H'}],bd:[[0,1],[0,2],[0,3],[0,4]]},
  sp2:{at:[{x:-0.67,y:0,z:0,el:'C'},{x:0.67,y:0,z:0,el:'C'},{x:-1.22,y:0.95,z:0,el:'H'},{x:-1.22,y:-0.95,z:0,el:'H'},{x:1.22,y:0.95,z:0,el:'H'},{x:1.22,y:-0.95,z:0,el:'H'}],bd:[[0,1,2],[0,2],[0,3],[1,4],[1,5]],
       lobes:[{at:0,d:[0,0,1]},{at:0,d:[0,0,-1]},{at:1,d:[0,0,1]},{at:1,d:[0,0,-1]}]},
  sp:{at:[{x:-0.6,y:0,z:0,el:'C'},{x:0.6,y:0,z:0,el:'C'},{x:-1.62,y:0,z:0,el:'H'},{x:1.62,y:0,z:0,el:'H'}],bd:[[0,1,3],[0,2],[1,3]],
      lobes:[{at:0,d:[0,1,0],r:.24},{at:0,d:[0,-1,0],r:.24},{at:1,d:[0,1,0],r:.24},{at:1,d:[0,-1,0],r:.24},{at:0,d:[0,0,1],r:.24,c:'#f9a8d4'},{at:0,d:[0,0,-1],r:.24,c:'#f9a8d4'},{at:1,d:[0,0,1],r:.24,c:'#f9a8d4'},{at:1,d:[0,0,-1],r:.24,c:'#f9a8d4'}]}
};

window.FUND_FIG=F;
window.FUND_BANCO=B;
window.FUND_TOPICS=[H,T,C,I];
window.FUND={mol3d:mol3d,MOD:MOD,fig:F,banco:B,practica:practica,semi:semi,anillo:anillo,cajas:cajas,geo:{sp3:geoSp3,sp2:geoSp2,sp:geoSp},TIPO:TIPO};
})();
