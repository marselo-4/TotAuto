import { NextResponse } from "next/server";
import { z } from "zod";
import { createAdminClient } from "@/lib/supabase/admin";
import type { Json } from "@/lib/supabase/database.types";
import { site } from "@/lib/site";

const LeadSchema = z.object({
  type: z.enum(["vehicle", "import", "sell", "contact"]),
  vehicleId: z.string().uuid().optional(),
  name: z.string().trim().min(2).max(120),
  phone: z.string().trim().min(6).max(40),
  email: z.string().trim().email().max(200).optional().or(z.literal("")),
  message: z.string().trim().max(4000).optional().or(z.literal("")),
  consent: z.union([z.literal("on"), z.literal("true"), z.boolean()]),
  locale: z.enum(["es", "ca"]).default("es"),
  extra: z.record(z.string(), z.unknown()).optional(),
});

const TYPE_LABEL: Record<z.infer<typeof LeadSchema>["type"], string> = {
  vehicle: "Pregunta por un coche",
  import: "Encargo de importación a medida",
  sell: "Quiere vender su coche",
  contact: "Contacto general",
};

export async function POST(req: Request) {
  const parsed = LeadSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Datos no válidos" }, { status: 400 });
  }
  const lead = parsed.data;

  if (!process.env.SUPABASE_SECRET_KEY) {
    return NextResponse.json({ error: "Falta SUPABASE_SECRET_KEY en el servidor" }, { status: 500 });
  }

  // 1. Guardar en la base de datos (obligatorio)
  const supabase = createAdminClient();
  let vehicleLabel: string | null = null;
  if (lead.vehicleId) {
    const { data: v } = await supabase.from("vehicles").select("make, model, version, slug").eq("id", lead.vehicleId).maybeSingle();
    if (v) vehicleLabel = `${v.make} ${v.model}${v.version ? ` ${v.version}` : ""} (/stock/${v.slug})`;
  }
  const { data: row, error } = await supabase
    .from("leads")
    .insert({
      type: lead.type,
      vehicle_id: lead.vehicleId ?? null,
      name: lead.name,
      phone: lead.phone,
      email: lead.email || null,
      message: lead.message || null,
      locale: lead.locale,
      extra: (lead.extra ?? {}) as Json,
    })
    .select("id")
    .single();
  if (error) {
    console.error("lead insert", error);
    return NextResponse.json({ error: "No se ha podido guardar el mensaje" }, { status: 500 });
  }

  // 2. Email (opcional hasta configurar Resend)
  const results: Record<string, boolean> = { db: true };
  if (process.env.RESEND_API_KEY) {
    try {
      const { Resend } = await import("resend");
      const resend = new Resend(process.env.RESEND_API_KEY);
      const lines = [
        `Tipo: ${TYPE_LABEL[lead.type]}`,
        vehicleLabel ? `Coche: ${vehicleLabel}` : null,
        `Nombre: ${lead.name}`,
        `Teléfono: ${lead.phone}`,
        lead.email ? `Email: ${lead.email}` : null,
        `Idioma: ${lead.locale}`,
        "",
        lead.message || "(sin mensaje)",
      ].filter((l): l is string => l !== null);
      await resend.emails.send({
        from: process.env.LEADS_FROM ?? `Tot Auto <onboarding@resend.dev>`,
        to: process.env.LEADS_TO ?? site.email,
        replyTo: lead.email || undefined,
        subject: `[Web] ${TYPE_LABEL[lead.type]}${vehicleLabel ? ` · ${vehicleLabel.split(" (")[0]}` : ""} · ${lead.name}`,
        text: lines.join("\n"),
      });
      results.email = true;
    } catch (err) {
      console.error("lead email", err);
      results.email = false;
    }
  }

  // 3. HubSpot Forms API (opcional hasta tener portal y formulario)
  const portal = process.env.HUBSPOT_PORTAL_ID;
  const formId = process.env.HUBSPOT_FORM_ID;
  if (portal && formId) {
    try {
      const [firstname, ...rest] = lead.name.split(" ");
      const res = await fetch(`https://api.hsforms.com/submissions/v3/integration/submit/${portal}/${formId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fields: [
            { name: "firstname", value: firstname },
            { name: "lastname", value: rest.join(" ") },
            { name: "phone", value: lead.phone },
            ...(lead.email ? [{ name: "email", value: lead.email }] : []),
            { name: "message", value: [TYPE_LABEL[lead.type], vehicleLabel, lead.message].filter(Boolean).join("\n") },
          ],
          context: { pageUri: req.headers.get("referer") ?? undefined },
          legalConsentOptions: { consent: { consentToProcess: true, text: "Acepta la política de privacidad", communications: [] } },
        }),
      });
      results.hubspot = res.ok;
      if (res.ok) await supabase.from("leads").update({ sent_to_hubspot: true }).eq("id", row.id);
      else console.error("hubspot", res.status, await res.text());
    } catch (err) {
      console.error("lead hubspot", err);
      results.hubspot = false;
    }
  }

  return NextResponse.json({ ok: true, id: row.id, results });
}
