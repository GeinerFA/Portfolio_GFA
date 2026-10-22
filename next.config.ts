import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Solo afecta a `npm run dev`: permite abrir el servidor de desarrollo desde la IP de la red local
  // (p. ej. para probar en el celular). Por defecto Next solo permite localhost.
  allowedDevOrigins: ["10.157.22.21"],
  // Next puede enviar la metadata por streaming dentro del <body>, pero iOS solo lee el ícono y el nombre
  // de la app si están en el <head>. Así la metadata va siempre en el <head> (para cualquier navegador).
  htmlLimitedBots: /.*/,
  images: {
    // Las imágenes se suben a Cloudinary (res.cloudinary.com) o se pegan por URL desde el admin,
    // por eso se permite cualquier host HTTPS.
    remotePatterns: [{ protocol: "https", hostname: "**" }],
    // Las imágenes optimizadas (Cloudinary con URL versionada) no cambian: se guardan 30 días.
    minimumCacheTTL: 60 * 60 * 24 * 30,
  },
  async headers() {
    return [
      {
        // El service worker siempre se revisa en la red, para que las actualizaciones lleguen enseguida.
        source: "/sw.js",
        headers: [
          { key: "Content-Type", value: "application/javascript; charset=utf-8" },
          { key: "Cache-Control", value: "no-cache, no-store, must-revalidate" },
        ],
      },
    ];
  },
};

export default nextConfig;
