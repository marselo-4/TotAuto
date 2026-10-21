import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Reveal } from "@/components/ui/reveal";

export function ImportSection() {
  const t = useTranslations("home.import");
  const steps = [0, 1, 2] as const;

  return (
    <section className="border-y border-line bg-bg-elev">
      <div className="container-x grid items-center gap-12 py-24 md:grid-cols-2 md:gap-16 md:py-36">
        <Reveal className="relative aspect-[4/3] overflow-hidden rounded-card md:order-2">
          <Image
            src="/img/showroom-trasera.jpg"
            alt={t("imageAlt")}
            fill
            sizes="(min-width: 768px) 50vw, 100vw"
            className="object-cover"
          />
          <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-bg-elev/70 to-transparent" />
        </Reveal>
        <div className="md:order-1">
          <Reveal>
            <p className="eyebrow mb-4">{t("eyebrow")}</p>
            <h2 className="display text-5xl md:text-7xl">{t("title")}</h2>
            <p className="mt-6 max-w-lg text-lg text-fg-muted">{t("lead")}</p>
          </Reveal>
          <Reveal as="ul" stagger={0.12} className="mt-10 grid gap-5" delay={0.15}>
            {steps.map((i) => (
              <li key={i} className="flex gap-5 border-t border-line pt-5">
                <span className="font-display text-2xl text-accent">0{i + 1}</span>
                <div>
                  <p className="font-medium">{t(`steps.${i}.title`)}</p>
                  <p className="mt-1 text-sm text-fg-muted">{t(`steps.${i}.text`)}</p>
                </div>
              </li>
            ))}
          </Reveal>
          <Reveal delay={0.3} className="mt-10">
            <Link href="/importacion" className="rounded-full bg-accent px-6 py-3 text-sm font-medium text-accent-ink hover:opacity-90">
              {t("cta")}
            </Link>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
