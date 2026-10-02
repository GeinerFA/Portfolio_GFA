"use client";

import { useLenis } from "lenis/react";
import { ArrowUp } from "lucide-react";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "motion/react";
import { useState } from "react";

/** Botón flotante "Volver arriba": aparece al bajar más de una pantalla. */
export function BackToTop() {
  const lenis = useLenis();
  const { scrollY } = useScroll();
  const [visible, setVisible] = useState(false);

  useMotionValueEvent(scrollY, "change", (y) => setVisible(y > window.innerHeight));

  const toTop = () => {
    if (lenis) lenis.scrollTo(0);
    else window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          type="button"
          onClick={toTop}
          aria-label="Volver arriba"
          className="group fixed bottom-[max(1.25rem,env(safe-area-inset-bottom))] right-5 z-40 flex size-12 items-center justify-center rounded-full border border-line bg-ink/70 text-paper shadow-lg shadow-black/40 backdrop-blur-xl transition-colors hover:border-accent hover:bg-accent hover:text-ink md:bottom-8 md:right-8 md:size-14"
          initial={{ opacity: 0, scale: 0.6, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.6, y: 20 }}
          transition={{ type: "spring", stiffness: 400, damping: 28 }}
        >
          <ArrowUp className="size-5 transition-transform duration-300 group-hover:-translate-y-0.5" aria-hidden />
        </motion.button>
      )}
    </AnimatePresence>
  );
}
