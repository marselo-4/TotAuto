import { setRequestLocale } from "next-intl/server";
import { ComingSoon } from "@/components/teaser/coming-soon";

export default async function TeaserPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <ComingSoon />;
}
