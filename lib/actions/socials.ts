"use server";

import { z } from "zod";
import { SOCIAL_PLATFORMS, socialLinks } from "@/lib/db/schema";
import { adminAction, checkbox, optionalText, revalidateSite, type ActionState } from "./shared";

const urlOrEmpty = z
  .string()
  .trim()
  .refine((v) => v === "" || /^https?:\/\/\S+$/i.test(v), "Debe empezar con https://");

const socialSchema = z.object({
  url: urlOrEmpty,
  label: optionalText,
  isVisible: checkbox,
  sortOrder: z.coerce.number().int().min(0).max(1000),
});

/** Guarda las 4 redes de una vez (upsert por plataforma). */
export async function saveSocials(_prev: ActionState, formData: FormData): Promise<ActionState> {
  return adminAction(async (db) => {
    const errors: Record<string, string[]> = {};
    const rows = [];

    for (const [i, platform] of SOCIAL_PLATFORMS.entries()) {
      const parsed = socialSchema.safeParse({
        url: formData.get(`${platform}.url`) ?? "",
        label: formData.get(`${platform}.label`) ?? "",
        isVisible: formData.get(`${platform}.isVisible`) ?? "",
        sortOrder: formData.get(`${platform}.sortOrder`) || i + 1,
      });
      if (!parsed.success) {
        errors[`${platform}.url`] = parsed.error.issues.map((issue) => issue.message);
        continue;
      }
      // Sin URL la red no se muestra en el sitio.
      rows.push({ platform, ...parsed.data, isVisible: parsed.data.isVisible && parsed.data.url !== "" });
    }
    if (Object.keys(errors).length) return { ok: false, message: "Revisa los campos marcados.", errors };

    const [first, ...rest] = rows.map((row) =>
      db
        .insert(socialLinks)
        .values(row)
        .onConflictDoUpdate({
          target: socialLinks.platform,
          set: { url: row.url, label: row.label, isVisible: row.isVisible, sortOrder: row.sortOrder },
        }),
    );
    if (first) await db.batch([first, ...rest]);

    revalidateSite();
    return { ok: true, message: "Redes guardadas." };
  });
}
