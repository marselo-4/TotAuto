# Tot Auto — guía para agentes

Web del showroom de deportivos y alta gama de Tot Auto (Tàrrega). Next.js 16 (App Router) + Tailwind 4 + next-intl + Supabase + GSAP/Lenis/Motion + React Three Fiber.

## Lee antes de tocar nada
- `docs/plan-desarrollo.md` — plan aprobado, decisiones, fases y referencias. Fuente de verdad.
- `docs/contexto-web-anterior.md` — qué era la web de 2024 y qué no repetir.
- Contexto de negocio (fuera del repo): `/Users/carlos/totauto_intel/contexto/`.

## Convenciones
- Idiomas: `/` castellano (por defecto), `/ca` catalán. Textos en `messages/{es,ca}.json`; nunca cadenas sueltas en componentes públicos. Cada página pública llama a `setRequestLocale(locale)`.
- Rutas públicas en `app/[locale]/…`; panel en `app/admin` (solo castellano); API en `app/api`.
- Enlaces internos con `Link` de `@/i18n/navigation`, nunca `next/link`.
- Datos fijos del negocio en `lib/site.ts`. Secretos solo en `.env.local` (plantilla en `.env.example`).
- Coches «bajo pedido»: vienen de ImportRadar por API (`lib/importradar.ts`, `docs/importradar-bajo-pedido.md`); nunca publicar fotos de los anuncios de origen.
- Supabase: `lib/supabase/{client,server,admin}.ts`. `admin` salta RLS: solo en servidor y solo cuando haga falta. Esquema en `supabase/migrations/`, datos de ejemplo en `supabase/seed.sql`.
- Diseño: tokens en el `@theme` de `app/globals.css` (`--color-bg`, `--color-fg`, `--color-accent`, `--font-display`…), definidos una sola vez; nunca redeclarar una variable del tema en `:root` con el mismo nombre (referencia circular). Oscuro, galería, un solo acento. Utilidades propias: `container-x`, `eyebrow`, `display`.
- Movimiento: scroll suave con Lenis (`components/providers/smooth-scroll.tsx`) sincronizado con el ticker de GSAP; ScrollTrigger para scroll; `motion` para UI. Nunca animar el mismo nodo con los dos. Respetar `prefers-reduced-motion`. Contenido (precios, textos) siempre en HTML, nunca solo dentro del canvas.
- 3D: componentes de cliente cargados con `next/dynamic` y `ssr: false` tras el LCP, con póster. Modelos en `public/models/`. Presupuesto móvil en el plan.
- Skills del proyecto en `.claude/skills/` (R3F, Three.js, GSAP, Motion, Blender→web, diseño web). Úsalas cuando toque su tema.

## Comandos
- `npm run dev` · `npm run build` · `npm run lint` · `npx tsc --noEmit`
- No desplegar hasta que llegue el dominio totauto.net (en transferencia).
