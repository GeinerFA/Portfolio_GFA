"use client";

import { motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

/** Aparición suave al entrar en el viewport. */
export function Reveal({
  children,
  className,
  delay = 0,
  y = 40,
  onLoad = false,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  /**
   * Para contenido visible al cargar (hero): anima con CSS apenas llega el HTML,
   * en lugar de esperar a que el JavaScript hidrate la página.
   */
  onLoad?: boolean;
}) {
  const reduce = useReducedMotion();

  if (onLoad) {
    return (
      <div
        className={cn("anim-rise", className)}
        style={{ ["--delay" as string]: `${delay}s`, ["--rise-y" as string]: `${y}px` }}
      >
        {children}
      </div>
    );
  }

  return (
    <motion.div
      className={className}
      initial={reduce ? false : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10% 0px" }}
      transition={{ duration: 0.9, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}
