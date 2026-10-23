-- Coches "bajo pedido": unidades localizadas en Alemania (ImportRadar) que se publican como stock
-- listo para traer, con el precio de mercado español puesto en Tàrrega.

create type public.vehicle_availability as enum ('in_stock', 'on_demand');

alter table public.vehicles
  add column availability public.vehicle_availability not null default 'in_stock',
  add column source text not null default 'manual',   -- manual | importradar
  add column source_ref text,                          -- id de la oportunidad en ImportRadar
  add column source_url text,                          -- anuncio de origen (mobile.de, AutoScout24…)
  add column source_price_eur int,                     -- precio anunciado en origen
  add column market_price_eur int,                     -- venta estimada en España según ImportRadar
  add column source_synced_at timestamptz;             -- última sincronización

create unique index vehicles_source_ref_key on public.vehicles (source, source_ref) where source_ref is not null;
