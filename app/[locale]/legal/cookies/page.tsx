import { use } from "react";
import { useTranslations } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { PageIntro } from "@/components/ui/page-intro";

export default function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = use(params);
  setRequestLocale(locale);
  const t = useTranslations("pages.cookies");

  return (
    <>
      <PageIntro title={t("title")} />
      {/* Texto legal a nombre de GUIXAGILS SL: pendiente de CIF, dirección y email */}
      <section className="container-x prose prose-invert max-w-3xl pb-32 text-fg-muted">Pendiente.</section>
    </>
  );
}
