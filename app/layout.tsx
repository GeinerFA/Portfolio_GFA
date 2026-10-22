import type { Metadata, Viewport } from "next";
import { fontDisplay, fontMono, fontSans } from "@/lib/fonts";
import { siteUrl } from "@/lib/site";
import { touchIcon } from "@/lib/touch-icon";
import { ServiceWorker } from "@/components/site/ServiceWorker";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: "Portafolio", template: "%s — Portafolio" },
  description: "Portafolio personal de proyectos.",
  applicationName: "GFA",
  // Ícono de iOS (iOS ignora los del manifiesto) incrustado como data URI: "Agregar a inicio" a veces no
  // descarga el ícono enlazado y pone una letra. Respaldo: /apple-touch-icon*.png en /public.
  // Se generan con `npm run pwa:icons`. Al declarar `icons`, Next deja de agregar app/icon.png: va aquí también.
  icons: {
    icon: [{ url: "/icon.png", sizes: "512x512", type: "image/png" }],
    apple: [{ url: touchIcon, sizes: "180x180", type: "image/png" }],
  },
  // Al instalarla en iOS ("Agregar a pantalla de inicio") abre a pantalla completa, como app.
  appleWebApp: { capable: true, title: "GFA", statusBarStyle: "black-translucent" },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  themeColor: "#0a0a0a",
  colorScheme: "dark",
  // Con la barra de estado translúcida de iOS el contenido queda debajo de ella:
  // los elementos fijos arriba usan padding con env(safe-area-inset-top).
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="es"
      className={`${fontDisplay.variable} ${fontSans.variable} ${fontMono.variable}`}
      suppressHydrationWarning
    >
      <body>
        {children}
        <ServiceWorker />
      </body>
    </html>
  );
}
