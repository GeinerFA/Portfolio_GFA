import { ArrowUpRight } from "lucide-react";
import { FaGithub } from "react-icons/fa6";
import { cn } from "@/lib/utils";

/** Botones "Ver código" y "Ver sitio". Se oculta el que no tenga URL. */
export function ProjectLinks({
  repoUrl,
  liveUrl,
  title,
  size = "md",
  tone = "default",
  className,
}: {
  repoUrl: string | null;
  liveUrl: string | null;
  title: string;
  size?: "sm" | "md" | "lg";
  /** "onAccent": para fondos de color (fila resaltada); el hover usa tinta en vez del color de acento. */
  tone?: "default" | "onAccent";
  className?: string;
}) {
  if (!repoUrl && !liveUrl) return null;

  const base = cn(
    "group/btn relative z-10 inline-flex items-center gap-2 rounded-full border font-medium transition-colors duration-300",
    size === "sm" && "px-3.5 py-1.5 text-xs",
    size === "md" && "px-4 py-2 text-sm",
    size === "lg" && "px-6 py-3 text-base",
  );

  return (
    <div className={cn("flex flex-wrap items-center gap-2", className)}>
      {repoUrl && (
        <a
          href={repoUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Ver código de ${title} en GitHub (abre en pestaña nueva)`}
          className={cn(
            base,
            tone === "onAccent"
              ? "border-current/30 hover:border-ink hover:bg-ink hover:text-paper"
              : "border-current/30 hover:border-paper hover:bg-paper hover:text-ink",
          )}
        >
          <FaGithub aria-hidden className="size-[1.1em]" />
          Ver código
        </a>
      )}
      {liveUrl && (
        <a
          href={liveUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Ver sitio de ${title} (abre en pestaña nueva)`}
          className={cn(
            base,
            "border-paper bg-paper text-ink",
            tone === "onAccent" ? "hover:border-ink hover:bg-ink hover:text-paper" : "hover:border-accent hover:bg-accent",
          )}
        >
          Ver sitio
          <ArrowUpRight
            aria-hidden
            className="size-[1.1em] transition-transform duration-300 group-hover/btn:-translate-y-0.5 group-hover/btn:translate-x-0.5"
          />
        </a>
      )}
    </div>
  );
}
