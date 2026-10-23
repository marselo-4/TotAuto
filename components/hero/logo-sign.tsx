"use client";

import { useEffect, useState } from "react";
import * as THREE from "three";
import { LOGO_ASPECT } from "@/components/layout/logo";

/** Rasteriza el SVG del logo a una textura nítida (el ImageLoader de three lo haría a 300×150). */
function useLogoTexture(src: string, width = 2048) {
  const [tex, setTex] = useState<THREE.CanvasTexture | null>(null);
  useEffect(() => {
    let cancelled = false;
    const img = new Image();
    img.decoding = "async";
    img.onload = () => {
      if (cancelled) return;
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = Math.round(width / LOGO_ASPECT);
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      const t = new THREE.CanvasTexture(canvas);
      t.colorSpace = THREE.SRGBColorSpace;
      t.anisotropy = 8;
      setTex(t);
    };
    img.src = src;
    return () => {
      cancelled = true;
    };
  }, [src, width]);
  useEffect(() => () => tex?.dispose(), [tex]);
  return tex;
}

/** Rótulo "TOT AUTO" retroiluminado, en blanco, sobre una pared. */
export function LogoSign({
  position,
  rotation,
  width = 2.8,
}: {
  position: [number, number, number];
  rotation?: [number, number, number];
  width?: number;
}) {
  const tex = useLogoTexture("/brand/logo-mono-white.svg");
  if (!tex) return null;
  return (
    <mesh position={position} rotation={rotation}>
      <planeGeometry args={[width, width / LOGO_ASPECT]} />
      <meshBasicMaterial map={tex} transparent toneMapped={false} color="#ffffff" />
    </mesh>
  );
}
