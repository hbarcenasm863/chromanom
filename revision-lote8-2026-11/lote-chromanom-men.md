# Auditoría Currículo MEN + resolución a ciegas del químico - lote ChromaNom nivel 4 (12 preguntas)

Referencia: REFERENTES_CURRICULARES.md (secciones 1, 2, 7) y tabla tema -> DBA de banco-sel-cfg.js. Todas son de 11.° (curso 11), vocabulario del grado correcto (carbocatión, resonancia, carboxilato, momento dipolar, equilibrio). Ningún contenido exige un grado posterior. Textos sin cambios.

## Paso adicional: resolución a ciegas de las preguntas reescritas por el auditor Icfes (1, 6, 7, 12)
Resultado: ninguna con gravedad alta. La clave (primera opción) es la única correcta y los datos son correctos en las cuatro.
- P1: respondí la opción 1 (isómeros etanol y dimetil éter, 78 y -24 °C: diferencia 102 °C, «más de 100 °C» es cierto). Opción 2 falsa (diferencia de 120 °C con el propano), opción 3 falsa (éter solo 18 °C sobre el propano, no «mucho»), opción 4 falsa (misma fórmula y masa). Datos reales (CRC): 78,4; -24,8; -42,1.
- P6: respondí la opción 1 (ensayos 1-2 y 1-3 cambian una sola variable, 40 a 20 min; el 4 baja a 10). Opción 2 no aísla variables, opción 3 reparte sin poder, opción 4 es cierta en lo numérico pero la inferencia sobre la concentración es falsa. Única correcta. Baja: con éster y NaOH iguales a 0,10 mol/L, la cinética real de segundo orden no daría exactamente la mitad al duplicar el NaOH (daría cerca del 40 %); es «Datos de ejemplo», no afecta la clave. Opcional: no tocar.
- P7: respondí la opción 1. Datos verificados: etanol miscible con agua y hexano; 1-hexanol 0,6 g/100 mL en agua (valor real ~0,59); glicerol miscible en agua e insoluble en hexano; 1-butanol ~7 g/100 mL (real 7 a 8), «solo en parte» es correcto. Opciones 2, 3 y 4 falsas (la 3 predice 1-butanol miscible: falso; la 4 niega puentes de hidrógeno del hexanol: falso). Única correcta.
- P12: respondí la opción 1 (acetanilida queda en el éter; al acidificar precipita ácido benzoico). Opción 2 falsa (HCl protona el benzoato), 3 invierte el comportamiento ácido-base, 4 contradice el primer lavado. Tabla coherente. Única correcta.

## Referentes por pregunta (curso 11 en todas)
Se cambió el campo `dba` en 1, 7, 8 y 11. Las demás quedan igual. El resto de información (estándar, priorizado) no tiene campo en el lote: va aquí para el historial.

1. (media) tema alcoholes, dba cambiado de 11.4 a **9.3**. La tarea compara puntos de ebullición de isómeros y masa molar; el 11.4 nombra alcoholes con pruebas químicas y nomenclatura, no propiedades físicas. 9.3 ev. 4 (fuerzas intermoleculares y propiedades) sí. Estándar: EFQ-12 y EG-2. Priorizado SED 11 (Químico, Uso): polaridad y reactividad; construcción del conocimiento (interpretar datos). Sugerencia: pasar el tema a `propiedades`; si se deja en `alcoholes`, el banco hereda 11.4 de banco-sel-cfg.js.
2. (ok) 11.4 (mecanismos heterolíticos; adición al doble enlace). Estándar EFQ-4 (modelos) y EFQ-9 (velocidad). Priorizado Químico, Exp: reacciones heterolíticas.
3. (ok) 11.4 (homólisis; halogenación por radicales). Estándar EFQ-4 y EFQ-11. Priorizado Químico, Exp: reacciones homolíticas; construcción: comparar datos con el azar.
4. (ok) 11.4 ev. 2 (aldehídos y cetonas con pruebas químicas, Tollens). El yodoformo y la 2,4-DNFH no están en el DBA pero son pruebas del mismo tipo. Estándar EFQ-12. Priorizado Químico, Uso: grupos funcionales.
5. (ok, nota baja) 11.4 (esterificación). El equilibrio como modelo ningún DBA de 11.° lo nombra; el estándar EFQ-10 (equilibrio) y EFQ-9 sí. No agregar 9.2 que sugiere el tema `acidos`: la pregunta no trata acidez. Priorizado Químico, Uso: sustitución y adición, grupos funcionales.
6. (ok) 11.4 ev. 3 (temperatura y rapidez/energía de reacciones) más EFQ-9 y EFQ-6. Priorizado: construcción del conocimiento (variables, margen de error, 11.°).
7. (media) tema propiedades, dba cambiado de 11.4 a **9.3 y 8.2**, como manda banco-sel-cfg.js (propiedades: 9.3 ev. 4 puentes de hidrógeno y propiedades; 8.2 ev. 4). 11.4 no nombra solubilidad. Estándar EG-2 y EFQ-12. Priorizado Químico, Uso: polaridad.
8. (media) tema isomeria, dba cambiado de 11.4 a **sin**. Ningún DBA nombra isomería geométrica ni empaquetamiento cristalino (cfg: dba vacío, solo cercano 11.4 ev. 1); 9.3 solo cubre propiedades de líquidos, no del sólido. Es profundización de 11.°. Estándar EFQ-11, EFQ-12 y EG-2.
9. (baja) 11.4 se conserva por herencia del tema biomoleculas (proteínas), pero el DBA solo nombra clasificar biomoléculas con pruebas químicas; la desnaturalización por temperatura no está nombrada. Estándar EFQ-13 (cambios químicos en el ser humano) y EFQ-6 (efecto de la temperatura). Priorizado Químico, Uso: biomoléculas en el metabolismo; indagación con datos. No hace falta cambiar.
10. (ok) 11.5 (contaminación y actividades humanas; visión sistémica). 11.4 apoya (hidrólisis de ésteres, polímeros). Estándar CTS-7, EG-5, CTS-3. Priorizado Ambiental: cambio en el uso del suelo, basuras; Químico, Uso: impacto ambiental de compuestos orgánicos.
11. (media) tema polifuncionales, dba cambiado de 11.4 a **9.2**. El 11.4 ev. 1 de polifuncionales trata nomenclatura y prioridad de grupos; la pregunta es acidez por efectos electrónicos y puentes internos: 9.2 (acidez como propiedad química) es el más cercano. La resonancia y los puentes internos son profundización (priorizado Químico, Exp). Estándar EFQ-12, EG-2, EFQ-5.
12. (ok) 11.4 (aminas, amidas y ácidos carboxílicos) con 9.2 de apoyo (ácidos y bases, Brønsted-Lowry), y 9.3 (solubilidad) como apoyo. Estándar EFQ-12 y EFQ-3. Priorizado Químico, Uso: grupos funcionales, polaridad y reactividad.

## Resumen
- 4 preguntas con `dba` corregido (1, 7, 8, 11); 8 sin cambio. `curso` 11 correcto en las 12.
- Resolución a ciegas de 1, 6, 7 y 12: claves únicas y datos correctos; sin hallazgos de gravedad alta.
- Pendiente para quien integre: el banco hereda DBA del tema (banco-sel-cfg.js), así que los cambios de 1 (alcoholes) y 11 (polifuncionales) solo se reflejan allí si se cambia el tema o se respeta el `dba` propio de la pregunta.
