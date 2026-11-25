/* mdec-saber.js — Preguntas de selección múltiple del método MDEC (modelo propio del docente) para
   evaluaciones, talleres, guías y el «Banco de preguntas». Se arman solas, siempre iguales, a partir de
   las moléculas de mdec-moleculas.js (generado desde el Generador). Llevan mdec:true: NO se enlazan a
   ningún DBA ni estándar (regla del docente, 26-11-2026). Los colores del método van siempre (q.html).
   Tres tipos por tema (una molécula distinta en cada pregunta, para que no se delaten entre sí):
     1. Reconocer: ¿a qué parte del modelo pertenece el fragmento «…» del nombre?
     2. Fragmento: en el nombre «…», ¿qué fragmento indica la cadena principal / los sustituyentes…?
     3. Armar: con la estructura dibujada y las fichas de colores, ¿cuál es su nombre? Las opciones son
        nombres de compuestos reales que cambian una sola ficha.
   Ajustado con la auditoría de expertos en química orgánica y evaluación (26-11-2026).
   Se carga después de docente-datos.js y de mdec-moleculas.js. */
(function(){
'use strict';
var L=window.MDEC_MOLS,D=window.DOCENTE_DATOS;if(!Array.isArray(L)||!D||!D.SABER)return;
var TEMA={alcanos:'alcanos',alquenos:'alquenos',alquinos:'alquenos',benceno:'aromaticos',alcoholes:'alcoholes',eteres:'alcoholes',
  aldehidos:'carbonilos',cetonas:'carbonilos',acidos:'acidos',esteres:'acidos',aminas:'nitrogenados',amidas:'nitrogenados',nitrilos:'nitrogenados'};
var PARTE={r:'① Sustituyentes',c:'② Cadena principal',i:'③ Insaturación (o saturación)',g:'④ Grupo funcional'};
var QUE={r:'los sustituyentes',c:'la cadena principal',i:'la insaturación (o la saturación)',g:'el grupo funcional'};
var POR_TIPO=4;
/* Colores del método (la parte más importante del MDEC), los mismos de las etiquetas del sitio (.cn-chip):
   [texto, borde, fondo] de ① sustituyentes, ② cadena principal, ③ insaturaciones y ④ grupo funcional */
var COL={r:['#0e7490','#0891b2','#ecfeff'],c:['#14532d','#166534','#f0fdf4'],i:['#92400e','#b45309','#fffbeb'],g:['#9a4a78','#CC79A7','#fdf2f8']};
function esc(t){return String(t).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');}
function chip(t,cls){var c=COL[cls];return '<span style="display:inline-block;padding:0 7px;margin:1px;border-radius:999px;font-weight:700;color:'+c[0]+';border:1.5px solid '+c[1]+';background:'+c[2]+'">'+esc(t)+'</span>';}
function nombreColor(p){return '<span style="white-space:nowrap">'+p.map(function(x){return chip(x[0].trim(),x[1]);}).join('')+'</span>';}
var LEYENDA=chip('① sustituyentes','r')+' '+chip('② cadena principal','c')+' '+chip('③ insaturación o saturación','i')+' '+chip('④ grupo funcional','g');
var PARTE_HTML={r:chip(PARTE.r,'r'),c:chip(PARTE.c,'c'),i:chip(PARTE.i,'i'),g:chip(PARTE.g,'g')};
function fr(t){return '«'+String(t).trim()+'»';}
var semilla=11;function azar(){semilla=(semilla*16807)%2147483647;return semilla/2147483647;}
function barajar(a){a=a.slice();for(var i=a.length-1;i>0;i--){var j=Math.floor(azar()*(i+1));var t=a[i];a[i]=a[j];a[j]=t;}return a;}
function firma(m){return m.p.map(function(p){return p[1];}).join('');}
/* nombres reales que difieren en una sola ficha (misma secuencia de partes): distractores con sentido */
function vecinos(m){
  var f=firma(m);
  /* primero los de la misma familia: así un distractor no se descarta solo porque tenga un oxígeno que la estructura no tiene */
  return L.filter(function(x){if(x.k===m.k||x.n===m.n||firma(x)!==f)return false;var dif=0;for(var i=0;i<m.p.length;i++)if(m.p[i][0]!==x.p[i][0])dif++;return dif===1;})
    .sort(function(a,b){return (a.t===m.t?0:1)-(b.t===m.t?0:1);});
}
var porTema={};L.forEach(function(m){var t=TEMA[m.t];if(!t)return;(porTema[t]=porTema[t]||[]).push(m);});
var nuevas=[];
Object.keys(porTema).forEach(function(t){
  /* primero los nombres con más partes y se intercalan las familias del tema */
  var fams={};porTema[t].forEach(function(m){(fams[m.t]=fams[m.t]||[]).push(m);});
  Object.keys(fams).forEach(function(f){fams[f].sort(function(a,b){return (b.p.length-a.p.length)||(a.k<b.k?-1:1);});});
  var lista=[],ks=Object.keys(fams).sort(),i0=0,hay=true;
  while(hay){hay=false;ks.forEach(function(f){if(fams[f][i0]){lista.push(fams[f][i0]);hay=true;}});i0++;}
  var cuenta={rec:0,fra:0,arm:0},turno=0;
  lista.forEach(function(m){
    var textos=m.p.map(function(p){return p[0];}),clsDe=m.p.map(function(p){return p[1];}),eter=(m.t==='eteres'),ester=(m.t==='esteres');
    var hecho=false;
    for(var kk=0;kk<3&&!hecho;kk++){
      var tipo=['arm','rec','fra'][(turno+kk)%3];
      if(tipo==='rec'&&cuenta.rec<POR_TIPO&&!eter){
        /* fragmentos con contenido (no la «o» final ni la «an» sola) */
        var cand=m.p.filter(function(p){return p[0].trim().length>1&&!/^(an|o)$/.test(p[0].trim());});
        if(cand.length){var p=cand[Math.floor(azar()*cand.length)],ops=[PARTE[p[1]]].concat(['r','c','i','g'].filter(function(c){return c!==p[1];}).map(function(c){return PARTE[c];})),oh={};
          ops.forEach(function(x){var k=Object.keys(PARTE).filter(function(c){return PARTE[c]===x;})[0];oh[x]=PARTE_HTML[k];});
          nuevas.push({t:t,c:'uso',mdec:true,tipoMdec:'reconocer',
            ctx:'En el método MDEC el nombre IUPAC se lee en cuatro partes: ① sustituyentes, ② cadena principal, ③ insaturación (o saturación) y ④ grupo funcional.',
            q:'En el nombre «'+m.n+'», ¿a qué parte pertenece el fragmento '+fr(p[0])+'?',o:ops,
            exp:fr(p[0])+' es '+PARTE[p[1]]+' en «'+m.n+'».'+(ester?' En los ésteres, el método toma «de metilo», «de etilo»… como ① sustituyente.':''),
            html:{ctx:'En el método MDEC el nombre IUPAC se lee en cuatro partes, cada una con su color: '+LEYENDA+'.',
              q:'En el nombre <b>'+esc(m.n)+'</b>, ¿a qué parte pertenece el fragmento <b><u>'+esc(p[0].trim())+'</u></b>?',o:oh}});
          cuenta.rec++;hecho=true;}
      }
      if(tipo==='fra'&&cuenta.fra<POR_TIPO&&!eter&&m.p.length>=4){
        /* se pregunta por una parte que aparece una sola vez; el grupo funcional solo si no es la «o» de un hidrocarburo */
        var obj=['c','r','i','g'].filter(function(c){var n=clsDe.filter(function(x){return x===c;}).length;if(n!==1)return false;
          var tx=textos[clsDe.indexOf(c)].trim();return !(c==='g'&&tx==='o')&&!(c==='i'&&tx==='an');});
        if(obj.length){var c2=obj[cuenta.fra%obj.length],ok=textos[clsDe.indexOf(c2)];
          var otros=textos.filter(function(x){return x!==ok;}).map(function(x){return x.trim();}).filter(function(x,i,a){return x&&a.indexOf(x)===i;});
          if(otros.length>=3){
            nuevas.push({t:t,c:'uso',mdec:true,tipoMdec:'fragmento',
              ctx:'Con el método MDEC cada fragmento del nombre IUPAC dice algo de la estructura: ① sustituyentes, ② cadena principal, ③ insaturación (o saturación) y ④ grupo funcional.',
              q:'En el nombre «'+m.n+'», ¿qué fragmento indica '+QUE[c2]+'?',o:[fr(ok)].concat(otros.slice(0,3).map(fr)),
              exp:'En «'+m.n+'», '+fr(ok)+' es '+PARTE[c2]+'.',
              html:{ctx:'Con el método MDEC cada fragmento del nombre IUPAC dice algo de la estructura, y cada parte tiene su color: '+LEYENDA+'.',
                q:'En el nombre <b>'+esc(m.n)+'</b>, ¿qué fragmento indica '+chip(QUE[c2],c2)+'?'}});
            cuenta.fra++;hecho=true;}}
      }
      if(tipo==='arm'&&cuenta.arm<POR_TIPO&&!ester&&m.p.length>=3){
        var vv=vecinos(m),mismas=vv.filter(function(x){return x.t===m.t;});var vs=(mismas.length>=3?barajar(mismas):barajar(mismas).concat(barajar(vv.filter(function(x){return x.t!==m.t;})))).slice(0,3);
        if(vs.length===3){
          /* fichas: las del nombre más las que traen los nombres vecinos (sobran), todas con su color */
          var fichas=m.p.slice();vs.forEach(function(v){v.p.forEach(function(p){if(!fichas.some(function(f){return f[0]===p[0];}))fichas.push(p);});});
          fichas=barajar(fichas);var opsH={};opsH[m.n]=nombreColor(m.p);vs.forEach(function(v){opsH[v.n]=nombreColor(v.p);});
          nuevas.push({t:t,c:'uso',mdec:true,tipoMdec:'armar',gen:m.k,
            ctx:'Un estudiante quiere nombrar la estructura dibujada con fichas del método MDEC. Tiene estas fichas (algunas sobran): '+fichas.map(function(f){return fr(f[0]);}).join(', ')+'.',
            q:'¿Cuál es el nombre IUPAC de la estructura?',o:[m.n].concat(vs.map(function(v){return v.n;})),
            exp:'La estructura corresponde a «'+m.n+'». Las otras opciones son nombres de otros compuestos: cambian una ficha respecto al correcto.',
            html:{ctx:'Un estudiante quiere nombrar la estructura dibujada con fichas del método MDEC; cada ficha tiene el color de su parte ('+LEYENDA+'). Tiene estas fichas, y algunas sobran: '+fichas.map(function(f){return chip(f[0].trim(),f[1]);}).join(' ')+'.',o:opsH}});
          cuenta.arm++;hecho=true;}
      }
    }
    if(hecho)turno++;
  });
});
var S=D.SABER;
nuevas.forEach(function(q){if(Array.isArray(S))S.push(q);else (S[q.t]=S[q.t]||[]).push(q);});
window.MDEC_SABER=nuevas;
})();
