"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";

export type GalleryImage = { src: string; alt: string };

/**
 * Galería de fotos de la ficha: carrusel con scroll-snap (deslizar en móvil, flechas en escritorio),
 * miniaturas y visor a pantalla completa con <dialog>.
 */
export function VehicleGallery({ images, make }: { images: GalleryImage[]; make: string }) {
  const t = useTranslations("vehicle.gallery");
  const track = useRef<HTMLDivElement>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const [index, setIndex] = useState(0);
  const [open, setOpen] = useState(false);

  // Sincroniza el índice con la posición del scroll
  useEffect(() => {
    const el = track.current;
    if (!el) return;
    const onScroll = () => {
      const i = Math.round(el.scrollLeft / el.clientWidth);
      setIndex((prev) => (prev === i ? prev : i));
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  function go(i: number) {
    const el = track.current;
    if (!el) return;
    const next = (i + images.length) % images.length;
    el.scrollTo({ left: next * el.clientWidth, behavior: "smooth" });
    setIndex(next);
  }

  function openViewer() {
    setOpen(true);
    dialog.current?.showModal();
  }
  function closeViewer() {
    dialog.current?.close();
    setOpen(false);
  }

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") go(index + 1);
      if (e.key === "ArrowLeft") go(index - 1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, index]);

  if (images.length === 0) {
    return (
      <div className="relative aspect-[4/3] overflow-hidden rounded-card bg-bg-elev-2">
        <div className="absolute inset-0 flex items-end p-8">
          <span className="font-display text-6xl text-fg-faint">{make}</span>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="group relative overflow-hidden rounded-card bg-bg-elev-2">
        <div
          ref={track}
          className="flex aspect-[4/3] snap-x snap-mandatory overflow-x-auto scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          aria-roledescription="carousel"
        >
          {images.map((img, i) => (
            <button
              key={img.src}
              type="button"
              onClick={openViewer}
              className="relative h-full w-full flex-none snap-center"
              aria-label={t("open")}
            >
              <Image src={img.src} alt={img.alt} fill priority={i === 0} sizes="(min-width: 1024px) 60vw, 100vw" className="object-cover" />
            </button>
          ))}
        </div>
        {images.length > 1 && (
          <>
            <button type="button" onClick={() => go(index - 1)} className={navBtn + " left-3"} aria-label={t("prev")}>←</button>
            <button type="button" onClick={() => go(index + 1)} className={navBtn + " right-3"} aria-label={t("next")}>→</button>
            <span className="absolute bottom-3 right-3 rounded-full bg-bg/70 px-3 py-1 text-xs backdrop-blur">
              {index + 1} / {images.length}
            </span>
          </>
        )}
      </div>

      {images.length > 1 && (
        <ul className="mt-3 flex gap-2 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {images.map((img, i) => (
            <li key={img.src} className="flex-none">
              <button
                type="button"
                onClick={() => go(i)}
                className={`relative h-16 w-24 overflow-hidden rounded-md border transition-colors ${i === index ? "border-accent" : "border-transparent opacity-70 hover:opacity-100"}`}
                aria-label={`${t("photo")} ${i + 1}`}
                aria-current={i === index}
              >
                <Image src={img.src} alt="" fill sizes="96px" className="object-cover" />
              </button>
            </li>
          ))}
        </ul>
      )}

      <dialog
        ref={dialog}
        onClose={() => setOpen(false)}
        className="h-full max-h-none w-full max-w-none bg-bg/95 p-0 text-fg backdrop:bg-bg/90 open:flex open:items-center open:justify-center"
      >
        {open && (
          <div className="relative h-full w-full">
            <Image src={images[index].src} alt={images[index].alt} fill sizes="100vw" className="object-contain" />
            <button type="button" onClick={closeViewer} className="absolute right-4 top-4 rounded-full border border-line bg-bg/70 px-4 py-2 text-sm backdrop-blur" aria-label={t("close")}>
              ✕
            </button>
            {images.length > 1 && (
              <>
                <button type="button" onClick={() => go(index - 1)} className={navBtn + " left-4 opacity-100"} aria-label={t("prev")}>←</button>
                <button type="button" onClick={() => go(index + 1)} className={navBtn + " right-4 opacity-100"} aria-label={t("next")}>→</button>
                <span className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-bg/70 px-3 py-1 text-xs backdrop-blur">
                  {index + 1} / {images.length}
                </span>
              </>
            )}
          </div>
        )}
      </dialog>
    </div>
  );
}

const navBtn =
  "absolute top-1/2 -translate-y-1/2 rounded-full border border-line bg-bg/70 px-3 py-2 text-sm opacity-0 backdrop-blur transition-opacity group-hover:opacity-100 focus:opacity-100";
