-- Lista de espera para la inauguración (landing "próximamente").
-- Inserción anónima desde la web (clave publicable + RLS); lectura solo con la clave secreta o desde el panel de Supabase.

create table public.waitlist (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text not null check (char_length(name) between 2 and 120),
  email text not null check (email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'),
  phone text check (phone is null or char_length(phone) <= 40),
  locale text not null default 'es' check (locale in ('es', 'ca')),
  source text not null default 'landing-teaser',
  consent_at timestamptz not null default now()
);

-- Un email solo una vez (sin distinguir mayúsculas)
create unique index waitlist_email_unique on public.waitlist (lower(email));

alter table public.waitlist enable row level security;

-- Cualquiera puede apuntarse; nadie puede leer ni modificar sin la clave secreta
create policy "waitlist: anon insert" on public.waitlist
  for insert to anon, authenticated with check (true);

-- El rol anon no debe poder leer la tabla aunque exista una política futura por error
revoke select, update, delete on public.waitlist from anon, authenticated;
