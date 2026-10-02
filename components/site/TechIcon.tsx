import { createElement } from "react";
import * as Si from "react-icons/si";
import type { IconType } from "react-icons";
import { cn } from "@/lib/utils";

// Índice en minúsculas: permite guardar "SiReact", "sireact" o simplemente "react".
const index = new Map<string, IconType>(
  Object.entries(Si as Record<string, IconType>).map(([name, Icon]) => [name.toLowerCase(), Icon]),
);

export function resolveTechIcon(icon: string | null | undefined): IconType | null {
  if (!icon) return null;
  const key = icon.trim().toLowerCase().replace(/[\s.-]/g, "");
  return index.get(key) ?? index.get(`si${key}`) ?? null;
}

const isUrl = (v: string) => /^(https?:)?\/\//.test(v) || v.startsWith("/");

/**
 * Ícono de una tecnología (Server Component).
 * `icon` puede ser un nombre de Simple Icons (react-icons/si) o la URL de una imagen.
 * Si no hay ícono, muestra un badge con las iniciales del nombre.
 */
export function TechIcon({
  name,
  icon,
  className,
}: {
  name: string;
  icon: string | null | undefined;
  className?: string;
}) {
  const Icon = resolveTechIcon(icon);
  // Búsqueda en un índice estático (no crea componentes nuevos).
  if (Icon) return createElement(Icon, { className: cn("size-5 shrink-0", className), "aria-hidden": true });

  if (icon && isUrl(icon)) {
    // eslint-disable-next-line @next/next/no-img-element -- íconos pequeños de cualquier origen
    return <img src={icon} alt="" className={cn("size-5 shrink-0 object-contain", className)} loading="lazy" />;
  }

  const initials = name
    .split(/\s+/)
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  return (
    <span
      aria-hidden
      className={cn(
        "inline-flex size-5 shrink-0 items-center justify-center rounded border border-current font-mono text-[0.55rem] font-semibold leading-none",
        className,
      )}
    >
      {initials}
    </span>
  );
}
