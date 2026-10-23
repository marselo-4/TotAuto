import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { seoAlternates, SITE_URL } from "@/lib/seo";
import { site } from "@/lib/site";
import { listMakes } from "@/lib/vehicles";
import { ShowroomHero, type HeroCopy } from "@/components/hero/showroom-hero";
import { FeaturedStock } from "@/components/home/featured-stock";
import { ImportSection } from "@/components/home/import-section";
import { StatsStrip } from "@/components/home/stats-strip";
import { ShowroomSection } from "@/components/home/showroom-section";
import { ContactBand } from "@/components/home/contact-band";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return { alternates: seoAlternates(locale, "/") };
}

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "AutoDealer",
  name: site.name,
  url: SITE_URL,
  logo: `${SITE_URL}/brand/logo.svg`,
  image: `${SITE_URL}/og.jpg`,
  telephone: site.phone,
  email: site.email,
  address: {
    "@type": "PostalAddress",
    streetAddress: site.address.street,
    postalCode: site.address.postalCode,
    addressLocality: site.address.city,
    addressRegion: site.address.region,
    addressCountry: site.address.country,
  },
  geo: { "@type": "GeoCoordinates", latitude: site.address.lat, longitude: site.address.lng },
  areaServed: ["Lleida", "Catalunya", "España"],
  foundingDate: "1986",
};

// Las etapas del recorrido 3D enlazan con lo que vende el negocio: stock (1) e importación (2).
const CAPTION_LINKS: Record<number, string> = { 1: "/stock", 2: "/importacion" };

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const [t, makes] = await Promise.all([getTranslations("home"), listMakes()]);

  const copy: HeroCopy = {
    eyebrow: t("eyebrow"),
    title: t("title"),
    lead: t("lead"),
    ctaStock: t("ctaStock"),
    ctaImport: t("ctaImport"),
    ctaVisit: t("ctaVisit"),
    findByMake: t("findByMake"),
    scroll: t("scroll"),
    captions: [0, 1, 2, 3].map((i) => ({
      eyebrow: t(`captions.${i}.eyebrow`),
      title: t(`captions.${i}.title`),
      text: t(`captions.${i}.text`),
      cta: CAPTION_LINKS[i] ? { label: t(`captions.${i}.cta`), href: CAPTION_LINKS[i] } : undefined,
    })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <ShowroomHero copy={copy} makes={makes} />
      <FeaturedStock />
      <ImportSection />
      <StatsStrip />
      <ShowroomSection />
      <ContactBand />
    </>
  );
}
