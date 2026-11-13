// Genera los PDF de las guías de ChromaNom (carta horizontal) con el logo y la marca de agua.
// Uso:  node herramientas/generar-guias-pdf.js . pdf
// Opcional: FUENTES=<carpeta de node_modules/@fontsource> para usar Outfit, JetBrains Mono y Fraunces
// (sin ellas el PDF sale con la letra de respaldo). Hay que volver a correrlo cada vez que cambie
// guias.html o referencia.html: los PDF son archivos fijos.
const {chromium}=require('playwright');const path=require('path');
const FUENTES=process.env.FUENTES||'';
const base=path.resolve(process.argv[2]||'.');const out=path.resolve(process.argv[3]||base+'/pdf');
const hojas={carbono:'guia-carbono.pdf',cadenas:'guia-cadenas.pdf',grupos:'guia-grupos-funcionales.pdf',isomeria:'guia-isomeria.pdf',fuerzas:'guia-fuerzas-intermoleculares.pdf',reacciones:'guia-reacciones-organicas.pdf',biomol:'guia-biomoleculas.pdf',ambiente:'guia-organica-ambiente.pdf'};
(async()=>{const b=await chromium.launch();
async function fuentes(p){
 if(!FUENTES)return;
 const f=(n,w,s,u)=>`@font-face{font-family:'${n}';font-weight:${w};font-style:${s};src:url(file://${FUENTES}/${u})}`;
 await p.addStyleTag({content:f('Outfit',400,'normal','outfit/files/outfit-latin-400-normal.woff2')+f('Outfit',700,'normal','outfit/files/outfit-latin-700-normal.woff2')+f('Outfit',600,'normal','outfit/files/outfit-latin-600-normal.woff2')+f('JetBrains Mono',400,'normal','jetbrains-mono/files/jetbrains-mono-latin-400-normal.woff2')+f('JetBrains Mono',700,'normal','jetbrains-mono/files/jetbrains-mono-latin-700-normal.woff2')+f('Fraunces',700,'italic','fraunces/files/fraunces-latin-700-italic.woff2')});
 await p.evaluate(()=>document.fonts.ready);}
for(const h in hojas){const p=await b.newPage();
 await p.goto('file://'+base+'/guias.html?hoja='+h);await fuentes(p);await p.waitForTimeout(600);
 await p.emulateMedia({media:'print'});
 await p.pdf({path:out+'/'+hojas[h],format:'Letter',landscape:true,printBackground:true,preferCSSPageSize:true});
 console.log('PDF',hojas[h]);await p.close();}
{const p=await b.newPage();await p.goto('file://'+base+'/referencia.html');await fuentes(p);await p.waitForTimeout(600);await p.emulateMedia({media:'print'});
 await p.pdf({path:out+'/guia-nomenclatura-iupac.pdf',format:'Letter',landscape:true,printBackground:true,preferCSSPageSize:true});console.log('PDF guia-nomenclatura-iupac.pdf');await p.close();}
await b.close();})();
