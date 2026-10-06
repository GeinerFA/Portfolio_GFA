import { ArrowUpRight, Mail } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa6";
import { Magnetic } from "@/components/motion/Magnetic";
import { Reveal } from "@/components/motion/Reveal";
import { SplitText } from "@/components/motion/SplitText";
import type { Profile, SocialLink } from "@/lib/data/types";
import { SOCIAL_META, SocialIcon } from "./SocialIcon";

export function Contact({ profile, socials }: { profile: Profile; socials: SocialLink[] }) {
  const whatsapp = socials.find((s) => s.platform === "whatsapp");

  return (
    <section id="contacto" className="relative scroll-mt-24 overflow-hidden border-t border-line py-24 md:py-36">
      <div className="container-x">
        <p className="font-mono text-xs uppercase tracking-[0.25em] text-muted">
          <span className="text-accent">05</span> — Contacto
        </p>

        <h2 className="text-display mt-6 text-[clamp(3.5rem,14vw,14rem)] leading-[0.85]">
          <SplitText text="Hablemos" stagger={0.05} />
        </h2>

        <div className="mt-14 flex flex-col gap-10 md:mt-20 md:flex-row md:items-center md:justify-between">
          <Reveal className="flex flex-wrap items-center gap-6">
            {whatsapp && (
              <Magnetic strength={0.4}>
                <a
                  href={whatsapp.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex size-40 flex-col items-center justify-center gap-2 rounded-full bg-accent text-ink transition-transform duration-500 ease-out-expo hover:scale-105 md:size-48"
                >
                  <FaWhatsapp className="size-8 transition-transform duration-500 group-hover:rotate-12" aria-hidden />
                  <span className="font-medium">Escríbeme</span>
                </a>
              </Magnetic>
            )}
            {profile.email && (
              <a
                href={`mailto:${profile.email}`}
                className="group inline-flex items-center gap-3 text-[clamp(1.25rem,3vw,2.25rem)] font-medium"
              >
                <Mail className="size-[0.9em] text-muted" aria-hidden />
                <span className="relative">
                  {profile.email}
                  <span className="absolute inset-x-0 -bottom-1 h-px origin-left bg-paper/30 transition-colors group-hover:bg-accent" />
                </span>
              </a>
            )}
          </Reveal>
        </div>

        {socials.length > 0 && (
          <Reveal delay={0.1}>
            <ul className="mt-20 grid grid-cols-2 border-l border-t border-line md:grid-cols-4">
              {socials.map((s) => (
                <li key={s.id} className="border-b border-r border-line">
                  <a
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative flex h-full flex-col justify-between gap-10 overflow-hidden p-5 md:p-7"
                  >
                    <span className="absolute inset-0 origin-bottom scale-y-0 bg-paper transition-transform duration-500 ease-out-expo group-hover:scale-y-100" />
                    <span className="relative flex items-center justify-between transition-colors duration-500 group-hover:text-ink">
                      <SocialIcon platform={s.platform} className="size-6" />
                      <ArrowUpRight
                        className="size-5 transition-transform duration-500 group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:rotate-0 md:-rotate-45"
                        aria-hidden
                      />
                    </span>
                    <span className="text-display relative text-2xl transition-colors duration-500 group-hover:text-ink md:text-3xl">
                      {s.label || SOCIAL_META[s.platform].label}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </Reveal>
        )}
      </div>
    </section>
  );
}
