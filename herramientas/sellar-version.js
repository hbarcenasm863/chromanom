#!/usr/bin/env node
// Actualiza la versión y la fecha que se ven en el pie de todas las páginas.
// Uso:  node herramientas/sellar-version.js v1.1.0 "20 de diciembre de 2026"
// Después: anotar el cambio en CHANGELOG.md y, si cambiaron archivos locales,
// subir CACHE en sw.js y el ?v= de las páginas.
const fs = require('fs'), path = require('path');
const [ver, fecha] = process.argv.slice(2);
if (!ver || !fecha) { console.error('Uso: node herramientas/sellar-version.js v1.1.0 "20 de diciembre de 2026"'); process.exit(1); }
const raiz = path.join(__dirname, '..');
let n = 0;
for (const f of fs.readdirSync(raiz).filter(f => f.endsWith('.html'))) {
  const p = path.join(raiz, f);
  const s = fs.readFileSync(p, 'utf8');
  const t = s.replace(/(<span data-pie-ver[^>]*>)[^<]*(<\/span>)/g, `$1${ver}$2`)
             .replace(/(<span data-pie-fecha[^>]*>)[^<]*(<\/span>)/g, `$1${fecha}$2`);
  if (t !== s) { fs.writeFileSync(p, t); n++; }
}
console.log(`Pie actualizado en ${n} páginas: ${ver} · ${fecha}`);
