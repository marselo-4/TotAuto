import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { importRadarConfigured, syncFromImportRadar } from "@/lib/importradar";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

/**
 * Sincroniza los coches "bajo pedido" con ImportRadar. La llama el cron de Vercel (cabecera
 * Authorization: Bearer CRON_SECRET) o un administrador con sesión desde el panel.
 */
async function authorized(req: Request) {
  const secret = process.env.CRON_SECRET;
  if (secret && req.headers.get("authorization") === `Bearer ${secret}`) return true;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return false;
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).maybeSingle();
  return profile?.role === "admin";
}

async function handle(req: Request) {
  if (!(await authorized(req))) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  if (!importRadarConfigured()) return NextResponse.json({ error: "ImportRadar no está configurado (IMPORTRADAR_API_KEY)" }, { status: 503 });
  try {
    const result = await syncFromImportRadar();
    if (result.created || result.updated || result.unpublished) {
      revalidatePath("/admin");
      revalidatePath("/", "layout");
    }
    return NextResponse.json(result);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("[importradar] sync failed:", message);
    return NextResponse.json({ error: message }, { status: 502 });
  }
}

export const GET = handle;
export const POST = handle;
