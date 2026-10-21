import { use } from "react";
import { useTranslations } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { PageIntro } from "@/components/ui/page-intro";

export default function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = use(params);
  setRequestLocale(locale);
  const t = useTranslations("pages.contact");
  const common = useTranslations("common");

  return (
    <>
      <PageIntro eyebrow="Tot Auto" title={t("title")} lead={t("lead")} />
      <section className="container-x pb-32 text-fg-faint">{common("soon")}</section>
    </>
  );
}
