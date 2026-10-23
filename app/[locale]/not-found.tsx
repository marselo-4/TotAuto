import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

export default function NotFound() {
  const t = useTranslations("notFound");
  return (
    <section className="container-x flex min-h-svh flex-col items-start justify-center">
      <p className="eyebrow mb-5">404</p>
      <h1 className="display text-4xl md:text-6xl">{t("title")}</h1>
      <p className="mt-5 max-w-md text-fg-muted">{t("text")}</p>
      <div className="mt-8 flex flex-wrap gap-3">
        <Link href="/" className="rounded-sm bg-accent px-6 py-3.5 btn-label text-accent-ink hover:opacity-90">{t("home")}</Link>
        <Link href="/stock" className="rounded-sm border border-line-strong px-6 py-3.5 btn-label hover:border-fg">{t("stock")}</Link>
      </div>
    </section>
  );
}
