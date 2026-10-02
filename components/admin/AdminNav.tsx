"use client";

import { Cpu, FolderKanban, House, LayoutDashboard, LogOut, Menu, Share2, UserRound, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { cn } from "@/lib/utils";

const LINKS = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/proyectos", label: "Proyectos", icon: FolderKanban },
  { href: "/admin/tecnologias", label: "Tecnologías", icon: Cpu },
  { href: "/admin/perfil", label: "Perfil", icon: UserRound },
  { href: "/admin/redes", label: "Redes sociales", icon: Share2 },
];

export function AdminNav({
  email,
  name,
  image,
  signOut,
}: {
  email: string;
  name: string | null;
  image: string | null;
  signOut: () => Promise<void>;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [lastPath, setLastPath] = useState(pathname);
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setOpen(false);
  }

  const isActive = (href: string, exact?: boolean) => (exact ? pathname === href : pathname.startsWith(href));

  return (
    <>
      {/* Barra superior en móvil */}
      <div className="sticky top-0 z-40 flex h-14 items-center justify-between border-b border-line bg-ink/80 px-4 backdrop-blur lg:hidden">
        <Link href="/admin" className="text-display text-lg">
          Admin<span className="text-accent">.</span>
        </Link>
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="admin-sidebar"
          aria-label={open ? "Cerrar menú" : "Abrir menú"}
          className="rounded-lg p-2"
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      <aside
        id="admin-sidebar"
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-line bg-ink-2 transition-transform duration-300 lg:sticky lg:top-0 lg:h-svh lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex h-16 items-center px-6">
          <Link href="/admin" className="text-display text-xl">
            Admin<span className="text-accent">.</span>
          </Link>
        </div>

        <nav className="flex-1 px-3" aria-label="Panel">
          <ul className="flex flex-col gap-1">
            {LINKS.map(({ href, label, icon: Icon, exact }) => (
              <li key={href}>
                <Link
                  href={href}
                  aria-current={isActive(href, exact) ? "page" : undefined}
                  className={cn(
                    "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors",
                    isActive(href, exact) ? "bg-paper text-ink" : "text-paper/70 hover:bg-paper/5 hover:text-paper",
                  )}
                >
                  <Icon className="size-4" aria-hidden />
                  {label}
                </Link>
              </li>
            ))}
          </ul>
          <Link
            href="/"
            className="mt-4 flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-muted hover:text-paper"
          >
            <House className="size-4" aria-hidden />
            Home
          </Link>
        </nav>

        <div className="border-t border-line p-4">
          <div className="flex items-center gap-3">
            {image ? (
              // eslint-disable-next-line @next/next/no-img-element -- avatar de Google
              <img src={image} alt="" className="size-9 rounded-full" referrerPolicy="no-referrer" />
            ) : (
              <span className="flex size-9 items-center justify-center rounded-full bg-paper/10 text-sm">
                {(name ?? email)[0]?.toUpperCase()}
              </span>
            )}
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm">{name ?? "Administrador"}</p>
              <p className="truncate text-xs text-muted">{email}</p>
            </div>
          </div>
          <form action={signOut} className="mt-3">
            <button
              type="submit"
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-line px-3 py-2 text-sm text-paper/80 hover:bg-paper/5"
            >
              <LogOut className="size-4" aria-hidden />
              Cerrar sesión
            </button>
          </form>
        </div>
      </aside>

      {open && <div className="fixed inset-0 z-40 bg-black/60 lg:hidden" onClick={() => setOpen(false)} aria-hidden />}
    </>
  );
}
