# Informe experto Saber 11 / Icfes — lote icfes-chr-2 (ChromaNom: haluros, alcoholes, carbonilos, ácidos)

## Resumen
- Revisé 160 preguntas. Las resolví primero a ciegas y coincidí con la clave en las 160. En 8 ítems de estructura dibujada el archivo ciego no traía la figura; la consulté en `docente-datos.js` (campo `f`), no en la clave.
- No hay errores científicos, claves incorrectas, dos respuestas correctas ni datos que contradigan la clave. Revisé los datos de tablas y gráficas: pKa, constantes de hidratación, GWP/ODP, proporción SN2/E2, Zaitsev/Hofmann, puntos de ebullición, inflamación y Henderson-Hasselbalch. Todos son coherentes con la literatura.
- `ev` y `nd` quedaron completos para los 160 ítems.

## Hallazgos (20)
| Gravedad | N.° | Tipo |
|---|---|---|
| Alta | 0 | — |
| Media | 17 | 14 etiquetas `c`/`af` mal puestas; 3 ítems con fórmulas con ramas entre paréntesis (alcoholes 8eysh1 y qzwba3, carbonilos 15ytztu) |
| Baja | 3 | distractores triviales (acidos 1dhrff6, 42wuun), ítem repetido (acidos 1f45isj) |

## Patrones
1. **CTS o salud marcados como E1.** Los CFC, los HFC, el metanol (2 ítems) y el formol corresponden a E3 (evidencias 1.1, 1.2 y 1.3).
2. **Reconocer un tipo de reacción o nombrar un concepto** está marcado como explicación. Es el caso de la sustitución nucleofílica, la síntesis de Williamson, la quimioselectividad, la amida del nailon y la convención del localizador del −CHO. Corresponde a uso, I2, evidencia 4.6/4.8.
3. **«¿Qué tendencia muestran los datos?»** marcado N2. Corresponde a N4 (8.1). A la inversa, «¿Cómo se explica la disminución?» marcado N4 corresponde a E1.
4. **Redundancia.** Varios ítems repiten casi la misma tarea con los mismos datos:
   - punto de ebullición del ácido etanoico frente al propan-1-ol (3);
   - solubilidad de alcoholes contra la longitud de la cadena (5);
   - prueba del bicarbonato con CO₂ (4);
   - por qué las cetonas no se oxidan (3);
   - punto de ebullición del alcohol frente al éter (3);
   - pKa de los ácidos cloroacéticos (2).

   Los dos ítems de pKa no coinciden en el valor del dicloroacético (1,29 frente a 1,35 en la gráfica): conviene unificarlo en 1,29. Hay que evitar que salgan juntos en la misma evaluación.
5. **Ítems de uso de nivel 1 muy directos.** La glicerina ya da «1,2,3-triol» en el nombre, el ácido oxálico «HOOC−COOH» y el ácido cítrico «tres grupos −COOH». Son válidos como nivel 1, pero aportan poca discriminación.
6. **Nomenclatura.** Unas preguntas se marcan I1 y otras I2. No lo cambié porque ambas son defendibles (5.6 o 4.8), pero convendría unificar el criterio.
7. **Reparto por nivel:** cerca del 30 % es de nivel 1, 40 % de nivel 2, 25 % de nivel 3 y 5 % de nivel 4. Faltan ítems de nivel 4 frente a la guía (~30 %).

## Limitaciones
No cambié `dba`/`curso`. Todo el contenido corresponde a 11.° (química orgánica, DBA 11.4). Las preguntas de ácidos también citan el 9.2, lo que es razonable.
