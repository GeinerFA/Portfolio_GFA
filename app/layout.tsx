import type { Metadata, Viewport } from "next";
import { fontDisplay, fontMono, fontSans } from "@/lib/fonts";
import { siteUrl } from "@/lib/site";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: "Portafolio", template: "%s — Portafolio" },
  description: "Portafolio personal de proyectos.",
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
