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

/* ── Fórmulas con paréntesis dentro de un texto ──────────────────────────
   Regla del sitio: ninguna fórmula se muestra con paréntesis. Una fórmula
   condensada como CH₃−CH(CH₃)−CH₃, (CH₃)₃C−OH o C(CH₃)₄ se dibuja en
   semidesarrollada: cada rama cuelga de su carbono con su enlace visible
   (arriba y, si hay dos, también abajo). fxTexto() lo hace sobre un texto y
   devuelve HTML; fxAuto() lo aplica a una página entera, también a lo que
   se pinte después (preguntas del juego, hojas del generador…). */
function fxCondensada(t){
  if(!/\(/.test(t))return null;
  let s=t.replace(/−/g,'—');
  // ramas escritas sin sus enlaces → con todos los enlaces
  s=s.replace(/\((?:C₂H₅|CH₂CH₃)\)/g,'(CH₂—CH₃)').replace(/\((?:C₃H₇|CH₂CH₂CH₃)\)/g,'(CH₂—CH₂—CH₃)');
  const R='\\(([^()]+)\\)',re=x=>new RegExp(x);
  // cadenas repetidas: H₂N−(CH₂)₄−NH₂ → H₂N—CH₂—CH₂—CH₂—CH₂—NH₂
  s=s.replace(/\(CH₂\)([₂-₉])/g,(m,k)=>Array('₀₁₂₃₄₅₆₇₈₉'.indexOf(k)+1).join('CH₂—').slice(0,-1));
  // anhídridos: (CH₃CO)₂O → CH₃—CO—O—CO—CH₃
  s=s.replace(/^\(([^()]*?)CO\)₂O/,(m,r)=>r?`${r}—CO—O—CO—${r}`:'CO—O—CO');
  // aminas: (CH₃)₂NH → CH₃—NH—CH₃ ; (CH₃)₂NH₂⁺Cl⁻ → CH₃—NH₂⁺—CH₃ Cl⁻ ; (CH₃)₃N
  s=s.replace(re('^'+R+'₂(NH₂?)(⁺?)(.*)$'),(m,x,a,c,r)=>`${x}—${a}${c}—${x}${r?' '+r:''}`);
  s=s.replace(re('^'+R+'₃N(?![a-zH₀-₉])'),(m,x)=>`${x}—⟦${x}|N⟧—${x}`);
  // enlaces que faltan entre grupos pegados: RCH( → R—CH( ; CH₃CH( → CH₃—CH( ; )CH₃ → )—CH₃
  s=s.replace(/(^|[^A-Za-z])(R[′″]?)(?=C)/g,'$1$2—').replace(/(H[₂₃]?)(?=C[^l])/g,'$1—').replace(/\)(?=C)/g,')—');
  // al comienzo: (X)₄C, (X)₃C—, (X)₂CH—, (X)₂C= / (X)₂N—
  s=s.replace(re('^'+R+'₄C$'),(m,x)=>`${x}—⟦${x}|C|${x}⟧—${x}`);
  s=s.replace(re('^'+R+'₃C(?![a-zH₀-₉])'),(m,x)=>`${x}—⟦${x}|C|${x}⟧`);
  s=s.replace(re('^'+R+'₂CH(?![₀-₉])'),(m,x)=>`${x}—⟦${x}|CH⟧`);
  s=s.replace(re('^'+R+'₂(C|N)(?![a-zH₀-₉])'),(m,x,a)=>`${x}—⟦${x}|${a}⟧`);
  // en medio o al final: C(X)₄, C(X)₃, C(X)₂, C(X)(Y), CH(X)₂, N(X)₂, N(X)
  s=s.replace(re('(^|[^A-Za-z])C'+R+'₄'),(m,p,x)=>`${p}${x}—⟦${x}|C|${x}⟧—${x}`);
  s=s.replace(re('C'+R+'₃$'),(m,x)=>`⟦${x}|C|${x}⟧—${x}`);
  s=s.replace(re('(^|[^A-Za-z])C'+R+'₂'),(m,p,x)=>`${p}⟦${x}|C|${x}⟧`);
  s=s.replace(re('(^|[^A-Za-z])C'+R+R+R),(m,p,x,y,z)=>`${p}⟦${x}|C|${y}⟧—${z}`);
  s=s.replace(re('(^|[^A-Za-z])(CH|C)'+R+R),(m,p,a,x,y)=>`${p}⟦${x}|${a}|${y}⟧`);
  s=s.replace(re('CH'+R+'₂$'),(m,x)=>`⟦${x}|CH⟧—${x}`);
  s=s.replace(re('(^|[^A-Za-z])N'+R+'₂$'),(m,p,x)=>`${p}⟦${x}|N⟧—${x}`);
  s=s.replace(re('(^|[^A-Za-z])(NH|N)'+R),(m,p,a,x)=>`${p}⟦${x}|${a}⟧`);
  s=fxNorm(s);
  return /[()]/.test(s)?null:s;
}
const FX_TOKEN=/[A-Za-z0-9₀-₉−—=≡()′″⁺⁻]+/g;
function fxFormulaHTML(tok){
  // Paréntesis que no son de la fórmula, como en «(CH₃−CH(CH₃)−CH₃)».
  let pre='',pos='';
  const n=(x,c)=>x.split(c).length-1;
  const envuelve=x=>{if(x[0]!=='('||x.slice(-1)!==')')return false;let d=0;for(let i=0;i<x.length;i++){if(x[i]==='(')d++;else if(x[i]===')'){d--;if(d===0&&i<x.length-1)return false;}}return true;};
  while(envuelve(tok)){pre+='(';pos=')'+pos;tok=tok.slice(1,-1);}
  while(tok[0]==='('&&n(tok,'(')>n(tok,')')){pre+='(';tok=tok.slice(1);}
  while(tok.slice(-1)===')'&&n(tok,')')>n(tok,'(')){pos=')'+pos;tok=tok.slice(0,-1);}
  // solo fórmulas: un átomo con una rama entre paréntesis que empieza en
  // mayúscula o en «=» (no «C(sp³)» ni palabras con «(s)»)
  if(!/(?:[CN](?:H[₂₃]?)?\((?:[A-Z=]|R)|^\([A-Z][^()]*\)[₂₃₄][CNO]|\(CH₂\)[₂-₉])/.test(tok))return null;
  const f=fxCondensada(tok);if(f==null)return null;
  const e=x=>x.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  const abajo=/⟦[^⟧|]*\|[^⟧|]*\|[^⟧]+⟧/.test(f);
  return e(pre)+`<span class="fx-in${abajo?' fx-dn':''}"><span class="fx-sr">${e(tok)}</span><span aria-hidden="true">${FX.mol(f)}</span></span>`+e(pos);
}
// Texto plano → HTML con las fórmulas dibujadas (null si no había ninguna).
function fxTexto(s){
  s=String(s==null?'':s);if(s.indexOf('(')<0)return null;
  const e=x=>x.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  let out='',last=0,m,hay=false;FX_TOKEN.lastIndex=0;
  while((m=FX_TOKEN.exec(s))){const h=fxFormulaHTML(m[0]);if(h==null)continue;hay=true;out+=e(s.slice(last,m.index))+h;last=m.index+m[0].length;}
  return hay?out+e(s.slice(last)):null;
}
const FX_NO_TOCAR='script,style,textarea,input,select,option,svg,code,pre,.fx-in,.fx-mol,.fx-cad,.no-fx,[contenteditable]';
function fxAuto(raiz){
  raiz=raiz||document.body;if(!raiz)return;
  const nodos=[];
  if(raiz.nodeType===3)nodos.push(raiz);
  else if(raiz.nodeType===1){
    if(raiz.closest&&raiz.closest(FX_NO_TOCAR))return;
    const w=document.createTreeWalker(raiz,NodeFilter.SHOW_TEXT);let k;
    while((k=w.nextNode()))if(k.nodeValue.indexOf('(')>=0)nodos.push(k);
  }
  nodos.forEach(k=>{
    const p=k.parentElement;if(!p||p.closest(FX_NO_TOCAR))return;
    const h=fxTexto(k.nodeValue);if(h==null)return;
    const t=document.createElement('template');t.innerHTML=h;k.replaceWith(t.content);
  });
}
(function(){
  if(typeof document==='undefined')return;
  const css=document.createElement('style');
  css.textContent='.fx-in{display:inline-block;white-space:nowrap;padding-top:1.25em;line-height:1.2;vertical-align:baseline;text-indent:0}'+
    '.fx-in.fx-dn{padding-bottom:1.4em}'+
    '.fx-in sub,.fx-in sup{font-size:.7em;line-height:0;position:relative;vertical-align:baseline}.fx-in sub{top:.28em}.fx-in sup{top:-.45em}'+
    '.fx-in .fx-st{position:relative;display:inline-block}'+
    '.fx-in .fx-bu,.fx-in .fx-bl{position:absolute;left:50%;transform:translateX(-50%);display:flex;flex-direction:column;align-items:center}'+
    '.fx-in .fx-bu{bottom:100%}.fx-in .fx-bl{top:100%}'+
    '.fx-in .fx-lab{line-height:1.05;white-space:nowrap}'+
    '.fx-in .fx-bd{display:block;width:1.3px;height:.45em;background:currentColor}'+
    '.fx-in .fx-bd.dbl{width:5px;background:none;border-left:1.3px solid currentColor;border-right:1.3px solid currentColor}'+
    '.fx-sr{position:absolute!important;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap}';
  document.head.appendChild(css);
  let pend=[],prog=false;
  function correr(){prog=false;const l=pend;pend=[];l.forEach(n=>{if(n.isConnected)fxAuto(n);});}
  function iniciar(){
    fxAuto(document.body);
    new MutationObserver(ms=>{
      ms.forEach(m=>{if(m.type==='characterData')pend.push(m.target);else m.addedNodes.forEach(n=>pend.push(n));});
      if(pend.length&&!prog){prog=true;(window.requestAnimationFrame||setTimeout)(correr);}
    }).observe(document.body,{childList:true,subtree:true,characterData:true});
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',iniciar);else iniciar();
})();
// ¿Le quedan a este texto fórmulas con paréntesis que fxTexto no sabe dibujar?
// (para dejar fuera de un ejercicio las que no se puedan mostrar bien)
function fxQuedanParentesis(s){
  const RE=/[CN](?:H[₂₃]?)?\([A-Z=R][^()]*\)|\([A-Z][^()]*\)[₂₃₄]/;
  const h=fxTexto(s);
  return RE.test(h==null?String(s||''):h.replace(/<span class="fx-sr">[^<]*<\/span>/g,'').replace(/<[^>]+>/g,''));
}
