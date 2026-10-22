import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Reveal } from "@/components/ui/reveal";
import { SplitReveal } from "@/components/ui/split-reveal";
import { site } from "@/lib/site";

export function ShowroomSection() {
  const t = useTranslations("home.showroom");
  const facts = [0, 1, 2] as const;

  return (
    <section className="container-x py-24 md:py-36">
      <Reveal className="mb-12 max-w-3xl md:mb-16">
        <p className="eyebrow mb-4">{t("eyebrow")}</p>
        <SplitReveal as="h2" className="display text-5xl md:text-7xl">{t("title")}</SplitReveal>
        <p className="mt-6 max-w-xl text-lg text-fg-muted">{t("lead")}</p>
      </Reveal>

      <div className="grid gap-5 md:grid-cols-12">
        <Reveal className="relative aspect-[16/10] overflow-hidden rounded-card md:col-span-8">
          <Image src="/img/showroom-fachada.jpg" alt={t("images.facade")} fill sizes="(min-width: 768px) 66vw, 100vw" className="object-cover" />
        </Reveal>
        <Reveal delay={0.1} className="relative aspect-[16/10] overflow-hidden rounded-card md:col-span-4 md:aspect-auto">
          <Image src="/img/showroom-principal.jpg" alt={t("images.main")} fill sizes="(min-width: 768px) 33vw, 100vw" className="object-cover" />
        </Reveal>
        <Reveal delay={0.1} className="relative aspect-[16/10] overflow-hidden rounded-card md:col-span-4 md:aspect-auto">
          <Image src="/img/showroom-recepcion.jpg" alt={t("images.reception")} fill sizes="(min-width: 768px) 33vw, 100vw" className="object-cover" />
        </Reveal>
        <Reveal as="div" delay={0.15} className="flex flex-col justify-between rounded-card border border-line bg-bg-elev p-7 md:col-span-8 md:p-10">
          <ul className="grid gap-4 sm:grid-cols-3">
            {facts.map((i) => (
              <li key={i} className="border-t border-line pt-4">
                <p className="font-display text-3xl">{t(`facts.${i}.value`)}</p>
                <p className="mt-1 text-sm text-fg-muted">{t(`facts.${i}.label`)}</p>
              </li>
            ))}
          </ul>
          <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-3">
            <p className="text-sm text-fg-muted">
              {site.address.street} · {site.address.postalCode} {site.address.city}
            </p>
            <Link href="/showroom" className="rounded-full border border-line-strong px-5 py-2.5 text-sm hover:border-fg">
              {t("cta")}
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
