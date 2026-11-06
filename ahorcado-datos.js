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
]
];

/* Marca del sitio para las hojas impresas (Ahorcado y Sopa de letras):
   mismo logo, marca de agua y pie que los crucigramas y laberintos. */
window.HOJA_SITIO={logo:'logo-chromanom.png',marca:'icons/marca-agua.png',nombre:'ChromaNom',pie:'<span class="m">Chroma<b>Nom</b> · Nomenclatura orgánica</span><span>© 2026 Harvey Barcenas Morales · Licencia CC BY-NC 4.0</span>'};
