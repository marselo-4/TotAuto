import type { Metadata } from "next";
import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { PageIntro } from "@/components/ui/page-intro";
import { seoAlternates } from "@/lib/seo";
import { Reveal } from "@/components/ui/reveal";
import { Showroom3D } from "@/components/showroom/showroom-3d";
import { site } from "@/lib/site";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "pages.showroom" });
  return { title: t("title"), description: t("lead"), alternates: seoAlternates(locale, "/showroom") };
}

const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${site.address.lat},${site.address.lng}`;

export default async function ShowroomPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("pages.showroom");
  const spaces = [0, 1, 2] as const;

  return (
    <>
      <PageIntro eyebrow="Tàrrega · Lleida" title={t("title")} lead={t("lead")} />

      {/* Explorador 3D */}
      <section className="container-x pb-24">
        <Reveal>
          <Showroom3D />
        </Reveal>
        <Reveal delay={0.1} className="mt-4 text-sm text-fg-faint">{t("explore.note")}</Reveal>
      </section>

      {/* Los espacios */}
      <section className="border-y border-line bg-bg-elev">
        <div className="container-x py-24 md:py-32">
          <Reveal className="mb-12 max-w-2xl">
            <p className="eyebrow mb-4">{t("spaces.eyebrow")}</p>
            <h2 className="display text-4xl md:text-6xl">{t("spaces.title")}</h2>
          </Reveal>
          <Reveal as="ul" stagger={0.12} className="grid gap-5 md:grid-cols-3">
            {spaces.map((i) => (
              <li key={i} className="overflow-hidden rounded-card border border-line bg-bg">
                <div className="relative aspect-[4/3]">
                  <Image src={["/img/showroom-principal.jpg", "/img/showroom-trasera.jpg", "/img/showroom-fachada.jpg"][i]} alt={t(`spaces.items.${i}.title`)} fill sizes="(min-width: 768px) 33vw, 100vw" className="object-cover" />
                </div>
                <div className="p-5">
                  <p className="font-display text-2xl">{t(`spaces.items.${i}.title`)}</p>
                  <p className="mt-2 text-sm text-fg-muted">{t(`spaces.items.${i}.text`)}</p>
                </div>
              </li>
            ))}
          </Reveal>
        </div>
      </section>

      {/* Visita y cómo llegar */}
      <section className="container-x grid gap-12 py-24 md:grid-cols-2 md:py-32">
        <Reveal>
          <p className="eyebrow mb-4">{t("visit.eyebrow")}</p>
          <h2 className="display text-4xl md:text-5xl">{t("visit.title")}</h2>
          <p className="mt-6 max-w-md text-fg-muted">{t("visit.text")}</p>
          <dl className="mt-8 grid gap-4">
            <div className="border-t border-line pt-4">
              <dt className="eyebrow">{t("visit.address")}</dt>
              <dd className="mt-1">{site.address.street} · {site.address.postalCode} {site.address.city} ({site.address.region})</dd>
            </div>
            <div className="border-t border-line pt-4">
              <dt className="eyebrow">{t("visit.hours")}</dt>
              <dd className="mt-1">{t("visit.hoursText")}</dd>
            </div>
            <div className="border-t border-line pt-4">
              <dt className="eyebrow">{t("visit.phone")}</dt>
              <dd className="mt-1"><a href={`tel:${site.phone.replace(/\s/g, "")}`} className="hover:text-accent">{site.phone}</a></dd>
            </div>
          </dl>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/contacto" className="rounded-sm bg-accent px-6 py-3.5 btn-label text-accent-ink hover:opacity-90">{t("visit.cta")}</Link>
            <a href={mapsUrl} target="_blank" rel="noopener" className="rounded-sm border border-line-strong px-6 py-3.5 btn-label hover:border-fg">{t("visit.directions")}</a>
          </div>
        </Reveal>
        <Reveal delay={0.1} className="relative aspect-[4/3] overflow-hidden rounded-card">
          <Image src="/img/showroom-fachada.jpg" alt={t("visit.imageAlt")} fill sizes="(min-width: 768px) 50vw, 100vw" className="object-cover" />
        </Reveal>
      </section>
    </>
  );
}
