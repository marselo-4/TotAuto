import Image from "next/image";

/** Proporción ancho/alto del SVG del logo. */
export const LOGO_ASPECT = 6517.2 / 759.5;

/**
 * Logo Tot Auto (propuesta D: Archivo expandida + barra champán), SVG con texto en trazados.
 * `tone` elige la versión: color sobre fondo oscuro (por defecto), mono blanca o mono negra.
 */
export function Logo({
  tone = "color",
  height = 22,
  className = "",
  priority = false,
}: {
  tone?: "color" | "white" | "black";
  height?: number;
  className?: string;
  priority?: boolean;
}) {
  const src = tone === "white" ? "/brand/logo-mono-white.svg" : tone === "black" ? "/brand/logo-mono-black.svg" : "/brand/logo.svg";
  // viewBox 6517.2 × 759.5 (ver docs/gen-wordmark.py)
  const width = Math.round(height * LOGO_ASPECT);
  return (
    <Image
      src={src}
      alt="Tot Auto"
      width={width}
      height={height}
      priority={priority}
      unoptimized
      className={`shrink-0 ${className}`}
    />
  );
}
