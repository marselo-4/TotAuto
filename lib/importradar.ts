import { createAdminClient } from "@/lib/supabase/admin";
import { slugify } from "@/lib/slug";
import type { Enums, TablesInsert } from "@/lib/supabase/database.types";

/**
 * Coches "bajo pedido": las oportunidades que Carlos tiene en seguimiento en ImportRadar
 * (SaaS propio) se publican en la web como stock listo para traer de Alemania, con el
 * precio de mercado español puesto en Tàrrega. Solo servidor (clave de API y cliente admin).
 */

const API_URL = (process.env.IMPORTRADAR_API_URL ?? "https://importradar.es").replace(/\/$/, "");
const MIN_MARGIN = Number(process.env.IMPORTRADAR_MIN_MARGIN_EUR ?? 3000);
/** Si la API no dice si el anuncio sigue activo, uno sin ver en el portal más de este tiempo se da por retirado. */
const STALE_MS = 14 * 24 * 60 * 60 * 1000;

/** ¿Sigue el anuncio a la venta en el portal de origen? */
export function listingAlive(o: ImportRadarOpportunity, now = Date.now()) {
  if (typeof o.listing.active === "boolean") return o.listing.active;
  return now - new Date(o.listing.lastSeenAt).getTime() < STALE_MS;
}

export type ImportRadarOpportunity = {
  id: string;
  status: string;
  estimatedSalePrice: number;
  salePriceRange: [number, number];
  landedCost: number;
  margin: number;
  confidence: number;
  computedAt: string;
  listing: {
    id: string;
    source: string;
    url: string;
    title: string;
    make: string;
    model: string;
    variant: string | null;
    year: number;
    km: number;
    price: number;
    vatDeductible: boolean;
    fuel: string | null;
    transmission: string | null;
    powerKw: number | null;
    location: string | null;
    lastSeenAt: string;
    /** false = el portal ya no muestra el anuncio (vendido o retirado). Puede faltar en versiones antiguas de la API. */
    active?: boolean;
    imageUrl?: string | null;
    color?: string | null;
  };
};

export function importRadarConfigured() {
  return Boolean(process.env.IMPORTRADAR_API_KEY);
}

/** Oportunidades en seguimiento de la organización dueña de la clave. */
export async function fetchWatchingOpportunities(): Promise<ImportRadarOpportunity[]> {
  const key = process.env.IMPORTRADAR_API_KEY;
  if (!key) throw new Error("Falta IMPORTRADAR_API_KEY");
  const res = await fetch(`${API_URL}/api/v1/opportunities?status=watching&limit=200`, {
    headers: { Authorization: `Bearer ${key}` },
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`ImportRadar ${res.status}: ${(await res.text()).slice(0, 200)}`);
  const body = (await res.json()) as { data: ImportRadarOpportunity[] };
  return body.data ?? [];
}

/* ---------- Normalización ---------- */

type Fuel = Enums<"fuel_type">;
type Gearbox = Enums<"gearbox_type">;

export function mapFuel(raw: string | null | undefined): Fuel {
  const s = (raw ?? "").toLowerCase();
  if (/plug|phev|enchuf/.test(s)) return "hibrido_enchufable";
  if (/hybrid|hibrid/.test(s)) return "hibrido";
  if (/electr|elektr|^ev$/.test(s)) return "electrico";
  if (/diesel|dies/.test(s)) return "diesel";
  return "gasolina";
}

export function mapGearbox(raw: string | null | undefined): Gearbox {
  const s = (raw ?? "").toLowerCase();
  if (/manual|schalt/.test(s)) return "manual";
  return "automatico";
}

export const kwToCv = (kw: number | null | undefined) => (kw ? Math.round(kw * 1.35962) : null);

// Palabras de relleno de los anuncios alemanes que no describen la versión
const NOISE = new Set([
  "voll", "vollausstattung", "hand", "uvp", "euro", "km", "led", "acc", "navi", "pano", "panorama", "leder", "shz", "lhz",
  "rfk", "ahk", "klima", "garantie", "neu", "sofort", "mwst", "netto", "scheckheft", "tempomat", "kamera", "cam", "pdc",
  "tempo", "alu", "alu18", "alu19", "alu20", "matrix", "digital", "r-cam", "head", "bose", "nappa", "carbon", "luft", "lkh",
  "sonos", "parkass", "lenkhzg", "pluspackage", "iq.light", "4m", "4m+", "4matic", "4matic+", "rückfahrkame", "kompaktlimousine",
  "edition", "amg-edition", "360°", "aut", "kw", "ps", "vw", "viii", "vii", "head-up", "hud", "sitzheizung", "standheizung",
]);

/** Deja de la "variante" del anuncio solo lo que parece la versión (el resto lo edita Carlos en el panel). */
export function cleanVariant(variant: string | null | undefined, make: string, model: string): string | null {
  if (!variant) return null;
  // Fuera paréntesis (potencias, series) y después el primer tramo antes de los separadores de extras
  const v = variant.replace(/\(.*?\)/g, " ").split(/[*/|+,]/)[0] ?? "";
  const skip = new Set([make, model, ...model.split(/\s+/)].map((w) => w.toLowerCase()));
  const words = v
    .split(/\s+/)
    .map((w) => w.trim())
    .filter((w) => w && !skip.has(w.toLowerCase()) && !NOISE.has(w.toLowerCase()) && !/^\d+([.,]\d+)?$/.test(w) && !/^\d\.hand$/i.test(w))
    .slice(0, 4);
  const out = words.join(" ").trim();
  return out.length >= 2 ? out.slice(0, 60) : null;
}

/** Precio público: mercado español redondeado a la centena inferior, nunca por debajo del coste + margen mínimo. */
export function suggestedPrice(o: Pick<ImportRadarOpportunity, "estimatedSalePrice" | "landedCost">): number {
  const market = Math.floor(o.estimatedSalePrice / 100) * 100;
  const floor = Math.ceil((o.landedCost + MIN_MARGIN) / 100) * 100;
  return Math.max(market, floor);
}

function fmt(n: number) {
  return new Intl.NumberFormat("es-ES").format(n);
}

const FUEL_ES: Record<Fuel, string> = { gasolina: "gasolina", diesel: "diésel", hibrido: "híbrido", hibrido_enchufable: "híbrido enchufable", electrico: "eléctrico" };
const FUEL_CA: Record<Fuel, string> = { gasolina: "gasolina", diesel: "dièsel", hibrido: "híbrid", hibrido_enchufable: "híbrid endollable", electrico: "elèctric" };

export function descriptionEs(o: ImportRadarOpportunity, fuel: Fuel, gearbox: Gearbox) {
  const l = o.listing;
  return (
    `Unidad localizada en Alemania y verificada por nuestro equipo antes de la compra. ${l.year}, ${fmt(l.km)} km, ` +
    `${FUEL_ES[fuel]}, cambio ${gearbox === "manual" ? "manual" : "automático"}. ` +
    `Se entrega en nuestro showroom de Tàrrega matriculada en España: transporte, IVA, impuesto de matriculación, ` +
    `ITV y placas incluidos en el precio. Plazo orientativo de cuatro a seis semanas desde el encargo.`
  );
}

export function descriptionCa(o: ImportRadarOpportunity, fuel: Fuel, gearbox: Gearbox) {
  const l = o.listing;
  return (
    `Unitat localitzada a Alemanya i verificada pel nostre equip abans de la compra. ${l.year}, ${fmt(l.km)} km, ` +
    `${FUEL_CA[fuel]}, canvi ${gearbox === "manual" ? "manual" : "automàtic"}. ` +
    `S'entrega al nostre showroom de Tàrrega matriculada a Espanya: transport, IVA, impost de matriculació, ` +
    `ITV i plaques inclosos en el preu. Termini orientatiu de quatre a sis setmanes des de l'encàrrec.`
  );
}

type VehicleRow = Omit<TablesInsert<"vehicles">, "owner_id" | "slug" | "status">;

/** Campos de la ficha a partir de la oportunidad. */
export function mapOpportunity(o: ImportRadarOpportunity): VehicleRow {
  const l = o.listing;
  const fuel = mapFuel(l.fuel);
  const gearbox = mapGearbox(l.transmission);
  return {
    make: l.make,
    model: l.model,
    version: cleanVariant(l.variant, l.make, l.model),
    year: l.year,
    km: l.km,
    fuel,
    gearbox,
    power_cv: kwToCv(l.powerKw),
    color: null,
    price_eur: suggestedPrice(o),
    vat_deductible: l.vatDeductible,
    origin_country: "DE",
    imported: true,
    registered_es: false,
    service_history: null,
    warranty: null,
    description_es: descriptionEs(o, fuel, gearbox),
    description_ca: descriptionCa(o, fuel, gearbox),
    featured: false,
    availability: "on_demand",
    source: "importradar",
    source_ref: o.id,
    source_url: l.url,
    source_price_eur: l.price,
    market_price_eur: o.estimatedSalePrice,
    source_synced_at: new Date().toISOString(),
  };
}

/* ---------- Sincronización ---------- */

export type SyncResult = { fetched: number; created: number; updated: number; unpublished: number; stale: number };

/**
 * Trae las oportunidades en seguimiento y las refleja en `vehicles`:
 * - nuevas → borrador (Carlos revisa y publica desde el panel);
 * - existentes → se actualizan km, precio de origen, estimación y fecha; el precio público solo mientras siga en borrador;
 * - las que ya no están en seguimiento o cuyo anuncio lleva días sin verse → si estaban publicadas, vuelven a borrador.
 */
export async function syncFromImportRadar(): Promise<SyncResult> {
  const opportunities = await fetchWatchingOpportunities();
  const now = Date.now();
  const fresh = opportunities.filter((o) => listingAlive(o, now));
  const stale = opportunities.length - fresh.length;

  const supabase = createAdminClient();
  const { data: existingRows, error } = await supabase
    .from("vehicles")
    .select("id, slug, status, source_ref")
    .eq("source", "importradar");
  if (error) throw new Error(`vehicles: ${error.message}`);
  const existing = new Map((existingRows ?? []).map((r) => [r.source_ref, r]));

  let created = 0;
  let updated = 0;
  let unpublished = 0;

  const ownerId = await resolveOwnerId();

  for (const o of fresh) {
    const row = mapOpportunity(o);
    const prev = existing.get(o.id);
    if (prev) {
      const patch: Partial<VehicleRow> = {
        km: row.km,
        source_price_eur: row.source_price_eur,
        market_price_eur: row.market_price_eur,
        source_url: row.source_url,
        source_synced_at: row.source_synced_at,
      };
      if (prev.status === "draft") patch.price_eur = row.price_eur;
      const { error: e } = await supabase.from("vehicles").update(patch).eq("id", prev.id);
      if (e) throw new Error(`update ${prev.id}: ${e.message}`);
      updated++;
    } else {
      const slug = await uniqueSlug(supabase, slugify(`${row.make} ${row.model} ${row.year}`));
      const { error: e } = await supabase.from("vehicles").insert({ ...row, slug, owner_id: ownerId, status: "draft" });
      if (e) throw new Error(`insert ${o.id}: ${e.message}`);
      created++;
    }
  }

  const activeRefs = new Set(fresh.map((o) => o.id));
  for (const prev of existing.values()) {
    if (!prev.source_ref || activeRefs.has(prev.source_ref)) continue;
    if (prev.status !== "available" && prev.status !== "reserved") continue;
    const { error: e } = await supabase
      .from("vehicles")
      .update({ status: "draft", source_synced_at: new Date().toISOString() })
      .eq("id", prev.id);
    if (e) throw new Error(`unpublish ${prev.id}: ${e.message}`);
    unpublished++;
  }

  return { fetched: opportunities.length, created, updated, unpublished, stale };
}

/** Dueño de las fichas importadas: IMPORTRADAR_OWNER_ID o el primer administrador. */
async function resolveOwnerId(): Promise<string> {
  if (process.env.IMPORTRADAR_OWNER_ID) return process.env.IMPORTRADAR_OWNER_ID;
  const supabase = createAdminClient();
  const { data, error } = await supabase.from("profiles").select("id").eq("role", "admin").order("created_at").limit(1).maybeSingle();
  if (error || !data) throw new Error("No hay ningún administrador al que asignar los coches importados");
  return data.id;
}

async function uniqueSlug(supabase: ReturnType<typeof createAdminClient>, base: string) {
  let slug = base;
  for (let i = 2; i < 50; i++) {
    const { data } = await supabase.from("vehicles").select("id").eq("slug", slug).maybeSingle();
    if (!data) return slug;
    slug = `${base}-${i}`;
  }
  return `${base}-${Date.now()}`;
}
