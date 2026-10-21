"use client";

import { useMemo, useRef, type MutableRefObject } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { CAMERA_PATH } from "@/lib/hero/showroom-layout";

/**
 * Mueve la cámara por el recorrido según el progreso del scroll (0 → 1), con amortiguación.
 * `progress` lo escribe ScrollTrigger desde fuera del canvas.
 */
export function CameraRig({ progress }: { progress: MutableRefObject<number> }) {
  const { camera } = useThree();
  const curves = useMemo(() => {
    const pos = new THREE.CatmullRomCurve3(CAMERA_PATH.map((p) => new THREE.Vector3(...p.pos)), false, "centripetal", 0.6);
    const look = new THREE.CatmullRomCurve3(CAMERA_PATH.map((p) => new THREE.Vector3(...p.look)), false, "centripetal", 0.6);
    return { pos, look };
  }, []);
  const current = useRef(0);
  const target = useRef(new THREE.Vector3());
  const p = useRef(new THREE.Vector3());

  useFrame((_, delta) => {
    // Amortiguación exponencial independiente del framerate
    const k = 1 - Math.exp(-delta * 6);
    current.current += (progress.current - current.current) * k;
    const t = THREE.MathUtils.clamp(current.current, 0, 1);
    curves.pos.getPointAt(t, p.current);
    curves.look.getPointAt(t, target.current);
    camera.position.copy(p.current);
    camera.lookAt(target.current);
  });

  return null;
}
