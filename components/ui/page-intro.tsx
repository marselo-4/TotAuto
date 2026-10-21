export function PageIntro({ eyebrow, title, lead }: { eyebrow?: string; title: string; lead?: string }) {
  return (
    <section className="container-x pb-12 pt-32 md:pb-20 md:pt-44">
      {eyebrow && <p className="eyebrow mb-5">{eyebrow}</p>}
      <h1 className="display text-5xl md:text-7xl lg:text-8xl">{title}</h1>
      {lead && <p className="mt-6 max-w-2xl text-lg text-fg-muted md:text-xl">{lead}</p>}
    </section>
  );
}
