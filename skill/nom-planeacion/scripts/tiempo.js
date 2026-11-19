#!/usr/bin/env node
/* tiempo.js — temporiza una malla o un plan de período y controla su avance.

   1) Proponer las unidades a partir de los temas de los sitios:
      node scripts/tiempo.js sugerir bio celula,division,reinos --curso 6 --salida unidades.json
   2) Calcular con el CALENDARIO REAL (recomendado): festivos de Colombia, Semana Santa, recesos,
      jornadas, semanas finales de evaluación y refuerzo, y una clase de evaluación por unidad:
      node scripts/tiempo.js calcular --inicio 2027-01-25 --fin 2027-04-09 --horario "lun:2,mie:1,vie:2" \
           --sesion 55 --recesos "2027-03-29..2027-04-02:Receso" --sin-clase "2027-02-19:Jornada pedagógica" \
           --descuentos "izadas:2,entrega de notas:2" --evaluacion-final 1 --refuerzo 1 --holgura 0.15 \
           --unidades unidades.json [--semana-santa no] [--clase-evaluacion 2] [--salida plan.json]
   2b) Sin fechas (cálculo aproximado por semanas):
      node scripts/tiempo.js calcular --semanas 10 --horas 4 --sesion 55 \
           --descuentos "festivos:4,receso:1s,notas:2,izadas:2,salida:2" --holgura 0.15 \
           --unidades unidades.json [--diagnostico 2] [--inicio 2027-01-25] [--salida plan.json]
      (descuentos en horas de clase; con «s», en semanas: 1s = una semana entera)
   3) Semáforo de avance cada 2 o 3 semanas:
      node scripts/tiempo.js semaforo --plan plan.json --semana 6 --avance "1:100,2:40" \
           [--logro "2:55"] [--tiempo 1.6]
      avance = % de la unidad trabajado; logro = % del curso que acierta los chequeos;
      tiempo = cuánto más tardan de lo estimado (1 = lo previsto, 2 = el doble). */
'use strict';
const fs = require('fs'), path = require('path');
process.stdout.on('error', () => process.exit(0));
const args = process.argv.slice(2), cmd = args[0];
const op = (n, d) => { const i = args.indexOf('--' + n); return i < 0 ? d : args[i + 1]; };
const out = s => console.log(s);
const r05 = x => Math.round(x * 2) / 2;
const coma = x => String(Math.round(x * 10) / 10).replace('.', ',');

const FACTOR = { baja: 1, media: 1.5, alta: 2.2 };
const MINIMO = { baja: 4, media: 6, alta: 9 };           // horas mínimas razonables por unidad
/* reparto por tipo de tarea: construcción, práctica guiada, experimental o aplicada, evaluación y retroalimentación */
const FASES = { baja: [0.30, 0.30, 0.15, 0.25], media: [0.25, 0.30, 0.20, 0.25], alta: [0.25, 0.35, 0.15, 0.25] };
const NOMBRES_FASE = ['Ideas previas y construcción conceptual', 'Práctica guiada, modelamiento y problemas', 'Experimental, proyecto o aplicación', 'Evaluación y retroalimentación'];
const CALCULO = /estequiometria|gases|soluciones|mol-masa|balanceo|industria|genetica|acidobase/;

if (cmd === 'sugerir') {
  const D = require('../datos/planeacion.json'), k = { bio: 'bio', chroma: 'chroma', ion: 'ion' }[args[1]];
  if (!k) { out('Uso: node scripts/tiempo.js sugerir bio|chroma|ion id1,id2 [--curso N]'); process.exit(1); }
  const curso = +op('curso', 0);
  const unidades = args[2].split(',').map(id => {
    const t = D.sitios[k].temas.find(x => x.id === id); if (!t) { out('No existe el tema ' + id); process.exit(1); }
    const secs = t.paginas.flatMap(p => p.secciones).filter(s => !/^(Comprueba|Repaso|Palabras clave)/i.test(s.titulo));
    const prof = s => s.profundizacion && (!curso || curso < 10);
    const n = secs.length, sim = t.paginas.some(p => p.simulaciones);
    const complejidad = CALCULO.test(id) || n >= 12 ? 'alta' : n >= 7 ? 'media' : 'baja';
    return { nombre: t.titulo, temas: [k + ':' + id], complejidad, practica: sim,
      nucleo: secs.filter(s => !prof(s)).map(s => s.titulo.replace(/^\d+b?\s+/, '')),
      complementario: secs.filter(prof).map(s => s.titulo.replace(/^\d+b?\s+/, '')),
      evidencia: (t.dba && t.dba[0] && (t.dba[0].evidencias[0] || t.dba[0].texto)) || (t.sed && t.sed.g11 && t.sed.g11.evidencias[0] && t.sed.g11.evidencias[0].texto) || (t.sed && t.sed.g10 && t.sed.g10.evidencias[0] && t.sed.g10.evidencias[0].texto) || '' };
  });
  const txt = JSON.stringify(unidades, null, 1);
  if (op('salida')) { fs.writeFileSync(op('salida'), txt); out('Guardado en ' + op('salida')); } else out(txt);
  out('\nRevisa antes de calcular: agrupa las secciones de «nucleo» en 3 a 5 núcleos con su evidencia, mueve a «complementario» lo que no es indispensable y ajusta «complejidad» (baja, media, alta).');
  process.exit(0);
}

if (cmd === 'calcular' && op('fin')) {
  /* ── Modo calendario: fechas reales, horario por día, festivos de Colombia, recesos y cierre ── */
  const { festivos, semanaSanta } = require('./festivos-co');
  const inicio = op('inicio'), fin = op('fin'), sesion = +op('sesion', 55), holguraP = +op('holgura', 0.15);
  if (!inicio || !op('horario') || !op('unidades')) { out(fs.readFileSync(__filename, 'utf8').split('\n').slice(1, 24).join('\n')); process.exit(1); }
  const DIAS = { dom: 0, lun: 1, mar: 2, mie: 3, mié: 3, jue: 4, vie: 5, sab: 6, sáb: 6 };
  const NDIA = ['dom', 'lun', 'mar', 'mié', 'jue', 'vie', 'sáb'];
  const horario = {}; op('horario').split(',').forEach(x => { const [d, h] = x.split(':'); horario[DIAS[d.trim().toLowerCase()]] = +h; });
  const horasSemana = Object.values(horario).reduce((a, b) => a + b, 0);
  const bloques = Object.values(horario).filter(Boolean), bloque = +op('clase-evaluacion', bloques.sort((a, b) => bloques.filter(v => v === b).length - bloques.filter(v => v === a).length)[0] || 1);
  const U = JSON.parse(fs.readFileSync(op('unidades'), 'utf8'));
  const iso = d => d.toISOString().slice(0, 10), D = s => new Date(s + 'T00:00:00Z'), mas = (d, n) => new Date(d.getTime() + n * 864e5);
  const corto = s => { const d = D(s); return `${NDIA[d.getUTCDay()]} ${d.getUTCDate()} ${['ene','feb','mar','abr','may','jun','jul','ago','sep','oct','nov','dic'][d.getUTCMonth()]}`; };
  // días sin clase con fecha
  const anos = [...new Set([D(inicio).getUTCFullYear(), D(fin).getUTCFullYear()])];
  const sinClase = {};
  anos.forEach(a => festivos(a).forEach(f => { sinClase[f.fecha] = 'Festivo: ' + f.nombre; }));
  const rango = (a, b, motivo) => { for (let d = D(a); d <= D(b); d = mas(d, 1)) if (!sinClase[iso(d)]) sinClase[iso(d)] = motivo; };
  if (op('semana-santa', 'si') !== 'no') anos.forEach(a => { const s = semanaSanta(a); rango(s.desde, s.hasta, 'Receso de Semana Santa'); });
  (op('recesos', '') || '').split(',').filter(Boolean).forEach(r => { const [a, b, m] = r.split(/\.\.|:/); rango(a, b || a, m || 'Receso escolar'); });
  (op('sin-clase', '') || '').split(',').filter(Boolean).forEach(x => { const [f, m] = x.split(':'); sinClase[f] = m || 'Sin clase (institucional)'; });
  // franjas de clase reales
  const lunes0 = mas(D(inicio), -((D(inicio).getUTCDay() + 6) % 7));
  const semanaDe = d => Math.floor((d - lunes0) / (7 * 864e5)) + 1;
  const franjas = [], perdidasCal = [];
  for (let d = D(inicio); d <= D(fin); d = mas(d, 1)) {
    const h = horario[d.getUTCDay()] || 0; if (!h) continue;
    if (sinClase[iso(d)]) { perdidasCal.push({ fecha: iso(d), motivo: sinClase[iso(d)], horas: h }); continue; }
    franjas.push({ fecha: iso(d), semana: semanaDe(d), horas: h });
  }
  const nSem = semanaDe(D(fin)), nominal = (() => { let n = 0; for (let d = D(inicio); d <= D(fin); d = mas(d, 1)) n += horario[d.getUTCDay()] || 0; return n; })();
  const generales = (op('descuentos', '') || '').split(',').filter(Boolean).map(x => { const [n, v] = x.split(':'); return { motivo: n.trim(), horas: /s$/.test(v) ? parseFloat(v) * horasSemana : parseFloat(v) }; });
  const hGen = generales.reduce((a, g) => a + g.horas, 0);
  // semanas de cierre: evaluación final y refuerzo (las últimas semanas con clase)
  const semConClase = [...new Set(franjas.map(f => f.semana))];
  const nEval = +op('evaluacion-final', 1), nRef = +op('refuerzo', 1);
  const semRef = semConClase.slice(semConClase.length - nRef), semEval = semConClase.slice(semConClase.length - nRef - nEval, semConClase.length - nRef);
  const enCierre = f => semRef.includes(f.semana) || semEval.includes(f.semana);
  const hEval = franjas.filter(f => semEval.includes(f.semana)).reduce((a, f) => a + f.horas, 0), hRef = franjas.filter(f => semRef.includes(f.semana)).reduce((a, f) => a + f.horas, 0);
  const lineaU = franjas.filter(f => !enCierre(f)), hLinea = lineaU.reduce((a, f) => a + f.horas, 0);
  const factor = hLinea ? (hLinea - hGen) / hLinea : 1;       // las pérdidas sin fecha se reparten en todas las clases
  const efectivas = hLinea - hGen, diag = +op('diagnostico', bloque), holgura = r05(efectivas * holguraP), disponibles = efectivas - holgura - diag;
  const avisos = [];
  if (holguraP < 0.15) avisos.push(`Holgura del ${Math.round(holguraP * 100)} %: se recomienda entre 15 % y 20 %.`);
  if (!nEval) avisos.push('No se reservó semana de evaluación final.');
  if (!nRef) avisos.push('No se reservó semana de refuerzo o nivelación.');
  // reparto (mínimo + clase de evaluación por unidad, luego proporcional)
  const peso = (u, cc) => FACTOR[u.complejidad || 'media'] * (Math.max(1, (u.nucleo || []).length) + (cc ? 0.4 * (u.complementario || []).length : 0));
  const minimos = U.map(u => MINIMO[u.complejidad || 'media'] + bloque), sumaMin = minimos.reduce((a, b) => a + b, 0);
  const sobra = disponibles - sumaMin, nComp = U.reduce((a, u) => a + (u.complementario || []).length, 0), conComp = nComp > 0 && sobra >= nComp;
  let asign;
  if (sobra >= 0) { const tot = U.reduce((a, u) => a + peso(u, conComp), 0); asign = U.map((u, i) => r05(minimos[i] + sobra * peso(u, conComp) / tot)); }
  else { asign = minimos.map(m => r05(disponibles * m / sumaMin)); avisos.push(`NO ALCANZA: el núcleo y las clases de evaluación necesitan al menos ${sumaMin} h y hay ${coma(disponibles)} h. Hay que quitar o fusionar unidades, o pasar una al siguiente período.`); }
  if (nComp && !conComp) avisos.push('Lo complementario no cabe en clase: va como proyecto corto, trabajo autónomo (juego, hojas de referencia, guías del sitio) o dentro de una pregunta integradora.');
  // línea de tiempo: horas efectivas acumuladas por franja
  let acumT = 0; const linea = lineaU.map(f => ({ ...f, ef: f.horas * factor, hasta: (acumT += f.horas * factor) }));
  const franjaEn = h => linea.find(f => f.hasta >= h - 1e-6) || linea[linea.length - 1];
  const F2 = { baja: [0.35, 0.35, 0.15, 0.15], media: [0.30, 0.35, 0.20, 0.15], alta: [0.30, 0.40, 0.15, 0.15] };
  let acum = diag, prevFin = null;
  const unidades = U.map((u, i) => {
    const c = u.complejidad || 'media', h = asign[i], resto = h - bloque, f = F2[c].slice();
    if (u.practica === false) { f[1] += f[2]; f[2] = 0; }
    const piso = x => Math.floor(x * 2) / 2, fases = f.map((x, j) => j === 1 ? 0 : piso(resto * x)); fases[1] = resto - fases.reduce((a, b) => a + b, 0);
    fases.push(bloque);
    const desde = acum; acum += h;
    let fi = franjaEn(desde + 0.01); const ff = franjaEn(acum - 0.01), fe = ff;
    if (prevFin && fi.fecha <= prevFin) fi = linea.find(f => f.fecha > prevFin) || fi;   // empieza en la clase siguiente a la evaluación anterior
    prevFin = ff.fecha;   // la clase de evaluación es la última de la unidad
    if (h - bloque < MINIMO[c]) avisos.push(`«${u.nombre}»: ${coma(h - bloque)} h de trabajo (sin la evaluación) para una unidad de complejidad ${c}; mínimo razonable ${MINIMO[c]} h.`);
    if ((h - bloque) / Math.max(1, (u.nucleo || []).length) < 0.75) avisos.push(`«${u.nombre}»: demasiados núcleos para su tiempo; agrúpalos o pasa algunos a complementario.`);
    if (fases[1] < 2) avisos.push(`«${u.nombre}»: menos de 2 h de práctica guiada.`);
    return { n: i + 1, nombre: u.nombre, temas: u.temas || [], complejidad: c, horas: h, sesiones: Math.round(h * 60 / sesion * 10) / 10, fases,
      nucleo: u.nucleo || [], complementario: u.complementario || [], complementarioEnClase: conComp, evidencia: u.evidencia || '',
      desdeHora: desde, hastaHora: acum, inicio: fi.fecha, semanaInicio: fi.semana, evaluacion: fe.fecha, hito: ff.semana, hitoFecha: ff.fecha };
  });
  if (acum > efectivas + 0.01) avisos.push('Las unidades pasan de las horas efectivas: se comen la holgura.');
  // horas efectivas acumuladas al final de cada semana (para el semáforo)
  const acumSemana = {}; for (let s = 1; s <= nSem; s++) { const L = linea.filter(f => f.semana <= s); acumSemana[s] = L.length ? L[L.length - 1].hasta : 0; }
  const plan = { modo: 'calendario', inicio, fin, semanas: nSem, horario, horasSemana, sesionMin: sesion, bloque, nominal, perdidasCal, generales, hEval, hRef, semEval, semRef,
    efectivas, holguraP, holgura, diagnostico: diag, disponibles, ritmo: efectivas / Math.max(1, nSem - nEval - nRef), acumSemana, unidades, avisos };
  if (op('salida')) fs.writeFileSync(op('salida'), JSON.stringify(plan, null, 1));

  const hPerdCal = perdidasCal.reduce((a, p) => a + p.horas, 0);
  out('## Tiempo efectivo');
  out(`Período del ${corto(inicio)} al ${corto(fin)} (${nSem} semanas). Horario: ${Object.keys(horario).filter(k => horario[k]).map(k => NDIA[k] + ' ' + horario[k] + ' h').join(', ')} = ${horasSemana} h por semana; hora de clase de ${sesion} min.\n`);
  out(`| Concepto | Horas de clase |\n|---|---|\n| Clases según el calendario | ${nominal} |`);
  const grupos = {}; perdidasCal.forEach(p => { const k = /^Festivo/.test(p.motivo) ? 'Festivos' : p.motivo; grupos[k] = grupos[k] || { h: 0, d: [] }; grupos[k].h += p.horas; grupos[k].d.push(corto(p.fecha) + (/^Festivo/.test(p.motivo) ? ' (' + p.motivo.slice(9) + ')' : '')); });
  Object.entries(grupos).forEach(([k, g]) => out(`| − ${k}: ${g.d.join(', ')} | −${coma(g.h)} |`));
  generales.forEach(g => out(`| − ${g.motivo} (sin fecha fija) | −${coma(g.horas)} |`));
  if (nEval) out(`| − Evaluación final: semana ${semEval.join(', ')} | −${coma(hEval)} |`);
  if (nRef) out(`| − Refuerzo y nivelación: semana ${semRef.join(', ')} | −${coma(hRef)} |`);
  out(`| **Tiempo efectivo para las unidades** | **${coma(efectivas)}** |`);
  out(`| − Holgura (${Math.round(holguraP * 100)} %) para imprevistos y repasos | −${coma(holgura)} |`);
  out(`| − Diagnóstico inicial | −${coma(diag)} |`);
  out(`| **Horas para planear** | **${coma(disponibles)}** (incluye una clase de evaluación de ${bloque} h por unidad) |`);
  out('\n## Horas por unidad y por tipo de tarea');
  out('| Unidad | Complejidad | Horas | Construcción conceptual | Práctica guiada | Experimental o aplicación | Retroalimentación | Clase de evaluación | Fechas |');
  out('|---|---|---|---|---|---|---|---|---|');
  unidades.forEach(u => out(`| ${u.n}. ${u.nombre} | ${u.complejidad} | ${coma(u.horas)} | ${u.fases.map(coma).join(' | ')} | ${corto(u.inicio)} → evaluación ${corto(u.evaluacion)} (cierre: semana ${u.hito}) |`));
  out('\n## Cronograma por semanas');
  out('| Semana | Lunes | Horas de clase | Qué pasa |\n|---|---|---|---|');
  for (let s = 1; s <= nSem; s++) {
    const lun = iso(mas(lunes0, (s - 1) * 7)), hs = franjas.filter(f => f.semana === s).reduce((a, f) => a + f.horas, 0);
    const sin = perdidasCal.filter(p => semanaDe(D(p.fecha)) === s).map(p => `${p.motivo} (${corto(p.fecha)})`);
    const q = [];
    if (s === (linea[0] || {}).semana) q.push('Diagnóstico');
    unidades.forEach(u => { if (u.semanaInicio === s) q.push(`Inicia U${u.n}`); if (semanaDe(D(u.evaluacion)) === s) q.push(`Evaluación U${u.n} (${corto(u.evaluacion)})`); if (u.hito === s) q.push(`**Cierre U${u.n}**`); });
    if (semEval.includes(s)) q.push('**Evaluación final**'); if (semRef.includes(s)) q.push('**Refuerzo y nivelación**');
    if (!q.length && hs && s > unidades[unidades.length - 1].hito && !semEval.includes(s)) q.push('Holgura: repaso o lo que se atrasó');
    if (!q.length && hs) q.push('Desarrollo de U' + (unidades.find(u => s >= u.semanaInicio && s <= u.hito) || {}).n);
    out(`| ${s} | ${corto(lun)} | ${hs} | ${q.concat(sin).join(' · ') || '—'} |`);
  }
  out('\n## Núcleo y complementario');
  unidades.forEach(u => { out(`- **${u.n}. ${u.nombre}**: núcleo (no se negocia): ${u.nucleo.join('; ') || '—'}.`); if (u.complementario.length) out(`  Complementario (${u.complementarioEnClase ? 'en clase si el ritmo acompaña' : 'fuera del tiempo de clase'}): ${u.complementario.join('; ')}.`); });
  const rev = []; for (let s = 3; s < (semEval[0] || nSem); s += 3) { let w = s; while (w < nSem && !franjas.some(f => f.semana === w)) w++; const ult = franjas.filter(f => f.semana === w).pop(); if (ult && !rev.some(r => r.startsWith('semana ' + w + ' '))) rev.push(`semana ${w} (${corto(ult.fecha)})`); }
  out('\n## Revisiones del semáforo\n' + rev.join(' · ') + '.');
  out('\n## Avisos de viabilidad');
  out(avisos.length ? avisos.map(a => '- ⚠ ' + a).join('\n') : '- Sin avisos: el tiempo alcanza para el núcleo con la holgura prevista.');
  out('\nFestivos calculados con la Ley Emiliani. Los recesos y jornadas institucionales salen del calendario académico de la SED o del colegio: verifícalos.');
  if (op('salida')) out(`Plan guardado en ${op('salida')} (lo usa «semaforo»).`);
  process.exit(0);
}

if (cmd === 'calcular') {
  const semanas = +op('semanas'), horas = +op('horas'), sesion = +op('sesion', 55), holguraP = +op('holgura', 0.15), diag = +op('diagnostico', 1);
  if (!semanas || !horas || !op('unidades')) { out(fs.readFileSync(__filename, 'utf8').split('\n').slice(1, 17).join('\n')); process.exit(1); }
  const U = JSON.parse(fs.readFileSync(op('unidades'), 'utf8'));
  const nominal = semanas * horas;
  const descuentos = (op('descuentos', '') || '').split(',').filter(Boolean).map(x => { const [n, v] = x.split(':'); const h = /s$/.test(v) ? parseFloat(v) * horas : parseFloat(v); return { motivo: n.trim(), horas: h }; });
  const perdidas = descuentos.reduce((a, d) => a + d.horas, 0), efectivas = nominal - perdidas;
  const holgura = r05(efectivas * holguraP), disponibles = efectivas - holgura - diag;
  const avisos = [];
  if (holguraP < 0.15) avisos.push(`Holgura del ${Math.round(holguraP * 100)} %: se recomienda entre 15 % y 20 %.`);
  // reparto: primero el mínimo de cada unidad (núcleo); lo que sobra, según complejidad y número de núcleos;
  // lo complementario entra en clase solo si sobra al menos 1 h por cada tema complementario
  const peso = (u, conComp) => FACTOR[u.complejidad || 'media'] * (Math.max(1, (u.nucleo || []).length) + (conComp ? 0.4 * (u.complementario || []).length : 0));
  const minimos = U.map(u => MINIMO[u.complejidad || 'media']), sumaMin = minimos.reduce((a, b) => a + b, 0);
  const sobra = disponibles - sumaMin, nComp = U.reduce((a, u) => a + (u.complementario || []).length, 0);
  const conComp = nComp > 0 && sobra >= nComp;
  let asign;
  if (sobra >= 0) { const tot = U.reduce((a, u) => a + peso(u, conComp), 0); asign = U.map((u, i) => r05(minimos[i] + sobra * peso(u, conComp) / tot)); }
  else asign = minimos.map(m => r05(disponibles * m / sumaMin));
  if (nComp && !conComp) avisos.push('Lo complementario no cabe en clase: va como proyecto corto, trabajo autónomo (juego, hojas de referencia, guías del sitio) o dentro de una pregunta integradora.');
  const minimoTotal = U.reduce((a, u) => a + MINIMO[u.complejidad || 'media'], 0);
  if (minimoTotal > disponibles) avisos.push(`NO ALCANZA: el núcleo necesita al menos ${minimoTotal} h y hay ${coma(disponibles)} h disponibles. Hay que quitar o fusionar unidades, o pasar una al siguiente período.`);
  const ritmo = efectivas / semanas;   // horas reales de clase por semana
  let acum = diag;
  const unidades = U.map((u, i) => {
    const c = u.complejidad || 'media', h = asign[i], f = FASES[c].slice();
    if (u.practica === false) { f[1] += f[2]; f[2] = 0; }
    const piso = x => Math.floor(x * 2) / 2, fases = f.map((x, j) => j === 1 ? 0 : piso(h * x)); fases[1] = h - fases.reduce((a, b) => a + b, 0);   // la práctica guiada recibe el resto
    const desde = acum; acum += h;
    const semIni = Math.floor(desde / ritmo) + 1, semFin = Math.ceil(acum / ritmo);
    const porNucleo = h / Math.max(1, (u.nucleo || []).length);
    if (h < MINIMO[c]) avisos.push(`«${u.nombre}»: ${coma(h)} h para una unidad de complejidad ${c} (mínimo razonable ${MINIMO[c]} h): quedará corta.`);
    if (porNucleo < 0.75) avisos.push(`«${u.nombre}»: ${coma(porNucleo)} h por núcleo. Son demasiados núcleos para el tiempo: agrúpalos en menos núcleos o pasa algunos a complementario.`);
    if (fases[1] < 2) avisos.push(`«${u.nombre}»: menos de 2 h de práctica guiada.`);
    return { n: i + 1, nombre: u.nombre, temas: u.temas || [], complejidad: c, horas: h, sesiones: Math.round(h * 60 / sesion * 10) / 10, fases,
      nucleo: u.nucleo || [], complementario: u.complementario || [], complementarioEnClase: conComp, evidencia: u.evidencia || '', desdeHora: desde, hastaHora: acum, semanaInicio: semIni, hito: semFin };
  });
  const fecha = s => { if (!op('inicio')) return ''; const d = new Date(op('inicio') + 'T12:00:00'); d.setDate(d.getDate() + (s - 1) * 7 + 4); return ' (viernes ' + d.toISOString().slice(0, 10) + ')'; };
  const plan = { semanas, horasSemana: horas, sesionMin: sesion, nominal, descuentos, perdidas, efectivas, holguraP, holgura, diagnostico: diag, disponibles, ritmo, unidades, avisos, inicio: op('inicio') || null };
  if (op('salida')) fs.writeFileSync(op('salida'), JSON.stringify(plan, null, 1));

  out('## Tiempo efectivo');
  out(`| Concepto | Horas |\n|---|---|\n| Calendario: ${semanas} semanas × ${horas} h | ${nominal} |`);
  descuentos.forEach(d => out(`| − ${d.motivo} | −${coma(d.horas)} |`));
  out(`| **Tiempo efectivo** | **${coma(efectivas)}** (${coma(ritmo)} h reales por semana) |`);
  out(`| − Holgura (${Math.round(holguraP * 100)} %) para imprevistos y repasos | −${coma(holgura)} |`);
  out(`| − Diagnóstico inicial | −${coma(diag)} |`);
  out(`| **Horas para planear** | **${coma(disponibles)}** (${coma(disponibles * 60 / sesion)} sesiones de ${sesion} min) |`);
  out('\n## Horas por unidad y por tipo de tarea');
  out('| Unidad | Complejidad | Horas | Sesiones | ' + NOMBRES_FASE.join(' | ') + ' | Hito de cierre |');
  out('|---|---|---|---|---|---|---|---|---|');
  unidades.forEach(u => out(`| ${u.n}. ${u.nombre} | ${u.complejidad} | ${coma(u.horas)} | ${coma(u.sesiones)} | ${u.fases.map(coma).join(' | ')} | semana ${u.hito}${fecha(u.hito)} |`));
  const ultima = unidades[unidades.length - 1].hito;
  out(`\nDiagnóstico en la semana 1. Holgura: lo que queda después de la semana ${ultima} hasta la ${semanas}, más los ratos libres que vayan apareciendo.`);
  out('\n## Núcleo y complementario');
  unidades.forEach(u => {
    out(`- **${u.n}. ${u.nombre}**: núcleo (no se negocia): ${u.nucleo.join('; ') || '—'}.`);
    if (u.complementario.length) out(`  Complementario (${u.complementarioEnClase ? 'en clase si el ritmo acompaña' : 'fuera del tiempo de clase'}): ${u.complementario.join('; ')}.`);
  });
  out('\n## Revisiones del semáforo');
  const rev = []; for (let s = 3; s <= semanas; s += 3) rev.push('semana ' + s + fecha(s)); out(rev.join(' · ') + '.');
  out('\n## Avisos de viabilidad');
  out(avisos.length ? avisos.map(a => '- ⚠ ' + a).join('\n') : '- Sin avisos: el tiempo alcanza para el núcleo con la holgura prevista.');
  if (op('salida')) out(`\nPlan guardado en ${op('salida')} (lo usa «semaforo»).`);
  process.exit(0);
}

if (cmd === 'semaforo') {
  const P = JSON.parse(fs.readFileSync(op('plan'), 'utf8')), sem = +op('semana');
  const lista = s => Object.fromEntries((s || '').split(',').filter(Boolean).map(x => x.split(':').map(Number)));
  const av = lista(op('avance')), logro = lista(op('logro')), factorT = +op('tiempo', 1);
  const horaHoy = Math.min(P.acumSemana ? (P.acumSemana[sem] || 0) : P.diagnostico + sem * P.ritmo, P.unidades[P.unidades.length - 1].hastaHora);
  let esperado = 0, real = 0;
  const filas = P.unidades.map(u => {
    const e = Math.max(0, Math.min(1, (horaHoy - u.desdeHora) / (u.hastaHora - u.desdeHora)));
    const r = (av[u.n] != null ? av[u.n] : (e === 1 ? 100 : 0)) / 100;
    esperado += e * u.horas; real += r * u.horas;
    return { u, e, r };
  });
  const retraso = Math.max(0, esperado - real), usoHolgura = P.holgura ? retraso / P.holgura : 0;
  const luz = (v, a, b) => v <= a ? '🟢' : v <= b ? '🟡' : '🔴';
  out(`## Semáforo · semana ${sem} de ${P.semanas}\n`);
  out('| Unidad | Avance esperado | Avance real | Logro en chequeos |\n|---|---|---|---|');
  filas.forEach(({ u, e, r }) => { const l = logro[u.n]; out(`| ${u.n}. ${u.nombre} | ${Math.round(e * 100)} % | ${Math.round(r * 100)} % | ${l == null ? '—' : (l >= 70 ? '🟢' : l >= 50 ? '🟡' : '🔴') + ' ' + l + ' %'} |`); });
  const cR = luz(usoHolgura, 0.5, 1), cT = luz(factorT, 1.2, 1.5);
  const logros = Object.values(logro), peorL = logros.length ? Math.min(...logros) : 100, cL = peorL >= 70 ? '🟢' : peorL >= 50 ? '🟡' : '🔴';
  out(`\n- ${cR} **Ritmo de cobertura**: ${coma(retraso)} h de retraso; se ha usado el ${Math.round(usoHolgura * 100)} % de la holgura (${coma(P.holgura)} h).`);
  out(`- ${cL} **Apropiación en los chequeos**: ${logros.length ? 'el más bajo es ' + peorL + ' %' : 'sin datos (registra el % de aciertos de los chequeos)'}.`);
  out(`- ${cT} **Tiempo real de ejecución**: las actividades toman ${coma(factorT)} veces lo estimado.`);
  const quedan = P.unidades.filter(u => (av[u.n] || 0) < 100), horasQuedan = quedan.reduce((a, u) => a + u.horas * (1 - (av[u.n] || 0) / 100), 0) * factorT;
  const horasRestantes = P.acumSemana ? P.efectivas - (P.acumSemana[sem] || 0) : (P.semanas - sem) * P.ritmo;
  out(`- Lo que falta pide unas ${coma(horasQuedan)} h al ritmo real; quedan ${coma(horasRestantes)} h de clase efectiva.`);
  const rojo = [cR, cT, cL].includes('🔴') || horasQuedan > horasRestantes, amarillo = [cR, cT, cL].includes('🟡');
  out('\n## Qué hacer');
  if (cL !== '🟢') out('- Detenerse a corregir los errores frecuentes antes de avanzar: seguir sobre una base débil es tiempo perdido. Retroalimentación con el chequeo y un ejemplo guiado.');
  if (rojo || amarillo) {
    out('- **Repriorizar ahora, no acelerar a ciegas:**');
    out('  1. Mantener intactos el núcleo y los momentos de práctica y retroalimentación.');
    const comp = quedan.flatMap(u => u.complementario.map(c => `${c} (${u.nombre})`));
    out('  2. Compactar o integrar lo complementario en un taller, proyecto o pregunta integradora' + (comp.length ? ': ' + comp.join('; ') + '.' : '.'));
    out('  3. Pasar ejercicios extensos a trabajo autónomo: el juego en Modo Estudiante, las hojas de referencia y las guías del sitio; el aula para lo que requiere guía directa.');
    if (horasQuedan > horasRestantes) out(`  ⚠ Aun así faltan ${coma(horasQuedan - horasRestantes)} h: fusionar unidades o mover una al siguiente período.`);
  } else out('- Seguir con el plan. Próxima revisión en 2 o 3 semanas.');
  process.exit(0);
}

out(fs.readFileSync(__filename, 'utf8').split('\n').slice(1, 17).join('\n'));
