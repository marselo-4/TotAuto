import { createClient } from "@supabase/supabase-js";
import type { Database } from "./database.types";

/**
 * Cliente con la clave secreta: salta RLS. Solo en el servidor y solo para tareas
 * concretas (insertar leads desde la route handler, tareas de mantenimiento).
 */
export function createAdminClient() {
  if (typeof window !== "undefined") throw new Error("createAdminClient solo puede usarse en el servidor");
  return createClient<Database>(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SECRET_KEY!, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
