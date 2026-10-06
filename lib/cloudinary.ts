import "server-only";
import { createHash } from "node:crypto";

/**
 * Cloudinary (subida firmada, sin SDK).
 * El navegador sube el archivo directo a Cloudinary con una firma generada aquí, así el archivo
 * no pasa por el servidor (las Server Actions tienen un límite de 1 MB por petición).
 *
 * Variables: CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET
 * (o CLOUDINARY_URL=cloudinary://API_KEY:API_SECRET@CLOUD_NAME, el formato que muestra el dashboard).
 */

function readConfig() {
  const fromUrl = process.env.CLOUDINARY_URL?.match(/^cloudinary:\/\/([^:]+):([^@]+)@(.+)$/);
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME || fromUrl?.[3];
  const apiKey = process.env.CLOUDINARY_API_KEY || fromUrl?.[1];
  const apiSecret = process.env.CLOUDINARY_API_SECRET || fromUrl?.[2];
  return cloudName && apiKey && apiSecret ? { cloudName, apiKey, apiSecret } : null;
}

export const isCloudinaryConfigured = () => readConfig() !== null;

/** Destinos de subida: carpeta en Cloudinary + tipo de recurso. */
export const UPLOAD_TARGETS = {
  avatar: { folder: "portfolio/perfil", resource: "image" },
  projects: { folder: "portfolio/proyectos", resource: "image" },
  // Los PDF se suben como "raw" (documento): como "image", Cloudinary bloquea la entrega de PDF por defecto.
  cv: { folder: "portfolio/cv", resource: "raw" },
} as const;
export type UploadTarget = keyof typeof UPLOAD_TARGETS;

export const ALLOWED_IMAGE_FORMATS = "jpg,jpeg,png,webp,avif,gif";

export interface UploadSignature {
  uploadUrl: string;
  apiKey: string;
  signature: string;
  /** Parámetros firmados que el navegador debe enviar tal cual junto al archivo. */
  params: Record<string, string>;
}

/** Firma los parámetros de subida (SHA-1 de los parámetros ordenados + API secret). */
export function createUploadSignature(target: UploadTarget): UploadSignature | null {
  const config = readConfig();
  if (!config) return null;

  const { folder, resource } = UPLOAD_TARGETS[target];
  const params: Record<string, string> = {
    folder,
    timestamp: String(Math.floor(Date.now() / 1000)),
    ...(resource === "image"
      ? { allowed_formats: ALLOWED_IMAGE_FORMATS }
      : // En "raw" el nombre público conserva la extensión (…/cv-xxxx.pdf).
        { use_filename: "true", unique_filename: "true" }),
  };
  const toSign = Object.keys(params)
    .sort()
    .map((key) => `${key}=${params[key]}`)
    .join("&");
  const signature = createHash("sha1").update(toSign + config.apiSecret).digest("hex");

  return {
    uploadUrl: `https://api.cloudinary.com/v1_1/${config.cloudName}/${resource}/upload`,
    apiKey: config.apiKey,
    signature,
    params,
  };
}
