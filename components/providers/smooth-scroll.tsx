"use client";

import { useEffect, type ReactNode } from "react";
import { ReactLenis, useLenis } from "lenis/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/** Sincroniza Lenis con el ticker de GSAP para que ScrollTrigger y el scroll suave vayan a una. */
function LenisGsapBridge() {
  const lenis = useLenis();

  useEffect(() => {
    if (!lenis) return;
    const update = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(update);
    gsap.ticker.lagSmoothing(0);
    const onScroll = () => ScrollTrigger.update();
    lenis.on("scroll", onScroll);
    // Las posiciones se calculan antes de que carguen fuentes e imágenes: recalcular al terminar
    const refresh = () => ScrollTrigger.refresh();
    if (document.readyState === "complete") refresh();
    else window.addEventListener("load", refresh, { once: true });
    document.fonts?.ready.then(refresh).catch(() => {});
    return () => {
      gsap.ticker.remove(update);
      lenis.off("scroll", onScroll);
      window.removeEventListener("load", refresh);
    };
  }, [lenis]);

  return null;
}

export function SmoothScroll({ children }: { children: ReactNode }) {
  return (
    <ReactLenis
      root
      options={{
        autoRaf: false,
        lerp: 0.1,
        wheelMultiplier: 1,
        touchMultiplier: 1.2,
        // En móvil dejamos el scroll nativo: mejor rendimiento y gestos del sistema
        syncTouch: false,
      }}
    >
      <LenisGsapBridge />
      {children}
    </ReactLenis>
  );
}
