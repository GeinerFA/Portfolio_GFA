# PWA: cómo está hecho en este proyecto

Este proyecto no usa ninguna librería de PWA (ni `next-pwa`, ni Serwist, ni Workbox). Todo está hecho a mano con Next.js App Router: dos manifiestos, un service worker mínimo, una página sin conexión y un script que genera los íconos.

## Arquitectura

Hay **dos apps instalables por separado** que comparten un solo service worker:

| | Sitio público | Panel admin |
|---|---|---|
| Manifiesto | `src/app/manifest.ts` → `/manifest.webmanifest` | `src/app/admin/manifest.webmanifest/route.ts` |
| `id` / `scope` / `start_url` | `/` | `/admin` |
| Fondo del ícono | negro | blanco (para distinguirlas en el inicio) |
| Barra de estado iOS | `black-translucent` | `black` (el fondo del panel es claro) |

Si el otro proyecto tiene una sola app, basta con `app/manifest.ts`.

## Piezas

### 1. Manifiesto (`src/app/manifest.ts`)

```ts
import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    id: "/",
    name: "Nombre completo",
    short_name: "Nombre corto",
    description: "...",
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#000000",
    theme_color: "#06140c",
    lang: "es",
    icons: [
      { src: "/icons/icon-192.png?v=3", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icons/icon-512.png?v=3", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icons/icon-maskable-512.png?v=3", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
```

- El `?v=3` sirve para que los navegadores dejen de usar íconos viejos guardados en caché. Subilo cada vez que cambiés los íconos.
- Para un segundo manifiesto en una subruta se usa un route handler (`app/admin/manifest.webmanifest/route.ts`):

  ```ts
  export const dynamic = "force-static";

  const manifest: MetadataRoute.Manifest = { id: "/admin", start_url: "/admin", scope: "/admin", /* ... */ };

  export function GET() {
    return Response.json(manifest, { headers: { "content-type": "application/manifest+json" } });
  }
  ```

  y en ese layout: `metadata.manifest = "/admin/manifest.webmanifest"`.

### 2. Service worker (`public/sw.js`)

```js
const CACHE = "ajw-offline-v2"; // cambiar el nombre fuerza la actualización
const OFFLINE_URL = "/offline.html";

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE)
      .then((cache) => cache.addAll([OFFLINE_URL, "/icons/icon-192.png"]))
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((key) => key !== CACHE).map((key) => caches.delete(key))))
      .then(() => self.clients.claim()),
  );
});

self.addEventListener("fetch", (event) => {
  if (event.request.mode !== "navigate") return;
  event.respondWith(fetch(event.request).catch(() => caches.match(OFFLINE_URL)));
});
```

- Solo intercepta navegaciones: usa la red y, si falla, sirve `offline.html`.
- **No guarda páginas ni datos en caché.** Es una decisión a propósito, para que el panel nunca muestre información desactualizada. Su función es hacer el sitio instalable y mostrar una pantalla cuando no hay conexión.

### 3. Página sin conexión (`public/offline.html`)

HTML estático con los estilos dentro del archivo (sin dependencias externas, porque no hay red), el logo, un mensaje en español e inglés y un botón para reintentar (`location.reload()`).

### 4. Registro (`src/components/pwa/register-service-worker.tsx`)

```tsx
"use client";

import { useEffect } from "react";

export function RegisterServiceWorker() {
  useEffect(() => {
    if (process.env.NODE_ENV !== "production" || !("serviceWorker" in navigator)) return;
    navigator.serviceWorker.register("/sw.js").catch(() => {});
  }, []);

  return null;
}
```

Se monta al final del `<body>` en cada layout raíz. Solo se registra en producción para no estorbar el hot reload.

### 5. Metadata en los layouts

```ts
export const viewport: Viewport = { themeColor: "#06140c", viewportFit: "cover" };

export const metadata: Metadata = {
  appleWebApp: { capable: true, title: "Nombre corto", statusBarStyle: "black-translucent" },
  icons: { apple: [{ url: siteTouchIcon, sizes: "180x180", type: "image/png" }] },
};
```

Con `viewportFit: "cover"` y la barra translúcida, el contenido queda debajo de la barra de estado en iOS. Por eso los headers fijos usan `paddingTop: env(safe-area-inset-top)` en lugar de `top`. Con `top`, el header bajaba sobre el contenido y tapaba los botones:

```tsx
<header className="sticky top-0 z-40" style={{ paddingTop: "env(safe-area-inset-top, 0px)" }}>
```

### 6. Generación de íconos (`scripts/pwa-icons.ts`)

Se corre con `npx tsx scripts/pwa-icons.ts`. Usa `sharp`, que ya viene con Next, y parte de `public/logo.png` para generar:

- `public/icons/{icon,admin}-192.png`, `-512.png` y `-maskable-512.png`. En el maskable el logo ocupa el 60 % del lado para que Android no lo recorte; en los demás ocupa el 82 %.
- `public/apple-touch-icon.png`, `-precomposed.png` y `-180x180.png`, que son las rutas fijas que iOS busca en la raíz.
- `src/config/touch-icons.ts`, con el ícono de iOS (180×180) incrustado como data URI en base64.

Todos los íconos salen **sin transparencia** (`removeAlpha`), porque iOS rellena el canal alfa con el color que le parece.

Lo central del script:

```ts
async function render(size: number, logoFraction: number, background: string) {
  const inner = Math.round(size * logoFraction);
  const logo = await sharp("public/logo.png").resize(inner, inner).toBuffer();
  return sharp({ create: { width: size, height: size, channels: 3, background } })
    .composite([{ input: logo, gravity: "center" }])
    .removeAlpha()
    .png({ compressionLevel: 9, palette: true, quality: 90 })
    .toBuffer();
}
```

## Arreglos para iOS (lo que más costó)

1. **El ícono queda incrustado como data URI.** A veces "Agregar a inicio" no descarga el ícono enlazado y pone una letra en su lugar. Con el ícono incrustado no depende de la red.
2. **`htmlLimitedBots: /.*/` en `next.config.ts`.** Next 15 puede enviar la metadata por streaming dentro del `<body>`, pero iOS solo lee el ícono y el nombre si están en el `<head>`. Esta opción obliga a que la metadata vaya siempre en el `<head>`.
3. **Las rutas `apple-touch-icon*.png` tienen que existir en `public/`** como respaldo.
4. **Se borró `src/app/apple-icon.png`.** Next lo usaba como ícono de iOS automáticamente y chocaba con el ícono explícito.

## Checklist para otro proyecto

1. Poner el logo cuadrado en `public/logo.png`, copiar `scripts/pwa-icons.ts` (ajustando colores y apps) y correrlo.
2. Crear `app/manifest.ts` con nombre, colores e íconos.
3. Copiar `public/sw.js` (cambiando el nombre de la caché) y `public/offline.html`.
4. Copiar `RegisterServiceWorker` y montarlo en el layout raíz.
5. En el layout: `viewport.themeColor`, `viewportFit: "cover"`, `appleWebApp` e `icons.apple` con el data URI.
6. En `next.config`: `htmlLimitedBots: /.*/`.
7. Borrar `app/apple-icon.png` si existe.
8. Si hay middleware (por ejemplo i18n o auth), confirmar que deja pasar `/sw.js`, `/offline.html`, `/icons/*` y `*.webmanifest`. Aquí funciona porque el matcher excluye las rutas con extensión.
9. Si hay CSP, `'self'` alcanza para el service worker y el manifiesto.
10. Probar con un build de producción (`next build && next start`) y Lighthouse o DevTools → Application. En iOS conviene borrar el ícono viejo antes de volver a agregarlo.
