import { NodeIO } from '@gltf-transform/core';
const io = new NodeIO(); const doc = await io.read(process.argv[2]);
const hz = new Map();
doc.getRoot().listMeshes().forEach(m => m.listPrimitives().forEach(p => { const a = p.getAttribute('POSITION').getArray();
  for (let i=0;i<a.length;i+=3){ const x=a[i],y=a[i+1],z=a[i+2];
    if (y>-1.2 && y<0.6 && x>1.5 && x<1.95) { const k=Math.round(z/0.1); hz.set(k,(hz.get(k)||0)+1); }
  }}));
console.log('Z histogram of wall band X 1.5..1.95 (10cm):');
[...hz.keys()].sort((a,b)=>a-b).forEach(k=>{const c=hz.get(k); console.log((k*0.1).toFixed(1).padStart(6), String(c).padStart(6), '#'.repeat(Math.min(80,Math.round(c/20))));});
