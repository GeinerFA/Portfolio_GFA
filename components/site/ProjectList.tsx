"use client";

import { ArrowUpRight } from "lucide-react";
import {
  AnimatePresence,
  LayoutGroup,
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  type MotionValue,
} from "motion/react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { accentOf, readableOn } from "@/lib/color";
import type { Project, Technology } from "@/lib/data/types";
import { cn } from "@/lib/utils";
import { ProjectCover } from "./ProjectCover";
import { ProjectLinks } from "./ProjectLinks";
import { SectionHeading } from "./SectionHeading";

const ease = [0.16, 1, 0.3, 1] as const;

/** Imagen/video que sigue al cursor sobre la lista (solo desktop). */
function FloatingPreview({
  projects,
  activeId,
  x,
  y,
}: {
  projects: Project[];
  activeId: number | null;
  x: MotionValue<number>;
  y: MotionValue<number>;
}) {
  return (
    <motion.div
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-30 hidden md:block"
      style={{ x, y, translateX: "-50%", translateY: "-50%" }}
    >
      <motion.div
        className="relative aspect-[4/3] w-[clamp(18rem,26vw,26rem)] overflow-hidden rounded-2xl bg-ink-3 shadow-2xl shadow-black/60"
        initial={false}
        animate={{ scale: activeId ? 1 : 0.4, opacity: activeId ? 1 : 0, rotate: activeId ? 0 : -6 }}
        transition={{ duration: 0.5, ease }}
      >
        {projects.map((p) => {
          const active = p.id === activeId;
          return (
            <div
              key={p.id}
              className="absolute inset-0 transition-[opacity,transform] duration-500 ease-out-expo"
              style={{ opacity: active ? 1 : 0, transform: active ? "scale(1)" : "scale(1.15)" }}
            >
              <ProjectCover title={p.title} coverUrl={p.coverUrl} accentColor={p.accentColor} sizes="26rem" />
              {active && p.previewVideoUrl && (
                <video
                  src={p.previewVideoUrl}
                  className="absolute inset-0 size-full object-cover"
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="metadata"
                />
              )}
            </div>
          );
        })}
      </motion.div>
    </motion.div>
  );
}

function TechChips({ techs, className }: { techs: Technology[]; className?: string }) {
  return (
    <ul className={cn("flex flex-wrap gap-1.5", className)}>
      {techs.map((t) => (
        <li key={t.id} className="rounded-full border border-current/25 px-2.5 py-0.5 text-xs">
          {t.name}
        </li>
      ))}
    </ul>
  );
}

function ProjectRow({
  project,
  index,
  active,
  onEnter,
}: {
  project: Project;
  index: number;
  active: boolean;
  onEnter: () => void;
}) {
  const accent = accentOf(project.accentColor);
  const onAccent = readableOn(accent);
  const href = `/proyectos/${project.slug}`;

  return (
    <motion.li
      layout
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.97, transition: { duration: 0.25 } }}
      transition={{ duration: 0.6, ease }}
      className="relative border-b border-line"
      style={{ ["--accent" as string]: accent, ["--on-accent" as string]: onAccent }}
    >
      {/* ── Desktop: fila ───────────────────────────── */}
      <div
        onPointerEnter={onEnter}
        className={cn(
          "group relative hidden items-center gap-6 px-4 py-8 transition-colors duration-500 md:grid md:grid-cols-12 lg:px-6",
          active && "text-[var(--on-accent)]",
        )}
      >
        <span
          aria-hidden
          className={cn(
            "absolute inset-0 origin-bottom bg-[var(--accent)] transition-transform duration-500 ease-out-expo",
            active ? "scale-y-100" : "scale-y-0",
          )}
        />
        <span className="relative col-span-1 font-mono text-xs opacity-60">{String(index + 1).padStart(2, "0")}</span>

        <div className="relative col-span-6 lg:col-span-5">
          <h3 className="text-display text-[clamp(2.25rem,5vw,4.75rem)] transition-transform duration-500 ease-out-expo group-hover:translate-x-3">
            <Link
              href={href}
              data-cursor="Ver"
              className="outline-none after:absolute after:inset-0 after:content-[''] focus-visible:underline"
            >
              {project.title}
            </Link>
          </h3>
          <div
            className={cn(
              "grid transition-[grid-template-rows,opacity] duration-500 ease-out-expo",
              active ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
            )}
          >
            <div className="overflow-hidden">
              <TechChips techs={project.technologies} className="pt-4" />
            </div>
          </div>
        </div>

        <p className="relative col-span-2 hidden text-sm opacity-70 lg:block">{project.summary}</p>

        <span className="relative col-span-1 font-mono text-sm opacity-70">{project.year}</span>

        <ProjectLinks
          repoUrl={project.repoUrl}
          liveUrl={project.liveUrl}
          title={project.title}
          size="sm"
          className="relative col-span-4 justify-end lg:col-span-3"
        />
      </div>

      {/* ── Móvil: tarjeta ──────────────────────────── */}
      <article className="py-6 md:hidden">
        <Link href={href} className="block">
          <div className="relative aspect-[16/10] overflow-hidden rounded-2xl bg-ink-3">
            <ProjectCover title={project.title} coverUrl={project.coverUrl} accentColor={project.accentColor} sizes="100vw" />
            <span
              className="absolute right-3 top-3 flex size-10 items-center justify-center rounded-full"
              style={{ background: accent, color: onAccent }}
            >
              <ArrowUpRight className="size-5" aria-hidden />
            </span>
          </div>
          <div className="mt-4 flex items-baseline justify-between gap-4">
            <h3 className="text-display text-4xl">{project.title}</h3>
            <span className="font-mono text-sm text-muted">{project.year}</span>
          </div>
          {project.summary && <p className="mt-2 text-sm text-paper/60">{project.summary}</p>}
        </Link>
        <TechChips techs={project.technologies} className="mt-4 text-paper/70" />
        <ProjectLinks repoUrl={project.repoUrl} liveUrl={project.liveUrl} title={project.title} className="mt-5" />
      </article>
    </motion.li>
  );
}

export function ProjectList({ projects }: { projects: Project[] }) {
  const reduce = useReducedMotion();
  const [filter, setFilter] = useState<string | null>(null);
  const [activeId, setActiveId] = useState<number | null>(null);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const spring = reduce ? { stiffness: 2000, damping: 120 } : { stiffness: 220, damping: 26, mass: 0.6 };
  const x = useSpring(mouseX, spring);
  const y = useSpring(mouseY, spring);

  // Tecnologías presentes en los proyectos, ordenadas por uso.
  const filters = useMemo(() => {
    const counts = new Map<string, { tech: Technology; count: number }>();
    for (const p of projects)
      for (const t of p.technologies) {
        const entry = counts.get(t.slug);
        counts.set(t.slug, { tech: t, count: (entry?.count ?? 0) + 1 });
      }
    return [...counts.values()].sort((a, b) => b.count - a.count || a.tech.sortOrder - b.tech.sortOrder);
  }, [projects]);

  const visible = filter ? projects.filter((p) => p.technologies.some((t) => t.slug === filter)) : projects;

  if (projects.length === 0) return null;

  return (
    <section id="proyectos" className="container-x scroll-mt-24 py-24 md:py-36">
      <SectionHeading
        index="03"
        eyebrow="Índice"
        title="Proyectos"
        aside={<p className="font-mono text-sm text-muted">{visible.length} / {projects.length}</p>}
      />

      {filters.length > 1 && (
        <LayoutGroup id="project-filters">
          <div role="group" aria-label="Filtrar por tecnología" className="mt-12 flex flex-wrap gap-2">
            {[{ slug: null, name: "Todos", count: projects.length }, ...filters.map((f) => ({ slug: f.tech.slug, name: f.tech.name, count: f.count }))].map(
              (f) => {
                const selected = filter === f.slug;
                return (
                  <button
                    key={f.slug ?? "all"}
                    type="button"
                    aria-pressed={selected}
                    onClick={() => setFilter(f.slug)}
                    className={cn(
                      "relative rounded-full border px-4 py-2 text-sm transition-colors duration-300",
                      selected ? "border-paper text-ink" : "border-line text-paper/70 hover:border-paper/50 hover:text-paper",
                    )}
                  >
                    {selected && (
                      <motion.span
                        layoutId="filter-pill"
                        className="absolute inset-0 rounded-full bg-paper"
                        transition={{ type: "spring", stiffness: 400, damping: 32 }}
                      />
                    )}
                    <span className="relative">
                      {f.name} <span className="font-mono text-xs opacity-60">{f.count}</span>
                    </span>
                  </button>
                );
              },
            )}
          </div>
        </LayoutGroup>
      )}

      <div
        className="relative mt-10"
        onPointerMove={(e) => {
          if (e.pointerType !== "mouse") return;
          mouseX.set(e.clientX);
          mouseY.set(e.clientY);
        }}
        onPointerLeave={() => setActiveId(null)}
      >
        <div className="hidden grid-cols-12 gap-6 border-b border-line px-4 pb-4 font-mono text-xs uppercase tracking-widest text-muted md:grid lg:px-6">
          <span className="col-span-1">#</span>
          <span className="col-span-6 lg:col-span-5">Proyecto</span>
          <span className="col-span-2 hidden lg:block">Resumen</span>
          <span className="col-span-1">Año</span>
          <span className="col-span-4 text-right lg:col-span-3">Enlaces</span>
        </div>

        <LayoutGroup id="project-list">
          <motion.ul layout className="md:border-t-0">
            <AnimatePresence mode="popLayout" initial={false}>
              {visible.map((p, i) => (
                <ProjectRow key={p.id} project={p} index={i} active={activeId === p.id} onEnter={() => setActiveId(p.id)} />
              ))}
            </AnimatePresence>
          </motion.ul>
        </LayoutGroup>

        {visible.length === 0 && <p className="py-16 text-center text-muted">No hay proyectos con esa tecnología.</p>}

        <FloatingPreview projects={visible} activeId={activeId} x={x} y={y} />
      </div>
    </section>
  );
}
