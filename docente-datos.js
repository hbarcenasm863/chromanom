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
      {id:'10q-ind1',comp:'Indagación',t:'Evalúa los conceptos de acidez y basicidad y su importancia en reacciones químicas y procesos biológicos, mediante experimentos sencillos controlados que evidencien cambios en el pH y sus efectos.'},
      {id:'10q-ind2',comp:'Indagación',t:'Interpreta las ecuaciones químicas considerando la ley de conservación de la masa y la carga con ejemplos de la vida cotidiana y calcula las proporciones de reactivos y productos involucrados.'},
      {id:'10q-ind3',comp:'Indagación',t:'Evalúa el impacto de alimentos y productos ácidos y básicos en el pH del cuerpo humano en relación con los recursos naturales del contexto local, utilizando estudios comparativos y análisis de datos experimentales.'},
      {id:'10q-exp1',comp:'Explicación de fenómenos',t:'Establece la estructura atómica y la discontinuidad de la materia para explicar las propiedades de los elementos y cómo su distribución determina la formación de compuestos, a través de modelos atómicos visuales que muestren la organización de los electrones.'},
      {id:'10q-exp2',comp:'Explicación de fenómenos',t:'Aplica el conocimiento de las propiedades periódicas de los elementos para predecir su comportamiento químico, desarrollando predicciones sobre reactividad y enlace químico en casos específicos para justificar sus resultados.'},
      {id:'10q-exp3',comp:'Explicación de fenómenos',t:'Analiza los diferentes tipos de enlaces químicos y su importancia en la formación de compuestos, identificando ejemplos de compuestos con distintos tipos de enlaces en contextos naturales y sintéticos.'},
      {id:'10q-exp4',comp:'Explicación de fenómenos',t:'Evalúa el impacto de alimentos y productos ácidos y básicos en el pH del cuerpo humano, a través de estudios de casos sobre sus efectos en la salud y el medio ambiente.'},
      {id:'10q-uso1',comp:'Uso comprensivo del conocimiento científico',t:'Aplica las reglas de nomenclatura inorgánica para los compuestos químicos, realizando ejercicios de nomenclatura para identificar y nombrar compuestos complejos.'},
      {id:'10q-uso2',comp:'Uso comprensivo del conocimiento científico',t:'Evalúa la relación proporcional de la cantidad de sustancia de reactivos y productos en una reacción química, teniendo en cuenta la ley de conservación de la masa y la carga, mediante el análisis y resolución de ejercicios estequiométricos.'},
      {id:'10q-uso3',comp:'Uso comprensivo del conocimiento científico',t:'Desarrolla los principios de estequiometría para explicar procesos industriales, a través de experimentos prácticos, donde se evalúe la cantidad de productos o reactivos necesarios.'}
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
    {id:'est3',t:'Explico algunos cambios químicos que ocurren en el ser humano.',nota:'no verificado: verificar redacción oficial (MEN, 2004)'},
    {id:'est4',t:'Relaciono la estructura de las moléculas orgánicas e inorgánicas con sus propiedades físicas y químicas y su capacidad de cambio químico.',nota:'verificar redacción oficial (MEN, 2004)'},
    {id:'est5',t:'Identifico cambios químicos en la vida cotidiana y en el ambiente.',nota:'verificar redacción oficial (MEN, 2004)'}
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
   'El diamante y el grafito son carbono puro. Investiga y explica su diferencia a partir de la hibridación de sus carbonos.',
   'Dibuja el carbono central de la propanona (CH₃−CO−CH₃) y explica por qué tiene hibridación sp², igual que un carbono con doble enlace C=C.',
   'Explica con tus palabras la regla rápida para hallar la hibridación de un carbono a partir de cuántos átomos tiene unidos, y aplícala a los tres carbonos del propino (CH₃−C≡CH).'
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
   '¿Cuántos hidrógenos tiene un carbono terciario en un alcano? Explica por qué.',
   {q:'Clasifica cada carbono de esta molécula (el 3-etilpentano) como primario, secundario o terciario.',f:'CH₃−CH₂−CH(CH₂−CH₃)−CH₂−CH₃'},
   'Explica por qué la clasificación de un carbono (primario, secundario, terciario o cuaternario) no cambia aunque esté unido a un átomo de cloro o a un grupo −OH en vez de a un hidrógeno.'
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
   lectura:['Las cadenas carbonadas se clasifican con un mapa que va de lo general a lo particular. Primero se decide si son alifáticas (sin anillo tipo benceno) o aromáticas (con anillo tipo benceno). Según la IUPAC, alifático es todo lo que no es aromático, sea de cadena abierta o cerrada.',
     'Las alifáticas pueden ser acíclicas (cadena abierta, con dos extremos), que son lineales o ramificadas y saturadas (solo enlaces sencillos) o insaturadas (con dobles o triples). O cíclicas (cadena cerrada, alicíclicas): homogéneas, si el anillo es solo de carbonos, o heterogéneas, si tiene O, N o S dentro del anillo; sencillas o ramificadas; saturadas o insaturadas.',
     'Las aromáticas son mononucleares (un solo anillo, como el benceno y el tolueno) o polinucleares (varios anillos): condensadas, si comparten un lado (naftaleno, antraceno), o aisladas, si están unidas por un enlace (bifenilo).',
     'Doblar el dibujo no ramifica una cadena: el zigzag es su forma real por los 109,5° del carbono sp³. Un −OH, −NH₂ o −Cl al final de la cadena o colgado de un anillo no la hace heterogénea: solo cuenta un heteroátomo dentro de la cadena o del anillo.'],
   esquema:{raiz:'Cadenas carbonadas',ramas:[
     {t:'Alifáticas',items:['Acíclicas: lineales o ramificadas','Cíclicas: homogéneas o heterogéneas, sencillas o ramificadas']},
     {t:'Aromáticas',items:['Mononucleares: sencillas o ramificadas','Polinucleares: condensadas o aisladas']},
     {t:'Enlaces',items:['Saturada: solo sencillos','Insaturada: dobles o triples']}]}
  },
  ejemplo:{pares:[{f:'3-metilbut-1-eno, C₅H₁₀',n:'alifática, acíclica, ramificada e insaturada'},{f:'Tetrahidrofurano, C₄H₈O',n:'alifática, cíclica, heterogénea, sencilla y saturada'},{f:'Naftaleno, C₁₀H₈',n:'aromática, polinuclear condensada'}],nota:'Una cadena se clasifica siguiendo el mapa: alifática o aromática, su forma, los átomos del anillo, sus ramas y sus enlaces.'},
  abiertos:[
   'Dibuja un ejemplo de cada una: alifática acíclica lineal, acíclica ramificada, cíclica homogénea, cíclica heterogénea, aromática mononuclear y aromática polinuclear.',
   'Clasifica siguiendo el mapa: a) propano; b) but-1-eno; c) metilpropano; d) ciclohexeno; e) tolueno; f) naftaleno.',
   'Explica por qué CH₃−CH₂−OH es una cadena homogénea y CH₃−O−CH₃ es heterogénea.',
   'Un estudiante dice que una cadena dibujada en zigzag es ramificada. ¿Tiene razón? Explica.',
   'El hexano es C₆H₁₄ y el ciclohexano C₆H₁₂. Explica por qué el anillo tiene dos hidrógenos menos.',
   'Dibuja una cadena cerrada heterocíclica y señala su heteroátomo.',
   'Explica por qué una cadena puede ser insaturada sin ser abierta, y da un ejemplo de una cadena cerrada e insaturada a la vez.',
   'La cafeína tiene dos anillos fusionados con nitrógeno dentro del ciclo. ¿Cómo se clasifican esos anillos según sus átomos? Explica.'
  ],
  propia:[]},

 {id:'cadena',titulo:'Cadena principal, numeración y desempate',corto:'Cadena principal y desempate',
  gen:['alcanos'],jue:/cadena|desempate|error|^principios$/i,rxn:[],soloRamificados:true,nomenclatura:true,saberJue:/^principios$/,
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
  abiertos:[
   'Dibuja la estructura del 2,3-dimetilpentano y marca con un color la cadena principal.',
   {q:'Escribe el nombre IUPAC del compuesto, explicando por qué extremo numeraste.',f:'CH₃−CH₂−CH(CH₃)−CH₂−CH₂−CH₃'},
   'Un estudiante nombra una molécula «2,2-dietilbutano». Dibuja la estructura que describe ese nombre y verifica si realmente tiene una cadena de 4 carbonos como cadena más larga, o si debería nombrarse de otra forma.',
   {q:'Clasifica la cadena principal del compuesto por su forma (abierta lineal o ramificada) y cuenta cuántos carbonos primarios, secundarios y terciarios tiene.',f:'CH₃−CH(CH₃)−CH₂−CH₂−CH₃'},
   'Escribe los nombres IUPAC de los 5 isómeros de cadena del hexano (C₆H₁₄) y dibuja cada uno.',
   'Un compañero afirma que «3-metilhexano» y «4-metilhexano» son dos compuestos diferentes. ¿Tiene razón? Dibuja ambas estructuras y decide, aplicando la regla del localizador más bajo.'
  ],
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
  gen:['alcanos'],jue:/^alcanos$|cicloalc/i,rxn:['alcanos'],nomenclatura:true,saberJue:/^cicloalcanos$/,
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
  abiertos:[
   {q:'Escribe el nombre IUPAC del compuesto y clasifica cada uno de sus carbonos como primario, secundario, terciario o cuaternario.',f:'CH₃−C(CH₃)₂−CH₂−CH₃'},
   'Dibuja la estructura del ciclopentano y la del metilciclopentano, y escribe la fórmula molecular de cada uno.',
   'El gas natural (metano) y el GLP (propano y butano) se queman en las estufas de los hogares. Escribe la ecuación balanceada de la combustión completa de cada uno de los tres.',
   'Explica, usando la idea de las fuerzas de London, por qué el metano es gas, el hexano es líquido y la parafina (cadenas largas) es sólida a temperatura ambiente.',
   {q:'El 2,3-dimetilbutano reacciona con Cl₂ y luz. Identifica los tipos de carbono distintos que tiene esta molécula (sin contar los equivalentes por simetría) y predice cuántos productos monoclorados diferentes se pueden formar.',f:'CH₃−CH(CH₃)−CH(CH₃)−CH₃'},
   'Investiga y explica por qué los alcanos se consideran poco reactivos («parafinas», poca afinidad) en comparación con los alquenos y los alcoholes.'
  ],
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
  abiertos:[
   'Dibuja y nombra el alqueno y el alquino de 4 carbonos con el enlace múltiple en el primer carbono posible.',
   'CH₂=CH−CH₃ + H₂ → ? (con catalizador de Ni o Pt). Escribe y nombra el producto, y di qué tipo de reacción es.',
   'El but-2-ino reacciona con 2 moles de HBr. Escribe la ecuación y el producto final, aplicando la regla de Markovnikov en cada adición.',
   'Dibuja la estructura del penta-1,3-dieno y cuenta cuántos carbonos sp² y cuántos sp³ tiene.',
   'Explica por qué el 2-metilpropeno reacciona con HCl para dar mayoritariamente 2-cloro-2-metilpropano, usando el concepto de estabilidad de carbocationes.',
   'Calcula cuántos moles de Br₂ se necesitan para reaccionar completamente con 1 mol de hexa-1,3,5-trieno (3 dobles enlaces) y explica tu razonamiento.'
  ],
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
  abiertos:[
   'Dibuja la estructura del benceno mostrando los seis electrones π deslocalizados (puedes usar el círculo dentro del hexágono) y explica por qué no se comporta como un alqueno con tres dobles enlaces aislados.',
   'Dibuja y nombra el 1,3-diclorobenceno, e indica su posición relativa (orto/meta/para) usando la nomenclatura tradicional.',
   'Explica por qué el benceno da reacciones de sustitución electrofílica en vez de adición, a diferencia de un alqueno.',
   'Dibuja la estructura del tolueno (metilbenceno) y explica por qué el grupo −CH₃ es un sustituyente director orto/para.',
   'Investiga y explica por qué el benceno está clasificado como cancerígeno, y menciona una norma o medida que limite su uso.',
   'Compara el fenol (C₆H₅−OH) con un alcohol común como el etanol: ¿en qué se parecen y en qué se diferencian sus grupos −OH?'
  ],
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
  abiertos:[
   'Dibuja y nombra los cuatro haluros de butilo (usando Br como halógeno: 1-bromobutano, 2-bromobutano, 1-bromo-2-metilpropano y 2-bromo-2-metilpropano), y clasifica cada uno como primario, secundario o terciario.',
   {q:'CH₃−CH₂−CH₂−Cl + NaI → ? (el ion I⁻ es un buen nucleófilo y desplaza al Cl⁻). Escribe y nombra el producto orgánico.'},
   'Un haluro de alquilo con fórmula C₄H₉Br puede ser primario, secundario o terciario. Dibuja un ejemplo de cada tipo y nombra los tres.',
   'Explica, usando el concepto de grupo saliente, por qué el yoduro de metilo reacciona más rápido en sustitución nucleofílica que el fluoruro de metilo, aunque el flúor sea más electronegativo.',
   'CH₃−CH(Br)−CH₃ reacciona con NaOH en agua (sustitución) y, por separado, con KOH en etanol caliente (eliminación). Escribe los dos productos distintos que se obtienen en cada caso y explica la diferencia.',
   'Investiga qué es el Protocolo de Montreal y explica, en tus palabras, por qué los CFC se reemplazaron por HFC en los refrigerantes.'
  ],
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
  gen:['alcoholes','eteres'],jue:/^alcoholes$|^eteres$|fenol/i,rxn:['alcoholes','eteres'],nomenclatura:true,saberJue:/^fenoles$/,
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
  abiertos:[
   'Clasifica el propan-1-ol, el propan-2-ol y el 2-metilpropan-2-ol como alcohol primario, secundario o terciario, y explica tu criterio.',
   'Explica por qué el etanol se mezcla con el agua en cualquier proporción, pero el octan-1-ol casi no se disuelve en agua.',
   'Escribe el producto de la deshidratación del etanol con H₂SO₄ a 140 °C y a 180 °C. ¿Por qué cambia el producto con la temperatura?',
   'Dibuja la estructura del dietil éter (etoxietano) y explica por qué no forma puentes de hidrógeno entre sus propias moléculas, aunque sí se disuelve parcialmente en agua.',
   'Explica por qué el fenol es un ácido débil (reacciona con NaOH) mientras que un alcohol común, como el etanol, no.',
   'CH₃−CH₂−CH₂−OH se oxida con CrO₃/H⁺ en exceso. Escribe el producto final y explica por qué la reacción no se detiene en el aldehído.'
  ],
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
  abiertos:[
   'Dibuja y nombra el butanal y la butanona, y explica la diferencia estructural entre un aldehído y una cetona.',
   'Explica por qué las cetonas no dan positiva la prueba de Tollens ni la de Fehling, a diferencia de los aldehídos.',
   'CH₃−CH₂−CHO reacciona con reactivo de Tollens. Escribe la ecuación y describe qué observarías en el tubo de ensayo.',
   'Explica por qué el NaBH₄ reduce el grupo carbonilo (C=O) de una cetona, pero no afecta un doble enlace C=C en la misma molécula.',
   'Dibuja la estructura de la pentano-2,4-diona y explica por qué su nombre necesita dos localizadores.',
   'Un estudiante dice que la propanona (acetona) y el propanal tienen la misma fórmula molecular. Verifica si es cierto y, si lo es, indica qué tipo de isómeros son.'
  ],
  propia:[]},

 {id:'acidos',titulo:'Ácidos carboxílicos y ésteres',corto:'Ácidos y ésteres',
  gen:['acidos','esteres'],jue:/^acidos$|^esteres$|^derivados_acido$/i,rxn:['acidos','esteres'],nomenclatura:true,saberJue:/^derivados_acido$/,
  grupos:[{id:'acidos',t:'Ácidos carboxílicos',jue:/^acidos$/i},{id:'derivados_acido',t:'Haluros de ácido y anhídridos',jue:/^derivados_acido$/i},{id:'esteres',t:'Ésteres',jue:/^esteres$/i}],
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
  abiertos:[
   'Escribe la ecuación de la esterificación de Fischer entre el ácido metanoico y el etanol, con H⁺ como catalizador. Nombra el éster que se forma.',
   'Explica por qué los ácidos carboxílicos tienen puntos de ebullición más altos que los alcoholes de tamaño parecido, usando el concepto de dímero unido por dos puentes de hidrógeno.',
   'Dibuja y nombra el ácido carboxílico y el alcohol que se obtienen al hidrolizar (con agua y H⁺) el propanoato de metilo.',
   'El ácido butanodioico (ácido succínico), HOOC−CH₂−CH₂−COOH, reacciona con NaOH en exceso. Escribe la ecuación y nombra la sal que se forma.',
   {q:'Escribe el nombre IUPAC del compuesto y dibuja por separado el ácido y el alcohol de los que proviene.',f:'CH₃−CH₂−CH₂−COO−CH₂−CH₃'},
   'El cloruro de etanoílo (CH₃−COCl) reacciona con etanol. Escribe la ecuación y nombra el producto orgánico.'
  ],
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
  abiertos:[
   'CH₃−CH₂−C≡N + H₂O (con H⁺ y calor) → ? Escribe y nombra los productos de esta hidrólisis del nitrilo (se forma un ácido carboxílico).',
   {q:'Escribe el nombre IUPAC del compuesto y clasifícalo como amina primaria, secundaria o terciaria.',f:'CH₃−CH₂−NH−CH₂−CH₂−CH₃'},
   'La trimetilamina, (CH₃)₃N, es responsable del olor a pescado. Dibuja su estructura y explica por qué actúa como base en presencia de un ácido.',
   'CH₃−CH₂−CO−NH−CH₃ es una amida N-sustituida. Escribe su nombre IUPAC completo.',
   'Dibuja y nombra el nitrilo que se forma al deshidratar la propanamida (CH₃−CH₂−CO−NH₂), perdiendo una molécula de agua.',
   'La trietilamina, (CH₃CH₂)₃N, reacciona con HCl. Escribe la ecuación y nombra el producto (una sal de amina).'
  ],
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
  abiertos:[
   'Dibuja la estructura del ácido acetilsalicílico (aspirina): un anillo de benceno con un grupo −COOH y, en el carbono vecino, un grupo −O−CO−CH₃. Señala cuál de sus grupos funcionales da el sufijo del nombre.',
   {q:'Escribe el nombre IUPAC del compuesto.',f:'HO−CH₂−CH₂−CH₂−C≡N'},
   'La treonina, otro aminoácido de las proteínas, es CH₃−CH(OH)−CH(NH₂)−COOH. Escribe su nombre IUPAC completo, indicando cuál grupo da el sufijo y cuáles van como prefijos.',
   'El ácido 4-oxopentanoico, CH₃−CO−CH₂−CH₂−COOH, tiene un grupo cetona y un grupo ácido. Dibuja su estructura y explica por qué el ácido da el sufijo y la cetona se nombra con el prefijo oxo-.',
   {q:'Escribe el nombre IUPAC del compuesto.',f:'CH₂(NH₂)−CH₂−CH₂−OH'},
   'Compara el ácido 3-hidroxibutanoico y la 4-hidroxibutan-2-ona: los dos tienen un grupo −OH y un grupo con oxígeno doblemente enlazado. Dibuja ambas estructuras y explica por qué una termina en «-oico» y la otra en «-ona».'
  ],
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
     'Quiralidad: un carbono unido a cuatro grupos diferentes es un carbono quiral (estereocentro). La molécula y su imagen en el espejo no se superponen: son enantiómeros, como la mano derecha y la izquierda. Tienen las mismas propiedades físicas (salvo el sentido en que desvían la luz polarizada), pero pueden actuar distinto en el cuerpo.',
     'Índice de deficiencia de hidrógeno (IDH), o grado de insaturación: cuenta cuántos anillos y/o enlaces π (dobles o triples) tiene una molécula a partir solo de su fórmula molecular, sin necesidad de dibujarla todavía. Se calcula como IDH = (2C + 2 + N − H) / 2, donde C es el número de carbonos, H el de hidrógenos (cada halógeno cuenta como si fuera un H) y N el de nitrógenos; el oxígeno no se cuenta, porque un −O− no cambia cuántos H puede llevar la cadena. Un IDH de 0 significa cadena abierta y saturada, sin anillos ni enlaces múltiples; cada unidad de IDH es un anillo o un enlace π —un triple enlace cuenta como 2 unidades, y un anillo aromático (benceno) cuenta como 4 (1 anillo + 3 π)—.',
     'Ejemplo: para C₄H₈, IDH = (2×4 + 2 − 8) / 2 = 1. Esa única insaturación puede ser un alqueno de cadena abierta (but-1-eno) o un cicloalcano (ciclobutano): el IDH dice cuántas insaturaciones hay en total, pero no de qué tipo son ni dónde están — eso hay que decidirlo dibujando la estructura.'],
   esquema:{raiz:'Isomería',ramas:[
     {t:'Estructural',items:['De cadena','De posición','De función']},
     {t:'Cis / trans',items:['El doble enlace no gira','Dos grupos distintos en cada C']},
     {t:'Quiralidad',items:['C con 4 grupos distintos','Enantiómeros: imágenes especulares']},
     {t:'IDH (grado de insaturación)',items:['IDH = (2C+2+N−H)/2','0 = saturado, sin anillos ni π','1 unidad = 1 anillo o 1 enlace π','Triple enlace = 2 unidades; benceno = 4']},
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
   'Indica qué tipo de isómeros son: a) butan-1-ol y butan-2-ol; b) butanal y butanona; c) pentano y 2,2-dimetilpropano.',
   'Dibuja y nombra dos isómeros de cadena de C₆H₁₄ distintos a los que ya conoces, e indica cuántos carbonos primarios tiene cada uno.',
   'Dibuja el ácido propanoico y el metanoato de etilo (ambos C₃H₆O₂) y explica por qué son isómeros de función.'
  ],
  propia:[]},

 {id:'reacciones',titulo:'Reacciones orgánicas (tipos y mecanismos básicos)',corto:'Reacciones orgánicas',
  gen:[],jue:/^tipos_reaccion$/,saberJue:true,rxn:['alcanos','alquenos','alquinos','benceno','halogenuros','alcoholes','eteres','aldehidos','cetonas','acidos','esteres','amidas','nitrilos','aminas'],nomenclatura:false,
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
  abiertos:[
   'Clasifica cada una de estas reacciones como sustitución, adición, eliminación u oxidorreducción: a) CH₂=CH₂ + HBr → CH₃−CH₂−Br; b) CH₃−CH₂−OH → CH₂=CH₂ + H₂O; c) CH₃−Cl + NaOH → CH₃−OH + NaCl; d) CH₃−CH₂−OH → CH₃−CHO.',
   'Explica la diferencia entre una ruptura homolítica y una heterolítica, con un ejemplo de cada una.',
   '¿Qué diferencia hay entre un reactivo nucleófilo y uno electrófilo? Da un ejemplo de cada uno.',
   'Escribe la ecuación de la esterificación entre el ácido etanoico y el etanol, y nombra el éster que se forma.',
   'Explica por qué la combustión incompleta de un hidrocarburo es más peligrosa que la completa, en términos de los productos que forma.',
   'Describe, paso a paso, qué le pasa a un alcohol primario cuando se oxida primero a aldehído y después a ácido carboxílico: qué enlaces se rompen y cuáles se forman en cada paso.'
  ],
  propia:[]},
 /* ── Fase 4 «Química de la vida y del ambiente» (temas-11.js). Sus preguntas
    de selección vienen del banco del Juego (saberJue). Cubren las evidencias
    de la SED para 11.º que el sitio no tenía: 11q-exp2, 11q-ind3, 11q-uso1 y
    11q-uso3, y la construcción del conocimiento (laboratorio de datos). ── */
 {id:'orbitales',titulo:'Orbitales moleculares y aromaticidad',corto:'Orbitales moleculares',
  gen:[],jue:/^orbitales_mol$/,rxn:[],nomenclatura:false,saberJue:true,
  alin:{g11:{sed:'sed11q',ev:['11q-exp2','11q-exp1']},g10:{sed:'sed10q',ev:['10q-exp3']},est:['est1','est4'],dba:['dba11a']},
  previos:{
   curiosos:['El oxígeno líquido queda «pegado» entre los polos de un imán: tiene electrones desapareados, algo que la estructura de Lewis no muestra.',
     'El color naranja de la zanahoria se debe a una molécula con 11 dobles enlaces seguidos, el β-caroteno.',
     'El benceno es unos 150 kJ/mol más estable de lo que se esperaría si tuviera tres dobles enlaces fijos.'],
   contexto:[{amb:'Local',t:'La ahuyama, el mango y la zanahoria deben su color a carotenos; el tomate y la guayaba, al licopeno.'},
     {amb:'Nacional',t:'La cúrcuma, que se cultiva en el Huila y el Meta, contiene curcumina, un colorante amarillo con un sistema de dobles enlaces conjugados.'},
     {amb:'Global',t:'Los colorantes de la industria textil y alimentaria se diseñan ajustando la conjugación de sus moléculas.'}],
   cotidianos:['Zanahoria','Tomate','Cúrcuma','Hojas verdes','Bolas de naftalina'],
   activacion:['¿Por qué crees que unas sustancias orgánicas tienen color y otras, como el alcohol o el agua, no?','Si un enlace doble es más fuerte que uno sencillo, ¿por qué el benceno, con «tres dobles enlaces», casi no reacciona como un alqueno?','¿Qué significa que un modelo científico explique «mejor» que otro?']
  },
  info:{
   lectura:['Según la teoría de orbitales moleculares, cuando dos orbitales atómicos se combinan se forman dos orbitales moleculares: uno enlazante, de menor energía, que concentra los electrones entre los núcleos, y uno antienlazante (*), de mayor energía, con un nodo entre ellos.',
     'El orden de enlace es (electrones enlazantes − electrones antienlazantes) ÷ 2. H₂ tiene orden 1; He₂, orden 0 (no existe); N₂, orden 3; O₂, orden 2, con dos electrones desapareados que lo hacen paramagnético.',
     'En el benceno los seis orbitales p se combinan en orbitales π que cubren todo el anillo: los electrones están deslocalizados, los seis enlaces C−C miden lo mismo y la molécula es unos 150 kJ/mol más estable. Un anillo plano y conjugado con 4n + 2 electrones π es aromático (regla de Hückel).',
     'En los sistemas conjugados (C=C−C=C…) la diferencia de energía entre el último orbital lleno (π) y el primero vacío (π*) disminuye con cada doble enlace: la molécula absorbe luz de mayor longitud de onda. Con unos 8 o más dobles enlaces conjugados absorbe luz visible y tiene color.'],
   esquema:{raiz:'Orbitales moleculares',ramas:[
     {t:'Enlazante y antienlazante',items:['σ y σ*','π y π*']},
     {t:'Orden de enlace',items:['(enl. − antienl.) ÷ 2','0 = no existe']},
     {t:'Aromaticidad',items:['Benceno: 6 e⁻ π','Regla 4n + 2']},
     {t:'Conjugación y color',items:['Más C=C conjugados → mayor λ','β-caroteno: naranja']}]}
  },
  ejemplo:null,
  abiertos:[
   'Dibuja el diagrama de orbitales moleculares del H₂ y del He₂, calcula el orden de enlace de cada uno y explica por qué el helio no forma moléculas diatómicas.',
   'Calcula el orden de enlace del N₂, el O₂ y el F₂ y ordénalos de mayor a menor energía de enlace. Justifica tu respuesta.',
   'Explica por qué el oxígeno líquido es atraído por un imán y qué modelo de enlace permite predecirlo.',
   'Usa los datos de hidrogenación (ciclohexeno: 120 kJ/mol; benceno: 208 kJ/mol) para calcular la energía de resonancia del benceno y explica qué significa.',
   'Aplica la regla de Hückel al benceno, al ciclobutadieno y al naftaleno e indica cuáles son aromáticos.',
   'Explica por qué la zanahoria es naranja y el aceite de cocina es casi incoloro, usando la idea de conjugación.'
  ],
  propia:[]},

 {id:'propiedades',titulo:'Fuerzas intermoleculares y propiedades físicas',corto:'Fuerzas intermoleculares',
  gen:[],jue:/^fuerzas_inter$/,rxn:[],nomenclatura:false,saberJue:true,
  alin:{g11:{sed:'sed11q',ev:['11q-ind3']},g10:{sed:'sed10q',ev:['10q-exp3']},est:['est2','est4'],dba:['dba11b']},
  previos:{
   curiosos:['El etanol y el dimetiléter tienen la misma fórmula, C₂H₆O, pero uno hierve a 78 °C y el otro a −24 °C.',
     'En Bogotá el agua hierve a unos 91 °C, no a 100 °C, porque la presión del aire es menor.',
     'El ADN se mantiene enrollado en doble hélice gracias a millones de puentes de hidrógeno.'],
   contexto:[{amb:'Local',t:'El alcohol antiséptico se evapora rápido de la piel; el aceite de cocina casi no se evapora.'},
     {amb:'Nacional',t:'En las refinerías de Barrancabermeja y Cartagena el petróleo se separa en fracciones según su punto de ebullición.'},
     {amb:'Global',t:'Los jabones y detergentes funcionan porque una parte de su molécula es polar y la otra apolar.'}],
   cotidianos:['Alcohol antiséptico','Aceite y agua','Jabón','Pipeta de gas','Olla a presión'],
   activacion:['¿Por qué el aceite y el agua no se mezclan aunque los agites?','¿Por qué el alcohol se seca más rápido que el agua en la piel?','¿Por qué los frijoles se demoran más en cocinarse en Bogotá que en Cartagena?']
  },
  info:{
   lectura:['Las fuerzas intermoleculares son atracciones entre moléculas vecinas. Son mucho más débiles que los enlaces covalentes y son las que se vencen cuando un líquido hierve o una sustancia se disuelve.',
     'Fuerzas de London: están en todas las moléculas y crecen con el tamaño y la superficie. Dipolo-dipolo: entre moléculas polares (C=O, C−O−C, C−X). Puente de hidrógeno: cuando hay O−H o N−H; es la más fuerte de las tres.',
     'Con masas parecidas, el punto de ebullición aumenta así: alcano < éter, aldehído o cetona < alcohol < ácido carboxílico. En una misma familia, sube con la cadena y baja con la ramificación.',
     'Solubilidad: «semejante disuelve a semejante». Los compuestos con −OH, −NH₂ o −COOH y cadena corta se disuelven en agua; al crecer la cadena apolar, la solubilidad disminuye.'],
   esquema:{raiz:'Fuerzas intermoleculares',ramas:[
     {t:'London',items:['Todas las moléculas','Crecen con la cadena']},
     {t:'Dipolo-dipolo',items:['Moléculas polares','Aldehídos, cetonas, éteres']},
     {t:'Puente de hidrógeno',items:['O−H o N−H','Alcoholes, ácidos, aminas']},
     {t:'Propiedades',items:['Punto de ebullición','Solubilidad en agua']}]}
  },
  ejemplo:null,
  abiertos:[
   'Ordena de menor a mayor punto de ebullición: butano, propanona y propan-1-ol (masas molares casi iguales). Justifica con el tipo de fuerza intermolecular de cada uno.',
   'Explica por qué el etanol se disuelve en agua en cualquier proporción y el hexan-1-ol casi no.',
   'Un grupo midió el punto de ebullición del etanol y obtuvo 75,5 °C (referencia: 78,4 °C a 1 atm). Calcula el porcentaje de error y propone dos causas de la diferencia, una de ellas relacionada con la altura de Bogotá.',
   'Diseña un experimento para comprobar la hipótesis «a más carbonos, mayor punto de ebullición». Indica qué variable cambias, cuáles mantienes y qué gráfica harías.',
   'Explica por qué el pentano hierve a 36 °C y el 2,2-dimetilpropano, su isómero, a 10 °C.',
   'Explica con las fuerzas intermoleculares cómo quita el jabón la grasa de la ropa.'
  ],
  propia:[]},

 {id:'biomoleculas',titulo:'Biomoléculas y metabolismo',corto:'Biomoléculas',
  gen:[],jue:/^biomoleculas$/,rxn:[],nomenclatura:false,saberJue:true,
  alin:{g11:{sed:'sed11q',ev:['11q-uso1']},g10:{sed:'sed10q',ev:['10q-exp3']},est:['est3','est2'],dba:['dba11b']},
  previos:{
   curiosos:['El almidón de la papa y la celulosa del papel están hechos del mismo azúcar, la glucosa; solo cambia cómo se unen sus moléculas.',
     'Cuando haces ceviche, el limón «cocina» el pescado sin calor: desnaturaliza sus proteínas.',
     'Un gramo de grasa aporta 9 kcal; un gramo de azúcar o de proteína, solo 4.'],
   contexto:[{amb:'Local',t:'La panela, el arroz, el fríjol, el aguacate y el huevo de tu almuerzo aportan carbohidratos, proteínas y lípidos.'},
     {amb:'Nacional',t:'El guarapo y la chicha se obtienen por fermentación alcohólica; el kumis, por fermentación láctica.'},
     {amb:'Global',t:'Las grasas trans, que se forman al hidrogenar parcialmente aceites, se han limitado en muchos países por su efecto en la salud del corazón.'}],
   cotidianos:['Panela','Aguacate','Huevo','Kumis','Ceviche'],
   activacion:['¿Qué crees que le pasa al almidón del arroz cuando lo digieres?','¿Por qué la clara del huevo se vuelve blanca al freírla?','¿Por qué el aceite es líquido y la manteca es sólida si las dos son grasas?']
  },
  info:{
   lectura:['Las biomoléculas orgánicas son carbohidratos, lípidos, proteínas y ácidos nucleicos. Los polímeros se construyen por condensación (sale H₂O) y se rompen por hidrólisis (entra H₂O).',
     'Los carbohidratos son polialcoholes con un aldehído (aldosas, como la glucosa) o una cetona (cetosas, como la fructosa); se unen por enlaces glucosídicos. El almidón (enlaces α) se digiere; la celulosa (enlaces β) no.',
     'Los triglicéridos son triésteres de glicerol y tres ácidos grasos: saturados (cadenas rectas, sólidos), insaturados cis (cadenas dobladas, líquidos) o trans. Las proteínas son cadenas de aminoácidos unidos por enlaces peptídicos (amidas); su forma 3D depende de puentes de hidrógeno y define su función.',
     'Los monosacáridos se nombran por su grupo y su número de carbonos: aldo/ceto + tri, tetr, pent o hex + -osa (gliceraldehído = aldotriosa, ribosa = aldopentosa, fructosa = cetohexosa). En la proyección de Fischer, el −OH del penúltimo carbono a la derecha indica la serie D. Al cerrarse el anillo (Haworth), lo que estaba a la derecha queda abajo; el −OH nuevo del C1 puede quedar abajo (α) o arriba (β).',
     'Los ácidos grasos omega se cuentan desde el extremo CH₃: el linoleico es omega-6 y el α-linolénico omega-3; los dos son esenciales. Un jabón es la sal de un ácido graso: su cola apolar se mete en la grasa y su cabeza −COO⁻ queda en el agua, formando micelas que el agua arrastra.',
     'El ADN es una doble hélice de hebras antiparalelas con pares A−T y G−C (regla de Chargaff); se copia de forma semiconservativa. Para fabricar una proteína, el ADN se transcribe a ARNm (con U en lugar de T); en el ribosoma, cada codón del ARNm se aparea con el anticodón de un ARNt que trae su aminoácido, y el ribosoma los une con enlaces peptídicos desde AUG hasta un codón de parada.',
     'Las enzimas son proteínas que catalizan las reacciones del metabolismo. La respiración celular, C₆H₁₂O₆ + 6 O₂ → 6 CO₂ + 6 H₂O, es la oxidación de la glucosa; la fermentación alcohólica produce etanol y CO₂.'],
   esquema:{raiz:'Biomoléculas',ramas:[
     {t:'Carbohidratos',items:['Aldosas y cetosas, triosas a hexosas','Fischer y Haworth, α y β','Almidón y celulosa']},
     {t:'Lípidos',items:['Ácidos grasos omega-3 y omega-6','Triglicéridos y jabones']},
     {t:'Proteínas',items:['Enlace peptídico','ARNm, ARNt y ribosoma']},
     {t:'Ácidos nucleicos',items:['ADN: doble hélice antiparalela','A−T y G−C, replicación']}]}
  },
  ejemplo:null,
  abiertos:[
   'Identifica los grupos funcionales de la glucosa y de la fructosa y explica por qué son isómeros de función.',
   'Escribe, con fórmulas generales, la condensación de dos aminoácidos y señala el enlace peptídico.',
   'Explica con la forma de las cadenas por qué el ácido esteárico (69 °C) se funde a mayor temperatura que el ácido oleico (13 °C).',
   'Calcula las kilocalorías de una porción con 30 g de carbohidratos, 6 g de proteína y 8 g de grasa, y explica por qué la grasa aporta tanta energía.',
   'Escribe la hebra complementaria de 5′-ATGCCGTA-3′ y cuenta cuántos puentes de hidrógeno unen las dos hebras.',
   'Compara la respiración celular con la fermentación alcohólica: reactivos, productos, presencia de oxígeno y un ejemplo de cada una en Colombia.'
  ],
  propia:[]},

 {id:'ambiente',titulo:'Química orgánica y ambiente',corto:'Química y ambiente',
  gen:[],jue:/^quimica_ambiente$/,rxn:[],nomenclatura:false,saberJue:true,
  alin:{g11:{sed:'sed11q',ev:['11q-uso3','11q-exp3']},g10:{sed:'sed10q',ev:['10q-exp3']},est:['est5','est2'],dba:['dba11a']},
  previos:{
   curiosos:['Quemar un galón de gasolina (unos 2,8 kg) produce unos 8,6 kg de CO₂: la masa extra es oxígeno del aire.',
     'Un solo átomo de cloro de un CFC puede destruir miles de moléculas de ozono en la estratosfera.',
     'Una bolsa de polietileno no se biodegrada: se rompe en microplásticos que siguen en el ambiente.'],
   contexto:[{amb:'Local',t:'El gas de la estufa y la pipeta de gas son metano, propano y butano: su combustión produce CO₂ y H₂O.'},
     {amb:'Nacional',t:'Colombia produce etanol de caña en el Valle del Cauca y biodiésel de palma; la Ley 2232 de 2022 reduce gradualmente varios plásticos de un solo uso.'},
     {amb:'Global',t:'El Protocolo de Montreal (1987) prohibió los CFC y hoy la capa de ozono se recupera lentamente.'}],
   cotidianos:['Gasolina','Bolsas plásticas','Botellas PET','Aerosoles','Biodiésel'],
   activacion:['¿Por qué crees que un plástico dura cientos de años y una cáscara de banano solo unas semanas?','Si la gasolina se quema y «desaparece», ¿a dónde va su carbono?','¿Es lo mismo un combustible renovable que uno sin impacto ambiental?']
  },
  info:{
   lectura:['El petróleo es una mezcla de hidrocarburos que se separa por destilación fraccionada según el punto de ebullición, que depende del tamaño de las moléculas (fuerzas de London).',
     'En la combustión completa cada carbono del combustible sale como CO₂. Con la ecuación balanceada y las masas molares se calcula la masa de CO₂ (por ejemplo, 1 mol de CH₄ → 1 mol de CO₂ = 44 g). Con poco oxígeno se forma CO, que es tóxico.',
     'Los plásticos de adición (polietileno, PP, PVC) tienen solo enlaces C−C y C−H, que los microorganismos casi no rompen: persisten y se fragmentan en microplásticos. Los CFC liberan radicales Cl· por ruptura homolítica y destruyen el ozono en cadena. Los plaguicidas apolares, como el DDT, se acumulan en la grasa de los seres vivos.',
     'Alternativas: biocombustibles (etanol por fermentación, biodiésel por transesterificación), plásticos que se puedan reciclar o degradar, y los principios de la química verde: prevenir desechos, usar materias primas renovables y diseñar productos que se degraden.'],
   esquema:{raiz:'Química orgánica y ambiente',ramas:[
     {t:'Combustibles',items:['Destilación del petróleo','CO₂ y CO']},
     {t:'Plásticos',items:['Adición y condensación','Microplásticos']},
     {t:'Contaminantes',items:['CFC y ozono','DDT y bioacumulación']},
     {t:'Alternativas',items:['Biocombustibles','Química verde']}]}
  },
  ejemplo:null,
  abiertos:[
   'Calcula la masa de CO₂ que se produce al quemar 1 kg de propano (C₃H₈ + 5 O₂ → 3 CO₂ + 4 H₂O). Muestra la cadena de factores de conversión.',
   'Explica por qué quemar 1 kg de gasolina produce más de 1 kg de CO₂, usando la ley de conservación de la masa.',
   'Escribe el mecanismo por el que un CFC destruye el ozono e identifica el paso de ruptura homolítica.',
   'Explica, con la polaridad, por qué el DDT se acumula en la grasa de los animales y su concentración aumenta en la cadena alimentaria.',
   'Clasifica el PET, el PVC y el polietileno como polímeros de adición o de condensación y explica cuál podría hidrolizarse con más facilidad.',
   'Argumenta una ventaja y una desventaja del biodiésel de palma frente al diésel del petróleo, desde el punto de vista químico y ambiental.'
  ],
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
   q:'¿Por qué no importa en este caso desde qué extremo se numera?',o:['Porque la molécula es simétrica: los dos metilos quedan a la misma distancia de cada extremo','Porque los dos metilos están en el mismo carbono y no se pueden separar al numerar','Porque hay que numerar siempre desde la izquierda, sin excepción, aunque no haya simetría','Porque los localizadores se suman y la suma da lo mismo desde cualquiera de los extremos']},
  {a:'nom',c:'exp',k:'Q',ctx:'En el nombre 4-isopropil-2-metilheptano (nombre tradicional aceptado; la IUPAC 2013 prefiere «propan-2-il» en lugar de «isopropil»), los sustituyentes se escriben en orden alfabético.',
   q:'¿Por qué «isopropil» se escribe antes que «metil»?',o:['Porque el prefijo iso- sí cuenta para el orden alfabético, e «i» va antes que «m»','Porque el isopropilo tiene más carbonos que el metilo','Porque el localizador 4 es mayor que el 2','Porque los sustituyentes ramificados siempre se escriben primero']},
  {a:'rx',c:'ind',k:'CTS',ctx:'La planta de tratamiento de aguas residuales El Salitre, en Bogotá, captura el biogás que producen las bacterias al descomponer la materia orgánica sin oxígeno, y lo usa como fuente de energía.',
   q:'El biogás es rico en metano. ¿Qué evidencia confirmaría que el gas capturado es metano y no otro hidrocarburo?',o:['Quemar una muestra y comprobar que por cada mol de CO₂ se forman 2 moles de H₂O, como corresponde al CH₄','Medir el volumen de gas que se produce cada día y compararlo con el de otras plantas','Comprobar que el gas no tiene olor, porque el metano es el único gas inodoro','Medir la temperatura del tanque, porque solo el metano se forma a temperatura ambiente']},
  {a:'nom',c:'uso',k:'Q',ctx:'Un compañero escribió el nombre de un alcano de cuatro formas distintas: «2,3 dimetilbutano», «2-3-dimetilbutano», «2,3-dimetilbutano» y «2-3 dimetil-butano».',
   q:'¿Cuál de las cuatro cumple con la puntuación que usa la IUPAC (coma entre números, guion entre un número y una letra)?',o:['2,3-dimetilbutano','2,3 dimetilbutano','2-3-dimetilbutano','2-3 dimetil-butano']},
  {a:'nom',c:'uso',k:'Q',ctx:'Observa la siguiente estructura:',f:'CH₃−CH(CH₃)−CH(CH₃)−CH₂−CH₃',
   q:'¿Cuál es su nombre IUPAC?',o:['2,3-dimetilpentano','3,4-dimetilpentano','2,3-dimetilbutano','1,2-dimetilpentano']},
  {a:'nom',c:'uso',k:'Q',ctx:'Observa la siguiente estructura:',f:'CH₃−C(CH₃)(CH₃)−CH₂−CH₃',
   q:'¿Cuál es su nombre IUPAC?',o:['2,2-dimetilbutano','1,1-dimetilbutano','2-dimetilbutano','2,3-dimetilbutano']},
  {a:'nom',c:'exp',k:'Q',ctx:'En el nombre 2,2-dimetilbutano el localizador 2 se repite dos veces, uno para cada metilo.',
   q:'¿Por qué es necesario repetirlo en vez de escribir «2-dimetilbutano»?',o:['Porque cada sustituyente necesita su propio localizador, aunque los dos caigan en el mismo carbono','Porque el prefijo di- siempre exige dos números diferentes','Porque sin repetirlo el nombre no indicaría cuántos carbonos tiene la cadena principal','Porque la IUPAC prohíbe los localizadores repetidos']},
  {a:'prop',c:'uso',k:'CTS',ctx:'En Colombia se venden gasolina corriente y gasolina extra; la extra tiene un índice de octano más alto. Ese índice compara la resistencia de un combustible a la autoignición con la del isooctano (índice 100) y la del heptano (índice 0).',
   q:'¿Qué significa que un combustible tenga un índice de octano más alto?',o:['Resiste mejor la autoignición (el «cascabeleo» del motor), de forma parecida al isooctano','Tiene más energía por litro, así que el carro rinde más kilómetros','Contiene más carbono y por eso produce más CO₂ al quemarse','Contiene una mayor proporción de octano lineal, el n-octano']},
  {a:'nom',c:'ind',k:'Q',ctx:'Un estudiante afirma: «3-etilpentano y 3-metilhexano son el mismo compuesto, porque los dos tienen 7 carbonos en total».',
   q:'¿Cómo se puede comprobar si esa afirmación es correcta?',o:['Dibujando la estructura completa de cada nombre y comparando cómo están unidos los átomos, no solo el total de carbonos','Contando solamente los carbonos de la cadena principal de cada nombre y comparando esos dos números','Buscando los dos nombres en una tabla de alcanos comunes y viendo si aparecen en la misma fila','Comparando el punto de ebullición de los dos líquidos, sin necesidad de dibujar las estructuras']},
  {a:'nom',c:'uso',k:'Q',ctx:'Observa la siguiente estructura:',f:'CH₃−CH₂−CH(CH₂CH₃)−CH₂−CH₂−CH₃',
   q:'¿Cuál es su nombre IUPAC?',o:['3-etilhexano','3-etilheptano','4-etilhexano','3-propilpentano']},
  {a:'nom',c:'exp',k:'CTS',ctx:'La IUPAC recomienda nombres sistemáticos (como butano) en vez de nombres triviales o comerciales que cambian de una región a otra.',
   q:'¿Cuál es la principal ventaja de tener un sistema de nomenclatura único e internacional?',o:['Permite que cualquier químico, en cualquier país, identifique sin ambigüedad la misma sustancia a partir de su nombre','Hace que los nombres sean más cortos y fáciles de memorizar para los estudiantes de todo el mundo','Evita que las sustancias reaccionen entre sí cuando se almacenan juntas en el laboratorio','Elimina por completo la necesidad de dibujar las estructuras de las moléculas orgánicas']},
  {a:'nom',c:'exp',k:'Q',ctx:'Un heptano tiene sustituyentes metilo en dos carbonos y etilo en uno. Numerando por un extremo, los localizadores quedan en {2,3,6}; numerando por el otro extremo, en {2,5,6}.',
   q:'¿Cuál conjunto de localizadores es el correcto, según la regla de la IUPAC?',o:['{2,3,6}, porque en el primer punto de diferencia (la segunda posición) 3 es menor que 5','{2,5,6}, porque la suma de sus números es mayor y eso indica la numeración correcta','Cualquiera de los dos, porque ambos conjuntos empiezan con el localizador 2','{2,3,6}, porque es el que deja el número más alto, 6, en la última posición']},
  {a:'nom',c:'uso',k:'Q',ctx:'Observa la siguiente estructura:',f:'CH₃−CH₂−CH(CH₃)−CH(CH₃)−CH₂−CH₂−CH₃',
   q:'¿Cuál es su nombre IUPAC?',o:['3,4-dimetilheptano','4,5-dimetilheptano','3,4-dimetilhexano','2,3-dimetilheptano']},
  {a:'nom',c:'exp',k:'Q',ctx:'Dos cadenas posibles de un mismo alcano ramificado tienen ambas 6 carbonos de longitud, pero una de ellas pasa por un carbono que tiene dos ramificaciones y la otra no pasa por ningún carbono ramificado.',
   q:'Según la regla de desempate de la IUPAC, ¿cuál de las dos se escoge como cadena principal?',o:['La que tiene más sustituyentes, aunque las dos tengan la misma longitud','La que no tiene ningún sustituyente, porque es más sencilla de nombrar','Ninguna: si hay empate en longitud, la molécula no se puede nombrar','La que aparece dibujada en línea horizontal']},
  {a:'nom',c:'uso',k:'Q',ctx:'Observa la siguiente estructura:',f:'CH₃−CH(CH₃)−CH(CH₃)−CH(CH₃)−CH₃',
   q:'¿Cuál es su nombre IUPAC?',o:['2,3,4-trimetilpentano','2,3,4-trimetilbutano','3,4-dimetilhexano','2,4-dimetilpentano']}
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
  {a:'prop',c:'exp',k:'CTS',ctx:'Colombia produce gas natural en La Guajira y en el piedemonte llanero. Las fugas de metano en pozos y tuberías preocupan aunque no haya incendio.',
   q:'¿Por qué una fuga de metano es un problema ambiental?',o:['Porque el metano es un gas de efecto invernadero más potente que el CO₂ por molécula','Porque el metano destruye la capa de ozono igual que los CFC','Porque el metano reacciona con la lluvia y forma ácido sulfúrico','Porque el metano es un sólido que se acumula en los suelos']},
  {a:'nom',c:'uso',k:'Q',ctx:'Todos los átomos de carbono del propano están unidos solo por enlaces sencillos.',
   q:'¿Qué hibridación y qué geometría tienen esos carbonos?',o:['sp³, tetraédrica, con ángulos cercanos a 109,5°','sp², trigonal plana, con ángulos de 120°','sp, lineal, con ángulos de 180°','sp³, plana cuadrada, con ángulos de 90°']},
  {a:'rx',c:'uso',k:'Q',ctx:'La combustión completa del propano (el gas de muchas pipetas) consume oxígeno y produce dióxido de carbono y agua.',
   q:'¿Cuál es la ecuación balanceada de esa combustión?',o:['C₃H₈ + 5 O₂ → 3 CO₂ + 4 H₂O','C₃H₈ + 3 O₂ → 3 CO₂ + 4 H₂O','C₃H₈ + 5 O₂ → 3 CO + 4 H₂O','C₃H₈ + O₂ → CO₂ + H₂O']},
  {a:'prop',c:'exp',k:'CTS',ctx:'El gas natural y el GLP son inodoros en su estado puro. Por seguridad, las empresas de gas les agregan un compuesto con azufre (un mercaptano) de olor fuerte y desagradable.',
   q:'¿Cuál es la razón principal para agregar ese compuesto?',o:['Permite detectar una fuga por el olfato, antes de que el gas acumulado sea un riesgo de explosión','Hace que el gas arda con una llama más azul y caliente en la estufa','Evita que el gas se vuelva líquido cuando está dentro del cilindro','Le da a cada marca un olor distinto para que el cliente la reconozca']},
  {a:'nom',c:'uso',k:'Q',ctx:'Los cicloalcanos (anillos saturados de carbono) cumplen la fórmula general CₙH₂ₙ, a diferencia de los alcanos de cadena abierta (CₙH₂ₙ₊₂).',
   q:'¿Cuál es la fórmula molecular del ciclopentano?',o:['C₅H₁₀','C₅H₁₂','C₅H₈','C₄H₁₀']},
  {a:'prop',c:'exp',k:'Q',ctx:'A temperatura ambiente, el metano es un gas, el hexano es un líquido y la parafina (una mezcla de alcanos de cadena muy larga) es un sólido blando.',
   q:'¿Qué explica esta diferencia de estado físico entre alcanos?',o:['A mayor longitud de cadena, mayores son las fuerzas de London entre las moléculas, lo que eleva el punto de fusión y de ebullición','Las cadenas largas tienen enlaces C−C más fuertes que las cadenas cortas, así que sus moléculas se separan con más dificultad','Los alcanos de cadena larga tienen carga eléctrica y por eso sus moléculas se atraen con fuerza entre sí','Las moléculas pequeñas pesan más que las grandes y por eso escapan como gas a temperatura ambiente']},
  {a:'prop',c:'exp',k:'CTS',ctx:'La vaselina que se usa en cosmética y primeros auxilios es una mezcla de alcanos sólidos de cadena larga (20 a 40 carbonos), obtenidos del petróleo.',
   q:'¿Por qué los alcanos son tan poco reactivos frente a la piel y otras sustancias?',o:['Porque sus enlaces C−C y C−H son poco polares y muy estables, así que no reaccionan con facilidad','Porque los alcanos son ácidos débiles que no afectan la piel','Porque los alcanos tienen dobles enlaces que los hacen inertes','Porque los alcanos se disuelven muy bien en agua y no quedan sobre la piel']},
  {a:'prop',c:'ind',k:'Q',ctx:'El butano (CH₃−CH₂−CH₂−CH₃) hierve a −1 °C y el 2-metilpropano (CH₃−CH(CH₃)−CH₃), su isómero, hierve a −12 °C. Ambos tienen la fórmula molecular C₄H₁₀.',
   q:'¿Qué conclusión es coherente con estos datos?',o:['El isómero más ramificado hierve a menor temperatura, por su menor superficie de contacto','El isómero ramificado siempre hierve a mayor temperatura','La fórmula molecular, y no la forma de la molécula, determina el punto de ebullición','Los dos deberían hervir exactamente a la misma temperatura, porque tienen la misma fórmula']},
  {a:'nom',c:'uso',k:'Q',ctx:'El 2,2,3-trimetilbutano es un alcano ramificado: su cadena principal de 4 carbonos (butano) lleva tres grupos metilo.',
   q:'¿Cuál es su fórmula molecular?',o:['C₇H₁₆','C₇H₁₄','C₇H₁₈','C₄H₁₀']},
  {a:'prop',c:'exp',k:'Q',ctx:'El propano de las pipetas se guarda líquido dentro del cilindro, a presión, y se convierte en gas apenas sale por la válvula.',
   q:'¿Por qué el propano puede licuarse con solo aumentar la presión, sin necesidad de enfriarlo mucho?',o:['Porque a temperatura ambiente bastan unas 8 atm para que sus fuerzas de London mantengan las moléculas unidas como líquido','Porque el propano es un compuesto iónico que se compacta fácilmente cuando aumenta la presión','Porque la presión rompe los enlaces C−H del propano y lo convierte en un líquido distinto','Porque el propano reacciona con el aire del cilindro al comprimirse y forma un líquido']},
  {a:'rx',c:'exp',k:'Q',ctx:'Al quemar 1 mol de metano se liberan cerca de 890 kJ; al quemar 1 mol de octano se liberan cerca de 5 470 kJ.',
   q:'¿Qué explica que el octano libere mucha más energía por mol que el metano?',o:['El octano tiene más átomos de C y H por molécula, que al oxidarse forman muchos más enlaces en CO₂ y H₂O','El metano no es realmente un combustible, solo un gas que arde con dificultad','El octano tiene enlaces iónicos que el metano no tiene y que guardan más energía','En realidad el metano libera más energía por mol, porque su molécula es más simple']},
  {a:'prop',c:'ind',k:'Q',ctx:'Un estudiante quiere comprobar si el gas de una fuga en su cocina es GLP (propano y butano) o metano de la red de gas natural.',
   q:'¿Qué dato sería más útil para decidirlo, sin necesidad de un laboratorio?',o:['Observar si el gas se acumula cerca del piso o sube: el GLP es más denso que el aire y el metano, menos','El olor del gas, porque solo el GLP lleva odorizante y el gas natural no huele a nada','El precio que pagó por el servicio de gas, porque el metano es más caro que el GLP','La temperatura de la cocina en el momento de la fuga, porque el GLP enfría el aire']},
  {a:'prop',c:'exp',k:'CTS',ctx:'Las fugas de GLP son peligrosas en espacios cerrados porque el gas, al ser más denso que el aire, tiende a acumularse cerca del piso.',
   q:'¿Qué recomendación de seguridad se deriva directamente de esta propiedad?',o:['Ventilar por la parte baja del espacio y evitar generar chispas cerca del piso si se sospecha una fuga','Abrir únicamente las ventanas más altas, porque el gas sube y sale por arriba','Guardar el cilindro siempre en un lugar elevado, lejos del piso de la cocina','Usar el gas solamente en espacios cerrados para que no se disperse por la casa']},
  {a:'prop',c:'uso',k:'CTS',ctx:'El gas natural que se produce en La Guajira y el piedemonte llanero es principalmente metano, con pequeñas cantidades de etano, propano y butano.',
   q:'Una muestra de gas natural tiene, en moles, 90 % de metano y 10 % de etano. ¿Cuál es su masa molar promedio? (CH₄ = 16 g/mol; C₂H₆ = 30 g/mol)',o:['17,4 g/mol','23,0 g/mol','16,0 g/mol','28,6 g/mol']},
  {a:'rx',c:'uso',k:'CTS',ctx:'En las refinerías, el craqueo (cracking) rompe moléculas largas de alcanos del petróleo, con calor y catalizadores, para obtener gasolina y otros combustibles más ligeros.',
   q:'¿Qué tipo de productos se obtienen al romper una cadena larga de alcano por craqueo?',o:['Una mezcla de alcanos y alquenos más pequeños, porque al romper un enlace C−C sobra un carbono con un doble enlace','Solo alcanos más pequeños, porque el craqueo rompe únicamente los enlaces C−H de la cadena','Solo CO₂ y agua, igual que en la combustión, porque se usa calor para romper la cadena','Un solo alqueno muy grande, sin ningún alcano, porque la cadena pierde todos sus hidrógenos']},
  {a:'prop',c:'exp',k:'Q',ctx:'A diferencia de un doble enlace, un enlace sencillo C−C como los del propano puede girar libremente sobre su eje sin romperse.',
   q:'¿Por qué un enlace sencillo (σ) permite esta rotación?',o:['Porque es un solapamiento simétrico alrededor del eje que une los dos núcleos, así que girar no cambia el solapamiento de los orbitales','Porque el enlace sencillo es mucho más débil que uno doble y se rompe y se vuelve a formar constantemente al girar','Porque los átomos de carbono no tienen masa suficiente para resistir el giro de un extremo de la molécula','Porque en los alcanos los carbonos no comparten electrones y quedan libres para girar sin restricción']},
  {a:'nom',c:'uso',k:'Q',ctx:'Observa la siguiente estructura:',f:'CH₃−C(CH₃)₂−CH₂−CH₂−CH₃',
   q:'¿Cuál es su nombre IUPAC?',o:['2,2-dimetilpentano','3,3-dimetilpentano','2,2-dimetilbutano','1,1-dimetilpentano']},
  {a:'prop',c:'exp',k:'CTS',ctx:'Al derramarse petróleo crudo (una mezcla de hidrocarburos, en su mayoría alcanos) en el mar, la mancha flota y se extiende sobre la superficie del agua, sin mezclarse con ella.',
   q:'¿Qué dos propiedades de los alcanos explican este comportamiento?',o:['Son apolares (no se mezclan con el agua, que es polar) y menos densos que el agua','Son muy densos y se hunden en el fondo del mar','Son polares y forman puentes de hidrógeno con el agua','Son compuestos iónicos que flotan por repulsión eléctrica']}
 ],
 alquenos:[
  {a:'nom',g:'alquenos',c:'uso',k:'Q',ctx:'Observa la siguiente estructura:',f:'CH₃−CH=CH−CH₂−CH₃',
   q:'¿Cuál es su nombre IUPAC?',o:['pent-2-eno','pent-3-eno','pentan-2-eno','pent-2-ino']},
  {a:'nom',g:'alquinos',c:'uso',k:'Q',ctx:'El propino es el alquino de tres carbonos.',
   q:'¿Cuál es su fórmula molecular?',o:['C₃H₄','C₃H₆','C₃H₈','C₃H₂']},
  {a:'rx',g:'alquenos',c:'exp',k:'Q',ctx:'Al hacer reaccionar propeno (CH₂=CH−CH₃) con HBr se obtiene principalmente 2-bromopropano y muy poco 1-bromopropano.',
   q:'¿Qué explica este resultado?',o:['Se forma de preferencia el carbocatión secundario, más estable que el primario, y el bromuro se une a ese carbono','El bromo siempre se une al carbono 1 porque es el extremo de la cadena, y el 2-bromopropano sale por error','El HBr rompe el enlace sencillo entre C2 y C3, y no el doble enlace, que es más fuerte','El hidrógeno se une al carbono que tiene menos hidrógenos, y el bromo al que tiene más']},
  {a:'nom',g:'alquenos',c:'uso',k:'CTS',ctx:'Los bananos de Urabá se exportan verdes y maduran en el país de destino en cámaras con eteno (CH₂=CH₂), una hormona vegetal.',
   q:'¿Cuál afirmación sobre la estructura del eteno es correcta?',o:['Sus dos carbonos tienen hibridación sp² y todos sus átomos están en un mismo plano','Sus dos carbonos tienen hibridación sp³ y geometría tetraédrica, como en el etano','Tiene un triple enlace entre carbonos y por eso su geometría es lineal','Tiene un grupo −OH unido a un carbono sp², como los alcoholes insaturados']},
  {a:'nom',g:'alquenos',c:'uso',k:'Q',ctx:'Observa la siguiente estructura:',f:'CH₂=CH−CH(CH₃)−CH₃',
   q:'¿Cuál es su nombre IUPAC?',o:['3-metilbut-1-eno','2-metilbut-3-eno','3-metilbut-2-eno','2-metilbutano']},
  {a:'rx',g:'alquenos',c:'ind',k:'Q',ctx:'Para diferenciar hexano de hex-1-eno, una estudiante agrega unas gotas de agua de bromo (de color naranja) a cada muestra, a temperatura ambiente y sin luz intensa.',
   q:'¿Qué resultado permite identificar el alqueno?',o:['El tubo con hex-1-eno pierde el color naranja porque el Br₂ se adiciona al doble enlace','El tubo con hexano pierde el color porque los alcanos reaccionan rápido con Br₂ sin luz','Ambos tubos pierden el color por igual, así que la prueba no sirve','El tubo con hex-1-eno se vuelve azul porque se forma un ácido']},
  {a:'rx',g:'alquenos',c:'exp',k:'Q',ctx:'El eteno (CH₂=CH₂) reacciona con facilidad con Br₂ por adición, mientras que el etano (CH₃−CH₃) no da reacciones de adición.',
   q:'¿Qué explica esta diferencia?',o:['El enlace π del doble enlace es más débil y sus electrones están más expuestos a los electrófilos','El etano tiene más hidrógenos que pueden salir de la molécula y dejar espacio al Br₂','El eteno tiene más carbonos que el etano, así que hay más sitios para que se una el Br₂','El enlace σ del etano se rompe más fácilmente que el enlace π, así que el etano reacciona primero']},
  {a:'nom',g:'ambos',c:'uso',k:'Q',ctx:'En el compuesto CH₂=CH−CH₂−C≡CH, numerando desde cualquiera de los dos extremos, los enlaces múltiples quedan en las posiciones 1 y 4.',
   q:'Según la IUPAC, ¿cuál es su nombre?',o:['pent-1-en-4-ino','pent-4-en-1-ino','pent-1-in-4-eno','penta-1,4-dieno']},
  {a:'nom',g:'alquinos',c:'uso',k:'Q',ctx:'Observa la siguiente estructura:',f:'CH₃−C≡C−CH₂−CH₃',
   q:'¿Cuál es su nombre IUPAC?',o:['pent-2-ino','pent-3-ino','pent-2-eno','but-2-ino']},
  {a:'rx',g:'alquinos',c:'exp',k:'CTS',ctx:'La soldadura autógena usa una llama de acetileno (etino, CH≡CH) y oxígeno, que alcanza hasta 3 100 °C, mucho más que la llama del gas propano.',
   q:'¿Qué ayuda a explicar que su llama con oxígeno sea tan caliente?',o:['El acetileno es una molécula de alta energía: su formación absorbe energía, que se libera al quemarse','El acetileno ya contiene oxígeno en su propia molécula y no necesita el del aire','El acetileno es un compuesto iónico con mucha energía de red que se libera al arder','El acetileno tiene más átomos de carbono que el propano y por eso arde más caliente']},
  {a:'nom',g:'alquenos',c:'uso',k:'Q',ctx:'El buta-1,3-dieno es la materia prima para fabricar caucho sintético, como el de las llantas.',
   q:'¿Cuál es su fórmula estructural?',o:['CH₂=CH−CH=CH₂','CH₂=CH−CH₂−CH₃','CH≡C−CH₂−CH₃','CH₃−CH=CH−CH₃']},
  {a:'nom',g:'alquenos',c:'uso',k:'CTS',ctx:'El caucho natural, que se extrae de árboles cultivados también en el Caquetá y el Meta, es un polímero del isopreno (2-metilbuta-1,3-dieno).',
   q:'¿Cuántos dobles enlaces tiene cada unidad de isopreno antes de polimerizarse?',o:['Dos','Uno','Tres','Ninguno, porque el isopreno es un alcano']},
  {a:'rx',g:'alquenos',c:'uso',k:'Q',ctx:'Para producir margarina a partir de aceites vegetales líquidos, la industria hace pasar H₂ gaseoso por el aceite caliente, con un catalizador de níquel.',
   q:'¿Qué cambio estructural ocurre en los ácidos grasos del aceite durante este proceso?',o:['Los dobles enlaces C=C se convierten en enlaces sencillos C−C, por adición de hidrógeno','Los dobles enlaces C=C se transforman en triples enlaces al recibir el hidrógeno','Se forman nuevos anillos aromáticos dentro de la cadena del ácido graso','Los ácidos grasos pierden átomos de carbono, que salen como metano']},
  {a:'rx',g:'alquenos',c:'exp',k:'Q',ctx:'El 2-metilpropeno (CH₂=C(CH₃)−CH₃) reacciona con HCl y forma mayoritariamente 2-cloro-2-metilpropano, y muy poco 1-cloro-2-metilpropano.',
   q:'¿Qué explica que ese sea el producto principal?',o:['El H⁺ se adiciona al carbono con más hidrógenos, y el Cl⁻ se une al carbono que forma el carbocatión más estable (terciario)','El Cl⁻ siempre se une al carbono que tiene más hidrógenos, porque es el más accesible de la molécula','El doble enlace no participa: el HCl sustituye un hidrógeno del carbono central sin formar carbocatión','El producto depende solo de la temperatura de la reacción y no de la estructura del alqueno']},
  {a:'nom',g:'alquinos',c:'uso',k:'Q',ctx:'En el etino (acetileno), cada carbono del triple enlace tiene hibridación sp y está unido a otros dos átomos.',
   q:'¿Qué geometría tienen esos carbonos?',o:['Lineal, con ángulos de 180°','Tetraédrica, con ángulos de 109,5°','Trigonal plana, con ángulos de 120°','Piramidal, con ángulos de 107°']},
  {a:'nom',g:'alquenos',c:'uso',k:'Q',ctx:'Observa la siguiente estructura:',f:'CH₂=C(CH₃)−CH₂−CH₃',
   q:'¿Cuál es su nombre IUPAC?',o:['2-metilbut-1-eno','3-metilbut-1-eno','2-metilbut-2-eno','1-metilbut-1-eno']},
  {a:'nom',g:'alquenos',c:'uso',k:'CTS',ctx:'El polipropileno, usado en empaques de alimentos y tapas de botellas, se fabrica uniendo muchas moléculas de propeno.',
   q:'¿Cuál es la fórmula molecular del propeno, el monómero de este plástico?',o:['C₃H₆','C₃H₈','C₃H₄','C₂H₄']},
  {a:'rx',g:'ambos',c:'ind',k:'Q',ctx:'Un alqueno y un alquino, cada uno con un solo enlace múltiple y la misma cantidad de carbonos, reaccionan por separado con agua de bromo (Br₂) en exceso.',
   q:'¿Qué diferencia debería observarse entre los dos?',o:['El alquino consume el doble de Br₂ por mol que el alqueno, porque tiene dos enlaces π que pueden reaccionar con el Br₂','Los dos consumen la misma cantidad de Br₂ por mol, porque cada uno tiene un solo enlace múltiple en su molécula','El alqueno consume más Br₂ que el alquino, porque su doble enlace es más reactivo que el triple','Ninguno de los dos reacciona con el Br₂ si no hay luz ultravioleta que rompa los enlaces']},
  {a:'nom',g:'alquenos',c:'uso',k:'Q',ctx:'Observa la siguiente estructura:',f:'CH₃−CH=CH−CH=CH−CH₃',
   q:'¿Cuál es su nombre IUPAC?',o:['hexa-2,4-dieno','hexa-1,3-dieno','hexa-2,4-dino','hexa-3,5-dieno']},
  {a:'rx',g:'alquenos',c:'uso',k:'CTS',ctx:'El eteno no solo se usa para madurar frutas: también es la materia prima más consumida por la industria petroquímica para fabricar plásticos.',
   q:'¿Qué polímero de uso masivo (bolsas, envases) se obtiene al unir muchas moléculas de eteno?',o:['Polietileno','Poliestireno','PVC (policloruro de vinilo)','Nailon']},
  {a:'nom',g:'alquenos',c:'uso',k:'Q',ctx:'El pent-2-eno puede existir como dos isómeros distintos, cis y trans, porque su doble enlace no puede girar y cada carbono del C=C tiene dos grupos diferentes.',
   q:'¿Qué nombre recibe este tipo de isomería?',o:['Isomería geométrica (cis/trans)','Isomería de cadena','Isomería de función','Isomería de posición']},
  {a:'rx',g:'alquenos',c:'uso',k:'Q',ctx:'El propeno (gas usado en la fabricación de polipropileno) también puede quemarse completamente con oxígeno, igual que un alcano.',
   q:'¿Cuál es la ecuación balanceada de su combustión completa?',o:['2 C₃H₆ + 9 O₂ → 6 CO₂ + 6 H₂O','C₃H₆ + 3 O₂ → 3 CO₂ + 3 H₂O','2 C₃H₆ + 9 O₂ → 6 CO + 6 H₂O','C₃H₈ + 5 O₂ → 3 CO₂ + 4 H₂O']},
  {a:'nom',g:'alquinos',c:'uso',k:'Q',ctx:'Observa la siguiente estructura:',f:'CH₃−CH₂−C≡C−CH₂−CH₃',
   q:'¿Cuál es su nombre IUPAC?',o:['hex-3-ino','hex-2-ino','hept-3-ino','hex-3-eno']},
  {a:'rx',g:'alquinos',c:'uso',k:'Q',ctx:'El but-2-ino reacciona con exceso de HBr.',
   q:'¿Cuál es el producto final, aplicando la adición de HBr dos veces?',o:['2,2-dibromobutano','1,1-dibromobutano','2,3-dibromobutano','2-bromobut-2-eno']}
 ],
 aromaticos:[
  {a:'nom',c:'uso',k:'CTS',ctx:'El xileno, usado como solvente en laboratorios, es una mezcla de dimetilbencenos.',
   q:'¿Qué nombre IUPAC corresponde al isómero en el que los dos metilos están en carbonos vecinos del anillo?',o:['1,2-dimetilbenceno','1,3-dimetilbenceno','1,4-dimetilbenceno','2,3-dimetilbenceno']},
  {a:'rx',c:'exp',k:'Q',ctx:'En la fórmula de Kekulé el benceno se dibuja con tres dobles enlaces; sin embargo, no reacciona como un alqueno.',
   q:'¿Por qué el benceno da sustitución electrofílica y no adición?',o:['Porque sus 6 electrones π están deslocalizados en el anillo y la sustitución conserva esa estabilidad','Porque el benceno no tiene electrones π y no puede dar adición','Porque los carbonos del benceno tienen hibridación sp³ como los alcanos','Porque la adición rompería enlaces C−H, que son los más fuertes del anillo']},
  {a:'nom',c:'uso',k:'Q',ctx:'Observa la siguiente estructura:',f:'C₆H₅−NO₂',
   q:'¿Cuál es su nombre?',o:['nitrobenceno','benzonitrilo','nitrociclohexano','anilina']},
  {a:'prop',c:'uso',k:'CTS',ctx:'Un taller de pintura usa tíner, que puede contener tolueno. Las normas de salud ocupacional limitan estrictamente el benceno en los solventes.',
   q:'¿Cuál es la razón principal de esa restricción?',o:['El benceno es cancerígeno (se asocia con leucemia) y es volátil, por lo que se inhala con facilidad','El benceno no se evapora y se acumula en la ropa y la piel de los trabajadores','El benceno es un ácido fuerte que quema la piel al contacto con la pintura','El benceno reacciona con el aire del taller y produce grandes cantidades de ozono']},
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
   q:'¿Qué tienen en común el naftaleno y el benceno?',o:['Ambos tienen anillos con electrones π deslocalizados, que les dan una estabilidad extra','Ambos son alcanos saturados, sin ningún doble enlace en sus anillos','Ambos tienen un solo átomo de carbono por cada anillo de la molécula','Ninguno de los dos tiene carbonos sp², porque sus anillos son cerrados']},
  {a:'rx',c:'exp',k:'Q',ctx:'Para bromar el benceno (sustituir un H por Br) se necesita Br₂ junto con un catalizador como FeBr₃; sin el catalizador, la reacción prácticamente no ocurre.',
   q:'¿Cuál es la función del FeBr₃ en esta reacción?',o:['Ayuda a polarizar el Br₂ y a generar un electrófilo lo bastante fuerte para atacar el anillo aromático','Se incorpora al producto final, sustituyendo uno de los hidrógenos del anillo de benceno','Reduce el benceno a ciclohexano para que el bromo pueda sumarse a la molécula','Rompe el anillo aromático para que el bromo se una a los extremos de la cadena']},
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
   q:'¿Qué explica esta diferencia de energía?',o:['La deslocalización de los electrones π hace al benceno más estable de lo esperado, así que libera menos energía al hidrogenarse','El benceno no reacciona con H₂ y la energía medida en realidad corresponde a otra reacción del experimento','El ciclohexano formado es menos estable que el benceno y absorbe parte de la energía liberada','La hidrogenación del benceno es explosiva y parte de la energía se pierde como sonido y luz']},
  {a:'nom',c:'uso',k:'CTS',ctx:'En el siglo XIX, el cirujano Joseph Lister empezó a usar fenol (C₆H₅−OH) para desinfectar instrumentos y heridas, lo que redujo mucho las infecciones postoperatorias.',
   q:'¿En qué se diferencia estructuralmente el fenol del benceno?',o:['El fenol tiene un grupo −OH unido directamente al anillo aromático','El fenol no tiene ningún anillo aromático','El fenol tiene un átomo de nitrógeno dentro del anillo','El fenol tiene dos anillos aromáticos fusionados']},
  {a:'nom',c:'uso',k:'Q',ctx:'Observa la siguiente estructura:',f:'C₆H₅−NH₂',
   q:'¿Cuál es su nombre?',o:['anilina','nitrobenceno','fenol','benzonitrilo']},
  {a:'prop',c:'exp',k:'CTS',ctx:'La gasolina contiene una pequeña proporción de hidrocarburos aromáticos (benceno, tolueno, etilbenceno, xilenos) que mejoran el índice de octano, pero la normativa limita estrictamente el porcentaje de benceno permitido.',
   q:'¿Por qué se limita en particular el benceno y no tanto sus derivados metilados (tolueno, xilenos)?',o:['Porque el benceno es cancerígeno comprobado, mientras que sus derivados metilados son considerablemente menos tóxicos','Porque el benceno es el único de ellos que mejora el índice de octano de la gasolina','Porque el benceno es el único de ellos que es aromático y los demás son alcanos','Porque el benceno es más costoso de producir que el tolueno y los xilenos']},
  {a:'nom',c:'uso',k:'Q',ctx:'Cuando un anillo de benceno está unido a una cadena de carbono más larga que él mismo, el anillo ya no se trata como la cadena principal: se nombra como sustituyente, con el nombre del grupo fenilo (C₆H₅−).',
   q:'¿Cómo se nombra un compuesto con un anillo de benceno unido a una cadena lineal de ocho carbonos?',o:['Como un octano con un sustituyente fenilo','Como un benceno con un sustituyente octilo','Con un nombre conservado, distinto de los dos anteriores','No se puede nombrar con las reglas de la IUPAC']},
  {a:'nom',c:'uso',k:'CTS',ctx:'El ácido salicílico, precursor de la aspirina, es un anillo de benceno con un grupo −COOH y, en el carbono vecino (orto), un grupo −OH.',
   q:'Como el −COOH tiene mayor prioridad que el −OH para dar el sufijo del nombre, ¿cuál es su nombre IUPAC?',o:['ácido 2-hidroxibenzoico','ácido 3-hidroxibenzoico','ácido 2-carboxifenólico','ácido O-hidroxibenzoico']},
  {a:'nom',c:'uso',k:'CTS',ctx:'El 2,4,6-triclorofenol se usó como conservante de la madera. Su anillo tiene un −OH y tres cloros: dos en las posiciones vecinas (orto) al −OH, y uno en la posición opuesta (para).',
   q:'¿Cuál es su nombre con los localizadores numéricos correctos (considerando el carbono del −OH como C1)?',o:['2,4,6-triclorofenol','2,3,6-triclorofenol','3,4,5-triclorofenol','2,4,5-triclorofenol']},
  {a:'rx',c:'exp',k:'Q',ctx:'En la sustitución electrofílica aromática, cada sustituyente ya presente en el anillo "dirige" por dónde entra el siguiente grupo: unos dirigen a las posiciones orto y para, y otros a la posición meta.',
   q:'¿Qué tienen en común los grupos que dirigen a orto/para, como −CH₃ y −OH, frente a los que dirigen a meta, como −NO₂ y −COOH?',o:['Los directores orto/para aportan densidad electrónica al anillo (son activantes); los directores meta la retiran (son desactivantes)','Los directores orto/para siempre tienen átomos de oxígeno en su estructura; los directores meta nunca los tienen','Los directores orto/para son siempre gases a temperatura ambiente; los directores meta son siempre sólidos','No tienen nada en común: la posición a la que entra el nuevo grupo es aleatoria para cada sustituyente']}
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
   q:'¿Cómo se clasifica esta reacción?',o:['Sustitución nucleofílica: el OH⁻ reemplaza al bromo, que sale como Br⁻','Adición electrofílica: el OH⁻ se suma a un doble enlace del etano','Eliminación: se forman eteno y agua al salir el bromo','Combustión: el bromoetano se oxida a CO₂ y agua']},
  {a:'rx',c:'exp',k:'Q',ctx:'El 2-bromopropano se calienta con KOH disuelto en etanol (una base fuerte, sin agua).',
   q:'¿Cuál es el producto orgánico principal?',o:['propeno, por eliminación de HBr','propan-2-ol, por sustitución','propano, por reducción','2,2-dibromopropano, por adición']},
  {a:'nom',c:'uso',k:'Q',ctx:'Los haluros de alquilo se clasifican según cuántos carbonos están unidos al carbono que lleva el halógeno.',
   q:'¿Cuál de los siguientes es un haluro de alquilo terciario?',o:['2-bromo-2-metilpropano','1-bromobutano','2-bromobutano','bromometano']},
  {a:'rx',c:'ind',k:'Q',ctx:'Un grupo compara la rapidez con que reaccionan 1-clorobutano, 1-bromobutano y 1-yodobutano con el mismo nucleófilo, a la misma temperatura y concentración. Obtiene: yodo > bromo > cloro.',
   q:'¿Qué variable explica mejor la diferencia?',o:['La facilidad del halógeno para salir como ion: los halógenos más grandes son mejores grupos salientes','El número de carbonos de la cadena, que cambia en cada uno de los compuestos comparados','La electronegatividad: el halógeno más electronegativo es el que sale más rápido','La temperatura, que no pudo ser la misma en los tres ensayos del grupo']},
  {a:'nom',c:'uso',k:'Q',ctx:'El 1-cloropropano y el 2-cloropropano son dos compuestos distintos, aunque los dos tienen la fórmula molecular C₃H₇Cl.',
   q:'¿En qué se diferencian estructuralmente?',o:['En la posición del cloro dentro de la cadena: en uno está en un carbono del extremo y en el otro, en el carbono del medio','En el número de átomos de carbono que tiene la cadena principal de cada compuesto','En el número de átomos de cloro que tiene cada una de las dos moléculas','En que uno es un alcano y el otro es un alqueno con un doble enlace en la cadena']},
  {a:'prop',c:'exp',k:'CTS',ctx:'El DDT, un insecticida muy usado hasta los años 70 y hoy prohibido en la mayoría de países, tiene varios enlaces C−Cl y es muy poco soluble en agua.',
   q:'¿Por qué el DDT persiste tanto tiempo en el ambiente y se acumula en los tejidos grasos de los animales?',o:['Porque sus enlaces C−Cl son poco reactivos y, al ser insoluble en agua, se acumula en las grasas','Porque el DDT reacciona rápidamente con el agua de lluvia y forma compuestos más estables','Porque el DDT se evapora poco después de aplicarse y vuelve al suelo con la lluvia','Porque el cloro del DDT es radiactivo y no lo descomponen las bacterias del suelo']},
  {a:'rx',c:'exp',k:'Q',ctx:'El 2-bromo-2-metilpropano (terciario) reacciona con agua y forma el alcohol correspondiente mucho más rápido que el 1-bromobutano (primario), en las mismas condiciones.',
   q:'¿Qué explica esta diferencia de rapidez?',o:['El haluro terciario forma primero un carbocatión relativamente estable (mecanismo SN1); el primario no forma carbocationes estables con facilidad','El haluro primario tiene más átomos de carbono que el terciario, y una cadena más larga siempre reacciona más despacio','El bromo del haluro terciario es más electronegativo que el bromo del primario, así que sale del carbono con más facilidad','El haluro terciario tiene menos hidrógenos que el primario, y cada hidrógeno de menos acelera la reacción con el agua']},
  {a:'nom',c:'uso',k:'CTS',ctx:'El PVC (policloruro de vinilo), usado en tuberías, se fabrica polimerizando cloruro de vinilo, CH₂=CH−Cl.',
   q:'¿Cuál es el nombre IUPAC de este monómero?',o:['cloroeteno','cloroetano','1,1-dicloroeteno','cloroetino']},
  {a:'prop',c:'exp',k:'CTS',ctx:'El teflón, usado para recubrir sartenes antiadherentes, es politetrafluoroetileno, un polímero formado por unidades de tetrafluoroeteno (CF₂=CF₂).',
   q:'¿Por qué los enlaces C−F hacen que el teflón resista tanto el calor y evite reaccionar con otras sustancias?',o:['El enlace C−F es uno de los enlaces sencillos más fuertes y estables que puede formar el carbono','El flúor es poco electronegativo y por eso el enlace C−F es apolar','El enlace C−F se rompe con mucha facilidad y libera energía constantemente','El teflón es un compuesto iónico, sin enlaces covalentes']},
  {a:'rx',c:'ind',k:'Q',ctx:'Para comparar la rapidez de distintos haluros de alquilo, un grupo agrega nitrato de plata (AgNO₃) en etanol a tubos con 2-cloro-2-metilpropano, 1-clorobutano y clorobenceno, y mide cuánto tardan en formar un precipitado blanco de AgCl.',
   q:'Si el mecanismo SN1 es más rápido en haluros terciarios, ¿qué resultado se espera?',o:['El tubo con 2-cloro-2-metilpropano forma el precipitado primero','El tubo con clorobenceno forma el precipitado primero','El tubo con 1-clorobutano forma el precipitado primero','Los tres tubos forman el precipitado al mismo tiempo']},
  {a:'nom',c:'uso',k:'Q',ctx:'Observa la siguiente estructura:',f:'CH₂Cl−CH₂−CH₂−CH₂Cl',
   q:'¿Cuál es su nombre IUPAC?',o:['1,4-diclorobutano','1,3-diclorobutano','2,4-diclorobutano','1,4-dicloropentano']},
  {a:'prop',c:'exp',k:'CTS',ctx:'Los refrigerantes modernos (HFC, como el R-134a) reemplazaron a los CFC en neveras y aires acondicionados. Los HFC tienen flúor e hidrógeno, pero no cloro.',
   q:'¿Por qué eliminar el cloro de la molécula reduce el daño a la capa de ozono?',o:['Porque los enlaces C−F casi no se rompen con la radiación UV; es el cloro liberado de los C−Cl el que destruye el ozono en cadena','Porque sin cloro los HFC dejan de ser gases y ya no suben hasta la atmósfera, donde está la capa de ozono','Porque el flúor de los HFC reacciona con el oxígeno del aire y repara el ozono que ya se había destruido','Porque al quitar el cloro los HFC ya no contienen carbono y no pueden reaccionar con ninguna molécula']},
  {a:'nom',c:'uso',k:'Q',ctx:'Observa la siguiente estructura:',f:'CH₂Br−CH₂−CHCl−CH₃',
   q:'¿Cuál es su nombre IUPAC?',o:['1-bromo-3-clorobutano','3-bromo-1-clorobutano','1-cloro-3-bromobutano','1,3-bromoclorobutano']},
  {a:'prop',c:'exp',k:'Q',ctx:'El enlace C−Cl es polar, pero el 1-clorobutano es prácticamente insoluble en agua, casi igual que el butano.',
   q:'¿Qué explica esta baja solubilidad?',o:['La mayor parte de la molécula es una cadena de carbono apolar, que domina sobre la polaridad del único enlace C−Cl','El cloro repele las moléculas de agua por tener una carga negativa permanente','El 1-clorobutano reacciona con el agua antes de poder disolverse en ella','Los haluros de alquilo siempre son solubles en agua; este sería un caso excepcional']},
  {a:'nom',c:'uso',k:'CTS',ctx:'Antes de los anestésicos modernos como el halotano, el cloroformo (triclorometano) se usó durante casi un siglo como anestésico inhalado, hasta que se comprobó que dañaba el hígado y el corazón.',
   q:'¿Cuál es la fórmula molecular del cloroformo?',o:['CHCl₃','CCl₄','CH₂Cl₂','CH₃Cl']},
  {a:'nom',c:'uso',k:'Q',ctx:'Un haluro de alquilo se clasifica como primario, secundario o terciario según cuántos carbonos están unidos al carbono que lleva el halógeno.',
   q:'¿Cómo se clasifica el 2-bromobutano?',o:['Secundario, porque el carbono con el bromo está unido a otros dos carbonos','Primario, porque el carbono con el bromo está unido a un solo carbono','Terciario, porque el carbono con el bromo está unido a tres carbonos','No se puede clasificar sin ver la estructura completa']},
  {a:'rx',c:'exp',k:'Q',ctx:'El 2-bromo-2-metilpropano (terciario) se calienta en etanol, sin una base fuerte añadida, y forma 2-metilpropeno junto con HBr.',
   q:'¿Cómo se llama el mecanismo de esta eliminación, dado que el haluro es terciario y no hay una base fuerte presente?',o:['E1: se forma primero un carbocatión terciario estable, y luego se pierde un H⁺ vecino','E2: el ataque de la base y la salida del halógeno ocurren en un solo paso','SN1: el nucleófilo ataca al carbocatión y sustituye al halógeno','SN2: el nucleófilo ataca por el lado opuesto al halógeno saliente']},
  {a:'rx',c:'ind',k:'Q',ctx:'Un grupo hace reaccionar NaOH con tres haluros de alquilo distintos (1-clorobutano, 2-clorobutano y 2-cloro-2-metilpropano) en las mismas condiciones, y mide qué tan rápido ocurre la sustitución nucleofílica tipo SN2.',
   q:'¿Qué resultado se espera, si el mecanismo es SN2?',o:['El haluro primario (1-clorobutano) reacciona más rápido, porque el nucleófilo ataca con menos impedimento estérico','El haluro terciario reacciona más rápido, porque forma un carbocatión más estable','Los tres reaccionan a la misma velocidad, porque todos tienen un solo cloro','El haluro secundario siempre es el más rápido en cualquier mecanismo']},
  {a:'nom',c:'uso',k:'Q',ctx:'Observa la siguiente estructura:',f:'CH₃−CH₂−CHCl−CH₂−CH₃',
   q:'¿Cuál es su nombre IUPAC?',o:['3-cloropentano','2-cloropentano','3-clorobutano','1-cloropentano']},
  {a:'prop',c:'ind',k:'Q',ctx:'Se comparan los puntos de ebullición de tres haluros de metilo: fluorometano (−78 °C), clorometano (−24 °C) y bromometano (4 °C).',
   q:'¿Qué tendencia muestran estos datos al aumentar el tamaño del halógeno?',o:['El punto de ebullición aumenta, porque los halógenos más grandes y pesados generan fuerzas de London más intensas','El punto de ebullición disminuye, porque los halógenos más grandes son menos electronegativos','El punto de ebullición no depende del halógeno, solo del número de carbonos','El punto de ebullición disminuye porque el enlace C−X se hace más polar']}
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
   q:'¿En qué tubo NO hay cambio y por qué?',o:['En el de 2-metilpropan-2-ol, porque es un alcohol terciario y su carbono con −OH no tiene hidrógenos','En el de butan-1-ol, porque los alcoholes primarios no tienen hidrógenos en el carbono del −OH','En el de butan-2-ol, porque los alcoholes secundarios solo se oxidan con luz ultravioleta','En ninguno: los tres deberían cambiar de color porque todos tienen un grupo −OH']},
  {a:'nom',g:'alcoholes',c:'uso',k:'CTS',ctx:'El anticongelante de los radiadores contiene etano-1,2-diol (etilenglicol), un alcohol con dos grupos −OH.',
   q:'¿Cuál es su fórmula estructural?',o:['HO−CH₂−CH₂−OH','HO−CH₂−CH₃','CH₃−CH(OH)−CH₃','HO−CH₂−CH(OH)−CH₂−OH']},
  {a:'nom',g:'alcoholes',c:'uso',k:'CTS',ctx:'La glicerina (propano-1,2,3-triol), que forma parte de las grasas (combinada en los triglicéridos), se usa en cosméticos, jarabes y jabones por su capacidad de retener agua.',
   q:'¿Cuántos grupos −OH tiene la glicerina?',o:['Tres','Uno','Dos','Ninguno: es un éter']},
  {a:'nom',g:'alcoholes',c:'uso',k:'Q',ctx:'Un alcohol se clasifica como primario, secundario o terciario según cuántos carbonos están unidos al carbono que lleva el −OH.',
   q:'¿Cómo se clasifica el 2-metilpropan-2-ol, (CH₃)₃C−OH?',o:['Terciario, porque el carbono con el −OH está unido a otros tres carbonos','Primario, porque el carbono con el −OH está unido a un solo carbono','Secundario, porque el carbono con el −OH está unido a dos carbonos','No se puede clasificar sin verlo dibujado']},
  {a:'prop',g:'alcoholes',c:'uso',k:'CTS',ctx:'Una botella de aguardiente antioqueño indica «29 °GL», es decir, 29 % de etanol en volumen; una cerveza típica tiene entre 4 °GL y 5 °GL.',
   q:'¿Qué significa, en términos químicos, que una bebida tenga un grado GL más alto?',o:['Que un mayor porcentaje del volumen de la bebida es etanol puro','Que la bebida tiene más azúcar sin fermentar','Que la bebida tiene más agua que etanol','Que la bebida se fermentó a una temperatura mayor']},
  {a:'prop',g:'alcoholes',c:'exp',k:'Q',ctx:'El metanol, el etanol y el propan-1-ol se mezclan con agua en cualquier proporción, pero el octan-1-ol forma dos capas separadas al mezclarse con agua.',
   q:'¿Qué explica que el octan-1-ol sea mucho menos soluble en agua que los alcoholes más pequeños?',o:['Su cadena de carbono, larga y apolar, pesa más en la molécula que el único grupo −OH polar','El octan-1-ol no tiene grupo −OH, así que no puede interactuar con el agua','El octan-1-ol es un ácido y no un alcohol, por eso no se mezcla con el agua','El agua reacciona con el octan-1-ol y forma un gas que separa las dos capas']},
  {a:'nom',g:'eteres',c:'uso',k:'CTS',ctx:'El éter dietílico (CH₃−CH₂−O−CH₂−CH₃) se usó como uno de los primeros anestésicos generales inhalados, antes del halotano.',
   q:'¿Cuál es su nombre IUPAC?',o:['etoxietano','dietoxietano','metoxietano','etanoato de etilo']},
  {a:'prop',g:'alcoholes',c:'exp',k:'CTS',ctx:'El gel antibacterial para manos contiene alcohol (etanol o isopropanol) en alta concentración, que se evapora con rapidez después de aplicarlo.',
   q:'¿Qué propiedad del alcohol explica esa evaporación rápida, comparada con el agua pura?',o:['Sus moléculas se atraen entre sí con menos fuerza que las del agua, por lo que escapan al aire con más facilidad','El alcohol hierve a una temperatura mucho mayor que el agua, por eso se calienta antes','El alcohol no forma puentes de hidrógeno, porque no tiene átomos de oxígeno','El agua se evapora siempre más rápido que cualquier alcohol a la misma temperatura']},
  {a:'nom',g:'alcoholes',c:'uso',k:'Q',ctx:'Observa la siguiente estructura:',f:'CH₃−CH₂−CH(OH)−CH₂−CH₃',
   q:'¿Cuál es su nombre IUPAC?',o:['pentan-3-ol','pentan-2-ol','pentan-1-ol','3-hidroxipentano']},
  {a:'rx',g:'alcoholes',c:'exp',k:'CTS',ctx:'En Colombia la gasolina se mezcla con etanol como oxigenante, lo que ayuda a una combustión más completa y reduce las emisiones de monóxido de carbono.',
   q:'¿Por qué agregar un compuesto con oxígeno al combustible ayuda a reducir el CO emitido?',o:['Porque aporta oxígeno a la combustión y el carbono se oxida hasta CO₂ en vez de quedar como CO','Porque el etanol enfría el motor y eso evita que se forme CO','Porque el etanol no se quema y simplemente diluye los gases de escape','Porque el etanol reacciona con el CO después de la combustión y lo elimina']},
  {a:'prop',g:'ambos',c:'exp',k:'Q',ctx:'El propano (M=44 g/mol), el metoxietano (un éter, M=60 g/mol) y el propan-1-ol (M=60 g/mol) hierven a −42 °C, 7 °C y 97 °C, respectivamente.',
   q:'¿Qué explica que el propan-1-ol hierva a una temperatura mucho mayor que el éter, de masa molar parecida?',o:['El propan-1-ol forma puentes de hidrógeno entre sus moléculas gracias al −OH; el éter no puede formarlos entre las suyas','El propan-1-ol tiene mayor masa molar que el éter, y a más masa molar el punto de ebullición sube mucho','El éter tiene un enlace C−O−C más fuerte que el enlace C−OH del alcohol, así que sus moléculas se separan fácil','El éter forma puentes de hidrógeno entre sus moléculas, pero son más débiles que los del alcohol']},
  {a:'nom',g:'alcoholes',c:'uso',k:'Q',ctx:'Observa la siguiente estructura:',f:'CH₃−CH(OH)−CH(CH₃)−CH₃',
   q:'¿Cuál es su nombre IUPAC?',o:['3-metilbutan-2-ol','2-metilbutan-3-ol','3-metilbutan-1-ol','2-metilbutan-2-ol']},
  {a:'rx',g:'alcoholes',c:'exp',k:'Q',ctx:'Un alcohol primario con CrO₃/H⁺ (oxidante fuerte) sigue hasta ácido carboxílico; con clorocromato de piridinio, CCP (oxidante suave), se detiene en el aldehído. Un alcohol secundario, en cambio, da el mismo producto con cualquiera de los dos oxidantes.',
   q:'¿Por qué un alcohol secundario no se ve afectado por la fuerza del oxidante, a diferencia del primario?',o:['Porque la cetona que se forma no tiene un hidrógeno en el carbonilo, así que no puede oxidarse más','Porque los alcoholes secundarios no reaccionan con ningún oxidante','Porque el CCP no reacciona nunca con alcoholes secundarios','Porque los alcoholes secundarios siempre dan ácido carboxílico, sin importar el oxidante']},
  {a:'rx',g:'alcoholes',c:'exp',k:'Q',ctx:'El etanol reacciona con H₂SO₄ concentrado como catalizador, pero el producto depende de la temperatura: a unos 140 °C se favorece la deshidratación intermolecular (entre dos moléculas de alcohol) y a unos 180 °C, la intramolecular (dentro de una sola molécula).',
   q:'¿Qué producto se espera a 140 °C?',o:['Un éter (etoxietano), por la unión de dos moléculas de etanol con pérdida de agua','Un alqueno (eteno), por eliminación dentro de una sola molécula','Un ácido carboxílico, por oxidación del alcohol','Ningún cambio: el H₂SO₄ no reacciona a esa temperatura']},
  {a:'prop',g:'alcoholes',c:'exp',k:'Q',ctx:'El fenol (C₆H₅−OH) reacciona con NaOH y forma una sal (fenóxido de sodio) soluble en agua; el etanol, en cambio, no reacciona con NaOH.',
   q:'¿Qué explica esta diferencia?',o:['El fenol es un ácido débil (su −OH cede H⁺ con más facilidad, porque el anillo aromático estabiliza la carga negativa que queda); el etanol no es ácido en esas condiciones','El fenol tiene un átomo de oxígeno extra que el etanol no tiene, y ese oxígeno es el que reacciona con el NaOH para formar la sal','El etanol es una base y por eso no puede reaccionar con otra base como el NaOH, mientras que el fenol es neutro','El fenol no tiene ningún grupo −OH: reacciona con el NaOH porque el anillo aromático cede un hidrógeno']},
  {a:'rx',g:'eteres',c:'exp',k:'Q',ctx:'Para preparar un éter a partir de un alcóxido de sodio (R−O⁻Na⁺) y un haluro de alquilo (R′−X), como en la síntesis de Williamson, el ion alcóxido actúa como nucleófilo y ataca al carbono unido al halógeno.',
   q:'¿Qué tipo de reacción es esta síntesis?',o:['Sustitución nucleofílica: el alcóxido reemplaza al halógeno','Adición electrofílica sobre un doble enlace','Eliminación, formando un alqueno','Oxidación del alcóxido a un ácido carboxílico']},
  {a:'prop',g:'eteres',c:'exp',k:'Q',ctx:'El etoxietano (dietil éter) hierve a 35 °C, mucho más bajo que el butan-1-ol (118 °C), aunque los dos tienen una masa molar parecida (74 g/mol).',
   q:'¿Qué explica esta diferencia tan grande en el punto de ebullición?',o:['El éter no tiene ningún H unido a O, así que sus moléculas no pueden formar puentes de hidrógeno entre sí; el alcohol sí','El éter tiene una masa molar mucho menor que el alcohol y por eso necesita menos energía para hervir','El alcohol es un compuesto iónico y el éter es covalente, así que sus moléculas se atraen menos','El éter reacciona con el aire antes de hervir y lo que se mide es la temperatura de otra sustancia']}
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
  {a:'prop',g:'aldehidos',c:'exp',k:'CTS',ctx:'El formol, que se usa para conservar muestras biológicas, es una solución acuosa de metanal.',
   q:'¿Por qué se recomienda manipularlo con ventilación, guantes y gafas?',o:['Porque el metanal es tóxico e irritante y está clasificado como cancerígeno','Porque el metanal es muy inflamable incluso disuelto en agua','Porque el formol es un ácido fuerte que corroe la piel','Porque el metanal es inodoro y no se nota si hay fugas']},
  {a:'rx',g:'ambos',c:'ind',k:'Q',ctx:'Para distinguir propanal de propanona, se calienta suavemente cada uno con reactivo de Tollens (nitrato de plata amoniacal).',
   q:'¿Qué observación identifica al aldehído?',o:['Se forma un espejo de plata en el tubo del propanal','Se forma un espejo de plata en el tubo de la propanona','Ambos tubos forman un precipitado rojo ladrillo','Ninguno cambia, porque los dos tienen grupo carbonilo']},
  {a:'rx',g:'ambos',c:'exp',k:'Q',ctx:'Los aldehídos se oxidan con facilidad a ácidos carboxílicos, mientras que las cetonas resisten la oxidación en condiciones suaves.',
   q:'¿Qué explica esta diferencia?',o:['El carbono del carbonilo del aldehído tiene un hidrógeno unido; el de la cetona está unido a dos carbonos','Las cetonas no tienen grupo carbonilo, por eso resisten la oxidación en condiciones suaves','Los aldehídos tienen un triple enlace C≡O, que es más fácil de romper que el doble','Las cetonas son siempre gases y no alcanzan a reaccionar dentro de una solución acuosa']},
  {a:'nom',g:'cetonas',c:'uso',k:'CTS',ctx:'En personas con diabetes no controlada el aliento puede oler a «quitaesmalte». Ese olor se debe a la propanona que se produce cuando el cuerpo degrada grasas.',
   q:'¿A qué grupo funcional pertenece la propanona?',o:['Cetona','Aldehído','Éster','Alcohol']},
  {a:'nom',g:'aldehidos',c:'uso',k:'Q',ctx:'Observa la siguiente estructura:',f:'CH₃−CH₂−CH₂−CH₂−CHO',
   q:'¿Cuál es su nombre IUPAC?',o:['pentanal','pentan-1-al','pentanona','butanal']},
  {a:'nom',g:'aldehidos',c:'uso',k:'CTS',ctx:'La vainillina, responsable del aroma y sabor de la vainilla, es un aldehído aromático que también se usa en perfumería y repostería.',
   q:'¿Qué grupo funcional identifica a la vainillina como aldehído?',o:['−CHO','−COOH','−O−CH₃','−OH']},
  {a:'rx',g:'aldehidos',c:'ind',k:'CTS',ctx:'Antes de los glucómetros electrónicos se usaba el reactivo de Fehling (sulfato de cobre en medio básico, de color azul) para detectar azúcares reductores, como la glucosa, en la orina de personas con sospecha de diabetes.',
   q:'¿Qué cambio se observa cuando el reactivo de Fehling reacciona con un aldehído como el de la glucosa?',o:['Se forma un precipitado rojo ladrillo de óxido de cobre(I), porque el aldehído se oxida y reduce al cobre','La solución se vuelve completamente transparente porque el cobre se evapora','Se forma un gas que hace burbujear la mezcla y luego desaparece el color','El color azul se intensifica sin que se forme ningún precipitado en el tubo']},
  {a:'nom',g:'cetonas',c:'uso',k:'Q',ctx:'Observa la siguiente estructura:',f:'CH₃−CH₂−CO−CH₂−CH₃',
   q:'¿Cuál es su nombre IUPAC?',o:['pentan-3-ona','pentan-2-ona','pentanal','pentan-3-al']},
  {a:'nom',g:'aldehidos',c:'uso',k:'CTS',ctx:'El aldehído cinámico (C₆H₅−CH=CH−CHO) es el responsable del aroma y el sabor característico de la canela.',
   q:'¿Qué grupos funcionales tiene esta molécula, además del anillo aromático?',o:['Un doble enlace C=C y un grupo aldehído (−CHO)','Dos grupos −OH en la cadena','Un grupo éster y un grupo amida','Un triple enlace y una cetona']},
  {a:'nom',g:'aldehidos',c:'uso',k:'CTS',ctx:'El metanal (formaldehído) es un gas que se usa para fabricar las resinas que unen las partículas de madera en los muebles de aglomerado.',
   q:'¿Cuál es la fórmula estructural del metanal?',o:['H−CHO','CH₃−CHO','H−COOH','CH₃−OH']},
  {a:'rx',g:'cetonas',c:'ind',k:'Q',ctx:'Un grupo agrega dicromato de potasio acidificado (color naranja) a dos tubos, en las mismas condiciones: uno con ciclohexanol y otro con ciclohexanona.',
   q:'¿Qué resultado se espera?',o:['Solo cambia a verde el tubo con ciclohexanol','Solo el tubo con ciclohexanona cambia de color','Los dos tubos cambian de color por igual','Ninguno de los dos tubos cambia de color']},
  {a:'prop',g:'cetonas',c:'exp',k:'CTS',ctx:'La acetona (propanona) del quitaesmalte disuelve tanto el esmalte de uñas (orgánico, apolar) como manchas de sustancias polares, y además se mezcla con agua en cualquier proporción.',
   q:'¿Qué característica de la acetona explica que disuelva sustancias tan distintas entre sí?',o:['Tiene una parte polar (C=O) y una parte apolar (dos grupos metilo)','La acetona es un compuesto iónico que se disuelve en cualquier líquido','La acetona no tiene ningún átomo de oxígeno en su estructura','La acetona reacciona químicamente con todo lo que disuelve']},
  {a:'prop',g:'ambos',c:'exp',k:'Q',ctx:'A masa molar parecida, los alcanos tienen el punto de ebullición más bajo, los aldehídos y las cetonas uno intermedio, y los alcoholes el más alto.',
   q:'¿Qué explica que los aldehídos y las cetonas hiervan a mayor temperatura que los alcanos, pero a menor temperatura que los alcoholes?',o:['El grupo C=O es polar y permite atracciones dipolo-dipolo entre moléculas, pero no puentes de hidrógeno entre ellas mismas, al no tener un H unido al O','Los aldehídos y las cetonas no tienen ningún tipo de fuerza entre sus moléculas, y hierven más alto solo porque son más pesados','Los aldehídos y las cetonas forman puentes de hidrógeno entre sus moléculas, más fuertes incluso que los de los alcoholes','El grupo C=O hace que la molécula pese menos que un alcano del mismo tamaño, y eso sube su punto de ebullición']},
  {a:'nom',g:'aldehidos',c:'uso',k:'Q',ctx:'Observa la siguiente estructura:',f:'CH₃−CH(CH₃)−CHO',
   q:'¿Cuál es su nombre IUPAC?',o:['2-metilpropanal','3-metilpropanal','2-metilbutanal','2-metilpropanona']},
  {a:'nom',g:'cetonas',c:'uso',k:'CTS',ctx:'La etil metil cetona (butan-2-ona, MEK) es un disolvente industrial común en pinturas, pegantes y barnices.',
   q:'¿Cuál es su fórmula estructural?',o:['CH₃−CO−CH₂−CH₃','CH₃−CH₂−CO−CH₂−CH₃','CH₃−CH₂−CH₂−CHO','CH₃−CH(OH)−CH₂−CH₃']},
  {a:'nom',g:'aldehidos',c:'uso',k:'Q',ctx:'En la retina del ojo humano, el retinal (un aldehído derivado de la vitamina A) cambia de forma geométrica al absorber luz, lo que dispara la señal nerviosa de la visión.',
   q:'¿Qué tienen en común el retinal y otros aldehídos, sin importar su tamaño?',o:['Todos tienen un grupo −CHO: un carbonilo (C=O) unido al menos a un hidrógeno','Todos tienen un anillo aromático unido al carbonilo','Todos son solubles en agua en cualquier proporción','Todos tienen el mismo número de átomos de carbono']},
  {a:'nom',g:'aldehidos',c:'uso',k:'CTS',ctx:'El cinamaldehído, responsable del aroma y sabor de la canela, también se usa como repelente de insectos. Su estructura es C₆H₅−CH=CH−CHO.',
   q:'¿Cuál es su nombre IUPAC?',o:['3-fenilprop-2-enal','3-fenilbut-2-enal','benceno-2-enocarbaldehído','prop-2-enobencenocarbaldehído']},
  {a:'rx',g:'ambos',c:'exp',k:'Q',ctx:'El bromuro de metilmagnesio (CH₃MgBr), un reactivo de Grignard, ataca al carbono del grupo carbonilo (C=O) de un aldehído o una cetona.',
   q:'¿Por qué el carbono del carbonilo es el punto atacado por este reactivo?',o:['Porque el oxígeno, más electronegativo, deja a ese carbono con carga parcial positiva (δ+), atractiva para un nucleófilo como el CH₃⁻','Porque ese carbono tiene carga parcial negativa y atrae al magnesio del reactivo de Grignard','Porque el carbonilo es la parte menos reactiva de la molécula y por eso el reactivo puede unirse sin romperla','Porque el reactivo de Grignard ataca solo a los hidrógenos de la molécula, y el carbonilo es el que más tiene']},
  {a:'rx',g:'cetonas',c:'exp',k:'Q',ctx:'Los aldehídos dan positivas las pruebas de Tollens y Fehling (se oxidan con facilidad); las cetonas no reaccionan con ninguno de los dos reactivos.',
   q:'¿Qué explica que las cetonas no se oxiden en estas pruebas?',o:['El carbono del carbonilo de una cetona está unido a dos carbonos, sin ningún H que perder en la oxidación','Las cetonas no tienen ningún átomo de oxígeno en su estructura','Las cetonas son siempre gases y no pueden reaccionar en un tubo de ensayo','Las cetonas reaccionan igual que los aldehídos, pero más lento']},
  {a:'rx',g:'ambos',c:'exp',k:'Q',ctx:'El NaBH₄ reduce el grupo carbonilo (C=O) de un aldehído o una cetona a un alcohol, pero no reduce un doble enlace C=C presente en la misma molécula.',
   q:'¿Cómo se llama esta capacidad de un reactivo para transformar un grupo funcional sin afectar a otro presente en la misma molécula?',o:['Quimioselectividad','Isomería','Hibridación','Deslocalización electrónica']}
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
   q:'¿Qué explica estas observaciones?',o:['El −COOH cede solo parcialmente su H⁺ al agua: el ácido etanoico es un ácido débil','El −COOH libera iones OH⁻ al agua y por eso el pH sube a 3','El ácido etanoico se ioniza por completo, igual que el HCl','El ácido etanoico no tiene hidrógenos que pueda ceder al agua']},
  {a:'rx',g:'esteres',c:'ind',k:'CTS',ctx:'En una práctica se calienta aceite de palma con NaOH y se espera obtener jabón y glicerol.',
   q:'¿Qué evidencia es más adecuada para comprobar que se formó jabón?',o:['El producto forma espuma al agitarlo con agua y ayuda a retirar una mancha de grasa','El aceite cambia de color al calentarse con el NaOH en el recipiente','El volumen de la mezcla aumenta cuando se calienta en la estufa','Se desprende un gas que enturbia el agua de cal en otro tubo']},
  {a:'rx',g:'esteres',c:'uso',k:'CTS',ctx:'Colombia mezcla el diésel con biodiésel elaborado a partir de aceite de palma. El biodiésel está formado principalmente por ésteres metílicos de ácidos grasos.',
   q:'¿Qué reacción lo produce?',o:['Transesterificación del aceite (un triglicérido) con metanol','Hidrogenación del aceite con H₂ y níquel','Fermentación de la glucosa de la palma','Combustión incompleta del aceite de palma']},
  {a:'prop',g:'acidos',c:'exp',k:'Q',ctx:'El ácido etanoico (60 g/mol) hierve a 118 °C y el propan-1-ol (60 g/mol) a 97 °C.',
   q:'¿Por qué el ácido hierve a mayor temperatura si tienen la misma masa molar?',o:['Las moléculas del ácido se asocian en parejas (dímeros) unidas por dos puentes de hidrógeno, y separarlas exige más energía','El ácido etanoico tiene una masa molar mucho mayor que el propan-1-ol, y eso basta para explicar la diferencia','El propan-1-ol no puede formar puentes de hidrógeno porque su −OH está unido a un carbono apolar','El ácido etanoico es un compuesto iónico, formado por iones H⁺ y acetato, que se atraen con fuerza']},
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
   q:'¿Qué observación indicaría que es el ácido carboxílico?',o:['Se forman burbujas de CO₂ de inmediato, porque el ácido reacciona con el bicarbonato','La mezcla cambia a color azul porque el ácido tiñe el bicarbonato','No ocurre ningún cambio visible porque los ácidos orgánicos son débiles','Se forma un precipitado blanco sin liberar gas, porque el bicarbonato no se disuelve']},
  {a:'nom',g:'acidos',c:'uso',k:'CTS',ctx:'El benzoato de sodio, sal de sodio del ácido C₆H₅−COOH, se usa como conservante en bebidas y alimentos procesados, para evitar el crecimiento de hongos y bacterias.',
   q:'¿Cuál es el nombre IUPAC del ácido del que proviene esta sal?',o:['ácido benzoico','ácido fenilacético','ácido fenoico','ácido hexanoico']},
  {a:'prop',g:'acidos',c:'exp',k:'CTS',ctx:'El jabón, una sal de ácido graso, tiene una «cola» larga de hidrocarburo (apolar) y una «cabeza» con carga negativa (polar), proveniente del grupo −COO⁻.',
   q:'¿Cómo le permite esa estructura al jabón quitar la grasa de un plato al lavarlo con agua?',o:['La cola apolar se introduce en la grasa y las cabezas polares quedan hacia el agua, de modo que la gota se dispersa y se arrastra con el agua','El jabón reacciona con la grasa y la convierte en agua, que se va por el desagüe junto con la espuma','El jabón reacciona con la grasa y la transforma en sal de cocina, que se disuelve en el agua del lavaplatos','El jabón sube la temperatura del agua y así derrite la grasa del plato hasta que se evapora con el vapor']},
  {a:'nom',g:'esteres',c:'uso',k:'Q',ctx:'Observa la siguiente estructura:',f:'CH₃−CH₂−COO−CH₃',
   q:'¿Cuál es su nombre IUPAC?',o:['propanoato de metilo','metanoato de propilo','propanoato de etilo','ácido propanoico de metilo']},
  {a:'prop',g:'ambos',c:'exp',k:'Q',ctx:'El ácido butanoico (88 g/mol) hierve a 164 °C, mientras que el etanoato de etilo (88 g/mol), un éster, hierve a 77 °C.',
   q:'¿Qué diferencia estructural explica que el éster hierva a una temperatura mucho menor?',o:['El éster no tiene un H unido a oxígeno, así que sus moléculas no forman puentes de hidrógeno entre sí','El éster tiene una masa molar mucho menor que la del ácido, por eso hierve antes','El éster tiene un enlace doble C=C que debilita las fuerzas entre sus moléculas','Los ésteres forman puentes de hidrógeno más fuertes que los ácidos']},
  {a:'nom',g:'acidos',c:'uso',k:'CTS',ctx:'El ácido cítrico, presente en el limón y otros cítricos, tiene tres grupos −COOH en su estructura.',
   q:'¿Cómo se clasifica un ácido con tres grupos carboxilo, según el número de esos grupos?',o:['Triprótico (puede ceder hasta tres H⁺)','Monoprótico','Diprótico','Neutro, porque sus grupos se cancelan entre sí']},
  {a:'nom',g:'acidos',c:'uso',k:'CTS',ctx:'La espinaca y el ruibarbo contienen ácido etanodioico (ácido oxálico), HOOC−COOH, que en grandes cantidades puede formar cristales de oxalato de calcio en los riñones.',
   q:'¿Cuántos grupos −COOH tiene el ácido etanodioico?',o:['Dos','Uno','Tres','Ninguno: es un alcohol']},
  {a:'nom',g:'acidos',c:'uso',k:'Q',ctx:'Observa la siguiente estructura: un anillo de benceno unido a un grupo −CO−Cl.',
   q:'¿Cuál es su nombre IUPAC?',o:['cloruro de benzoílo','cloruro de bencilo','ácido clorobenzoico','benzoato de cloro']},
  {a:'nom',g:'esteres',c:'uso',k:'CTS',ctx:'El aroma de la piña se debe en parte al butanoato de etilo, un éster que también se usa como saborizante artificial.',
   q:'¿Cuál es su fórmula estructural?',o:['CH₃−CH₂−CH₂−COO−CH₂−CH₃','CH₃−COO−CH₂−CH₂−CH₃','CH₃−CH₂−CH₂−CH₂−COO−CH₃','CH₃−CH₂−COO−CH₂−CH₂−CH₃']},
  {a:'prop',g:'acidos',c:'exp',k:'Q',ctx:'El ácido etanoico y el fenol (C₆H₅−OH) pueden ceder un H⁺ en agua, pero el ácido etanoico es mucho más ácido.',
   q:'¿Qué explica esta diferencia?',o:['El ion acetato (CH₃−COO⁻) deslocaliza la carga negativa entre dos oxígenos equivalentes, más eficazmente que el fenóxido, que la deslocaliza solo hacia el anillo','El fenol no tiene ningún oxígeno que pueda ceder un H⁺, así que su acidez se debe solo a los hidrógenos del anillo','El ácido etanoico es un ácido fuerte que se ioniza por completo en agua, igual que el ácido clorhídrico','El fenol es una base y no un ácido, porque el anillo aromático acepta los H⁺ del agua']},
  {a:'rx',g:'esteres',c:'exp',k:'Q',ctx:'En la esterificación de Fischer (ácido + alcohol → éster + agua), siempre se usa H₂SO₄ o H⁺ como catalizador.',
   q:'¿Cuál es la función principal del H⁺ en esta reacción?',o:['Protona el grupo carbonilo del ácido, haciéndolo más reactivo para que el alcohol lo ataque','Se incorpora al éster final como parte de su estructura, junto al alcohol','Neutraliza el ácido carboxílico antes de que este reaccione con el alcohol','Rompe el enlace C−C de la cadena del ácido para que entre el alcohol']}
 ],
 nitrogenados:[
  {a:'nom',g:'aminas',c:'uso',k:'Q',ctx:'Observa la siguiente estructura:',f:'CH₃−CH₂−NH₂',
   q:'¿Cuál es su nombre IUPAC?',o:['etanamina','etanamida','etanonitrilo','metanamina']},
  {a:'nom',g:'amidas',c:'uso',k:'Q',ctx:'Observa la siguiente estructura:',f:'CH₃−CH₂−CO−NH₂',
   q:'¿Cuál es su nombre IUPAC?',o:['propanamida','propanamina','butanamida','etanamida']},
  {a:'nom',g:'nitrilos',c:'uso',k:'Q',ctx:'Observa la siguiente estructura:',f:'CH₃−CH₂−C≡N',
   q:'¿Cuál es su nombre IUPAC?',o:['propanonitrilo','etanonitrilo','propanamina','butanonitrilo']},
  {a:'prop',g:'aminas',c:'exp',k:'Q',ctx:'Al disolver etanamina en agua, la solución se vuelve básica.',
   q:'¿Qué explica este comportamiento?',o:['El nitrógeno tiene un par de electrones libre que puede aceptar un H⁺ del agua','El nitrógeno cede con facilidad un H⁺ al agua y la vuelve básica','La etanamina contiene iones OH⁻ en su estructura que pasan al agua','El nitrógeno tiene una carga positiva permanente que atrae al OH⁻']},
  {a:'prop',g:'nitrilos',c:'uso',k:'CTS',ctx:'La yuca amarga contiene linamarina, un compuesto con grupo nitrilo (−C≡N) que puede liberar cianuro de hidrógeno (HCN). Antes de consumirla se ralla, se lava y se cocina.',
   q:'¿Cuál es el propósito de ese procesamiento?',o:['Eliminar el HCN y los compuestos que lo liberan, que son tóxicos','Aumentar la cantidad de nitrilo para mejorar el sabor','Convertir el almidón de la yuca en proteínas','Neutralizar el ácido acético que contiene la yuca']},
  {a:'nom',g:'aminas',c:'uso',k:'Q',ctx:'Las aminas se clasifican según cuántos grupos carbonados están unidos al nitrógeno.',
   q:'¿Cuál de las siguientes es una amina secundaria?',o:['CH₃−NH−CH₃ (N-metilmetanamina)','CH₃−CH₂−NH₂ (etanamina)','(CH₃)₃N (N,N-dimetilmetanamina)','CH₃−CO−NH₂ (etanamida)']},
  {a:'nom',g:'amidas',c:'uso',k:'CTS',ctx:'El paracetamol (acetaminofén), uno de los analgésicos más usados, contiene en su estructura el grupo −NH−CO−.',
   q:'¿A qué grupo funcional corresponde?',o:['Amida','Amina','Nitrilo','Éster']},
  {a:'rx',g:'aminas',c:'ind',k:'Q',ctx:'El olor del pescado se debe en parte a aminas volátiles. Un estudiante propone la hipótesis: «el jugo de limón reduce el olor porque su ácido reacciona con las aminas y forma sales que no se evaporan».',
   q:'¿Qué experimento permite poner a prueba esta hipótesis?',o:['Comparar el olor de muestras iguales de pescado tratadas con limón, con agua y sin tratamiento','Agregar limón a todas las muestras de pescado y oler solo una de ellas al final','Cocinar el pescado durante más tiempo sin agregarle nada y comparar el olor','Medir la masa del pescado antes y después de agregarle el jugo de limón']},
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
   q:'¿Qué procedimiento permitiría separar una amina de una mezcla con un hidrocarburo, aprovechando esta propiedad?',o:['Agitar la mezcla con HCl diluido: la amina pasa a la fase acuosa como sal y el hidrocarburo queda en la fase orgánica','Calentar la mezcla hasta que hierva toda el agua y quede solamente la amina en el fondo del recipiente','Agregar más hidrocarburo a la mezcla para que la amina se disuelva en él por completo y se pueda decantar','Agregar NaOH concentrado y esperar a que la amina se evapore de la mezcla mientras el hidrocarburo se queda']},
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
   q:'¿Cuál es la diferencia estructural clave entre los dos grupos?',o:['La amida tiene el nitrógeno unido a un carbono carbonilo (C=O); la amina tiene el nitrógeno unido directamente a un carbono de la cadena, sin C=O','La amina tiene el nitrógeno unido a un carbono con doble enlace a oxígeno; la amida tiene el nitrógeno unido a un carbono de la cadena','La amida tiene el nitrógeno unido a un oxígeno (N−O); la amina tiene el nitrógeno unido solo a carbonos e hidrógenos','La amida tiene un triple enlace entre carbono y nitrógeno; la amina tiene un enlace sencillo']},
  {a:'nom',g:'aminas',c:'uso',k:'CTS',ctx:'La cadaverina, H₂N−CH₂−CH₂−CH₂−CH₂−CH₂−NH₂, se produce cuando bacterias degradan el aminoácido lisina y es responsable del olor de la materia orgánica en descomposición.',
   q:'¿Cuál es su nombre IUPAC?',o:['pentano-1,5-diamina','N,N-pentilamina','pentan-1,5-diamida','1,5-diaminopentanol']},
  {a:'nom',g:'aminas',c:'uso',k:'CTS',ctx:'La feniletilamina, presente en el chocolate, es un anillo de benceno unido a una cadena de dos carbonos que termina en un grupo −NH₂.',
   q:'¿Cuál es su nombre IUPAC?',o:['2-feniletan-1-amina','1-feniletan-2-amina','N-fenilamina','feniletanoamida']},
  {a:'rx',g:'amidas',c:'uso',k:'CTS',ctx:'Un fragmento de la hormona oxitocina tiene la secuencia Cys-Tyr-Ile-Gln-Asn-Cys-Pro-Leu-Gly (9 residuos de aminoácidos), unidos uno a uno por enlaces peptídicos.',
   q:'¿Cuántos enlaces peptídicos hay en este fragmento?',o:['8','9','10','7']},
  {a:'prop',g:'aminas',c:'exp',k:'Q',ctx:'La etanamina es una base más fuerte que la anilina (C₆H₅−NH₂), aunque las dos tienen un nitrógeno con un par de electrones libre.',
   q:'¿Qué explica que la anilina sea una base más débil?',o:['En la anilina el par libre del nitrógeno se deslocaliza hacia el anillo aromático y queda menos disponible para aceptar un H⁺','La anilina no tiene ningún par de electrones libre en el nitrógeno, porque todos forman enlaces con el anillo','La etanamina tiene una carga negativa permanente en el nitrógeno que atrae a los H⁺ del agua','La anilina es en realidad una amida y no una amina, por eso casi no acepta H⁺']}
 ],
 polifuncionales:[
  {a:'nom',c:'uso',k:'Q',ctx:'El ácido láctico se forma en los músculos y en la fermentación del kumis. Su estructura es:',f:'CH₃−CH(OH)−COOH',
   q:'¿Cuál es su nombre IUPAC?',o:['ácido 2-hidroxipropanoico','ácido 3-hidroxipropanoico','ácido 1-hidroxipropanoico','1-carboxietan-1-ol']},
  {a:'nom',c:'exp',k:'Q',ctx:'Una molécula tiene un grupo −OH y un grupo −CHO.',
   q:'¿Cuál de los dos da el sufijo del nombre y por qué?',o:['El −CHO, porque el aldehído tiene mayor prioridad que el alcohol; el −OH se nombra con el prefijo hidroxi-','El −OH, porque está más cerca del extremo de la cadena y siempre se numera primero','El que aparezca primero al leer la fórmula de izquierda a derecha, sin importar el grupo','Ambos, porque cuando hay dos grupos funcionales se nombran siempre los dos como sufijos']},
  {a:'nom',c:'uso',k:'Q',ctx:'Observa la siguiente estructura:',f:'CH₂=CH−CH₂−OH',
   q:'¿Cuál es su nombre IUPAC?',o:['prop-2-en-1-ol','prop-1-en-3-ol','prop-2-en-1-al','propan-1-ol']},
  {a:'nom',c:'uso',k:'Q',ctx:'Observa la siguiente estructura:',f:'CH₃−CO−CH₂−COOH',
   q:'¿Cuál es su nombre IUPAC?',o:['ácido 3-oxobutanoico','ácido 2-oxobutanoico','4-carboxibutan-2-ona','ácido 3-hidroxibutanoico']},
  {a:'rx',c:'exp',k:'CTS',ctx:'Durante un ejercicio intenso con poco oxígeno, las células musculares transforman ácido pirúvico (CH₃−CO−COOH) en ácido láctico (CH₃−CH(OH)−COOH).',
   q:'¿Qué cambio químico ocurre?',o:['El grupo cetona del C2 se reduce a un alcohol secundario','El grupo carboxilo se reduce a aldehído','Se pierde un carbono en forma de CO₂','El grupo alcohol se oxida a cetona']},
  {a:'nom',c:'uso',k:'Q',ctx:'La alanina, uno de los aminoácidos de las proteínas, es CH₃−CH(NH₂)−COOH.',
   q:'¿Cuál es su nombre sistemático?',o:['ácido 2-aminopropanoico','ácido 3-aminopropanoico','2-aminopropan-1-ol','1-carboxietan-1-amina']},
  {a:'prop',c:'exp',k:'Q',ctx:'La glucosa (C₆H₁₂O₆), en su forma de cadena abierta, tiene cinco grupos −OH y un grupo aldehído. Se disuelve muy bien en agua, mientras que el hexano (C₆H₁₄) no.',
   q:'¿Qué explica la diferencia?',o:['Los grupos −OH de la glucosa forman puentes de hidrógeno con el agua; el hexano es apolar','La glucosa tiene más átomos de carbono que el hexano y por eso se disuelve','El hexano reacciona con el agua y se descompone en gases antes de disolverse','La glucosa es un compuesto iónico, como la sal de cocina, y se separa en iones']},
  {a:'prop',c:'ind',k:'Q',ctx:'Un grupo quiere saber qué grupo funcional del ácido láctico (el −OH o el −COOH) es el responsable de su acidez.',
   q:'¿Qué comparación es la más útil?',o:['Medir el pH de soluciones de igual concentración de ácido láctico, propan-2-ol y ácido propanoico','Medir la temperatura de ebullición del ácido láctico y compararla con la del agua','Comparar el color de soluciones de ácido láctico y de glucosa de igual concentración','Medir el pH del agua destilada sola en días diferentes y promediar los valores']},
  {a:'nom',c:'uso',k:'Q',ctx:'Observa la siguiente estructura:',f:'CH₃−CH(OH)−CH₂−CHO',
   q:'¿Cuál es su nombre IUPAC?',o:['3-hidroxibutanal','2-hidroxibutanal','3-hidroxibutanoico','1-hidroxibutanal']},
  {a:'nom',c:'uso',k:'CTS',ctx:'La adrenalina (epinefrina), una hormona que el cuerpo libera en situaciones de estrés o peligro, tiene en su estructura un anillo aromático con dos grupos −OH, otro −OH en la cadena lateral y un grupo amina.',
   q:'¿Qué grupos funcionales con oxígeno o nitrógeno identificas en esta descripción?',o:['Grupos hidroxilo (−OH) y un grupo amina','Grupos hidroxilo (−OH) y un grupo amida','Grupos carbonilo (C=O) y un grupo amina','Grupos hidroxilo (−OH), un grupo amina y un ácido carboxílico']},
  {a:'nom',c:'exp',k:'Q',ctx:'El orden de prioridad IUPAC para elegir el sufijo principal es, de mayor a menor: ácido carboxílico, éster, amida, nitrilo, aldehído, cetona, alcohol, amina.',
   q:'Si una molécula tiene un grupo amina y un grupo cetona, ¿cuál de los dos da la terminación del nombre?',o:['La cetona, porque tiene mayor prioridad que la amina; la amina se nombra entonces como prefijo amino-','La amina, porque el nitrógeno tiene mayor prioridad que el oxígeno en la nomenclatura','Ninguno de los dos: cuando hay dos grupos, los dos se nombran siempre como prefijos','Depende de cuál de los dos grupos esté más cerca del extremo de la cadena principal']},
  {a:'nom',c:'uso',k:'CTS',ctx:'El GABA (ácido gamma-aminobutírico), el principal neurotransmisor inhibidor del sistema nervioso, tiene la estructura H₂N−CH₂−CH₂−CH₂−COOH.',
   q:'¿Cuál es su nombre sistemático (IUPAC)?',o:['ácido 4-aminobutanoico','ácido 2-aminobutanoico','ácido 1-aminobutanoico','butanoato de amonio']},
  {a:'rx',c:'ind',k:'Q',ctx:'Una molécula desconocida decolora el agua de bromo con rapidez (prueba de alqueno) pero no reacciona con el reactivo de Tollens (prueba de aldehído). Se sabe que tiene un doble enlace C=C y un grupo carbonilo.',
   q:'¿Qué se puede concluir sobre el grupo carbonilo de esta molécula?',o:['Es una cetona y no un aldehído, porque no dio positiva la prueba de Tollens','Es un aldehído, porque decoloró el agua de bromo','La molécula no tiene ningún grupo carbonilo','La molécula es un alcano, porque no reaccionó con Tollens']},
  {a:'nom',c:'uso',k:'Q',ctx:'Observa la siguiente estructura:',f:'CH₃−CO−CH₂−CO−CH₃',
   q:'¿Cuál es su nombre IUPAC?',o:['pentano-2,4-diona','pentano-1,3-diona','pentano-2,3-diona','2,4-dioxopentano']},
  {a:'nom',c:'exp',k:'Q',ctx:'La pentano-2,4-diona tiene dos grupos cetona, ambos del mismo tipo.',
   q:'¿Por qué el nombre lleva el sufijo «-diona» con dos localizadores (2,4) en vez de nombrarse como si tuviera un solo grupo principal?',o:['Porque cuando hay dos o más grupos iguales de la máxima prioridad, todos se incluyen en el sufijo, cada uno con su propio localizador','Porque solo el grupo de menor localizador es el principal, y el otro debería nombrarse con el prefijo oxo-','Porque las cetonas se nombran como dos alcanos unidos por un C=O, y cada uno aporta un localizador','Porque el localizador 4 indica la longitud de la cadena y no la posición del segundo grupo']},
  {a:'nom',c:'uso',k:'Q',ctx:'La serina, otro aminoácido de las proteínas, tiene en su estructura un grupo amina, un grupo ácido carboxílico y además un grupo hidroxilo: HO−CH₂−CH(NH₂)−COOH.',
   q:'De los tres grupos funcionales que tiene la serina, ¿cuál da la terminación del nombre, según el orden de prioridad IUPAC?',o:['El ácido carboxílico (−COOH): termina en «-oico», y los otros dos se nombran como prefijos (amino-, hidroxi-)','El grupo amina, porque el nitrógeno tiene prioridad sobre el oxígeno en la nomenclatura','El grupo hidroxilo, porque está en el extremo de la cadena y se numera con el 1','Los tres compiten por igual y el nombre se escoge según el que tenga más átomos']},
  {a:'nom',c:'uso',k:'Q',ctx:'Observa la siguiente estructura:',f:[{h:0,bu:X('O',0),buBn:2,bd:X('O',1)},{h:2},{h:2},{h:0,bu:X('O',0),buBn:2,bd:X('O',1)}],t:'HOOC−CH₂−CH₂−COOH',
   q:'¿Cuál es su nombre IUPAC?',o:['ácido butanodioico','ácido butanoico','ácido propanodioico','ácido 2-butanodioico']},
  {a:'nom',c:'exp',k:'CTS',ctx:'El ácido tartárico, presente en la uva y usado en la industria de alimentos, tiene dos grupos −COOH y dos grupos −OH en una cadena de solo 4 carbonos.',
   q:'¿Cómo se nombran los grupos −OH en el nombre de este ácido, ya que no son el grupo de mayor prioridad?',o:['Como prefijos hidroxi-, cada uno con su propio localizador','Como sufijos -ol adicionales al final del nombre','Se ignoran por completo en el nombre','Reemplazan a los grupos −COOH en el nombre final']},
  {a:'nom',c:'uso',k:'Q',ctx:'Observa la siguiente estructura:',f:'CH₃−CH(NH₂)−CH₂−CH₃',
   q:'¿Cuál es su nombre IUPAC?',o:['butan-2-amina','butan-1-amina','butan-3-amina','butanamida']},
  {a:'nom',c:'uso',k:'Q',ctx:'Observa la siguiente estructura:',f:'CH₃−CH₂−CH(OH)−CO−CH₃',
   q:'¿Cuál es su nombre IUPAC?',o:['3-hidroxipentan-2-ona','2-hidroxipentan-3-ona','4-hidroxipentan-2-ona','3-hidroxipentanal']},
  {a:'rx',c:'uso',k:'CTS',ctx:'El herbicida 2,4-D (ácido 2,4-diclorofenoxiacético), uno de los más usados en el mundo contra malezas de hoja ancha, tiene un anillo de benceno con dos cloros, unido mediante un oxígeno a una cadena −CH₂−COOH.',
   q:'¿Qué dos grupos funcionales tiene esta molécula, además del anillo aromático y los cloros?',o:['Un éter (el oxígeno que conecta el anillo con la cadena) y un ácido carboxílico','Un éter que une el anillo con la cadena y un grupo aldehído','Un alcohol unido al anillo y un ácido carboxílico al final','Un éster entre el anillo y la cadena y un grupo fenol']},
  {a:'nom',c:'uso',k:'CTS',ctx:'El ácido acetilsalicílico (aspirina) tiene un anillo aromático con un grupo −COOH y, en el carbono vecino, un grupo éster (−O−CO−CH₃).',
   q:'¿Cuáles son sus dos grupos funcionales con oxígeno, aparte del anillo?',o:['Un ácido carboxílico y un éster','Un alcohol y un éster','Dos grupos ácido carboxílico','Un aldehído y un ácido carboxílico']},
  {a:'nom',c:'uso',k:'Q',ctx:'Observa la siguiente estructura:',f:'HO−CH₂−CH₂−CH₂−C≡N',
   q:'¿Cuál es su nombre IUPAC?',o:['4-hidroxibutanonitrilo','4-hidroxibutanamina','ácido 4-hidroxibutanoico','1-ciano-3-hidroxipropano']},
  {a:'nom',c:'exp',k:'Q',ctx:'El orden de prioridad IUPAC ya visto es: ácido carboxílico > éster > amida > nitrilo > aldehído > cetona > alcohol > amina.',
   q:'Si una molécula tiene un grupo nitrilo y un grupo cetona, ¿cuál de los dos da la terminación del nombre?',o:['El nitrilo, porque tiene mayor prioridad que la cetona; la cetona se nombra entonces con el prefijo oxo-','La cetona, porque el oxígeno tiene prioridad sobre el nitrógeno en la nomenclatura','Ninguno: cuando hay dos grupos, los dos se nombran siempre como sufijos a la vez','Depende de cuál de los dos grupos esté más cerca del extremo de la cadena principal']}
 ],
 isomeria:[
  {a:'nom',c:'uso',k:'Q',ctx:'El etanol (CH₃−CH₂−OH) y el metoximetano (CH₃−O−CH₃) tienen la misma fórmula molecular, C₂H₆O.',
   q:'¿Qué tipo de isómeros son?',o:['Isómeros de función','Isómeros de cadena','Isómeros de posición','Isómeros cis/trans']},
  {a:'nom',c:'uso',k:'Q',ctx:'Los alcanos de fórmula C₅H₁₂ pueden tener la cadena lineal o ramificada.',
   q:'¿Cuántos isómeros estructurales tiene el C₅H₁₂?',o:['3','2','4','5']},
  {a:'nom',c:'uso',k:'Q',ctx:'El propan-1-ol (CH₃−CH₂−CH₂−OH) y el propan-2-ol (CH₃−CH(OH)−CH₃) tienen la misma fórmula molecular.',
   q:'¿Qué tipo de isómeros son?',o:['De posición','De cadena','De función','Cis/trans']},
  {a:'nom',c:'exp',k:'Q',ctx:'El but-2-eno (CH₃−CH=CH−CH₃) existe como dos isómeros, cis y trans, mientras que el but-1-eno (CH₂=CH−CH₂−CH₃) no.',
   q:'¿Por qué el but-1-eno no tiene isómeros cis/trans?',o:['Porque uno de los carbonos de su doble enlace tiene dos sustituyentes iguales (dos H)','Porque el but-1-eno no tiene ningún doble enlace en su cadena','Porque en el but-1-eno el doble enlace puede girar libremente','Porque el but-1-eno tiene menos carbonos que el but-2-eno']},
  {a:'nom',c:'uso',k:'Q',ctx:'Un carbono quiral (asimétrico) está unido a cuatro grupos diferentes.',
   q:'¿Cuál de los siguientes compuestos tiene un carbono quiral?',o:['butan-2-ol, CH₃−CH(OH)−CH₂−CH₃','propan-2-ol, CH₃−CH(OH)−CH₃','etanol, CH₃−CH₂−OH','2-metilpropan-2-ol, (CH₃)₃C−OH']},
  {a:'nom',c:'uso',k:'CTS',ctx:'La talidomida se recetó en los años 50 y 60 a mujeres embarazadas; se ha asociado a uno de sus enantiómeros con las malformaciones (aunque en el cuerpo se transforman uno en otro).',
   q:'¿Qué tienen en común dos enantiómeros?',o:['La misma fórmula y los mismos enlaces, pero son imágenes especulares que no se superponen','Tienen fórmulas moleculares diferentes, aunque sus nombres sean parecidos','Tienen grupos funcionales diferentes que cambian su efecto en el cuerpo','Son la misma estructura superponible, vendida con dos nombres comerciales']},
  {a:'nom',c:'exp',k:'CTS',ctx:'Las grasas trans se forman en la hidrogenación parcial de aceites vegetales y su consumo aumenta el riesgo cardiovascular.',
   q:'¿En qué se diferencia un ácido graso trans de su isómero cis?',o:['En la disposición de los grupos alrededor del doble enlace: en el trans quedan en lados opuestos','En que el trans tiene el doble enlace en otra posición de la cadena','En que el trans tiene un carbono más en la cadena principal','En que el trans tiene un grupo funcional diferente al del cis']},
  {a:'prop',c:'ind',k:'Q',ctx:'En el laboratorio hay dos recipientes rotulados «C₄H₁₀». Se sospecha que uno contiene butano y el otro 2-metilpropano.',
   q:'¿Qué medición permite comprobar que son sustancias distintas?',o:['Comparar sus puntos de ebullición en las mismas condiciones','Comparar sus fórmulas moleculares en un libro','Contar los átomos de carbono de cada uno','Comparar la masa molar de cada uno en la tabla']},
  {a:'nom',c:'uso',k:'Q',ctx:'El C₄H₁₀ puede tener la cadena lineal o ramificada.',
   q:'¿Cuántos isómeros estructurales (de cadena) tiene el C₄H₁₀?',o:['2','1','3','4']},
  {a:'nom',c:'uso',k:'Q',ctx:'El C₆H₁₄ se puede ramificar de varias formas: sin ramificar, con un metilo en distintas posiciones, con dos metilos, etc.',
   q:'¿Cuántos isómeros estructurales tiene el C₆H₁₄?',o:['5','3','4','6']},
  {a:'nom',c:'exp',k:'Q',ctx:'El but-2-eno (CH₃−CH=CH−CH₃) tiene isómeros cis/trans, pero el 2-metilpropeno (CH₂=C(CH₃)−CH₃) no, aunque los dos tienen un doble enlace C=C.',
   q:'¿Por qué el 2-metilpropeno no tiene isómeros cis/trans?',o:['Porque uno de los carbonos de su doble enlace tiene dos grupos metilo idénticos unidos a él','Porque el 2-metilpropeno no tiene en realidad un doble enlace','Porque en el 2-metilpropeno el doble enlace puede girar libremente','Porque el 2-metilpropeno tiene menos carbonos que el but-2-eno']},
  {a:'prop',c:'exp',k:'CTS',ctx:'El aceite de oliva, rico en ácido oleico (un ácido graso cis), es líquido a temperatura ambiente. El ácido elaídico, su isómero trans, forma parte de grasas que son sólidas o semisólidas a esa misma temperatura.',
   q:'¿Qué explica esta diferencia en el punto de fusión entre los dos isómeros?',o:['La forma doblada de la cadena cis impide que las moléculas se empaqueten tan ordenadamente como las del isómero trans, de forma más recta','La cadena trans está doblada y por eso sus moléculas se empaquetan peor que las del isómero cis','El ácido cis forma puentes de hidrógeno entre sus cadenas y el trans no puede formarlos','Los isómeros cis y trans tienen fórmulas moleculares diferentes y por eso distinta masa']},
  {a:'prop',c:'ind',k:'Q',ctx:'Un grupo tiene dos frascos sin etiqueta, ambos con un líquido de fórmula C₄H₁₀O: se sospecha que uno es butan-1-ol y el otro, etoxietano (un éter).',
   q:'¿Qué propiedad permitiría distinguirlos con más seguridad?',o:['El punto de ebullición: el alcohol, que forma puentes de hidrógeno, hierve mucho más alto que el éter','El color del líquido: el alcohol es incoloro y el éter amarillento','El olor de cada líquido, porque los alcoholes no tienen ningún olor','La fórmula molecular, que permite saber cuál grupo funcional tiene cada uno']},
  {a:'nom',c:'uso',k:'Q',ctx:'El propanal (CH₃−CH₂−CHO) y la propanona (CH₃−CO−CH₃) tienen la misma fórmula molecular, C₃H₆O.',
   q:'¿Qué tipo de isómeros son?',o:['Isómeros de función','Isómeros de cadena','Isómeros de posición','Isómeros cis/trans']},
  {a:'nom',c:'uso',k:'Q',ctx:'Las dos manos de una persona son parecidas pero no idénticas: son imágenes especulares entre sí y no se pueden superponer exactamente, igual que los dos enantiómeros de una molécula quiral.',
   q:'¿Qué característica deben tener los cuatro grupos unidos a un carbono para que ese carbono sea quiral?',o:['Los cuatro grupos deben ser diferentes entre sí','Los cuatro grupos deben ser iguales','Solo dos de los cuatro grupos deben ser diferentes','El carbono debe tener un doble enlace']},
  {a:'nom',c:'uso',k:'Q',ctx:'El pentano, el 2-metilbutano y el 2,2-dimetilpropano tienen los tres la fórmula molecular C₅H₁₂, pero esqueletos de carbono distintos.',
   q:'¿Qué tipo de isómeros son entre sí?',o:['Isómeros de cadena','Isómeros de posición','Isómeros de función','Isómeros cis/trans']},
  {a:'prop',c:'exp',k:'CTS',ctx:'El limoneno es un compuesto quiral: uno de sus enantiómeros huele a naranja y el otro, a pino o trementina, aunque los dos tienen exactamente la misma fórmula molecular y los mismos enlaces.',
   q:'¿Por qué el cuerpo humano puede distinguir el olor de dos enantiómeros tan parecidos químicamente?',o:['Los receptores olfativos son moléculas quirales y reconocen de forma distinta cada una de las dos formas especulares','Porque los dos enantiómeros tienen fórmulas moleculares distintas aunque se parezcan mucho','Porque uno de los dos enantiómeros no tiene átomos de carbono y huele a otra cosa','Porque el olor no depende de la estructura química, sino del color de cada sustancia']},
  {a:'prop',c:'exp',k:'Q',ctx:'El butan-1-ol y el metoxipropano (CH₃−O−CH₂−CH₂−CH₃) son isómeros de función, ambos de fórmula C₄H₁₀O, pero con puntos de ebullición muy distintos (cerca de 118 °C y de 39 °C).',
   q:'¿Por qué dos isómeros con la misma fórmula molecular pueden tener propiedades físicas tan diferentes?',o:['Porque aunque tienen los mismos átomos, están unidos de forma distinta, lo que cambia la polaridad y las fuerzas entre sus moléculas','Porque en realidad tienen fórmulas moleculares distintas, aunque se escriban igual','Porque uno de los dos no es un compuesto real y su punto de ebullición está mal medido','Porque la temperatura de ebullición no depende de la estructura, sino solo de la fórmula molecular']},
  {a:'nom',c:'uso',k:'Q',ctx:'El 1-clorobutano y el 2-clorobutano tienen la misma fórmula molecular, C₄H₉Cl, pero el cloro está en una posición distinta de la cadena.',
   q:'¿Qué tipo de isómeros son?',o:['Isómeros de posición','Isómeros de cadena','Isómeros de función','Isómeros cis/trans']},
  {a:'nom',c:'uso',k:'Q',ctx:'Para saber si el 2-clorobutano (CH₃−CHCl−CH₂−CH₃) tiene un carbono quiral, un estudiante examina los cuatro grupos unidos al carbono que lleva el cloro.',
   q:'¿Cuáles son esos cuatro grupos, y son todos diferentes entre sí?',o:['Cl, H, CH₃ y CH₂CH₃: los cuatro son diferentes, así que ese carbono sí es quiral','Cl, H, CH₃ y CH₃: dos de los grupos son iguales, así que no es quiral','Cl, Cl, H y CH₃: hay dos cloros, así que no puede ser quiral','H, H, CH₃ y CH₂CH₃: hay dos hidrógenos, así que no es quiral']},
  {a:'nom',c:'uso',k:'Q',ctx:'El 1,2-diclorobenceno y el 1,4-diclorobenceno tienen la misma fórmula molecular, C₆H₄Cl₂, pero los dos átomos de cloro ocupan posiciones distintas del anillo.',
   q:'¿Qué tipo de isómeros son?',o:['De posición','De cadena','De función','Cis/trans']},
  {a:'nom',c:'uso',k:'Q',ctx:'El heptano, C₇H₁₆, puede tener la cadena lineal o varias formas ramificadas.',
   q:'¿Cuántos isómeros estructurales tiene el C₇H₁₆?',o:['9','5','7','12']},
  {a:'nom',c:'exp',k:'Q',ctx:'El hex-3-eno, CH₃−CH₂−CH=CH−CH₂−CH₃, tiene un doble enlace entre el C3 y el C4.',
   q:'¿Tiene isomería cis/trans?',o:['Sí, porque cada carbono del doble enlace está unido a un H y a un grupo etilo, dos sustituyentes distintos','No, porque los dos lados de la molécula son iguales y eso impide la isomería','No, porque el doble enlace no está en el centro exacto de la cadena','Sí, pero solo existe la forma cis, porque la trans es inestable']},
  {a:'nom',c:'uso',k:'Q',ctx:'El ciclopropano (un anillo de 3 carbonos) y el propeno (CH₂=CH−CH₃) tienen ambos fórmula molecular C₃H₆.',
   q:'¿Qué tipo de isómeros son?',o:['De función','De posición','De cadena','Cis/trans']}
 ],
 reacciones:[
  {a:'rx',c:'uso',k:'Q',ctx:'CH₂=CH₂ + H₂O → CH₃−CH₂−OH (con H₂SO₄ como catalizador)',
   q:'¿Qué tipo de reacción es?',o:['Adición','Sustitución','Eliminación','Esterificación']},
  {a:'rx',c:'uso',k:'Q',ctx:'CH₃−CH₂−OH → CH₂=CH₂ + H₂O (con H₂SO₄ concentrado y calor)',
   q:'¿Qué tipo de reacción es?',o:['Eliminación (deshidratación)','Adición (hidratación)','Sustitución nucleofílica','Combustión']},
  {a:'rx',c:'ind',k:'CTS',ctx:'En la preparación tradicional de la chicha y el guarapo, las levaduras transforman azúcares en etanol: C₆H₁₂O₆ → 2 C₂H₅OH + 2 CO₂.',
   q:'¿Qué observación indica que esta reacción está ocurriendo?',o:['El desprendimiento de burbujas de gas en la mezcla','La aparición de un espejo de plata en el recipiente','El cambio de la mezcla a un color azul intenso','La formación de un sólido blanco cuando la mezcla se enfría']},
  {a:'rx',c:'exp',k:'CTS',ctx:'Cuando el vino o el guarapo se avinagran, el etanol (CH₃−CH₂−OH) se transforma en ácido etanoico (CH₃−COOH).',
   q:'¿Qué tipo de reacción ocurre en el carbono que lleva el −OH?',o:['Oxidación: el carbono gana enlaces con oxígeno y pierde enlaces con hidrógeno','Reducción: el carbono gana enlaces con hidrógeno y pierde oxígeno','Adición de agua a un doble enlace de la molécula de etanol','Hidrólisis de un éster que tenía el vino o el guarapo']},
  {a:'rx',c:'uso',k:'Q',ctx:'CH₃−COOH + CH₃−OH ⇌ ? + H₂O (con H₂SO₄ como catalizador)',
   q:'¿Cuál es el producto orgánico de esta esterificación?',o:['etanoato de metilo','metanoato de etilo','etanoato de etilo','metoxietano']},
  {a:'rx',c:'exp',k:'Q',ctx:'En la cloración del metano con luz, el enlace Cl−Cl se rompe de modo que cada átomo de cloro se queda con uno de los dos electrones del enlace.',
   q:'¿Cómo se llama este tipo de ruptura y qué especies forma?',o:['Ruptura homolítica; se forman radicales libres','Ruptura heterolítica; se forman los iones Cl⁺ y Cl⁻','Ruptura homolítica; se forman carbocationes','Ruptura heterolítica; se forman radicales libres']},
  {a:'rx',c:'exp',k:'CTS',ctx:'El polietileno de las bolsas se fabrica uniendo muchas moléculas de eteno (CH₂=CH₂).',
   q:'¿Qué tipo de reacción es y por qué las bolsas duran tanto tiempo en el ambiente?',o:['Polimerización por adición; el polímero solo tiene enlaces C−C y C−H muy estables, que los microorganismos degradan muy lentamente','Polimerización por condensación; el polímero libera agua que lo protege de los microorganismos del suelo','Combustión; el plástico ya está completamente oxidado y por eso no reacciona con nada del ambiente','Esterificación; las bolsas son ésteres y los ésteres no se hidrolizan nunca en la naturaleza']},
  {a:'rx',c:'ind',k:'Q',ctx:'Para estudiar cómo influye la temperatura en la rapidez de la esterificación, un grupo mezcla ácido etanoico, etanol y H₂SO₄ en tres tubos que mantiene a 20 °C, 40 °C y 60 °C.',
   q:'¿Qué deben mantener igual en los tres tubos?',o:['Las cantidades de reactivos y de catalizador, y el tiempo de reacción','La temperatura de los tres tubos, para que solo cambie el catalizador','Solamente el tamaño de los tubos, porque las cantidades no importan','Nada: cada tubo puede tener cantidades diferentes de reactivos']},
  {a:'rx',c:'uso',k:'Q',ctx:'CH≡CH + 2 H₂ → CH₃−CH₃ (con catalizador de Ni o Pt)',
   q:'¿Qué tipo de reacción es?',o:['Adición (hidrogenación)','Sustitución','Eliminación','Oxidación']},
  {a:'rx',c:'uso',k:'Q',ctx:'CH₃−CH₂−Br + NaOH (en agua) → CH₃−CH₂−OH + NaBr',
   q:'¿Qué tipo de reacción es?',o:['Sustitución nucleofílica','Adición electrofílica','Eliminación','Esterificación']},
  {a:'rx',c:'exp',k:'CTS',ctx:'La elaboración tradicional de jabón consiste en calentar grasa o aceite con una solución concentrada de NaOH (soda cáustica).',
   q:'¿Qué tipo de reacción convierte la grasa (un éster) en jabón (una sal de ácido graso) y glicerina?',o:['Hidrólisis básica (saponificación): el NaOH rompe el enlace éster de la grasa','Esterificación: el NaOH forma un nuevo éster con la grasa','Combustión: la grasa se oxida por completo con el calor','Adición: el NaOH se suma a un doble enlace de la grasa']},
  {a:'rx',c:'uso',k:'Q',ctx:'CH₃−CH₂−CHBr−CH₃ + KOH (en etanol, con calor) → CH₃−CH=CH−CH₃ + KBr + H₂O',
   q:'¿Qué tipo de reacción es?',o:['Eliminación','Adición','Sustitución nucleofílica','Esterificación']},
  {a:'rx',c:'uso',k:'Q',ctx:'La combustión del metano puede ser completa (CH₄ + 2 O₂ → CO₂ + 2 H₂O) o incompleta, cuando hay poco oxígeno disponible (2 CH₄ + 3 O₂ → 2 CO + 4 H₂O).',
   q:'¿Qué diferencia principal hay entre los productos de las dos reacciones?',o:['La combustión incompleta produce monóxido de carbono (CO), un gas tóxico, en vez de dióxido de carbono (CO₂)','La combustión incompleta no produce agua, solo gases de carbono','La combustión completa libera CO, que es menos tóxico que el CO₂','La combustión incompleta produce hollín en lugar de dióxido de carbono y agua']},
  {a:'rx',c:'ind',k:'CTS',ctx:'En la producción de biodiésel a partir de aceite de palma y metanol (con un catalizador básico), al terminar la reacción la mezcla se separa en dos capas: una de biodiésel (ésteres metílicos) y otra, más densa, de glicerina.',
   q:'¿Qué evidencia confirma que ocurrió la transesterificación y no solo una mezcla física de aceite y metanol?',o:['La aparición de glicerina como subproducto, que no estaba presente en los reactivos originales','Que el aceite y el metanol forman una sola capa uniforme al agitarlos con fuerza','Que el aceite cambia de color, de anaranjado a amarillo, al mezclarse con el metanol','Que la mezcla se calienta un poco al agitarla, como pasa con cualquier reacción']},
  {a:'rx',c:'uso',k:'Q',ctx:'CH₃−CH₂−COOH + CH₃−CH₂−OH ⇌ ? + H₂O (con H₂SO₄ como catalizador)',
   q:'¿Cuál es el producto orgánico principal de esta esterificación?',o:['propanoato de etilo','etanoato de propilo','propanoato de metilo','ácido etanoico']},
  {a:'rx',c:'uso',k:'Q',ctx:'CH₂=CH−CH₃ + HCl → CH₃−CHCl−CH₃ (producto principal)',
   q:'¿Qué tipo de reacción es?',o:['Adición electrofílica','Sustitución nucleofílica','Eliminación','Condensación']},
  {a:'rx',c:'exp',k:'CTS',ctx:'El etanol carburante que se mezcla con la gasolina en Colombia se produce en el Valle del Cauca fermentando el azúcar de la caña con levaduras, en tanques cerrados.',
   q:'¿Por qué esta reacción se clasifica como una fermentación y no simplemente como una combustión?',o:['Porque ocurre por la acción de microorganismos (levaduras) y sin necesidad de oxígeno del aire, a diferencia de la combustión','Porque libera la misma cantidad de energía que una combustión, pero en tanques cerrados','Porque libera más energía que una combustión y necesita levaduras para controlarla','Porque ocurre a temperatura alta, con llama, y sus productos son solo gases']},
  {a:'rx',c:'exp',k:'Q',ctx:'En la esterificación entre un ácido carboxílico y un alcohol, el H₂SO₄ acelera la reacción, pero al final se recupera en la misma cantidad con la que se agregó.',
   q:'¿Qué papel cumple el H₂SO₄ en esta reacción?',o:['Actúa como catalizador: acelera la reacción sin consumirse en el proceso','Actúa como reactivo: se consume y forma parte del éster final','Actúa únicamente como disolvente del ácido y del alcohol','Actúa como producto: se forma junto con el éster y el agua']},
  {a:'rx',c:'ind',k:'Q',ctx:'Un grupo quiere saber si el agua de bromo se decolora más rápido cuando hay más alqueno. Usa dos tubos con la misma cantidad de agua de bromo, a la misma temperatura; en uno pone 1 mL de ciclohexeno y en el otro, 3 mL.',
   q:'¿Qué variable cambian a propósito y qué deben medir?',o:['Cambian la cantidad de ciclohexeno y deben medir el tiempo que tarda en desaparecer el color del bromo','Cambian la temperatura y deben medir la cantidad de ciclohexeno que queda','Cambian la cantidad de agua de bromo y deben medir el volumen final','Cambian el tipo de alqueno y deben medir la masa de cada tubo']},
  {a:'rx',c:'uso',k:'Q',ctx:'CH₃−CH₂−OH → CH₃−CHO (con un oxidante suave y controlado)',
   q:'¿Qué tipo de reacción es, respecto al carbono que lleva el −OH?',o:['Oxidación: ese carbono gana un enlace con oxígeno y pierde un enlace con hidrógeno','Reducción: ese carbono gana un enlace con hidrógeno y pierde uno con oxígeno','Sustitución: el −OH es reemplazado por un átomo de hidrógeno','Eliminación: se pierde agua y se forma un doble enlace C=C']},
  {a:'rx',c:'uso',k:'Q',ctx:'C₆H₆ + HNO₃ → C₆H₅−NO₂ + H₂O (con H₂SO₄ como catalizador)',
   q:'¿Qué tipo de reacción es?',o:['Sustitución electrofílica aromática','Adición electrofílica al anillo','Eliminación de agua del anillo','Sustitución nucleofílica en el anillo']},
  {a:'rx',c:'uso',k:'Q',ctx:'CH₃−CO−NH₂ + H₂O (con H⁺ y calor) → CH₃−COOH + NH₄⁺',
   q:'¿Qué tipo de reacción es?',o:['Hidrólisis de una amida','Esterificación','Saponificación','Deshidratación']},
  {a:'rx',c:'uso',k:'Q',ctx:'CH₃−CO−CH₃ + NaBH₄ (y luego agua) → CH₃−CH(OH)−CH₃',
   q:'¿Qué tipo de reacción es, respecto al carbono del grupo carbonilo?',o:['Reducción: ese carbono gana un enlace con hidrógeno y pierde uno con oxígeno','Oxidación: ese carbono gana un enlace con oxígeno','Sustitución nucleofílica: el oxígeno es reemplazado por hidrógeno','Eliminación: se pierde agua y se forma un doble enlace']},
  {a:'rx',c:'uso',k:'Q',ctx:'CH₃−CH₂−Br + NaCN → CH₃−CH₂−C≡N + NaBr',
   q:'¿Qué tipo de reacción es?',o:['Sustitución nucleofílica','Adición nucleofílica','Eliminación','Oxidación']}
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
  {t:'con',q:'Cuenta los enlaces σ y π del propeno (CH₂=CH−CH₃) y explica la diferencia entre ambos tipos de enlace.'},
  {t:'con',q:'Dibuja la propanona (CH₃−CO−CH₃) e indica la hibridación, la geometría y el ángulo de enlace del carbono del grupo carbonilo.'}],
 tipos_carbono:[
  {t:'con',q:'Dibuja la estructura CH₃−C(CH₃)₂−CH₂−CH(CH₃)−CH₃ y clasifica cada uno de sus carbonos.'},
  {t:'con',q:'Dibuja un alcohol primario, uno secundario y uno terciario, y explica cómo los reconociste.'},
  {t:'con',q:'Dibuja una molécula de 5 carbonos que tenga un carbono cuaternario. ¿Cuántos carbonos primarios tiene?'},
  {t:'con',q:'Dibuja el 3-etil-2-metilpentano y clasifica cada uno de sus carbonos como primario, secundario, terciario o cuaternario.'}],
 cadenas:[
  {t:'con',q:'Clasifica según su forma, sus enlaces y sus átomos: a) CH₃−CH=CH−CH₃; b) CH₃−NH−CH₂−CH₃; c) ciclohexano; d) benceno.'},
  {t:'con',q:'Dibuja una cadena abierta, ramificada, insaturada y homogénea, y explica cada criterio.'},
  {t:'con',q:'Explica con un dibujo por qué una cadena en forma de U puede seguir siendo lineal.'},
  {t:'con',q:'Dibuja un anillo heterocíclico (con un heteroátomo dentro del ciclo) y uno homocíclico, y explica la diferencia.'}],
 cadena:[
  {t:'nom',q:'Escribe el nombre IUPAC del compuesto. Marca la cadena principal y explica por qué numeraste desde ese extremo.',f:'CH₃−CH(CH₃)−CH₂−CH(C₂H₅)−CH₂−CH₃'},
  {t:'nom',q:'Escribe el nombre IUPAC del compuesto y justifica la numeración.',f:[{h:3},{h:0,bu:CH3,bd:CH3},{h:2},{h:2},{h:1,bd:CH3},{h:3}]},
  {t:'nom',q:'Dibuja la fórmula semidesarrollada del 3-etil-2-metilhexano y encierra la cadena principal.'},
  {t:'nom',q:'Un compañero nombró un compuesto como «2-etilpentano». Dibuja la estructura que imaginó, explica cuál es el error y escribe el nombre correcto.'},
  {t:'mdec',n:'3-etil-2-metilhexano'},
  {t:'mdec',n:'3,3-dietilpentano'},
  {t:'rx',q:'Escribe la ecuación balanceada de la combustión completa del 2,2,4-trimetilpentano (C₈H₁₈), el compuesto de referencia del octanaje de la gasolina.'},
  {t:'rx',q:'El 2-metilpropano reacciona con Br₂ en presencia de luz. Dibuja y nombra el producto monobromado principal y explica por qué se forma ese.'},
  {t:'nom',q:'Dibuja la estructura del 3-etil-2,2-dimetilpentano. Numerando desde el otro extremo de la cadena, escribe el conjunto de localizadores que resultaría y compáralo con {2,2,3} para explicar por qué el nombre dado es el correcto.'},
  {t:'con',q:'El nombre 4-etil-2,3-dimetilhexano tiene una cadena principal de 6 carbonos y tres sustituyentes (un etilo y dos metilos). Calcula cuántos carbonos tiene la molécula en total y cuántos hidrógenos, sabiendo que es un alcano saturado.'}],
 alcanos:[
  {t:'rx',q:'CH₄ + Cl₂ → ? (con luz). Escribe los productos de la monocloración, nómbralos y di qué tipo de reacción es.'},
  {t:'rx',q:'Escribe la ecuación balanceada de la combustión completa del propano y la de su combustión incompleta (cuando se forma CO).'},
  {t:'rx',q:'CH₃−CH₂−CH₃ + Br₂ → ? (con luz). Dibuja y nombra el producto monobromado principal.'},
  {t:'rx',q:'El ciclopropano reacciona con HBr y su anillo se abre. Escribe la estructura del producto y nómbralo.'},
  {t:'nom',q:'Escribe el nombre IUPAC del compuesto.',f:'CH₃−CH₂−CH₂−CH(CH₃)−CH₃'},
  {t:'nom',q:'Dibuja la fórmula del metilciclohexano y la del 1,3-dimetilciclopentano.'},
  {t:'mdec',n:'2,3-dimetilbutano'},
  {t:'mdec',n:'3-etil-3-metilheptano'},
  {t:'rx',q:'El craqueo térmico del decano (C₁₀H₂₂) produce una mezcla de un alcano y un alqueno más pequeños. Si uno de los productos es el hexano (C₆H₁₄), escribe la fórmula molecular del otro producto y explica por qué debe tener un doble enlace.'},
  {t:'con',q:'Explica por qué el 2,2,3,3-tetrametilbutano, muy ramificado, hierve a una temperatura menor que el octano (C₈H₁₈) lineal, aunque las dos moléculas tienen la misma fórmula molecular.'}],
 alquenos:[
  {g:'alquenos',t:'rx',q:'CH₃−CH=CH₂ + HBr → ? Escribe el producto principal, nómbralo y explica por qué el Br queda en ese carbono.'},
  {g:'alquenos',t:'rx',q:'CH₂=CH₂ + Br₂ → ? Escribe y nombra el producto. ¿Qué cambio de color observarías en el laboratorio?'},
  {g:'alquenos',t:'rx',q:'CH₃−CH=CH₂ + H₂O → ? (con H⁺ como catalizador). Escribe y nombra el producto principal.'},
  {g:'alquinos',t:'rx',q:'HC≡CH + 2 HBr → ? Aplica la regla de Markovnikov en cada adición. Escribe la estructura y el nombre del producto final.'},
  {g:'alquinos',t:'rx',q:'CH₃−C≡C−CH₃ + H₂ → ? (con catalizador de Lindlar: los dos H se adicionan por el mismo lado). Dibuja y nombra el producto e indica si es cis o trans.'},
  {g:'alquenos',t:'nom',q:'Escribe el nombre IUPAC del compuesto.',f:'CH₃−CH=C(CH₃)−CH₂−CH₃'},
  {g:'ambos',t:'nom',q:'Dibuja la fórmula semidesarrollada del 4-metilpent-2-ino y la del 2-metilbut-2-eno.'},
  {g:'alquenos',t:'mdec',n:'4-metilpent-1-eno'},
  {g:'alquinos',t:'mdec',n:'3-metilbut-1-ino'},
  {g:'alquenos',t:'rx',q:'El 1,2-dicloroheptano se obtiene por adición de Cl₂ a un alqueno. Dibuja y nombra el alqueno de partida, y escribe la ecuación completa de la reacción.'},
  {g:'alquenos',t:'rx',q:'CH₃−CH=CH−CH₂−CH₂−CH₃ (hex-2-eno) + HCl → ? Aplica la regla de Markovnikov y escribe el producto principal con su nombre.'},
  {g:'alquenos',t:'rx',q:'CH₃−CH=CH−CH₂−CH₂−CH₃ (hex-2-eno) + KMnO₄ (frío y diluido) → ? Escribe y nombra el diol que se forma (prueba de Baeyer).'}],
 aromaticos:[
  {t:'rx',q:'Benceno + Br₂ → ? (con FeBr₃). Dibuja y nombra el producto orgánico e indica el subproducto.'},
  {t:'rx',q:'Benceno + HNO₃ → ? (con H₂SO₄). Dibuja y nombra el producto y escribe cuál es el electrófilo que ataca el anillo.'},
  {t:'rx',q:'Benceno + CH₃Cl → ? (con AlCl₃). Dibuja y nombra el producto y di qué tipo de reacción es.'},
  {t:'rx',q:'Tolueno + KMnO₄ → ? (con calor; el oxidante fuerte convierte la cadena lateral en −COOH). Dibuja y nombra el producto.'},
  {t:'nom',q:'Dibuja y nombra los tres isómeros del dimetilbenceno e indica cuál es orto, cuál meta y cuál para.'},
  {t:'nom',q:'Dibuja la estructura de: a) etilbenceno; b) 1,3-dinitrobenceno; c) 1-cloro-4-metilbenceno.'},
  {t:'mdec',n:'1-bromo-3-etilbenceno'},
  {t:'mdec',n:'1-etil-4-nitrobenceno'},
  {t:'nom',q:'Dibuja y nombra el compuesto 1,3,5-tribromobenceno.'},
  {t:'nom',q:'Un benceno tiene metilo en C1, etilo en C2 y cloro en C4. Dibuja la estructura y escribe su nombre IUPAC completo (compara las dos numeraciones posibles —horaria y antihoraria— y elige la que da el conjunto de localizadores más bajo).'},
  {t:'mdec',n:'1-cloro-4-metil-2-nitrobenceno'}],
 haluros:[
  {t:'rx',q:'CH₃−CH₂−Br + NaOH (en agua) → ? Escribe y nombra el producto orgánico y di qué tipo de reacción es.'},
  {t:'rx',q:'CH₃−CHBr−CH₃ + KOH (en etanol, con calor) → ? Escribe y nombra el producto orgánico y di qué tipo de reacción es.'},
  {t:'rx',q:'(CH₃)₃C−Br + H₂O → ? Escribe y nombra el producto orgánico y explica por qué esta sustitución ocurre en dos pasos (mecanismo SN1, con un carbocatión intermedio).'},
  {t:'rx',q:'CH₃−Br + NaCN → ? (el ion CN⁻ es el nucleófilo que reemplaza al Br). Escribe y nombra el producto orgánico. ¿Cuántos carbonos tiene ahora la cadena?'},
  {t:'nom',q:'Escribe el nombre IUPAC del compuesto y clasifícalo como haluro primario, secundario o terciario.',f:'CH₂Br−CH(CH₃)−CH₃'},
  {t:'nom',q:'Dibuja la fórmula semidesarrollada del 2-bromo-3-metilpentano y la del 1,1-dicloroetano.'},
  {t:'mdec',n:'1-cloro-3-metilbutano'},
  {t:'mdec',n:'2-bromo-2-metilbutano'},
  {t:'rx',q:'CH₃−CH₂−CH₂−Br + KOH (en etanol, con calor) → ? Escribe el producto principal de eliminación, nómbralo y di qué tipo de mecanismo esperarías (E1 o E2) para un haluro primario con una base fuerte.'},
  {t:'con',q:'Explica por qué el 2-bromo-2-metilpropano reacciona con agua mucho más rápido por mecanismo SN1 que por SN2, mientras que el bromometano reacciona más rápido por SN2 que por SN1. Relaciona tu respuesta con la estabilidad de los carbocationes y el impedimento estérico.'}],
 alcoholes:[
  {g:'alcoholes',t:'rx',q:'CH₃−CH₂−CH₂−OH con CCP (clorocromato de piridinio, oxidante suave) → ? y con CrO₃/H⁺ (oxidante fuerte) → ? Escribe y nombra el producto de cada caso.'},
  {g:'alcoholes',t:'rx',q:'CH₃−CH(OH)−CH₃ + CrO₃/H⁺ → ? Escribe y nombra el producto. ¿Qué pasaría con el 2-metilpropan-2-ol? Explica.'},
  {g:'alcoholes',t:'rx',q:'CH₃−CH₂−OH → ? (con H₂SO₄ a 180 °C). Escribe y nombra el producto orgánico y di qué tipo de reacción es.'},
  {g:'alcoholes',t:'rx',q:'CH₃−CH₂−OH + HBr → ? (el −OH se sustituye por el halógeno). Escribe y nombra el producto orgánico.'},
  {g:'alcoholes',t:'rx',q:'CH₃−COOH + CH₃−CH₂−OH → ? (con H⁺). Escribe y nombra el éster que se forma.'},
  {g:'alcoholes',t:'nom',q:'Escribe el nombre IUPAC del compuesto.',f:'CH₃−CH₂−CH(OH)−CH(CH₃)−CH₃'},
  {g:'ambos',t:'nom',q:'Dibuja la estructura del butan-2-ol, del fenol y del metoxietano.'},
  {g:'alcoholes',t:'mdec',n:'2-metilbutan-2-ol'},
  {g:'alcoholes',t:'mdec',n:'3-metilbutan-1-ol'},
  {g:'alcoholes',t:'rx',q:'CH₃−CH₂−CH₂−COOH + CH₃−OH → ? (esterificación de Fischer, con H⁺ y calor). Escribe y nombra el éster que se forma (tiene aroma a piña).'},
  {g:'alcoholes',t:'rx',q:'(CH₃)₃C−OH + SOCl₂ → ? Escribe y nombra el producto orgánico y los dos subproductos gaseosos. ¿Por qué se prefiere este reactivo sobre HCl para un alcohol terciario?'},
  {g:'alcoholes',t:'rx',q:'Un alqueno se obtuvo por deshidratación ácida (H₂SO₄, calor) de un alcohol de partida; solo existía una posición posible para la eliminación. Si el alqueno es CH₃−CH₂−CH=CH₂, dibuja y nombra el alcohol de partida.'},
  {g:'alcoholes',t:'con',q:'Propón una reacción (reactivos y condiciones) que permita obtener propan-2-ol. Escribe la ecuación completa y nombra el tipo de reacción.'},
  {g:'alcoholes',t:'rx',q:'Un alcohol primario se oxida con CCP (oxidante suave) y se obtiene 3-metilbutanal. Dibuja y nombra el alcohol de partida.'}],
 carbonilos:[
  {g:'aldehidos',t:'rx',q:'CH₃−CHO + HCN → ? Escribe y nombra el producto (una cianohidrina).'},
  {g:'cetonas',t:'rx',q:'CH₃−CO−CH₃ + NaBH₄ (y luego agua) → ? Escribe y nombra el producto y di si es un alcohol 1°, 2° o 3°.'},
  {g:'aldehidos',t:'rx',q:'CH₃−CHO + CH₃MgBr (y luego H₃O⁺) → ? Escribe y nombra el alcohol que se obtiene.'},
  {g:'ambos',t:'rx',q:'Un tubo con etanal y otro con propanona se calientan con reactivo de Tollens. ¿En cuál aparece espejo de plata? Escribe el producto orgánico de esa reacción (el aldehído se oxida a ácido, que en el medio básico del reactivo queda como ion carboxilato).'},
  {g:'cetonas',t:'nom',q:'Escribe el nombre IUPAC del compuesto.',f:'CH₃−CH₂−CO−CH(CH₃)−CH₃'},
  {g:'ambos',t:'nom',q:'Dibuja la estructura del butanal, de la butanona y del 3-metilbutanal.'},
  {g:'cetonas',t:'mdec',n:'5-metilhexan-3-ona'},
  {g:'aldehidos',t:'mdec',n:'2-metilbutanal'},
  {g:'ambos',t:'rx',q:'Un aldehído reacciona con bromuro de etilmagnesio (CH₃CH₂MgBr) y luego con H₃O⁺, y se obtiene pentan-3-ol. Dibuja y nombra el aldehído de partida.'},
  {g:'aldehidos',t:'rx',q:'Tienes dos tubos sin etiqueta: uno con pentanal y otro con pentan-3-ona. Propón una prueba química que permita distinguirlos y describe qué observarías en cada tubo.'}],
 acidos:[
  {g:'acidos',t:'rx',q:'CH₃−COOH + NaOH → ? Escribe y nombra los productos.'},
  {g:'esteres',t:'rx',q:'CH₃−CH₂−COOH + CH₃−OH → ? (con H⁺). Escribe y nombra el éster que se forma.'},
  {g:'esteres',t:'rx',q:'CH₃−COO−CH₂−CH₃ + NaOH → ? Escribe y nombra los productos de esta saponificación.'},
  {g:'acidos',t:'rx',q:'CH₃−CH₂−CH₂−OH + CrO₃/H⁺ (en exceso) → ? Escribe y nombra el ácido que se obtiene.'},
  {g:'acidos',t:'nom',q:'Escribe el nombre IUPAC del compuesto.',f:'CH₃−CH₂−CH(CH₃)−COOH'},
  {g:'ambos',t:'nom',q:'Dibuja la estructura del ácido 2-metilpropanoico y la del etanoato de metilo.'},
  {g:'acidos',t:'mdec',n:'ácido 3,3-dimetilbutanoico'},
  {g:'acidos',t:'mdec',n:'ácido 2-metilpentanoico'},
  {g:'acidos',t:'rx',q:'CH₃−CH₂−COOH + SOCl₂ → ? Escribe y nombra el producto orgánico (un cloruro de ácido) y los dos subproductos gaseosos.'},
  {g:'esteres',t:'nom',q:'Dibuja la estructura del 2-etilhex-3-enoato de isopropilo.'}],
 nitrogenados:[
  {g:'aminas',t:'rx',q:'CH₃−NH₂ + HCl → ? Escribe y nombra el producto y explica por qué la amina actúa como base.'},
  {g:'amidas',t:'rx',q:'CH₃−CO−NH₂ + H₂O → ? (con H⁺ y calor: hidrólisis de la amida). Escribe y nombra los productos.'},
  {g:'amidas',t:'rx',q:'CH₃−COCl + 2 NH₃ → ? Escribe y nombra los productos.'},
  {g:'amidas',t:'rx',q:'CH₃−CO−NH₂ + LiAlH₄ (y luego agua) → ? Escribe y nombra el producto.'},
  {g:'amidas',t:'nom',q:'Escribe el nombre IUPAC del compuesto.',f:'CH₃−CH(CH₃)−CO−NH₂'},
  {g:'ambos',t:'nom',q:'Dibuja la estructura de la propan-1-amina, de la N-metiletanamina y del propanonitrilo.'},
  {g:'amidas',t:'mdec',n:'3-metilbutanamida'},
  {g:'nitrilos',t:'mdec',n:'butanonitrilo'},
  {g:'amidas',t:'rx',q:'Une el −COOH de la glicina (H₂N−CH₂−COOH) con el −NH₂ de la alanina (H₂N−CH(CH₃)−COOH) para formar el dipéptido Gly-Ala. Dibuja el enlace peptídico que se forma e indica qué molécula pequeña se libera.'},
  {g:'amidas',t:'rx',q:'CH₃−CH₂−CH(CH₃)−COOH + CH₃−CH₂−NH₂ → ? (con calor, pérdida de agua). Escribe y nombra la amida que se forma.'}],
 polifuncionales:[
  {t:'rx',q:'CH₃−CO−CH₂−CH₂−CH₂−OH + NaBH₄ (y luego agua) → ? Escribe y nombra el producto.'},
  {t:'rx',q:'El ácido láctico, CH₃−CH(OH)−COOH, reacciona con NaOH. Escribe y nombra la sal que se forma.'},
  {t:'rx',q:'CH₃−CH(OH)−COOH + CH₃−CH₂−OH → ? (con H⁺). Escribe y nombra el éster que se forma.'},
  {t:'nom',q:'Escribe el nombre IUPAC del compuesto. Indica cuál es el grupo principal y por qué.',f:'CH₃−CO−CH₂−CH₂−CH₂−OH'},
  {t:'nom',q:'Escribe el nombre IUPAC del compuesto. Indica cuál grupo va como prefijo y cuál como sufijo.',f:'CH₃−CH(OH)−CH₂−COOH'},
  {t:'nom',q:'Dibuja la estructura del ácido 2-aminopropanoico (alanina) y señala cuál de sus grupos da el sufijo del nombre.'},
  {t:'mdec',n:'ácido 3-aminobutanoico'},
  {t:'mdec',n:'5-hidroxihexan-2-ona'},
  {t:'nom',q:'Escribe el nombre IUPAC del compuesto y explica por qué el grupo nitrilo, no el alcohol, da la terminación del nombre.',f:'HO−CH₂−CH₂−C≡N'},
  {t:'rx',q:'El ácido acetilsalicílico (aspirina) se hidroliza con NaOH. Describe qué les pasa a sus dos grupos funcionales con oxígeno (el éster y el ácido carboxílico) y qué productos se forman.'}],
 isomeria:[
  {t:'nom',q:'Dibuja y nombra los tres isómeros estructurales de fórmula C₅H₁₂.'},
  {t:'nom',q:'Dibuja y nombra los isómeros cis y trans del but-2-eno.'},
  {t:'nom',q:'Dibuja y nombra un alcohol y un éter de fórmula C₃H₈O.'},
  {t:'nom',q:'Dibuja y nombra un aldehído y una cetona de fórmula C₄H₈O. ¿Qué tipo de isómeros son?'},
  {t:'rx',q:'CH₃−C≡C−CH₃ + H₂ con catalizador de Lindlar → ? y con Na en NH₃ líquido → ? Dibuja los dos productos e indica cuál es cis y cuál trans.'},
  {t:'rx',q:'El but-1-eno reacciona con HBr. Dibuja el producto principal, nómbralo y marca con un asterisco (*) su carbono quiral.'},
  {t:'mdec',n:'2,2-dimetilpropano'},
  {t:'mdec',n:'pent-2-eno'},
  {t:'con',q:'Calcula el índice de deficiencia de hidrógeno (IDH) de C₁₀H₁₄ y de C₅H₁₂O. Para cada fórmula, explica qué te dice ese valor sobre los anillos y/o enlaces múltiples que puede tener la molécula, y dibuja una estructura posible.'},
  {t:'nom',q:'Formula y nombra 3 isómeros de posición de fórmula C₇H₁₄O (pueden ser alcoholes).'},
  {t:'nom',q:'Dibuja y nombra la forma cis y la forma trans del 3-metilhex-3-eno.'},
  {t:'con',q:'Para cada par, indica si son isómeros entre sí y, si lo son, de qué tipo (cadena, posición, función o geométrica): a) pentano y 2-metilbutano; b) propeno y propino; c) ciclobutano y metilciclopropano; d) ácido butanoico y propanoato de metilo; e) cis-pent-2-eno y trans-pent-2-eno.'}],
 reacciones:[
  {t:'rx',q:'CH₄ + Cl₂ → ? (con luz). Escribe los productos y di qué tipo de reacción es.'},
  {t:'rx',q:'CH₂=CH₂ + H₂O → ? (con H⁺). Escribe y nombra el producto y di qué tipo de reacción es.'},
  {t:'rx',q:'CH₃−CH₂−OH → ? (con H₂SO₄ a 180 °C). Escribe y nombra el producto orgánico y di qué tipo de reacción es.'},
  {t:'rx',q:'CH₃−CH₂−OH + CrO₃/H⁺ → ? Escribe y nombra el producto final y di qué tipo de reacción es.'},
  {t:'rx',q:'Benceno + Br₂ → ? (con FeBr₃). Escribe y nombra el producto y explica por qué es una sustitución y no una adición.'},
  {t:'rx',q:'CH₃−COOH + CH₃−OH → ? (con H⁺). Escribe y nombra el éster y di qué tipo de reacción es.'},
  {t:'nom',q:'Escribe el nombre del producto orgánico de cada reacción: a) propeno + HBr; b) propan-2-ol + CrO₃/H⁺.'},
  {t:'mdec',n:'2-cloro-2-metilpropano'},
  {t:'rx',q:'CH₂=CH₂ + H₂ → A (con catalizador de Ni). A + Cl₂ → B (con calor o luz). Escribe y nombra A y B, e indica qué tipo de reacción forma cada uno.'},
  {t:'con',q:'Clasifica cada una de estas reacciones según su tipo (sustitución, adición, eliminación u oxidorreducción) y justifica brevemente cada clasificación: a) CH₂=CH₂ + Br₂ → CH₂Br−CH₂Br; b) CH₃−CH₂−Br + KOH (en etanol, con calor) → CH₂=CH₂ + KBr + H₂O; c) CH₃−CH₂−OH + CrO₃/H⁺ → CH₃−COOH; d) C₆H₆ + Cl₂ (cat. AlCl₃) → C₆H₅Cl + HCl.'}]
};

/* ── Fase 4: preguntas abiertas de los temas nuevos ──
   Cada pregunta se responde solo con lo que explica su página
   (orbitales.html, propiedades.html, biomoleculas.html, ambiente.html).
   Se usan en las evaluaciones (ABIERTAS) y en los talleres
   (sección «Ejercicios abiertos» de cada TEMA). */
var F4_ABIERTAS={
 orbitales:[
  {t:'con',q:'Dibuja el diagrama de orbitales moleculares del H₂ y del He₂, calcula el orden de enlace de cada uno y explica por qué el helio no forma moléculas diatómicas.'},
  {t:'con',q:'Calcula el orden de enlace del N₂, el O₂ y el F₂ y ordénalos de mayor a menor energía de enlace. Justifica tu respuesta.'},
  {t:'con',q:'Explica por qué el oxígeno líquido es atraído por un imán y qué modelo de enlace permite predecirlo.'},
  {t:'con',q:'Usa los datos de hidrogenación (ciclohexeno: 120 kJ/mol; benceno: 208 kJ/mol) para calcular la energía de resonancia del benceno y explica qué significa.'},
  {t:'con',q:'Aplica la regla de Hückel al benceno, al ciclobutadieno y al naftaleno e indica cuáles son aromáticos.'},
  {t:'con',q:'Explica por qué la zanahoria es naranja y el aceite de cocina es casi incoloro, usando la idea de conjugación.'},
  {t:'con',q:'Explica, con la idea de ondas que se suman o se restan, por qué el orbital σ1s une los dos átomos de hidrógeno y el σ*1s los separa.'},
  {t:'con',q:'Calcula el orden de enlace del H₂⁺ y del He₂⁺ y explica si estas especies pueden existir.'},
  {t:'con',q:'En la curva de energía del H₂ el mínimo está en 74 pm y −436 kJ/mol. Explica qué representa cada valor y por qué las moléculas reales vibran.'},
  {t:'con',q:'Compara el modelo de enlace de valencia con el de orbitales moleculares: qué explica bien cada uno y por qué seguimos usando la hibridación para la forma de las moléculas.'},
  {t:'rx',q:'Explica con la nube π por qué el eteno, CH₂=CH₂, reacciona por adición con el HBr: qué enlace se rompe y qué enlaces se forman.'},
  {t:'con',q:'Los seis enlaces C−C del benceno miden 139 pm. Compáralos con un enlace sencillo (154 pm) y uno doble (134 pm) y explica qué demuestra ese dato.'},
  {t:'rx',q:'Explica por qué el benceno hace sustitución electrofílica y no adición, usando la energía de resonancia.'},
  {t:'con',q:'Aplica la regla de Hückel a la piridina y al cicloocta-1,3,5,7-tetraeno y explica por qué una es aromática y el otro no.'},
  {t:'con',q:'Ordena el eteno, el buta-1,3-dieno y el β-caroteno según la longitud de onda de la luz que absorben y explica por qué solo el último tiene color.'},
  {t:'con',q:'Explica por qué las hojas se ven verdes si la clorofila absorbe la luz roja y la azul.'}],
 propiedades:[
  {t:'con',q:'Ordena de menor a mayor punto de ebullición: butano, propanona y propan-1-ol (masas molares casi iguales). Justifica con el tipo de fuerza intermolecular de cada uno.'},
  {t:'con',q:'Explica por qué el etanol se disuelve en agua en cualquier proporción y el hexan-1-ol casi no.'},
  {t:'con',q:'Un grupo midió el punto de ebullición del etanol y obtuvo 75,5 °C (referencia: 78,4 °C a 1 atm). Calcula el porcentaje de error y propone dos causas de la diferencia, una de ellas relacionada con la altura de Bogotá.'},
  {t:'con',q:'Diseña un experimento para comprobar la hipótesis «a más carbonos, mayor punto de ebullición». Indica qué variable cambias, cuáles mantienes y qué gráfica harías.'},
  {t:'con',q:'Explica por qué el pentano hierve a 36 °C y el 2,2-dimetilpropano, su isómero, a 10 °C.'},
  {t:'con',q:'Explica con las fuerzas intermoleculares cómo quita el jabón la grasa de la ropa.'},
  {t:'con',q:'Cuando el agua hierve, ¿se rompen los enlaces O−H? Explica la diferencia entre las fuerzas intramoleculares y las intermoleculares con los valores de 460 kJ/mol y 20 kJ/mol.'},
  {t:'con',q:'Explica por qué el clorometano, CH₃−Cl, es polar y el tetraclorometano, CCl₄, es apolar, aunque los dos tienen enlaces C−Cl polares.'},
  {t:'con',q:'El etanol, CH₃−CH₂−OH, y el dimetiléter, CH₃−O−CH₃, tienen la misma fórmula molecular, C₂H₆O. Explica cuál forma puentes de hidrógeno entre sus moléculas y cuál hierve a mayor temperatura.'},
  {t:'con',q:'Identifica la fuerza intermolecular más fuerte entre las moléculas del propano, el propanal, el ácido etanoico y la etilamina, y justifica con su grupo funcional.'},
  {t:'con',q:'Explica por qué el alcohol antiséptico se evapora rápido de la piel y el aceite de cocina casi no se evapora.'},
  {t:'con',q:'Con estos datos de solubilidad en agua (metanol, etanol y propan-1-ol: miscibles; butan-1-ol: 7,7; pentan-1-ol: 2,2; hexan-1-ol: 0,6 g/100 mL), describe la tendencia y explícala con la parte polar y la parte apolar de las moléculas.'},
  {t:'con',q:'A la misma temperatura, ¿cuál tendrá más moléculas en el vapor: el propano, el etanal, el etanol o el agua? Explica tu respuesta con las fuerzas intermoleculares.'},
  {t:'con',q:'Ordena de menor a mayor punto de ebullición el propano, el dimetiléter, el etanal, el etanol y el ácido metanoico (masas molares de 44 a 46 g/mol) y justifica cada lugar.'}],
 biomoleculas:[
  {t:'con',q:'Identifica los grupos funcionales de la glucosa y de la fructosa y explica por qué son isómeros de función.'},
  {t:'rx',q:'Escribe, con fórmulas generales, la condensación de dos aminoácidos y señala el enlace peptídico.'},
  {t:'con',q:'Explica con la forma de las cadenas por qué el ácido esteárico (69 °C) se funde a mayor temperatura que el ácido oleico (13 °C).'},
  {t:'con',q:'Calcula las kilocalorías de una porción con 30 g de carbohidratos, 6 g de proteína y 8 g de grasa, y explica por qué la grasa aporta tanta energía.'},
  {t:'con',q:'Escribe la hebra complementaria de 5′-ATGCCGTA-3′ y cuenta cuántos puentes de hidrógeno unen las dos hebras.'},
  {t:'rx',q:'Compara la respiración celular con la fermentación alcohólica: reactivos, productos, presencia de oxígeno y un ejemplo de cada una en Colombia.'},
  {t:'nom',q:'Clasifica el gliceraldehído, la dihidroxiacetona, la ribosa, la ribulosa, la glucosa y la fructosa como aldosas o cetosas y según su número de carbonos, y escribe el nombre que une las dos clasificaciones (por ejemplo, aldohexosa).'},
  {t:'nom',q:'Dibuja la proyección de Fischer de la D-glucosa y explica cómo se reconoce que pertenece a la serie D y no a la serie L.'},
  {t:'rx',q:'Explica paso a paso cómo se pasa de la proyección de Fischer de la D-glucosa a su proyección de Haworth: qué grupos reaccionan, cuántos átomos tiene el anillo y dónde queda cada −OH.'},
  {t:'nom',q:'Dibuja la α-D-glucopiranosa y la β-D-glucopiranosa en proyección de Haworth. Explica qué las diferencia y por qué esa diferencia separa al almidón de la celulosa.'},
  {t:'con',q:'Explica por qué la fructosa forma un anillo de 5 átomos (furanosa) y la glucosa uno de 6 (piranosa).'},
  {t:'con',q:'El ácido α-linolénico es 18:3 cis-Δ9,12,15. Explica qué significa cada número, calcula su número omega y explica por qué es un ácido graso esencial.'},
  {t:'con',q:'Explica la diferencia entre numerar los dobles enlaces de un ácido graso con Δ y con ω, usando como ejemplo el ácido linoleico, 18:2 cis-Δ9,12.'},
  {t:'rx',q:'Escribe la saponificación de una grasa con NaOH y explica, con el dibujo de una micela, cómo el jabón retira la grasa.'},
  {t:'con',q:'Explica qué significa que las dos hebras del ADN sean antiparalelas y qué dice la regla de Chargaff. Si un ADN tiene 30 % de adenina, calcula el porcentaje de las otras tres bases.'},
  {t:'con',q:'Explica por qué se dice que la replicación del ADN es semiconservativa.'},
  {t:'con',q:'El ARNm 5′-AUG GCU AAA UUU UAA-3′ se traduce en el ribosoma. Escribe el anticodón de cada ARNt que llega y la secuencia de aminoácidos que se forma (AUG: metionina; GCU: alanina; AAA: lisina; UUU: fenilalanina; UAA: parada).'},
  {t:'con',q:'Describe cómo se forma una proteína a partir de un gen: la transcripción, el papel del ARNm, del ARNt y del ribosoma (sitios P y A), y en qué momento se forma cada enlace peptídico.'},
  {t:'con',q:'Explica qué le pasa a la clara del huevo al freírla o al pescado en el ceviche, usando los niveles de estructura de las proteínas.'},
  {t:'con',q:'Explica cómo actúa una enzima como la que hidroliza la sacarosa: qué es el sitio activo y por qué el calor excesivo o un pH extremo la dañan.'}],
 ambiente:[
  {t:'con',q:'Calcula la masa de CO₂ que se produce al quemar 1 kg de propano (C₃H₈ + 5 O₂ → 3 CO₂ + 4 H₂O). Muestra la cadena de factores de conversión.'},
  {t:'con',q:'Explica por qué quemar 1 kg de gasolina produce más de 1 kg de CO₂, usando la ley de conservación de la masa.'},
  {t:'rx',q:'Escribe el mecanismo por el que un CFC destruye el ozono e identifica el paso de ruptura homolítica.'},
  {t:'con',q:'Explica, con la polaridad, por qué el DDT se acumula en la grasa de los animales y su concentración aumenta en la cadena alimentaria.'},
  {t:'con',q:'Clasifica el PET, el PVC y el polietileno como polímeros de adición o de condensación y explica cuál podría hidrolizarse con más facilidad.'},
  {t:'con',q:'Argumenta una ventaja y una desventaja del biodiésel de palma frente al diésel del petróleo, desde el punto de vista químico y ambiental.'},
  {t:'con',q:'Explica con las fuerzas de London por qué en la torre de destilación del petróleo los gases salen por arriba y el asfalto queda en el fondo.'},
  {t:'con',q:'El metano emite 49 g de CO₂ por megajulio y el octano 64 g. Explica a qué se debe la diferencia y por qué el metano que se escapa sin quemar también es un problema.'},
  {t:'rx',q:'Escribe la ecuación balanceada de la combustión incompleta del metano y explica por qué un calentador de gas nunca debe usarse en un lugar cerrado.'},
  {t:'con',q:'Explica, con lo que hacen las moléculas de CO₂ con la radiación infrarroja, por qué más CO₂ en el aire aumenta la temperatura del suelo.'},
  {t:'con',q:'Explica por qué una bolsa de polietileno no se biodegrada como una cáscara de fruta y en qué se convierte con el paso del tiempo.'},
  {t:'con',q:'Explica por qué un solo átomo de cloro puede destruir miles de moléculas de ozono y qué logró el Protocolo de Montreal.'},
  {t:'rx',q:'Escribe la reacción de fermentación con la que se obtiene el etanol de caña y argumenta por qué «renovable» no significa «sin impacto».'},
  {t:'con',q:'La tienda escolar quiere dejar los vasos de icopor. Usa los principios de la química verde para escoger entre vasos de PET reciclables, vasos de papel con capa plástica, vasos reutilizables y vasos de «plástico biodegradable», y justifica.'},
  {t:'con',q:'Explica por qué un derrame de petróleo forma una mancha sobre el agua y cómo daña a los peces y a las aves.'}]
};
Object.keys(F4_ABIERTAS).forEach(function(k){ABIERTAS[k]=F4_ABIERTAS[k];});
TEMAS.forEach(function(t){if(F4_ABIERTAS[t.id])t.abiertos=F4_ABIERTAS[t.id].map(function(a){return a.q;});});

/* ── Cazar errores escritos: cada afirmación tiene UN error que el estudiante
   debe encontrar y corregir. Se basan solo en lo que explica la página del
   tema. [afirmación con el error, explicación para el docente] ── */
var CAZAR={
"carbono": [
[
"El carbono tiene 6 electrones de valencia, porque su número atómico es 6.",
"Tiene 4 electrones de valencia: 2 de sus 6 electrones están en el nivel 1s, que no forma enlaces."
],
[
"El carbono forma 2 enlaces, porque en su estado fundamental solo tiene 2 electrones desapareados.",
"Forma 4 enlaces: promueve un electrón del 2s al 2p y se hibrida."
],
[
"Al mezclar 1 orbital s con 3 orbitales p se obtienen 3 orbitales sp³.",
"Salen 4 sp³: el número de híbridos es igual al de orbitales que se mezclan."
],
[
"En la hibridación sp² se mezclan 1 s y 2 p, y no queda ningún orbital p sin hibridar.",
"Queda 1 orbital p sin hibridar, que forma el enlace π."
],
[
"Un carbono sp³ tiene geometría trigonal plana, con ángulos de 120°.",
"El sp³ es tetraédrico, con ángulos de 109,5°; el trigonal plano es sp²."
],
[
"Los carbonos del etino, HC≡CH, son sp², porque tienen un triple enlace.",
"Son sp: lineales, con ángulos de 180°."
],
[
"El doble enlace C=C está formado por dos enlaces π.",
"Está formado por 1 σ + 1 π: el primer enlace entre dos átomos siempre es σ."
],
[
"El triple enlace C≡C está formado por 3 enlaces σ.",
"Está formado por 1 σ + 2 π."
],
[
"En el eteno, CH₂=CH₂, hay 4 enlaces σ y 2 enlaces π.",
"Hay 5 σ (4 C−H + 1 del doble enlace) y 1 π."
],
[
"En el etino, HC≡CH, hay 2 enlaces σ y 3 enlaces π.",
"Hay 3 σ (2 C−H + 1 C−C) y 2 π."
],
[
"El enlace sencillo C−C es el más corto de los tres: mide 120 pm.",
"El sencillo es el más largo (154 pm); el triple es el más corto (120 pm)."
],
[
"Un doble enlace C=C puede girar libremente, igual que un enlace sencillo.",
"No puede girar: al girar se rompería el enlace π."
],
[
"Las cadenas de los alcanos son rectas porque el carbono sp³ forma ángulos de 180°.",
"Son en zigzag: el carbono sp³ forma ángulos de 109,5°."
],
[
"Un carbono unido a 3 átomos, uno de ellos con doble enlace, es sp³.",
"Es sp²: 3 átomos unidos → sp² (el doble enlace cuenta como un solo átomo unido)."
],
[
"El enlace π se forma cuando dos orbitales híbridos se solapan de frente.",
"Eso es un σ; el π se forma con orbitales p sin hibridar que se solapan de lado."
],
[
"El grafito y el diamante son elementos distintos, porque uno es negro y blando y el otro transparente y duro.",
"Los dos son carbono puro; cambia cómo están unidos sus átomos (su hibridación)."
],
[
"En la hibridación sp quedan 2 orbitales sp y 1 orbital p sin hibridar.",
"Quedan 2 orbitales p sin hibridar, que forman 2 enlaces π."
],
[
"La configuración del carbono en estado fundamental es 1s² 2s¹ 2p³.",
"Esa es la del estado excitado (después de la promoción); la fundamental es 1s² 2s² 2p²."
],
[
"En el metano, CH₄, los 4 enlaces C−H son enlaces π.",
"Son 4 enlaces σ: todo enlace sencillo es σ."
],
[
"Concatenación significa que el carbono forma 4 enlaces.",
"Eso es la tetravalencia; la concatenación es unirse a otros carbonos en cadenas y anillos."
]
],
"tipos_carbono": [
[
"En el propano, CH₃−CH₂−CH₃, el carbono del medio es primario.",
"Es secundario: está unido a 2 carbonos."
],
[
"Un carbono unido a 3 hidrógenos y a 1 carbono es terciario, porque tiene 3 H.",
"Es primario: solo se cuentan los carbonos vecinos, no los hidrógenos."
],
[
"En el etanol, CH₃−CH₂−OH, el carbono que lleva el −OH es secundario, porque está unido a un C y a un O.",
"Es primario: el O no cuenta, solo se cuentan carbonos."
],
[
"Un −CH₂− dentro de una cadena sin ramas es un carbono terciario.",
"Es secundario: está unido a 2 carbonos."
],
[
"En un alcano, un carbono cuaternario tiene 1 hidrógeno.",
"Tiene 0 hidrógenos: sus 4 enlaces van a carbonos."
],
[
"En un alcano, un carbono terciario se escribe −CH₂−.",
"Se escribe −CH−, con 1 H; −CH₂− es secundario."
],
[
"Un carbono terciario está unido a 3 hidrógenos.",
"Está unido a 3 carbonos (y, en un alcano, a 1 H)."
],
[
"El propan-2-ol es un alcohol primario porque tiene un solo −OH.",
"Es secundario: el carbono del −OH está unido a 2 carbonos."
],
[
"El 2-metilpropan-2-ol es un alcohol secundario.",
"Es terciario: el carbono del −OH está unido a 3 carbonos."
],
[
"El isooctano tiene 5 carbonos primarios, 1 secundario, 2 terciarios y ningún cuaternario.",
"Tiene 5 primarios, 1 secundario, 1 terciario y 1 cuaternario."
],
[
"En un doble enlace C=C, el carbono vecino se cuenta dos veces porque hay dos rayas.",
"Se cuentan los carbonos unidos, no las rayas: el vecino cuenta una sola vez."
],
[
"En el butano, CH₃−CH₂−CH₂−CH₃, los 4 carbonos son secundarios.",
"Hay 2 primarios (los extremos) y 2 secundarios."
],
[
"En el 2-metilpropano, el carbono central es secundario.",
"Es terciario: está unido a 3 carbonos."
],
[
"En el 2,2-dimetilpropano, el carbono central es terciario.",
"Es cuaternario: está unido a 4 carbonos."
],
[
"En el ciclohexano todos los carbonos son primarios.",
"Son secundarios: en el anillo cada carbono está unido a 2 carbonos."
],
[
"En un alcano, un carbono unido a 2 carbonos tiene 3 hidrógenos.",
"Tiene 4 − 2 = 2 hidrógenos."
],
[
"Un carbono cuaternario aparece donde sale una sola ramificación.",
"Donde sale una rama hay un terciario; el cuaternario aparece donde salen dos ramas del mismo carbono."
],
[
"En el 2-cloropropano, el carbono que lleva el Cl es terciario, porque está unido a 3 átomos que no son hidrógeno.",
"Es secundario: el Cl no cuenta, solo los 2 carbonos."
],
[
"Los carbonos de los extremos de una cadena siempre son secundarios.",
"Son primarios: están unidos a un solo carbono."
],
[
"El carbono de una rama metilo es secundario.",
"Es primario: el metilo está unido a un solo carbono."
],
[
"El 2-metilbutano tiene 2 carbonos primarios, 2 secundarios y 1 terciario.",
"Tiene 3 primarios, 1 secundario y 1 terciario."
]
],
"cadenas": [
[
"Una cadena alifática siempre es abierta.",
"Alifática significa no aromática: puede ser abierta (acíclica) o cerrada (alicíclica, como el ciclohexano)."
],
[
"El naftaleno es un aromático mononuclear.",
"Tiene dos anillos que comparten un lado: es polinuclear condensado."
],
[
"El bifenilo es un aromático polinuclear condensado.",
"Sus dos anillos están unidos por un enlace y no comparten carbonos: es polinuclear aislado."
],
[
"El ciclohexanol, con un −OH colgado del anillo, es un heterociclo.",
"El oxígeno está fuera del anillo: es una cadena cíclica homogénea ramificada."
],
[
"El tetrahidrofurano es una cadena cíclica homogénea.",
"Tiene un oxígeno dentro del anillo: es heterogénea (heterocíclica)."
],
[
"El metilciclohexano es una cadena cíclica sencilla.",
"Tiene un CH₃ colgando del anillo: es cíclica ramificada."
],
[
"El butano dibujado en zigzag es una cadena ramificada.",
"Es lineal: doblar el dibujo no crea ramas; el camino no se bifurca."
],
[
"El etanol, CH₃−CH₂−OH, tiene una cadena heterogénea porque tiene oxígeno.",
"Es homogénea: el O está al final como −OH, no intercalado entre carbonos."
],
[
"El metoximetano, CH₃−O−CH₃, tiene una cadena homogénea.",
"Es heterogénea: el O está intercalado entre dos carbonos."
],
[
"El propeno, CH₂=CH−CH₃, es una cadena saturada.",
"Es insaturada: tiene un doble enlace."
],
[
"El ciclohexano es una cadena abierta porque solo tiene enlaces sencillos.",
"Es cerrada (cíclica); tener solo enlaces sencillos la hace saturada, que es otro criterio."
],
[
"Al cerrar el hexano, C₆H₁₄, para formar el ciclohexano, la fórmula sigue siendo C₆H₁₄.",
"Pasa a C₆H₁₂: al unir los extremos se pierden 2 H."
],
[
"El benceno es un anillo alicíclico.",
"Es aromático: 6 carbonos sp² con dobles enlaces alternados."
],
[
"La piridina es un anillo alicíclico porque tiene 6 átomos.",
"Es heterocíclica (y aromática): tiene un N en el anillo."
],
[
"Una cadena abierta tiene un solo extremo.",
"Tiene dos extremos."
],
[
"Una cadena es ramificada cuando tiene un doble enlace.",
"Es ramificada cuando de un carbono sale otra cadena; el doble enlace la hace insaturada."
],
[
"El ciclohexeno es aromático porque es un anillo con un doble enlace.",
"Es alicíclico insaturado; aromático es el anillo tipo benceno."
],
[
"En una cadena ramificada, la rama sale de un carbono secundario.",
"Sale de un carbono terciario o cuaternario."
],
[
"Un heteroátomo es cualquier átomo distinto del carbono, incluido el hidrógeno.",
"Es cualquier átomo distinto del carbono y del hidrógeno (O, N, S, halógenos…)."
],
[
"La cadena de la etilamina, CH₃−CH₂−NH₂, es heterogénea porque tiene nitrógeno.",
"Es homogénea: el −NH₂ está al final, no entre carbonos."
],
[
"Una cadena insaturada tiene solo enlaces sencillos.",
"Tiene al menos un enlace doble o triple; con solo sencillos es saturada."
],
[
"En la fórmula de esqueleto del butano hay 2 carbonos: los dos extremos del zigzag.",
"Hay 4: los 2 extremos y los 2 vértices."
],
[
"El metilbenceno es una cadena abierta ramificada.",
"Es una cadena cerrada aromática con una rama metilo."
],
[
"Un anillo con un oxígeno entre sus átomos es alicíclico.",
"Es heterocíclico: tiene un heteroátomo en el anillo."
],
[
"Los anillos alicíclicos solo pueden ser saturados.",
"Pueden ser saturados (ciclohexano) o insaturados (ciclohexeno)."
],
[
"El but-1-eno, CH₂=CH−CH₂−CH₃, es una cadena abierta, ramificada, insaturada y homogénea.",
"Es lineal, no ramificada: su camino no se bifurca."
]
],
"aromaticos": [
[
"El benceno reacciona con el Br₂ por adición, igual que un alqueno.",
"Hace sustitución electrofílica (con FeBr₃): así conserva el anillo aromático."
],
[
"El nombre correcto del xileno con los metilos en las posiciones 1 y 3 es 1,5-dimetilbenceno.",
"Se numera con los localizadores más bajos: 1,3-dimetilbenceno."
],
[
"El diclorobenceno con los cloros en carbonos vecinos se llama 1,6-diclorobenceno.",
"Se llama 1,2-diclorobenceno: localizadores más bajos."
],
[
"El metilbenceno también se llama fenol.",
"Se llama tolueno; el fenol es el benceno con un −OH."
],
[
"El 1,4-dimetilbenceno también se llama orto-dimetilbenceno.",
"Es para (1,4); orto es 1,2 y meta es 1,3."
],
[
"El 1,3-diclorobenceno se llama para-diclorobenceno.",
"Es meta-diclorobenceno; para es 1,4."
],
[
"El benceno tiene tres enlaces C−C cortos y tres largos.",
"Los seis miden lo mismo, 139 pm: los electrones π están deslocalizados."
],
[
"El nombre correcto es 1-metil-2-clorobenceno.",
"Los sustituyentes van en orden alfabético: 1-cloro-2-metilbenceno."
]
],
"isomeria": [
[
"El butano y el 2-metilpropano no son isómeros, porque tienen nombres distintos.",
"Sí son isómeros: los dos son C₄H₁₀ con estructuras distintas."
],
[
"El hexano dibujado en forma de U es un isómero del hexano dibujado en zigzag.",
"Es el mismo compuesto: doblar la cadena no crea un isómero."
],
[
"El 1-metilpentano es un isómero del hexano.",
"El 1-metilpentano es el mismo hexano: un metilo en el extremo alarga la cadena."
],
[
"El 2-etilbutano es un nombre correcto para un isómero de C₆H₁₄.",
"Su cadena más larga tiene 5 C: el nombre correcto es 3-metilpentano."
],
[
"El 3-metilbutano y el 2-metilbutano son isómeros de posición.",
"Son la misma molécula numerada al revés; el nombre correcto es 2-metilbutano."
],
[
"El propan-1-ol y el propan-2-ol son isómeros de función.",
"Son isómeros de posición: el mismo grupo −OH en otro carbono."
],
[
"El etanol y el metoximetano son isómeros de cadena.",
"Son isómeros de función: alcohol y éter."
],
[
"El propanal y la propanona son isómeros de posición.",
"Son isómeros de función: aldehído y cetona."
],
[
"El propan-1-ol y el propanal son isómeros de función.",
"No son isómeros: el propan-1-ol es C₃H₈O y el propanal C₃H₆O."
],
[
"El índice de deficiencia de hidrógeno del C₄H₈ es 2.",
"IDH = (2×4 + 2 − 8) ÷ 2 = 1."
],
[
"El IDH del benceno, C₆H₆, es 3: uno por cada doble enlace.",
"Es 4: 1 anillo + 3 enlaces π."
],
[
"Un triple enlace cuenta 1 en el índice de deficiencia de hidrógeno.",
"Cuenta 2, porque equivale a dos enlaces π."
],
[
"El propeno, CH₂=CH−CH₃, tiene isomería cis/trans.",
"No la tiene: su C1 tiene dos H iguales."
],
[
"El but-1-eno tiene isomería cis/trans.",
"No la tiene: el C1 tiene dos H."
],
[
"En el cis-but-2-eno los dos CH₃ están en lados opuestos del doble enlace.",
"En el cis están del mismo lado; en lados opuestos es el trans."
],
[
"El (Z)-but-2-eno es el trans-but-2-eno.",
"Z = juntos = cis; el trans es el (E)-but-2-eno."
],
[
"El C2 del butan-2-ol no es quiral porque está unido a dos carbonos.",
"Sí es quiral: tiene 4 grupos distintos (H, OH, CH₃ y CH₂−CH₃)."
],
[
"La glicina es quiral, como casi todos los aminoácidos.",
"Es la excepción: su C2 tiene dos H."
],
[
"Un carbono quiral está unido a cuatro sustituyentes iguales.",
"Está unido a cuatro sustituyentes diferentes."
],
[
"Las grasas trans tienen un codo en la cadena y por eso son líquidas.",
"El codo lo da el doble enlace cis (aceites líquidos); la cadena trans es casi recta y sólida."
],
[
"El pentano, C₅H₁₂, tiene 2 isómeros de cadena.",
"Tiene 3: pentano, 2-metilbutano y 2,2-dimetilpropano."
]
],
"reacciones": [
[
"Eteno + bromo → 1,2-dibromoetano es una sustitución.",
"Es una adición: desaparece el doble enlace y dos moléculas quedan en una."
],
[
"Etanol → eteno + agua es una adición.",
"Es una eliminación (deshidratación): aparece un doble enlace y sale H₂O."
],
[
"Bromoetano + hidróxido → etanol + bromuro es una eliminación.",
"Es una sustitución: el Br cambia por −OH y no cambian los dobles enlaces."
],
[
"Propanona → propan-2-ol es una oxidación, porque el carbono gana hidrógeno.",
"Ganar H es una reducción."
],
[
"Ácido etanoico + etanol → etanoato de etilo + agua es una hidrólisis.",
"Es una condensación (esterificación): dos moléculas se unen y sale agua."
],
[
"Etanoato de etilo + agua → ácido etanoico + etanol es una condensación.",
"Es una hidrólisis: el agua parte la molécula en dos."
],
[
"Cloruro de vinilo → PVC es una eliminación, porque desaparece el doble enlace.",
"Es una polimerización por adición: muchos monómeros se unen en una cadena."
],
[
"Ácido etanoico + hidróxido de sodio → etanoato de sodio + agua es una sustitución.",
"Es una reacción ácido-base: solo pasa un H⁺ y se forma una sal."
],
[
"En una adición, una molécula se convierte en dos.",
"Es al revés: dos moléculas se convierten en una (eso otro es la eliminación)."
],
[
"En una eliminación, el producto queda más saturado que el reactivo.",
"Queda menos saturado: se forma un doble enlace."
],
[
"En una sustitución cambia el número de dobles enlaces.",
"El número de dobles enlaces no cambia: un grupo sale y otro entra."
],
[
"Oxidar un carbono significa que gane enlaces con hidrógeno.",
"Oxidar es ganar enlaces con O o perder H."
],
[
"El H₂ y el NaBH₄ son reactivos típicos de oxidación.",
"Son reactivos de reducción."
],
[
"El KMnO₄ y el CrO₃ son reactivos típicos de reducción.",
"Son reactivos de oxidación."
],
[
"La hidrogenación de un alqueno es solo una adición; no puede ser también una reducción.",
"Es las dos cosas: se suma H₂ (adición) y el carbono gana H (reducción)."
],
[
"La saponificación es una condensación, porque se forma jabón.",
"Es una hidrólisis del éster y también una reacción ácido-base."
],
[
"En una reacción ácido-base cambia el esqueleto de carbonos.",
"El esqueleto no cambia: solo pasa un H⁺ de una sustancia a otra."
],
[
"La combustión es una reducción completa: todo el carbono termina como CO₂.",
"Es una oxidación completa."
],
[
"La hidrólisis es una reacción típica de los alcanos.",
"Es típica de ésteres, amidas, cloruros de ácido y nitrilos."
],
[
"En la polimerización por adición sale una molécula de agua en cada unión.",
"No sale nada: se abre el doble enlace; con salida de agua es condensación."
]
],
"orbitales": [
[
"El orden de enlace se calcula como (electrones enlazantes + antienlazantes) ÷ 2.",
"Se restan: (enlazantes − antienlazantes) ÷ 2."
],
[
"El H₂ tiene orden de enlace 2, porque tiene 2 electrones.",
"Es (2 − 0) ÷ 2 = 1: un enlace sencillo."
],
[
"El He₂ existe y tiene orden de enlace 1.",
"Tiene 2 enlazantes y 2 antienlazantes: orden 0, no existe."
],
[
"Al combinar 2 orbitales atómicos se obtiene 1 orbital molecular.",
"Salen 2: tantos orbitales moleculares como orbitales atómicos se combinan."
],
[
"En el orbital antienlazante hay electrones entre los núcleos, que los mantienen unidos.",
"El antienlazante tiene un nodo en el medio: los núcleos quedan expuestos y se repelen."
],
[
"El orbital enlazante tiene más energía que los orbitales atómicos de los que sale.",
"Tiene menos energía; el antienlazante tiene más."
],
[
"Los electrones llenan primero el orbital antienlazante.",
"Llenan primero el de menor energía (el enlazante), como en Aufbau."
],
[
"El O₂ no es atraído por un imán porque todos sus electrones están apareados.",
"Tiene 2 electrones desapareados en los π*: es paramagnético."
],
[
"El orden de enlace del N₂ es 2.",
"Es 3: un triple enlace."
],
[
"El H₂⁺ no puede existir porque su orden de enlace es 0.",
"Tiene 1 electrón enlazante: orden 0,5, así que sí existe."
],
[
"En el H₂ la energía es mínima cuando los núcleos están a 220 pm.",
"El mínimo está en 74 pm (−436 kJ/mol)."
],
[
"El enlace π del eteno está sobre el eje que une los dos núcleos.",
"La nube π está arriba y abajo del eje; sobre el eje está el σ."
],
[
"El eteno reacciona por sustitución porque su nube π está protegida dentro de la molécula.",
"Reacciona por adición: la nube π está expuesta y la atacan los electrófilos."
],
[
"El benceno libera 360 kJ/mol al hidrogenarse, igual que tres ciclohexenos.",
"360 es lo que predice el modelo de dobles enlaces fijos; el benceno libera 208 kJ/mol."
],
[
"La energía de resonancia del benceno es 208 kJ/mol.",
"Es 360 − 208 ≈ 152 kJ/mol; 208 es lo que libera al hidrogenarse."
],
[
"El ciclobutadieno es aromático porque es un anillo plano y conjugado.",
"Tiene 4 electrones π, que no cumplen 4n + 2: no es aromático."
],
[
"El ciclohexano es aromático porque es un anillo de 6 carbonos.",
"Sus carbonos son sp³ y tiene 0 electrones π: no es aromático."
],
[
"Con más dobles enlaces conjugados, la molécula absorbe luz de menor longitud de onda.",
"Absorbe luz de mayor longitud de onda (de menor energía)."
],
[
"Las hojas se ven verdes porque la clorofila absorbe la luz verde.",
"La clorofila absorbe la luz roja y la azul; la verde no se absorbe y es la que vemos."
],
[
"El modelo de orbitales moleculares reemplaza por completo a la hibridación, que ya no se usa.",
"Se usan los dos: la hibridación sigue sirviendo para la forma de las moléculas."
],
[
"El eteno es de color porque absorbe luz visible.",
"Absorbe a 171 nm, en el ultravioleta: es incoloro."
]
],
"propiedades": [
[
"Cuando el agua hierve se rompen los enlaces O−H de sus moléculas.",
"El vapor sigue siendo H₂O: solo se vencen las atracciones entre moléculas."
],
[
"El CCl₄ es polar porque tiene 4 enlaces C−Cl polares.",
"Los 4 enlaces apuntan a los vértices del tetraedro y se anulan: es apolar."
],
[
"El dimetiléter forma puentes de hidrógeno entre sus moléculas porque tiene oxígeno.",
"No tiene ningún H unido al O: solo hay dipolo-dipolo y London."
],
[
"Las fuerzas de London solo existen entre moléculas apolares.",
"Existen en todas las moléculas."
],
[
"El puente de hidrógeno es la más débil de las tres fuerzas intermoleculares.",
"Es la más fuerte de las tres; London es la más débil por molécula."
],
[
"Cuanto más fuertes son las fuerzas intermoleculares, menor es el punto de ebullición.",
"Es al revés: mayor es el punto de ebullición."
],
[
"El etanal, CH₃−CHO, forma puentes de hidrógeno porque tiene un C=O.",
"No tiene O−H ni N−H: su fuerza más fuerte es dipolo-dipolo."
],
[
"La propanona forma puentes de hidrógeno entre sus moléculas.",
"Sin O−H ni N−H, su fuerza más fuerte es dipolo-dipolo."
],
[
"La etilamina solo tiene fuerzas de London porque no tiene oxígeno.",
"Tiene enlaces N−H: forma puentes de hidrógeno."
],
[
"El hexan-1-ol se mezcla con agua en cualquier proporción porque tiene un −OH.",
"Casi no se disuelve (0,6 g/100 mL): su cadena apolar es larga."
],
[
"El butan-1-ol se mezcla con agua en cualquier proporción, igual que el metanol.",
"Solo se disuelven 7,7 g/100 mL: desde 4 carbonos la solubilidad cae."
],
[
"El 2,2-dimetilpropano hierve más alto que el pentano porque es más ramificado.",
"Hierve más bajo (10 °C frente a 36 °C): con menos superficie, menos London."
],
[
"Las fuerzas de London disminuyen cuando aumentan el número de electrones y la superficie.",
"Aumentan con el número de electrones y con la superficie."
],
[
"El alcohol antiséptico se evapora rápido porque sus moléculas se atraen más que las del aceite.",
"Se evapora rápido porque se atraen menos."
],
[
"A la misma temperatura, el agua tiene más moléculas en el vapor que el propano.",
"Tiene menos: el agua tiene puentes de hidrógeno y el propano solo London."
],
[
"Romper un enlace O−H cuesta unos 20 kJ/mol y separar dos moléculas de agua, unos 460 kJ/mol.",
"Es al revés: 460 kJ/mol el enlace O−H y unos 20 kJ/mol separar las moléculas."
],
[
"Los hidrocarburos son polares porque tienen muchos enlaces C−H.",
"El C−H casi no es polar: los hidrocarburos son apolares."
],
[
"Porcentaje de error = (valor de referencia ÷ valor medido) × 100.",
"Es |medido − referencia| ÷ referencia × 100."
],
[
"Si las medidas no coinciden exactamente con la referencia, los datos no apoyan la hipótesis.",
"Diferencias pequeñas son errores de medida: los datos pueden apoyar la hipótesis."
],
[
"En el jabón, la cabeza iónica se mete en la grasa y la cola queda hacia el agua.",
"Es al revés: la cola apolar en la grasa y la cabeza iónica hacia el agua."
],
[
"En la serie de alcoholes de metanol a hexan-1-ol, el punto de ebullición baja cuando la cadena crece.",
"Sube: más carbonos, más fuerzas de London."
]
],
"biomoleculas": [
[
"La ribosa es una cetopentosa.",
"Tiene un aldehído y 5 C: es una aldopentosa."
],
[
"La fructosa es una aldohexosa.",
"Tiene una cetona en el C2: es una cetohexosa."
],
[
"El gliceraldehído es una cetotriosa.",
"Es una aldotriosa; la cetotriosa es la dihidroxiacetona."
],
[
"Un monosacárido es de la serie D si en Fischer el −OH del C2 está a la derecha.",
"Se mira el −OH del penúltimo carbono, el quiral más alejado del carbonilo."
],
[
"Al pasar de Fischer a Haworth, un −OH que estaba a la derecha queda arriba del anillo.",
"Derecha → abajo; izquierda → arriba."
],
[
"Para formar el anillo de la glucosa, el −OH del C6 ataca al aldehído del C1.",
"Lo ataca el −OH del C5: se forma un anillo de 6 átomos (5 C y 1 O)."
],
[
"La β-glucosa tiene el −OH del C1 abajo, en el lado opuesto al CH₂OH.",
"Esa es la α; en la β el −OH del C1 queda arriba."
],
[
"El almidón está hecho de β-glucosas y la celulosa de α-glucosas.",
"Es al revés: almidón α y celulosa β."
],
[
"La glucosa forma una furanosa, un anillo de 5 átomos.",
"Forma una piranosa (anillo de 6); la fructosa forma la furanosa."
],
[
"El ácido linoleico, 18:2 cis-Δ9,12, es un omega-12.",
"ω = 18 − 12 = 6: es omega-6."
],
[
"El número omega se cuenta desde el carbono del −COOH.",
"Se cuenta desde el extremo CH₃; desde el −COOH se cuenta Δ."
],
[
"El ácido oleico es un ácido graso esencial que hay que comer.",
"No es esencial: el cuerpo lo fabrica. Los esenciales son el linoleico y el α-linolénico."
],
[
"El ácido esteárico es líquido porque su cadena está doblada.",
"Es saturado: su cadena es recta, se apila bien y es sólido (69 °C)."
],
[
"En la saponificación, una grasa reacciona con NaOH y forma glicerol y una sola molécula de jabón.",
"Grasa + 3 NaOH → glicerol + 3 moléculas de jabón."
],
[
"En una micela, las cabezas −COO⁻ quedan hacia adentro, en contacto con la grasa.",
"Las colas apolares van hacia la grasa y las cabezas −COO⁻ hacia el agua."
],
[
"La hebra complementaria de 5′-ATGC-3′ es 5′-ATGC-3′.",
"Es 3′-TACG-5′: A con T, G con C, y en dirección contraria."
],
[
"En el ADN, la A se aparea con la G y la T con la C.",
"Se aparean A con T y G con C."
],
[
"Si un ADN tiene 30 % de adenina, también tiene 30 % de guanina.",
"Tiene 30 % de T; G y C son 20 % cada una (Chargaff)."
],
[
"El par G−C se une con 2 puentes de hidrógeno y el par A−T con 3.",
"Es al revés: A=T con 2 y G≡C con 3."
],
[
"En la replicación, una molécula hija queda con las dos hebras viejas y la otra con las dos nuevas.",
"Es semiconservativa: cada hija tiene una hebra vieja y una nueva."
],
[
"El ARN tiene timina, igual que el ADN.",
"El ARN tiene uracilo en lugar de timina."
],
[
"El codón GCU del ARNm se aparea con un ARNt de anticodón GCU.",
"El anticodón es complementario: CGA."
],
[
"El enlace peptídico se forma en el núcleo, mientras el ADN se transcribe.",
"Se forma en el ribosoma, durante la traducción."
],
[
"La traducción empieza en el codón UAA.",
"Empieza en AUG (metionina); UAA es un codón de parada."
],
[
"Al freír un huevo se rompen los enlaces peptídicos de sus proteínas.",
"Se rompen los puentes de hidrógeno y la proteína pierde su forma; los enlaces peptídicos no se rompen."
]
],
"ambiente": [
[
"En la torre de destilación, las cadenas más largas salen por arriba.",
"Se condensan abajo; por arriba salen los gases, de cadena corta."
],
[
"Las moléculas más largas tienen menos fuerzas de London y hierven a menor temperatura.",
"Tienen más fuerzas de London y hierven a mayor temperatura."
],
[
"Al quemar 1 kg de gasolina sale menos de 1 kg de CO₂, porque parte se pierde como humo.",
"Sale más de 1 kg: cada carbono se une al oxígeno del aire."
],
[
"La combustión del octano es 2 C₈H₁₈ + 25 O₂ → 8 CO₂ + 18 H₂O.",
"Faltan carbonos: son 16 CO₂."
],
[
"La combustión incompleta del metano es 2 CH₄ + 3 O₂ → 2 CO₂ + 4 H₂O.",
"Con poco oxígeno se forma CO: 2 CH₄ + 3 O₂ → 2 CO + 4 H₂O."
],
[
"El monóxido de carbono es fácil de detectar porque tiene un olor muy fuerte.",
"No tiene olor ni color; por eso es tan peligroso."
],
[
"El octano emite menos CO₂ por megajulio que el metano.",
"Emite más: 64 g/MJ frente a 49 g/MJ del metano."
],
[
"El etanol de caña no emite CO₂ al quemarse porque es un biocombustible.",
"Sí emite CO₂; la diferencia es que ese carbono lo tomó la caña del aire."
],
[
"El CO₂ absorbe la luz solar y deja pasar la radiación infrarroja que emite el suelo.",
"La luz solar atraviesa el aire; el CO₂ absorbe el infrarrojo del suelo y lo reemite."
],
[
"El polietileno se forma por condensación y en cada unión sale una molécula de agua.",
"Se forma por adición: se abren los C=C y no sale nada."
],
[
"El PET se forma por polimerización por adición.",
"Se forma por condensación: es un poliéster."
],
[
"Una bolsa de polietileno se degrada rápido porque los microorganismos rompen fácilmente sus enlaces C−C.",
"Casi no hay enzimas para cadenas de solo C−C: se parte en microplásticos."
],
[
"Los microplásticos son trozos de plástico de más de 5 mm.",
"Son de menos de 5 mm."
],
[
"En la destrucción del ozono, la luz UV rompe el enlace C−Cl de forma heterolítica.",
"La ruptura es homolítica: cada átomo se queda con un electrón."
],
[
"Cada Cl· se gasta en la primera reacción y destruye una sola molécula de ozono.",
"El Cl· queda libre otra vez: actúa como catalizador y destruye miles."
],
[
"El DDT se elimina fácil con la orina porque es muy polar.",
"Es muy apolar: se disuelve en la grasa y se acumula."
],
[
"La concentración de DDT disminuye en cada nivel de la cadena alimentaria.",
"Aumenta en cada nivel: biomagnificación."
],
[
"El petróleo derramado se hunde porque es más denso que el agua.",
"Es menos denso: flota y forma una mancha."
],
[
"El biodiésel de palma se obtiene por fermentación del aceite.",
"Se obtiene por transesterificación con metanol; la fermentación da el etanol de caña."
],
[
"Un combustible renovable no tiene ningún impacto ambiental.",
"«Renovable» no significa «sin impacto»: hay que mirar todo su ciclo de vida."
],
[
"El Protocolo de Montreal de 1987 prohibió los plásticos de un solo uso.",
"Prohibió los CFC; en Colombia los plásticos de un solo uso los reduce la Ley 2232 de 2022."
]
]
};
TEMAS.forEach(function(t){if(CAZAR[t.id])t.cazar=CAZAR[t.id];});

window.DOCENTE_DATOS={ALINEACION:ALINEACION,TEMAS:TEMAS,SABER:SABER,ABIERTAS:ABIERTAS,CAZAR:CAZAR};
})();

/* ── Indagación (sesión del 12-11-2026) ─────────────────────────────────
   La revisión con el cuadernillo Saber 11.º del Icfes (2026) mostró que
   solo el 12 % de las preguntas tipo Saber de ChromaNom era de indagación,
   que en la prueba real es la competencia con más preguntas. Estas 24 (2
   por tema) piden analizar datos, controlar variables, evaluar predicciones
   y sacar conclusiones. c: competencia; af: afirmación del Icfes (ver
   saber-icfes.js). La primera opción es la correcta. */
(function(){var S=window.DOCENTE_DATOS&&window.DOCENTE_DATOS.SABER;if(!S)return;
function I(t,a,af,ctx,q,o,k){(S[t]=S[t]||[]).push({a:a,c:'ind',af:af,k:k||'Q',ctx:ctx,q:q,o:o});}
I('cadena','prop','N2','Un estudiante consultó la energía que libera 1 g de tres hidrocarburos al quemarse: metano, 55 kJ; propano, 50 kJ; octano, 48 kJ.','¿Qué conclusión es coherente con estos datos?',['Por gramo, la energía liberada disminuye un poco a medida que la cadena es más larga','La energía liberada por gramo no depende del hidrocarburo que se queme','El octano libera más energía por gramo que el metano porque es más grande','La energía por gramo aumenta a medida que la cadena es más larga'],'CTS');
I('cadena','prop','N1','Una estudiante afirma que el carbono forma cadenas largas porque hace cuatro enlaces y puede unirse con otros átomos de carbono.','¿Qué evidencia apoya mejor su afirmación?',['Que existen alcanos estables de más de 30 carbonos, como los de la parafina, con cadenas de enlaces C−C','Que el carbón vegetal es negro porque tiene cadenas muy largas de carbono','Que el diamante es muy duro porque sus carbonos forman cadenas lineales','Que el CO₂ es un gas porque el carbono no se une con otros carbonos']);
I('alcanos','prop','N4','Puntos de ebullición de los primeros alcanos: metano, −162 °C; etano, −89 °C; propano, −42 °C; butano, −1 °C.','Si el patrón se mantiene, ¿qué valor es más probable para el pentano?',['Cerca de 36 °C','Cerca de −50 °C','Cerca de −1 °C','Cerca de 200 °C']);
I('alcanos','prop','N3','Para comparar qué tan rápido se evaporan el hexano y el decano, un estudiante pone 1 mL de cada uno en un vidrio de reloj y mide el tiempo que tardan en desaparecer.','¿Qué condiciones debe controlar para que la comparación sea válida?',['Que los dos líquidos estén a la misma temperatura, con la misma superficie y la misma ventilación','Que los dos líquidos tengan colores diferentes para distinguirlos','Usar más cantidad de decano porque se evapora más despacio','Poner el hexano al sol y el decano a la sombra para acelerar la prueba']);
I('alquenos','rx','N2','Al agregar agua de bromo (de color naranja) a tres líquidos, el ciclohexano y el hexano no cambian de color, y el ciclohexeno se decolora al instante.','¿Qué conclusión es válida?',['Solo el ciclohexeno tiene un doble enlace C=C que reacciona con el bromo','Los tres líquidos son alquenos, pero el ciclohexeno reacciona más rápido','El hexano tiene un doble enlace que reacciona solo con calor','El bromo reacciona con cualquier hidrocarburo si se espera lo suficiente']);
I('alquenos','rx','N3','Un estudiante predice que el aceite de oliva tiene más dobles enlaces que la mantequilla. Tiene una solución de yodo que se decolora al reaccionar con los dobles enlaces: cuantos más dobles enlaces, más gotas se decoloran.','¿Qué procedimiento le permite evaluar su predicción?',['Agregar gota a gota la solución de yodo a masas iguales de aceite y de mantequilla, y comparar cuántas gotas se decoloran en cada una','Calentar el aceite y la mantequilla hasta que hiervan y comparar cuál de los dos humea más en el recipiente','Probar la solución de yodo solo con el aceite y comparar el resultado con lo que dice la etiqueta del frasco','Comparar el color y el olor del aceite y de la mantequilla antes de agregar el yodo a cualquiera de los dos']);
I('aromaticos','rx','N1','El benceno, C₆H₆, se dibuja con tres dobles enlaces en la fórmula de Kekulé, pero no decolora el agua de bromo a temperatura ambiente, mientras que el ciclohexeno sí la decolora.','¿Qué conclusión sacaron los químicos de esta evidencia?',['Los electrones del anillo de benceno están deslocalizados y el anillo es más estable que un alqueno común','El benceno no tiene átomos de carbono con dobles enlaces reales, así que no puede reaccionar con el bromo','El benceno es en realidad un alcano de cadena abierta, y no un anillo con dobles enlaces','El agua de bromo estaba dañada en el ensayo del benceno y por eso no se decoloró']);
I('aromaticos','prop','N2','Todos los enlaces carbono-carbono del benceno miden 0,139 nm. Un enlace C−C sencillo mide 0,154 nm y un enlace C=C mide 0,134 nm.','¿Qué indican estos datos?',['Que los seis enlaces son iguales e intermedios entre sencillo y doble, lo que apoya el modelo de anillo con electrones deslocalizados','Que el benceno tiene tres enlaces sencillos y tres dobles que se alternan alrededor del anillo','Que el benceno solo tiene enlaces sencillos, porque su medida se acerca más a 0,154 nm','Que la longitud de los enlaces no tiene relación con la estructura de la molécula']);
I('haluros','rx','N2','Se agregó nitrato de plata en etanol a tres haluros de la misma cadena y se midió el tiempo en que aparece un precipitado: 1-yodobutano, 1 minuto; 1-bromobutano, 5 minutos; 1-clorobutano, 30 minutos.','¿Qué conclusión es coherente con los datos?',['La reactividad del enlace carbono-halógeno aumenta del cloro al yodo','El 1-clorobutano es el que reacciona más rápido','La longitud de la cadena causa las diferencias','Los tres haluros reaccionan con la misma rapidez']);
I('haluros','rx','N3','Un estudiante quiere saber si la temperatura acelera la reacción del 2-bromo-2-metilpropano con agua.','¿Qué diseño experimental es adecuado?',['Hacer la misma reacción, con las mismas cantidades, a varias temperaturas, y medir en cada caso el tiempo de reacción','Usar varios haluros diferentes a la misma temperatura y medir cuál reacciona más rápido','Hacer una sola reacción en caliente y comparar su tiempo con lo que dice el libro','Cambiar al mismo tiempo la cantidad de agua y la temperatura en cada ensayo']);
I('alcoholes','prop','N4','Solubilidad en agua a 20 °C: el metanol, el etanol y el propan-1-ol se mezclan con agua en cualquier proporción; del butan-1-ol se disuelven 7,7 g en 100 mL; del pentan-1-ol, 2,2 g; del hexan-1-ol, 0,6 g.','¿Qué patrón muestran los datos?',['A medida que la cadena de carbono es más larga, el alcohol es menos soluble en agua','Los alcoholes de cadena larga son los más solubles','La solubilidad no depende de la longitud de la cadena','Todos los alcoholes se mezclan con el agua en cualquier proporción']);
I('alcoholes','rx','N3','Una estudiante tiene dos frascos sin rótulo: uno con propan-1-ol (alcohol primario) y otro con 2-metilpropan-2-ol (alcohol terciario). Tiene dicromato de potasio acidificado, de color naranja, que se vuelve verde cuando oxida a un alcohol.','¿Qué resultado le permite identificar los frascos?',['El frasco que pasa de naranja a verde es el alcohol primario; el terciario no se oxida y queda naranja','Los dos frascos se vuelven verdes, porque ambos alcoholes tienen un grupo −OH que se oxida','El alcohol terciario se vuelve verde y el primario queda naranja, porque tiene más carbonos','Ninguno cambia de color, porque el dicromato solo reacciona con aldehídos y cetonas']);
I('carbonilos','rx','N2','Se aplicó el reactivo de Tollens a tres muestras: el propanal forma un espejo de plata, la propanona no cambia y una muestra desconocida X forma un espejo de plata.','¿Qué se puede concluir de la muestra X?',['Que probablemente contiene un grupo aldehído','Que es una cetona','Que es un alcano','Que no se puede concluir nada porque no se comparó con otras muestras']);
I('carbonilos','prop','N2','Puntos de ebullición de tres compuestos de masa molar parecida: butano (58 g/mol), −1 °C; propanal (58 g/mol), 49 °C; propan-1-ol (60 g/mol), 97 °C.','¿Qué explicación es coherente con los datos?',['El grupo C=O polar del propanal sube su punto de ebullición respecto al butano, pero queda por debajo del alcohol, que forma puentes de hidrógeno entre sus moléculas','La diferencia de masa molar explica toda la diferencia: el propan-1-ol pesa 2 g/mol más y por eso hierve casi 50 °C más','El butano forma puentes de hidrógeno entre sus moléculas, pero se rompen con facilidad, por eso hierve tan bajo','El propanal forma más puentes de hidrógeno que el alcohol, aunque hierve más bajo porque su molécula es más pequeña']);
I('acidos','prop','N2','Una estudiante mide el pH de tres soluciones 0,1 M: ácido acético, 2,9; ácido clorhídrico, 1,0; etanol, 7,0.','¿Qué conclusión es válida?',['El ácido acético es un ácido débil: a la misma concentración libera menos iones H⁺ que el ácido clorhídrico','El ácido acético es más fuerte que el clorhídrico, porque su pH está más cerca de 3','El etanol también es un ácido, aunque su pH de 7 lo hace parecer neutro','Las tres soluciones son igual de ácidas, porque tienen la misma concentración']);
I('acidos','rx','N3','Para comprobar que el vinagre contiene un ácido carboxílico, un estudiante le agrega bicarbonato de sodio.','¿Qué observación apoyaría su hipótesis y por qué?',['Efervescencia, porque el ácido reacciona con el bicarbonato y libera CO₂','Un cambio a color azul, porque el vinagre es básico','Que no pase nada, porque los ácidos no reaccionan con sales','La formación de un espejo de plata']);
I('nitrogenados','prop','N2','La propilamina y la trimetilamina tienen la misma fórmula molecular, C₃H₉N. La propilamina hierve a 48 °C y la trimetilamina a 3 °C.','¿Qué explicación es coherente con los datos?',['La propilamina tiene enlaces N−H y forma puentes de hidrógeno entre sus moléculas; la trimetilamina no tiene hidrógenos unidos al nitrógeno','La trimetilamina tiene más masa molar y por eso sus moléculas se mueven más rápido y hierven antes','Las dos forman los mismos puentes de hidrógeno, pero los de la trimetilamina se rompen con menos energía','La diferencia se debe a que la trimetilamina es un gas a temperatura ambiente y la propilamina no']);
I('nitrogenados','prop','N3','Un estudiante cree que las aminas son bases. Tiene papel tornasol rojo y una solución de metilamina en agua.','¿Qué resultado apoyaría su idea?',['Que el papel tornasol rojo se vuelva azul','Que el papel tornasol siga rojo','Que se forme un precipitado amarillo','Que la solución empiece a hervir']);
I('polifuncionales','prop','N2','La glucosa, C₆H₁₂O₆, tiene cinco grupos −OH y un grupo carbonilo, y se disuelve fácilmente en agua. El hexano, C₆H₁₄, también tiene seis carbonos, pero no se disuelve en agua.','¿Qué conclusión se apoya en esta información?',['Los grupos −OH de la glucosa forman puentes de hidrógeno con el agua y la hacen soluble','La glucosa es soluble porque tiene seis carbonos, igual que el hexano','El hexano tiene más grupos −OH que la glucosa, pero están ocultos','La solubilidad no depende de los grupos funcionales sino del tamaño']);
I('polifuncionales','rx','N2','Una muestra desconocida forma un espejo de plata con el reactivo de Tollens y produce efervescencia al agregarle bicarbonato de sodio.','¿Qué grupos funcionales podría tener la muestra?',['Un aldehído y un ácido carboxílico','Solo un alcohol','Una cetona y un éter','Ningún grupo funcional: es un alcano']);
I('isomeria','prop','N2','El etanol y el dimetiléter tienen la misma fórmula molecular, C₂H₆O. El etanol hierve a 78 °C y reacciona con sodio liberando hidrógeno; el dimetiléter hierve a −24 °C y no reacciona con sodio.','¿Qué conclusión se apoya en estos datos?',['Son isómeros de función: la misma fórmula molecular con distinta estructura da propiedades distintas','Son la misma sustancia con dos nombres, medida en condiciones distintas','Tienen distinta fórmula molecular, aunque se escriban parecido','La fórmula molecular determina todas las propiedades de una sustancia']);
I('isomeria','prop','N3','El limoneno tiene dos formas que son imágenes especulares: una huele a naranja y la otra a limón. Las dos tienen el mismo punto de ebullición y la misma densidad.','¿Qué medición permite distinguirlas en el laboratorio?',['El sentido en que desvía cada una la luz polarizada','El punto de ebullición de cada una','La densidad de cada una a 20 °C','La fórmula molecular de cada una']);
I('reacciones','rx','N2','Se quemó la misma masa de etanol en tres mecheros con distinta entrada de aire. Con poco aire la llama fue amarilla y dejó hollín; con mucho aire la llama fue azul y no dejó hollín.','¿Qué conclusión es válida?',['Con poco oxígeno la combustión es incompleta y produce hollín (carbono) y CO; con suficiente oxígeno es completa','La cantidad de aire no influye: el color de la llama depende del mechero','El hollín indica que la combustión fue completa y aprovechó todo el carbono','La llama azul indica falta de oxígeno y la amarilla, exceso de oxígeno'],'CTS');
I('reacciones','rx','N3','Una estudiante quiere saber si unas gotas de ácido sulfúrico aceleran la esterificación del ácido acético con etanol.','¿Qué diseño le permite saberlo?',['Preparar dos mezclas iguales de ácido y alcohol a la misma temperatura, una con ácido sulfúrico y otra sin él, y comparar cuánto éster se forma en el mismo tiempo','Preparar una sola mezcla con ácido sulfúrico, medir cuánto éster se forma en una hora y compararlo con el valor del libro','Preparar una segunda mezcla en la que se cambien al mismo tiempo el alcohol y el catalizador, y comparar las dos','Calentar solo la mezcla que no tiene catalizador, para que las dos reaccionen a la misma velocidad, y luego compararlas']);
})();

/* ── Más indagación (sesión del 12-11-2026, 2.ª parte) ────────────────────
   Meta: al menos 8 preguntas de indagación por tema, para que una
   evaluación de un solo tema pueda tener cerca de un tercio de indagación,
   como la prueba Saber 11. Opciones del mismo largo y forma. Fórmulas sin
   ramas entre paréntesis (nombres o fórmulas moleculares). */
(function(){var S=window.DOCENTE_DATOS&&window.DOCENTE_DATOS.SABER;if(!S)return;
function I(t,a,af,ctx,q,o,k){(S[t]=S[t]||[]).push({a:a,c:'ind',af:af,k:k||'Q',ctx:ctx,q:q,o:o});}
// Cadena
I('cadena','prop','N4','Un estudiante predice que, entre alcanos lineales, a más carbonos mayor densidad del líquido. Consulta: pentano 0,626 g/mL; hexano 0,659; heptano 0,684; octano 0,703.','¿Los datos apoyan su predicción?',['Sí: la densidad aumenta poco a poco a medida que la cadena es más larga','No: la densidad cambia muy poco, así que la longitud de la cadena no influye','Sí, pero solo porque el octano es el único que tiene ocho carbonos','No: para saberlo habría que medir el punto de ebullición y no la densidad']);
I('cadena','prop','N2','Al quemar por completo 1 mol de tres alcanos se midió el CO₂ producido: metano, 1 mol; propano, 3 mol; pentano, 5 mol.','¿Qué conclusión se apoya en los datos?',['Cada carbono de la cadena termina formando una molécula de CO₂','Los alcanos producen siempre la misma cantidad de CO₂ al quemarse','El CO₂ producido depende de los hidrógenos y no de los carbonos','Los alcanos más largos producen menos CO₂ por mol que los cortos']);
// Alcanos
I('alcanos','prop','N3','Una estudiante quiere saber si los alcanos se disuelven en agua o en aceite. Tiene hexano, agua, aceite de cocina y tubos de ensayo.','¿Qué procedimiento es adecuado?',['Agregar la misma cantidad de hexano a tubos con igual volumen de agua y de aceite, y observar si se forman capas','Agregar hexano solo al agua y suponer que con el aceite pasaría lo contrario','Calentar el hexano hasta que hierva y ver si se mezcla con el vapor del agua','Agregar hexano al agua y al aceite en cantidades distintas y observar el color']);
I('alcanos','prop','N2','Se midió la viscosidad de tres alcanos a 25 °C: hexano 0,30; decano 0,85; hexadecano 3,0 (en mPa·s).','¿Qué conclusión es coherente con los datos?',['A cadena más larga, el líquido fluye con más dificultad','A cadena más larga, el líquido fluye con más facilidad','La viscosidad no depende de la longitud de la cadena','El hexano es el más viscoso porque tiene menos carbonos']);
// Alquenos
I('alquenos','rx','N2','Se agregó permanganato de potasio violeta a tres líquidos: con ciclohexano el color no cambió; con hex-1-eno y con ciclohexeno el violeta desapareció y se formó un sólido café.','¿Qué conclusión se apoya en las observaciones?',['Los dos líquidos que reaccionaron tienen enlaces dobles C=C','Los tres líquidos tienen enlaces dobles, pero uno reacciona lento','El ciclohexano tiene un doble enlace que no reacciona con el permanganato','El permanganato reacciona con cualquier hidrocarburo que tenga un anillo']);
I('alquenos','rx','N3','Un estudiante quiere saber si la luz acelera la reacción del bromo con un alqueno. Tiene dos tubos iguales con la misma mezcla.','¿Qué diseño es adecuado?',['Dejar un tubo a la luz y otro cubierto, a la misma temperatura, y medir cuánto tarda en perderse el color','Dejar los dos tubos a la luz y agregar más bromo a uno de ellos','Cubrir un tubo y calentar el otro, para que la reacción ocurra más rápido','Usar un alqueno distinto en cada tubo y dejarlos los dos a la luz']);
I('alquenos','prop','N4','Una estudiante predice que los isómeros cis y trans del but-2-eno tienen distinto punto de ebullición. Consulta: cis, 4 °C; trans, 1 °C.','¿Qué se puede decir de su predicción?',['Los datos la apoyan: aunque la diferencia es pequeña, los valores son distintos','Los datos la refutan: los dos son gases a temperatura ambiente','No se puede evaluar, porque los isómeros siempre tienen las mismas propiedades','Los datos la apoyan solo si el isómero trans hirviera a mayor temperatura']);
I('alquenos','rx','N1','Markovnikov propuso en 1870 su regla después de estudiar muchas adiciones de HX a alquenos distintos y notar que el producto principal seguía el mismo patrón.','¿Cómo se llegó a esa regla?',['Generalizando un patrón que se repetía en muchos resultados experimentales','Haciendo una sola reacción y suponiendo que todas las demás serían iguales','Calculando la energía de los enlaces con computadores modernos','Copiando una regla que ya se usaba para los alcanos']);
// Aromáticos
I('aromaticos','rx','N2','Al nitrar tolueno se obtuvo una mezcla de productos: cerca de 59 % en posición orto, 37 % para y 4 % meta.','¿Qué conclusión se apoya en los datos?',['El grupo metilo dirige la sustitución sobre todo a las posiciones orto y para','El grupo metilo dirige la sustitución sobre todo a la posición meta','El grupo metilo no influye: el nitro entra por igual en todas las posiciones','El producto meta es el principal porque está más lejos del metilo']);
I('aromaticos','prop','N3','Un grupo quiere saber si el tolueno es más volátil que el xileno. Tienen las dos sustancias, vidrios de reloj y un cronómetro, en una campana de extracción.','¿Qué procedimiento es adecuado?',['Poner volúmenes iguales de cada líquido en vidrios iguales, a la misma temperatura, y medir cuánto tardan en evaporarse','Poner más tolueno que xileno en vidrios iguales y ver cuál de los dos desaparece primero','Calentar solo el xileno y comparar su tiempo de evaporación con el del tolueno sin calentar','Oler los dos líquidos al destaparlos y decidir cuál tiene el olor más fuerte y penetrante']);
I('aromaticos','rx','N4','Una estudiante predice que el benceno no reacciona con bromo sin catalizador. Mezcla benceno con bromo a temperatura ambiente y después de una hora el color naranja sigue igual.','¿Los resultados apoyan su predicción?',['Sí: sin catalizador no se observó reacción en ese tiempo','No: el color se mantuvo porque el benceno disolvió todo el bromo','Sí, pero solo si el color hubiera desaparecido al instante','No: para saberlo habría que usar ciclohexeno en vez de benceno']);
I('aromaticos','prop','N1','Kekulé propuso en 1865 una estructura de anillo para el benceno; años después, la difracción de rayos X mostró que el anillo es plano y con todos los enlaces iguales.','¿Qué muestra esta historia sobre los modelos científicos?',['Que un modelo útil se mejora cuando aparecen nuevas técnicas y evidencias','Que el primer modelo propuesto siempre es el definitivo y no cambia','Que los modelos se aceptan sin evidencia si su autor es reconocido','Que la difracción de rayos X demostró que el benceno no es un anillo']);
// Haluros
I('haluros','rx','N4','Un estudiante predice que el 2-bromo-2-metilpropano forma precipitado con nitrato de plata en etanol más rápido que el 1-bromobutano. Observa: el primero, en segundos; el segundo, después de varios minutos.','¿Los resultados apoyan su predicción?',['Sí: el haluro terciario reaccionó mucho más rápido, como predijo','No: los dos formaron precipitado, así que reaccionan igual de rápido','Sí, pero solo porque el 1-bromobutano tiene más carbonos en la cadena','No: el precipitado indica que no hubo reacción con ningún haluro']);
I('haluros','prop','N2','Puntos de ebullición: clorometano −24 °C, diclorometano 40 °C, triclorometano 61 °C, tetraclorometano 77 °C.','¿Qué conclusión es coherente con los datos?',['Al aumentar los cloros aumenta la masa y las fuerzas entre moléculas, y sube el punto de ebullición','Al aumentar los cloros la molécula se vuelve iónica y por eso hierve más alto','El número de cloros no influye: las diferencias se deben a errores de medición','Al aumentar los cloros la molécula pierde carbono y se vuelve más volátil']);
// Alcoholes
I('alcoholes','prop','N3','Una estudiante quiere comparar qué tan rápido se evaporan el etanol y el agua. Tiene goteros, papel filtro y un cronómetro.','¿Qué procedimiento es adecuado?',['Poner una gota del mismo tamaño de cada líquido en papeles iguales, al mismo tiempo, y medir cuánto tarda en secarse cada una','Poner una gota de etanol al sol y una de agua a la sombra, y medir cuánto tarda en secarse cada una','Poner varias gotas de agua y una sola de etanol, y medir cuál de las dos manchas desaparece antes','Oler las dos gotas cada minuto y decidir por el olor cuál de los dos líquidos se evaporó primero']);
I('alcoholes','rx','N2','Se agregó un trozo pequeño de sodio a tres tubos: con etanol se formaron burbujas despacio; con agua, rápido; con hexano, nada.','¿Qué conclusión se apoya en las observaciones?',['El etanol y el agua tienen un hidrógeno unido a oxígeno que reacciona con el sodio','El hexano reacciona con el sodio, pero sin formar burbujas visibles','El etanol reacciona más rápido que el agua porque tiene más carbonos','El sodio reacciona igual con todas las sustancias líquidas']);
I('alcoholes','rx','N4','Un estudiante predice que el butan-2-ol, al oxidarse con dicromato, forma una cetona. El producto da positiva la prueba de 2,4-dinitrofenilhidrazina y negativa la de Tollens.','¿Los resultados apoyan su predicción?',['Sí: hay un carbonilo y no es aldehído, así que es una cetona','No: la prueba positiva de 2,4-dinitrofenilhidrazina indica un alcohol','Sí, pero solo si la prueba de Tollens también hubiera sido positiva','No: el dicromato no oxida alcoholes secundarios']);
I('alcoholes','prop','N2','Solubilidad de tres alcoholes de cuatro carbonos en 100 mL de agua: butan-1-ol 7,7 g; butan-2-ol 18 g; 2-metilpropan-2-ol, se mezcla en cualquier proporción.','¿Qué conclusión es coherente con los datos?',['Con el mismo número de carbonos, la forma más compacta se disuelve mejor en agua','Los tres son igual de solubles, porque tienen el mismo número de carbonos','El butan-1-ol es el más soluble porque su cadena es la más larga','La solubilidad no depende de la estructura, solo de la masa molar']);
I('alcoholes','prop','N1','La ley colombiana fija un límite de metanol en las bebidas alcohólicas, después de que análisis de laboratorio encontraran metanol en licores adulterados.','¿Por qué esa norma se apoya en el conocimiento científico?',['Porque se basa en análisis químicos que identifican y miden una sustancia tóxica','Porque se basa en la opinión de los consumidores sobre el sabor del licor','Porque el metanol y el etanol son la misma sustancia con distinto nombre','Porque cualquier alcohol en una bebida es tóxico en la misma medida']);
// Carbonílicos
I('carbonilos','rx','N3','Un grupo debe identificar tres frascos: propanal, propanona y propan-1-ol. Tiene reactivo de Tollens y 2,4-dinitrofenilhidrazina.','¿Qué procedimiento les permite identificarlos?',['Usar la 2,4-dinitrofenilhidrazina para hallar los carbonilos y luego Tollens para separar el aldehído','Usar solo Tollens, porque reacciona distinto con los tres compuestos','Oler los tres frascos y decidir por el olor cuál es cada compuesto','Calentar los tres frascos y ver cuál hierve primero sin usar reactivos']);
I('carbonilos','prop','N2','Solubilidad en agua a 20 °C: propanona, en cualquier proporción; butanona, 27 g/100 mL; pentan-3-ona, 5 g/100 mL.','¿Qué conclusión es coherente con los datos?',['A medida que crece la cadena de la cetona, disminuye su solubilidad en agua','A medida que crece la cadena de la cetona, aumenta su solubilidad en agua','La solubilidad de las cetonas no depende de la longitud de la cadena','Las cetonas no son solubles en agua porque no tienen oxígeno']);
I('carbonilos','rx','N4','Una estudiante predice que la fructosa no da positiva la prueba de Fehling porque es una cetosa. En el ensayo, la fructosa formó el precipitado rojo ladrillo.','¿Qué se puede decir de su predicción?',['Los datos la refutan: la fructosa sí redujo el reactivo en ese ensayo','Los datos la apoyan: el precipitado rojo indica que no hubo reacción','No se puede evaluar, porque la fructosa no es un carbohidrato','Los datos la apoyan si el precipitado hubiera sido azul en vez de rojo']);
// Ácidos y ésteres
I('acidos','prop','N3','Un estudiante quiere comparar la acidez de dos vinagres de distintas marcas. Tiene papel indicador universal y vasos iguales.','¿Qué procedimiento es adecuado?',['Medir el pH de volúmenes iguales de cada vinagre, sin diluir, a la misma temperatura','Medir el pH de un vinagre puro y del otro diluido en agua','Probar el sabor de los dos vinagres y decidir cuál es más ácido','Medir el pH de uno solo y compararlo con la etiqueta del otro']);
I('acidos','rx','N2','En una práctica de esterificación, se mezclaron ácido etanoico y etanol con unas gotas de ácido sulfúrico y se calentaron; al final apareció un olor a pegante y se formaron dos capas al agregar agua.','¿Qué indican estas observaciones?',['Que se formó un éster, poco soluble en agua y de olor característico','Que el ácido etanoico se evaporó y dejó solo el etanol en el tubo','Que se formó una sal muy soluble que se separó en dos capas','Que no hubo reacción, porque el olor viene del ácido sulfúrico']);
I('acidos','prop','N4','Una estudiante predice que los ácidos carboxílicos de cadena más larga son menos solubles en agua. Datos: ácido etanoico, en cualquier proporción; butanoico, en cualquier proporción; hexanoico, 1 g/100 mL.','¿Los datos apoyan su predicción?',['Sí: el ácido de seis carbonos es mucho menos soluble que los más cortos','No: el ácido butanoico es tan soluble como el etanoico, así que falla','Sí, pero solo si el ácido etanoico fuera el menos soluble de los tres','No: la solubilidad de los ácidos depende solo del grupo −COOH']);
I('acidos','rx','N1','Chevreul estudió en el siglo XIX la fabricación del jabón y demostró que las grasas son ésteres de glicerina y ácidos grasos.','¿Qué aportó esta investigación?',['Explicó con química un proceso que se usaba desde hacía siglos por tradición','Demostró que el jabón se forma sin ninguna reacción química','Inventó el jabón, que antes no existía en ninguna cultura','Mostró que las grasas son minerales que se disuelven en agua']);
// Nitrogenados
I('nitrogenados','prop','N2','Se midió el pH de soluciones 0,1 M: metilamina, 11,8; amoníaco, 11,1; anilina, 8,8.','¿Qué conclusión se apoya en los datos?',['La metilamina es la base más fuerte y la anilina la más débil de las tres','La anilina es la base más fuerte porque tiene un anillo aromático','Las tres son ácidos, porque su pH es mayor que 7','Las tres tienen la misma fuerza básica, porque todas tienen nitrógeno']);
I('nitrogenados','prop','N3','Un grupo quiere saber si el olor a pescado disminuye al agregar vinagre. Tienen muestras iguales de pescado fresco.','¿Qué diseño es adecuado?',['Tratar unas muestras con vinagre y otras con agua, y comparar el olor con varias personas que no saben cuál es cuál','Tratar todas las muestras con vinagre y preguntar a una persona si huelen menos','Tratar unas muestras con vinagre y otras con limón, y oler solo las de limón','Oler el pescado antes de comprarlo y compararlo con el de la casa']);
I('nitrogenados','rx','N4','Un estudiante predice que la urea, al calentarse con NaOH, libera amoníaco. Acerca papel tornasol rojo húmedo a la boca del tubo y el papel se vuelve azul.','¿Qué se puede decir de su predicción?',['La observación la apoya: se liberó un gas básico como el amoníaco','La observación la refuta: el papel azul indica un gas ácido','No se puede evaluar, porque el tornasol no reacciona con gases','La observación la apoya solo si el papel se hubiera vuelto rojo']);
// Polifuncionales
I('polifuncionales','prop','N3','Una estudiante quiere saber si la vitamina C de un jugo se destruye al hervirlo. Tiene jugo, solución de yodo con almidón y un gotero.','¿Qué procedimiento es adecuado?',['Comparar cuántas gotas de jugo crudo y de jugo hervido quitan el color a la misma cantidad de solución','Hervir el jugo y contar las gotas, sin comparar con el jugo sin hervir','Comparar el color del jugo crudo y del jugo hervido a simple vista','Agregar más solución de yodo al jugo hervido que al jugo crudo']);
I('polifuncionales','prop','N2','La glicina, el aminoácido más sencillo, funde a 233 °C; el ácido acético, de masa parecida, funde a 17 °C.','¿Qué explicación es coherente con los datos?',['La glicina forma iones dipolares que se atraen con fuerza, como en un sólido iónico','La glicina tiene más carbonos que el ácido acético y por eso funde más alto','El ácido acético forma iones y la glicina no, por eso funde a menor temperatura','La diferencia se debe a errores de medición, porque sus masas son parecidas']);
I('polifuncionales','rx','N4','Un grupo predice que el ácido láctico de la leche agria tiene un grupo ácido. Al agregar bicarbonato a la leche agria se observan burbujas.','¿Los resultados apoyan su predicción?',['Sí: las burbujas de CO₂ indican la presencia de un ácido','No: las burbujas indican que la leche tiene un aldehído','Sí, pero solo si también se hubiera formado un espejo de plata','No: el bicarbonato hace burbujas con cualquier líquido']);
I('polifuncionales','prop','N1','El químico Linus Pauling propuso que las cadenas de aminoácidos forman hélices estables gracias a puentes de hidrógeno, y años después se confirmó con rayos X.','¿Qué muestra este ejemplo?',['Que una predicción basada en un modelo puede comprobarse luego con evidencia experimental','Que los modelos de moléculas no necesitan ninguna comprobación experimental','Que los rayos X refutaron la idea de los puentes de hidrógeno en las proteínas','Que las proteínas no tienen estructura y se mueven al azar en las células']);
// Isomería
I('isomeria','prop','N3','Un grupo tiene dos líquidos con fórmula C₃H₈O: propan-1-ol y propan-2-ol. Quiere distinguirlos con un experimento sencillo.','¿Qué procedimiento es adecuado?',['Oxidarlos con dicromato y probar el producto con Tollens: solo el del alcohol primario da espejo de plata','Medir la masa molar de cada uno, porque los dos isómeros tienen masas distintas','Contar los átomos de oxígeno de cada fórmula molecular para ver cuál tiene más','Agregar agua a los dos y ver cuál se mezcla, porque solo uno de ellos es soluble']);
I('isomeria','prop','N2','Puntos de ebullición de tres isómeros C₆H₁₄: hexano 69 °C; 3-metilpentano 63 °C; 2,2-dimetilbutano 50 °C.','¿Qué conclusión es coherente con los datos?',['A más ramificación, menor contacto entre moléculas y menor punto de ebullición','A más ramificación, mayor masa molar y mayor punto de ebullición','La ramificación no influye, porque los tres tienen la misma fórmula','El hexano hierve más alto porque tiene más átomos de carbono que los otros']);
I('isomeria','prop','N4','Un estudiante predice que el ácido maleico (cis) y el ácido fumárico (trans) tienen puntos de fusión distintos. Consulta: maleico 135 °C; fumárico 287 °C.','¿Qué se puede decir de su predicción?',['Los datos la apoyan: la forma geométrica cambia el punto de fusión','Los datos la refutan: los dos son ácidos y deberían fundir igual','No se puede evaluar, porque los isómeros cis/trans son la misma sustancia','Los datos la apoyan solo si el isómero cis fundiera a mayor temperatura']);
// Reacciones
I('reacciones','rx','N4','Una estudiante predice que la combustión del etanol produce agua. Pone un vaso frío boca abajo sobre la llama y ve que se empaña con gotas.','¿Qué se puede decir de su predicción?',['La observación la apoya: el vapor de agua de la combustión se condensó en el vaso','La observación la refuta: las gotas vienen del aire y no de la combustión','No se puede evaluar, porque la combustión solo produce dióxido de carbono','La observación la apoya solo si las gotas fueran de etanol sin quemar']);
I('reacciones','rx','N1','La síntesis de la urea por Wöhler en 1828, a partir de una sal inorgánica, contradijo la idea de que los compuestos orgánicos solo podían formarse en los seres vivos.','¿Qué muestra este hecho sobre la ciencia?',['Que un experimento bien hecho puede cambiar una idea aceptada durante mucho tiempo','Que las ideas aceptadas por muchos científicos nunca deben cuestionarse','Que la urea es un compuesto inorgánico y por eso se pudo sintetizar','Que los compuestos orgánicos solo se forman dentro de los seres vivos']);
})();

/* ── Indagación con tablas y gráficas (13-11-2026) ──────────────────────
   Preguntas de indagación que traen sus datos en una tabla ('tabla') o en
   una gráfica ('graf'), como en la prueba Saber 11 (ver saber-icfes.js:
   se dibujan solas en la evaluación y en el juego). La primera opción es
   la correcta; opciones del mismo largo y forma; fórmulas sin paréntesis. */
(function(){var S=window.DOCENTE_DATOS&&window.DOCENTE_DATOS.SABER;if(!S)return;
function T(t,a,af,ctx,q,o,d){var x={a:a,c:'ind',af:af,k:'Q',ctx:ctx,q:q,o:o};for(var z in d)x[z]=d[z];(S[t]=S[t]||[]).push(x);}
T("alcanos","prop","N4","Una estudiante consultó el punto de ebullición de los ocho primeros alcanos de cadena lineal, del metano al octano.","¿Qué relación muestra la gráfica y cómo se explica?",["Aumenta con el número de carbonos porque crecen las fuerzas de London", "Disminuye con el número de carbonos porque la cadena se rompe más fácil", "Aumenta porque los alcanos largos forman puentes de hidrógeno", "No cambia porque todos los alcanos son apolares"],{"graf": {"tipo": "lin", "x": ["1", "2", "3", "4", "5", "6", "7", "8"], "y": [-162, -89, -42, 0, 36, 69, 98, 126], "ymin": -200, "ex": "Número de carbonos", "ey": "Punto de ebullición (°C)"}});
T("isomeria","prop","N4","Un grupo comparó los puntos de ebullición de tres alcoholes que tienen la misma fórmula molecular, C₄H₁₀O, pero distinta ramificación.","¿Qué relación hay entre la ramificación y el punto de ebullición?",["A más ramificación, menor punto de ebullición, porque hay menos contacto entre moléculas", "A más ramificación, mayor punto de ebullición, porque hay más enlaces", "La ramificación no influye porque la fórmula molecular es igual", "A más ramificación, menor masa molar y por eso hierve a menor temperatura"],{"tabla": [["Alcohol", "Ramificación", "Punto de ebullición (°C)"], ["1-butanol", "Ninguna", "118"], ["2-butanol", "Una", "99"], ["2-metil-2-propanol", "Dos", "83"]]});
T("alcoholes","prop","N4","Un grupo midió cuánto se disuelve de cada alcohol de cadena lineal en 100 mL de agua a 20 °C.","¿Cómo se explica la disminución de la solubilidad?",["La parte apolar crece y pesa más que el grupo OH, que forma puentes de hidrógeno", "El grupo OH desaparece de la molécula cuando la cadena crece más", "Los alcoholes grandes son menos polares porque tienen menos oxígeno que los pequeños", "Los alcoholes grandes reaccionan con el agua y se descomponen al mezclarse"],{"tabla": [["Alcohol", "Carbonos", "Solubilidad (g/100 mL)"], ["Metanol", "1", "Total"], ["1-propanol", "3", "Total"], ["1-butanol", "4", "7,4"], ["1-pentanol", "5", "2,2"], ["1-hexanol", "6", "0,6"]]});
T("alquenos","rx","N2","Un grupo agitó tres líquidos incoloros con agua de bromo, que es de color naranja, y registró el color final. Los líquidos eran ciclohexeno, ciclohexano y hexano.","¿Qué conclusión es válida con estos resultados?",["Solo la muestra 1 tiene dobles enlaces entre carbonos", "Las tres muestras tienen dobles enlaces, porque cambiaron de color", "Las muestras 2 y 3 tienen dobles enlaces, porque no reaccionaron", "No se puede concluir nada sin conocer la masa de cada muestra"],{"tabla": [["Muestra", "Color tras agitar con agua de bromo"], ["1", "Incoloro"], ["2", "Naranja"], ["3", "Naranja"]]});
T("acidos","prop","N4","Un estudiante consultó el pKa de cuatro ácidos carboxílicos. Cuanto menor es el pKa, más fuerte es el ácido.","¿Qué efecto tienen los átomos de cloro sobre la acidez?",["La aumentan: a más cloros, menor pKa y ácido más fuerte", "La disminuyen: a más cloros, mayor pKa y ácido más débil", "No la cambian, porque el grupo ácido es el mismo", "La aumentan solo si el cloro está lejos del grupo ácido"],{"tabla": [["Ácido", "Cloros", "pKa"], ["Acético", "0", "4,76"], ["Cloroacético", "1", "2,87"], ["Dicloroacético", "2", "1,29"], ["Tricloroacético", "3", "0,66"]]});
T("haluros","rx","N4","Se compararon las velocidades relativas con que cuatro bromuros de alquilo reaccionan con un mismo nucleófilo en una sustitución de un solo paso.","¿Qué tendencia muestran los datos?",["Cuanto más ramificado el carbono unido al bromo, más lenta la reacción", "Cuanto más ramificado el carbono unido al bromo, más rápida la reacción", "La rapidez no depende de la estructura del bromuro", "La reacción es más rápida con el bromuro de menor masa molar"],{"tabla": [["Bromuro", "Rapidez relativa"], ["Bromometano", "1 000"], ["Bromoetano", "40"], ["2-bromopropano", "1"], ["2-bromo-2-metilpropano", "menor que 0,01"]]});
T("aromaticos","rx","N4","Un grupo comparó con qué rapidez reaccionan distintos compuestos aromáticos en una nitración. El benceno se tomó como referencia.","¿Qué efecto tiene el grupo metilo sobre el anillo?",["Lo activa: el metilbenceno reacciona más rápido que el benceno", "Lo desactiva: el metilbenceno reacciona más lento que el benceno", "No tiene efecto: la rapidez es igual a la del benceno", "Detiene la reacción por completo"],{"tabla": [["Compuesto", "Rapidez relativa"], ["Benceno", "1"], ["Metilbenceno", "25"], ["Clorobenceno", "0,03"], ["Nitrobenceno", "0,00000006"]]});
T("carbonilos","rx","N2","Una estudiante probó tres compuestos carbonílicos con el reactivo de Tollens y con el de Fehling.","¿Qué se puede concluir?",["La muestra 1 es un aldehído; las muestras 2 y 3 no lo son", "Las tres son aldehídos porque tienen grupo carbonilo", "La muestra 1 es una cetona porque forma precipitado", "No se concluye nada porque las dos pruebas dan lo mismo en todas"],{"tabla": [["Muestra", "Reactivo de Tollens", "Reactivo de Fehling"], ["1", "Espejo de plata", "Precipitado rojo"], ["2", "Sin cambio", "Sin cambio"], ["3", "Sin cambio", "Sin cambio"]]});
T("nitrogenados","prop","N4","Un estudiante consultó el pKb de cuatro bases nitrogenadas. Cuanto menor es el pKb, más fuerte es la base.","¿Qué muestran los datos sobre la anilina?",["Es la base más débil, porque el par de electrones del N se comparte con el anillo", "Es la base más fuerte, porque tiene un anillo aromático unido al nitrógeno", "Es tan básica como la metilamina, porque las dos tienen nitrógeno en su estructura", "No es una base, porque su valor de pKb es mayor que el del amoníaco"],{"tabla": [["Compuesto", "pKb"], ["Amoníaco", "4,75"], ["Metilamina", "3,36"], ["Dimetilamina", "3,27"], ["Anilina", "9,37"]]});
T("reacciones","rx","N4","Se siguió la esterificación del ácido acético con etanol, en dos montajes iguales: uno con unas gotas de ácido sulfúrico y otro sin él.","¿Qué papel cumple el ácido sulfúrico según la gráfica?",["Acelera la reacción: con él se llega antes a un mayor rendimiento", "Es un reactivo que se consume y por eso sube el rendimiento", "No tiene efecto: las dos curvas suben", "Detiene la reacción cuando llega a 67 %"],{"graf": {"tipo": "lin", "x": ["0", "10", "20", "30", "40", "50"], "series": [{"n": "Con ácido", "y": [0, 20, 40, 55, 65, 67]}, {"n": "Sin ácido", "y": [0, 5, 10, 15, 19, 22]}], "ex": "Tiempo (min)", "ey": "Rendimiento (%)"}});
})();

/* ── Explicaciones propias (13-11-2026): para el Juego y la clave. La clave del mapa es el inicio del enunciado. ── */
(function(){var D=window.DOCENTE_DATOS;if(!D||!D.SABER)return;var E={"¿Qué relación muestra la gráfica y cómo se explica?": "El punto de ebullición sube de −162 °C (metano) a 126 °C (octano). Las cadenas más largas tienen más superficie de contacto y fuerzas de London más intensas. Los alcanos son apolares y no forman puentes de hidrógeno.", "¿Qué relación hay entre la ramificación y el punto de ebullición?": "Los tres alcoholes tienen la misma fórmula, así que la diferencia viene de la forma: 118, 99 y 83 °C. Cuantas más ramas, más compacta la molécula, menos contacto entre ellas y fuerzas de London más débiles.", "¿Cómo se explica la disminución de la solubilidad?": "Hasta 3 carbonos los alcoholes se disuelven totalmente; desde 4 la solubilidad baja (7,4; 2,2; 0,6 g). El grupo OH forma puentes de hidrógeno con el agua, pero la cadena apolar crece y termina dominando. El OH sigue estando en la molécula.", "¿Qué conclusión es válida con estos resultados?": "El agua de bromo se decolora cuando el Br₂ se adiciona a un doble enlace: solo la muestra 1 (ciclohexeno) cambió. Las muestras 2 y 3, saturadas, no reaccionaron y conservan el color naranja.", "¿Qué efecto tienen los átomos de cloro sobre la acidez?": "A más cloros, menor pKa: 4,76; 2,87; 1,29; 0,66. Los cloros atraen electrones y estabilizan el ion carboxilato, así que el ácido cede su H⁺ con más facilidad.", "¿Qué tendencia muestran los datos?": "La rapidez baja de 1 000 en el bromometano a menos de 0,01 en el bromuro más ramificado. Las ramas estorban el ataque del nucleófilo al carbono unido al bromo (impedimento espacial).", "¿Qué efecto tiene el grupo metilo sobre el anillo?": "El metilbenceno reacciona 25 veces más rápido que el benceno: el metilo cede electrones y activa el anillo. El cloro y el grupo nitro lo desactivan (0,03 y casi cero).", "¿Qué se puede concluir?": "Solo la muestra 1 forma espejo de plata y precipitado rojo, que son las pruebas de los aldehídos. Las cetonas también tienen carbonilo pero no reaccionan, así que tener carbonilo no basta para ser aldehído.", "¿Qué muestran los datos sobre la anilina?": "Menor pKb significa base más fuerte: la dimetilamina (3,27) es la más fuerte y la anilina (9,37) la más débil. En la anilina el par de electrones del nitrógeno se reparte con el anillo y queda menos disponible para aceptar H⁺.", "¿Qué papel cumple el ácido sulfúrico según la gráfica?": "Con ácido sulfúrico se llega a 67 % en 50 minutos; sin él, solo a 22 %. El ácido es un catalizador: acelera la reacción y no se consume. La curva no se detiene en 67 %: es el último dato medido."};
function r(q){var k;if(!q.tabla&&!q.graf)return;for(k in E){if(q.q&&q.q.indexOf(k)===0){q.exp=E[k];return;}}}
var S=D.SABER;if(Array.isArray(S))S.forEach(r);else for(var t in S)S[t].forEach(r);})();
