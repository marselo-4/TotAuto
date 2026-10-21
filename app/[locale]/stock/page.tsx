import { getTranslations, setRequestLocale } from "next-intl/server";
import { PageIntro } from "@/components/ui/page-intro";
import { VehicleCard } from "@/components/vehicle/vehicle-card";
import { listAvailableVehicles } from "@/lib/vehicles";

export default async function StockPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("pages.stock");
  const stock = await getTranslations("stock");
  const vehicles = await listAvailableVehicles();

  return (
    <>
      <PageIntro eyebrow="Tot Auto" title={t("title")} lead={t("lead")} />
      <section className="container-x pb-32">
        {vehicles.length === 0 ? (
          <p className="max-w-md text-fg-muted">{stock("empty")}</p>
        ) : (
          <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
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
