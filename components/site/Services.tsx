import { Reveal } from "@/components/motion/Reveal";
import { services } from "@/lib/data/resume";
import { SectionHeading } from "./SectionHeading";

export function Services({ index }: { index: string }) {
  return (
    <section id="servicios" className="container-x scroll-mt-24 py-24 md:py-36">
      <SectionHeading
        index={index}
        eyebrow="Servicios"
        title="Qué hago"
        aside={
          <p className="max-w-sm text-paper/60 md:text-right">
            Del diseño de la interfaz a la puesta en producción, y el soporte para que todo siga funcionando.
          </p>
        }
      />

      <Reveal>
        <ul className="mt-14 grid border-l border-t border-line md:mt-20 md:grid-cols-2">
          {services.map((s, i) => (
            <li key={s.title} className="group relative overflow-hidden border-b border-r border-line">
              <span
                aria-hidden
                className="absolute inset-0 origin-bottom scale-y-0 bg-accent transition-transform duration-700 ease-out-expo group-hover:scale-y-100"
              />
              <div className="relative flex h-full flex-col gap-8 p-6 transition-colors duration-500 group-hover:text-ink md:p-10">
                <span className="font-mono text-xs text-muted transition-colors duration-500 group-hover:text-ink/60">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div>
                  <h3 className="text-display text-[clamp(1.75rem,3vw,2.75rem)]">{s.title}</h3>
                  <p className="mt-4 max-w-md leading-relaxed text-paper/60 transition-colors duration-500 group-hover:text-ink/75">
                    {s.description}
                  </p>
                </div>
                <ul className="mt-auto flex flex-wrap gap-2">
                  {s.tags.map((tag) => (
                    <li
                      key={tag}
                      className="rounded-full border border-line px-3 py-1 text-xs text-paper/70 transition-colors duration-500 group-hover:border-ink/20 group-hover:text-ink/80"
                    >
                      {tag}
                    </li>
                  ))}
                </ul>
              </div>
            </li>
          ))}
        </ul>
      </Reveal>
    </section>
  );
}
