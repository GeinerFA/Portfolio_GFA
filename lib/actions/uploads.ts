"use server";

import { z } from "zod";
import { UnauthorizedError, requireAdmin } from "@/lib/auth-guard";
import { createUploadSignature, type UploadSignature } from "@/lib/cloudinary";

export type SignatureResult = { ok: true; data: UploadSignature } | { ok: false; message: string };

/** Firma una subida a Cloudinary. Solo el admin puede obtenerla (la firma vence en 1 hora). */
export async function getUploadSignature(target: "avatar" | "projects" | "cv"): Promise<SignatureResult> {
  try {
    await requireAdmin();
  } catch (error) {
    if (error instanceof UnauthorizedError) return { ok: false, message: "No autorizado." };
    throw error;
  }
  const parsed = z.enum(["avatar", "projects", "cv"]).safeParse(target);
  if (!parsed.success) return { ok: false, message: "Destino inválido." };

  const data = createUploadSignature(parsed.data);
  if (!data) return { ok: false, message: "Cloudinary no está configurado (faltan variables de entorno)." };
  return { ok: true, data };
}
