"use server";

import { headers } from "next/headers";
import { z } from "zod";
import { isMailConfigured, sendContactEmail } from "@/lib/mail";
import { validationError, type ActionState } from "./shared";

const contactSchema = z.object({
  name: z.string().trim().min(2, "Escribe tu nombre").max(100, "Máximo 100 caracteres"),
  email: z.string().trim().email("Correo inválido").max(200),
  subject: z
    .string()
    .trim()
    .max(150, "Máximo 150 caracteres")
    .transform((v) => (v === "" ? null : v)),
  message: z.string().trim().min(10, "El mensaje es muy corto (mínimo 10 caracteres)").max(5000, "Máximo 5000 caracteres"),
});

// Límite simple en memoria: 5 envíos cada 10 minutos por IP (por instancia del servidor).
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 5;
const hits = new Map<string, number[]>();

function rateLimited(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  if (recent.length >= MAX_PER_WINDOW) {
    hits.set(ip, recent);
    return true;
  }
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5000) hits.clear();
  return false;
}

/** Acción pública del formulario de contacto: valida, filtra bots y te envía el mensaje por correo. */
export async function sendContactMessage(_prev: ActionState, formData: FormData): Promise<ActionState> {
  // Honeypot: campo oculto que solo rellenan los bots. Se finge éxito para no darles pistas.
  if (String(formData.get("hp_trap") ?? "") !== "") {
    console.warn("[contacto] Envío descartado por el honeypot (probable bot).");
    return { ok: true, message: "¡Mensaje enviado! Te responderé pronto." };
  }

  // Envíos instantáneos (menos de 3 s desde que se cargó el formulario) suelen ser bots.
  const startedAt = Number(formData.get("startedAt"));
  if (Number.isFinite(startedAt) && startedAt > 0 && Date.now() - startedAt < 3000) {
    return { ok: false, message: "Espera un momento antes de enviar." };
  }

  const parsed = contactSchema.safeParse({
    name: formData.get("name") ?? "",
    email: formData.get("email") ?? "",
    subject: formData.get("subject") ?? "",
    message: formData.get("message") ?? "",
  });
  if (!parsed.success) return validationError(parsed.error);

  if (!isMailConfigured()) {
    console.warn("[contacto] RESEND_API_KEY no está configurada; el mensaje no se envió.");
    return { ok: false, message: "El formulario no está disponible ahora mismo. Escríbeme directamente por correo." };
  }

  const h = await headers();
  const ip = h.get("x-forwarded-for")?.split(",")[0]?.trim() || h.get("x-real-ip") || "local";
  if (rateLimited(ip)) return { ok: false, message: "Has enviado varios mensajes seguidos. Inténtalo más tarde." };

  try {
    await sendContactEmail(parsed.data);
    console.info(`[contacto] Mensaje de ${parsed.data.email} enviado a tu correo.`);
    return { ok: true, message: "¡Mensaje enviado! Te responderé pronto." };
  } catch (error) {
    console.error("[contacto] Error al enviar el correo:", error);
    return { ok: false, message: "No se pudo enviar el mensaje. Inténtalo de nuevo o escríbeme por correo." };
  }
}
