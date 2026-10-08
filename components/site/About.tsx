import { Download } from "lucide-react";
import Image from "next/image";
import { Reveal } from "@/components/motion/Reveal";
import { ScrollRevealText } from "@/components/motion/ScrollRevealText";
import type { Profile } from "@/lib/data/types";
import { SectionHeading } from "./SectionHeading";

export interface AboutStats {
  projects: number;
  technologies: number;
  years: number;
}

export function About({ profile, stats, index }: { profile: Profile; stats: AboutStats; index: string }) {
  const items = [
    { value: stats.projects, label: "Proyectos" },
    { value: stats.technologies, label: "Tecnologías" },
    { value: stats.years, label: stats.years === 1 ? "Año de experiencia" : "Años de experiencia" },
  ];

  // Párrafos separados por una línea en blanco (acepta saltos \n y \r\n).
  const [lead, ...paragraphs] = (profile.bio ?? "")
    .split(/\r?\n\s*\r?\n/)
    .map((p) => p.replace(/\s+/g, " ").trim())
    .filter(Boolean);

  return (
    <section id="sobre-mi" className="container-x scroll-mt-24 py-24 md:py-36">
      <SectionHeading index={index} eyebrow="Perfil" title="Sobre mí" />

      <div className="mt-14 grid gap-12 md:mt-20 md:grid-cols-12 md:gap-16">
        {profile.avatarUrl && (
          // En desktop la foto queda fija mientras se lee la biografía.
          <div className="md:sticky md:top-28 md:col-span-4 md:self-start">
            <Reveal>
              <div className="relative mx-auto aspect-[4/5] max-w-sm overflow-hidden rounded-3xl bg-ink-3 md:max-w-none">
                <Image
                  src={profile.avatarUrl}
                  alt={profile.fullName}
                  fill
                  sizes="(min-width: 768px) 33vw, 100vw"
                  className="object-cover grayscale transition-[filter] duration-700 hover:grayscale-0"
                />
              </div>
            </Reveal>
          </div>
        )}

        <div className={profile.avatarUrl ? "md:col-span-8" : "md:col-span-10 md:col-start-2"}>
          {/* Primer párrafo destacado (se revela palabra por palabra); el resto, en tamaño de lectura. */}
          {lead && (
            <ScrollRevealText
              text={lead}
              className="text-display text-[clamp(1.5rem,2.6vw,2.5rem)] font-medium leading-[1.2] tracking-tight"
            />
          )}
          {paragraphs.length > 0 && (
            <div className="mt-10 flex max-w-2xl flex-col gap-5 text-base leading-relaxed text-paper/70 md:text-lg">
              {paragraphs.map((p, i) => (
                <Reveal key={i} y={20}>
                  <p>{p}</p>
                </Reveal>
              ))}
            </div>
          )}

          <dl className="mt-16 grid grid-cols-3 gap-4 border-t border-line pt-8">
            {items.map((item, i) => (
              <Reveal key={item.label} delay={i * 0.08}>
                <dt className="font-mono text-[0.7rem] uppercase tracking-[0.2em] text-muted">{item.label}</dt>
                <dd className="text-display mt-3 text-[clamp(2.5rem,7vw,6rem)] tabular-nums">
                  {item.value}
                  <span className="text-accent">+</span>
                </dd>
              </Reveal>
            ))}
          </dl>

          {profile.cvUrl && (
            <Reveal delay={0.2} className="mt-12">
              <a
                href={profile.cvUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-3 rounded-full border border-paper px-6 py-3.5 font-medium transition-colors duration-300 hover:bg-paper hover:text-ink"
              >
                <Download className="size-4 transition-transform duration-300 group-hover:translate-y-0.5" aria-hidden />
                Descargar CV
              </a>
            </Reveal>
          )}
        </div>
      </div>
    </section>
  );
}
