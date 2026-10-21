import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getLocale, getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { VehicleGallery } from "@/components/vehicle/vehicle-gallery";
import { VehicleCard } from "@/components/vehicle/vehicle-card";
import { LeadForm } from "@/components/vehicle/lead-form";
import { Reveal } from "@/components/ui/reveal";
import {
  formatKm,
  formatPrice,
  getVehicleBySlug,
  imageUrl,
  listRelatedVehicles,
  sortedImages,
  vehicleTitle,
} from "@/lib/vehicles";
import { site, whatsappLink } from "@/lib/site";

type Props = { params: Promise<{ locale: string; slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const v = await getVehicleBySlug(slug);
  if (!v) return {};
  const t = await getTranslations({ locale, namespace: "vehicle" });
  const title = `${vehicleTitle(v)} ${v.year}`;
  const cover = sortedImages(v)[0];
  return {
    title,
    description: t("metaDescription", { title, year: v.year, km: formatKm(v.km, locale), price: formatPrice(v.price_eur, locale) }),
    openGraph: cover ? { images: [{ url: imageUrl(cover.path) }] } : undefined,
  };
}

export default async function VehiclePage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const v = await getVehicleBySlug(slug);
  if (!v) notFound();
  const [t, stock, related] = await Promise.all([getTranslations("vehicle"), getTranslations("stock"), listRelatedVehicles(v.id)]);
  const currentLocale = await getLocale();

  const title = vehicleTitle(v);
  const images = sortedImages(v).map((img) => ({ src: imageUrl(img.path), alt: img.alt ?? title }));
  const description = (currentLocale === "ca" ? v.description_ca : v.description_es) ?? v.description_es ?? "";
  const wa = whatsappLink(t("whatsappMessage", { title, year: v.year }));

  const specs: Array<[string, string | null]> = [
    [t("specs.year"), String(v.year)],
    [t("specs.km"), formatKm(v.km, locale)],
    [t("specs.fuel"), stock(`fuel.${v.fuel}`)],
    [t("specs.gearbox"), stock(`gearbox.${v.gearbox}`)],
    [t("specs.power"), v.power_cv ? `${v.power_cv} CV` : null],
    [t("specs.color"), v.color],
    [t("specs.origin"), v.imported ? t("specs.importedFrom", { country: v.origin_country ?? "—" }) : t("specs.national")],
    [t("specs.registration"), v.registered_es ? t("specs.registeredYes") : t("specs.registeredNo")],
    [t("specs.warranty"), v.warranty],
    [t("specs.vat"), v.vat_deductible ? t("specs.vatYes") : t("specs.vatNo")],
  ];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Car",
    name: `${title} ${v.year}`,
    brand: { "@type": "Brand", name: v.make },
    model: v.model,
    vehicleModelDate: String(v.year),
    mileageFromOdometer: { "@type": "QuantitativeValue", value: v.km, unitCode: "KMT" },
    fuelType: v.fuel,
    vehicleTransmission: v.gearbox,
    color: v.color ?? undefined,
    image: images.map((i) => i.src),
    offers: {
      "@type": "Offer",
      price: v.price_eur,
      priceCurrency: "EUR",
      availability: v.status === "available" ? "https://schema.org/InStock" : "https://schema.org/SoldOut",
      seller: { "@type": "AutoDealer", name: site.name, telephone: site.phone, address: { "@type": "PostalAddress", streetAddress: site.address.street, postalCode: site.address.postalCode, addressLocality: site.address.city, addressCountry: site.address.country } },
    },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <article className="container-x pb-24 pt-28 md:pt-36">
        <nav aria-label="breadcrumb" className="mb-6 text-sm text-fg-muted">
          <Link href="/stock" className="hover:text-fg">← {t("backToStock")}</Link>
        </nav>

        <div className="grid gap-10 lg:grid-cols-12 lg:gap-14">
          <div className="lg:col-span-7">
            <VehicleGallery images={images} make={v.make} />
          </div>

          <div className="lg:col-span-5">
            <p className="eyebrow">{v.make}</p>
            <h1 className="display mt-2 text-4xl md:text-5xl">
              {v.model}
              {v.version && <span className="block text-fg-muted">{v.version}</span>}
            </h1>
            <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-1 text-fg-muted">
              <span>{v.year}</span>
              <span>·</span>
              <span>{formatKm(v.km, locale)}</span>
              {v.power_cv && (
                <>
                  <span>·</span>
                  <span>{v.power_cv} CV</span>
                </>
              )}
              <span>·</span>
              <span>{stock(`gearbox.${v.gearbox}`)}</span>
            </div>

            <div className="mt-8 flex items-end gap-3">
              <p className="font-display text-5xl">{formatPrice(v.price_eur, locale)}</p>
              {v.status === "reserved" && <span className="mb-2 rounded-full bg-bg-elev-2 px-3 py-1 text-xs uppercase tracking-wider">{stock("reserved")}</span>}
              {v.status === "sold" && <span className="mb-2 rounded-full bg-bg-elev-2 px-3 py-1 text-xs uppercase tracking-wider">{stock("sold")}</span>}
            </div>
            {v.vat_deductible && <p className="mt-1 text-xs uppercase tracking-wider text-fg-faint">{stock("vatDeductible")}</p>}

            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              <a href={wa} target="_blank" rel="noopener" className="rounded-full bg-accent px-6 py-3 text-center text-sm font-medium text-accent-ink hover:opacity-90">
                {t("ctaWhatsapp")}
              </a>
              <a href={`tel:${site.phone.replace(/\s/g, "")}`} className="rounded-full border border-line-strong px-6 py-3 text-center text-sm hover:border-fg">
                {t("ctaCall")} · {site.phone}
              </a>
            </div>

            {description && <p className="mt-10 text-lg leading-relaxed text-fg-muted">{description}</p>}

            <dl className="mt-10 grid grid-cols-2 gap-x-6 border-t border-line">
              {specs
                .filter(([, val]) => val)
                .map(([label, val]) => (
                  <div key={label} className="border-b border-line py-3">
                    <dt className="text-xs uppercase tracking-wider text-fg-faint">{label}</dt>
                    <dd className="mt-1">{val}</dd>
                  </div>
                ))}
            </dl>
            {v.service_history && (
              <div className="mt-6">
                <p className="text-xs uppercase tracking-wider text-fg-faint">{t("specs.history")}</p>
                <p className="mt-1 text-fg-muted">{v.service_history}</p>
              </div>
            )}
          </div>
        </div>

        {/* Formulario */}
        <Reveal className="mt-20 grid gap-10 rounded-card border border-line bg-bg-elev p-7 md:grid-cols-2 md:p-12">
          <div>
            <p className="eyebrow mb-3">{t("askEyebrow")}</p>
            <h2 className="display text-4xl md:text-5xl">{t("askTitle")}</h2>
            <p className="mt-4 max-w-md text-fg-muted">{t("askText")}</p>
          </div>
          <LeadForm type="vehicle" vehicleId={v.id} defaultMessage={t("askDefault", { title, year: v.year })} />
        </Reveal>

        {related.length > 0 && (
          <section className="mt-24">
            <Reveal className="mb-8 flex items-end justify-between gap-6">
              <h2 className="display text-4xl md:text-5xl">{t("related")}</h2>
              <Link href="/stock" className="text-sm text-fg-muted hover:text-fg">{t("backToStock")} →</Link>
            </Reveal>
            <Reveal as="ul" stagger={0.1} className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((r) => (
                <li key={r.id}>
                  <VehicleCard vehicle={r} />
                </li>
              ))}
            </Reveal>
          </section>
        )}
      </article>

      {/* Barra fija en móvil */}
      <div className="fixed inset-x-0 bottom-0 z-40 flex gap-2 border-t border-line bg-bg/90 p-3 backdrop-blur md:hidden">
        <a href={wa} target="_blank" rel="noopener" className="flex-1 rounded-full bg-accent px-4 py-3 text-center text-sm font-medium text-accent-ink">
          WhatsApp
        </a>
        <a href={`tel:${site.phone.replace(/\s/g, "")}`} className="flex-1 rounded-full border border-line-strong px-4 py-3 text-center text-sm">
          {t("ctaCall")}
        </a>
      </div>
    </>
  );
}
