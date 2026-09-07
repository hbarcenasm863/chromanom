# Instrucciones para Claude en este repositorio

## Regla obligatoria: registrar cada sesión de trabajo en `HISTORIAL_CAMBIOS.md`

Al terminar cada sesión de trabajo en este repositorio — cuando el usuario
se despide, da por cerrado el tema, o la conversación llega a un punto de
cierre natural tras haber hecho cambios — Claude DEBE, sin que se le pida
explícitamente cada vez:

1. Agregar una entrada nueva **arriba de todas las anteriores** en
   `HISTORIAL_CAMBIOS.md` (orden: más reciente primero), con:
   - Fecha de la sesión.
   - Contexto breve: qué pidió el usuario y por qué (el motivo real detrás
     del cambio, no solo "qué se tocó").
   - Cambios concretos realizados, agrupados por archivo o por tema si hay
     varios frentes.
   - Cualquier paso manual pendiente que el cambio requiera (por ejemplo,
     redesplegar `chromanom-analytics.gs` en el editor de Apps Script —
     los cambios a ese archivo NUNCA se aplican solos por estar en el
     repositorio).
   - Cualquier cosa que haya quedado pendiente o sin resolver.
2. Confirmar que los cambios de código y la entrada del historial quedaron
   en la rama `main` (fast-forward o merge desde la rama de trabajo), igual
   que con cualquier otro cambio — este repositorio no usa pull requests
   como flujo normal de trabajo.
3. Hacer commit y push de la entrada del historial junto con los cambios de
   código de la sesión (o en un commit aparte inmediatamente después) — no
   dejarla para la próxima sesión ni esperar a que el usuario la pida.

Esta regla aplica a cualquier sesión que modifique código, configuración o
contenido del repositorio (`juego.html`, `chromanom-analytics.gs`,
`generador.html`, etc.) — no solo a cambios grandes. Si la sesión fue
puramente de consulta (preguntas, explicaciones) sin tocar archivos, no
hace falta registrar nada.

## Otras convenciones del repositorio

- El usuario es docente de química (no necesariamente técnico); las
  explicaciones y los mensajes de commit deben ser claros, en español, y
  evitar jerga innecesaria.
- Antes de dar por resuelto un bug reportado como "no funciona" o "salió
  este error", reproducirlo primero (Playwright con Chromium está
  disponible) en vez de solo razonar sobre el código — varios bugs de este
  proyecto solo se manifestaron al probarlos funcionalmente.
- `juego.html` se sirve directo por GitHub Pages: un cambio ahí no necesita
  ningún paso de despliegue aparte de hacer push a `main`.
- `chromanom-analytics.gs` sí necesita redespliegue manual en el editor de
  Apps Script (Implementar → Administrar implementaciones → Nueva versión)
  después de cada cambio — avisar siempre que se toque este archivo.
