import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ClipReveal } from "@/components/motion/ClipReveal";
import { Reveal } from "@/components/motion/Reveal";
import { SplitText } from "@/components/motion/SplitText";
import { NextProject } from "@/components/site/NextProject";
import { ProjectCover } from "@/components/site/ProjectCover";
import { ProjectLinks } from "@/components/site/ProjectLinks";
import { TechIcon } from "@/components/site/TechIcon";
import { accentOf, normalizeHex } from "@/lib/color";
import { getProjectBySlug, getSiteData } from "@/lib/data/queries";

export const revalidate = 3600;

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const { projects } = await getSiteData();
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const result = await getProjectBySlug(slug);
  if (!result) return { title: "Proyecto no encontrado" };
  const { project } = result;
  const description = project.summary || project.description.slice(0, 160) || undefined;
  const images = project.coverUrl ? [{ url: project.coverUrl, alt: project.title }] : undefined;

  return {
    title: project.title,
    description,
    alternates: { canonical: `/proyectos/${project.slug}` },
    openGraph: { type: "article", title: project.title, description, url: `/proyectos/${project.slug}`, images },
    twitter: { card: images ? "summary_large_image" : "summary", title: project.title, description },
  };
}

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params;
  const result = await getProjectBySlug(slug);
  if (!result) notFound();
  const { project, next } = result;
  const accent = accentOf(project.accentColor);
  const paragraphs = project.description.split(/\n{2,}/).map((p) => p.trim()).filter(Boolean);

  return (
    <article>
      <header className="container-x pb-12 pt-32 md:pb-16 md:pt-44">
        <Reveal y={10}>
          <Link
            href="/#proyectos"
            className="group inline-flex items-center gap-2 text-sm text-muted transition-colors hover:text-paper"
          >
            <ArrowLeft className="size-4 transition-transform group-hover:-translate-x-1" aria-hidden />
            Todos los proyectos
          </Link>
        </Reveal>

        <h1 className="text-display mt-10 text-[clamp(3rem,11vw,11rem)]">
          <SplitText text={project.title} stagger={0.025} delay={0.2} />
        </h1>

        <Reveal delay={0.5} className="mt-10 grid gap-8 border-t border-line pt-8 md:grid-cols-12">
          <dl className="grid grid-cols-2 gap-6 md:col-span-6">
            <div>
              <dt className="font-mono text-xs uppercase tracking-[0.2em] text-muted">Año</dt>
              <dd className="mt-2 text-lg">{project.year}</dd>
            </div>
            <div>
              <dt className="font-mono text-xs uppercase tracking-[0.2em] text-muted">Color</dt>
              <dd className="mt-2 flex items-center gap-2 text-lg">
                <span className="size-4 rounded-full" style={{ background: accent }} />
                <span className="font-mono text-sm uppercase">{accent}</span>
              </dd>
            </div>
          </dl>
          <ProjectLinks
            repoUrl={project.repoUrl}
            liveUrl={project.liveUrl}
            title={project.title}
            size="lg"
            className="md:col-span-6 md:justify-end"
          />
        </Reveal>
      </header>

      <ClipReveal delay={0.3} className="container-x">
        <div className="relative mx-auto aspect-[16/10] w-full max-w-[calc(80svh*1.6)] overflow-hidden rounded-2xl border border-line bg-ink-3 md:rounded-3xl">
          <ProjectCover
            title={project.title}
            coverUrl={project.coverUrl}
            accentColor={project.accentColor}
            sizes="(min-width: 1536px) 1440px, 100vw"
            priority
          />
          {project.previewVideoUrl && !project.coverUrl && (
            <video
              src={project.previewVideoUrl}
              className="absolute inset-0 size-full object-cover"
              autoPlay
              muted
              loop
              playsInline
            />
          )}
        </div>
      </ClipReveal>

      <section className="container-x grid gap-14 py-24 md:grid-cols-12 md:py-36">
        <aside className="md:col-span-4">
          <Reveal>
            <h2 className="font-mono text-xs uppercase tracking-[0.25em] text-muted">Tecnologías</h2>
            {project.technologies.length > 0 ? (
              <ul className="mt-6 flex flex-col">
                {project.technologies.map((t) => (
                  <li
                    key={t.id}
                    style={{ ["--brand" as string]: normalizeHex(t.color) ?? "#f2f0eb" }}
                    className="group flex items-center gap-3 border-b border-line py-3"
                  >
                    <TechIcon
                      name={t.name}
                      icon={t.icon}
                      className="size-5 text-paper/60 transition-colors group-hover:text-[var(--brand)]"
                    />
                    {t.name}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-6 text-muted">—</p>
            )}
          </Reveal>
        </aside>

        <div className="md:col-span-7 md:col-start-6">
          {project.summary && (
            <Reveal>
              <p className="text-display text-[clamp(1.6rem,3vw,2.75rem)] font-medium leading-[1.15] tracking-tight">
                {project.summary}
              </p>
            </Reveal>
          )}
          {paragraphs.length > 0 && (
            <div className="mt-10 flex flex-col gap-6 text-lg leading-relaxed text-paper/70">
              {paragraphs.map((p, i) => (
                <Reveal key={i} delay={i * 0.05}>
                  <p className="whitespace-pre-line">{p}</p>
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </section>

      {project.gallery.length > 0 && (
        <section className="container-x pb-24 md:pb-36" aria-label="Galería">
          <ul className="grid gap-4 md:grid-cols-2 md:gap-6">
            {project.gallery.map((src, i) => (
              <li key={`${src}-${i}`} className={i % 3 === 0 ? "md:col-span-2" : undefined}>
                <ClipReveal inView className="overflow-hidden rounded-3xl">
                  <div className={`relative bg-ink-3 ${i % 3 === 0 ? "aspect-[16/9]" : "aspect-[4/3]"}`}>
                    <Image
                      src={src}
                      alt={`${project.title} — imagen ${i + 1}`}
                      fill
                      sizes={i % 3 === 0 ? "100vw" : "(min-width: 768px) 50vw, 100vw"}
                      className="object-cover"
                    />
                  </div>
                </ClipReveal>
              </li>
            ))}
          </ul>
        </section>
      )}

      {next && <NextProject project={next} />}
    </article>
  );
}
