"use client";

import Link from "next/link";
import { saveProject } from "@/lib/actions/projects";
import type { Project, Technology } from "@/lib/data/types";
import { ColorField, GalleryField, ImageUrlField, TitleSlugFields } from "./fields";
import { Card, Field, FormMessage, SubmitButton, Switch, fieldProps, inputClass, useActionForm } from "./form";
import { TechMultiSelect } from "./TechMultiSelect";

export function ProjectForm({ project, technologies }: { project?: Project; technologies: Technology[] }) {
  const { state, pending, onSubmit } = useActionForm(saveProject);
  const errors = state.errors;

  return (
    <form onSubmit={onSubmit} className="grid gap-6 lg:grid-cols-3" noValidate>
      {project && <input type="hidden" name="id" value={project.id} />}

      <div className="flex flex-col gap-6 lg:col-span-2">
        <Card title="Información" description="Nombre, slug y textos del proyecto.">
          <TitleSlugFields defaultTitle={project?.title} defaultSlug={project?.slug} errors={errors} />
          <Field label="Resumen" name="summary" errors={errors} hint="Una línea. Se muestra en la lista y en las tarjetas.">
            <input {...fieldProps("summary", errors)} defaultValue={project?.summary} maxLength={300} className={inputClass} />
          </Field>
          <Field label="Descripción" name="description" errors={errors} hint="Separa párrafos con una línea en blanco.">
            <textarea {...fieldProps("description", errors)} defaultValue={project?.description} rows={8} className={inputClass} />
          </Field>
        </Card>

        <Card title="Enlaces" description='Se muestran como botones "Ver código" y "Ver sitio". Si los dejas vacíos, se ocultan.'>
          <div className="grid gap-5 md:grid-cols-2">
            <Field label="Repositorio (GitHub)" name="repoUrl" errors={errors}>
              <input {...fieldProps("repoUrl", errors)} defaultValue={project?.repoUrl ?? ""} placeholder="https://github.com/…" inputMode="url" className={inputClass} />
            </Field>
            <Field label="Sitio en vivo" name="liveUrl" errors={errors}>
              <input {...fieldProps("liveUrl", errors)} defaultValue={project?.liveUrl ?? ""} placeholder="https://…" inputMode="url" className={inputClass} />
            </Field>
          </div>
        </Card>

        <Card title="Multimedia" description="Imágenes por URL. Más adelante se podrá subir archivos con Vercel Blob.">
          <ImageUrlField name="coverUrl" label="Portada" defaultValue={project?.coverUrl} errors={errors} />
          <ImageUrlField
            name="previewVideoUrl"
            label="Video de preview (opcional)"
            kind="video"
            defaultValue={project?.previewVideoUrl}
            errors={errors}
            hint="MP4/WebM corto y liviano. Se reproduce al pasar el cursor por el proyecto."
          />
          <GalleryField defaultValue={project?.gallery ?? []} errors={errors} />
        </Card>
      </div>

      <div className="flex flex-col gap-6">
        <Card title="Publicación">
          <Switch name="isPublished" label="Publicado" description="Visible en el sitio público." defaultChecked={project?.isPublished} />
          <Switch name="isFeatured" label="Destacado" description="Aparece en la sección Destacados." defaultChecked={project?.isFeatured} />
        </Card>

        <Card title="Detalles">
          <Field label="Año" name="year" errors={errors}>
            <input
              {...fieldProps("year", errors)}
              type="number"
              inputMode="numeric"
              defaultValue={project?.year ?? new Date().getFullYear()}
              className={inputClass}
            />
          </Field>
          <ColorField
            name="accentColor"
            label="Color de acento"
            defaultValue={project?.accentColor}
            errors={errors}
            hint="Resalta la fila del proyecto al pasar el cursor."
          />
        </Card>

        <Card title="Stack">
          <TechMultiSelect technologies={technologies} defaultSelected={project?.technologies.map((t) => t.id) ?? []} />
        </Card>

        <div className="sticky bottom-4 flex flex-col gap-3 rounded-2xl border border-line bg-ink/90 p-4 backdrop-blur">
          <FormMessage state={state} />
          <div className="flex items-center justify-between gap-3">
            <Link href="/admin/proyectos" className="text-sm text-muted hover:text-paper">
              Cancelar
            </Link>
            <SubmitButton pending={pending}>{project ? "Guardar cambios" : "Crear proyecto"}</SubmitButton>
          </div>
        </div>
      </div>
    </form>
  );
}
