"use client";

import { motion, useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";

const ease = [0.76, 0, 0.24, 1] as const;

// La primera carga entra directo; la animación solo se usa al navegar entre páginas.
let hasNavigated = false;

/**
 * Transición entre páginas: una cortina sube y revela el contenido.
 * Se monta desde `template.tsx`, que se re-crea en cada navegación.
 */
export function PageTransition({ children }: { children: React.ReactNode }) {
  const reduce = useReducedMotion();
  const [animate] = useState(() => hasNavigated);

  useEffect(() => {
    hasNavigated = true;
  }, []);

  if (reduce || !animate) return <>{children}</>;

  return (
    <>
      <motion.div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-[80] bg-ink-2"
        initial={{ clipPath: "inset(0 0 0% 0)" }}
        animate={{ clipPath: "inset(0 0 100% 0)" }}
        transition={{ duration: 0.8, ease, delay: 0.05 }}
      />
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.25 }}
      >
        {children}
      </motion.div>
    </>
  );
}
