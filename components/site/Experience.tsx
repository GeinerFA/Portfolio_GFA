import { Briefcase, GraduationCap } from "lucide-react";
import { Reveal } from "@/components/motion/Reveal";
import { timeline } from "@/lib/data/resume";
import { cn } from "@/lib/utils";
import { SectionHeading } from "./SectionHeading";

export function Experience({ index }: { index: string }) {
  return (
    <section id="trayectoria" className="container-x scroll-mt-24 py-24 md:py-36">
      <SectionHeading index={index} eyebrow="Experiencia y formación" title="Trayectoria" />

      <ol className="mt-14 border-t border-line md:mt-20">
        {timeline.map((item, i) => {
          const Icon = item.kind === "estudio" ? GraduationCap : Briefcase;
          return (
            <li key={`${item.title}-${item.period}`} className="border-b border-line">
              <Reveal delay={i * 0.05} className="grid gap-6 py-10 md:grid-cols-12 md:gap-8 md:py-14">
                <div className="flex items-start gap-3 md:col-span-3 md:flex-col md:gap-4">
                  <span
                    className={cn(
                      "inline-flex size-10 shrink-0 items-center justify-center rounded-full border",
                      item.current ? "border-accent bg-accent text-ink" : "border-line text-paper/70",
                    )}
                  >
                    <Icon className="size-4" aria-hidden />
                  </span>
                  <div>
                    <p className="font-mono text-sm text-paper/80">{item.period}</p>
                    <p className="mt-1 font-mono text-xs uppercase tracking-[0.2em] text-muted">
                      {item.kind === "estudio" ? "Formación" : "Experiencia"}
                      {item.current && <span className="ml-2 text-accent">· Actual</span>}
                    </p>
                  </div>
                </div>

                <div className="md:col-span-4">
                  <h3 className="text-display text-[clamp(1.6rem,2.6vw,2.4rem)]">{item.title}</h3>
                  <p className="mt-3 text-paper/60">{item.org}</p>
                </div>

                <div className="md:col-span-5">
                  <p className="leading-relaxed text-paper/80">{item.summary}</p>
                  <ul className="mt-5 flex flex-col gap-2.5 text-sm text-paper/60">
                    {item.highlights.map((h) => (
                      <li key={h} className="flex gap-3">
                        <span className="mt-2 size-1 shrink-0 rounded-full bg-accent" aria-hidden />
                        {h}
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
