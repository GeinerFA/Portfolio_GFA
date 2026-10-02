"use client";

import { saveSocials } from "@/lib/actions/socials";
import type { SocialLink, SocialPlatform } from "@/lib/data/types";
import { SOCIAL_META, SocialIcon } from "@/components/site/SocialIcon";
import { FormMessage, SubmitButton, inputClass, useActionForm } from "./form";

const PLACEHOLDERS: Record<SocialPlatform, string> = {
  instagram: "https://instagram.com/usuario",
  whatsapp: "https://wa.me/50688888888",
  github: "https://github.com/usuario",
  linkedin: "https://linkedin.com/in/usuario",
};

const HINTS: Partial<Record<SocialPlatform, string>> = {
  whatsapp: "Formato: https://wa.me/ + código de país + número, sin espacios ni +. Puedes añadir ?text=Hola",
};

export function SocialsForm({ socials, platforms }: { socials: SocialLink[]; platforms: readonly SocialPlatform[] }) {
  const { state, pending, onSubmit } = useActionForm(saveSocials);

  return (
    <form onSubmit={onSubmit} className="flex max-w-3xl flex-col gap-4" noValidate>
      {platforms.map((platform, i) => {
        const current = socials.find((s) => s.platform === platform);
        const error = state.errors?.[`${platform}.url`]?.[0];
        return (
          <fieldset key={platform} className="rounded-2xl border border-line bg-ink-2/40 p-5">
            <legend className="sr-only">{SOCIAL_META[platform].label}</legend>
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="flex size-10 items-center justify-center rounded-full border border-line">
                  <SocialIcon platform={platform} className="size-4" />
                </span>
                <span className="font-medium">{SOCIAL_META[platform].label}</span>
              </div>
              <label className="flex cursor-pointer items-center gap-2 text-sm text-muted">
                <input
                  type="checkbox"
                  name={`${platform}.isVisible`}
                  defaultChecked={current?.isVisible ?? true}
                  className="size-4 accent-[var(--color-accent)]"
                />
                Visible
              </label>
            </div>
            <input type="hidden" name={`${platform}.sortOrder`} value={current?.sortOrder ?? i + 1} />
            <div className="mt-4 grid gap-3 md:grid-cols-3">
              <div className="md:col-span-2">
                <label htmlFor={`${platform}.url`} className="sr-only">
                  URL de {SOCIAL_META[platform].label}
                </label>
                <input
                  id={`${platform}.url`}
                  name={`${platform}.url`}
                  defaultValue={current?.url ?? ""}
                  placeholder={PLACEHOLDERS[platform]}
                  inputMode="url"
                  aria-invalid={Boolean(error) || undefined}
                  className={inputClass}
                />
              </div>
              <div>
                <label htmlFor={`${platform}.label`} className="sr-only">
                  Etiqueta
                </label>
                <input
                  id={`${platform}.label`}
                  name={`${platform}.label`}
                  defaultValue={current?.label ?? ""}
                  placeholder={`Etiqueta (${SOCIAL_META[platform].label})`}
                  className={inputClass}
                />
              </div>
            </div>
            {error ? (
              <p className="mt-2 text-xs text-red-400">{error}</p>
            ) : (
              HINTS[platform] && <p className="mt-2 text-xs text-muted">{HINTS[platform]}</p>
            )}
          </fieldset>
        );
      })}

      <FormMessage state={state} />
      <div className="flex justify-end">
        <SubmitButton pending={pending}>Guardar redes</SubmitButton>
      </div>
    </form>
  );
}
