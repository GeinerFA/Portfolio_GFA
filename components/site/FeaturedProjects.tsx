"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import Link from "next/link";
import { useRef } from "react";
import { accentOf } from "@/lib/color";
import type { Project } from "@/lib/data/types";
import { ProjectCover } from "./ProjectCover";
import { ProjectLinks } from "./ProjectLinks";
import { SectionHeading } from "./SectionHeading";

function FeaturedCard({ project, index }: { project: Project; index: number }) {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const imageY = useTransform(scrollYProgress, [0, 1], reduce ? ["0%", "0%"] : ["-12%", "12%"]);
  const cardY = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [index % 2 ? 80 : 40, index % 2 ? -80 : -40]);
  const accent = accentOf(project.accentColor);

  return (
    <motion.article
      ref={ref}
      style={{ y: cardY }}
      className={index % 2 ? "md:col-span-5 md:col-start-8 md:mt-48" : "md:col-span-7"}
    >
      <div className="group relative">
        <div className="relative aspect-[4/5] overflow-hidden rounded-3xl bg-ink-3 md:aspect-[4/4.6]">
          <motion.div className="absolute -inset-y-[14%] inset-x-0" style={{ y: imageY }}>
            <div className="relative size-full transition-transform duration-[1.2s] ease-out-expo group-hover:scale-105">
              <ProjectCover
                title={project.title}
                coverUrl={project.coverUrl}
                accentColor={project.accentColor}
                sizes="(min-width: 768px) 58vw, 100vw"
              />
            </div>
          </motion.div>
          <span
            className="absolute left-5 top-5 rounded-full px-3 py-1 font-mono text-xs"
            style={{ background: accent, color: "#0a0a0a" }}
          >
            Destacado
          </span>
        </div>

        <div className="mt-6 flex items-start justify-between gap-6">
          <div>
            <h3 className="text-display text-[clamp(2rem,4vw,3.5rem)]">
              <Link
                href={`/proyectos/${project.slug}`}
                data-cursor="Ver"
                className="after:absolute after:inset-0 after:rounded-3xl after:content-['']"
              >
                {project.title}
              </Link>
            </h3>
            {project.summary && <p className="mt-3 max-w-md text-paper/60">{project.summary}</p>}
          </div>
          {project.year && <span className="font-mono text-sm text-muted">{project.year}</span>}
        </div>

        {project.technologies.length > 0 && (
          <ul className="mt-5 flex flex-wrap gap-2">
            {project.technologies.map((t) => (
              <li key={t.id} className="rounded-full border border-line px-3 py-1 text-xs text-paper/70">
                {t.name}
              </li>
            ))}
          </ul>
        )}

        <ProjectLinks repoUrl={project.repoUrl} liveUrl={project.liveUrl} title={project.title} className="mt-6" />
      </div>
    </motion.article>
  );
}

export function FeaturedProjects({ projects }: { projects: Project[] }) {
  if (projects.length === 0) return null;
  return (
    <section id="destacados" className="container-x py-24 md:py-36">
      <SectionHeading index="02" eyebrow="Selección" title="Destacados" />
      <div className="mt-16 grid gap-20 md:mt-24 md:grid-cols-12 md:gap-y-32">
        {projects.map((p, i) => (
          <FeaturedCard key={p.id} project={p} index={i} />
        ))}
      </div>
    </section>
  );
}
