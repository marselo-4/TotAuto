import type { Metadata } from "next";
import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { PageIntro } from "@/components/ui/page-intro";
import { Reveal } from "@/components/ui/reveal";
import { CountUp } from "@/components/ui/count-up";
import { VehicleCard } from "@/components/vehicle/vehicle-card";
import { listSoldVehicles } from "@/lib/vehicles";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "pages.about" });
  return { title: t("title"), description: t("lead") };
}

export default async function AboutPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const [t, sold] = await Promise.all([getTranslations("pages.about"), listSoldVehicles()]);
  const milestones = [0, 1, 2, 3] as const;
  const values = [0, 1, 2] as const;

  return (
    <>
      <PageIntro eyebrow={t("eyebrow")} title={t("title")} lead={t("lead")} />

      {/* Historia */}
      <section className="container-x grid gap-12 pb-24 md:grid-cols-12">
        <Reveal className="md:col-span-7">
          <p className="text-lg leading-relaxed text-fg-muted md:text-xl">{t("story.p1")}</p>
          <p className="mt-6 text-lg leading-relaxed text-fg-muted md:text-xl">{t("story.p2")}</p>
          <p className="mt-6 text-lg leading-relaxed text-fg-muted md:text-xl">{t("story.p3")}</p>
        </Reveal>
        <Reveal delay={0.1} className="md:col-span-5">
          <ul className="grid grid-cols-2 gap-6">
            <li className="border-t border-line pt-4">
              <CountUp value={40} className="display text-6xl" />
              <p className="mt-1 text-sm text-fg-muted">{t("stats.years")}</p>
            </li>
            <li className="border-t border-line pt-4">
              <CountUp value={250} suffix="+" className="display text-6xl" />
              <p className="mt-1 text-sm text-fg-muted">{t("stats.dealers")}</p>
            </li>
          </ul>
          <div className="relative mt-8 aspect-[4/3] overflow-hidden rounded-card">
            <Image src="/img/showroom-principal.jpg" alt={t("imageAlt")} fill sizes="(min-width: 768px) 40vw, 100vw" className="object-cover" />
          </div>
        </Reveal>
      </section>

      {/* Hitos */}
      <section className="border-y border-line bg-bg-elev">
        <div className="container-x py-24 md:py-32">
          <Reveal className="mb-12">
            <p className="eyebrow mb-4">{t("timeline.eyebrow")}</p>
            <h2 className="display text-4xl md:text-6xl">{t("timeline.title")}</h2>
          </Reveal>
          <Reveal as="ol" stagger={0.1} className="grid gap-8 md:grid-cols-4">
            {milestones.map((i) => (
              <li key={i} className="border-t border-line pt-5">
                <p className="font-display text-4xl text-accent">{t(`timeline.items.${i}.year`)}</p>
                <p className="mt-3 font-medium">{t(`timeline.items.${i}.title`)}</p>
                <p className="mt-2 text-sm text-fg-muted">{t(`timeline.items.${i}.text`)}</p>
              </li>
            ))}
          </Reveal>
        </div>
      </section>

      {/* Cómo trabajamos */}
      <section className="container-x py-24 md:py-32">
        <Reveal className="mb-12 max-w-2xl">
          <p className="eyebrow mb-4">{t("values.eyebrow")}</p>
          <h2 className="display text-4xl md:text-6xl">{t("values.title")}</h2>
        </Reveal>
        <Reveal as="ul" stagger={0.1} className="grid gap-5 md:grid-cols-3">
          {values.map((i) => (
            <li key={i} className="rounded-card border border-line bg-bg-elev p-7">
              <span className="font-display text-3xl text-accent">0{i + 1}</span>
              <p className="mt-4 font-display text-2xl">{t(`values.items.${i}.title`)}</p>
              <p className="mt-2 text-sm text-fg-muted">{t(`values.items.${i}.text`)}</p>
            </li>
          ))}
        </Reveal>
      </section>

      {/* Vendidos */}
      {sold.length > 0 && (
        <section className="border-t border-line">
          <div className="container-x py-24 md:py-32">
            <Reveal className="mb-10">
              <p className="eyebrow mb-4">{t("sold.eyebrow")}</p>
              <h2 className="display text-4xl md:text-5xl">{t("sold.title")}</h2>
            </Reveal>
            <Reveal as="ul" stagger={0.08} className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {sold.map((v) => (
                <li key={v.id}><VehicleCard vehicle={v} /></li>
              ))}
            </Reveal>
          </div>
        </section>
      )}

      <section className="container-x pb-32">
        <Reveal className="flex flex-wrap items-center justify-between gap-6 rounded-card border border-line bg-bg-elev p-7 md:p-10">
          <p className="font-display text-2xl md:text-3xl">{t("cta.title")}</p>
          <div className="flex gap-3">
            <Link href="/stock" className="rounded-full bg-accent px-6 py-3 text-sm font-medium text-accent-ink hover:opacity-90">{t("cta.stock")}</Link>
            <Link href="/contacto" className="rounded-full border border-line-strong px-6 py-3 text-sm hover:border-fg">{t("cta.contact")}</Link>
          </div>
        </Reveal>
      </section>
    </>
  );
}
