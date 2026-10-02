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

export function TechSection({ technologies }: { technologies: TechnologyWithCount[] }) {
  if (technologies.length === 0) return null;
  const groups = groupByCategory(technologies);

  return (
    <section id="tecnologias" className="container-x scroll-mt-24 py-24 md:py-36">
      <SectionHeading index="01" eyebrow="Stack" title="Tecnologías" />

      <div className="mt-14 flex flex-col gap-14 md:mt-20">
        {groups.map(([category, techs], gi) => (
          <Reveal key={category} delay={gi * 0.05} className="grid gap-6 border-t border-line pt-6 md:grid-cols-12">
            <h3 className="font-mono text-xs uppercase tracking-[0.25em] text-muted md:col-span-3">
              {category}
              <span className="ml-2 text-paper/40">({techs.length})</span>
            </h3>
            <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:col-span-9 lg:grid-cols-4">
              {techs.map((tech) => {
                const brand = normalizeHex(tech.color) ?? "#f2f0eb";
                return (
                  <li
                    key={tech.id}
                    style={{ ["--brand" as string]: brand }}
                    className="group relative overflow-hidden rounded-2xl border border-line bg-ink-2 p-4 transition-[border-color,transform] duration-500 ease-out-expo hover:-translate-y-1 hover:border-[var(--brand)] md:p-5"
                  >
                    <span
                      aria-hidden
                      className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                      style={{ background: "radial-gradient(120% 80% at 0% 0%, color-mix(in srgb, var(--brand) 18%, transparent), transparent 70%)" }}
                    />
                    <div className="relative flex items-start justify-between gap-3">
                      <TechIcon
                        name={tech.name}
                        icon={tech.icon}
                        className="size-7 text-paper/70 transition-colors duration-500 group-hover:text-[var(--brand)]"
                      />
                      <span className="font-mono text-[0.7rem] text-muted tabular-nums">
                        {tech.projectCount} {tech.projectCount === 1 ? "proyecto" : "proyectos"}
                      </span>
                    </div>
                    <p className="relative mt-6 font-medium">{tech.name}</p>
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
