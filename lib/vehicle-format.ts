import type { Database } from "@/lib/supabase/database.types";

/** Tipos y utilidades puras del stock: sin dependencias de servidor, importables desde componentes cliente. */

export type Vehicle = Database["public"]["Tables"]["vehicles"]["Row"];
export type VehicleImage = Database["public"]["Tables"]["vehicle_images"]["Row"];
export type VehicleWithImages = Vehicle & { vehicle_images: VehicleImage[] };
export type Fuel = Database["public"]["Enums"]["fuel_type"];
export type Gearbox = Database["public"]["Enums"]["gearbox_type"];
export type Availability = Database["public"]["Enums"]["vehicle_availability"];

export const isOnDemand = (v: Pick<Vehicle, "availability">) => v.availability === "on_demand";

const STORAGE_PUBLIC = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/vehicles/`;

export function imageUrl(path: string) {
  return STORAGE_PUBLIC + path;
}

export function sortedImages(v: VehicleWithImages): VehicleImage[] {
  return [...v.vehicle_images].sort((a, b) => Number(b.is_cover) - Number(a.is_cover) || a.position - b.position);
}

export function coverOf(v: VehicleWithImages): VehicleImage | undefined {
  return sortedImages(v)[0];
}

export function vehicleTitle(v: Vehicle) {
  return `${v.make} ${v.model}${v.version ? ` ${v.version}` : ""}`;
}

export const SORT_OPTIONS = ["featured", "price_asc", "price_desc", "year_desc", "km_asc"] as const;
export type SortOption = (typeof SORT_OPTIONS)[number];

export const PRICE_CAPS = [50000, 75000, 100000, 150000, 250000] as const;

export type StockFilters = {
  make?: string;
  fuel?: Fuel;
  gearbox?: Gearbox;
  priceMax?: number;
  availability?: Availability;
  sort?: SortOption;
};

/** Valores de la URL (?disponibilidad=) para el filtro de disponibilidad. */
export const AVAILABILITY_PARAM: Record<string, Availability> = { showroom: "in_stock", pedido: "on_demand" };
export const availabilityParam = (a: Availability) => (a === "in_stock" ? "showroom" : "pedido");

export const FUELS: Fuel[] = ["gasolina", "diesel", "hibrido", "hibrido_enchufable", "electrico"];
export const GEARBOXES: Gearbox[] = ["manual", "automatico"];

/** Convierte los searchParams de la URL en filtros válidos (lo que no cuadra se ignora). */
export function parseStockFilters(params: Record<string, string | string[] | undefined>): StockFilters {
  const one = (k: string) => (Array.isArray(params[k]) ? params[k]?.[0] : params[k]) as string | undefined;
  const f: StockFilters = {};
  const make = one("marca");
  if (make) f.make = make;
  const fuel = one("combustible");
  if (fuel && FUELS.includes(fuel as Fuel)) f.fuel = fuel as Fuel;
  const gearbox = one("cambio");
  if (gearbox && GEARBOXES.includes(gearbox as Gearbox)) f.gearbox = gearbox as Gearbox;
  const price = Number(one("precio"));
  if (PRICE_CAPS.includes(price as (typeof PRICE_CAPS)[number])) f.priceMax = price;
  const availability = one("disponibilidad");
  if (availability && AVAILABILITY_PARAM[availability]) f.availability = AVAILABILITY_PARAM[availability];
  const sort = one("orden");
  if (sort && SORT_OPTIONS.includes(sort as SortOption)) f.sort = sort as SortOption;
  return f;
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
