#!/usr/bin/env node
/* actualizar.js — copia los compuestos del banco de IonNom (banco.js) a datos/compuestos.json.
   Uso: node scripts/actualizar.js <carpeta del repositorio ionom> */
'use strict';
const fs = require('fs'), path = require('path'), vm = require('vm');
const dir = process.argv[2]; if (!dir) { console.log('Uso: node scripts/actualizar.js <carpeta ionom>'); process.exit(1); }
const c = {}; vm.createContext(c);
vm.runInContext(fs.readFileSync(path.join(dir, 'banco.js'), 'utf8') + ';this.__B = BANCO;', c);
const vistos = new Set();
const compuestos = c.__B.filter(x => x.formula && x.trad).map(x => ({ formula: x.formula, group: x.group, level: x.level, trad: x.trad || [], stock: x.stock || [], sist: x.sist || [], hint: x.hint || '' }))
  .filter(x => { const k = x.formula + '|' + x.group; if (vistos.has(k)) return false; vistos.add(k); return true; });
fs.writeFileSync(path.join(__dirname, '..', 'datos', 'compuestos.json'), JSON.stringify({ fecha: new Date().toISOString().slice(0, 10), compuestos }));
console.log(`Listo: ${compuestos.length} compuestos de IonNom.`);
