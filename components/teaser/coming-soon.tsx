import { getLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { site, whatsappLink } from "@/lib/site";
import { Logo } from "@/components/layout/logo";

/**
 * Landing de "próximamente": una sola pantalla, sin adelantar nada del showroom.
 * Todo el movimiento es CSS (clases `rise`, `draw`, `glow`), así el texto está en el HTML
 * desde el primer byte y la página no depende de JavaScript para verse.
 */
export async function ComingSoon() {
  const t = await getTranslations("teaser");
  const locale = await getLocale();
  const year = new Date().getFullYear();

  return (
    <div className="relative flex flex-1 flex-col overflow-hidden">
      {/* Ambiente: un foco champán que deriva muy despacio y un grano fino encima */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="glow" />
        <div className="grain" />
      </div>

      <header className="container-x relative flex h-20 w-full items-center justify-between">
        <span className="rise" style={{ "--d": "0.1s" } as React.CSSProperties}>
          <Logo height={20} priority />
        </span>
        <nav
          aria-label={t("language")}
          className="rise flex items-center gap-1 text-xs uppercase tracking-[0.22em] text-fg-faint"
          style={{ "--d": "0.2s" } as React.CSSProperties}
        >
          {routing.locales.map((l, i) => (
            <span key={l} className="flex items-center gap-1">
              {i > 0 && <span aria-hidden>/</span>}
              <Link
                href="/"
                locale={l}
                className={`px-1 py-2 transition-colors ${l === locale ? "text-fg" : "hover:text-fg"}`}
                aria-current={l === locale ? "true" : undefined}
              >
                {l}
              </Link>
            </span>
          ))}
        </nav>
      </header>

      <section className="container-x relative flex w-full flex-1 flex-col justify-center py-16 md:py-24">
        <p className="rise eyebrow flex items-center gap-3 text-accent" style={{ "--d": "0.35s" } as React.CSSProperties}>
          <span aria-hidden className="diamond" />
          {t("soon")}
        </p>
        <h1
          className="rise display mt-6 max-w-[11ch] text-[clamp(3.25rem,11vw,9.5rem)]"
          style={{ "--d": "0.5s" } as React.CSSProperties}
        >
          {t("title")}
        </h1>
        <span aria-hidden className="draw mt-10 block h-px w-full max-w-md origin-left bg-accent/70 md:mt-14" />
        <p className="rise mt-8 max-w-md text-base text-fg-muted md:text-lg" style={{ "--d": "1.1s" } as React.CSSProperties}>
          {t("lead")}
        </p>
      </section>

      <footer
        className="rise container-x relative flex w-full flex-wrap items-end justify-between gap-x-10 gap-y-6 pb-8 md:pb-10"
        style={{ "--d": "1.4s" } as React.CSSProperties}
      >
        <div>
          <p className="eyebrow mb-3">{t("talk")}</p>
          <ul className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
            <li>
              <a href={`tel:${site.phone.replace(/\s/g, "")}`} className="link-quiet">
                {site.phone}
              </a>
            </li>
            <li>
              <a href={`mailto:${site.email}`} className="link-quiet">
                {site.email}
              </a>
            </li>
            <li>
              <a href={whatsappLink(t("whatsappMessage"))} target="_blank" rel="noopener noreferrer" className="link-quiet">
                {t("whatsapp")}
              </a>
            </li>
          </ul>
        </div>
        <p className="text-xs text-fg-faint">
          © {year} {t("rights")}
        </p>
      </footer>
    </div>
  );
}
