import type { Metadata } from "next";
import { Suspense } from "react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { PageIntro } from "@/components/ui/page-intro";
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
  return { title: t("title"), description: t("lead") };
}

export default async function StockPage({ params, searchParams }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const filters = parseStockFilters(await searchParams);
  const [t, stock, vehicles, makes] = await Promise.all([
    getTranslations("pages.stock"),
    getTranslations("stock"),
    listVehicles(filters),
    listMakes(),
  ]);

  return (
    <>
      <PageIntro eyebrow="Tot Auto" title={t("title")} lead={t("lead")} />
      <section className="container-x pb-32">
        <Suspense>
          <StockFiltersBar makes={makes} filters={filters} count={vehicles.length} />
        </Suspense>
        {vehicles.length === 0 ? (
          <p className="max-w-md pt-12 text-fg-muted">{stock("empty")}</p>
        ) : (
          <ul className="grid gap-5 pt-8 sm:grid-cols-2 lg:grid-cols-3">
            {vehicles.map((v) => (
              <li key={v.id}>
                <VehicleCard vehicle={v} />
              </li>
            ))}
          </ul>
        )}
      </section>
    </>
  );
}
