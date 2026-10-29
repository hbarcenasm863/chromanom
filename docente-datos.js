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
   las opciones se baraja (distinto en cada versión, si se generan varias) y
   la hoja impresa NO lleva clave de respuestas, por decisión del docente.

   GRUPOS Y ÁREAS (para filtrar en el formulario):
   - Los temas que juntan varios grupos funcionales (alquenos/alquinos,
     alcoholes/éteres, aldehídos/cetonas, ácidos/ésteres, aminas/amidas/
     nitrilos) traen "grupos": el docente puede elegir solo algunos. El id
     de cada grupo coincide con el tema del Generador y de las reacciones;
     "jue" dice qué temas del Juego le corresponden.
   - En SABER, "g" es el grupo de la pregunta ("ambos" si trata de los dos)
     y "a" su área: "nom" (nomenclatura y estructura), "rx" (reacciones y
     pruebas químicas) o "prop" (propiedades, usos, salud y ambiente). Con
     «Solo nomenclatura» solo salen las "nom". En ABIERTAS, "g" igual.

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
 /* ── Fase 1 «El carbono»: antes de nomenclatura. Sus preguntas de selección
    vienen del banco del Juego (fundamentos.js): saberJue hace que se usen
    como preguntas tipo Saber 11 y como ejercicios «Selección múltiple». ── */
 {id:'carbono',titulo:'El átomo de carbono e hibridación',corto:'Carbono e hibridación',
  gen:[],jue:/^hibridacion$/,rxn:[],nomenclatura:false,saberJue:true,
  alin:{g11:{sed:'sed11q',ev:['11q-ind1','11q-exp1']},g10:{sed:'sed10q',ev:['10q-exp1','10q-exp3']},est:['est1'],dba:['dba10a']},
  previos:{
   curiosos:['La mina de un lápiz (grafito) y un diamante son carbono puro: lo único que cambia es cómo están unidos sus átomos.',
     'Se conocen más de diez millones de compuestos de carbono, más que de todos los demás elementos juntos.',
     'El carbono-14, un isótopo radiactivo del carbono, permite calcular la edad de restos de seres vivos de hasta unos 50 000 años.'],
   contexto:[{amb:'Local',t:'El carbón vegetal de un asado y el hollín de una estufa de leña son formas de carbono casi puro.'},
     {amb:'Nacional',t:'Colombia es uno de los grandes exportadores de carbón mineral del mundo, con minas a cielo abierto en La Guajira y el Cesar.'},
     {amb:'Global',t:'El grafeno, una lámina de carbono de un solo átomo de espesor formada por carbonos sp², es uno de los materiales más resistentes y conductores que se conocen.'}],
   cotidianos:['Mina del lápiz (grafito)','Carbón para asar','Diamantes','Gas de la estufa (metano)','Plásticos'],
   activacion:['¿Qué tienen en común el grafito de un lápiz y un diamante? ¿Por qué crees que son tan diferentes?',
     '¿Cuántos electrones tiene un átomo de carbono? ¿Cuántos tiene en su último nivel?',
     'Si un átomo puede formar cuatro enlaces, ¿de qué maneras distintas podría unirse a otros átomos?']
  },
  info:{
   lectura:['El carbono (Z = 6) tiene la configuración 1s² 2s² 2p²: cuatro electrones de valencia. Es tetravalente (forma cuatro enlaces covalentes) y puede unirse consigo mismo formando cadenas y anillos (concatenación).',
     'En el estado fundamental solo tiene dos electrones desapareados. Para formar cuatro enlaces, un electrón del 2s se promueve al 2p vacío (estado excitado: 1s² 2s¹ 2p³) y luego los orbitales se mezclan (hibridación) en orbitales nuevos e iguales.',
     'sp³: se mezclan 1 s y 3 p; cuatro enlaces sencillos, geometría tetraédrica, 109,5° (metano, CH₄). sp²: 1 s y 2 p; un doble enlace, geometría trigonal plana, 120° (eteno, CH₂=CH₂). sp: 1 s y 1 p; un triple enlace, geometría lineal, 180° (etino, HC≡CH).',
     'El primer enlace entre dos átomos es σ (solapamiento frontal). Los enlaces adicionales son π (solapamiento lateral de orbitales p sin hibridar): un doble enlace es 1 σ + 1 π y un triple, 1 σ + 2 π. Regla rápida: un carbono unido a 4 átomos es sp³; a 3, sp²; a 2, sp.'],
   esquema:{raiz:'Hibridación del carbono',ramas:[
     {t:'sp³',items:['1 s + 3 p','Tetraédrica, 109,5°','Solo enlaces sencillos']},
     {t:'sp²',items:['1 s + 2 p','Trigonal plana, 120°','Un doble enlace (1 π)']},
     {t:'sp',items:['1 s + 1 p','Lineal, 180°','Un triple enlace (2 π)']},
     {t:'Enlaces',items:['σ: frontal, el primero','π: lateral, no deja girar']}]}
  },
  ejemplo:{pares:[{f:'CH₃−CH₃',n:'etano: carbonos sp³ (109,5°)'},{f:'CH₂=CH₂',n:'eteno: carbonos sp² (120°)'},{f:'CH≡CH',n:'etino: carbonos sp (180°)'}],nota:'Cuenta los átomos unidos a cada carbono: 4 → sp³, 3 → sp², 2 → sp.'},
  abiertos:[
   'Escribe la configuración electrónica del carbono en estado fundamental y en estado excitado, y represéntalas con diagramas de cajas.',
   'Explica con tus palabras por qué el carbono forma cuatro enlaces si en su estado fundamental solo tiene dos electrones desapareados.',
   'Completa una tabla con las tres hibridaciones del carbono: orbitales que se mezclan, geometría, ángulo de enlace y un ejemplo.',
   'Indica la hibridación de cada carbono en CH₂=CH−CH₂−C≡CH y justifica cada respuesta.',
   'Cuenta los enlaces σ y π del eteno (CH₂=CH₂) y del etino (HC≡CH).',
   'El diamante y el grafito son carbono puro. Investiga y explica su diferencia a partir de la hibridación de sus carbonos.'
  ],
  propia:[]},

 {id:'tipos_carbono',titulo:'Tipos de carbono: primario, secundario, terciario y cuaternario',corto:'Tipos de carbono',
  gen:[],jue:/^tipos_carbono$/,rxn:[],nomenclatura:false,saberJue:true,
  alin:{g11:{sed:'sed11q',ev:['11q-uso2']},g10:{sed:'sed10q',ev:['10q-exp3']},est:['est1'],dba:['dba11b']},
  previos:{
   curiosos:['El «octanaje» de la gasolina se mide comparándola con el isooctano, una molécula muy ramificada que tiene carbonos de los cuatro tipos.',
     'Que un alcohol sea primario, secundario o terciario cambia lo que pasa cuando se oxida: así funcionan algunos alcoholímetros.',
     'Las cadenas muy ramificadas (con carbonos terciarios y cuaternarios) arden de forma más suave en un motor que las lineales.'],
   contexto:[{amb:'Local',t:'La gasolina corriente y la extra que se venden en las estaciones de servicio se diferencian por su octanaje, que depende de cuán ramificadas son sus moléculas.'},
     {amb:'Nacional',t:'Ecopetrol mejora el octanaje de la gasolina en sus refinerías transformando cadenas lineales en cadenas ramificadas.'},
     {amb:'Global',t:'El metil terc-butil éter (MTBE), con un carbono terciario unido a tres CH₃ y a un oxígeno, se usó en todo el mundo para aumentar el octanaje, pero se restringió por contaminar aguas subterráneas.'}],
   cotidianos:['Gasolina corriente y extra','Alcohol isopropílico (propan-2-ol, alcohol secundario)','Etanol de las bebidas (alcohol primario)'],
   activacion:['Si un carbono está en el extremo de una cadena, ¿a cuántos carbonos está unido?','¿Puede un carbono estar unido a cinco carbonos? ¿Por qué?','¿Qué crees que cambia en una molécula cuando tiene ramificaciones?']
  },
  info:{
   lectura:['Un carbono se clasifica según cuántos átomos de carbono tiene unidos directamente: primario (1), secundario (2), terciario (3) o cuaternario (4). Los hidrógenos y los átomos como O, N o halógenos no se cuentan.',
     'En un alcano el tipo de carbono se reconoce en la fórmula: CH₃ (3 H) es primario, CH₂ (2 H) secundario, CH (1 H) terciario y C (sin H) cuaternario.',
     'En una cadena lineal los extremos son primarios y los carbonos internos, secundarios. Los terciarios y cuaternarios aparecen donde salen ramificaciones; en los anillos sin ramas todos los carbonos son secundarios.',
     'La misma regla clasifica los alcoholes: el etanol (CH₃−CH₂−OH) es primario, el propan-2-ol secundario y el 2-metilpropan-2-ol terciario, según el tipo del carbono que lleva el −OH.'],
   esquema:{raiz:'Tipos de carbono',ramas:[
     {t:'Primario',items:['Unido a 1 C','CH₃ en alcanos']},
     {t:'Secundario',items:['Unido a 2 C','CH₂ en alcanos']},
     {t:'Terciario',items:['Unido a 3 C','CH: sale una rama']},
     {t:'Cuaternario',items:['Unido a 4 C','C sin hidrógenos']}]}
  },
  ejemplo:{pares:[{f:[{h:3},{h:0,bu:CH3,bd:CH3},{h:2},{h:1,bd:CH3},{h:3}],n:'isooctano: 5 primarios, 1 secundario, 1 terciario, 1 cuaternario'},{f:'CH₃−CH(OH)−CH₃',n:'el C del −OH es secundario: alcohol secundario'}],nota:'Solo se cuentan los átomos de carbono unidos a cada carbono.'},
  abiertos:[
   {q:'Clasifica cada carbono de esta molécula como primario, secundario, terciario o cuaternario.',f:'CH₃−CH(CH₃)−CH₂−C(CH₃)₂−CH₃'},
   'Dibuja una molécula de 6 carbonos que tenga exactamente un carbono cuaternario y ninguno terciario.',
   'Explica por qué el carbono unido al −OH en el etanol es primario, aunque esté unido a cuatro átomos.',
   'Dibuja una cadena de 5 carbonos con 4 carbonos primarios. ¿Qué tipo de carbono tiene que aparecer?',
   'Clasifica como primario, secundario o terciario: a) CH₃−CH₂−CH₂−OH; b) CH₃−CH(OH)−CH₃; c) (CH₃)₃C−OH.',
   '¿Cuántos hidrógenos tiene un carbono terciario en un alcano? Explica por qué.'
  ],
  propia:[]},

 {id:'cadenas',titulo:'Clasificación de las cadenas carbonadas',corto:'Cadenas carbonadas',
  gen:[],jue:/^cadenas$/,rxn:[],nomenclatura:false,saberJue:true,
  alin:{g11:{sed:'sed11q',ev:['11q-uso2','11q-ind2']},g10:{sed:'sed10q',ev:['10q-exp3']},est:['est1'],dba:['dba11b']},
  previos:{
   curiosos:['La parafina de las velas está hecha de cadenas largas, abiertas y saturadas, de más de 20 carbonos.',
     'La cafeína del café y la nicotina del tabaco tienen anillos con nitrógeno: son compuestos heterocíclicos.',
     'Los aceites vegetales tienen cadenas insaturadas (con dobles enlaces); por eso son líquidos, mientras que la manteca, más saturada, es sólida.'],
   contexto:[{amb:'Local',t:'El aceite de cocina (cadenas insaturadas) y la manteca (cadenas más saturadas) se diferencian por los enlaces de sus cadenas.'},
     {amb:'Nacional',t:'El café colombiano debe parte de su aroma a moléculas con anillos aromáticos y heterocíclicos que se forman al tostar el grano.'},
     {amb:'Global',t:'El caucho natural, extraído del árbol Hevea, está formado por cadenas largas insaturadas; la vulcanización las une con puentes de azufre.'}],
   cotidianos:['Velas de parafina','Aceite y manteca','Café','Caucho de las llantas','Gas natural'],
   activacion:['¿Qué diferencia hay entre una cadena de eslabones abierta y un collar cerrado?','¿Una cadena dibujada en zigzag es ramificada? ¿Por qué?','¿Por qué crees que el aceite es líquido y la manteca sólida?']
  },
  info:{
   lectura:['Por su forma, una cadena es abierta (acíclica), con dos extremos, o cerrada (cíclica), formando un anillo. Las abiertas pueden ser lineales (un solo camino) o ramificadas (de algún carbono sale otra cadena).',
     'Por sus enlaces es saturada (solo enlaces sencillos C−C) o insaturada (al menos un doble o triple enlace). Por sus átomos es homogénea (esqueleto solo de carbonos) o heterogénea (un heteroátomo, como O, N o S, intercalado entre carbonos).',
     'Las cerradas pueden ser homocíclicas (solo carbono en el anillo) o heterocíclicas. Entre las homocíclicas están las alicíclicas (ciclohexano, ciclohexeno) y las aromáticas (benceno y sus derivados).',
     'Doblar el dibujo no ramifica una cadena: el zigzag es su forma real por los 109,5° del carbono sp³. Un −OH, −NH₂ o −Cl al final de la cadena no la hace heterogénea: solo cuenta un heteroátomo entre dos carbonos.'],
   esquema:{raiz:'Cadenas carbonadas',ramas:[
     {t:'Forma',items:['Abierta: lineal o ramificada','Cerrada: alicíclica, aromática o heterocíclica']},
     {t:'Enlaces',items:['Saturada: solo sencillos','Insaturada: dobles o triples']},
     {t:'Átomos',items:['Homogénea: solo C','Heterogénea: O, N o S entre carbonos']}]}
  },
  ejemplo:{pares:[{f:'CH₃−CH(CH₃)−CH=CH₂',n:'abierta, ramificada, insaturada y homogénea'},{f:'CH₃−CH₂−O−CH₃',n:'abierta, lineal, saturada y heterogénea'}],nota:'Una cadena se clasifica con los tres criterios a la vez: forma, enlaces y átomos.'},
  abiertos:[
   'Dibuja un ejemplo de cada una: cadena abierta lineal, abierta ramificada, cerrada alicíclica y cerrada aromática.',
   'Clasifica según los tres criterios: a) CH₃−CH₂−CH₃; b) CH₂=CH−CH₂−CH₃; c) CH₃−O−CH₂−CH₃; d) CH₃−CH(CH₃)−CH₃.',
   'Explica por qué CH₃−CH₂−OH es una cadena homogénea y CH₃−O−CH₃ es heterogénea.',
   'Un estudiante dice que una cadena dibujada en zigzag es ramificada. ¿Tiene razón? Explica.',
   'El hexano es C₆H₁₄ y el ciclohexano C₆H₁₂. Explica por qué el anillo tiene dos hidrógenos menos.',
   'Dibuja una cadena cerrada heterocíclica y señala su heteroátomo.'
  ],
  propia:[]},

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
     'Si dos cadenas tienen la misma longitud, se escoge la que tiene más sustituyentes.',
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
   activacion:['¿Por qué el gas de las pipetas (propano y butano) se guarda a presión y la parafina es sólida, si ambos son alcanos?','¿Qué productos se forman cuando se quema el gas de la estufa? ¿Qué pasa si falta aire?','¿Qué diferencia hay entre una cadena abierta de carbonos y un anillo?']
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
  grupos:[{id:'alquenos',t:'Alquenos',jue:/^alquenos$|dieno|eninos?/i},{id:'alquinos',t:'Alquinos',jue:/^alquinos$/i}],
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
   curiosos:['Michael Faraday aisló el benceno en 1825 a partir de un residuo aceitoso que dejaba el gas del alumbrado público.',
     'August Kekulé propuso en 1865 la estructura en anillo del benceno. Hoy se sabe que sus seis electrones π están repartidos (deslocalizados) por todo el anillo.',
     'La vainillina, responsable del aroma de la vainilla, tiene un anillo bencénico.'],
   contexto:[{amb:'Local',t:'El tíner y algunos pegantes contienen tolueno (metilbenceno). Inhalarlos es peligroso para el sistema nervioso.'},
     {amb:'Nacional',t:'La vainilla es el fruto de una orquídea americana del género Vanilla; en Colombia crecen varias especies silvestres de este género.'},
     {amb:'Global',t:'El benceno está clasificado como cancerígeno para los seres humanos; por eso se limita su contenido en la gasolina y en los solventes.'}],
   cotidianos:['Icopor (poliestireno)','Bolas antipolillas (naftaleno o 1,4-diclorobenceno)','Aspirina e ibuprofeno','Thinner (tolueno, xilenos)'],
   activacion:['¿Por qué algunos solventes, como el tíner, advierten que no se deben inhalar?','¿Qué tienen en común el aroma de la vainilla y el icopor?','Dibuja un hexágono con tres dobles enlaces alternados. ¿Crees que reaccionará igual que un alqueno? ¿Por qué?']
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
   contexto:[{amb:'Global',t:'Los CFC (clorofluorocarbonos) de neveras y aerosoles destruían la capa de ozono. El Protocolo de Montreal (1987), del que Colombia hace parte, los fue eliminando gradualmente, y la capa de ozono se está recuperando.'},
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

 {id:'alcoholes',titulo:'Alcoholes, fenoles y éteres',corto:'Alcoholes, fenoles y éteres',
  gen:['alcoholes','eteres'],jue:/^alcoholes$|^eteres$|fenol/i,rxn:['alcoholes','eteres'],nomenclatura:true,
  grupos:[{id:'alcoholes',t:'Alcoholes y fenoles',jue:/^alcoholes$|fenol/i},{id:'eteres',t:'Éteres',jue:/^eteres$/i}],
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
     'El −OH forma puentes de hidrógeno: por eso los alcoholes pequeños se mezclan con agua y hierven a temperaturas mucho más altas que alcanos y éteres de masa parecida. Los alcoholes primarios se oxidan a aldehídos y ácidos; los secundarios, a cetonas; los terciarios no se oxidan con facilidad. Con HBr o HCl, el −OH se sustituye por el halógeno (etanol + HBr → bromoetano + H₂O).'],
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
  grupos:[{id:'aldehidos',t:'Aldehídos',jue:/^aldehidos$/i},{id:'cetonas',t:'Cetonas',jue:/^cetonas$/i}],
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
     'Se obtienen por oxidación de alcoholes: un alcohol primario da un aldehído (con un oxidante suave; si es fuerte, sigue hasta ácido) y uno secundario, una cetona.'],
   esquema:{raiz:'Aldehídos y cetonas (C=O)',ramas:[
     {t:'Aldehído R−CHO',items:['Sufijo -al','El −CHO es C1: sin localizador']},
     {t:'Cetona R−CO−R′',items:['Sufijo -ona','Con localizador']},
     {t:'Reacciones',items:['Adición nucleofílica','El aldehído se oxida a ácido','Tollens y Fehling: positivas en aldehídos']},
     {t:'Origen',items:['Alcohol 1° → aldehído (→ ácido)','Alcohol 2° → cetona']}]}
  },
  ejemplo:{f:'CH₃−CO−CH₂−CH(CH₃)−CH₃',partes:[['4-metil','r','metilo en C4'],['pent','c','5 carbonos'],['an','i','solo enlaces sencillos'],['-2-ona','g','C=O en C2']]},
  propia:[]},

 {id:'acidos',titulo:'Ácidos carboxílicos y ésteres',corto:'Ácidos y ésteres',
  gen:['acidos','esteres'],jue:/^acidos$|^esteres$/i,rxn:['acidos','esteres'],nomenclatura:true,
  grupos:[{id:'acidos',t:'Ácidos carboxílicos',jue:/^acidos$/i},{id:'esteres',t:'Ésteres',jue:/^esteres$/i}],
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
     'Son ácidos débiles: en agua ceden parcialmente un H⁺ y forman iones carboxilato. Sus moléculas se unen de dos en dos (dímeros) por puentes de hidrógeno, por eso tienen puntos de ebullición altos.',
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
  grupos:[{id:'aminas',t:'Aminas',jue:/^aminas$/i},{id:'amidas',t:'Amidas',jue:/^amidas$/i},{id:'nitrilos',t:'Nitrilos',jue:/^nitrilos$/i}],
  alin:{g11:{sed:'sed11q',ev:['11q-uso2','11q-ind3']},g10:{sed:'sed10q',ev:['10q-exp3']},est:['est2'],dba:['dba11b']},
  previos:{
   curiosos:['El olor a pescado se debe a aminas como la trimetilamina (N,N-dimetilmetanamina).',
     'La urea, una amida, fue en 1828 el primer compuesto orgánico preparado en el laboratorio a partir de una sustancia inorgánica (Friedrich Wöhler).',
     'El nailon es una poliamida y el paracetamol (acetaminofén) contiene un grupo amida.'],
   contexto:[{amb:'Local',t:'La yuca amarga contiene linamarina, un compuesto con grupo nitrilo que puede liberar cianuro de hidrógeno (HCN). Rallarla, remojarla, lavarla y cocinarla bien reduce el riesgo casi por completo.'},
     {amb:'Nacional',t:'La urea es uno de los fertilizantes nitrogenados más usados en los cultivos colombianos.'},
     {amb:'Global',t:'La cafeína es el estimulante más consumido del mundo: está en el café, el té y las bebidas energizantes. Es un compuesto nitrogenado, y el café es uno de los productos que más exporta Colombia.'}],
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
     {amb:'Nacional',t:'Frutas colombianas como el lulo, el maracuyá y el limón deben su acidez a ácidos polifuncionales como el cítrico y el málico.'},
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
  gen:[],jue:/isomer/i,rxn:[],nomenclatura:false,saberJue:true,
  alin:{g11:{sed:'sed11q',ev:['11q-ind3','11q-uso2']},g10:{sed:'sed10q',ev:['10q-exp3']},est:['est1'],dba:['dba11b']},
  previos:{
   curiosos:['Con la fórmula C₂H₆O existen dos sustancias muy distintas: el etanol (líquido, hierve a 78 °C) y el metoximetano (gas, hierve a −24 °C).',
     'La (R)-carvona huele a hierbabuena y la (S)-carvona a alcaravea: son imágenes en espejo una de la otra, que no se pueden superponer (enantiómeros).',
     'El limoncillo contiene citral, una mezcla de dos isómeros cis/trans llamados geranial y neral.'],
   contexto:[{amb:'Global',t:'La talidomida, recetada en los años 50 y 60 contra las náuseas del embarazo, causó malformaciones en miles de bebés. Uno de sus enantiómeros era el responsable, y en el cuerpo un enantiómero se transforma en el otro.'},
     {amb:'Nacional',t:'En Colombia la regulación de alimentos limita el contenido de grasas trans en aceites y productos procesados.'},
     {amb:'Local',t:'Aromáticas como la hierbabuena y el limoncillo deben su olor a moléculas que tienen isómeros con olores distintos.'}],
   cotidianos:['Margarinas y productos de panadería (grasas trans)','Hierbabuena y limoncillo','Medicamentos que se venden como un solo enantiómero o como mezcla'],
   activacion:['¿Pueden dos sustancias tener la misma fórmula molecular y ser distintas? Da un ejemplo si lo conoces.','Mira tus manos: una es la imagen en el espejo de la otra, pero no se pueden superponer. ¿Conoces otros objetos así?','¿Por qué un medicamento podría funcionar y su «imagen en el espejo» no?']
  },
  info:{
   lectura:['Los isómeros tienen la misma fórmula molecular pero distinta estructura, y por eso, en general, propiedades diferentes.',
     'Isomería estructural (los átomos se unen en distinto orden). De cadena: C₄H₁₀ puede ser butano o 2-metilpropano. De posición: propan-1-ol y propan-2-ol. De función: etanol y metoximetano (C₂H₆O).',
     'Estereoisomería (mismos enlaces, distinta disposición en el espacio). Cis/trans: en alquenos donde cada carbono del doble enlace tiene dos grupos distintos; el doble enlace no gira, así que el cis-but-2-eno y el trans-but-2-eno son sustancias diferentes.',
     'Quiralidad: un carbono unido a cuatro grupos diferentes es un carbono quiral (estereocentro). La molécula y su imagen en el espejo no se superponen: son enantiómeros, como la mano derecha y la izquierda. Tienen las mismas propiedades físicas (salvo el sentido en que desvían la luz polarizada), pero pueden actuar distinto en el cuerpo.'],
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
     {amb:'Global',t:'La mayoría de los plásticos (polietileno, polipropileno, PVC) se fabrican por polimerización de alquenos o de sus derivados (el PVC, del cloroeteno).'}],
   cotidianos:['Combustión del gas de la estufa','Vinagre','Jabón','Plásticos','Alcoholímetro'],
   activacion:['¿Qué evidencias te indican que ocurrió una reacción química al cocinar o al fermentar una bebida?','¿Qué enlaces crees que se rompen y cuáles se forman cuando arde el gas de la estufa?','¿Por qué el vino o el guarapo se avinagran si se dejan destapados?']
  },
  info:{
   lectura:['En una reacción orgánica se rompen y se forman enlaces. Los tipos básicos son: sustitución (un átomo o grupo cambia por otro), adición (dos átomos se suman a un enlace múltiple), eliminación (se pierden átomos y se forma un enlace múltiple) y oxidorreducción (cambia el número de enlaces C−O o C−H).',
     'Ruptura homolítica: cada átomo se queda con un electrón y se forman radicales (halogenación de alcanos con luz). Ruptura heterolítica: un átomo se queda con los dos electrones y se forman iones o carbocationes (adición de HBr a alquenos). Reacción pericíclica: los enlaces se rompen y se forman a la vez, en un ciclo (ozonólisis).',
     'Los reactivos se clasifican en nucleófilos (ricos en electrones: OH⁻, NH₃, H₂O) y electrófilos (pobres en electrones: H⁺, NO₂⁺, carbocationes).',
     'Reacciones de interés cotidiano: combustión, fermentación, oxidación de alcoholes, esterificación, saponificación y polimerización.'],
   esquema:{raiz:'Tipos de reacción orgánica',ramas:[
     {t:'Sustitución',items:['Radicalaria: alcanos','Nucleofílica: haluros','Electrofílica: aromáticos']},
     {t:'Adición',items:['Alquenos y alquinos','Regla de Markovnikov']},
     {t:'Eliminación',items:['Deshidratación de alcoholes','Pérdida de HX en haluros']},
     {t:'Oxidorreducción',items:['Combustión','Alcohol → aldehído / cetona → ácido']}]}
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
  {a:'nom',c:'uso',k:'Q',ctx:'El isooctano es el compuesto de referencia (índice de octano 100) para medir la calidad de la gasolina. Su fórmula semidesarrollada es:',f:[{h:3},{h:0,bu:CH3,bd:CH3},{h:2},{h:1,bd:CH3},{h:3}],t:'(CH₃)₃C−CH₂−CH(CH₃)−CH₃',
   q:'¿Cuál es su nombre IUPAC?',o:['2,2,4-trimetilpentano','2,4,4-trimetilpentano','1,1,1,3-tetrametilpropano','2,2,4-trimetiloctano']},
  {a:'nom',c:'exp',k:'Q',ctx:'Dos estudiantes nombran el mismo alcano, CH₃−CH(C₂H₅)−CH₂−CH₃. Ana escribe «2-etilbutano» y Luis escribe «3-metilpentano».',
   q:'¿Quién tiene razón y por qué?',o:['Luis, porque la cadena más larga tiene 5 carbonos e incluye los del grupo etilo','Ana, porque el etilo es el sustituyente más grande y debe nombrarse','Ana, porque la cadena principal es la que aparece escrita en línea recta','Ambos, porque los dos nombres describen la misma molécula según la IUPAC']},
  {a:'nom',c:'uso',k:'Q',ctx:'Al numerar la cadena principal de un alcano ramificado hay que escoger por cuál extremo empezar.',
   q:'¿Cuál criterio se aplica PRIMERO?',o:['Dar los localizadores más bajos posibles al conjunto de sustituyentes','Dar el número más bajo al sustituyente que va primero en orden alfabético','Numerar siempre de izquierda a derecha, como está escrita la fórmula','Dar el número 1 al carbono que tiene el sustituyente más grande']},
  {a:'nom',c:'uso',k:'Q',ctx:'Observa la siguiente estructura:',f:[{h:3},{h:1,bd:CH3},{h:1,bd:ET},{h:2},{h:3}],t:'CH₃−CH(CH₃)−CH(C₂H₅)−CH₂−CH₃',
   q:'¿Cuál es su nombre IUPAC?',o:['3-etil-2-metilpentano','2-metil-3-etilpentano','3-etil-4-metilpentano','2-etil-3-metilpentano']},
  {a:'nom',c:'exp',k:'Q',ctx:'En el nombre 4-etil-2,2-dimetilhexano, el etilo se escribe antes que el metilo, aunque su localizador es mayor.',
   q:'¿Por qué se escribe en ese orden?',o:['Porque los sustituyentes se ordenan alfabéticamente y el prefijo di- no se tiene en cuenta','Porque el etilo tiene más carbonos que el metilo','Porque el sustituyente que aparece una sola vez siempre va primero','Porque los sustituyentes con localizador mayor se escriben primero']},
  {a:'prop',c:'ind',k:'Q',ctx:'Un grupo de estudiantes consultó los puntos de ebullición de tres isómeros de fórmula C₅H₁₂: pentano, 36 °C; 2-metilbutano, 28 °C; 2,2-dimetilpropano, 10 °C.',
   q:'¿Qué conclusión es coherente con estos datos?',o:['Para una misma fórmula molecular, a mayor ramificación menor punto de ebullición','A mayor masa molar, menor punto de ebullición','La ramificación no influye, porque los tres tienen la misma fórmula molecular','El punto de ebullición aumenta con el número de grupos metilo']},
  {a:'nom',c:'ind',k:'Q',ctx:'Una estudiante debe nombrar un alcano ramificado que está dibujado en zigzag y con las ramas hacia arriba y hacia abajo.',
   q:'¿Qué procedimiento le permite comprobar que escogió bien la cadena principal?',o:['Contar los carbonos de todos los caminos posibles entre extremos y escoger el más largo','Tomar la cadena horizontal tal como está dibujada','Escoger la cadena que empieza en el carbono de la izquierda','Contar solamente los carbonos que tienen tres hidrógenos']},
  {a:'nom',c:'uso',k:'Q',ctx:'Un compuesto se llama 3-etil-2,4-dimetilheptano.',
   q:'¿Cuántos carbonos tiene su cadena principal y cuántos tiene la molécula en total?',o:['7 en la cadena principal y 11 en total','7 en la cadena principal y 10 en total','11 en la cadena principal y 11 en total','9 en la cadena principal y 11 en total']},
  {a:'nom',c:'uso',k:'Q',ctx:'El ciclohexano es un disolvente industrial que se obtiene al hidrogenar el benceno.',
   q:'¿Cuál es el nombre IUPAC del compuesto que resulta de reemplazar un hidrógeno del ciclohexano por un grupo etilo?',o:['etilciclohexano','etilciclopentano','etilbenceno','cicloetilhexano']},
  {a:'nom',c:'exp',k:'Q',ctx:'Al numerar el compuesto 2,4-dimetilpentano (CH₃−CH(CH₃)−CH₂−CH(CH₃)−CH₃), las dos direcciones de numeración dan el mismo conjunto de localizadores: {2,4}.',
   q:'¿Por qué no importa en este caso desde qué extremo se numera?',o:['Porque la molécula es simétrica: los dos metilos quedan a la misma distancia de cada extremo','Porque los dos metilos están en el mismo carbono','Porque hay que numerar siempre desde la izquierda, sin excepción','Porque los localizadores se suman y el resultado es el mismo']},
  {a:'nom',c:'uso',k:'Q',ctx:'En el nombre 4-isopropil-2-metilheptano (nombre tradicional aceptado; la IUPAC 2013 prefiere «propan-2-il» en lugar de «isopropil»), los sustituyentes se escriben en orden alfabético.',
   q:'¿Por qué «isopropil» se escribe antes que «metil»?',o:['Porque el prefijo iso- sí cuenta para el orden alfabético, e «i» va antes que «m»','Porque el isopropilo tiene más carbonos que el metilo','Porque el localizador 4 es mayor que el 2','Porque los sustituyentes ramificados siempre se escriben primero']},
  {a:'rx',c:'ind',k:'CTS',ctx:'La planta de tratamiento de aguas residuales El Salitre, en Bogotá, captura el biogás que producen las bacterias al descomponer la materia orgánica sin oxígeno, y lo usa como fuente de energía.',
   q:'El biogás es rico en metano. ¿Qué evidencia confirmaría que el gas capturado es metano y no otro hidrocarburo?',o:['Quemar una muestra y comprobar que por cada mol de CO₂ se forman 2 moles de H₂O, como corresponde al CH₄','Medir solamente el volumen de gas que se produce cada día','Comprobar que el gas no tiene olor','Medir la temperatura del tanque donde se descompone la materia orgánica']},
  {a:'nom',c:'uso',k:'Q',ctx:'Un compañero escribió el nombre de un alcano de cuatro formas distintas: «2,3 dimetilbutano», «2-3-dimetilbutano», «2,3-dimetilbutano» y «2-3 dimetil-butano».',
   q:'¿Cuál de las cuatro cumple con la puntuación que usa la IUPAC (coma entre números, guion entre un número y una letra)?',o:['2,3-dimetilbutano','2,3 dimetilbutano','2-3-dimetilbutano','2-3 dimetil-butano']},
  {a:'nom',c:'uso',k:'Q',ctx:'Observa la siguiente estructura:',f:'CH₃−CH(CH₃)−CH(CH₃)−CH₂−CH₃',
   q:'¿Cuál es su nombre IUPAC?',o:['2,3-dimetilpentano','3,4-dimetilpentano','2,3-dimetilbutano','1,2-dimetilpentano']},
  {a:'nom',c:'uso',k:'Q',ctx:'Observa la siguiente estructura:',f:'CH₃−C(CH₃)(CH₃)−CH₂−CH₃',
   q:'¿Cuál es su nombre IUPAC?',o:['2,2-dimetilbutano','1,1-dimetilbutano','2-dimetilbutano','2,3-dimetilbutano']},
  {a:'nom',c:'exp',k:'Q',ctx:'En el nombre 2,2-dimetilbutano el localizador 2 se repite dos veces, uno para cada metilo.',
   q:'¿Por qué es necesario repetirlo en vez de escribir «2-dimetilbutano»?',o:['Porque cada sustituyente necesita su propio localizador, aunque los dos caigan en el mismo carbono','Porque el prefijo di- siempre exige dos números diferentes','Porque sin repetirlo el nombre no indicaría cuántos carbonos tiene la cadena principal','Porque la IUPAC prohíbe los localizadores repetidos']},
  {a:'prop',c:'uso',k:'CTS',ctx:'En Colombia se venden gasolina corriente y gasolina extra; la extra tiene un índice de octano más alto. Ese índice compara la resistencia de un combustible a la autoignición con la del isooctano (índice 100) y la del heptano (índice 0).',
   q:'¿Qué significa que un combustible tenga un índice de octano más alto?',o:['Resiste mejor la autoignición (el «cascabeleo» del motor), de forma parecida al isooctano','Tiene más energía por litro y rinde más kilómetros','Contiene más carbono y produce más CO₂ al quemarse','Contiene una mayor proporción de octano lineal (n-octano)']},
  {a:'nom',c:'ind',k:'Q',ctx:'Un estudiante afirma: «3-etilpentano y 3-metilhexano son el mismo compuesto, porque los dos tienen 7 carbonos en total».',
   q:'¿Cómo se puede comprobar si esa afirmación es correcta?',o:['Dibujando la estructura completa de cada nombre y comparando cómo están unidos los átomos, no solo el total de carbonos','Contando solamente los carbonos de la cadena principal de cada uno','Buscando los dos nombres en una tabla de alcanos comunes','Comparando el punto de ebullición de los dos, sin dibujarlos']},
  {a:'nom',c:'uso',k:'Q',ctx:'Observa la siguiente estructura:',f:'CH₃−CH₂−CH(CH₂CH₃)−CH₂−CH₂−CH₃',
   q:'¿Cuál es su nombre IUPAC?',o:['3-etilhexano','3-etilheptano','4-etilhexano','3-propilpentano']},
  {a:'nom',c:'exp',k:'CTS',ctx:'La IUPAC recomienda nombres sistemáticos (como butano) en vez de nombres triviales o comerciales que cambian de una región a otra.',
   q:'¿Cuál es la principal ventaja de tener un sistema de nomenclatura único e internacional?',o:['Permite que cualquier químico, en cualquier país, identifique sin ambigüedad la misma sustancia a partir de su nombre','Hace que los nombres sean más cortos y fáciles de memorizar','Evita que las sustancias reaccionen entre sí al almacenarlas','Elimina la necesidad de dibujar las estructuras de las moléculas']}
 ],
 alcanos:[
  {a:'nom',c:'uso',k:'CTS',ctx:'El gas de las pipetas (GLP) que se usa en muchas cocinas colombianas es principalmente una mezcla de propano y butano.',
   q:'¿Cuál es la fórmula molecular del butano?',o:['C₄H₁₀','C₄H₈','C₄H₆','C₃H₈']},
  {a:'nom',c:'uso',k:'Q',ctx:'Los alcanos de cadena abierta cumplen la fórmula general CₙH₂ₙ₊₂.',
   q:'¿Cuál de los siguientes compuestos NO cumple esa fórmula?',o:['ciclohexano, C₆H₁₂','hexano, C₆H₁₄','propano, C₃H₈','decano, C₁₀H₂₂']},
  {a:'rx',c:'exp',k:'CTS',ctx:'La combustión completa del metano es CH₄ + 2 O₂ → CO₂ + 2 H₂O. Cuando la estufa recibe poco aire, la llama se vuelve amarilla y aparece hollín en las ollas.',
   q:'¿Qué explica este cambio?',o:['Con poco oxígeno la combustión es incompleta y se forman carbono (hollín) y monóxido de carbono','Con poco oxígeno el metano se convierte en un alqueno que arde con llama amarilla','Con poco oxígeno se produce más CO₂ y más agua','El hollín proviene del nitrógeno del aire que no reaccionó']},
  {a:'nom',c:'uso',k:'Q',ctx:'Observa la siguiente estructura:',gen:'etilciclohexano',t:'C₆H₁₁−CH₂−CH₃',
   q:'¿Cuál es su nombre IUPAC?',o:['etilciclohexano','etilhexano','ciclooctano','etilbenceno']},
  {a:'rx',c:'exp',k:'Q',ctx:'El metano reacciona con cloro solo en presencia de luz ultravioleta (hν) o calor, y se forman CH₃Cl y HCl.',
   q:'¿Cuál es la función de la luz en esta reacción?',o:['Romper de forma homolítica el enlace Cl−Cl para formar radicales cloro','Romper el enlace C−H para formar los iones H⁺ y CH₃⁻','Volver polar al metano para que actúe como nucleófilo','Formar un doble enlace en el metano para que ocurra una adición']},
  {a:'prop',c:'ind',k:'Q',ctx:'Se registraron los puntos de ebullición de varios alcanos: metano, −162 °C; etano, −89 °C; propano, −42 °C; butano, −1 °C.',
   q:'Si la tendencia continúa, ¿qué se espera para el pentano?',o:['Un valor mayor que −1 °C, porque la cadena es más larga y las fuerzas de London aumentan','Un valor menor que −162 °C, porque tiene más hidrógenos','Un valor entre −89 °C y −42 °C, porque el pentano es un isómero del butano','El mismo valor del butano, porque ambos son alcanos']},
  {a:'prop',c:'uso',k:'CTS',ctx:'Colombia produce gas natural en La Guajira y en el piedemonte llanero. Las fugas de metano en pozos y tuberías preocupan aunque no haya incendio.',
   q:'¿Por qué una fuga de metano es un problema ambiental?',o:['Porque el metano es un gas de efecto invernadero más potente que el CO₂ por molécula','Porque el metano destruye la capa de ozono igual que los CFC','Porque el metano reacciona con la lluvia y forma ácido sulfúrico','Porque el metano es un sólido que se acumula en los suelos']},
  {a:'nom',c:'uso',k:'Q',ctx:'Todos los átomos de carbono del propano están unidos solo por enlaces sencillos.',
   q:'¿Qué hibridación y qué geometría tienen esos carbonos?',o:['sp³, tetraédrica, con ángulos cercanos a 109,5°','sp², trigonal plana, con ángulos de 120°','sp, lineal, con ángulos de 180°','sp³, plana cuadrada, con ángulos de 90°']},
  {a:'rx',c:'uso',k:'Q',ctx:'La combustión completa del propano (el gas de muchas pipetas) consume oxígeno y produce dióxido de carbono y agua.',
   q:'¿Cuál es la ecuación balanceada de esa combustión?',o:['C₃H₈ + 5 O₂ → 3 CO₂ + 4 H₂O','C₃H₈ + 3 O₂ → 3 CO₂ + 4 H₂O','C₃H₈ + 5 O₂ → 3 CO + 4 H₂O','C₃H₈ + O₂ → CO₂ + H₂O']},
  {a:'prop',c:'exp',k:'CTS',ctx:'El gas natural y el GLP son inodoros en su estado puro. Por seguridad, las empresas de gas les agregan un compuesto con azufre (un mercaptano) de olor fuerte y desagradable.',
   q:'¿Cuál es la razón principal para agregar ese compuesto?',o:['Permite detectar una fuga por el olfato, antes de que el gas acumulado sea un riesgo de explosión','Hace que el gas arda con una llama más azul y caliente','Evita que el gas se licue cuando está dentro del cilindro','Le da un olor distinto a cada marca para que el cliente la reconozca']},
  {a:'nom',c:'uso',k:'Q',ctx:'Los cicloalcanos (anillos saturados de carbono) cumplen la fórmula general CₙH₂ₙ, a diferencia de los alcanos de cadena abierta (CₙH₂ₙ₊₂).',
   q:'¿Cuál es la fórmula molecular del ciclopentano?',o:['C₅H₁₀','C₅H₁₂','C₅H₈','C₄H₁₀']},
  {a:'prop',c:'exp',k:'Q',ctx:'A temperatura ambiente, el metano es un gas, el hexano es un líquido y la parafina (una mezcla de alcanos de cadena muy larga) es un sólido blando.',
   q:'¿Qué explica esta diferencia de estado físico entre alcanos?',o:['A mayor longitud de cadena, mayores son las fuerzas de London entre las moléculas, lo que eleva el punto de fusión y de ebullición','Las cadenas largas tienen enlaces C−C más fuertes que las cortas','Los alcanos de cadena larga tienen carga eléctrica y se atraen entre sí','Las moléculas pequeñas pesan más que las grandes y por eso son gases']},
  {a:'prop',c:'uso',k:'CTS',ctx:'La vaselina que se usa en cosmética y primeros auxilios es una mezcla de alcanos sólidos de cadena larga (20 a 40 carbonos), obtenidos del petróleo.',
   q:'¿Por qué los alcanos son tan poco reactivos frente a la piel y otras sustancias?',o:['Porque sus enlaces C−C y C−H son poco polares y muy estables, así que no reaccionan con facilidad','Porque los alcanos son ácidos débiles que no afectan la piel','Porque los alcanos tienen dobles enlaces que los hacen inertes','Porque los alcanos se disuelven muy bien en agua y no quedan sobre la piel']},
  {a:'prop',c:'ind',k:'Q',ctx:'El butano (CH₃−CH₂−CH₂−CH₃) hierve a −1 °C y el 2-metilpropano (CH₃−CH(CH₃)−CH₃), su isómero, hierve a −12 °C. Ambos tienen la fórmula molecular C₄H₁₀.',
   q:'¿Qué conclusión es coherente con estos datos?',o:['El isómero más ramificado hierve a menor temperatura, por su menor superficie de contacto','El isómero ramificado siempre hierve a mayor temperatura','La fórmula molecular, y no la forma de la molécula, determina el punto de ebullición','Los dos deberían hervir exactamente a la misma temperatura, porque tienen la misma fórmula']},
  {a:'nom',c:'uso',k:'Q',ctx:'El 2,2,3-trimetilbutano es un alcano ramificado: su cadena principal de 4 carbonos (butano) lleva tres grupos metilo.',
   q:'¿Cuál es su fórmula molecular?',o:['C₇H₁₆','C₇H₁₄','C₇H₁₈','C₄H₁₀']},
  {a:'prop',c:'exp',k:'Q',ctx:'El propano de las pipetas se guarda líquido dentro del cilindro, a presión, y se convierte en gas apenas sale por la válvula.',
   q:'¿Por qué el propano puede licuarse con solo aumentar la presión, sin necesidad de enfriarlo mucho?',o:['Porque a temperatura ambiente bastan unas 8 atm para que sus fuerzas de London mantengan las moléculas unidas como líquido','Porque el propano es un compuesto iónico que se compacta con la presión','Porque la presión rompe los enlaces C−H del propano y forma un líquido distinto','Porque el propano reacciona con el aire al comprimirse']},
  {a:'rx',c:'uso',k:'Q',ctx:'Al quemar 1 mol de metano se liberan cerca de 890 kJ; al quemar 1 mol de octano se liberan cerca de 5 470 kJ.',
   q:'¿Qué explica que el octano libere mucha más energía por mol que el metano?',o:['El octano tiene más átomos de C y H por molécula, que al oxidarse forman muchos más enlaces en CO₂ y H₂O','El metano no es realmente un combustible','El octano tiene enlaces iónicos que el metano no tiene','En realidad el metano libera más energía por mol que el octano']},
  {a:'prop',c:'ind',k:'Q',ctx:'Un estudiante quiere comprobar si el gas de una fuga en su cocina es GLP (propano y butano) o metano de la red de gas natural.',
   q:'¿Qué dato sería más útil para decidirlo, sin necesidad de un laboratorio?',o:['Observar si el gas se acumula cerca del piso o sube: el GLP es más denso que el aire y el metano, menos','El olor del gas, porque solo el GLP lleva odorizante','El precio que pagó por el servicio de gas','La temperatura de la cocina en el momento de la fuga']},
  {a:'prop',c:'exp',k:'CTS',ctx:'Las fugas de GLP son peligrosas en espacios cerrados porque el gas, al ser más denso que el aire, tiende a acumularse cerca del piso.',
   q:'¿Qué recomendación de seguridad se deriva directamente de esta propiedad?',o:['Ventilar por la parte baja del espacio y evitar generar chispas cerca del piso si se sospecha una fuga','Abrir únicamente las ventanas más altas del espacio','Guardar siempre el cilindro de gas en un lugar elevado, lejos del piso','Usar el gas solamente en espacios completamente cerrados']},
  {a:'prop',c:'uso',k:'CTS',ctx:'El gas natural que se produce en La Guajira y el piedemonte llanero es principalmente metano, con pequeñas cantidades de etano, propano y butano.',
   q:'Una muestra de gas natural tiene, en moles, 90 % de metano y 10 % de etano. ¿Cuál es su masa molar promedio? (CH₄ = 16 g/mol; C₂H₆ = 30 g/mol)',o:['17,4 g/mol','23,0 g/mol','16,0 g/mol','28,6 g/mol']}
 ],
 alquenos:[
  {a:'nom',g:'alquenos',c:'uso',k:'Q',ctx:'Observa la siguiente estructura:',f:'CH₃−CH=CH−CH₂−CH₃',
   q:'¿Cuál es su nombre IUPAC?',o:['pent-2-eno','pent-3-eno','pentan-2-eno','pent-2-ino']},
  {a:'nom',g:'alquinos',c:'uso',k:'Q',ctx:'El propino es el alquino de tres carbonos.',
   q:'¿Cuál es su fórmula molecular?',o:['C₃H₄','C₃H₆','C₃H₈','C₃H₂']},
  {a:'rx',g:'alquenos',c:'exp',k:'Q',ctx:'Al hacer reaccionar propeno (CH₂=CH−CH₃) con HBr se obtiene principalmente 2-bromopropano y muy poco 1-bromopropano.',
   q:'¿Qué explica este resultado?',o:['Se forma de preferencia el carbocatión secundario, más estable que el primario, y el bromuro se une a ese carbono','El bromo siempre se une al carbono 1 porque es el extremo de la cadena','El HBr rompe el enlace sencillo C2−C3 y no el doble enlace','El hidrógeno se une al carbono que tiene menos hidrógenos']},
  {a:'nom',g:'alquenos',c:'uso',k:'CTS',ctx:'Los bananos de Urabá se exportan verdes y maduran en el país de destino en cámaras con eteno (CH₂=CH₂), una hormona vegetal.',
   q:'¿Cuál afirmación sobre la estructura del eteno es correcta?',o:['Sus dos carbonos tienen hibridación sp² y todos sus átomos están en un mismo plano','Sus dos carbonos tienen hibridación sp³ y geometría tetraédrica','Tiene un triple enlace y geometría lineal','Tiene un grupo −OH unido a un carbono sp²']},
  {a:'nom',g:'alquenos',c:'uso',k:'Q',ctx:'Observa la siguiente estructura:',f:'CH₂=CH−CH(CH₃)−CH₃',
   q:'¿Cuál es su nombre IUPAC?',o:['3-metilbut-1-eno','2-metilbut-3-eno','3-metilbut-2-eno','2-metilbutano']},
  {a:'rx',g:'alquenos',c:'ind',k:'Q',ctx:'Para diferenciar hexano de hex-1-eno, una estudiante agrega unas gotas de agua de bromo (de color naranja) a cada muestra, a temperatura ambiente y sin luz intensa.',
   q:'¿Qué resultado permite identificar el alqueno?',o:['El tubo con hex-1-eno pierde el color naranja porque el Br₂ se adiciona al doble enlace','El tubo con hexano pierde el color porque los alcanos reaccionan rápido con Br₂ sin luz','Ambos tubos pierden el color por igual, así que la prueba no sirve','El tubo con hex-1-eno se vuelve azul porque se forma un ácido']},
  {a:'rx',g:'alquenos',c:'exp',k:'Q',ctx:'El eteno (CH₂=CH₂) reacciona con facilidad con Br₂ por adición, mientras que el etano (CH₃−CH₃) no da reacciones de adición.',
   q:'¿Qué explica esta diferencia?',o:['El enlace π del doble enlace es más débil y sus electrones están más expuestos a los electrófilos','El etano tiene más hidrógenos que pueden salir de la molécula','El eteno tiene más carbonos que el etano','El enlace σ del etano se rompe más fácilmente que el enlace π']},
  {a:'nom',g:'ambos',c:'uso',k:'Q',ctx:'En el compuesto CH₂=CH−CH₂−C≡CH, numerando desde cualquiera de los dos extremos, los enlaces múltiples quedan en las posiciones 1 y 4.',
   q:'Según la IUPAC, ¿cuál es su nombre?',o:['pent-1-en-4-ino','pent-4-en-1-ino','pent-1-in-4-eno','penta-1,4-dieno']},
  {a:'nom',g:'alquinos',c:'uso',k:'Q',ctx:'Observa la siguiente estructura:',f:'CH₃−C≡C−CH₂−CH₃',
   q:'¿Cuál es su nombre IUPAC?',o:['pent-2-ino','pent-3-ino','pent-2-eno','but-2-ino']},
  {a:'rx',g:'alquinos',c:'uso',k:'CTS',ctx:'La soldadura autógena usa una llama de acetileno (etino, CH≡CH) y oxígeno, que alcanza hasta 3 100 °C, mucho más que la llama del gas propano.',
   q:'¿Qué ayuda a explicar que su llama con oxígeno sea tan caliente?',o:['El acetileno es una molécula de alta energía: su formación absorbe energía, que se libera al quemarse','El acetileno ya contiene oxígeno en su propia molécula','El acetileno es un compuesto iónico con mucha energía de red','El acetileno tiene más átomos de carbono que el propano']},
  {a:'nom',g:'alquenos',c:'uso',k:'Q',ctx:'El buta-1,3-dieno es la materia prima para fabricar caucho sintético, como el de las llantas.',
   q:'¿Cuál es su fórmula estructural?',o:['CH₂=CH−CH=CH₂','CH₂=CH−CH₂−CH₃','CH≡C−CH₂−CH₃','CH₃−CH=CH−CH₃']},
  {a:'nom',g:'alquenos',c:'uso',k:'CTS',ctx:'El caucho natural, que se extrae de árboles cultivados también en el Caquetá y el Meta, es un polímero del isopreno (2-metilbuta-1,3-dieno).',
   q:'¿Cuántos dobles enlaces tiene cada unidad de isopreno antes de polimerizarse?',o:['Dos','Uno','Tres','Ninguno, porque el isopreno es un alcano']},
  {a:'rx',g:'alquenos',c:'uso',k:'Q',ctx:'Para producir margarina a partir de aceites vegetales líquidos, la industria hace pasar H₂ gaseoso por el aceite caliente, con un catalizador de níquel.',
   q:'¿Qué cambio estructural ocurre en los ácidos grasos del aceite durante este proceso?',o:['Los dobles enlaces C=C se convierten en enlaces sencillos C−C, por adición de hidrógeno','Los dobles enlaces se transforman en triples enlaces','Se forman nuevos anillos aromáticos en la cadena','Los ácidos grasos pierden átomos de carbono']},
  {a:'rx',g:'alquenos',c:'exp',k:'Q',ctx:'El 2-metilpropeno (CH₂=C(CH₃)−CH₃) reacciona con HCl y forma mayoritariamente 2-cloro-2-metilpropano, y muy poco 1-cloro-2-metilpropano.',
   q:'¿Qué explica que ese sea el producto principal?',o:['El H⁺ se adiciona al carbono con más hidrógenos, y el Cl⁻ se une al carbono que forma el carbocatión más estable (terciario)','El Cl⁻ siempre se une al carbono que tiene más hidrógenos','El doble enlace no participa en esta reacción','El producto depende solo de la temperatura, no de la estructura del alqueno']},
  {a:'nom',g:'alquinos',c:'uso',k:'Q',ctx:'En el etino (acetileno), cada carbono del triple enlace tiene hibridación sp y está unido a otros dos átomos.',
   q:'¿Qué geometría tienen esos carbonos?',o:['Lineal, con ángulos de 180°','Tetraédrica, con ángulos de 109,5°','Trigonal plana, con ángulos de 120°','Piramidal, con ángulos de 107°']},
  {a:'nom',g:'alquenos',c:'uso',k:'Q',ctx:'Observa la siguiente estructura:',f:'CH₂=C(CH₃)−CH₂−CH₃',
   q:'¿Cuál es su nombre IUPAC?',o:['2-metilbut-1-eno','3-metilbut-1-eno','2-metilbut-2-eno','1-metilbut-1-eno']},
  {a:'nom',g:'alquenos',c:'uso',k:'CTS',ctx:'El polipropileno, usado en empaques de alimentos y tapas de botellas, se fabrica uniendo muchas moléculas de propeno.',
   q:'¿Cuál es la fórmula molecular del propeno, el monómero de este plástico?',o:['C₃H₆','C₃H₈','C₃H₄','C₂H₄']},
  {a:'rx',g:'ambos',c:'ind',k:'Q',ctx:'Un alqueno y un alquino, cada uno con un solo enlace múltiple y la misma cantidad de carbonos, reaccionan por separado con agua de bromo (Br₂) en exceso.',
   q:'¿Qué diferencia debería observarse entre los dos?',o:['El alquino consume el doble de Br₂ por mol que el alqueno, porque tiene dos enlaces π que pueden reaccionar con el Br₂','Los dos consumen la misma cantidad de Br₂, porque cada uno tiene un solo enlace múltiple','El alqueno consume más Br₂ que el alquino','Ninguno de los dos reacciona con Br₂ si no hay luz ultravioleta']},
  {a:'nom',g:'alquenos',c:'uso',k:'Q',ctx:'Observa la siguiente estructura:',f:'CH₃−CH=CH−CH=CH−CH₃',
   q:'¿Cuál es su nombre IUPAC?',o:['hexa-2,4-dieno','hexa-1,3-dieno','hexa-2,4-dino','hexa-3,5-dieno']},
  {a:'rx',g:'alquenos',c:'uso',k:'CTS',ctx:'El eteno no solo se usa para madurar frutas: también es la materia prima más consumida por la industria petroquímica para fabricar plásticos.',
   q:'¿Qué polímero de uso masivo (bolsas, envases) se obtiene al unir muchas moléculas de eteno?',o:['Polietileno','Poliestireno','PVC (policloruro de vinilo)','Nailon']}
 ],
 aromaticos:[
  {a:'nom',c:'uso',k:'CTS',ctx:'El xileno, usado como solvente en laboratorios, es una mezcla de dimetilbencenos.',
   q:'¿Qué nombre IUPAC corresponde al isómero en el que los dos metilos están en carbonos vecinos del anillo?',o:['1,2-dimetilbenceno','1,3-dimetilbenceno','1,4-dimetilbenceno','2,3-dimetilbenceno']},
  {a:'rx',c:'exp',k:'Q',ctx:'En la fórmula de Kekulé el benceno se dibuja con tres dobles enlaces; sin embargo, no reacciona como un alqueno.',
   q:'¿Por qué el benceno da sustitución electrofílica y no adición?',o:['Porque sus 6 electrones π están deslocalizados en el anillo y la sustitución conserva esa estabilidad','Porque el benceno no tiene electrones π','Porque los carbonos del benceno tienen hibridación sp³','Porque la adición rompería enlaces C−H, que son los más fuertes de la molécula']},
  {a:'nom',c:'uso',k:'Q',ctx:'Observa la siguiente estructura:',f:'C₆H₅−NO₂',
   q:'¿Cuál es su nombre?',o:['nitrobenceno','benzonitrilo','nitrociclohexano','anilina']},
  {a:'prop',c:'uso',k:'CTS',ctx:'Un taller de pintura usa tíner, que puede contener tolueno. Las normas de salud ocupacional limitan estrictamente el benceno en los solventes.',
   q:'¿Cuál es la razón principal de esa restricción?',o:['El benceno es cancerígeno (se asocia con leucemia) y es volátil, por lo que se inhala con facilidad','El benceno no se evapora y se acumula en la ropa de los trabajadores','El benceno es un ácido fuerte que quema la piel','El benceno reacciona con el aire del taller y produce ozono']},
  {a:'nom',c:'uso',k:'Q',ctx:'Observa la siguiente estructura:',f:'C₆H₅−Cl',
   q:'¿Cuál es su nombre?',o:['clorobenceno','clorociclohexano','clorofenol','1-clorohex-1-eno']},
  {a:'rx',c:'ind',k:'Q',ctx:'Un libro de texto reporta un experimento para comprobar la hipótesis «el benceno no se comporta como un alqueno» (el benceno es cancerígeno y no se usa en el colegio): se agrega agua de bromo, sin catalizador, a un tubo con ciclohexeno y a otro con benceno, y se observa la mezcla completa.',
   q:'¿Qué resultado apoya la hipótesis?',o:['El ciclohexeno decolora el agua de bromo y el benceno no','Ambos decoloran el agua de bromo de inmediato','Solo el benceno decolora el agua de bromo','Ninguno reacciona, porque los dos son compuestos cíclicos']},
  {a:'nom',c:'uso',k:'CTS',ctx:'El 1,4-diclorobenceno se usa en algunas bolas antipolillas.',
   q:'En la nomenclatura tradicional, ¿qué posición relativa tienen sus dos cloros?',o:['para','orto','meta','alfa']},
  {a:'rx',c:'exp',k:'Q',ctx:'La nitración del benceno se hace con una mezcla de HNO₃ y H₂SO₄ concentrados.',
   q:'¿Cuál es el papel del H₂SO₄?',o:['Ayuda a formar el ion nitronio (NO₂⁺), que es el electrófilo que ataca el anillo','Aporta el grupo −SO₃H que queda en el producto final','Neutraliza el ácido nítrico para que no reaccione','Rompe el anillo bencénico para que se adicione el grupo NO₂']},
  {a:'nom',c:'uso',k:'Q',ctx:'Observa la siguiente estructura:',f:'C₆H₅−CH₃',
   q:'¿Cuál es su nombre (de uso corriente, aceptado por la IUPAC)?',o:['tolueno','xileno','estireno','fenol']},
  {a:'nom',c:'uso',k:'CTS',ctx:'La naftalina que se usa contra las polillas está hecha de naftaleno, un hidrocarburo aromático formado por dos anillos bencénicos fusionados (C₁₀H₈).',
   q:'¿Qué tienen en común el naftaleno y el benceno?',o:['Ambos tienen anillos con electrones π deslocalizados, que les dan una estabilidad extra','Ambos son alcanos saturados sin ningún doble enlace','Ambos tienen un solo átomo de carbono en su molécula','Ninguno de los dos tiene carbonos con hibridación sp²']},
  {a:'rx',c:'exp',k:'Q',ctx:'Para bromar el benceno (sustituir un H por Br) se necesita Br₂ junto con un catalizador como FeBr₃; sin el catalizador, la reacción prácticamente no ocurre.',
   q:'¿Cuál es la función del FeBr₃ en esta reacción?',o:['Ayuda a polarizar el Br₂ y a generar un electrófilo lo bastante fuerte para atacar el anillo aromático','Se incorpora al producto final, sustituyendo un hidrógeno del anillo','Reduce el benceno a ciclohexano antes de que ocurra la reacción','Rompe el anillo aromático antes de que el bromo se una']},
  {a:'nom',c:'uso',k:'CTS',ctx:'El icopor (poliestireno expandido), usado en empaques y vasos desechables, se fabrica a partir del estireno (feniletileno).',
   q:'¿Cuál es la fórmula estructural del estireno?',o:['C₆H₅−CH=CH₂','C₆H₅−CH₂−CH₃','C₆H₅−CH₃','C₆H₅−C≡CH']},
  {a:'nom',c:'uso',k:'CTS',ctx:'La aspirina (ácido acetilsalicílico) tiene un anillo aromático con dos grupos unidos a carbonos vecinos del anillo: uno éster y uno ácido carboxílico.',
   q:'¿Qué posición relativa (nomenclatura tradicional) tienen dos sustituyentes en carbonos vecinos de un anillo aromático?',o:['orto','meta','para','alfa']},
  {a:'nom',c:'exp',k:'Q',ctx:'El benceno se dibuja con tres dobles enlaces «alternados» (fórmula de Kekulé), pero en la molécula real los 6 enlaces C−C miden exactamente lo mismo, un valor intermedio entre un enlace sencillo y uno doble.',
   q:'¿Qué evidencia da este dato sobre la estructura real del benceno?',o:['Los electrones π no están fijos en enlaces dobles alternados, sino deslocalizados por igual en todo el anillo','El benceno tiene en realidad seis enlaces sencillos, sin ningún doble enlace','El benceno cambia de estructura cada cierto tiempo, alternando entre dos formas distintas','Los seis carbonos del benceno no están todos en el mismo plano']},
  {a:'rx',c:'ind',k:'Q',ctx:'Un libro de texto reporta que, para distinguir el ciclohexeno del benceno, se agrega KMnO₄ diluido y frío (de color violeta) a cada uno, a la misma temperatura.',
   q:'¿Qué resultado es coherente con el comportamiento esperado de cada compuesto?',o:['El ciclohexeno decolora el KMnO₄ porque su doble enlace se oxida; el benceno no reacciona en esas condiciones','El benceno decolora el KMnO₄ porque tiene tres dobles enlaces; el ciclohexeno, no','Ambos decoloran el KMnO₄ con la misma rapidez, porque los dos tienen enlaces C=C','Ninguno reacciona, porque los dos son hidrocarburos y no se oxidan']},
  {a:'nom',c:'uso',k:'Q',ctx:'El 1,3-diclorobenceno y el 1,4-diclorobenceno son dos de los tres isómeros posibles del diclorobenceno (el anillo numerado del 1 al 6).',
   q:'¿Cuál es el nombre IUPAC correcto del tercer isómero?',o:['1,2-diclorobenceno','1,5-diclorobenceno','2,3-diclorobenceno','1,6-diclorobenceno']},
  {a:'rx',c:'exp',k:'Q',ctx:'La hidrogenación del benceno a ciclohexano libera menos energía de la que se esperaría si el benceno tuviera tres dobles enlaces aislados, sin deslocalizar.',
   q:'¿Qué explica esta diferencia de energía?',o:['La deslocalización de los electrones π hace al benceno más estable de lo esperado, así que libera menos energía al hidrogenarse','El benceno no reacciona con H₂ y la energía medida corresponde a otra reacción','El ciclohexano formado es menos estable que el benceno y absorbe la energía','La hidrogenación del benceno es explosiva y la energía se pierde como sonido']},
  {a:'nom',c:'uso',k:'CTS',ctx:'En el siglo XIX, el cirujano Joseph Lister empezó a usar fenol (C₆H₅−OH) para desinfectar instrumentos y heridas, lo que redujo mucho las infecciones postoperatorias.',
   q:'¿En qué se diferencia estructuralmente el fenol del benceno?',o:['El fenol tiene un grupo −OH unido directamente al anillo aromático','El fenol no tiene ningún anillo aromático','El fenol tiene un átomo de nitrógeno dentro del anillo','El fenol tiene dos anillos aromáticos fusionados']},
  {a:'nom',c:'uso',k:'Q',ctx:'Observa la siguiente estructura:',f:'C₆H₅−NH₂',
   q:'¿Cuál es su nombre?',o:['anilina','nitrobenceno','fenol','benzonitrilo']},
  {a:'prop',c:'uso',k:'CTS',ctx:'La gasolina contiene una pequeña proporción de hidrocarburos aromáticos (benceno, tolueno, etilbenceno, xilenos) que mejoran el índice de octano, pero la normativa limita estrictamente el porcentaje de benceno permitido.',
   q:'¿Por qué se limita en particular el benceno y no tanto sus derivados metilados (tolueno, xilenos)?',o:['Porque el benceno es cancerígeno comprobado, mientras que sus derivados metilados son considerablemente menos tóxicos','Porque el benceno es el único de ellos que mejora el índice de octano','Porque el benceno es el único de ellos que es aromático','Porque el benceno es más costoso de producir que los demás']}
 ],
 haluros:[
  {a:'nom',c:'uso',k:'Q',ctx:'Observa la siguiente estructura:',f:'CH₃−CHCl−CH₃',
   q:'¿Cuál es su nombre IUPAC?',o:['2-cloropropano','1-cloropropano','2-clorobutano','propan-2-cloro']},
  {a:'nom',c:'uso',k:'Q',ctx:'Observa la siguiente estructura:',f:'CH₃−CH(Br)−CH₂−CH₃',
   q:'¿Cuál es su nombre IUPAC?',o:['2-bromobutano','3-bromobutano','1-bromo-1-metilpropano','2-bromopropano']},
  {a:'nom',c:'uso',k:'CTS',ctx:'El halotano, un anestésico inhalado, tiene la fórmula CF₃−CHBrCl.',f:[{s:'F',h:0},{h:0,bu:X('F'),bd:X('F')},{h:1,bu:X('Br'),bd:X('Cl')}],t:'CF₃−CHBrCl',
   q:'¿Cuál es su nombre IUPAC?',o:['2-bromo-2-cloro-1,1,1-trifluoroetano','1,1,1-trifluoro-2-bromo-2-cloroetano','2-cloro-2-bromo-1,1,1-trifluoroetano','1-bromo-1-cloro-2,2,2-trifluoroetano']},
  {a:'prop',c:'exp',k:'CTS',ctx:'Los CFC, como el CCl₂F₂, se usaron durante décadas en neveras y aerosoles. El Protocolo de Montreal acordó eliminarlos.',
   q:'¿Por qué se eliminaron?',o:['Porque la radiación UV los rompe en la estratosfera y libera cloro que destruye el ozono','Porque son muy inflamables y causaban incendios en las neveras','Porque se disuelven en la lluvia y forman ácido clorhídrico que acidifica los ríos','Porque al usarse en aerosoles producen monóxido de carbono']},
  {a:'rx',c:'exp',k:'Q',ctx:'Al calentar bromoetano con una solución acuosa diluida de NaOH se obtiene etanol y bromuro de sodio.',
   q:'¿Cómo se clasifica esta reacción?',o:['Sustitución nucleofílica: el OH⁻ reemplaza al bromo, que sale como Br⁻','Adición electrofílica: el OH⁻ se suma a un doble enlace','Eliminación: se forman eteno y agua','Combustión: el bromoetano se oxida a CO₂']},
  {a:'rx',c:'exp',k:'Q',ctx:'El 2-bromopropano se calienta con KOH disuelto en etanol (una base fuerte, sin agua).',
   q:'¿Cuál es el producto orgánico principal?',o:['propeno, por eliminación de HBr','propan-2-ol, por sustitución','propano, por reducción','2,2-dibromopropano, por adición']},
  {a:'nom',c:'uso',k:'Q',ctx:'Los haluros de alquilo se clasifican según cuántos carbonos están unidos al carbono que lleva el halógeno.',
   q:'¿Cuál de los siguientes es un haluro de alquilo terciario?',o:['2-bromo-2-metilpropano','1-bromobutano','2-bromobutano','bromometano']},
  {a:'rx',c:'ind',k:'Q',ctx:'Un grupo compara la rapidez con que reaccionan 1-clorobutano, 1-bromobutano y 1-yodobutano con el mismo nucleófilo, a la misma temperatura y concentración. Obtiene: yodo > bromo > cloro.',
   q:'¿Qué variable explica mejor la diferencia?',o:['La facilidad del halógeno para salir como ion: los halógenos más grandes son mejores grupos salientes','El número de carbonos de la cadena, que cambia en cada compuesto','La electronegatividad: el halógeno más electronegativo sale más rápido','La temperatura, que fue distinta en cada ensayo']},
  {a:'nom',c:'uso',k:'Q',ctx:'El 1-cloropropano y el 2-cloropropano son dos compuestos distintos, aunque los dos tienen la fórmula molecular C₃H₇Cl.',
   q:'¿En qué se diferencian estructuralmente?',o:['En la posición del cloro dentro de la cadena: en uno está en un carbono del extremo y en el otro, en el carbono del medio','En el número de átomos de carbono que tiene la cadena de cada uno','En el número de átomos de cloro que tiene cada una de las moléculas','En que uno es un alcano y el otro, un alqueno con un doble enlace']},
  {a:'prop',c:'exp',k:'CTS',ctx:'El DDT, un insecticida muy usado hasta los años 70 y hoy prohibido en la mayoría de países, tiene varios enlaces C−Cl y es muy poco soluble en agua.',
   q:'¿Por qué el DDT persiste tanto tiempo en el ambiente y se acumula en los tejidos grasos de los animales?',o:['Porque sus enlaces C−Cl son poco reactivos y, al ser insoluble en agua, se acumula en las grasas','Porque el DDT reacciona rápidamente con el agua de lluvia','Porque el DDT se evapora por completo poco después de aplicarse','Porque el cloro del DDT es radiactivo']},
  {a:'rx',c:'exp',k:'Q',ctx:'El 2-bromo-2-metilpropano (terciario) reacciona con agua y forma el alcohol correspondiente mucho más rápido que el 1-bromobutano (primario), en las mismas condiciones.',
   q:'¿Qué explica esta diferencia de rapidez?',o:['El haluro terciario forma primero un carbocatión relativamente estable (mecanismo SN1); el primario no forma carbocationes estables con facilidad','El haluro primario tiene más átomos de carbono que el terciario y por eso es más lento','El bromo del haluro terciario es más electronegativo que el bromo del haluro primario','El haluro terciario tiene menos hidrógenos y por eso reacciona más rápido']},
  {a:'nom',c:'uso',k:'CTS',ctx:'El PVC (policloruro de vinilo), usado en tuberías, se fabrica polimerizando cloruro de vinilo, CH₂=CH−Cl.',
   q:'¿Cuál es el nombre IUPAC de este monómero?',o:['cloroeteno','cloroetano','1,1-dicloroeteno','cloroetino']},
  {a:'prop',c:'exp',k:'CTS',ctx:'El teflón, usado para recubrir sartenes antiadherentes, es politetrafluoroetileno, un polímero formado por unidades de tetrafluoroeteno (CF₂=CF₂).',
   q:'¿Por qué los enlaces C−F hacen que el teflón resista tanto el calor y evite reaccionar con otras sustancias?',o:['El enlace C−F es uno de los enlaces sencillos más fuertes y estables que puede formar el carbono','El flúor es poco electronegativo y por eso el enlace C−F es apolar','El enlace C−F se rompe con mucha facilidad y libera energía constantemente','El teflón es un compuesto iónico, sin enlaces covalentes']},
  {a:'rx',c:'ind',k:'Q',ctx:'Para comparar la rapidez de distintos haluros de alquilo, un grupo agrega nitrato de plata (AgNO₃) en etanol a tubos con 2-cloro-2-metilpropano, 1-clorobutano y clorobenceno, y mide cuánto tardan en formar un precipitado blanco de AgCl.',
   q:'Si el mecanismo SN1 es más rápido en haluros terciarios, ¿qué resultado se espera?',o:['El tubo con 2-cloro-2-metilpropano forma el precipitado primero','El tubo con clorobenceno forma el precipitado primero','El tubo con 1-clorobutano forma el precipitado primero','Los tres tubos forman el precipitado al mismo tiempo']},
  {a:'nom',c:'uso',k:'Q',ctx:'Observa la siguiente estructura:',f:'CH₂Cl−CH₂−CH₂−CH₂Cl',
   q:'¿Cuál es su nombre IUPAC?',o:['1,4-diclorobutano','1,3-diclorobutano','2,4-diclorobutano','1,4-dicloropentano']},
  {a:'prop',c:'exp',k:'CTS',ctx:'Los refrigerantes modernos (HFC, como el R-134a) reemplazaron a los CFC en neveras y aires acondicionados. Los HFC tienen flúor e hidrógeno, pero no cloro.',
   q:'¿Por qué eliminar el cloro de la molécula reduce el daño a la capa de ozono?',o:['Porque los enlaces C−F casi no se rompen con la radiación UV; es el cloro liberado de los C−Cl el que destruye el ozono en cadena','Porque sin cloro los HFC dejan de ser gases y no llegan a la atmósfera','Porque el flúor repara el ozono que ya se ha destruido','Porque los HFC sin cloro ya no contienen carbono']},
  {a:'nom',c:'uso',k:'Q',ctx:'Observa la siguiente estructura:',f:'CH₂Br−CH₂−CHCl−CH₃',
   q:'¿Cuál es su nombre IUPAC?',o:['1-bromo-3-clorobutano','3-bromo-1-clorobutano','1-cloro-3-bromobutano','1,3-bromoclorobutano']},
  {a:'prop',c:'exp',k:'Q',ctx:'El enlace C−Cl es polar, pero el 1-clorobutano es prácticamente insoluble en agua, casi igual que el butano.',
   q:'¿Qué explica esta baja solubilidad?',o:['La mayor parte de la molécula es una cadena de carbono apolar, que domina sobre la polaridad del único enlace C−Cl','El cloro repele las moléculas de agua por tener una carga negativa permanente','El 1-clorobutano reacciona con el agua antes de poder disolverse en ella','Los haluros de alquilo siempre son solubles en agua; este sería un caso excepcional']},
  {a:'nom',c:'uso',k:'CTS',ctx:'Antes de los anestésicos modernos como el halotano, el cloroformo (triclorometano) se usó durante casi un siglo como anestésico inhalado, hasta que se comprobó que dañaba el hígado y el corazón.',
   q:'¿Cuál es la fórmula molecular del cloroformo?',o:['CHCl₃','CCl₄','CH₂Cl₂','CH₃Cl']},
  {a:'nom',c:'uso',k:'Q',ctx:'Un haluro de alquilo se clasifica como primario, secundario o terciario según cuántos carbonos están unidos al carbono que lleva el halógeno.',
   q:'¿Cómo se clasifica el 2-bromobutano?',o:['Secundario, porque el carbono con el bromo está unido a otros dos carbonos','Primario, porque el carbono con el bromo está unido a un solo carbono','Terciario, porque el carbono con el bromo está unido a tres carbonos','No se puede clasificar sin ver la estructura completa']}
 ],
 alcoholes:[
  {a:'nom',g:'alcoholes',c:'uso',k:'Q',ctx:'Observa la siguiente estructura:',f:'CH₃−CH(OH)−CH₃',
   q:'¿Cuál es su nombre IUPAC?',o:['propan-2-ol','propan-1-ol','2-hidroxipropano','metoxietano']},
  {a:'nom',g:'alcoholes',c:'uso',k:'Q',ctx:'Observa la siguiente estructura:',f:'CH₃−CH(OH)−CH₂−CH(CH₃)−CH₃',
   q:'¿Cuál es su nombre IUPAC?',o:['4-metilpentan-2-ol','2-metilpentan-4-ol','4-metilpentan-2-ona','2-hidroxi-4-metilpentano']},
  {a:'prop',g:'ambos',c:'exp',k:'Q',ctx:'El etanol (CH₃−CH₂−OH) y el metoximetano (CH₃−O−CH₃) tienen la misma fórmula molecular, C₂H₆O. El etanol hierve a 78 °C y el metoximetano a −24 °C.',
   q:'¿Qué explica la diferencia?',o:['Las moléculas de etanol forman puentes de hidrógeno entre sí gracias al −OH; las del éter no','El etanol tiene mayor masa molar que el metoximetano','El metoximetano tiene enlaces iónicos que se rompen con facilidad','El etanol tiene más átomos de oxígeno que el metoximetano']},
  {a:'rx',g:'alcoholes',c:'exp',k:'CTS',ctx:'En Colombia se han presentado intoxicaciones por licor adulterado con metanol, que se parece mucho al etanol.',
   q:'¿Por qué el metanol es tan peligroso?',o:['El cuerpo lo oxida a metanal y ácido metanoico, que son tóxicos y pueden causar ceguera','El metanol es una base fuerte que quema el estómago','El metanol no se absorbe y se acumula en los pulmones','El metanol se acumula en la sangre sin transformarse y la vuelve ácida de inmediato']},
  {a:'rx',g:'alcoholes',c:'uso',k:'CTS',ctx:'En Colombia la gasolina se mezcla con etanol obtenido de la caña de azúcar.',
   q:'¿Cuál es la ecuación balanceada de la combustión completa del etanol?',o:['C₂H₅OH + 3 O₂ → 2 CO₂ + 3 H₂O','C₂H₅OH + 2 O₂ → 2 CO₂ + 3 H₂O','C₂H₅OH + 3 O₂ → 2 CO + 3 H₂O','C₂H₅OH + O₂ → CH₃COOH + H₂O']},
  {a:'nom',g:'alcoholes',c:'uso',k:'Q',ctx:'Alcoholes y fenoles tienen el grupo −OH, pero unido a átomos de carbono diferentes.',
   q:'¿Cuál de las siguientes sustancias es un fenol y no un alcohol?',o:['C₆H₅−OH, porque el −OH está unido directamente al anillo aromático','C₆H₅−CH₂−OH, porque tiene un anillo aromático','C₆H₁₁−OH (ciclohexanol), porque el −OH está en un anillo','CH₃−OH, porque es el alcohol más simple']},
  {a:'nom',g:'eteres',c:'uso',k:'Q',ctx:'Observa la siguiente estructura:',f:'CH₃−CH₂−O−CH₃',
   q:'¿Cuál es su nombre IUPAC?',o:['metoxietano','etoxietano','propan-1-ol','metoxipropano']},
  {a:'rx',g:'alcoholes',c:'ind',k:'Q',ctx:'Un grupo agrega dicromato de potasio acidificado (color naranja) a tres tubos con butan-1-ol, butan-2-ol y 2-metilpropan-2-ol. Solo en dos tubos la solución se vuelve verde.',
   q:'¿En qué tubo NO hay cambio y por qué?',o:['En el de 2-metilpropan-2-ol, porque es un alcohol terciario y su carbono con −OH no tiene hidrógenos','En el de butan-1-ol, porque los alcoholes primarios no se oxidan','En el de butan-2-ol, porque los alcoholes secundarios solo reaccionan con luz','En ninguno: los tres deberían cambiar de color']},
  {a:'nom',g:'alcoholes',c:'uso',k:'CTS',ctx:'El anticongelante de los radiadores contiene etano-1,2-diol (etilenglicol), un alcohol con dos grupos −OH.',
   q:'¿Cuál es su fórmula estructural?',o:['HO−CH₂−CH₂−OH','HO−CH₂−CH₃','CH₃−CH(OH)−CH₃','HO−CH₂−CH(OH)−CH₂−OH']},
  {a:'nom',g:'alcoholes',c:'uso',k:'CTS',ctx:'La glicerina (propano-1,2,3-triol), que forma parte de las grasas (combinada en los triglicéridos), se usa en cosméticos, jarabes y jabones por su capacidad de retener agua.',
   q:'¿Cuántos grupos −OH tiene la glicerina?',o:['Tres','Uno','Dos','Ninguno: es un éter']},
  {a:'nom',g:'alcoholes',c:'uso',k:'Q',ctx:'Un alcohol se clasifica como primario, secundario o terciario según cuántos carbonos están unidos al carbono que lleva el −OH.',
   q:'¿Cómo se clasifica el 2-metilpropan-2-ol, (CH₃)₃C−OH?',o:['Terciario, porque el carbono con el −OH está unido a otros tres carbonos','Primario, porque el carbono con el −OH está unido a un solo carbono','Secundario, porque el carbono con el −OH está unido a dos carbonos','No se puede clasificar sin verlo dibujado']},
  {a:'prop',g:'alcoholes',c:'uso',k:'CTS',ctx:'Una botella de aguardiente antioqueño indica «29 °GL», es decir, 29 % de etanol en volumen; una cerveza típica tiene entre 4 °GL y 5 °GL.',
   q:'¿Qué significa, en términos químicos, que una bebida tenga un grado GL más alto?',o:['Que un mayor porcentaje del volumen de la bebida es etanol puro','Que la bebida tiene más azúcar sin fermentar','Que la bebida tiene más agua que etanol','Que la bebida se fermentó a una temperatura mayor']},
  {a:'prop',g:'alcoholes',c:'exp',k:'Q',ctx:'El metanol, el etanol y el propan-1-ol se mezclan con agua en cualquier proporción, pero el octan-1-ol forma dos capas separadas al mezclarse con agua.',
   q:'¿Qué explica que el octan-1-ol sea mucho menos soluble en agua que los alcoholes más pequeños?',o:['Su cadena de carbono, larga y apolar, pesa más en la molécula que el único grupo −OH polar','El octan-1-ol no tiene grupo −OH','El octan-1-ol es un ácido y no un alcohol','El agua reacciona con el octan-1-ol y forma un gas']},
  {a:'nom',g:'eteres',c:'uso',k:'CTS',ctx:'El éter dietílico (CH₃−CH₂−O−CH₂−CH₃) se usó como uno de los primeros anestésicos generales inhalados, antes del halotano.',
   q:'¿Cuál es su nombre IUPAC?',o:['etoxietano','dietoxietano','metoxietano','etanoato de etilo']},
  {a:'prop',g:'alcoholes',c:'exp',k:'CTS',ctx:'El gel antibacterial para manos contiene alcohol (etanol o isopropanol) en alta concentración, que se evapora con rapidez después de aplicarlo.',
   q:'¿Qué propiedad del alcohol explica esa evaporación rápida, comparada con el agua pura?',o:['Sus moléculas se atraen entre sí con menos fuerza que las del agua, por lo que escapan al aire con más facilidad','El alcohol hierve a una temperatura mucho mayor que el agua, por eso se calienta antes','El alcohol no forma puentes de hidrógeno, porque no tiene átomos de oxígeno','El agua se evapora siempre más rápido que cualquier alcohol a la misma temperatura']},
  {a:'nom',g:'alcoholes',c:'uso',k:'Q',ctx:'Observa la siguiente estructura:',f:'CH₃−CH₂−CH(OH)−CH₂−CH₃',
   q:'¿Cuál es su nombre IUPAC?',o:['pentan-3-ol','pentan-2-ol','pentan-1-ol','3-hidroxipentano']},
  {a:'rx',g:'alcoholes',c:'exp',k:'CTS',ctx:'En Colombia la gasolina se mezcla con etanol como oxigenante, lo que ayuda a una combustión más completa y reduce las emisiones de monóxido de carbono.',
   q:'¿Por qué agregar un compuesto con oxígeno al combustible ayuda a reducir el CO emitido?',o:['Porque aporta oxígeno a la combustión y el carbono se oxida hasta CO₂ en vez de quedar como CO','Porque el etanol enfría el motor y eso evita que se forme CO','Porque el etanol no se quema y simplemente diluye los gases de escape','Porque el etanol reacciona con el CO después de la combustión y lo elimina']},
  {a:'prop',g:'ambos',c:'exp',k:'Q',ctx:'El propano (M=44 g/mol), el metoxietano (un éter, M=60 g/mol) y el propan-1-ol (M=60 g/mol) hierven a −42 °C, 7 °C y 97 °C, respectivamente.',
   q:'¿Qué explica que el propan-1-ol hierva a una temperatura mucho mayor que el éter, de masa molar parecida?',o:['El propan-1-ol forma puentes de hidrógeno entre sus moléculas gracias al −OH; el éter no puede formarlos entre las suyas','El propan-1-ol tiene mayor masa molar que el éter','El éter tiene un enlace más fuerte que el del alcohol','El éter forma puentes de hidrógeno más débiles que los del alcohol']},
  {a:'nom',g:'alcoholes',c:'uso',k:'Q',ctx:'Observa la siguiente estructura:',f:'CH₃−CH(OH)−CH(CH₃)−CH₃',
   q:'¿Cuál es su nombre IUPAC?',o:['3-metilbutan-2-ol','2-metilbutan-3-ol','3-metilbutan-1-ol','2-metilbutan-2-ol']}
 ],
 carbonilos:[
  {a:'nom',g:'cetonas',c:'uso',k:'Q',ctx:'Observa la siguiente estructura:',f:'CH₃−CO−CH₃',
   q:'¿Cuál es su nombre IUPAC?',o:['propan-2-ona','propanal','propan-2-ol','propan-1-ona']},
  {a:'nom',g:'aldehidos',c:'uso',k:'Q',ctx:'Observa la siguiente estructura:',f:'CH₃−CH₂−CH₂−CHO',
   q:'¿Cuál es su nombre IUPAC?',o:['butanal','butan-1-al','butanona','propanal']},
  {a:'nom',g:'aldehidos',c:'exp',k:'Q',ctx:'En el nombre 3-metilbutanal se indica la posición del metilo, pero no la del grupo −CHO.',
   q:'¿Por qué no se escribe el localizador del −CHO?',o:['Porque en una cadena abierta el carbono del −CHO siempre es el C1','Porque los aldehídos nunca llevan localizadores','Porque el −CHO se nombra como sustituyente y no como sufijo','Porque el metilo tiene prioridad sobre el aldehído']},
  {a:'nom',g:'cetonas',c:'uso',k:'Q',ctx:'Observa la siguiente estructura:',f:'CH₃−CO−CH₂−CH(CH₃)−CH₃',
   q:'¿Cuál es su nombre IUPAC?',o:['4-metilpentan-2-ona','2-metilpentan-4-ona','4-metilpentanal','4-metilpentan-2-ol']},
  {a:'prop',g:'aldehidos',c:'uso',k:'CTS',ctx:'El formol, que se usa para conservar muestras biológicas, es una solución acuosa de metanal.',
   q:'¿Por qué se recomienda manipularlo con ventilación, guantes y gafas?',o:['Porque el metanal es tóxico e irritante y está clasificado como cancerígeno','Porque el metanal es muy inflamable incluso disuelto en agua','Porque el formol es un ácido fuerte que corroe la piel','Porque el metanal es inodoro y no se nota si hay fugas']},
  {a:'rx',g:'ambos',c:'ind',k:'Q',ctx:'Para distinguir propanal de propanona, se calienta suavemente cada uno con reactivo de Tollens (nitrato de plata amoniacal).',
   q:'¿Qué observación identifica al aldehído?',o:['Se forma un espejo de plata en el tubo del propanal','Se forma un espejo de plata en el tubo de la propanona','Ambos tubos forman un precipitado rojo ladrillo','Ninguno cambia, porque los dos tienen grupo carbonilo']},
  {a:'rx',g:'ambos',c:'exp',k:'Q',ctx:'Los aldehídos se oxidan con facilidad a ácidos carboxílicos, mientras que las cetonas resisten la oxidación en condiciones suaves.',
   q:'¿Qué explica esta diferencia?',o:['El carbono del carbonilo del aldehído tiene un hidrógeno unido; el de la cetona está unido a dos carbonos','Las cetonas no tienen grupo carbonilo','Los aldehídos tienen un triple enlace C≡O','Las cetonas son siempre gases y no reaccionan en solución']},
  {a:'nom',g:'cetonas',c:'uso',k:'CTS',ctx:'En personas con diabetes no controlada el aliento puede oler a «quitaesmalte». Ese olor se debe a la propanona que se produce cuando el cuerpo degrada grasas.',
   q:'¿A qué grupo funcional pertenece la propanona?',o:['Cetona','Aldehído','Éster','Alcohol']},
  {a:'nom',g:'aldehidos',c:'uso',k:'Q',ctx:'Observa la siguiente estructura:',f:'CH₃−CH₂−CH₂−CH₂−CHO',
   q:'¿Cuál es su nombre IUPAC?',o:['pentanal','pentan-1-al','pentanona','butanal']},
  {a:'nom',g:'aldehidos',c:'uso',k:'CTS',ctx:'La vainillina, responsable del aroma y sabor de la vainilla, es un aldehído aromático que también se usa en perfumería y repostería.',
   q:'¿Qué grupo funcional identifica a la vainillina como aldehído?',o:['−CHO','−COOH','−O−CH₃','−OH']},
  {a:'rx',g:'aldehidos',c:'ind',k:'CTS',ctx:'Antes de los glucómetros electrónicos se usaba el reactivo de Fehling (sulfato de cobre en medio básico, de color azul) para detectar azúcares reductores, como la glucosa, en la orina de personas con sospecha de diabetes.',
   q:'¿Qué cambio se observa cuando el reactivo de Fehling reacciona con un aldehído como el de la glucosa?',o:['Se forma un precipitado rojo ladrillo de óxido de cobre(I), porque el aldehído se oxida y reduce al cobre','La solución se vuelve completamente transparente','Se forma un gas que hace burbujear la mezcla','El color azul se intensifica sin que se forme ningún precipitado']},
  {a:'nom',g:'cetonas',c:'uso',k:'Q',ctx:'Observa la siguiente estructura:',f:'CH₃−CH₂−CO−CH₂−CH₃',
   q:'¿Cuál es su nombre IUPAC?',o:['pentan-3-ona','pentan-2-ona','pentanal','pentan-3-al']},
  {a:'nom',g:'aldehidos',c:'uso',k:'CTS',ctx:'El aldehído cinámico (C₆H₅−CH=CH−CHO) es el responsable del aroma y el sabor característico de la canela.',
   q:'¿Qué grupos funcionales tiene esta molécula, además del anillo aromático?',o:['Un doble enlace C=C y un grupo aldehído (−CHO)','Dos grupos −OH','Un grupo éster y un grupo amida','Un triple enlace y un grupo cetona']},
  {a:'nom',g:'aldehidos',c:'uso',k:'CTS',ctx:'El metanal (formaldehído) es un gas que se usa para fabricar las resinas que unen las partículas de madera en los muebles de aglomerado.',
   q:'¿Cuál es la fórmula estructural del metanal?',o:['H−CHO','CH₃−CHO','H−COOH','CH₃−OH']},
  {a:'rx',g:'cetonas',c:'ind',k:'Q',ctx:'Un grupo agrega dicromato de potasio acidificado (color naranja) a dos tubos, en las mismas condiciones: uno con ciclohexanol y otro con ciclohexanona.',
   q:'¿Qué resultado se espera?',o:['Solo cambia a verde el tubo con ciclohexanol','Solo el tubo con ciclohexanona cambia de color','Los dos tubos cambian de color por igual','Ninguno de los dos tubos cambia de color']},
  {a:'prop',g:'cetonas',c:'exp',k:'CTS',ctx:'La acetona (propanona) del quitaesmalte disuelve tanto el esmalte de uñas (orgánico, apolar) como manchas de sustancias polares, y además se mezcla con agua en cualquier proporción.',
   q:'¿Qué característica de la acetona explica que disuelva sustancias tan distintas entre sí?',o:['Tiene una parte polar (C=O) y una parte apolar (dos grupos metilo)','La acetona es un compuesto iónico que se disuelve en cualquier líquido','La acetona no tiene ningún átomo de oxígeno en su estructura','La acetona reacciona químicamente con todo lo que disuelve']},
  {a:'prop',g:'ambos',c:'exp',k:'Q',ctx:'A masa molar parecida, los alcanos tienen el punto de ebullición más bajo, los aldehídos y las cetonas uno intermedio, y los alcoholes el más alto.',
   q:'¿Qué explica que los aldehídos y las cetonas hiervan a mayor temperatura que los alcanos, pero a menor temperatura que los alcoholes?',o:['El grupo C=O es polar y permite atracciones dipolo-dipolo entre moléculas, pero no puentes de hidrógeno entre ellas mismas, al no tener un H unido al O','Los aldehídos y las cetonas no tienen ningún tipo de fuerza intermolecular','Los aldehídos y las cetonas forman puentes de hidrógeno más fuertes que los alcoholes','El grupo C=O hace que la molécula pese menos que un alcano de igual tamaño']},
  {a:'nom',g:'aldehidos',c:'uso',k:'Q',ctx:'Observa la siguiente estructura:',f:'CH₃−CH(CH₃)−CHO',
   q:'¿Cuál es su nombre IUPAC?',o:['2-metilpropanal','3-metilpropanal','2-metilbutanal','2-metilpropanona']},
  {a:'nom',g:'cetonas',c:'uso',k:'CTS',ctx:'La etil metil cetona (butan-2-ona, MEK) es un disolvente industrial común en pinturas, pegantes y barnices.',
   q:'¿Cuál es su fórmula estructural?',o:['CH₃−CO−CH₂−CH₃','CH₃−CH₂−CO−CH₂−CH₃','CH₃−CH₂−CH₂−CHO','CH₃−CH(OH)−CH₂−CH₃']},
  {a:'nom',g:'aldehidos',c:'uso',k:'Q',ctx:'En la retina del ojo humano, el retinal (un aldehído derivado de la vitamina A) cambia de forma geométrica al absorber luz, lo que dispara la señal nerviosa de la visión.',
   q:'¿Qué tienen en común el retinal y otros aldehídos, sin importar su tamaño?',o:['Todos tienen un grupo −CHO: un carbonilo (C=O) unido al menos a un hidrógeno','Todos tienen un anillo aromático','Todos son solubles en agua en cualquier proporción','Todos tienen el mismo número de carbonos']}
 ],
 acidos:[
  {a:'nom',g:'acidos',c:'uso',k:'Q',ctx:'Observa la siguiente estructura:',f:'CH₃−CH₂−COOH',
   q:'¿Cuál es su nombre IUPAC?',o:['ácido propanoico','ácido etanoico','ácido propan-1-oico','propanoato de hidrógeno']},
  {a:'nom',g:'acidos',c:'uso',k:'Q',ctx:'Observa la siguiente estructura:',f:'CH₃−CH(CH₃)−CH₂−COOH',
   q:'¿Cuál es su nombre IUPAC?',o:['ácido 3-metilbutanoico','ácido 2-metilbutanoico','ácido 3-metilpentanoico','ácido 1-metilbutanoico']},
  {a:'nom',g:'esteres',c:'uso',k:'Q',ctx:'Observa la siguiente estructura:',f:'CH₃−COO−CH₂−CH₃',
   q:'¿Cuál es su nombre IUPAC?',o:['etanoato de etilo','etanoato de metilo','propanoato de metilo','etilo de etanoato']},
  {a:'rx',g:'esteres',c:'uso',k:'CTS',ctx:'El aroma del banano se debe en parte al etanoato de 3-metilbutilo, un éster que la industria también produce para dar sabor a dulces.',
   q:'¿De qué par de reactivos se obtiene este éster por esterificación?',o:['ácido etanoico y 3-metilbutan-1-ol','ácido 3-metilbutanoico y etanol','etanal y 3-metilbutanal','ácido etanoico y 3-metilbutanal']},
  {a:'prop',g:'acidos',c:'exp',k:'Q',ctx:'El vinagre contiene ácido etanoico. Una solución de vinagre tiene pH cercano a 3, mientras que una de HCl de la misma concentración tiene pH mucho menor.',
   q:'¿Qué explica estas observaciones?',o:['El −COOH cede solo parcialmente su H⁺ al agua: el ácido etanoico es un ácido débil','El −COOH libera iones OH⁻ al agua','El ácido etanoico se ioniza por completo, igual que el HCl','El ácido etanoico no tiene hidrógenos que pueda ceder']},
  {a:'rx',g:'esteres',c:'ind',k:'CTS',ctx:'En una práctica se calienta aceite de palma con NaOH y se espera obtener jabón y glicerol.',
   q:'¿Qué evidencia es más adecuada para comprobar que se formó jabón?',o:['El producto forma espuma al agitarlo con agua y ayuda a retirar una mancha de grasa','El aceite cambia de color al calentarse','El volumen de la mezcla aumenta al calentarla','Se desprende un gas que enturbia el agua de cal']},
  {a:'rx',g:'esteres',c:'uso',k:'CTS',ctx:'Colombia mezcla el diésel con biodiésel elaborado a partir de aceite de palma. El biodiésel está formado principalmente por ésteres metílicos de ácidos grasos.',
   q:'¿Qué reacción lo produce?',o:['Transesterificación del aceite (un triglicérido) con metanol','Hidrogenación del aceite con H₂','Fermentación de la glucosa de la palma','Combustión incompleta del aceite']},
  {a:'prop',g:'acidos',c:'exp',k:'Q',ctx:'El ácido etanoico (60 g/mol) hierve a 118 °C y el propan-1-ol (60 g/mol) a 97 °C.',
   q:'¿Por qué el ácido hierve a mayor temperatura si tienen la misma masa molar?',o:['Las moléculas del ácido se asocian en parejas (dímeros) unidas por dos puentes de hidrógeno, y separarlas exige más energía','El ácido etanoico tiene una masa molar mucho mayor que el propan-1-ol','El propan-1-ol no puede formar puentes de hidrógeno porque su −OH es apolar','El ácido etanoico es un compuesto iónico, formado por iones H⁺ y CH₃COO⁻']},
  {a:'nom',g:'acidos',c:'uso',k:'CTS',ctx:'La picadura de hormiga y el pelo urticante de la ortiga liberan ácido metanoico (ácido fórmico), el ácido carboxílico más simple.',
   q:'¿Cuál es su fórmula estructural?',o:['H−COOH','CH₃−COOH','H−CHO','CH₃−CH₂−COOH']},
  {a:'prop',g:'acidos',c:'uso',k:'CTS',ctx:'Una botella de vinagre comercial indica «acidez: 4 % m/v», es decir, hay 4 gramos de ácido etanoico por cada 100 mL de vinagre.',
   q:'¿Qué significa, en términos químicos, un vinagre con mayor porcentaje de acidez?',o:['Contiene una mayor concentración de ácido etanoico disuelto en agua','Contiene menos agua y más azúcar','Es menos ácido que uno con menor porcentaje','Contiene ácido clorhídrico en vez de ácido etanoico']},
  {a:'rx',g:'acidos',c:'exp',k:'CTS',ctx:'El nailon, una fibra sintética usada en textiles y cuerdas, se forma al unir repetidamente moléculas con grupo ácido carboxílico con moléculas con grupo amina, liberando agua en cada unión.',
   q:'¿Qué grupo funcional se forma en cada punto de unión de la cadena del nailon?',o:['Amida (−CO−NH−)','Éster (−CO−O−)','Éter (−O−)','Nitrilo (−C≡N)']},
  {a:'nom',g:'acidos',c:'uso',k:'CTS',ctx:'El olor característico de la mantequilla rancia se debe en parte al ácido butanoico, que se libera cuando las grasas se descomponen.',
   q:'¿Cuál es su fórmula estructural?',o:['CH₃−CH₂−CH₂−COOH','CH₃−CH₂−COOH','CH₃−CH₂−CH₂−CH₂−COOH','CH₃−CH₂−CH₂−CHO']},
  {a:'rx',g:'esteres',c:'uso',k:'Q',ctx:'La aspirina se sintetiza haciendo reaccionar ácido salicílico (que tiene un grupo −OH en el anillo) con anhídrido acético, para formar un grupo éster.',
   q:'¿Qué dos partes de las moléculas quedan unidas por el nuevo enlace éster?',o:['El oxígeno del −OH del ácido salicílico y el carbono carbonilo que aporta el anhídrido acético','Dos anillos aromáticos, uno de cada reactivo, unidos entre sí','El nitrógeno de un grupo amina y el carbono de un grupo ácido','Los carbonos de dos grupos −COOH que pierden una molécula de agua']},
  {a:'rx',g:'acidos',c:'ind',k:'Q',ctx:'Una sustancia orgánica desconocida puede ser un alcohol o un ácido carboxílico. Para saberlo, un grupo le agrega bicarbonato de sodio (NaHCO₃) sólido.',
   q:'¿Qué observación indicaría que es el ácido carboxílico?',o:['Se forman burbujas de CO₂ de inmediato, porque el ácido reacciona con el bicarbonato','La mezcla cambia de color a azul','No ocurre ningún cambio visible','Se forma un precipitado blanco sin liberar gas']},
  {a:'nom',g:'acidos',c:'uso',k:'CTS',ctx:'El benzoato de sodio, sal de sodio del ácido C₆H₅−COOH, se usa como conservante en bebidas y alimentos procesados, para evitar el crecimiento de hongos y bacterias.',
   q:'¿Cuál es el nombre IUPAC del ácido del que proviene esta sal?',o:['ácido benzoico','ácido fenilacético','ácido fenoico','ácido hexanoico']},
  {a:'prop',g:'acidos',c:'exp',k:'CTS',ctx:'El jabón, una sal de ácido graso, tiene una «cola» larga de hidrocarburo (apolar) y una «cabeza» con carga negativa (polar), proveniente del grupo −COO⁻.',
   q:'¿Cómo le permite esa estructura al jabón quitar la grasa de un plato al lavarlo con agua?',o:['La cola apolar se introduce en la grasa y las cabezas polares quedan hacia el agua, de modo que la gota se dispersa y se arrastra con el agua','El jabón reacciona con la grasa y la convierte en agua, que se va por el desagüe','El jabón reacciona con la grasa y la transforma en sal de cocina, que se disuelve','El jabón sube la temperatura del agua y así derrite la grasa hasta que se evapora']},
  {a:'nom',g:'esteres',c:'uso',k:'Q',ctx:'Observa la siguiente estructura:',f:'CH₃−CH₂−COO−CH₃',
   q:'¿Cuál es su nombre IUPAC?',o:['propanoato de metilo','metanoato de propilo','propanoato de etilo','ácido propanoico de metilo']},
  {a:'prop',g:'ambos',c:'exp',k:'Q',ctx:'El ácido butanoico (88 g/mol) hierve a 164 °C, mientras que el etanoato de etilo (88 g/mol), un éster, hierve a 77 °C.',
   q:'¿Qué diferencia estructural explica que el éster hierva a una temperatura mucho menor?',o:['El éster no tiene un H unido a oxígeno, así que sus moléculas no forman puentes de hidrógeno entre sí','El éster tiene una masa molar mucho menor que la del ácido, por eso hierve antes','El éster tiene un enlace doble C=C que debilita las fuerzas entre sus moléculas','Los ésteres forman puentes de hidrógeno más fuertes que los ácidos']},
  {a:'nom',g:'acidos',c:'uso',k:'CTS',ctx:'El ácido cítrico, presente en el limón y otros cítricos, tiene tres grupos −COOH en su estructura.',
   q:'¿Cómo se clasifica un ácido con tres grupos carboxilo, según el número de esos grupos?',o:['Triprótico (puede ceder hasta tres H⁺)','Monoprótico','Diprótico','Neutro, porque sus grupos se cancelan entre sí']},
  {a:'nom',g:'acidos',c:'uso',k:'CTS',ctx:'La espinaca y el ruibarbo contienen ácido etanodioico (ácido oxálico), HOOC−COOH, que en grandes cantidades puede formar cristales de oxalato de calcio en los riñones.',
   q:'¿Cuántos grupos −COOH tiene el ácido etanodioico?',o:['Dos','Uno','Tres','Ninguno: es un alcohol']}
 ],
 nitrogenados:[
  {a:'nom',g:'aminas',c:'uso',k:'Q',ctx:'Observa la siguiente estructura:',f:'CH₃−CH₂−NH₂',
   q:'¿Cuál es su nombre IUPAC?',o:['etanamina','etanamida','etanonitrilo','metanamina']},
  {a:'nom',g:'amidas',c:'uso',k:'Q',ctx:'Observa la siguiente estructura:',f:'CH₃−CH₂−CO−NH₂',
   q:'¿Cuál es su nombre IUPAC?',o:['propanamida','propanamina','butanamida','etanamida']},
  {a:'nom',g:'nitrilos',c:'uso',k:'Q',ctx:'Observa la siguiente estructura:',f:'CH₃−CH₂−C≡N',
   q:'¿Cuál es su nombre IUPAC?',o:['propanonitrilo','etanonitrilo','propanamina','butanonitrilo']},
  {a:'prop',g:'aminas',c:'exp',k:'Q',ctx:'Al disolver etanamina en agua, la solución se vuelve básica.',
   q:'¿Qué explica este comportamiento?',o:['El nitrógeno tiene un par de electrones libre que puede aceptar un H⁺ del agua','El nitrógeno cede con facilidad un H⁺ al agua','La etanamina contiene iones OH⁻ en su estructura','El nitrógeno tiene una carga positiva permanente']},
  {a:'prop',g:'nitrilos',c:'uso',k:'CTS',ctx:'La yuca amarga contiene linamarina, un compuesto con grupo nitrilo (−C≡N) que puede liberar cianuro de hidrógeno (HCN). Antes de consumirla se ralla, se lava y se cocina.',
   q:'¿Cuál es el propósito de ese procesamiento?',o:['Eliminar el HCN y los compuestos que lo liberan, que son tóxicos','Aumentar la cantidad de nitrilo para mejorar el sabor','Convertir el almidón de la yuca en proteínas','Neutralizar el ácido acético que contiene la yuca']},
  {a:'nom',g:'aminas',c:'uso',k:'Q',ctx:'Las aminas se clasifican según cuántos grupos carbonados están unidos al nitrógeno.',
   q:'¿Cuál de las siguientes es una amina secundaria?',o:['CH₃−NH−CH₃ (N-metilmetanamina)','CH₃−CH₂−NH₂ (etanamina)','(CH₃)₃N (N,N-dimetilmetanamina)','CH₃−CO−NH₂ (etanamida)']},
  {a:'nom',g:'amidas',c:'uso',k:'CTS',ctx:'El paracetamol (acetaminofén), uno de los analgésicos más usados, contiene en su estructura el grupo −NH−CO−.',
   q:'¿A qué grupo funcional corresponde?',o:['Amida','Amina','Nitrilo','Éster']},
  {a:'rx',g:'aminas',c:'ind',k:'Q',ctx:'El olor del pescado se debe en parte a aminas volátiles. Un estudiante propone la hipótesis: «el jugo de limón reduce el olor porque su ácido reacciona con las aminas y forma sales que no se evaporan».',
   q:'¿Qué experimento permite poner a prueba esta hipótesis?',o:['Comparar el olor de muestras iguales de pescado tratadas con limón, con agua y sin tratamiento','Agregar limón a todas las muestras y oler solo una de ellas','Cocinar el pescado más tiempo sin agregarle nada','Medir la masa del pescado antes y después de agregar limón']},
  {a:'nom',g:'aminas',c:'uso',k:'Q',ctx:'Observa la siguiente estructura:',f:'CH₃−CH(CH₃)−NH₂',
   q:'¿Cuál es su nombre IUPAC?',o:['propan-2-amina','propan-1-amina','2-metiletanamina','propanamida']},
  {a:'prop',g:'aminas',c:'exp',k:'CTS',ctx:'El olor característico de la carne o el pescado en descomposición se debe en parte a aminas como la cadaverina y la putrescina, que se forman cuando las bacterias degradan proteínas.',
   q:'¿Por qué estas sustancias se usan como indicador de descomposición en el control de calidad de alimentos?',o:['Porque se forman a partir de aminoácidos de las proteínas a medida que el alimento se descompone, y su concentración aumenta con el tiempo','Porque solo se forman cuando el alimento se congela y descongela varias veces, y desaparecen al cocinarlo','Porque son pigmentos que dan el color rojo a la carne fresca y se pierden cuando el alimento envejece','Porque los fabricantes las agregan como conservantes y su concentración indica cuánto dura el alimento']},
  {a:'prop',g:'ambos',c:'exp',k:'Q',ctx:'La etanamina es una base débil, pero mucho más básica que la etanamida (CH₃−CO−NH₂), que es prácticamente neutra.',
   q:'¿Qué explica esta diferencia, si las dos tienen un átomo de nitrógeno con un par de electrones libre?',o:['En la amida, el par libre del nitrógeno se comparte con el C=O vecino y queda poco disponible para aceptar un H⁺','En la amida, el nitrógeno pierde su par libre al formar un enlace triple con el carbono','En la amina, el nitrógeno no tiene par libre y por eso no puede aceptar un H⁺','En la amida, el nitrógeno tiene carga positiva y repele a los iones H⁺ del medio']},
  {a:'nom',g:'nitrilos',c:'uso',k:'Q',ctx:'Observa la siguiente estructura:',f:'CH₃−CH₂−CH₂−C≡N',
   q:'¿Cuál es su nombre IUPAC?',o:['butanonitrilo','propanonitrilo','butanamina','butanamida']},
  {a:'nom',g:'amidas',c:'uso',k:'CTS',ctx:'En 1828 el químico alemán Friedrich Wöhler sintetizó urea, NH₂−CO−NH₂, a partir de sustancias inorgánicas, lo que ayudó a derribar la idea de que los compuestos orgánicos solo podían formarse dentro de seres vivos.',
   q:'¿A qué grupo funcional pertenece la urea?',o:['Es una amida (tiene dos grupos −NH₂ unidos a un carbonilo)','Es una amina primaria (tiene un −NH₂ unido a un carbono)','Es un ácido carboxílico (tiene un −COOH)','Es un nitrilo (tiene un −C≡N)']},
  {a:'rx',g:'aminas',c:'ind',k:'Q',ctx:'Las aminas, al ser bases, reaccionan con ácidos como el HCl y forman sales solubles en agua. Esa propiedad se usa para separar aminas de una mezcla con compuestos neutros, como los hidrocarburos.',
   q:'¿Qué procedimiento permitiría separar una amina de una mezcla con un hidrocarburo, aprovechando esta propiedad?',o:['Agitar la mezcla con HCl diluido: la amina pasa a la fase acuosa como sal y el hidrocarburo queda en la fase orgánica','Calentar la mezcla hasta que hierva toda el agua y quede la amina sola','Agregar más hidrocarburo para que la amina se disuelva en él por completo','Agregar NaOH concentrado y esperar a que la amina se evapore de la mezcla']},
  {a:'nom',g:'aminas',c:'uso',k:'Q',ctx:'Observa la siguiente estructura:',f:'CH₃−CH₂−NH−CH₂−CH₃',
   q:'¿Cuál es su nombre IUPAC?',o:['N-etiletanamina','dietanamina','N,N-dietanamina','etanamina']},
  {a:'prop',g:'aminas',c:'uso',k:'CTS',ctx:'La cafeína del café y el té, y la nicotina del tabaco, son alcaloides: compuestos naturales de origen vegetal, en general de carácter básico, con efectos marcados sobre el sistema nervioso.',
   q:'¿Qué elemento tienen en común todos los alcaloides y es responsable de su carácter básico?',o:['Nitrógeno, con un par de electrones libre que puede aceptar un H⁺','Cloro, que libera iones Cl⁻ en el agua','Azufre, que forma ácido sulfúrico en el agua','Oxígeno, que forma parte de un grupo −COOH']},
  {a:'prop',g:'aminas',c:'exp',k:'Q',ctx:'A masa molar parecida, la etanamina hierve a una temperatura mayor que el propano, pero menor que el etanol.',
   q:'¿Qué explica esta posición intermedia de la etanamina?',o:['La amina forma puentes de hidrógeno N−H, más débiles que los O−H del alcohol','La etanamina no forma ningún tipo de fuerza entre sus moléculas','El nitrógeno es más electronegativo que el oxígeno y atrae menos','La etanamina tiene una masa molar mucho mayor que la del etanol']},
  {a:'nom',g:'amidas',c:'uso',k:'Q',ctx:'Una amida se puede pensar como el resultado de reemplazar el −OH de un ácido carboxílico por un grupo −NH₂.',
   q:'¿Cuál es el nombre de la amida que proviene del ácido butanoico?',o:['butanamida','butanamina','ácido butanamídico','butanonitrilo']},
  {a:'nom',g:'nitrilos',c:'uso',k:'CTS',ctx:'Las fibras acrílicas (como el orlón, usado en suéteres y cobijas) se fabrican a partir del monómero acrilonitrilo, CH₂=CH−C≡N.',
   q:'¿Qué grupos funcionales tiene el acrilonitrilo?',o:['Un doble enlace C=C y un grupo nitrilo (−C≡N)','Un triple enlace C≡C y un grupo amina','Dos grupos nitrilo','Un grupo amida y un grupo alcohol']},
  {a:'nom',g:'ambos',c:'uso',k:'Q',ctx:'El grupo −NH₂ de una amina primaria y el grupo −CO−NH₂ de una amida se confunden con facilidad porque los dos contienen nitrógeno e hidrógeno.',
   q:'¿Cuál es la diferencia estructural clave entre los dos grupos?',o:['La amida tiene el nitrógeno unido a un carbono carbonilo (C=O); la amina tiene el nitrógeno unido directamente a un carbono de la cadena, sin C=O','La amina tiene el nitrógeno unido a un carbono con doble enlace a oxígeno; la amida tiene el nitrógeno unido a un carbono de la cadena','La amida tiene el nitrógeno unido a un oxígeno (N−O); la amina tiene el nitrógeno unido solo a carbonos e hidrógenos','La amida tiene un triple enlace entre carbono y nitrógeno; la amina tiene un enlace sencillo']}
 ],
 polifuncionales:[
  {a:'nom',c:'uso',k:'Q',ctx:'El ácido láctico se forma en los músculos y en la fermentación del kumis. Su estructura es:',f:'CH₃−CH(OH)−COOH',
   q:'¿Cuál es su nombre IUPAC?',o:['ácido 2-hidroxipropanoico','ácido 3-hidroxipropanoico','ácido 1-hidroxipropanoico','1-carboxietan-1-ol']},
  {a:'nom',c:'exp',k:'Q',ctx:'Una molécula tiene un grupo −OH y un grupo −CHO.',
   q:'¿Cuál de los dos da el sufijo del nombre y por qué?',o:['El −CHO, porque el aldehído tiene mayor prioridad que el alcohol; el −OH se nombra con el prefijo hidroxi-','El −OH, porque está más cerca del extremo de la cadena','El que aparezca primero al leer la fórmula de izquierda a derecha','Ambos, porque los dos grupos se nombran siempre como sufijos']},
  {a:'nom',c:'uso',k:'Q',ctx:'Observa la siguiente estructura:',f:'CH₂=CH−CH₂−OH',
   q:'¿Cuál es su nombre IUPAC?',o:['prop-2-en-1-ol','prop-1-en-3-ol','prop-2-en-1-al','propan-1-ol']},
  {a:'nom',c:'uso',k:'Q',ctx:'Observa la siguiente estructura:',f:'CH₃−CO−CH₂−COOH',
   q:'¿Cuál es su nombre IUPAC?',o:['ácido 3-oxobutanoico','ácido 2-oxobutanoico','4-carboxibutan-2-ona','ácido 3-hidroxibutanoico']},
  {a:'rx',c:'exp',k:'CTS',ctx:'Durante un ejercicio intenso con poco oxígeno, las células musculares transforman ácido pirúvico (CH₃−CO−COOH) en ácido láctico (CH₃−CH(OH)−COOH).',
   q:'¿Qué cambio químico ocurre?',o:['El grupo cetona del C2 se reduce a un alcohol secundario','El grupo carboxilo se reduce a aldehído','Se pierde un carbono en forma de CO₂','El grupo alcohol se oxida a cetona']},
  {a:'nom',c:'uso',k:'Q',ctx:'La alanina, uno de los aminoácidos de las proteínas, es CH₃−CH(NH₂)−COOH.',
   q:'¿Cuál es su nombre sistemático?',o:['ácido 2-aminopropanoico','ácido 3-aminopropanoico','2-aminopropan-1-ol','1-carboxietan-1-amina']},
  {a:'prop',c:'exp',k:'Q',ctx:'La glucosa (C₆H₁₂O₆), en su forma de cadena abierta, tiene cinco grupos −OH y un grupo aldehído. Se disuelve muy bien en agua, mientras que el hexano (C₆H₁₄) no.',
   q:'¿Qué explica la diferencia?',o:['Los grupos −OH de la glucosa forman puentes de hidrógeno con el agua; el hexano es apolar','La glucosa tiene más átomos de carbono que el hexano','El hexano reacciona con el agua y se descompone en gases','La glucosa es un compuesto iónico, como la sal de cocina']},
  {a:'prop',c:'ind',k:'Q',ctx:'Un grupo quiere saber qué grupo funcional del ácido láctico (el −OH o el −COOH) es el responsable de su acidez.',
   q:'¿Qué comparación es la más útil?',o:['Medir el pH de soluciones de igual concentración de ácido láctico, propan-2-ol y ácido propanoico','Medir la temperatura de ebullición del ácido láctico','Comparar el color de soluciones de ácido láctico y de glucosa','Medir el pH del agua destilada sola en días diferentes']},
  {a:'nom',c:'uso',k:'Q',ctx:'Observa la siguiente estructura:',f:'CH₃−CH(OH)−CH₂−CHO',
   q:'¿Cuál es su nombre IUPAC?',o:['3-hidroxibutanal','2-hidroxibutanal','3-hidroxibutanoico','1-hidroxibutanal']},
  {a:'nom',c:'uso',k:'CTS',ctx:'La adrenalina (epinefrina), una hormona que el cuerpo libera en situaciones de estrés o peligro, tiene en su estructura un anillo aromático con dos grupos −OH, otro −OH en la cadena lateral y un grupo amina.',
   q:'¿Qué grupos funcionales con oxígeno o nitrógeno identificas en esta descripción?',o:['Grupos hidroxilo (−OH) y un grupo amina','Grupos hidroxilo (−OH) y un grupo amida','Grupos carbonilo (C=O) y un grupo amina','Grupos hidroxilo (−OH), un grupo amina y un ácido carboxílico']},
  {a:'nom',c:'exp',k:'Q',ctx:'El orden de prioridad IUPAC para elegir el sufijo principal es, de mayor a menor: ácido carboxílico, éster, amida, nitrilo, aldehído, cetona, alcohol, amina.',
   q:'Si una molécula tiene un grupo amina y un grupo cetona, ¿cuál de los dos da la terminación del nombre?',o:['La cetona, porque tiene mayor prioridad que la amina; la amina se nombra entonces como prefijo amino-','La amina, porque el nitrógeno es más importante que el oxígeno','Ninguno de los dos: los dos se nombran siempre como prefijos','Depende de cuál de los dos esté más cerca del extremo de la cadena']},
  {a:'nom',c:'uso',k:'CTS',ctx:'El GABA (ácido gamma-aminobutírico), el principal neurotransmisor inhibidor del sistema nervioso, tiene la estructura H₂N−CH₂−CH₂−CH₂−COOH.',
   q:'¿Cuál es su nombre sistemático (IUPAC)?',o:['ácido 4-aminobutanoico','ácido 2-aminobutanoico','ácido 1-aminobutanoico','butanoato de amonio']},
  {a:'rx',c:'ind',k:'Q',ctx:'Una molécula desconocida decolora el agua de bromo con rapidez (prueba de alqueno) pero no reacciona con el reactivo de Tollens (prueba de aldehído). Se sabe que tiene un doble enlace C=C y un grupo carbonilo.',
   q:'¿Qué se puede concluir sobre el grupo carbonilo de esta molécula?',o:['Es una cetona y no un aldehído, porque no dio positiva la prueba de Tollens','Es un aldehído, porque decoloró el agua de bromo','La molécula no tiene ningún grupo carbonilo','La molécula es un alcano, porque no reaccionó con Tollens']},
  {a:'nom',c:'uso',k:'Q',ctx:'Observa la siguiente estructura:',f:'CH₃−CO−CH₂−CO−CH₃',
   q:'¿Cuál es su nombre IUPAC?',o:['pentano-2,4-diona','pentano-1,3-diona','pentano-2,3-diona','2,4-dioxopentano']},
  {a:'nom',c:'exp',k:'Q',ctx:'La pentano-2,4-diona tiene dos grupos cetona, ambos del mismo tipo.',
   q:'¿Por qué el nombre lleva el sufijo «-diona» con dos localizadores (2,4) en vez de nombrarse como si tuviera un solo grupo principal?',o:['Porque cuando hay dos o más grupos iguales de la máxima prioridad, todos se incluyen en el sufijo, cada uno con su propio localizador','Porque solo el grupo de menor localizador es el principal, y el otro debería nombrarse con el prefijo oxo-','Porque las cetonas se nombran como dos alcanos unidos por un C=O, y cada uno aporta un localizador','Porque el localizador 4 indica la longitud de la cadena y no la posición del segundo grupo']},
  {a:'nom',c:'uso',k:'Q',ctx:'La serina, otro aminoácido de las proteínas, tiene en su estructura un grupo amina, un grupo ácido carboxílico y además un grupo hidroxilo: HO−CH₂−CH(NH₂)−COOH.',
   q:'De los tres grupos funcionales que tiene la serina, ¿cuál da la terminación del nombre, según el orden de prioridad IUPAC?',o:['El ácido carboxílico (−COOH): termina en «-oico», y los otros dos se nombran como prefijos (amino-, hidroxi-)','El grupo amina, porque el nitrógeno es más importante','El grupo hidroxilo, porque está en el extremo de la cadena','Los tres compiten por igual y no se puede decidir']},
  {a:'nom',c:'uso',k:'Q',ctx:'Observa la siguiente estructura:',f:[{h:0,bu:X('O',0),buBn:2,bd:X('O',1)},{h:2},{h:2},{h:0,bu:X('O',0),buBn:2,bd:X('O',1)}],t:'HOOC−CH₂−CH₂−COOH',
   q:'¿Cuál es su nombre IUPAC?',o:['ácido butanodioico','ácido butanoico','ácido propanodioico','ácido 2-butanodioico']},
  {a:'nom',c:'exp',k:'CTS',ctx:'El ácido tartárico, presente en la uva y usado en la industria de alimentos, tiene dos grupos −COOH y dos grupos −OH en una cadena de solo 4 carbonos.',
   q:'¿Cómo se nombran los grupos −OH en el nombre de este ácido, ya que no son el grupo de mayor prioridad?',o:['Como prefijos hidroxi-, cada uno con su propio localizador','Como sufijos -ol adicionales al final del nombre','Se ignoran por completo en el nombre','Reemplazan a los grupos −COOH en el nombre final']},
  {a:'nom',c:'uso',k:'Q',ctx:'Observa la siguiente estructura:',f:'CH₃−CH(NH₂)−CH₂−CH₃',
   q:'¿Cuál es su nombre IUPAC?',o:['butan-2-amina','butan-1-amina','butan-3-amina','butanamida']},
  {a:'nom',c:'uso',k:'Q',ctx:'Observa la siguiente estructura:',f:'CH₃−CH₂−CH(OH)−CO−CH₃',
   q:'¿Cuál es su nombre IUPAC?',o:['3-hidroxipentan-2-ona','2-hidroxipentan-3-ona','4-hidroxipentan-2-ona','3-hidroxipentanal']}
 ],
 isomeria:[
  {a:'nom',c:'uso',k:'Q',ctx:'El etanol (CH₃−CH₂−OH) y el metoximetano (CH₃−O−CH₃) tienen la misma fórmula molecular, C₂H₆O.',
   q:'¿Qué tipo de isómeros son?',o:['Isómeros de función','Isómeros de cadena','Isómeros de posición','Isómeros cis/trans']},
  {a:'nom',c:'uso',k:'Q',ctx:'Los alcanos de fórmula C₅H₁₂ pueden tener la cadena lineal o ramificada.',
   q:'¿Cuántos isómeros estructurales tiene el C₅H₁₂?',o:['3','2','4','5']},
  {a:'nom',c:'uso',k:'Q',ctx:'El propan-1-ol (CH₃−CH₂−CH₂−OH) y el propan-2-ol (CH₃−CH(OH)−CH₃) tienen la misma fórmula molecular.',
   q:'¿Qué tipo de isómeros son?',o:['De posición','De cadena','De función','Cis/trans']},
  {a:'nom',c:'exp',k:'Q',ctx:'El but-2-eno (CH₃−CH=CH−CH₃) existe como dos isómeros, cis y trans, mientras que el but-1-eno (CH₂=CH−CH₂−CH₃) no.',
   q:'¿Por qué el but-1-eno no tiene isómeros cis/trans?',o:['Porque uno de los carbonos de su doble enlace tiene dos sustituyentes iguales (dos H)','Porque el but-1-eno no tiene doble enlace','Porque en el but-1-eno el doble enlace puede girar libremente','Porque el but-1-eno tiene menos carbonos que el but-2-eno']},
  {a:'nom',c:'uso',k:'Q',ctx:'Un carbono quiral (asimétrico) está unido a cuatro grupos diferentes.',
   q:'¿Cuál de los siguientes compuestos tiene un carbono quiral?',o:['butan-2-ol, CH₃−CH(OH)−CH₂−CH₃','propan-2-ol, CH₃−CH(OH)−CH₃','etanol, CH₃−CH₂−OH','2-metilpropan-2-ol, (CH₃)₃C−OH']},
  {a:'nom',c:'uso',k:'CTS',ctx:'La talidomida se recetó en los años 50 y 60 a mujeres embarazadas; se ha asociado a uno de sus enantiómeros con las malformaciones (aunque en el cuerpo se transforman uno en otro).',
   q:'¿Qué tienen en común dos enantiómeros?',o:['La misma fórmula y los mismos enlaces, pero son imágenes especulares que no se superponen','Tienen fórmulas moleculares diferentes','Tienen grupos funcionales diferentes','Son la misma estructura superponible con distinto nombre comercial']},
  {a:'nom',c:'exp',k:'CTS',ctx:'Las grasas trans se forman en la hidrogenación parcial de aceites vegetales y su consumo aumenta el riesgo cardiovascular.',
   q:'¿En qué se diferencia un ácido graso trans de su isómero cis?',o:['En la disposición de los grupos alrededor del doble enlace: en el trans quedan en lados opuestos','En que el trans tiene el doble enlace en otra posición de la cadena','En que el trans tiene un carbono más en la cadena principal','En que el trans tiene un grupo funcional diferente al del cis']},
  {a:'prop',c:'ind',k:'Q',ctx:'En el laboratorio hay dos recipientes rotulados «C₄H₁₀». Se sospecha que uno contiene butano y el otro 2-metilpropano.',
   q:'¿Qué medición permite comprobar que son sustancias distintas?',o:['Comparar sus puntos de ebullición en las mismas condiciones','Comparar sus fórmulas moleculares','Contar los átomos de carbono de cada uno','Comparar la masa molar de cada uno']},
  {a:'nom',c:'uso',k:'Q',ctx:'El C₄H₁₀ puede tener la cadena lineal o ramificada.',
   q:'¿Cuántos isómeros estructurales (de cadena) tiene el C₄H₁₀?',o:['2','1','3','4']},
  {a:'nom',c:'uso',k:'Q',ctx:'El C₆H₁₄ se puede ramificar de varias formas: sin ramificar, con un metilo en distintas posiciones, con dos metilos, etc.',
   q:'¿Cuántos isómeros estructurales tiene el C₆H₁₄?',o:['5','3','4','6']},
  {a:'nom',c:'exp',k:'Q',ctx:'El but-2-eno (CH₃−CH=CH−CH₃) tiene isómeros cis/trans, pero el 2-metilpropeno (CH₂=C(CH₃)−CH₃) no, aunque los dos tienen un doble enlace C=C.',
   q:'¿Por qué el 2-metilpropeno no tiene isómeros cis/trans?',o:['Porque uno de los carbonos de su doble enlace tiene dos grupos metilo idénticos unidos a él','Porque el 2-metilpropeno no tiene en realidad un doble enlace','Porque en el 2-metilpropeno el doble enlace puede girar libremente','Porque el 2-metilpropeno tiene menos carbonos que el but-2-eno']},
  {a:'prop',c:'exp',k:'CTS',ctx:'El aceite de oliva, rico en ácido oleico (un ácido graso cis), es líquido a temperatura ambiente. El ácido elaídico, su isómero trans, forma parte de grasas que son sólidas o semisólidas a esa misma temperatura.',
   q:'¿Qué explica esta diferencia en el punto de fusión entre los dos isómeros?',o:['La forma doblada de la cadena cis impide que las moléculas se empaqueten tan ordenadamente como las del isómero trans, de forma más recta','La cadena trans está doblada y por eso sus moléculas se empaquetan peor que las del isómero cis','El ácido cis forma puentes de hidrógeno entre sus cadenas y el trans no puede formarlos','Los isómeros cis y trans tienen fórmulas moleculares diferentes y por eso distinta masa']},
  {a:'prop',c:'ind',k:'Q',ctx:'Un grupo tiene dos frascos sin etiqueta, ambos con un líquido de fórmula C₄H₁₀O: se sospecha que uno es butan-1-ol y el otro, etoxietano (un éter).',
   q:'¿Qué propiedad permitiría distinguirlos con más seguridad?',o:['El punto de ebullición: el alcohol, que forma puentes de hidrógeno, hierve mucho más alto que el éter','El color del líquido en el frasco','El olor de cada líquido, porque los alcoholes no tienen olor','La fórmula molecular, que ya se sabe que es igual para los dos']},
  {a:'nom',c:'uso',k:'Q',ctx:'El propanal (CH₃−CH₂−CHO) y la propanona (CH₃−CO−CH₃) tienen la misma fórmula molecular, C₃H₆O.',
   q:'¿Qué tipo de isómeros son?',o:['Isómeros de función','Isómeros de cadena','Isómeros de posición','Isómeros cis/trans']},
  {a:'nom',c:'uso',k:'Q',ctx:'Las dos manos de una persona son parecidas pero no idénticas: son imágenes especulares entre sí y no se pueden superponer exactamente, igual que los dos enantiómeros de una molécula quiral.',
   q:'¿Qué característica deben tener los cuatro grupos unidos a un carbono para que ese carbono sea quiral?',o:['Los cuatro grupos deben ser diferentes entre sí','Los cuatro grupos deben ser iguales','Solo dos de los cuatro grupos deben ser diferentes','El carbono debe tener un doble enlace']},
  {a:'nom',c:'uso',k:'Q',ctx:'El pentano, el 2-metilbutano y el 2,2-dimetilpropano tienen los tres la fórmula molecular C₅H₁₂, pero esqueletos de carbono distintos.',
   q:'¿Qué tipo de isómeros son entre sí?',o:['Isómeros de cadena','Isómeros de posición','Isómeros de función','Isómeros cis/trans']},
  {a:'prop',c:'uso',k:'CTS',ctx:'El limoneno es un compuesto quiral: uno de sus enantiómeros huele a naranja y el otro, a pino o trementina, aunque los dos tienen exactamente la misma fórmula molecular y los mismos enlaces.',
   q:'¿Por qué el cuerpo humano puede distinguir el olor de dos enantiómeros tan parecidos químicamente?',o:['Los receptores olfativos son moléculas quirales y reconocen de forma distinta cada una de las dos formas especulares','Los dos enantiómeros tienen fórmulas moleculares distintas','Uno de los dos enantiómeros no tiene ningún átomo de carbono','El olor no depende de la estructura química, sino del color de la sustancia']},
  {a:'prop',c:'exp',k:'Q',ctx:'El butan-1-ol y el metoxipropano (CH₃−O−CH₂−CH₂−CH₃) son isómeros de función, ambos de fórmula C₄H₁₀O, pero con puntos de ebullición muy distintos (cerca de 118 °C y de 39 °C).',
   q:'¿Por qué dos isómeros con la misma fórmula molecular pueden tener propiedades físicas tan diferentes?',o:['Porque aunque tienen los mismos átomos, están unidos de forma distinta, lo que cambia la polaridad y las fuerzas entre sus moléculas','Porque en realidad tienen fórmulas moleculares distintas','Porque uno de los dos no es un compuesto real','Porque la temperatura de ebullición no depende de la estructura, solo de la fórmula']},
  {a:'nom',c:'uso',k:'Q',ctx:'El 1-clorobutano y el 2-clorobutano tienen la misma fórmula molecular, C₄H₉Cl, pero el cloro está en una posición distinta de la cadena.',
   q:'¿Qué tipo de isómeros son?',o:['Isómeros de posición','Isómeros de cadena','Isómeros de función','Isómeros cis/trans']},
  {a:'nom',c:'ind',k:'Q',ctx:'Para saber si el 2-clorobutano (CH₃−CHCl−CH₂−CH₃) tiene un carbono quiral, un estudiante examina los cuatro grupos unidos al carbono que lleva el cloro.',
   q:'¿Cuáles son esos cuatro grupos, y son todos diferentes entre sí?',o:['Cl, H, CH₃ y CH₂CH₃: los cuatro son diferentes, así que ese carbono sí es quiral','Cl, H, CH₃ y CH₃: dos de los grupos son iguales, así que no es quiral','Cl, Cl, H y CH₃: hay dos cloros, así que no puede ser quiral','H, H, CH₃ y CH₂CH₃: hay dos hidrógenos, así que no es quiral']}
 ],
 reacciones:[
  {a:'rx',c:'uso',k:'Q',ctx:'CH₂=CH₂ + H₂O → CH₃−CH₂−OH (con H₂SO₄ como catalizador)',
   q:'¿Qué tipo de reacción es?',o:['Adición','Sustitución','Eliminación','Esterificación']},
  {a:'rx',c:'uso',k:'Q',ctx:'CH₃−CH₂−OH → CH₂=CH₂ + H₂O (con H₂SO₄ concentrado y calor)',
   q:'¿Qué tipo de reacción es?',o:['Eliminación (deshidratación)','Adición (hidratación)','Sustitución nucleofílica','Combustión']},
  {a:'rx',c:'ind',k:'CTS',ctx:'En la preparación tradicional de la chicha y el guarapo, las levaduras transforman azúcares en etanol: C₆H₁₂O₆ → 2 C₂H₅OH + 2 CO₂.',
   q:'¿Qué observación indica que esta reacción está ocurriendo?',o:['El desprendimiento de burbujas de gas en la mezcla','La aparición de un espejo de plata en el recipiente','El cambio de la mezcla a un color azul intenso','La formación de un sólido blanco cuando la mezcla se enfría']},
  {a:'rx',c:'exp',k:'CTS',ctx:'Cuando el vino o el guarapo se avinagran, el etanol (CH₃−CH₂−OH) se transforma en ácido etanoico (CH₃−COOH).',
   q:'¿Qué tipo de reacción ocurre en el carbono que lleva el −OH?',o:['Oxidación: el carbono gana enlaces con oxígeno y pierde enlaces con hidrógeno','Reducción: el carbono gana enlaces con hidrógeno','Adición de agua a un doble enlace','Hidrólisis de un éster']},
  {a:'rx',c:'uso',k:'Q',ctx:'CH₃−COOH + CH₃−OH ⇌ ? + H₂O (con H₂SO₄ como catalizador)',
   q:'¿Cuál es el producto orgánico de esta esterificación?',o:['etanoato de metilo','metanoato de etilo','etanoato de etilo','metoxietano']},
  {a:'rx',c:'exp',k:'Q',ctx:'En la cloración del metano con luz, el enlace Cl−Cl se rompe de modo que cada átomo de cloro se queda con uno de los dos electrones del enlace.',
   q:'¿Cómo se llama este tipo de ruptura y qué especies forma?',o:['Ruptura homolítica; se forman radicales libres','Ruptura heterolítica; se forman los iones Cl⁺ y Cl⁻','Ruptura homolítica; se forman carbocationes','Ruptura heterolítica; se forman radicales libres']},
  {a:'rx',c:'exp',k:'CTS',ctx:'El polietileno de las bolsas se fabrica uniendo muchas moléculas de eteno (CH₂=CH₂).',
   q:'¿Qué tipo de reacción es y por qué las bolsas duran tanto tiempo en el ambiente?',o:['Polimerización por adición; el polímero solo tiene enlaces C−C y C−H muy estables, que los microorganismos degradan muy lentamente','Polimerización por condensación; el polímero libera agua que lo protege de los microorganismos','Combustión; el plástico ya está oxidado y no reacciona','Esterificación; los ésteres no se hidrolizan nunca']},
  {a:'rx',c:'ind',k:'Q',ctx:'Para estudiar cómo influye la temperatura en la rapidez de la esterificación, un grupo mezcla ácido etanoico, etanol y H₂SO₄ en tres tubos que mantiene a 20 °C, 40 °C y 60 °C.',
   q:'¿Qué deben mantener igual en los tres tubos?',o:['Las cantidades de reactivos y de catalizador, y el tiempo de reacción','La temperatura de los tres tubos','Solamente el tamaño de los tubos','Nada: cada tubo puede tener cantidades diferentes']},
  {a:'rx',c:'uso',k:'Q',ctx:'CH≡CH + 2 H₂ → CH₃−CH₃ (con catalizador de Ni o Pt)',
   q:'¿Qué tipo de reacción es?',o:['Adición (hidrogenación)','Sustitución','Eliminación','Oxidación']},
  {a:'rx',c:'uso',k:'Q',ctx:'CH₃−CH₂−Br + NaOH (en agua) → CH₃−CH₂−OH + NaBr',
   q:'¿Qué tipo de reacción es?',o:['Sustitución nucleofílica','Adición electrofílica','Eliminación','Esterificación']},
  {a:'rx',c:'exp',k:'CTS',ctx:'La elaboración tradicional de jabón consiste en calentar grasa o aceite con una solución concentrada de NaOH (soda cáustica).',
   q:'¿Qué tipo de reacción convierte la grasa (un éster) en jabón (una sal de ácido graso) y glicerina?',o:['Hidrólisis básica (saponificación): el NaOH rompe el enlace éster de la grasa','Esterificación: se forma un nuevo éster','Combustión: la grasa se oxida por completo','Adición: el NaOH se adiciona a un doble enlace de la grasa']},
  {a:'rx',c:'uso',k:'Q',ctx:'CH₃−CH₂−CHBr−CH₃ + KOH (en etanol, con calor) → CH₃−CH=CH−CH₃ + KBr + H₂O',
   q:'¿Qué tipo de reacción es?',o:['Eliminación','Adición','Sustitución nucleofílica','Esterificación']},
  {a:'rx',c:'uso',k:'Q',ctx:'La combustión del metano puede ser completa (CH₄ + 2 O₂ → CO₂ + 2 H₂O) o incompleta, cuando hay poco oxígeno disponible (2 CH₄ + 3 O₂ → 2 CO + 4 H₂O).',
   q:'¿Qué diferencia principal hay entre los productos de las dos reacciones?',o:['La combustión incompleta produce monóxido de carbono (CO), un gas tóxico, en vez de dióxido de carbono (CO₂)','La combustión incompleta no produce agua, solo gases de carbono','La combustión completa libera CO, que es menos tóxico que el CO₂','La combustión incompleta produce hollín en lugar de dióxido de carbono y agua']},
  {a:'rx',c:'ind',k:'CTS',ctx:'En la producción de biodiésel a partir de aceite de palma y metanol (con un catalizador básico), al terminar la reacción la mezcla se separa en dos capas: una de biodiésel (ésteres metílicos) y otra, más densa, de glicerina.',
   q:'¿Qué evidencia confirma que ocurrió la transesterificación y no solo una mezcla física de aceite y metanol?',o:['La aparición de glicerina como subproducto, que no estaba presente en los reactivos originales','Que el aceite y el metanol forman una sola capa al agitarlos','Que el aceite cambia de color al mezclarse con metanol','Que la mezcla se calienta un poco al agitarla']},
  {a:'rx',c:'uso',k:'Q',ctx:'CH₃−CH₂−COOH + CH₃−CH₂−OH ⇌ ? + H₂O (con H₂SO₄ como catalizador)',
   q:'¿Cuál es el producto orgánico principal de esta esterificación?',o:['propanoato de etilo','etanoato de propilo','propanoato de metilo','ácido etanoico']},
  {a:'rx',c:'uso',k:'Q',ctx:'CH₂=CH−CH₃ + HCl → CH₃−CHCl−CH₃ (producto principal)',
   q:'¿Qué tipo de reacción es?',o:['Adición electrofílica','Sustitución nucleofílica','Eliminación','Condensación']},
  {a:'rx',c:'uso',k:'CTS',ctx:'El etanol carburante que se mezcla con la gasolina en Colombia se produce en el Valle del Cauca fermentando el azúcar de la caña con levaduras, en tanques cerrados.',
   q:'¿Por qué esta reacción se clasifica como una fermentación y no simplemente como una combustión?',o:['Porque ocurre por la acción de microorganismos (levaduras) y sin necesidad de oxígeno del aire, a diferencia de la combustión','Porque libera la misma cantidad de energía que una combustión','Porque libera más energía que una combustión y por eso necesita levaduras para controlarla','Porque ocurre a temperatura alta, con llama, y los productos son solo gases']},
  {a:'rx',c:'exp',k:'Q',ctx:'En la esterificación entre un ácido carboxílico y un alcohol, el H₂SO₄ acelera la reacción, pero al final se recupera en la misma cantidad con la que se agregó.',
   q:'¿Qué papel cumple el H₂SO₄ en esta reacción?',o:['Actúa como catalizador: acelera la reacción sin consumirse en el proceso','Actúa como reactivo: se consume y forma parte del producto final','Actúa únicamente como disolvente','Actúa como producto de la reacción']},
  {a:'rx',c:'ind',k:'Q',ctx:'Un grupo quiere saber si el agua de bromo se decolora más rápido cuando hay más alqueno. Usa dos tubos con la misma cantidad de agua de bromo, a la misma temperatura; en uno pone 1 mL de ciclohexeno y en el otro, 3 mL.',
   q:'¿Qué variable cambian a propósito y qué deben medir?',o:['Cambian la cantidad de ciclohexeno y deben medir el tiempo que tarda en desaparecer el color del bromo','Cambian la temperatura y deben medir la cantidad de ciclohexeno que queda','Cambian la cantidad de agua de bromo y deben medir el volumen final','Cambian el tipo de alqueno y deben medir la masa de cada tubo']},
  {a:'rx',c:'uso',k:'Q',ctx:'CH₃−CH₂−OH → CH₃−CHO (con un oxidante suave y controlado)',
   q:'¿Qué tipo de reacción es, respecto al carbono que lleva el −OH?',o:['Oxidación: ese carbono gana un enlace con oxígeno y pierde un enlace con hidrógeno','Reducción: ese carbono gana un enlace con hidrógeno y pierde uno con oxígeno','Sustitución: el −OH es reemplazado por un átomo de hidrógeno','Eliminación: se pierde agua y se forma un doble enlace C=C']}
 ]
};

/* Preguntas abiertas: banco específico de tres tipos, para que la parte
   abierta de la evaluación mida lo que se trabaja en el sitio:
   t:'rx'   resultado de una reacción (producto, nombre y tipo de reacción)
   t:'nom'  nomenclatura (nombrar una estructura dibujada o dibujar un nombre)
   t:'mdec' identificar las partes del nombre con el método MDEC
            (① sustituyentes, ② cadena principal, ③ insaturaciones,
            ④ grupo funcional) y dibujar la estructura.
   f: fórmula que se dibuja con el motor del Generador; n: nombre (mdec). */
var ABIERTAS={
 carbono:[
  {t:'con',q:'Escribe la configuración electrónica del carbono en estado fundamental y excitado, y explica para qué sirve la promoción de un electrón.'},
  {t:'con',q:'Indica la hibridación, la geometría y el ángulo de enlace de cada carbono en CH₂=CH−C≡CH.'},
  {t:'con',q:'Cuenta los enlaces σ y π del propeno (CH₂=CH−CH₃) y explica la diferencia entre ambos tipos de enlace.'}],
 tipos_carbono:[
  {t:'con',q:'Dibuja la estructura CH₃−C(CH₃)₂−CH₂−CH(CH₃)−CH₃ y clasifica cada uno de sus carbonos.'},
  {t:'con',q:'Dibuja un alcohol primario, uno secundario y uno terciario, y explica cómo los reconociste.'},
  {t:'con',q:'Dibuja una molécula de 5 carbonos que tenga un carbono cuaternario. ¿Cuántos carbonos primarios tiene?'}],
 cadenas:[
  {t:'con',q:'Clasifica según su forma, sus enlaces y sus átomos: a) CH₃−CH=CH−CH₃; b) CH₃−NH−CH₂−CH₃; c) ciclohexano; d) benceno.'},
  {t:'con',q:'Dibuja una cadena abierta, ramificada, insaturada y homogénea, y explica cada criterio.'},
  {t:'con',q:'Explica con un dibujo por qué una cadena en forma de U puede seguir siendo lineal.'}],
 cadena:[
  {t:'nom',q:'Escribe el nombre IUPAC del compuesto. Marca la cadena principal y explica por qué numeraste desde ese extremo.',f:'CH₃−CH(CH₃)−CH₂−CH(C₂H₅)−CH₂−CH₃'},
  {t:'nom',q:'Escribe el nombre IUPAC del compuesto y justifica la numeración.',f:[{h:3},{h:0,bu:CH3,bd:CH3},{h:2},{h:2},{h:1,bd:CH3},{h:3}]},
  {t:'nom',q:'Dibuja la fórmula semidesarrollada del 3-etil-2-metilhexano y encierra la cadena principal.'},
  {t:'nom',q:'Un compañero nombró un compuesto como «2-etilpentano». Dibuja la estructura que imaginó, explica cuál es el error y escribe el nombre correcto.'},
  {t:'mdec',n:'3-etil-2-metilhexano'},
  {t:'mdec',n:'3,3-dietilpentano'},
  {t:'rx',q:'Escribe la ecuación balanceada de la combustión completa del 2,2,4-trimetilpentano (C₈H₁₈), el compuesto de referencia del octanaje de la gasolina.'},
  {t:'rx',q:'El 2-metilpropano reacciona con Br₂ en presencia de luz. Dibuja y nombra el producto monobromado principal y explica por qué se forma ese.'}],
 alcanos:[
  {t:'rx',q:'CH₄ + Cl₂ → ? (con luz). Escribe los productos de la monocloración, nómbralos y di qué tipo de reacción es.'},
  {t:'rx',q:'Escribe la ecuación balanceada de la combustión completa del propano y la de su combustión incompleta (cuando se forma CO).'},
  {t:'rx',q:'CH₃−CH₂−CH₃ + Br₂ → ? (con luz). Dibuja y nombra el producto monobromado principal.'},
  {t:'rx',q:'El ciclopropano reacciona con HBr y su anillo se abre. Escribe la estructura del producto y nómbralo.'},
  {t:'nom',q:'Escribe el nombre IUPAC del compuesto.',f:'CH₃−CH₂−CH₂−CH(CH₃)−CH₃'},
  {t:'nom',q:'Dibuja la fórmula del metilciclohexano y la del 1,3-dimetilciclopentano.'},
  {t:'mdec',n:'2,3-dimetilbutano'},
  {t:'mdec',n:'3-etil-3-metilheptano'}],
 alquenos:[
  {g:'alquenos',t:'rx',q:'CH₃−CH=CH₂ + HBr → ? Escribe el producto principal, nómbralo y explica por qué el Br queda en ese carbono.'},
  {g:'alquenos',t:'rx',q:'CH₂=CH₂ + Br₂ → ? Escribe y nombra el producto. ¿Qué cambio de color observarías en el laboratorio?'},
  {g:'alquenos',t:'rx',q:'CH₃−CH=CH₂ + H₂O → ? (con H⁺ como catalizador). Escribe y nombra el producto principal.'},
  {g:'alquinos',t:'rx',q:'HC≡CH + 2 HBr → ? Aplica la regla de Markovnikov en cada adición. Escribe la estructura y el nombre del producto final.'},
  {g:'alquinos',t:'rx',q:'CH₃−C≡C−CH₃ + H₂ → ? (con catalizador de Lindlar: los dos H se adicionan por el mismo lado). Dibuja y nombra el producto e indica si es cis o trans.'},
  {g:'alquenos',t:'nom',q:'Escribe el nombre IUPAC del compuesto.',f:'CH₃−CH=C(CH₃)−CH₂−CH₃'},
  {g:'ambos',t:'nom',q:'Dibuja la fórmula semidesarrollada del 4-metilpent-2-ino y la del 2-metilbut-2-eno.'},
  {g:'alquenos',t:'mdec',n:'4-metilpent-1-eno'},
  {g:'alquinos',t:'mdec',n:'3-metilbut-1-ino'}],
 aromaticos:[
  {t:'rx',q:'Benceno + Br₂ → ? (con FeBr₃). Dibuja y nombra el producto orgánico e indica el subproducto.'},
  {t:'rx',q:'Benceno + HNO₃ → ? (con H₂SO₄). Dibuja y nombra el producto y escribe cuál es el electrófilo que ataca el anillo.'},
  {t:'rx',q:'Benceno + CH₃Cl → ? (con AlCl₃). Dibuja y nombra el producto y di qué tipo de reacción es.'},
  {t:'rx',q:'Tolueno + KMnO₄ → ? (con calor; el oxidante fuerte convierte la cadena lateral en −COOH). Dibuja y nombra el producto.'},
  {t:'nom',q:'Dibuja y nombra los tres isómeros del dimetilbenceno e indica cuál es orto, cuál meta y cuál para.'},
  {t:'nom',q:'Dibuja la estructura de: a) etilbenceno; b) 1,3-dinitrobenceno; c) 1-cloro-4-metilbenceno.'},
  {t:'mdec',n:'1-bromo-3-etilbenceno'},
  {t:'mdec',n:'1-etil-4-nitrobenceno'}],
 haluros:[
  {t:'rx',q:'CH₃−CH₂−Br + NaOH (en agua) → ? Escribe y nombra el producto orgánico y di qué tipo de reacción es.'},
  {t:'rx',q:'CH₃−CHBr−CH₃ + KOH (en etanol, con calor) → ? Escribe y nombra el producto orgánico y di qué tipo de reacción es.'},
  {t:'rx',q:'(CH₃)₃C−Br + H₂O → ? Escribe y nombra el producto orgánico y explica por qué esta sustitución ocurre en dos pasos (mecanismo SN1, con un carbocatión intermedio).'},
  {t:'rx',q:'CH₃−Br + NaCN → ? (el ion CN⁻ es el nucleófilo que reemplaza al Br). Escribe y nombra el producto orgánico. ¿Cuántos carbonos tiene ahora la cadena?'},
  {t:'nom',q:'Escribe el nombre IUPAC del compuesto y clasifícalo como haluro primario, secundario o terciario.',f:'CH₂Br−CH(CH₃)−CH₃'},
  {t:'nom',q:'Dibuja la fórmula semidesarrollada del 2-bromo-3-metilpentano y la del 1,1-dicloroetano.'},
  {t:'mdec',n:'1-cloro-3-metilbutano'},
  {t:'mdec',n:'2-bromo-2-metilbutano'}],
 alcoholes:[
  {g:'alcoholes',t:'rx',q:'CH₃−CH₂−CH₂−OH con PCC (clorocromato de piridinio, oxidante suave) → ? y con CrO₃/H⁺ (oxidante fuerte) → ? Escribe y nombra el producto de cada caso.'},
  {g:'alcoholes',t:'rx',q:'CH₃−CH(OH)−CH₃ + CrO₃/H⁺ → ? Escribe y nombra el producto. ¿Qué pasaría con el 2-metilpropan-2-ol? Explica.'},
  {g:'alcoholes',t:'rx',q:'CH₃−CH₂−OH → ? (con H₂SO₄ a 180 °C). Escribe y nombra el producto orgánico y di qué tipo de reacción es.'},
  {g:'alcoholes',t:'rx',q:'CH₃−CH₂−OH + HBr → ? (el −OH se sustituye por el halógeno). Escribe y nombra el producto orgánico.'},
  {g:'alcoholes',t:'rx',q:'CH₃−COOH + CH₃−CH₂−OH → ? (con H⁺). Escribe y nombra el éster que se forma.'},
  {g:'alcoholes',t:'nom',q:'Escribe el nombre IUPAC del compuesto.',f:'CH₃−CH₂−CH(OH)−CH(CH₃)−CH₃'},
  {g:'ambos',t:'nom',q:'Dibuja la estructura del butan-2-ol, del fenol y del metoxietano.'},
  {g:'alcoholes',t:'mdec',n:'2-metilbutan-2-ol'},
  {g:'alcoholes',t:'mdec',n:'3-metilbutan-1-ol'}],
 carbonilos:[
  {g:'aldehidos',t:'rx',q:'CH₃−CHO + HCN → ? Escribe y nombra el producto (una cianohidrina).'},
  {g:'cetonas',t:'rx',q:'CH₃−CO−CH₃ + NaBH₄ (y luego agua) → ? Escribe y nombra el producto y di si es un alcohol 1°, 2° o 3°.'},
  {g:'aldehidos',t:'rx',q:'CH₃−CHO + CH₃MgBr (y luego H₃O⁺) → ? Escribe y nombra el alcohol que se obtiene.'},
  {g:'ambos',t:'rx',q:'Un tubo con etanal y otro con propanona se calientan con reactivo de Tollens. ¿En cuál aparece espejo de plata? Escribe el producto orgánico de esa reacción (el aldehído se oxida a ácido, que en el medio básico del reactivo queda como ion carboxilato).'},
  {g:'cetonas',t:'nom',q:'Escribe el nombre IUPAC del compuesto.',f:'CH₃−CH₂−CO−CH(CH₃)−CH₃'},
  {g:'ambos',t:'nom',q:'Dibuja la estructura del butanal, de la butanona y del 3-metilbutanal.'},
  {g:'cetonas',t:'mdec',n:'5-metilhexan-3-ona'},
  {g:'aldehidos',t:'mdec',n:'2-metilbutanal'}],
 acidos:[
  {g:'acidos',t:'rx',q:'CH₃−COOH + NaOH → ? Escribe y nombra los productos.'},
  {g:'esteres',t:'rx',q:'CH₃−CH₂−COOH + CH₃−OH → ? (con H⁺). Escribe y nombra el éster que se forma.'},
  {g:'esteres',t:'rx',q:'CH₃−COO−CH₂−CH₃ + NaOH → ? Escribe y nombra los productos de esta saponificación.'},
  {g:'acidos',t:'rx',q:'CH₃−CH₂−CH₂−OH + CrO₃/H⁺ (en exceso) → ? Escribe y nombra el ácido que se obtiene.'},
  {g:'acidos',t:'nom',q:'Escribe el nombre IUPAC del compuesto.',f:'CH₃−CH₂−CH(CH₃)−COOH'},
  {g:'ambos',t:'nom',q:'Dibuja la estructura del ácido 2-metilpropanoico y la del etanoato de metilo.'},
  {g:'acidos',t:'mdec',n:'ácido 3,3-dimetilbutanoico'},
  {g:'acidos',t:'mdec',n:'ácido 2-metilpentanoico'}],
 nitrogenados:[
  {g:'aminas',t:'rx',q:'CH₃−NH₂ + HCl → ? Escribe y nombra el producto y explica por qué la amina actúa como base.'},
  {g:'amidas',t:'rx',q:'CH₃−CO−NH₂ + H₂O → ? (con H⁺ y calor: hidrólisis de la amida). Escribe y nombra los productos.'},
  {g:'amidas',t:'rx',q:'CH₃−COCl + 2 NH₃ → ? Escribe y nombra los productos.'},
  {g:'amidas',t:'rx',q:'CH₃−CO−NH₂ + LiAlH₄ (y luego agua) → ? Escribe y nombra el producto.'},
  {g:'amidas',t:'nom',q:'Escribe el nombre IUPAC del compuesto.',f:'CH₃−CH(CH₃)−CO−NH₂'},
  {g:'ambos',t:'nom',q:'Dibuja la estructura de la propan-1-amina, de la N-metiletanamina y del propanonitrilo.'},
  {g:'amidas',t:'mdec',n:'3-metilbutanamida'},
  {g:'nitrilos',t:'mdec',n:'butanonitrilo'}],
 polifuncionales:[
  {t:'rx',q:'CH₃−CO−CH₂−CH₂−CH₂−OH + NaBH₄ (y luego agua) → ? Escribe y nombra el producto.'},
  {t:'rx',q:'El ácido láctico, CH₃−CH(OH)−COOH, reacciona con NaOH. Escribe y nombra la sal que se forma.'},
  {t:'rx',q:'CH₃−CH(OH)−COOH + CH₃−CH₂−OH → ? (con H⁺). Escribe y nombra el éster que se forma.'},
  {t:'nom',q:'Escribe el nombre IUPAC del compuesto. Indica cuál es el grupo principal y por qué.',f:'CH₃−CO−CH₂−CH₂−CH₂−OH'},
  {t:'nom',q:'Escribe el nombre IUPAC del compuesto. Indica cuál grupo va como prefijo y cuál como sufijo.',f:'CH₃−CH(OH)−CH₂−COOH'},
  {t:'nom',q:'Dibuja la estructura del ácido 2-aminopropanoico (alanina) y señala cuál de sus grupos da el sufijo del nombre.'},
  {t:'mdec',n:'ácido 3-aminobutanoico'},
  {t:'mdec',n:'5-hidroxihexan-2-ona'}],
 isomeria:[
  {t:'nom',q:'Dibuja y nombra los tres isómeros estructurales de fórmula C₅H₁₂.'},
  {t:'nom',q:'Dibuja y nombra los isómeros cis y trans del but-2-eno.'},
  {t:'nom',q:'Dibuja y nombra un alcohol y un éter de fórmula C₃H₈O.'},
  {t:'nom',q:'Dibuja y nombra un aldehído y una cetona de fórmula C₄H₈O. ¿Qué tipo de isómeros son?'},
  {t:'rx',q:'CH₃−C≡C−CH₃ + H₂ con catalizador de Lindlar → ? y con Na en NH₃ líquido → ? Dibuja los dos productos e indica cuál es cis y cuál trans.'},
  {t:'rx',q:'El but-1-eno reacciona con HBr. Dibuja el producto principal, nómbralo y marca con un asterisco (*) su carbono quiral.'},
  {t:'mdec',n:'2,2-dimetilpropano'},
  {t:'mdec',n:'pent-2-eno'}],
 reacciones:[
  {t:'rx',q:'CH₄ + Cl₂ → ? (con luz). Escribe los productos y di qué tipo de reacción es.'},
  {t:'rx',q:'CH₂=CH₂ + H₂O → ? (con H⁺). Escribe y nombra el producto y di qué tipo de reacción es.'},
  {t:'rx',q:'CH₃−CH₂−OH → ? (con H₂SO₄ a 180 °C). Escribe y nombra el producto orgánico y di qué tipo de reacción es.'},
  {t:'rx',q:'CH₃−CH₂−OH + CrO₃/H⁺ → ? Escribe y nombra el producto final y di qué tipo de reacción es.'},
  {t:'rx',q:'Benceno + Br₂ → ? (con FeBr₃). Escribe y nombra el producto y explica por qué es una sustitución y no una adición.'},
  {t:'rx',q:'CH₃−COOH + CH₃−OH → ? (con H⁺). Escribe y nombra el éster y di qué tipo de reacción es.'},
  {t:'nom',q:'Escribe el nombre del producto orgánico de cada reacción: a) propeno + HBr; b) propan-2-ol + CrO₃/H⁺.'},
  {t:'mdec',n:'2-cloro-2-metilpropano'}]
};

window.DOCENTE_DATOS={ALINEACION:ALINEACION,TEMAS:TEMAS,SABER:SABER,ABIERTAS:ABIERTAS};
})();
