# Tot Auto — Contexto de la web anterior (totauto.net, 2024)

_Análisis hecho el 21/10/2026 antes de vaciar el repo `marselo-4/TotAuto` para arrancar el nuevo desarrollo. El código completo sigue en el historial de git (último commit de la web vieja: `3628d19`, 02/04/2025). Capturas de pantalla y logos en `/Users/carlos/totauto_intel/media/web-anterior/`. Contexto de negocio en `/Users/carlos/totauto_intel/contexto/totauto-tarrega-contexto.md`._

## Qué era

Web estática de catálogo (sin tienda real) para **Tot Auto**, tienda de accesorios de automóvil en Tàrrega (Lleida). La hizo Carlos en 2024 como proyecto de clase (metodología ágil en 4 sprints, Feb–May 2024; documentación en `Documentación.pdf`, 26 páginas). Después quedó como web pública de la empresa de su padre.

- **Dominio:** totauto.net (CNAME en el repo → GitHub Pages, `marselo-4.github.io`). A 21/10/2026 sigue en línea, servida por GitHub Pages. DNS A: 185.199.108–111.153.
- **Google Analytics:** `G-NPE0S5B82H` (gtag en todas las páginas).
- **Repo:** git@github.com:marselo-4/TotAuto.git · 58 commits · 100 MB (casi todo imágenes y dos PDF).
- **Idioma:** castellano. Sin catalán pese a ser Tàrrega.

## Stack

- HTML estático, un archivo por página (sin generador ni plantillas: la cabecera/nav está copiada en ~95 archivos).
- **Bootstrap 5.3.3** (CDN) + CSS propio de 192 líneas (`css/style.css`). Fuente **Poppins** (Google Fonts) solo en cabecera; el resto usa la pila por defecto de Bootstrap.
- **FontAwesome 6** (kit `d75a3fdaa4`), **SweetAlert2 11**, **ScrollReveal** (CDN unpkg).
- JS vanilla: `busqueda.js` (buscador con lista hardcodeada de 21 productos), `script.js` (alertas SweetAlert: "Añadir al carrito" → "No disponible, contáctanos"), `scroll.js` (ScrollReveal en `.parte1`), `geo.js` (enlace a Google Maps, coords 41.6510, 1.143882).
- `mail.php` para el formulario de contacto: **nunca funcionó** en GitHub Pages (no hay PHP) y el destinatario estaba mal (`info@totauto` sin `.net`). En nov. 2024 se quitó el formulario y contacto.html quedó solo con dirección, teléfono y email.
- Sin build, sin npm, sin tests. Un workflow de GitHub Actions (labeler) sin `labeler.yml`, así que no hacía nada.
- SEO: meta keywords/description iguales en todas las páginas, OG tags solo en la home apuntando a la URL vieja de GitHub Pages, `sitemap.xml` con 95 URLs, `robots.txt` que lo permite todo. Canonical mal escrito (comillas tipográficas).

## Estructura y páginas

```
index.html                      home
catalogo.html                   6 tarjetas de categoría
contacto.html                   datos de contacto (sin formulario desde nov. 2024)
catalogo/
  llantas.html                  categoría con "Productos destacados" + "Todos los productos"
  multimedia.html               ídem
  detectores-de-radar.html      ídem (título "Soluciones para Radares")
  sonido.html                   ídem
  control-cruise.html           placeholders (OZ SuperTurismo 399€ repetido)
  accesorios.html               placeholders
  otros.html                    placeholders
  catalogo_pdf.html             iframe con assets/catalogo.pdf (16 MB)
  nodisponible.html             404 propio
  llantas/*.html                76 fichas de llanta Ronal (una por acabado/color)
  multimedia/*.html             4 fichas Evus (DD220R, DD503A, DD575A, UD122A)
  sonido/*.html                 6 fichas Evus SILK (S42, S52, S62, S130, S165, S693)
  detectores-de-radar/*.html    3 fichas (Kermes Pro IV, WFinderPRO DSP, WFinderPRO Eclipse DSP)
```

**Home:** nav negra fija con logo, menú (Inicio / Catálogo desplegable / Contacto) y buscador; carrusel de 5 imágenes (coches y llantas, oculto en móvil); bloque "Nuestros Productos" con CTA rojo a catálogo; bloque "Nuestros Servicios" (asesoramiento personalizado y montaje) con CTA a contacto; banda oscura "SISTEMA ANDROID INTEGRADO — hasta 75 vehículos compatibles en 21 marcas" con botón cian a multimedia; carrusel infinito de logos de marcas (Ronal, Dynavin, Evus, WFinder); footer con "© 2024 Carlos Martínez → carlosmg.es".

**Categoría:** cabecera con título y texto; en llantas, botón "Configurador" que lleva al configurador externo de ronal-wheels.com; grid de tarjetas Bootstrap (imagen, marca, nombre, precio, "Stock:" vacío). Muchas imágenes de llantas se cargan en caliente desde ronal-wheels.com (hotlinking).

**Ficha de producto:** breadcrumb, imagen grande, "Ref:", nombre, precio (a veces tachado + oferta), miniaturas de otros colores (solo escritorio), descripción, bloque "Detalles" (tamaños, tecnologías, agujeros) o tabla de especificaciones, botón "Añadir al carrito" que abre un aviso de "No disponible, contáctanos", y sección oscura "Productos relacionados" con estrellas decorativas.

**Contacto:** tres iconos (ubicación → Google Maps, tel. 610 43 88 77, info@totauto.net). Queda en el código una función `validateForm()` huérfana.

## Catálogo y precios publicados (mayo 2024, desactualizados)

| Categoría | Marca | Productos | Precios |
|---|---|---|---|
| Llantas | Ronal (CA1, CA2, LS, R10 Turbo, R41, R42, R50 Aero, R51, R54, R55 SUV, R56–R71) | 76 fichas | 150–400 € por llanta (precio base; "puede variar según tamaño, color o tornillería") |
| Multimedia (Android integrado) | Evus | DD220R 279 € · DD503A 369 € · DD575A 499 € · UD122A 699 € (antes 799 €) | |
| Sonido | Evus SILK | S42 45 € · S52 55 € · S62 69 € · S130 35–59 € · S165 79 € · S693 199 € (aprox.) | |
| Detectores de radar | WFinder / Kermes | WFinderPRO DSP 1.125 € · WFinderPRO Eclipse DSP 1.379 € · Kermes Pro IV | |
| Control cruise, Accesorios, Otros | — | sin contenido real (placeholders) | |

Marcas distribuidas que figuraban: **Ronal, Dynavin, Evus, WFinder**. En comentario del código: pendiente añadir Pool Line.

## Identidad visual

- **Logo:** wordmark "TOT AUTO" en tipografía itálica geométrica gris claro con sombra 3D (`logo.png`, `logoheader.png` para fondo negro, `logofooter.png`, `favicon.ico`). Guardado en `/Users/carlos/totauto_intel/media/web-anterior/assets/` y el header también en `/Users/carlos/totauto_intel/logoheader.png`.
- **Paleta:** negro `#000` (nav, bandas), blanco, rojo Bootstrap `btn-danger` para CTAs, cian `btn-info` puntual, grises Bootstrap. Sin sistema de color propio.
- **Tipografía:** Poppins en nav/breadcrumbs; resto, pila nativa de Bootstrap.
- **Movimiento:** ScrollReveal al entrar, animaciones CSS tipo Animista (`tracking-in-contract`, `focus-in-expand`, `scale-in-center`, `vibrate-4`), hover con zoom y blur en tarjetas, carrusel de logos infinito. Scrollbar personalizada oscura.
- **Fotos:** sliders con coches deportivos (Porsche GT3 RS, llantas) sacados de stock; fotos de producto de fabricantes.

## Lo que funcionaba y lo que no

**Bien:** estructura clara (home → categorías → fichas), responsive básico con Bootstrap, breadcrumbs, sitemap, 404 propia, GA instalado, dominio propio en GitHub Pages gratis.

**Mal / a no repetir:**
- Nav y footer duplicados en 95 archivos: cualquier cambio obligaba a tocar todos.
- Buscador con lista hardcodeada que no incluía la mayoría de llantas.
- "Añadir al carrito" y selector de cantidad sin tienda detrás.
- Formulario de contacto roto (PHP en hosting estático); acabó eliminado.
- Imágenes hotlinkeadas desde ronal-wheels.com (pueden caer) y muchas sin `alt`.
- Precios y stock estáticos y sin fecha; "Stock:" vacío en todas las tarjetas.
- Categorías publicadas sin contenido (control cruise, accesorios, otros) con tarjetas de relleno "OZ Racing SuperTurismo 399 €".
- Footer, carrusel y buscador ocultos en móvil (`.ocultarMovil`), así que en móvil no había footer ni búsqueda.
- SEO genérico: mismas keywords/description en todas las páginas, OG apuntando a marselo-4.github.io, canonical roto.
- Solo castellano.
- Repo de 100 MB por PDFs (catálogo 16 MB, documentación 8 MB) e imágenes sin optimizar.

## Datos reutilizables

- Dominio totauto.net con DNS ya en GitHub Pages (habrá que cambiarlo si el nuevo hosting es Vercel u otro).
- Cuenta de Google Analytics `G-NPE0S5B82H`.
- Teléfono 610 43 88 77 · info@totauto.net · Av. Raval del Carme 79, 25300 Tàrrega · coords 41.6510, 1.143882.
- Logos de marca propios y de distribuidores (Ronal, Dynavin, Evus, WFinder) en `totauto_intel/media/web-anterior/assets/`.
- Capturas de referencia de la web vieja (home escritorio y móvil, catálogo, categoría llantas, ficha llanta, ficha multimedia, contacto) en `totauto_intel/media/web-anterior/`.

## Hacia dónde va (resumen del contexto de negocio, oct. 2026)

La empresa ya no vende accesorios al público: el local de Raval del Carme 79 lleva cerrado desde ≈2022 y se trabaja para profesionales. El plan es reformar el local como **showroom de deportivos y alta gama** en colaboración con Miquel (importador; Ferrari 458 Spider y McLaren 650S como coches de imagen), con una propuesta ya redactada (`totauto_intel/Tot Auto × Miquel — Propuesta de colaboración.pdf`): cuotas por plaza de stock, 2 % de comisión por venta, contrato en tres fases, servicio ImportRadar.es. La operación la factura GUIXAGILS SL; Tot Auto solo cobra el alquiler del local. La nueva web tendrá que responder a ese negocio (showroom, stock de coches, captación), no al catálogo de accesorios de 2024.
