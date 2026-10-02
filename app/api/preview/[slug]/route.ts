import { getProjectBySlug } from "@/lib/data/queries";
import { siteScreenshotUrl } from "@/lib/preview";

/**
 * Captura de la home del sitio en vivo de un proyecto publicado.
 * - Recibe el slug (no una URL): solo captura sitios de proyectos publicados, no es un proxy abierto.
 * - Cachea en memoria del servidor y en la CDN (s-maxage) para no gastar el límite diario de Microlink.
 * - No usa el optimizador de next/image: su descarga se corta a los 7 s y la primera captura puede tardar más.
 */

const DAY = 24 * 60 * 60;
const memory = new Map<string, { body: ArrayBuffer; type: string; at: number }>();

export async function GET(_request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const result = await getProjectBySlug(slug);
  const liveUrl = result?.project.liveUrl;
  if (!liveUrl || !/^https?:\/\//i.test(liveUrl)) return new Response("No encontrado", { status: 404 });

  const key = `${slug}|${liveUrl}`;
  const cached = memory.get(key);
  if (cached && Date.now() - cached.at < DAY * 1000) return image(cached.body, cached.type);

  try {
    const upstream = await fetch(siteScreenshotUrl(liveUrl), {
      cache: "no-store",
      signal: AbortSignal.timeout(30_000),
    });
    const type = upstream.headers.get("content-type") ?? "";
    if (!upstream.ok || !type.startsWith("image/")) {
      return new Response("No se pudo generar la captura", { status: 502, headers: { "Cache-Control": "no-store" } });
    }
    const body = await upstream.arrayBuffer();
    memory.set(key, { body, type, at: Date.now() });
    return image(body, type);
  } catch {
    return new Response("La captura tardó demasiado", { status: 504, headers: { "Cache-Control": "no-store" } });
  }
}

function image(body: ArrayBuffer, type: string) {
  return new Response(body, {
    headers: {
      "Content-Type": type,
      "Cache-Control": `public, max-age=${DAY}, s-maxage=${DAY}, stale-while-revalidate=${7 * DAY}`,
    },
  });
}
