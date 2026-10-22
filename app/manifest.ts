import type { MetadataRoute } from "next";
import { getSiteData } from "@/lib/data/queries";

export const revalidate = 3600;

/** Manifiesto de la PWA (instalable en el celular y en el escritorio). */
export default async function manifest(): Promise<MetadataRoute.Manifest> {
  const { profile } = await getSiteData();
  return {
    name: `${profile.fullName} — ${profile.role}`,
    short_name: "GFA",
    description: profile.headline ?? `Portafolio de ${profile.fullName}.`,
    lang: "es",
    start_url: "/",
    scope: "/",
    display: "standalone",
    orientation: "portrait",
    // Color de la pantalla de carga y de la barra del sistema (igual al fondo del sitio).
    background_color: "#0a0a0a",
    theme_color: "#0a0a0a",
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      // Con más margen: Android le aplica una máscara (círculo, squircle) sin recortar el logo.
      { src: "/icons/maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
