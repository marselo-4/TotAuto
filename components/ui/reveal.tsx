"use client";

import { useRef, type ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/**
 * Revela el contenido al entrar en pantalla (subida suave + fundido).
 * Con `stagger`, anima los hijos directos en cascada. Respeta "reducir movimiento".
 * Lo que ya está en pantalla al montar no se oculta nunca: solo se anima lo que llega después.
 */
export function Reveal({
  children,
  className = "",
  as: Tag = "div",
  delay = 0,
  y = 32,
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
      // Si ya es visible (o casi), no hay revelado: el contenido se queda como está.
      const top = el.getBoundingClientRect().top;
      if (top < window.innerHeight * 0.92) return;
      const targets = stagger ? Array.from(el.children) : el;
      gsap.fromTo(
        targets,
        { opacity: 0, y },
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          ease: "power3.out",
          delay,
          stagger: stagger ?? 0,
          clearProps: "transform",
          scrollTrigger: { trigger: el, start: "top 90%", once: true },
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
