"use client";

import Link from "next/link";
import { saveTechnology } from "@/lib/actions/technologies";
import { TECH_CATEGORY_LABELS, type TechCategory, type Technology } from "@/lib/data/types";
import { ColorField, TitleSlugFields } from "./fields";
import { Card, Field, FormMessage, SubmitButton, fieldProps, inputClass, useActionForm } from "./form";

export function TechForm({ technology }: { technology?: Technology }) {
  const { state, pending, onSubmit } = useActionForm(saveTechnology);
  const errors = state.errors;

  return (
    <form onSubmit={onSubmit} className="flex max-w-3xl flex-col gap-6" noValidate>
      {technology && <input type="hidden" name="id" value={technology.id} />}

      <Card title="Tecnología">
        <TitleSlugFields
          titleLabel="Nombre"
          titleName="name"
          defaultTitle={technology?.name}
          defaultSlug={technology?.slug}
          errors={errors}
        />
        <div className="grid gap-5 md:grid-cols-2">
          <Field label="Categoría" name="category" errors={errors}>
            <select {...fieldProps("category", errors)} defaultValue={technology?.category ?? "frontend"} className={inputClass}>
              {(Object.keys(TECH_CATEGORY_LABELS) as TechCategory[]).map((c) => (
                <option key={c} value={c}>
                  {TECH_CATEGORY_LABELS[c]}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Orden" name="sortOrder" errors={errors} hint="Menor = aparece primero. Vacío = al final.">
            <input
              {...fieldProps("sortOrder", errors)}
              type="number"
              min={0}
              defaultValue={technology?.sortOrder ?? ""}
              className={inputClass}
            />
          </Field>
        </div>
        <Field
          label="Ícono"
          name="icon"
          errors={errors}
          hint={
            <>
              Nombre de{" "}
              <a href="https://react-icons.github.io/react-icons/icons/si/" target="_blank" rel="noopener noreferrer" className="underline hover:text-paper">
                Simple Icons
              </a>{" "}
              (ej. <code>SiReact</code> o <code>react</code>) o URL de una imagen. Vacío = se muestra un badge con el nombre.
            </>
          }
        >
          <input {...fieldProps("icon", errors)} defaultValue={technology?.icon ?? ""} placeholder="SiReact" className={`${inputClass} font-mono`} />
        </Field>
        <ColorField
          name="color"
          label="Color de marca"
          allowEmpty
          defaultValue={technology?.color}
          errors={errors}
          hint="Se usa al pasar el cursor en la sección Tecnologías."
        />
      </Card>

      <FormMessage state={state} />
      <div className="flex items-center justify-end gap-4">
        <Link href="/admin/tecnologias" className="text-sm text-muted hover:text-paper">
          Cancelar
        </Link>
        <SubmitButton pending={pending}>{technology ? "Guardar cambios" : "Crear tecnología"}</SubmitButton>
      </div>
    </form>
  );
}
