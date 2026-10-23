import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Reveal } from "@/components/ui/reveal";
import { SplitReveal } from "@/components/ui/split-reveal";
import { site, whatsappLink } from "@/lib/site";

export function ContactBand() {
  const t = useTranslations("home.contact");

  return (
    <section className="relative overflow-hidden">
      <div aria-hidden className="absolute inset-0 bg-[radial-gradient(60%_80%_at_80%_50%,rgba(201,169,110,0.16),transparent_70%)]" />
      <Reveal className="container-x relative grid gap-10 py-24 md:grid-cols-2 md:items-end md:py-36">
        <div>
          <p className="eyebrow mb-4">{t("eyebrow")}</p>
          <SplitReveal as="h2" className="display text-4xl md:text-5xl">{t("title")}</SplitReveal>
          <p className="mt-6 max-w-md text-lg text-fg-muted">{t("lead")}</p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <a
            href={whatsappLink(t("whatsappMessage"))}
            target="_blank"
            rel="noopener"
            className="rounded-card border border-line bg-bg-elev p-5 transition-colors hover:border-accent"
          >
            <p className="eyebrow">WhatsApp</p>
            <p className="mt-2 text-lg">{t("whatsapp")}</p>
          </a>
          <a href={`tel:${site.phone.replace(/\s/g, "")}`} className="rounded-card border border-line bg-bg-elev p-5 transition-colors hover:border-accent">
            <p className="eyebrow">{t("phone")}</p>
            <p className="mt-2 text-lg">{site.phone}</p>
          </a>
          <a href={`mailto:${site.email}`} className="rounded-card border border-line bg-bg-elev p-5 transition-colors hover:border-accent">
            <p className="eyebrow">Email</p>
            <p className="mt-2 text-lg">{site.email}</p>
          </a>
          <Link href="/contacto" className="flex items-center justify-center rounded-card bg-accent p-5 text-center text-accent-ink transition-opacity hover:opacity-90">
            <span className="text-lg font-medium">{t("cta")}</span>
          </Link>
        </div>
      </Reveal>
    </section>
  );
}
