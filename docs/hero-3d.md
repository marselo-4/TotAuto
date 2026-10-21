# Hero 3D · "Entra en el showroom"

_Primera versión, 21/10/2026. Decisión de Carlos: reconstruir el local con geometría limpia guiada por el escaneo LiDAR, en vez de usar la malla escaneada (ver `docs/spike-3d-escaneo.md` en la rama `claude/kind-diffie-645544`)._

## Qué hace

La home empieza con una sección de 520 svh. Dentro, un canvas fijo (React Three Fiber) recorre el local real de Av. Raval del Carme 79 con una cámara ligada al scroll: calle → puerta de la esquina → sala principal → paso del tabique → sala trasera con el logo retroiluminado. Los textos de cada etapa son HTML normal (traducidos en `messages/*.json`, `home.captions`), nunca dentro del canvas.

## Archivos

| Archivo | Qué contiene |
|---|---|
| `lib/hero/showroom-layout.ts` | **Todas las medidas**: caja del local, tabique y paso, pilares, mostrador, bloque de baño, plazas de los coches y puntos del recorrido de cámara. Es el único sitio que hay que tocar para mover cosas. |
| `components/hero/showroom-hero.tsx` | Sección con `position: sticky`, ScrollTrigger (progreso 0→1), etapas de texto, detección de modo (3D alto / 3D ligero / póster) y carga diferida del canvas. |
| `components/hero/showroom-scene.tsx` | `<Canvas>`: luces, geometría, coches, cámara, postprocesado (solo escritorio), `PerformanceMonitor` que baja el DPR si cae el framerate. |
| `components/hero/showroom-geometry.tsx` | Muros, cristaleras con montantes, pilares, mostrador, líneas LED, hexágono LED de la zona de fotos, suelo reflectante (`MeshReflectorMaterial`). |
| `components/hero/car.tsx` | Coche estilizado sin marca: perfil lateral extruido con bisel, cristales y ruedas. Color por coche. |
| `components/hero/camera-rig.tsx` | Curvas Catmull-Rom de posición y mira; amortiguación exponencial. |
| `components/hero/logo-sign.tsx` | Rótulo "TOT AUTO" en la pared del fondo: rasteriza el SVG del logo a una textura nítida. |
| `public/img/hero-poster.jpg` | Render del concepto de reforma como póster (carga inicial y alternativa sin 3D). |

## Coordenadas

Las del escaneo (X, Z) con el suelo llevado a Y = 0 y el techo a 2,50 m. Cristalera larga en X = −7,4 (plaza), fachada lateral en Z = 5,3 (calle, puerta en la esquina), tabique en X = 1,7 de Z −4,5 a 1,8 y paso hasta Z 4,1, sala trasera de X 1,9 a 7,3.

## Modos

- **3D alto** (escritorio con WebGL): DPR hasta 1,5, suelo reflectante, bloom y viñeta.
- **3D ligero** (pantalla < 768 px o táctil con pocos núcleos): DPR 1, sin reflejos ni postprocesado.
- **Póster** (sin WebGL o con "reducir movimiento"): imagen estática con el texto de intro; no se carga three.js.

El canvas se carga con `next/dynamic` (`ssr: false`); el póster queda debajo mientras llega. Cuando la sección sale de pantalla, el bucle de render se para (`frameloop="never"`).

## Pendiente / ideas

- Sustituir los coches estilizados por modelos CC0 (p. ej. Kenney Car Kit) o por los coches reales fotografiados en 360° cuando existan.
- Secuencia de imágenes prerenderizada para móviles muy flojos (hoy reciben el 3D ligero).
- Medir Lighthouse móvil con el hero (objetivo ≥ 85) y ajustar `blur`/`resolution` del suelo reflectante si hace falta.
- Afinar el encuadre de la sala principal (pilar cercano) y añadir el rincón lounge y la escalera de caracol.
