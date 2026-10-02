"use client";

import { motion, useMotionValue, useReducedMotion, useSpring } from "motion/react";
import { useEffect, useState, useSyncExternalStore } from "react";

const FINE_POINTER = "(hover: hover) and (pointer: fine)";

function subscribe(cb: () => void) {
  const mq = window.matchMedia(FINE_POINTER);
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
}

/**
 * Cursor personalizado (solo dispositivos con puntero fino).
 * Cualquier elemento con `data-cursor="Texto"` hace que el cursor crezca y muestre ese texto.
 */
export function Cursor() {
  const reduce = useReducedMotion();
  const finePointer = useSyncExternalStore(
    subscribe,
    () => window.matchMedia(FINE_POINTER).matches,
    () => false,
  );
  const enabled = finePointer && !reduce;

  const [label, setLabel] = useState<string | null>(null);
  const [hidden, setHidden] = useState(true);
  const [pressed, setPressed] = useState(false);
  const [onLink, setOnLink] = useState(false);

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const springX = useSpring(x, { stiffness: 500, damping: 40, mass: 0.4 });
  const springY = useSpring(y, { stiffness: 500, damping: 40, mass: 0.4 });

  useEffect(() => {
    if (!enabled) return;
    const root = document.documentElement;
    root.classList.add("has-custom-cursor");

    const move = (e: PointerEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      setHidden(false);
    };
    const over = (e: PointerEvent) => {
      const target = e.target instanceof Element ? e.target : null;
      const labelled = target?.closest<HTMLElement>("[data-cursor]");
      setLabel(labelled?.dataset.cursor || null);
      setOnLink(Boolean(target?.closest("a, button, [role=button], input, textarea, select, label")));
    };
    const leave = () => setHidden(true);
    const down = () => setPressed(true);
    const up = () => setPressed(false);

    window.addEventListener("pointermove", move, { passive: true });
    document.addEventListener("pointerover", over, { passive: true });
    root.addEventListener("pointerleave", leave);
    window.addEventListener("pointerdown", down);
    window.addEventListener("pointerup", up);
    return () => {
      root.classList.remove("has-custom-cursor");
      window.removeEventListener("pointermove", move);
      document.removeEventListener("pointerover", over);
      root.removeEventListener("pointerleave", leave);
      window.removeEventListener("pointerdown", down);
      window.removeEventListener("pointerup", up);
    };
  }, [enabled, x, y]);

  if (!enabled) return null;

  const size = label ? 88 : onLink ? 44 : 12;

  return (
    <motion.div
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-[90] flex items-center justify-center rounded-full"
      style={{
        x: springX,
        y: springY,
        translateX: "-50%",
        translateY: "-50%",
        backgroundColor: "var(--color-paper)",
        color: "var(--color-ink)",
        mixBlendMode: label ? "normal" : "difference",
      }}
      animate={{ width: size, height: size, opacity: hidden ? 0 : 1, scale: pressed ? 0.85 : 1 }}
      transition={{ type: "spring", stiffness: 400, damping: 30 }}
    >
      {label && (
        <motion.span
          key={label}
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{ opacity: 1, scale: 1 }}
          className="font-mono text-[11px] font-medium uppercase tracking-widest"
        >
          {label}
        </motion.span>
      )}
    </motion.div>
  );
}
