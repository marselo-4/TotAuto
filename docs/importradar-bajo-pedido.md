# Coches "bajo pedido" desde ImportRadar

_Añadido el 23/10/2026. Las oportunidades que Carlos tiene **en seguimiento** en ImportRadar (su SaaS,
repo `buscador-de-oportunidades`) se publican en la web como stock listo para traer de Alemania, con el
precio de mercado español puesto en Tàrrega._

## Cómo funciona

1. `lib/importradar.ts` llama a `GET /api/v1/opportunities?status=watching` de ImportRadar con la clave
   de API de la organización Totauto (`IMPORTRADAR_API_KEY`).
2. Cada oportunidad se convierte en una fila de `vehicles` (`mapOpportunity`): combustible y cambio
   normalizados, kW → CV, versión limpiada del título alemán (`cleanVariant`; Carlos la corrige en el
   panel), descripción por plantilla en ES y CA, `availability = on_demand`, `source = importradar`,
   `source_ref` = id de la oportunidad, `source_url` = anuncio de origen, `source_price_eur` = precio en
   Alemania (no se muestra en la web) y `market_price_eur` = venta estimada en España.
3. **Precio público** (`suggestedPrice`): venta estimada en España redondeada a la centena inferior, nunca
   por debajo de `landedCost + IMPORTRADAR_MIN_MARGIN_EUR` (3.000 € por defecto).
4. **Sincronización** (`syncFromImportRadar`): las nuevas entran como **borrador**; las existentes
   actualizan km, precio de origen, estimación y fecha (el precio público solo mientras sigan en borrador);
   las que ya no están en seguimiento, o cuyo anuncio ya no está activo (`listing.active`, con respaldo de
   14 días sin verse), pasan de publicadas a borrador.
5. Se lanza desde el panel (botón «Traer de ImportRadar», solo admin) o por cron de Vercel una vez al día a
   las 07:00 UTC, después del rastreo nocturno de ImportRadar (`vercel.json` → `/api/importradar/sync`,
   cabecera `Authorization: Bearer CRON_SECRET`). El plan Hobby de Vercel solo admite crons diarios: una
   expresión más frecuente hace fallar el despliegue entero.

## En la web

- Tarjeta: etiqueta «Bajo pedido · Alemania» y «Puesto en Tàrrega · 4–6 semanas» bajo el precio.
- Ficha: etiqueta junto al precio, bloque «Listo para traer de Alemania» con lo que incluye y aviso de
  disponibilidad; WhatsApp con mensaje de encargo; JSON-LD con `availability: PreOrder`.
- Stock: filtro «Disponibilidad» (`?disponibilidad=showroom|pedido`); por defecto los del showroom van antes.
- **Sin fotos del anuncio**: son del vendedor alemán y republicarlas incumple los términos de los portales.
  Carlos las añade en el panel si las consigue con permiso.

## Variables de entorno

`IMPORTRADAR_API_URL` (https://importradar.es), `IMPORTRADAR_API_KEY`, `IMPORTRADAR_MIN_MARGIN_EUR`,
`CRON_SECRET` (Vercel), `IMPORTRADAR_OWNER_ID` (opcional; si falta, el primer admin). La sincronización
escribe con `SUPABASE_SECRET_KEY`.

## Migración

`supabase/migrations/0004_import_on_demand.sql`: enum `vehicle_availability`, columnas `availability`,
`source`, `source_ref`, `source_url`, `source_price_eur`, `market_price_eur`, `source_synced_at` e índice
único `(source, source_ref)`. Aplicada en el proyecto remoto el 23/10/2026.
