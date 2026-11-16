---
name: chromanom-estructuras
description: Estilo obligatorio del docente para mostrar cualquier fórmula o estructura de química orgánica (alcanos, alquenos, alquinos, alcoholes, aldehídos, cetonas, ácidos, ésteres, éteres, aminas, haluros, isómeros, reacciones) en cualquier respuesta, documento, guía, taller, evaluación, presentación, página web o código. Úsala SIEMPRE que vayas a escribir o dibujar una fórmula orgánica, aunque el usuario no lo pida, para dibujarla semidesarrollada con todos sus enlaces (nunca con ramas entre paréntesis) usando el motor de ChromaNom.
---

# Estructuras químicas al estilo ChromaNom

El usuario es docente de química en Colombia. Todo lo que hagas para él
(respuestas en el chat, documentos, guías, talleres, evaluaciones, páginas web,
código) debe mostrar las fórmulas orgánicas como en un libro de texto y como
las dibuja el generador de ChromaNom.

## Regla 1 — nunca ramas entre paréntesis

Al estudiante NUNCA se le muestra una fórmula con ramas entre paréntesis:
nada de `CH₃−CH(CH₃)−CH₃`, `(CH₃)₃C−OH`, `C(CH₃)₄`, `CH₃CH(OH)CH₃`.
Solo hay dos formas permitidas:

1. **Semidesarrollada mostrando todos sus enlaces**: cadena principal en
   horizontal; cada rama cuelga de su carbono con su enlace dibujado (una
   hacia abajo y, si hay otra, hacia arriba). Doble enlace = dos rayas,
   triple = tres. El C=O de aldehídos, cetonas, ácidos y ésteres se dibuja
   con el O arriba y doble raya; el −OH del ácido va abajo.
2. **Fórmula molecular** (C₄H₁₀, C₂H₆O…) cuando solo importa la composición.

Excepciones: complejos y reactivos inorgánicos que la IUPAC escribe así
(Ag(NH₃)₂⁺ de Tollens, Pb(OAc)₂…) y paréntesis que no son de una fórmula
(«(1-metilpropil)», aclaraciones del texto).

Usa siempre subíndices reales (CH₃, no CH3) y la raya «−» para los enlaces
de una cadena escrita en línea (solo cuando no tenga ramas: CH₃−CH₂−OH).

## Cómo dibujarlas: el script `scripts/dibujar.js`

Es el mismo motor de `generador.html` de ChromaNom. Recibe la fórmula
condensada (los paréntesis de la ENTRADA solo describen dónde va cada rama;
el dibujo NO los muestra) y devuelve un SVG:

```bash
node scripts/dibujar.js "CH3-CH(CH3)-CH2-OH" metilpropanol.svg
node scripts/dibujar.js "CH2=CH-CH2-CHO"            # imprime el SVG
node scripts/dibujar.js "CH3-CO-CH2-COOH" ceto.svg
node scripts/dibujar.js "CH3-CH(Cl)-C#CH" x.svg     # # = triple enlace
node scripts/dibujar.js "CH3-C(CH3)(CH3)-CH3" neo.svg  # dos ramas: abajo y arriba
```

- Enlaces: `-` sencillo, `=` doble, `#` triple.
- Grupos que entiende: `COOH`, `CHO`, `COO` (éster), `CO` (cetona), `OH`,
  `O` (éter), `NH2`, `NH`, `Cl`, `Br`, `F`, `I`; ramas `(CH3)`, `(OH)`, `(Cl)`…
- Máximo dos ramas de un átomo por carbono (una abajo, una arriba).
- Ramas largas (etilo, propilo…) o casos raros: pasar la cadena en JSON,
  un objeto por átomo de la cadena principal:
  `node scripts/dibujar.js --json '[{"h":3,"bn":1},{"h":1,"bn":1,"bd":[{"h":2,"bn":1},{"h":3}]},{"h":3}]'`
  (`h` = hidrógenos, `s` = símbolo si no es C, `bn` = enlace con el siguiente,
  `bd`/`bu` = rama hacia abajo/arriba, `buBn`/`bdBn` = orden del enlace de la rama).
- Si no hay `node`, o la molécula tiene anillos (benceno, ciclohexano…),
  dibuja el SVG a mano con el mismo estilo: líneas `#1a2a3a` de 1.6 px,
  texto en negrilla monoespaciada de 13 px, C/H en `#0d2d42`, O en `#c8230a`,
  N en `#0033aa`, Cl en `#1a7a1a`, Br en `#8b1a1a`, F en `#3366aa`;
  benceno como hexágono con círculo o con dobles enlaces alternos.

## Dónde poner el dibujo según el formato

- **Chat / artefacto / página HTML**: inserta el SVG directamente.
- **Word, PDF, PowerPoint**: convierte el SVG a PNG (por ejemplo con
  Playwright, `rsvg-convert` o `cairosvg`) a buena resolución e insértalo
  como imagen.
- **Si no se puede dibujar** (respuesta en texto plano sin imágenes):
  usa la fórmula molecular o una semidesarrollada en varias líneas con
  los enlaces visibles, por ejemplo:

```
CH₃ − CH − CH₃
      |
      CH₃
```

  pero nunca `CH₃−CH(CH₃)−CH₃`.

## Método de 4 colores (nomenclatura)

Cuando se analice o se coloree un nombre IUPAC, usar los colores de ChromaNom:
① Sustituyentes `#0891b2` (azul) · ② Cadena principal `#166534` (verde) ·
③ Insaturación `#b45309` (naranja) · ④ Grupo funcional `#CC79A7` (rosado;
para texto sobre fondo blanco usar `#9a4a78`).

## Antes de entregar

Revisa que en lo que vas a entregar no quede ninguna fórmula orgánica con
ramas entre paréntesis (busca `(CH`, `(OH)`, `(Cl)`, `)₂`, `)₃`).
