#!/usr/bin/env node
/**
 * validate-qbank.js
 * Validates every question in juego.html QBANK:
 *   - required fields (q, type, topic)
 *   - type-specific correctness (mc opts include ans, build keys exist in MOLDES, etc.)
 *   - build keys parseable in MOLDES
 *   - warnings for missing expl
 *
 * Usage: node validate-qbank.js [path/to/juego.html]
 */
'use strict';

const fs = require('fs');
const vm = require('vm');
const path = require('path');

const htmlPath = process.argv[2] || path.join(__dirname, 'juego.html');
const html = fs.readFileSync(htmlPath, 'utf8');

// ── Extract all <script> blocks ──────────────────────────────────────────────
const scripts = [];
const scriptRe = /<script(?:\s[^>]*)?>[\s\S]*?<\/script>/gi;
let m;
while ((m = scriptRe.exec(html)) !== null) {
  scripts.push(m[0].replace(/<script[^>]*>/i, '').replace(/<\/script>/i, ''));
}
const allJs = scripts.join('\n');

// ── Minimal browser-API mocks ────────────────────────────────────────────────
const mockEl = () => ({
  style: {},
  textContent: '',
  innerHTML: '',
  className: '',
  classList: { add() {}, remove() {}, contains() { return false; } },
  disabled: false,
  dataset: {},
  addEventListener() {},
  querySelectorAll() { return []; },
  querySelector() { return null; },
});

const sandbox = {
  window: { addEventListener() {}, innerWidth: 1280, innerHeight: 800 },
  document: {
    getElementById() { return mockEl(); },
    querySelector() { return null; },
    querySelectorAll() { return []; },
    addEventListener() {},
    dispatchEvent() {},
    body: mockEl(),
    head: mockEl(),
  },
  navigator: { serviceWorker: { register() { return Promise.resolve(); } }, userAgent: '' },
  location: { href: '', search: '', hash: '' },
  history: [],
  localStorage: { getItem() { return null; }, setItem() {}, removeItem() {} },
  sessionStorage: { getItem() { return null; }, setItem() {}, removeItem() {} },
  performance: { now() { return 0; } },
  console,
  Math,
  JSON,
  Array,
  Object,
  String,
  Number,
  Boolean,
  RegExp,
  Date,
  Set,
  Map,
  Promise,
  Error,
  setTimeout() { return 0; },
  clearTimeout() {},
  setInterval() { return 0; },
  clearInterval() {},
  requestAnimationFrame() {},
  cancelAnimationFrame() {},
  fetch() { return Promise.resolve({ json() { return Promise.resolve({}); } }); },
  Image: function() { return {}; },
};
sandbox.self = sandbox;
sandbox.globalThis = sandbox;

// Append an extraction snippet — const/let are block-scoped inside vm.runInContext
// and won't appear on the sandbox object. We expose them explicitly.
const extractionSnippet = `
try { __out__.QBANK = QBANK; } catch(e) {}
try { __out__.MOLDES = MOLDES; } catch(e) {}
try { __out__.NIVEL_TOPICS = NIVEL_TOPICS; } catch(e) {}
`;
sandbox.__out__ = {};
vm.createContext(sandbox);

let runError = null;
try {
  vm.runInContext(allJs + extractionSnippet, sandbox, { timeout: 10000 });
} catch (e) {
  runError = e;
}

const QBANK = sandbox.__out__.QBANK;
const MOLDES = sandbox.__out__.MOLDES;
const NIVEL_TOPICS = sandbox.__out__.NIVEL_TOPICS;

if (!QBANK || !Array.isArray(QBANK)) {
  console.error('ERROR: Could not extract QBANK from script.');
  if (runError) console.error('  VM error:', runError.message);
  process.exit(1);
}
if (!MOLDES || typeof MOLDES !== 'object') {
  console.error('ERROR: Could not extract MOLDES from script.');
  process.exit(1);
}

// ── Validation ───────────────────────────────────────────────────────────────
const VALID_TYPES = new Set(['mc', 'drag', 'id', 'write', 'build']);
const VALID_ID_CLASSES = new Set(['r', 'c', 'i', 'g']);

let errors = 0;
let warnings = 0;

function err(loc, msg)  { console.error(`  ERROR  ${loc}: ${msg}`); errors++; }
function warn(loc, msg) { console.warn (`  WARN   ${loc}: ${msg}`); warnings++; }

QBANK.forEach((q, i) => {
  const loc = `[${i}] type=${q.type || '?'} topic=${q.topic || '?'}`;

  if (!q.q)                            err(loc, 'missing "q" (question text)');
  if (!q.type)                         err(loc, 'missing "type"');
  else if (!VALID_TYPES.has(q.type))   err(loc, `unknown type "${q.type}"`);
  if (!q.topic)                        warn(loc, 'missing "topic"');
  if (!q.expl)                         warn(loc, 'missing "expl" (explanation)');

  if (q.type === 'mc') {
    if (!q.ans)                        err(loc, 'mc: missing "ans"');
    if (!Array.isArray(q.opts) || q.opts.length < 2)
                                       err(loc, 'mc: "opts" must have ≥2 entries');
    else if (q.ans && !q.opts.includes(q.ans))
                                       err(loc, `mc: ans "${q.ans}" not found in opts [${q.opts.join(', ')}]`);

  } else if (q.type === 'write') {
    if (!q.ans)                        err(loc, 'write: missing "ans"');
    if (!Array.isArray(q.accepted) || q.accepted.length === 0)
                                       err(loc, 'write: "accepted" must be a non-empty array');
    else if (q.ans && !q.accepted.includes(q.ans))
                                       warn(loc, `write: ans "${q.ans}" not in accepted list`);

  } else if (q.type === 'id') {
    // correct may be a string or array (benzene ring can be 'c' and 'g' simultaneously)
    const correctVals = Array.isArray(q.correct) ? q.correct : [q.correct];
    if (!q.correct || correctVals.length === 0 || !correctVals.every(c => VALID_ID_CLASSES.has(c)))
                                       err(loc, `id: "correct" must be r/c/i/g (or array thereof), got ${JSON.stringify(q.correct)}`);
    if (!q.highlight || !q.highlight.text)
                                       err(loc, 'id: missing "highlight.text"');
    if (!q.name)                       warn(loc, 'id: missing "name" (full IUPAC name)');

  } else if (q.type === 'drag') {
    if (!q.ans)                        err(loc, 'drag: missing "ans"');
    if (!Array.isArray(q.slots) || q.slots.length === 0)
                                       err(loc, 'drag: "slots" must be a non-empty array');
    if (!Array.isArray(q.tokens) || q.tokens.length === 0)
                                       err(loc, 'drag: "tokens" must be a non-empty array');

  } else if (q.type === 'build') {
    if (!q.buildKey)                   err(loc, 'build: missing "buildKey"');
    else if (!(q.buildKey in MOLDES))  err(loc, `build: buildKey "${q.buildKey}" not found in MOLDES`);
  }
});

// ── NIVEL_TOPICS cross-check ─────────────────────────────────────────────────
if (NIVEL_TOPICS) {
  const topicsInQuestions = new Set(QBANK.map(q => q.topic).filter(Boolean));
  const topicsInLevels = new Set(
    Object.values(NIVEL_TOPICS)
      .filter(Array.isArray)
      .flat()
  );
  for (const t of topicsInQuestions) {
    if (!topicsInLevels.has(t) && t !== 'constructor') {
      warn('NIVEL_TOPICS', `topic "${t}" used in questions but not mapped in any NIVEL_TOPICS entry`);
    }
  }
}

// ── Summary ──────────────────────────────────────────────────────────────────
// Use Object.create(null) to avoid prototype collisions (e.g. "constructor" key)
const topicCounts = Object.create(null);
QBANK.forEach(q => {
  const k = q.topic || 'unknown';
  topicCounts[k] = (topicCounts[k] || 0) + 1;
});
const typeCounts = Object.create(null);
QBANK.forEach(q => {
  const k = q.type || 'unknown';
  typeCounts[k] = (typeCounts[k] || 0) + 1;
});

console.log(`\n── ChromaNom QBANK Validation ──────────────────────────────`);
console.log(`   Source:  ${htmlPath}`);
console.log(`   Total questions: ${QBANK.length}`);
console.log(`   By type:  ${Object.entries(typeCounts).map(([t,n])=>`${t}=${n}`).join('  ')}`);
console.log(`   By topic: ${Object.entries(topicCounts).sort((a,b)=>b[1]-a[1]).map(([t,n])=>`${t}=${n}`).join('  ')}`);
console.log(`   MOLDES entries: ${Object.keys(MOLDES).length}`);
console.log(`─────────────────────────────────────────────────────────────`);

if (errors === 0 && warnings === 0) {
  console.log('   ✓  All checks passed — no errors or warnings.\n');
  process.exit(0);
} else {
  if (errors > 0)   console.log(`\n   ${errors} error(s) found above.`);
  if (warnings > 0) console.log(`   ${warnings} warning(s) found above.`);
  console.log('');
  process.exit(errors > 0 ? 1 : 0);
}
