/* Ejemplo completo: clase de IonNom sobre óxidos (bloque de unos 110 minutos o dos clases).
   Sigue los criterios didácticos del docente (ver referencias/guion.md):
   apertura (meta, fenómeno ancla, predicción) → construcción (vocabulario, tres niveles de
   representación, andamiaje por pasos) → práctica guiada (ejemplos resueltos, chequeos cada
   10–15 min, consigna) → cierre (volver al fenómeno, mapa incompleto, ticket de salida).
   Todos los nombres salen del banco de IonNom (skill ionom-formulas).
   node <skill>/referencias/ejemplo.js  → oxidos.pptx */
const path = require('path');
const N = require(path.join(__dirname, '..', 'scripts', 'nom-pptx.js'));
const { M, W } = N;

(async () => {
  const p = N.nueva('ion', { titulo: 'Óxidos', tema: 'Óxidos básicos y ácidos', curso: '10.°' });

  /* ══ 1. APERTURA ══ */
  N.portada(p, { titulo: 'Óxidos básicos y ácidos', subtitulo: 'Cómo se forman, cómo se escriben y cómo se nombran', curso: 'Grado 10.° · Nomenclatura inorgánica' });
  N.objetivo(p, { meta: 'diferenciar óxidos básicos y ácidos, y escribir y nombrar sus fórmulas.',
    criterios: ['Escribir una fórmula cruzando las cargas.', 'Nombrar un óxido en los tres sistemas.', 'Explicar por qué se oxida una reja.'] });

  let s = N.contenido(p, '¿Por qué se pone roja una reja vieja?');
  N.texto(s, ['Reja nueva: gris y brillante.', 'Años después: roja y quebradiza.', 'Nadie la pintó.', '¿Qué cambió en el hierro?'], { x: M, y: 1.7, w: 5.6, h: 4.6 }, { tam: 26 });
  await N.foto(s, 'oxido_hierro', { x: 6.6, y: 1.45, w: 6.13, h: 5.25 }, 'Hierro a la intemperie');
  s.addNotes('Fenómeno ancla. No dar la respuesta todavía: se retoma al final de la clase.');

  N.encuesta(p, { pregunta: '¿Qué le pasó al hierro de la reja?', opciones: [
    'Se ensució con un polvo rojo.', 'Se combinó con algo del aire.', 'Se pudrió, como la madera.', 'Cambió de color, pero sigue siendo hierro.'],
    notas: 'Respuesta esperada al final: B. A, C y D son ideas alternativas frecuentes (suciedad, descomposición biológica, cambio solo físico). Anotar cuántos votan cada una.' });

  N.claves(p, [
    { t: 'Óxido', d: 'Elemento unido al oxígeno (O²⁻).' },
    { t: 'Óxido básico', d: 'Metal + oxígeno. Con agua: base.' },
    { t: 'Anhídrido (óxido ácido)', d: 'No metal + oxígeno. Con agua: ácido.' },
    { t: 'Valencia (EO)', d: 'Carga con que se combina: Fe³⁺ → +3.' },
    { t: 'Catión / anión', d: 'Ion positivo (metal) / ion negativo (O²⁻).' },
    { t: 'Subíndice', d: 'Cuántos átomos: Fe₂O₃ tiene 2 Fe y 3 O.' }]);

  /* ══ 2. CONSTRUCCIÓN CONCEPTUAL ══ */
  N.seccion(p, '1. ¿Qué es un óxido?');
  const sc = N.comparar(p, 'Dos familias de óxidos', {
    titulo: 'Óxido básico', color: 'FCF2DB', items: ['Metal + oxígeno', 'Enlace iónico: hay iones', 'Con agua forma una base', 'Na₂O, CaO, Fe₂O₃, CuO'] }, {
    titulo: 'Anhídrido (óxido ácido)', color: 'DBEBF4', items: ['No metal + oxígeno', 'Enlace covalente: moléculas', 'Con agua forma un ácido', 'CO₂, SO₃, N₂O₅, Cl₂O₇'] });
  N.fichas(sc, [['Fe³⁺', 'cat'], ['O²⁻', 'an'], ['→ Fe₂O₃', 'cat']], { y: 5.25, h: 0.95, tam: 30, centro: M + 2.93 });
  N.fichas(sc, [['C', 'neu'], ['O₂', 'neu'], ['→ CO₂', 'neu']], { y: 5.25, h: 0.95, tam: 30, centro: M + 5.87 + 0.4 + 2.93 });

  await N.johnstone(p, 'Óxido básico en tres niveles: la herrumbre', {
    macro: { foto: 'oxido_hierro', pie: 'Herrumbre rojiza' },
    submicro: { ionico: { cat: { sim: 'Fe', q: 3 }, an: { sim: 'O', q: -2 }, proporcion: [2, 3], leyenda: 'Fe³⁺ y O²⁻ se atraen: red iónica' } },
    simbolico: ['4 Fe + 3 O₂ → 2 Fe₂O₃', 'Fe₂O₃ = óxido férrico', '= la herrumbre de la reja'],
    notas: 'El hierro pierde electrones (Fe³⁺) y el oxígeno los gana (O²⁻); los iones se atraen y forman una red. La herrumbre real es óxido de hierro (III) hidratado: la humedad acelera la reacción.' });
  await N.johnstone(p, 'Anhídrido en tres niveles: el CO₂', {
    macro: { foto: 'hielo_seco', pie: 'Hielo seco: CO₂ sólido' },
    submicro: { molecula: { atomos: [{ sim: 'O', x: 0, y: 0.5 }, { sim: 'C', x: 0.5, y: 0.5 }, { sim: 'O', x: 1, y: 0.5 }], enlaces: [[0, 1, 2], [1, 2, 2]], copias: 3, leyenda: 'O=C=O: moléculas, no iones' } },
    simbolico: ['C + O₂ → CO₂', 'CO₂ = anhídrido carbónico', '= dióxido de carbono'],
    notas: 'Carbono y oxígeno son no metales: comparten electrones (dos dobles enlaces) y forman moléculas sueltas, no una red de iones. Por eso el CO₂ es un gas y el Fe₂O₃ un sólido.' });

  s = N.contenido(p, 'Así se forman los óxidos');
  N.tabla(s, [['Reacción', 'Producto', 'Tipo'],
    ['4 Fe + 3 O₂ → 2 Fe₂O₃', 'herrumbre', 'óxido básico'], ['2 Ca + O₂ → 2 CaO', 'cal viva', 'óxido básico'],
    ['4 Al + 3 O₂ → 2 Al₂O₃', 'capa protectora del aluminio', 'óxido básico'], ['C + O₂ → CO₂', 'gas de la combustión', 'anhídrido'],
    ['S + O₂ → SO₂', 'gas de volcanes y carbón', 'anhídrido']], { x: M, y: 1.6, w: W - 2 * M, h: 4.6 }, { tam: 24, colW: [5.0, 4.4, 2.73] });
  s.addNotes('Las ecuaciones están balanceadas: contar los átomos de cada lado con el curso. Paz del Río (Boyacá) extrae hematita, Fe₂O₃; en el altiplano se usa cal viva, CaO, en corrales y cultivos.');

  s = N.contenido(p, 'Antes de escribir: la valencia del metal');
  N.tabla(s, [['Una sola valencia', 'Ion', 'Dos valencias', 'Menor (-oso)', 'Mayor (-ico)'],
    ['Litio, sodio, potasio, plata', 'Li⁺ Na⁺ K⁺ Ag⁺', 'Cobre', 'Cu⁺ cuproso', 'Cu²⁺ cúprico'],
    ['Magnesio, calcio, bario, zinc', 'Mg²⁺ Ca²⁺ Ba²⁺ Zn²⁺', 'Hierro', 'Fe²⁺ ferroso', 'Fe³⁺ férrico'],
    ['Aluminio', 'Al³⁺', 'Níquel, cobalto', 'Ni²⁺, Co²⁺', 'Ni³⁺, Co³⁺'],
    ['', '', 'Estaño, plomo', 'Sn²⁺ estannoso, Pb²⁺ plumboso', 'Sn⁴⁺ estánnico, Pb⁴⁺ plúmbico'],
    ['', '', 'Oro', 'Au⁺ auroso', 'Au³⁺ áurico']], { x: M, y: 1.55, w: W - 2 * M, h: 3.95 }, { tam: 19, colW: [2.9, 2.4, 1.9, 2.45, 2.48] });
  N.tarjeta(s, { cuerpo: 'En los óxidos, el oxígeno siempre actúa con −2.', x: M, y: 5.7, w: W - 2 * M, h: 0.75, color: 'DBEBF4' });

  /* ══ Formular: andamiaje paso a paso ══ */
  N.seccion(p, '2. Escribir la fórmula: el cruce de cargas');
  N.pasos(p, 'Cómo escribir la fórmula de un óxido', [
    { t: 'Escribe el elemento con su valencia', d: 'Tabla de valencias o número romano.', ej: 'Fe³⁺' },
    { t: 'Escribe el anión óxido', d: 'Siempre O²⁻.', ej: 'Fe³⁺   O²⁻' },
    { t: 'Cruza las cargas', d: 'Cada carga baja como subíndice del otro.', ej: 'Fe₂O₃' },
    { t: 'Simplifica y comprueba', d: 'Si ambos son pares, divide. Suma = 0.', ej: '2 × (+3) + 3 × (−2) = 0 ✔' }], { progresivo: true });
  N.cruce(p, { titulo: 'Óxido básico: la herrumbre', cat: { sim: 'Fe', q: 3 }, an: { sim: 'O', q: -2 }, nombre: 'óxido férrico: la herrumbre de la reja' });
  N.cruce(p, { titulo: 'Óxido básico: metal con valencia +1', cat: { sim: 'Na', q: 1 }, an: { sim: 'O', q: -2 }, nombre: 'óxido de sodio' });
  N.cruce(p, { titulo: 'Si los dos subíndices son pares, se simplifica', cat: { sim: 'Ca', q: 2 }, an: { sim: 'O', q: -2 }, nombre: 'óxido de calcio: la cal viva' });
  N.cruce(p, { titulo: 'Otra simplificación: el óxido plúmbico', cat: { sim: 'Pb', q: 4 }, an: { sim: 'O', q: -2 }, nombre: 'óxido plúmbico' });
  N.cruce(p, { titulo: 'Anhídrido: C⁴⁺ y O²⁻ dan CO₂, no C₂O₄', cat: { sim: 'C', q: 4, tipo: 'neu' }, an: { sim: 'O', q: -2 }, nombre: 'anhídrido carbónico',
    notas: 'En los anhídridos no hay iones de verdad: el +4 es el estado de oxidación del carbono. Se cruza igual que en los óxidos básicos y se simplifica: C₂O₄ ÷ 2 = CO₂.' });
  N.cruce(p, { titulo: 'Anhídrido: azufre con valencia +6', cat: { sim: 'S', q: 6, tipo: 'neu' }, an: { sim: 'O', q: -2 }, nombre: 'anhídrido sulfúrico' });
  N.chequeo(p, { titulo: 'Chequeo 1', pregunta: '¿Cuál es la fórmula del óxido de cobre (I)?', opciones: ['Cu₂O', 'CuO', 'CuO₂', 'Cu₂O₂'], correcta: 0,
    porque: ['Correcto: Cu⁺ y O²⁻ cruzados dan Cu₂O.', 'Esa es la del cobre +2: óxido de cobre (II).', 'El cobre quedaría con +4: no es su valencia.', 'No está simplificada y no es Cu⁺.'] });

  /* ══ Nombrar: un sistema por diapositiva, cada uno con su ejemplo resuelto ══ */
  N.seccion(p, '3. Nombrar: los tres sistemas');
  s = N.contenido(p, 'Sistema tradicional');
  N.texto(s, ['Una valencia: «óxido de» + metal.', 'Dos valencias: raíz latina + terminación.', { text: '-oso: menor · -ico: mayor.', options: { bold: true } }], { x: M, y: 1.6, w: 6.3, h: 3.0 }, { tam: 24 });
  N.tabla(s, [['Fórmula', 'Valencia', 'Nombre tradicional'], ['Na₂O', '+1 (única)', 'óxido de sodio'], ['FeO', '+2 (menor)', 'óxido ferroso'], ['Fe₂O₃', '+3 (mayor)', 'óxido férrico'],
    ['Cu₂O', '+1 (menor)', 'óxido cuproso'], ['CuO', '+2 (mayor)', 'óxido cúprico']], { x: 7.2, y: 1.6, w: 5.53, h: 4.85 }, { tam: 21, colW: [1.4, 1.7, 2.43] });
  N.tarjeta(s, { titulo: 'Raíces latinas', cuerpo: 'hierro → ferr-  ·  cobre → cupr-  ·  plomo → plumb-  ·  estaño → estann-  ·  oro → aur-', x: M, y: 4.75, w: 6.3, h: 1.7 });
  N.ejemplo(p, { titulo: 'Ejemplo resuelto: nombre tradicional', enunciado: 'Nombra SnO₂ en el sistema tradicional.', pasos: [
    { t: 'Valencia del estaño (la suma da 0):', r: 'x + 2 × (−2) = 0 → x = +4' },
    { t: 'El estaño tiene +2 y +4; +4 es la mayor:', r: 'terminación -ico' },
    { t: 'Raíz latina de estaño:', r: 'estann- → estánnico' }], respuesta: 'SnO₂ = óxido estánnico' });

  s = N.contenido(p, 'Sistema Stock');
  N.texto(s, ['«óxido de» + metal + valencia en romano.', 'Solo si el metal tiene dos valencias.', 'Con espacio: óxido de hierro (III).'], { x: M, y: 1.6, w: 6.3, h: 3.0 }, { tam: 24 });
  N.tabla(s, [['Fórmula', 'Nombre Stock'], ['FeO', 'óxido de hierro (II)'], ['Fe₂O₃', 'óxido de hierro (III)'], ['Cu₂O', 'óxido de cobre (I)'], ['PbO₂', 'óxido de plomo (IV)'], ['Na₂O', 'no se usa: Na solo tiene +1']],
    { x: 7.2, y: 1.6, w: 5.53, h: 4.85 }, { tam: 21, colW: [1.5, 4.03] });
  N.tarjeta(s, { titulo: 'Ojo', cuerpo: '«Óxido de sodio (I)» está mal: el sodio tiene una sola valencia.', x: M, y: 4.75, w: 6.3, h: 1.7, color: 'FEE4E2' });
  N.ejemplo(p, { titulo: 'Ejemplo resuelto: nombre Stock', enunciado: 'Nombra Cu₂O en el sistema Stock.', pasos: [
    { t: 'Valencia del cobre:', r: '2x + (−2) = 0 → x = +1' },
    { t: '¿El cobre tiene dos valencias?', r: 'sí (+1 y +2): lleva romano' },
    { t: 'Nombre con la valencia en romano:', r: 'óxido de cobre (I)' }], respuesta: 'Cu₂O = óxido de cobre (I)' });

  s = N.contenido(p, 'Sistema sistemático (IUPAC)');
  N.texto(s, ['Prefijo de oxígenos + «óxido de».', 'Luego prefijo de átomos del metal.', 'Óxidos de metal: sin «mono».', 'Prefijos y romanos no se mezclan.'], { x: M, y: 1.6, w: 6.4, h: 4.6 }, { tam: 24 });
  N.tabla(s, [['N.º', 'Prefijo', 'Ejemplo'], ['1', '(mono)', 'FeO: óxido de hierro'], ['2', 'di-', 'PbO₂: dióxido de plomo'], ['3', 'tri-', 'Al₂O₃: trióxido de dialuminio'], ['4', 'tetra-', 'SnCl₄: tetracloruro de estaño'], ['5', 'penta-', 'N₂O₅: pentaóxido de dinitrógeno'], ['7', 'hepta-', 'Cl₂O₇: heptaóxido de dicloro']],
    { x: 7.2, y: 1.6, w: 5.53, h: 4.85 }, { tam: 18, colW: [0.6, 1.1, 3.83] });
  N.ejemplo(p, { titulo: 'Ejemplo resuelto: nombre sistemático', enunciado: 'Nombra Ni₂O₃ en el sistema sistemático.', pasos: [
    { t: 'Cuenta los oxígenos: 3', r: 'trióxido' },
    { t: 'Cuenta los átomos de níquel: 2', r: 'diníquel' },
    { t: 'Une las partes con «de»:', r: 'trióxido de diníquel' }], respuesta: 'Ni₂O₃ = trióxido de diníquel' });

  s = N.contenido(p, 'Un mismo óxido, tres nombres');
  N.tabla(s, [['Fórmula', 'Tradicional', 'Stock', 'Sistemática'],
    ['Na₂O', 'óxido de sodio', '—', 'óxido de disodio'], ['CaO', 'óxido de calcio', '—', 'óxido de calcio'], ['Al₂O₃', 'óxido de aluminio', '—', 'trióxido de dialuminio'],
    ['FeO', 'óxido ferroso', 'óxido de hierro (II)', 'óxido de hierro'], ['Fe₂O₃', 'óxido férrico', 'óxido de hierro (III)', 'trióxido de dihierro'],
    ['CuO', 'óxido cúprico', 'óxido de cobre (II)', 'óxido de cobre'], ['PbO₂', 'óxido plúmbico', 'óxido de plomo (IV)', 'dióxido de plomo'],
    ['Au₂O₃', 'óxido áurico', 'óxido de oro (III)', 'trióxido de dioro']], { x: M, y: 1.5, w: W - 2 * M, h: 5.0 }, { tam: 21, colW: [1.6, 3.2, 3.4, 3.93] });

  N.ejemplo(p, { titulo: 'Ejemplo resuelto: del nombre a la fórmula', enunciado: 'Escribe la fórmula del óxido de estaño (IV).', pasos: [
    { t: 'El romano da la valencia:', r: 'Sn⁴⁺' }, { t: 'El anión óxido:', r: 'O²⁻' },
    { t: 'Cruza las cargas:', r: 'Sn₂O₄' }, { t: 'Los dos son pares: divide entre 2:', r: 'SnO₂' }],
    respuesta: 'óxido de estaño (IV) = SnO₂ = óxido estánnico = dióxido de estaño' });
  N.ejemplo(p, { titulo: 'Ejemplo guiado: la valencia escondida', enunciado: '¿Con qué valencia actúa el cobre en CuO? ¿Cómo se nombra?', pasos: [
    { t: 'El oxígeno siempre aporta:', r: '−2' },
    { t: 'Un Cu y un O; la suma da 0:', r: 'x + (−2) = 0 → x = +2' },
    { t: 'El cobre tiene +1 y +2; +2 es la mayor:', r: 'óxido cúprico' },
    { t: 'En Stock, la valencia en romano:', r: 'óxido de cobre (II)' }], respuesta: 'CuO: el cobre actúa con +2 → óxido cúprico = óxido de cobre (II)' });
  N.chequeo(p, { titulo: 'Chequeo 2', pregunta: '¿Cuál es el nombre Stock de CuO?', opciones: ['Óxido cuproso', 'Óxido de cobre (II)', 'Monóxido de cobre', 'Óxido de cobre (I)'], correcta: 1,
    porque: ['Es tradicional y además es el Cu₂O (+1).', 'Correcto: cobre +2, escrito en romano.', 'Prefijos = sistemática; sin «mono» en metales.', 'Con +1 la fórmula sería Cu₂O.'] });

  /* ══ Anhídridos con el mismo desarrollo ══ */
  N.seccion(p, '4. Anhídridos (óxidos ácidos)');
  s = N.contenido(p, 'Nombrar anhídridos: no metal + oxígeno');
  N.texto(s, ['Tradicional: «anhídrido» + raíz + terminación.', 'Dos valencias: -oso / -ico.', 'Halógenos: hipo-oso, -oso, -ico, per-ico.', 'Sistemática: aquí sí «monóxido».', 'En IonNom no se usa Stock.'], { x: M, y: 1.6, w: 5.9, h: 4.8 }, { tam: 22 });
  N.tabla(s, [['Fórmula', 'Valencia del Cl', 'Tradicional', 'Sistemática'], ['Cl₂O', '+1', 'anhídrido hipocloroso', 'monóxido de dicloro'], ['Cl₂O₃', '+3', 'anhídrido cloroso', 'trióxido de dicloro'],
    ['Cl₂O₅', '+5', 'anhídrido clórico', 'pentaóxido de dicloro'], ['Cl₂O₇', '+7', 'anhídrido perclórico', 'heptaóxido de dicloro']], { x: 6.75, y: 1.6, w: 5.98, h: 4.85 }, { tam: 17, colW: [1.0, 1.15, 1.95, 1.88] });

  s = N.contenido(p, 'Otros anhídridos que debes conocer');
  N.tabla(s, [['Fórmula', 'Valencia', 'Tradicional', 'Sistemática', 'Dónde aparece'],
    ['CO₂', 'C +4', 'anhídrido carbónico', 'dióxido de carbono', 'respiración, combustión'], ['SO₂', 'S +4', 'anhídrido sulfuroso', 'dióxido de azufre', 'carbón, volcanes'],
    ['SO₃', 'S +6', 'anhídrido sulfúrico', 'trióxido de azufre', 'lluvia ácida'], ['N₂O₃', 'N +3', 'anhídrido nitroso', 'trióxido de dinitrógeno', ''],
    ['N₂O₅', 'N +5', 'anhídrido nítrico', 'pentaóxido de dinitrógeno', ''], ['P₂O₅', 'P +5', 'anhídrido fosfórico', 'pentaóxido de difósforo', 'secante de laboratorio']],
    { x: M, y: 1.5, w: W - 2 * M, h: 5.0 }, { tam: 20, colW: [1.3, 1.4, 3.0, 3.4, 3.03] });
  N.ejemplo(p, { titulo: 'Ejemplo resuelto: un anhídrido', enunciado: 'Nombra N₂O₅ en los sistemas tradicional y sistemático.', pasos: [
    { t: 'Valencia del nitrógeno:', r: '2x + 5 × (−2) = 0 → x = +5' },
    { t: 'El N tiene +3 y +5; +5 es la mayor:', r: 'anhídrido nítrico' },
    { t: 'Cuenta: 5 O y 2 N:', r: 'pentaóxido de dinitrógeno' }], respuesta: 'N₂O₅ = anhídrido nítrico = pentaóxido de dinitrógeno' });
  N.chequeo(p, { titulo: 'Chequeo 3', pregunta: '¿Cuál es el nombre tradicional de SO₂?', opciones: ['Anhídrido sulfúrico', 'Anhídrido sulfuroso', 'Óxido de azufre (IV)', 'Dióxido de azufre'], correcta: 1,
    porque: ['-ico es la mayor (+6): ese es el SO₃.', 'Correcto: azufre +4, la menor: -oso.', 'Es Stock; IonNom no lo usa en anhídridos.', 'Es el nombre sistemático.'] });

  /* ══ 3. PRÁCTICA ══ */
  N.seccion(p, '5. A practicar');
  N.consigna(p, { tarea: 'En parejas, resuelvan los ejercicios A y B en el cuaderno.',
    roles: ['Escritor: fórmula o nombre.', 'Verificador: suma de cargas = 0.', 'Cambian de rol cada ejercicio.'],
    criterios: ['Cargas cruzadas y simplificadas.', 'Valencia hallada antes de nombrar.', 'Sin mezclar sistemas.'],
    tiempo: 20, entrega: 'Cuaderno con el procedimiento. Tres parejas al azar lo explican.' });
  N.ejercicios(p, { titulo: 'Ejercicios A: escribe la fórmula', instruccion: 'Cruza las cargas y simplifica cuando se pueda.', items: [
    { q: 'óxido de potasio', r: 'K₂O', x: 'K⁺ y O²⁻' }, { q: 'óxido de magnesio', r: 'MgO', x: 'Mg₂O₂ simplificado' }, { q: 'óxido férrico', r: 'Fe₂O₃', x: '-ico = Fe³⁺' },
    { q: 'óxido de cobre (II)', r: 'CuO', x: 'Cu₂O₂ simplificado' }, { q: 'trióxido de dioro', r: 'Au₂O₃', x: 'prefijos: 2 Au y 3 O' }, { q: 'óxido de níquel (III)', r: 'Ni₂O₃', x: 'Ni³⁺ y O²⁻' },
    { q: 'anhídrido sulfúrico', r: 'SO₃', x: 'S +6 (mayor); S₂O₆ simplificado' }, { q: 'óxido plumboso', r: 'PbO', x: '-oso = Pb²⁺; Pb₂O₂ simplificado' }] });
  N.ejercicios(p, { titulo: 'Ejercicios B: nombra en los tres sistemas', instruccion: 'Primero halla la valencia.', items: [
    { q: 'Li₂O', r: 'óxido de litio · — · óxido de dilitio' }, { q: 'BaO', r: 'óxido de bario · — · óxido de bario' },
    { q: 'CoO', r: 'óxido cobaltoso · óxido de cobalto (II) · óxido de cobalto' }, { q: 'Co₂O₃', r: 'óxido cobáltico · óxido de cobalto (III) · trióxido de dicobalto' },
    { q: 'SnO', r: 'óxido estannoso · óxido de estaño (II) · óxido de estaño' }, { q: 'Cl₂O₅', r: 'anhídrido clórico · — · pentaóxido de dicloro' }] });

  s = N.contenido(p, 'Los óxidos con agua: el puente a bases y ácidos');
  N.tabla(s, [['Reacción', 'Qué se forma'], ['CaO + H₂O → Ca(OH)₂', 'base: cal apagada'], ['SO₃ + H₂O → H₂SO₄', 'ácido sulfúrico: lluvia ácida'], ['CO₂ + H₂O → H₂CO₃', 'ácido carbónico: gaseosas']],
    { x: M, y: 1.6, w: W - 2 * M, h: 2.9 }, { tam: 26, colW: [5.5, 6.63] });
  N.fichas(s, [['Óxido básico + agua → base', 'cat']], { x: M, y: 5.0, h: 1.0, tam: 26 });
  N.fichas(s, [['Anhídrido + agua → ácido', 'an']], { x: 6.9, y: 5.0, h: 1.0, tam: 26 });
  N.chequeo(p, { titulo: 'Chequeo 4: ¿qué pasaría si…?', pregunta: 'Una fábrica emite SO₃ y luego llueve. ¿Qué pasaría con el agua de lluvia?', opciones: [
    'Se vuelve ácida: se forma H₂SO₄.', 'Se vuelve básica: se forma una base.', 'No cambia: el SO₃ no reacciona.', 'Se forma un sólido rojo, como la herrumbre.'], correcta: 0,
    porque: ['Correcto: anhídrido + agua → ácido.', 'Las bases salen de óxidos de metal.', 'El SO₃ sí reacciona con el agua.', 'La herrumbre es un óxido de metal.'] });

  /* ══ 4. CIERRE Y METACOGNICIÓN ══ */
  s = N.contenido(p, 'Ahora sí: ¿por qué se puso roja la reja?');
  await N.foto(s, 'oxido_hierro', { x: M, y: 1.45, w: 4.6, h: 5.25 }, 'La reja del inicio');
  N.texto(s, ['El hierro pierde electrones: Fe³⁺.', 'El oxígeno del aire los gana: O²⁻.', 'Los iones se atraen: red iónica.', 'Se forma Fe₂O₃: óxido férrico.', 'La humedad acelera el proceso.', 'Respuesta de la encuesta: B.'], { x: 5.6, y: 1.6, w: 7.1, h: 4.9 }, { tam: 24 });
  s.addNotes('Volver a los votos de la encuesta inicial: ¿quiénes cambiaron de idea y por qué?');
  N.mapa(p, { titulo: 'Síntesis', raiz: 'Óxidos', ramas: [
    { t: 'Óxido básico', items: ['metal + oxígeno', 'enlace iónico', 'con agua: base'] },
    { t: 'Anhídrido', items: ['no metal + oxígeno', 'enlace covalente', 'con agua: ácido'] },
    { t: 'Fórmula', items: ['cruce de cargas', 'simplificar', 'suma de cargas = 0'] },
    { t: 'Nombres', items: ['tradicional: -oso / -ico', 'Stock: romano', 'sistemática: prefijos'] }],
    ocultar: ['enlace iónico', 'con agua: ácido', 'simplificar', 'Stock: romano'] });
  s = N.contenido(p, 'Errores frecuentes');
  [['Mezclar sistemas', '«Trióxido de hierro (III)»: prefijos y romano no van juntos.'], ['Romano donde no va', '«Óxido de sodio (I)»: el sodio solo tiene +1.'],
    ['No simplificar', 'Pb₂O₄ queda PbO₂; C₂O₄ queda CO₂.'], ['Confundir -oso e -ico', '-oso es la valencia menor; -ico, la mayor.']]
    .forEach((e, i) => N.tarjeta(s, { titulo: e[0], cuerpo: e[1], x: M + (i % 2) * 6.17, y: 1.55 + Math.floor(i / 2) * 2.5, w: 5.97, h: 2.25, color: 'FEE4E2' }));
  N.ticket(p, { preguntas: [
    'En una frase: ¿cómo distingues un óxido básico de un anhídrido?',
    'Escribe la fórmula y el nombre Stock del óxido de hierro con valencia +2.',
    '¿Qué error cometías antes al nombrar óxidos?'] });
  await N.practica(p, { url: 'https://hbarcenasm863.github.io/ionom/funciones.html', texto: 'Practica en IonNom', detalle: 'Funciones inorgánicas: óxidos y anhídridos con corrección inmediata.' });

  const r = await N.guardar(p, 'oxidos.pptx'); console.log(JSON.stringify(r, null, 1));
})().catch(e => { console.error(e.stack || e.message); process.exit(1); });
