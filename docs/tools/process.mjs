// Limpieza + decimación del escaneo Polycam con gltf-transform (sin Blender).
// Uso: node process.mjs --in X.glb --out Y.glb [--ratio-pb 0.35] [--ratio-pa 0.16] [--error 0.003]
//      [--min-tris 150] [--strip-textures] [--only-pb]
import { NodeIO } from '@gltf-transform/core';
import { ALL_EXTENSIONS } from '@gltf-transform/extensions';
import { weld, simplifyPrimitive, prune, dedup, compactPrimitive, reorder, getBounds } from '@gltf-transform/functions';
import { MeshoptSimplifier, MeshoptEncoder } from 'meshoptimizer';

const args = Object.fromEntries(process.argv.slice(2).reduce((acc, a, i, arr) => {
  if (a.startsWith('--')) acc.push([a.slice(2), (arr[i+1] && !arr[i+1].startsWith('--')) ? arr[i+1] : true]);
  return acc; }, []));
const RATIO_PB = parseFloat(args['ratio-pb'] ?? 0.35);
const RATIO_PA = parseFloat(args['ratio-pa'] ?? 0.16);
const ERROR = parseFloat(args['error'] ?? 0.003);
const MIN_TRIS = parseInt(args['min-tris'] ?? 150);
const STRIP = !!args['strip-textures'];
const ONLY_PB = !!args['only-pb'];
// Caja del local (m). Todo lo que quede fuera se elimina (ruido/exterior).
const CROP = { min: [-8.4, -1.72, -6.5], max: [8.7, 4.0, 6.8] };
// Altura de suelo por planta (de histograma): PB -1.55, PA 1.30. Bajo el suelo = ruido.
const FLOOR_Y = { planta_baja: -1.72, planta_alta: 1.05 };

await MeshoptSimplifier.ready; await MeshoptEncoder.ready;
const io = new NodeIO().registerExtensions(ALL_EXTENSIONS);
const doc = await io.read(args.in);
const root = doc.getRoot();
const scene = root.listScenes()[0];
const logger = { stats: [] };

// 1. Clasificar nodos por planta y agruparlos bajo nodos con nombre.
const groups = { planta_baja: doc.createNode('planta_baja'), planta_alta: doc.createNode('planta_alta') };
const nodes = root.listNodes().filter((n) => n.getMesh());
let i = 0;
for (const node of nodes) {
  const prim = node.getMesh().listPrimitives()[0];
  const [, ymin] = prim.getAttribute('POSITION').getMin([]);
  const floor = ymin < 0 ? 'planta_baja' : 'planta_alta';
  node.setName(`${floor}_${String(i++).padStart(2, '0')}`);
  node.getMesh().setName(node.getName());
  scene.removeChild(node);
  groups[floor].addChild(node);
}
scene.addChild(groups.planta_baja); scene.addChild(groups.planta_alta);
if (ONLY_PB) groups.planta_alta.dispose();

// 2. Filtro de triángulos: caja, bajo-suelo y componentes pequeños (ruido flotante).
function filterPrimitive(prim, floor) {
  const pos = prim.getAttribute('POSITION').getArray();
  const idx = prim.getIndices().getArray();
  const nTri = idx.length / 3;
  const Q = 500; // 2 mm
  const key = (v) => `${Math.round(pos[v*3]*Q)},${Math.round(pos[v*3+1]*Q)},${Math.round(pos[v*3+2]*Q)}`;
  // union-find sobre vértices unificados por posición
  const vid = new Map(); const uf = [];
  const find = (a) => { while (uf[a] !== a) { uf[a] = uf[uf[a]]; a = uf[a]; } return a; };
  const union = (a, b) => { a = find(a); b = find(b); if (a !== b) uf[a] = b; };
  const vmap = new Int32Array(pos.length / 3);
  for (let v = 0; v < vmap.length; v++) { const k = key(v); let id = vid.get(k); if (id === undefined) { id = uf.length; uf.push(id); vid.set(k, id); } vmap[v] = id; }
  const keepTri = new Uint8Array(nTri);
  const yFloor = FLOOR_Y[floor];
  for (let t = 0; t < nTri; t++) {
    const a = idx[t*3], b = idx[t*3+1], c = idx[t*3+2];
    const cx = (pos[a*3]+pos[b*3]+pos[c*3])/3, cy = (pos[a*3+1]+pos[b*3+1]+pos[c*3+1])/3, cz = (pos[a*3+2]+pos[b*3+2]+pos[c*3+2])/3;
    const inside = cx > CROP.min[0] && cx < CROP.max[0] && cz > CROP.min[2] && cz < CROP.max[2] && cy > CROP.min[1] && cy < CROP.max[1] && cy > yFloor;
    if (!inside) continue;
    keepTri[t] = 1; union(vmap[a], vmap[b]); union(vmap[b], vmap[c]);
  }
  const compSize = new Map();
  for (let t = 0; t < nTri; t++) if (keepTri[t]) { const r = find(vmap[idx[t*3]]); compSize.set(r, (compSize.get(r) || 0) + 1); }
  const out = [];
  let dropped = { outside: 0, small: 0 };
  for (let t = 0; t < nTri; t++) {
    if (!keepTri[t]) { dropped.outside++; continue; }
    if (compSize.get(find(vmap[idx[t*3]])) < MIN_TRIS) { dropped.small++; continue; }
    out.push(idx[t*3], idx[t*3+1], idx[t*3+2]);
  }
  const newIdx = out.length > 65535 ? new Uint32Array(out) : new Uint16Array(out);
  prim.getIndices().setArray(newIdx);
  compactPrimitive(prim);
  return { before: nTri, after: out.length / 3, ...dropped, components: compSize.size };
}

let totals = { before: 0, afterFilter: 0, afterSimplify: 0 };
for (const floor of Object.keys(groups)) {
  if (groups[floor].isDisposed()) continue;
  for (const node of groups[floor].listChildren()) {
    for (const prim of node.getMesh().listPrimitives()) {
      if (STRIP) { prim.setAttribute('TEXCOORD_0', null); }
      const s = filterPrimitive(prim, floor);
      totals.before += s.before; totals.afterFilter += s.after;
      logger.stats.push({ node: node.getName(), ...s });
    }
  }
}
console.table(logger.stats);

// 3. Weld (necesario antes de simplify) y decimación por planta.
await doc.transform(weld());
for (const floor of Object.keys(groups)) {
  if (groups[floor].isDisposed()) continue;
  const ratio = floor === 'planta_baja' ? RATIO_PB : RATIO_PA;
  for (const node of groups[floor].listChildren()) {
    for (const prim of node.getMesh().listPrimitives()) {
      simplifyPrimitive(prim, { simplifier: MeshoptSimplifier, ratio, error: ERROR, lockBorder: false });
      totals.afterSimplify += prim.getIndices().getCount() / 3;
    }
  }
}

// 4. Variante sin texturas: un solo material oscuro, sin UVs.
if (STRIP) {
  const mat = doc.createMaterial('showroom_dark').setBaseColorFactor([0.09, 0.09, 0.1, 1]).setMetallicFactor(0).setRoughnessFactor(0.85);
  root.listMeshes().forEach((m) => m.listPrimitives().forEach((p) => p.setMaterial(mat)));
  root.listTextures().forEach((t) => t.dispose());
}

await doc.transform(dedup(), prune(), reorder({ encoder: MeshoptEncoder }));
root.getAsset().generator = 'totauto spike (gltf-transform)';
await io.write(args.out, doc);
console.log('bounds', getBounds(scene));
console.log('tris before', totals.before, '→ filtered', totals.afterFilter, '→ simplified', Math.round(totals.afterSimplify));
