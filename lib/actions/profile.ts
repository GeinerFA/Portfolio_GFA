"use server";

import { z } from "zod";
import { profile } from "@/lib/db/schema";
import { adminAction, checkbox, optionalText, optionalUrl, revalidateSite, validationError, type ActionState } from "./shared";

const profileSchema = z.object({
  fullName: z.string().trim().min(1, "El nombre es obligatorio").max(120),
  role: z.string().trim().min(1, "El rol es obligatorio").max(120),
  headline: optionalText,
  bio: optionalText,
  email: z
    .string()
    .trim()
    .refine((v) => v === "" || z.email().safeParse(v).success, "Correo inválido")
    .transform((v) => (v === "" ? null : v)),
  location: optionalText,
  avatarUrl: optionalUrl,
  cvUrl: optionalUrl,
  isAvailable: checkbox,
});

export async function saveProfile(_prev: ActionState, formData: FormData): Promise<ActionState> {
  return adminAction(async (db) => {
    const field = (name: string) => formData.get(name) ?? "";
    const parsed = profileSchema.safeParse({
      fullName: field("fullName"),
      role: field("role"),
      headline: field("headline"),
      bio: field("bio"),
      email: field("email"),
      location: field("location"),
      avatarUrl: field("avatarUrl"),
      cvUrl: field("cvUrl"),
      isAvailable: field("isAvailable"),
    });
    if (!parsed.success) return validationError(parsed.error);

    // La tabla tiene una única fila (id = 1).
    await db
      .insert(profile)
      .values({ id: 1, ...parsed.data })
      .onConflictDoUpdate({ target: profile.id, set: parsed.data });

    revalidateSite();
    return { ok: true, message: "Perfil guardado." };
  });
}
