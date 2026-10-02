/**
 * Captura automática de la home de un sitio (servicio Microlink, plan gratuito ~50 capturas/día).
 * Se sirve a través de /api/preview/[slug], que la cachea para no gastar el límite.
 * JPEG a escala 1× (~100 KB) en lugar del PNG retina por defecto (~3 MB).
 */
export function siteScreenshotUrl(siteUrl: string): string {
  const params = new URLSearchParams({
    url: siteUrl,
    screenshot: "true",
    meta: "false",
    embed: "screenshot.url",
    "viewport.width": "1440",
    "viewport.height": "900",
    "viewport.deviceScaleFactor": "1",
    "screenshot.type": "jpeg",
  });
  return `https://api.microlink.io/?${params}`;
}

/** Ruta interna que sirve la captura del sitio de un proyecto publicado. */
export const sitePreviewPath = (slug: string) => `/api/preview/${encodeURIComponent(slug)}`;

export const isSitePreview = (src: string) => src.startsWith("/api/preview/");

export function hostnameOf(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}

const normalize = (url: string) => url.trim().replace(/\/+$/, "").toLowerCase();

/** true si dos URLs apuntan a la misma página (ignora mayúsculas y la barra final). */
export function sameUrl(a: string | null | undefined, b: string | null | undefined): boolean {
  return Boolean(a && b && normalize(a) === normalize(b));
}
