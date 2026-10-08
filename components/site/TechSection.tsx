import { Reveal } from "@/components/motion/Reveal";
import { normalizeHex } from "@/lib/color";
import { TECH_CATEGORY_LABELS, type TechCategory, type TechnologyWithCount } from "@/lib/data/types";
import { SectionHeading } from "./SectionHeading";
import { TechIcon } from "./TechIcon";

function groupByCategory(techs: TechnologyWithCount[]) {
  const order = Object.keys(TECH_CATEGORY_LABELS) as TechCategory[];
  return order
    .map((category) => [TECH_CATEGORY_LABELS[category], techs.filter((t) => t.category === category)] as const)
    .filter(([, list]) => list.length > 0);
}

export function TechSection({ technologies, index }: { technologies: TechnologyWithCount[]; index: string }) {
  if (technologies.length === 0) return null;
  const groups = groupByCategory(technologies);

  return (
    <section id="tecnologias" className="container-x scroll-mt-24 py-24 md:py-36">
      <SectionHeading index={index} eyebrow="Stack" title="Tecnologías" />

      <div className="mt-14 flex flex-col gap-10 md:mt-20">
        {groups.map(([category, techs], gi) => (
          <Reveal key={category} delay={gi * 0.05} className="grid gap-6 border-t border-line pt-6 md:grid-cols-12">
            <h3 className="font-mono text-xs uppercase tracking-[0.25em] text-muted md:col-span-3">
              {category}
              <span className="ml-2 text-paper/40">({techs.length})</span>
            </h3>
            <ul className="grid grid-cols-1 gap-2.5 min-[420px]:grid-cols-2 md:col-span-9 lg:grid-cols-3 2xl:grid-cols-4">
              {techs.map((tech) => {
                const brand = normalizeHex(tech.color) ?? "#f2f0eb";
                return (
                  <li
                    key={tech.id}
                    style={{ ["--brand" as string]: brand }}
                    className="group relative flex items-center gap-3 overflow-hidden rounded-xl border border-line bg-ink-2 px-4 py-3 transition-[border-color,transform] duration-500 ease-out-expo hover:-translate-y-0.5 hover:border-[var(--brand)]"
                  >
                    <span
                      aria-hidden
                      className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                      style={{ background: "radial-gradient(120% 120% at 0% 50%, color-mix(in srgb, var(--brand) 16%, transparent), transparent 70%)" }}
                    />
                    <TechIcon
                      name={tech.name}
                      icon={tech.icon}
                      className="relative size-6 shrink-0 text-paper/70 transition-colors duration-500 group-hover:text-[var(--brand)]"
                    />
                    <span className="relative min-w-0 flex-1 truncate font-medium">{tech.name}</span>
                    {/* Solo se muestra el contador cuando hay proyectos que la usan. */}
                    {tech.projectCount > 0 && (
                      <span className="relative shrink-0 font-mono text-[0.7rem] text-muted tabular-nums">
                        {tech.projectCount} {tech.projectCount === 1 ? "proyecto" : "proyectos"}
                      </span>
                    )}
                  </li>
                );
              })}
            </ul>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
