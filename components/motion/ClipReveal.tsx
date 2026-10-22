"use client";

import { motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

/** Revela su contenido con una animación de clip-path (de abajo hacia arriba) y un leve zoom-out. */
export function ClipReveal({
  children,
  className,
  delay = 0,
  inView = false,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  /** Si es true, se anima al entrar en el viewport; si no, al cargar (con CSS, sin esperar al JavaScript). */
  inView?: boolean;
}) {
  const reduce = useReducedMotion();

  if (!inView) {
    const style = { ["--delay" as string]: `${delay}s` };
    return (
      <div className={cn("anim-clip", className)} style={style}>
        <div className="anim-zoom relative size-full" style={style}>
          {children}
        </div>
      </div>
    );
  }

  const transition = { duration: 1.3, delay, ease: [0.76, 0, 0.24, 1] as const };
  return (
    <motion.div
      className={className}
      initial={reduce ? false : { clipPath: "inset(100% 0% 0% 0%)" }}
      whileInView={{ clipPath: "inset(0% 0% 0% 0%)" }}
      viewport={{ once: true, margin: "-10% 0px" }}
      transition={transition}
    >
      <motion.div
        className="relative size-full"
        initial={reduce ? false : { scale: 1.25 }}
        whileInView={{ scale: 1 }}
        viewport={{ once: true }}
        transition={{ ...transition, duration: 1.8 }}
      >
        {children}
      </motion.div>
    </motion.div>
  );
}
