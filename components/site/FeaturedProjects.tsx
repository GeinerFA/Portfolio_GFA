"use client";

import { ArrowUpRight } from "lucide-react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import Link from "next/link";
import { useRef } from "react";
import { accentOf } from "@/lib/color";
import type { Project } from "@/lib/data/types";
import { cn } from "@/lib/utils";
import { ProjectCover } from "./ProjectCover";
import { ProjectLinks } from "./ProjectLinks";
import { SectionHeading } from "./SectionHeading";

/**
 * Tarjeta horizontal: imagen 16:10 (la proporción de una pantalla, así la captura del sitio se ve completa)
 * + información al lado. La altura de la imagen se limita para que la tarjeta quepa en la pantalla.
 */
function FeaturedCard({ project, index }: { project: Project; index: number }) {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  // Parallax suave de la tarjeta completa (la imagen no se desplaza para no recortarla).
  const y = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [60, -60]);
  const accent = accentOf(project.accentColor);
  const reversed = index % 2 === 1;

  return (
    <motion.article ref={ref} style={{ y }} className="group relative">
      <div className={cn("grid items-center gap-6 md:grid-cols-12 md:gap-10", reversed && "md:[direction:rtl]")}>
        {/* Imagen */}
        <div className="md:col-span-7 md:[direction:ltr]">
          <div className="relative mx-auto aspect-[16/10] w-full max-w-[calc(70svh*1.6)] overflow-hidden rounded-2xl border border-line bg-ink-3 md:rounded-3xl">
            <div className="absolute inset-0 transition-transform duration-[1.2s] ease-out-expo group-hover:scale-[1.03]">
              <ProjectCover
                title={project.title}
                coverUrl={project.coverUrl}
                accentColor={project.accentColor}
                sizes="(min-width: 768px) 58vw, 100vw"
              />
            </div>
          </div>
        </div>

        {/* Información */}
        <div className="flex flex-col md:col-span-5 md:[direction:ltr]">
          <div className="flex items-center gap-3 font-mono text-xs text-muted">
            <span>{String(index + 1).padStart(2, "0")}</span>
            <span className="h-px w-8 bg-line" />
            <span>{project.year}</span>
            <span className="rounded-full px-2.5 py-0.5" style={{ background: accent, color: "#0a0a0a" }}>
              Destacado
            </span>
          </div>

          <h3 className="text-display mt-4 text-[clamp(2.25rem,4.5vw,4rem)]">
            <Link
              href={`/proyectos/${project.slug}`}
              className="after:absolute after:inset-0 after:content-['']"
            >
              {project.title}
            </Link>
          </h3>
          {project.summary && <p className="mt-4 max-w-md text-paper/60">{project.summary}</p>}

          {project.technologies.length > 0 && (
            <ul className="mt-6 flex flex-wrap gap-2">
              {project.technologies.map((t) => (
                <li key={t.id} className="rounded-full border border-line px-3 py-1 text-xs text-paper/70">
                  {t.name}
                </li>
              ))}
            </ul>
          )}

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <ProjectLinks repoUrl={project.repoUrl} liveUrl={project.liveUrl} title={project.title} />
            <span className="inline-flex items-center gap-1.5 text-sm text-muted transition-colors group-hover:text-paper">
              Ver detalle
              <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden />
            </span>
          </div>
        </div>
      </div>
    </motion.article>
  );
}

export function FeaturedProjects({ projects }: { projects: Project[] }) {
  if (projects.length === 0) return null;
  return (
    <section id="destacados" className="container-x py-24 md:py-36">
      <SectionHeading index="02" eyebrow="Selección" title="Destacados" />
      <div className="mt-16 flex flex-col gap-24 md:mt-24 md:gap-32">
        {projects.map((p, i) => (
          <FeaturedCard key={p.id} project={p} index={i} />
        ))}
      </div>
    </section>
  );
}
