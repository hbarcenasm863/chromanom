/* Genera mdec-moleculas.js: las moléculas del Generador (MOLS de generador.html) con las partes de su nombre
   según el método MDEC (modelo propio del docente). El Juego las usa para crear más preguntas de
   «arrastra cada fragmento» y «¿a qué parte corresponde?». Uso, desde la raíz del repositorio:
     node herramientas/generar-mdec.js
   Volver a correrlo si cambian las moléculas o sus partes en generador.html. */
const fs=require('fs');
const txt=fs.readFileSync('generador.html','utf8');
function arreglo(t,ini){let i=t.indexOf('[',ini),prof=0,q=null;const desde=i;
  for(;i<t.length;i++){const c=t[i];if(q){if(c==='\\'){i++;continue;}if(c===q)q=null;continue;}
    if(c==='"'||c==="'"||c==='`'){q=c;continue;}
    if(c==='/'&&t[i+1]==='/'){i=t.indexOf('\n',i);continue;}if(c==='/'&&t[i+1]==='*'){i=t.indexOf('*/',i)+1;continue;}
    if(c==='[')prof++;else if(c===']'){prof--;if(!prof)break;}}
  return (new Function('return '+t.slice(desde,i+1)))();}
const MOLS=arreglo(txt,txt.indexOf('const MOLS = ['));
const out=MOLS.filter(m=>m&&m.key&&Array.isArray(m.parts)&&m.parts.length>=2&&!/\s(éter|cetona)$/.test(m.iupac||m.name))
  .map(m=>({k:m.key,n:m.iupac||m.name,t:m.topic,p:m.parts.map(p=>[p.t,p.cls])}))
  /* solo las que se arman exactamente con sus partes (sin contar guiones ni comas) y sin paréntesis */
  .filter(m=>{const s=x=>x.replace(/[-\s,]/g,'');return s(m.p.map(p=>p[0]).join(''))===s(m.n)&&!/[()]/.test(m.n);})
  /* auditoría química (26-11-2026): se dejan fuera las particiones dudosas: la «o» pegada a un sufijo
     («onitrilo», «odioico», «o1,5-diamina»), fragmentos que no son morfemas («ald», «ehído»), nombres sin
     cadena principal o sin parte ③/④ y el orden alfabético dudoso de 2-metoxi-2-metilpropano */
  .filter(m=>{const cls=m.p.map(p=>p[1]);
    if(!cls.includes('c')||!cls.includes('g'))return false;
    if(m.p.some(p=>p[1]==='g'&&/^o(nitrilo|di|tri|tetra|carb|\d)/.test(p[0])))return false;
    if(m.p.some(p=>/^(ald|ehído)$/.test(p[0])))return false;
    if(m.n==='2-metoxi-2-metilpropano'||m.n==='ciclohexanocarbonitrilo')return false;
    return true;});
async function dibujos(){
  /* Las moléculas que el Juego no sabe dibujar llevan el dibujo del Generador (SVG), para que el Juego
     también pueda usarlas. Necesita Playwright; sin él, el Juego usa solo las que ya sabe dibujar. */
  let pw;try{pw=require('playwright');}catch(e){try{pw=require(require('child_process').execSync('npm root -g').toString().trim()+'/playwright');}catch(e2){}}
  if(!pw){console.warn('Sin Playwright: no se agregan dibujos.');return;}
  const path=require('path'),http=require('http');
  const srv=http.createServer((q,r)=>{const f=path.join(process.cwd(),decodeURIComponent(q.url.split('?')[0]));
    /* sin el archivo anterior: si no, el Juego «sabría» dibujar las que ya traen dibujo del Generador */
    if(f.endsWith('mdec-moleculas.js')){r.writeHead(200,{'Content-Type':'application/javascript'});r.end('window.MDEC_MOLS=[];');return;}
    fs.readFile(f,(e,d)=>{if(e){r.writeHead(404);r.end();return;}r.writeHead(200,{'Content-Type':f.endsWith('.html')?'text/html':f.endsWith('.js')?'application/javascript':f.endsWith('.css')?'text/css':'application/octet-stream'});r.end(d);});});
  await new Promise(ok=>srv.listen(0,ok));const base='http://localhost:'+srv.address().port+'/';
  const b=await pw.chromium.launch(),p=await b.newPage();
  await p.goto(base+'juego.html');await p.waitForTimeout(2000);
  const enJuego=await p.evaluate(ks=>ks.filter(k=>typeof M[k]==='function'||Array.isArray(MOLDES[k])),out.map(m=>m.k));
  /* generador.html se abre dentro de un marco (solo, redirige al panel docente) */
  await p.evaluate(u=>{const f=document.createElement('iframe');f.id='gen-mdec';f.src=u;document.body.appendChild(f);},base+'generador.html');
  await p.waitForTimeout(3500);
  const fr=p.frames().find(f=>/generador\.html/.test(f.url()));
  /* solo las que hacen falta: hasta 10 por familia (con ellas cada familia del Juego llega a unas 20
     preguntas de cada tipo); así el archivo no pesa de más */
  const porFam={};const faltan=out.filter(m=>!enJuego.includes(m.k)).filter(m=>{porFam[m.t]=(porFam[m.t]||0)+1;return porFam[m.t]<=10;}).map(m=>m.k);
  const svgs=await fr.evaluate(ks=>{const o={};ks.forEach(k=>{try{if(MOLDES[k]||M[k])o[k]=getSVG(k).replace(/\s+/g,' ');}catch(e){}});return o;},faltan);
  await b.close();srv.close();
  /* números con un decimal y sin espacios de más: el archivo pesa mucho menos y el dibujo no cambia */
  const corto=v=>v.replace(/(\d+\.\d)\d+/g,'$1').replace(/\.0"/g,'"').replace(/>\s+</g,'><').replace(/\s{2,}/g,' ');
  out.forEach(m=>{if(svgs[m.k])m.s=corto(svgs[m.k]);});
  console.log('dibujos del Generador agregados:',Object.keys(svgs).length,'de',faltan.length);
}
/* Cuenta las preguntas MDEC que el Juego arma al cargar (no están escritas en juego.html) y deja el
   número en el archivo (window.MDEC_JUEGO_N): así el contador de preguntas de la portada las suma. */
async function contarJuego(s){
  let pw;try{pw=require('playwright');}catch(e){try{pw=require(require('child_process').execSync('npm root -g').toString().trim()+'/playwright');}catch(e2){}}
  if(!pw)return;
  const path=require('path'),http=require('http');
  const srv=http.createServer((q,r)=>{const f=path.join(process.cwd(),decodeURIComponent(q.url.split('?')[0]));
    fs.readFile(f,(e,d)=>{if(e){r.writeHead(404);r.end();return;}r.writeHead(200,{'Content-Type':f.endsWith('.html')?'text/html':f.endsWith('.js')?'application/javascript':f.endsWith('.css')?'text/css':'application/octet-stream'});r.end(d);});});
  await new Promise(ok=>srv.listen(0,ok));
  const b=await pw.chromium.launch(),p=await b.newPage();
  await p.goto('http://localhost:'+srv.address().port+'/juego.html');await p.waitForTimeout(2500);
  const n=await p.evaluate(()=>QBANK.filter(q=>q&&q.mdec).length);
  await b.close();srv.close();
  fs.writeFileSync('mdec-moleculas.js',s+'window.MDEC_JUEGO_N='+n+';\n');
  console.log('preguntas MDEC que arma el Juego al cargar:',n);
}
(async()=>{await dibujos();
const s='/* GENERADO por herramientas/generar-mdec.js: no editar a mano.\n   Moléculas del Generador con las partes de su nombre (método MDEC, modelo propio del docente: no se\n   enlaza a DBA ni estándar). Las usan el Juego y el panel docente. */\nwindow.MDEC_MOLS='+JSON.stringify(out)+';\n';
fs.writeFileSync('mdec-moleculas.js',s);
await contarJuego(s);
const t={};out.forEach(x=>t[x.t]=(t[x.t]||0)+1);console.log(out.length,'moléculas',t);
})();
