/* ════════════════════════════════════════════════════════════════════════
   ChromaNom — datos del Generador del docente (docente.html)

   Este archivo contiene SOLO contenido escrito para el generador de guías:
   - ALINEACION: textos de referencia curricular. Los de la Secretaría de
     Educación del Distrito (Bogotá, 2025) están copiados LITERALMENTE del
     documento "Priorización de aprendizajes para ciencias naturales y
     educación ambiental — Media" (licencia CC BY-NC-ND 4.0: se citan sin
     modificar y con su fuente). Los Estándares y DBA del MEN que no se
     pudieron verificar en el documento oficial van marcados.
   - TEMAS: contenido de las sesiones 1 (aprendizajes previos) y 2
     (información) de cada guía, ejemplo MDEC, práctica propia para temas
     que los bancos del Juego y del Generador todavía no cubren.
   - SABER: preguntas tipo Saber 11 de selección múltiple con única respuesta.
   - ABIERTAS: preguntas abiertas para complementar la evaluación.

   Los ejercicios de nombrar / dibujar / análisis por partes / reacciones NO
   están aquí: se leen en vivo de generador.html y juego.html (ver
   docente-app.js → cargarBancos). Así, cuando se agregan moléculas o temas
   al Juego o al Generador, el generador del docente los usa sin cambios.

   CONVENCIÓN INTERNA (para revisar la química): en cada pregunta de SABER,
   la PRIMERA opción del arreglo "o" es la correcta. Al imprimir, el orden de
   las opciones se baraja (distinto en la Forma A y en la Forma B) y la hoja
   impresa NO lleva clave de respuestas, por decisión del docente.

   Fórmulas: "f" es una fórmula semidesarrollada en texto (la dibuja el
   motor del Generador) o un arreglo de átomos en el formato MOLDES del
   Generador ({h: hidrógenos, s: símbolo, bu/bd: ramas arriba/abajo,
   bn/buBn/bdBn: orden de enlace}) para estructuras que el lector de texto
   no dibuja bien (ramas etilo, CX₃, tres grupos en carbonos seguidos).
   "t" es el texto alternativo si no se puede dibujar.
   ════════════════════════════════════════════════════════════════════════ */
(function(){
'use strict';

/* Atajos para escribir estructuras en formato MOLDES */
var CH3=[{h:3}], ET=[{h:2},{h:3}];
function X(s,h){return [{s:s,h:h||0}];}

var ALINEACION={
  fuenteSED:'Secretaría de Educación del Distrito (Bogotá, Colombia, 2025). Priorización de aprendizajes para ciencias naturales y educación ambiental — Media. Licencia CC BY-NC-ND 4.0. Textos citados sin modificaciones.',
  sed:[
    {id:'sed11q',grado:11,pag:14,proceso:'Enfoque sobre las ideas centrales de las Ciencias Naturales',componente:'Químico',
     texto:'Evalúa la estructura de las macromoléculas orgánicas físicas y químicas y su capacidad de cambio químico, para entender el comportamiento del carbono y su rol en la formación de estructuras complejas que permiten el desarrollo de la vida.',
     evid:[
      {id:'11q-ind1',comp:'Indagación',t:'Evalúa cómo la hibridación del carbono influye en la reactividad de los compuestos orgánicos, realizando predicciones sobre sus posibles interacciones químicas en reacciones simples.'},
      {id:'11q-ind2',comp:'Indagación',t:'Investiga la relación entre la estructura molecular de los hidrocarburos y su comportamiento en reacciones de sustitución y adición, utilizando simulaciones sencillas para predecir los productos que resulten.'},
      {id:'11q-ind3',comp:'Indagación',t:'Analiza el efecto de los grupos funcionales de los hidrocarburos en la polaridad y reactividad de moléculas orgánicas, realizando comparaciones entre compuestos que presentan variaciones estructurales mínimas.'},
      {id:'11q-exp1',comp:'Explicación de fenómenos',t:'Analiza cómo la teoría del enlace de valencia explica la formación y propiedades de enlaces químicos en moléculas, a través de ejemplos con sustancias químicas orgánicas cotidianas.'},
      {id:'11q-exp2',comp:'Explicación de fenómenos',t:'Explica cómo los orbitales moleculares influyen en las propiedades físicas y químicas de los compuestos orgánicos, aplicando este conocimiento para predecir la estabilidad de la reacción.'},
      {id:'11q-exp3',comp:'Explicación de fenómenos',t:'Desarrolla diferentes tipos de reacciones químicas como homolíticas, heterolíticas, pericíclicas y de óxido-reducción, a través de ejercicios y representaciones matemáticas.'},
      {id:'11q-uso1',comp:'Uso comprensivo del conocimiento científico',t:'Analiza la estructura y función de macromoléculas biológicas como proteínas, lípidos, aminoácidos y carbohidratos, demostrando con ejemplos específicos su papel en procesos metabólicos y celulares.'},
      {id:'11q-uso2',comp:'Uso comprensivo del conocimiento científico',t:'Aplica la nomenclatura orgánica para identificar y describir la estructura de compuestos químicos, a través de representaciones gráficas y fórmulas químicas asociadas a la resolución de problemas estructurales.'},
      {id:'11q-uso3',comp:'Uso comprensivo del conocimiento científico',t:'Evalúa el impacto del uso de compuestos orgánicos en el ambiente en situaciones de contexto vinculadas a la industria y sus efectos en la contaminación y el desarrollo sostenible.'}
     ]},
    {id:'sed11c',grado:11,pag:12,proceso:'Enfoque sobre la construcción del conocimiento científico',componente:'',
     texto:'Formula hipótesis utilizando modelos, datos e información relevante de diversas fuentes, para interpretar resultados experimentales considerando el margen de error, relaciones causales entre los datos y formas de comunicación de las conclusiones sobre fenómenos',
     evid:[
      {id:'11c-ind',comp:'Indagación',t:'Desarrolla hipótesis basadas en modelos y datos recopilados de diversas fuentes, evaluando los resultados experimentales a partir del margen de error, a través del ajuste a las conclusiones y de acuerdo con las relaciones causales identificadas en investigaciones sobre fenómenos naturales simples.'},
      {id:'11c-exp',comp:'Exploración de fenómenos',t:'Analiza fenómenos naturales cotidianos, utilizando datos experimentales para establecer relaciones causales, presentando los resultados en gráficos, tablas y formulando explicaciones fundamentadas en modelos científicos.'},
      {id:'11c-uso',comp:'Uso comprensivo del conocimiento científico',t:'Interpreta los resultados de experimentos en función de datos y fuentes científicas, formulando conclusiones coherentes con el margen de error y comunicando estos hallazgos, mediante funciones matemáticas y representaciones gráficas.'}
     ]},
    {id:'sed10q',grado:10,pag:8,proceso:'Enfoque sobre las ideas centrales de las Ciencias Naturales',componente:'Químico',
     texto:'Argumenta cómo las propiedades periódicas de los elementos, la acidez, la basicidad y los diferentes mecanismos de reacción química (óxido-reducción, descomposición, neutralización y precipitación) explican la formación de compuestos y el desarrollo de reacciones inorgánicas cotidianas, a partir de procesos biológicos e industriales básicos.',
     evid:[
      {id:'10q-exp1',comp:'Explicación de fenómenos',t:'Establece la estructura atómica y la discontinuidad de la materia para explicar las propiedades de los elementos y cómo su distribución determina la formación de compuestos, a través de modelos atómicos visuales que muestren la organización de los electrones.'},
      {id:'10q-exp2',comp:'Explicación de fenómenos',t:'Aplica el conocimiento de las propiedades periódicas de los elementos para predecir su comportamiento químico, desarrollando predicciones sobre reactividad y enlace químico en casos específicos para justificar sus resultados.'},
      {id:'10q-exp3',comp:'Explicación de fenómenos',t:'Analiza los diferentes tipos de enlaces químicos y su importancia en la formación de compuestos, identificando ejemplos de compuestos con distintos tipos de enlaces en contextos naturales y sintéticos.'}
     ]},
    {id:'sed10c',grado:10,pag:6,proceso:'Enfoque sobre la construcción del conocimiento científico',componente:'',
     texto:'Plantea preguntas para sustentar y adaptar diferentes tipos de modelos, con el objetivo de predecir fenómenos naturales de su contexto y analizar datos, utilizando herramientas matemáticas y diferenciando entre conceptos científicos como teorías, leyes y modelos.',
     evid:[
      {id:'10c-ind',comp:'Indagación',t:'Diseña preguntas asociadas a modelos matemáticos predictivos sobre fenómenos naturales del entorno local, comparando los resultados con datos históricos del territorio.'},
      {id:'10c-exp',comp:'Explicación de fenómenos',t:'Desarrolla modelos para explicar fenómenos naturales como el movimiento de cuerpos celestes o la propagación de ondas diferenciando entre teorías científicas, leyes y modelos, mediante experimentos o simulaciones.'},
      {id:'10c-uso',comp:'Uso comprensivo del conocimiento científico',t:'Analiza datos sobre fenómenos naturales, utilizando teorías, leyes y modelos científicos, y predice su comportamiento, explicando claramente la relación entre el modelo empleado y la teoría que lo sustenta.'}
     ]}
  ],
  /* Estándares Básicos de Competencias (MEN, 2004), grados 10.º–11.º.
     Los dos primeros coinciden palabra por palabra en varias fuentes
     secundarias; ninguno se pudo cotejar con el PDF oficial del MEN. */
  estandares:[
    {id:'est1',t:'Relaciono la estructura del carbono con la formación de moléculas orgánicas.',nota:'verificar redacción oficial (MEN, 2004)'},
    {id:'est2',t:'Relaciono grupos funcionales con las propiedades físicas y químicas de las sustancias.',nota:'verificar redacción oficial (MEN, 2004)'},
    {id:'est3',t:'Explico algunos cambios químicos que ocurren en el ser humano.',nota:'no verificado: verificar redacción oficial (MEN, 2004)'}
  ],
  /* Derechos Básicos de Aprendizaje: no se pudo consultar el documento
     oficial; por eso van como paráfrasis. */
  dba:[
    {id:'dba11a',grado:11,t:'Comprende que los diferentes mecanismos de reacción química (óxido-reducción, homólisis, heterólisis y pericíclicas) posibilitan la formación de distintos tipos de compuestos orgánicos.',nota:'paráfrasis — verificar redacción y número en los DBA del MEN'},
    {id:'dba11b',grado:11,t:'Clasifica compuestos orgánicos por sus grupos funcionales y los identifica mediante pruebas químicas sencillas.',nota:'paráfrasis — verificar en los DBA del MEN'},
    {id:'dba10a',grado:10,t:'Comprende la relación entre la estructura de los átomos, los tipos de enlace y las propiedades de las sustancias.',nota:'paráfrasis — verificar en los DBA del MEN'}
  ]
};

/* ──────────────────────────────────────────────────────────────────────
   TEMAS
   gen: temas de MOLS (nomenclatura) en generador.html
   jue: expresión para reconocer temas del Juego (incluye temas nuevos)
   rxn: temas de BANCO_RXN (reacciones) en generador.html
   ────────────────────────────────────────────────────────────────────── */
var TEMAS=[
 {id:'cadena',titulo:'Cadena principal, numeración y desempate',corto:'Cadena principal y desempate',
  gen:['alcanos'],jue:/cadena|desempate|error/i,rxn:[],soloRamificados:true,nomenclatura:true,
  alin:{g11:{sed:'sed11q',ev:['11q-uso2']},g10:{sed:'sed10q',ev:['10q-exp3']},est:['est1'],dba:['dba11b']},
  previos:{
   curiosos:['El índice de octano de la gasolina se mide comparándola con dos alcanos: el heptano (valor 0) y el 2,2,4-trimetilpentano, llamado «isooctano» (valor 100). Con casi los mismos átomos, la forma de la cadena cambia mucho el comportamiento en el motor.',
     'Con la fórmula C₁₀H₂₂ se pueden dibujar 75 alcanos distintos y con C₂₀H₄₂ más de 366 000. Sin reglas para escoger la cadena principal sería imposible darle a cada uno un nombre único.'],
   contexto:[{amb:'Nacional',t:'Las refinerías de Barrancabermeja (Santander) y Cartagena separan el petróleo en fracciones (gas, gasolina, queroseno, diésel). Cada fracción es una mezcla de hidrocarburos de distinto tamaño y ramificación.'},
     {amb:'Global',t:'La IUPAC (Unión Internacional de Química Pura y Aplicada) publica las reglas de nomenclatura para que un nombre signifique lo mismo en Colombia, Japón o Alemania. ChromaNom usa las recomendaciones de 2013.'}],
   cotidianos:['Gasolina corriente y extra (la extra tiene mayor índice de octano)','Gas de las pipetas: propano, butano y 2-metilpropano («isobutano»)','Vaselina y parafina: mezclas de alcanos de cadena larga'],
   activacion:['¿Por qué no basta con decir «un alcano de 8 carbonos» para identificar una sustancia?','Dibuja dos estructuras diferentes que tengan 5 carbonos. ¿Crees que tienen las mismas propiedades?','Si una molécula está dibujada en zigzag, ¿la cadena más larga es siempre la que se ve horizontal? Explica.']
  },
  info:{
   lectura:['En el método MDEC la parte ② (cadena principal) se decide antes de numerar y antes de nombrar sustituyentes. En los alcanos, la cadena principal es la cadena continua de carbonos más larga, aunque en el dibujo aparezca doblada o partida entre una rama y otra.',
     'Si dos cadenas tienen la misma longitud, se escoge la que tiene más sustituyentes (criterios de desempate de la página Principios).',
     'Luego se numera desde el extremo que da los localizadores más bajos al conjunto de sustituyentes: se comparan los números uno a uno y gana el primero que sea menor. Solo si hay empate total, el número menor va al sustituyente que se escribe primero en orden alfabético.',
     'Por último se escribe el nombre: sustituyentes en orden alfabético (los prefijos di-, tri-, tetra- no cuentan), cada uno con su localizador; comas entre números y guiones entre número y letra. Ejemplo: 3-etil-2,4-dimetilhexano.'],
   esquema:{raiz:'Nombrar un alcano ramificado',ramas:[
     {t:'1 · Cadena ②',items:['La más larga: cuenta todos los caminos','Empate: la de más sustituyentes']},
     {t:'2 · Numerar',items:['Localizadores más bajos al conjunto de sustituyentes','Empate total: orden alfabético']},
     {t:'3 · Sustituyentes ①',items:['metil, etil, propil…','di-, tri-, tetra- si se repiten','Orden alfabético']},
     {t:'4 · Escribir',items:['① + ② + ③ + ④','Comas entre números; guion entre número y letra']}]}
  },
  ejemplo:{f:[{h:3},{h:0,bu:CH3,bd:CH3},{h:2},{h:1,bd:CH3},{h:3}],t:'(CH₃)₃C−CH₂−CH(CH₃)−CH₃',
    partes:[['2,2,4-trimetil','r','tres metilos: dos en C2 y uno en C4'],['pent','c','5 carbonos en la cadena principal'],['an','i','solo enlaces sencillos'],['o','g','terminación de hidrocarburo']]},
  propia:[
   {f:[{h:3},{h:1,bd:ET},{h:2},{h:3}],t:'CH₃−CH(C₂H₅)−CH₂−CH₃',n:'3-metilpentano'},
   {f:[{h:3},{h:2},{h:1,bd:ET},{h:2},{h:3}],t:'CH₃−CH₂−CH(C₂H₅)−CH₂−CH₃',n:'3-etilpentano'},
   {f:[{h:3},{h:1,bd:ET},{h:1,bd:CH3},{h:3}],t:'CH₃−CH(C₂H₅)−CH(CH₃)−CH₃',n:'2,3-dimetilpentano'},
   {f:[{h:3},{h:1,bd:CH3},{h:2},{h:2},{h:1,bd:ET},{h:3}],t:'CH₃−CH(CH₃)−CH₂−CH₂−CH(C₂H₅)−CH₃',n:'2,5-dimetilheptano'},
   {f:[{h:3},{h:0,bu:CH3,bd:CH3},{h:2},{h:1,bd:CH3},{h:3}],t:'(CH₃)₃C−CH₂−CH(CH₃)−CH₃',n:'2,2,4-trimetilpentano'},
   {f:'CH₃−CH₂−CH(CH₃)−CH(CH₃)−CH₂−CH₂−CH₃',n:'3,4-dimetilheptano'},
   {f:'CH₃−CH(CH₃)−CH₂−CH(CH₃)−CH₃',n:'2,4-dimetilpentano'},
   {f:[{h:3},{h:1,bd:CH3},{h:1,bd:ET},{h:2},{h:3}],t:'CH₃−CH(CH₃)−CH(C₂H₅)−CH₂−CH₃',n:'3-etil-2-metilpentano'}
  ]},

 {id:'alcanos',titulo:'Alcanos y cicloalcanos',corto:'Alcanos',
  gen:['alcanos'],jue:/^alcanos$|cicloalc/i,rxn:['alcanos'],nomenclatura:true,
  alin:{g11:{sed:'sed11q',ev:['11q-ind1','11q-uso3']},g10:{sed:'sed10q',ev:['10q-exp3']},est:['est1'],dba:['dba11b']},
  previos:{
   curiosos:['El metano es el principal componente del gas natural; también lo producen las vacas durante la digestión y la basura que se descompone en los rellenos sanitarios.',
     'La parafina de las velas es una mezcla de alcanos de unos 20 a 40 carbonos.',
     'A los alcanos también se les llama parafinas, del latín parum affinis («poca afinidad»), porque reaccionan muy poco.'],
   contexto:[{amb:'Local',t:'En muchos hogares colombianos se cocina con gas natural domiciliario (sobre todo metano) o con pipetas de GLP (propano y butano).'},
     {amb:'Nacional',t:'Colombia extrae gas natural en La Guajira y en el piedemonte llanero (Casanare).'},
     {amb:'Global',t:'Por molécula, el metano atrapa calor en la atmósfera con más fuerza que el CO₂; reducir sus fugas es una meta climática mundial.'}],
   cotidianos:['Gas de la estufa y de las pipetas','Velas, vaselina y parafina','Gasolina y diésel','Ciclohexano: materia prima en la fabricación del nailon'],
   activacion:['¿Por qué el gas de la estufa se guarda a presión en pipetas y la parafina es sólida, si ambos son alcanos?','¿Qué productos se forman cuando se quema el gas de la estufa? ¿Qué pasa si falta aire?','¿Qué diferencia hay entre una cadena abierta de carbonos y un anillo?']
  },
  info:{
   lectura:['Los alcanos son hidrocarburos saturados: solo tienen enlaces sencillos C−C y C−H. Cada carbono tiene hibridación sp³ y geometría tetraédrica (ángulos cercanos a 109,5°). Los de cadena abierta cumplen la fórmula general CₙH₂ₙ₊₂.',
     'Los cicloalcanos forman un anillo y cumplen CₙH₂ₙ: ciclopropano, ciclobutano, ciclopentano, ciclohexano. Se nombran con el prefijo ciclo- y, si tienen un solo sustituyente, no se escribe localizador: metilciclohexano.',
     'Son apolares e insolubles en agua. Su punto de ebullición aumenta con el tamaño de la cadena y disminuye con la ramificación. Reaccionan poco: arden (combustión) y, con luz o calor, cambian hidrógenos por halógenos (halogenación por radicales).',
     'En el método MDEC, el nombre de un alcano tiene ② cadena + ③ -an- + ④ -o: but-an-o. Las ramificaciones son la parte ①.'],
   esquema:{raiz:'Alcanos',ramas:[
     {t:'Estructura',items:['C sp³, tetraédrico','CₙH₂ₙ₊₂ (abiertos)','CₙH₂ₙ (cicloalcanos)']},
     {t:'Nombre',items:['Prefijo de carbonos + -ano','ciclo- para anillos','Ramas alquilo en ①']},
     {t:'Propiedades',items:['Apolares, insolubles en agua','Ebullición ↑ con la cadena','Ebullición ↓ con la ramificación']},
     {t:'Reacciones',items:['Combustión → CO₂ + H₂O','Halogenación con luz (radicales)']}]}
  },
  ejemplo:{f:'CH₃−CH(CH₃)−CH₂−CH₃',partes:[['2-metil','r','metilo en C2'],['but','c','4 carbonos'],['an','i','solo enlaces sencillos'],['o','g','terminación de hidrocarburo']]},
  propia:[]},

 {id:'alquenos',titulo:'Alquenos y alquinos',corto:'Alquenos y alquinos',
  gen:['alquenos','alquinos'],jue:/^alquenos$|^alquinos$|dieno|eninos?/i,rxn:['alquenos','alquinos'],nomenclatura:true,
  alin:{g11:{sed:'sed11q',ev:['11q-ind2','11q-uso2']},g10:{sed:'sed10q',ev:['10q-exp3']},est:['est1'],dba:['dba11a']},
  previos:{
   curiosos:['El eteno (etileno) es una hormona vegetal: un banano maduro libera eteno y acelera la maduración de las frutas que tiene cerca.',
     'El color rojo del tomate se debe al licopeno, una molécula con 11 dobles enlaces conjugados.',
     'El etino (acetileno) arde con oxígeno a unos 3 000 °C; por eso se usa en la soldadura oxiacetilénica.'],
   contexto:[{amb:'Nacional',t:'Colombia es uno de los grandes exportadores de banano (Urabá y Magdalena). La fruta viaja verde y en el país de destino se madura en cámaras con eteno.'},
     {amb:'Local',t:'En algunas plazas de mercado se usa «carburo» (carburo de calcio) para madurar fruta: con la humedad libera etino, que imita el efecto del eteno. No se recomienda, porque el carburo comercial puede traer impurezas tóxicas.'},
     {amb:'Global',t:'El polietileno, el plástico que más se produce en el mundo, se fabrica uniendo millones de moléculas de eteno.'}],
   cotidianos:['Bolsas y envases de polietileno','Soldadura con acetileno (etino)','Caucho natural (con muchos dobles enlaces)','Tomate y zanahoria (licopeno y betacaroteno)'],
   activacion:['¿Por qué las frutas maduran más rápido si se guardan juntas en una bolsa cerrada?','¿Qué diferencia esperarías entre dos carbonos unidos por un enlace sencillo y dos unidos por un enlace doble?','Nombra tres objetos de tu casa hechos de polietileno.']
  },
  info:{
   lectura:['Los alquenos tienen al menos un doble enlace C=C (fórmula CₙH₂ₙ si tienen uno solo) y los alquinos un triple enlace C≡C (CₙH₂ₙ₋₂). Los carbonos del doble enlace son sp² (geometría plana, 120°) y los del triple, sp (lineal, 180°).',
     'En el método MDEC, el doble o triple enlace es la parte ③: se cambia -an- por -en- o -in- y se escribe justo antes el localizador del primer carbono del enlace múltiple: but-1-eno, pent-2-ino.',
     'La cadena principal debe contener el enlace múltiple y se numera dándole el localizador más bajo. Si un doble y un triple enlace quedan a la misma distancia de los extremos, el doble recibe el número menor: pent-1-en-4-ino.',
     'El enlace π es más débil y está más expuesto que el σ; por eso alquenos y alquinos dan reacciones de adición (H₂, X₂, HX, H₂O). En la adición de HX a un alqueno asimétrico se cumple la regla de Markovnikov: el H va al carbono con más hidrógenos.'],
   esquema:{raiz:'Alquenos y alquinos',ramas:[
     {t:'Estructura',items:['C=C: carbonos sp², plano','C≡C: carbonos sp, lineal']},
     {t:'Nombre ③',items:['-en- / -in- con localizador','La cadena contiene el enlace múltiple','Empate: el doble enlace gana']},
     {t:'Reactividad',items:['Adición (H₂, X₂, HX, H₂O)','Regla de Markovnikov','Prueba: decoloran el agua de bromo']},
     {t:'Isomería',items:['cis/trans en alquenos','Requiere dos grupos distintos en cada C del doble enlace']}]}
  },
  ejemplo:{f:'CH₂=CH−CH(CH₃)−CH₃',partes:[['3-metil','r','metilo en C3'],['but','c','4 carbonos'],['-1-en-','i','doble enlace en C1'],['o','g','terminación de hidrocarburo']]},
  propia:[]},

 {id:'aromaticos',titulo:'Compuestos aromáticos (benceno)',corto:'Aromáticos',
  gen:['benceno'],jue:/^benceno$|aromat/i,rxn:['benceno'],nomenclatura:true,
  alin:{g11:{sed:'sed11q',ev:['11q-ind2','11q-uso2','11q-uso3']},g10:{sed:'sed10q',ev:['10q-exp3']},est:['est1'],dba:['dba11a']},
  previos:{
   curiosos:['Michael Faraday aisló el benceno en 1825 a partir del gas que se usaba para el alumbrado público.',
     'August Kekulé propuso en 1865 la estructura en anillo del benceno. Hoy se sabe que sus seis electrones π están repartidos (deslocalizados) por todo el anillo.',
     'La vainillina, responsable del aroma de la vainilla, tiene un anillo bencénico.'],
   contexto:[{amb:'Local',t:'El thinner y algunos pegantes contienen tolueno (metilbenceno). Inhalarlos es peligroso para el sistema nervioso.'},
     {amb:'Nacional',t:'La vainilla es el fruto de una orquídea americana del género Vanilla; en Colombia crecen varias especies silvestres de este género.'},
     {amb:'Global',t:'El benceno está clasificado como cancerígeno para los seres humanos; por eso se limita su contenido en la gasolina y en los solventes.'}],
   cotidianos:['Icopor (poliestireno)','Bolas antipolillas (naftaleno o 1,4-diclorobenceno)','Aspirina e ibuprofeno','Thinner (tolueno, xilenos)'],
   activacion:['¿Por qué algunos solventes, como el thinner, advierten que no se deben inhalar?','¿Qué tienen en común el aroma de la vainilla y el icopor?','Dibuja un hexágono con tres dobles enlaces alternados. ¿Crees que reaccionará igual que un alqueno? ¿Por qué?']
  },
  info:{
   lectura:['Los compuestos aromáticos contienen el anillo del benceno, C₆H₆: seis carbonos sp² en un hexágono plano, con seis electrones π deslocalizados (por eso a veces se dibuja con un círculo dentro). Esa deslocalización le da una estabilidad especial.',
     'Por esa estabilidad, el benceno no da adición como los alquenos sino sustitución electrofílica (halogenación con catalizador, nitración, sulfonación, alquilación): cambia un H por otro grupo y conserva el anillo.',
     'En el método MDEC, el anillo cumple a la vez el papel de ② (cadena) y ④ (terminación): metilbenceno, clorobenceno, nitrobenceno. Con dos sustituyentes se usan los localizadores 1,2 / 1,3 / 1,4, que en nombres tradicionales son orto-, meta- y para-.',
     'Algunos nombres tradicionales siguen aceptados: tolueno (metilbenceno), fenol (C₆H₅−OH) y anilina (C₆H₅−NH₂).'],
   esquema:{raiz:'Compuestos aromáticos',ramas:[
     {t:'Estructura',items:['C₆H₆, anillo plano','C sp²','6 electrones π deslocalizados']},
     {t:'Nombre',items:['Prefijo + benceno','1,2 / 1,3 / 1,4 = orto / meta / para']},
     {t:'Reactividad',items:['Sustitución electrofílica','No da adición fácilmente']},
     {t:'Usos y riesgos',items:['Solventes, plásticos, fármacos','El benceno es cancerígeno']}]}
  },
  ejemplo:{gen:'1,2-dimetilbenceno',partes:[['1,2-dimetil','r','dos metilos en carbonos vecinos'],['benceno','cg','anillo aromático (② y ④ a la vez)']]},
  propia:[]},

 {id:'haluros',titulo:'Haluros de alquilo',corto:'Haluros de alquilo',
  gen:[],jue:/hal(o|u)/i,rxn:['halogenuros'],nomenclatura:true,
  alin:{g11:{sed:'sed11q',ev:['11q-uso2','11q-exp3','11q-uso3']},g10:{sed:'sed10q',ev:['10q-exp3']},est:['est2'],dba:['dba11a']},
  previos:{
   curiosos:['El cloroformo (triclorometano) se usó como anestésico en el siglo XIX; hoy se sabe que es tóxico para el hígado.',
     'El halotano (2-bromo-2-cloro-1,1,1-trifluoroetano) fue un anestésico inhalado muy usado desde la década de 1950.',
     'Las algas marinas producen de forma natural bromometano y otros haluros.'],
   contexto:[{amb:'Global',t:'Los CFC (clorofluorocarbonos) de neveras y aerosoles destruían la capa de ozono. El Protocolo de Montreal (1987), del que Colombia hace parte, los eliminó.'},
     {amb:'Nacional',t:'En Colombia el PVC (policloruro de vinilo) se usa en tuberías de agua y en el aislamiento de cables. Se fabrica a partir del cloroeteno.'},
     {amb:'Local',t:'Algunos plaguicidas organoclorados, como el DDT, se usaron en campañas contra la malaria y hoy están prohibidos por su persistencia en el ambiente.'}],
   cotidianos:['Tubos de PVC','Sartenes antiadherentes (politetrafluoroeteno)','Gases refrigerantes','Removedor de pintura (diclorometano)'],
   activacion:['¿Por qué un compuesto muy estable, que casi no se degrada, puede convertirse en un problema ambiental?','¿Qué tienen en común un tubo de PVC y un sartén antiadherente?','Si cambias un H del metano por un Cl, ¿cómo cambia la polaridad de la molécula?']
  },
  info:{
   lectura:['Un haluro de alquilo (o haloalcano) tiene un halógeno (F, Cl, Br, I) unido a un carbono sp³: R−X. Según cuántos carbonos estén unidos al carbono del halógeno, el haluro es primario, secundario o terciario.',
     'En la nomenclatura IUPAC el halógeno no es un grupo funcional principal sino un sustituyente: es la parte ① del método MDEC (fluoro-, cloro-, bromo-, yodo-) y se ordena alfabéticamente junto con los grupos alquilo: 2-cloro-3-metilbutano. Nombres como «cloruro de metilo» son tradicionales.',
     'El enlace C−X es polar (Cδ+ − Xδ−) y el carbono es atacado por nucleófilos. Con OH⁻ en agua ocurre sustitución nucleofílica (R−X → R−OH); con una base fuerte en etanol caliente predomina la eliminación de HX y se forma un alqueno.',
     'Muchos haluros son persistentes: algunos dañan la capa de ozono y otros se acumulan en los seres vivos.'],
   esquema:{raiz:'Haluros de alquilo R−X',ramas:[
     {t:'Estructura',items:['X = F, Cl, Br, I','Carbono sp³','Primario, secundario, terciario']},
     {t:'Nombre ①',items:['fluoro, cloro, bromo, yodo','Orden alfabético con los alquilos','Localizador más bajo posible']},
     {t:'Reactividad',items:['C−X polar','Sustitución nucleofílica → alcohol','Eliminación → alqueno']},
     {t:'Ambiente',items:['CFC y capa de ozono','PVC','Plaguicidas persistentes']}]}
  },
  ejemplo:{f:'CH₃−CH(Cl)−CH(CH₃)−CH₃',partes:[['2-cloro-3-metil','r','cloro en C2 y metilo en C3'],['but','c','4 carbonos'],['an','i','solo enlaces sencillos'],['o','g','terminación de hidrocarburo']]},
  propia:[
   {f:'CH₃−CH₂−Cl',n:'cloroetano'},
   {f:'CH₃−CHCl−CH₃',n:'2-cloropropano'},
   {f:'CH₂Cl−CH₂−CH₃',n:'1-cloropropano'},
   {f:'CH₃−CH(Br)−CH₂−CH₃',n:'2-bromobutano'},
   {f:[{h:3},{h:0,bu:X('Cl'),bd:CH3},{h:3}],t:'(CH₃)₃C−Cl',n:'2-cloro-2-metilpropano'},
   {f:'CH₂Br−CH₂Br',n:'1,2-dibromoetano'},
   {f:[{s:'Cl',h:0},{h:1,bu:X('Cl'),bd:X('Cl')}],t:'CHCl₃',n:'triclorometano'},
   {f:'CH₂=CH−CH₂−Cl',n:'3-cloroprop-1-eno'},
   {f:'CH₃−CH(Cl)−CH(CH₃)−CH₃',n:'2-cloro-3-metilbutano'},
   {f:'CH₃−CH₂−CH(I)−CH₃',n:'2-yodobutano'},
   {f:'CH₂F−CH₂−CH₂−CH₃',n:'1-fluorobutano'},
   {f:'CH₃−CHBr−CH₂−CH₂Cl',n:'3-bromo-1-clorobutano'}
  ]},

 {id:'alcoholes',titulo:'Alcoholes, fenoles y éteres',corto:'Alcoholes y éteres',
  gen:['alcoholes','eteres'],jue:/^alcoholes$|^eteres$|fenol/i,rxn:['alcoholes','eteres'],nomenclatura:true,
  alin:{g11:{sed:'sed11q',ev:['11q-uso2','11q-ind3']},g10:{sed:'sed10q',ev:['10q-exp3']},est:['est2'],dba:['dba11b']},
  previos:{
   curiosos:['El etanol de las bebidas se produce por fermentación de azúcares; la chicha y el guarapo son bebidas fermentadas tradicionales de Colombia.',
     'El glicerol (propano-1,2,3-triol) tiene tres grupos −OH; se usa en cremas porque retiene la humedad.',
     'El fenol fue el primer antiséptico usado en cirugía (Joseph Lister, 1867), y el etoxietano (dietil éter) se usó como anestésico desde 1846.'],
   contexto:[{amb:'Nacional',t:'Colombia mezcla la gasolina con etanol carburante producido a partir de caña de azúcar, principalmente en el valle del río Cauca.'},
     {amb:'Local',t:'Las autoridades de salud alertan con frecuencia sobre licor adulterado con metanol, que puede causar ceguera o la muerte.'},
     {amb:'Global',t:'Durante la pandemia de COVID-19 el gel antibacterial con 60 % a 80 % de alcohol se volvió un producto de uso mundial.'}],
   cotidianos:['Alcohol antiséptico (etanol o propan-2-ol)','Gel antibacterial','Glicerina','Mentol de dulces y ungüentos'],
   activacion:['¿Por qué el alcohol se mezcla con el agua y el aceite no?','¿Por qué el metanol es tan peligroso si se parece tanto al etanol?','¿Qué crees que le pasa al etanol dentro del cuerpo después de tomar una bebida alcohólica?']
  },
  info:{
   lectura:['Un alcohol tiene un grupo hidroxilo (−OH) unido a un carbono sp³; un fenol tiene el −OH unido directamente a un anillo aromático; un éter tiene un oxígeno unido a dos grupos carbonados (R−O−R′).',
     'En el método MDEC, el −OH de los alcoholes es la parte ④ y da el sufijo -ol con su localizador: propan-2-ol. La cadena principal debe contener el carbono del −OH y se numera para darle el número más bajo. Si hay varios −OH: -diol, -triol (etano-1,2-diol).',
     'Los éteres se nombran como alcoxialcanos: el grupo R−O− más pequeño es un sustituyente (parte ①: metoxi, etoxi) de la cadena más larga: metoxietano. También se usa el nombre funcional: etil metil éter.',
     'El −OH forma puentes de hidrógeno: por eso los alcoholes pequeños se mezclan con agua y hierven a temperaturas mucho más altas que alcanos y éteres de masa parecida. Los alcoholes primarios se oxidan a aldehídos y ácidos; los secundarios, a cetonas; los terciarios no se oxidan con facilidad.'],
   esquema:{raiz:'Alcoholes, fenoles y éteres',ramas:[
     {t:'Alcohol R−OH',items:['Sufijo -ol (④)','Primario, secundario, terciario']},
     {t:'Fenol Ar−OH',items:['−OH unido al anillo','Ácido débil']},
     {t:'Éter R−O−R′',items:['Prefijo alcoxi- (①)','No forma puentes de H entre sus moléculas']},
     {t:'Propiedades y reacciones',items:['Puentes de hidrógeno','Oxidación, deshidratación','Combustión']}]}
  },
  ejemplo:{f:'CH₃−CH(OH)−CH₂−CH(CH₃)−CH₃',partes:[['4-metil','r','metilo en C4'],['pent','c','5 carbonos'],['an','i','solo enlaces sencillos'],['-2-ol','g','−OH en C2']]},
  propia:[]},

 {id:'carbonilos',titulo:'Aldehídos y cetonas',corto:'Aldehídos y cetonas',
  gen:['aldehidos','cetonas'],jue:/^aldehidos$|^cetonas$/i,rxn:['aldehidos','cetonas'],nomenclatura:true,
  alin:{g11:{sed:'sed11q',ev:['11q-uso2','11q-ind3']},g10:{sed:'sed10q',ev:['10q-exp3']},est:['est2'],dba:['dba11b']},
  previos:{
   curiosos:['La vainillina (vainilla) y el cinamaldehído (canela) son aldehídos.',
     'La propanona (acetona) es el componente principal de muchos quitaesmaltes.',
     'La butano-2,3-diona da el aroma a mantequilla de las crispetas de microondas.'],
   contexto:[{amb:'Local',t:'El formol, una solución de metanal, se usa en los laboratorios de biología para conservar muestras; es irritante y cancerígeno.'},
     {amb:'Nacional',t:'La canela y la vainilla son condimentos comunes en postres colombianos como el arroz con leche y la natilla.'},
     {amb:'Global',t:'El metanal es materia prima de resinas para tableros de madera aglomerada; varios países regulan cuánto puede liberarse dentro de las viviendas.'}],
   cotidianos:['Quitaesmalte (propanona)','Canela y vainilla','Crispetas con sabor a mantequilla','Formol de laboratorio'],
   activacion:['¿Qué tienen en común el olor de la canela y el de la vainilla?','¿Por qué el quitaesmalte disuelve el esmalte y el agua no?','¿Qué crees que indican las terminaciones -al de «metanal» y -ona de «propanona»?']
  },
  info:{
   lectura:['Aldehídos y cetonas tienen el grupo carbonilo C=O. En un aldehído, el carbono del carbonilo está unido al menos a un hidrógeno (−CHO); en una cetona, a dos carbonos (R−CO−R′).',
     'En el método MDEC el carbonilo es la parte ④. Aldehído: sufijo -al; en una cadena abierta el −CHO siempre es C1 y por eso no se escribe su localizador (butanal). Cetona: sufijo -ona con localizador (pentan-2-ona).',
     'El C=O es polar: el carbono es δ+ y lo atacan los nucleófilos (adición nucleofílica). Los aldehídos se oxidan con facilidad a ácidos carboxílicos y dan positivas las pruebas de Tollens (espejo de plata) y Fehling (precipitado rojo ladrillo); las cetonas no.',
     'Se obtienen por oxidación de alcoholes: un alcohol primario da un aldehído y uno secundario, una cetona.'],
   esquema:{raiz:'Aldehídos y cetonas (C=O)',ramas:[
     {t:'Aldehído R−CHO',items:['Sufijo -al','El −CHO es C1: sin localizador']},
     {t:'Cetona R−CO−R′',items:['Sufijo -ona','Con localizador']},
     {t:'Reacciones',items:['Adición nucleofílica','El aldehído se oxida a ácido','Tollens y Fehling: positivas en aldehídos']},
     {t:'Origen',items:['Alcohol 1° → aldehído','Alcohol 2° → cetona']}]}
  },
  ejemplo:{f:'CH₃−CO−CH₂−CH(CH₃)−CH₃',partes:[['4-metil','r','metilo en C4'],['pent','c','5 carbonos'],['an','i','solo enlaces sencillos'],['-2-ona','g','C=O en C2']]},
  propia:[]},

 {id:'acidos',titulo:'Ácidos carboxílicos y ésteres',corto:'Ácidos y ésteres',
  gen:['acidos','esteres'],jue:/^acidos$|^esteres$/i,rxn:['acidos','esteres'],nomenclatura:true,
  alin:{g11:{sed:'sed11q',ev:['11q-uso2','11q-ind3','11q-uso3']},g10:{sed:'sed10q',ev:['10q-exp3']},est:['est2'],dba:['dba11b']},
  previos:{
   curiosos:['El vinagre es una solución de ácido etanoico (acético) en agua, de alrededor del 4 % al 5 %.',
     'El olor del sudor y de algunos quesos se debe a ácidos carboxílicos como el ácido butanoico.',
     'El aroma del banano se debe en parte al etanoato de 3-metilbutilo, y el de la piña al butanoato de etilo: ambos son ésteres.'],
   contexto:[{amb:'Nacional',t:'Colombia es el mayor productor de aceite de palma de América. Parte de ese aceite se transforma en biodiésel (ésteres metílicos) que se mezcla con el diésel.'},
     {amb:'Local',t:'El jabón artesanal se obtiene calentando grasa o aceite con lejía (NaOH): es la reacción de saponificación.'},
     {amb:'Global',t:'El PET de las botellas plásticas es un poliéster; recuperarlo y reciclarlo es un reto mundial.'}],
   cotidianos:['Vinagre','Jabón','Botellas de PET','Esencias de frutas','Limón (ácido cítrico)'],
   activacion:['¿Por qué el vinagre sirve para quitar el sarro de una olla?','¿Qué tienen en común un jabón y un aceite de cocina?','¿Por qué un dulce con «sabor artificial a banano» huele parecido a la fruta?']
  },
  info:{
   lectura:['Un ácido carboxílico tiene el grupo carboxilo −COOH. En el método MDEC el −COOH es la parte ④: el nombre se forma con la palabra ácido + cadena + -oico, y el carbono del −COOH siempre es C1: ácido 3-metilbutanoico.',
     'Son ácidos débiles: en agua ceden parcialmente un H⁺ y forman iones carboxilato. Sus moléculas se unen de a dos por puentes de hidrógeno, por eso tienen puntos de ebullición altos.',
     'Un éster (R−COO−R′) se forma a partir de un ácido y un alcohol (esterificación, con H₂SO₄ como catalizador). Se nombra cambiando -oico por -oato y añadiendo «de» + el grupo que viene del alcohol: etanoato de etilo.',
     'La hidrólisis de un éster con una base (NaOH) se llama saponificación; con las grasas produce jabón y glicerol.'],
   esquema:{raiz:'Ácidos carboxílicos y ésteres',ramas:[
     {t:'Ácido R−COOH',items:['ácido …-oico','El −COOH es C1','Ácido débil']},
     {t:'Éster R−COO−R′',items:['…-oato de …-ilo','Aromas de frutas']},
     {t:'Reacciones',items:['Esterificación (H₂SO₄)','Saponificación → jabón','Neutralización con bases']},
     {t:'Contexto',items:['Vinagre','Biodiésel de palma','PET']}]}
  },
  ejemplo:{f:'CH₃−CH(CH₃)−CH₂−COOH',partes:[['ácido','g','palabra del grupo funcional'],['3-metil','r','metilo en C3'],['but','c','4 carbonos'],['an','i','solo enlaces sencillos'],['oico','g','grupo −COOH']]},
  propia:[]},

 {id:'nitrogenados',titulo:'Aminas, amidas y nitrilos',corto:'Compuestos nitrogenados',
  gen:['aminas','amidas','nitrilos'],jue:/^aminas$|^amidas$|^nitrilos$/i,rxn:['aminas','amidas','nitrilos'],nomenclatura:true,
  alin:{g11:{sed:'sed11q',ev:['11q-uso2','11q-ind3']},g10:{sed:'sed10q',ev:['10q-exp3']},est:['est2'],dba:['dba11b']},
  previos:{
   curiosos:['El olor a pescado se debe a aminas como la trimetilamina (N,N-dimetilmetanamina).',
     'La urea, una amida, fue en 1828 el primer compuesto orgánico preparado en el laboratorio a partir de una sustancia inorgánica (Friedrich Wöhler).',
     'El nailon es una poliamida y el paracetamol (acetaminofén) contiene un grupo amida.'],
   contexto:[{amb:'Local',t:'La yuca amarga contiene linamarina, un compuesto con grupo nitrilo que puede liberar cianuro de hidrógeno (HCN). Rallarla, lavarla y cocinarla elimina el riesgo.'},
     {amb:'Nacional',t:'La urea es uno de los fertilizantes nitrogenados más usados en los cultivos colombianos.'},
     {amb:'Global',t:'La cafeína y la nicotina son compuestos nitrogenados que actúan sobre el sistema nervioso; el café es uno de los productos que más exporta Colombia.'}],
   cotidianos:['Paracetamol (acetaminofén)','Urea (fertilizante)','Medias y cuerdas de nailon','Café (cafeína)'],
   activacion:['¿Por qué se acostumbra echarle limón al pescado?','¿Qué elemento químico tienen en común las proteínas, la urea y el nailon?','¿Por qué la yuca amarga no se come cruda?']
  },
  info:{
   lectura:['Las aminas derivan del amoníaco (NH₃) cuando se cambian hidrógenos por grupos carbonados: primarias (R−NH₂), secundarias (R−NH−R′) y terciarias (R₃N). Se nombran con el sufijo -amina (parte ④ del MDEC): etanamina; los grupos unidos al nitrógeno llevan el localizador N: N-metiletanamina.',
     'Las amidas tienen el grupo −CO−NH₂ (un carbonilo unido a nitrógeno); se nombran con -amida y el carbono del grupo es C1: propanamida. Los nitrilos tienen el grupo −C≡N; se nombran con -nitrilo contando el carbono del grupo: propanonitrilo (CH₃−CH₂−C≡N).',
     'El nitrógeno de las aminas tiene un par de electrones libre: por eso son bases débiles y reaccionan con ácidos formando sales. Las amidas casi no son básicas porque ese par está deslocalizado hacia el carbonilo.',
     'Orden de prioridad para nombrar: ácido > éster > amida > nitrilo > aldehído > cetona > alcohol > amina.'],
   esquema:{raiz:'Compuestos nitrogenados',ramas:[
     {t:'Aminas',items:['R−NH₂, R−NH−R′, R₃N','Sufijo -amina','Bases débiles']},
     {t:'Amidas',items:['R−CO−NH₂','Sufijo -amida (C1)']},
     {t:'Nitrilos',items:['R−C≡N','Sufijo -nitrilo (cuenta el C del grupo)']},
     {t:'Contexto',items:['Proteínas (enlace amida)','Fármacos','Fertilizantes']}]}
  },
  ejemplo:{f:'CH₃−CH₂−CO−NH₂',partes:[['prop','c','3 carbonos (incluye el del grupo)'],['an','i','solo enlaces sencillos'],['amida','g','grupo −CO−NH₂']]},
  propia:[]},

 {id:'polifuncionales',titulo:'Compuestos polifuncionales (prioridad de grupos)',corto:'Polifuncionales',
  gen:[],jue:/polif/i,rxn:[],nomenclatura:true,
  alin:{g11:{sed:'sed11q',ev:['11q-uso2','11q-uso1']},g10:{sed:'sed10q',ev:['10q-exp3']},est:['est2','est3'],dba:['dba11b']},
  previos:{
   curiosos:['El ácido láctico (ácido 2-hidroxipropanoico) da el sabor ácido al kumis y al yogur.',
     'Los aminoácidos que forman las proteínas tienen a la vez un grupo amino (−NH₂) y un grupo carboxilo (−COOH).',
     'El ácido cítrico del limón tiene tres grupos −COOH y un grupo −OH.'],
   contexto:[{amb:'Local',t:'El kumis, bebida láctea fermentada muy común en Colombia, es ácido por el ácido láctico que producen las bacterias.'},
     {amb:'Nacional',t:'Frutas colombianas como el lulo, la maracuyá y el limón deben su acidez a ácidos polifuncionales como el cítrico y el málico.'},
     {amb:'Global',t:'La glucosa, con cinco grupos −OH y un grupo aldehído (en su forma de cadena abierta), es la principal fuente de energía de las células.'}],
   cotidianos:['Kumis y yogur (ácido láctico)','Limón y lulo (ácido cítrico)','Azúcar (glucosa y sacarosa)','Glicerina'],
   activacion:['¿Por qué el azúcar se disuelve tan bien en agua?','Si una molécula tiene un −OH y un −COOH, ¿cuál crees que «manda» en el nombre? ¿Por qué?','¿Qué cambios químicos crees que ocurren en tus músculos durante un ejercicio intenso?']
  },
  info:{
   lectura:['Un compuesto polifuncional tiene dos o más grupos funcionales. Solo uno es el grupo principal y da el sufijo (parte ④ del MDEC); los demás se nombran como prefijos (parte ①).',
     'Orden de prioridad, de mayor a menor: ácido carboxílico > éster > amida > nitrilo > aldehído > cetona > alcohol > amina. Los dobles y triples enlaces se indican con -en-/-in- (parte ③) y los halógenos siempre son prefijos.',
     'Prefijos de los grupos que no son principales: hidroxi- (−OH), oxo- (=O de aldehído o cetona), amino- (−NH₂), ciano- (−C≡N). Ejemplo: CH₃−CH(OH)−COOH es el ácido 2-hidroxipropanoico.',
     'La cadena principal debe contener el grupo principal y se numera dándole a ese grupo el localizador más bajo; luego a los enlaces múltiples y por último a los prefijos.'],
   esquema:{raiz:'Nombrar un compuesto polifuncional',ramas:[
     {t:'1 · Grupo principal',items:['Tabla de prioridad','Da el sufijo (④)']},
     {t:'2 · Cadena ②',items:['Debe contener el grupo principal']},
     {t:'3 · Numerar',items:['Grupo principal primero','Luego -en- / -in-','Luego los prefijos']},
     {t:'4 · Prefijos ①',items:['hidroxi, oxo, amino, ciano, halo','Orden alfabético']}]}
  },
  ejemplo:{f:'CH₃−CH(OH)−COOH',partes:[['ácido','g','palabra del grupo principal'],['2-hidroxi','r','−OH como prefijo en C2'],['prop','c','3 carbonos'],['an','i','solo enlaces sencillos'],['oico','g','−COOH: grupo principal']]},
  propia:[
   {f:'CH₃−CH(OH)−COOH',n:'ácido 2-hidroxipropanoico'},
   {f:'CH₂(OH)−CH₂−CHO',n:'3-hidroxipropanal'},
   {f:'CH₃−CO−CH₂−COOH',n:'ácido 3-oxobutanoico'},
   {f:'CH₂=CH−CH₂−OH',n:'prop-2-en-1-ol'},
   {f:'CH₃−CH(NH₂)−COOH',n:'ácido 2-aminopropanoico'},
   {f:'CH₃−CO−CH₂−CH₂−OH',n:'4-hidroxibutan-2-ona'},
   {f:[{h:2,bd:X('O',1)},{h:1,bd:X('O',1)},{h:2,bd:X('O',1)}],t:'CH₂(OH)−CH(OH)−CH₂(OH)',n:'propano-1,2,3-triol'},
   {f:'CH₂=CH−CHO',n:'prop-2-enal'},
   {f:'CH₃−CH=CH−COOH',n:'ácido but-2-enoico'},
   {f:'CH₂Cl−CH₂−OH',n:'2-cloroetan-1-ol'},
   {f:'CH₃−CH(OH)−CH₂−CHO',n:'3-hidroxibutanal'},
   {f:'CH₂(NH₂)−CH₂−OH',n:'2-aminoetan-1-ol'}
  ]},

 {id:'isomeria',titulo:'Isomería estructural, cis/trans y quiralidad',corto:'Isomería',
  gen:[],jue:/isomer/i,rxn:[],nomenclatura:false,
  alin:{g11:{sed:'sed11q',ev:['11q-ind3','11q-uso2']},g10:{sed:'sed10q',ev:['10q-exp3']},est:['est1'],dba:['dba11b']},
  previos:{
   curiosos:['Con la fórmula C₂H₆O existen dos sustancias muy distintas: el etanol (líquido, hierve a 78 °C) y el metoximetano (gas, hierve a −24 °C).',
     'La (R)-carvona huele a hierbabuena y la (S)-carvona a alcaravea: son la misma molécula «en espejo» (enantiómeros).',
     'El limoncillo contiene citral, una mezcla de dos isómeros cis/trans llamados geranial y neral.'],
   contexto:[{amb:'Global',t:'La talidomida, recetada en los años 50 y 60 contra las náuseas del embarazo, causó malformaciones en miles de bebés. Uno de sus enantiómeros era el responsable, y en el cuerpo un enantiómero se transforma en el otro.'},
     {amb:'Nacional',t:'En Colombia la regulación de alimentos limita el contenido de grasas trans en aceites y productos procesados.'},
     {amb:'Local',t:'Aromáticas como la hierbabuena y el limoncillo deben su olor a moléculas que tienen isómeros con olores distintos.'}],
   cotidianos:['Margarinas y productos de panadería (grasas trans)','Hierbabuena y limoncillo','Medicamentos que se venden como un solo enantiómero o como mezcla'],
   activacion:['¿Pueden dos sustancias tener la misma fórmula molecular y ser distintas? Da un ejemplo si lo conoces.','Mira tus manos: son iguales, pero no se pueden superponer. ¿Conoces otros objetos así?','¿Por qué un medicamento podría funcionar y su «imagen en el espejo» no?']
  },
  info:{
   lectura:['Los isómeros tienen la misma fórmula molecular pero distinta estructura, y por eso propiedades diferentes.',
     'Isomería estructural (los átomos se unen en distinto orden). De cadena: C₄H₁₀ puede ser butano o 2-metilpropano. De posición: propan-1-ol y propan-2-ol. De función: etanol y metoximetano (C₂H₆O).',
     'Estereoisomería (mismos enlaces, distinta disposición en el espacio). Cis/trans: en alquenos donde cada carbono del doble enlace tiene dos grupos distintos; el doble enlace no gira, así que el cis-but-2-eno y el trans-but-2-eno son sustancias diferentes.',
     'Quiralidad: un carbono unido a cuatro grupos diferentes es un carbono quiral (estereocentro). La molécula y su imagen en el espejo no se superponen: son enantiómeros, como la mano derecha y la izquierda. Tienen casi las mismas propiedades físicas, pero pueden actuar distinto en el cuerpo.'],
   esquema:{raiz:'Isomería',ramas:[
     {t:'Estructural',items:['De cadena','De posición','De función']},
     {t:'Cis / trans',items:['El doble enlace no gira','Dos grupos distintos en cada C']},
     {t:'Quiralidad',items:['C con 4 grupos distintos','Enantiómeros: imágenes especulares']},
     {t:'Importancia',items:['Fármacos','Aromas','Grasas trans']}]}
  },
  ejemplo:{pares:[{f:'CH₃−CH₂−OH',n:'etanol (hierve a 78 °C)'},{f:'CH₃−O−CH₃',n:'metoximetano (hierve a −24 °C)'}],nota:'Misma fórmula molecular, C₂H₆O: isómeros de función.'},
  abiertos:[
   'Escribe las fórmulas semidesarrolladas y los nombres IUPAC de los dos isómeros estructurales de C₄H₁₀.',
   'Escribe y nombra los tres isómeros de cadena de C₅H₁₂.',
   'Escribe y nombra los tres isómeros estructurales de C₃H₈O. Clasifícalos en isómeros de posición o de función.',
   'Dibuja los isómeros cis y trans del but-2-eno y explica por qué el but-1-eno no tiene isómeros cis/trans.',
   {q:'Marca con un asterisco (*) el carbono quiral del butan-2-ol y dibuja sus dos enantiómeros (puedes usar cuñas).',f:'CH₃−CH(OH)−CH₂−CH₃'},
   '¿Cuáles de estos compuestos presentan isomería cis/trans? Justifica: a) propeno; b) pent-2-eno; c) 2-metilbut-2-eno; d) 1,2-dicloroeteno.',
   'Escribe dos isómeros de función de fórmula C₃H₆O y nómbralos.',
   'Indica qué tipo de isómeros son: a) butan-1-ol y butan-2-ol; b) butanal y butanona; c) pentano y 2,2-dimetilpropano.'
  ],
  propia:[]},

 {id:'reacciones',titulo:'Reacciones orgánicas (tipos y mecanismos básicos)',corto:'Reacciones orgánicas',
  gen:[],jue:null,rxn:['alcanos','alquenos','alquinos','benceno','halogenuros','alcoholes','eteres','aldehidos','cetonas','acidos','esteres','amidas','nitrilos','aminas'],nomenclatura:false,
  alin:{g11:{sed:'sed11q',ev:['11q-exp3','11q-ind2']},g10:{sed:'sed10q',ev:['10q-exp2']},est:['est2','est3'],dba:['dba11a']},
  previos:{
   curiosos:['En la fermentación que produce el etanol de la chicha y el guarapo, las levaduras transforman azúcares: C₆H₁₂O₆ → 2 C₂H₅OH + 2 CO₂.',
     'Algunos alcoholímetros de aliento oxidan el etanol y convierten ese cambio químico en una señal eléctrica.',
     'El jabón se fabrica con una reacción conocida desde la Antigüedad: la saponificación de grasas.'],
   contexto:[{amb:'Local',t:'Si el guarapo o el vino se dejan destapados, unas bacterias oxidan su etanol a ácido acético: así se avinagran.'},
     {amb:'Nacional',t:'En las refinerías de Barrancabermeja y Cartagena, el craqueo rompe cadenas largas de hidrocarburos en otras más cortas para obtener gasolina y gas.'},
     {amb:'Global',t:'La mayoría de los plásticos (polietileno, polipropileno, PVC) se fabrican por polimerización de alquenos.'}],
   cotidianos:['Combustión del gas de la estufa','Vinagre','Jabón','Plásticos','Alcoholímetro'],
   activacion:['¿Qué evidencias te indican que ocurrió una reacción química al cocinar o al fermentar una bebida?','¿Qué enlaces crees que se rompen y cuáles se forman cuando arde el gas de la estufa?','¿Por qué el vino o el guarapo se avinagran si se dejan destapados?']
  },
  info:{
   lectura:['En una reacción orgánica se rompen y se forman enlaces. Los tipos básicos son: sustitución (un átomo o grupo cambia por otro), adición (dos átomos se suman a un enlace múltiple), eliminación (se pierden átomos y se forma un enlace múltiple) y óxido-reducción (cambia el número de enlaces C−O o C−H).',
     'Ruptura homolítica: cada átomo se queda con un electrón y se forman radicales (halogenación de alcanos con luz). Ruptura heterolítica: un átomo se queda con los dos electrones y se forman iones o carbocationes (adición de HBr a alquenos). Reacción pericíclica: los enlaces se rompen y se forman a la vez, en un ciclo (ozonólisis).',
     'Los reactivos se clasifican en nucleófilos (ricos en electrones: OH⁻, NH₃, H₂O) y electrófilos (pobres en electrones: H⁺, NO₂⁺, carbocationes).',
     'Reacciones de interés cotidiano: combustión, fermentación, oxidación de alcoholes, esterificación, saponificación y polimerización.'],
   esquema:{raiz:'Tipos de reacción orgánica',ramas:[
     {t:'Sustitución',items:['Radicalaria: alcanos','Nucleofílica: haluros','Electrofílica: aromáticos']},
     {t:'Adición',items:['Alquenos y alquinos','Regla de Markovnikov']},
     {t:'Eliminación',items:['Deshidratación de alcoholes','Pérdida de HX en haluros']},
     {t:'Óxido-reducción',items:['Combustión','Alcohol → aldehído / cetona → ácido']}]}
  },
  ejemplo:null,
  propia:[]}
];

/* ──────────────────────────────────────────────────────────────────────
   SABER: preguntas tipo Saber 11 (selección múltiple con única respuesta)
   c: competencia — 'uso' (uso comprensivo del conocimiento científico),
      'exp' (explicación de fenómenos), 'ind' (indagación)
   k: componente — 'Q' (químico) o 'CTS' (ciencia, tecnología y sociedad)
   ctx: situación o contexto; q: enunciado; o: opciones (la primera es la
   correcta — ver la convención al inicio del archivo); f: fórmula opcional.
   ────────────────────────────────────────────────────────────────────── */
var SABER={
 cadena:[
  {c:'uso',k:'Q',ctx:'El isooctano es el compuesto de referencia (índice de octano 100) para medir la calidad de la gasolina. Su fórmula semidesarrollada es:',f:[{h:3},{h:0,bu:CH3,bd:CH3},{h:2},{h:1,bd:CH3},{h:3}],t:'(CH₃)₃C−CH₂−CH(CH₃)−CH₃',
   q:'¿Cuál es su nombre IUPAC?',o:['2,2,4-trimetilpentano','2,4,4-trimetilpentano','1,1,1,3-tetrametilpropano','2,2,4-trimetiloctano']},
  {c:'exp',k:'Q',ctx:'Dos estudiantes nombran el mismo alcano, CH₃−CH(C₂H₅)−CH₂−CH₃. Ana escribe «2-etilbutano» y Luis escribe «3-metilpentano».',
   q:'¿Quién tiene razón y por qué?',o:['Luis, porque la cadena más larga tiene 5 carbonos e incluye los del grupo etilo','Ana, porque el etilo es el sustituyente más grande y debe nombrarse','Ana, porque la cadena principal es la que aparece escrita en línea recta','Ambos, porque los dos nombres describen la misma molécula según la IUPAC']},
  {c:'uso',k:'Q',ctx:'Al numerar la cadena principal de un alcano ramificado hay que escoger por cuál extremo empezar.',
   q:'¿Cuál criterio se aplica PRIMERO?',o:['Dar los localizadores más bajos posibles al conjunto de sustituyentes','Dar el número más bajo al sustituyente que va primero en orden alfabético','Numerar siempre de izquierda a derecha, como está escrita la fórmula','Dar el número 1 al carbono que tiene el sustituyente más grande']},
  {c:'uso',k:'Q',ctx:'Observa la siguiente estructura:',f:[{h:3},{h:1,bd:CH3},{h:1,bd:ET},{h:2},{h:3}],t:'CH₃−CH(CH₃)−CH(C₂H₅)−CH₂−CH₃',
   q:'¿Cuál es su nombre IUPAC?',o:['3-etil-2-metilpentano','2-metil-3-etilpentano','3-etil-4-metilpentano','2-etil-3-metilpentano']},
  {c:'exp',k:'Q',ctx:'En el nombre 4-etil-2,2-dimetilhexano, el etilo se escribe antes que el metilo, aunque su localizador es mayor.',
   q:'¿Por qué se escribe en ese orden?',o:['Porque los sustituyentes se ordenan alfabéticamente y el prefijo di- no se tiene en cuenta','Porque el etilo tiene más carbonos que el metilo','Porque el sustituyente que aparece una sola vez siempre va primero','Porque los sustituyentes con localizador mayor se escriben primero']},
  {c:'ind',k:'Q',ctx:'Un grupo de estudiantes consultó los puntos de ebullición de tres isómeros de fórmula C₅H₁₂: pentano, 36 °C; 2-metilbutano, 28 °C; 2,2-dimetilpropano, 10 °C.',
   q:'¿Qué conclusión es coherente con estos datos?',o:['Para una misma fórmula molecular, a mayor ramificación menor punto de ebullición','A mayor masa molar, menor punto de ebullición','La ramificación no influye, porque los tres tienen la misma fórmula molecular','El punto de ebullición aumenta con el número de grupos metilo']},
  {c:'ind',k:'Q',ctx:'Una estudiante debe nombrar un alcano ramificado que está dibujado en zigzag y con las ramas hacia arriba y hacia abajo.',
   q:'¿Qué procedimiento le permite comprobar que escogió bien la cadena principal?',o:['Contar los carbonos de todos los caminos posibles entre extremos y escoger el más largo','Tomar la cadena horizontal tal como está dibujada','Escoger la cadena que empieza en el carbono de la izquierda','Contar solamente los carbonos que tienen tres hidrógenos']},
  {c:'uso',k:'Q',ctx:'Un compuesto se llama 3-etil-2,4-dimetilheptano.',
   q:'¿Cuántos carbonos tiene su cadena principal y cuántos tiene la molécula en total?',o:['7 en la cadena principal y 11 en total','7 en la cadena principal y 10 en total','11 en la cadena principal y 11 en total','9 en la cadena principal y 11 en total']}
 ],
 alcanos:[
  {c:'uso',k:'CTS',ctx:'El gas de las pipetas (GLP) que se usa en muchas cocinas colombianas es principalmente una mezcla de propano y butano.',
   q:'¿Cuál es la fórmula molecular del butano?',o:['C₄H₁₀','C₄H₈','C₄H₆','C₃H₈']},
  {c:'uso',k:'Q',ctx:'Los alcanos de cadena abierta cumplen la fórmula general CₙH₂ₙ₊₂.',
   q:'¿Cuál de los siguientes compuestos NO cumple esa fórmula?',o:['ciclohexano, C₆H₁₂','hexano, C₆H₁₄','propano, C₃H₈','decano, C₁₀H₂₂']},
  {c:'exp',k:'CTS',ctx:'La combustión completa del metano es CH₄ + 2 O₂ → CO₂ + 2 H₂O. Cuando la estufa recibe poco aire, la llama se vuelve amarilla y aparece hollín en las ollas.',
   q:'¿Qué explica este cambio?',o:['Con poco oxígeno la combustión es incompleta y se forman carbono (hollín) y monóxido de carbono','Con poco oxígeno el metano se convierte en un alqueno que arde con llama amarilla','Con poco oxígeno se produce más CO₂ y más agua','El hollín proviene del nitrógeno del aire que no reaccionó']},
  {c:'uso',k:'Q',ctx:'Observa la siguiente estructura:',gen:'etilciclohexano',t:'C₆H₁₁−CH₂−CH₃',
   q:'¿Cuál es su nombre IUPAC?',o:['etilciclohexano','etilhexano','ciclooctano','etilbenceno']},
  {c:'exp',k:'Q',ctx:'El metano reacciona con cloro solo en presencia de luz ultravioleta (hν) o calor, y se forman CH₃Cl y HCl.',
   q:'¿Cuál es la función de la luz en esta reacción?',o:['Romper de forma homolítica el enlace Cl−Cl para formar radicales cloro','Romper el enlace C−H para formar los iones H⁺ y CH₃⁻','Volver polar al metano para que actúe como nucleófilo','Formar un doble enlace en el metano para que ocurra una adición']},
  {c:'ind',k:'Q',ctx:'Se registraron los puntos de ebullición de varios alcanos: metano, −162 °C; etano, −89 °C; propano, −42 °C; butano, −1 °C.',
   q:'Si la tendencia continúa, ¿qué se espera para el pentano?',o:['Un valor mayor que −1 °C, porque la cadena es más larga y las fuerzas de London aumentan','Un valor menor que −162 °C, porque tiene más hidrógenos','Un valor entre −89 °C y −42 °C, porque el pentano es un isómero del butano','El mismo valor del butano, porque ambos son alcanos']},
  {c:'uso',k:'CTS',ctx:'Colombia produce gas natural en La Guajira y en el piedemonte llanero. Las fugas de metano en pozos y tuberías preocupan aunque no haya incendio.',
   q:'¿Por qué una fuga de metano es un problema ambiental?',o:['Porque el metano es un gas de efecto invernadero más potente que el CO₂ por molécula','Porque el metano destruye la capa de ozono igual que los CFC','Porque el metano reacciona con la lluvia y forma ácido sulfúrico','Porque el metano es un sólido que se acumula en los suelos']},
  {c:'uso',k:'Q',ctx:'Todos los átomos de carbono del propano están unidos solo por enlaces sencillos.',
   q:'¿Qué hibridación y qué geometría tienen esos carbonos?',o:['sp³, tetraédrica, con ángulos cercanos a 109,5°','sp², trigonal plana, con ángulos de 120°','sp, lineal, con ángulos de 180°','sp³, plana cuadrada, con ángulos de 90°']}
 ],
 alquenos:[
  {c:'uso',k:'Q',ctx:'Observa la siguiente estructura:',f:'CH₃−CH=CH−CH₂−CH₃',
   q:'¿Cuál es su nombre IUPAC?',o:['pent-2-eno','pent-3-eno','pentan-2-eno','pent-2-ino']},
  {c:'uso',k:'Q',ctx:'El propino es el alquino de tres carbonos.',
   q:'¿Cuál es su fórmula molecular?',o:['C₃H₄','C₃H₆','C₃H₈','C₃H₂']},
  {c:'exp',k:'Q',ctx:'Al hacer reaccionar propeno (CH₂=CH−CH₃) con HBr se obtiene principalmente 2-bromopropano y muy poco 1-bromopropano.',
   q:'¿Qué explica este resultado?',o:['Se forma de preferencia el carbocatión secundario, más estable que el primario, y el bromuro se une a ese carbono','El bromo siempre se une al carbono 1 porque es el extremo de la cadena','El HBr rompe el enlace sencillo C2−C3 y no el doble enlace','El hidrógeno se une al carbono que tiene menos hidrógenos']},
  {c:'exp',k:'CTS',ctx:'Los bananos de Urabá se exportan verdes y maduran en el país de destino en cámaras con eteno (CH₂=CH₂), una hormona vegetal.',
   q:'¿Cuál afirmación sobre la estructura del eteno es correcta?',o:['Sus dos carbonos tienen hibridación sp² y todos sus átomos están en un mismo plano','Sus dos carbonos tienen hibridación sp³ y geometría tetraédrica','Tiene un triple enlace y geometría lineal','Tiene un grupo −OH unido a un carbono sp²']},
  {c:'uso',k:'Q',ctx:'Observa la siguiente estructura:',f:'CH₂=CH−CH(CH₃)−CH₃',
   q:'¿Cuál es su nombre IUPAC?',o:['3-metilbut-1-eno','2-metilbut-3-eno','3-metilbut-2-eno','2-metilbutano']},
  {c:'ind',k:'Q',ctx:'Para diferenciar hexano de hex-1-eno, una estudiante agrega unas gotas de agua de bromo (de color naranja) a cada muestra, a temperatura ambiente y sin luz intensa.',
   q:'¿Qué resultado permite identificar el alqueno?',o:['El tubo con hex-1-eno pierde el color naranja porque el Br₂ se adiciona al doble enlace','El tubo con hexano pierde el color porque los alcanos reaccionan rápido con Br₂ sin luz','Ambos tubos pierden el color por igual, así que la prueba no sirve','El tubo con hex-1-eno se vuelve azul porque se forma un ácido']},
  {c:'exp',k:'Q',ctx:'El eteno (CH₂=CH₂) reacciona con facilidad con Br₂ por adición, mientras que el etano (CH₃−CH₃) no da reacciones de adición.',
   q:'¿Qué explica esta diferencia?',o:['El enlace π del doble enlace es más débil y sus electrones están más expuestos a los electrófilos','El etano tiene más hidrógenos que pueden salir de la molécula','El eteno tiene más carbonos que el etano','El enlace σ del etano se rompe más fácilmente que el enlace π']},
  {c:'uso',k:'Q',ctx:'En el compuesto CH₂=CH−CH₂−C≡CH, numerando desde cualquiera de los dos extremos, los enlaces múltiples quedan en las posiciones 1 y 4.',
   q:'Según la IUPAC, ¿cuál es su nombre?',o:['pent-1-en-4-ino','pent-4-en-1-ino','pent-1-in-4-eno','penta-1,4-dieno']}
 ],
 aromaticos:[
  {c:'uso',k:'CTS',ctx:'El xileno, usado como solvente en laboratorios, es una mezcla de dimetilbencenos.',
   q:'¿Qué nombre IUPAC corresponde al isómero en el que los dos metilos están en carbonos vecinos del anillo?',o:['1,2-dimetilbenceno','1,3-dimetilbenceno','1,4-dimetilbenceno','2,3-dimetilbenceno']},
  {c:'exp',k:'Q',ctx:'En la fórmula de Kekulé el benceno se dibuja con tres dobles enlaces; sin embargo, no reacciona como un alqueno.',
   q:'¿Por qué el benceno da sustitución electrofílica y no adición?',o:['Porque sus 6 electrones π están deslocalizados en el anillo y la sustitución conserva esa estabilidad','Porque el benceno no tiene electrones π','Porque los carbonos del benceno tienen hibridación sp³','Porque la adición rompería enlaces C−H, que son los más fuertes de la molécula']},
  {c:'uso',k:'Q',ctx:'Observa la siguiente estructura:',f:'C₆H₅−NO₂',
   q:'¿Cuál es su nombre?',o:['nitrobenceno','bencenonitrilo','nitrociclohexano','fenilamina']},
  {c:'uso',k:'CTS',ctx:'Un taller de pintura usa thinner, que puede contener tolueno. Las normas de salud ocupacional limitan estrictamente el benceno en los solventes.',
   q:'¿Cuál es la razón principal de esa restricción?',o:['El benceno es cancerígeno (se asocia con leucemia) y es volátil, por lo que se inhala con facilidad','El benceno no se evapora y se acumula en la ropa de los trabajadores','El benceno es un ácido fuerte que quema la piel','El benceno reacciona con el aire del taller y produce ozono']},
  {c:'uso',k:'Q',ctx:'Observa la siguiente estructura:',f:'C₆H₅−Cl',
   q:'¿Cuál es su nombre?',o:['clorobenceno','clorociclohexano','clorofenol','1-clorohex-1-eno']},
  {c:'ind',k:'Q',ctx:'Un grupo quiere comprobar la hipótesis «el benceno no se comporta como un alqueno». Para eso agrega agua de bromo, sin catalizador, a un tubo con ciclohexeno y a otro con benceno.',
   q:'¿Qué resultado apoya la hipótesis?',o:['El ciclohexeno decolora el agua de bromo y el benceno no','Ambos decoloran el agua de bromo de inmediato','Solo el benceno decolora el agua de bromo','Ninguno reacciona, porque los dos son compuestos cíclicos']},
  {c:'uso',k:'CTS',ctx:'El 1,4-diclorobenceno se usa en algunas bolas antipolillas.',
   q:'En la nomenclatura tradicional, ¿qué posición relativa tienen sus dos cloros?',o:['para','orto','meta','alfa']},
  {c:'exp',k:'Q',ctx:'La nitración del benceno se hace con una mezcla de HNO₃ y H₂SO₄ concentrados.',
   q:'¿Cuál es el papel del H₂SO₄?',o:['Ayuda a formar el ion nitronio (NO₂⁺), que es el electrófilo que ataca el anillo','Aporta el grupo −SO₃H que queda en el producto final','Neutraliza el ácido nítrico para que no reaccione','Rompe el anillo bencénico para que se adicione el grupo NO₂']}
 ],
 haluros:[
  {c:'uso',k:'Q',ctx:'Observa la siguiente estructura:',f:'CH₃−CHCl−CH₃',
   q:'¿Cuál es su nombre IUPAC?',o:['2-cloropropano','1-cloropropano','2-clorobutano','propan-2-cloro']},
  {c:'uso',k:'Q',ctx:'Observa la siguiente estructura:',f:'CH₃−CH(Br)−CH₂−CH₃',
   q:'¿Cuál es su nombre IUPAC?',o:['2-bromobutano','3-bromobutano','1-bromo-1-metilpropano','2-bromopropano']},
  {c:'uso',k:'CTS',ctx:'El halotano, un anestésico inhalado, tiene la fórmula CF₃−CHBrCl.',f:[{s:'F',h:0},{h:0,bu:X('F'),bd:X('F')},{h:1,bu:X('Br'),bd:X('Cl')}],t:'CF₃−CHBrCl',
   q:'¿Cuál es su nombre IUPAC?',o:['2-bromo-2-cloro-1,1,1-trifluoroetano','1,1,1-trifluoro-2-bromo-2-cloroetano','2-cloro-2-bromo-1,1,1-trifluoroetano','1-bromo-1-cloro-2,2,2-trifluoroetano']},
  {c:'exp',k:'CTS',ctx:'Los CFC, como el CCl₂F₂, se usaron durante décadas en neveras y aerosoles. El Protocolo de Montreal acordó eliminarlos.',
   q:'¿Por qué se eliminaron?',o:['En la estratosfera la radiación ultravioleta libera átomos de cloro que destruyen el ozono en reacciones en cadena','Porque son muy inflamables y causaban incendios en las neveras','Porque se disuelven en la lluvia y forman ácido clorhídrico que acidifica los ríos','Porque al usarse en aerosoles producen monóxido de carbono']},
  {c:'exp',k:'Q',ctx:'Al calentar bromoetano con una solución acuosa diluida de NaOH se obtiene etanol y bromuro de sodio.',
   q:'¿Cómo se clasifica esta reacción?',o:['Sustitución nucleofílica: el OH⁻ reemplaza al bromo, que sale como Br⁻','Adición electrofílica: el OH⁻ se suma a un doble enlace','Eliminación: se forman eteno y agua','Combustión: el bromoetano se oxida a CO₂']},
  {c:'exp',k:'Q',ctx:'El 2-bromopropano se calienta con KOH disuelto en etanol (una base fuerte, sin agua).',
   q:'¿Cuál es el producto orgánico principal?',o:['propeno, por eliminación de HBr','propan-2-ol, por sustitución','propano, por reducción','2,2-dibromopropano, por adición']},
  {c:'uso',k:'Q',ctx:'Los haluros de alquilo se clasifican según cuántos carbonos están unidos al carbono que lleva el halógeno.',
   q:'¿Cuál de los siguientes es un haluro de alquilo terciario?',o:['2-bromo-2-metilpropano','1-bromobutano','2-bromobutano','bromometano']},
  {c:'ind',k:'Q',ctx:'Un grupo compara la rapidez con que reaccionan 1-clorobutano, 1-bromobutano y 1-yodobutano con el mismo nucleófilo, a la misma temperatura y concentración. Obtiene: yodo > bromo > cloro.',
   q:'¿Qué variable explica mejor la diferencia?',o:['La facilidad del halógeno para salir como ion: los halógenos más grandes son mejores grupos salientes','El número de carbonos de la cadena, que cambia en cada compuesto','La electronegatividad: el halógeno más electronegativo sale más rápido','La temperatura, que fue distinta en cada ensayo']}
 ],
 alcoholes:[
  {c:'uso',k:'Q',ctx:'Observa la siguiente estructura:',f:'CH₃−CH(OH)−CH₃',
   q:'¿Cuál es su nombre IUPAC?',o:['propan-2-ol','propan-1-ol','2-hidroxipropano','metoxietano']},
  {c:'uso',k:'Q',ctx:'Observa la siguiente estructura:',f:'CH₃−CH(OH)−CH₂−CH(CH₃)−CH₃',
   q:'¿Cuál es su nombre IUPAC?',o:['4-metilpentan-2-ol','2-metilpentan-4-ol','4-metilpentan-2-ona','2-hidroxi-4-metilpentano']},
  {c:'exp',k:'Q',ctx:'El etanol (CH₃−CH₂−OH) y el metoximetano (CH₃−O−CH₃) tienen la misma fórmula molecular, C₂H₆O. El etanol hierve a 78 °C y el metoximetano a −24 °C.',
   q:'¿Qué explica la diferencia?',o:['Las moléculas de etanol forman puentes de hidrógeno entre sí gracias al −OH; las del éter no','El etanol tiene mayor masa molar que el metoximetano','El metoximetano tiene enlaces iónicos que se rompen con facilidad','El etanol tiene más átomos de oxígeno que el metoximetano']},
  {c:'exp',k:'CTS',ctx:'En Colombia se han presentado intoxicaciones por licor adulterado con metanol, que se parece mucho al etanol.',
   q:'¿Por qué el metanol es tan peligroso?',o:['El cuerpo lo oxida a metanal y ácido metanoico, que son tóxicos y pueden causar ceguera','El metanol es una base fuerte que quema el estómago','El metanol no se absorbe y se acumula en los pulmones','El metanol tiene un triple enlace muy reactivo']},
  {c:'uso',k:'CTS',ctx:'En Colombia la gasolina se mezcla con etanol obtenido de la caña de azúcar.',
   q:'¿Cuál es la ecuación balanceada de la combustión completa del etanol?',o:['C₂H₅OH + 3 O₂ → 2 CO₂ + 3 H₂O','C₂H₅OH + 2 O₂ → 2 CO₂ + 3 H₂O','C₂H₅OH + 3 O₂ → 2 CO + 3 H₂O','C₂H₅OH + O₂ → CH₃COOH + H₂O']},
  {c:'uso',k:'Q',ctx:'Alcoholes y fenoles tienen el grupo −OH, pero unido a átomos de carbono diferentes.',
   q:'¿Cuál de las siguientes sustancias es un fenol y no un alcohol?',o:['C₆H₅−OH, porque el −OH está unido directamente al anillo aromático','C₆H₅−CH₂−OH, porque tiene un anillo aromático','C₆H₁₁−OH (ciclohexanol), porque el −OH está en un anillo','CH₃−OH, porque es el alcohol más simple']},
  {c:'uso',k:'Q',ctx:'Observa la siguiente estructura:',f:'CH₃−CH₂−O−CH₃',
   q:'¿Cuál es su nombre IUPAC?',o:['metoxietano','etoximetano','propan-1-ol','metoxipropano']},
  {c:'ind',k:'Q',ctx:'Un grupo agrega dicromato de potasio acidificado (color naranja) a tres tubos con butan-1-ol, butan-2-ol y 2-metilpropan-2-ol. Solo en dos tubos la solución se vuelve verde.',
   q:'¿En qué tubo NO hay cambio y por qué?',o:['En el de 2-metilpropan-2-ol, porque es un alcohol terciario y su carbono con −OH no tiene hidrógenos','En el de butan-1-ol, porque los alcoholes primarios no se oxidan','En el de butan-2-ol, porque los alcoholes secundarios solo reaccionan con luz','En ninguno: los tres deberían cambiar de color']}
 ],
 carbonilos:[
  {c:'uso',k:'Q',ctx:'Observa la siguiente estructura:',f:'CH₃−CO−CH₃',
   q:'¿Cuál es su nombre IUPAC?',o:['propan-2-ona','propanal','propan-2-ol','propan-1-ona']},
  {c:'uso',k:'Q',ctx:'Observa la siguiente estructura:',f:'CH₃−CH₂−CH₂−CHO',
   q:'¿Cuál es su nombre IUPAC?',o:['butanal','butan-1-al','butanona','propanal']},
  {c:'exp',k:'Q',ctx:'En el nombre 3-metilbutanal se indica la posición del metilo, pero no la del grupo −CHO.',
   q:'¿Por qué no se escribe el localizador del −CHO?',o:['Porque en una cadena abierta el carbono del −CHO siempre es el C1','Porque los aldehídos nunca llevan localizadores','Porque el −CHO se nombra como sustituyente y no como sufijo','Porque el metilo tiene prioridad sobre el aldehído']},
  {c:'uso',k:'Q',ctx:'Observa la siguiente estructura:',f:'CH₃−CO−CH₂−CH(CH₃)−CH₃',
   q:'¿Cuál es su nombre IUPAC?',o:['4-metilpentan-2-ona','2-metilpentan-4-ona','4-metilpentanal','4-metilpentan-2-ol']},
  {c:'uso',k:'CTS',ctx:'El formol, que se usa para conservar muestras biológicas, es una solución acuosa de metanal.',
   q:'¿Por qué se recomienda manipularlo con ventilación, guantes y gafas?',o:['Porque el metanal es tóxico e irritante y está clasificado como cancerígeno','Porque el metanal es un gas noble que desplaza el oxígeno','Porque el metanal es un ácido fuerte que disuelve el vidrio','Porque el metanal es radiactivo']},
  {c:'ind',k:'Q',ctx:'Para distinguir propanal de propanona, se calienta suavemente cada uno con reactivo de Tollens (nitrato de plata amoniacal).',
   q:'¿Qué observación identifica al aldehído?',o:['Se forma un espejo de plata en el tubo del propanal','Se forma un espejo de plata en el tubo de la propanona','Ambos tubos forman un precipitado rojo ladrillo','Ninguno cambia, porque los dos tienen grupo carbonilo']},
  {c:'exp',k:'Q',ctx:'Los aldehídos se oxidan con facilidad a ácidos carboxílicos, mientras que las cetonas resisten la oxidación en condiciones suaves.',
   q:'¿Qué explica esta diferencia?',o:['El carbono del carbonilo del aldehído tiene un hidrógeno unido; el de la cetona está unido a dos carbonos','Las cetonas no tienen grupo carbonilo','Los aldehídos tienen un triple enlace C≡O','Las cetonas son siempre gases y no reaccionan en solución']},
  {c:'uso',k:'CTS',ctx:'En personas con diabetes no controlada el aliento puede oler a «quitaesmalte». Ese olor se debe a la propanona que se produce cuando el cuerpo degrada grasas.',
   q:'¿A qué grupo funcional pertenece la propanona?',o:['Cetona','Aldehído','Éster','Alcohol']}
 ],
 acidos:[
  {c:'uso',k:'Q',ctx:'Observa la siguiente estructura:',f:'CH₃−CH₂−COOH',
   q:'¿Cuál es su nombre IUPAC?',o:['ácido propanoico','ácido etanoico','ácido propan-1-oico','propanoato de hidrógeno']},
  {c:'uso',k:'Q',ctx:'Observa la siguiente estructura:',f:'CH₃−CH(CH₃)−CH₂−COOH',
   q:'¿Cuál es su nombre IUPAC?',o:['ácido 3-metilbutanoico','ácido 2-metilbutanoico','ácido 3-metilpentanoico','ácido 1-metilbutanoico']},
  {c:'uso',k:'Q',ctx:'Observa la siguiente estructura:',f:'CH₃−COO−CH₂−CH₃',
   q:'¿Cuál es su nombre IUPAC?',o:['etanoato de etilo','etanoato de metilo','propanoato de metilo','etilo de etanoato']},
  {c:'uso',k:'CTS',ctx:'El aroma del banano se debe en parte al etanoato de 3-metilbutilo, un éster que la industria también produce para dar sabor a dulces.',
   q:'¿De qué par de reactivos se obtiene este éster por esterificación?',o:['ácido etanoico y 3-metilbutan-1-ol','ácido 3-metilbutanoico y etanol','etanal y 3-metilbutanal','ácido etanoico y 3-metilbutanal']},
  {c:'exp',k:'Q',ctx:'El vinagre contiene ácido etanoico. Una solución de vinagre tiene pH cercano a 3, mientras que una de HCl de la misma concentración tiene pH mucho menor.',
   q:'¿Qué explica estas observaciones?',o:['El −COOH cede solo parcialmente su H⁺ al agua: el ácido etanoico es un ácido débil','El −COOH libera iones OH⁻ al agua','El ácido etanoico se ioniza por completo, igual que el HCl','El ácido etanoico no tiene hidrógenos que pueda ceder']},
  {c:'ind',k:'CTS',ctx:'En una práctica se calienta aceite de palma con NaOH y se espera obtener jabón y glicerol.',
   q:'¿Qué evidencia es más adecuada para comprobar que se formó jabón?',o:['El producto forma espuma al agitarlo con agua y ayuda a retirar una mancha de grasa','El aceite cambia de color al calentarse','El volumen de la mezcla aumenta al calentarla','Se desprende un gas que enturbia el agua de cal']},
  {c:'uso',k:'CTS',ctx:'Colombia mezcla el diésel con biodiésel elaborado a partir de aceite de palma. El biodiésel está formado principalmente por ésteres metílicos de ácidos grasos.',
   q:'¿Qué reacción lo produce?',o:['Transesterificación del aceite (un triglicérido) con metanol','Hidrogenación del aceite con H₂','Fermentación de la glucosa de la palma','Combustión incompleta del aceite']},
  {c:'exp',k:'Q',ctx:'El ácido etanoico (60 g/mol) hierve a 118 °C y el propan-1-ol (60 g/mol) a 97 °C.',
   q:'¿Por qué el ácido hierve a mayor temperatura si tienen la misma masa molar?',o:['Las moléculas del ácido se unen de a dos por dos puentes de hidrógeno, y separarlas exige más energía','El ácido etanoico tiene mayor masa molar','El propan-1-ol no puede formar puentes de hidrógeno','El ácido etanoico es un compuesto iónico']}
 ],
 nitrogenados:[
  {c:'uso',k:'Q',ctx:'Observa la siguiente estructura:',f:'CH₃−CH₂−NH₂',
   q:'¿Cuál es su nombre IUPAC?',o:['etanamina','etanamida','etanonitrilo','metanamina']},
  {c:'uso',k:'Q',ctx:'Observa la siguiente estructura:',f:'CH₃−CH₂−CO−NH₂',
   q:'¿Cuál es su nombre IUPAC?',o:['propanamida','propanamina','propan-1-amida','etanamida']},
  {c:'uso',k:'Q',ctx:'Observa la siguiente estructura:',f:'CH₃−CH₂−C≡N',
   q:'¿Cuál es su nombre IUPAC?',o:['propanonitrilo','etanonitrilo','propanamina','butanonitrilo']},
  {c:'exp',k:'Q',ctx:'Al disolver etanamina en agua, la solución se vuelve básica.',
   q:'¿Qué explica este comportamiento?',o:['El nitrógeno tiene un par de electrones libre que puede aceptar un H⁺ del agua','El nitrógeno cede con facilidad un H⁺ al agua','La etanamina contiene iones OH⁻ en su estructura','El nitrógeno tiene una carga positiva permanente']},
  {c:'uso',k:'CTS',ctx:'La yuca amarga contiene linamarina, un compuesto con grupo nitrilo (−C≡N) que puede liberar cianuro de hidrógeno (HCN). Antes de consumirla se ralla, se lava y se cocina.',
   q:'¿Cuál es el propósito de ese procesamiento?',o:['Eliminar el HCN y los compuestos que lo liberan, que son tóxicos','Aumentar la cantidad de nitrilo para mejorar el sabor','Convertir el almidón de la yuca en proteínas','Neutralizar el ácido acético que contiene la yuca']},
  {c:'uso',k:'Q',ctx:'Las aminas se clasifican según cuántos grupos carbonados están unidos al nitrógeno.',
   q:'¿Cuál de las siguientes es una amina secundaria?',o:['CH₃−NH−CH₃ (N-metilmetanamina)','CH₃−CH₂−NH₂ (etanamina)','(CH₃)₃N (N,N-dimetilmetanamina)','CH₃−CO−NH₂ (etanamida)']},
  {c:'uso',k:'CTS',ctx:'El paracetamol (acetaminofén), uno de los analgésicos más usados, contiene en su estructura el grupo −NH−CO−.',
   q:'¿A qué grupo funcional corresponde?',o:['Amida','Amina','Nitrilo','Éster']},
  {c:'ind',k:'Q',ctx:'El olor del pescado se debe en parte a aminas volátiles. Un estudiante propone la hipótesis: «el jugo de limón reduce el olor porque su ácido reacciona con las aminas y forma sales que no se evaporan».',
   q:'¿Qué experimento permite poner a prueba esta hipótesis?',o:['Comparar el olor de muestras iguales de pescado tratadas con limón, con agua y sin tratamiento','Agregar limón a todas las muestras y oler solo una de ellas','Cocinar el pescado más tiempo sin agregarle nada','Medir la masa del pescado antes y después de agregar limón']}
 ],
 polifuncionales:[
  {c:'uso',k:'Q',ctx:'El ácido láctico se forma en los músculos y en la fermentación del kumis. Su estructura es:',f:'CH₃−CH(OH)−COOH',
   q:'¿Cuál es su nombre IUPAC?',o:['ácido 2-hidroxipropanoico','ácido 3-hidroxipropanoico','ácido 1-hidroxipropanoico','1-carboxietan-1-ol']},
  {c:'exp',k:'Q',ctx:'Una molécula tiene un grupo −OH y un grupo −CHO.',
   q:'¿Cuál de los dos da el sufijo del nombre y por qué?',o:['El −CHO, porque el aldehído tiene mayor prioridad que el alcohol; el −OH se nombra con el prefijo hidroxi-','El −OH, porque está más cerca del extremo de la cadena','El que aparezca primero al leer la fórmula de izquierda a derecha','Ambos, porque los dos grupos se nombran siempre como sufijos']},
  {c:'uso',k:'Q',ctx:'Observa la siguiente estructura:',f:'CH₂=CH−CH₂−OH',
   q:'¿Cuál es su nombre IUPAC?',o:['prop-2-en-1-ol','prop-1-en-3-ol','prop-2-en-1-al','propan-1-ol']},
  {c:'uso',k:'Q',ctx:'Observa la siguiente estructura:',f:'CH₃−CO−CH₂−COOH',
   q:'¿Cuál es su nombre IUPAC?',o:['ácido 3-oxobutanoico','ácido 2-oxobutanoico','4-carboxibutan-2-ona','ácido 3-hidroxibutanoico']},
  {c:'exp',k:'CTS',ctx:'Durante un ejercicio intenso con poco oxígeno, las células musculares transforman ácido pirúvico (CH₃−CO−COOH) en ácido láctico (CH₃−CH(OH)−COOH).',
   q:'¿Qué cambio químico ocurre?',o:['El grupo cetona del C2 se reduce a un alcohol secundario','El grupo carboxilo se reduce a aldehído','Se pierde un carbono en forma de CO₂','El grupo alcohol se oxida a cetona']},
  {c:'uso',k:'Q',ctx:'La alanina, uno de los aminoácidos de las proteínas, es CH₃−CH(NH₂)−COOH.',
   q:'¿Cuál es su nombre sistemático?',o:['ácido 2-aminopropanoico','ácido 3-aminopropanoico','2-aminopropan-1-ol','1-carboxietan-1-amina']},
  {c:'exp',k:'Q',ctx:'La glucosa (C₆H₁₂O₆), en su forma de cadena abierta, tiene cinco grupos −OH y un grupo aldehído. Se disuelve muy bien en agua, mientras que el hexano (C₆H₁₄) no.',
   q:'¿Qué explica la diferencia?',o:['Los grupos −OH de la glucosa forman puentes de hidrógeno con el agua; el hexano es apolar','La glucosa tiene más carbonos que el hexano','El hexano reacciona con el agua y se descompone','La glucosa es un compuesto iónico']},
  {c:'ind',k:'Q',ctx:'Un grupo quiere saber qué grupo funcional del ácido láctico (el −OH o el −COOH) es el responsable de su acidez.',
   q:'¿Qué comparación es la más útil?',o:['Medir el pH de soluciones de igual concentración de ácido láctico, propan-2-ol y ácido propanoico','Medir la temperatura de ebullición del ácido láctico','Comparar el color de soluciones de ácido láctico y de glucosa','Medir el pH del agua destilada sola en días diferentes']}
 ],
 isomeria:[
  {c:'uso',k:'Q',ctx:'El etanol (CH₃−CH₂−OH) y el metoximetano (CH₃−O−CH₃) tienen la misma fórmula molecular, C₂H₆O.',
   q:'¿Qué tipo de isómeros son?',o:['Isómeros de función','Isómeros de cadena','Isómeros de posición','Isómeros cis/trans']},
  {c:'uso',k:'Q',ctx:'Los alcanos de fórmula C₅H₁₂ pueden tener la cadena lineal o ramificada.',
   q:'¿Cuántos isómeros estructurales tiene el C₅H₁₂?',o:['3','2','4','5']},
  {c:'uso',k:'Q',ctx:'El propan-1-ol (CH₃−CH₂−CH₂−OH) y el propan-2-ol (CH₃−CH(OH)−CH₃) tienen la misma fórmula molecular.',
   q:'¿Qué tipo de isómeros son?',o:['De posición','De cadena','De función','Cis/trans']},
  {c:'exp',k:'Q',ctx:'El but-2-eno (CH₃−CH=CH−CH₃) existe como dos isómeros, cis y trans, mientras que el but-1-eno (CH₂=CH−CH₂−CH₃) no.',
   q:'¿Por qué el but-1-eno no tiene isómeros cis/trans?',o:['Porque uno de los carbonos de su doble enlace tiene dos sustituyentes iguales (dos H)','Porque el but-1-eno no tiene doble enlace','Porque en el but-1-eno el doble enlace puede girar libremente','Porque el but-1-eno tiene menos carbonos que el but-2-eno']},
  {c:'uso',k:'Q',ctx:'Un carbono quiral (asimétrico) está unido a cuatro grupos diferentes.',
   q:'¿Cuál de los siguientes compuestos tiene un carbono quiral?',o:['butan-2-ol, CH₃−CH(OH)−CH₂−CH₃','propan-2-ol, CH₃−CH(OH)−CH₃','etanol, CH₃−CH₂−OH','2-metilpropan-2-ol, (CH₃)₃C−OH']},
  {c:'uso',k:'CTS',ctx:'La talidomida se recetó en los años 50 y 60 a mujeres embarazadas; uno de sus enantiómeros causaba malformaciones.',
   q:'¿Qué tienen en común dos enantiómeros?',o:['La misma fórmula y los mismos enlaces, pero son imágenes especulares que no se superponen','Tienen fórmulas moleculares diferentes','Tienen grupos funcionales diferentes','Son la misma estructura superponible con distinto nombre comercial']},
  {c:'exp',k:'CTS',ctx:'Las grasas trans se forman en la hidrogenación parcial de aceites vegetales y su consumo aumenta el riesgo cardiovascular.',
   q:'¿En qué se diferencia un ácido graso trans de su isómero cis?',o:['En la disposición de los grupos alrededor del doble enlace: en el trans quedan en lados opuestos','En que el trans no tiene doble enlace','En que el trans tiene un carbono más','En que el trans tiene un grupo funcional diferente']},
  {c:'ind',k:'Q',ctx:'En el laboratorio hay dos recipientes rotulados «C₄H₁₀». Se sospecha que uno contiene butano y el otro 2-metilpropano.',
   q:'¿Qué medición permite comprobar que son sustancias distintas?',o:['Comparar sus puntos de ebullición en las mismas condiciones','Comparar sus fórmulas moleculares','Contar los átomos de carbono de cada uno','Comparar la masa molar de cada uno']}
 ],
 reacciones:[
  {c:'uso',k:'Q',ctx:'CH₂=CH₂ + H₂O → CH₃−CH₂−OH (con H₂SO₄ como catalizador)',
   q:'¿Qué tipo de reacción es?',o:['Adición','Sustitución','Eliminación','Esterificación']},
  {c:'uso',k:'Q',ctx:'CH₃−CH₂−OH → CH₂=CH₂ + H₂O (con H₂SO₄ concentrado y calor)',
   q:'¿Qué tipo de reacción es?',o:['Eliminación (deshidratación)','Adición (hidratación)','Sustitución nucleofílica','Combustión']},
  {c:'ind',k:'CTS',ctx:'En la preparación tradicional de la chicha y el guarapo, las levaduras transforman azúcares en etanol: C₆H₁₂O₆ → 2 C₂H₅OH + 2 CO₂.',
   q:'¿Qué observación indica que esta reacción está ocurriendo?',o:['El desprendimiento de burbujas de gas en la mezcla','La aparición de un espejo de plata en el recipiente','El cambio de la mezcla a un color azul intenso','La formación de un sólido blanco cuando la mezcla se enfría']},
  {c:'exp',k:'CTS',ctx:'Cuando el vino o el guarapo se avinagran, el etanol (CH₃−CH₂−OH) se transforma en ácido etanoico (CH₃−COOH).',
   q:'¿Qué tipo de reacción ocurre en el carbono que lleva el −OH?',o:['Oxidación: el carbono gana enlaces con oxígeno y pierde enlaces con hidrógeno','Reducción: el carbono gana enlaces con hidrógeno','Adición de agua a un doble enlace','Hidrólisis de un éster']},
  {c:'uso',k:'Q',ctx:'CH₃−COOH + CH₃−OH ⇌ ? + H₂O (con H₂SO₄ como catalizador)',
   q:'¿Cuál es el producto orgánico de esta esterificación?',o:['etanoato de metilo','metanoato de etilo','etanoato de etilo','metoxietano']},
  {c:'exp',k:'Q',ctx:'En la cloración del metano con luz, el enlace Cl−Cl se rompe de modo que cada átomo de cloro se queda con uno de los dos electrones del enlace.',
   q:'¿Cómo se llama este tipo de ruptura y qué especies forma?',o:['Ruptura homolítica; se forman radicales libres','Ruptura heterolítica; se forman los iones Cl⁺ y Cl⁻','Ruptura homolítica; se forman carbocationes','Ruptura heterolítica; se forman radicales libres']},
  {c:'exp',k:'CTS',ctx:'El polietileno de las bolsas se fabrica uniendo muchas moléculas de eteno (CH₂=CH₂).',
   q:'¿Qué tipo de reacción es y por qué las bolsas duran tanto tiempo en el ambiente?',o:['Polimerización por adición; el polímero solo tiene enlaces C−C y C−H muy estables, que los microorganismos degradan muy lentamente','Polimerización por condensación; el polímero se disuelve en el agua lluvia','Combustión; el plástico ya está oxidado y no reacciona','Esterificación; los ésteres no se hidrolizan nunca']},
  {c:'ind',k:'Q',ctx:'Para estudiar cómo influye la temperatura en la rapidez de la esterificación, un grupo mezcla ácido etanoico, etanol y H₂SO₄ en tres tubos que mantiene a 20 °C, 40 °C y 60 °C.',
   q:'¿Qué deben mantener igual en los tres tubos?',o:['Las cantidades de reactivos y de catalizador, y el tiempo de reacción','La temperatura de los tres tubos','Solamente el tamaño de los tubos','Nada: cada tubo puede tener cantidades diferentes']}
 ]
};

/* Preguntas abiertas para complementar la evaluación */
var ABIERTAS={
 cadena:['Un compañero nombró un compuesto como «2-etilpentano». Dibuja la estructura que imaginó, explica cuál es el error y escribe el nombre correcto.',
   'Explica con tus palabras por qué la cadena principal no siempre es la que aparece dibujada en línea recta. Usa un ejemplo dibujado.',
   {q:'Escribe el nombre IUPAC del compuesto y justifica cada paso: cadena principal, numeración y orden alfabético.',f:'CH₃−CH₂−CH(CH₃)−CH(CH₃)−CH₂−CH₂−CH₃'}],
 alcanos:['Escribe la ecuación balanceada de la combustión completa del propano y explica por qué es peligroso usar una estufa de gas en un lugar cerrado.',
   'Explica por qué el pentano hierve a mayor temperatura que el 2,2-dimetilpropano, aunque los dos tienen la fórmula C₅H₁₂.',
   'Propón una acción concreta para reducir las emisiones de metano en tu comunidad (basuras, ganadería o gas domiciliario) y justifícala químicamente.'],
 alquenos:['Escribe la reacción del propeno con HBr, nombra el producto principal y explica la regla de Markovnikov usando la estabilidad del carbocatión.',
   'Diseña un experimento sencillo para diferenciar un alcano de un alqueno. Indica qué observarías en cada caso.',
   'Dibuja y nombra todos los alquenos de cadena abierta de fórmula C₄H₈ (incluye los isómeros cis/trans).'],
 aromaticos:['Dibuja y nombra los tres isómeros del dimetilbenceno e indica cuál corresponde a orto, meta y para.',
   'Explica por qué el benceno prefiere las reacciones de sustitución y no las de adición.',
   'Escribe dos productos de uso diario que contengan compuestos aromáticos y un riesgo para la salud asociado a uno de ellos.'],
 haluros:[{q:'Escribe el nombre IUPAC del compuesto y clasifícalo como haluro primario, secundario o terciario. Justifica.',f:'CH₃−CH(Br)−CH₂−CH₃'},
   'Compara lo que ocurre al calentar 2-bromopropano con NaOH acuoso y con KOH en etanol. Escribe el producto y el tipo de reacción de cada caso.',
   'Explica cómo los CFC destruyen el ozono de la estratosfera y por qué su efecto dura décadas después de haberse prohibido.'],
 alcoholes:['Explica, usando los puentes de hidrógeno, por qué el etanol se mezcla con el agua en cualquier proporción y el hexano no.',
   'Escribe los productos de oxidación del propan-1-ol y del propan-2-ol. ¿Qué ocurre con el 2-metilpropan-2-ol? Explica.',
   'Escribe un mensaje corto para una campaña de prevención sobre el licor adulterado que incluya la explicación química del riesgo del metanol.'],
 carbonilos:['Dibuja y nombra un aldehído y una cetona de fórmula C₄H₈O. ¿Qué tipo de isómeros son?',
   'Explica cómo usarías el reactivo de Tollens para identificar un aldehído y qué observarías.',
   '¿Por qué la propanona sirve como quitaesmalte? Relaciona su estructura con su capacidad para disolver otras sustancias.'],
 acidos:['Escribe la reacción de esterificación entre el ácido etanoico y el etanol, nombra el éster y explica el papel del H₂SO₄.',
   'Explica cómo se forma un jabón a partir de un aceite y por qué el jabón ayuda a quitar la grasa.',
   'Analiza una ventaja y una desventaja ambiental del biodiésel de palma en Colombia.'],
 nitrogenados:['Dibuja y nombra una amina primaria, una secundaria y una terciaria que tengan tres carbonos en total.',
   'Explica por qué el jugo de limón disminuye el olor del pescado y escribe la reacción general entre una amina y un ácido.',
   'Dibuja y nombra una amina, una amida y un nitrilo de tres carbonos, y compara sus grupos funcionales.'],
 polifuncionales:[{q:'Escribe el nombre IUPAC del compuesto. Indica cuál es el grupo principal y por qué.',f:'CH₃−CO−CH₂−CH₂−OH'},
   'Dibuja la estructura del ácido 2-aminopropanoico (alanina) y señala sus dos grupos funcionales. ¿Cuál da el sufijo del nombre?',
   'Explica qué cambio químico ocurre cuando el ácido pirúvico se transforma en ácido láctico en los músculos y qué tipo de reacción es.'],
 isomeria:['Escribe y nombra los tres isómeros de fórmula C₅H₁₂ y explica por qué sus puntos de ebullición son diferentes.',
   'Explica por qué el 1,2-dicloroeteno tiene isómeros cis y trans y el 1,1-dicloroeteno no.',
   'Explica con un ejemplo por qué la quiralidad es importante en la fabricación de medicamentos.'],
 reacciones:['Clasifica cada reacción como sustitución, adición, eliminación u óxido-reducción y justifica: a) CH₄ + Cl₂ → CH₃Cl + HCl (con luz); b) CH₂=CH₂ + Br₂ → CH₂Br−CH₂Br; c) CH₃−CH₂−OH → CH₂=CH₂ + H₂O (H₂SO₄, calor).',
   'Explica la diferencia entre ruptura homolítica y heterolítica y da un ejemplo de cada una.',
   'Describe cómo comprobarías en el laboratorio que en la fermentación de un jugo se produce CO₂.']
};

window.DOCENTE_DATOS={ALINEACION:ALINEACION,TEMAS:TEMAS,SABER:SABER,ABIERTAS:ABIERTAS};
})();
