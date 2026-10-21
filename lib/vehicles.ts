import { createClient } from "@/lib/supabase/server";
import type { StockFilters, VehicleWithImages } from "@/lib/vehicle-format";

// Solo consultas de servidor. Tipos y utilidades puras viven en lib/vehicle-format.ts.
export * from "@/lib/vehicle-format";

/** Coches visibles al público (disponibles y reservados) con filtros y orden. */
export async function listVehicles(filters: StockFilters = {}): Promise<VehicleWithImages[]> {
  const supabase = await createClient();
  let q = supabase.from("vehicles").select("*, vehicle_images(*)").in("status", ["available", "reserved"]);
  if (filters.make) q = q.eq("make", filters.make);
  if (filters.fuel) q = q.eq("fuel", filters.fuel);
  if (filters.gearbox) q = q.eq("gearbox", filters.gearbox);
  if (filters.priceMax) q = q.lte("price_eur", filters.priceMax);

  switch (filters.sort) {
    case "price_asc":
      q = q.order("price_eur", { ascending: true });
      break;
    case "price_desc":
      q = q.order("price_eur", { ascending: false });
      break;
    case "year_desc":
      q = q.order("year", { ascending: false }).order("km", { ascending: true });
      break;
    case "km_asc":
      q = q.order("km", { ascending: true });
      break;
    default:
      q = q.order("featured", { ascending: false }).order("created_at", { ascending: false });
  }

  const { data, error } = await q;
  if (error) throw new Error(`listVehicles: ${error.message}`);
  return (data ?? []) as VehicleWithImages[];
}

/** Marcas con coches publicados, para el filtro. */
export async function listMakes(): Promise<string[]> {
  const supabase = await createClient();
  const { data, error } = await supabase.from("vehicles").select("make").in("status", ["available", "reserved"]);
  if (error) throw new Error(`listMakes: ${error.message}`);
  return [...new Set((data ?? []).map((r) => r.make))].sort((a, b) => a.localeCompare(b));
}

export async function listAvailableVehicles(): Promise<VehicleWithImages[]> {
  return listVehicles();
}

/** Coches vendidos, para la galería de "vendidos". */
export async function listSoldVehicles(): Promise<VehicleWithImages[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("vehicles")
    .select("*, vehicle_images(*)")
    .eq("status", "sold")
    .order("sold_at", { ascending: false });
  if (error) throw new Error(`listSoldVehicles: ${error.message}`);
  return (data ?? []) as VehicleWithImages[];
}

export async function getVehicleBySlug(slug: string): Promise<VehicleWithImages | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("vehicles")
    .select("*, vehicle_images(*)")
    .eq("slug", slug)
    .neq("status", "draft")
    .maybeSingle();
  if (error) throw new Error(`getVehicleBySlug: ${error.message}`);
  return (data as VehicleWithImages | null) ?? null;
}

/** Otros coches publicados, para "también te puede interesar". */
export async function listRelatedVehicles(excludeId: string, limit = 3): Promise<VehicleWithImages[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("vehicles")
    .select("*, vehicle_images(*)")
    .in("status", ["available", "reserved"])
    .neq("id", excludeId)
    .order("featured", { ascending: false })
    .order("created_at", { ascending: false })
    .limit(limit);
  if (error) throw new Error(`listRelatedVehicles: ${error.message}`);
  return (data ?? []) as VehicleWithImages[];
}
