"use client";

import { ReactLenis, useLenis } from "lenis/react";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

function ScrollToTopOnRouteChange() {
  const pathname = usePathname();
  const lenis = useLenis();
  useEffect(() => {
    if (!lenis) return;
    // Si la URL trae un ancla (p. ej. "/#proyectos" desde otra página), ir a esa sección; si no, arriba.
    const hash = decodeURIComponent(window.location.hash.slice(1));
    const target = hash ? document.getElementById(hash) : null;
    if (target) {
      // Espera un frame para que el layout esté listo antes de medir la posición.
      requestAnimationFrame(() => lenis.scrollTo(target, { immediate: true }));
    } else {
      lenis.scrollTo(0, { immediate: true });
    }
  }, [pathname, lenis]);
  return null;
}

/** Smooth scroll global con Lenis (desactiva el suavizado si el usuario prefiere menos movimiento). */
export function SmoothScroll({ children }: { children: React.ReactNode }) {
  return (
    <ReactLenis root options={{ lerp: 0.1, anchors: true, respectReducedMotion: true }}>
      <ScrollToTopOnRouteChange />
      {children}
    </ReactLenis>
  );
}
