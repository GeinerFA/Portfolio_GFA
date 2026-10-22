import type { Metadata, Viewport } from "next";
import { fontDisplay, fontMono, fontSans } from "@/lib/fonts";
import { siteUrl } from "@/lib/site";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: "Portafolio", template: "%s — Portafolio" },
  description: "Portafolio personal de proyectos.",
  applicationName: "GFA",
  // Ícono de la pantalla de inicio en iOS (iOS ignora los íconos del manifiesto). Archivo fijo en /public,
  // en la ruta estándar y sin query string; PNG opaco, porque iOS pinta de negro las transparencias.
  // Al declarar `icons`, Next deja de agregar el de app/icon.png: por eso el favicon también va aquí.
  icons: {
    icon: [{ url: "/icon.png", sizes: "512x512", type: "image/png" }],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
  // Al instalarla en iOS ("Agregar a pantalla de inicio") abre a pantalla completa, como app.
  appleWebApp: { capable: true, title: "GFA", statusBarStyle: "black-translucent" },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  themeColor: "#0a0a0a",
  colorScheme: "dark",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="es"
      className={`${fontDisplay.variable} ${fontSans.variable} ${fontMono.variable}`}
      suppressHydrationWarning
    >
      <body>{children}</body>
    </html>
  );
}
