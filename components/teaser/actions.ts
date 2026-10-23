"use server";

import { z } from "zod";
import { createClient } from "@supabase/supabase-js";
import { getLocale, getTranslations } from "next-intl/server";

const Schema = z.object({
  name: z.string().trim().min(2).max(120),
  email: z.email().trim().max(200),
  phone: z.string().trim().max(40).optional().or(z.literal("")),
  consent: z.literal("on"),
});

export type WaitlistState = { status: "idle" | "ok" | "error"; message?: string };

/**
 * Alta en la lista de espera. Inserta con la clave publicable: la tabla `waitlist` solo
 * permite insertar al rol anónimo (RLS), nunca leer. El email es único (índice sin mayúsculas).
 */
export async function joinWaitlist(_prev: WaitlistState, formData: FormData): Promise<WaitlistState> {
  const t = await getTranslations("waitlist");
  const locale = await getLocale();

  // Honeypot: si el campo oculto viene relleno, es un bot. Fingimos éxito y no guardamos nada.
  if (formData.get("website")) return { status: "ok" };

  const parsed = Schema.safeParse(Object.fromEntries(formData.entries()));
  if (!parsed.success) return { status: "error", message: t("errorInvalid") };

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) return { status: "error", message: t("errorServer") };

  const supabase = createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
  const { name, email, phone } = parsed.data;
  const { error } = await supabase
    .from("waitlist")
    .insert({ name, email: email.toLowerCase(), phone: phone || null, locale: locale === "ca" ? "ca" : "es" });

  if (error) {
    if (error.code === "23505") return { status: "ok", message: t("already") };
    console.error("[waitlist]", error.message);
    return { status: "error", message: t("errorServer") };
  }
  return { status: "ok" };
}
