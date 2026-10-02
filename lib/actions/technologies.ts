"use server";

import { eq, sql } from "drizzle-orm";
import { redirect } from "next/navigation";
import { z } from "zod";
import { TECH_CATEGORIES, technologies } from "@/lib/db/schema";
import { slugify } from "@/lib/utils";
import {
  adminAction,
  hexColor,
  idSchema,
  optionalText,
  revalidateSite,
  slugSchema,
  uniqueViolation,
  validationError,
  type ActionState,
} from "./shared";

const techSchema = z.object({
  name: z.string().trim().min(1, "El nombre es obligatorio").max(80),
  slug: slugSchema,
  category: z.enum(TECH_CATEGORIES, { error: "Categoría inválida" }),
  icon: optionalText,
  color: z.union([z.literal("").transform(() => null), hexColor]),
  sortOrder: z.coerce.number().int().min(0).max(100000),
});

export async function saveTechnology(_prev: ActionState, formData: FormData): Promise<ActionState> {
  return adminAction(async (db) => {
    const rawId = formData.get("id");
    const id = rawId ? idSchema.parse(rawId) : null;
    const name = String(formData.get("name") ?? "");
    const rawSlug = String(formData.get("slug") ?? "").trim();

    const parsed = techSchema.safeParse({
      name,
      slug: rawSlug ? slugify(rawSlug) : slugify(name),
      category: formData.get("category"),
      icon: formData.get("icon") ?? "",
      color: String(formData.get("color") ?? "").trim(),
      sortOrder: formData.get("sortOrder") || 0,
    });
    if (!parsed.success) return validationError(parsed.error);

    try {
      if (id) {
        await db.update(technologies).set(parsed.data).where(eq(technologies.id, id));
      } else {
        const values = { ...parsed.data };
        if (!formData.get("sortOrder")) {
          const [row] = await db
            .select({ max: sql<number>`coalesce(max(${technologies.sortOrder}), 0)::int` })
            .from(technologies);
          values.sortOrder = (row?.max ?? 0) + 1;
        }
        await db.insert(technologies).values(values);
      }
    } catch (error) {
      const constraint = uniqueViolation(error);
      if (constraint) {
        const field = constraint.includes("name") ? "name" : "slug";
        return {
          ok: false,
          message: "Revisa los campos marcados.",
          errors: { [field]: [field === "name" ? "Ya existe una tecnología con ese nombre" : "Ese slug ya está en uso"] },
        };
      }
      throw error;
    }

    revalidateSite();
    if (!id) redirect("/admin/tecnologias?creada=1");
    return { ok: true, message: "Tecnología guardada." };
  });
}

export async function deleteTechnology(rawId: number): Promise<ActionState> {
  return adminAction(async (db) => {
    const id = idSchema.parse(rawId);
    // Las relaciones con proyectos se eliminan en cascada.
    await db.delete(technologies).where(eq(technologies.id, id));
    revalidateSite();
    return { ok: true, message: "Tecnología eliminada." };
  });
}
