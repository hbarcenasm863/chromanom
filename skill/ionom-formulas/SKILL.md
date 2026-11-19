---
name: ionom-formulas
description: "Estilo obligatorio del docente para escribir fórmulas, nombres y ecuaciones de química inorgánica (óxidos, anhídridos, hidruros, hidróxidos, ácidos hídricos y oxácidos, sales binarias, oxisales y sales ácidas; iones, cargas, estados de oxidación, ecuaciones, balanceo y masa molar) en cualquier respuesta, guía, taller, evaluación, presentación, página web o código, como lo hace su sitio IonNom: subíndices y cargas reales, nombres tradicional, Stock y sistemático con las convenciones del sitio y el código de 4 colores (catión ámbar, anión azul, OH⁻ rosado, oxoanión verde). Úsala SIEMPRE que vayas a escribir o revisar una fórmula o un nombre inorgánico o una ecuación química, aunque el docente no lo pida."
---

# Fórmulas y nombres inorgánicos al estilo IonNom

El usuario es **docente de química en Colombia** (hombre: «el docente»). Su sitio **IonNom**
enseña nomenclatura inorgánica en 10.°. Todo lo que hagas para él debe escribir las fórmulas y los
nombres **igual que IonNom**, para que el estudiante vea lo mismo en clase, en el sitio y en las
hojas. Esta skill trae los 552 compuestos del banco de IonNom (`datos/compuestos.json`) y un
programa (`scripts/formula.js`) que nombra, formula, colorea, balancea y calcula masas.

## Regla 1: primero el banco de IonNom

Los nombres que el estudiante practica en el sitio salen del banco. Por eso, antes de escribir un
nombre, búscalo:

```bash
node scripts/formula.js nombrar "Fe2(SO4)3"              # nombres en los 3 sistemas, tipo, partes y la pista del sitio
node scripts/formula.js formular "óxido de hierro (III)"  # nombre → fórmula (acepta los tres sistemas)
node scripts/formula.js buscar "cobalto"                  # todos los compuestos del banco que lo nombran
node scripts/formula.js iones                             # cationes, aniones, oxoaniones y sus ácidos
```

La fórmula se puede escribir con números normales (`Fe2(SO4)3`) o con subíndices. Si el compuesto
no está en el banco, el programa lo calcula con las mismas reglas y dice **«calculado: revisar»**;
dilo así al docente. Si avisa que una valencia no existe (por ejemplo Fe⁵⁺), la fórmula está mal.

## Regla 2: cómo se escriben

- **Subíndices y cargas reales**: Fe₂(SO₄)₃, SO₄²⁻, Fe³⁺, NH₄⁺ (nunca Fe2(SO4)3, SO4 2-, Fe+3).
  `node scripts/formula.js formato "SO4^2-"` → SO₄²⁻. La carga va con el número primero (²⁺, ³⁻) y
  el «1» no se escribe (Na⁺, Cl⁻).
- **Paréntesis solo para iones poliatómicos repetidos**: Ca(OH)₂, Fe₂(SO₄)₃, (NH₄)₂SO₄. Son
  correctos en inorgánica (la regla de «nunca paréntesis» es de la química orgánica de ChromaNom).
  Si el ion no se repite, sin paréntesis: NaOH, NH₄Cl, CaSO₄.
- **Estado de oxidación**: IonNom dice «EO» o «valencia»: EO = +3, valencia +3.
- **Ecuaciones**: flecha «→», coeficiente separado por un espacio (2 H₂ + O₂ → 2 H₂O), estados
  entre paréntesis después de la fórmula si hacen falta: (s), (l), (g), (aq).
  `node scripts/formula.js ecuacion "Fe + O2 -> Fe2O3" --balancear` balancea y muestra el conteo
  de átomos de cada lado, útil para la clave o la explicación.
- **Masa molar** con coma decimal: `node scripts/formula.js masa "Ca(OH)2"` usa las masas de
  IonNom (H = 1,008; O = 15,999…) y también da el valor con masas redondeadas a enteros.

## Regla 3: los tres sistemas, como en IonNom

| Sistema | Cuándo se usa | Ejemplos de IonNom |
|---|---|---|
| **Tradicional** | Siempre. Valencia variable: **-oso** (menor) / **-ico** (mayor). Oxoácidos y oxisales: hipo-…-oso / -oso / -ico / per-…-ico y hipo-…-ito / -ito / -ato / per-…-ato | óxido ferroso, óxido férrico, ácido hipocloroso, perclorato de potasio |
| **Stock** | Solo si el metal tiene **más de una valencia**: número romano entre paréntesis **con un espacio antes** | óxido de hierro (III), cloruro de cobre (I). Con valencia fija no se usa: «óxido de sodio» |
| **Sistemática** | Prefijos di-, tri-, tetra-, penta-… según los átomos. En compuestos con metal no se escribe «mono-» | trióxido de dihierro, óxido de hierro (FeO), dicloruro de cobre, monóxido de dicloro (Cl₂O) |

Convenciones del sitio que hay que respetar:
- **Anhídridos**: en Colombia los óxidos de no metal se llaman «anhídridos» u «óxidos ácidos»;
  IonNom usa los dos (anhídrido carbónico = dióxido de carbono). Los óxidos de metal son
  «óxidos básicos».
- **Sales ácidas**: tradicional con bi- o «monoácido/diácido» (bicarbonato de sodio, fosfato diácido
  de sodio); Stock con hidrogeno- (hidrogenocarbonato de sodio, dihidrogenofosfato de sodio).
- **Ácidos hidrácidos**: ácido clorhídrico (en disolución) = cloruro de hidrógeno (gas o puro).
- **No mezclar sistemas**: «tricloruro de hierro (III)» está mal. Los prefijos son solo de la
  sistemática; los romanos, solo de Stock.
- Algunas oxisales del banco no traen el nombre Stock; el programa lo completa y lo marca
  «[calculado]» (sulfato de hierro (III)).

## Regla 4: el código de 4 colores

IonNom colorea cada parte del compuesto con la paleta Okabe-Ito (se distingue con daltonismo):

| Parte | Color | Borde | Fondo | Texto |
|---|---|---|---|---|
| Catión (metal, NH₄⁺, H⁺ de los ácidos) | ámbar | #E69F00 | #fcf2db | #8a5f00 |
| Anión simple (-uro, óxido) | azul | #0072B2 | #dbebf4 | #00659e |
| Grupo OH⁻ (hidróxido) | rosado | #CC79A7 | #f8ecf3 | #8d5373 |
| Oxoanión (sulfato, nitrato…) | verde | #009E73 | #dbf1eb | #007253 |

Úsalo en guías, presentaciones y hojas cuando el tema sea nomenclatura, sobre todo al «desarmar» un
compuesto en sus partes:

```bash
node scripts/formula.js colorear "Fe2(SO4)3"                       # HTML con colores + leyenda
node scripts/formula.js colorear "Fe2(SO4)3" --svg fe.svg --png fe.png   # imagen para Word, PDF o diapositivas
```

En una hoja hecha con la skill `nom-hoja-referencia`, las clases `cat`, `an`, `oh` y `ox` ya traen
estos colores. Los anhídridos (enlace covalente) salen en gris: no tienen iones.

## Sin Node

Lee `datos/compuestos.json` (campos `formula`, `group`, `trad`, `stock`, `sist`, `hint`) con otra
herramienta y aplica las reglas de esta página a mano.

## Actualizar el banco

Con el repositorio de IonNom descargado: `node scripts/actualizar.js <carpeta ionom>`.
