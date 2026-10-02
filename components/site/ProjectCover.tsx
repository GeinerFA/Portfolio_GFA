import Image from "next/image";
import { accentOf, readableOn } from "@/lib/color";
import { isSitePreview } from "@/lib/preview";
import { cn } from "@/lib/utils";

/**
 * Portada de un proyecto. Si no hay `coverUrl`, dibuja un degradado con el color de acento
 * y el título, para que el sitio nunca muestre una imagen rota.
 */
export function ProjectCover({
  title,
  coverUrl,
  accentColor,
  sizes = "100vw",
  priority = false,
  className,
}: {
  title: string;
  coverUrl: string | null;
  accentColor: string | null;
  sizes?: string;
  priority?: boolean;
  className?: string;
}) {
  if (coverUrl) {
    return (
      <Image
        src={coverUrl}
        alt={`Portada de ${title}`}
        fill
        sizes={sizes}
        priority={priority}
        // Las capturas de sitios ya vienen livianas: se sirven directo y alineadas arriba (inicio de la página).
        unoptimized={isSitePreview(coverUrl)}
        className={cn("object-cover", isSitePreview(coverUrl) && "object-top", className)}
      />
    );
  }

  const accent = accentOf(accentColor);
  return (
    <div
      role="img"
      aria-label={`Portada de ${title}`}
      className={cn("absolute inset-0 flex items-end overflow-hidden p-[6%]", className)}
      style={{
        background: `radial-gradient(120% 90% at 85% 10%, ${accent} 0%, transparent 55%), linear-gradient(160deg, #1b1b1b, #0a0a0a)`,
      }}
    >
      <span
        className="text-display select-none text-[clamp(2.5rem,9vw,8rem)] opacity-90"
        style={{ color: readableOn("#111") }}
      >
        {title}
      </span>
    </div>
  );
}
