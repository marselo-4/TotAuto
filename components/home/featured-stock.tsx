import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { listAvailableVehicles } from "@/lib/vehicles";
import { VehicleCard } from "@/components/vehicle/vehicle-card";
import { Reveal } from "@/components/ui/reveal";
import { SplitReveal } from "@/components/ui/split-reveal";

/** Stock en la home: hasta seis coches, recuento y salida clara al stock completo o a la importación. */
export async function FeaturedStock() {
  const t = await getTranslations("home.featured");
  const all = await listAvailableVehicles();
  const vehicles = all.slice(0, 6);

  if (vehicles.length === 0) {
    return (
      <section className="container-x py-24 md:py-36">
        <Reveal className="grid gap-8 rounded-card border border-line bg-bg-elev p-7 md:grid-cols-2 md:items-center md:p-12">
          <div>
            <p className="eyebrow mb-4">{t("eyebrow")}</p>
            <h2 className="display text-4xl md:text-6xl">{t("emptyTitle")}</h2>
          </div>
          <div>
            <p className="max-w-md text-lg text-fg-muted">{t("emptyText")}</p>
            <Link href="/importacion" className="mt-8 inline-block rounded-sm bg-accent px-6 py-3.5 btn-label text-accent-ink hover:opacity-90">
              {t("emptyCta")}
            </Link>
          </div>
        </Reveal>
      </section>
    );
  }

  return (
    <section className="container-x py-24 md:py-36">
      <Reveal className="mb-12 flex flex-wrap items-end justify-between gap-6 md:mb-16">
        <div>
          <p className="eyebrow mb-4">{t("eyebrow")}</p>
          <SplitReveal as="h2" className="display text-4xl md:text-6xl">{t("title")}</SplitReveal>
          <p className="mt-4 text-fg-muted">{t("count", { count: all.length })}</p>
        </div>
        <Link href="/stock" className="rounded-sm bg-accent px-6 py-3.5 btn-label text-accent-ink transition-opacity hover:opacity-90">
          {t("all")}
        </Link>
      </Reveal>
      <Reveal as="ul" stagger={0.12} className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {vehicles.map((v) => (
          <li key={v.id}>
            <VehicleCard vehicle={v} />
          </li>
        ))}
      </Reveal>
      <Reveal className="mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-line pt-6">
        <p className="text-fg-muted">
          {t("importLead")}{" "}
          <Link href="/importacion" className="group text-fg underline-offset-4 hover:underline">
            {t("importCta")} <span className="inline-block transition-transform group-hover:translate-x-1">→</span>
          </Link>
        </p>
        {all.length > vehicles.length && (
          <Link href="/stock" className="group text-sm text-fg-muted transition-colors hover:text-fg">
            {t("all")} <span className="inline-block transition-transform group-hover:translate-x-1">→</span>
          </Link>
        )}
      </Reveal>
    </section>
  );
}
