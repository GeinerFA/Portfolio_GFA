import "server-only";

/**
 * Almacenamiento de imágenes.
 *
 * Hoy las imágenes se guardan como URL (pegadas en el admin). Para subir archivos con Vercel Blob:
 *   1. `npm install @vercel/blob` y crear un Blob Store en Vercel (agrega BLOB_READ_WRITE_TOKEN).
 *   2. Implementar `uploadImage` con `put()` de `@vercel/blob`:
 *        const { url } = await put(`portfolio/${file.name}`, file, { access: "public", addRandomSuffix: true });
 *        return url;
 *   3. Crear una Server Action (con requireAdmin) que reciba el File y llame a `uploadImage`.
 *   4. En `components/admin/fields.tsx`, agregar a `ImageUrlField` un botón de subida que llame a esa acción
 *      y escriba la URL devuelta en el input (el resto del formulario no cambia).
 */
export const isUploadEnabled = Boolean(process.env.BLOB_READ_WRITE_TOKEN);

// eslint-disable-next-line @typescript-eslint/no-unused-vars -- firma lista para la implementación con Vercel Blob
export async function uploadImage(file: File): Promise<string> {
  throw new Error("La subida de archivos aún no está configurada (Vercel Blob).");
}
