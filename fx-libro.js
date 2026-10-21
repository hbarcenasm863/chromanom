/* ════════════════════════════════════════════════════════════════════════
   ChromaNom — motor de fórmulas «tipo libro» (FX)
   Lo usan reacciones.html (ecuaciones de las tarjetas) y docente.html
   (ejercicios de reacción de guías, talleres y evaluaciones).
   Notación: ⟦arriba|base|abajo⟧ apila sustituyentes sobre un átomo;
   @ring / @chex / @cprop dibujan anillos; -[encima|debajo]-> y <=> son
   flechas con condiciones; «…» y ‹…› resaltan grupos.
   ════════════════════════════════════════════════════════════════════════ */
const FX=(function(){
  const pts=(cx,cy,r,n,a0)=>Array.from({length:n},(_,i)=>{const a=(a0+360/n*i)*Math.PI/180;return [cx+r*Math.cos(a),cy+r*Math.sin(a)]});
  const path=v=>v.map((p,i)=>{const q=v[(i+1)%v.length];return `M${p[0].toFixed(2)} ${p[1].toFixed(2)}L${q[0].toFixed(2)} ${q[1].toFixed(2)}`}).join('');
  function hexSVG(kek){
    const c=[20,22],v=pts(20,22,16,6,-90);let d=path(v);
    if(kek)for(const i of [0,2,4]){const f=x=>[c[0]+(x[0]-c[0])*.74,c[1]+(x[1]-c[1])*.74],a=f(v[i]),b=f(v[(i+1)%6]);d+=`M${a[0].toFixed(2)} ${a[1].toFixed(2)}L${b[0].toFixed(2)} ${b[1].toFixed(2)}`}
    return `<svg class="fx-ring" viewBox="0 0 40 44" aria-hidden="true"><path d="${d}" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>`;
  }
  const SV={ring:hexSVG(true),chex:hexSVG(false),
    cprop:`<svg class="fx-cprop" viewBox="0 0 40 36" aria-hidden="true"><path d="${path(pts(20,20,15,3,-90))}" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>`};
  const esc=s=>s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  const txt=s=>esc(s)
    .replace(/_(\d+|n)/g,'<sub>$1</sub>')
    .replace(/\^(\d?[+\-−])/g,(m,a)=>'<sup>'+a.replace('-','−')+'</sup>')
    // «…» = grupo nuevo (rosado, .hn); ‹…› = enlace/átomo que se rompe
    // (naranja, .bp). Se abren y cierran por separado para que el resaltado
    // pueda envolver también un grupo apilado ⟦…⟧.
    .replace(/«/g,'<span class="hn">').replace(/»/g,'</span>')
    .replace(/‹/g,'<span class="bp">').replace(/›/g,'</span>');
  function part(p,kind){
    if(!p)return '';
    let dbl=false,lab=p;
    if(p[0]==='='){dbl=true;lab=p.slice(1)}
    else if(p.startsWith('«=')){dbl=true;lab='«'+p.slice(2)}
    const b=`<span class="fx-bd${dbl?' dbl':''}"></span>`,l=`<span class="fx-lab">${txt(lab)}</span>`;
    return kind==='u'?`<span class="fx-bu">${l}${b}</span>`:`<span class="fx-bl">${b}${l}</span>`;
  }
  function stack(s){
    const a=s.split('|'),base=mol(a[1]||'');
    return `<span class="fx-st${base.includes('<svg')?' rg':''}">${base}${part(a[0],'u')}${part(a[2],'d')}</span>`;
  }
  function mol(s){
    return s.split(/(⟦[^⟧]*⟧|@\w+)/).map(p=>{
      if(!p)return '';
      if(p[0]==='⟦')return stack(p.slice(1,-1));
      if(p[0]==='@')return SV[p.slice(1)]||'';
      return txt(p);
    }).join('');
  }
  function arrow(p){
    let a='',b='';const eqm=p.endsWith('<=>');
    if(p!=='->'&&p!=='<=>'){const m=p.slice(2,eqm?-4:-3).split('|');a=m[0]||'';b=m[1]||''}
    return arrowHTML(a,b,eqm);
  }
  const arrowHTML=(a,b,eqm)=>`<span class="fx-arr${eqm?' eqm':''}"><span class="ab">${mol(a||'')}</span>${eqm?'<i></i><i class="back"></i>':'<i></i>'}<span class="be">${mol(b||'')}</span></span>`;
  const terms=p=>p.split(/ \+ /).map(t=>`<span class="fx-t${(t.length>26&&!/[⟦@]/.test(t))?' w':''}">${mol(t)}</span>`).join('<span class="fx-pl">+</span>');
  function eq(s){
    const parts=s.split(/(-\[[^\]]*\](?:->|<=>)|->|<=>)/);let out='';
    parts.forEach((p,i)=>{
      if(i%2===1)out+=arrow(p);
      else if(p.trim()){
        const t=terms(p.trim());
        out+=(i===parts.length-1&&parts.length>1)?`<span class="fx-rhs" aria-label="Producto">${t}</span>`:t;
      }
    });
    return out;
  }
  return {eq,mol,terms,arrowHTML};
})();
// Texto con subíndices Unicode → notación FX: bonos "−" como raya larga,
// sustituyentes entre paréntesis sobre un C apilados encima, y los grupos
// carbonilo condensados (CHO, COOH, COO, COCl, CONH₂, −CO−) con el C=O dibujado.
function fxNorm(s){
  s=String(s||'').replace(/\s+/g,' ').trim().replace(/−/g,'—');
  s=s.replace(/(^|[^A-Za-z])(C(?:H[₂₃]?)?)([«‹]?)\(([^()]+)\)([»›]?)/g,(m,pre,at,o,inner,c)=>`${pre}⟦${o}${inner}${c}|${at}⟧`);
  s=s.replace(/CHO(?![A-Za-z₀-₉])/g,'⟦=O|C⟧H');
  // −CHBr− / −CH(«Cl»)− condensado → halógeno (u OH) colgando del CH
  s=s.replace(/—CH([«‹]?)(Br|Cl|I|X|OH)([»›]?)(?=—)/g,'—⟦$1$2$3|CH⟧');
  s=s.replace(/CO(?=[»›]?(?:O|Cl|NH|N|—|C|R|Nu))/g,'⟦=O|C⟧');
  // Un resaltado no puede cruzar un " + " (cada término es su propia caja):
  // se cierra antes y se reabre después.
  let out='',open='';
  for(let i=0;i<s.length;i++){
    const ch=s[i];
    if(ch==='«'||ch==='‹')open=ch; else if(ch==='»'||ch==='›')open='';
    if(open&&s.startsWith(' + ',i)){const cl=open==='«'?'»':'›';out+=cl+' + '+open;i+=2;continue}
    out+=ch;
  }
  return out;
}
// Condición larga ("éter → H₃O⁺", "H₃PO₄/SiO₂, 300°C") → una parte encima
// y otra debajo de la flecha, para que la flecha no quede kilométrica.
function fxCondSplit(c){
  c=(c||'').trim();if(!c)return ['',''];
  let m=c.match(/^(.+?)\s+→\s+(.+)$/);if(m)return [m[1],m[2]];
  if(c.length>14){m=c.match(/^(.+?),\s+(.+)$/)||c.match(/^(.+?)\s+(\(.+\))$/);if(m)return [m[1],m[2]];}
  return [c,''];
}
