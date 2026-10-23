import { getLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { site, whatsappLink } from "@/lib/site";
import { Logo } from "@/components/layout/logo";
import { WaitlistForm } from "./waitlist-form";

const delay = (s: number) => ({ "--d": `${s}s` }) as React.CSSProperties;

/**
 * Landing de "próximamente": portada a pantalla completa y, debajo, la lista de espera
 * para la inauguración. No adelanta nada del showroom.
 * El movimiento de la portada es solo CSS (`rise`, `draw`, `glow`): el texto está en el HTML
 * desde el primer byte y la página no depende de JavaScript para verse.
 */
export async function ComingSoon() {
  const t = await getTranslations("teaser");
  const w = await getTranslations("waitlist");
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
        <span className="rise" style={delay(0.1)}>
          <Logo height={20} priority />
        </span>
        <nav
          aria-label={t("language")}
          className="rise flex items-center gap-1 text-xs uppercase tracking-[0.22em] text-fg-faint"
          style={delay(0.2)}
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

      {/* Portada */}
      <section className="container-x relative flex w-full min-h-[calc(100svh-5rem)] flex-col justify-center py-16 md:py-24">
        <p className="rise eyebrow flex items-center gap-3 text-accent" style={delay(0.35)}>
          <span aria-hidden className="diamond" />
          {t("soon")}
        </p>
        <h1 className="rise display mt-6 text-[clamp(2.75rem,9vw,8.5rem)]" style={delay(0.5)}>
          {t("title1")}
          <br />
          {t("title2")}
        </h1>
        <span aria-hidden className="draw mt-10 block h-px w-full max-w-md origin-left bg-accent/70 md:mt-14" />
        <div className="rise mt-8 flex flex-wrap items-center gap-x-10 gap-y-4" style={delay(1.1)}>
          <p className="max-w-md text-base text-fg-muted md:text-lg">{t("lead")}</p>
          <a
            href="#lista-de-espera"
            className="display inline-flex h-12 items-center rounded-full border border-line-strong px-6 text-sm tracking-wide text-fg transition-colors hover:border-accent hover:text-accent"
          >
            {w("eyebrow").split(" · ")[0]}
            <span aria-hidden className="ml-3 animate-nudge">↓</span>
          </a>
        </div>
      </section>

      {/* Lista de espera */}
      <section id="lista-de-espera" className="container-x relative w-full scroll-mt-10 border-t border-line py-20 md:py-28">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-20">
          <div>
            <p className="eyebrow flex items-center gap-3 text-accent">
              <span aria-hidden className="diamond" />
              {w("eyebrow")}
            </p>
            <h2 className="display mt-5 text-4xl md:text-5xl lg:text-6xl">{w("title")}</h2>
            <p className="mt-5 max-w-md text-fg-muted md:text-lg">{w("text")}</p>
          </div>
          <div className="lg:pt-10">
            <WaitlistForm />
          </div>
        </div>
      </section>

      <footer className="container-x relative flex w-full flex-wrap items-end justify-between gap-x-10 gap-y-6 border-t border-line py-8 md:py-10">
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
