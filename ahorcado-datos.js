/* ═════════════════════════════════════════════════════════════════════
   ahorcado-datos.js — banco del Ahorcado con 3 pistas de ChromaNom.
   Lo usan el Juego (juego.html) y la pestaña «Ahorcado» del generador
   docente (docente.html, ahorcado.js).
   [palabra, grupo, pista 1 (general), pista 2, pista 3 (la más reveladora)]
   Palabras clave de las páginas del sitio; las pistas usan solo lo que allí
   se explica y ninguna fórmula lleva paréntesis. Las tildes no cuentan al
   adivinar (la A descubre también la Á; la Ñ es una letra aparte).
   ═════════════════════════════════════════════════════════════════════ */
window.AHORCADO_SITIO='ChromaNom';
window.AHORCADO_GRUPOS=[["carbono", "⚛️ Fase 1 · El carbono", ["carbono"]], ["nombres", "🏷️ Fase 2 · Nomenclatura", ["nombres"]], ["fase3", "🔬 Fase 3 · Isomería y reacciones", ["fase3"]], ["fase4a", "🌈 Fase 4 · Orbitales y propiedades", ["fase4a"]], ["bio", "🧬 Fase 4 · Biomoléculas", ["bio"]], ["amb", "🌎 Fase 4 · Ambiente", ["amb"]]];
/* Tema del generador de guías y talleres → grupo de palabras e historias
   (para las actividades dentro de los talleres: ACT_TALLER, extras.js). */
window.ACT_TEMA_GRUPO={carbono:'carbono',tipos_carbono:'carbono',cadenas:'carbono',cadena:'nombres',alcanos:'nombres',alquenos:'nombres',aromaticos:'nombres',haluros:'nombres',alcoholes:'nombres',carbonilos:'nombres',acidos:'nombres',nitrogenados:'nombres',polifuncionales:'nombres',isomeria:'fase3',reacciones:'fase3',orbitales:'fase4a',propiedades:'fase4a',biomoleculas:'bio',ambiente:'amb'};
window.BANCO_AHORCADO=[
[
"TETRAVALENCIA",
"carbono",
"Propiedad del carbono de formar siempre 4 enlaces.",
"Es uno de los dos «superpoderes» del carbono.",
"Se debe a sus 4 electrones de valencia."
],
[
"CONCATENACIÓN",
"carbono",
"Capacidad del carbono de unirse a otros carbonos.",
"Así forma cadenas y anillos muy largos y estables.",
"El otro «superpoder» del carbono, junto a la tetravalencia."
],
[
"HIBRIDACIÓN",
"carbono",
"Mezcla de orbitales de distinta forma y energía.",
"Da orbitales nuevos e iguales entre sí.",
"Puede ser sp³, sp² o sp."
],
[
"PROMOCIÓN",
"carbono",
"Un electrón del carbono pasa del 2s al 2p.",
"Así quedan 4 electrones desapareados.",
"Es el paso anterior a la hibridación."
],
[
"TETRAÉDRICA",
"carbono",
"Geometría del carbono sp³.",
"Sus ángulos son de 109,5°.",
"Es la geometría del metano, CH₄."
],
[
"TRIGONAL",
"carbono",
"Geometría «___ plana» del carbono sp².",
"Sus ángulos son de 120°.",
"Es la geometría de los carbonos del eteno."
],
[
"LINEAL",
"carbono",
"Geometría del carbono sp.",
"Su ángulo es de 180°.",
"Es la geometría del etino."
],
[
"SIGMA",
"carbono",
"Enlace en el que los orbitales se solapan de frente.",
"Todo enlace sencillo es de este tipo.",
"Se escribe con la letra griega σ."
],
[
"GRAFITO",
"carbono",
"Forma del carbono puro, blanda y negra.",
"Está en la mina del lápiz.",
"Su «hermano» duro y transparente es el diamante."
],
[
"DIAMANTE",
"carbono",
"Forma del carbono puro, dura y transparente.",
"Puede ir en un anillo de compromiso.",
"Su «hermano» blando y negro es el grafito."
],
[
"PRIMARIO",
"carbono",
"Carbono unido a un solo carbono.",
"En un alcano se escribe CH₃−.",
"Está en los extremos de la cadena y en las ramas metilo."
],
[
"SECUNDARIO",
"carbono",
"Carbono unido a 2 carbonos.",
"En un alcano se escribe −CH₂−.",
"Todos los carbonos del ciclohexano son de este tipo."
],
[
"TERCIARIO",
"carbono",
"Carbono unido a 3 carbonos.",
"Aparece donde sale una ramificación.",
"En un alcano lleva un solo hidrógeno."
],
[
"CUATERNARIO",
"carbono",
"Carbono unido a 4 carbonos.",
"No tiene hidrógenos.",
"Es el carbono central del 2,2-dimetilpropano."
],
[
"ISOOCTANO",
"carbono",
"Molécula con la que se mide el octanaje.",
"Es muy ramificada y tiene un carbono cuaternario.",
"Está en la gasolina."
],
[
"RAMIFICADA",
"carbono",
"Cadena de la que sale otra cadena.",
"Tiene un carbono terciario o cuaternario.",
"Lo contrario de lineal."
],
[
"HETEROGÉNEA",
"carbono",
"Cadena con un O, N o S entre carbonos.",
"La del metoximetano es así.",
"Lo contrario de homogénea."
],
[
"HETEROÁTOMO",
"carbono",
"Átomo distinto del carbono y del hidrógeno.",
"Puede ser O, N, S o un halógeno.",
"Si está entre carbonos, la cadena es heterogénea."
],
[
"SATURADA",
"carbono",
"Cadena con solo enlaces sencillos.",
"La del propano es así.",
"Lo contrario de insaturada."
],
[
"AROMÁTICO",
"carbono",
"Anillo tipo benceno.",
"Tiene 6 carbonos sp² con dobles enlaces alternados.",
"Se dibuja con un círculo dentro del hexágono."
],
[
"ALCANO",
"nombres",
"Hidrocarburo con solo enlaces sencillos.",
"Fórmula general CₙH₂ₙ₊₂.",
"Su sufijo es -ano."
],
[
"ALQUENO",
"nombres",
"Hidrocarburo con un doble enlace.",
"Su sufijo es -eno.",
"El eteno es el más sencillo."
],
[
"ALQUINO",
"nombres",
"Hidrocarburo con un triple enlace.",
"Su sufijo es -ino.",
"El etino es el más sencillo."
],
[
"CICLOALCANO",
"nombres",
"Alcano de cadena cerrada.",
"Fórmula general CₙH₂ₙ.",
"El ciclohexano es uno."
],
[
"BENCENO",
"nombres",
"Anillo aromático de 6 carbonos.",
"Su fórmula es C₆H₆.",
"Sus seis enlaces C−C miden lo mismo."
],
[
"TOLUENO",
"nombres",
"Nombre común aceptado del metilbenceno.",
"Es un benceno con un grupo −CH₃.",
"Es aromático y se usa como disolvente."
],
[
"FENOL",
"nombres",
"Benceno con un grupo −OH.",
"Se nombra así y no «hidroxibenceno».",
"Nombre común aceptado por IUPAC."
],
[
"ORTO",
"nombres",
"Posiciones 1,2 en el anillo de benceno.",
"Se abrevia o-.",
"Meta es 1,3 y para es 1,4."
],
[
"LOCALIZADOR",
"nombres",
"Número que indica en qué carbono está un grupo.",
"Se eligen los más bajos posibles.",
"En el but-2-eno es el 2."
],
[
"ALCOHOL",
"nombres",
"Compuesto con un grupo −OH.",
"Su sufijo es -ol.",
"El etanol es uno."
],
[
"ALDEHÍDO",
"nombres",
"Grupo −CHO en el extremo de la cadena.",
"Su sufijo es -al.",
"El metanal es el más sencillo."
],
[
"CETONA",
"nombres",
"Grupo C=O dentro de la cadena.",
"Su sufijo es -ona.",
"La propanona del quitaesmalte es una."
],
[
"ÉSTER",
"nombres",
"Grupo −COO− entre dos cadenas.",
"Se nombra «___oato de ___ilo».",
"Se forma con un ácido y un alcohol."
],
[
"AMINA",
"nombres",
"Derivado orgánico del amoníaco.",
"Tiene un grupo −NH₂.",
"Su sufijo es -amina."
],
[
"AMIDA",
"nombres",
"Tiene el grupo −CO−NH₂.",
"Su sufijo es -amida.",
"Este enlace une a los aminoácidos en las proteínas."
],
[
"ÉTER",
"nombres",
"Un oxígeno entre dos cadenas de carbono.",
"El metoximetano es uno.",
"Es isómero de función de los alcoholes."
],
[
"NITRILO",
"nombres",
"Tiene el grupo −C≡N.",
"Su sufijo es -nitrilo.",
"Tiene un triple enlace carbono–nitrógeno."
],
[
"HALURO",
"nombres",
"Compuesto con un halógeno unido a un carbono.",
"El clorometano es uno.",
"___ de alquilo."
],
[
"CARBOXÍLICO",
"nombres",
"Ácido con el grupo −COOH.",
"Se nombra «ácido ___oico».",
"El ácido etanoico del vinagre es un ácido ___."
],
[
"ISÓMERO",
"fase3",
"Tiene la misma fórmula molecular que otro compuesto, pero otra estructura.",
"El butano y el 2-metilpropano lo son.",
"Tienen nombres IUPAC distintos."
],
[
"QUIRAL",
"fase3",
"Carbono unido a cuatro grupos distintos.",
"Se marca con un asterisco: C*.",
"Como las manos: su imagen en el espejo no se superpone."
],
[
"ENANTIÓMERO",
"fase3",
"Molécula que es la imagen en el espejo de otra.",
"Aparecen por un carbono quiral.",
"El ácido láctico tiene dos."
],
[
"TRANS",
"fase3",
"Grupos en lados opuestos del doble enlace.",
"Equivale a E en la notación IUPAC.",
"Grasas ___: cadena casi recta y sólida."
],
[
"ADICIÓN",
"fase3",
"Dos moléculas se unen en una y desaparece un doble enlace.",
"Eteno + bromo → 1,2-dibromoetano.",
"Es la reacción típica de los alquenos."
],
[
"SUSTITUCIÓN",
"fase3",
"Un átomo o grupo sale y otro entra en su lugar.",
"No cambia el número de dobles enlaces.",
"Es la reacción típica del benceno."
],
[
"ELIMINACIÓN",
"fase3",
"Sale H₂O o HX y se forma un doble enlace.",
"Es lo contrario de la adición.",
"Etanol → eteno + agua."
],
[
"HIDRÓLISIS",
"fase3",
"El agua parte una molécula en dos.",
"Es lo contrario de la condensación.",
"Es típica de los ésteres y las amidas."
],
[
"CONDENSACIÓN",
"fase3",
"Dos moléculas se unen y sale agua.",
"Así se forman los ésteres.",
"Es lo contrario de la hidrólisis."
],
[
"POLIMERIZACIÓN",
"fase3",
"Muchos monómeros se unen en una cadena larga.",
"En la ecuación aparece la letra n.",
"Cloruro de vinilo → PVC."
],
[
"ESTERIFICACIÓN",
"fase3",
"Ácido + alcohol → éster + agua.",
"Es una condensación.",
"Ácido etanoico + etanol → etanoato de etilo."
],
[
"SAPONIFICACIÓN",
"fase3",
"Hidrólisis de una grasa con NaOH.",
"Produce glicerol y jabón.",
"Grasa + 3 NaOH → glicerol + 3 moléculas de jabón."
],
[
"COMBUSTIÓN",
"fase3",
"Oxidación completa de un compuesto orgánico.",
"Produce CO₂ y H₂O.",
"Quemar el gas propano es una."
],
[
"REDUCCIÓN",
"fase3",
"El carbono gana H o pierde enlaces con O.",
"La provocan el H₂ o el NaBH₄.",
"Propanona → propan-2-ol."
],
[
"ANTIENLAZANTE",
"fase4a",
"Orbital molecular con un nodo entre los núcleos.",
"Se marca con un asterisco.",
"Sube la energía y separa los átomos."
],
[
"ENLAZANTE",
"fase4a",
"Orbital molecular con electrones entre los núcleos.",
"Baja la energía y une los átomos.",
"Las ondas de los dos átomos se suman."
],
[
"PARAMAGNÉTICO",
"fase4a",
"Que es atraído por un imán.",
"Tiene electrones desapareados.",
"El oxígeno líquido lo es."
],
[
"RESONANCIA",
"fase4a",
"Energía extra de estabilidad del benceno.",
"Vale unos 152 kJ/mol.",
"360 − 208 kJ/mol."
],
[
"HÜCKEL",
"fase4a",
"Regla de los 4n + 2 electrones π.",
"Decide si un anillo es aromático.",
"Regla de ___."
],
[
"CONJUGACIÓN",
"fase4a",
"Dobles enlaces alternados con enlaces sencillos.",
"Con más, la molécula absorbe luz de mayor longitud de onda.",
"Por ella la zanahoria es naranja."
],
[
"CAROTENO",
"fase4a",
"Pigmento naranja de la zanahoria: β-___.",
"Tiene 11 dobles enlaces conjugados.",
"También está en la ahuyama y el mango."
],
[
"CLOROFILA",
"fase4a",
"Pigmento de las hojas.",
"Absorbe la luz roja y la azul.",
"Por eso las hojas se ven verdes."
],
[
"INTERMOLECULAR",
"fase4a",
"Fuerza que actúa entre moléculas.",
"Se vence cuando un líquido hierve.",
"Lo contrario de intramolecular."
],
[
"LONDON",
"fase4a",
"Fuerzas de dispersión.",
"Las tienen todas las moléculas.",
"Crecen con el número de electrones y con la superficie."
],
[
"PUENTE DE HIDRÓGENO",
"fase4a",
"La más fuerte de las tres fuerzas intermoleculares.",
"Necesita un O−H o un N−H.",
"Explica por qué el agua hierve tan alto."
],
[
"MICELA",
"fase4a",
"Gota de grasa envuelta por moléculas de jabón.",
"Las colas apolares quedan adentro.",
"Las cabezas −COO⁻ miran hacia el agua."
],
[
"MISCIBLE",
"fase4a",
"Que se mezcla con el agua en cualquier proporción.",
"El metanol, el etanol y el propan-1-ol lo son.",
"Desde el butan-1-ol ya no lo es."
],
[
"APOLAR",
"fase4a",
"Molécula sin extremos con carga parcial.",
"Los hidrocarburos lo son.",
"El CCl₄ también, aunque sus enlaces son polares."
],
[
"ALDOSA",
"bio",
"Monosacárido con un grupo aldehído.",
"La glucosa es una.",
"Lo contrario de cetosa."
],
[
"CETOSA",
"bio",
"Monosacárido con un grupo cetona.",
"La fructosa es una.",
"Su carbonilo está en el C2."
],
[
"FISCHER",
"bio",
"Proyección del azúcar con la cadena vertical.",
"Los −OH van a la derecha o a la izquierda.",
"El −OH del penúltimo carbono decide si es D o L."
],
[
"HAWORTH",
"bio",
"Proyección del azúcar cerrado en anillo.",
"Lo que estaba a la derecha en Fischer queda abajo.",
"Se dibuja como un polígono visto de lado."
],
[
"PIRANOSA",
"bio",
"Anillo de 6 átomos de un azúcar.",
"Tiene 5 C y 1 O.",
"La glucosa forma una."
],
[
"FURANOSA",
"bio",
"Anillo de 5 átomos de un azúcar.",
"Tiene 4 C y 1 O.",
"La fructosa forma una."
],
[
"ANÓMERO",
"bio",
"Cada una de las dos formas α y β de un azúcar en anillo.",
"Difieren en el −OH del carbono que era el carbonilo.",
"Almidón α y celulosa β."
],
[
"CELULOSA",
"bio",
"Polisacárido de β-glucosas.",
"Forma el papel y las paredes de las plantas.",
"No la podemos digerir."
],
[
"ALMIDÓN",
"bio",
"Polisacárido de α-glucosas.",
"Está en la papa, el arroz y la yuca.",
"Sí lo podemos digerir."
],
[
"OMEGA",
"bio",
"Numeración de los dobles enlaces desde el extremo CH₃.",
"El ácido linoleico es ___-6.",
"Letra griega ω."
],
[
"TRIGLICÉRIDO",
"bio",
"Triéster de glicerol y tres ácidos grasos.",
"Es una grasa o un aceite.",
"Con NaOH produce jabón."
],
[
"PEPTÍDICO",
"bio",
"Enlace −CO−NH− entre dos aminoácidos.",
"Se forma con salida de agua.",
"Enlace ___."
],
[
"AMINOÁCIDO",
"bio",
"Unidad que forma las proteínas.",
"Tiene un −NH₂ y un −COOH.",
"Hay 20 tipos."
],
[
"CODÓN",
"bio",
"Trío de bases del ARNm.",
"AUG es el de inicio.",
"Cada uno corresponde a un aminoácido."
],
[
"ANTICODÓN",
"bio",
"Trío de bases del ARNt.",
"Es complementario del codón.",
"Para el codón GCU es CGA."
],
[
"RIBOSOMA",
"bio",
"Lee el ARNm y forma los enlaces peptídicos.",
"Tiene un sitio P y un sitio A.",
"Es la «fábrica» de proteínas."
],
[
"URACILO",
"bio",
"Base del ARN que reemplaza a la timina.",
"Se aparea con la adenina.",
"Se abrevia U."
],
[
"ANTIPARALELAS",
"bio",
"Así son las dos hebras del ADN.",
"Una va de 5′ a 3′ y la otra de 3′ a 5′.",
"Forman la doble hélice."
],
[
"SEMICONSERVATIVA",
"bio",
"Así es la replicación del ADN.",
"Cada molécula hija tiene una hebra vieja y una nueva.",
"Replicación ___."
],
[
"DESNATURALIZACIÓN",
"bio",
"La proteína pierde su forma.",
"Pasa al freír la clara del huevo.",
"En el ceviche la produce el limón."
],
[
"ENZIMA",
"bio",
"Proteína que cataliza las reacciones del metabolismo.",
"Tiene un sitio activo.",
"El calor excesivo o un pH extremo la dañan."
],
[
"BIOMAGNIFICACIÓN",
"amb",
"La concentración de un contaminante aumenta en la cadena alimentaria.",
"Le pasa al DDT.",
"Plancton → peces → aves."
],
[
"MICROPLÁSTICO",
"amb",
"Trozo de plástico de menos de 5 mm.",
"Sale de bolsas que el sol y el roce parten.",
"Llega a los ríos y al mar."
],
[
"OZONO",
"amb",
"Gas de la estratosfera que filtra la radiación UV.",
"Lo destruyen los CFC.",
"O₃."
],
[
"INVERNADERO",
"amb",
"Efecto por el que el CO₂ calienta la superficie.",
"El CO₂ absorbe el infrarrojo y lo reemite.",
"Efecto ___."
],
[
"BIODIÉSEL",
"amb",
"Combustible que se obtiene del aceite de palma.",
"Se fabrica por transesterificación con metanol.",
"Se mezcla con el diésel."
],
[
"REFINERÍA",
"amb",
"Allí se destila el petróleo.",
"Separa el crudo por puntos de ebullición.",
"Colombia tiene una en Barrancabermeja y otra en Cartagena."
],
[
"MONÓXIDO DE CARBONO",
"amb",
"Gas que sale de la combustión incompleta.",
"No tiene olor ni color.",
"Su fórmula es CO."
],
[
"CRUDO",
"amb",
"Petróleo tal como sale del pozo.",
"Se calienta y entra por abajo de la torre de destilación.",
"Las refinerías lo separan en fracciones."
],
[
"ESQUELETO",
"carbono",
"Fórmula que dibuja la cadena en zigzag sin escribir los C ni los H.",
"Cada vértice y cada extremo es un carbono.",
"Fórmula de ___."
],
[
"ABIERTA",
"carbono",
"Cadena que tiene dos extremos.",
"También se llama acíclica.",
"Lo contrario de cerrada."
],
[
"ALICÍCLICO",
"carbono",
"Anillo solo de carbonos que no es aromático.",
"El ciclohexano es uno.",
"Puede ser saturado o insaturado."
],
[
"ZIGZAG",
"carbono",
"Forma real de las cadenas de los alcanos.",
"Se debe a los 109,5° del carbono sp³.",
"Doblar así la cadena no crea ramas."
],
[
"METILO",
"nombres",
"Rama de un solo carbono.",
"Se escribe −CH₃.",
"En el 2-metilpropano hay uno."
],
[
"PREFIJO",
"nombres",
"Parte del nombre que indica cuántos carbonos tiene la cadena.",
"Met-, et-, prop-, but-…",
"Para cinco carbonos es pent-."
],
[
"SUFIJO",
"nombres",
"Terminación del nombre que indica el grupo funcional.",
"-ol en los alcoholes y -ona en las cetonas.",
"En el etanol es -ol."
],
[
"PARA",
"nombres",
"Posiciones 1,4 en el anillo de benceno.",
"Se abrevia p-.",
"Orto es 1,2 y meta es 1,3."
],
[
"META",
"nombres",
"Posiciones 1,3 en el anillo de benceno.",
"Se abrevia m-.",
"Está entre orto y para."
],
[
"XILENO",
"nombres",
"Nombre común de los dimetilbencenos.",
"Es un benceno con dos grupos metilo.",
"En el p-___ los metilos están en 1,4."
],
[
"ANILINA",
"nombres",
"Benceno con un grupo −NH₂.",
"Es una amina aromática.",
"Nombre común aceptado por IUPAC."
],
[
"CIS",
"fase3",
"Grupos del mismo lado del doble enlace.",
"Equivale a Z en la notación IUPAC.",
"Lo contrario de trans."
],
[
"POSICIÓN",
"fase3",
"Tipo de isomería del propan-1-ol y el propan-2-ol.",
"El mismo grupo está en otro carbono.",
"Isomería de ___."
],
[
"FUNCIÓN",
"fase3",
"Tipo de isomería del etanol y el metoximetano.",
"Los grupos funcionales son distintos.",
"Isomería de ___."
],
[
"CADENA",
"fase3",
"Tipo de isomería del butano y el 2-metilpropano.",
"Cambia la cadena principal.",
"Isomería de ___."
],
[
"GEOMÉTRICA",
"fase3",
"Otro nombre de la isomería cis/trans.",
"Se debe a un doble enlace que no gira.",
"Isomería ___."
],
[
"OXIDACIÓN",
"fase3",
"El carbono gana enlaces con O o pierde H.",
"La provocan el KMnO₄ y el CrO₃.",
"Lo contrario de la reducción."
],
[
"HIDROGENACIÓN",
"fase3",
"Adición de H₂ al doble enlace de un alqueno.",
"Es una adición y también una reducción.",
"Usa un catalizador de níquel."
],
[
"MONÓMERO",
"fase3",
"Molécula pequeña que se repite en un polímero.",
"El cloruro de vinilo lo es para el PVC.",
"Muchos se unen en la polimerización."
],
[
"ELECTRÓFILO",
"fase3",
"Reactivo que busca electrones.",
"El H⁺ del HBr es uno.",
"Ataca la nube π de los alquenos."
],
[
"RADICAL",
"fase3",
"Átomo con un electrón sin aparear.",
"Se forma en una ruptura homolítica.",
"El Cl· que destruye el ozono es uno."
],
[
"NODO",
"fase4a",
"Zona sin electrones entre los dos núcleos.",
"La tiene el orbital antienlazante.",
"Por eso los núcleos se repelen."
],
[
"PIRIDINA",
"fase4a",
"Anillo aromático de 5 C y 1 N.",
"Tiene 6 electrones π.",
"Es heterocíclica."
],
[
"NAFTALENO",
"fase4a",
"Dos anillos de benceno fusionados.",
"Tiene 10 electrones π.",
"Está en las bolas de naftalina."
],
[
"LICOPENO",
"fase4a",
"Pigmento rojo del tomate.",
"Tiene 11 dobles enlaces conjugados.",
"También está en la guayaba y la sandía."
],
[
"CURCUMINA",
"fase4a",
"Pigmento amarillo de la cúrcuma.",
"La cúrcuma se cultiva en el Huila y el Meta.",
"Da el color amarillo a muchos alimentos."
],
[
"DIPOLO",
"fase4a",
"Molécula con un extremo δ+ y otro δ−.",
"Las cetonas y los aldehídos lo son.",
"Fuerza ___-dipolo."
],
[
"SOLUBILIDAD",
"fase4a",
"Cantidad de una sustancia que se disuelve en otra.",
"La de los alcoholes cae desde los 4 carbonos.",
"Semejante disuelve a semejante."
],
[
"EBULLICIÓN",
"fase4a",
"Paso de líquido a vapor cuando el líquido hierve.",
"Sube con las fuerzas intermoleculares.",
"Punto de ___."
],
[
"AROMATICIDAD",
"fase4a",
"Estabilidad especial de anillos como el benceno.",
"Se reconoce con la regla de Hückel.",
"Necesita 4n + 2 electrones π."
],
[
"ERROR",
"fase4a",
"Diferencia entre una medida y el valor de referencia.",
"Se expresa en porcentaje.",
"Porcentaje de ___."
],
[
"GLUCOSA",
"bio",
"Aldohexosa, el combustible de las células.",
"Forma el almidón, la celulosa y el glucógeno.",
"Su anillo es una piranosa."
],
[
"SACAROSA",
"bio",
"Disacárido de glucosa y fructosa.",
"La enzima del modelo la hidroliza.",
"Es el azúcar de mesa."
],
[
"GLICEROL",
"bio",
"Alcohol que forma los triglicéridos.",
"Sale junto al jabón en la saponificación.",
"Se une a tres ácidos grasos."
],
[
"COMBUSTIBLE",
"amb",
"Sustancia que se quema para obtener energía.",
"El gas natural, la gasolina y el diésel lo son.",
"___ fósil."
],
[
"GASOLINA",
"amb",
"Fracción del petróleo de 5 a 10 carbonos.",
"Se modela como octano.",
"Un galón produce unos 8,6 kg de CO₂."
],
[
"DIÉSEL",
"amb",
"Fracción del petróleo de 14 a 20 carbonos.",
"En Colombia también se llama ACPM.",
"Se mezcla con biodiésel."
],
[
"QUEROSENO",
"amb",
"Fracción del petróleo que usan los aviones.",
"Tiene de 10 a 16 carbonos.",
"Sale entre 180 y 260 °C."
],
[
"ASFALTO",
"amb",
"Residuo que queda al fondo de la torre de destilación.",
"Es la fracción más pesada del petróleo.",
"Sus moléculas son las más largas."
],
[
"METANO",
"amb",
"Gas natural, CH₄.",
"Emite menos CO₂ por megajulio que la gasolina.",
"Si se escapa sin quemar, es un potente gas de efecto invernadero."
],
[
"PROPANO",
"amb",
"Gas de la pipeta, C₃H₈.",
"C₃H₈ + 5 O₂ → 3 CO₂ + 4 H₂O.",
"Es un alcano de tres carbonos."
],
[
"POLIETILENO",
"amb",
"Plástico de las bolsas.",
"Se forma por adición del eteno.",
"Casi no se biodegrada."
],
[
"PVC",
"amb",
"Plástico de los tubos y los cables.",
"Se fabrica con cloruro de vinilo.",
"Policloruro de vinilo."
],
[
"PET",
"amb",
"Plástico de las botellas de gaseosa y de agua.",
"Es un poliéster: se forma por condensación.",
"Lleva el número 1 en el triángulo de reciclaje."
],
[
"NAILON",
"amb",
"Poliamida de las cuerdas y las medias.",
"Se forma por condensación.",
"Sus enlaces se pueden hidrolizar lentamente."
],
[
"CFC",
"amb",
"Gases de neveras y aerosoles que destruyen el ozono.",
"El CCl₂F₂ es uno.",
"Los prohibió el Protocolo de Montreal."
],
[
"DDT",
"amb",
"Plaguicida organoclorado muy apolar.",
"Se acumula en la grasa de los animales.",
"Su concentración aumenta en la cadena alimentaria."
],
[
"ETANOL",
"amb",
"Biocombustible que se obtiene de la caña de azúcar.",
"Se produce por fermentación y destilación.",
"Se mezcla con la gasolina."
],
[
"RECICLAJE",
"amb",
"Volver a usar los materiales de un residuo.",
"El PET y el PEAD son los que más se recuperan.",
"Separar en la fuente lo facilita."
],
[
"MONTREAL",
"amb",
"Ciudad del protocolo que prohibió los CFC.",
"El protocolo se firmó en 1987.",
"Protocolo de ___."
]
];

/* Marca del sitio para las hojas impresas (Ahorcado y Sopa de letras):
   mismo logo, marca de agua y pie que los crucigramas y laberintos. */
window.HOJA_SITIO={logo:'logo-chromanom.png',marca:'icons/marca-agua.png',nombre:'ChromaNom',pie:'<span class="m">Chroma<b>Nom</b> · Nomenclatura orgánica</span><span>© 2026 Harvey Barcenas Morales · Licencia CC BY-NC 4.0</span>'};

/* Historias del «Detective químico» (extras.js): [grupo, título, partes].
   Cada parte es texto fijo o [versión correcta, versión con error]; cada hoja
   elige al azar cuáles puntos dudosos salen con error. Basadas en lo que
   explican las páginas del sitio. */
window.DETECTIVE=[
[
"carbono",
"Un sábado repasando el carbono",
[
"Valentina abrió su cuaderno para repasar el átomo de carbono antes del examen.",
[
"El carbono tiene 4 electrones de valencia y por eso forma siempre 4 enlaces covalentes.",
"El carbono tiene 6 electrones de valencia y por eso forma siempre 6 enlaces covalentes."
],
"Su profesor le mostró la mina de un lápiz y un anillo con un diamante.",
[
"Le explicó que los dos son carbono puro y que lo único que cambia es cómo están unidos sus átomos.",
"Le explicó que el grafito y el diamante son elementos diferentes, aunque los dos contengan carbono."
],
"Luego armaron con bolitas una molécula de metano, CH₄.",
[
"El carbono del metano es sp³ y sus cuatro enlaces apuntan a las esquinas de un tetraedro, a 109,5°.",
"El carbono del metano es sp² y sus cuatro enlaces quedan en un mismo plano, a 120°."
],
"Después construyeron el eteno, CH₂=CH₂.",
[
"Valentina contó 5 enlaces σ y 1 enlace π.",
"Valentina contó 4 enlaces σ y 2 enlaces π."
],
[
"También notó que el doble enlace no puede girar, porque se rompería el enlace π.",
"También notó que el doble enlace gira libremente, igual que un enlace sencillo."
],
"Para terminar, dibujaron el butano en zigzag.",
[
"Valentina explicó que el zigzag no crea ramas: el butano sigue siendo una cadena lineal.",
"Valentina explicó que el zigzag convierte al butano en una cadena ramificada."
],
[
"Al clasificar sus carbonos encontró dos primarios en los extremos y dos secundarios en el medio.",
"Al clasificar sus carbonos encontró cuatro secundarios, porque todos tienen hidrógenos."
],
[
"En el ciclohexano, en cambio, todos los carbonos resultaron secundarios.",
"En el ciclohexano, en cambio, todos los carbonos resultaron primarios."
],
"Valentina cerró el cuaderno, lista para el examen."
]
],
[
"carbono",
"El carbono en la cocina de la abuela",
[
"Martín ayudaba a su abuela en la cocina y se puso a pensar en el carbono.",
[
"El gas de la estufa es metano, un alcano: todos sus enlaces son sencillos.",
"El gas de la estufa es metano, un alqueno: tiene un doble enlace."
],
[
"El carbono puede unirse con otros carbonos y formar cadenas muy largas: esa propiedad se llama concatenación.",
"El carbono puede unirse con otros carbonos y formar cadenas muy largas: esa propiedad se llama tetravalencia."
],
"En la alacena encontró un frasco de vinagre y una botella de alcohol.",
[
"Los dos son compuestos orgánicos, porque sus moléculas tienen cadenas de carbono e hidrógeno.",
"Los dos son compuestos inorgánicos, porque se compran en la tienda y no salen de un ser vivo."
],
[
"La abuela encendió la estufa con un fósforo; en el triple enlace del etino de un soplete habría un enlace σ y dos π.",
"La abuela encendió la estufa con un fósforo; en el triple enlace del etino de un soplete habría tres enlaces σ."
],
[
"Los carbonos del etino son sp y su molécula es lineal, a 180°.",
"Los carbonos del etino son sp³ y su molécula es un tetraedro, a 109,5°."
],
"Martín dibujó luego el 2,2-dimetilpropano.",
[
"Su carbono central es cuaternario, porque está unido a otros cuatro carbonos.",
"Su carbono central es terciario, porque está unido a otros cuatro carbonos."
],
[
"Una cadena que tiene un átomo de oxígeno entre sus carbonos es heterogénea.",
"Una cadena que tiene un átomo de oxígeno entre sus carbonos es homogénea."
],
[
"El ciclohexano es una cadena cerrada y saturada.",
"El ciclohexano es una cadena abierta e insaturada."
],
"La abuela le dijo que, para ser cocinero, sabía mucha química."
]
],
[
"carbono",
"El concurso de modelos moleculares",
[
"El colegio organizó un concurso de modelos moleculares con plastilina y palillos.",
[
"El equipo de Paula usó palillos rectos para los enlaces sencillos, que pueden girar.",
"El equipo de Paula usó palillos rectos para los enlaces sencillos, que no pueden girar."
],
[
"En el eteno, los carbonos son sp² y sus enlaces quedan en un plano, a 120°.",
"En el eteno, los carbonos son sp³ y sus enlaces quedan en un plano, a 120°."
],
[
"El doble enlace del eteno está formado por un enlace σ y un enlace π.",
"El doble enlace del eteno está formado por dos enlaces π."
],
"Otro equipo armó el benceno.",
[
"El benceno es un anillo de seis carbonos con electrones π deslocalizados: es aromático.",
"El benceno es un anillo de seis carbonos con todos sus enlaces sencillos: es alicíclico."
],
"El jurado pidió clasificar los carbonos del 2-metilbutano.",
[
"El carbono 2 es terciario, porque está unido a otros tres carbonos.",
"El carbono 2 es secundario, porque está unido a otros tres carbonos."
],
[
"La cadena del 2-metilbutano es abierta y ramificada.",
"La cadena del 2-metilbutano es cerrada y lineal."
],
"Para terminar, cada equipo explicó cómo se dibujan las moléculas y por qué el carbono forma cuatro enlaces.",
[
"En la fórmula de esqueleto, cada vértice del zigzag es un carbono y los H no se dibujan.",
"En la fórmula de esqueleto, cada vértice del zigzag es un hidrógeno y los C no se dibujan."
],
[
"Al final explicaron que el carbono forma 4 enlaces porque su configuración es 1s² 2s² 2p².",
"Al final explicaron que el carbono forma 4 enlaces porque su configuración es 1s² 2s² 2p⁴."
],
"El modelo del benceno ganó el primer puesto."
]
],
[
"nombres",
"Las etiquetas borrosas",
[
"En la bodega del laboratorio, Andrés encontró varios frascos con las etiquetas borrosas.",
[
"En el primero leyó «etanol», un alcohol: su grupo −OH le da el sufijo -ol.",
"En el primero leyó «etanol», un aldehído: su grupo −OH le da el sufijo -ol."
],
[
"El segundo decía «propanona», la acetona del quitaesmalte, que es una cetona.",
"El segundo decía «propanona», la acetona del quitaesmalte, que es un aldehído."
],
"Luego revisó los frascos de hidrocarburos.",
[
"El tercero era un alqueno, porque su nombre terminaba en -eno.",
"El tercero era un alquino, porque su nombre terminaba en -eno."
],
[
"En otro frasco estaba el metilbenceno, que también se llama tolueno.",
"En otro frasco estaba el metilbenceno, que también se llama fenol."
],
"Andrés quiso escribir el nombre de un benceno con dos grupos metilo.",
[
"Como estaban en las posiciones 1 y 4, escribió «1,4-dimetilbenceno», es decir, para-dimetilbenceno.",
"Como estaban en las posiciones 1 y 4, escribió «1,4-dimetilbenceno», es decir, orto-dimetilbenceno."
],
[
"Para un benceno con un cloro y un metilo escribió «1-cloro-2-metilbenceno», en orden alfabético.",
"Para un benceno con un cloro y un metilo escribió «1-metil-2-clorobenceno», en orden alfabético."
],
"Quedaban dos frascos de compuestos con oxígeno.",
[
"El último frasco olía a vinagre: era ácido etanoico, con el grupo −COOH.",
"El último frasco olía a vinagre: era ácido etanoico, con el grupo −CHO."
],
[
"Andrés recordó que un éster se nombra «___oato de ___ilo», como el etanoato de etilo.",
"Andrés recordó que un éster se nombra «___ilo de ___oato», como el etilo de etanoato."
],
"Con las etiquetas nuevas, la bodega quedó en orden."
]
],
[
"nombres",
"El taller de nomenclatura",
[
"El profesor Jorge entregó un taller de nomenclatura y pidió revisar las respuestas de Camilo.",
[
"Para nombrar un alcano, Camilo buscó primero la cadena de carbonos más larga.",
"Para nombrar un alcano, Camilo buscó primero la rama más larga."
],
[
"Numeró la cadena desde el extremo más cercano a la primera rama.",
"Numeró la cadena siempre desde el extremo izquierdo, sin mirar las ramas."
],
[
"Para dos grupos metilo en los carbonos 2 y 3 escribió «2,3-dimetilbutano».",
"Para dos grupos metilo en los carbonos 2 y 3 escribió «2,3-metilbutano»."
],
"En la segunda parte del taller, Camilo trabajó con los prefijos y los dobles enlaces.",
[
"Una cadena de cinco carbonos lleva el prefijo pent-.",
"Una cadena de cinco carbonos lleva el prefijo hex-."
],
[
"En un alqueno, la cadena principal debe contener el doble enlace.",
"En un alqueno, el doble enlace puede quedar fuera de la cadena principal."
],
[
"Al but-1-eno le dio al doble enlace el número más bajo posible.",
"Al but-1-eno le dio al doble enlace el número más alto posible."
],
"La última parte era de grupos funcionales.",
[
"Para el CH₃−CH₂−CHO escribió «propanal», porque los aldehídos terminan en -al.",
"Para el CH₃−CH₂−CHO escribió «propanona», porque los aldehídos terminan en -ona."
],
[
"Para el CH₃−NH₂ escribió «metilamina», una amina.",
"Para el CH₃−NH₂ escribió «metanamida», una amida."
],
"El profesor le puso la mejor nota del curso."
]
],
[
"nombres",
"La tienda de cosméticos",
[
"Isabela leyó las etiquetas de los productos de una tienda de cosméticos.",
[
"El quitaesmalte tenía acetona, cuyo nombre IUPAC es propanona.",
"El quitaesmalte tenía acetona, cuyo nombre IUPAC es propanal."
],
[
"Un perfume tenía un éster, el grupo que da los olores a fruta.",
"Un perfume tenía un éter, el grupo que da los olores a fruta."
],
[
"El alcohol antiséptico era etanol, con el grupo −OH.",
"El alcohol antiséptico era etanol, con el grupo −COOH."
],
"En una crema leyó la palabra «fenol».",
[
"El fenol es un benceno con un grupo −OH.",
"El fenol es un benceno con un grupo −NH₂."
],
[
"La anilina, en cambio, es un benceno con un grupo −NH₂.",
"La anilina, en cambio, es un benceno con un grupo −CH₃."
],
"Luego repasó dónde va el oxígeno en otros grupos funcionales.",
[
"En un éter, el oxígeno está entre dos grupos de carbono, como en el metoximetano.",
"En un éter, el oxígeno está al final de la cadena, como en el metanol."
],
[
"Las cetonas tienen el grupo C=O en un carbono del medio de la cadena.",
"Las cetonas tienen el grupo C=O siempre en el carbono 1 de la cadena."
],
[
"Un ácido carboxílico se nombra con la palabra «ácido» y el sufijo -oico.",
"Un ácido carboxílico se nombra con la palabra «ácido» y el sufijo -ona."
],
"Isabela descubrió que en la tienda hay más química que en su cuaderno."
]
],
[
"fase3",
"La clase de isómeros y reacciones",
[
"La profesora Marta escribió C₄H₁₀ en el tablero y pidió dibujar todos sus isómeros.",
[
"Sara dibujó el butano y el 2-metilpropano: dos isómeros de cadena.",
"Sara dibujó el butano y el 2-metilpropano: dos isómeros de función."
],
[
"Tomás dibujó el butano en forma de U y dijo que era el mismo compuesto, solo que doblado.",
"Tomás dibujó el butano en forma de U y dijo que era un tercer isómero."
],
"Luego pasaron al but-2-eno.",
[
"En el cis-but-2-eno, los dos CH₃ quedan del mismo lado del doble enlace.",
"En el cis-but-2-eno, los dos CH₃ quedan en lados opuestos del doble enlace."
],
[
"El propeno, en cambio, no tiene isomería cis/trans, porque su primer carbono tiene dos H.",
"El propeno también tiene isomería cis/trans, igual que el but-2-eno."
],
[
"El C2 del butan-2-ol es quiral, porque está unido a cuatro grupos distintos.",
"El C2 del butan-2-ol no es quiral, porque está unido a dos carbonos."
],
"Después la profesora mostró tres reacciones.",
[
"Eteno con bromo formó 1,2-dibromoetano: fue una adición.",
"Eteno con bromo formó 1,2-dibromoetano: fue una sustitución."
],
[
"El etanol, calentado con ácido, formó eteno y agua: fue una eliminación.",
"El etanol, calentado con ácido, formó eteno y agua: fue una adición."
],
[
"El ácido etanoico con etanol formó etanoato de etilo y agua: fue una condensación.",
"El ácido etanoico con etanol formó etanoato de etilo y agua: fue una hidrólisis."
],
"Todos salieron sabiendo reconocer el tipo de cada reacción."
]
],
[
"fase3",
"Los isómeros del perfume",
[
"En el laboratorio, Natalia comparó dos sustancias con la misma fórmula, C₂H₆O.",
[
"Una era el etanol y la otra el metoximetano: isómeros de función.",
"Una era el etanol y la otra el metoximetano: isómeros de cadena."
],
[
"Los isómeros tienen la misma fórmula molecular, pero distinta estructura.",
"Los isómeros tienen distinta fórmula molecular, pero la misma estructura."
],
[
"El propan-1-ol y el propan-2-ol son isómeros de posición.",
"El propan-1-ol y el propan-2-ol son el mismo compuesto, escrito de otra forma."
],
"Luego miraron los isómeros que se deben al doble enlace.",
[
"El trans-but-2-eno tiene sus dos CH₃ en lados opuestos del doble enlace.",
"El trans-but-2-eno tiene sus dos CH₃ del mismo lado del doble enlace."
],
"Después la profesora habló de las moléculas que son como las manos.",
[
"Dos enantiómeros son imágenes de espejo que no se pueden superponer.",
"Dos enantiómeros son moléculas idénticas que se pueden superponer."
],
[
"Un carbono quiral está unido a cuatro grupos distintos.",
"Un carbono quiral está unido a cuatro grupos iguales."
],
"Al final compararon algunas propiedades de los isómeros.",
[
"El ciclohexano no tiene isomería cis/trans en sus carbonos sin sustituyentes.",
"El ciclohexano tiene isomería cis/trans en todos sus carbonos, aunque no tengan sustituyentes."
],
[
"El butano y el 2-metilpropano tienen distintos puntos de ebullición, aunque tengan la misma fórmula.",
"El butano y el 2-metilpropano tienen el mismo punto de ebullición, porque tienen la misma fórmula."
],
"Natalia concluyó que la forma de una molécula importa tanto como sus átomos."
]
],
[
"fase3",
"La fábrica de plásticos",
[
"En una feria de ciencias, Esteban explicó cómo se fabrican los plásticos.",
[
"El polietileno se forma por adición de muchas moléculas de eteno.",
"El polietileno se forma por eliminación de muchas moléculas de eteno."
],
[
"Cada molécula pequeña que se repite en un polímero se llama monómero.",
"Cada molécula pequeña que se repite en un polímero se llama isómero."
],
[
"El PET de las botellas se forma por condensación, con salida de agua.",
"El PET de las botellas se forma por adición, sin perder ninguna molécula."
],
"Luego habló de las reacciones de los alquenos.",
[
"Al agregar H₂ al eteno con un catalizador de níquel se obtiene etano: una hidrogenación.",
"Al agregar H₂ al eteno con un catalizador de níquel se obtiene etino: una hidrogenación."
],
[
"El H⁺ del HBr es un electrófilo: busca los electrones de la nube π.",
"El H⁺ del HBr es un nucleófilo: busca los electrones de la nube π."
],
"Después explicó cómo se rompen los enlaces en otras reacciones.",
[
"En una ruptura homolítica, cada átomo se queda con un electrón y se forman radicales.",
"En una ruptura homolítica, un átomo se queda con los dos electrones y se forman iones."
],
[
"El metano reacciona con cloro bajo la luz por sustitución: un H se cambia por un Cl.",
"El metano reacciona con cloro bajo la luz por adición, porque tiene un doble enlace."
],
[
"Oxidar un alcohol primario con KMnO₄ da primero un aldehído y luego un ácido carboxílico.",
"Oxidar un alcohol primario con KMnO₄ da primero una cetona y luego un éter."
],
"Su stand fue el más visitado de la feria."
]
],
[
"fase4a",
"La química del almuerzo",
[
"Mientras cocinaba, Daniel se puso a pensar en la química de su almuerzo.",
[
"Cuando el agua hierve no se rompen los enlaces O−H: solo se vencen las atracciones entre moléculas.",
"Cuando el agua hierve se rompen los enlaces O−H y quedan átomos sueltos de hidrógeno y oxígeno."
],
[
"Las moléculas de agua se atraen con puentes de hidrógeno, la más fuerte de las tres fuerzas intermoleculares.",
"Las moléculas de agua se atraen con fuerzas de London, la más fuerte de las tres fuerzas intermoleculares."
],
"Al lado, el aceite de la sartén no se mezclaba con el agua.",
[
"El aceite es apolar y el agua es polar: semejante disuelve a semejante.",
"El aceite es polar y el agua es apolar: por eso no se mezclan."
],
[
"El alcohol antiséptico, en cambio, se evapora rápido de la piel porque sus moléculas se atraen menos.",
"El alcohol antiséptico, en cambio, se evapora rápido de la piel porque sus moléculas se atraen más."
],
"Luego picó una zanahoria.",
[
"Su color naranja viene del β-caroteno, que tiene 11 dobles enlaces conjugados.",
"Su color naranja viene del β-caroteno, que tiene un solo doble enlace."
],
[
"Con más dobles enlaces conjugados, la molécula absorbe luz de mayor longitud de onda.",
"Con más dobles enlaces conjugados, la molécula absorbe luz de menor longitud de onda."
],
[
"Las hojas de cilantro se ven verdes porque la clorofila absorbe la luz roja y la azul.",
"Las hojas de cilantro se ven verdes porque la clorofila absorbe la luz verde."
],
"Por último, lavó la sartén.",
[
"Al lavar la sartén, el jabón metió sus colas apolares en la grasa y dejó las cabezas iónicas hacia el agua.",
"Al lavar la sartén, el jabón metió sus cabezas iónicas en la grasa y dejó las colas hacia el agua."
],
"Daniel terminó de almorzar convencido de que la cocina es un laboratorio."
]
],
[
"fase4a",
"Las luces del laboratorio",
[
"Juliana preparó una exposición sobre los colores y las moléculas.",
[
"El licopeno del tomate es rojo porque tiene muchos dobles enlaces conjugados.",
"El licopeno del tomate es rojo porque no tiene ningún doble enlace."
],
[
"La curcumina de la cúrcuma es un pigmento amarillo.",
"La curcumina de la cúrcuma es un pigmento azul."
],
[
"Un objeto se ve del color que no absorbe, es decir, del que refleja.",
"Un objeto se ve del mismo color que absorbe."
],
"Luego explicó los orbitales moleculares del H₂.",
[
"El orbital enlazante concentra los electrones entre los dos núcleos.",
"El orbital antienlazante concentra los electrones entre los dos núcleos."
],
[
"El orbital antienlazante tiene un nodo: una zona sin electrones entre los núcleos.",
"El orbital enlazante tiene un nodo: una zona sin electrones entre los núcleos."
],
"Al final habló de la aromaticidad.",
[
"El benceno cumple la regla de Hückel porque tiene 6 electrones π: 4n + 2 con n = 1.",
"El benceno cumple la regla de Hückel porque tiene 8 electrones π: 4n + 2 con n = 2."
],
[
"El naftaleno tiene dos anillos fusionados y 10 electrones π.",
"El naftaleno tiene un solo anillo y 4 electrones π."
],
[
"La piridina es un anillo aromático con un átomo de nitrógeno: es heterocíclica.",
"La piridina es un anillo aromático solo de carbonos: es homocíclica."
],
"Sus compañeros aplaudieron la exposición."
]
],
[
"fase4a",
"La competencia de puntos de ebullición",
[
"El profesor organizó una competencia: predecir cuál sustancia hierve primero.",
[
"El butano hierve a menor temperatura que el butan-1-ol, porque no forma puentes de hidrógeno.",
"El butano hierve a mayor temperatura que el butan-1-ol, porque no forma puentes de hidrógeno."
],
[
"Entre los alcanos, el que tiene la cadena más larga hierve a mayor temperatura.",
"Entre los alcanos, el que tiene la cadena más larga hierve a menor temperatura."
],
"En la segunda ronda compararon la forma y la polaridad de las moléculas.",
[
"Una cadena ramificada hierve a menor temperatura que su isómero lineal, porque tiene menos superficie de contacto.",
"Una cadena ramificada hierve a mayor temperatura que su isómero lineal, porque tiene menos superficie de contacto."
],
[
"La propanona tiene un dipolo en su grupo C=O, y por eso hierve más alto que el butano.",
"La propanona es apolar, y por eso hierve más alto que el butano."
],
"Luego pasaron a la solubilidad en agua.",
[
"El metanol y el etanol se mezclan con el agua en cualquier proporción.",
"El metanol y el etanol no se mezclan con el agua, porque son orgánicos."
],
[
"La solubilidad de los alcoholes en agua disminuye cuando la cadena de carbonos crece.",
"La solubilidad de los alcoholes en agua aumenta cuando la cadena de carbonos crece."
],
"Para terminar, repasaron las fuerzas entre moléculas y revisaron sus medidas.",
[
"Las fuerzas de London aumentan con el tamaño de la molécula.",
"Las fuerzas de London disminuyen con el tamaño de la molécula."
],
[
"Al comparar su medida con el valor de la tabla, calcularon el porcentaje de error.",
"Al comparar su medida con el valor de la tabla, calcularon el rendimiento de la reacción."
],
"El grupo de Manuela ganó la competencia."
]
],
[
"bio",
"Un desayuno con biomoléculas",
[
"Laura desayunó arepa, huevo frito, aguacate y jugo de naranja.",
[
"El almidón de la arepa está hecho de α-glucosas, y por eso lo podemos digerir.",
"El almidón de la arepa está hecho de β-glucosas, igual que la celulosa del papel."
],
[
"La glucosa es una aldohexosa: tiene un aldehído y seis carbonos.",
"La glucosa es una cetopentosa: tiene una cetona y cinco carbonos."
],
[
"La fructosa de la naranja es una cetosa y forma un anillo de cinco átomos.",
"La fructosa de la naranja es una aldosa y forma un anillo de seis átomos."
],
"Después pensó en las grasas y en las proteínas de su plato.",
[
"El aguacate tiene ácido oleico, cuyo doble enlace cis dobla la cadena y lo hace líquido.",
"El aguacate tiene ácido oleico, cuya cadena recta lo hace sólido a temperatura ambiente."
],
[
"Al freír el huevo, la clara se puso blanca: la proteína perdió su forma, pero sus enlaces peptídicos no se rompieron.",
"Al freír el huevo, la clara se puso blanca porque se rompieron todos sus enlaces peptídicos."
],
"En la tarde, Laura estudió cómo sus células fabrican proteínas.",
[
"Primero el ADN se copia en ARN mensajero, que usa uracilo en lugar de timina.",
"Primero el ADN se copia en ARN mensajero, que usa timina, igual que el ADN."
],
[
"Luego el ribosoma lee el ARNm de tres en tres bases, empezando por el codón AUG.",
"Luego el ribosoma lee el ARNm de tres en tres bases, empezando por el codón UAA."
],
[
"Cada ARNt trae un aminoácido y tiene un anticodón complementario del codón.",
"Cada ARNt trae un aminoácido y tiene un anticodón idéntico al codón."
],
"Laura entendió que su desayuno terminaría siendo parte de su cuerpo."
]
],
[
"bio",
"La clase de nutrición",
[
"La nutricionista del colegio dio una charla sobre biomoléculas.",
[
"La sacarosa del azúcar de mesa es un disacárido de glucosa y fructosa.",
"La sacarosa del azúcar de mesa es un disacárido de dos glucosas."
],
[
"La celulosa está formada por β-glucosas y no la podemos digerir.",
"La celulosa está formada por α-glucosas y la digerimos igual que el almidón."
],
[
"El glucógeno es la forma en que los animales guardan la glucosa.",
"El glucógeno es la forma en que las plantas guardan la glucosa."
],
"Luego habló de las grasas.",
[
"Un triglicérido es un triéster de glicerol y tres ácidos grasos.",
"Un triglicérido es un triéster de etanol y tres aminoácidos."
],
[
"Las grasas saturadas tienen cadenas sin dobles enlaces y suelen ser sólidas.",
"Las grasas saturadas tienen muchos dobles enlaces y suelen ser líquidas."
],
[
"El ácido linoleico es un omega-6: su primer doble enlace está en el carbono 6 contado desde el extremo CH₃.",
"El ácido linoleico es un omega-6: tiene seis dobles enlaces."
],
"Al final explicó las proteínas.",
[
"Las proteínas están formadas por aminoácidos unidos por enlaces peptídicos.",
"Las proteínas están formadas por glucosas unidas por enlaces peptídicos."
],
[
"Las enzimas son proteínas que aceleran las reacciones de las células.",
"Las enzimas son grasas que frenan las reacciones de las células."
],
"Todos salieron pensando en lo que comen."
]
],
[
"bio",
"El jabón artesanal",
[
"Gabriel y su mamá hicieron jabón artesanal con aceite y soda cáustica.",
[
"La reacción entre un triglicérido y el NaOH se llama saponificación.",
"La reacción entre un triglicérido y el NaOH se llama polimerización."
],
[
"Además del jabón, se forma glicerol.",
"Además del jabón, se forma glucosa."
],
[
"La molécula de jabón tiene una cabeza iónica que atrae el agua y una cola apolar.",
"La molécula de jabón tiene una cabeza apolar que atrae el agua y una cola iónica."
],
"Esa noche Gabriel leyó sobre el ADN.",
[
"En el ADN, la adenina se aparea con la timina y la guanina con la citosina.",
"En el ADN, la adenina se aparea con la guanina y la timina con la citosina."
],
[
"Las dos hebras del ADN son antiparalelas: una va de 5′ a 3′ y la otra de 3′ a 5′.",
"Las dos hebras del ADN son paralelas: las dos van de 5′ a 3′."
],
[
"La replicación es semiconservativa: cada ADN hijo tiene una hebra vieja y una nueva.",
"La replicación es conservativa: un ADN hijo tiene las dos hebras viejas y el otro las dos nuevas."
],
"Luego comparó el ADN con el ARN y con las proteínas.",
[
"El ARN usa el azúcar ribosa, y el ADN, la desoxirribosa.",
"El ARN usa el azúcar desoxirribosa, y el ADN, la ribosa."
],
[
"En el ceviche, el limón desnaturaliza las proteínas del pescado.",
"En el ceviche, el limón rompe el ADN del pescado y por eso cambia de color."
],
"El jabón quedó listo en dos semanas."
]
],
[
"amb",
"La salida a la refinería",
[
"El curso visitó la refinería de Barrancabermeja.",
[
"En la torre de destilación, las cadenas largas se condensan abajo y los gases salen por arriba.",
"En la torre de destilación, las cadenas largas salen por arriba y los gases se quedan abajo."
],
[
"El guía explicó que al quemar gasolina sale más masa de CO₂ que de gasolina, porque cada carbono se une al oxígeno del aire.",
"El guía explicó que al quemar gasolina sale menos masa de CO₂ que de gasolina, porque una parte se pierde como humo."
],
[
"También advirtió que el monóxido de carbono no tiene olor ni color.",
"También advirtió que el monóxido de carbono se reconoce fácil por su olor fuerte."
],
"De regreso, vieron una bolsa plástica flotando en el río.",
[
"Una bolsa de polietileno casi no se degrada: los microorganismos casi no tienen enzimas para cortar cadenas de C−C.",
"Una bolsa de polietileno se degrada en pocas semanas, porque los microorganismos cortan fácil sus enlaces C−C."
],
[
"Con el tiempo se parte en microplásticos de menos de 5 mm.",
"Con el tiempo se parte en microplásticos de más de 5 mm."
],
"Al día siguiente, en clase, repasaron otros contaminantes y combustibles.",
[
"En clase recordaron que los CFC destruyen el ozono y que el Protocolo de Montreal los prohibió.",
"En clase recordaron que los CFC protegen el ozono y que el Protocolo de Montreal los promovió."
],
[
"El DDT se acumula en la grasa de los animales porque es apolar.",
"El DDT se elimina fácil con la orina porque es muy polar."
],
[
"Por último compararon el biodiésel de palma, que se obtiene por transesterificación, con el diésel del petróleo.",
"Por último compararon el biodiésel de palma, que se obtiene por fermentación, con el diésel del petróleo."
],
"El curso concluyó que «renovable» no significa «sin impacto»."
]
],
[
"amb",
"El viaje en carro",
[
"La familia de Santiago salió de paseo en carro y él se puso a pensar en el combustible.",
[
"La gasolina es una fracción del petróleo con cadenas de 5 a 10 carbonos.",
"La gasolina es una fracción del petróleo con cadenas de 30 a 40 carbonos."
],
[
"El diésel, que en Colombia también se llama ACPM, tiene cadenas más largas que la gasolina.",
"El diésel, que en Colombia también se llama ACPM, tiene cadenas más cortas que la gasolina."
],
[
"Al quemar el combustible con suficiente oxígeno salen CO₂ y agua: una combustión completa.",
"Al quemar el combustible con suficiente oxígeno sale monóxido de carbono: una combustión completa."
],
"En el camino vieron un letrero de una planta de etanol.",
[
"El etanol de la caña se obtiene por fermentación y luego se destila.",
"El etanol de la caña se obtiene por destilación del petróleo."
],
[
"El queroseno de los aviones sale de la torre entre la gasolina y el diésel.",
"El queroseno de los aviones sale por el fondo de la torre, junto con el asfalto."
],
"Su papá le contó que el carro también podría andar con gas natural.",
[
"El metano emite menos CO₂ por megajulio que la gasolina.",
"El metano emite más CO₂ por megajulio que el carbón."
],
[
"Si el metano se escapa sin quemar, es un potente gas de efecto invernadero.",
"Si el metano se escapa sin quemar, no afecta el clima porque no es CO₂."
],
[
"El CO₂ calienta la superficie porque absorbe la radiación infrarroja y la reemite.",
"El CO₂ calienta la superficie porque destruye la capa de ozono."
],
"Santiago propuso usar más la bicicleta."
]
],
[
"amb",
"La campaña de reciclaje",
[
"El colegio organizó una campaña de reciclaje y Ana María explicó los plásticos.",
[
"Las botellas de gaseosa son de PET, el plástico número 1 del triángulo de reciclaje.",
"Las botellas de gaseosa son de PVC, el plástico número 1 del triángulo de reciclaje."
],
[
"El PVC de los tubos se fabrica con cloruro de vinilo.",
"El PVC de los tubos se fabrica con eteno y agua."
],
"Después explicó cómo se forman algunos de esos plásticos.",
[
"El PET es un poliéster y se forma por condensación.",
"El PET es un alcano y se forma por combustión."
],
[
"El nailon de las cuerdas es una poliamida.",
"El nailon de las cuerdas es un polisacárido."
],
"Luego habló de los contaminantes que viajan por la cadena alimentaria.",
[
"La concentración del DDT aumenta en cada eslabón: plancton, peces y aves.",
"La concentración del DDT disminuye en cada eslabón: plancton, peces y aves."
],
[
"Los CFC de las neveras viejas destruyen el ozono de la estratosfera.",
"Los CFC de las neveras viejas producen ozono en la estratosfera."
],
[
"El ozono filtra la radiación ultravioleta del Sol.",
"El ozono filtra la radiación infrarroja de la Tierra y causa el efecto invernadero."
],
"Al final dio un consejo para la casa.",
[
"Separar los residuos en la fuente facilita el reciclaje.",
"Mezclar todos los residuos en una sola bolsa facilita el reciclaje."
],
"La campaña recogió más de 300 kg de plástico."
]
]
];
