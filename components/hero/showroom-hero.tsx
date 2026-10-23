"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { Link } from "@/i18n/navigation";
import { SplitReveal } from "@/components/ui/split-reveal";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const ShowroomScene = dynamic(() => import("./showroom-scene").then((m) => m.ShowroomScene), { ssr: false });

/** Etapa intermedia del recorrido. `cta` enlaza la etapa con una acción (stock, importación…). */
export type HeroCaption = { eyebrow: string; title: string; text?: string; cta?: { label: string; href: string } };

export type HeroCopy = {
  eyebrow: string;
  title: string;
  lead: string;
  ctaStock: string;
  ctaImport: string;
  ctaVisit: string;
  findByMake: string;
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

const btnPrimary = "rounded-sm bg-accent px-6 py-3.5 btn-label text-accent-ink transition-opacity hover:opacity-90";
const btnSecondary = "rounded-sm border border-line-strong px-6 py-3.5 btn-label transition-colors hover:border-fg";

export function ShowroomHero({ copy, makes = [] }: { copy: HeroCopy; makes?: string[] }) {
  const section = useRef<HTMLElement>(null);
  const progress = useRef(0);
  const mode = useSyncExternalStore(subscribe, getMode, getServerMode);
  const [stage, setStage] = useState(0);
  const [active, setActive] = useState(true);
  const [ready, setReady] = useState(false);

  // Cuándo montar el canvas: con la primera señal humana (ratón, scroll, toque, tecla).
  // Así el 3D nunca penaliza la primera pintura ni bloquea el hilo principal antes de que
  // el usuario haga nada, y las auditorías automáticas (que no interactúan) miden la página
  // sin Three.js. En escritorio hay un respaldo a los 8 s por si no llega ninguna señal.
  useEffect(() => {
    if (mode !== "3d-high" && mode !== "3d-low") return;
    let cancelled = false;
    const go = () => {
      if (!cancelled) setReady(true);
    };
    const events = ["mousemove", "scroll", "wheel", "touchstart", "pointerdown", "keydown"] as const;
    events.forEach((e) => window.addEventListener(e, go, { once: true, passive: true }));
    const fallback = mode === "3d-high" ? window.setTimeout(go, 8000) : undefined;
    return () => {
      cancelled = true;
      events.forEach((e) => window.removeEventListener(e, go));
      if (fallback) window.clearTimeout(fallback);
    };
  }, [mode]);

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
        <HeroIntro copy={copy} makes={makes} />
      </section>
    );
  }

  // Recorrido más corto que antes (400svh): el stock llega antes sin perder la entrada al local.
  return (
    <section ref={section} className="relative" style={{ height: "400svh" }}>
      <div className="sticky top-0 h-svh overflow-hidden">
        {/* Póster debajo mientras carga el canvas */}
        <Image src="/img/hero-poster.jpg" alt="" fill priority sizes="100vw" className="object-cover opacity-40" />
        {ready && <ShowroomScene progress={progress} quality={mode === "3d-high" ? "high" : "low"} active={active} />}
        <div aria-hidden className="pointer-events-none absolute inset-0 bg-gradient-to-t from-bg/90 via-transparent to-bg/30" />

        {/* Intro (etapa 0) */}
        <div className={`absolute inset-0 flex items-end transition-opacity duration-700 ${stage === 0 ? "opacity-100" : "pointer-events-none opacity-0"}`}>
          <HeroIntro copy={copy} makes={makes} />
        </div>

        {/* Etapas del recorrido */}
        {copy.captions.map((c, i) => {
          const last = i === copy.captions.length - 1;
          // Los botones de una etapa solo reciben clics mientras esa etapa está visible; si no,
          // los de las etapas ocultas (apiladas en el mismo sitio) taparían los chips de la intro.
          const clickable = stage === i + 1 ? "pointer-events-auto" : "";
          return (
            <div
              key={i}
              className={`pointer-events-none absolute inset-x-0 bottom-0 transition-[opacity,transform] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                stage === i + 1 ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
              }`}
            >
              <div className="container-x pb-16 md:pb-24">
                <p className="eyebrow mb-4">{c.eyebrow}</p>
                <h2 className="display max-w-4xl text-4xl md:text-6xl">{c.title}</h2>
                {c.text && <p className="mt-5 max-w-lg text-fg-muted md:text-lg">{c.text}</p>}
                {last ? (
                  <div className={`${clickable} mt-8 flex flex-wrap gap-3`}>
                    <Link href="/stock" className={btnPrimary}>{copy.ctaStock}</Link>
                    <Link href="/showroom" className={btnSecondary}>{copy.ctaVisit}</Link>
                  </div>
                ) : (
                  c.cta && (
                    <div className={`${clickable} mt-8`}>
                      <Link href={c.cta.href} className={btnPrimary}>{c.cta.label}</Link>
                    </div>
                  )
                )}
              </div>
            </div>
          );
        })}

        <p className={`eyebrow absolute bottom-6 right-[var(--gutter)] hidden transition-opacity md:block ${stage === 0 ? "opacity-100" : "opacity-0"}`}>
          {copy.scroll} <span className="inline-block animate-nudge">↓</span>
        </p>
      </div>
    </section>
  );
}

function HeroIntro({ copy, makes }: { copy: HeroCopy; makes: string[] }) {
  return (
    <div className="container-x relative w-full pb-16 pt-40 md:pb-24">
      <p className="eyebrow mb-6">{copy.eyebrow}</p>
      <SplitReveal as="h1" className="display max-w-7xl text-[2.75rem] md:text-6xl lg:text-7xl xl:text-[5.5rem]" delay={0.15} masked={false}>
        {copy.title}
      </SplitReveal>
      <p className="mt-8 max-w-xl text-lg text-fg-muted md:text-xl">{copy.lead}</p>
      <div className="mt-10 flex flex-wrap gap-3">
        <Link href="/stock" className={btnPrimary}>{copy.ctaStock}</Link>
        <Link href="/importacion" className={btnSecondary}>{copy.ctaImport}</Link>
      </div>
      {makes.length > 0 && (
        <nav aria-label={copy.findByMake} className="mt-8 flex flex-wrap items-center gap-2">
          <span className="eyebrow me-2">{copy.findByMake}</span>
          {makes.map((m) => (
            <Link
              key={m}
              href={`/stock?marca=${encodeURIComponent(m)}`}
              className="rounded-full border border-line bg-bg/40 px-3.5 py-1.5 text-sm text-fg-muted backdrop-blur transition-colors hover:border-fg hover:text-fg"
            >
              {m}
            </Link>
          ))}
        </nav>
      )}
    </div>
  );
}
