import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { accentOf, readableOn } from "@/lib/color";
import type { Project } from "@/lib/data/types";
import { ProjectCover } from "./ProjectCover";

/** CTA grande a "Siguiente proyecto": al pasar el cursor, la portada del siguiente se revela de fondo. */
export function NextProject({ project }: { project: Project }) {
  const accent = accentOf(project.accentColor);
  return (
    <section className="border-t border-line">
      <Link
        href={`/proyectos/${project.slug}`}
        className="group relative block overflow-hidden"
        style={{ ["--accent" as string]: accent, ["--on-accent" as string]: readableOn(accent) }}
      >
        <div className="absolute inset-0 opacity-0 transition-opacity duration-700 group-hover:opacity-100">
          <div className="absolute inset-0 scale-110 transition-transform duration-[1.4s] ease-out-expo group-hover:scale-100">
            <ProjectCover title={project.title} coverUrl={project.coverUrl} accentColor={project.accentColor} sizes="100vw" />
          </div>
          <div className="absolute inset-0 bg-ink/60" />
        </div>

        <div className="container-x relative flex flex-col gap-6 py-24 md:py-40">
          <p className="font-mono text-xs uppercase tracking-[0.25em] text-muted transition-colors group-hover:text-paper">
            Siguiente proyecto
          </p>
          <div className="flex items-end justify-between gap-6">
            <h2 className="text-display text-[clamp(3rem,12vw,12rem)] transition-transform duration-700 ease-out-expo group-hover:translate-x-4">
              {project.title}
            </h2>
            <span className="mb-[2vw] flex size-16 shrink-0 items-center justify-center rounded-full border border-line transition-all duration-500 group-hover:border-transparent group-hover:bg-[var(--accent)] group-hover:text-[var(--on-accent)] md:size-24">
              <ArrowRight className="size-6 transition-transform duration-500 group-hover:-rotate-45 md:size-8" aria-hidden />
            </span>
          </div>
        </div>
      </Link>
    </section>
  );
}
