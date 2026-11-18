# Analítica de ChromaNom (modo estudiante)

La analítica es **opcional y anónima para el público**: solo funciona en el *modo estudiante* del juego.

## Qué se envía y qué no
- **Modo libre:** no se envía nada.
- **Modo estudiante:** el estudiante escribe únicamente un **código de 6 dígitos**. El Apps Script lo busca en la pestaña privada **Estudiantes** (columna A = código, B = nombre) que el docente administra, y devuelve el nombre solo para mostrarlo en pantalla y agruparlo en la hoja. No se piden correos ni teléfonos.
- Datos por partida: fecha, hora, sesión, nivel (módulo/bloque), aciertos, total de preguntas, errores por tipo de ejercicio, errores y aciertos por tema, moléculas falladas y preguntas con tiempo agotado.
- La duración total de la sesión **no** se registra (solo las preguntas con tiempo agotado).

## Cómo conectarla
1. Crea un proyecto de Google Apps Script y pega el contenido de `chromanom-analytics.gs`.
2. Implementar → Nueva implementación → Aplicación web. Ejecutar como: *yo*. Acceso: *cualquier persona*.
3. Copia la URL que termina en `/exec` y pégala en `ANALYTICS_URL` (en `juego.html`).
4. En `juego.html`, la constante `MODO_ESTUDIANTE_ACTIVO` debe estar en `true` para que el juego pida el código y envíe resultados (hoy está en `false`).
5. Después de **cada cambio** en el `.gs`: Implementar → Administrar implementaciones → Nueva versión, y ejecutar `recalcularAhora()` para reescribir las hojas de estadísticas.
6. En la pestaña **Estudiantes** carga los códigos y nombres (se crea sola la primera vez).

## Columnas de la hoja «Registro»
`Timestamp, Fecha, Hora, Nombre, Curso, Nivel, Sesión, Correctas, Total, % Acierto, Errores MC, Errores Drag, Errores ID, Errores Write, Tiempo agotado, Errores por tema, Aciertos por tema, Moléculas falladas, Trigger, Errores Build, Errores Rxnq, Nivel (clave)`

Bloques de práctica del juego: Hidrocarburos, Compuestos Oxigenados, Compuestos Nitrogenados y Juego Completo (el «General»; clave del bloque en la columna «Nivel (clave)»).

## Si falla el envío
- La página nunca se rompe: el envío se reintenta 3 veces en silencio.
- Si sigue fallando, el estudiante ve un aviso con el botón «Reintentar envío», y la partida se guarda en el dispositivo y se reenvía sola cuando vuelva la conexión.
