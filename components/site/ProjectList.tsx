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
import Image from "next/image";
import Link from "next/link";
import { useMemo, useRef, useState } from "react";
import { accentOf, readableOn } from "@/lib/color";
import type { Project, Technology } from "@/lib/data/types";
import { hostnameOf } from "@/lib/preview";
import { cn } from "@/lib/utils";
import { ProjectCover } from "./ProjectCover";
import { ProjectLinks } from "./ProjectLinks";
import { SectionHeading } from "./SectionHeading";

const ease = [0.16, 1, 0.3, 1] as const;

/** Qué se muestra al pasar el cursor: video (si se configuró) → captura de la home → portada. */
function previewOf(p: Project) {
  if (p.previewVideoUrl) return { kind: "video" as const, src: p.previewVideoUrl };
  if (p.sitePreviewUrl) return { kind: "site" as const, src: p.sitePreviewUrl };
  return { kind: "cover" as const, src: p.coverUrl };
}

/**
 * Vista previa que sigue al cursor sobre la lista (solo desktop).
 * Si el proyecto tiene sitio en vivo, muestra la home dentro de un marco de navegador.
 */
function FloatingPreview({
  projects,
  activeId,
  shown,
  x,
  y,
  boxRef,
}: {
  projects: Project[];
  activeId: number | null;
  /** false mientras el cursor está sobre los botones, para no taparlos. */
  shown: boolean;
  x: MotionValue<number>;
  y: MotionValue<number>;
  boxRef: React.RefObject<HTMLDivElement | null>;
}) {
  const [failed, setFailed] = useState<Set<number>>(() => new Set());
  const active = projects.find((p) => p.id === activeId);
  const activeIsSite = active ? previewOf(active).kind === "site" && !failed.has(active.id) : false;

  return (
    <motion.div
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-30 hidden md:block"
      style={{ x, y }}
    >
      <motion.div
        ref={boxRef}
        className="w-[clamp(20rem,30vw,30rem)] overflow-hidden rounded-2xl border border-line bg-ink-2 shadow-2xl shadow-black/60"
        initial={false}
        animate={{ scale: shown ? 1 : 0.6, opacity: shown ? 1 : 0, rotate: shown ? 0 : -4 }}
        transition={{ duration: shown ? 0.5 : 0.25, ease }}
      >
        {/* Barra de navegador (solo para la captura del sitio) */}
        <div
          className={cn(
            "flex items-center gap-3 border-b border-line bg-ink-3 px-3 transition-[height,opacity] duration-300",
            activeIsSite ? "h-8 opacity-100" : "h-0 border-b-0 opacity-0",
          )}
        >
          <span className="flex gap-1.5">
            <span className="size-2.5 rounded-full bg-[#ff5f57]" />
            <span className="size-2.5 rounded-full bg-[#febc2e]" />
            <span className="size-2.5 rounded-full bg-[#28c840]" />
          </span>
          <span className="flex-1 truncate rounded-md bg-ink-2 px-2.5 py-0.5 text-center font-mono text-[0.65rem] text-muted">
            {active?.liveUrl ? hostnameOf(active.liveUrl) : ""}
          </span>
        </div>

        <div className="relative aspect-[16/10]">
          {projects.map((p) => {
            const isActive = p.id === activeId;
            const preview = previewOf(p);
            return (
              <div
                key={p.id}
                className="absolute inset-0 transition-[opacity,transform] duration-500 ease-out-expo"
                style={{ opacity: isActive ? 1 : 0, transform: isActive ? "scale(1)" : "scale(1.1)" }}
              >
                {/* Fondo mientras carga la captura (o si falla) */}
                <ProjectCover title={p.title} coverUrl={preview.kind === "site" ? null : p.coverUrl} accentColor={p.accentColor} sizes="30rem" />
                {preview.kind === "site" && !failed.has(p.id) && (
                  <Image
                    src={preview.src}
                    alt=""
                    fill
                    sizes="30rem"
                    unoptimized
                    className="object-cover object-top"
                    onError={() => setFailed((prev) => new Set(prev).add(p.id))}
                  />
                )}
                {isActive && preview.kind === "video" && (
                  <video
                    src={preview.src}
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
        </div>
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
              className="outline-none after:absolute after:inset-0 after:content-[''] focus-visible:underline"
            >
              {project.title}
            </Link>
          </h3>
          {/* El espacio de las tecnologías siempre está reservado: así la fila no cambia de alto
              al pasar el cursor y los botones no se mueven mientras intentas hacer clic. */}
          <div
            className={cn(
              "transition-[opacity,transform] duration-500 ease-out-expo",
              active ? "translate-y-0 opacity-100" : "translate-y-1 opacity-0",
            )}
          >
            <TechChips techs={project.technologies} className="pt-4" />
          </div>
        </div>

        <p className="relative col-span-2 hidden text-sm opacity-70 lg:block">{project.summary}</p>

        <span className="relative col-span-1 font-mono text-sm opacity-70">{project.year}</span>

        {/* data-no-preview: la vista previa se oculta sobre los botones para no taparlos */}
        <div data-no-preview className="relative col-span-4 flex justify-end lg:col-span-3">
          <ProjectLinks
            repoUrl={project.repoUrl}
            liveUrl={project.liveUrl}
            title={project.title}
            size="sm"
            tone={active ? "onAccent" : "default"}
            className="justify-end"
          />
        </div>
      </div>

      {/* ── Móvil: tarjeta ──────────────────────────── */}
      {/* Fila compacta tipo lista (distinta de las tarjetas de Destacados). */}
      <article className="relative py-5 md:hidden">
        <div className="flex gap-4">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2.5 font-mono text-[0.7rem] text-muted">
              <span>{String(index + 1).padStart(2, "0")}</span>
              <span className="h-px w-5" style={{ background: accent }} />
              <span>{project.year}</span>
            </div>
            <h3 className="text-display mt-2 text-[1.75rem] leading-[1.05]">
              <Link href={href} className="after:absolute after:inset-0 after:content-['']">
                {project.title}
              </Link>
            </h3>
            {project.summary && <p className="mt-2 line-clamp-2 text-sm text-paper/60">{project.summary}</p>}
          </div>

          <div className="relative mt-1 aspect-[16/10] w-24 shrink-0 self-start overflow-hidden rounded-lg border border-line bg-ink-3">
            <ProjectCover title={project.title} coverUrl={project.coverUrl} accentColor={project.accentColor} sizes="96px" />
          </div>
        </div>

        {project.technologies.length > 0 && (
          <ul className="mt-3 flex flex-wrap gap-1.5 text-paper/70">
            {project.technologies.slice(0, 3).map((t) => (
              <li key={t.id} className="rounded-full border border-current/25 px-2.5 py-0.5 text-[0.7rem]">
                {t.name}
              </li>
            ))}
            {project.technologies.length > 3 && (
              <li className="rounded-full px-1.5 py-0.5 text-[0.7rem] text-muted">+{project.technologies.length - 3}</li>
            )}
          </ul>
        )}

        <div className="mt-4 flex items-center justify-between gap-3">
          <ProjectLinks repoUrl={project.repoUrl} liveUrl={project.liveUrl} title={project.title} size="sm" />
          <ArrowUpRight className="size-5 shrink-0 text-muted" aria-hidden />
        </div>
      </article>
    </motion.li>
  );
}

export function ProjectList({ projects }: { projects: Project[] }) {
  const reduce = useReducedMotion();
  const [filter, setFilter] = useState<string | null>(null);
  const [activeId, setActiveId] = useState<number | null>(null);
  const [overLinks, setOverLinks] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);

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
          const target = e.target instanceof Element ? e.target : null;
          setOverLinks(Boolean(target?.closest("[data-no-preview]")));
          // La vista previa va al costado del cursor (nunca debajo): a la derecha en la mitad
          // izquierda de la pantalla y a la izquierda en la mitad derecha. Siempre dentro de la ventana.
          const w = previewRef.current?.offsetWidth ?? 480;
          const h = previewRef.current?.offsetHeight ?? 320;
          const gap = 32;
          const margin = 16;
          const toRight = e.clientX < window.innerWidth / 2;
          const px = toRight ? e.clientX + gap : e.clientX - gap - w;
          const py = e.clientY - h / 2;
          mouseX.set(Math.min(Math.max(px, margin), window.innerWidth - w - margin));
          mouseY.set(Math.min(Math.max(py, margin), window.innerHeight - h - margin));
        }}
        onPointerLeave={() => {
          setActiveId(null);
          setOverLinks(false);
        }}
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

        <FloatingPreview
          projects={visible}
          activeId={activeId}
          shown={activeId !== null && !overLinks}
          x={x}
          y={y}
          boxRef={previewRef}
        />
      </div>
    </section>
  );
}
