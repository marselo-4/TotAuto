import type { Metadata } from "next";
import { routing } from "@/i18n/routing";
import { site } from "@/lib/site";

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

/** JSON-LD de la portada: el negocio (AutoDealer, para el panel local de Google) y el sitio. */
export function homeJsonLd(locale: string, description: string) {
  const url = localizedUrl(locale, "/");
  const { address } = site;
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "AutoDealer",
        "@id": `${SITE_URL}/#negocio`,
        name: site.name,
        legalName: site.legalEntity,
        description,
        url: SITE_URL,
        logo: `${SITE_URL}/brand/logo-on-white.svg`,
        image: `${SITE_URL}/og.jpg`,
        telephone: site.phone,
        email: site.email,
        address: {
          "@type": "PostalAddress",
          streetAddress: address.street,
          postalCode: address.postalCode,
          addressLocality: address.city,
          addressRegion: address.region,
          addressCountry: address.country,
        },
        geo: { "@type": "GeoCoordinates", latitude: address.lat, longitude: address.lng },
        areaServed: ["Lleida", "Catalunya", "España"],
        sameAs: site.sameAs,
      },
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#web`,
        url,
        name: site.name,
        inLanguage: locale,
        publisher: { "@id": `${SITE_URL}/#negocio` },
      },
    ],
  };
}
