/* festivos-co.js — días festivos de Colombia de cualquier año (Ley 51 de 1983, «Ley Emiliani»).
   node scripts/festivos-co.js 2027   → lista del año
   Fijos: 1 ene, 1 may, 20 jul, 7 ago, 8 dic, 25 dic.
   Se pasan al lunes siguiente: Reyes (6 ene), San José (19 mar), San Pedro y San Pablo (29 jun),
   Asunción (15 ago), Día de la Raza (12 oct), Todos los Santos (1 nov), Independencia de Cartagena (11 nov).
   Según la Pascua: Jueves y Viernes Santo; Ascensión (+43 días), Corpus Christi (+64) y
   Sagrado Corazón (+71), que ya caen en lunes. */
'use strict';
const iso = d => d.toISOString().slice(0, 10);
const dia = (a, m, d) => new Date(Date.UTC(a, m - 1, d));
const mas = (d, n) => new Date(d.getTime() + n * 864e5);
function pascua(a) { // algoritmo de Meeus/Jones/Butcher
  const A = a % 19, b = Math.floor(a / 100), c = a % 100, d = Math.floor(b / 4), e = b % 4, f = Math.floor((b + 8) / 25), g = Math.floor((b - f + 1) / 3);
  const h = (19 * A + b - d - g + 15) % 30, i = Math.floor(c / 4), k = c % 4, l = (32 + 2 * e + 2 * i - h - k) % 7, m = Math.floor((A + 11 * h + 22 * l) / 451);
  const mes = Math.floor((h + l - 7 * m + 114) / 31), di = ((h + l - 7 * m + 114) % 31) + 1;
  return dia(a, mes, di);
}
const lunes = d => { const w = d.getUTCDay(); return w === 1 ? d : mas(d, (8 - w) % 7); };
function festivos(a) {
  const P = pascua(a), L = [];
  [[1, 1, 'Año Nuevo'], [5, 1, 'Día del Trabajo'], [7, 20, 'Día de la Independencia'], [8, 7, 'Batalla de Boyacá'], [12, 8, 'Inmaculada Concepción'], [12, 25, 'Navidad']]
    .forEach(([m, d, n]) => L.push({ fecha: iso(dia(a, m, d)), nombre: n }));
  [[1, 6, 'Reyes Magos'], [3, 19, 'San José'], [6, 29, 'San Pedro y San Pablo'], [8, 15, 'Asunción de la Virgen'], [10, 12, 'Día de la Raza'], [11, 1, 'Todos los Santos'], [11, 11, 'Independencia de Cartagena']]
    .forEach(([m, d, n]) => L.push({ fecha: iso(lunes(dia(a, m, d))), nombre: n }));
  [[-3, 'Jueves Santo'], [-2, 'Viernes Santo'], [43, 'Ascensión del Señor'], [64, 'Corpus Christi'], [71, 'Sagrado Corazón']]
    .forEach(([n, t]) => L.push({ fecha: iso(mas(P, n)), nombre: t }));
  return L.sort((x, y) => x.fecha < y.fecha ? -1 : 1);
}
/* Semana Santa: lunes a viernes antes del domingo de Pascua (en muchos calendarios escolares es receso). */
function semanaSanta(a) { const P = pascua(a); return { desde: iso(mas(P, -6)), hasta: iso(mas(P, -2)) }; }
module.exports = { festivos, pascua, semanaSanta };
if (require.main === module) {
  const a = +process.argv[2] || new Date().getFullYear();
  festivos(a).forEach(f => console.log(f.fecha, f.nombre));
  const s = semanaSanta(a); console.log(`Semana Santa (receso escolar habitual): ${s.desde} a ${s.hasta}`);
}
