#!/usr/bin/env node
// audit-grupos.js — ChromaNom grupos.html integrity audit
// Checks: all svgKey/svg references resolve, SVGs render, exercise fields,
// example parts, rule-example alignment, and MOLS orphan detection.

const fs = require('fs');
const vm = require('vm');
const path = require('path');

const FILE = path.join(__dirname, 'grupos.html');
const src = fs.readFileSync(FILE, 'utf8');

// ── 1. Extract JS ─────────────────────────────────────────────────────────
const scripts = [];
const scriptRe = /<script(?:\s[^>]*)?>[\s\S]*?<\/script>/gi;
let m;
while ((m = scriptRe.exec(src)) !== null) {
  const tag = m[0];
  if (/src\s*=/.test(tag)) continue;
  const inner = tag.replace(/^<script[^>]*>/, '').replace(/<\/script>$/, '');
  scripts.push(inner);
}
const combined = scripts.join('\n');

// ── 2. Sandbox ────────────────────────────────────────────────────────────
const __out__ = Object.create(null);

function mockEl() {
  const e = {
    textContent: '', innerHTML: '', className: '', value: '', style: {},
    classList: { add: () => {}, remove: () => {}, contains: () => false },
    dataset: new Proxy({}, { get: () => undefined, set: () => true }),
    disabled: false,
    addEventListener: () => {}, removeEventListener: () => {},
    appendChild: (c) => c, removeChild: () => {}, append: () => {},
    setAttribute: () => {}, getAttribute: () => null,
    querySelectorAll: () => [], querySelector: () => mockEl(),
    closest: () => null, focus: () => {},
  };
  e.style = new Proxy({}, { get: () => '', set: () => true });
  return e;
}

const sandbox = {
  document: {
    getElementById: () => mockEl(),
    querySelector: () => mockEl(),
    querySelectorAll: () => [],
    addEventListener: () => {},
    createElement: () => mockEl(),
    createElementNS: () => mockEl(),
    body: { addEventListener: () => {}, classList: { add: () => {}, remove: () => {} } },
    head: mockEl(),
  },
  window: {
    addEventListener: () => {},
    removeEventListener: () => {},
    matchMedia: () => ({ matches: false, addEventListener: () => {}, removeEventListener: () => {} }),
    location: { origin: 'https://example.com', href: '', reload: () => {} },
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
  setTimeout: () => 0, clearTimeout: () => {},
  setInterval: () => 0, clearInterval: () => {},
  requestAnimationFrame: () => 0, cancelAnimationFrame: () => {},
  localStorage: { getItem: () => null, setItem: () => {}, removeItem: () => {} },
  sessionStorage: { getItem: () => null, setItem: () => {} },
  fetch: () => Promise.resolve({ ok: true, json: () => Promise.resolve({}) }),
  Math, JSON, Array, Object, String, Number, Boolean, RegExp, Date,
  parseInt, parseFloat, isNaN, isFinite, Infinity, NaN,
  Set, Map, WeakMap, WeakSet, Promise, Error, TypeError, RangeError,
  __out__,
};

const ctx = vm.createContext(sandbox);

const extraction = `
try { __out__.GROUPS = typeof GROUPS !== 'undefined' ? GROUPS : []; } catch(e){}
try { __out__.MOLS_KEYS = typeof MOLS !== 'undefined' ? Object.keys(MOLS) : []; } catch(e){}
try { __out__.MOLS = typeof MOLS !== 'undefined' ? MOLS : {}; } catch(e){}
try { __out__.CATS = typeof CATS !== 'undefined' ? CATS : []; } catch(e){}
`;

try {
  vm.runInContext(combined + '\n' + extraction, ctx, { filename: 'grupos.html', timeout: 20000 });
} catch (err) {
  if (!__out__.GROUPS || !__out__.GROUPS.length) {
    console.error('Fatal: could not extract GROUPS:', err.message);
    process.exit(1);
  }
}

const GROUPS   = __out__.GROUPS   || [];
const MOLS     = __out__.MOLS     || {};
const MOLS_KEYS = new Set(__out__.MOLS_KEYS || []);
const CATS     = __out__.CATS     || [];

// ── Counters ──────────────────────────────────────────────────────────────
let errors = 0, warnings = 0;

function err(loc, msg) { console.error(`  [ERR]  ${loc} ${msg}`); errors++; }
function warn(loc, msg) { console.warn(`  [WARN] ${loc} ${msg}`); warnings++; }

const VALID_CLS = new Set(['c','i','g','r']);

// ── 3. MOLS renderer smoke test ───────────────────────────────────────────
function auditMolsRendering() {
  console.log('\n── MOLS renderer smoke test ─────────────────────────────────────────────');
  let svgErrors = 0;
  for (const key of MOLS_KEYS) {
    let svg;
    try {
      svg = MOLS[key]();
    } catch (e) {
      err(`MOLS[${key}]`, `threw: ${e.message}`);
      svgErrors++;
      continue;
    }
    if (typeof svg !== 'string' || svg.trim() === '') {
      warn(`MOLS[${key}]`, 'returned empty string');
    }
  }
  if (svgErrors === 0) {
    console.log(`  OK — all ${MOLS_KEYS.size} MOLS renderers execute without errors`);
  }
}

// ── 4. GROUPS data audit ──────────────────────────────────────────────────
function auditGroups() {
  console.log('\n── Per-group data audit ─────────────────────────────────────────────────');

  const usedMolKeys = new Set();
  const groupIds = new Set();

  for (const g of GROUPS) {
    const gid = g.id || '(no-id)';
    const loc = `[${gid}]`;

    // Group-level required fields
    if (!g.id)       err(loc, 'missing id');
    if (!g.name)     err(loc, 'missing name');
    if (!g.formula)  err(loc, 'missing formula');
    if (!g.badge)    err(loc, 'missing badge');
    if (!g.desc)     err(loc, 'missing desc');
    if (!g.iupac)    err(loc, 'missing iupac');
    if (!g.suffix)   err(loc, 'missing suffix');
    if (g.priority === undefined) warn(loc, 'missing priority');

    // Duplicate group id
    if (groupIds.has(gid)) err(loc, 'duplicate group id');
    else groupIds.add(gid);

    // ── example ──
    if (!g.example) {
      err(loc, 'missing example');
    } else {
      if (!g.example.name) err(`${loc} example`, 'missing name');
      if (!Array.isArray(g.example.parts) || g.example.parts.length === 0) {
        err(`${loc} example`, 'missing or empty parts[]');
      } else {
        g.example.parts.forEach((p, i) => {
          if (!p.t) err(`${loc} example.parts[${i}]`, 'missing t (text)');
          if (!VALID_CLS.has(p.cls)) err(`${loc} example.parts[${i}]`, `invalid cls "${p.cls}" (expected c/i/g/r)`);
          if (!p.l) warn(`${loc} example.parts[${i}]`, 'missing l (label)');
        });
        // The concatenated parts should match the example name (ignoring dashes/spaces between segments)
        const concatText = g.example.parts.map(p => p.t).join('');
        const nameNorm = (g.example.name || '').replace(/[-\s]/g, '');
        const concatNorm = concatText.replace(/[-\s]/g, '');
        if (concatNorm !== nameNorm) {
          warn(`${loc} example`, `parts concat "${concatText}" vs name "${g.example.name}" (after norm: "${concatNorm}" vs "${nameNorm}")`);
        }
      }
    }

    // ── rules ──
    if (!Array.isArray(g.rules) || g.rules.length === 0) {
      warn(loc, 'missing or empty rules[]');
    } else {
      g.rules.forEach((r, ri) => {
        const rloc = `${loc} rule[${ri}] "${r.t || '?'}"`;
        if (!r.t) err(rloc, 'missing t (title)');
        if (!r.d) err(rloc, 'missing d (description)');

        // SVG references
        if (r.svgs && r.svgs.length) {
          r.svgs.forEach(key => {
            usedMolKeys.add(key);
            if (!MOLS_KEYS.has(key)) {
              err(rloc, `svg key "${key}" not found in MOLS`);
            }
            // svgLabels alignment
            if (r.svgLabels && !(key in r.svgLabels)) {
              warn(rloc, `svg key "${key}" has no entry in svgLabels`);
            }
            // svgBd alignment
            if (r.svgBd && !(key in r.svgBd)) {
              warn(rloc, `svg key "${key}" has no entry in svgBd`);
            }
            // validate svgBd parts
            if (r.svgBd && r.svgBd[key]) {
              r.svgBd[key].forEach((p, pi) => {
                if (!p.t) err(`${rloc} svgBd[${key}][${pi}]`, 'missing t');
                if (!VALID_CLS.has(p.cls)) err(`${rloc} svgBd[${key}][${pi}]`, `invalid cls "${p.cls}"`);
              });
            }
          });
          // Check svgLabels has no orphan keys
          if (r.svgLabels) {
            Object.keys(r.svgLabels).forEach(k => {
              if (!r.svgs.includes(k)) warn(rloc, `svgLabels key "${k}" not in svgs[]`);
            });
          }
          // Check svgBd has no orphan keys
          if (r.svgBd) {
            Object.keys(r.svgBd).forEach(k => {
              if (!r.svgs.includes(k)) warn(rloc, `svgBd key "${k}" not in svgs[]`);
            });
          }
        } else {
          warn(rloc, 'no svgs defined — rule has no visual example');
        }
      });
    }

    // ── exercises ──
    if (!Array.isArray(g.exercises) || g.exercises.length === 0) {
      warn(loc, 'missing or empty exercises[]');
    } else {
      g.exercises.forEach((ex, ei) => {
        const eloc = `${loc} ex[${ei}] "${ex.ans || '?'}"`;

        if (!ex.svgKey) {
          err(eloc, 'missing svgKey');
        } else {
          usedMolKeys.add(ex.svgKey);
          if (!MOLS_KEYS.has(ex.svgKey)) {
            err(eloc, `svgKey "${ex.svgKey}" not found in MOLS`);
          }
        }
        if (!ex.ans) err(eloc, 'missing ans');
        if (!Array.isArray(ex.accepted)) {
          err(eloc, 'missing or non-array accepted[]');
        } else {
          if (ex.ans && !ex.accepted.includes(ex.ans)) {
            err(eloc, `ans "${ex.ans}" not in accepted[]`);
          }
          if (ex.accepted.length < 2) {
            warn(eloc, `accepted has only ${ex.accepted.length} entry`);
          }
        }
        if (!ex.expl) err(eloc, 'missing expl');
        if (!Array.isArray(ex.hints) || ex.hints.length === 0) warn(eloc, 'no hints');

        // Validate bd (name breakdown)
        if (!Array.isArray(ex.bd) || ex.bd.length === 0) {
          warn(eloc, 'missing or empty bd[]');
        } else {
          ex.bd.forEach((p, pi) => {
            if (!p.t) err(`${eloc} bd[${pi}]`, 'missing t');
            if (!VALID_CLS.has(p.cls)) err(`${eloc} bd[${pi}]`, `invalid cls "${p.cls}"`);
          });
          // Concatenate bd.t values and check against ans (ignoring separators)
          const bdText = ex.bd.map(p => p.t).join('');
          const bdNorm = bdText.replace(/[-\s]/g, '');
          const ansNorm = (ex.ans || '').replace(/[-\s]/g, '');
          if (bdNorm !== ansNorm) {
            warn(eloc, `bd parts concat "${bdText}" vs ans "${ex.ans}" (norm: "${bdNorm}" vs "${ansNorm}")`);
          }
        }
      });
    }
  }
  return usedMolKeys;
}

// ── 5. MOLS orphan detection ──────────────────────────────────────────────
function auditMolsOrphans(usedMolKeys) {
  console.log('\n── MOLS orphan detection ────────────────────────────────────────────────');
  const unused = [...MOLS_KEYS].filter(k => !usedMolKeys.has(k));
  if (unused.length) {
    console.log(`  INFO: ${unused.length} MOLS renderer(s) not referenced by any group rule or exercise:`);
    unused.forEach(k => console.log(`    ${k}`));
  } else {
    console.log(`  OK — all ${MOLS_KEYS.size} MOLS renderers are referenced`);
  }
}

// ── 6. CATS coverage ──────────────────────────────────────────────────────
function auditCats() {
  console.log('\n── Category coverage ────────────────────────────────────────────────────');
  const groupIds = new Set(GROUPS.map(g => g.id));
  const catIds = new Set();
  CATS.forEach(cat => {
    cat.ids.forEach(id => {
      catIds.add(id);
      if (!groupIds.has(id)) {
        err(`CATS["${cat.label}"]`, `references group id "${id}" not found in GROUPS`);
      }
    });
  });
  const uncategorized = GROUPS.filter(g => !catIds.has(g.id));
  if (uncategorized.length) {
    console.log(`  INFO: ${uncategorized.length} group(s) not in any category:`);
    uncategorized.forEach(g => console.log(`    ${g.id}`));
  } else {
    console.log(`  OK — all ${GROUPS.length} groups appear in CATS`);
  }
}

// ── 7. Coverage summary ───────────────────────────────────────────────────
function printSummary() {
  console.log('\n── Coverage summary ─────────────────────────────────────────────────────');
  console.log(`  Groups:   ${GROUPS.length}`);
  console.log(`  MOLS:     ${MOLS_KEYS.size}`);
  console.log('');
  console.log('  Group                     Rules  Exercises');
  console.log('  ─────────────────────────────────────────');
  GROUPS.forEach(g => {
    const name = (g.name || g.id || '?').padEnd(26);
    const r = String(g.rules ? g.rules.length : 0).padStart(5);
    const e = String(g.exercises ? g.exercises.length : 0).padStart(10);
    console.log(`  ${name} ${r} ${e}`);
  });
}

// ── Main ──────────────────────────────────────────────────────────────────
console.log('╔══════════════════════════════════════════════════════════════════════╗');
console.log('║         ChromaNom — grupos.html Audit Report                        ║');
console.log('╚══════════════════════════════════════════════════════════════════════╝');
console.log(`\nFile: ${FILE}`);
console.log(`Groups: ${GROUPS.length}  |  MOLS renderers: ${MOLS_KEYS.size}  |  Categories: ${CATS.length}`);

auditMolsRendering();
const usedMolKeys = auditGroups();
auditMolsOrphans(usedMolKeys);
auditCats();
printSummary();

console.log('\n══════════════════════════════════════════════════════════════════════');
if (errors > 0 || warnings > 0) {
  console.log(`\nResult: ${errors} error(s), ${warnings} warning(s)`);
} else {
  console.log('\nResult: PASS — no errors or warnings found');
}
console.log('══════════════════════════════════════════════════════════════════════');

process.exit(errors > 0 ? 1 : 0);
