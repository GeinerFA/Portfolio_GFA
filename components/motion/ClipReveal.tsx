"use client";

import { motion, useReducedMotion } from "motion/react";

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
  /** Si es true, se anima al entrar en el viewport; si no, al montar. */
  inView?: boolean;
}) {
  const reduce = useReducedMotion();
  const hidden = { clipPath: "inset(100% 0% 0% 0%)" };
  const shown = { clipPath: "inset(0% 0% 0% 0%)" };
  const transition = { duration: 1.3, delay, ease: [0.76, 0, 0.24, 1] as const };

  return (
    <motion.div
      className={className}
      initial={reduce ? false : hidden}
      {...(inView ? { whileInView: shown, viewport: { once: true, margin: "-10% 0px" } } : { animate: shown })}
      transition={transition}
    >
      <motion.div
        className="relative size-full"
        initial={reduce ? false : { scale: 1.25 }}
        {...(inView ? { whileInView: { scale: 1 }, viewport: { once: true } } : { animate: { scale: 1 } })}
        transition={{ ...transition, duration: 1.8 }}
      >
        {children}
      </motion.div>
    </motion.div>
  );
}
