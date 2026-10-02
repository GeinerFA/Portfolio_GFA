"use client";

import { useLenis } from "lenis/react";
import { Download, LockKeyhole, Menu, X } from "lucide-react";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "motion/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { cn, initials } from "@/lib/utils";

const NAV = [
  { href: "/#proyectos", label: "Proyectos" },
  { href: "/#tecnologias", label: "Tecnologías" },
  { href: "/#sobre-mi", label: "Sobre mí" },
  { href: "/#contacto", label: "Contacto" },
];

const ease = [0.76, 0, 0.24, 1] as const;

export function Navbar({ name, cvUrl }: { name: string; cvUrl: string | null }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const pathname = usePathname();
  const { scrollY } = useScroll();
  const lenis = useLenis();

  useMotionValueEvent(scrollY, "change", (y) => {
    const prev = scrollY.getPrevious() ?? 0;
    setScrolled(y > 24);
    setHidden(y > 400 && y > prev && !open);
  });

  // Cierra el menú al navegar
  const [lastPath, setLastPath] = useState(pathname);
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setOpen(false);
  }

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    lenis?.stop();
    window.addEventListener("keydown", onKey);
    return () => {
      lenis?.start();
      window.removeEventListener("keydown", onKey);
    };
  }, [open, lenis]);

  const logo = initials(name) || name;

  return (
    <>
      <motion.header
        className="fixed inset-x-0 top-0 z-50"
        animate={{ y: hidden ? "-100%" : "0%" }}
        transition={{ duration: 0.5, ease }}
      >
        <div
          className={cn(
            "transition-[background-color,border-color,backdrop-filter] duration-500",
            scrolled || open
              ? "border-b border-line/60 bg-ink/60 backdrop-blur-xl backdrop-saturate-150"
              : "border-b border-transparent",
          )}
        >
          <nav className="container-x flex h-16 items-center justify-between md:h-20" aria-label="Principal">
            <Link href="/" aria-label={`${name}, ir al inicio`} className="text-display relative z-[60] text-xl tracking-tight md:text-2xl">
              {logo}
              <span className="text-accent">.</span>
            </Link>

            <ul className="hidden items-center gap-6 md:flex lg:gap-8">
              {NAV.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="group relative py-1 text-sm text-paper/70 transition-colors hover:text-paper"
                  >
                    {item.label}
                    <span className="absolute inset-x-0 -bottom-0.5 h-px origin-right scale-x-0 bg-paper transition-transform duration-500 ease-out-expo group-hover:origin-left group-hover:scale-x-100" />
                  </Link>
                </li>
              ))}
            </ul>

            <div className="relative z-[60] flex items-center gap-3">
              {cvUrl && (
                <a
                  href={cvUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hidden items-center gap-2 rounded-full bg-paper px-4 py-2 text-sm font-medium text-ink transition-colors hover:bg-accent md:inline-flex"
                >
                  <Download className="size-4" aria-hidden />
                  Descargar CV
                </a>
              )}
              <Link
                href="/admin"
                prefetch={false}
                aria-label="Panel administrativo"
                title="Panel administrativo"
                className="hidden size-10 items-center justify-center rounded-full border border-line text-paper/70 transition-colors hover:border-paper/50 hover:text-paper md:inline-flex"
              >
                <LockKeyhole className="size-4" aria-hidden />
              </Link>
              <button
                type="button"
                onClick={() => setOpen((v) => !v)}
                aria-expanded={open}
                aria-controls="mobile-menu"
                aria-label={open ? "Cerrar menú" : "Abrir menú"}
                className="inline-flex size-10 items-center justify-center rounded-full border border-line md:hidden"
              >
                {open ? <X className="size-5" /> : <Menu className="size-5" />}
              </button>
            </div>
          </nav>
        </div>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            className="fixed inset-0 z-40 flex flex-col justify-between bg-ink px-4 pb-10 pt-28 md:hidden"
            initial={{ clipPath: "inset(0 0 100% 0)" }}
            animate={{ clipPath: "inset(0 0 0% 0)" }}
            exit={{ clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: 0.7, ease }}
          >
            <ul className="flex flex-col gap-2">
              {NAV.map((item, i) => (
                <li key={item.href} className="overflow-hidden">
                  <motion.div
                    initial={{ y: "100%" }}
                    animate={{ y: 0 }}
                    exit={{ y: "100%" }}
                    transition={{ duration: 0.7, delay: 0.15 + i * 0.06, ease }}
                  >
                    <Link
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className="text-display flex items-baseline gap-4 text-[clamp(2.75rem,13vw,5rem)]"
                    >
                      <span className="font-mono text-xs text-muted">0{i + 1}</span>
                      {item.label}
                    </Link>
                  </motion.div>
                </li>
              ))}
            </ul>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ delay: 0.45 }}
              className="flex gap-3"
            >
              {cvUrl && (
                <a
                  href={cvUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-paper px-6 py-4 font-medium text-ink"
                >
                  <Download className="size-4" aria-hidden />
                  Descargar CV
                </a>
              )}
              <Link
                href="/admin"
                prefetch={false}
                onClick={() => setOpen(false)}
                className={cn(
                  "inline-flex items-center justify-center gap-2 rounded-full border border-line py-4 font-medium text-paper/80",
                  cvUrl ? "px-5" : "flex-1 px-6",
                )}
              >
                <LockKeyhole className="size-4" aria-hidden />
                Panel admin
              </Link>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
