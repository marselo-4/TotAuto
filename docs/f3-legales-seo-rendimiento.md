# F3 · Legales, cookies, SEO y rendimiento

_22/10/2026._

## Legales
- Textos en `lib/legal/{es,ca}.ts` (aviso legal, privacidad, cookies) a nombre de **GUIXAGILS SL**. Los datos que faltan están entre corchetes en `lib/legal/types.ts` (`RESPONSIBLE`): CIF, domicilio social y datos registrales. Al rellenarlos se actualizan las tres páginas en los dos idiomas.
- Páginas en `/legal/aviso-legal`, `/legal/privacidad`, `/legal/cookies` (y `/ca/...`), indexables pero sin seguir enlaces.
- La privacidad nombra a los encargados reales: Vercel, Supabase, Resend y HubSpot.

## Cookies
- `components/providers/cookie-consent.tsx`: banner con Aceptar / Rechazar, decisión guardada un año en la cookie `ta_consent`. Enlace «Cookies» en el pie para reabrirlo.
- Google Analytics 4 (`NEXT_PUBLIC_GA_ID`) se carga con **Consent Mode v2** en `denied` por defecto (modo sin cookies) y pasa a `granted` solo al aceptar. Verificado: `dataLayer` recibe `consent default` y `consent update`.

## SEO
- `app/sitemap.ts`: rutas estáticas en ES y CA con `hreflang`, más las fichas publicadas desde Supabase. `app/robots.ts`: bloquea `/admin` y `/api`.
- Canonical y `hreflang` (es, ca, x-default) en todas las páginas vía `lib/seo.ts` → `seoAlternates()`. Depende de `NEXT_PUBLIC_SITE_URL`: en Vercel debe ser `https://totauto.net`.
- Open Graph: imagen por defecto `public/og.jpg` (fachada de noche, 1200×630); la ficha de coche usa su portada. Twitter card `summary_large_image`.
- JSON-LD: `AutoDealer` en home y contacto, `Car` + `Offer` en cada ficha.
- Redirecciones 301 de las URLs de la web de 2024 en `next.config.ts`.

## Accesibilidad
- Enlace «Saltar al contenido», `:focus-visible` con el acento, contraste del gris tenue subido a ≥ 4,5:1, orden de encabezados corregido en el stock.

## Rendimiento (Lighthouse 13, build de producción local, 22/10/2026)

| Página | Móvil perf | Accesibilidad | Buenas prácticas | SEO | LCP móvil | TBT móvil |
|---|---|---|---|---|---|---|
| Home | 91 | 100 | 100 | 92* | 3,5 s | 0 ms |
| Stock | 90 | 100 | 100 | 92* | 3,6 s | 10 ms |
| Ficha | 92 | 97 → 100 | 100 | 92* | 3,4 s | 10 ms |
| Home escritorio | 79 | — | — | — | 0,4 s | 450 ms |

\* El único fallo de SEO es el canonical, porque la prueba corre en el puerto 3001 y el canonical apunta a `NEXT_PUBLIC_SITE_URL`. En producción coincide.

**Qué se cambió para llegar ahí:** el canvas 3D del hero se monta en escritorio tras `load` + `requestIdleCallback`, y en móvil o táctil solo en la primera interacción (scroll, toque, tecla). Antes de eso, la home móvil tenía 2,6 s de bloqueo y LCP de 6,8 s.

**Pendiente:** en escritorio los 450 ms de bloqueo son la carga de three.js tras el idle; se puede partir el bundle o bajar más la calidad por defecto si se quiere subir de 79. El LCP móvil de 3,5 s es el póster del hero (338 KB): se puede servir una variante más ligera para móvil.

## Revisión posterior (22/10/2026, tarde)

Auditoría completa en escritorio y móvil y pulido:

- **Fallos corregidos:** las rutas inexistentes rompían con «Missing <html> and <body>» (faltaba el 404 de raíz y un catch-all por idioma; ahora hay 404 traducido en `/es/...` y `/ca/...`); los revelados ocultaban contenido que ya estaba en pantalla (ahora solo se anima lo que llega con el scroll, y los disparadores se recalculan al cargar fuentes e imágenes); la barra fija de la ficha en móvil tapaba el final de la página.
- **Movimiento añadido:** transición de entrada entre páginas (solo desplazamiento, sin fundido), titulares que entran línea a línea con SplitText (con máscara en las secciones; sin máscara sobre el pliegue), subtítulos del hero con subida, flecha de «desliza» con pulso.
- **Lección medida:** una opacidad inicial de 0 en el HTML del servidor (transición con fundido, titular enmascarado) deja el contenido invisible hasta hidratar y disparó el LCP móvil de 3,5 s a 6,1 s. Con movimiento solo de desplazamiento, vuelve a 3,7 s. Y un `loading.tsx` con esqueleto en la ficha costaba 1 s de LCP (la imagen llega en un fragmento posterior del streaming) a cambio de nada, porque la consulta tarda décimas: eliminado.
- **Resultado:** home 89, stock 89, ficha 89 en móvil; accesibilidad 100.
