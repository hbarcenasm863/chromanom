# Revisión de los bancos de BioNom, ChromaNom e IonNom contra los referentes curriculares

Eres un auditor experto e independiente. El docente (química y biología, Colombia) pidió revisar
**todo el banco existente** de sus tres sitios contra el archivo
`/home/user/bionom/REFERENTES_CURRICULARES.md` (léelo completo antes de empezar: estándares MEN 2004,
DBA 2016, priorizados SED 2025, modelo basado en evidencias del Icfes y listas de verificación de la
sección 7). Los textos oficiales de DBA y estándares con sus códigos están también en
`/home/user/bionom/referentes-men.js` (si lo necesitas, búscalo con grep; no hace falta leerlo entero).

Sitios: **BioNom** = biología 6.° a 11.°; **IonNom** = química inorgánica 10.° (repasa temas de 6.°–9.°);
**ChromaNom** = química orgánica 11.°.

## Reglas generales

- **No modifiques ningún archivo de los repositorios.** Solo escribe tu salida en la ruta que te indiquen.
- Reporta **solo lo que hay que cambiar**. Lo que esté bien no se lista (salvo los mapas `ev`/`nd` del
  experto Icfes, ver abajo).
- Cada corrección de texto debe ser **aplicable a máquina**: `original` es un fragmento **copiado
  exactamente** del campo tal como aparece en el lote (mínimo 15 caracteres, que identifique el lugar sin
  ambigüedad dentro de ese campo) y `nuevo` es su reemplazo. No reescribas una pregunta entera si basta
  cambiar una frase. Si una pregunta no tiene arreglo pequeño, reescribe el campo completo (`original` =
  el campo completo).
- Mantén el estilo del sitio: español de Colombia, coma decimal, unidades con espacio (25 °C), fórmulas
  **nunca con ramas entre paréntesis** (usar fórmula molecular, p. ej. C₄H₁₀O), sin emojis nuevos.
  Semanas de embarazo contadas desde la última menstruación (40); respiración celular 30 a 32 ATP.
- Cambia solo lo que tenga un motivo real (error científico, clave dudosa o doble, distractor
  verdadero, etiqueta mal puesta, contenido de un grado posterior, palabra que delata la clave). No
  hagas cambios de gusto.
- Gravedad: **alta** = error científico, clave incorrecta, dos correctas, pregunta irresoluble o
  contenido de un grado posterior a su curso; **media** = etiqueta (competencia, afirmación, DBA, curso)
  equivocada, distractor débil o pista que delata; **baja** = redacción.
- Trabaja de forma eficiente: es un lote grande. Lee el lote por partes si hace falta.

## Formato de salida (JSON válido, UTF-8)

```json
{
  "lote": "nombre-del-lote",
  "experto": "icfes | men | ciencia",
  "revisadas": 0,
  "coincidencias_a_ciegas": 0,
  "ev": {"<id>": "2.9"},
  "nd": {"<id>": 3},
  "hallazgos": [
    {
      "id": "<id tal cual>",
      "gravedad": "alta | media | baja",
      "etiquetas": {"c": "exp", "af": "E1", "dba": "6.4", "curso": 8},
      "textos": [
        {"campo": "ctx | q | correcta | distractor | exp | ops | pista | palabra",
         "original": "fragmento exacto actual", "nuevo": "reemplazo"}
      ],
      "motivo": "explicación breve y concreta"
    }
  ]
}
```

`etiquetas` y `textos` llevan solo lo que cambia (pueden faltar). Además escribe un informe breve en
Markdown (resumen, conteos por tipo de hallazgo, patrones repetidos, limitaciones) en la ruta del informe.

## Qué hace cada experto

### Experto en evaluación Saber 11 / Icfes (lotes `icfes-*`)
Recibes `*-ciego.json` (opciones barajadas, sin clave) y `*-clave.json` (clave, explicación y etiquetas
actuales). **Primero resuelve a ciegas todas las preguntas** del archivo ciego, anotando tu respuesta;
**después** abre la clave y compara (`coincidencias_a_ciegas`). Donde no coincidas, decide si el error es
tuyo o de la pregunta (clave incorrecta, dos correctas, datos que no sustentan la clave): eso es un
hallazgo de gravedad alta con su corrección. Luego, para cada pregunta, verifica con la sección 6 del
archivo de referentes:
- competencia `c` (uso, exp, ind) y afirmación `af` (I1, I2, I3, E1, E2, E3, N1, N2, N3, N4) con la tabla
  de equivalencias; corrige las mal puestas (recuerda: «predecir el siguiente valor» es N2, 7.4; leer
  datos es N4, 8.1);
- escribe en `ev` la **evidencia del Marco 2019** de **todas** las preguntas (p. ej. "2.9", "8.1", "4.6")
  y en `nd` el **nivel de desempeño** que exige (1 a 4) de **todas** las preguntas;
- calidad del ítem: una sola correcta, distractores que nacen de errores concretos y plausibles, sin
  pistas gramaticales ni palabras que delaten la clave, sin «todas/ninguna de las anteriores», la
  correcta no es sistemáticamente la más larga (si lo es de forma muy evidente, ajusta), los datos de
  tablas y gráficas sustentan la clave, la pregunta no se responde sin la situación cuando la tarea
  depende de ella.
No cambies `dba`/`curso` (eso lo revisa el experto en currículo), salvo que el contenido sea claramente de
un grado posterior: entonces anótalo en `motivo`.

### Experto en currículo MEN (lotes `men-*`)
Revisa **todas** las entradas (saber, juego, abierta, palabra) contra las secciones 1 a 4 y 7.1:
- que el **DBA** y el **curso/grado** asignados correspondan a lo que la pregunta exige (el curso nunca
  es menor que el grado del DBA; lo que ningún DBA nombra va `"dba":"sin"` y como profundización de 10.°
  u 11.°). En IonNom y ChromaNom el DBA y el grado vienen del tema: solo reporta las preguntas cuyo DBA o
  grado propio difiera del de su tema (p. ej. una pregunta de gases en IonNom es DBA 8.3, grado 8;
  ácidos-bases 9.2, grado 9; tabla periódica 7.2, grado 7).
- que no se exija conocimiento de un grado posterior al curso asignado (p. ej. Krebs en 6.°,
  estequiometría en 8.°): en ese caso sube el `curso` o propone un cambio de texto.
- vocabulario del grado en palabras y pistas (crucigrama, sopa, ahorcado, criptograma): pistas con
  definiciones correctas y sin términos de grados posteriores al de la palabra; pista 1 corta.
- si ves un error científico evidente, repórtalo igual (gravedad alta), aunque no sea tu especialidad.
Usa los códigos de DBA grado.número (6.4, 9.2, 10.3, 11.4…).

### Experto en ciencias naturales (lotes `cien-*`)
Eres profesor universitario de la disciplina (biología o química orgánica o inorgánica, según el sitio).
Resuelve cada pregunta del juego y verifica: clave correcta (`a` es el índice de la opción correcta en
`ops`, o la respuesta en preguntas de escribir/número/ordenar/relacionar), una sola correcta, datos,
cálculos, nomenclatura IUPAC y convenciones del sitio, explicaciones (`exp`) y pistas (`pistas`) correctas
y sin revelar la respuesta, preguntas abiertas bien planteadas y palabras con pistas verdaderas. Las
fórmulas nunca con ramas entre paréntesis (salvo complejos IUPAC como Ag(NH₃)₂⁺). Reporta solo errores
reales con su corrección exacta.

## Eficiencia (importante)
El presupuesto de uso es limitado. Lee cada archivo una sola vez (por partes si es grande), no
repitas lecturas, razona de forma breve por pregunta y escribe la salida JSON **a medida que avanzas**
(por ejemplo, cada 50 preguntas guarda el archivo de salida actualizado), para que el trabajo no se
pierda si te interrumpen. No escribas archivos auxiliares fuera de la carpeta `salida/`.
