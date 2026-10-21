"use client";

import { useState, useSyncExternalStore } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useTranslations } from "next-intl";

const ShowroomExplorer = dynamic(() => import("@/components/hero/showroom-explorer").then((m) => m.ShowroomExplorer), { ssr: false });

type Mode = "pending" | "high" | "low" | "poster";
let cached: Mode | null = null;
const subscribe = () => () => {};
const getServer = (): Mode => "pending";
function detect(): Mode {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return "poster";
  const c = document.createElement("canvas");
  if (!(c.getContext("webgl2") ?? c.getContext("webgl"))) return "poster";
  return window.innerWidth < 768 ? "low" : "high";
}
const getMode = () => (cached ??= detect());

const SPOT_KEYS = ["main", "passage", "back"] as const;

/** Bloque "explora el local en 3D": se carga al pulsar, con el render como portada y tres puntos de vista. */
export function Showroom3D() {
  const t = useTranslations("pages.showroom.explore");
  const mode = useSyncExternalStore(subscribe, getMode, getServer);
  const [started, setStarted] = useState(false);
  const [spot, setSpot] = useState(0);
  const can3d = mode === "high" || mode === "low";

  return (
    <div className="relative aspect-[16/10] overflow-hidden rounded-card bg-bg-elev-2 md:aspect-[21/9]">
      {started && can3d ? (
        <>
          <ShowroomExplorer quality={mode === "high" ? "high" : "low"} spot={spot} />
          <div className="pointer-events-none absolute inset-x-3 bottom-3 flex flex-wrap items-end justify-between gap-2">
            <div className="pointer-events-auto flex gap-1 rounded-full bg-bg/70 p-1 backdrop-blur">
              {SPOT_KEYS.map((k, i) => (
                <button
                  key={k}
                  type="button"
                  onClick={() => setSpot(i)}
                  className={`rounded-full px-3 py-1.5 text-xs transition-colors ${spot === i ? "bg-accent text-accent-ink" : "text-fg-muted hover:text-fg"}`}
                  aria-pressed={spot === i}
                >
                  {t(`spots.${k}`)}
                </button>
              ))}
            </div>
            <p className="rounded-full bg-bg/70 px-3 py-1 text-xs text-fg-muted backdrop-blur">{t("hint")}</p>
          </div>
        </>
      ) : (
        <>
          <Image src="/img/showroom-recepcion.jpg" alt={t("posterAlt")} fill sizes="100vw" className="object-cover opacity-80" />
          {can3d && (
            <div className="absolute inset-0 flex items-center justify-center">
              <button
                type="button"
                onClick={() => setStarted(true)}
                className="rounded-full bg-accent px-6 py-3 text-sm font-medium text-accent-ink shadow-lg transition-opacity hover:opacity-90"
              >
                {t("start")}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
