"use client";

import { useRef, useState, useSyncExternalStore } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { Link } from "@/i18n/navigation";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const ShowroomScene = dynamic(() => import("./showroom-scene").then((m) => m.ShowroomScene), { ssr: false });

export type HeroCaption = { eyebrow: string; title: string; text?: string };

export type HeroCopy = {
  eyebrow: string;
  title: string;
  lead: string;
  ctaStock: string;
  ctaVisit: string;
  scroll: string;
  captions: HeroCaption[]; // etapas intermedias del recorrido
};

type Mode = "pending" | "3d-high" | "3d-low" | "poster";

/** Decide si vale la pena cargar el 3D: WebGL disponible, sin "reducir movimiento", pantalla no diminuta. */
function detectMode(): Mode {
  if (typeof window === "undefined") return "poster";
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return "poster";
  const canvas = document.createElement("canvas");
  const gl = canvas.getContext("webgl2") ?? canvas.getContext("webgl");
  if (!gl) return "poster";
  const small = window.innerWidth < 768;
  const coarse = window.matchMedia("(pointer: coarse)").matches;
  const cores = navigator.hardwareConcurrency ?? 4;
  if (small || (coarse && cores <= 4)) return "3d-low";
  return "3d-high";
}

// El modo se detecta una vez en el cliente; en el servidor es "pending" (se renderiza el póster).
let cachedMode: Mode | null = null;
const subscribe = () => () => {};
const getMode = () => (cachedMode ??= detectMode());
const getServerMode = (): Mode => "pending";

export function ShowroomHero({ copy }: { copy: HeroCopy }) {
  const section = useRef<HTMLElement>(null);
  const progress = useRef(0);
  const mode = useSyncExternalStore(subscribe, getMode, getServerMode);
  const [stage, setStage] = useState(0);
  const [active, setActive] = useState(true);

  // Progreso de scroll → cámara y etapa de texto
  useGSAP(
    () => {
      if (!section.current || mode === "pending" || mode === "poster") return;
      const stages = copy.captions.length + 1; // intro + captions
      const st = ScrollTrigger.create({
        trigger: section.current,
        start: "top top",
        end: "bottom bottom",
        scrub: true,
        onUpdate: (self) => {
          progress.current = self.progress;
          const s = Math.min(stages - 1, Math.floor(self.progress * stages + 0.15));
          setStage((prev) => (prev === s ? prev : s));
        },
        onToggle: (self) => setActive(self.isActive || self.progress === 0),
      });
      return () => st.kill();
    },
    { dependencies: [mode], scope: section },
  );

  if (mode === "poster" || mode === "pending") {
    return (
      <section ref={section} className="relative flex min-h-svh items-end overflow-hidden">
        <Image
          src="/img/hero-poster.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-70"
        />
        <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-bg via-bg/60 to-bg/20" />
        <HeroIntro copy={copy} />
      </section>
    );
  }

  return (
    <section ref={section} className="relative" style={{ height: "520svh" }}>
      <div className="sticky top-0 h-svh overflow-hidden">
        {/* Póster debajo mientras carga el canvas */}
        <Image src="/img/hero-poster.jpg" alt="" fill priority sizes="100vw" className="object-cover opacity-40" />
        <ShowroomScene progress={progress} quality={mode === "3d-high" ? "high" : "low"} active={active} />
        <div aria-hidden className="pointer-events-none absolute inset-0 bg-gradient-to-t from-bg/90 via-transparent to-bg/30" />

        {/* Intro (etapa 0) */}
        <div className={`absolute inset-0 flex items-end transition-opacity duration-700 ${stage === 0 ? "opacity-100" : "pointer-events-none opacity-0"}`}>
          <HeroIntro copy={copy} />
        </div>

        {/* Etapas del recorrido */}
        {copy.captions.map((c, i) => (
          <div
            key={i}
            className={`pointer-events-none absolute inset-x-0 bottom-0 transition-opacity duration-700 ${
              stage === i + 1 ? "opacity-100" : "opacity-0"
            }`}
          >
            <div className="container-x pb-16 md:pb-24">
              <p className="eyebrow mb-4">{c.eyebrow}</p>
              <h2 className="display max-w-3xl text-5xl md:text-7xl">{c.title}</h2>
              {c.text && <p className="mt-5 max-w-lg text-fg-muted md:text-lg">{c.text}</p>}
              {i === copy.captions.length - 1 && (
                <div className="pointer-events-auto mt-8 flex flex-wrap gap-3">
                  <Link href="/stock" className="rounded-full bg-accent px-6 py-3 text-sm font-medium text-accent-ink hover:opacity-90">
                    {copy.ctaStock}
                  </Link>
                  <Link href="/showroom" className="rounded-full border border-line-strong px-6 py-3 text-sm hover:border-fg">
                    {copy.ctaVisit}
                  </Link>
                </div>
              )}
            </div>
          </div>
        ))}

        <p className={`eyebrow absolute bottom-6 right-[var(--gutter)] hidden transition-opacity md:block ${stage === 0 ? "opacity-100" : "opacity-0"}`}>
          {copy.scroll} ↓
        </p>
      </div>
    </section>
  );
}

function HeroIntro({ copy }: { copy: HeroCopy }) {
  return (
    <div className="container-x relative w-full pb-16 pt-40 md:pb-24">
      <p className="eyebrow mb-6">{copy.eyebrow}</p>
      <h1 className="display max-w-5xl text-6xl md:text-8xl lg:text-[8.5rem]">{copy.title}</h1>
      <p className="mt-8 max-w-xl text-lg text-fg-muted md:text-xl">{copy.lead}</p>
      <div className="mt-10 flex flex-wrap gap-3">
        <Link href="/stock" className="rounded-full bg-accent px-6 py-3 text-sm font-medium text-accent-ink transition-opacity hover:opacity-90">
          {copy.ctaStock}
        </Link>
        <Link href="/showroom" className="rounded-full border border-line-strong px-6 py-3 text-sm transition-colors hover:border-fg">
          {copy.ctaVisit}
        </Link>
      </div>
    </div>
  );
}
