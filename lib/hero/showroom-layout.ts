/**
 * Geometría del local de Av. Raval del Carme 79 a partir del escaneo LiDAR (21/10/2026).
 * Ejes: X e Z iguales que el escaneo; Y desplazada +1,55 para que el suelo sea Y = 0.
 * Techo de la planta baja a 2,50 m. Todas las medidas en metros.
 */
export const FLOOR_Y = 0;
export const CEIL_Y = 2.5;

/** Caja de la planta baja. */
export const BOUNDS = {
  xMin: -7.4, // cristalera larga (fachada a la plaza)
  xMax: 7.3, // fondo de la sala trasera
  zMin: -4.5, // pared norte
  zMax: 5.3, // fachada lateral (calle) con la puerta principal en la esquina
};

/** Tabique entre sala principal y trasera (paneles fotográficos en el estado actual). */
export const PARTITION = { x: 1.7, thickness: 0.3, zFrom: -4.5, zTo: 1.8 };
/** Paso a la sala trasera, junto al pilar del aire: de Z 1,8 a Z 4,1. */
export const PASSAGE = { zFrom: PARTITION.zTo, zTo: 4.1 };

/** Pilares redondos (radio 0,18). */
export const PILLARS: Array<[number, number]> = [
  [-3.1, -1.2],
  [-3.1, 1.1],
  [-3.1, 3.4],
  [1.4, 0.4], // pilar con el casete de aire, al final del tabique
];

/** Mostrador curvo de recepción, junto a la cristalera (esquina noroeste). */
export const COUNTER = { x: -5.6, z: -3.0, width: 2.6, depth: 0.9 };

/** Baño y armario eléctrico en el plano del tabique: volumen cerrado al norte de la sala. */
export const SERVICE_BLOCK = { xFrom: -1.2, xTo: 1.55, zFrom: -4.5, zTo: -2.9 };

export type CarSpec = {
  id: string;
  /** color de carrocería (hex) */
  color: string;
  position: [number, number, number];
  /** giro sobre Y en radianes */
  rotation: number;
  /** longitud, anchura, altura aproximadas */
  size?: [number, number, number];
};

/** Cinco coches del stock inicial, en sus plazas: tres en la sala principal, dos en la trasera. */
export const CARS: CarSpec[] = [
  { id: "ferrari", color: "#e8c21a", position: [-5.3, 0, -1.9], rotation: Math.PI * 0.42, size: [4.5, 1.95, 1.2] },
  { id: "mclaren", color: "#0d0e11", position: [-4.6, 0, 4.0], rotation: Math.PI * 0.06, size: [4.5, 2.05, 1.2] },
  { id: "audi", color: "#2f5b3f", position: [-0.4, 0, -1.7], rotation: Math.PI * 0.08, size: [4.4, 1.85, 1.4] },
  { id: "amg", color: "#111114", position: [4.6, 0, -1.6], rotation: Math.PI * 0.5, size: [4.4, 1.85, 1.4] },
  { id: "macan", color: "#5a5d62", position: [4.6, 0, 2.6], rotation: Math.PI * 0.5, size: [4.7, 1.95, 1.6] },
];

/** Recorrido de cámara: puntos de posición y de mira, interpolados con Catmull-Rom según el scroll. */
export const CAMERA_PATH: Array<{ pos: [number, number, number]; look: [number, number, number] }> = [
  { pos: [-15.5, 2.4, 9.5], look: [-6.0, 1.1, 0.5] }, // calle, esquina de la fachada
  { pos: [-8.6, 1.7, 5.9], look: [-4.0, 1.0, 0.0] }, // llegando a la puerta
  { pos: [-5.4, 1.55, 2.0], look: [-5.3, 0.6, -1.7] }, // sala principal, hacia el Ferrari
  { pos: [-2.0, 1.5, 2.4], look: [1.5, 0.9, 2.9] }, // hacia el paso del tabique
  { pos: [1.8, 1.5, 3.2], look: [5.5, 0.8, 0.0] }, // cruzando el paso
  { pos: [3.6, 1.45, 0.4], look: [4.7, 0.6, -2.0] }, // sala trasera
];
