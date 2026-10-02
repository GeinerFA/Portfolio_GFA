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

export const UPLOAD_FOLDERS = {
  avatar: "portfolio/perfil",
  projects: "portfolio/proyectos",
} as const;
export type UploadFolder = keyof typeof UPLOAD_FOLDERS;

export const ALLOWED_FORMATS = "jpg,jpeg,png,webp,avif,gif";

export interface UploadSignature {
  uploadUrl: string;
  apiKey: string;
  timestamp: number;
  signature: string;
  folder: string;
  allowedFormats: string;
}

/** Firma los parámetros de subida (SHA-1 de los parámetros ordenados + API secret). */
export function createUploadSignature(folder: UploadFolder): UploadSignature | null {
  const config = readConfig();
  if (!config) return null;

  const timestamp = Math.floor(Date.now() / 1000);
  const params: Record<string, string | number> = {
    allowed_formats: ALLOWED_FORMATS,
    folder: UPLOAD_FOLDERS[folder],
    timestamp,
  };
  const toSign = Object.keys(params)
    .sort()
    .map((key) => `${key}=${params[key]}`)
    .join("&");
  const signature = createHash("sha1").update(toSign + config.apiSecret).digest("hex");

  return {
    uploadUrl: `https://api.cloudinary.com/v1_1/${config.cloudName}/image/upload`,
    apiKey: config.apiKey,
    timestamp,
    signature,
    folder: UPLOAD_FOLDERS[folder],
    allowedFormats: ALLOWED_FORMATS,
  };
}
