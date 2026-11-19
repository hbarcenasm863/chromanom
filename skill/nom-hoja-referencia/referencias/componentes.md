# Componentes del cuerpo de la hoja

Son los mismos nombres de clase de las hojas de `referencias.html` de BioNom. El cuerpo se escribe
a tamaño natural (letra de 10,4 px); el programa lo agranda para llenar la página.

## Recuadros

```html
<div class="rc destacada"><h4>📜 Idea central</h4><p>…</p></div>   <!-- verde: lo más importante -->
<div class="rc"><h4>🔍 Título</h4><ul><li>…</li></ul></div>          <!-- blanco: normal -->
<div class="rc info"><h4>💡 Sabías que…</h4><p>…</p></div>           <!-- azul -->
<div class="rc aviso"><h4>⚠ Cuidado</h4><p>…</p></div>              <!-- naranja -->
<div class="rc errf"><p class="peq"><b>⚠ Errores frecuentes:</b> …; …; …</p></div>  <!-- al final -->
```

`<h5>` es un subtítulo pequeño dentro de un recuadro; `.peq` es texto pequeño.

## Columnas

```html
<div class="cols2"> … dos bloques … </div>          <!-- mitades iguales -->
<div class="cols2 c-62"> … </div>                  <!-- izquierda más ancha -->
<div class="cols2 c-40"> … </div>                  <!-- derecha más ancha -->
<div class="cols3"> … tres bloques … </div>
```

## Tablas

```html
<table class="t-ref">
  <tr><th>Organelo</th><th>Función</th></tr>
  <tr><td><b>Mitocondria</b></td><td>Respiración celular.</td></tr>
</table>
```
`t-ref t-cen` centra todas las celdas. Una tabla dentro de un `.rc` también funciona.

## Pasos

```html
<div class="pasos-ref">
  <div><b>1</b><span>Escribe el catión y el anión</span></div>
  <div><b>2</b><span>Cruza las cargas</span></div>
  <div><b>3</b><span>Simplifica</span></div>
</div>
```

## Fórmulas y ecuaciones

```html
<p class="formula">6 CO₂ + 6 H₂O + luz → C₆H₁₂O₆ + 6 O₂</p>     <!-- ecuación destacada -->
<span class="fx">Fe₂(SO₄)₃</span>                               <!-- fórmula dentro del texto -->
<span class="cat">Fe³⁺</span> <span class="ox">SO₄²⁻</span>     <!-- código de colores de IonNom -->
<span class="an">Cl⁻</span> <span class="oh">OH⁻</span>
<span class="mono">AUG</span>                                   <!-- códigos, secuencias de ADN -->
```
Siempre subíndices y superíndices reales (₀₁₂₃₄₅₆₇₈₉, ⁺⁻⁰¹²³), flecha «→», coma decimal.

## Figuras (SVG o imagen)

```html
<figure class="fig"><svg viewBox="0 0 300 160">…</svg><figcaption>Célula animal</figcaption></figure>
```
Las estructuras orgánicas salen de `chromanom-estructuras` (`node scripts/dibujar.js …`): pega
el SVG dentro de `<figure class="fig">`.

## Fotos con cita APA

```html
<div class="fotos-ref c3">
  <figure class="fr"><img src="img/nv_mito.jpg" alt="Mitocondrias">
    <figcaption><b>Mitocondrias</b>Vistas con microscopio electrónico.
      <cite>Autor. (Año). <i>Título</i> [Fotografía]. Wikimedia Commons. URL. Licencia CC BY 4.0.</cite>
    </figcaption></figure>
  …
</div>
```
`c2`, `c3` o `c4` = fotos por fila. La cita sale de `node scripts/fotos.js cita <clave> --html`.
Las rutas de imagen son relativas al archivo del cuerpo: el programa las copia.

## Ejemplo de cuerpo completo (BioNom, «La célula», resumido)

```html
<div class="rc destacada"><h4>📜 Teoría celular</h4><p>1) Todos los seres vivos están formados por
<b>una o más células</b>. 2) La célula es la <b>unidad básica</b> de estructura y función.
3) Toda célula viene de <b>otra célula</b>.</p></div>
<div class="cols2 c-40">
  <table class="t-ref"><tr><th></th><th>Procariota</th><th>Eucariota</th></tr>
    <tr><td><b>Núcleo</b></td><td>No tiene.</td><td>Sí.</td></tr>
    <tr><td><b>Ejemplos</b></td><td>Bacterias y arqueas.</td><td>Protistas, hongos, plantas y animales.</td></tr></table>
  <table class="t-ref"><tr><th>Organelo</th><th>Función</th></tr>
    <tr><td><b>Mitocondria</b></td><td>Respiración celular: saca energía (ATP) de la glucosa.</td></tr>
    <tr><td><b>Cloroplasto</b></td><td>Fotosíntesis.</td></tr></table>
</div>
<div class="rc"><h4>⚡ La energía de la célula</h4>
  <p class="formula">C₆H₁₂O₆ + 6 O₂ → 6 CO₂ + 6 H₂O + energía</p>
  <p class="peq">Cada glucosa da unos <b>30 a 32 ATP</b>.</p></div>
<div class="rc errf"><p class="peq"><b>⚠ Errores frecuentes:</b> decir que las células vegetales
no tienen mitocondrias (sí las tienen); confundir difusión con transporte activo.</p></div>
```
