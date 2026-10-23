import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Logo } from "@/components/layout/logo";
import { LegalPage, legalMetadata } from "@/components/legal/legal-page";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return legalMetadata(locale, "privacidad");
}

/** Política de privacidad: la pide el formulario de la lista de espera. Cabecera mínima con vuelta a la portada. */
export default async function Page({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "legal" });
  return (
    <>
      <header className="container-x flex h-20 w-full items-center justify-between">
        <Link href="/" aria-label="Tot Auto">
          <Logo height={18} priority />
        </Link>
        <Link href="/" className="text-xs uppercase tracking-[0.22em] text-fg-faint hover:text-fg">
          ← {t("back")}
        </Link>
      </header>
      <LegalPage locale={locale} docKey="privacidad" />
    </>
  );
}
