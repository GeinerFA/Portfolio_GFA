"use client";

import { useEffect } from "react";

const isStandalone = () =>
  window.matchMedia("(display-mode: standalone)").matches ||
  // iOS (Safari) expone la app instalada en la pantalla de inicio con esta propiedad.
  (navigator as Navigator & { standalone?: boolean }).standalone === true;

const prevent = (event: Event) => event.preventDefault();

/**
 * Bloquea el zoom solo cuando el sitio corre como app instalada (en el navegador se puede seguir haciendo zoom).
 * El bloqueo va en tres capas, porque iOS ignora `user-scalable=no` por sí solo:
 * - viewport con maximum-scale=1 (también evita el zoom automático de iOS al enfocar un input);
 * - `touch-action: pan-x pan-y` en globals.css (clase `standalone`): sin pellizco ni doble toque;
 * - los eventos `gesture*` de Safari, que son los del pellizco.
 */
export function StandaloneZoomLock() {
  useEffect(() => {
    if (!isStandalone()) return;

    const root = document.documentElement;
    root.classList.add("standalone");

    const viewport = document.querySelector<HTMLMetaElement>('meta[name="viewport"]');
    const original = viewport?.content;
    if (viewport) viewport.content = `${original}, maximum-scale=1, user-scalable=no`;

    const options = { passive: false } as const;
    for (const type of ["gesturestart", "gesturechange", "gestureend"]) document.addEventListener(type, prevent, options);

    return () => {
      root.classList.remove("standalone");
      if (viewport && original !== undefined) viewport.content = original;
      for (const type of ["gesturestart", "gesturechange", "gestureend"]) document.removeEventListener(type, prevent);
    };
  }, []);

  return null;
}
