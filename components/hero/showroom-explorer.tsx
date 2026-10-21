"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { AdaptiveDpr, PerformanceMonitor } from "@react-three/drei";
import * as THREE from "three";
import { ShowroomGeometry } from "./showroom-geometry";
import { Car } from "./car";
import { CARS, CEIL_Y } from "@/lib/hero/showroom-layout";

/** Puntos desde los que se puede mirar el local (posición de los ojos y hacia dónde mira al llegar). */
export const SPOTS: Array<{ pos: [number, number, number]; yaw: number }> = [
  // yaw: giro sobre Y; la cámara mira hacia (-sin yaw, 0, -cos yaw)
  { pos: [-6.2, 1.55, 3.9], yaw: -Math.PI * 0.12 }, // entrada: sala principal, Ferrari a la izquierda y pilares al fondo
  { pos: [-1.6, 1.5, 3.4], yaw: -Math.PI * 0.46 }, // junto al paso, mirando a la sala trasera
  { pos: [2.5, 1.5, 4.0], yaw: -Math.PI * 0.2 }, // sala trasera, hacia el logo retroiluminado
];

/**
 * Control "mirar alrededor": la cámara está de pie en un punto; arrastrar gira la vista,
 * la rueda acerca (campo de visión). Nunca atraviesa paredes porque no se desplaza libremente.
 */
function LookAround({ spot }: { spot: number }) {
  const { camera, gl } = useThree();
  const yaw = useRef(SPOTS[0].yaw);
  const pitch = useRef(-0.04);
  const fov = useRef(60);
  const target = useRef(new THREE.Vector3(...SPOTS[0].pos));
  const dragging = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    const s = SPOTS[spot] ?? SPOTS[0];
    target.current.set(...s.pos);
    yaw.current = s.yaw;
    pitch.current = -0.04;
  }, [spot]);

  useEffect(() => {
    const el = gl.domElement;
    el.style.cursor = "grab";
    const down = (e: PointerEvent) => {
      dragging.current = { x: e.clientX, y: e.clientY };
      el.setPointerCapture(e.pointerId);
      el.style.cursor = "grabbing";
    };
    const move = (e: PointerEvent) => {
      if (!dragging.current) return;
      const dx = e.clientX - dragging.current.x;
      const dy = e.clientY - dragging.current.y;
      dragging.current = { x: e.clientX, y: e.clientY };
      yaw.current -= dx * 0.0045;
      pitch.current = THREE.MathUtils.clamp(pitch.current - dy * 0.003, -0.6, 0.5);
    };
    const up = (e: PointerEvent) => {
      dragging.current = null;
      el.releasePointerCapture(e.pointerId);
      el.style.cursor = "grab";
    };
    const wheel = (e: WheelEvent) => {
      e.preventDefault();
      fov.current = THREE.MathUtils.clamp(fov.current + e.deltaY * 0.03, 32, 80);
    };
    el.addEventListener("pointerdown", down);
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerup", up);
    el.addEventListener("pointercancel", up);
    el.addEventListener("wheel", wheel, { passive: false });
    return () => {
      el.removeEventListener("pointerdown", down);
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerup", up);
      el.removeEventListener("pointercancel", up);
      el.removeEventListener("wheel", wheel);
    };
  }, [gl]);

  useFrame((_, delta) => {
    const k = 1 - Math.exp(-delta * 4);
    camera.position.lerp(target.current, k);
    camera.rotation.set(pitch.current, yaw.current, 0, "YXZ");
    const cam = camera as THREE.PerspectiveCamera;
    if (Math.abs(cam.fov - fov.current) > 0.05) {
      cam.fov += (fov.current - cam.fov) * k;
      cam.updateProjectionMatrix();
    }
  });

  return null;
}

/**
 * Versión libre de la escena del showroom para la página del local. Comparte geometría,
 * coches y luces con el hero; en vez de recorrido por scroll, se mira alrededor desde puntos fijos.
 */
export function ShowroomExplorer({ quality = "high", spot = 0 }: { quality?: "high" | "low"; spot?: number }) {
  const high = quality === "high";
  const [dpr, setDpr] = useState<number>(high ? 1.5 : 1);

  return (
    <Canvas
      dpr={dpr}
      camera={{ fov: 60, near: 0.1, far: 80, position: SPOTS[0].pos }}
      gl={{ antialias: !high, powerPreference: "high-performance", toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.05 }}
      onCreated={({ scene }) => {
        scene.background = new THREE.Color("#07070a");
        scene.fog = new THREE.FogExp2("#07070a", 0.022);
      }}
      style={{ position: "absolute", inset: 0, touchAction: "none" }}
    >
      <PerformanceMonitor onDecline={() => setDpr(1)} onIncline={() => setDpr(high ? 1.5 : 1)} />
      <AdaptiveDpr pixelated={false} />
      <Suspense fallback={null}>
        <ambientLight intensity={0.26} color="#cfd6e4" />
        <hemisphereLight intensity={0.14} color="#9fb4d6" groundColor="#1a1612" />
        <pointLight position={[-11.5, 3.6, 8.5]} intensity={24} distance={16} decay={1.8} color="#ffd7a3" />
        {CARS.map((c) => (
          <spotLight
            key={c.id}
            position={[c.position[0], CEIL_Y - 0.05, c.position[2]]}
            target-position={[c.position[0], 0, c.position[2]]}
            angle={0.62}
            penumbra={0.7}
            intensity={55}
            distance={9}
            decay={1.6}
            color="#ffe4c0"
          />
        ))}
        <ShowroomGeometry reflections={high} />
        {CARS.map((c) => (
          <Car key={c.id} spec={c} />
        ))}
        <LookAround spot={spot} />
      </Suspense>
    </Canvas>
  );
}
