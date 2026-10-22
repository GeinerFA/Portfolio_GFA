"use client";

import { useEffect } from "react";

const GESTURES = ["gesturestart", "gesturechange", "gestureend"];
const prevent = (event: Event) => event.preventDefault();

/**
 * Sin zoom en todo el sitio (navegador y app instalada). iOS ignora `user-scalable=no` por sí solo,
 * así que el bloqueo va en capas:
 * - viewport con maximum-scale=1 y user-scalable=no (app/layout.tsx): también evita el zoom de iOS al enfocar un campo;
 * - campos de texto de al menos 16 px en móvil: con menos, iOS hace zoom al enfocarlos;
 * - `touch-action: pan-x pan-y` en globals.css: sin pellizco ni doble toque;
 * - aquí, los eventos `gesture*` de Safari, que son los del pellizco.
 */
export function ZoomLock() {
  useEffect(() => {
    for (const type of GESTURES) document.addEventListener(type, prevent, { passive: false });
    return () => {
      for (const type of GESTURES) document.removeEventListener(type, prevent);
    };
  }, []);

  return null;
}
