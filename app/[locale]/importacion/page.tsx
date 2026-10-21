import type { Metadata } from "next";
import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { PageIntro } from "@/components/ui/page-intro";
import { Reveal } from "@/components/ui/reveal";
import { LeadForm } from "@/components/vehicle/lead-form";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "pages.import" });
  return { title: t("title"), description: t("lead") };
}

export default async function ImportPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("pages.import");
  const steps = [0, 1, 2, 3] as const;
  const includes = [0, 1, 2, 3, 4, 5] as const;
  const faqs = [0, 1, 2, 3] as const;

  return (
    <>
      <PageIntro eyebrow={t("eyebrow")} title={t("title")} lead={t("lead")} />

      {/* Imagen + promesa */}
      <section className="container-x grid gap-8 pb-24 md:grid-cols-12 md:items-end">
        <Reveal className="relative aspect-[16/9] overflow-hidden rounded-card md:col-span-8">
          <Image src="/img/showroom-trasera.jpg" alt={t("imageAlt")} fill sizes="(min-width: 768px) 66vw, 100vw" className="object-cover" />
        </Reveal>
        <Reveal delay={0.1} className="md:col-span-4">
          <p className="font-display text-3xl md:text-4xl">{t("promise.title")}</p>
          <p className="mt-4 text-fg-muted">{t("promise.text")}</p>
        </Reveal>
      </section>

      {/* Pasos */}
      <section className="border-y border-line bg-bg-elev">
        <div className="container-x py-24 md:py-32">
          <Reveal className="mb-12">
            <p className="eyebrow mb-4">{t("how.eyebrow")}</p>
            <h2 className="display text-4xl md:text-6xl">{t("how.title")}</h2>
          </Reveal>
          <Reveal as="ul" stagger={0.1} className="grid gap-8 md:grid-cols-4">
            {steps.map((i) => (
              <li key={i} className="border-t border-line pt-5">
                <span className="font-display text-3xl text-accent">0{i + 1}</span>
                <p className="mt-3 font-medium">{t(`how.steps.${i}.title`)}</p>
                <p className="mt-2 text-sm text-fg-muted">{t(`how.steps.${i}.text`)}</p>
              </li>
            ))}
          </Reveal>
        </div>
      </section>

      {/* Qué incluye + plazos */}
      <section className="container-x grid gap-12 py-24 md:grid-cols-2 md:py-32">
        <Reveal>
          <p className="eyebrow mb-4">{t("includes.eyebrow")}</p>
          <h2 className="display text-4xl md:text-5xl">{t("includes.title")}</h2>
          <ul className="mt-8 grid gap-3">
            {includes.map((i) => (
              <li key={i} className="flex gap-3 border-b border-line pb-3">
                <span className="text-accent">✓</span>
                <span>{t(`includes.items.${i}`)}</span>
              </li>
            ))}
          </ul>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="eyebrow mb-4">{t("timing.eyebrow")}</p>
          <h2 className="display text-4xl md:text-5xl">{t("timing.title")}</h2>
          <p className="mt-6 text-fg-muted">{t("timing.text")}</p>
          <dl className="mt-8 grid grid-cols-3 gap-4">
            {[0, 1, 2].map((i) => (
              <div key={i} className="border-t border-line pt-4">
                <dt className="font-display text-3xl">{t(`timing.items.${i}.value`)}</dt>
                <dd className="mt-1 text-sm text-fg-muted">{t(`timing.items.${i}.label`)}</dd>
              </div>
            ))}
          </dl>
        </Reveal>
      </section>

      {/* FAQ */}
      <section className="border-t border-line">
        <div className="container-x grid gap-10 py-24 md:grid-cols-12 md:py-32">
          <Reveal className="md:col-span-4">
            <p className="eyebrow mb-4">{t("faq.eyebrow")}</p>
            <h2 className="display text-4xl md:text-5xl">{t("faq.title")}</h2>
          </Reveal>
          <Reveal as="div" stagger={0.08} className="md:col-span-8">
            {faqs.map((i) => (
              <details key={i} className="group border-b border-line py-5">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-6 text-lg">
                  {t(`faq.items.${i}.q`)}
                  <span className="text-fg-faint transition-transform group-open:rotate-45">+</span>
                </summary>
                <p className="mt-3 max-w-2xl text-fg-muted">{t(`faq.items.${i}.a`)}</p>
              </details>
            ))}
          </Reveal>
        </div>
      </section>

      {/* Formulario de encargo */}
      <section className="container-x pb-32">
        <Reveal className="grid gap-10 rounded-card border border-line bg-bg-elev p-7 md:grid-cols-2 md:p-12">
          <div>
            <p className="eyebrow mb-3">{t("form.eyebrow")}</p>
            <h2 className="display text-4xl md:text-5xl">{t("form.title")}</h2>
            <p className="mt-4 max-w-md text-fg-muted">{t("form.text")}</p>
          </div>
          <LeadForm
            type="import"
            messagePlaceholder={t("form.messagePlaceholder")}
            extraFields={[
              { name: "model", label: t("form.model"), required: true, full: true },
              { name: "budget", label: t("form.budget") },
              { name: "year", label: t("form.year") },
            ]}
          />
        </Reveal>
      </section>
    </>
  );
}
