/* ════════════════════════════════════════════════════════════════════════
   saber-icfes.js — Modelo basado en evidencias de la prueba Saber 11.º de
   Ciencias Naturales (Icfes) para las evaluaciones del panel docente.
   Es el MISMO archivo en ChromaNom, IonNom y BioNom (como retos.js y
   extras.js): si se cambia en uno, copiarlo a los otros dos.

   Qué hace:
   1. COMP: las tres competencias de la prueba con sus afirmaciones, tal como
      las publica el Icfes (Cuadernillo de preguntas Saber 11.º, 2026).
   2. competencia(q) / afirmacion(q): devuelve la competencia y la afirmación
      de una pregunta. Si la pregunta trae c:'uso'|'exp'|'ind' o af, se
      respeta; si no, se estima con palabras clave del enunciado (en la
      matriz sale marcada como «estimada»).
   3. elegir(pool,n,r,op): escoge n preguntas repartidas entre las tres
      competencias (meta parecida al cuadernillo oficial: 30 % uso, 35 %
      explicación, 35 % indagación), con prioridad a las preguntas oficiales
      del Icfes (hasta la mitad de la prueba) y a las que tienen contexto
      (situación, tabla o gráfica).
   4. Preguntas oficiales (window.ICFES_DATOS, en icfes-datos.js de cada
      sitio): figuras, tablas, crédito de cada pregunta y matriz de la
      evaluación para el docente (sin respuestas).
   ════════════════════════════════════════════════════════════════════════ */
(function(){
'use strict';
var AF={
  I1:'Identificar las características de algunos fenómenos de la naturaleza con base en el análisis de información y en conceptos propios del conocimiento científico.',
  I2:'Asociar fenómenos naturales con conceptos propios del conocimiento científico.',
  I3:'Identificar características de algunos procesos que se dan en los organismos para comprender la dinámica de lo vivo.',
  E1:'Explicar cómo ocurren algunos fenómenos de la naturaleza con base en observaciones, patrones y conceptos propios del conocimiento científico.',
  E2:'Modelar fenómenos de la naturaleza con base en el análisis de variables, la relación entre dos o más conceptos del conocimiento científico y de la evidencia derivada de investigaciones científicas.',
  E3:'Analizar el potencial del uso de recursos naturales o artefactos y sus efectos sobre el entorno y la salud, así como las posibilidades de desarrollo para las comunidades.',
  N1:'Comprender que a partir de la investigación científica se construyen explicaciones sobre el mundo natural.',
  N2:'Derivar conclusiones para algunos fenómenos de la naturaleza basándose en conocimientos científicos y en la evidencia de su propia investigación y la de otros.',
  N3:'Utilizar algunas habilidades de pensamiento y de procedimiento para evaluar predicciones.',
  N4:'Observar y relacionar patrones en los datos para evaluar las predicciones.'
};
var COMP={
  uso:{n:'Uso comprensivo del conocimiento científico',corto:'Uso comprensivo',af:['I1','I2','I3'],
       que:'Comprender y usar nociones, conceptos y teorías de las ciencias para resolver problemas.'},
  exp:{n:'Explicación de fenómenos',corto:'Explicación',af:['E1','E2','E3'],
       que:'Construir explicaciones y modelos de cómo ocurren los fenómenos, y valorar sus efectos en el ambiente y la salud.'},
  ind:{n:'Indagación',corto:'Indagación',af:['N1','N2','N3','N4'],
       que:'Plantear preguntas y procedimientos, analizar datos (tablas y gráficas), evaluar predicciones y derivar conclusiones.'}
};
var COMPONENTE={Q:'Químico',B:'Biológico',F:'Físico',CTS:'Ciencia, tecnología y sociedad'};
// Meta de cada competencia en una evaluación (cuadernillo 2026: 13 uso,
// 18 explicación y 19 indagación de 50 preguntas).
var META={uso:0.3,exp:0.35,ind:0.35};
var CITA='Icfes. (2026). Prueba Ciencias Naturales. Cuadernillo de preguntas. Saber 11.º. Bogotá D. C.: Dirección de Evaluación, Icfes. https://www.icfes.gov.co';

function txt(q){return String((q.ctx||'')+' '+(q.q||'')).replace(/<[^>]+>/g,' ');}
function stem(q){return String(q.q||q.ctx||'').replace(/<[^>]+>/g,' ');}
var RX_IND=/hip[oó]tesis|experimento|ensayo|conclu(si[oó]n|ir|ye)|procedimiento|variable|dise[ñn]a|predicci[oó]n|predec|comprobar|verificar|control|qu[eé] se buscaba|pregunta.*(investiga|resolver)|mal planteado|evidencia (confirmar|apoya)|datos?\b|seg[uú]n la (tabla|gr[aá]fica)|de acuerdo con (la|los) (tabla|gr[aá]fica|datos|resultados)|resultados/i;
var RX_IND_CTX=/tabla|gr[aá]fica|midi[oó]|registr[oó]|resultados|experimento|ensayo/i;
var RX_EXP=/por qu[eé]|explica|qu[eé] (le )?(pasar[ií]a|suceder[ií]a|ocurrir[ií]a|pasa|sucede|ocurre)|si se |cu[aá]l es la causa|efecto|consecuencia|modelo|representa/i;
function competencia(q){
  if(q.c==='uso'||q.c==='exp'||q.c==='ind')return q.c;
  if(q.af&&AF_COMP[q.af])return AF_COMP[q.af];
  var s=stem(q),t=txt(q);
  if(RX_IND.test(s)||(RX_IND_CTX.test(q.ctx||'')&&/conclu|qu[eé] se puede|afirmar|indica/i.test(s)))return 'ind';
  if(RX_EXP.test(s))return 'exp';
  if(/por qu[eé]/i.test(t))return 'exp';
  return 'uso';
}
var AF_COMP={};Object.keys(COMP).forEach(function(c){COMP[c].af.forEach(function(a){AF_COMP[a]=c;});});
function afirmacion(q){
  if(q.af&&AF[q.af])return {cod:q.af,t:AF[q.af],est:false};
  var c=competencia(q),s=stem(q),t=txt(q),k;
  if(c==='ind'){
    if(/tabla|gr[aá]fica|datos|patr[oó]n|tendencia/i.test(t)&&/predic|hip[oó]tesis|relaci[oó]n/i.test(s))k='N4';
    else if(/conclu|qu[eé] se puede (afirmar|concluir)|indica/i.test(s))k='N2';
    else if(/predic|hip[oó]tesis|procedimiento|dise[ñn]|mal planteado|control|comprobar|verificar|medir/i.test(s))k='N3';
    else if(/pregunta|investiga|qu[eé] se buscaba|ciencia/i.test(s))k='N1';
    else k='N2';
  }else if(c==='exp'){
    if(/ambiente|salud|contamina|recurso|industria|comunidad|energ[ií]a renovable|residuo|basura|agua potable/i.test(t))k='E3';
    else if(/modelo|qu[eé] (le )?(pasar[ií]a|suceder[ií]a|ocurrir[ií]a)|si se /i.test(s))k='E2';
    else k='E1';
  }else{
    k=/qu[eé] (tipo|clase|nombre)|corresponde|se llama|nombre/i.test(s)?'I2':'I1';
  }
  return {cod:k,t:AF[k],est:true};
}
function componente(q,defecto){
  if(q.k&&COMPONENTE[q.k])return q.k;
  return defecto||'Q';
}

/* ── generador de números al azar: se usa el que pasa cada sitio ── */
function mezclar(a,r){a=a.slice();for(var i=a.length-1;i>0;i--){var j=Math.floor(r()*(i+1));var t=a[i];a[i]=a[j];a[j]=t;}return a;}
function tieneCtx(q){return !!(q.icfes||(q.ctx&&String(q.ctx).replace(/<[^>]+>/g,'').trim().length>25)||q.img||q.tabla||q.graf||q.fig||q.f);}
/* Escoge n preguntas del pool repartidas por competencia.
   op.prioIcfes (por defecto true): las oficiales del Icfes van primero.
   op.tema(q): función que devuelve el tema (para no repetir tema seguido).
   Devuelve las preguntas en orden mezclado. */
function elegir(pool,n,r,op){
  op=op||{};var prio=op.prioIcfes!==false;
  if(!n||!pool.length)return [];
  var cubo={uso:[],exp:[],ind:[]},mez=mezclar(pool,r);
  // Las oficiales tienen prioridad, pero como máximo la mitad de la prueba:
  // así cada versión trae preguntas oficiales distintas y también del banco.
  var top=[],K=Math.ceil(n/2);
  if(prio)mez.forEach(function(q){if(q.icfes&&top.length<K)top.push(q);});
  function pri(q){return (top.indexOf(q)>=0?0:2)+(tieneCtx(q)?0:1);}
  mez.forEach(function(q){cubo[competencia(q)].push(q);});
  Object.keys(cubo).forEach(function(c){
    // estable: primero oficiales, luego con contexto, luego el resto
    cubo[c]=cubo[c].map(function(q,i){return {q:q,i:i,p:pri(q)};})
      .sort(function(a,b){return a.p-b.p||a.i-b.i;}).map(function(x){return x.q;});
  });
  // cupo de cada competencia
  var cup={},tot=0;['uso','exp','ind'].forEach(function(c){cup[c]=Math.floor(n*META[c]);tot+=cup[c];});
  var orden=['ind','exp','uso'],k=0;while(tot<n){cup[orden[k%3]]++;tot++;k++;}
  var out=[];
  ['uso','exp','ind'].forEach(function(c){out=out.concat(cubo[c].splice(0,cup[c]));});
  // si una competencia no alcanzó, se completa con las que sobran
  var resto=mezclar(cubo.ind.concat(cubo.exp,cubo.uso),r)
    .map(function(q,i){return {q:q,i:i,p:pri(q)};})
    .sort(function(a,b){return a.p-b.p||a.i-b.i;}).map(function(x){return x.q;});
  while(out.length<n&&resto.length)out.push(resto.shift());
  return mezclar(out,r);
}
function resumen(qs){
  var m={uso:0,exp:0,ind:0};qs.forEach(function(q){m[competencia(q)]++;});return m;
}

/* ── HTML de las preguntas oficiales ── */
function e(s){return String(s==null?'':s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');}
// Ancho y alto (px) de cada figura recortada del cuadernillo.
var DIM={"q01-ctx.png":[128,146],"q01-ops.png":[900,192],"q02-ctx.png":[900,197],"q05-ctx.png":[436,367],"q08-ctx.png":[900,297],"q10-ops.png":[900,492],"q19-ctx.png":[445,658],"q21-ctx.png":[900,509],"q24-ops.png":[900,641],"q27-ctx.png":[267,283],"q28-ctx.png":[547,298],"q29-ctx.png":[389,319],"q30-ctx.png":[440,251],"q35-ctx.png":[501,375],"q37-ctx.png":[900,382],"q39-ctx.png":[611,389],"q41-ctx.png":[900,234],"q41-ops.png":[885,440],"q44-ops.png":[900,499],"q47-ctx.png":[900,386],"q49-ctx.png":[792,400],"q50-t1.png":[418,536],"q50-t2.png":[900,236]};
function base(){return (window.ICFES_DATOS&&window.ICFES_DATOS.base)||'';}
function tablaHTML(t){
  if(!t)return '';
  return '<table class="icfes-tab"><thead><tr>'+t[0].map(function(c){return '<th>'+e(c)+'</th>';}).join('')+'</tr></thead><tbody>'+
    t.slice(1).map(function(f){return '<tr>'+f.map(function(c){return '<td>'+e(c)+'</td>';}).join('')+'</tr>';}).join('')+'</tbody></table>';
}
function imgsHTML(l,cls){
  if(!l)return '';
  // Tamaño fijo (de DIM): la paginación mide la hoja antes de que la imagen
  // cargue, y sin tamaño la figura se salía de la hoja.
  var mx=cls==='ops'?300:230;
  return [].concat(l).map(function(s){var d=DIM[s],w='';
    if(d){var ancho=Math.round(Math.min(d[0]*0.62,mx*d[0]/d[1]));w=' width="'+d[0]+'" height="'+d[1]+'" style="width:'+ancho+'px"';}
    return '<div class="icfes-fig'+(cls?' '+cls:'')+'"><img src="'+e(base()+s)+'"'+w+' alt="Figura de la pregunta del Icfes"></div>';}).join('');
}
// Lo que va entre el contexto y el enunciado: tablas y figuras.
/* Gráfica sencilla en SVG (sin librerías) para las preguntas de indagación:
   graf:{tipo:'lin'|'bar', x:[categorías], y:[valores] o series:[{n,y:[…]}],
         ex:'título del eje x', ey:'título del eje y', ymin:0}.
   Lleva ancho y alto fijos para que la paginación mida bien la hoja. */
function numTxt(v){return String(Math.round(v*100)/100).replace('.',',');}
function grafHTML(g){
  if(!g||!g.x)return '';
  var W=300,H=176,L=46,R=10,T=16,B=48,ser=g.series||[{n:'',y:g.y}],bar=g.tipo==='bar';
  var lo=g.ymin||0,mx=lo;ser.forEach(function(z){z.y.forEach(function(v){if(v>mx)mx=v;});});
  var rango=(mx-lo)||1,mag=Math.pow(10,Math.floor(Math.log10(rango/4))),paso=mag;
  [1,2,2.5,5,10].some(function(m){paso=m*mag;return rango/paso<=5;});
  var top=lo+Math.ceil((mx-lo)/paso-1e-9)*paso,n=g.x.length;
  var pw=W-L-R,ph=H-T-B;
  function X(i){return bar?L+pw*(i+0.5)/n:L+pw*(n===1?0.5:i/(n-1))*0.9+pw*0.05;}
  function Y(v){return T+ph-(v-lo)/(top-lo)*ph;}
  var col=['#1f4e79','#c55a11','#2e7d32'],o='';
  for(var t=lo;t<=top+1e-9;t+=paso){o+='<line x1="'+L+'" x2="'+(W-R)+'" y1="'+Y(t).toFixed(1)+'" y2="'+Y(t).toFixed(1)+'" stroke="#ddd"/>'+
    '<text x="'+(L-5)+'" y="'+(Y(t)+3).toFixed(1)+'" text-anchor="end" font-size="9">'+numTxt(t)+'</text>';}
  o+='<line x1="'+L+'" x2="'+L+'" y1="'+T+'" y2="'+(T+ph)+'" stroke="#333"/><line x1="'+L+'" x2="'+(W-R)+'" y1="'+(T+ph)+'" y2="'+(T+ph)+'" stroke="#333"/>';
  g.x.forEach(function(c,i){o+='<text x="'+X(i).toFixed(1)+'" y="'+(T+ph+12)+'" text-anchor="middle" font-size="9">'+e(c)+'</text>';});
  var m=ser.length,bw=pw/n*0.7/(bar?m:1);
  ser.forEach(function(z,k){
    if(bar){z.y.forEach(function(v,i){var x0=X(i)-bw*m/2+k*bw;o+='<rect x="'+x0.toFixed(1)+'" y="'+Y(v).toFixed(1)+'" width="'+(bw*0.92).toFixed(1)+'" height="'+(T+ph-Y(v)).toFixed(1)+'" fill="'+col[k%3]+'"/>';});}
    else{o+='<polyline fill="none" stroke="'+col[k%3]+'" stroke-width="1.8"'+(k===1?' stroke-dasharray="5 3"':'')+' points="'+z.y.map(function(v,i){return X(i).toFixed(1)+','+Y(v).toFixed(1);}).join(' ')+'"/>'+
      z.y.map(function(v,i){return '<circle cx="'+X(i).toFixed(1)+'" cy="'+Y(v).toFixed(1)+'" r="2.6" fill="'+col[k%3]+'"/>';}).join('');}
  });
  if(g.ex)o+='<text x="'+(L+pw/2)+'" y="'+(H-12)+'" text-anchor="middle" font-size="10" font-weight="700">'+e(g.ex)+'</text>';
  if(g.ey)o+='<text transform="translate(11,'+(T+ph/2)+') rotate(-90)" text-anchor="middle" font-size="10" font-weight="700">'+e(g.ey)+'</text>';
  if(m>1)ser.forEach(function(z,k){o+='<rect x="'+(L+k*84)+'" y="1" width="9" height="7" fill="'+col[k%3]+'"/><text x="'+(L+k*84+12)+'" y="7.5" font-size="9">'+e(z.n)+'</text>';});
  return '<div class="icfes-fig icfes-graf"><svg xmlns="http://www.w3.org/2000/svg" width="'+W+'" height="'+H+'" viewBox="0 0 '+W+' '+H+'" style="width:'+W+'px;max-width:100%;height:auto;font-family:sans-serif" role="img" aria-label="Gráfica de datos de la pregunta">'+o+'</svg></div>';
}
// Lo que va entre el contexto y el enunciado: figuras, tablas y gráficas.
function extraHTML(q){return (q.icfes?imgsHTML(q.img):'')+tablaHTML(q.tabla)+grafHTML(q.graf);}
// Figura con las opciones A–D dibujadas (las opciones no se barajan).
function opsImgHTML(q){return q.imgOps?imgsHTML(q.imgOps,'ops'):'';}
function creditoHTML(q){
  if(!q.icfes)return '';
  return '<div class="icfes-cred">Pregunta '+q.icfes+' del <i>Cuadernillo de preguntas Saber 11.º, Prueba Ciencias Naturales</i> (Icfes, 2026). Uso académico, sin ánimo de lucro.</div>';
}
/* Matriz de la evaluación para el docente: competencia, afirmación y
   componente de cada pregunta (sin respuestas). nIni: número de la primera. */
/* La misma matriz partida en tablas de «porTabla» filas (cada una con su
   encabezado), para que la paginación pueda repartirla entre hojas. El
   reparto y las notas van en el último bloque. */
function matrizBloques(qs,nIni,defComp,porTabla){
  porTabla=porTabla||10;nIni=nIni||1;var out=[];
  for(var k=0;k<qs.length;k+=porTabla){
    var h=matrizHTML(qs.slice(k,k+porTabla),nIni+k,defComp);
    if(k+porTabla<qs.length)h=h.replace(/<\/table>[\s\S]*<\/div>$/,'</table></div>');
    out.push(h);
  }
  if(out.length>1){var r=resumen(qs),ult=out.length-1;
    out[ult]=out[ult].replace(/<p class="icfes-res"><b>Reparto:<\/b>[^<]*(<[^p][^>]*>[^<]*)*?<\/p>/,function(){return '<p class="icfes-res"><b>Reparto:</b> '+['uso','exp','ind'].map(function(c){return e(COMP[c].n)+': '+r[c];}).join(' · ')+'. Meta del Icfes: cerca de un tercio de cada una, con un poco más de indagación y explicación que de uso.</p>';});}
  return out;
}
function matrizHTML(qs,nIni,defComp){
  nIni=nIni||1;
  var r=resumen(qs),hay=qs.some(function(q){return q.icfes;});
  var h='<div class="icfes-mat"><table><thead><tr><th>#</th><th>Competencia</th><th>Afirmación (Icfes)</th><th>Componente</th><th>Fuente</th></tr></thead><tbody>';
  qs.forEach(function(q,i){
    var c=competencia(q),a=afirmacion(q);
    h+='<tr><td>'+(nIni+i)+'</td><td>'+e(COMP[c].corto)+'</td><td>'+e(a.t)+(a.est?' <small>(estimada)</small>':'')+'</td><td>'+e(COMPONENTE[componente(q,defComp)])+'</td><td>'+(q.icfes?'Icfes 2026, preg. '+q.icfes:'Banco del sitio')+'</td></tr>';
  });
  h+='</tbody></table><p class="icfes-res"><b>Reparto:</b> '+['uso','exp','ind'].map(function(c){return e(COMP[c].n)+': '+r[c];}).join(' · ')+
    '. Meta del Icfes: cerca de un tercio de cada una, con un poco más de indagación y explicación que de uso.</p>'+
    '<p class="icfes-res">Las afirmaciones son las del Icfes; las marcadas «estimada» se asignaron por el tipo de tarea que pide el enunciado.'+
    (hay?' Fuente de las preguntas oficiales: '+e(CITA):'')+'</p></div>';
  return h;
}
function citaHTML(qs){
  return qs.some(function(q){return q.icfes;})?'<p class="icfes-cita"><b>Créditos.</b> Las preguntas marcadas con su número de cuadernillo son preguntas oficiales tomadas sin cambios de: '+e(CITA)+' Se usan con fines académicos y sin ánimo de lucro, citando al Icfes como autor.</p>':'';
}
/* Convierte las preguntas oficiales al formato de cada sitio:
   - campo de tema: 't' (BioNom) o 'tema' (IonNom); ChromaNom las agrupa por tema.
   - o: opciones en el orden ORIGINAL del cuadernillo y r = índice de la
     correcta. fijo:true → no se barajan (así la clave coincide con la del Icfes). */
function preguntas(){
  var D=window.ICFES_DATOS;if(!D)return [];
  return D.items.map(function(x){
    var q={icfes:x.n,c:AF_COMP[x.af],af:x.af,k:x.k,ctx:x.ctx||'',q:x.q,o:x.o||['A','B','C','D'],r:'ABCD'.indexOf(x.r),fijo:true,
      img:x.img||null,imgOps:x.imgOps||null,tabla:x.tabla||null,exp:x.exp||'',p:x.p||null};
    q.t=x.t;q.tema=x.t;return q;
  });
}
/* ── Doble columna para las hojas impresas ──
   Antes las preguntas iban con columnas CSS balanceadas (o en filas de a
   dos): una pregunta larga (con tabla o figura) dejaba la otra columna en
   blanco. Ahora hay dos columnas reales que se llenan en orden: la
   izquierda hasta abajo y luego la derecha. El orden de las preguntas no
   cambia (la clave y la hoja de respuestas siguen coincidiendo).
   colocar(cuerpo,nodos,desde,forzar): pone nodos[desde…] en un contenedor
   de dos columnas al final de «cuerpo» mientras quepan en la hoja.
   Devuelve cuántos puso. Con forzar=true pone al menos uno aunque no quepa
   (para una hoja vacía con una pregunta más alta que la hoja). */
function desborda(c){return c.scrollHeight>c.clientHeight+1;}
// Si una pregunta con figura no cabe por poco, reduce la figura (hasta el
// 60 %) antes de mandarla a la otra columna u hoja. Si ni así cabe, la deja
// como estaba y devuelve false.
function encoger(nodo,cuerpo){
  var ims=[].slice.call(nodo.querySelectorAll('.icfes-fig img'));if(!ims.length)return false;
  var w0=ims.map(function(im){return im.getBoundingClientRect().width;});
  for(var f=0.9;f>=0.59;f-=0.1){
    ims.forEach(function(im,j){im.style.width=Math.round(w0[j]*f)+'px';});
    if(!desborda(cuerpo))return true;
  }
  ims.forEach(function(im,j){im.style.width=Math.round(w0[j])+'px';});
  return false;
}
function colocar(cuerpo,nodos,desde,forzar,op){
  op=op||{};
  var box=document.createElement('div');box.className='dcol';
  var cols=[document.createElement('div'),document.createElement('div')];
  cols.forEach(function(c){c.className='dcol-c';box.appendChild(c);});
  cuerpo.appendChild(box);
  var k=0,i=desde,n=0;
  while(i<nodos.length){
    cols[k].appendChild(nodos[i]);
    if(desborda(cuerpo)&&!encoger(nodos[i],cuerpo)){
      cols[k].removeChild(nodos[i]);
      // op.reordenar: si la pregunta no cabe en el hueco de esta columna, se
      // adelanta una de las siguientes (hasta 6 más allá) que sí quepa. El
      // que llama renumera después (renumerar) y arma clave, matriz y hoja
      // de respuestas con el orden final (orden).
      if(op.reordenar&&n>0){
        var hallado=-1;
        for(var j=i+1;j<nodos.length&&j<=i+6;j++){
          cols[k].appendChild(nodos[j]);
          var ok=!desborda(cuerpo);cols[k].removeChild(nodos[j]);
          if(ok){hallado=j;break;}
        }
        if(hallado>0){var mv=nodos.splice(hallado,1)[0];nodos.splice(i,0,mv);cols[k].appendChild(mv);i++;n++;continue;}
      }
      if(k===0){k=1;continue;}
      break;
    }
    i++;n++;
  }
  var forzado=false;
  if(!n&&forzar&&desde<nodos.length){cols[0].appendChild(nodos[desde]);n=1;i=desde+1;forzado=true;}
  // Pregunta muy alta (tabla ancha o figura grande) que no cupo en ninguna
  // columna: se prueba a todo el ancho, debajo de las columnas, donde ocupa
  // mucho menos alto. Después sigue otra pareja de columnas.
  if(n&&i<nodos.length&&!forzado){
    var alto=nodos[i];cols[1].appendChild(alto);var hc=alto.offsetHeight;cols[1].removeChild(alto);
    if(hc>cuerpo.clientHeight*0.35){
      balancear();
      alto.classList.add('dcol-ancho');cuerpo.appendChild(alto);
      if(desborda(cuerpo)&&!encoger(alto,cuerpo)){cuerpo.removeChild(alto);alto.classList.remove('dcol-ancho');}
      else{i++;n++;n+=colocar(cuerpo,nodos,i,false,op);return n;}
    }
  }
  if(!n)cuerpo.removeChild(box);
  else if(i>=nodos.length)balancear();
  function balancear(){
    // Se acabaron las preguntas en esta hoja: se reparten en orden entre las
    // dos columnas para que queden parejas (sin una columna medio vacía) y
    // el espacio que sobra quede abajo, a todo el ancho, para el borrador.
    var todos=[].slice.call(cols[0].children).concat([].slice.call(cols[1].children));
    // una sola pregunta al final: a todo el ancho, para no dejar la
    // columna de al lado vacía
    if(todos.length===1){var u=todos[0];u.classList.add('dcol-ancho');box.parentNode.insertBefore(u,box);box.parentNode.removeChild(box);return;}
    if(todos.length>1){
      var hs=todos.map(function(e){return e.offsetHeight;}),tot=hs.reduce(function(a,b){return a+b;},0),mejor=1,mh=1e9,acc=0;
      for(var j=1;j<todos.length;j++){acc+=hs[j-1];var m=Math.max(acc,tot-acc);if(m<mh){mh=m;mejor=j;}}
      todos.forEach(function(e,q){cols[q<mejor?0:1].appendChild(e);});
    }
  }
  return n;
}

/* Después de acomodar con reordenar: pone los números 1, 2, 3… en el
   orden en que quedaron las preguntas (orden de lectura: columna izquierda
   y luego derecha). sel: selector del número dentro de cada pregunta;
   fmt(n): texto del número. Devuelve el orden final (data-k de cada nodo). */
function renumerar(raiz,selPreg,selNum,fmt,n0){
  var orden=[],n=n0||1;
  [].forEach.call(raiz.querySelectorAll(selPreg),function(q){
    var e=q.querySelector(selNum);if(e)e.textContent=fmt?fmt(n):String(n);n++;
    if(q.getAttribute('data-k')!=null)orden.push(+q.getAttribute('data-k'));
  });
  return orden;
}
// Reordena una lista según «orden» (índices originales), sin perder nada.
function aplicarOrden(lista,orden){
  if(!orden||orden.length!==lista.length)return lista;
  return orden.map(function(k){return lista[k];});
}

// Estilos (una sola vez)
function css(){
  if(document.getElementById('icfes-css'))return;
  var s=document.createElement('style');s.id='icfes-css';
  s.textContent='.icfes-fig{margin:6px 0;text-align:center;break-inside:avoid}.icfes-fig img{max-width:100%;height:auto}'+
    '.icfes-tab{border-collapse:collapse;margin:6px auto;font-size:.86em}.icfes-tab th,.icfes-tab td{border:1px solid #888;padding:2px 7px;text-align:center}.icfes-tab th{background:#eef2f6}'+
    '.icfes-cred{font-size:.72em;color:#555;font-style:italic;margin-top:3px}'+
    '.icfes-mat table{border-collapse:collapse;width:100%;font-size:.78em}.icfes-mat th,.icfes-mat td{border:1px solid #999;padding:3px 5px;vertical-align:top;text-align:left}.icfes-mat th{background:#eef2f6}'+
    '.icfes-res,.icfes-cita{font-size:.78em;margin:6px 0}'+
    '.dcol-ancho{border-top:1px solid #ddd;border-bottom:1px solid #ddd;padding:4px 0;margin:2px 0 6px}.dcol{display:flex;gap:16px;align-items:stretch;margin:2px 0 6px}.dcol-c{flex:1 1 0;min-width:0}.dcol-c+.dcol-c{border-left:1px solid #ddd;padding-left:16px}'+
    '.dcol .icfes-tab{font-size:.72em;width:100%;table-layout:fixed}.dcol .icfes-tab th,.dcol .icfes-tab td{padding:1px 2px;overflow-wrap:anywhere;hyphens:auto}';
  (document.head||document.documentElement).appendChild(s);
}
if(typeof document!=='undefined'){if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',css);else css();}

window.SABER_ICFES={AF:AF,COMP:COMP,COMPONENTE:COMPONENTE,META:META,CITA:CITA,
  competencia:competencia,afirmacion:afirmacion,componente:componente,elegir:elegir,resumen:resumen,
  extraHTML:extraHTML,opsImgHTML:opsImgHTML,creditoHTML:creditoHTML,matrizHTML:matrizHTML,citaHTML:citaHTML,
  tablaHTML:tablaHTML,grafHTML:grafHTML,preguntas:preguntas,colocar:colocar,matrizBloques:matrizBloques,renumerar:renumerar,aplicarOrden:aplicarOrden};
})();
