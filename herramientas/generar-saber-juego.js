/* Genera saber-juego.js: las preguntas tipo Saber 11 de docente-datos.js que
   se pueden mostrar en el Juego (sin dibujo de estructura propio y sin fórmulas
   con ramas entre paréntesis), con el tema del Juego al que corresponden.
   Uso (desde la raíz del repositorio):  node herramientas/generar-saber-juego.js
   Hay que volver a correrlo cada vez que se agregan o cambian preguntas SABER. */
const fs=require('fs'),vm=require('vm');
const c={console};c.window=c;vm.createContext(c);
['saber-icfes.js','docente-datos.js'].forEach(f=>vm.runInContext(fs.readFileSync(f,'utf8'),c));
const SI=c.SABER_ICFES;
const lim=s=>String(s==null?'':s).replace(/<[^>]+>/g,'');
const PAREN=/[A-Za-zₐ-ₜ₀-₉]\([A-Za-z₀-₉]+\)[₀-₉]|\(CH|\)CH|C\(/;
const RXN=[[/éster|esterific|saponific|jab[oó]n|transesterific|biodi[eé]sel|amida|anh[ií]drido|cloruro de [aá]cido/i,'rxn_derivados'],
  [/aldeh[ií]do|cetona|tollens|fehling|carbonilo|grignard|NaBH/i,'rxn_carbonilo'],
  [/benceno|arom[aá]tic|nitraci|tolueno/i,'rxn_aromaticos'],
  [/haluro|bromuro|cloruro|SN1|SN2|halog/i,'rxn_halogenuros'],
  [/alquino|etino|acetileno/i,'rxn_alquinos'],
  [/alqueno|eteno|doble enlace|adici/i,'rxn_alquenos'],
  [/alcohol|etanol|metanol|dicromato|deshidrataci/i,'rxn_alcoholes'],
  [/amina|nitrilo/i,'rxn_aminas'],
  [/[aá]cido|carbox[ií]l/i,'rxn_acidos']];
const TEMA={
  cadena:()=> 'cadena_principal', alcanos:()=>'alcanos', aromaticos:()=>'benceno', haluros:()=>'haluros',
  polifuncionales:()=>'polifuncionales', isomeria:()=>'isomeria',
  alquenos:t=>/alquino|etino|acetileno/i.test(t)?'alquinos':'alquenos',
  alcoholes:t=>/fenol/i.test(t)?'fenoles':/[ée]ter|etoxi|metoxi/i.test(t)?'eteres':'alcoholes',
  carbonilos:t=>/aldeh[ií]do|tollens|fehling/i.test(t)?'aldehidos':'cetonas',
  acidos:t=>/[ée]ster|jab[oó]n|esterific|saponific/i.test(t)?'esteres':/anh[ií]drido|cloruro de [aá]cido/i.test(t)?'derivados_acido':'acidos',
  nitrogenados:t=>/amida|p[eé]ptid/i.test(t)?'amidas':/nitrilo/i.test(t)?'nitrilos':'aminas',
  reacciones:t=>{for(const [re,tp] of RXN)if(re.test(t))return tp;return 'rxn_alcanos';}};
const out=[];let omitidas=0;
for(const k in c.DOCENTE_DATOS.SABER)c.DOCENTE_DATOS.SABER[k].forEach(q=>{
  const t=[q.ctx,q.q].concat(q.o).join(' ');
  if(q.f||q.gen||q.fig||PAREN.test(t)||!TEMA[k]){omitidas++;return;}
  out.push({t:TEMA[k](t),c:SI.competencia(q),af:SI.afirmacion(q).cod,ctx:lim(q.ctx),q:lim(q.q),o:q.o.map(lim),tabla:q.tabla||undefined,exp:q.exp?lim(q.exp):undefined,graf:q.graf||undefined});
});
const txt='/* GENERADO por herramientas/generar-saber-juego.js: no editar a mano.\n   Preguntas tipo Saber 11 de ChromaNom para el Juego ('+out.length+'). */\nwindow.SABER_JUEGO='+JSON.stringify(out)+';\n';
fs.writeFileSync('saber-juego.js',txt);
console.log(out.length,'preguntas;',omitidas,'omitidas (dibujo o fórmula con paréntesis);',Math.round(txt.length/1024),'KB');
const m={};out.forEach(x=>m[x.t]=(m[x.t]||0)+1);console.log(JSON.stringify(m));
