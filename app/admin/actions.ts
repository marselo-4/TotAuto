"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { Constants, type TablesInsert } from "@/lib/supabase/database.types";

/* ---------- Sesión ---------- */

export type ActionState = { error?: string; ok?: boolean } | undefined;

export async function signIn(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const next = String(formData.get("next") ?? "/admin");
  if (!email || !password) return { error: "Escribe email y contraseña." };
  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return { error: "Email o contraseña incorrectos." };
  redirect(next.startsWith("/admin") ? next : "/admin");
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}

/* ---------- Vehículos ---------- */

const VehicleSchema = z.object({
  make: z.string().trim().min(1, "Marca obligatoria").max(60),
  model: z.string().trim().min(1, "Modelo obligatorio").max(80),
  version: z.string().trim().max(120).optional(),
  year: z.coerce.number().int().min(1950).max(2100),
  km: z.coerce.number().int().min(0),
  fuel: z.enum(Constants.public.Enums.fuel_type),
  gearbox: z.enum(Constants.public.Enums.gearbox_type),
  power_cv: z.coerce.number().int().positive().optional(),
  color: z.string().trim().max(60).optional(),
  price_eur: z.coerce.number().int().min(0),
  vat_deductible: z.boolean(),
  origin_country: z.string().trim().max(2).optional(),
  imported: z.boolean(),
  registered_es: z.boolean(),
  service_history: z.string().trim().max(2000).optional(),
  warranty: z.string().trim().max(200).optional(),
  description_es: z.string().trim().max(4000).optional(),
  description_ca: z.string().trim().max(4000).optional(),
  featured: z.boolean(),
  status: z.enum(Constants.public.Enums.vehicle_status),
});

function slugify(s: string) {
  return s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function parseVehicle(formData: FormData) {
  const raw: Record<string, unknown> = {};
  for (const [k, v] of formData.entries()) raw[k] = typeof v === "string" && v.trim() === "" ? undefined : v;
  for (const k of ["vat_deductible", "imported", "registered_es", "featured"]) raw[k] = formData.get(k) === "on";
  const parsed = VehicleSchema.safeParse(raw);
  if (!parsed.success) {
    const first = parsed.error.issues[0];
    return { error: `${first.path.join(".")}: ${first.message}` } as const;
  }
  const v = parsed.data;
  const row: Omit<TablesInsert<"vehicles">, "owner_id" | "slug"> = {
    make: v.make,
    model: v.model,
    version: v.version ?? null,
    year: v.year,
    km: v.km,
    fuel: v.fuel,
    gearbox: v.gearbox,
    power_cv: v.power_cv ?? null,
    color: v.color ?? null,
    price_eur: v.price_eur,
    vat_deductible: v.vat_deductible,
    origin_country: v.origin_country ? v.origin_country.toUpperCase() : null,
    imported: v.imported,
    registered_es: v.registered_es,
    service_history: v.service_history ?? null,
    warranty: v.warranty ?? null,
    description_es: v.description_es ?? null,
    description_ca: v.description_ca ?? null,
    featured: v.featured,
    status: v.status,
    sold_at: v.status === "sold" ? new Date().toISOString().slice(0, 10) : null,
  };
  return { row } as const;
}

function revalidatePublic() {
  revalidatePath("/admin");
  revalidatePath("/", "layout");
}

export async function createVehicle(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const parsed = parseVehicle(formData);
  if ("error" in parsed) return { error: parsed.error };
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Sesión caducada." };

  const base = slugify(`${parsed.row.make} ${parsed.row.model} ${parsed.row.year}`);
  let slug = base;
  for (let i = 2; i < 20; i++) {
    const { data } = await supabase.from("vehicles").select("id").eq("slug", slug).maybeSingle();
    if (!data) break;
    slug = `${base}-${i}`;
  }

  const { data, error } = await supabase
    .from("vehicles")
    .insert({ ...parsed.row, slug, owner_id: user.id })
    .select("id")
    .single();
  if (error) return { error: error.message };
  revalidatePublic();
  redirect(`/admin/vehicles/${data.id}?nuevo=1`);
}

export async function updateVehicle(id: string, _prev: ActionState, formData: FormData): Promise<ActionState> {
  const parsed = parseVehicle(formData);
  if ("error" in parsed) return { error: parsed.error };
  const supabase = await createClient();
  const { data: current } = await supabase.from("vehicles").select("sold_at").eq("id", id).maybeSingle();
  const sold_at = parsed.row.status === "sold" ? (current?.sold_at ?? parsed.row.sold_at) : null;
  const { error } = await supabase.from("vehicles").update({ ...parsed.row, sold_at }).eq("id", id);
  if (error) return { error: error.message };
  revalidatePublic();
  revalidatePath(`/admin/vehicles/${id}`);
  return { ok: true };
}

export async function setVehicleStatus(id: string, status: (typeof Constants.public.Enums.vehicle_status)[number]) {
  const supabase = await createClient();
  const sold_at = status === "sold" ? new Date().toISOString().slice(0, 10) : null;
  const { error } = await supabase.from("vehicles").update({ status, sold_at }).eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePublic();
}

export async function deleteVehicle(id: string) {
  const supabase = await createClient();
  const { data: imgs } = await supabase.from("vehicle_images").select("path").eq("vehicle_id", id);
  if (imgs && imgs.length) await supabase.storage.from("vehicles").remove(imgs.map((i) => i.path));
  const { error } = await supabase.from("vehicles").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePublic();
  redirect("/admin");
}

/* ---------- Fotos ---------- */

export async function addVehicleImage(vehicleId: string, path: string) {
  const supabase = await createClient();
  const { data: existing } = await supabase.from("vehicle_images").select("id").eq("vehicle_id", vehicleId);
  const position = existing?.length ?? 0;
  const { error } = await supabase.from("vehicle_images").insert({ vehicle_id: vehicleId, path, position, is_cover: position === 0 });
  if (error) throw new Error(error.message);
  revalidatePath(`/admin/vehicles/${vehicleId}`);
  revalidatePublic();
}

export async function reorderVehicleImages(vehicleId: string, orderedIds: string[]) {
  const supabase = await createClient();
  await Promise.all(orderedIds.map((id, i) => supabase.from("vehicle_images").update({ position: i }).eq("id", id)));
  revalidatePath(`/admin/vehicles/${vehicleId}`);
  revalidatePublic();
}

export async function setCoverImage(vehicleId: string, imageId: string) {
  const supabase = await createClient();
  await supabase.from("vehicle_images").update({ is_cover: false }).eq("vehicle_id", vehicleId);
  const { error } = await supabase.from("vehicle_images").update({ is_cover: true }).eq("id", imageId);
  if (error) throw new Error(error.message);
  revalidatePath(`/admin/vehicles/${vehicleId}`);
  revalidatePublic();
}

export async function deleteVehicleImage(vehicleId: string, imageId: string) {
  const supabase = await createClient();
  const { data: img } = await supabase.from("vehicle_images").select("path, is_cover").eq("id", imageId).maybeSingle();
  if (!img) return;
  await supabase.storage.from("vehicles").remove([img.path]);
  await supabase.from("vehicle_images").delete().eq("id", imageId);
  if (img.is_cover) {
    const { data: rest } = await supabase.from("vehicle_images").select("id").eq("vehicle_id", vehicleId).order("position").limit(1);
    if (rest?.[0]) await supabase.from("vehicle_images").update({ is_cover: true }).eq("id", rest[0].id);
  }
  revalidatePath(`/admin/vehicles/${vehicleId}`);
  revalidatePublic();
}
