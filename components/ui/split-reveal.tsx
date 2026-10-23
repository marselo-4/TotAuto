"use client";

import { useRef, type ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, SplitText, useGSAP);

/**
 * Titular que entra línea a línea (el texto está en el HTML desde el principio).
 * `masked` (por defecto) revela cada línea desde una máscara: para titulares que llegan con el scroll.
 * Sin máscara, las líneas solo se desplazan y nunca dejan de verse: para titulares sobre el pliegue,
 * que son candidatos a LCP y no deben esperar al JavaScript.
 */
export function SplitReveal({
  children,
  as: Tag = "h1",
  className = "",
  delay = 0,
  masked = true,
}: {
  children: ReactNode;
  as?: "h1" | "h2" | "p";
  className?: string;
  delay?: number;
  masked?: boolean;
}) {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      let split: SplitText | undefined;
      const run = () => {
        split = SplitText.create(el, { type: "lines", mask: masked ? "lines" : undefined, linesClass: "split-line", autoSplit: true });
        const inView = el.getBoundingClientRect().top < window.innerHeight * 0.92;
        gsap.fromTo(
          split.lines,
          masked ? { yPercent: 110 } : { y: 28 },
          {
            yPercent: 0,
            y: 0,
            duration: masked ? 1 : 0.9,
            ease: "power4.out",
            stagger: 0.09,
            delay,
            // Al terminar se deshace la partición: el DOM vuelve a ser el texto original,
            // sin máscaras que recorten los descendentes de la Bodoni.
            onComplete: () => split?.revert(),
            ...(inView ? {} : { scrollTrigger: { trigger: el, start: "top 90%", once: true } }),
          },
        );
      };
      // Esperar a las fuentes para que las líneas se partan bien
      document.fonts?.ready.then(run).catch(run);
      return () => split?.revert();
    },
    { scope: ref },
  );

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const Comp = Tag as any;
  return (
    <Comp ref={ref} className={className}>
      {children}
    </Comp>
  );
}
