import { NodeIO } from '@gltf-transform/core';
import { ALL_EXTENSIONS } from '@gltf-transform/extensions';
import draco3d from 'draco3dgltf';
import fs from 'node:fs';
const io = new NodeIO().registerExtensions(ALL_EXTENSIONS).registerDependencies({ 'draco3d.decoder': await draco3d.createDecoderModule() });
for (const f of process.argv.slice(2)) {
  const doc = await io.read(f); const root = doc.getRoot();
  const per = {};
  for (const g of root.listScenes()[0].listChildren()) { let t = 0; g.listChildren().forEach(n => n.getMesh().listPrimitives().forEach(p => t += p.getIndices().getCount()/3)); per[g.getName()] = Math.round(t); }
  const tex = root.listTextures().map(t => `${t.getSize()?.join('x')} ${t.getMimeType()} ${(t.getImage().byteLength/1024).toFixed(0)}KB`);
  const texBytes = root.listTextures().reduce((a, t) => a + t.getImage().byteLength, 0);
  console.log(f.split('/').pop(), (fs.statSync(f).size/1e6).toFixed(2)+' MB', per, 'total', Object.values(per).reduce((a,b)=>a+b,0), 'textures', tex.length, tex[0] || '-', 'texBytes', (texBytes/1e6).toFixed(2)+' MB');
}
