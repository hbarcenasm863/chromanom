# Registro de versiones de ChromaNom

Versiones públicas del sitio. El detalle técnico de cada sesión de trabajo está en `HISTORIAL_CAMBIOS.md`.
Para cambiar la versión que aparece en el pie: `node herramientas/sellar-version.js v1.1.0 "fecha"`.

## v1.0.0 — 18 de noviembre de 2026

Primera versión etiquetada, con foco en calidad, accesibilidad y presentación ante evaluadores.

### Accesibilidad
- «Saltar al contenido» y zona principal `<main id="contenido">` en todas las páginas; menú con `aria-label="Principal"`; pie en `<footer>`.
- Tour de bienvenida: cuadro de diálogo accesible (`role="dialog"`), el foco no se escapa, se cierra con Esc y devuelve el foco.
- Juego: el mensaje de acierto o error se anuncia con `aria-live`.
- Nueva `calidad.js`: oculta los emojis decorativos al lector de pantalla, hace operables con teclado los elementos clicables que no eran botones y da nombre (o oculta) a los esquemas SVG sin nombre.
- Contraste AA corregido en textos pequeños (opacidad, verde de orbitales 2p, cabeceras turquesa de la hoja de referencia). Los cuatro colores del método MDEC conservan su significado.
- Nombres accesibles que incluyen el texto visible (botones A−/A+, tarjetas de grupos, átomos del menú), encabezados en orden, `h1` en juego y referencia.

### SEO y redes
- Descripción, `canonical`, Open Graph y Twitter Card en cada página; imagen `og-chromanom.png` (1200×630).
- `sitemap.xml`, `robots.txt` y datos estructurados `LearningResource` (JSON-LD) en la portada.

### Credibilidad
- Pie con versión, fecha, autor, institución, licencia, «Cómo citar», contacto y nota de privacidad.
- Nueva página `citar.html`: cita APA 7, licencia, privacidad y tabla de evidencia (pendiente de completar, sin cifras).

### Analítica
- Si un envío de partida falla sin conexión, se guarda en el dispositivo y se reenvía solo al volver la red.
- Nuevo `analitica/README.md` con el flujo y las columnas de la hoja.

### PWA
- Caché `chromanom-v90` con las páginas y archivos nuevos.
