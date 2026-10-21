import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { PageIntro } from "@/components/ui/page-intro";
import { seoAlternates } from "@/lib/seo";
import { Reveal } from "@/components/ui/reveal";
import { LeadForm } from "@/components/vehicle/lead-form";
import { site, whatsappLink } from "@/lib/site";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "pages.sell" });
  return { title: t("title"), description: t("lead"), alternates: seoAlternates(locale, "/vende-tu-coche") };
}

export default async function SellPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("pages.sell");
  const steps = [0, 1, 2] as const;
  const reasons = [0, 1, 2, 3] as const;

  return (
    <>
      <PageIntro eyebrow={t("eyebrow")} title={t("title")} lead={t("lead")} />

      <section className="container-x grid gap-12 pb-24 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-7">
          <Reveal className="mb-10">
            <p className="eyebrow mb-4">{t("how.eyebrow")}</p>
            <h2 className="display text-4xl md:text-5xl">{t("how.title")}</h2>
          </Reveal>
          <Reveal as="ol" stagger={0.1} className="grid gap-6">
            {steps.map((i) => (
              <li key={i} className="flex gap-6 border-t border-line pt-5">
                <span className="font-display text-3xl text-accent">0{i + 1}</span>
                <div>
                  <p className="font-medium">{t(`how.steps.${i}.title`)}</p>
                  <p className="mt-1 text-sm text-fg-muted">{t(`how.steps.${i}.text`)}</p>
                </div>
              </li>
            ))}
          </Reveal>

          <Reveal className="mt-16">
            <p className="eyebrow mb-4">{t("why.eyebrow")}</p>
            <h2 className="display text-4xl md:text-5xl">{t("why.title")}</h2>
          </Reveal>
          <Reveal as="ul" stagger={0.08} className="mt-8 grid gap-4 sm:grid-cols-2">
            {reasons.map((i) => (
              <li key={i} className="rounded-card border border-line bg-bg-elev p-5">
                <p className="font-medium">{t(`why.items.${i}.title`)}</p>
                <p className="mt-1 text-sm text-fg-muted">{t(`why.items.${i}.text`)}</p>
              </li>
            ))}
          </Reveal>

          <Reveal className="mt-12 text-sm text-fg-muted">
            {t("wanted.lead")} <span className="text-fg">{t("wanted.list")}</span>
          </Reveal>
        </div>

        <aside className="lg:col-span-5">
          <Reveal delay={0.1} className="sticky top-24 rounded-card border border-line bg-bg-elev p-7 md:p-9">
            <p className="eyebrow mb-3">{t("form.eyebrow")}</p>
            <h2 className="display text-3xl md:text-4xl">{t("form.title")}</h2>
            <p className="mt-3 text-sm text-fg-muted">{t("form.text")}</p>
            <div className="mt-6">
              <LeadForm
                type="sell"
                compact
                messagePlaceholder={t("form.messagePlaceholder")}
                extraFields={[
                  { name: "car", label: t("form.car"), required: true, full: true },
                  { name: "year", label: t("form.year"), type: "number" },
                  { name: "km", label: t("form.km"), type: "number" },
                ]}
              />
            </div>
            <p className="mt-5 text-center text-xs text-fg-faint">
              {t("form.or")}{" "}
              <a href={whatsappLink(t("form.whatsappMessage"))} target="_blank" rel="noopener" className="text-accent underline-offset-4 hover:underline">
                WhatsApp · {site.phone}
              </a>
            </p>
          </Reveal>
        </aside>
      </section>
    </>
  );
}
