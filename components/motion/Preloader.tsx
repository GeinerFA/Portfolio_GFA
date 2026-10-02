"use client";

import { useLenis } from "lenis/react";
import { AnimatePresence, animate, motion, useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";

const SESSION_KEY = "preloader-seen";

/** Contador 0–100 que se abre como cortina. Solo se muestra en la primera carga de la sesión. */
export function Preloader({ label }: { label: string }) {
  const reduce = useReducedMotion();
  const lenis = useLenis();
  const [visible, setVisible] = useState(true);
  const [count, setCount] = useState(0);

  useEffect(() => {
    let seen = false;
    try {
      seen = sessionStorage.getItem(SESSION_KEY) === "1";
    } catch {}
    if (seen || reduce) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- depende de sessionStorage (solo cliente)
      setVisible(false);
      return;
    }
    let timeout: ReturnType<typeof setTimeout> | undefined;
    const controls = animate(0, 100, {
      duration: 1.8,
      ease: [0.65, 0, 0.35, 1],
      onUpdate: (v) => setCount(Math.round(v)),
      onComplete: () => {
        try {
          sessionStorage.setItem(SESSION_KEY, "1");
        } catch {}
        timeout = setTimeout(() => setVisible(false), 250);
      },
    });
    return () => {
      controls.stop();
      clearTimeout(timeout);
    };
  }, [reduce]);

  useEffect(() => {
    if (!lenis) return;
    if (visible) lenis.stop();
    else lenis.start();
  }, [visible, lenis]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="preloader"
          aria-hidden
          className="fixed inset-0 z-[100] flex flex-col justify-between bg-paper p-6 text-ink md:p-10"
          initial={{ clipPath: "inset(0 0 0% 0)" }}
          exit={{ clipPath: "inset(0 0 100% 0)" }}
          transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }}
        >
          <span className="font-mono text-xs uppercase tracking-[0.3em]">{label}</span>
          <div className="flex items-end justify-between gap-6">
            <div className="mb-[2vw] h-px flex-1 bg-ink/15">
              <div className="h-px bg-ink" style={{ width: `${count}%` }} />
            </div>
            <motion.span
              className="text-display tabular-nums text-[clamp(5rem,22vw,18rem)] leading-[0.8]"
              exit={{ y: "-30%", opacity: 0 }}
              transition={{ duration: 0.6, ease: [0.76, 0, 0.24, 1] }}
            >
              {count}
            </motion.span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
