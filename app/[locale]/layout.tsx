import type { Metadata } from "next";
import type { ReactNode } from "react";
import { notFound } from "next/navigation";
import { Geist, Bodoni_Moda } from "next/font/google";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { SmoothScroll } from "@/components/providers/smooth-scroll";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import "../globals.css";

const geist = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
// Display: Bodoni Moda, la misma familia del logo (propuesta A). Fuente variable con eje óptico.
const display = Bodoni_Moda({
  variable: "--font-bodoni",
  style: ["normal", "italic"],
  subsets: ["latin"],
  axes: ["opsz"],
});

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
    openGraph: { siteName: t("siteName"), type: "website", locale: locale === "ca" ? "ca_ES" : "es_ES" },
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

  return (
    <html lang={locale} className={`${geist.variable} ${display.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-bg text-fg">
        <NextIntlClientProvider>
          <SmoothScroll>
            <SiteHeader />
            <main className="flex-1">{children}</main>
            <SiteFooter />
          </SmoothScroll>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
