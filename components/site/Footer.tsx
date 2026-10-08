import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { Profile, SocialLink } from "@/lib/data/types";
import { SOCIAL_META } from "./SocialIcon";

const NAV = [
  { href: "/#proyectos", label: "Proyectos" },
  { href: "/#servicios", label: "Servicios" },
  { href: "/#tecnologias", label: "Tecnologías" },
  { href: "/#sobre-mi", label: "Sobre mí" },
  { href: "/#trayectoria", label: "Trayectoria" },
  { href: "/#contacto", label: "Contacto" },
];

const linkClass = "group inline-flex items-center gap-1.5 text-paper/80 transition-colors hover:text-paper";

export function Footer({ profile, socials }: { profile: Profile; socials: SocialLink[] }) {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-line">
      <div className="container-x grid grid-cols-2 gap-x-6 gap-y-12 py-14 md:grid-cols-12 md:py-20">
        <div className="col-span-2 flex flex-col gap-5 md:col-span-5">
          <Link href="/" aria-label={`${profile.fullName}, ir al inicio`} className="w-fit transition-opacity hover:opacity-80">
            <Image src="/logo.png" alt="" width={427} height={160} className="h-10 w-auto md:h-12" />
          </Link>
          <p className="max-w-xs text-sm leading-relaxed text-muted">
            {profile.role}
            {profile.location ? ` · ${profile.location}` : ""}
          </p>
          {profile.isAvailable && (
            <span className="inline-flex w-fit items-center gap-2 text-sm text-paper/80">
              <span className="size-2 rounded-full bg-accent" aria-hidden />
              Disponible para proyectos
            </span>
          )}
        </div>

        <nav aria-label="Pie de página" className="md:col-span-2">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted">Navegación</p>
          <ul className="mt-5 flex flex-col gap-3 text-sm">
            {NAV.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className={linkClass}>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {socials.length > 0 && (
          <div className="md:col-span-2">
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted">Redes</p>
            <ul className="mt-5 flex flex-col gap-3 text-sm">
              {socials.map((s) => (
                <li key={s.id}>
                  <a href={s.url} target="_blank" rel="noopener noreferrer" className={linkClass}>
                    {s.label || SOCIAL_META[s.platform].label}
                    <ArrowUpRight
                      className="size-3.5 opacity-0 transition-[opacity,transform] duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:opacity-100"
                      aria-hidden
                    />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}

        {profile.email && (
          <div className="col-span-2 md:col-span-3 md:text-right">
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted">Contacto</p>
            <a href={`mailto:${profile.email}`} className={`${linkClass} mt-5 text-sm`}>
              {profile.email}
            </a>
          </div>
        )}
      </div>

      <div className="border-t border-line">
        <div className="container-x py-6 pr-20 text-sm text-muted">
          <p>
            © {year} {profile.fullName}. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
