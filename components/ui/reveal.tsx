"use client";

import { useRef, type ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/**
 * Revela el contenido al entrar en pantalla (subida suave + fundido).
 * Con `stagger`, anima los hijos directos en cascada. Respeta "reducir movimiento".
 */
export function Reveal({
  children,
  className = "",
  as: Tag = "div",
  delay = 0,
  y = 36,
  stagger,
}: {
  children: ReactNode;
  className?: string;
  as?: "div" | "section" | "ul" | "ol" | "li" | "article";
  delay?: number;
  y?: number;
  stagger?: number;
}) {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      const targets = stagger ? Array.from(el.children) : el;
      gsap.fromTo(
        targets,
        { opacity: 0, y },
        {
          opacity: 1,
          y: 0,
          duration: 1.1,
          ease: "power3.out",
          delay,
          stagger: stagger ?? 0,
          scrollTrigger: { trigger: el, start: "top 85%", once: true },
        },
      );
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
