import { Reveal } from "@/components/motion/Reveal";
import { cn } from "@/lib/utils";

export function SectionHeading({
  index,
  eyebrow,
  title,
  aside,
  className,
}: {
  index: string;
  eyebrow: string;
  title: string;
  aside?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col gap-6 md:flex-row md:items-end md:justify-between", className)}>
      <Reveal>
        <p className="font-mono text-xs uppercase tracking-[0.25em] text-muted">
          <span className="text-accent">{index}</span> — {eyebrow}
        </p>
        <h2 className="text-display mt-4 text-[clamp(2.75rem,8vw,7.5rem)]">{title}</h2>
      </Reveal>
      {aside && <Reveal delay={0.1}>{aside}</Reveal>}
    </div>
  );
}
