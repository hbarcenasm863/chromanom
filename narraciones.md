# Narraciones de los modales interactivos — ChromaNom

Cada bloque tiene el **ID de la regla**, el número de paso y el texto actual.
Edita el texto del campo `narr` y luego dímelo para que lo aplique al código.

> **Principio de personalización de Mayer**: habla como si fuera una conversación,
> usa "tú", primera persona del plural ("fijémonos"), preguntas retóricas, pausas
> naturales. Evita vocabulario excesivamente técnico donde baste uno más simple.

---

## Parte A — Desempate de cadena principal

### A1 · Mayor número de carbonos

| Paso | Texto actual |
|------|-------------|
| 1 | `Molécula: 2-metilbutano. Hay dos posibles cadenas. ¿Cuál es la más larga?` |
| 2 | `Cadena larga: cuatro carbonos seguidos, de C1 a C4. Es la ruta más extensa.` |
| 3 | `Ruta alternativa por la rama: solo tres carbonos. Es más corta.` |
| 4 | `A1: cadena de cuatro gana. El nombre correcto es 2-metilbutano.` |

---

### A2 · Mayor número de ramificaciones

| Paso | Texto actual |
|------|-------------|
| 1 | `3-etil-2-metilpentano. Dos cadenas de cinco carbonos. A1 empata. Se aplica A2.` |
| 2 | `Cadena principal: tiene dos sustituyentes, metilo en C2 y etilo en C3.` |
| 3 | `La cadena alternativa por el etilo tendría solo un sustituyente.` |
| 4 | `A2: dos ramificaciones ganan. La cadena con más ramas es la principal.` |

---

### A3 · Menor conjunto de localizadores

| Paso | Texto actual |
|------|-------------|
| 1 | `A2 empata: mismas ramificaciones. Se comparan los conjuntos de localizadores posición a posición.` |
| 2 | `Dirección alfa verde: sustituyentes en posición 2 y 3. Conjunto llaves dos, tres.` |
| 3 | `Dirección beta rojo: sustituyentes en posición 3 y 4. Conjunto llaves tres, cuatro.` |
| 4 | `A3: llaves dos, tres menor que llaves tres, cuatro. Primera diferencia: 2 menor que 3. Alfa gana.` |

---

### A4 · Primer punto de diferencia en el conjunto

| Paso | Texto actual |
|------|-------------|
| 1 | `Dos cadenas con igual longitud, igual número de ramas. Primer localizador igual. Se compara el segundo.` |
| 2 | `Primera posición: dos igual dos. Empata. Se pasa a la segunda posición.` |
| 3 | `Segunda posición: cuatro menor que seis. La cadena alfa tiene el valor más bajo aquí.` |
| 4 | `A4: cuatro menor que seis en la segunda posición. La cadena alfa es la cadena principal.` |

---

### A5 · Prioridad alfabética del sustituyente

| Paso | Texto actual |
|------|-------------|
| 1 | `Todo lo anterior empata. A5: el sustituyente nombrado primero alfabéticamente recibe el menor localizador.` |
| 2 | `Orden alfabético: etilo viene antes que metilo. Etilo debe tener el localizador más bajo posible.` |
| 3 | `Dirección alfa: etilo en dos, metilo en cuatro. Etilo recibe el localizador más bajo.` |
| 4 | `A5: dirección alfa correcta. El nombre es 2-etil-4-metilpentano.` |

---

## Parte B — Desempate de dirección de numeración

### B1 · Menor localizador al grupo funcional

| Paso | Texto actual |
|------|-------------|
| 1 | `4-metilpentan-2-ol. El grupo funcional guión OH determina la dirección de numeración.` |
| 2 | `Dirección alfa verde: guión OH en C2, posición dos.` |
| 3 | `Dirección beta rojo: el mismo guión OH recibe posición cuatro. Cuatro es mayor que dos.` |
| 4 | `B1: dos menor que cuatro. Dirección alfa gana. El nombre correcto es 4-metilpentan-2-ol.` |

---

### B2 · Menor localizador al doble enlace

| Paso | Texto actual |
|------|-------------|
| 1 | `Pent-1-eno. Sin grupo funcional: B1 no aplica. Se aplica B2: menor localizador al doble enlace.` |
| 2 | `Dirección alfa verde: doble enlace entre C1 y C2, localizador uno.` |
| 3 | `Dirección beta rojo: el mismo doble enlace recibiría localizador cuatro. Cuatro mayor que uno.` |
| 4 | `B2: uno menor que cuatro. Dirección alfa gana. El nombre correcto es pent-1-eno.` |

---

### B3 · Menor localizador al conjunto de sustituyentes

| Paso | Texto actual |
|------|-------------|
| 1 | `2-metilpentano. Sin grupo funcional ni insaturaciones. B1 y B2 no aplican. Se aplica B3.` |
| 2 | `Dirección alfa verde: metilo en posición dos. Conjunto llaves dos.` |
| 3 | `Dirección beta rojo: el mismo metilo recibe posición cuatro. Conjunto llaves cuatro.` |
| 4 | `B3: dos menor que cuatro. Dirección alfa gana. El nombre correcto es 2-metilpentano.` |

---

### B4 · Prioridad alfabética en la numeración

| Paso | Texto actual |
|------|-------------|
| 1 | `3-etil-4-metilhexano. Los conjuntos de localizadores 3,4 son iguales en ambas direcciones. Se aplica B4.` |
| 2 | `Orden alfabético: etilo viene antes que metilo. Etilo debe recibir el localizador más bajo posible.` |
| 3 | `Dirección alfa verde: etilo en posición tres, metilo en cuatro. Etilo tiene el número menor.` |
| 4 | `B4: etilo en tres es menor que cuatro. Dirección alfa gana. El nombre correcto es 3-etil-4-metilhexano.` |
