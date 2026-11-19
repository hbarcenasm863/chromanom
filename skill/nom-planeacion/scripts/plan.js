#!/usr/bin/env node
/* plan.js — consulta los datos de planeación de BioNom, ChromaNom e IonNom.
   node scripts/plan.js temas [bio|chroma|ion]
   node scripts/plan.js tema <sitio> <id[,id2]> [--curso 9] [--json]
   node scripts/plan.js curso bio <6..11>          DBA, temas y estándares de ese curso
   node scripts/plan.js alineacion <sitio> <id>     solo la alineación curricular
   node scripts/plan.js buscar <texto>              temas y secciones que lo mencionan */
'use strict';
process.stdout.on('error', () => process.exit(0));
const D = require('../datos/planeacion.json'), S = D.sitios;
const [cmd, a1, a2, a3] = process.argv.slice(2);
const json = process.argv.includes('--json');
const out = s => process.stdout.write(s + '\n');
const sitio = s => { const k = { bio: 'bio', bionom: 'bio', chroma: 'chroma', chromanom: 'chroma', ion: 'ion', ionom: 'ion' }[(s || '').toLowerCase()]; if (!k) { out('Sitio desconocido: usa bio, chroma o ion'); process.exit(1); } return k; };
const banda = g => g <= 7 ? 'Sexto a séptimo' : g <= 9 ? 'Octavo a noveno' : 'Décimo a undécimo';

function alineacion(k, t) {
  const L = [];
  if (t.dba && t.dba.length) { L.push('DBA (MEN, 2016):'); t.dba.forEach(d => { L.push(`  • ${d.grado ? d.grado + '.° n.º ' + d.num : d.id}: ${d.texto || d.t}`); (d.evidencias || []).forEach(e => L.push('      – Evidencia: ' + e)); }); }
  if (t.estandares && t.estandares.length) { L.push('Estándares (MEN, 2004):'); t.estandares.forEach(e => L.push(`  • ${e.t}${e.nota ? '  [' + e.nota + ']' : ''}`)); }
  if (t.sed) for (const g of ['g10', 'g11']) { const x = t.sed[g]; if (!x || !x.evidencias.length) continue;
    const en = S[k].sed && S[k].sed.find(s => s.id === (x.enunciado || x.evidencias[0].sed));
    L.push(`SED Bogotá ${g.slice(1)}.°${x.propuesta ? ' (alineación PROPUESTA, confirmar)' : ''}:`);
    if (en) L.push('  Enunciado: ' + en.texto);
    x.evidencias.forEach(e => L.push(`  • [${e.competencia}] ${e.texto}`)); }
  if (k === 'bio' && t.cursoBase) {
    const est = S.bio.estandaresMEN.filter(e => e.banda === banda(t.cursoBase) && new RegExp((t.corto || t.titulo).split(/[ ,:]/)[0].slice(0, 6), 'i').test(e.dondeEnBioNom));
    if (est.length) { L.push(`Estándares (MEN, 2004) · ${banda(t.cursoBase)} que BioNom trabaja en este tema:`); est.forEach(e => L.push(`  • [${e.componente}] ${e.texto}  → ${e.dondeEnBioNom}`)); }
  }
  return L.join('\n');
}

if (cmd === 'temas') {
  for (const k of a1 ? [sitio(a1)] : Object.keys(S)) {
    out(`\n${S[k].nombre} · ${S[k].materia} · ${S[k].url}`);
    S[k].temas.forEach(t => out(`  ${t.id.padEnd(16)} ${t.titulo}${t.cursoBase ? '  (desde ' + t.cursoBase + '.°)' : ''}`));
  }
  out(`\nDatos del ${D.fecha}.`);
} else if (cmd === 'tema' || cmd === 'alineacion') {
  const k = sitio(a1); const ids = (a2 || '').split(',');
  for (const id of ids) {
    let t = S[k].temas.find(x => x.id === id);
    const ci = process.argv.indexOf('--curso'), curso = ci > 0 ? +process.argv[ci + 1] : null;
    if (t && curso && t.dba) { t = Object.assign({}, t); const igual = t.dba.filter(d => d.grado === curso); t.dba = igual.length ? igual : t.dba.filter(d => d.grado <= curso); t.cursoBase = curso; }
    if (!t) { out(`No existe el tema «${id}» en ${S[k].nombre}. Mira: node scripts/plan.js temas ${k}`); continue; }
    if (json) { out(JSON.stringify(t, null, 1)); continue; }
    out(`\n══ ${S[k].nombre} · ${t.titulo} (${t.id}) ══`);
    out(alineacion(k, t));
    if (cmd === 'alineacion') continue;
    out('\nPáginas y secciones del sitio (para enlazar actividades):');
    t.paginas.forEach(p => { out(`  ${p.titulo} — ${p.url}${p.simulaciones ? '  (tiene simulaciones)' : ''}`); p.secciones.forEach(s => out(`     · ${s.titulo}${s.id ? '  → ' + p.url + '#' + s.id : ''}`)); });
    if (k === 'bio') { const h = S.bio.hojasReferencia.filter(x => x.tema === t.corto || x.id === t.id); h.forEach(x => out(`  Hoja de referencia: ${x.titulo} — ${x.url}`)); }
    const P = t.previos || {};
    out('\nSesión 1 · Aprendizajes previos (banco del panel docente):');
    (P.curiosos || []).forEach(x => out('  Dato curioso: ' + x));
    (P.contexto || []).forEach(x => out(`  Contexto ${x.amb}: ${x.t}`));
    (P.cotidianos || []).forEach(x => out('  Cotidiano: ' + x));
    (P.activacion || []).forEach(x => out('  Pregunta de activación: ' + x));
    out('\nSesión 2 · Lectura base:'); t.lectura.forEach((x, i) => out(`  ${i + 1}. ${x}`));
    if (t.esquema) out('  Mapa de ideas: ' + t.esquema.raiz + ' → ' + t.esquema.ramas.map(r => r.t + ' (' + r.items.join(', ') + ')').join('; '));
    if (t.puedo && t.puedo.length) { out('\nAutoevaluación «Puedo…»:'); t.puedo.forEach(x => out('  ☐ ' + x)); }
    out(`\nBanco disponible para la sesión 3–4 (usar la skill nom-banco): ${t.banco.saber} preguntas tipo Saber y ${t.banco.abiertas} abiertas en el panel docente, más las del juego.`);
  }
} else if (cmd === 'curso') {
  const k = sitio(a1), g = +a2;
  if (k !== 'bio') { out(`${S[k].nombre} es de ${S[k].temas[0].cursoBase}.°: usa «temas ${k}» y «alineacion ${k} <id>».`); process.exit(0); }
  const dbas = []; S.bio.temas.forEach(t => t.dba.filter(d => d.grado === g).forEach(d => { let x = dbas.find(y => y.id === d.id); if (!x) dbas.push(x = Object.assign({ temas: [] }, d)); x.temas.push(t.id); }));
  out(`\nBioNom · ${g}.° · DBA de biología (MEN, 2016):`);
  if (!dbas.length) out('  (ningún DBA de biología en este curso)');
  dbas.forEach(d => { out(`  • n.º ${d.num}: ${d.texto}\n      Temas: ${d.temas.join(', ')}`); d.evidencias.forEach(e => out('      – Evidencia: ' + e)); });
  out('\nTemas cuyo curso base es ' + g + '.°: ' + S.bio.temas.filter(t => t.cursoBase === g).map(t => t.id).join(', '));
  out(`\nEstándares (MEN, 2004) · ${banda(g)}:`);
  S.bio.estandaresMEN.filter(e => e.banda === banda(g) || /científico natural/.test(e.banda)).forEach(e => out(`  • [${e.componente || e.banda}] ${e.texto}  → ${e.dondeEnBioNom}`));
} else if (cmd === 'buscar') {
  const q = (a1 || '').toLowerCase();
  for (const k in S) S[k].temas.forEach(t => {
    const hits = [];
    if ((t.titulo + ' ' + t.lectura.join(' ')).toLowerCase().includes(q)) hits.push('tema');
    t.paginas.forEach(p => p.secciones.forEach(s => { if (s.titulo.toLowerCase().includes(q)) hits.push(`${p.archivo}: ${s.titulo}`); }));
    if (hits.length) out(`${S[k].nombre} · ${t.id}: ${hits.join(' | ')}`);
  });
} else {
  out(require('fs').readFileSync(__filename, 'utf8').split('\n').slice(1, 7).join('\n'));
}
