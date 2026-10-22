/**
 * Genera los íconos de la PWA y de iOS a partir del logo. Correr con: npm run pwa:icons
 *
 * - public/icons/icon-192.png, icon-512.png e icon-maskable-512.png (manifiesto).
 * - public/apple-touch-icon.png, -precomposed.png y -180x180.png: rutas fijas que iOS busca en la raíz.
 * - app/icon.png: favicon.
 * - lib/touch-icon.ts: el ícono de iOS incrustado como data URI. "Agregar a inicio" a veces no descarga
 *   el ícono enlazado y pone una letra en su lugar; incrustado no depende de la red.
 *
 * Todos salen sin transparencia (removeAlpha): iOS rellena el canal alfa con el color que le parece.
 * Al cambiar los íconos, sube ICON_VERSION en app/manifest.ts para que los navegadores no usen los viejos.
 */
import { mkdir, writeFile } from "node:fs/promises";
import sharp from "sharp";

const SOURCE = "Media/personal-logo-2.png";
const BACKGROUND = "#ffffff";

/** Logo recortado (sin el margen blanco del original) y con el fondo casi blanco llevado a blanco puro. */
const logo = await sharp(SOURCE)
  .flatten({ background: BACKGROUND })
  .linear(1.04, -4)
  .trim({ threshold: 20 })
  .toBuffer();

async function render(size: number, logoFraction: number) {
  const inner = Math.round(size * logoFraction);
  const resized = await sharp(logo).resize(inner, inner, { fit: "inside" }).toBuffer();
  return sharp({ create: { width: size, height: size, channels: 3, background: BACKGROUND } })
    .composite([{ input: resized, gravity: "center" }])
    .removeAlpha()
    .png({ compressionLevel: 9, palette: true, quality: 90 })
    .toBuffer();
}

await mkdir("public/icons", { recursive: true });

// En el maskable el logo ocupa el 60 % para que Android no lo recorte al aplicarle la máscara.
const files: [string, number, number][] = [
  ["public/icons/icon-192.png", 192, 0.82],
  ["public/icons/icon-512.png", 512, 0.82],
  ["public/icons/icon-maskable-512.png", 512, 0.6],
  ["app/icon.png", 512, 0.82],
];
for (const [path, size, fraction] of files) {
  await writeFile(path, await render(size, fraction));
  console.log(path);
}

const touch = await render(180, 0.82);
for (const path of ["public/apple-touch-icon.png", "public/apple-touch-icon-precomposed.png", "public/apple-touch-icon-180x180.png"]) {
  await writeFile(path, touch);
  console.log(path);
}

await writeFile(
  "lib/touch-icon.ts",
  `// Generado por scripts/pwa-icons.mts — no editar a mano.\n` +
    `/** Ícono de iOS (180×180, fondo blanco) incrustado como data URI. */\n` +
    `export const touchIcon = "data:image/png;base64,${touch.toString("base64")}";\n`,
);
console.log(`lib/touch-icon.ts (${(touch.length / 1024).toFixed(1)} KB)`);
