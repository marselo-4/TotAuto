"use client";

import { Suspense, useState, type MutableRefObject } from "react";
import { Canvas } from "@react-three/fiber";
import { AdaptiveDpr, PerformanceMonitor, Preload } from "@react-three/drei";
import { EffectComposer, Bloom, Vignette } from "@react-three/postprocessing";
import * as THREE from "three";
import { ShowroomGeometry } from "./showroom-geometry";
import { Car } from "./car";
import { CameraRig } from "./camera-rig";
import { CARS, CEIL_Y } from "@/lib/hero/showroom-layout";

function Lights() {
  return (
    <>
      <ambientLight intensity={0.16} color="#cfd6e4" />
      <hemisphereLight intensity={0.12} color="#9fb4d6" groundColor="#1a1612" />
      {/* Farolas de la calle, para que la fachada se lea desde fuera */}
      <pointLight position={[-11.5, 3.6, 8.5]} intensity={24} distance={16} decay={1.8} color="#ffd7a3" />
      <pointLight position={[-12.5, 3.6, -2.0]} intensity={14} distance={16} decay={1.8} color="#ffd7a3" />
      {/* Un proyector cálido sobre cada coche (CRI alto, 3000 K) */}
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
      {/* Luz fría de la calle a través de la cristalera */}
      <directionalLight position={[-14, 4, 6]} intensity={0.35} color="#8fb0e8" />
      {/* Relleno suave en la trasera */}
      <pointLight position={[4.6, 2.2, 0.5]} intensity={6} distance={8} decay={2} color="#ffe9d0" />
    </>
  );
}

export function ShowroomScene({
  progress,
  quality = "high",
  active = true,
}: {
  progress: MutableRefObject<number>;
  quality?: "high" | "low";
  active?: boolean;
}) {
  const [dpr, setDpr] = useState<number>(quality === "high" ? 1.5 : 1);
  const high = quality === "high";

  return (
    <Canvas
      dpr={dpr}
      frameloop={active ? "always" : "never"}
      camera={{ fov: 52, near: 0.1, far: 80, position: [-15.5, 2.4, 9.5] }}
      gl={{ antialias: !high, powerPreference: "high-performance", toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.05 }}
      onCreated={({ scene }) => {
        scene.background = new THREE.Color("#07070a");
        scene.fog = new THREE.FogExp2("#07070a", 0.028);
      }}
      style={{ position: "absolute", inset: 0 }}
    >
      <PerformanceMonitor onDecline={() => setDpr(1)} onIncline={() => setDpr(high ? 1.5 : 1)} />
      <AdaptiveDpr pixelated={false} />
      <Suspense fallback={null}>
        <Lights />
        <ShowroomGeometry reflections={high} />
        {CARS.map((c) => (
          <Car key={c.id} spec={c} />
        ))}
        <CameraRig progress={progress} />
        {high && (
          <EffectComposer multisampling={4}>
            <Bloom intensity={0.55} luminanceThreshold={1.1} luminanceSmoothing={0.3} mipmapBlur />
            <Vignette eskil={false} offset={0.25} darkness={0.75} />
          </EffectComposer>
        )}
        <Preload all />
      </Suspense>
    </Canvas>
  );
}
