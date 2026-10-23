# Landing "próximamente" (rama `landing-teaser`)

Rama desgajada de `main` el 23/10/2026 para publicar en totauto.net una landing de expectativa
mientras se termina la web completa. **No se fusiona en `main`**: cuando la web esté lista,
basta con cambiar la rama de producción del proyecto de Vercel a `main`.

## Qué contiene

- Portada por idioma (`/` castellano, `/ca` catalán): logo, "Próximamente", "Tu coche, a la carta.",
  una línea de posicionamiento y contacto (teléfono, email, WhatsApp).
- **Lista de espera para la inauguración**: formulario (nombre, email, teléfono opcional, consentimiento)
  que inserta en la tabla `waitlist` de Supabase vía Server Action con la clave publicable
  (`supabase/migrations/0003_waitlist.sql`: RLS solo permite insertar al rol anónimo; email único).
  Los apuntados se ven en el panel de Supabase (Table Editor → waitlist). La política de privacidad
  (`/legal/privacidad`) se mantiene porque la enlaza el consentimiento.
- Tipografía display: Archivo variable (expandida, peso 800, mayúsculas) en lugar de Bodoni, por el
  carácter deportivo; los colores (grafito, blanco roto, champán) y el logo no cambian.
- Sin adelantar nada del local: en esta rama se han quitado el escaneo 3D (`public/models`),
  las fotos del showroom (`public/img`), la OG con la fachada, el panel, la API, Supabase y las demás páginas.
- Cualquier otra ruta (web antigua incluida) redirige con 307 a la portada (`proxy.ts` y `next.config.ts`).
- Movimiento solo con CSS (`rise`, `draw`, `glow` en `app/globals.css`): el texto está en el HTML
  desde el primer byte y respeta "reducir movimiento".
- Sin cookies ni analítica: no hace falta banner.
- OG (`public/og.jpg`): render de 1200×630 hecho con Chrome headless a partir del logo y los textos.

## Despliegue

- Proyecto de Vercel `totauto` enlazado a `marselo-4/TotAuto`, rama de producción `landing-teaser`.
- Variables: `NEXT_PUBLIC_SITE_URL=https://totauto.net` (canonical, hreflang, sitemap y OG),
  `NEXT_PUBLIC_SUPABASE_URL` y `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` (lista de espera).
- DNS en Hostinger (23/10/2026): `A @ → 216.198.79.1` y `CNAME www → 75127cff6d4d826f.vercel-dns-017.com`
  (los valores que recomienda Vercel para este proyecto). Se quitaron los A/AAAA y el CNAME de GitHub Pages;
  MX, SPF, DKIM y DMARC de Google Workspace no se tocaron.
- Cuando se publique la web completa desde `main`, copiar antes `0003_waitlist.sql` a `main` (ya está aplicada en Supabase).
