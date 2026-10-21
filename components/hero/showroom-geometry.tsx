"use client";

import { MeshReflectorMaterial } from "@react-three/drei";
import { LogoSign } from "./logo-sign";
import {
  BOUNDS,
  CEIL_Y,
  COUNTER,
  PARTITION,
  PASSAGE,
  PILLARS,
  SERVICE_BLOCK,
} from "@/lib/hero/showroom-layout";

const W = BOUNDS.xMax - BOUNDS.xMin;
const D = BOUNDS.zMax - BOUNDS.zMin;
const CX = (BOUNDS.xMax + BOUNDS.xMin) / 2;
const CZ = (BOUNDS.zMax + BOUNDS.zMin) / 2;

const WALL = { color: "#15161a", roughness: 0.95 } as const;
const DARK = { color: "#0c0c0e", roughness: 0.9 } as const;

function Wall({
  position,
  size,
}: {
  position: [number, number, number];
  size: [number, number, number];
}) {
  return (
    <mesh position={position} receiveShadow>
      <boxGeometry args={size} />
      <meshStandardMaterial {...WALL} />
    </mesh>
  );
}

/** Cristalera: paneles de vidrio con montantes finos de bronce oscuro. */
function Glazing({
  axis,
  at,
  from,
  to,
  panels,
}: {
  axis: "x" | "z";
  at: number;
  from: number;
  to: number;
  panels: number;
}) {
  const len = to - from;
  const step = len / panels;
  const h = CEIL_Y;
  return (
    <group>
      {/* vidrio continuo */}
      <mesh
        position={axis === "x" ? [at, h / 2, from + len / 2] : [from + len / 2, h / 2, at]}
        rotation={axis === "x" ? [0, Math.PI / 2, 0] : [0, 0, 0]}
      >
        <planeGeometry args={[len, h]} />
        <meshPhysicalMaterial
          color="#9fb4c8"
          transparent
          opacity={0.12}
          roughness={0.05}
          metalness={0.2}
          side={2}
          depthWrite={false}
        />
      </mesh>
      {/* montantes */}
      {Array.from({ length: panels + 1 }, (_, i) => {
        const p = from + i * step;
        return (
          <mesh key={i} position={axis === "x" ? [at, h / 2, p] : [p, h / 2, at]}>
            <boxGeometry args={[0.06, h, 0.06]} />
            <meshStandardMaterial color="#3a2f24" metalness={0.6} roughness={0.5} />
          </mesh>
        );
      })}
      {/* travesaño superior e inferior */}
      {[0.03, h - 0.03].map((y) => (
        <mesh key={y} position={axis === "x" ? [at, y, from + len / 2] : [from + len / 2, y, at]}>
          <boxGeometry args={axis === "x" ? [0.06, 0.06, len] : [len, 0.06, 0.06]} />
          <meshStandardMaterial color="#3a2f24" metalness={0.6} roughness={0.5} />
        </mesh>
      ))}
    </group>
  );
}

/** Línea LED empotrada en el techo (emisiva; el bloom la hace brillar en escritorio). */
function LedLine({ from, to, y = CEIL_Y - 0.02 }: { from: [number, number]; to: [number, number]; y?: number }) {
  const dx = to[0] - from[0];
  const dz = to[1] - from[1];
  const len = Math.hypot(dx, dz);
  const angle = Math.atan2(dx, dz);
  return (
    <mesh position={[from[0] + dx / 2, y, from[1] + dz / 2]} rotation={[0, angle, 0]}>
      <boxGeometry args={[0.04, 0.02, len]} />
      <meshStandardMaterial color="#fff3df" emissive="#ffe9c4" emissiveIntensity={6} toneMapped={false} />
    </mesh>
  );
}

export function ShowroomGeometry({ reflections = true }: { reflections?: boolean }) {
  const T = 0.3; // grosor de muros
  const partitionLen = PARTITION.zTo - PARTITION.zFrom;
  const passageEndWallLen = BOUNDS.zMax - PASSAGE.zTo;

  return (
    <group>
      {/* Suelo: terrazo pulido → reflectante */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[CX, 0, CZ]} receiveShadow>
        <planeGeometry args={[W + 8, D + 8]} />
        {reflections ? (
          <MeshReflectorMaterial
            color="#141416"
            roughness={0.55}
            metalness={0.1}
            mirror={0.45}
            blur={[400, 120]}
            mixBlur={1}
            mixStrength={1.4}
            resolution={1024}
            depthScale={0.8}
            minDepthThreshold={0.85}
            maxDepthThreshold={1.2}
          />
        ) : (
          <meshStandardMaterial color="#141416" roughness={0.5} metalness={0.1} />
        )}
      </mesh>

      {/* Techo */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[CX, CEIL_Y, CZ]}>
        <planeGeometry args={[W + 1, D + 1]} />
        <meshStandardMaterial {...DARK} />
      </mesh>

      {/* Pared norte (Z mín), completa */}
      <Wall position={[CX, CEIL_Y / 2, BOUNDS.zMin - T / 2]} size={[W + T * 2, CEIL_Y, T]} />
      {/* Fondo de la sala trasera (X máx) */}
      <Wall position={[BOUNDS.xMax + T / 2, CEIL_Y / 2, CZ]} size={[T, CEIL_Y, D + T * 2]} />
      {/* Fachada lateral (Z máx): tramo macizo en la sala trasera, cristal plegable al final */}
      <Wall position={[(PARTITION.x + BOUNDS.xMax) / 2 + 0.6, CEIL_Y / 2, BOUNDS.zMax + T / 2]} size={[BOUNDS.xMax - PARTITION.x - 1.2, CEIL_Y, T]} />
      {/* Fachada lateral de la sala principal: cristal con la puerta en la esquina */}
      <Glazing axis="z" at={BOUNDS.zMax} from={BOUNDS.xMin} to={PARTITION.x} panels={5} />
      {/* Fachada larga a la plaza (X mín): cristalera */}
      <Glazing axis="x" at={BOUNDS.xMin} from={BOUNDS.zMin} to={BOUNDS.zMax} panels={6} />
      {/* Dintel/banda superior de fachada (opaca) por fuera, para enmarcar */}
      <Wall position={[BOUNDS.xMin - 0.25, CEIL_Y + 0.45, CZ]} size={[0.5, 0.9, D + 1]} />
      <Wall position={[CX - 0.25, CEIL_Y + 0.45, BOUNDS.zMax + 0.25]} size={[W + 1, 0.9, 0.5]} />

      {/* Tabique sala principal / trasera, hasta el paso */}
      <Wall position={[PARTITION.x, CEIL_Y / 2, PARTITION.zFrom + partitionLen / 2]} size={[PARTITION.thickness, CEIL_Y, partitionLen]} />
      {/* Tramo de tabique después del paso hasta la fachada */}
      <Wall position={[PARTITION.x, CEIL_Y / 2, PASSAGE.zTo + passageEndWallLen / 2]} size={[PARTITION.thickness, CEIL_Y, passageEndWallLen]} />
      {/* Dintel sobre el paso */}
      <Wall position={[PARTITION.x, CEIL_Y - 0.2, (PASSAGE.zFrom + PASSAGE.zTo) / 2]} size={[PARTITION.thickness, 0.4, PASSAGE.zTo - PASSAGE.zFrom]} />

      {/* Bloque de baño + armario eléctrico */}
      <Wall
        position={[(SERVICE_BLOCK.xFrom + SERVICE_BLOCK.xTo) / 2, CEIL_Y / 2, (SERVICE_BLOCK.zFrom + SERVICE_BLOCK.zTo) / 2]}
        size={[SERVICE_BLOCK.xTo - SERVICE_BLOCK.xFrom, CEIL_Y, SERVICE_BLOCK.zTo - SERVICE_BLOCK.zFrom]}
      />

      {/* Pilares redondos, en negro mate */}
      {PILLARS.map(([x, z], i) => (
        <mesh key={i} position={[x, CEIL_Y / 2, z]} castShadow>
          <cylinderGeometry args={[0.18, 0.18, CEIL_Y, 24]} />
          <meshStandardMaterial color="#0a0a0b" roughness={0.6} metalness={0.2} />
        </mesh>
      ))}

      {/* Mostrador de recepción */}
      <mesh position={[COUNTER.x, 0.55, COUNTER.z]} rotation={[0, 0.35, 0]}>
        <boxGeometry args={[COUNTER.width, 1.1, COUNTER.depth]} />
        <meshStandardMaterial color="#1c1a18" roughness={0.4} metalness={0.3} />
      </mesh>
      <mesh position={[COUNTER.x, 1.105, COUNTER.z]} rotation={[0, 0.35, 0]}>
        <boxGeometry args={[COUNTER.width + 0.1, 0.03, COUNTER.depth + 0.1]} />
        <meshStandardMaterial color="#c9a96e" roughness={0.3} metalness={0.8} />
      </mesh>

      {/* Logo retroiluminado en la pared del fondo de la sala trasera (zona de fotos) */}
      <LogoSign position={[BOUNDS.xMax - 0.02, 1.6, -1.2]} rotation={[0, -Math.PI / 2, 0]} width={2.8} />

      {/* Líneas LED en el techo: tres longitudinales en la sala principal, dos en la trasera */}
      <LedLine from={[-6.8, -3.9]} to={[-6.8, 4.7]} />
      <LedLine from={[-3.1, -3.9]} to={[-3.1, 4.7]} />
      <LedLine from={[0.6, -2.4]} to={[0.6, 4.7]} />
      <LedLine from={[3.2, -3.9]} to={[3.2, 4.7]} />
      <LedLine from={[6.0, -3.9]} to={[6.0, 4.7]} />
      {/* Hexágono LED sobre la zona de fotos */}
      {Array.from({ length: 6 }, (_, i) => {
        const r = 1.3;
        const a0 = (i / 6) * Math.PI * 2;
        const a1 = ((i + 1) / 6) * Math.PI * 2;
        return (
          <LedLine
            key={i}
            from={[4.6 + Math.cos(a0) * r, -1.6 + Math.sin(a0) * r]}
            to={[4.6 + Math.cos(a1) * r, -1.6 + Math.sin(a1) * r]}
          />
        );
      })}
    </group>
  );
}
