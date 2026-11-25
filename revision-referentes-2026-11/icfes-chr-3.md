# Informe experto Saber 11 / Icfes — lote icfes-chr-3 (ChromaNom: nitrogenados, polifuncionales, isomería, reacciones, carbono)

## Resumen
- Revisé 198 preguntas. Las resolví primero a ciegas y coincidí con la clave en 197. Las 5 de estructura dibujada (nitrogenados 1xurxap y 2wr0fh, polifuncionales 1xurxap y 1be3em2, carbono ozbkw0) las resolví con el campo `f` de `docente-datos.js`: todas coinciden.
- Única discrepancia: isomeria|8suo00 (ciclopropano y propeno). La clave dice «De función»; yo marqué «De cadena». Es clave dudosa (alta).
- Datos de tablas y gráficas verificados contra literatura (pKa, pKb, pI, puntos de ebullición y fusión, viscosidades, energías de enlace, calores de combustión, rotaciones específicas, valores de la valoración de glicina): sin errores.
- `ev` y `nd` completos para las 198.

## Hallazgos (36)
| Gravedad | N.° | Tipo |
|---|---|---|
| Alta | 1 | clave dudosa (isomeria|8suo00) |
| Media | 27 | 26 etiquetas `c`/`af` mal puestas; 1 distractor/clave con error conceptual (esterificación con H₂SO₄, gráfica) |
| Baja | 8 | opción correcta evidentemente la más larga |

## Patrones
1. **Nomenclatura y tipo de reacción marcados como explicación.** Reconocer el tipo de reacción (46, 135, 137, 142) y aplicar la prioridad IUPAC (44, 51, 54, 59) son uso (4.6 y 4.8). Se unifica con los ítems hermanos que ya eran I2 (55, 167).
2. **CTS mal usado.** 56 (nomenclatura de los −OH) y 95 (empaquetamiento cis/trans) estaban en E3; 2 (yuca) estaba en uso y es CTS. 27 (limón) estaba en E3 y es E1.
3. **Indagación.** «Qué explicación es coherente» es 9.1 (N3); «qué comparación/propiedad/variable» es diseño (9.2, N3); «qué relación muestra la tabla» es 8.1 (N4); predecir el siguiente valor es 7.4 (N2, ítem 126); contrastar una predicción con una observación aislada es 9.5 (N3).
4. **Longitud de la clave.** La correcta es la opción más larga en 117 de 198 ítems (59 %). En 25 la diferencia supera el 30 %. Acorté 8 de los más evidentes (6, 19, 95, 101, 148, 160, 162, 170). Conviene revisar el resto al regenerar el banco.
5. **Redundancia.** Casi iguales: 137 y 167 (ruptura homolítica); 117 y 122 (isómeros del C₅H₁₂ con la misma tendencia); 63 y 68 (glicina, ion dipolar); 48 y 60 (glucosa y hexano); 7, 18 y 26 (par libre del N deslocalizado); 100 y 121 (limoneno); 8 de «¿qué tipo de isómeros son?». No ponerlos juntos en una misma evaluación.
6. **Reparto por nivel (`nd`):** 25 de nivel 1, 87 de nivel 2, 75 de nivel 3, 11 de nivel 4 (5,6 %). Faltan ítems de nivel 4 frente a la guía (~30 %); la mayoría de los ítems del lote son de uso y de reconocimiento.
7. **Competencia.** Tras las correcciones: uso 87, explicación 60, indagación 51 (aprox.); la indagación con datos de tabla o gráfica está bien cubierta.

## Limitaciones
- Fórmulas con ramas entre paréntesis, p. ej. (CH₃)₃N (nitrogenados 1efwpnx), CH₃−CH(OH)−CH₃, (CH₃)₃C−OH, CH₂=C(CH₃)−CH₃, CH₃−CH(NH₂)−COOH, aparecen en enunciados y opciones de unas 15 preguntas. No las reescribí porque la pregunta depende de ver la estructura (p. ej. carbono quiral); confío en que `fxAuto` las dibuje. Hay que verificar en pantalla que también convierte las opciones.
- Pregunta 53 (polifuncionales klnzw5): «es una cetona» es la mejor opción, pero un carbonilo que no da Tollens también podría ser éster o amida; se acepta para el grado.
- El archivo de clave no trae `exp`; la corrección de 8suo00 pide que se reescriba su explicación.
- No revisé `dba` ni `curso` (tarea del experto MEN); nada del lote exige un grado posterior a 11.°.
