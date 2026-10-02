import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Las imágenes se cargan por URL desde el admin; se permite cualquier host HTTPS.
    // Al migrar a Vercel Blob se puede restringir a "*.public.blob.vercel-storage.com".
    remotePatterns: [{ protocol: "https", hostname: "**" }],
  },
};

export default nextConfig;
