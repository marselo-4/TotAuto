import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { listAvailableVehicles } from "@/lib/vehicles";
import { VehicleCard } from "@/components/vehicle/vehicle-card";
import { Reveal } from "@/components/ui/reveal";
import { SplitReveal } from "@/components/ui/split-reveal";

export async function FeaturedStock() {
  const t = await getTranslations("home.featured");
  const vehicles = (await listAvailableVehicles()).slice(0, 3);
  if (vehicles.length === 0) return null;

  return (
    <section className="container-x py-24 md:py-36">
      <Reveal className="mb-12 flex flex-wrap items-end justify-between gap-6 md:mb-16">
        <div>
          <p className="eyebrow mb-4">{t("eyebrow")}</p>
          <SplitReveal as="h2" className="display text-5xl md:text-7xl">{t("title")}</SplitReveal>
        </div>
        <Link href="/stock" className="group text-sm text-fg-muted transition-colors hover:text-fg">
          {t("all")} <span className="inline-block transition-transform group-hover:translate-x-1">→</span>
        </Link>
      </Reveal>
      <Reveal as="ul" stagger={0.12} className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {vehicles.map((v) => (
          <li key={v.id}>
            <VehicleCard vehicle={v} />
          </li>
        ))}
      </Reveal>
    </section>
  );
}
