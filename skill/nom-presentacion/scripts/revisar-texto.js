/* revisar-texto.js — avisos de estilo del docente para texto que irá al estudiante.
   Lo usan hoja.js (nom-hoja-referencia) y presentacion.js (nom-presentacion).
   También se corre solo: node scripts/revisar-texto.js archivo */
'use strict';
/* Emojis que el Windows del docente no dibuja: banderas y emojis de la versión 12 en adelante. */
const RANGOS = [[0x1F1E6, 0x1F1FF, 'bandera'], [0x1FA70, 0x1FAFF, 'emoji nuevo'], [0x1F7E0, 0x1F7F0, 'emoji nuevo'],
  [0x1F90C, 0x1F90F, 'emoji nuevo'], [0x1F93F, 0x1F93F, 'emoji nuevo'], [0x1F971, 0x1F972, 'emoji nuevo'], [0x1F977, 0x1F978, 'emoji nuevo'],
  [0x1F97B, 0x1F97B, 'emoji nuevo'], [0x1F9A3, 0x1F9AF, 'emoji nuevo'], [0x1F9BA, 0x1F9BF, 'emoji nuevo'], [0x1F9C3, 0x1F9CF, 'emoji nuevo'],
  [0x1F6D5, 0x1F6DF, 'emoji nuevo'], [0x1F6FA, 0x1F6FC, 'emoji nuevo']];
/* Fórmula orgánica con ramas entre paréntesis (regla de ChromaNom). Los iones poliatómicos
   de la química inorgánica, como Ca(OH)₂ o Fe₂(SO₄)₃, sí llevan paréntesis y no se marcan. */
const RAMAS = /(?:CH[₀-₉0-9]*|C)\((?:CH[₀-₉0-9]*|OH|Cl|Br|F|I|NH₂|NH2|C[₀-₉0-9]*H[₀-₉0-9]*)\)|\((?:CH[₀-₉0-9]+)\)[₀-₉0-9]+C/;
function revisar(texto) {
  const avisos = [];
  for (const ch of texto) {
    const c = ch.codePointAt(0);
    const r = RANGOS.find(([a, b]) => c >= a && c <= b);
    if (r) avisos.push(`«${ch}» (${r[2]}): en el Windows del docente sale como rectángulo negro; cámbialo por otro emoji o quítalo.`);
  }
  const m = texto.match(RAMAS);
  if (m) avisos.push(`«${m[0]}»: fórmula orgánica con ramas entre paréntesis; dibújala con la skill chromanom-estructuras o usa la fórmula molecular.`);
  if (/semanas? de gestaci/i.test(texto)) avisos.push('«semanas de gestación»: en BioNom se cuentan semanas de embarazo desde la última menstruación (40 en total).');
  const atp = texto.match(/\b(36|38)\s*ATP/);
  if (atp) avisos.push(`«${atp[0]}»: en BioNom la respiración celular da unos 30 a 32 ATP por glucosa.`);
  return [...new Set(avisos)];
}
module.exports = { revisar };
if (require.main === module) {
  const t = require('fs').readFileSync(process.argv[2], 'utf8');
  const a = revisar(t.replace(/<[^>]+>/g, ' '));
  console.log(a.length ? a.join('\n') : 'Sin avisos.');
}
