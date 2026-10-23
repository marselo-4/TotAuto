# Tot Auto · propuestas de logo

Tres direcciones para la nueva identidad del showroom de Tàrrega. Se mantiene el nombre **Tot Auto** (compuesto como «TOT AUTO») y se sustituye el wordmark itálico con sombra 3D de los años 2000 por un logo plano, que funcione en blanco sobre grafito, en negro sobre blanco, a tamaño favicon y como rótulo de letras corpóreas en la fachada.

- Página de presentación: `public/brand/propuestas/index.html` (servir `public/` con `npx serve public` y abrir `/brand/propuestas/`).
- Captura general: `docs/img/logo-propuestas.png`.
- SVG por propuesta en `public/brand/propuestas/{a,b,c}/`: `logo.svg` (color, para fondo grafito), `logo-on-white.svg` (color, para fondo blanco), `logo-mono-white.svg`, `logo-mono-black.svg`, `mark.svg` (+ `mark-mono-white.svg` / `mark-mono-black.svg`) y `favicon.svg` (64×64, fondo grafito).
- Todo el texto está convertido a trazados con fontkit (script `docs/gen-logos.js`, reproducible con las fuentes variables del repo de Google Fonts). Los SVG no dependen de ninguna fuente instalada y no llevan `<text>`, `stroke` ni transformaciones: solo `<path>` rellenos, listos para corte o fresado.

## Tabla comparativa

| Propuesta | Fuente (Google Fonts) | Acento | Razonamiento | Dónde funciona peor |
|---|---|---|---|---|
| **A · Wordmark de lujo** | Bodoni Moda, peso 600, tamaño óptico 11 (contraste moderado para que las finas aguanten) | Champán `#C9A96E` sobre grafito `#1B1C1F`; tinta `#F4F2EE` | Serif didona con tracking amplio (0,22 em): el código visual de la joyería y la relojería, que es el registro que el showroom quiere ocupar («cada coche, una pieza»). El filete con rombo champán es el único adorno y hace de «firma» en papelería y web. Es la opción más atemporal y la que más se aleja del logo anterior. | A 16 px las finas de la Bodoni y el filete desaparecen; el favicon se reduce a una «T». En letras corpóreas los remates finos obligan a un grosor mínimo (ideal retroiluminado, no recortado en chapa fina). No comunica «motor» por sí solo: depende del contexto. |
| **B · Geométrica + cuentarrevoluciones** | Outfit, peso 700 | Rojo Ferrari apagado `#B23A40`; tinta `#F4F2EE` | Sans geométrica bold con la «O» final convertida en un cuentarrevoluciones (arco de 270° abierto abajo, aguja en la zona roja). Es el único de los tres que dice «motor» sin leer el texto, y el símbolo solo funciona como favicon, icono de app o marca de agua en fotos. Robusto en corpóreas: trazos uniformes, sin finas. | Es el más «automoción genérica»: la aguja y el rojo acercan la marca a un taller o a una app de coches más que a una boutique. En monocromo a tamaño pequeño el arco abierto puede leerse como «C» o «G» invertida; el acento rojo compite con los colores de los coches expuestos (un Ferrari amarillo junto a un logo rojo). |
| **C · Monograma TA + wordmark** | Jost, peso 500 (wordmark); monograma construido geométricamente | Plata fría `#B5BEC8`; tinta `#F4F2EE` | Monograma de T y A fundidas en un mismo eje: barra horizontal (T, en plata), asta central y dos diagonales que convergen bajo la barra (A), que a la vez dibujan una carretera hacia el punto de fuga. Wordmark en Jost (geométrica tipo Futura) con tracking 0,30 em, muy discreto; el peso visual lo lleva el símbolo. Es la opción más flexible: el monograma solo sirve para favicon, llanta, placa de matrícula del showroom, bordado. | El monograma requiere aprendizaje: la primera lectura es «flecha» o «tienda» antes que «TA». A 16 px el símbolo se convierte en un triángulo macizo (reconocible, no legible). La plata fría sobre grafito tiene poco contraste con la tinta blanca: el acento solo se percibe en tamaños grandes; en blanco sobre blanco el acento casi desaparece y hay que usar la versión mono-negro. |

## Recomendación

Si el objetivo es parecer una galería y no un concesionario, **A**. Si se quiere un símbolo propio que viva fuera del wordmark (redes, app, merchandising), **C**. **B** es la más directa y la más fácil de fabricar, pero es la que menos distancia toma de «tienda de coches».

Un cruce razonable, si Carlos duda entre A y C: wordmark de A (Bodoni) con el monograma de C como símbolo secundario, usando el champán como único acento.

## Cómo regenerar

Las fuentes variables se descargan del repo `google/fonts` (`ofl/bodonimoda`, `ofl/outfit`, `ofl/jost`) y el script `docs/gen-logos.js` (fontkit, instalado con `npm i fontkit@2` en una carpeta temporal) escribe los SVG con `node gen-logos.js <ruta a public/brand/propuestas>`. Ajustes de tracking, pesos, grosor del monograma y ángulo de la aguja están como constantes al principio de cada bloque del script. No se añadió ninguna dependencia al `package.json` del repo.

## Decisión

**21/10/2026 · Carlos elige la propuesta A** (Bodoni Moda + filete champán `#C9A96E`). Integrada en la web: SVG en `public/brand/`, favicon en `app/icon.svg`, Bodoni Moda como tipografía display y champán como acento en `app/globals.css`. Las propuestas B y C se conservan en `public/brand/propuestas/` como referencia.

## Segunda ronda (23/10/2026) · wordmark deportivo en Archivo

Tras cambiar la tipografía de la web a Archivo (ancha, negrita, mayúsculas), la Bodoni del logo A desentona. Tres propuestas nuevas, mismos colores (tinta `#F4F2EE`, grafito, champán `#C9A96E`), en `public/brand/propuestas/{d,e,f}/` con los mismos archivos que la primera ronda. Página: `public/brand/propuestas/wordmark.html` (en desarrollo, `http://localhost:3000/brand/propuestas/wordmark.html`). Script: `docs/gen-wordmark.py` (fontTools + HarfBuzz; fuentes de `google/fonts/ofl/archivo`).

| Propuesta | Composición | A favor | En contra |
|---|---|---|---|
| **D · Expandida** | Archivo 800, anchura 125, tracking −0,014 em; barra champán inclinada entre las palabras | La misma voz que los titulares; robusta en corpóreas y a 16 px; la barra da velocidad sin dibujar "coche" | La más larga en cabecera móvil; sin símbolo propio (T + barra) |
| **E · Itálica** | Archivo Italic 700, anchura 118; línea de velocidad champán bajo la base | La que más dice "deportivo"; guiña al logo original itálico; compacta | La cursiva envejece peor y acerca a taller/tuning; la línea desaparece a 16 px |
| **F · Técnica** | Archivo 600, anchura 100, tracking 0,15 em; "TOT" tinta, "AUTO" champán | Registro premium-técnico (Polestar, Lucid); el acento va en el nombre; monograma TA claro | Menos contundente que los titulares; el tracking pide ancho en móvil |

Recomendación: **D** si se quiere una sola voz en toda la marca; **F** si se prefiere que el logo sea más discreto que los titulares.

### Decisión

**23/10/2026 · Carlos elige la propuesta D** (Archivo 800 expandida + barra champán). Integrada: SVG en `public/brand/` (logo, on-white, mono, mark, favicon), `app/icon.svg`, proporción `LOGO_ASPECT` en `components/layout/logo.tsx` (la usa también el rótulo 3D de `components/hero/logo-sign.tsx`) y PNG de email `public/brand/logo-email-{dark,light}{,@2x}.png` regenerados con sharp (220 y 440 px de ancho). La propuesta A queda en `public/brand/propuestas/a/`.
