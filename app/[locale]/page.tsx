import { getTranslations, setRequestLocale } from "next-intl/server";
import { ComingSoon } from "@/components/teaser/coming-soon";
import { homeJsonLd } from "@/lib/seo";

export default async function TeaserPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "meta" });
  const jsonLd = JSON.stringify(homeJsonLd(locale, t("description"))).replace(/</g, "\\u003c");
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd }} />
      <ComingSoon />
    </>
  );
}
