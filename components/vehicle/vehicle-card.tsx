import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { coverOf, formatKm, formatPrice, imageUrl, type VehicleWithImages } from "@/lib/vehicle-format";

export function VehicleCard({ vehicle, headingLevel = "h3" }: { vehicle: VehicleWithImages; headingLevel?: "h2" | "h3" }) {
  const Heading = headingLevel;
  const t = useTranslations("stock");
  const locale = useLocale();
  const cover = coverOf(vehicle);
  const title = `${vehicle.make} ${vehicle.model}`;

  return (
    <article className="group relative overflow-hidden rounded-card border border-line bg-bg-elev transition-colors hover:border-line-strong">
      <Link href={`/stock/${vehicle.slug}`} className="block">
        <div className="relative aspect-[4/3] overflow-hidden bg-bg-elev-2">
          {cover ? (
            <Image
              src={imageUrl(cover.path)}
              alt={cover.alt ?? title}
              fill
              sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
            />
          ) : (
            <div className="absolute inset-0 flex items-end p-5">
              <span className="font-display text-4xl text-fg-faint">{vehicle.make}</span>
            </div>
          )}
          <div className="absolute left-4 top-4 flex gap-2">
            {vehicle.status === "reserved" && <Badge>{t("reserved")}</Badge>}
            {vehicle.status === "sold" && <Badge>{t("sold")}</Badge>}
            {vehicle.featured && vehicle.status === "available" && <Badge accent>{t("featured")}</Badge>}
          </div>
        </div>
        <div className="p-5">
          <p className="eyebrow">{vehicle.make}</p>
          <Heading className="mt-1 font-display text-2xl">
            {vehicle.model}
            {vehicle.version && <span className="text-fg-muted"> · {vehicle.version}</span>}
          </Heading>
          <dl className="mt-4 flex flex-wrap gap-x-4 gap-y-1 text-sm text-fg-muted">
            <div><dd>{vehicle.year}</dd></div>
            <div><dd>{formatKm(vehicle.km, locale)}</dd></div>
            {vehicle.power_cv && <div><dd>{vehicle.power_cv} CV</dd></div>}
            <div><dd>{t(`gearbox.${vehicle.gearbox}`)}</dd></div>
          </dl>
          <div className="mt-5 flex items-end justify-between gap-3">
            <div>
              <p className="text-xl">{formatPrice(vehicle.price_eur, locale)}</p>
              {vehicle.vat_deductible && (
                <p className="mt-0.5 text-[11px] uppercase tracking-wider text-fg-faint">{t("vatDeductible")}</p>
              )}
            </div>
            <span className="shrink-0 text-sm text-accent">{t("viewCar")} →</span>
          </div>
        </div>
      </Link>
    </article>
  );
}

function Badge({ children, accent = false }: { children: React.ReactNode; accent?: boolean }) {
  return (
    <span
      className={`rounded-sm px-3 py-1 text-[11px] font-semibold uppercase tracking-wider backdrop-blur ${
        accent ? "bg-accent text-accent-ink" : "bg-bg/70 text-fg"
      }`}
    >
      {children}
    </span>
  );
}
