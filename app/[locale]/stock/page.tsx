import type { Metadata } from "next";
import { Suspense } from "react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { PageIntro } from "@/components/ui/page-intro";
import { Reveal } from "@/components/ui/reveal";
import { seoAlternates } from "@/lib/seo";
import { site, whatsappLink } from "@/lib/site";
import { VehicleCard } from "@/components/vehicle/vehicle-card";
import { StockFiltersBar } from "@/components/stock/stock-filters";
import { listMakes, listVehicles, parseStockFilters } from "@/lib/vehicles";

type Props = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "pages.stock" });
  return { title: t("title"), description: t("lead"), alternates: seoAlternates(locale, "/stock") };
}

export default async function StockPage({ params, searchParams }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const filters = parseStockFilters(await searchParams);
  const [t, imp, common, vehicles, makes] = await Promise.all([
    getTranslations("pages.stock"),
    getTranslations("pages.import"),
    getTranslations("common"),
    listVehicles(filters),
    listMakes(),
  ]);

  return (
    <>
      <PageIntro eyebrow="Tot Auto" title={t("title")} lead={t("lead")} />
      <section className="container-x pb-20">
        <Suspense>
          <StockFiltersBar makes={makes} filters={filters} count={vehicles.length} />
        </Suspense>
        {vehicles.length === 0 ? (
          <div className="mt-8 grid gap-6 rounded-card border border-line bg-bg-elev p-7 md:grid-cols-2 md:items-center md:p-10">
            <div>
              <p className="font-display text-2xl md:text-3xl">{t("emptyTitle")}</p>
              <p className="mt-3 max-w-md text-fg-muted">{t("emptyText")}</p>
            </div>
            <div className="flex flex-wrap gap-3 md:justify-end">
              <Link href="/importacion" className="rounded-sm bg-accent px-6 py-3.5 btn-label text-accent-ink hover:opacity-90">
                {t("importCard.cta")}
              </Link>
              <a href={whatsappLink(common("whatsappMessage"))} target="_blank" rel="noopener" className="rounded-sm border border-line-strong px-6 py-3.5 btn-label hover:border-fg">
                {common("whatsapp")}
              </a>
            </div>
          </div>
        ) : (
          <ul className="grid gap-5 pt-8 sm:grid-cols-2 lg:grid-cols-3">
            {vehicles.map((v) => (
              <li key={v.id}>
                <VehicleCard vehicle={v} headingLevel="h2" />
              </li>
            ))}
            {/* Última tarjeta: la importación a medida como respuesta a "no está el mío" */}
            <li>
              <Link
                href="/importacion"
                className="group flex h-full min-h-72 flex-col justify-between rounded-card border border-dashed border-line-strong p-6 transition-colors hover:border-accent"
              >
                <p className="eyebrow">{t("importCard.eyebrow")}</p>
                <div>
                  <p className="font-display text-2xl md:text-3xl">{t("importCard.title")}</p>
                  <p className="mt-3 text-sm text-fg-muted">{t("importCard.text")}</p>
                  <p className="mt-5 text-sm text-accent">
                    {t("importCard.cta")} <span className="inline-block transition-transform group-hover:translate-x-1">→</span>
                  </p>
                </div>
              </Link>
            </li>
          </ul>
        )}
      </section>

      {/* Lo que vende el negocio además del stock: importación a medida y compra de coches */}
      <section className="container-x pb-32">
        <Reveal stagger={0.1} className="grid gap-5 md:grid-cols-2">
          <div className="flex flex-col justify-between rounded-card border border-line bg-bg-elev p-7 md:p-10">
            <div>
              <p className="eyebrow mb-4">{imp("eyebrow")}</p>
              <h2 className="display text-3xl md:text-4xl">{imp("title")}</h2>
              <p className="mt-4 max-w-md text-fg-muted">{imp("lead")}</p>
            </div>
            <div className="mt-8">
              <Link href="/importacion" className="inline-block rounded-sm bg-accent px-6 py-3.5 btn-label text-accent-ink hover:opacity-90">
                {t("importCard.cta")}
              </Link>
            </div>
          </div>
          <div className="flex flex-col justify-between rounded-card border border-line bg-bg-elev p-7 md:p-10">
            <div>
              <p className="eyebrow mb-4">{t("sellCard.eyebrow")}</p>
              <h2 className="display text-3xl md:text-4xl">{t("sellCard.title")}</h2>
              <p className="mt-4 max-w-md text-fg-muted">{t("sellCard.text")}</p>
            </div>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link href="/vende-tu-coche" className="inline-block rounded-sm border border-line-strong px-6 py-3.5 btn-label hover:border-fg">
                {t("sellCard.cta")}
              </Link>
              <a href={`tel:${site.phone.replace(/\s/g, "")}`} className="text-sm text-fg-muted hover:text-fg">
                {site.phone}
              </a>
            </div>
          </div>
        </Reveal>
      </section>
    </>
  );
}
