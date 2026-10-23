-- Avisos del linter de seguridad: search_path fijo y funciones internas no expuestas por la API.
create or replace function public.touch_updated_at()
returns trigger language plpgsql set search_path = public as $$
begin new.updated_at = now(); return new; end $$;

-- handle_new_user solo la llama el trigger (como owner): nadie debe poder ejecutarla por RPC.
revoke execute on function public.handle_new_user() from public, anon, authenticated;

-- is_admin() la usan las políticas RLS en el contexto del rol que consulta, así que
-- authenticated y anon necesitan EXECUTE. Solo devuelve un booleano sobre el propio usuario.
