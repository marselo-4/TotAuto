import { SplitReveal } from "@/components/ui/split-reveal";
import { Reveal } from "@/components/ui/reveal";

export function PageIntro({ eyebrow, title, lead }: { eyebrow?: string; title: string; lead?: string }) {
  return (
    <section className="container-x pb-12 pt-32 md:pb-20 md:pt-44">
      {eyebrow && (
        <Reveal y={12}>
          <p className="eyebrow mb-5">{eyebrow}</p>
        </Reveal>
      )}
      <SplitReveal as="h1" className="display text-4xl md:text-6xl lg:text-7xl" delay={0.1} masked={false}>
        {title}
      </SplitReveal>
      {lead && (
        <Reveal y={16} delay={0.35}>
          <p className="mt-6 max-w-2xl text-lg text-fg-muted md:text-xl">{lead}</p>
        </Reveal>
      )}
    </section>
  );
}
