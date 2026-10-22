"use client";

import type { ReactNode } from "react";
import { motion, useReducedMotion } from "motion/react";

/**
 * Transición de entrada entre páginas: una ligera subida, rápida. Sin fundido a propósito:
 * una opacidad inicial de 0 dejaría el HTML del servidor invisible hasta hidratar y retrasa el LCP.
 * Al ser un template, se vuelve a montar en cada navegación.
 */
export default function Template({ children }: { children: ReactNode }) {
  const reduce = useReducedMotion();
  if (reduce) return <>{children}</>;
  return (
    <motion.div initial={{ y: 16 }} animate={{ y: 0 }} transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}>
      {children}
    </motion.div>
  );
}
