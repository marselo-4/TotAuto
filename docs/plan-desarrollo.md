# Plan de desarrollo — nueva web de Tot Auto (showroom)

_Aprobado por Carlos el 21/10/2026. Fuente de verdad del proyecto; se actualiza al cerrar cada fase._

## Contexto

Tot Auto (empresa del padre de Carlos, Tàrrega) reconvierte su local de Av. Raval del Carme 79 en un showroom de deportivos y alta gama en colaboración con Miquel (importador). La web vieja (catálogo de accesorios 2024, HTML estático) se vació el 21/10/2026; el repo `/Users/carlos/totauto` solo conserva `.git` y `docs/contexto-web-anterior.md`. Hace falta una web nueva que venda los coches del showroom, capte encargos de importación a medida y presente el local, lista para la apertura antes de fin de 2026 (≈10 semanas).

Contexto de negocio: `/Users/carlos/totauto_intel/contexto/totauto-tarrega-contexto.md` y la propuesta a Miquel (PDF). Lecciones de la web vieja: `docs/contexto-web-anterior.md`.

## Decisiones fijadas con Carlos (21/10/2026)

| Tema | Decisión |
|---|---|
| Marca y dominio | Tot Auto, totauto.net (dominio en transferencia: **no se despliega nada todavía**) |
| Objetivos | Vender los coches · importación a medida · presentar el showroom |
| Idiomas | Castellano (por defecto) y catalán |
| Hosting | Desarrollo en local; destino Vercel cuando llegue el dominio |
| Stack | Next.js + Tailwind + Supabase |
| Stock | Panel de administración propio; usuarios: Carlos (admin) y Miquel (solo sus coches) |
| Ficha de coche | Datos básicos + precio · galería grande · origen y documentación (sin "precio bajo consulta") |
| Fotos | Carlos las prepara en el Mac; el panel solo las sube y ordena |
| Contacto | WhatsApp con mensaje precargado · formulario por email · lead en HubSpot · teléfono y email |
| Secciones | Inicio, Stock, Ficha, Showroom/local, Importación a medida, Vende tu coche, Sobre nosotros + vendidos, Contacto, legales |
| Estilo | Oscuro, tipo galería; logo rehecho (wordmark nuevo, mismo nombre) |
| Legal | A nombre de GUIXAGILS SL (faltan CIF, dirección fiscal, email) |
| Portales | Exportación CSV/feed desde el panel (coches.net, AutoScout24, Wallapop) |
| Base de datos | Proyecto nuevo en Supabase vía conector (plan gratuito) |
| ImportRadar | SaaS aparte de Carlos; **no aparece** en la web |
| Datos iniciales | 5 coches de la propuesta: Ferrari 458 Italia Spider, McLaren 650S, Audi RS3, Mercedes-AMG A 45 S, Porsche Macan GTS |

Entorno local comprobado: Node 26.5, npm 11.17, Supabase CLI instalada, Vercel CLI no (no hace falta hasta desplegar). Repo en rama `main`.

## Arquitectura

- **Next.js 15 (App Router, TypeScript)** + **Tailwind CSS v4**. Rutas con prefijo de idioma vía `next-intl`: `/` castellano, `/ca/...` catalán. Textos en `messages/es.json` y `messages/ca.json`.
- **Supabase**: Postgres + Auth (email y contraseña) + Storage (bucket `vehicles` para fotos). Cliente servidor con `@supabase/ssr`.
- **Email**: Resend desde una route handler de Next (hasta tener dominio verificado, se prueba con el remitente de pruebas de Resend hacia el correo de Carlos).
- **HubSpot**: envío del lead a la Forms API con portal ID y form ID de Carlos (sin SDK, un `fetch`).
- **WhatsApp**: enlace `wa.me/<número>?text=` con el coche precargado. Falta el número.
- **Imágenes**: `next/image` sobre las URLs públicas de Supabase Storage; el panel redimensiona en cliente (máx. 2000 px, WebP) antes de subir.
- **SEO**: metadata por página e idioma, `sitemap.ts`, `robots.ts`, JSON-LD `AutoDealer` en home y `Vehicle`/`Offer` en cada ficha, `hreflang`. Redirecciones 301 de las 95 URLs viejas (`/catalogo/...`, `index.html`) a `/stock` o `/` en `next.config` para no perder lo indexado.
- **Analytics**: GA4 existente `G-NPE0S5B82H` con banner de cookies (consentimiento previo).

### Estructura del repo (`/Users/carlos/totauto`)

```
app/
  [locale]/
    page.tsx                 inicio
    stock/page.tsx           listado con filtros (marca, precio, año, combustible)
    stock/[slug]/page.tsx    ficha de coche
    showroom/page.tsx        el local: fotos, renders, cómo llegar, visitas
    importacion/page.tsx     importación a medida + formulario de encargo
    vende-tu-coche/page.tsx  formulario de tasación
    nosotros/page.tsx        historia (40 años, 250 concesionarios) + vendidos
    contacto/page.tsx
    legal/{aviso-legal,privacidad,cookies}/page.tsx
  admin/                     panel (sin prefijo de idioma, solo castellano)
    login/page.tsx
    page.tsx                 lista de coches del usuario
    vehicles/new, vehicles/[id]/edit
    export/route.ts          CSV/feed para portales
  api/
    lead/route.ts            formulario → Resend + HubSpot + tabla leads
components/                  ui (botones, tarjetas), vehicle (galería, specs), forms, layout
lib/supabase/{client,server,admin}.ts · lib/i18n · lib/vehicles.ts (consultas tipadas)
supabase/migrations/*.sql · supabase/seed.sql
messages/es.json · messages/ca.json
docs/                        contexto, decisiones, este plan
```

### Modelo de datos (Supabase)

- `profiles` (id = auth.users.id, nombre, rol `admin | seller`, empresa). Carlos admin, Miquel seller.
- `vehicles`: id, slug, owner_id → profiles, estado `draft | available | reserved | sold`, marca, modelo, versión, año, km, combustible, cambio, potencia_cv, color, precio (€), iva_deducible (bool), origen (país), importado (bool), matriculado_es (bool), historial/revisiones (texto), garantía (texto), descripción ES y CA, destacado (bool), vendido_en (fecha), created/updated.
- `vehicle_images`: id, vehicle_id, path en Storage, orden, es_portada.
- `leads`: id, tipo `vehicle | import | sell | contact`, vehicle_id opcional, nombre, teléfono, email, mensaje, campos extra (jsonb), idioma, enviado_hubspot (bool), created.
- **RLS**: lectura pública de `vehicles` con estado ≠ draft y de sus imágenes; `seller` lee/escribe solo `owner_id = auth.uid()`; `admin` todo; `leads` solo inserta la route handler con la service key.
- Storage: bucket `vehicles` público en lectura, escritura solo autenticados sobre su carpeta `{owner_id}/{vehicle_id}/`.

### Panel de administración

Login con Supabase Auth. Lista de coches con estado y portada; formulario de alta/edición en una sola página (datos, origen/documentación, descripción ES/CA, fotos con arrastrar para ordenar y elegir portada); cambio de estado (disponible / reservado / vendido: los vendidos pasan a la galería de "vendidos"); exportación CSV con URLs de fotos para los portales. Usable en móvil.

### Diseño

Sistema oscuro: fondo grafito, texto blanco roto, un acento (a decidir en la propuesta de logo), tipografía display para titulares y sans neutra para texto; tarjetas de coche con foto a sangre; galería de ficha pensada para móvil (deslizar, zoom). Propuesta de logo: 3 variantes de wordmark "TOT AUTO" en SVG para que Carlos elija, antes de la fase 1.

## Referencias (investigadas el 21/10/2026)

Tres barridos (España, EE. UU., técnicas 3D) y revisión en el navegador de Maison Automotive, FJ Motors, Gunther Werks, Otherlife, Scout Motors, duPont Registry, Spyker y Lusion Gemini.

**Modelo de negocio y tono (lo más parecido a Tot Auto):**
- **Maison Automotive** (Barcelona) · maisonautomotive.es — showroom privado, "Pocos coches. Todos elegidos.", fondo negro con acento dorado, tarjetas con km/CV/cambio/precio, sección "Importación a medida: el coche que buscas, encontrado", cita privada, WhatsApp flotante, ES/EN. **Referencia principal de estructura y tono.**
- **Gunther Werks** (EE. UU.) · guntherwerks.com — Lenis + GSAP, carrusel a sangre, vídeo en bucle por ficha, narrativa marca → producto → proceso → contacto, control de "reducir movimiento".
- **Hispano Suiza** · hispanosuizacars.com — lujo sin 3D: vídeo, transiciones, galerías. Modelo de "premium y ligero".

**Stock y conversión:**
- **FJ Motors** (Barcelona) · fjmotorsbarcelona.com — buscador por marca/precio/combustible/cambio, orden, tarjetas con etiqueta "Disponible", WhatsApp flotante, separación clara comprar / vender / importar, reseñas Google.
- **MCM Cars** (Madrid) — WhatsApp con mensaje precargado por coche, cuota mensual en cada tarjeta.
- **duPont Registry** (EE. UU., Next.js) — hero con búsqueda por marca, tarjetas con precio + "Check availability", bloques "Vende tu coche" y "Financiación", sellos de confianza.
- **C. de Salamanca** (Madrid) — vídeo a pantalla completa + buscador y comparador serios (referencia de concesionario grande, no imitar el volumen).

**Wow / 3D / movimiento:**
- **Otherlife – Virtual Car Showroom** · labs.otherlife.xyz/virtual-car-showroom — Next.js + Three.js: intro con cámara orbitando el coche, transiciones cinematográficas entre coches, cambio de pintura, entornos HDR. Verificado en el navegador: carga ≈15 s, luego fluido. **Referencia principal de 3D.**
- **Scout Motors** · scoutmotors.com — vídeo controlado por scroll, UI móvil premiada (Awwwards SOTD, Webby). Referencia del "wow que funciona en móvil".
- **Spyker Cars** · spykercars.com — loader con el logo, hero de vídeo a pantalla completa con titular y CTA, luego secciones editoriales (texto + fotos de detalle que entran al hacer scroll), narrativa con cambio de hora del día y reserva de cita. Verificado en Chrome. Referencia de **loader de marca + hero de vídeo + ritmo editorial**.
- **Lusion – Gemini** · exp-gemini.lusion.co — visor de un coche con selector de color (7 pinturas), entorno brumoso con rejilla, DOF y postprocesado. Verificado en Chrome. Listón de calidad de render; solo escritorio.
- **Lando Norris / Longbow / Hispano Suiza** — tipografía, ritmo y microinteracciones como alternativa al 3D pesado.
- Lección de los fabricantes (Lucid, Porsche, Rimac): el fotorrealismo lo hacen en la nube; con nuestro presupuesto, lo fotorrealista se prerenderiza y el 3D en tiempo real es estilizado.

## Enfoque 3D y animación para Tot Auto

Objetivo: web "súper dinámica, 3D, con animaciones y movimiento" sin romper móvil ni plazo. Tres capas:

**1. Movimiento global (toda la web, barato, siempre activo)**
- `lenis` (scroll suave) sincronizado con `gsap.ticker`; `@gsap/react` con `useGSAP`; ScrollTrigger para secciones fijadas, revelados y parallax; `motion` (Framer Motion) para UI, `AnimatePresence` y transiciones de página.
- Textos con revelado por líneas (SplitText, ya gratis), contadores (40 años, 250 concesionarios), botones magnéticos, marquee de marcas, cursor personalizado en escritorio, imágenes con parallax y "clip reveal".
- `prefers-reduced-motion` respetado; todo el contenido (precios, textos) en HTML, nunca dentro del canvas.

**2. Hero 3D: "entra en el showroom" (el wow propio)**
- Usamos el **escaneo LiDAR real del local** (`totauto_intel/20_10_2026.glb`, 45 MB) como base: se limpia y decima en Blender, se exporta con `gltf-transform optimize` (Draco + KTX2) a ≤ 5 MB, y se estiliza en oscuro (malla grafito, aristas y luces LED emisivas, suelo reflectante). Dentro se colocan **coches genéricos sin logos** (modelos CC-BY/CC0 de Sketchfab o Poly Haven, optimizados) en las plazas reales de la sala principal y la trasera.
- Escena en `@react-three/fiber` v9 + `drei` (`useGLTF`, `Environment`, `ContactShadows`, `PerformanceMonitor`, `AdaptiveDpr`, `Preload`), postprocesado solo en escritorio. **Recorrido de cámara ligado al scroll** (timeline GSAP sobre la cámara; alternativa: animación de cámara exportada de Blender y recorrida con `AnimationMixer`): fachada de noche → entrada → sala principal → sala trasera → CTA "Visítanos / Ver stock".
- Carga diferida con `next/dynamic` (`ssr:false`) tras el LCP, con póster estático (render `finales-v3`) encima. **Móvil y GPU débil:** vídeo prerenderizado del mismo recorrido (desde la escena R3F o Blender) controlado por scroll, o secuencia de imágenes AVIF; detección con `PerformanceMonitor`/`detect-gpu`.
- **Spike en F0 (go/no-go en la semana 2):** si el escaneo no da una malla presentable, el hero pasa a vídeo/secuencia de imágenes sobre los renders y el 3D se reserva para una pieza más pequeña (logo 3D o coche genérico orbitando).

**3. Fichas y stock: foto primero, con movimiento**
- Sin 3D por coche (licencias de marca y coste): galería de fotos reales a sangre con transiciones, zoom y arrastre; "spin 360°" a partir de 24-36 fotos cuando Carlos las haga; vídeo corto en bucle por coche si existe. Tarjetas con hover 3D sutil (tilt) y transición compartida tarjeta → ficha.
- Página del showroom reutiliza la escena 3D en modo libre (orbitar con el ratón/dedo) + renders y fotos.

**Presupuesto de rendimiento (móvil):** GLB total ≤ 5 MB, ≤ 300 k triángulos, ≤ 100 draw calls, texturas KTX2 1K, pixel ratio ≤ 1,5, sin sombras en tiempo real (AO horneado + `ContactShadows frames={1}`), `frameloop="demand"` en reposo, pausa fuera de pantalla. Lighthouse móvil ≥ 85 en home (con 3D diferido), ≥ 90 en stock y ficha.

## Fases (≈10 semanas, apertura antes de fin de 2026)

**F0 · Arranque y spike 3D (semanas 1–2)**
Instalar las skills (ver sección). Crear proyecto Next.js en el repo, Tailwind, `next-intl`, Lenis + GSAP + Motion, estructura de carpetas, `.env.example`. Crear proyecto Supabase con el conector, migración inicial (tablas, RLS, bucket), `seed.sql` con los 5 coches y fotos de muestra. Tokens de diseño y 3 propuestas de logo. **Spike 3D:** optimizar el escaneo del local, montarlo en R3F con 2-3 coches genéricos y un recorrido de cámara por scroll; medir en móvil; decisión go/no-go del hero 3D al final de la semana 2. Documentar decisiones en `docs/`.

**F1 · Web pública con movimiento (semanas 3–5)**
Layout (cabecera, pie, selector de idioma, transiciones de página), inicio con hero 3D (o su alternativa en vídeo) y secciones animadas, stock con filtros, ficha con galería y botones de WhatsApp/llamar/formulario, showroom (escena 3D libre + renders y fotos de `totauto_intel/media`), nosotros + vendidos, contacto. Route handler de leads (Resend + HubSpot + tabla `leads`). Textos ES y CA.

**F2 · Panel y servicios (semanas 6–7)**
Auth y panel completo (CRUD, fotos, estados, export CSV). Páginas de importación a medida y vende tu coche con sus formularios. Cuenta para Miquel.

**F3 · Cierre (semanas 8–9)**
Legales de GUIXAGILS SL y banner de cookies, GA4, SEO (metadata, sitemap, JSON-LD, hreflang, redirecciones de URLs viejas), rendimiento (presupuesto de la sección 3D; Lighthouse móvil ≥ 85 home, ≥ 90 resto), `prefers-reduced-motion`, accesibilidad básica, pruebas en iPhone y Android reales y revisión de textos.

**F4 · Publicación (semana 10, cuando llegue el dominio)**
Proyecto en Vercel desde GitHub, variables de entorno, dominio totauto.net (cambiar DNS desde GitHub Pages), dominio verificado en Resend, Search Console con el sitemap nuevo, comprobar redirecciones.

## Verificación

- `npm run dev` en local con el proyecto Supabase: las 5 fichas de ejemplo se ven en ES y CA, filtros funcionan, galería en móvil (vista previa con el navegador integrado a 390 px).
- Formularios: un envío de prueba llega por email a Carlos, aparece en `leads` y como contacto en HubSpot; WhatsApp abre el chat con el texto del coche.
- Panel: Carlos crea, edita, sube fotos, marca vendido y exporta CSV; la cuenta de Miquel solo ve y edita sus coches (probar con RLS desde el cliente).
- 3D: el hero carga tras el LCP con póster, el recorrido de cámara sigue el scroll sin tirones en el Mac y en el iPhone de Carlos; en un móvil sin WebGL o con GPU débil se muestra el vídeo alternativo; con "reducir movimiento" activado no hay animación automática.
- `npm run build` sin errores; Lighthouse móvil ≥ 85 en inicio y ≥ 90 en stock y ficha.
- Antes de publicar: redirecciones de 10 URLs viejas al azar del sitemap antiguo, hreflang y JSON-LD validados.

## Habilidades (skills) para 3D y animación

Ya instaladas en el Mac (`~/.claude/skills`): `design-taste-frontend`, `emil-design-eng`, `impeccable`; en claude.ai: `frontend-design`. Ninguna cubre Three.js ni GSAP.

**Catálogo de claude.ai (tarjeta mostrada a Carlos, se instalan con un clic):**
- *Skills For Real React/React Native Engineers* (Jan Blazej): `gsap-scroll-trigger`, `gsap-react`, `gsap-timelines`, `gsap-performance`, `ui-motion`, `nextjs-routing`, `tailwind`, `unslop`.
- *audit-suite* (Orbit): `web-animation-design`, `vercel-react-best-practices`, `make-interfaces-feel-better`, auditorías de rendimiento y accesibilidad.
- *parallax-threejs* (Sean Corbett O'Donnell): depuración de escenas Three.js/GLSL con MCP de devtools y pruebas visuales (útil en F1-F3 cuando haya 3D).

**Repos públicos (MIT), instalar en F0 en `.claude/skills/` del proyecto:**
- `EnzeD/r3f-skills` (11 skills React Three Fiber: fundamentals, loaders, animation, materials, lighting, postprocessing, interaction…): `npx skills add EnzeD/r3f-skills`.
- `freshtechbro/claudedesignskills` (1.1k ★): `threejs-webgl`, `react-three-fiber`, `gsap-scrolltrigger`, `web3d-integration-patterns`, `blender-web-pipeline`, `spline-interactive`, `modern-web-design`: `/plugin marketplace add freshtechbro/claudedesignskills` + `/plugin install core-3d-animation` (o copiar los zips de `.claude/skills/`).
- `OpenAEC-Foundation/Three.js-Claude-Skill-Package` (24 skills Three.js puro, incl. `threejs-syntax-loaders`, `threejs-errors-performance`, `threejs-agents-model-optimizer` para Draco/KTX2): clonar en `.claude/skills/threejs`. Solo si hace falta bajar a Three.js sin R3F.

## Lo que necesito de Carlos (no bloquea el arranque)

1. Número de WhatsApp del showroom.
2. Datos de GUIXAGILS SL para los legales (razón social, CIF, dirección, email).
3. Portal ID y form ID de HubSpot (o permiso para crear el formulario con el conector).
4. Textos o notas para "Sobre nosotros" (40 años, 250 concesionarios, equipo) y horario de visitas.
5. Email de Miquel para su cuenta del panel.
6. Elección de logo entre las 3 variantes (F0) y del color de acento.
7. Fotos reales de los coches cuando existan (hasta entonces, fotos de muestra con licencia libre).
8. Instalar desde la tarjeta los tres plugins del catálogo (GSAP/React, audit-suite, parallax-threejs); los repos públicos los instalo yo en F0.
9. Si tienes 2-3 webs que te gusten (de estas o de otras), dímelo antes del diseño de F0.
