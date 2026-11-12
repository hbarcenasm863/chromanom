/* ════════════════════════════════════════════════════════════════════════
   icfes-datos.js — Preguntas oficiales del Icfes que corresponden a
   ChromaNom (química orgánica).
   Fuente: Icfes. (2026). Prueba Ciencias Naturales. Cuadernillo de
   preguntas. Saber 11.º. Bogotá D. C.: Dirección de Evaluación, Icfes.
   Las preguntas se copian SIN CAMBIOS (los términos de uso del Icfes
   prohíben transformarlas) y siempre se muestran con su crédito. Las
   estructuras van como figuras recortadas del cuadernillo (sin ramas entre
   paréntesis). Las de química general están en IonNom, las de biología en
   BioNom y las de física no se usan en ninguno de los tres sitios.
   Campos: n (número en el cuadernillo), t (tema de ChromaNom), af
   (afirmación oficial, ver saber-icfes.js), k (componente), ctx, q, o
   (opciones en el orden original A–D), r (respuesta oficial), img / imgOps
   (figuras en img/icfes/), tabla, exp (explicación de ChromaNom; no es del
   Icfes).
   ════════════════════════════════════════════════════════════════════════ */
(function(){
window.ICFES_DATOS={base:'img/icfes/',items:[
{n:41,t:'alcoholes',af:'E2',k:'Q',img:'q41-ctx.png',imgOps:'q41-ops.png',
 ctx:'Los alcoholes pueden ser oxidados a cetonas, aldehídos o ácidos carboxílicos de acuerdo con el tipo de alcohol que reacciona, como se muestra en la imagen. Para reconocer el tipo de compuesto que se forma en una oxidación se realizan las siguientes pruebas.',
 tabla:[['Prueba de Tollens','Prueba de Lucas','Prueba de yodoformo','Prueba de Yoduro-Yodato'],['Reconoce la presencia de aldehídos, si se forma un espejo de plata (color plateado) en el fondo del tubo de ensayo.','Reconoce la presencia de alcoholes, si se forma un precipitado insoluble en la reacción.','Reconoce la presencia de cetonas, si aparece un precipitado de color amarillo.','Reconoce la presencia de ácidos, si una solución con almidón se torna de color morado oscuro.']],
 q:'Si en un laboratorio se oxida un alcohol de 6 carbonos y se aplican las pruebas de reconocimiento de grupos funcionales obteniendo un espejo de plata y coloración morada con almidón, ¿cuál es la mezcla que se espera se haya formado después de la oxidación?',r:'B',
 exp:'El espejo de plata (Tollens) indica un aldehído y el color morado con almidón (yoduro-yodato) indica un ácido. Un alcohol primario de 6 carbonos se oxida a hexanal y, si sigue la oxidación, a ácido hexanoico: mezcla B. Las cetonas salen de alcoholes secundarios y darían la prueba de yodoformo.'},
{n:50,t:'alcoholes',af:'I1',k:'Q',img:['q50-t1.png','q50-t2.png'],
 ctx:'En clase, el profesor explica que la acidez de un alcohol está relacionada con su estructura y muestra la siguiente tabla con la estructura de los alcoholes de mayor a menor acidez (tabla 1). Luego le pide a sus estudiantes que revisen la siguiente tabla con la estructura de cuatro alcoholes (tabla 2):',
 q:'De acuerdo con lo anterior, ¿cuál es el alcohol que presenta la menor acidez?',
 o:['2-butanol.','Etanol.','2-metil-2-propanol.','2-propanol.'],r:'C',
 exp:'Según la tabla 1, los alcoholes terciarios son los menos ácidos. El único terciario de la tabla 2 es el 2-metil-2-propanol, cuyo carbono del −OH está unido a tres grupos CH₃ (C). El etanol es primario y el 2-butanol y el 2-propanol son secundarios.'}
]};
})();
