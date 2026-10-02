"use client";

import { ReactLenis, useLenis } from "lenis/react";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

function ScrollToTopOnRouteChange() {
  const pathname = usePathname();
  const lenis = useLenis();
  useEffect(() => {
    lenis?.scrollTo(0, { immediate: true });
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
