import type { Metadata } from "next";

export const metadata: Metadata = {
  title: { default: "Admin", template: "%s — Admin" },
  robots: { index: false, follow: false },
};

// El panel siempre se renderiza por petición (depende de la sesión).
export const dynamic = "force-dynamic";

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return <div className="min-h-svh bg-ink">{children}</div>;
}
