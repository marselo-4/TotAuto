"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { Logo } from "@/components/layout/logo";
import { whatsappLink } from "@/lib/site";

// Orden por prioridad de negocio: primero lo que vende (stock, importación, compra), luego el local.
const NAV = [
  { href: "/stock", key: "stock" },
  { href: "/importacion", key: "import" },
  { href: "/vende-tu-coche", key: "sell" },
  { href: "/showroom", key: "showroom" },
  { href: "/nosotros", key: "about" },
  { href: "/contacto", key: "contact" },
] as const;

export function SiteHeader() {
  const t = useTranslations("nav");
  const common = useTranslations("common");
  const locale = useLocale();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-line bg-bg/70 backdrop-blur-md">
      <div className="container-x flex h-16 items-center justify-between gap-6">
        <Link href="/" className="flex items-center" aria-label="Tot Auto · Inicio" onClick={() => setOpen(false)}>
          <Logo height={20} priority />
        </Link>

        <nav className="hidden items-center gap-5 whitespace-nowrap text-[0.8125rem] font-medium uppercase tracking-[0.12em] text-fg-muted lg:flex xl:gap-7" aria-label="Principal">
          {NAV.map((item) => {
            const active = pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link
                key={item.key}
                href={item.href}
                className={`transition-colors hover:text-fg ${active ? "text-fg" : ""}`}
              >
                {t(item.key)}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-3">
          <div className="hidden items-center gap-1 text-xs uppercase tracking-widest text-fg-faint sm:flex" aria-label={t("language")}>
            {routing.locales.map((l, i) => (
              <span key={l} className="flex items-center gap-1">
                {i > 0 && <span aria-hidden>/</span>}
                <Link
                  href={pathname}
                  locale={l}
                  className={l === locale ? "text-fg" : "hover:text-fg"}
                  aria-current={l === locale ? "true" : undefined}
                >
                  {l}
                </Link>
              </span>
            ))}
          </div>
          <Link
            href="/contacto"
            className="hidden rounded-sm border border-accent px-4 py-2 btn-label text-accent transition-colors hover:bg-accent hover:text-accent-ink md:inline-flex"
          >
            {t("cta")}
          </Link>
          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-line lg:hidden"
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? t("close") : t("menu")}
            onClick={() => setOpen((v) => !v)}
          >
            <span className="relative block h-3 w-5">
              <span className={`absolute inset-x-0 top-0 h-px bg-fg transition-transform ${open ? "translate-y-1.5 rotate-45" : ""}`} />
              <span className={`absolute inset-x-0 bottom-0 h-px bg-fg transition-transform ${open ? "-translate-y-1.5 -rotate-45" : ""}`} />
            </span>
          </button>
        </div>
      </div>

      {open && (
        <nav id="mobile-nav" className="container-x border-t border-line bg-bg pb-6 pt-4 lg:hidden" aria-label="Principal móvil">
          <ul className="flex flex-col gap-1">
            {NAV.map((item) => (
              <li key={item.key}>
                <Link
                  href={item.href}
                  className="block py-3 display text-3xl"
                  onClick={() => setOpen(false)}
                >
                  {t(item.key)}
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-5 grid grid-cols-2 gap-3">
            <Link href="/stock" className="rounded-sm bg-accent px-4 py-3.5 text-center btn-label text-accent-ink" onClick={() => setOpen(false)}>
              {t("ctaStock")}
            </Link>
            <a
              href={whatsappLink(common("whatsappMessage"))}
              target="_blank"
              rel="noopener"
              className="rounded-sm border border-line-strong px-4 py-3.5 text-center btn-label"
            >
              {t("whatsapp")}
            </a>
          </div>
          <div className="mt-5 flex items-center gap-3 text-xs uppercase tracking-widest text-fg-faint">
            {routing.locales.map((l) => (
              <Link key={l} href={pathname} locale={l} className={l === locale ? "text-fg" : ""} onClick={() => setOpen(false)}>
                {l}
              </Link>
            ))}
          </div>
        </nav>
      )}
    </header>
  );
}
