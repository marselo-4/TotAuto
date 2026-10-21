import { NodeIO } from '@gltf-transform/core';
const io = new NodeIO(); const doc = await io.read(process.argv[2]);
// Partition at X≈1.4 ground floor: histogram of Z for verts with X in [1.2,1.6], Y in [-1.2,0.6]
const hz = new Map(); const hx = new Map();
doc.getRoot().listMeshes().forEach(m => m.listPrimitives().forEach(p => { const a = p.getAttribute('POSITION').getArray();
  for (let i=0;i<a.length;i+=3){ const x=a[i],y=a[i+1],z=a[i+2];
    if (y>-1.2 && y<0.6 && x>1.2 && x<1.6) { const k=Math.round(z/0.1); hz.set(k,(hz.get(k)||0)+1); }
    if (y>-1.2 && y<0.6 && z>-3 && z<0) { const k=Math.round(x/0.05); hx.set(k,(hx.get(k)||0)+1); }
  }}));
console.log('Z histogram of partition band X 1.2..1.6 (10cm):');
[...hz.keys()].sort((a,b)=>a-b).forEach(k=>{const c=hz.get(k); if(c>40) console.log((k*0.1).toFixed(1).padStart(6), String(c).padStart(6), '#'.repeat(Math.min(80,Math.round(c/20))));});
console.log('X histogram of walls band Z -3..0 (5cm):');
const mx=Math.max(...hx.values());
[...hx.keys()].sort((a,b)=>a-b).forEach(k=>{const c=hx.get(k); if(c>mx*0.1) console.log((k*0.05).toFixed(2).padStart(6), String(c).padStart(6), '#'.repeat(Math.round(c/mx*60)));});
