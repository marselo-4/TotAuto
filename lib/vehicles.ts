import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/lib/supabase/database.types";

export type Vehicle = Database["public"]["Tables"]["vehicles"]["Row"];
export type VehicleImage = Database["public"]["Tables"]["vehicle_images"]["Row"];
export type VehicleWithImages = Vehicle & { vehicle_images: VehicleImage[] };

const STORAGE_PUBLIC = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/vehicles/`;

export function imageUrl(path: string) {
  return STORAGE_PUBLIC + path;
}

export function coverOf(v: VehicleWithImages): VehicleImage | undefined {
  return v.vehicle_images.find((i) => i.is_cover) ?? [...v.vehicle_images].sort((a, b) => a.position - b.position)[0];
}

/** Coches visibles al público (disponibles y reservados), destacados primero. */
export async function listAvailableVehicles(): Promise<VehicleWithImages[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("vehicles")
    .select("*, vehicle_images(*)")
    .in("status", ["available", "reserved"])
    .order("featured", { ascending: false })
    .order("created_at", { ascending: false });
  if (error) throw new Error(`listAvailableVehicles: ${error.message}`);
  return (data ?? []) as VehicleWithImages[];
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

export function formatPrice(eur: number, locale: string) {
  return new Intl.NumberFormat(locale === "ca" ? "ca-ES" : "es-ES", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(eur);
}

export function formatKm(km: number, locale: string) {
  return `${new Intl.NumberFormat(locale === "ca" ? "ca-ES" : "es-ES").format(km)} km`;
}
