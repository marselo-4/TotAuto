import { getTranslations, setRequestLocale } from "next-intl/server";
import { ShowroomHero, type HeroCopy } from "@/components/hero/showroom-hero";

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
    captions: [
      { eyebrow: t("captions.0.eyebrow"), title: t("captions.0.title"), text: t("captions.0.text") },
      { eyebrow: t("captions.1.eyebrow"), title: t("captions.1.title"), text: t("captions.1.text") },
      { eyebrow: t("captions.2.eyebrow"), title: t("captions.2.title"), text: t("captions.2.text") },
      { eyebrow: t("captions.3.eyebrow"), title: t("captions.3.title"), text: t("captions.3.text") },
    ],
  };

  return (
    <>
      <ShowroomHero copy={copy} />
      {/* Siguientes secciones de la home (destacados, importación, showroom) llegan en F1 */}
    </>
  );
}
