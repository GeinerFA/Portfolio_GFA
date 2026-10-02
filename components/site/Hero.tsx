import { ArrowDown, MapPin } from "lucide-react";
import { Reveal } from "@/components/motion/Reveal";
import { SplitText } from "@/components/motion/SplitText";
import type { Profile, SocialLink } from "@/lib/data/types";
import { SOCIAL_META, SocialIcon } from "./SocialIcon";

export function Hero({ profile, socials }: { profile: Profile; socials: SocialLink[] }) {
  return (
    <section className="relative flex min-h-svh flex-col justify-end overflow-hidden pb-10 pt-32 md:pb-14">
      {/* Halo de fondo */}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-[20vw] -top-[20vw] size-[70vw] rounded-full opacity-[0.12] blur-[120px]"
        style={{ background: "var(--color-accent)" }}
      />

      <div className="container-x relative">
        <Reveal delay={0.2} y={20} className="mb-8 flex flex-wrap items-center gap-3 md:mb-12">
          {profile.isAvailable && (
            <span className="inline-flex items-center gap-2.5 rounded-full border border-line bg-ink-2/80 px-4 py-2 text-sm">
              <span className="relative flex size-2.5">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-accent opacity-75 motion-reduce:hidden" />
                <span className="relative inline-flex size-2.5 rounded-full bg-accent" />
              </span>
              Disponible para proyectos
            </span>
          )}
          {profile.location && (
            <span className="inline-flex items-center gap-1.5 text-sm text-muted">
              <MapPin className="size-4" aria-hidden />
              {profile.location}
            </span>
          )}
        </Reveal>

        <h1 className="text-display text-[clamp(3.25rem,13.5vw,14rem)]">
          <SplitText text={profile.fullName} delay={0.15} />
        </h1>

        <div className="mt-10 grid gap-10 border-t border-line pt-8 md:mt-14 md:grid-cols-12 md:items-end">
          <Reveal delay={0.6} className="md:col-span-4">
            <p className="font-mono text-xs uppercase tracking-[0.25em] text-muted">Rol</p>
            <p className="text-display mt-2 text-2xl md:text-3xl">{profile.role}</p>
          </Reveal>

          {profile.headline && (
            <Reveal delay={0.7} className="md:col-span-5">
              <p className="max-w-md text-lg leading-relaxed text-paper/70">{profile.headline}</p>
            </Reveal>
          )}

          <Reveal delay={0.8} className="flex items-center justify-between gap-6 md:col-span-3 md:flex-col md:items-end">
            {socials.length > 0 && (
              <ul className="flex gap-2" aria-label="Redes sociales">
                {socials.map((s) => (
                  <li key={s.id}>
                    <a
                      href={s.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={s.label || SOCIAL_META[s.platform].label}
                      className="group relative flex size-11 items-center justify-center overflow-hidden rounded-full border border-line transition-[border-color,transform] duration-500 ease-out-expo hover:-translate-y-1 hover:border-accent"
                    >
                      <span className="absolute inset-0 translate-y-full rounded-full bg-accent transition-transform duration-500 ease-out-expo group-hover:translate-y-0" />
                      <span className="relative block size-[1.1rem]">
                        <SocialIcon
                          platform={s.platform}
                          className="absolute inset-0 size-full transition-transform duration-500 ease-out-expo group-hover:-translate-y-[220%]"
                        />
                        <SocialIcon
                          platform={s.platform}
                          className="absolute inset-0 size-full translate-y-[220%] text-ink transition-transform duration-500 ease-out-expo group-hover:translate-y-0"
                        />
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            )}
            <a
              href="#proyectos"
              className="group inline-flex items-center gap-2 text-sm text-muted transition-colors hover:text-paper"
            >
              Ver proyectos
              <ArrowDown className="size-4 transition-transform group-hover:translate-y-1" aria-hidden />
            </a>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
