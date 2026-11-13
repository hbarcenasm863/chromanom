/* ═════════════════════════════════════════════════════════════════════
   ChromaNom — Mapa de clasificación de las cadenas carbonadas
   Un solo mapa para cadenas.html (interactivo: cada recuadro abre una
   ventana con explicación y ejemplos), guias.html (versión fija para
   imprimir) y los ejercicios (el clasificador de cadenas.html).

   Uso:  <div data-cadmapa></div>              interactivo
         <div data-cadmapa="fijo"></div>        sin ventanas (hoja PDF)
   Necesita fundamentos.js antes (los dibujos están en FUND_FIG).

   Criterio (IUPAC): «alifático» = todo lo que NO es aromático, sea de
   cadena abierta o cerrada. Algunos textos llaman alifáticas solo a las
   abiertas: se aclara en el recuadro de «Alifáticas».
   Las fórmulas se dibujan con sus enlaces y no llevan paréntesis.
   ═════════════════════════════════════════════════════════════════════ */
(function(){
'use strict';
var F=function(k){return (window.FUND_FIG&&window.FUND_FIG[k])?window.FUND_FIG[k]():'';};
/* Dibujo reducido: respeta la proporción (cabe en maxH de alto y maxW de ancho) */
function mini(k,maxH,maxW){
  var t=F(k),m=/viewBox="[-\d.]+ [-\d.]+ ([\d.]+) ([\d.]+)"/.exec(t);if(!m)return t;
  var w=+m[1],h=+m[2];if(w/h>2.2)maxW*=1.8;
  var e=Math.min(maxH/h,maxW/w,1.6);
  return t.replace(/style="[^"]*"/,'style="width:'+(w*e).toFixed(0)+'px!important;height:'+(h*e).toFixed(0)+'px!important;max-width:none!important;display:block"');
}

/* n: {id, t (título), s (subtítulo), q (pregunta que separa a sus hijos),
       def, rec:[…], ej:[[dibujo, nombre, fórmula molecular]], ojo, k:[hijos]} */
var T={id:'raiz',t:'Cadenas carbonadas',
 def:'Una <b>cadena carbonada</b> es el esqueleto de carbonos de una molécula orgánica. Se clasifica de lo general a lo particular: primero se decide si es <b>alifática</b> o <b>aromática</b>; después se mira su forma, sus ramas, los átomos que forman el esqueleto y sus enlaces.',
 rec:['Lee el mapa de izquierda a derecha: cada decisión te lleva a un recuadro más específico.','Toca cualquier recuadro para ver su explicación y ejemplos dibujados con todos sus enlaces.'],
 q:'¿El esqueleto tiene un anillo tipo benceno?',
 ej:[['fu_butano','butano','C₄H₁₀'],['fu_ciclohexano','ciclohexano','C₆H₁₂'],['fu_benceno','benceno','C₆H₆']],
 k:[
 {id:'ali',t:'Alifáticas',s:'no aromáticas',q:'¿Los extremos de la cadena se unen formando un anillo?',
  def:'Cadenas de carbono <b>sin aromaticidad</b>. Pueden ser abiertas (acíclicas) o cerradas en un anillo (cíclicas o alicíclicas). Aquí entran los alcanos, los alquenos, los alquinos y sus versiones en anillo.',
  rec:['No hay un anillo tipo benceno.','Sus enlaces dobles o triples, si los hay, están en un lugar fijo de la cadena.'],
  ej:[['fu_butano','butano','C₄H₁₀'],['fu_propeno','propeno','C₃H₆'],['fu_ciclohexano','ciclohexano','C₆H₁₂']],
  ojo:'Algunos libros llaman «alifáticas» solo a las cadenas <b>abiertas</b>. Aquí seguimos el uso de la IUPAC: alifático es todo lo que no es aromático, sea abierto o cerrado.',
  k:[
  {id:'aci',t:'Acíclicas',s:'cadena abierta',q:'¿Todos los carbonos están en un solo camino, o de alguno sale otra cadena?',
   def:'Cadenas con <b>dos extremos</b>: el último carbono no se une al primero. Se llaman también cadenas abiertas.',
   rec:['Cuenta los extremos: una cadena abierta siempre tiene dos.','Saturadas, siguen la fórmula CₙH₂ₙ₊₂ (alcanos).'],
   ej:[['fu_butano','butano','C₄H₁₀'],['fu_isobutano','metilpropano','C₄H₁₀'],['fu_propeno','propeno','C₃H₆']],
   ojo:'Doblar o torcer el dibujo no cierra la cadena: sigue teniendo dos extremos.',
   k:[
   {id:'lin',t:'Lineales',s:'continuas',q:'¿Hay dobles o triples enlaces entre carbonos?',
    def:'Todos los carbonos están en <b>un solo camino</b>, de un extremo al otro, sin bifurcaciones. Solo hay carbonos primarios en los extremos y secundarios en el medio.',
    rec:['No hay ningún carbono unido a tres o cuatro carbonos.','Aunque se dibuje en zigzag o doblada en U, sigue siendo lineal.'],
    ej:[['fu_butano','butano','C₄H₁₀'],['fu_hexano_zz','hexano en zigzag','C₆H₁₄'],['fu_cadenaU','pentano doblado en U','C₅H₁₂']],
    ojo:'El zigzag <b>no</b> es una ramificación: es la forma real de la cadena (ángulos de 109,5° del carbono sp³).',
    k:[
    {id:'lin-sat',t:'Saturada',s:'solo enlaces sencillos',
     def:'Cadena lineal con <b>solo enlaces sencillos</b> C−C: es un alcano de cadena recta, de fórmula CₙH₂ₙ₊₂. Cada carbono tiene el máximo de hidrógenos posible.',
     rec:['Ninguna línea doble (=) ni triple (≡) entre carbonos.'],
     ej:[['fu_butano','butano','C₄H₁₀'],['fu_pentano_zz','pentano','C₅H₁₂'],['fu_hexano_zz','hexano','C₆H₁₄']],
     ojo:'«Saturada» habla de los enlaces entre carbonos, no de si la sustancia es sólida o líquida.'},
    {id:'lin-ins',t:'Insaturada',s:'con = o ≡',
     def:'Cadena lineal con <b>al menos un enlace doble o triple</b> entre carbonos. Cada doble enlace quita 2 H respecto del alcano; cada triple, 4 H.',
     rec:['Busca un = (alqueno) o un ≡ (alquino) entre dos carbonos.','Puede tener varios: el buta-1,3-dieno tiene dos dobles.'],
     ej:[['fu_propeno','propeno','C₃H₆'],['fu_buteno2','but-2-eno','C₄H₈'],['fu_propino','propino','C₃H₄'],['fu_dieno','buta-1,3-dieno','C₄H₆']],
     ojo:'Un doble enlace no hace ramificada a la cadena: la hace insaturada.'}]},
   {id:'ram',t:'Ramificadas',s:'arborescentes',q:'¿Hay dobles o triples enlaces entre carbonos?',
    def:'De algún carbono de la cadena sale <b>otra cadena de carbonos</b> (la rama). Tiene al menos un carbono terciario o cuaternario.',
    rec:['Busca un carbono unido a 3 o 4 carbonos.','La cadena principal es la más larga; lo que queda por fuera es la rama.'],
    ej:[['fu_isobutano','metilpropano','C₄H₁₀'],['fu_metilbutano','2-metilbutano','C₅H₁₂'],['fu_ramificadaU','3-etilpentano','C₇H₁₆']],
    ojo:'Un grupo como −OH, −Cl o −NH₂ colgado de la cadena no es una rama de carbono.',
    k:[
    {id:'ram-sat',t:'Saturada',s:'solo enlaces sencillos',
     def:'Cadena con ramas y <b>solo enlaces sencillos</b> entre carbonos: es un alcano ramificado, también CₙH₂ₙ₊₂.',
     rec:['Hay una rama de carbonos (CH₃, CH₂−CH₃…) y ninguna línea doble o triple.'],
     ej:[['fu_isobutano','metilpropano','C₄H₁₀'],['fu_metilbutano','2-metilbutano','C₅H₁₂'],['fu_ramificadaU','3-etilpentano','C₇H₁₆']],
     ojo:'Los isómeros de cadena (butano y metilpropano) tienen la misma fórmula molecular pero distinta ramificación.'},
    {id:'ram-ins',t:'Insaturada',s:'con = o ≡',
     def:'Cadena con ramas <b>y</b> con al menos un enlace doble o triple entre carbonos. Es ramificada e insaturada a la vez.',
     rec:['Comprueba las dos cosas por separado: la rama y el enlace múltiple.'],
     ej:[['fu_mixta','3-metilbut-1-eno','C₅H₁₀'],['fu_metilpropeno','2-metilpropeno','C₄H₈']],
     ojo:'El doble enlace cuenta como insaturación, pero la rama es la que decide que sea ramificada.'}]}
   ]},
  {id:'cic',t:'Cíclicas',s:'alicíclicas · cadena cerrada',q:'¿El anillo tiene solo carbonos, o también O, N o S?',
   def:'Los extremos se unen y forman un <b>anillo no aromático</b>. No tienen extremos. Al cerrarse pierden 2 H: el ciclohexano es C₆H₁₂ y el hexano C₆H₁₄.',
   rec:['Busca un anillo sin dobles enlaces alternados tipo benceno.','Se llaman también alicíclicas (alifáticas + cíclicas).'],
   ej:[['fu_ciclopropano','ciclopropano','C₃H₆'],['fu_ciclohexano','ciclohexano','C₆H₁₂'],['fu_thf','tetrahidrofurano','C₄H₈O']],
   ojo:'No las confundas con el benceno: el ciclohexano no tiene dobles enlaces alternados y no es aromático.',
   k:[
   {id:'hom',t:'Homogéneas',s:'carbocíclicas: anillo solo de C',q:'¿Tiene alguna rama de carbonos sobre el anillo?',
    def:'El anillo está formado <b>solo por carbonos</b>. Se llaman también homocíclicas o carbocíclicas.',
    rec:['Cuenta los átomos del anillo: todos son C.'],
    ej:[['fu_ciclopentano','ciclopentano','C₅H₁₀'],['fu_ciclohexano','ciclohexano','C₆H₁₂'],['fu_ciclohexeno','ciclohexeno','C₆H₁₀']],
    k:[
    {id:'hom-sen',t:'Sencilla',s:'sin ramas',q:'¿Tiene dobles enlaces en el anillo?',
     def:'Anillo de carbonos <b>sin nada de carbono colgando</b> de él.',
     rec:['Solo el anillo: ninguna cadena sale de él.'],
     ej:[['fu_ciclopentano','ciclopentano','C₅H₁₀'],['fu_ciclohexeno','ciclohexeno','C₆H₁₀']],
     k:[
     {id:'hom-sen-sat',t:'Saturada',
      def:'Anillo de carbonos con <b>solo enlaces sencillos</b>: es un cicloalcano, de fórmula CₙH₂ₙ.',
      rec:['Ningún doble ni triple enlace dentro del anillo.'],
      ej:[['fu_ciclopropano','ciclopropano','C₃H₆'],['fu_ciclopentano','ciclopentano','C₅H₁₀'],['fu_ciclohexano','ciclohexano','C₆H₁₂']],
      ojo:'El ciclopropano y el ciclobutano son muy tensos: sus ángulos son más cerrados que los 109,5° ideales.'},
     {id:'hom-sen-ins',t:'Insaturada',
      def:'Anillo de carbonos con <b>al menos un doble enlace</b> dentro del anillo (cicloalqueno).',
      rec:['Un solo doble enlace no lo hace aromático.'],
      ej:[['fu_ciclopenteno','ciclopenteno','C₅H₈'],['fu_ciclohexeno','ciclohexeno','C₆H₁₀']],
      ojo:'Para ser aromático hacen falta tres dobles enlaces alternados que se repartan por todo el anillo, como en el benceno.'}]},
    {id:'hom-ram',t:'Ramificada',s:'con ramas sobre el anillo',q:'¿Tiene dobles enlaces en el anillo?',
     def:'Anillo de carbonos del que <b>cuelga una cadena de carbonos</b> (CH₃, CH₂−CH₃…).',
     rec:['Cuenta primero el anillo y luego lo que cuelga de él.'],
     ej:[['fu_metilciclohexano','metilciclohexano','C₇H₁₄'],['fu_metilciclohexeno','metilciclohexeno','C₇H₁₂']],
     k:[
     {id:'hom-ram-sat',t:'Saturada',
      def:'Anillo de carbonos con una rama y <b>solo enlaces sencillos</b>.',
      rec:['Anillo sin dobles enlaces y con una cadena de carbonos colgando.'],
      ej:[['fu_metilciclopentano','metilciclopentano','C₆H₁₂'],['fu_metilciclohexano','metilciclohexano','C₇H₁₄']]},
     {id:'hom-ram-ins',t:'Insaturada',
      def:'Anillo de carbonos con una rama y <b>al menos un doble enlace</b> en el anillo.',
      rec:['Anillo con un doble enlace y una cadena de carbonos colgando.'],
      ej:[['fu_metilciclopenteno','metilciclopenteno','C₆H₁₀'],['fu_metilciclohexeno','metilciclohexeno','C₇H₁₂']]}]}
    ]},
   {id:'het',t:'Heterogéneas',s:'heterocíclicas: el anillo tiene O, N o S',q:'¿Tiene alguna rama de carbonos sobre el anillo?',
    def:'En el anillo hay <b>al menos un heteroátomo</b> (O, N o S) intercalado entre carbonos. Se llaman heterocíclicas.',
    rec:['Cuenta los átomos del anillo: alguno no es carbono.'],
    ej:[['fu_oxirano','oxirano','C₂H₄O'],['fu_thf','tetrahidrofurano','C₄H₈O'],['fu_piperidina','piperidina','C₅H₁₁N']],
    ojo:'El heteroátomo debe estar <b>dentro</b> del anillo. Un −OH colgando del ciclohexano (ciclohexanol) no lo vuelve heterocíclico.',
    k:[
    {id:'het-sen',t:'Sencilla',s:'sin ramas',q:'¿Tiene dobles enlaces en el anillo?',
     def:'Anillo con heteroátomo y <b>sin ramas</b> de carbono.',
     rec:['Solo el anillo, con su O, N o S.'],
     ej:[['fu_thf','tetrahidrofurano','C₄H₈O'],['fu_dihidrofurano','dihidrofurano','C₄H₆O']],
     k:[
     {id:'het-sen-sat',t:'Saturada',
      def:'Heterociclo con <b>solo enlaces sencillos</b> dentro del anillo.',
      rec:['Ningún doble enlace en el anillo.'],
      ej:[['fu_oxirano','oxirano','C₂H₄O'],['fu_thf','tetrahidrofurano','C₄H₈O'],['fu_pirrolidina','pirrolidina','C₄H₉N'],['fu_piperidina','piperidina','C₅H₁₁N']],
      ojo:'El THF se usa como disolvente; la piperidina aparece en muchos medicamentos.'},
     {id:'het-sen-ins',t:'Insaturada',
      def:'Heterociclo con <b>al menos un doble enlace</b> en el anillo, pero sin la aromaticidad del benceno.',
      rec:['Anillo con O, N o S y un doble enlace C=C.'],
      ej:[['fu_dihidrofurano','dihidrofurano','C₄H₆O'],['fu_dihidropirano','dihidropirano','C₅H₈O']],
      ojo:'Si el anillo con heteroátomo tiene dobles enlaces alternados que se reparten por todo el anillo (como la piridina), es heterocíclico <b>aromático</b>.'}]},
    {id:'het-ram',t:'Ramificada',s:'con ramas sobre el anillo',q:'¿Tiene dobles enlaces en el anillo?',
     def:'Anillo con heteroátomo del que <b>cuelga una cadena de carbonos</b>.',
     rec:['Cuenta el anillo (con su heteroátomo) y luego la rama.'],
     ej:[['fu_metilthf','metiltetrahidrofurano','C₅H₁₀O'],['fu_metilpiperidina','metilpiperidina','C₆H₁₃N']],
     k:[
     {id:'het-ram-sat',t:'Saturada',
      def:'Heterociclo con una rama y <b>solo enlaces sencillos</b> en el anillo.',
      rec:['Anillo sin dobles enlaces, con un O, N o S y una cadena colgando.'],
      ej:[['fu_metilthf','metiltetrahidrofurano','C₅H₁₀O'],['fu_metilpiperidina','metilpiperidina','C₆H₁₃N']]},
     {id:'het-ram-ins',t:'Insaturada',
      def:'Heterociclo con una rama y <b>al menos un doble enlace</b> en el anillo.',
      rec:['Anillo con un heteroátomo, un doble enlace y una cadena colgando.'],
      ej:[['fu_metildihidrofurano','metildihidrofurano','C₅H₈O'],['fu_metiltetrahidropiridina','metiltetrahidropiridina','C₆H₁₁N']]}]}
    ]}
   ]}
  ]},
 {id:'aro',t:'Aromáticas',s:'anillo tipo benceno',q:'¿Cuántos anillos aromáticos tiene?',
  def:'Cadenas cerradas con un anillo tipo <b>benceno</b>: seis átomos con dobles enlaces alternados cuyos electrones π se reparten por todo el anillo (deslocalización). Son planas y muy estables. Se clasifican por el <b>número de anillos</b> (núcleos).',
  rec:['Anillo plano de 6 carbonos con tres dobles enlaces alternados (se dibuja también con un círculo adentro).','Mononucleares: un anillo. Polinucleares: varios.'],
  ej:[['fu_benceno','benceno','C₆H₆'],['fu_tolueno','tolueno','C₇H₈'],['fu_naftaleno','naftaleno','C₁₀H₈']],
  ojo:'Un anillo con un solo doble enlace (como el ciclohexeno) no es aromático.',
  k:[
  {id:'mon',t:'Mononucleares',s:'un solo anillo',q:'¿Tiene alguna rama de carbonos sobre el anillo?',
   def:'Tienen <b>un solo anillo</b> aromático (un núcleo). El más sencillo es el benceno.',
   rec:['Cuenta los anillos: solo uno.','La piridina tiene un N en el anillo: es un anillo aromático heterocíclico, también mononuclear.'],
   ej:[['fu_benceno','benceno','C₆H₆'],['fu_tolueno','tolueno','C₇H₈'],['fu_piridina','piridina','C₅H₅N']],
   k:[
   {id:'mon-sen',t:'Sencilla',s:'sin ramas',
    def:'Un solo anillo aromático <b>sin ramas</b> de carbono.',
    rec:['Solo el anillo: todos sus carbonos llevan H.'],
    ej:[['fu_benceno','benceno','C₆H₆'],['fu_piridina','piridina','C₅H₅N']],
    ojo:'En el benceno los tres dobles enlaces no están quietos: los electrones se reparten por todo el anillo, por eso se dibuja el círculo.'},
   {id:'mon-ram',t:'Ramificada',s:'con ramas sobre el anillo',
    def:'Un solo anillo aromático del que <b>cuelga una cadena de carbonos</b>.',
    rec:['Cuenta el anillo y luego lo que cuelga de él.'],
    ej:[['fu_tolueno','metilbenceno (tolueno)','C₇H₈'],['fu_etilbenceno','etilbenceno','C₈H₁₀']],
    ojo:'La rama de un anillo aromático se llama a veces cadena lateral.'}]},
  {id:'pol',t:'Polinucleares',s:'varios anillos',q:'¿Los anillos comparten un lado o están unidos por un enlace?',
   def:'Tienen <b>dos o más anillos</b> aromáticos (núcleos). Pueden compartir lados entre sí (condensados) o estar unidos por un enlace (aislados).',
   rec:['Cuenta los anillos: hay más de uno.'],
   ej:[['fu_naftaleno','naftaleno','C₁₀H₈'],['fu_antraceno','antraceno','C₁₄H₁₀'],['fu_bifenilo','bifenilo','C₁₂H₁₀']],
   k:[
   {id:'pol-con',t:'Condensados',s:'los anillos comparten un lado',
    def:'Los anillos vecinos <b>comparten dos carbonos</b>: están fusionados. Los carbonos compartidos no llevan hidrógeno.',
    rec:['Dos hexágonos pegados por un lado.'],
    ej:[['fu_naftaleno','naftaleno','C₁₀H₈'],['fu_antraceno','antraceno','C₁₄H₁₀']],
    ojo:'El naftaleno es el de las «bolitas» de naftalina contra la polilla.'},
   {id:'pol-ais',t:'Aislados',s:'unidos por un enlace',
    def:'Los anillos están <b>separados</b> y unidos por un enlace sencillo C−C; no comparten carbonos.',
    rec:['Dos o más anillos con un enlace entre ellos, sin lados en común.'],
    ej:[['fu_bifenilo','bifenilo','C₁₂H₁₀']],
    ojo:'No los confundas con los condensados: aquí cada anillo conserva sus seis carbonos propios.'}]}
  ]}
 ]};

/* ── Utilidades del árbol ─────────────────────────────────────────── */
var IDX={},PADRE={};
(function rec(n,p){IDX[n.id]=n;if(p)PADRE[n.id]=p.id;(n.k||[]).forEach(function(h){rec(h,n);});})(T,null);
function camino(id){var c=[],x=id;while(x){c.unshift(IDX[x]);x=PADRE[x];}return c;}
function esHoja(n){return !n.k;}
function hojas(n,a){a=a||[];if(esHoja(n))a.push(n);else n.k.forEach(function(h){hojas(h,a);});return a;}

/* ── Estilos ──────────────────────────────────────────────────────── */
var NIV=['#be185d','#1a6ea8','#166534','#7c3aed','#0e7490','#b45309'];
var NIVBG=['#fdf2f8','#eaf4fb','#ecfdf3','#f5f0ff','#ecfeff','#fff7ed'];
var CSS='.cm{display:block;overflow-x:auto;padding:6px 2px 10px}.cm .cm-row{display:flex;align-items:center;gap:0}'+
'.cm .cm-head{display:flex;flex-direction:column;align-items:flex-start;gap:4px;flex:0 0 auto}'+
'.cm .cm-n{font:700 .8rem/1.15 Outfit,sans-serif;text-align:left;border:2px solid;border-radius:12px;padding:6px 9px;cursor:pointer;min-height:38px;background:#fff;max-width:132px}'+
'.cm .cm-n small{display:block;font-weight:500;font-size:.62rem;opacity:.85;margin-top:1px}'+
'.cm .cm-n:hover{filter:brightness(.97);box-shadow:0 2px 8px rgba(13,34,51,.18)}.cm .cm-n:focus-visible{outline:3px solid #f59e0b;outline-offset:2px}'+
'.cm .cm-n .cm-i{float:right;margin-left:6px;font-size:.7rem;opacity:.7}'+
'.cm .cm-kids{display:flex;align-items:stretch;margin-left:2px}'+
'.cm .cm-brace{display:block;width:12px;flex:0 0 12px;margin:2px 1px 2px 3px;background:url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 10 100\' preserveAspectRatio=\'none\'%3E%3Cpath d=\'M9 1C4 1 5 6 5 12L5 38C5 46 3 50 1 50C3 50 5 54 5 62L5 88C5 94 4 99 9 99\' fill=\'none\' stroke=\'%2364748b\' stroke-width=\'1.8\' vector-effect=\'non-scaling-stroke\' stroke-linecap=\'round\'/%3E%3C/svg%3E") center/100% 100% no-repeat}'+
'.cm .cm-col{display:flex;flex-direction:column;justify-content:center;gap:8px;padding:1px 0}'+
'.cm .cm-ej{display:flex;gap:4px 8px;align-items:center;flex-wrap:wrap;max-width:210px}'+
'.cm .cm-ej span{font-size:.68rem;color:#475569}'+
'.cm-pista{font-size:.8rem;color:#64748b;margin:6px 0 0}'+
'@media(max-width:820px){.cm{overflow-x:visible}.cm .cm-row{display:block}.cm .cm-kids{display:block;margin:6px 0 2px 10px;border-left:2px solid #cbd5e1;padding-left:10px}.cm .cm-brace{display:none}.cm .cm-col{gap:8px}.cm .cm-n{max-width:none}}'+
/* ventana */
'.cm-ov{position:fixed;inset:0;background:rgba(13,34,51,.55);z-index:9000;display:flex;align-items:center;justify-content:center;padding:14px}'+
'.cm-md{background:#fff;border-radius:16px;max-width:640px;width:100%;max-height:92vh;overflow:auto;padding:20px 22px 18px;box-shadow:0 20px 50px rgba(0,0,0,.35);border-top:6px solid var(--cmc,#1a6ea8);position:relative}'+
'.cm-md h3{font-family:Fraunces,serif;font-size:1.35rem;font-weight:900;margin:2px 28px 2px 0;color:#0d2233}'+
'.cm-md .cm-ruta{font-size:.74rem;color:#64748b;margin-bottom:10px}.cm-md .cm-ruta b{color:#0d2233}'+
'.cm-md p,.cm-md li{font-size:.92rem;line-height:1.6;color:#334155}.cm-md p{margin:0 0 10px}.cm-md ul{margin:0 0 10px;padding-left:20px}'+
'.cm-md h4{font-size:.7rem;text-transform:uppercase;letter-spacing:.12em;color:var(--cmc,#1a6ea8);margin:12px 0 6px}'+
'.cm-md .cm-eg{display:grid;grid-template-columns:repeat(auto-fit,minmax(130px,1fr));gap:10px}'+
'.cm-md .cm-eg>div{border:1.5px solid #d0e6f5;border-radius:12px;padding:8px 6px;text-align:center;background:#f8fbfe}'+
'.cm-md .cm-eg svg{height:78px!important;width:auto!important;max-width:100%!important;display:block;margin:0 auto 4px}'+
'.cm-md .cm-eg b{display:block;font-size:.8rem;color:#0d2233}.cm-md .cm-eg em{font-style:normal;font-size:.74rem;color:#475569;font-family:"JetBrains Mono",monospace}'+
'.cm-md .cm-ojo{background:#fffbeb;border-left:4px solid #f59e0b;border-radius:8px;padding:8px 12px;margin:12px 0 0;font-size:.86rem;color:#78350f}'+
'.cm-md .cm-sub{display:flex;flex-wrap:wrap;gap:8px;margin-top:6px}.cm-md .cm-sub button,.cm-md .cm-x{font:700 .82rem Outfit,sans-serif;border:2px solid;border-radius:999px;padding:7px 13px;background:#fff;cursor:pointer;min-height:38px}'+
'.cm-md .cm-x{position:absolute;top:10px;right:10px;border-color:#cbd5e1;color:#334155;padding:4px 11px;min-height:34px}'+
/* impresión / versión fija */
'.cm.fijo{overflow:visible;padding:4px 0}.cm.fijo .cm-n{cursor:default;font-size:.9rem;padding:6px 11px;min-height:0;border-width:2px;max-width:190px}.cm.fijo .cm-n .cm-i{display:none}.cm.fijo .cm-col{gap:8px}'+
'.cm.fijo .cm-n small{font-size:.68rem}.cm.fijo .cm-head{flex-direction:row;align-items:center;gap:10px}.cm.fijo .cm-ej{max-width:none;flex-wrap:nowrap;gap:10px}.cm.fijo .cm-brace{width:18px;flex:0 0 18px}';

function inyecta(){if(document.getElementById('cm-css'))return;var s=document.createElement('style');s.id='cm-css';s.textContent=CSS;document.head.appendChild(s);}

/* ── Mapa ─────────────────────────────────────────────────────────── */
function estilo(d){return 'color:'+NIV[d%NIV.length]+';border-color:'+NIV[d%NIV.length]+';background:'+NIVBG[d%NIVBG.length];}
function nodo(n,d,fijo,prof){
  var corta=prof!=null&&d>=prof;
  var h='<div class="cm-row"><div class="cm-head"><button type="button" class="cm-n" data-id="'+n.id+'" style="'+estilo(d)+'"'+(fijo?' tabindex="-1"':' aria-haspopup="dialog"')+'>'+
    n.t+(fijo?'':'<span class="cm-i" aria-hidden="true">ⓘ</span>')+(n.s?'<small>'+n.s+'</small>':'')+'</button>';
  if(esHoja(n)&&!corta){
    h+='<div class="cm-ej">'+n.ej.slice(0,2).map(function(e){return mini(e[0],fijo?44:40,fijo?76:96);}).join('')+'</div>';
  }
  h+='</div>';
  if(n.k&&!corta)h+='<div class="cm-kids"><i class="cm-brace"></i><div class="cm-col">'+n.k.map(function(c){return nodo(c,d+1,fijo,prof);}).join('')+'</div></div>';
  return h+'</div>';
}

/* ── Ventana con la explicación ───────────────────────────────────── */
var ov=null,volver=null;
function cierra(){if(ov){ov.remove();ov=null;document.removeEventListener('keydown',tecla);}if(volver&&volver.focus)volver.focus();volver=null;}
function tecla(e){
  if(e.key==='Escape'){cierra();return;}
  if(e.key==='Tab'&&ov){var f=ov.querySelectorAll('button,a[href]');if(!f.length)return;var a=f[0],z=f[f.length-1];
    if(e.shiftKey&&document.activeElement===a){e.preventDefault();z.focus();}else if(!e.shiftKey&&document.activeElement===z){e.preventDefault();a.focus();}}
}
function abre(id,origen){
  var n=IDX[id];if(!n)return;if(ov){ov.remove();ov=null;}else{volver=origen||document.activeElement;}
  var ruta=camino(id),d=ruta.length-1,col=NIV[d%NIV.length];
  var h='<div class="cm-md" role="dialog" aria-modal="true" aria-labelledby="cm-tit" style="--cmc:'+col+'"><button type="button" class="cm-x" aria-label="Cerrar">✕ Cerrar</button>'+
    '<h3 id="cm-tit" style="color:'+col+'">'+n.t+(n.s?' <small style="font:500 .8rem Outfit,sans-serif;color:#64748b">· '+n.s+'</small>':'')+'</h3>'+
    '<div class="cm-ruta">'+ruta.map(function(r,i){return i===d?'<b>'+r.t+'</b>':r.t;}).join(' › ')+'</div>'+
    '<p>'+n.def+'</p><h4>Cómo reconocerla</h4><ul>'+n.rec.map(function(r){return '<li>'+r+'</li>';}).join('')+'</ul>'+
    '<h4>Ejemplos</h4><div class="cm-eg">'+n.ej.map(function(e){return '<div>'+F(e[0])+'<b>'+e[1]+'</b><em>'+e[2]+'</em></div>';}).join('')+'</div>'+
    (n.ojo?'<div class="cm-ojo">⚠️ <b>Ojo:</b> '+n.ojo+'</div>':'');
  if(n.k){h+='<h4>Se divide en</h4><div class="cm-sub">'+n.k.map(function(c,i){var cc=NIV[(d+1)%NIV.length];return '<button type="button" data-id="'+c.id+'" style="color:'+cc+';border-color:'+cc+'">'+c.t+'</button>';}).join('')+'</div>'+(n.q?'<p class="cm-pista" style="margin-top:10px">Para decidir, pregúntate: <b>'+n.q+'</b></p>':'');}
  else if(PADRE[id]){h+='<h4>Volver</h4><div class="cm-sub"><button type="button" data-id="'+PADRE[id]+'" style="color:#334155;border-color:#94a3b8">↑ '+IDX[PADRE[id]].t+'</button></div>';}
  h+='</div>';
  ov=document.createElement('div');ov.className='cm-ov';ov.innerHTML=h;document.body.appendChild(ov);
  ov.addEventListener('click',function(e){
    if(e.target===ov||e.target.closest('.cm-x')){cierra();return;}
    var b=e.target.closest('[data-id]');if(b)abre(b.dataset.id);
  });
  document.addEventListener('keydown',tecla);
  var x=ov.querySelector('.cm-x');if(x)x.focus();
}

function montar(el){
  inyecta();
  var fijo=el.getAttribute('data-cadmapa')==='fijo';
  var desde=IDX[el.getAttribute('data-desde')]||T,prof=el.getAttribute('data-prof'),d0=camino(desde.id).length-1;
  el.innerHTML='<div class="cm'+(fijo?' fijo':'')+'" role="group" aria-label="Mapa de clasificación de las cadenas carbonadas">'+nodo(desde,d0,fijo,prof==null?null:d0+(+prof))+'</div>';
  if(!fijo)el.addEventListener('click',function(e){var b=e.target.closest('.cm-n');if(b)abre(b.dataset.id,b);});
}
function inicia(){document.querySelectorAll('[data-cadmapa]').forEach(montar);}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',inicia);else inicia();

window.CADMAPA={arbol:T,idx:IDX,padre:PADRE,camino:camino,hojas:function(){return hojas(T);},abre:abre,montar:montar,estilo:estilo,NIV:NIV};
})();
