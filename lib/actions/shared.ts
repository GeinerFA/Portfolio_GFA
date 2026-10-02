import "server-only";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { UnauthorizedError, requireAdmin } from "@/lib/auth-guard";
import { db, type Database } from "@/lib/db";

import type { ActionState } from "./state";

export type { ActionState };

/** Revalida todo el sitio público (home, detalles, sitemap y OG) tras un cambio. */
export function revalidateSite() {
  revalidatePath("/", "layout");
}

/**
 * Envoltorio obligatorio para las Server Actions del admin:
 * 1) valida la sesión y el correo de ADMIN_EMAIL, 2) exige base de datos,
 * 3) convierte errores en mensajes legibles.
 */
export async function adminAction(fn: (db: Database) => Promise<ActionState>): Promise<ActionState> {
  try {
    await requireAdmin();
    if (!db) return { ok: false, message: "La base de datos no está configurada (DATABASE_URL)." };
    return await fn(db);
  } catch (error) {
    if (error instanceof UnauthorizedError) return { ok: false, message: "No autorizado." };
    // redirect() y notFound() lanzan errores especiales que Next debe recibir.
    if (isNextControlFlow(error)) throw error;
    console.error("[admin] Error en acción:", error);
    return { ok: false, message: "Ocurrió un error al guardar. Revisa los datos e inténtalo de nuevo." };
  }
}

function isNextControlFlow(error: unknown) {
  const digest = (error as { digest?: unknown } | null)?.digest;
  return typeof digest === "string" && (digest.startsWith("NEXT_REDIRECT") || digest.startsWith("NEXT_HTTP_ERROR"));
}

/** Detecta violaciones de UNIQUE de Postgres (código 23505), también envueltas por Drizzle. */
export function uniqueViolation(error: unknown): string | null {
  let current: unknown = error;
  for (let i = 0; i < 4 && current; i++) {
    const e = current as { code?: string; constraint?: string; cause?: unknown };
    if (e.code === "23505") return e.constraint ?? "unique";
    current = e.cause;
  }
  return null;
}

export function validationError(error: z.ZodError): ActionState {
  return {
    ok: false,
    message: "Revisa los campos marcados.",
    errors: z.flattenError(error).fieldErrors as Record<string, string[]>,
  };
}

// ─── Helpers de validación ─────────────────────────────────────────

const trimmed = z.string().trim();

/** Texto opcional: cadena vacía → null. */
export const optionalText = trimmed.transform((v) => (v === "" ? null : v));

/** URL opcional (http/https o ruta local que empiece con "/"). */
export const optionalUrl = trimmed
  .refine((v) => v === "" || v.startsWith("/") || /^https?:\/\/\S+$/i.test(v), "Debe ser una URL (https://…) o una ruta que empiece con /")
  .transform((v) => (v === "" ? null : v));

export const hexColor = trimmed.regex(/^#([0-9a-f]{3}|[0-9a-f]{6})$/i, "Color hex inválido (ej. #c6ff3d)");

export const slugSchema = trimmed
  .min(1, "El slug es obligatorio")
  .max(120)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Solo minúsculas, números y guiones");

export const checkbox = z
  .union([z.literal("on"), z.literal("true"), z.literal("")])
  .optional()
  .transform((v) => v === "on" || v === "true");

export const idSchema = z.coerce.number().int().positive();
