import Image from "next/image";

/**
 * Logo Tot Auto (propuesta A: Bodoni Moda + filete champán), SVG con texto en trazados.
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
  // viewBox 726.94 × 151.9
  const width = Math.round(height * (726.94 / 151.9));
  return (
    <Image
      src={src}
      alt="Tot Auto"
      width={width}
      height={height}
      priority={priority}
      unoptimized
      className={className}
    />
  );
}
