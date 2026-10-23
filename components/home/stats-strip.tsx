import { useTranslations } from "next-intl";
import { CountUp } from "@/components/ui/count-up";
import { Reveal } from "@/components/ui/reveal";

export function StatsStrip() {
  const t = useTranslations("home.stats");
  const items = [
    { value: 40, suffix: "", label: t("years") },
    { value: 250, suffix: "+", label: t("dealers") },
    { value: 2, suffix: "", label: t("rooms") },
    { value: 24, suffix: " h", label: t("valuation") },
  ];

  return (
    <section className="border-y border-line">
      <Reveal as="ul" stagger={0.1} className="container-x grid grid-cols-2 gap-y-10 py-14 md:grid-cols-4 md:py-20">
        {items.map((it) => (
          <li key={it.label}>
            <CountUp value={it.value} suffix={it.suffix} className="display tnum text-5xl md:text-6xl" />
            <p className="mt-2 text-sm text-fg-muted">{it.label}</p>
          </li>
        ))}
      </Reveal>
    </section>
  );
}
