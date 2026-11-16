#!/usr/bin/env node
/* ChromaNom — dibuja fórmulas SEMIDESARROLLADAS con todos sus enlaces, como en un libro.
   Motor copiado de generador.html (mkDevSVG + lector de fórmulas).
   Uso:  node dibujar.js "CH3-CH(CH3)-CH2-OH" [salida.svg]
         node dibujar.js --json '[{"h":3,"bn":1},{"h":2}]' [salida.svg]
   La fórmula de ENTRADA puede llevar paréntesis (es solo para describir las ramas);
   el DIBUJO resultante nunca los muestra: cada rama cuelga de su carbono con su enlace.
   Enlaces: - (sencillo), = (doble), # o ≡ (triple). Grupos: COOH, CHO, COO, CO, OH, NH2, Cl, Br, F, I.
*/
function mkDevSVG(ch){
  if(!ch||!ch.length)return '';
  const HU=72,VU=56;
  function lbl(s,h){const y=s||'C';return h<=0?y:h===1?y+'H':h===2?y+'H₂':h===3?y+'H₃':y+'H₄';}
  function aCol(s){return s==='O'?'#c8230a':s==='N'?'#0033aa':s==='Cl'?'#1a7a1a':s==='Br'?'#8b1a1a':s==='F'?'#3366aa':'#0d2d42';}
  const nds=[],eds=[];
  function addN(x,y,s,h){nds.push({x,y,lb:lbl(s,h),cl:aCol(s)});}
  function addE(x1,y1,x2,y2,o){eds.push({x1,y1,x2,y2,o});}
  const N=ch.length;
  for(let i=0;i<N;i++){const ca=ch[i];addN((i+1)*HU,0,ca.s||'C',ca.h||0);}
  for(let i=1;i<N;i++)addE(i*HU,0,(i+1)*HU,0,ch[i-1].bn||1);
  function doSub(px,py,bArr,dir,fBn){
    let cx=px,cy=py,bo=fBn;
    for(const ba of bArr){
      const ny=dir==='u'?cy-VU:cy+VU;
      addN(cx,ny,ba.s||'C',ba.h||0);addE(cx,cy,cx,ny,bo);
      cy=ny;bo=ba.bn||1;
    }
  }
  for(let i=0;i<N;i++){const ca=ch[i],cx=(i+1)*HU;
    if(ca.bu)doSub(cx,0,ca.bu,'u',ca.buBn||1);
    if(ca.bd)doSub(cx,0,ca.bd,'d',ca.bdBn||1);
  }
  if(!nds.length)return '';
  const P=28,minX=Math.min(...nds.map(n=>n.x)),maxX=Math.max(...nds.map(n=>n.x));
  const minY=Math.min(...nds.map(n=>n.y)),maxY=Math.max(...nds.map(n=>n.y));
  const ox=-minX+P+16,oy=-minY+P+8;
  const W=maxX-minX+P*2+32,Hh=maxY-minY+P*2+16;
  let sv=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${Hh}" style="display:block;margin:auto">`;
  const C='#1a2a3a';
  const ln2=(a,b,c,d)=>`<line x1="${a.toFixed(1)}" y1="${b.toFixed(1)}" x2="${c.toFixed(1)}" y2="${d.toFixed(1)}" stroke="${C}" stroke-width="1.6" stroke-linecap="round"/>`;
  for(const e of eds){
    const n1=nds.find(n=>n.x===e.x1&&n.y===e.y1),n2=nds.find(n=>n.x===e.x2&&n.y===e.y2);
    const ax1=e.x1+ox,ay1=e.y1+oy,ax2=e.x2+ox,ay2=e.y2+oy;
    const dx=ax2-ax1,dy=ay2-ay1,len=Math.sqrt(dx*dx+dy*dy);if(len<1)continue;
    const ux=dx/len,uy=dy/len,isV=Math.abs(ux)<0.1;
    const p1=n1?(isV?9:n1.lb.length*4+4):14,p2=n2?(isV?9:n2.lb.length*4+4):14;
    const lx1=ax1+ux*p1,ly1=ay1+uy*p1,lx2=ax2-ux*p2,ly2=ay2-uy*p2;
    const px=-uy*2.5,py=ux*2.5;
    if(e.o===1)sv+=ln2(lx1,ly1,lx2,ly2);
    else if(e.o===2){sv+=ln2(lx1+px,ly1+py,lx2+px,ly2+py);sv+=ln2(lx1-px,ly1-py,lx2-px,ly2-py);}
    else{sv+=ln2(lx1,ly1,lx2,ly2);sv+=ln2(lx1+px,ly1+py,lx2+px,ly2+py);sv+=ln2(lx1-px,ly1-py,lx2-px,ly2-py);}
  }
  for(const n of nds){
    const x=n.x+ox,y=n.y+oy;
    sv+=`<text x="${x.toFixed(1)}" y="${y.toFixed(1)}" text-anchor="middle" dominant-baseline="middle" font-family="'JetBrains Mono',monospace" font-size="13" font-weight="700" fill="${n.cl}">${n.lb}</text>`;
  }
  sv+='</svg>';return sv;
}
const _SUB={'₀':0,'₁':1,'₂':2,'₃':3,'₄':4,'₅':5,'₆':6,'₇':7,'₈':8,'₉':9};
function _subInt(s){let n=0;for(const c of s){if(_SUB[c]!==undefined)n=n*10+_SUB[c];}return n;}

const _GROUPS=['NH₂','NH','NO₂','ONa','OH','O','Cl','Br','F','I','N'];
function _parseBranch(s){
  if(s==='OH')return{s:'O',h:1};
  if(s==='O')return{s:'O',h:0};
  if(s==='ONa')return{s:'ONa',h:0};
  if(s==='NH₂')return{s:'N',h:2};
  if(s==='NH')return{s:'N',h:1};
  if(s==='N')return{s:'N',h:0};
  if(s==='Cl')return{s:'Cl',h:0};
  if(s==='Br')return{s:'Br',h:0};
  if(s==='F')return{s:'F',h:0};
  if(s==='I')return{s:'I',h:0};
  if(s==='NO₂')return{s:'N',h:0}; // approximate
  if(s==='CH₃')return{h:3};
  return null;
}

function _aldehydeNode(){return{h:1,bu:[{s:'O',h:0}],buBn:2};}
function _ketoNode(){return{h:0,bu:[{s:'O',h:0}],buBn:2};}
function _acidNode(){return{h:0,bu:[{s:'O',h:0}],bd:[{s:'O',h:1}],buBn:2};}

function _parseAtomAt(s, i){
  // Carboxylic acid / aldehyde / ester / ketone carbons, written as compact
  // functional-group shorthand (COOH, CHO, COO-, -CO-) rather than spelled
  // out atom-by-atom — expand them into a full developed (=O shown) node.
  if(s.startsWith('COOH',i))return{node:_acidNode(),i:i+4};
  if(s.startsWith('COO',i)){
    const acyl=_ketoNode();acyl.bn=1;
    return{nodes:[acyl,{s:'O',h:0}],i:i+3};
  }
  if(s.startsWith('CHO',i))return{node:_aldehydeNode(),i:i+3};
  if(s.startsWith('CO',i)&&s[i+2]!=='O'&&s[i+2]!=='H')return{node:_ketoNode(),i:i+2};

  let haloPrefix=null;
  for(const ha of _GROUPS){
    if(s.startsWith(ha,i)){
      if(s[i+ha.length]==='C'){haloPrefix=ha;i+=ha.length;}
      else{
        // Standalone group: this token IS the whole atom (terminal −OH, −Br,
        // mid-chain −NH−, ether −O−, nitrile ≡N, etc.), not a carbon-bearing atom.
        const b=_parseBranch(ha);
        if(b)return{node:{...b},i:i+ha.length};
      }
      break;
    }
  }
  if(i>=s.length||s[i]!=='C')return null;
  i++;
  let h=0;
  if(i<s.length&&s[i]==='H'){
    i++;
    let ds='';
    while(i<s.length&&_SUB[s[i]]!==undefined)ds+=s[i++];
    h=ds?_subInt(ds):1;
  }
  const node={h};
  const branches=[];
  if(haloPrefix){const b=_parseBranch(haloPrefix);if(b)branches.push(b);}
  while(i<s.length&&s[i]==='('){
    i++;let b='';
    while(i<s.length&&s[i]!==')')b+=s[i++];
    if(i<s.length)i++;
    const bn=_parseBranch(b);if(bn)branches.push(bn);
  }
  if(!haloPrefix&&branches.length===0){
    for(const ha of _GROUPS){
      if(s.startsWith(ha,i)){
        const b=_parseBranch(ha);if(b){branches.push(b);i+=ha.length;}
        while(i<s.length&&_SUB[s[i]]!==undefined)i++;
        break;
      }
    }
  }
  // Up to two branch positions per backbone atom: first goes down, second up
  // (this engine draws a single line up and a single line down per atom).
  if(branches.length===1)node.bd=[branches[0]];
  else if(branches.length>=2){node.bd=[branches[0]];node.bu=[branches[1]];}
  return{node,i};
}

function _normalizeLeadingMulti(s){
  const m=s.match(/^\(CH₃\)₃C/);
  if(!m)return s;
  return 'CH₃−C(CH₃)(CH₃)'+s.slice(m[0].length);
}

function _parseChainStr(s){
  s=_normalizeLeadingMulti(s.trim());
  s=s.replace(/\s*\([^()]{2,50}\)\s*$/,'').trim();
  s=s.replace(/^\d+\s+/,'').trim();
  if(!s||s.length>50||s.includes('???'))return null;
  const chain=[];
  let i=0,nextBond=1;
  while(i<s.length){
    while(i<s.length&&s[i]===' ')i++;
    if(i>=s.length)break;
    if('−─'.includes(s[i])){nextBond=1;i++;continue;}
    if(s[i]==='='){nextBond=2;i++;continue;}
    if(s[i]==='≡'){nextBond=3;i++;continue;}
    if(chain.length>0)chain[chain.length-1].bn=nextBond;
    nextBond=1;
    const res=_parseAtomAt(s,i);
    if(!res)return null;
    if(res.nodes)chain.push(...res.nodes);
    else chain.push(res.node);
    i=res.i;
  }
  return chain.length?chain:null;
}

// Convierte la escritura de teclado (CH3, -, #) a la del motor (CH₃, −, ≡).
function normalizar(s){
  const sub='₀₁₂₃₄₅₆₇₈₉';
  return s.replace(/([A-Za-z)])(\d+)/g,(m,a,d)=>a+[...d].map(x=>sub[+x]).join(''))
          .replace(/[-–—]/g,'−').replace(/#/g,'≡');
}
function main(){
  const a=process.argv.slice(2);
  if(!a.length){console.error('Uso: node dibujar.js "CH3-CH(CH3)-CH3" [salida.svg]');process.exit(1);}
  let chain,out;
  if(a[0]==='--json'){chain=JSON.parse(a[1]);out=a[2];}
  else{chain=_parseChainStr(normalizar(a[0]));out=a[1];
    if(!chain){console.error('No pude leer la fórmula: '+a[0]+'\nDibújala con --json o a mano en SVG.');process.exit(2);}}
  let svg=mkDevSVG(chain);
  const vb=svg.match(/viewBox="[-\d.]+ [-\d.]+ ([\d.]+) ([\d.]+)"/);
  if(vb)svg=svg.replace('<svg',`<svg width="${vb[1]}" height="${vb[2]}"`);
  if(out){require('fs').writeFileSync(out,svg);console.log('Guardado en '+out);}
  else process.stdout.write(svg+'\n');
}
if(require.main===module)main();
module.exports={mkDevSVG,_parseChainStr,normalizar};
