/* Ejemplo completo: clase corta de IonNom sobre óxidos (se corre desde cualquier carpeta).
   node <skill>/referencias/ejemplo.js  → oxidos.pptx */
const path = require('path');
const N = require(path.join(__dirname, '..', 'scripts', 'nom-pptx.js'));
(async () => {
  const p = N.nueva('ion', { titulo: 'Óxidos', tema: 'Óxidos básicos y ácidos', curso: '10.°' });
  N.portada(p, { titulo: 'Óxidos básicos y ácidos', subtitulo: '¿Por qué se pone roja una reja vieja?', curso: 'Grado 10.°' });
  N.claves(p, [
    { t: 'Óxido', d: 'Compuesto de un elemento con oxígeno (O²⁻).' },
    { t: 'Óxido básico', d: 'Metal + oxígeno. Con agua forma una base.' },
    { t: 'Anhídrido', d: 'No metal + oxígeno (óxido ácido). Con agua forma un ácido.' },
    { t: 'Valencia (EO)', d: 'Carga con la que el elemento se combina.' }]);
  N.seccion(p, 'Óxidos básicos');
  const s = N.contenido(p, 'Metal + oxígeno: se cruzan las cargas');
  N.texto(s, ['Fe³⁺ y O²⁻: las cargas se cruzan como subíndices.', 'Fe₂O₃: óxido férrico (tradicional).', 'Óxido de hierro (III) (Stock).', 'Trióxido de dihierro (sistemática).'], { x: N.M, y: 1.6, w: 6.4, h: 4.8 });
  await N.foto(s, 'halita', { x: 7.4, y: 1.5, w: 5.3, h: 5.1 }, 'Halita: un compuesto iónico');
  s.addNotes('Mostrar en el tablero el cruce de cargas con colores: catión ámbar, anión azul.');
  N.chequeo(p, { pregunta: '¿Cuál es el nombre Stock de CuO?', opciones: ['Óxido cuproso', 'Óxido de cobre (II)', 'Monóxido de cobre', 'Óxido de cobre (I)'], correcta: 1,
    porque: ['Ese es el nombre tradicional del Cu₂O (valencia +1).', 'Correcto: el cobre actúa con +2 y Stock lo escribe en romano.', 'Los prefijos son de la sistemática; además, IonNom no usa «mono» con metales.', 'Con +1 la fórmula sería Cu₂O.'] });
  await N.practica(p, { url: 'https://hbarcenasm863.github.io/ionom/funciones.html', texto: 'Practica en IonNom' });
  const r = await N.guardar(p, 'oxidos.pptx'); console.log(r);
})().catch(e => { console.error(e.message); process.exit(1); });
