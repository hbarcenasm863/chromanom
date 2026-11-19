---
name: nom-planeacion
description: "Planeación de clases del docente de ciencias (Colombia) con sus sitios BioNom (biología 6.°–11.°), ChromaNom (química orgánica 11.°) e IonNom (química inorgánica 10.°): plan de clase, secuencia didáctica o guía de 4 sesiones, plan de aula o de período y malla curricular temporizados sobre el calendario real (horario por día, fechas de inicio y cierre, festivos de Colombia, recesos, semanas de evaluación final y refuerzo, una clase de evaluación por tema, holgura, núcleos y complementarios, hitos y semáforo de avance), alineados textualmente con los DBA (MEN 2016), los Estándares Básicos de Competencias (MEN 2004) y las evidencias de la SED Bogotá, con actividades que enlazan las páginas y simulaciones de los sitios. Úsala SIEMPRE que el docente pida planear, preparar o organizar clases, una unidad, un período, un plan de aula, una malla, una secuencia didáctica o una guía, o pregunte qué DBA o estándar corresponde a un tema, aunque no nombre los sitios."
---

# Planeación de clases con BioNom, ChromaNom e IonNom

El usuario es **docente de ciencias en un colegio público de Colombia** (hombre: «el docente»).
Tiene tres sitios web con teoría interactiva, simulaciones, juego y panel docente. Esta skill
convierte lo que ya existe en esos sitios en **planeaciones listas para entregar a coordinación**
y para usar en clase. Trae una copia de los datos (`datos/planeacion.json`) y un programa para
consultarlos (`scripts/plan.js`).

| Sitio | Materia | Temas | Alineación que trae |
|---|---|---|---|
| `bio` BioNom | Biología 6.° a 11.° | 12 | DBA de biología (texto oficial y evidencias), Estándares MEN 2004 por banda de grados, curso base de cada tema |
| `chroma` ChromaNom | Química orgánica 11.° | 19 | DBA 11.° n.º 4 y 5, evidencias SED Bogotá 10.° y 11.° (textuales), estándares (redacción por verificar) |
| `ion` IonNom | Química inorgánica 10.° | 23 | Evidencias SED 10.° **propuestas por la skill** (IonNom no las trae escritas): confirmarlas con el docente |

## Paso 1: lo mínimo que hay que saber

Antes de escribir, ten claros estos datos. Si el docente ya los dio, confírmalos en una línea; si
falta algo, pregúntalo **en un solo mensaje** con valores propuestos (no un interrogatorio):

- **Tipo de planeación**: plan de una clase, secuencia de varias sesiones (la guía de 4 sesiones
  del panel docente es el formato natural), plan de período o malla anual.
- **Tema(s) y curso** (grado y grupo). En BioNom el curso cambia los DBA y la profundidad.
- **Número y duración de las sesiones** (en Colombia varía: 45, 55 o bloques de 110 min; no lo supongas).
- **Para planes de período, unidades y mallas pregunta siempre** (en el mismo mensaje):
  - **fecha de inicio y fecha de cierre** de cada período;
  - **horas de clase de cada día de la semana** con ese curso (por ejemplo, lunes 2, miércoles 1,
    viernes 2) y la duración de la hora de clase;
  - **recesos y días sin clase** del calendario académico de la SED o del colegio (receso de mitad
    de año, semana de receso de octubre, jornadas pedagógicas, día E, salidas); los **festivos de
    Colombia y la Semana Santa se calculan solos**;
  - cuántas **semanas al final** van para la **evaluación final** y para el **refuerzo o
    nivelación** (por defecto, una y una);
  - horas que se pierden sin fecha fija (izadas, entrega de notas, comisiones).
  Si el docente no sabe alguno, propón un valor y márcalo «estimado».
- **Formato institucional**: si el colegio tiene una plantilla (Word, PDF o Google Docs), pídela y
  llénala respetando sus casillas; si no, usa las estructuras de `referencias/estructuras.md`.
- **Formato de entrega**: en el chat, documento (skill `docs`), Word (`docx`), Google Docs
  (`google-workspace`) o PDF con el estilo del colegio (`estilo-evaluaciones-rufino-cuervo`).

## Paso 2: sacar los datos del sitio

```bash
node scripts/plan.js temas bio                 # ids de los temas (también chroma, ion)
node scripts/plan.js tema bio genetica --curso 9   # alineación (solo DBA de 9.°), páginas, guía de 4 sesiones, «Puedo…»
node scripts/plan.js tema ion ox-bas,base      # varios temas
node scripts/plan.js curso bio 8               # DBA, evidencias, temas y estándares de 8.°
node scripts/plan.js alineacion chroma alcoholes
node scripts/plan.js buscar "fotosíntesis"     # en qué tema y sección del sitio aparece
node scripts/plan.js tema bio celula --json    # todo en JSON
```

`tema` entrega, para cada tema:
- **Alineación**: DBA con sus evidencias, estándares, evidencias de la SED por competencia.
- **Páginas y secciones** con su URL (`…/genetica.html#punnett`), si tienen simulaciones y la hoja
  de referencia. Así cada actividad del plan enlaza el punto exacto del sitio.
- **Sesión 1** (aprendizajes previos: datos curiosos, contexto local/nacional/global, situaciones
  cotidianas y preguntas de activación) y **Sesión 2** (lectura base y mapa de ideas): son los textos
  del panel docente. Úsalos tal cual o adáptalos al curso.
- **Autoevaluación «Puedo…»** y cuántas preguntas tipo Saber y abiertas hay para la evaluación.

Las preguntas, talleres y quices concretos salen de la skill **`nom-banco`** (por tema, curso, DBA y
competencia). La planeación solo dice qué evaluar, cuándo y con qué instrumento; si el docente
quiere el taller o la evaluación, se arma con `nom-banco` y se maqueta con la skill de estilo.

## Paso 2b: temporizar con el calendario real (obligatorio en planes de período, unidades y mallas)

Una malla que cuenta todas las semanas del calendario como semanas de clase no se cumple. Usa
`scripts/tiempo.js`, que aplica los cuatro pasos del docente sobre las **fechas reales**:

```bash
# 1. Proponer unidades desde los temas y agruparlas a mano en 3 a 5 núcleos por unidad
node scripts/tiempo.js sugerir bio celula,division,reinos --curso 6 --salida unidades.json
#    (ejemplo ya agrupado: referencias/ejemplo-unidades.json)
# 2. Calendario real: festivos de Colombia, Semana Santa, recesos, cierre y clase de evaluación por unidad
node scripts/tiempo.js calcular --inicio 2027-01-25 --fin 2027-04-16 --horario "lun:2,mie:1,vie:2" --sesion 55 \
     --recesos "2027-06-21..2027-07-09:Receso de mitad de año" --sin-clase "2027-02-19:Jornada pedagógica" \
     --descuentos "izadas:2,entrega de notas:2" --evaluacion-final 1 --refuerzo 1 --holgura 0.15 \
     --unidades unidades.json --salida plan.json
# 3. Semáforo cada 2 o 3 semanas (avance real vs. hito, logro en chequeos, tiempo real)
node scripts/tiempo.js semaforo --plan plan.json --semana 6 --avance "1:100,2:40" --logro "2:55" --tiempo 1.4
# Festivos de un año: node scripts/festivos-co.js 2027
```

1. **Tiempo efectivo, no calendario**: recorre día por día el período con el horario del curso y
   quita los festivos (Ley Emiliani y los de la Pascua), la Semana Santa (`--semana-santa no` si el
   colegio no la toma de receso), los recesos y los días sin clase; luego las horas sin fecha
   (izadas, notas), las **semanas finales de evaluación final y de refuerzo**, la **holgura del 15 %
   al 20 %** y el **diagnóstico inicial**.
2. **Núcleos y evidencias**: cada unidad agrupa sus contenidos en 3 a 5 núcleos con su evidencia.
   `nucleo` = indispensable (su tiempo no se negocia); `complementario` = profundización o
   ampliación (`sugerir` pone ahí lo marcado «Profundización 10.°–11.°» si el curso es menor). Lo
   complementario solo entra en clase si sobra tiempo; si no, va como proyecto corto, trabajo
   autónomo o pregunta integradora.
3. **Horas por tipo de tarea**: construcción conceptual, práctica guiada, experimental o aplicada,
   retroalimentación y **una clase de evaluación por unidad** (un bloque del horario; cámbialo con
   `--clase-evaluacion`), que siempre es la última clase de la unidad. Complejidad `baja`, `media` o
   `alta` (los temas con cálculos o modelación son `alta`); `"practica": false` si no hay
   laboratorio ni simulación.
4. **Hitos, no semanas rígidas**: cada unidad tiene su fecha de evaluación y su semana de cierre;
   el **cronograma por semanas** muestra en qué semana empieza cada unidad, los festivos y recesos,
   la holgura, la evaluación final y el refuerzo.

Lee los **avisos de viabilidad** y resuélvelos antes de entregar (unidades por debajo de su mínimo,
demasiados núcleos, poca práctica, «NO ALCANZA»). Cuando no alcanza se reprioriza: quitar o fusionar
unidades o pasar una al período siguiente; nunca se esconde. En el documento van las tablas de
`calcular` (tiempo efectivo, horas por unidad, cronograma), las fechas del semáforo y la sección
«Control del avance» de `referencias/estructuras.md`. Sin fechas, `calcular --semanas 10 --horas 4`
da un cálculo aproximado, pero pide las fechas siempre que se pueda.

## Paso 3: escribir la planeación

Usa la estructura que corresponda de `referencias/estructuras.md` (plan de clase, secuencia de 4
sesiones, plan de período, malla). Lo que hace que la planeación sirva de verdad:

1. **Citas curriculares textuales y con fuente.** Copia el DBA, el estándar o la evidencia tal como
   sale de `plan.js`, con su número y fuente (MEN, 2016; MEN, 2004; SED, 2025). Nunca escribas de
   memoria un texto oficial ni inventes un número de DBA: si el dato no está, di «por verificar». Lo
   marcado «PROPUESTA» o «verificar redacción» se entrega marcado igual, para que el docente decida.
   Los DBA de química de 10.° no están en los datos: si los necesita, pídele el texto o déjalo marcado.
2. **Solo lo que de verdad se trabaja.** `plan.js` da todos los DBA, estándares y «Puedo…» del
   tema; cita y evalúa únicamente los que las sesiones planeadas trabajan (una secuencia de Mendel
   no cita el estándar de la doble hélice ni evalúa el dogma central). Lo que quede por fuera se
   nombra al final como «para la secuencia siguiente».
3. **Objetivo y evidencias medibles.** Un objetivo por sesión con verbo observable («explica»,
   «calcula», «clasifica», «predice»), coherente con la evidencia citada.
4. **Momentos con tiempos que sumen la duración real** (inicio / exploración, desarrollo /
   estructuración, cierre / transferencia), y qué hace el docente y qué hace el estudiante.
5. **Actividades del sitio enlazadas**: la sección o simulación concreta (URL con `#sección`), el
   juego en Modo Estudiante para practicar (`…/juego.html`), la hoja de referencia para repasar.
   Indica si se necesita celular, sala de sistemas o proyector, y una alternativa sin conectividad
   (hoja de referencia impresa, guía en PDF de ChromaNom o IonNom).
6. **Evaluación formativa** en cada sesión (chequeo, salida de clase, autoevaluación «Puedo…») y
   sumativa al final, con las competencias Icfes (uso comprensivo, explicación de fenómenos,
   indagación) y el instrumento.
7. **Inclusión (DUA y PIAR)**: al menos un ajuste concreto (lectura en voz alta con el botón 🔊 del
   sitio, letra grande, menos opciones, trabajo en parejas), sin nombrar diagnósticos.
8. **Contexto colombiano**: usa los contextos local, nacional y global del panel docente.
9. **Principios de Mayer** (los mismos de los sitios): palabras clave al inicio, contenido por pasos,
   texto junto a su figura y párrafos cortos.

Reglas de contenido de los sitios que también valen en la planeación:
- BioNom: semanas de embarazo contadas desde la última menstruación (40 en total); respiración
  celular con unos 30 a 32 ATP por glucosa; modelo de reinos (5, 6 o 7, con o sin dominios):
  pregúntalo si el tema es Reinos; lo de 10.°–11.° se marca como profundización.
- ChromaNom: toda fórmula orgánica con la skill `chromanom-estructuras` (nunca ramas entre paréntesis).
- IonNom: fórmulas y nombres inorgánicos con la skill `ionom-formulas`.
- Emojis: nada de banderas ni emojis nuevos (versión 12 en adelante): en el Windows del docente
  salen como rectángulos negros.

## Paso 4: revisar antes de entregar

- ¿Los tiempos de cada sesión suman la duración que dijo el docente?
- En planes de período y mallas: ¿se calculó el tiempo efectivo con holgura, cada unidad tiene
  núcleo y complementario, horas por tipo de tarea, clase de evaluación e hito de cierre, semanas
  finales de evaluación y refuerzo, festivos y recesos del calendario real, y no quedan avisos?
- ¿Cada objetivo tiene su evidencia y su forma de evaluarla?
- ¿Cada DBA, estándar y «Puedo…» citado se trabaja de verdad en alguna sesión?
- ¿Todos los enlaces son de `plan.js` (no inventados)?
- ¿Los textos oficiales están entre comillas, con fuente y sin cambios?
- Termina diciendo qué quedó marcado «por verificar» o «propuesta».

## Actualizar los datos

Los datos son del día que muestra `temas`. Con los tres repositorios descargados:

```bash
node scripts/actualizar.js <carpeta bionom> <carpeta chromanom> <carpeta ionom>
```
