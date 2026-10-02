"use client";

import { motion, useReducedMotion } from "motion/react";

/** Anima un texto letra por letra (el lector de pantalla lee el texto completo). */
export function SplitText({
  text,
  className,
  delay = 0,
  stagger = 0.035,
}: {
  text: string;
  className?: string;
  delay?: number;
  stagger?: number;
}) {
  const reduce = useReducedMotion();
  const words = text.split(" ").map((word, wi, all) => {
    const offset = all.slice(0, wi).reduce((n, w) => n + w.length, 0);
    return { word, offset };
  });

  return (
    <span className={className}>
      <span className="sr-only">{text}</span>
      <span aria-hidden>
        {words.map(({ word, offset }, wi) => (
          <span key={wi} className="inline-block whitespace-nowrap">
            {Array.from(word).map((char, ci) => (
              <span key={ci} className="inline-block overflow-hidden pb-[0.08em] align-bottom">
                <motion.span
                  className="inline-block"
                  initial={reduce ? false : { y: "110%" }}
                  animate={{ y: 0 }}
                  transition={{ duration: 0.9, delay: delay + (offset + ci) * stagger, ease: [0.16, 1, 0.3, 1] }}
                >
                  {char}
                </motion.span>
              </span>
            ))}
            {wi < words.length - 1 && <span className="inline-block">&nbsp;</span>}
          </span>
        ))}
      </span>
    </span>
  );
}
