"use client";

import { saveProfile } from "@/lib/actions/profile";
import type { Profile } from "@/lib/data/types";
import { ImageUrlField } from "./fields";
import { Card, Field, FormMessage, SubmitButton, Switch, fieldProps, inputClass, useActionForm } from "./form";

export function ProfileForm({ profile }: { profile: Profile }) {
  const { state, pending, onSubmit } = useActionForm(saveProfile);
  const errors = state.errors;

  return (
    <form onSubmit={onSubmit} className="flex max-w-3xl flex-col gap-6" noValidate>
      <Card title="Datos principales">
        <div className="grid gap-5 md:grid-cols-2">
          <Field label="Nombre completo" name="fullName" errors={errors}>
            <input {...fieldProps("fullName", errors)} defaultValue={profile.fullName} required className={inputClass} />
          </Field>
          <Field label="Rol" name="role" errors={errors}>
            <input {...fieldProps("role", errors)} defaultValue={profile.role} required className={inputClass} />
          </Field>
          <Field label="Correo de contacto" name="email" errors={errors}>
            <input {...fieldProps("email", errors)} type="email" defaultValue={profile.email ?? ""} className={inputClass} />
          </Field>
          <Field label="Ubicación" name="location" errors={errors}>
            <input {...fieldProps("location", errors)} defaultValue={profile.location ?? ""} className={inputClass} />
          </Field>
        </div>
        <Field label="Titular" name="headline" errors={errors} hint="Frase corta bajo tu nombre en el Hero.">
          <input {...fieldProps("headline", errors)} defaultValue={profile.headline ?? ""} className={inputClass} />
        </Field>
        <Field label="Biografía" name="bio" errors={errors} hint="Se revela palabra por palabra en la sección Sobre mí.">
          <textarea {...fieldProps("bio", errors)} defaultValue={profile.bio ?? ""} rows={6} className={inputClass} />
        </Field>
        <Switch name="isAvailable" label="Disponible para proyectos" description='Muestra el badge con pulso en el Hero.' defaultChecked={profile.isAvailable} />
      </Card>

      <Card title="Archivos">
        <ImageUrlField name="avatarUrl" label="Foto (opcional)" defaultValue={profile.avatarUrl} errors={errors} />
        <Field
          label="Link del CV"
          name="cvUrl"
          errors={errors}
          hint={
            <>
              Un PDF en <code>/public</code> (ej. <code>/cv.pdf</code>) o un link de Google Drive (compártelo como
              &quot;Cualquier persona con el enlace&quot;; se convierte en descarga directa). Vacío = se oculta el botón.
            </>
          }
        >
          <input {...fieldProps("cvUrl", errors)} defaultValue={profile.cvUrl ?? ""} placeholder="/cv.pdf o https://drive.google.com/…" className={inputClass} />
        </Field>
      </Card>

      <FormMessage state={state} />
      <div className="flex justify-end">
        <SubmitButton pending={pending}>Guardar perfil</SubmitButton>
      </div>
    </form>
  );
}
