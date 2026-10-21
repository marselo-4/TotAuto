import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { PageIntro } from "@/components/ui/page-intro";
import { Reveal } from "@/components/ui/reveal";
import { LeadForm } from "@/components/vehicle/lead-form";
import { site, whatsappLink } from "@/lib/site";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "pages.contact" });
  return { title: t("title"), description: t("lead") };
}

const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${site.address.lat},${site.address.lng}`;

export default async function ContactPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("pages.contact");

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "AutoDealer",
    name: site.name,
    telephone: site.phone,
    email: site.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: site.address.street,
      postalCode: site.address.postalCode,
      addressLocality: site.address.city,
      addressRegion: site.address.region,
      addressCountry: site.address.country,
    },
    geo: { "@type": "GeoCoordinates", latitude: site.address.lat, longitude: site.address.lng },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <PageIntro eyebrow="Tot Auto" title={t("title")} lead={t("lead")} />

      <section className="container-x grid gap-12 pb-32 lg:grid-cols-12 lg:gap-16">
        <Reveal className="lg:col-span-5">
          <ul className="grid gap-3">
            <li>
              <a href={whatsappLink(t("whatsappMessage"))} target="_blank" rel="noopener" className="block rounded-card border border-line bg-bg-elev p-5 transition-colors hover:border-accent">
                <p className="eyebrow">WhatsApp</p>
                <p className="mt-2 text-lg">{t("whatsapp")}</p>
              </a>
            </li>
            <li>
              <a href={`tel:${site.phone.replace(/\s/g, "")}`} className="block rounded-card border border-line bg-bg-elev p-5 transition-colors hover:border-accent">
                <p className="eyebrow">{t("phone")}</p>
                <p className="mt-2 text-lg">{site.phone}</p>
              </a>
            </li>
            <li>
              <a href={`mailto:${site.email}`} className="block rounded-card border border-line bg-bg-elev p-5 transition-colors hover:border-accent">
                <p className="eyebrow">Email</p>
                <p className="mt-2 text-lg">{site.email}</p>
              </a>
            </li>
            <li>
              <a href={mapsUrl} target="_blank" rel="noopener" className="block rounded-card border border-line bg-bg-elev p-5 transition-colors hover:border-accent">
                <p className="eyebrow">{t("address")}</p>
                <p className="mt-2 text-lg">{site.address.street}</p>
                <p className="text-sm text-fg-muted">{site.address.postalCode} {site.address.city} ({site.address.region}) · {t("directions")} →</p>
              </a>
            </li>
          </ul>
          <div className="mt-6 border-t border-line pt-5">
            <p className="eyebrow">{t("hours")}</p>
            <p className="mt-2 text-fg-muted">{t("hoursText")}</p>
          </div>
        </Reveal>

        <Reveal delay={0.1} className="rounded-card border border-line bg-bg-elev p-7 md:p-10 lg:col-span-7">
          <p className="eyebrow mb-3">{t("form.eyebrow")}</p>
          <h2 className="display text-3xl md:text-4xl">{t("form.title")}</h2>
          <p className="mt-3 max-w-md text-sm text-fg-muted">{t("form.text")}</p>
          <div className="mt-6">
            <LeadForm type="contact" messagePlaceholder={t("form.messagePlaceholder")} />
          </div>
        </Reveal>
      </section>
    </>
  );
}
