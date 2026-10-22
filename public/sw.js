/**
 * Service worker de la PWA.
 * - JS/CSS/fuentes de Next (/_next/static, con hash): primero caché, nunca cambian.
 * - Imágenes (optimizadas, capturas e íconos): se sirven desde caché y se actualizan en segundo plano.
 * - Páginas: primero la red (para ver siempre lo último del admin); si tarda o no hay conexión, la caché.
 * - Sin conexión y sin copia guardada: muestra /offline.html.
 * - El admin, la autenticación y las Server Actions nunca pasan por la caché.
 * Al cambiar la estrategia, sube VERSION para descartar las cachés anteriores.
 */
const VERSION = "v2";
const OFFLINE_URL = "/offline.html";
const STATIC_CACHE = `static-${VERSION}`;
const IMAGE_CACHE = `images-${VERSION}`;
const PAGE_CACHE = `pages-${VERSION}`;
const NETWORK_TIMEOUT_MS = 3500;
const MAX_IMAGES = 80;

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(PAGE_CACHE)
      .then((cache) => cache.addAll([OFFLINE_URL, "/icons/icon-192.png"]).then(() => cache.add("/").catch(() => undefined)))
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener("activate", (event) => {
  const keep = [STATIC_CACHE, IMAGE_CACHE, PAGE_CACHE];
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => !keep.includes(k)).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  );
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;
  if (url.pathname.startsWith("/admin") || url.pathname.startsWith("/api/auth")) return;
  // Peticiones RSC de la navegación interna de Next: dependen de cabeceras, no se cachean.
  if (request.headers.get("RSC") || url.searchParams.has("_rsc")) return;

  if (url.pathname.startsWith("/_next/static/")) {
    event.respondWith(cacheFirst(request, STATIC_CACHE));
  } else if (
    request.destination === "image" ||
    url.pathname.startsWith("/_next/image") ||
    url.pathname.startsWith("/api/preview/") ||
    url.pathname.startsWith("/icons/")
  ) {
    event.respondWith(staleWhileRevalidate(event, request, IMAGE_CACHE));
  } else if (request.mode === "navigate") {
    event.respondWith(networkFirst(request));
  }
});

async function cacheFirst(request, cacheName) {
  const cached = await caches.match(request);
  if (cached) return cached;
  const response = await fetch(request);
  if (response.ok) {
    const cache = await caches.open(cacheName);
    cache.put(request, response.clone());
  }
  return response;
}

async function staleWhileRevalidate(event, request, cacheName) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);
  const update = fetch(request)
    .then(async (response) => {
      if (response.ok) {
        await cache.put(request, response.clone());
        await trim(cache, MAX_IMAGES);
      }
      return response;
    })
    .catch(() => cached);
  event.waitUntil(update.then(() => undefined));
  return cached || update;
}

async function networkFirst(request) {
  const cache = await caches.open(PAGE_CACHE);
  const network = fetch(request).then((response) => {
    if (response.ok) cache.put(request, response.clone());
    return response;
  });
  // Si la red tarda demasiado (conexión lenta), muestra la versión guardada mientras tanto.
  const timeout = new Promise((resolve) =>
    setTimeout(() => cache.match(request).then((hit) => hit && resolve(hit)), NETWORK_TIMEOUT_MS),
  );
  try {
    return await Promise.race([network, timeout]);
  } catch {
    return (await cache.match(request)) || (await cache.match(OFFLINE_URL)) || Response.error();
  }
}

async function trim(cache, max) {
  const keys = await cache.keys();
  for (let i = 0; i < keys.length - max; i++) await cache.delete(keys[i]);
}
