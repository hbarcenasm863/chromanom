# Auditoría de ChromaNom (Tarea 0 — solo diagnóstico)

Fecha: 2026-11-18. No se modificó ningún archivo del sitio; solo se agregó este informe.
Herramientas: Lighthouse (Chromium headless, servidor local), axe-core 4.x en las 17 páginas, y un escaneo propio de HTML.

## 1. Hallazgo principal

El plan asume un punto de partida más cercano a cero del que hay. **El sitio ya tiene** `lang="es"`, PWA instalable (`manifest.json`, `sw.js`, `pwa-install.js`, íconos 192/512 y maskable, `apple-touch-icon`, `theme-color`), `prefers-reduced-motion`, `:focus-visible`, regiones `aria-live`, `alt` en todas las imágenes, enlaces con texto, sin botones solo-emoji sin nombre, y pie con autor y licencia. Por eso **las tareas 1 y 3 se reducen a ajustes**, no a construir desde cero.

Lo que **no existe**: `sitemap.xml`, `robots.txt`, `CHANGELOG.md`, `citar.html`, imagen Open Graph, Open Graph/Twitter/canonical/JSON-LD en ninguna página, `analitica/README.md`, versión visible en el pie, contacto, aviso de privacidad. `main` solo existe en `index`; `header`/`footer` semánticos casi no existen; no hay enlace «Saltar al contenido».

## 2. Lighthouse (antes)

| Página | Accesib. | SEO | Mej. prácticas | Rendimiento (extra) |
|---|---|---|---|---|
| index | 97 | 91 | 100 | 99 |
| juego | 98 | 91 | 100 | 48 |
| grupos | 98 | 91 | 100 | 87 |
| docente | 97 | 100 | 100 | 75 |

Ya se cumple ≥ 90 en las tres categorías pedidas. Fallos restantes: `meta-description` ausente (index, juego, grupos), `landmark-one-main` (juego, grupos), contraste (2 elementos en index), `label-content-name-mismatch` (index, grupos), `aria-prohibited-attr` (docente). El «PWA» ya no es categoría de Lighthouse; se verifica a mano (manifest + service worker presentes).

## 3. axe-core (17 páginas)

Sin errores **críticos**. Errores **serios**:

- `label-content-name-mismatch` (casi todas las páginas): botón de zoom `#tz-minus` («A−») con `aria-label="Reducir tamaño de texto"` que no contiene el texto visible. En `grupos` (21) e `index` (17) hay más casos con `aria-label` distinto del texto visible.
- `color-contrast`: `.fs-next > small` (ambiente, biomoleculas, orbitales, propiedades, tipos-carbono); `cadenas` (18 nodos, `button[data-id="ali"] > small`); `referencia` (35, `.grupo-lbl`); `reacciones` (5, `.mx-lbl`); `carbono` (5); `index` (2, `.mp` de los botones de grupo).
- `aria-prohibited-attr`: `#vista` en `docente` y `generador` (`aria-label` sobre un `div` sin rol).
- `nested-interactive`: `#tc-svg` en `tipos-carbono`.

Moderados: `landmark-one-main` (16 de 17 páginas), `region` (contenido fuera de landmarks, en todas), `heading-order` (biomoleculas, isomeria, orbitales: un `h4` salta niveles), `page-has-heading-one` (juego, referencia), `landmark-unique` (teoria), `empty-table-header` (ambiente).

## 4. Escaneo propio

- `<html lang>`: correcto en las 17.
- Imágenes sin `alt`: 0. Enlaces vacíos: 0. Botones solo-emoji sin nombre: 0.
- SVG sin `role`/`aria-label`/`<title>`: **reacciones 149 de 227**, teoria 12, docente 2, generador 1, juego 1. Las moléculas de `reacciones` son el mayor pendiente.
- Elementos clicables con `onclick` que no son `<button>`/`<a>` ni tienen `role`: **teoria 25**, reacciones 2, index 1.
- Niveles de encabezado saltados: biomoleculas, isomeria, orbitales, grupos, docente/generador, teoria (además tiene 2 `h1`). `juego` y `referencia` no tienen `h1`.
- Descripción (`meta description`): solo en 7 de 17 páginas (ambiente, biomoleculas, docente, generador, orbitales, propiedades; verificar longitud 140–160). Faltan en index, juego, grupos, teoria, carbono, cadenas, isomeria, reacciones, referencia, guias, tipos-carbono.
- Open Graph / Twitter / canonical / JSON-LD: 0 de 17.
- Tour de bienvenida (`index.html`): **sin `role="dialog"`/`aria-modal`, sin atrapar el foco y sin cierre con Escape.** El botón de cierre tiene `aria-label`. Es el hallazgo de accesibilidad más claro de la Tarea 1.

## 5. Analítica

- Existe: `ANALYTICS_URL` en `juego.html:7490` (Apps Script) y el código del servidor en `chromanom-analytics.gs`. No se probó el envío contra la URL real desde aquí (no corresponde enviar datos de prueba a tu hoja).
- Falla sin romper la página: los `fetch` van dentro de `try/catch` con reintentos (3, con espera creciente) y `.catch`. El service worker no intercepta `script.google.com`. **Reenvío offline: no hay cola persistente**; si se cierra la pestaña sin red, ese evento se pierde.
- Anonimato: falta revisar el contenido de `buildPayload` (¿se pide nombre/curso?). El código habla de «Estudiantes» y «Curso X», así que **probablemente no es anónima**; necesito tu criterio antes de afirmarlo en una nota de privacidad.
- El juego ya tiene los bloques Hidrocarburos, Compuestos Oxigenados y Compuestos Nitrogenados (168 preguntas). Falta confirmar el bloque «General» al probar las 20 preguntas por bloque.

## 6. Prioridades

**Alta**
1. Tour de bienvenida: `role="dialog"`, `aria-modal`, foco atrapado, Escape.
2. `<main id="contenido">` + «Saltar al contenido» + `header`/`footer` en las 17 páginas (también corrige `landmark-one-main` y gran parte de `region`).
3. Pie de página: versión y fecha, contacto, privacidad, enlace «Cómo citar» (se crea `citar.html`).
4. SEO base: `meta description` faltantes, canonical, Open Graph/Twitter, `og-chromanom.png`, `sitemap.xml`, `robots.txt`, JSON-LD en `index`.
5. Contraste AA de los elementos listados (**ajuste de tono: te aviso antes de tocar colores MDEC**).

**Media**
6. 25 elementos `onclick` en `teoria` a `<button>` (o `role="button"` + `tabindex` + teclado).
7. Etiquetas de los botones (`#tz-minus` y los de `grupos`/`index`): que el nombre accesible contenga el texto visible.
8. `aria-label`/`<title>` en SVG de `reacciones` (149), teoria, juego.
9. `aria-label` sobre `#vista` (`role="region"`), `nested-interactive` en `#tc-svg`, saltos de encabezado y `h1` faltantes.
10. Anonimato de analítica, `analitica/README.md` y cola de reenvío.

**Baja**
11. Rendimiento de `juego` (48): archivo de 1,1 MB y 7.700+ líneas de JS en línea; no es requisito, pero conviene separar el banco de preguntas a su propio `.js` (también sirve para la separación futura docente/juego).
12. Separación de carpetas para `docente` y `guias` (decisión de producto futura; hoy están en la raíz con el resto).
13. Normalizar `manifest.json` → `manifest.webmanifest` (opcional; `manifest.json` ya funciona) y nombre de caché: hoy `chromanom-v89`, no `v1.0.0`.

## 7. Conflictos con las instrucciones del repositorio

- `CLAUDE.md` pide `HISTORIAL_CAMBIOS.md`, que ya cumple el papel de registro; el plan pide `CHANGELOG.md`. Propongo crear `CHANGELOG.md` corto (versiones públicas) y mantener ambos.
- `CLAUDE.md` pide fusionar en `main` sin pull request; el plan pide rama `mejoras-calidad`. Trabajo en la rama de esta sesión y **no toco `main`** hasta tu visto bueno.
- Cambiar `?v=` y `CACHE` en `sw.js` será necesario en cada tarea que toque CSS/JS.
- Licencia: el pie dice CC BY-NC 4.0; sin conflicto. El autor aparece como «Harvey Barcenas Morales» (sin tilde) en el pie, mientras el plan usa «Bárcenas»; decidir cuál usar.

## 8. Decisiones que necesito de ti

1. ¿Autorizas ajustar el tono de los colores que no cumplen contraste AA (solo los textos pequeños listados, sin cambiar el significado MDEC)?
2. Correo o formulario de contacto para el pie.
3. ¿Se acepta «Bárcenas» con tilde en los textos nuevos?
4. ¿Qué datos pide hoy la analítica (nombre, curso)? Define el texto de privacidad.
5. ¿Sigo con las Tareas 1 a 5 en el orden del plan?

---

# Actualización tras las Tareas 1 a 5 (2026-11-18)

## Lighthouse: antes y después

| Página | Accesibilidad | SEO | Mejores prácticas |
|---|---|---|---|
| index | 97 → **100** | 91 → **100** | 100 → 100 |
| juego | 98 → **100** | 91 → **100** | 100 → 100 |
| grupos | 98 → **100** | 91 → **100** | 100 → 100 |
| docente | 97 → **100** | 100 → 100 | 100 → 100 |

Rendimiento (no era requisito): index 99→92, juego 48→57, grupos 87→87, docente 75→44. La variación de `docente` y `index` es en parte ruido de medición (una sola corrida en un contenedor); conviene volver a medir en GitHub Pages. El mayor costo real sigue siendo `juego.html` y `docente.html` (archivos de ~1 MB y 100 KB de JS en línea), tema de la prioridad Baja.

## axe-core (18 páginas, escritorio)
Errores críticos: 0. Errores serios: **0** (antes: contraste, nombres que no incluían el texto visible, `aria-prohibited-attr`, `nested-interactive`). Quedan solo avisos *moderados* de «contenido fuera de landmarks» (`region`) en elementos flotantes (widget de zoom, barra inferior del celular) y no afectan el uso.

## Pruebas funcionales hechas
- 18 páginas sin errores de JavaScript.
- Juego: 22 preguntas recorridas en cada bloque (Hidrocarburos, Oxigenados, Nitrogenados, Juego Completo) y Constructor molecular, con todos los tipos de pregunta (opción múltiple, arrastrar, identificar, escribir, construir, reacciones): sin errores.
- Sin conexión (service worker): index, juego, teoría, carbono, citar y docente cargan; el juego arranca.
- Teclado: «Saltar al contenido» lleva a `#contenido`; el tour atrapa el foco, se cierra con Esc y devuelve el foco; las pestañas de pasos de teoría se activan con Enter.

## Lo que quedó distinto de lo que pedía el plan
- **PWA:** ya existía. Se mantiene `manifest.json` (no `manifest.webmanifest`) y `sw.js` con «red primero» (decisión previa del proyecto: evita mezclar archivos viejos y nuevos); el caché es `chromanom-v90`, no `v1.0.0`, porque el nombre de caché sube con cada despliegue.
- **`<header>`:** no se envolvió el menú en `<header>` porque el menú es `position: sticky` y se rompería; el menú tiene `aria-label="Principal"` y el contenido está en `<main id="contenido">`.
- **Duración de sesión:** la analítica registra preguntas con tiempo agotado, pero no la duración total; agregarla exige cambiar `chromanom-analytics.gs` (y redesplegarlo).
- **Modo estudiante:** en `juego.html` está desactivado (`MODO_ESTUDIANTE_ACTIVO = false`), así que hoy no se envía nada.
- `generador.html` solo se marcó `noindex` (es una página de datos que se carga oculta desde `docente.html` y redirige).
