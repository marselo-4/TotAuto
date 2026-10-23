# Landing "próximamente" (rama `landing-teaser`)

Rama desgajada de `main` el 23/10/2026 para publicar en totauto.net una landing de expectativa
mientras se termina la web completa. **No se fusiona en `main`**: cuando la web esté lista,
basta con cambiar la rama de producción del proyecto de Vercel a `main`.

## Qué contiene

- Una sola pantalla por idioma (`/` castellano, `/ca` catalán): logo, "Próximamente",
  "Tu coche, a la carta.", una línea de posicionamiento y contacto (teléfono, email, WhatsApp).
- Sin adelantar nada del local: en esta rama se han quitado el escaneo 3D (`public/models`),
  las fotos del showroom (`public/img`), la OG con la fachada, el panel, la API, Supabase y las demás páginas.
- Cualquier otra ruta (web antigua incluida) redirige con 307 a la portada (`proxy.ts` y `next.config.ts`).
- Movimiento solo con CSS (`rise`, `draw`, `glow` en `app/globals.css`): el texto está en el HTML
  desde el primer byte y respeta "reducir movimiento".
- Sin cookies ni analítica: no hace falta banner.
- OG (`public/og.jpg`): render de 1200×630 hecho con Chrome headless a partir del logo y los textos.

## Despliegue

- Proyecto de Vercel `totauto` enlazado a `marselo-4/TotAuto`, rama de producción `landing-teaser`.
- Variable: `NEXT_PUBLIC_SITE_URL=https://totauto.net` (canonical, hreflang, sitemap y OG).
- DNS en Hostinger: `A @ → 76.76.21.21` y `CNAME www → cname.vercel-dns.com`
  (antes apuntaba a GitHub Pages, 185.199.108–111.153 y `marselo-4.github.io`).
