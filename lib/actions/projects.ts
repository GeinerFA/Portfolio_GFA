"use server";

import { asc, eq, sql } from "drizzle-orm";
import { redirect } from "next/navigation";
import { z } from "zod";
import { projectTechnologies, projects } from "@/lib/db/schema";
import { slugify } from "@/lib/utils";
import {
  adminAction,
  checkbox,
  hexColor,
  idSchema,
  optionalUrl,
  revalidateSite,
  slugSchema,
  uniqueViolation,
  validationError,
  type ActionState,
} from "./shared";

const currentYear = new Date().getFullYear();

const projectSchema = z.object({
  title: z.string().trim().min(1, "El título es obligatorio").max(160),
  slug: slugSchema,
  summary: z.string().trim().max(300, "Máximo 300 caracteres"),
  description: z.string().trim().max(20000),
  coverUrl: optionalUrl,
  previewVideoUrl: optionalUrl,
  gallery: z.array(optionalUrl).transform((list) => list.filter((u): u is string => u !== null)),
  repoUrl: optionalUrl,
  liveUrl: optionalUrl,
  year: z.coerce.number().int("Año inválido").min(1990, "Año inválido").max(currentYear + 1, "Año inválido"),
  accentColor: hexColor,
  isFeatured: checkbox,
  isPublished: checkbox,
  technologyIds: z.array(idSchema),
});

function readProjectForm(formData: FormData) {
  const title = String(formData.get("title") ?? "");
  const rawSlug = String(formData.get("slug") ?? "").trim();
  return {
    title,
    slug: rawSlug ? slugify(rawSlug) : slugify(title),
    summary: formData.get("summary") ?? "",
    description: formData.get("description") ?? "",
    coverUrl: formData.get("coverUrl") ?? "",
    previewVideoUrl: formData.get("previewVideoUrl") ?? "",
    gallery: formData.getAll("gallery").map(String),
    repoUrl: formData.get("repoUrl") ?? "",
    liveUrl: formData.get("liveUrl") ?? "",
    year: formData.get("year") ?? currentYear,
    accentColor: formData.get("accentColor") ?? "",
    isFeatured: formData.get("isFeatured") ?? "",
    isPublished: formData.get("isPublished") ?? "",
    technologyIds: [...new Set(formData.getAll("technologyIds").map(String))],
  };
}

/** Crea o actualiza un proyecto (si el form trae `id`, actualiza). */
export async function saveProject(_prev: ActionState, formData: FormData): Promise<ActionState> {
  return adminAction(async (db) => {
    const rawId = formData.get("id");
    const id = rawId ? idSchema.parse(rawId) : null;

    const parsed = projectSchema.safeParse(readProjectForm(formData));
    if (!parsed.success) return validationError(parsed.error);
    const { technologyIds, ...values } = parsed.data;

    let projectId: number;
    try {
      if (id) {
        const relations = technologyIds.map((technologyId) => ({ projectId: id, technologyId }));
        // Neon HTTP: `batch` se ejecuta en una sola transacción.
        await db.batch([
          db.update(projects).set(values).where(eq(projects.id, id)),
          db.delete(projectTechnologies).where(eq(projectTechnologies.projectId, id)),
          ...(relations.length ? [db.insert(projectTechnologies).values(relations)] : []),
        ]);
        projectId = id;
      } else {
        const [{ max } = { max: 0 }] = await db
          .select({ max: sql<number>`coalesce(max(${projects.sortOrder}), 0)::int` })
          .from(projects);
        const [created] = await db
          .insert(projects)
          .values({ ...values, sortOrder: max + 1 })
          .returning({ id: projects.id });
        if (!created) throw new Error("No se pudo crear el proyecto");
        projectId = created.id;
        if (technologyIds.length) {
          await db
            .insert(projectTechnologies)
            .values(technologyIds.map((technologyId) => ({ projectId, technologyId })));
        }
      }
    } catch (error) {
      if (uniqueViolation(error)) {
        return { ok: false, message: "Revisa los campos marcados.", errors: { slug: ["Ya existe un proyecto con ese slug"] } };
      }
      throw error;
    }

    revalidateSite();
    if (!id) redirect(`/admin/proyectos/${projectId}?creado=1`);
    return { ok: true, message: "Proyecto guardado." };
  });
}

export async function deleteProject(rawId: number): Promise<ActionState> {
  return adminAction(async (db) => {
    const id = idSchema.parse(rawId);
    // project_technologies se elimina en cascada.
    await db.delete(projects).where(eq(projects.id, id));
    revalidateSite();
    return { ok: true, message: "Proyecto eliminado." };
  });
}

export async function toggleProjectFlag(rawId: number, flag: "isPublished" | "isFeatured"): Promise<ActionState> {
  return adminAction(async (db) => {
    const id = idSchema.parse(rawId);
    const column = z.enum(["isPublished", "isFeatured"]).parse(flag) === "isPublished" ? projects.isPublished : projects.isFeatured;
    await db
      .update(projects)
      .set({ [flag]: sql`not ${column}` })
      .where(eq(projects.id, id));
    revalidateSite();
    return { ok: true };
  });
}

/** Sube o baja un proyecto en el orden y normaliza sort_order a 1..n. */
export async function moveProject(rawId: number, direction: "up" | "down"): Promise<ActionState> {
  return adminAction(async (db) => {
    const id = idSchema.parse(rawId);
    const dir = z.enum(["up", "down"]).parse(direction);
    const rows = await db
      .select({ id: projects.id })
      .from(projects)
      .orderBy(asc(projects.sortOrder), asc(projects.id));
    const ids = rows.map((r) => r.id);
    const from = ids.indexOf(id);
    const to = dir === "up" ? from - 1 : from + 1;
    if (from === -1 || to < 0 || to >= ids.length) return { ok: true };
    [ids[from], ids[to]] = [ids[to]!, ids[from]!];

    const [first, ...rest] = ids.map((projectId, i) =>
      db.update(projects).set({ sortOrder: i + 1 }).where(eq(projects.id, projectId)),
    );
    if (first) await db.batch([first, ...rest]);
    revalidateSite();
    return { ok: true };
  });
}
