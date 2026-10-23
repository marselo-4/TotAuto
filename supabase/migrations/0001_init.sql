-- Tot Auto · esquema inicial (coches, imágenes, perfiles, leads) con RLS.
-- Se aplica con el conector de Supabase (apply_migration) o con `supabase db push`.

create extension if not exists "pgcrypto";

-- ---------- Perfiles ----------
create type public.user_role as enum ('admin', 'seller');

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text not null default '',
  company text,
  role public.user_role not null default 'seller',
  created_at timestamptz not null default now()
);

-- Al crear un usuario en Auth se crea su perfil (rol seller por defecto).
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, coalesce(new.raw_user_meta_data ->> 'full_name', ''));
  return new;
end $$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

create or replace function public.is_admin()
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.profiles where id = auth.uid() and role = 'admin');
$$;

-- ---------- Vehículos ----------
create type public.vehicle_status as enum ('draft', 'available', 'reserved', 'sold');
create type public.fuel_type as enum ('gasolina', 'diesel', 'hibrido', 'hibrido_enchufable', 'electrico');
create type public.gearbox_type as enum ('manual', 'automatico');

create table public.vehicles (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  owner_id uuid not null references public.profiles (id) on delete restrict,
  status public.vehicle_status not null default 'draft',
  make text not null,
  model text not null,
  version text,
  year int not null check (year between 1950 and 2100),
  km int not null default 0 check (km >= 0),
  fuel public.fuel_type not null,
  gearbox public.gearbox_type not null,
  power_cv int check (power_cv > 0),
  color text,
  price_eur int not null check (price_eur >= 0),
  vat_deductible boolean not null default false,
  origin_country text,                 -- p. ej. 'DE'
  imported boolean not null default false,
  registered_es boolean not null default true,
  service_history text,
  warranty text,
  description_es text,
  description_ca text,
  featured boolean not null default false,
  sold_at date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index vehicles_status_idx on public.vehicles (status);
create index vehicles_owner_idx on public.vehicles (owner_id);

create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end $$;

create trigger vehicles_touch_updated_at
  before update on public.vehicles
  for each row execute function public.touch_updated_at();

-- ---------- Imágenes ----------
create table public.vehicle_images (
  id uuid primary key default gen_random_uuid(),
  vehicle_id uuid not null references public.vehicles (id) on delete cascade,
  path text not null,                  -- ruta en el bucket "vehicles": {owner_id}/{vehicle_id}/{file}
  position int not null default 0,
  is_cover boolean not null default false,
  alt text,
  created_at timestamptz not null default now()
);

create index vehicle_images_vehicle_idx on public.vehicle_images (vehicle_id, position);

-- ---------- Leads ----------
create type public.lead_type as enum ('vehicle', 'import', 'sell', 'contact');

create table public.leads (
  id uuid primary key default gen_random_uuid(),
  type public.lead_type not null,
  vehicle_id uuid references public.vehicles (id) on delete set null,
  name text not null,
  phone text,
  email text,
  message text,
  extra jsonb not null default '{}'::jsonb,
  locale text not null default 'es',
  sent_to_hubspot boolean not null default false,
  created_at timestamptz not null default now()
);

-- ---------- RLS ----------
alter table public.profiles enable row level security;
alter table public.vehicles enable row level security;
alter table public.vehicle_images enable row level security;
alter table public.leads enable row level security;

-- Perfiles: cada uno ve el suyo; admin ve todos.
create policy "profiles: own or admin read" on public.profiles
  for select using (id = auth.uid() or public.is_admin());
create policy "profiles: own update" on public.profiles
  for update using (id = auth.uid()) with check (id = auth.uid() and role = (select role from public.profiles where id = auth.uid()));

-- Vehículos: público lee los publicados; el dueño y el admin leen y escriben los suyos.
create policy "vehicles: public read published" on public.vehicles
  for select using (status <> 'draft');
create policy "vehicles: owner or admin read" on public.vehicles
  for select using (owner_id = auth.uid() or public.is_admin());
create policy "vehicles: owner or admin insert" on public.vehicles
  for insert with check (owner_id = auth.uid() or public.is_admin());
create policy "vehicles: owner or admin update" on public.vehicles
  for update using (owner_id = auth.uid() or public.is_admin());
create policy "vehicles: owner or admin delete" on public.vehicles
  for delete using (owner_id = auth.uid() or public.is_admin());

-- Imágenes: siguen al vehículo.
create policy "images: public read published" on public.vehicle_images
  for select using (exists (select 1 from public.vehicles v where v.id = vehicle_id and v.status <> 'draft'));
create policy "images: owner or admin all" on public.vehicle_images
  for all using (exists (select 1 from public.vehicles v where v.id = vehicle_id and (v.owner_id = auth.uid() or public.is_admin())))
  with check (exists (select 1 from public.vehicles v where v.id = vehicle_id and (v.owner_id = auth.uid() or public.is_admin())));

-- Leads: nadie desde el cliente; inserta la route handler con la clave secreta. Admin lee.
create policy "leads: admin read" on public.leads
  for select using (public.is_admin());

-- ---------- Storage ----------
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('vehicles', 'vehicles', true, 10485760, array['image/jpeg', 'image/png', 'image/webp', 'image/avif'])
on conflict (id) do nothing;

create policy "storage: public read vehicles" on storage.objects
  for select using (bucket_id = 'vehicles');
create policy "storage: owner writes own folder" on storage.objects
  for insert with check (bucket_id = 'vehicles' and (public.is_admin() or (storage.foldername(name))[1] = auth.uid()::text));
create policy "storage: owner updates own folder" on storage.objects
  for update using (bucket_id = 'vehicles' and (public.is_admin() or (storage.foldername(name))[1] = auth.uid()::text));
create policy "storage: owner deletes own folder" on storage.objects
  for delete using (bucket_id = 'vehicles' and (public.is_admin() or (storage.foldername(name))[1] = auth.uid()::text));
