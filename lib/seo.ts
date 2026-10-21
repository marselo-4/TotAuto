import type { Metadata } from "next";
import { routing } from "@/i18n/routing";

export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, "");

/** URL pública de una ruta en un idioma ("/" castellano sin prefijo, "/ca/…" catalán). */
export function localizedUrl(locale: string, path: string) {
  const clean = path === "/" ? "" : path;
  return locale === routing.defaultLocale ? `${SITE_URL}${clean || "/"}` : `${SITE_URL}/${locale}${clean}`;
}

/** canonical + hreflang para una ruta. `path` sin prefijo de idioma, p. ej. "/stock". */
export function seoAlternates(locale: string, path: string): NonNullable<Metadata["alternates"]> {
  const languages: Record<string, string> = {};
  for (const l of routing.locales) languages[l] = localizedUrl(l, path);
  languages["x-default"] = localizedUrl(routing.defaultLocale, path);
  return { canonical: localizedUrl(locale, path), languages };
}
