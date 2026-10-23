import type { Metadata } from "next";
import type { ReactNode } from "react";
import { notFound } from "next/navigation";
import { Archivo } from "next/font/google";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { SmoothScroll } from "@/components/providers/smooth-scroll";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { CookieConsent } from "@/components/providers/cookie-consent";
import "../globals.css";

// Una sola familia variable con eje de anchura (wdth 62–125): ancha y negrita en titulares,
// normal en texto corrido, condensada en etiquetas. Aire deportivo, moderno, un solo archivo.
const archivo = Archivo({ variable: "--font-archivo", subsets: ["latin"], axes: ["wdth"] });

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });
  return {
    title: { default: t("defaultTitle"), template: `%s · ${t("siteName")}` },
    description: t("defaultDescription"),
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
    openGraph: {
      siteName: t("siteName"),
      type: "website",
      locale: locale === "ca" ? "ca_ES" : "es_ES",
      images: [{ url: "/og.jpg", width: 1200, height: 630, alt: t("siteName") }],
    },
    twitter: { card: "summary_large_image" },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  const a11y = await getTranslations({ locale, namespace: "a11y" });

  return (
    <html lang={locale} className={`${archivo.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-bg text-fg">
        <a
          href="#contenido"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[70] focus:rounded-sm focus:bg-accent focus:px-4 focus:py-2 focus:text-accent-ink"
        >
          {a11y("skip")}
        </a>
        <NextIntlClientProvider>
          <SmoothScroll>
            <SiteHeader />
            <main id="contenido" className="flex-1">{children}</main>
            <SiteFooter />
          </SmoothScroll>
          <CookieConsent />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
