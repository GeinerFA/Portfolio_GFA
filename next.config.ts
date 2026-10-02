import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Solo afecta a `npm run dev`: permite abrir el servidor de desarrollo desde la IP de la red local
  // (p. ej. para probar en el celular). Por defecto Next solo permite localhost.
  allowedDevOrigins: ["10.157.22.21"],
  images: {
    // Las imágenes se suben a Cloudinary (res.cloudinary.com) o se pegan por URL desde el admin,
    // por eso se permite cualquier host HTTPS.
    remotePatterns: [{ protocol: "https", hostname: "**" }],
  },
};

export default nextConfig;
