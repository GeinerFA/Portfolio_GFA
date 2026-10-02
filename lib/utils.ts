import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Convierte un texto en slug URL-safe: "Mi Proyecto Ñandú" → "mi-proyecto-nandu". */
export function slugify(input: string): string {
  return input
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * Convierte un link de Google Drive ("/file/d/ID/view" u "open?id=ID") en un link de descarga directa.
 * Cualquier otra URL (p. ej. "/cv.pdf") se devuelve igual.
 */
export function toDownloadUrl(url: string): string {
  if (!/^https:\/\/drive\.google\.com\//.test(url)) return url;
  const id = url.match(/\/file\/d\/([\w-]+)/)?.[1] ?? new URL(url).searchParams.get("id");
  return id ? `https://drive.google.com/uc?export=download&id=${id}` : url;
}

/** Iniciales de un nombre: "Geiner Fallas Araya" → "GFA" (máximo 3 letras). */
export function initials(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .map((word) => word[0] ?? "")
    .join("")
    .slice(0, 3)
    .toUpperCase();
}
