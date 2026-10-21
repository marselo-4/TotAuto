import { getTranslations, setRequestLocale } from "next-intl/server";
import { ShowroomHero, type HeroCopy } from "@/components/hero/showroom-hero";
import { FeaturedStock } from "@/components/home/featured-stock";
import { ImportSection } from "@/components/home/import-section";
import { StatsStrip } from "@/components/home/stats-strip";
import { ShowroomSection } from "@/components/home/showroom-section";
import { ContactBand } from "@/components/home/contact-band";

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("home");

  const copy: HeroCopy = {
    eyebrow: t("eyebrow"),
    title: t("title"),
    lead: t("lead"),
    ctaStock: t("ctaStock"),
    ctaVisit: t("ctaVisit"),
    scroll: t("scroll"),
    captions: [0, 1, 2, 3].map((i) => ({
      eyebrow: t(`captions.${i}.eyebrow`),
      title: t(`captions.${i}.title`),
      text: t(`captions.${i}.text`),
    })),
  };

  return (
    <>
      <ShowroomHero copy={copy} />
      <FeaturedStock />
      <ImportSection />
      <StatsStrip />
      <ShowroomSection />
      <ContactBand />
    </>
  );
}
