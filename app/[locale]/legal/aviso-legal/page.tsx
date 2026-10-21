import type { Metadata } from "next";
import { LegalPage, legalMetadata } from "@/components/legal/legal-page";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return legalMetadata(locale, "avisoLegal");
}

export default async function Page({ params }: Props) {
  const { locale } = await params;
  return <LegalPage locale={locale} docKey="avisoLegal" />;
}
