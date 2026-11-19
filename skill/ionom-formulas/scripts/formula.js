#!/usr/bin/env node
/* formula.js — fórmulas y nombres de química inorgánica al estilo de IonNom.

   node scripts/formula.js nombrar "Fe2(SO4)3"            nombres tradicional, Stock y sistemático
   node scripts/formula.js formular "sulfato de hierro (III)"
   node scripts/formula.js formato "Fe2(SO4)3"  |  "SO4^2-"  |  "2H2 + O2 -> 2H2O"
   node scripts/formula.js colorear "Fe2(SO4)3" [--svg archivo.svg] [--png archivo.png]
   node scripts/formula.js ecuacion "Fe + O2 -> Fe2O3" [--balancear]
   node scripts/formula.js masa "Ca(OH)2"
   node scripts/formula.js iones                          tabla de iones de IonNom
   node scripts/formula.js buscar "cobre"                 compuestos del banco de IonNom

   Primero se busca en el banco de IonNom (datos/compuestos.json, los mismos nombres del sitio).
   Si no está, se calcula con las reglas de IonNom y se avisa «calculado: revisar». */
'use strict';
const fs = require('fs'), path = require('path');
process.stdout.on('error', () => process.exit(0));
const BANCO = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'datos', 'compuestos.json'), 'utf8'));
const args = process.argv.slice(2), cmd = args[0], arg = args[1];
const op = n => { const i = args.indexOf('--' + n); return i < 0 ? null : (args[i + 1] && !args[i + 1].startsWith('--') ? args[i + 1] : true); };

/* ── subíndices y superíndices ── */
const SUB = '₀₁₂₃₄₅₆₇₈₉', SUP = { '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴', '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹', '+': '⁺', '-': '⁻' };
const aAscii = s => s.replace(/[₀-₉]/g, c => SUB.indexOf(c)).replace(/[⁰¹²³⁴⁵⁶⁷⁸⁹⁺⁻]/g, c => Object.keys(SUP).find(k => SUP[k] === c)).replace(/−/g, '-');
const sub = n => String(n).split('').map(d => SUB[d]).join('');
const sup = s => s.split('').map(c => SUP[c] || c).join('');
/* «Fe2(SO4)3» → «Fe₂(SO₄)₃»; «SO4^2-» o «SO4 2-» → «SO₄²⁻»; coeficientes de una ecuación quedan normales */
function formato(f) {
  return aAscii(f).trim().replace(/\^?\s*(\d*[+-])$/, (m, c) => (/^\^|\s/.test(m) || /[A-Za-z)\]]$/.test(f.replace(/\^?\s*\d*[+-]$/, '')) ? sup(c.replace(/^1(?=[+-])/, '')) : m))
    .replace(/([A-Za-z)\]])(\d+)/g, (m, a, n) => a + sub(n));
}
const fmtCarga = q => q === 0 ? '' : sup((Math.abs(q) === 1 ? '' : String(Math.abs(q))) + (q > 0 ? '+' : '-'));
const ROMANO = ['', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII'];
const PRE = ['', 'mono', 'di', 'tri', 'tetra', 'penta', 'hexa', 'hepta', 'octa', 'nona', 'deca'];

/* ── iones de IonNom ── */
const METALES = { // símbolo: [nombre, [valencias], [adjetivos -oso, -ico] si tiene dos]
  Li: ['litio', [1]], Na: ['sodio', [1]], K: ['potasio', [1]], Rb: ['rubidio', [1]], Cs: ['cesio', [1]], Ag: ['plata', [1]],
  Be: ['berilio', [2]], Mg: ['magnesio', [2]], Ca: ['calcio', [2]], Sr: ['estroncio', [2]], Ba: ['bario', [2]], Zn: ['zinc', [2]], Cd: ['cadmio', [2]],
  Al: ['aluminio', [3]],
  Cu: ['cobre', [1, 2], ['cuproso', 'cúprico']], Hg: ['mercurio', [1, 2], ['mercurioso', 'mercúrico']], Au: ['oro', [1, 3], ['auroso', 'áurico']],
  Fe: ['hierro', [2, 3], ['ferroso', 'férrico']], Co: ['cobalto', [2, 3], ['cobaltoso', 'cobáltico']], Ni: ['níquel', [2, 3], ['niqueloso', 'niquélico']],
  Cr: ['cromo', [2, 3], ['cromoso', 'crómico']], Mn: ['manganeso', [2, 3], ['manganoso', 'mangánico']],
  Sn: ['estaño', [2, 4], ['estannoso', 'estánnico']], Pb: ['plomo', [2, 4], ['plumboso', 'plúmbico']], Pt: ['platino', [2, 4], ['platinoso', 'platínico']]
};
const CATIONES_POLI = { NH4: ['amonio', 1] };
/* aniones: fórmula ASCII → [nombre, carga, tipo: an (simple) | oh | ox (oxoanión) | anp (poliatómico sin O), nombre Stock si cambia, ácido] */
const ANIONES = {
  F: ['fluoruro', -1, 'an', null, 'fluorhídrico'], Cl: ['cloruro', -1, 'an', null, 'clorhídrico'], Br: ['bromuro', -1, 'an', null, 'bromhídrico'], I: ['yoduro', -1, 'an', null, 'yodhídrico'],
  S: ['sulfuro', -2, 'an', null, 'sulfhídrico'], Se: ['seleniuro', -2, 'an', null, 'selenhídrico'], Te: ['telururo', -2, 'an', null, 'telurhídrico'],
  N: ['nitruro', -3, 'an'], P: ['fosfuro', -3, 'an'], As: ['arseniuro', -3, 'an'], O: ['óxido', -2, 'an'], H: ['hidruro', -1, 'an'],
  OH: ['hidróxido', -1, 'oh'], CN: ['cianuro', -1, 'anp', null, 'cianhídrico'],
  ClO: ['hipoclorito', -1, 'ox', null, 'hipocloroso'], ClO2: ['clorito', -1, 'ox', null, 'cloroso'], ClO3: ['clorato', -1, 'ox', null, 'clórico'], ClO4: ['perclorato', -1, 'ox', null, 'perclórico'],
  BrO: ['hipobromito', -1, 'ox', null, 'hipobromoso'], BrO2: ['bromito', -1, 'ox', null, 'bromoso'], BrO3: ['bromato', -1, 'ox', null, 'brómico'], BrO4: ['perbromato', -1, 'ox', null, 'perbrómico'],
  IO: ['hipoyodito', -1, 'ox', null, 'hipoyodoso'], IO2: ['yodito', -1, 'ox', null, 'yodoso'], IO3: ['yodato', -1, 'ox', null, 'yódico'], IO4: ['peryodato', -1, 'ox', null, 'peryódico'],
  NO2: ['nitrito', -1, 'ox', null, 'nitroso'], NO3: ['nitrato', -1, 'ox', null, 'nítrico'],
  SO3: ['sulfito', -2, 'ox', null, 'sulfuroso'], SO4: ['sulfato', -2, 'ox', null, 'sulfúrico'], CO3: ['carbonato', -2, 'ox', null, 'carbónico'],
  PO3: ['fosfito', -3, 'ox', null, 'fosforoso'], PO4: ['fosfato', -3, 'ox', null, 'fosfórico'], AsO4: ['arseniato', -3, 'ox', null, 'arsénico'], BO3: ['borato', -3, 'ox', null, 'bórico'],
  SiO3: ['silicato', -2, 'ox', null, 'silícico'], MnO4: ['permanganato', -1, 'ox', null, 'permangánico'], CrO4: ['cromato', -2, 'ox', null, 'crómico'], Cr2O7: ['dicromato', -2, 'ox', null, 'dicrómico'],
  HCO3: ['bicarbonato', -1, 'ox', 'hidrogenocarbonato'], HSO4: ['bisulfato', -1, 'ox', 'hidrogenosulfato'], HSO3: ['bisulfito', -1, 'ox', 'hidrogenosulfito'],
  HPO4: ['fosfato monoácido', -2, 'ox', 'hidrogenofosfato'], H2PO4: ['fosfato diácido', -1, 'ox', 'dihidrogenofosfato'], HS: ['bisulfuro', -1, 'an', 'hidrogenosulfuro']
};
/* óxidos de no metales (anhídridos): EO → adjetivo */
const ANH = { C: ['carbono', { 2: 'carbonoso', 4: 'carbónico' }], S: ['azufre', { 4: 'sulfuroso', 6: 'sulfúrico' }], Se: ['selenio', { 4: 'selenioso', 6: 'selénico' }], Te: ['telurio', { 4: 'teluroso', 6: 'telúrico' }],
  N: ['nitrógeno', { 3: 'nitroso', 5: 'nítrico' }], P: ['fósforo', { 3: 'fosforoso', 5: 'fosfórico' }], As: ['arsénico', { 3: 'arsenioso', 5: 'arsénico' }], B: ['boro', { 3: 'bórico' }], Si: ['silicio', { 4: 'silícico' }],
  Cl: ['cloro', { 1: 'hipocloroso', 3: 'cloroso', 5: 'clórico', 7: 'perclórico' }], Br: ['bromo', { 1: 'hipobromoso', 3: 'bromoso', 5: 'brómico', 7: 'perbrómico' }], I: ['yodo', { 1: 'hipoyodoso', 3: 'yodoso', 5: 'yódico', 7: 'peryódico' }] };
const MASAS = { H: 1.008, Li: 6.94, Be: 9.012, B: 10.81, C: 12.011, N: 14.007, O: 15.999, F: 18.998, Na: 22.990, Mg: 24.305, Al: 26.982, Si: 28.085, P: 30.974, S: 32.06, Cl: 35.45, K: 39.098, Ca: 40.078,
  Cr: 51.996, Mn: 54.938, Fe: 55.845, Co: 58.933, Ni: 58.693, Cu: 63.546, Zn: 65.38, As: 74.922, Se: 78.971, Br: 79.904, Rb: 85.468, Sr: 87.62, Ag: 107.868, Cd: 112.414, Sn: 118.710, Te: 127.60, I: 126.904,
  Cs: 132.905, Ba: 137.327, Pt: 195.084, Au: 196.967, Hg: 200.592, Pb: 207.2 };

/* ── lectura de fórmulas ── */
function atomos(f) { // «Fe2(SO4)3» → {Fe:2,S:3,O:12}
  const s = aAscii(f).replace(/\s|[+-]$|\^.*$/g, '').replace(/·/g, '.');
  let i = 0;
  function grupo() {
    const r = {};
    while (i < s.length && s[i] !== ')' && s[i] !== ']') {
      let parte;
      if (s[i] === '(' || s[i] === '[') { i++; parte = grupo(); i++; }
      else { const m = s.slice(i).match(/^[A-Z][a-z]?/); if (!m) throw new Error('No entiendo «' + f + '» cerca de «' + s.slice(i) + '»'); i += m[0].length; parte = { [m[0]]: 1 }; }
      const n = s.slice(i).match(/^\d+/); const k = n ? +n[0] : 1; if (n) i += n[0].length;
      for (const e in parte) r[e] = (r[e] || 0) + parte[e] * k;
    }
    return r;
  }
  return grupo();
}
/* separa catión y anión: «Fe2(SO4)3» → {cat:'Fe', nc:2, an:'SO4', na:3} */
function partes(f) {
  const s = aAscii(f).replace(/\s/g, '');
  let m = s.match(/^(NH4|\(NH4\))(\d*)(.*)$/) || s.match(/^([A-Z][a-z]?)(\d*)(.*)$/);
  if (!m) return null;
  let cat = m[1].replace(/[()]/g, ''), nc = +(m[2] || 1), resto = m[3];
  if (m[1] === '(NH4)' || (cat === 'NH4')) cat = 'NH4';
  let an, na = 1, q;
  if ((q = resto.match(/^\(([^)]+)\)(\d+)$/))) { an = q[1]; na = +q[2]; }
  else if ((q = resto.match(/^([A-Z][a-z]?)(\d*)$/))) { an = q[1]; na = +(q[2] || 1); }
  else { an = resto; na = 1; }
  if (!an) return null;
  // casos como «NaHCO3», «KMnO4», «CaCO3»: el resto completo es el anión
  return { cat, nc, an, na };
}

/* ── nombres ── */
const quitarTildes = s => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/\s+/g, ' ').replace(/\s*\(\s*/g, ' (').trim();
const enBanco = f => BANCO.compuestos.filter(c => c.formula === formato(f));
const conEO = (sim, eo) => { const M = METALES[sim]; if (!M) return null; return M[1].length > 1 ? M[2][M[1].indexOf(eo)] || null : null; };

function calcular(f) {
  const at = atomos(f), els = Object.keys(at), F = formato(f);
  const R = { formula: F, calculado: true, trad: [], stock: [], sist: [], tipo: '', partes: [] };
  // ácidos: empiezan por H y el resto es un anión conocido
  const sA = aAscii(f).replace(/\s/g, '');
  const ma = sA.match(/^H(\d*)(.+)$/);
  if (ma && ANIONES[ma[2]] && ma[2] !== 'H' && ma[2] !== 'O' && ma[2] !== 'OH') {
    const A = ANIONES[ma[2]], nH = +(ma[1] || 1);
    if (nH === -A[1] && A[4]) {
      R.tipo = A[2] === 'ox' ? 'ácido oxácido' : 'ácido hidrácido';
      R.trad.push('ácido ' + A[4]);
      if (R.tipo === 'ácido hidrácido') R.sist.push(A[0] + ' de hidrógeno');
      R.partes = [['H' + (nH > 1 ? sub(nH) : ''), 'cat', 'H⁺'], [formato(ma[2]), A[2] === 'anp' ? 'an' : A[2], formato(ma[2]) + fmtCarga(A[1])]];
      return R;
    }
  }
  // óxidos de no metal (anhídridos)
  if (els.length === 2 && at.O && ANH[els.find(e => e !== 'O')]) {
    const X = els.find(e => e !== 'O'), [nom, adj] = ANH[X], eo = 2 * at.O / at[X];
    R.tipo = 'óxido ácido (anhídrido)';
    if (adj[eo]) R.trad.push('anhídrido ' + adj[eo]);
    R.sist.push(PRE[at.O].replace(/a$/, at.O > 3 && /^[oó]/.test('óxido') ? 'a' : 'a') + 'óxido de ' + (at[X] > 1 ? PRE[at[X]] : '') + nom);
    if (Number.isInteger(eo)) R.stock.push(`óxido de ${nom} (${ROMANO[eo]})`);
    R.partes = [[formato(X + (at[X] > 1 ? at[X] : '')), 'neu', 'no metal ' + X + ' con EO +' + eo], ['O' + (at.O > 1 ? sub(at.O) : ''), 'neu', 'oxígeno con EO −2']];
    R.sist = R.sist.map(s => s.replace(/^monoóxido/, 'monóxido').replace(/aó/, 'aó'));
    return R;
  }
  const P = partes(f);
  if (!P) throw new Error('No reconozco la fórmula «' + f + '».');
  const A = ANIONES[P.an];
  if (!A) throw new Error(`No reconozco el anión «${formato(P.an)}». Mira: node scripts/formula.js iones`);
  const carga = -A[1] * P.na / P.nc;
  const poli = CATIONES_POLI[P.cat], M = METALES[P.cat];
  if (!poli && !M) throw new Error(`No reconozco el catión «${P.cat}».`);
  if (!Number.isInteger(carga)) throw new Error(`Las cargas no cuadran: ${P.na} × ${A[1]} no se reparte entre ${P.nc} ${P.cat}.`);
  const nomCat = poli ? poli[0] : M[0];
  if (M && !M[1].includes(carga)) R.aviso = `${P.cat} quedaría con +${carga}, que no es una de sus valencias en IonNom (${M[1].map(v => '+' + v).join(', ')}).`;
  const variable = M && M[1].length > 1, adj = variable ? conEO(P.cat, carga) : null;
  const tipos = { O: 'óxido básico', H: 'hidruro metálico', OH: 'hidróxido (base)' };
  R.tipo = tipos[P.an] || (A[2] === 'ox' ? (A[3] ? 'sal ácida' : 'sal oxigenada (oxisal)') : 'sal binaria');
  const nomAn = A[0];
  // tradicional
  R.trad.push(adj ? `${nomAn} ${adj}` : `${nomAn} de ${nomCat}`);
  // Stock: solo para valencia variable (como en IonNom); las sales ácidas usan hidrogeno-
  const nomAnStock = A[3] || nomAn;
  if (variable) R.stock.push(`${nomAnStock} de ${nomCat} (${ROMANO[carga]})`);
  else if (A[3]) R.stock.push(`${nomAnStock} de ${nomCat}`);
  // sistemática: binarios e hidróxidos (prefijos; sin «mono» en compuestos con metal)
  if (A[2] === 'an' && !A[3] || A[2] === 'oh') R.sist.push(`${P.na > 1 ? PRE[P.na] : ''}${nomAn} de ${P.nc > 1 ? PRE[P.nc] : ''}${nomCat}`.replace(/aó/g, 'aó'));
  R.partes = [[formato(P.cat + (P.nc > 1 ? P.nc : '')).replace(/^NH₄(₂|₃)$/, '(NH₄)$1'), 'cat', formato(P.cat) + fmtCarga(carga)],
    [P.na > 1 && P.an.length > 2 || P.na > 1 && /[A-Z].*[A-Z]/.test(P.an) ? '(' + formato(P.an) + ')' + sub(P.na) : formato(P.an + (P.na > 1 ? P.na : '')), A[2] === 'anp' ? 'an' : A[2], formato(P.an) + fmtCarga(A[1])]];
  R.eoCation = carga;
  return R;
}

function nombrar(f) {
  const b = enBanco(f);
  let calc = null; try { calc = calcular(f); } catch (e) { if (!b.length) throw e; }
  if (b.length) {
    const c = b[0];
    const R = { formula: c.formula, grupo: c.group, tipo: calc ? calc.tipo : c.group, trad: c.trad, stock: c.stock, sist: c.sist, pista: c.hint, partes: calc ? calc.partes : [], fuente: 'banco de IonNom' + (b.length > 1 ? ` (aparece en ${b.map(x => x.group).join(', ')})` : '') };
    // el banco no siempre trae Stock en las oxisales: se completa con el cálculo y se marca
    if (calc && !R.stock.length && calc.stock.length && /sal|base|óxido básico|hidruro/.test(calc.tipo)) { R.stock = calc.stock.map(x => x + ' [calculado]'); R.fuente += '; Stock calculado'; }
    return R;
  }
  return Object.assign(calc, { fuente: 'calculado con las reglas de IonNom: revisar' });
}

function formular(nombre) {
  const q = quitarTildes(nombre).replace(/\s*\((i+|iv|v|vi|vii)\)/i, m => ' (' + m.replace(/[^ivx]/gi, '').toUpperCase() + ')');
  const norm = s => quitarTildes(s).replace(/\((\w+)\)/, (m, r) => '(' + r.toUpperCase() + ')');
  const hit = BANCO.compuestos.filter(c => [...c.trad, ...c.stock, ...c.sist].some(n => norm(n) === norm(nombre)));
  if (hit.length) return { formula: hit[0].formula, nombres: { trad: hit[0].trad, stock: hit[0].stock, sist: hit[0].sist }, grupo: hit[0].group, fuente: 'banco de IonNom' };
  // calcular: «<anión> de <catión> (N)» o «<anión> <adjetivo>»
  const anNom = Object.entries(ANIONES).sort((a, b) => b[1][0].length - a[1][0].length);
  for (const [fa, A] of anNom) for (const nomA of [A[0], A[3]].filter(Boolean)) {
    const na = quitarTildes(nomA);
    let resto;
    const pre = PRE.slice(2).find(p => q.startsWith(p + na)) || '';
    if (q.startsWith(pre + na + ' de ')) resto = q.slice((pre + na + ' de ').length);
    else if (q.startsWith(na + ' ')) resto = q.slice(na.length + 1);
    else continue;
    let sim = null, eo = null;
    const r = resto.match(/^(?:(di|tri|tetra|penta))?(.+?)(?: \((\w+)\))?$/);
    for (const [s, M] of Object.entries(METALES)) {
      if (quitarTildes(M[0]) === r[2] || quitarTildes(M[0]) === resto.replace(/ \(\w+\)$/, '') ) { sim = s; eo = r[3] ? ROMANO.indexOf(r[3].toUpperCase()) : (M[1].length === 1 ? M[1][0] : null); }
      if (M[2]) M[2].forEach((ad, i) => { if (quitarTildes(ad) === resto) { sim = s; eo = M[1][i]; } });
    }
    if (resto === 'amonio') { sim = 'NH4'; eo = 1; }
    if (!sim) continue;
    if (eo == null) { // sistemática: deducir de los prefijos
      const nAn = pre ? PRE.indexOf(pre) : 1, nCat = r[1] ? PRE.indexOf(r[1]) : 1; eo = -A[1] * nAn / nCat;
    }
    const qa = -A[1], g = (a, b) => b ? g(b, a % b) : a, d = g(eo, qa), nc = qa / d, nAn = eo / d;
    const catTxt = sim + (nc > 1 ? (sim === 'NH4' ? '' : nc) : ''), catF = sim === 'NH4' && nc > 1 ? '(NH4)' + nc : catTxt;
    const anTxt = nAn > 1 ? (fa.length > 2 || /[A-Z].*[A-Z]/.test(fa) ? '(' + fa + ')' + nAn : fa + nAn) : fa;
    return { formula: formato(catF + anTxt), fuente: 'calculado con las reglas de IonNom: revisar', eoCation: eo };
  }
  // ácidos
  const ac = q.match(/^acido (.+)$/);
  if (ac) for (const [fa, A] of Object.entries(ANIONES)) if (A[4] && quitarTildes(A[4]) === ac[1]) return { formula: formato('H' + (-A[1] > 1 ? -A[1] : '') + fa), fuente: 'calculado con las reglas de IonNom: revisar' };
  throw new Error(`No pude formular «${nombre}». Revisa la ortografía o busca: node scripts/formula.js buscar "<palabra>"`);
}

/* ── colores de IonNom ── */
const COL = { cat: ['#E69F00', '#fcf2db', '#8a5f00', 'catión'], an: ['#0072B2', '#dbebf4', '#00659e', 'anión simple'], oh: ['#CC79A7', '#f8ecf3', '#8d5373', 'grupo OH⁻'], ox: ['#009E73', '#dbf1eb', '#007253', 'oxoanión'], neu: ['#94a3b8', '#f1f5f9', '#334155', 'enlace covalente, sin iones'] };
function colorear(f) {
  const n = nombrar(f); if (!n.partes || !n.partes.length) throw new Error('No pude separar las partes de ' + f);
  const html = n.partes.map(([t, c]) => `<span style="background:${COL[c][1]};color:${COL[c][2]};border:1.5px solid ${COL[c][0]};border-radius:5px;padding:0 4px;font-weight:700">${t}</span>`).join('');
  let x = 6; const tsp = n.partes.map(([t, c]) => { const w = t.length * 15 + 12; const r = `<rect x="${x}" y="6" width="${w}" height="34" rx="6" fill="${COL[c][1]}" stroke="${COL[c][0]}" stroke-width="2"/><text x="${x + w / 2}" y="30" text-anchor="middle" fill="${COL[c][2]}">${t}</text>`; x += w + 4; return r; }).join('');
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${x + 2}" height="46" viewBox="0 0 ${x + 2} 46" font-family="Outfit, 'DejaVu Sans', Arial, sans-serif" font-size="22" font-weight="700">${tsp}</svg>`;
  return { html, svg, leyenda: n.partes.map(([t, c, ion]) => `${t} → ${COL[c][3]} (${ion})`) };
}

/* ── ecuaciones ── */
function leerEcuacion(e) {
  const [iz, de] = aAscii(e).split(/->|→|=>|⟶|=/).map(s => s.trim());
  if (!de) throw new Error('Escribe la ecuación con flecha: A + B -> C');
  const lado = s => s.split(/\s\+\s|\s*\+\s+|\s+\+\s*/).map(t => { const m = t.trim().match(/^(\d*)\s*(.+?)\s*(\((?:s|l|g|ac|aq)\))?$/); return { k: +(m[1] || 1), f: m[2], est: m[3] || '' }; });
  return { iz: lado(iz), de: lado(de) };
}
const escribir = (E) => [E.iz, E.de].map(l => l.map(t => (t.k > 1 ? t.k + ' ' : '') + formato(t.f) + (t.est ? ' ' + t.est : '')).join(' + ')).join(' → ');
function cuenta(lado) { const r = {}; lado.forEach(t => { const a = atomos(t.f); for (const e in a) r[e] = (r[e] || 0) + a[e] * t.k; }); return r; }
function balancear(E) {
  const esp = [...E.iz, ...E.de], els = [...new Set(esp.flatMap(t => Object.keys(atomos(t.f))))];
  const n = esp.length;
  for (let max = 1; max <= 12; max++) { // búsqueda de los coeficientes enteros más pequeños
    const k = new Array(n).fill(1);
    const prueba = () => els.every(el => { let s = 0; esp.forEach((t, i) => { s += (atomos(t.f)[el] || 0) * k[i] * (i < E.iz.length ? 1 : -1); }); return s === 0; });
    const rec = i => { if (i === n) return prueba(); for (let v = 1; v <= max; v++) { k[i] = v; if (rec(i + 1)) return true; } return false; };
    if (n <= 7 && rec(0)) { esp.forEach((t, i) => t.k = k[i]); return true; }
  }
  return false;
}

/* ── programa ── */
const coma = x => String(Math.round(x * 1000) / 1000).replace('.', ',');
try {
  if (cmd === 'formato') console.log(/->|→|=/.test(arg) ? escribir(leerEcuacion(arg)) : formato(arg));
  else if (cmd === 'nombrar') {
    const n = nombrar(arg);
    console.log(`${n.formula} · ${n.tipo}${n.grupo ? ' (grupo ' + n.grupo + ')' : ''}`);
    console.log(`  Tradicional: ${n.trad.join(' / ') || '—'}`);
    console.log(`  Stock:       ${n.stock.join(' / ') || '— (no se usa: ' + (/anhídrido/.test(n.tipo) ? 'en IonNom los anhídridos se nombran con tradicional y sistemática' : /ácido/.test(n.tipo) ? 'es un ácido' : 'el metal tiene una sola valencia') + ')'}`);
    console.log(`  Sistemática: ${n.sist.join(' / ') || '—'}`);
    if (n.partes && n.partes.length) console.log('  Partes: ' + n.partes.map(p => `${p[0]} = ${COL[p[1]][3]}${p[1] === 'neu' ? ' (' + p[2] + ')' : ' ' + p[2]}`).join(' · ').replace('grupo OH⁻ OH⁻', 'grupo OH⁻'));
    if (n.pista) console.log('  Pista de IonNom: ' + n.pista);
    if (n.aviso) console.log('  ⚠ ' + n.aviso);
    console.log('  Fuente: ' + n.fuente);
  } else if (cmd === 'formular') { const r = formular(arg); console.log(`${r.formula}  (${r.fuente})`); if (r.nombres) console.log('  ' + JSON.stringify(r.nombres)); }
  else if (cmd === 'colorear') {
    const c = colorear(arg); console.log(c.html); console.log(c.leyenda.join('\n'));
    if (op('svg')) { fs.writeFileSync(op('svg'), c.svg); console.log('SVG: ' + op('svg')); }
    if (op('png')) { (async () => { const { chromium } = require('playwright'); const b = await chromium.launch(); const p = await b.newPage({ deviceScaleFactor: 3 }); await p.setContent(`<body style="margin:0">${c.svg}</body>`); await (await p.$('svg')).screenshot({ path: op('png'), omitBackground: true }); await b.close(); console.log('PNG: ' + op('png')); })(); }
  } else if (cmd === 'ecuacion') {
    const E = leerEcuacion(arg);
    if (op('balancear')) { if (!balancear(E)) console.log('⚠ No encontré coeficientes de 1 a 12: revisa las fórmulas.'); }
    const a = cuenta(E.iz), b = cuenta(E.de), els = [...new Set([...Object.keys(a), ...Object.keys(b)])];
    console.log(escribir(E));
    els.forEach(e => console.log(`  ${e.padEnd(2)}: ${a[e] || 0} a la izquierda, ${b[e] || 0} a la derecha ${(a[e] || 0) === (b[e] || 0) ? '✔' : '✘'}`));
    console.log(els.every(e => (a[e] || 0) === (b[e] || 0)) ? 'Balanceada.' : 'NO está balanceada (usa --balancear).');
  } else if (cmd === 'masa') {
    const at = atomos(arg); let t = 0, tr = 0; const L = [];
    for (const e in at) { if (!MASAS[e]) throw new Error('No tengo la masa de ' + e); t += MASAS[e] * at[e]; tr += Math.round(MASAS[e]) * at[e]; L.push(`${at[e]} × ${coma(MASAS[e])} (${e})`); }
    console.log(`${formato(arg)}: ${L.join(' + ')} = ${coma(t)} g/mol`);
    console.log(`  Con masas redondeadas a enteros: ${tr} g/mol (Cl suele redondearse a 35,5).`);
  } else if (cmd === 'iones') {
    console.log('CATIONES (ámbar)'); for (const [s, M] of Object.entries(METALES)) console.log(`  ${s.padEnd(3)} ${M[0].padEnd(10)} ${M[1].map(v => formato(s) + fmtCarga(v) + (M[2] ? ' ' + M[2][M[1].indexOf(v)] + ' / ' + M[0] + ' (' + ROMANO[v] + ')' : '')).join('   ')}`);
    console.log('  NH₄⁺ amonio');
    for (const [t, tit] of [['an', 'ANIONES SIMPLES (azul)'], ['oh', 'GRUPO OH (rosado)'], ['ox', 'OXOANIONES (verde)'], ['anp', 'OTROS']]) {
      console.log(tit); for (const [f, A] of Object.entries(ANIONES)) if (A[2] === t) console.log(`  ${(formato(f) + fmtCarga(A[1])).padEnd(9)} ${A[0]}${A[3] ? ' / ' + A[3] : ''}${A[4] ? '  → ácido ' + A[4] : ''}`);
    }
  } else if (cmd === 'buscar') {
    const q = quitarTildes(arg);
    BANCO.compuestos.filter(c => quitarTildes([c.formula, ...c.trad, ...c.stock, ...c.sist].join(' ')).includes(q) || aAscii(c.formula).toLowerCase().includes(q))
      .forEach(c => console.log(`${c.formula.padEnd(11)} ${c.group.padEnd(8)} ${c.trad.join('/')} | ${c.stock.join('/') || '—'} | ${c.sist.join('/') || '—'}`));
  } else console.log(fs.readFileSync(__filename, 'utf8').split('\n').slice(1, 14).join('\n'));
} catch (e) { console.log('⚠ ' + e.message); process.exit(1); }
module.exports = { formato, nombrar, formular, atomos };
