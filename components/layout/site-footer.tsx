import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { site } from "@/lib/site";
import { Logo } from "@/components/layout/logo";

export function SiteFooter() {
  const t = useTranslations("footer");
  const nav = useTranslations("nav");

  return (
    <footer className="border-t border-line">
      <div className="container-x grid gap-10 py-14 md:grid-cols-3">
        <div>
          <Logo height={28} />
          <p className="mt-3 max-w-xs text-sm text-fg-muted">{t("address")}</p>
        </div>
        <ul className="grid gap-2 text-sm text-fg-muted">
          <li><Link href="/stock" className="hover:text-fg">{nav("stock")}</Link></li>
          <li><Link href="/showroom" className="hover:text-fg">{nav("showroom")}</Link></li>
          <li><Link href="/importacion" className="hover:text-fg">{nav("import")}</Link></li>
          <li><Link href="/vende-tu-coche" className="hover:text-fg">{nav("sell")}</Link></li>
          <li><Link href="/nosotros" className="hover:text-fg">{nav("about")}</Link></li>
          <li><Link href="/contacto" className="hover:text-fg">{nav("contact")}</Link></li>
        </ul>
        <ul className="grid gap-2 text-sm text-fg-muted">
          <li><a href={`tel:${site.phone.replace(/\s/g, "")}`} className="hover:text-fg">{site.phone}</a></li>
          <li><a href={`mailto:${site.email}`} className="hover:text-fg">{site.email}</a></li>
          <li className="pt-2"><Link href="/legal/aviso-legal" className="hover:text-fg">{t("legalNotice")}</Link></li>
          <li><Link href="/legal/privacidad" className="hover:text-fg">{t("privacy")}</Link></li>
          <li><Link href="/legal/cookies" className="hover:text-fg">{t("cookies")}</Link></li>
        </ul>
      </div>
      <div className="container-x border-t border-line py-5 text-xs text-fg-faint">
        © {new Date().getFullYear()} {t("rights")}
      </div>
    </footer>
  );
}
