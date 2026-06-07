#!/usr/bin/env node
// audit-juego.js — ChromaNom juego.html integrity audit
// Checks questions, mol renderers, MOLDES graphs, and drag consistency.

const fs = require('fs');
const vm = require('vm');
const path = require('path');

const FILE = path.join(__dirname, 'juego.html');
const src = fs.readFileSync(FILE, 'utf8');

// ── 1. Extract the JS from <script> blocks ─────────────────────────────────
const scripts = [];
const scriptRe = /<script(?:\s[^>]*)?>[\s\S]*?<\/script>/gi;
let m;
while ((m = scriptRe.exec(src)) !== null) {
  const tag = m[0];
  if (/src\s*=/.test(tag)) continue; // skip external scripts
  const inner = tag.replace(/^<script[^>]*>/, '').replace(/<\/script>$/, '');
  scripts.push(inner);
}
const combined = scripts.join('\n');

// ── 2. Run in vm sandbox ───────────────────────────────────────────────────
// We stub browser/DOM APIs used during parsing
const __out__ = Object.create(null);

// Returns a mock DOM element that absorbs all property sets silently
function mockEl() {
  const el = {
    textContent: '', innerHTML: '', className: '', value: '',
    style: new Proxy({}, { get: () => '', set: () => true }),
    classList: { add: () => {}, remove: () => {}, contains: () => false, toggle: () => {} },
    dataset: new Proxy({}, { get: () => undefined, set: () => true }),
    disabled: false,
    addEventListener: () => {},
    removeEventListener: () => {},
    appendChild: () => {},
    removeChild: () => {},
    append: () => {},
    setAttribute: () => {},
    getAttribute: () => null,
    getBoundingClientRect: () => ({ top:0, left:0, width:0, height:0 }),
    querySelectorAll: () => [],
    querySelector: () => null,
    closest: () => null,
  };
  return el;
}

const sandbox = {
  // DOM stubs
  document: {
    getElementById: () => mockEl(),
    querySelector: () => mockEl(),
    querySelectorAll: () => [],
    addEventListener: () => {},
    body: { addEventListener: () => {}, classList: { add: () => {}, remove: () => {} } },
    head: mockEl(),
    createElement: () => mockEl(),
    createElementNS: () => mockEl(),
  },
  window: {
    addEventListener: () => {},
    removeEventListener: () => {},
    matchMedia: () => ({ matches: false, addEventListener: () => {}, removeEventListener: () => {} }),
    location: { origin: 'https://example.com', href: '', reload: () => {} },
    history: { pushState: () => {} },
    scrollTo: () => {},
    innerWidth: 1024, innerHeight: 768,
  },
  navigator: {
    serviceWorker: { register: () => Promise.resolve() },
    userAgent: 'node',
    platform: 'node',
    language: 'es',
    standalone: false,
  },
  self: {},
  console,
  setTimeout: () => 0,
  clearTimeout: () => {},
  setInterval: () => 0,
  clearInterval: () => {},
  requestAnimationFrame: () => 0,
  cancelAnimationFrame: () => {},
  localStorage: { getItem: () => null, setItem: () => {}, removeItem: () => {}, getOwnPropertyNames: () => [] },
  sessionStorage: { getItem: () => null, setItem: () => {} },
  fetch: () => Promise.resolve({ ok: true, json: () => Promise.resolve({}) }),
  __out__,
};
// Give the sandbox access to host globals
Object.assign(sandbox, {
  Math, JSON, Array, Object, String, Number, Boolean, RegExp, Date,
  parseInt, parseFloat, isNaN, isFinite,
  Set, Map, WeakMap, WeakSet,
  Promise,
  Error, TypeError, RangeError,
  Infinity, NaN, undefined,
});

const ctx = vm.createContext(sandbox);

// Append extraction hooks
const extraction = `
try { __out__.QBANK = typeof QBANK !== 'undefined' ? QBANK : []; } catch(e){}
try { __out__.MOLDES = typeof MOLDES !== 'undefined' ? MOLDES : {}; } catch(e){}
try { __out__.BUILD_MOL_MAP = typeof BUILD_MOL_MAP !== 'undefined' ? BUILD_MOL_MAP : {}; } catch(e){}
try { __out__.M_KEYS = typeof M !== 'undefined' ? Object.keys(M) : []; } catch(e){}
try { __out__.mkDevSVG = typeof mkDevSVG !== 'undefined' ? mkDevSVG : null; } catch(e){}
try { __out__.moldesGraph = typeof moldesGraph !== 'undefined' ? moldesGraph : null; } catch(e){}
`;

try {
  vm.runInContext(combined + '\n' + extraction, ctx, {
    filename: 'juego.html',
    timeout: 15000,
  });
} catch (err) {
  // Some rendering calls may throw without a real DOM; that's OK if data was extracted
  if (!__out__.QBANK || !__out__.QBANK.length) {
    console.error('Fatal: could not extract QBANK from juego.html:', err.message);
    process.exit(1);
  }
}

const QBANK        = __out__.QBANK        || [];
const MOLDES       = __out__.MOLDES       || {};
const BUILD_MOL_MAP = __out__.BUILD_MOL_MAP || {};
const M_KEYS       = new Set(__out__.M_KEYS || []);
const mkDevSVG     = __out__.mkDevSVG;
const moldesGraph  = __out__.moldesGraph;

// ── Helpers ────────────────────────────────────────────────────────────────

let errors = 0;
let warnings = 0;

function err(qIdx, msg) {
  console.error(`  [ERR]  Q#${String(qIdx).padStart(3,'0')} ${msg}`);
  errors++;
}

function warn(qIdx, msg) {
  console.warn(`  [WARN] Q#${String(qIdx).padStart(3,'0')} ${msg}`);
  warnings++;
}

function hasMolRenderer(mol) {
  return M_KEYS.has(mol) || mol in MOLDES;
}

function hasBuildRenderer(buildKey) {
  // 1. MOLDES has the key directly
  if (buildKey in MOLDES) return true;
  // 2. BUILD_MOL_MAP maps it to an M key
  const mapped = BUILD_MOL_MAP[buildKey];
  if (mapped && M_KEYS.has(mapped)) return true;
  // 3. Strip build_ prefix and check M
  const stripped = buildKey.replace(/^build_/, '');
  if (M_KEYS.has(stripped)) return true;
  return false;
}

const VALID_CLASSES = new Set(['c', 'i', 'g', 'r']);

// ── 3. MOLDES graph validation ─────────────────────────────────────────────
const VALENCE = { C: 4, O: 2, N: 3, Cl: 1, Br: 1, F: 1, S: 2, P: 3 };

function auditMoldesGraphs() {
  console.log('\n── MOLDES graph integrity ──────────────────────────────────────────────');
  if (!moldesGraph) {
    warn('N/A', 'moldesGraph function not extracted — skipping graph checks');
    return;
  }

  let graphErrors = 0;
  const moldesKeys = Object.keys(MOLDES);

  for (const key of moldesKeys) {
    let G;
    try {
      G = moldesGraph(MOLDES[key]);
    } catch (e) {
      err('MOL', `moldesGraph("${key}") threw: ${e.message}`);
      graphErrors++;
      continue;
    }

    if (!G || !G.atoms || !G.bonds) {
      err('MOL', `moldesGraph("${key}") returned malformed result`);
      graphErrors++;
      continue;
    }

    // No isolated atoms (atom participates in at least 1 bond)
    const bonded = new Set();
    G.bonds.forEach(b => { bonded.add(b.f); bonded.add(b.t); });
    const isolated = G.atoms.filter(a => !bonded.has(a.id));
    if (G.atoms.length > 1 && isolated.length > 0) {
      err('MOL', `MOLDES["${key}"] has ${isolated.length} isolated atom(s): ${isolated.map(a => a.el+'#'+a.id).join(', ')}`);
      graphErrors++;
    }

    // Valence check
    const usage = {};
    G.atoms.forEach(a => { usage[a.id] = 0; });
    G.bonds.forEach(b => { usage[b.f] += b.o; usage[b.t] += b.o; });
    for (const atom of G.atoms) {
      const maxV = VALENCE[atom.el];
      if (maxV !== undefined && usage[atom.id] > maxV) {
        err('MOL', `MOLDES["${key}"] atom ${atom.el}#${atom.id} uses ${usage[atom.id]} bonds (max ${maxV})`);
        graphErrors++;
      }
    }
  }

  if (graphErrors === 0) {
    console.log(`  OK — all ${moldesKeys.length} MOLDES entries pass graph checks`);
  }
}

// ── 4. SVG rendering smoke test ────────────────────────────────────────────
function auditSVGRendering() {
  console.log('\n── MOLDES SVG rendering smoke test ─────────────────────────────────────');
  if (!mkDevSVG) {
    warn('N/A', 'mkDevSVG function not extracted — skipping SVG checks');
    return;
  }

  let svgErrors = 0;
  const moldesKeys = Object.keys(MOLDES);

  for (const key of moldesKeys) {
    let svg;
    try {
      svg = mkDevSVG(MOLDES[key]);
    } catch (e) {
      err('SVG', `mkDevSVG(MOLDES["${key}"]) threw: ${e.message}`);
      svgErrors++;
      continue;
    }
    if (typeof svg !== 'string' || svg.trim() === '') {
      // build_* keys for cyclic/aromatic use M renderers via getBuildRefSVG, not mkDevSVG
      if (!key.startsWith('build_')) {
        warn('SVG', `mkDevSVG(MOLDES["${key}"]) returned empty string`);
      }
    }
  }

  if (svgErrors === 0) {
    console.log(`  OK — all ${moldesKeys.length} MOLDES entries produce SVG without errors`);
  }
}

// ── 5. Per-question audit ─────────────────────────────────────────────────
function auditQuestions() {
  console.log('\n── Per-question field & renderer checks ─────────────────────────────────');

  const topicCounts = Object.create(null);
  const typeCounts  = Object.create(null);
  const seen = new Map(); // "type:mol_or_buildKey" → first index (dup detection)

  for (let i = 0; i < QBANK.length; i++) {
    const q = QBANK[i];
    const qn = i + 1;

    if (!q || typeof q !== 'object') { err(qn, 'question is not an object'); continue; }

    const t = q.type;
    if (!t) { err(qn, 'missing `type`'); continue; }

    // topic
    if (!q.topic)  err(qn, `[${t}] missing \`topic\``);
    else { topicCounts[q.topic] = (topicCounts[q.topic] || 0) + 1; }
    typeCounts[t] = (typeCounts[t] || 0) + 1;

    // expl
    if (!q.expl) err(qn, `[${t}] missing \`expl\``);

    // q text
    if (!q.q) err(qn, `[${t}] missing \`q\` (question text)`);

    if (t === 'mc') {
      // Required: mol, ans, opts[]
      if (!q.mol)  err(qn, '[mc] missing `mol`');
      if (!q.ans)  err(qn, '[mc] missing `ans`');
      if (!Array.isArray(q.opts)) {
        err(qn, '[mc] missing or non-array `opts`');
      } else {
        if (q.opts.length !== 4) warn(qn, `[mc] opts has ${q.opts.length} items (expected 4)`);
        if (q.ans && !q.opts.includes(q.ans)) err(qn, `[mc] ans "${q.ans}" not in opts ${JSON.stringify(q.opts)}`);
      }
      if (q.mol && !hasMolRenderer(q.mol)) err(qn, `[mc] no renderer for mol="${q.mol}"`);
      checkDup(seen, `mc:${q.mol}`, qn);

    } else if (t === 'drag') {
      // Required: mol, ans, slots[], tokens[]
      if (!q.mol)  err(qn, '[drag] missing `mol`');
      if (!q.ans)  err(qn, '[drag] missing `ans`');
      if (!Array.isArray(q.slots)) {
        err(qn, '[drag] missing or non-array `slots`');
      } else {
        q.slots.forEach((s, si) => {
          if (!s.id)      err(qn, `[drag] slot[${si}] missing id`);
          if (!s.correct) err(qn, `[drag] slot[${si}] missing correct`);
          if (!s.cls)     warn(qn, `[drag] slot[${si}] missing cls`);
        });
      }
      if (!Array.isArray(q.tokens)) {
        err(qn, '[drag] missing or non-array `tokens`');
      } else {
        q.tokens.forEach((tk, ti) => {
          if (!tk.text) err(qn, `[drag] token[${ti}] missing text`);
        });
      }
      // Each slot.correct must appear in tokens and in ans (as substring)
      if (Array.isArray(q.slots) && q.ans) {
        const tokenTexts = Array.isArray(q.tokens)
          ? new Set(q.tokens.map(tk => tk.text))
          : new Set();
        q.slots.forEach((s, si) => {
          if (!s.correct) return;
          // Must be in tokens list
          if (tokenTexts.size && !tokenTexts.has(s.correct)) {
            err(qn, `[drag] slot[${si}].correct "${s.correct}" not found in tokens`);
          }
          // Must appear in ans (checkDrag validates per-slot, ans is only for display)
          if (!q.ans.includes(s.correct)) {
            err(qn, `[drag] slot[${si}].correct "${s.correct}" not found in ans "${q.ans}"`);
          }
        });
      }
      if (q.mol && !hasMolRenderer(q.mol)) err(qn, `[drag] no renderer for mol="${q.mol}"`);
      checkDup(seen, `drag:${q.mol}`, qn);

    } else if (t === 'id') {
      // Required: mol, correct (valid class or array)
      if (!q.mol)  err(qn, '[id] missing `mol`');
      if (!q.correct) {
        err(qn, '[id] missing `correct`');
      } else {
        const vals = Array.isArray(q.correct) ? q.correct : [q.correct];
        vals.forEach(v => {
          if (!VALID_CLASSES.has(v)) err(qn, `[id] correct value "${v}" not in {c,i,g,r}`);
        });
      }
      if (!q.name) warn(qn, '[id] missing `name` (compound name for display)');
      if (!q.highlight || !q.highlight.text) err(qn, '[id] missing `highlight.text`');
      if (q.mol && !hasMolRenderer(q.mol)) err(qn, `[id] no renderer for mol="${q.mol}"`);
      checkDup(seen, `id:${q.mol}:${JSON.stringify(q.correct)}`, qn);

    } else if (t === 'write') {
      // Required: mol, ans, accepted[]
      if (!q.mol)  err(qn, '[write] missing `mol`');
      if (!q.ans)  err(qn, '[write] missing `ans`');
      if (!Array.isArray(q.accepted)) {
        err(qn, '[write] missing or non-array `accepted`');
      } else {
        if (!q.accepted.includes(q.ans)) {
          err(qn, `[write] ans "${q.ans}" not in accepted[]`);
        }
        if (q.accepted.length < 2) {
          warn(qn, `[write] accepted has only ${q.accepted.length} entry`);
        }
      }
      if (q.mol && !hasMolRenderer(q.mol)) err(qn, `[write] no renderer for mol="${q.mol}"`);
      checkDup(seen, `write:${q.mol}`, qn);

    } else if (t === 'build') {
      // Required: buildKey
      if (!q.buildKey) {
        err(qn, '[build] missing `buildKey`');
      } else {
        if (!hasBuildRenderer(q.buildKey)) {
          err(qn, `[build] no renderer found for buildKey="${q.buildKey}" (not in MOLDES, BUILD_MOL_MAP, or M)`);
        }
        checkDup(seen, `build:${q.buildKey}`, qn);
      }

    } else {
      err(qn, `unknown type "${t}"`);
    }
  }

  return { topicCounts, typeCounts };
}

function checkDup(seen, key, qn) {
  if (seen.has(key)) {
    warn(qn, `duplicate key "${key}" — first seen at Q#${String(seen.get(key)).padStart(3,'0')}`);
  } else {
    seen.set(key, qn);
  }
}

// ── 6. Orphan mol/renderer check ──────────────────────────────────────────
function auditRendererCoverage() {
  console.log('\n── Renderer coverage ────────────────────────────────────────────────────');
  const usedMols = new Set();
  const usedBuildKeys = new Set();

  QBANK.forEach(q => {
    if (!q) return;
    if (q.mol) usedMols.add(q.mol);
    if (q.buildKey) usedBuildKeys.add(q.buildKey);
  });

  // Check M_KEYS that are never used
  const unusedM = [...M_KEYS].filter(k => !usedMols.has(k) && !Object.values(BUILD_MOL_MAP).includes(k));
  if (unusedM.length) {
    console.log(`  INFO: ${unusedM.length} M renderer(s) not referenced by any question:`);
    unusedM.forEach(k => console.log(`    ${k}`));
  } else {
    console.log(`  OK — all M renderers are referenced by questions or BUILD_MOL_MAP`);
  }

  // Check MOLDES keys that are never used
  const usedMoldesKeys = new Set([...usedMols, ...usedBuildKeys]);
  const unusedMoldes = Object.keys(MOLDES).filter(k => !usedMoldesKeys.has(k));
  if (unusedMoldes.length) {
    console.log(`  INFO: ${unusedMoldes.length} MOLDES descriptor(s) not referenced by any question:`);
    unusedMoldes.forEach(k => console.log(`    ${k}`));
  } else {
    console.log(`  OK — all MOLDES descriptors are referenced by questions`);
  }
}

// ── 7. Coverage matrix ────────────────────────────────────────────────────
function printCoverage(topicCounts, typeCounts) {
  console.log('\n── Question coverage ────────────────────────────────────────────────────');

  // By type
  console.log('\n  By type:');
  const typeOrder = ['mc','drag','id','write','build'];
  typeOrder.forEach(t => {
    const n = typeCounts[t] || 0;
    console.log(`    ${t.padEnd(8)} ${String(n).padStart(3)}`);
  });
  Object.keys(typeCounts).filter(k => !typeOrder.includes(k)).forEach(k => {
    console.log(`    ${k.padEnd(8)} ${String(typeCounts[k]).padStart(3)}`);
  });
  console.log(`    ${'TOTAL'.padEnd(8)} ${String(QBANK.length).padStart(3)}`);

  // By topic
  console.log('\n  By topic:');
  Object.keys(topicCounts).sort().forEach(topic => {
    console.log(`    ${topic.padEnd(22)} ${String(topicCounts[topic]).padStart(3)}`);
  });
}

// ── 8. BUILD_MOL_MAP integrity ────────────────────────────────────────────
function auditBuildMolMap() {
  console.log('\n── BUILD_MOL_MAP integrity ──────────────────────────────────────────────');
  let mapErrors = 0;
  for (const [buildKey, mKey] of Object.entries(BUILD_MOL_MAP)) {
    if (!M_KEYS.has(mKey)) {
      err('MAP', `BUILD_MOL_MAP["${buildKey}"] = "${mKey}" but M["${mKey}"] does not exist`);
      mapErrors++;
    }
  }
  if (mapErrors === 0) {
    console.log(`  OK — all ${Object.keys(BUILD_MOL_MAP).length} BUILD_MOL_MAP entries resolve to valid M renderers`);
  }
}

// ── Main ──────────────────────────────────────────────────────────────────
console.log('╔══════════════════════════════════════════════════════════════════════╗');
console.log('║         ChromaNom — juego.html Audit Report                         ║');
console.log('╚══════════════════════════════════════════════════════════════════════╝');
console.log(`\nFile: ${FILE}`);
console.log(`Questions: ${QBANK.length}  |  MOLDES keys: ${Object.keys(MOLDES).length}  |  M renderers: ${M_KEYS.size}  |  BUILD_MOL_MAP: ${Object.keys(BUILD_MOL_MAP).length}`);

auditBuildMolMap();
auditMoldesGraphs();
auditSVGRendering();

const { topicCounts, typeCounts } = auditQuestions();
auditRendererCoverage();
printCoverage(topicCounts, typeCounts);

console.log('\n══════════════════════════════════════════════════════════════════════');
if (errors > 0 || warnings > 0) {
  console.log(`\nResult: ${errors} error(s), ${warnings} warning(s)`);
} else {
  console.log('\nResult: PASS — no errors or warnings found');
}
console.log('══════════════════════════════════════════════════════════════════════');

process.exit(errors > 0 ? 1 : 0);
