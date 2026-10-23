"use client";

import { EffectComposer, Bloom, Vignette } from "@react-three/postprocessing";

/**
 * Postprocesado del hero (bloom de las líneas LED y viñeta). Vive en su propio chunk y se
 * monta un segundo después de la escena para repartir el trabajo del hilo principal.
 */
export function ShowroomEffects() {
  return (
    <EffectComposer multisampling={4}>
      <Bloom intensity={0.55} luminanceThreshold={1.1} luminanceSmoothing={0.3} mipmapBlur />
      <Vignette eskil={false} offset={0.25} darkness={0.75} />
    </EffectComposer>
  );
}
