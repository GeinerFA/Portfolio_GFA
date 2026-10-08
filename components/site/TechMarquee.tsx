import type { Technology } from "@/lib/data/types";
import { TechIcon, resolveTechIcon } from "./TechIcon";

function Item({ tech }: { tech: Technology }) {
  const hasIcon = Boolean(resolveTechIcon(tech.icon) || (tech.icon && /^(https?:|\/)/.test(tech.icon)));
  if (!hasIcon) {
    return (
      <span className="text-display inline-flex items-center rounded-full border border-line px-5 py-2 text-[clamp(1.25rem,2.5vw,2rem)]">
        {tech.name}
      </span>
    );
  }
  return (
    <span className="text-display inline-flex items-center gap-4 text-[clamp(1.5rem,3.5vw,3rem)]">
      <TechIcon name={tech.name} icon={tech.icon} className="size-[0.8em]" />
      {tech.name}
    </span>
  );
}

/** Marquee infinito de tecnologías (CSS puro; se detiene con prefers-reduced-motion). */
export function TechMarquee({ technologies }: { technologies: Technology[] }) {
  if (technologies.length === 0) return null;
  // Se repite la lista hasta tener suficiente contenido para cubrir pantallas anchas.
  const minItems = 10;
  const base = Array.from({ length: Math.ceil(minItems / technologies.length) }, () => technologies).flat();
  const duration = Math.max(25, base.length * 4);

  return (
    <section aria-label="Tecnologías que uso" className="marquee overflow-hidden border-y border-line py-8 md:py-10">
      <div
        className="marquee-track flex w-max items-center"
        style={{ ["--marquee-duration" as string]: `${duration}s` }}
      >
        {[0, 1].map((copy) => (
          <ul key={copy} aria-hidden={copy === 1} className="flex shrink-0 items-center">
            {base.map((tech, i) => (
              <li key={`${tech.id}-${i}`} className="flex items-center pr-12 text-paper/80 md:pr-20">
                <Item tech={tech} />
              </li>
            ))}
          </ul>
        ))}
      </div>
    </section>
  );
}
