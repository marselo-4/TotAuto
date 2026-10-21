"use client";

import { useMemo } from "react";
import * as THREE from "three";
import type { CarSpec } from "@/lib/hero/showroom-layout";

/**
 * Coche estilizado ("maqueta de arcilla"): perfil lateral extruido con bisel, cristales y ruedas.
 * Sin marcas ni logos: evita problemas de licencia y encaja con la estética de galería.
 */
export function Car({ spec }: { spec: CarSpec }) {
  const [length, width, height] = spec.size ?? [4.5, 1.9, 1.3];

  const body = useMemo(() => {
    const L = length / 2;
    const h = height;
    const s = new THREE.Shape();
    // Perfil lateral (X a lo largo, Y altura), con morro bajo y zaga corta
    s.moveTo(-L, 0.32);
    s.lineTo(-L + 0.15, 0.2);
    s.lineTo(L * 0.55, 0.2);
    s.quadraticCurveTo(L, 0.22, L, 0.5);
    s.quadraticCurveTo(L * 0.9, 0.62, L * 0.55, 0.66);
    s.lineTo(L * 0.25, 0.68);
    s.quadraticCurveTo(L * 0.1, h, -L * 0.28, h);
    s.quadraticCurveTo(-L * 0.62, h * 0.98, -L * 0.76, 0.78);
    s.quadraticCurveTo(-L * 0.9, 0.62, -L, 0.5);
    s.closePath();
    const geo = new THREE.ExtrudeGeometry(s, {
      depth: width - 0.3,
      bevelEnabled: true,
      bevelThickness: 0.15,
      bevelSize: 0.14,
      bevelSegments: 6,
      curveSegments: 24,
    });
    geo.center();
    geo.translate(0, height / 2 + 0.02, 0);
    return geo;
  }, [length, width, height]);

  const glass = useMemo(() => {
    const L = length / 2;
    const h = height;
    const s = new THREE.Shape();
    s.moveTo(L * 0.22, 0.7);
    s.quadraticCurveTo(L * 0.08, h - 0.04, -L * 0.28, h - 0.04);
    s.quadraticCurveTo(-L * 0.58, h - 0.06, -L * 0.7, 0.8);
    s.closePath();
    const geo = new THREE.ExtrudeGeometry(s, { depth: width - 0.28, bevelEnabled: false, curveSegments: 16 });
    geo.center();
    geo.translate(0, height / 2 + 0.26, 0);
    return geo;
  }, [length, width, height]);

  const wheelR = 0.34;
  const wheelX = length * 0.31;
  const wheelZ = width / 2 - 0.08;

  return (
    <group position={spec.position} rotation={[0, spec.rotation, 0]}>
      <mesh geometry={body} castShadow>
        <meshPhysicalMaterial
          color={spec.color}
          metalness={0.6}
          roughness={0.28}
          clearcoat={1}
          clearcoatRoughness={0.08}
          envMapIntensity={1.2}
        />
      </mesh>
      <mesh geometry={glass}>
        <meshPhysicalMaterial color="#0a0c10" metalness={0.9} roughness={0.05} clearcoat={1} />
      </mesh>
      {[
        [wheelX, wheelZ],
        [wheelX, -wheelZ],
        [-wheelX, wheelZ],
        [-wheelX, -wheelZ],
      ].map(([x, z], i) => (
        <group key={i} position={[x, wheelR, z]} rotation={[Math.PI / 2, 0, 0]}>
          <mesh>
            <cylinderGeometry args={[wheelR, wheelR, 0.26, 32]} />
            <meshStandardMaterial color="#0b0b0c" roughness={0.9} />
          </mesh>
          <mesh position={[0, z > 0 ? 0.135 : -0.135, 0]}>
            <cylinderGeometry args={[wheelR * 0.62, wheelR * 0.62, 0.02, 24]} />
            <meshStandardMaterial color="#8d8f94" metalness={0.9} roughness={0.35} />
          </mesh>
        </group>
      ))}
    </group>
  );
}
