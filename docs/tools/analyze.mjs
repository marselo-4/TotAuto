import { NodeIO } from '@gltf-transform/core';
import { getBounds } from '@gltf-transform/core';
import sharp from 'sharp';

const io = new NodeIO();
const doc = await io.read(process.argv[2]);
const root = doc.getRoot();
const scene = root.listScenes()[0];
console.log('bounds', getBounds(scene));

let total = 0;
const rows = [];
root.listNodes().forEach((node, ni) => {
  const mesh = node.getMesh(); if (!mesh) return;
  const m = node.getWorldMatrix();
  mesh.listPrimitives().forEach((prim) => {
    const pos = prim.getAttribute('POSITION');
    const idx = prim.getIndices();
    const tris = idx ? idx.getCount() / 3 : pos.getCount() / 3;
    total += tris;
    const min = pos.getMin([]), max = pos.getMax([]);
    const tex = prim.getMaterial()?.getBaseColorTexture();
    rows.push({ node: ni, name: node.getName(), tris, verts: pos.getCount(), min: min.map(v=>v.toFixed(2)).join(','), max: max.map(v=>v.toFixed(2)).join(','), tex: tex ? tex.getName().slice(0,8) : '-', m: m.slice(12,15).map(v=>v.toFixed(2)).join(',') });
  });
});
console.table(rows);
console.log('total tris', total);

// Height histogram (Y) in 5cm bins
const bins = new Map();
const B = 0.05;
const samples = []; // [x,y,z]
root.listMeshes().forEach((mesh) => mesh.listPrimitives().forEach((prim) => {
  const pos = prim.getAttribute('POSITION');
  const arr = pos.getArray();
  for (let i = 0; i < arr.length; i += 3) {
    const y = arr[i+1];
    const k = Math.round(y / B);
    bins.set(k, (bins.get(k) || 0) + 1);
    samples.push(arr[i], y, arr[i+2]);
  }
}));
const keys = [...bins.keys()].sort((a,b)=>a-b);
console.log('Y histogram (5cm bins): y -> count');
const maxc = Math.max(...bins.values());
for (const k of keys) {
  const c = bins.get(k);
  if (c > maxc * 0.08) console.log((k*B).toFixed(2).padStart(6), String(c).padStart(7), '#'.repeat(Math.round(c / maxc * 60)));
}

// Density maps for Y bands
const b = getBounds(scene);
const res = 0.02; // 2 cm/px
const W = Math.ceil((b.max[0]-b.min[0]) / res), H = Math.ceil((b.max[2]-b.min[2]) / res);
async function densityMap(yMin, yMax, file) {
  const img = new Float32Array(W*H);
  for (let i = 0; i < samples.length; i += 3) {
    const y = samples[i+1]; if (y < yMin || y > yMax) continue;
    const px = Math.min(W-1, Math.floor((samples[i]-b.min[0]) / res));
    const pz = Math.min(H-1, Math.floor((samples[i+2]-b.min[2]) / res));
    img[pz*W+px] += 1;
  }
  const out = Buffer.alloc(W*H*3);
  for (let i = 0; i < W*H; i++) { const v = Math.min(255, Math.round(Math.log1p(img[i]) * 60)); out[i*3]=out[i*3+1]=out[i*3+2]=255-v; }
  // 1m grid in red
  for (let x = Math.ceil(b.min[0]); x <= b.max[0]; x++) { const px = Math.floor((x-b.min[0])/res); for (let z=0; z<H; z++) { const o=(z*W+px)*3; if (o<out.length){out[o]=220;out[o+1]=x===0?0:150;out[o+2]=x===0?0:150;} } }
  for (let z = Math.ceil(b.min[2]); z <= b.max[2]; z++) { const pz = Math.floor((z-b.min[2])/res); for (let x=0; x<W; x++) { const o=(pz*W+x)*3; if (o<out.length){out[o]=220;out[o+1]=z===0?0:150;out[o+2]=z===0?0:150;} } }
  await sharp(out, { raw: { width: W, height: H, channels: 3 } }).png().toFile(file);
  console.log('wrote', file, W, H, 'origin', b.min[0].toFixed(2), b.min[2].toFixed(2), 'res', res);
}
const bands = JSON.parse(process.argv[3] || '[]');
for (const [lo, hi, name] of bands) await densityMap(lo, hi, name);
