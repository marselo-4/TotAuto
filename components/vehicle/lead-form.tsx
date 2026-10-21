"use client";

import { useState, type FormEvent } from "react";
import { useLocale, useTranslations } from "next-intl";

type Status = "idle" | "sending" | "ok" | "error";

/**
 * Formulario de contacto reutilizable. `type` dice qué pide el lead; `vehicleId` lo enlaza al coche.
 * Envía a /api/lead, que guarda en Supabase, manda el email y crea el contacto en HubSpot.
 */
export function LeadForm({
  type,
  vehicleId,
  defaultMessage = "",
  compact = false,
}: {
  type: "vehicle" | "import" | "sell" | "contact";
  vehicleId?: string;
  defaultMessage?: string;
  compact?: boolean;
}) {
  const t = useTranslations("leadForm");
  const locale = useLocale();
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());
    // Honeypot: si el campo oculto viene relleno, es un bot
    if (data.website) return;
    setStatus("sending");
    setError(null);
    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, type, vehicleId, locale }),
      });
      if (!res.ok) {
        const body = (await res.json().catch(() => null)) as { error?: string } | null;
        throw new Error(body?.error ?? `HTTP ${res.status}`);
      }
      setStatus("ok");
      form.reset();
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : String(err));
    }
  }

  if (status === "ok") {
    return (
      <div className="rounded-card border border-accent/40 bg-bg-elev p-6">
        <p className="font-display text-2xl">{t("okTitle")}</p>
        <p className="mt-2 text-sm text-fg-muted">{t("okText")}</p>
      </div>
    );
  }

  const field = "w-full rounded-md border border-line bg-bg px-4 py-3 text-sm outline-none transition-colors placeholder:text-fg-faint focus:border-accent";

  return (
    <form onSubmit={onSubmit} className="grid gap-3">
      <div className={`grid gap-3 ${compact ? "" : "sm:grid-cols-2"}`}>
        <input name="name" required autoComplete="name" placeholder={t("name")} aria-label={t("name")} className={field} />
        <input name="phone" required type="tel" autoComplete="tel" placeholder={t("phone")} aria-label={t("phone")} className={field} />
      </div>
      <input name="email" type="email" autoComplete="email" placeholder={t("email")} aria-label={t("email")} className={field} />
      <textarea name="message" rows={compact ? 3 : 4} defaultValue={defaultMessage} placeholder={t("message")} aria-label={t("message")} className={field} />
      <input name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />
      <label className="flex items-start gap-2 text-xs text-fg-muted">
        <input type="checkbox" name="consent" required className="mt-0.5 accent-accent" />
        <span>{t("consent")}</span>
      </label>
      <button
        type="submit"
        disabled={status === "sending"}
        className="rounded-full bg-accent px-6 py-3 text-sm font-medium text-accent-ink transition-opacity hover:opacity-90 disabled:opacity-60"
      >
        {status === "sending" ? t("sending") : t("send")}
      </button>
      {status === "error" && (
        <p role="alert" className="text-sm text-red-300">
          {t("errorText")} {error && <span className="text-fg-faint">({error})</span>}
        </p>
      )}
    </form>
  );
}
